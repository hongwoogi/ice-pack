#!/usr/bin/env node
/**
 * 5학년 1학기 수학 전 차시 띵커벨 퀴즈 사전 생성
 * 결과: /home/ubuntu/ice_pack/data/quiz_cache.json
 * 실행: node generate_quizzes.js [--resume]
 *   --resume  이미 생성된 항목은 건너뜀 (기본값: resume 모드)
 */

const fs   = require('fs');
const http = require('http');

const CACHE_FILE = __dirname + '/data/quiz_cache.json';
const API_HOST   = 'localhost';
const API_PORT   = 3002;
const API_PATH   = '/tkbell/generate-quiz';

/* ── 전체 차시 목록 (mock.js 에서 추출) ── */
const UNITS = [
  { shortTitle: '자연수의 혼합 계산', lessons: [
    { id: 'l1_1', type: 'intro',    title: '단원 도입' },
    { id: 'l1_2', type: 'learn',    title: '덧셈과 뺄셈이 섞여 있는 식을 계산해 볼까요' },
    { id: 'l1_3', type: 'learn',    title: '곱셈과 나눗셈이 섞여 있는 식을 계산해 볼까요' },
    { id: 'l1_4', type: 'learn',    title: '덧셈, 뺄셈, 곱셈이 섞여 있는 식을 계산해 볼까요' },
    { id: 'l1_5', type: 'learn',    title: '덧셈, 뺄셈, 나눗셈이 섞여 있는 식을 계산해 볼까요' },
    { id: 'l1_6', type: 'learn',    title: '덧셈, 뺄셈, 곱셈, 나눗셈이 섞여 있는 식을 계산해 볼까요' },
    { id: 'l1_7', type: 'activity', title: '생각을 더하다 (나를 지켜주는 생존 가방)' },
    { id: 'l1_8', type: 'play',     title: '놀이를 더하다 (하나, 둘, 셋 빙고!)' },
    { id: 'l1_9', type: 'review',   title: '공부한 내용을 확인해요' },
  ]},
  { shortTitle: '약수와 배수', lessons: [
    { id: 'l2_1',  type: 'intro',    title: '단원 도입' },
    { id: 'l2_2',  type: 'learn',    title: '약수를 알아볼까요' },
    { id: 'l2_3',  type: 'learn',    title: '배수를 알아볼까요' },
    { id: 'l2_4',  type: 'learn',    title: '공약수와 최대공약수를 알아볼까요(1)' },
    { id: 'l2_5',  type: 'learn',    title: '공약수와 최대공약수를 알아볼까요(2)' },
    { id: 'l2_6',  type: 'learn',    title: '공배수와 최소공배수를 알아볼까요(1)' },
    { id: 'l2_7',  type: 'learn',    title: '공배수와 최소공배수를 알아볼까요(2)' },
    { id: 'l2_8',  type: 'activity', title: '생각을 더하다 (체육 대회에 어떻게 입장해야 할까요)' },
    { id: 'l2_9',  type: 'play',     title: '놀이를 더하다 (약수와 배수 이어달리기)' },
    { id: 'l2_10', type: 'review',   title: '공부한 내용을 확인해요' },
  ]},
  { shortTitle: '대응 관계', lessons: [
    { id: 'l3_1', type: 'intro',    title: '단원 도입' },
    { id: 'l3_2', type: 'learn',    title: '두 양 사이의 관계를 알아볼까요(1)' },
    { id: 'l3_3', type: 'learn',    title: '두 양 사이의 관계를 알아볼까요(2)' },
    { id: 'l3_4', type: 'learn',    title: '대응 관계를 식으로 나타내어 볼까요' },
    { id: 'l3_5', type: 'learn',    title: '생활 속에서 대응 관계를 찾아 식으로 나타내어 볼까요' },
    { id: 'l3_6', type: 'activity', title: '생각을 더하다 (소중한 물, 우리가 지켜요)' },
    { id: 'l3_7', type: 'play',     title: '놀이를 더하다 (자신만만 대응 관계)' },
    { id: 'l3_8', type: 'review',   title: '공부한 내용을 확인해요' },
  ]},
  { shortTitle: '약분과 통분', lessons: [
    { id: 'l4_1',  type: 'intro',    title: '단원 도입' },
    { id: 'l4_2',  type: 'learn',    title: '크기가 같은 분수를 알아볼까요' },
    { id: 'l4_3',  type: 'learn',    title: '크기가 같은 분수를 만들어 볼까요' },
    { id: 'l4_4',  type: 'learn',    title: '분수를 간단하게 나타내어 볼까요' },
    { id: 'l4_5',  type: 'learn',    title: '분모가 같은 분수로 나타내어 볼까요' },
    { id: 'l4_6',  type: 'learn',    title: '분수의 크기를 비교해 볼까요' },
    { id: 'l4_7',  type: 'learn',    title: '분수와 소수의 크기를 비교해 볼까요' },
    { id: 'l4_8',  type: 'activity', title: '생각을 더하다 (1/2을 기준으로 길이를 비교해 볼까요)' },
    { id: 'l4_9',  type: 'play',     title: '놀이를 더하다 (손가락 접어!)' },
    { id: 'l4_10', type: 'review',   title: '공부한 내용을 확인해요' },
  ]},
  { shortTitle: '분수의 덧셈과 뺄셈', lessons: [
    { id: 'l5_1',  type: 'intro',    title: '단원 도입' },
    { id: 'l5_2',  type: 'learn',    title: '진분수의 덧셈 — 합이 1보다 작은 경우' },
    { id: 'l5_3',  type: 'learn',    title: '진분수의 덧셈 — 합이 1보다 큰 경우' },
    { id: 'l5_4',  type: 'learn',    title: '대분수의 덧셈을 해 볼까요' },
    { id: 'l5_5',  type: 'learn',    title: '진분수의 뺄셈을 해 볼까요' },
    { id: 'l5_6',  type: 'learn',    title: '대분수의 뺄셈 — 분수 부분끼리 뺄 수 있는 경우' },
    { id: 'l5_7',  type: 'learn',    title: '대분수의 뺄셈 — 분수 부분끼리 뺄 수 없는 경우' },
    { id: 'l5_8',  type: 'activity', title: '생각을 더하다 (음표로 분수의 덧셈을 해 볼까요)' },
    { id: 'l5_9',  type: 'play',     title: '놀이를 더하다 (신나는 분수 윷놀이)' },
    { id: 'l5_10', type: 'review',   title: '공부한 내용을 확인해요' },
  ]},
  { shortTitle: '다각형의 둘레와 넓이', lessons: [
    { id: 'l6_1',  type: 'intro',    title: '단원 도입' },
    { id: 'l6_2',  type: 'learn',    title: '정다각형의 둘레를 구해 볼까요' },
    { id: 'l6_3',  type: 'learn',    title: '사각형의 둘레를 구해 볼까요' },
    { id: 'l6_4',  type: 'learn',    title: '1㎠를 알아볼까요' },
    { id: 'l6_5',  type: 'learn',    title: '직사각형의 넓이를 구해 볼까요' },
    { id: 'l6_6',  type: 'learn',    title: '1㎠보다 더 큰 넓이의 단위를 알아볼까요(1)' },
    { id: 'l6_7',  type: 'learn',    title: '1㎠보다 더 큰 넓이의 단위를 알아볼까요(2)' },
    { id: 'l6_8',  type: 'learn',    title: '평행사변형의 넓이를 구해 볼까요(1)' },
    { id: 'l6_9',  type: 'learn',    title: '평행사변형의 넓이를 구해 볼까요(2)' },
    { id: 'l6_10', type: 'learn',    title: '삼각형의 넓이를 구해 볼까요(1)' },
    { id: 'l6_11', type: 'learn',    title: '삼각형의 넓이를 구해 볼까요(2)' },
    { id: 'l6_12', type: 'learn',    title: '마름모의 넓이를 구해 볼까요' },
    { id: 'l6_13', type: 'learn',    title: '사다리꼴의 넓이를 구해 볼까요(1)' },
    { id: 'l6_14', type: 'learn',    title: '사다리꼴의 넓이를 구해 볼까요(2)' },
    { id: 'l6_15', type: 'activity', title: '생각을 더하다 (공원을 만들어요)' },
    { id: 'l6_16', type: 'play',     title: '놀이를 더하다 (직사각형 보물 탐험대)' },
    { id: 'l6_17', type: 'review',   title: '공부한 내용을 확인해요' },
  ]},
  { shortTitle: '창의 프로젝트', lessons: [
    { id: 'l7_1', type: 'activity', title: '준비 착착: 농부의 고민을 알아보아요' },
    { id: 'l7_2', type: 'activity', title: '생각 쑥쑥: 밭을 탐구해요' },
    { id: 'l7_3', type: 'activity', title: '해결 팡팡: 농부에게 편지를 써 보아요' },
    { id: 'l7_4', type: 'play',     title: '공유 톡톡: 농부에게 쓴 편지를 소개해요' },
  ]},
];

