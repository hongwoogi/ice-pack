/**
 * tkbell_make_quiz.js
 * 지원 유형: Q1(선택형), Q2(OX), Q3(단답형), Q4(서술형), Q5(빈칸채우기), Q7(순서형), Q9(선잇기형)
 *
 * questions 항목 형식:
 *   선택형:   { type:'multiple-choice', q, answers:[], correct:0 }
 *   OX형:     { type:'ox',             q, answer:'O'|'X' }
 *   단답형:   { type:'short-answer',   q, acceptedAnswers:[] }
 *   빈칸:     { type:'fill-in-blank',  q, prompt, acceptedAnswers:[] }
 *   서술형:   { type:'essay',          q, exampleAnswer:'' }
 *   순서형:   { type:'ordering',       q, items:[] }
 *   선잇기형: { type:'line-match',     q, pairs:[{left,right},...] }
 *   (type 생략 시 multiple-choice 로 처리)
 */
const { chromium } = require('playwright');

const QCD = {
  'multiple-choice': 'Q1',
  'ox':              'Q2',
  'short-answer':    'Q3',
  'essay':           'Q4',
  'fill-in-blank':   'Q5',
  'ordering':        'Q7',
  'line-match':      'Q9',
};

function getType(q) {
  return q.type || 'multiple-choice';
}

async function waitForSave(page, rowSel) {
  const responsePromise = page.waitForResponse(
    r => r.url().includes('insertQuestionAndAnswer.json') && r.request().method() === 'POST',
    { timeout: 60000 }
  );
  await page.locator(`${rowSel} .saveQuestionBtn`).click();
  const res  = await responsePromise;
  const data = await res.json();
  if (!data.success) throw new Error(`문제 저장 실패: ${JSON.stringify(data)}`);
  await page.waitForTimeout(2000);
  return data;
}

async function waitForSaveByEval(page, rowSel) {
  const responsePromise = page.waitForResponse(
    r => r.url().includes('insertQuestionAndAnswer.json') && r.request().method() === 'POST',
    { timeout: 60000 }
  );
  await page.evaluate(sel => {
    window.quizCategory = 'QUIZ';
    saveQuestion(window.jQuery(sel));
  }, rowSel);
  const res  = await responsePromise;
  const data = await res.json();
  if (!data.success) throw new Error(`문제 저장 실패: ${JSON.stringify(data)}`);
  await page.waitForTimeout(2000);
  return data;
}

async function setQuestionType(page, rowSel, qcd) {
  await page.evaluate(({ sel, qcd }) => {
    window.quizCategory = 'QUIZ';
    const hidden = document.querySelector('#quizForm input[name="quizCategory"]');
    if (hidden) hidden.value = 'QUIZ';
    const row = document.querySelector(sel);
    if (!row) throw new Error('Row not found: ' + sel);
    row.querySelector('fieldset.select-type').innerHTML =
      `<label><input type="radio" name="questionCd" value="${qcd}" checked>${qcd}</label>`;
    getQuestionWriteRowFormAjax(window.jQuery(sel), true);
  }, { sel: rowSel, qcd });
  await page.waitForTimeout(2200);
}

async function fillMultipleChoice(page, rowSel, q) {
  const row = page.locator(rowSel);
  await row.locator('textarea[name="questionTitle"]').fill(q.q);
  for (let i = 0; i < q.answers.length; i++) {
    const ta = row.locator('textarea[name="answerTitleArray"]').nth(i);
    if (await ta.count()) await ta.fill(q.answers[i]);
  }
  await row.locator('input[name="rightAnswerCheck"]').nth(q.correct ?? 0).check({ force: true });
  return waitForSave(page, rowSel);
}

async function fillOX(page, rowSel, q) {
  const row = page.locator(rowSel);
  await row.locator('textarea[name="questionTitle"]').fill(q.q);
  const correctIdx = (q.answer === 'X' || q.correct === 1) ? 1 : 0;
  await row.locator('input[name="rightAnswerCheck"]').nth(correctIdx).check({ force: true });
  return waitForSaveByEval(page, rowSel);
}

