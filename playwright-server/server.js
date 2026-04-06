const express = require('express');
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');
const { execFile } = require('child_process');
const { createQuiz } = require('./tkbell_make_quiz');

/* 세션 만료 여부 판단 */
function isSessionError(err) {
  return /goMakeQuizContentByIntro|loginTeacher|로그인|session|unauthorized/i.test(err.message);
}

/* 띵커벨 재로그인 */
function tkbellRelogin() {
  return new Promise((resolve, reject) => {
    const env = Object.assign({}, process.env);
    // .env 파일에서 자격증명 직접 로드
    try {
      require('fs').readFileSync('/home/ubuntu/skills/tkbell-quiz/.env', 'utf8')
        .split('\n').forEach(line => {
          const [k, v] = line.split('=');
          if (k && v) env[k.trim()] = v.trim();
        });
    } catch (_) {}
    execFile(
      'node',
      ['/home/ubuntu/skills/tkbell-quiz/scripts/tkbell-login.js'],
      { timeout: 90000, env },
      (err, stdout, stderr) => {
        if (err) return reject(new Error('재로그인 실패: ' + (stderr || err.message)));
        try {
          const result = JSON.parse(stdout);
          if (!result.success) return reject(new Error('재로그인 실패: ' + stdout));
          // 새 세션을 playwright-server 경로에도 복사
          const fs = require('fs');
          fs.copyFileSync(
            '/home/ubuntu/skills/tkbell-quiz/data/tkbell-auth.json',
            '/home/ubuntu/playwright-server/tkbell_auth.json'
          );
          console.log('[auth] 재로그인 성공, 세션 갱신 완료');
          resolve();
        } catch (e) {
          reject(new Error('재로그인 파싱 실패: ' + stdout));
        }
      }
    );
  });
}

/* createQuiz 래퍼 — 세션 오류 시 1회 재로그인 후 재시도 */
async function createQuizWithRetry(payload) {
  try {
    return await createQuiz(payload);
  } catch (e) {
    if (!isSessionError(e)) throw e;
    console.log('[auth] 세션 만료 감지, 재로그인 중...');
    await tkbellRelogin();
    return await createQuiz(payload);
  }
}

/* Use claude CLI (Claude Code) to generate content — no separate API key needed */
function claudeAsk(prompt) {
  return new Promise((resolve, reject) => {
    execFile(
      '/home/ubuntu/.local/bin/claude',
      ['-p', prompt, '--output-format', 'text'],
      { timeout: 90000, maxBuffer: 1024 * 1024 },
      (err, stdout, stderr) => {
        if (err) return reject(new Error(stderr || err.message));
        resolve(stdout.trim());
      }
    );
  });
}

const app = express();
const port = 3002;
let isRunning = false;

app.use(express.json());
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});

/* ── 퀴즈 생성 진행 상황 ──────────────────────────────────────── */
let quizBusy = false;
let quizStep  = { step: 0, label: '', topic: '' };
function setStep(step, label) {
  quizStep = { step, label, topic: quizStep.topic };
  console.log(`[step ${step}] ${label}`);
}

app.get('/tkbell/quiz-status', (req, res) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.json({ busy: quizBusy, ...quizStep });
});

/* ── POST /tkbell/create-quiz ──────────────────────────────────── */
app.post('/tkbell/create-quiz', async (req, res) => {
  if (quizBusy) return res.status(429).json({ success: false, error: '퀴즈 생성 중입니다. 잠시 후 시도하세요.' });

  const body = req.body || {};
  const { title } = body;

  // Normalise: accept either questions[] or legacy { question, answers, correctIndex }
  let questions = body.questions;
  if (!questions && body.question && Array.isArray(body.answers)) {
    questions = [{ q: body.question, answers: body.answers, correct: body.correctIndex ?? 0 }];
  }

  if (!title || !Array.isArray(questions) || questions.length === 0) {
    return res.status(400).json({ success: false, error: 'title + questions[] (또는 question/answers) 필수' });
  }

  quizBusy = true;
  try {
    const result = await createQuizWithRetry({ title, questions });
    res.json(result);
  } catch (e) {
    console.error('[quiz]', e.message);
    res.status(500).json({ success: false, error: e.message });
  } finally {
    quizBusy = false;
  }
});