/* 퀴즈 토픽 결정 (mock.js buildThinkbell 로직과 동일) */
function getQuizTopic(lesson, unitTitle) {
  if (lesson.type === 'review') return unitTitle;
  return lesson.title;
}

/* 전체 차시 목록 + 토픽 */
const ALL = [];
UNITS.forEach(unit => {
  unit.lessons.forEach(lesson => {
    ALL.push({ id: lesson.id, type: lesson.type, topic: getQuizTopic(lesson, unit.shortTitle) });
  });
});

/* 문항 유형 레이블 */
const TYPE_LABEL = {
  'multiple-choice': '선택형',
  'ox':              'OX',
  'short-answer':    '단답형',
  'fill-in-blank':   '빈칸',
  'essay':           '서술형',
  'ordering':        '순서형',
  'line-match':      '선잇기',
};

function typeDistSummary(questions) {
  const counts = {};
  questions.forEach(q => {
    const t = q.type || 'multiple-choice';
    counts[t] = (counts[t] || 0) + 1;
  });
  return Object.entries(counts)
    .map(([t, n]) => `${TYPE_LABEL[t] || t}×${n}`)
    .join(', ');
}

/* ── API 호출 ── */
function generateQuiz(topic) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({ topic, count: 10 });
    const req = http.request({
      hostname: API_HOST, port: API_PORT, path: API_PATH, method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) },
    }, res => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => {
        try { resolve(JSON.parse(data)); }
        catch(e) { reject(new Error('JSON parse error: ' + data.slice(0, 100))); }
      });
    });
    req.on('error', reject);
    req.setTimeout(180000, () => { req.destroy(new Error('timeout')); });
    req.write(body);
    req.end();
  });
}