async function fillShortAnswer(page, rowSel, q) {
  const row = page.locator(rowSel);
  await row.locator('textarea[name="questionTitle"]').fill(q.q);
  const answers = q.acceptedAnswers || q.answers || [];
  await page.evaluate(({ sel, answers }) => {
    const $row = window.jQuery(sel);
    const ids   = ['#answerValueQ3_1', '#answerValueQ3_2', '#answerValueQ3_3'];
    answers.slice(0, 3).forEach((ans, i) => {
      const $inp = $row.find(ids[i]);
      if ($inp.length) $inp.tagEditor('addTag', ans);
    });
  }, { sel: rowSel, answers });
  await page.waitForTimeout(1200);
  return waitForSaveByEval(page, rowSel);
}

async function fillBlank(page, rowSel, q) {
  const row = page.locator(rowSel);
  await row.locator('textarea[name="questionTitle"]').fill(q.q);
  await row.locator('textarea[name="questionDesc"]').fill(q.prompt || '');
  const answers = q.acceptedAnswers || q.answers || [];
  await page.evaluate(({ answers }) => {
    const $inp = window.jQuery('input[name="answerValueQ5"]');
    if ($inp.length) answers.slice(0, 5).forEach(a => $inp.tagEditor('addTag', a));
  }, { answers });
  await page.waitForTimeout(1200);
  return waitForSaveByEval(page, rowSel);
}

/* Q4: 서술형 — 문제 + 예시 답안 */
async function fillEssay(page, rowSel, q) {
  const row = page.locator(rowSel);
  await row.locator('textarea[name="questionTitle"]').fill(q.q);
  const example = q.exampleAnswer || q.example || '';
  if (example) {
    await row.locator('textarea[name="answerValueArray"]').fill(example);
  }
  return waitForSaveByEval(page, rowSel);
}

/* Q7: 순서형 — 항목을 올바른 순서로 입력, answerSeqArray에 순서값 지정 */
async function fillOrdering(page, rowSel, q) {
  const row = page.locator(rowSel);
  await row.locator('textarea[name="questionTitle"]').fill(q.q);
  const items = q.items || [];
  for (let i = 0; i < items.length; i++) {
    const ta = row.locator('textarea[name="answerTitleArray"]').nth(i);
    if (await ta.count()) await ta.fill(items[i]);
  }
  // answerSeqArray: 각 항목의 정답 순서 (입력 순서 그대로 1,2,3...)
  await page.evaluate(({ sel, count }) => {
    const row = document.querySelector(sel);
    const seqInputs = row.querySelectorAll('input[name="answerSeqArray"]');
    seqInputs.forEach((inp, i) => { if (i < count) inp.value = String(i + 1); });
  }, { sel: rowSel, count: items.length });
  await page.waitForTimeout(800);
  return waitForSaveByEval(page, rowSel);
}

/* Q9: 선잇기형 — 좌/우 항목 쌍 입력, lineAnswerSeqArray로 연결 */
async function fillLineMatch(page, rowSel, q) {
  const row = page.locator(rowSel);
  await row.locator('textarea[name="questionTitle"]').fill(q.q);
  const pairs = q.pairs || [];
  // 좌측 항목 입력
  for (let i = 0; i < pairs.length; i++) {
    const ta = row.locator('textarea[name="answerLeftTitleArray"]').nth(i);
    if (await ta.count()) await ta.fill(pairs[i].left);
  }
  // 우측 항목 입력
  for (let i = 0; i < pairs.length; i++) {
    const ta = row.locator('textarea[name="answerRightTitleArray"]').nth(i);
    if (await ta.count()) await ta.fill(pairs[i].right);
  }
  // lineAnswerSeqArray: 좌측[i]가 연결되는 우측 값(A, B, C...)
  // pairs 순서대로 1:1 연결 (left[0]→right[0]=A, left[1]→right[1]=B ...)
  const rightValues = ['A','B','C','D','E'];
  await page.evaluate(({ sel, count, rightValues }) => {
    const row = document.querySelector(sel);
    const lineInputs = row.querySelectorAll('input[name="lineAnswerSeqArray"]');
    lineInputs.forEach((inp, i) => { if (i < count) inp.value = rightValues[i]; });
  }, { sel: rowSel, count: pairs.length, rightValues });
  await page.waitForTimeout(800);
  return waitForSaveByEval(page, rowSel);
}