/* ── POST /tkbell/generate-quiz ────────────────────────────────── */
/* Body: { topic: string, count?: number (default 10) }
   1. Claude generates questions
   2. Creates quiz on tkbell
   3. Returns quiz URL + generated questions */
app.post('/tkbell/generate-quiz', async (req, res) => {
  if (quizBusy) return res.status(429).json({ success: false, error: '퀴즈 생성 중입니다. 잠시 후 시도하세요.' });

  const { topic, count = 10 } = req.body || {};
  if (!topic || typeof topic !== 'string' || !topic.trim()) {
    return res.status(400).json({ success: false, error: 'topic 필수' });
  }

  quizBusy = true;
  quizStep.topic = topic.trim();
  try {
    // Step 1: Generate questions via Claude CLI
    setStep(1, `Claude AI가 "${topic.trim()}" 문제 ${count}개를 생성하고 있어요…`);
    const prompt = `너는 한국 초등학교 교사를 위한 퀴즈 생성 전문가야.
주제: "${topic.trim()}"
위 주제로 총 ${count}개의 문제를 만들어줘. 아래 7가지 유형을 골고루 섞어서 만들어:

유형 분배 (${count}문항 기준):
- multiple-choice(선택형 4지선다): ${Math.ceil(count * 0.3)}개
- ox(O/X 퀴즈): ${Math.round(count * 0.15)}개
- short-answer(단답형): ${Math.round(count * 0.15)}개
- fill-in-blank(빈칸채우기): ${Math.round(count * 0.1)}개
- essay(서술형): ${Math.round(count * 0.1)}개
- ordering(순서형): ${Math.round(count * 0.1)}개
- line-match(선잇기형): ${Math.floor(count * 0.1)}개

반드시 아래 JSON 배열 형식으로만 응답해. 다른 텍스트, 설명, 마크다운 코드블록은 절대 포함하지 마. 순수 JSON 배열만.

[
  {"type":"multiple-choice","q":"문제","answers":["보기1","보기2","보기3","보기4"],"correct":0},
  {"type":"ox","q":"문제","answer":"O"},
  {"type":"short-answer","q":"문제","acceptedAnswers":["정답1","정답2"]},
  {"type":"fill-in-blank","q":"다음 빈칸에 알맞은 말을 쓰시오.","prompt":"빈칸(___)이 포함된 완전한 문장","acceptedAnswers":["정답"]},
  {"type":"essay","q":"다음에 대해 설명하시오.","exampleAnswer":"예시 답안 텍스트"},
  {"type":"ordering","q":"다음을 올바른 순서로 배열하시오.","items":["첫번째","두번째","세번째","네번째"]},
  {"type":"line-match","q":"알맞게 연결하시오.","pairs":[{"left":"왼쪽1","right":"오른쪽1"},{"left":"왼쪽2","right":"오른쪽2"},{"left":"왼쪽3","right":"오른쪽3"}]}
]

규칙:
- 문제는 초등학교 수준으로 명확하고 교육적으로 의미 있어야 함
- multiple-choice: 보기 4개, correct는 0~3 인덱스, 오답도 그럴듯하게
- ox: answer는 반드시 "O" 또는 "X"
- short-answer: acceptedAnswers에 가능한 정답 모두 포함 (유사 표현 포함)
- fill-in-blank: prompt는 빈칸(___)이 포함된 완전한 문장, acceptedAnswers에 정답 포함
- essay: exampleAnswer에 모범 답안 제공 (결과에 반영 안 됨, 학생 참고용)
- ordering: items 배열이 정답 순서, 3~5개 항목
- line-match: pairs는 3~4쌍, 좌우 항목이 서로 대응되는 내용`;

    const raw = await claudeAsk(prompt);
    const jsonStr = raw.replace(/^```(?:json)?\n?/m, '').replace(/\n?```$/m, '').trim();
    const questions = JSON.parse(jsonStr);

    if (!Array.isArray(questions) || questions.length === 0) {
      throw new Error('Claude가 유효한 문항 목록을 반환하지 않았습니다.');
    }

    setStep(2, `문제 ${questions.length}개 완성! 띵커벨에 퀴즈를 등록하는 중…`);

    // Step 2: Create quiz on tkbell
    const title = `${topic.trim()} 퀴즈`;
    const result = await createQuizWithRetry({ title, questions });
    setStep(3, '퀴즈 생성 완료!');

    res.json({
      ...result,
      topic: topic.trim(),
      questions,
    });
  } catch (e) {
    console.error('[generate-quiz]', e.message);
    setStep(0, '');
    res.status(500).json({ success: false, error: e.message });
  } finally {
    quizBusy = false;
  }
});