/* ── 메인 ── */
(async () => {
  /* 기존 캐시 로드 */
  let cache = {};
  if (fs.existsSync(CACHE_FILE)) {
    try { cache = JSON.parse(fs.readFileSync(CACHE_FILE, 'utf8')); }
    catch(e) { console.warn('캐시 파일 손상, 초기화합니다.'); }
  }

  const total   = ALL.length;
  const skip    = ALL.filter(l => cache[l.id]).length;
  const pending = ALL.filter(l => !cache[l.id]);

  console.log(`\n5학년 1학기 수학 띵커벨 퀴즈 사전 생성`);
  console.log(`전체 ${total}차시 | 완료 ${skip}개 | 남은 ${pending.length}개\n`);

  if (pending.length === 0) {
    console.log('모든 퀴즈가 이미 생성됐습니다!');
    process.exit(0);
  }

  for (let i = 0; i < pending.length; i++) {
    const lesson = pending[i];
    const label  = `[${i + 1}/${pending.length}] ${lesson.id} (${lesson.type})`;
    process.stdout.write(`${label} "${lesson.topic.slice(0, 30)}" ... `);

    let attempts = 0;
    let success  = false;
    while (attempts < 3 && !success) {
      attempts++;
      try {
        const data = await generateQuiz(lesson.topic);
        if (!data.success || !data.quizUrl) throw new Error(data.error || '응답 오류');
        const questions = data.questions || [];
        const typeDist  = questions.length ? typeDistSummary(questions) : '유형정보 없음';
        cache[lesson.id] = {
          quizUrl:   data.quizUrl,
          playUrl:   data.playUrl,
          quizIdx:   String(data.quizIdx),
          typesDist: typeDist,
          questions: questions.map(q => ({ type: q.type || 'multiple-choice', q: q.q })),
        };
        fs.writeFileSync(CACHE_FILE, JSON.stringify(cache, null, 2), 'utf8');
        console.log(`완료 (quizIdx: ${data.quizIdx}) [${typeDist}]`);
        success = true;
      } catch (e) {
        process.stdout.write(`실패(${attempts}) `);
        if (attempts < 3) await new Promise(r => setTimeout(r, 5000));
        else console.log(`→ 건너뜀: ${e.message}`);
      }
    }

    /* 요청 간 간격 (과부하 방지) */
    if (i < pending.length - 1) await new Promise(r => setTimeout(r, 2000));
  }

  const done = Object.keys(cache).length;
  console.log(`\n완료! ${done}/${total}개 생성됨 → ${CACHE_FILE}`);
})();