async function createQuiz({ title, questions }) {
  if (!questions || questions.length === 0) throw new Error('questions[] is required');

  const browser = await chromium.launch({
    executablePath: '/snap/bin/chromium',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
  });

  try {
    const ctx  = await browser.newContext({ storageState: '/home/ubuntu/playwright-server/tkbell_auth.json' });
    const page = await ctx.newPage();
    page.setDefaultTimeout(30000);

    let quizIdx = null;
    page.on('response', async res => {
      if (res.url().includes('insertQuizContent.json') && res.request().method() === 'POST') {
        try { const j = await res.json(); if (j?.quizVO?.quizIdx) quizIdx = j.quizVO.quizIdx; } catch(_) {}
      }
    });

    // 퀴즈 편집 화면 진입
    await page.goto('https://www.tkbell.co.kr/user/content/make/quizUserMakeIntro.do', { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForTimeout(2000);
    await page.evaluate(() => goMakeQuizContentByIntro('Q1'));
    await page.waitForURL('**/quizUserMakeContent.do', { timeout: 60000 });
    await page.waitForTimeout(3000);

    await page.locator('#quizTitle').fill(title);

    // 공유/학교급/교육과정 설정
    await page.evaluate(() => {
      const jq = window.jQuery;
      window.quizCategory = 'QUIZ';
      const hidden = document.querySelector('#quizForm input[name="quizCategory"]');
      if (hidden) hidden.value = 'QUIZ';
      const share = document.querySelector('input[name="sharedType"][value="A"]');
      if (share) { share.checked = true; jq(share).trigger('change'); try { jq(share).checkboxradio('refresh'); } catch(_){} }
      const school = document.querySelector('input[name="schoolType"][value="MD"]');
      if (school) { school.checked = true; jq(school).trigger('change'); try { jq(school).checkboxradio('refresh'); } catch(_){} }
      const target = document.querySelector('#curriculumCd li.md[data-val="TEC"]') || document.querySelector('#curriculumCd li[data-val="TEC"]');
      if (target) { target.classList.add('active'); target.querySelector('a')?.click(); }
      selectChasiConfirm();
    });
    await page.waitForTimeout(2500);

    // 문제 작성
    for (let i = 0; i < questions.length; i++) {
      const rawQ = questions[i];
      const type = getType(rawQ);
      const qcd  = QCD[type] || 'Q1';

      // 첫 문제는 행이 이미 있음, 이후는 행 추가
      if (i > 0) {
        await page.evaluate(() => addQuestionRow());
        await page.waitForTimeout(1200);
      }

      const rowSel = `#questionAllDiv .questionRow[data-row-no="${i + 1}"]`;
      await setQuestionType(page, rowSel, qcd);

      console.log(`[${i+1}/${questions.length}] type=${type} q=${rawQ.q.slice(0, 30)}`);

      if      (type === 'multiple-choice') await fillMultipleChoice(page, rowSel, rawQ);
      else if (type === 'ox')              await fillOX(page, rowSel, rawQ);
      else if (type === 'short-answer')    await fillShortAnswer(page, rowSel, rawQ);
      else if (type === 'fill-in-blank')   await fillBlank(page, rowSel, rawQ);
      else if (type === 'essay')           await fillEssay(page, rowSel, rawQ);
      else if (type === 'ordering')        await fillOrdering(page, rowSel, rawQ);
      else if (type === 'line-match')      await fillLineMatch(page, rowSel, rawQ);
      else                                 await fillMultipleChoice(page, rowSel, rawQ); // fallback

      await page.waitForTimeout(500);
    }

    // 퀴즈 저장 완료
    await page.locator('#saveQuizBtn').click();
    await page.waitForURL('**/quizUserLibraryDetail.do**', { timeout: 60000 });
    await page.waitForTimeout(1500);

    if (!quizIdx) {
      const m = page.url().match(/quizIdx=(\d+)/);
      if (m) quizIdx = m[1];
    }
    if (!quizIdx) throw new Error('quizIdx를 가져오지 못했습니다');

    console.log(`Quiz saved: quizIdx=${quizIdx}`);
    const quizUrl = `https://www.tkbell.co.kr/user/library/quizUserLibraryDetail.do?quizIdx=${quizIdx}`;
    const playUrl = `https://www.tkbell.co.kr/user/play/quiz/quizPlayStart.do?quizIdx=${quizIdx}`;
    return { success: true, quizIdx, quizUrl, playUrl, questionCount: questions.length };
  } finally {
    await browser.close();
  }
}

module.exports = { createQuiz };