// 로그 타임스탬프 추가
const originalLog = console.log;
console.log = (...args) => {
  const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);
  originalLog(`[${timestamp}]`, ...args);
};

app.get('/run', async (req, res) => {
  if (isRunning) {
    return res.status(429).json({ success: false, message: '이미 실행 중입니다.' });
  }

  isRunning = true;
  res.json({ success: true, message: '작업 시작됨. /screenshots 에서 확인하세요.' });

  (async () => {
    const now = new Date();
    now.setHours(now.getHours() + 9);
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    const twoDaysAgo = new Date(now);
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 1);

    const yesterdayStr = yesterday.toISOString().split('T')[0];
    const twoDaysAgoStr = twoDaysAgo.toISOString().split('T')[0];

    const keywords = ['아이스크림', '띵커벨', '수보탬', '교과서'];

    const browser = await chromium.launch({
      executablePath: '/snap/bin/chromium',
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const context = await browser.newContext({ storageState: 'auth.json' });
    const page = await context.newPage();

    try {
      for (const keyword of keywords) {
        console.log(`\n🔍 키워드 "${keyword}" 검색 시작`);

        const encoded = encodeURIComponent(keyword);
        const url = `https://indischool.com/tweets/search?tweet_query=${encoded}`;
        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });

        console.log(`🌐 현재 페이지 URL: ${page.url()}`);
        console.log(`📄 페이지 내용 요약:`);
        console.log(await page.content());

        await page.waitForTimeout(2000);

        console.log(`▶ 키워드 "${keyword}" 검색 페이지 접속 완료`);
        let index = 1;

        while (true) {
          const wrapperSelector = `div.mb-4:nth-child(${index})`;
          const block = await page.$(wrapperSelector);
          if (!block) {
            console.log(`❌ ${keyword} - ${index}번째 블록 없음, 루프 종료`);
            break;
          }

          const aTag = await page.$(`${wrapperSelector} > header:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > a:nth-child(1)`);
          const titleValue = aTag ? await aTag.getAttribute('title') : null;

          if (!titleValue) {
            console.log(`⚠️  ${keyword} - ${index}번째 블록 title 없음`);
            index++;
            continue;
          }

          console.log(`ℹ️  ${keyword} - ${index}번째 블록 title: ${titleValue}`);

          const titleDate = titleValue.split(' ')[0];
          if (titleDate === yesterdayStr) {
            await block.scrollIntoViewIfNeeded();
            await page.waitForTimeout(300);

            const box = await block.boundingBox();
            if (box && box.width > 0 && box.height > 0) {
              const safeTitle = titleValue.replace(/[: ]/g, '-');
              const safeKeyword = keyword.replace(/[^a-zA-Z0-9가-힣]/g, '');
              const screenshotPath = path.join(__dirname, `screenshot-${safeKeyword}-${safeTitle}.png`);

              await page.screenshot({ path: screenshotPath, clip: box });
              console.log(`📸  저장됨: ${screenshotPath}`);
            } else {
              console.log(`⚠️  ${keyword} - ${index}번째 블록 boundingBox 없음`);
            }
          } else if (titleDate <= twoDaysAgoStr) {
            console.log(`⏹️  ${keyword} - 오래된 날짜 (${titleDate}), 중단`);
            break;
          }

          index++;
        }
      }
    } catch (err) {
      console.error('[ERROR]', err);
    } finally {
      await browser.close();
      isRunning = false;
      console.log('[CLEANUP] 브라우저 종료 및 상태 초기화');
    }
  })();
});

app.get('/screenshots', (req, res) => {
  const files = fs.readdirSync(__dirname).filter(f => f.startsWith('screenshot-') && f.endsWith('.png'));
  res.json(files);
});

app.listen(port, '0.0.0.0', () => {
  console.log(`✅ Playwright 서버 실행 중: http://localhost:${port}`);
});
