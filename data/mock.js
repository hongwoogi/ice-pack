'use strict';

/* ═══════════════════════════════════════════════════════════
   아이스팩 — 5학년 1학기 수학 진도표 기반 목업 데이터
   출처: (수학)5학년 1학기_진도표(나이스 업로드용).xlsx
   ═══════════════════════════════════════════════════════════ */

window.MOCK = {};

/* ── 단원별 색상 ─────────────────────────────────────────── */
const UNIT_COLORS = ['#228be6','#2f9e44','#e67700','#9c36b5','#c92a2a','#0c8599','#495057'];

/* ── 차시 유형별 추천 콘텐츠 생성 ─────────────────────────── */
function buildMaterials(lesson, unitTitle) {
  const t = lesson.type;
  const topic = lesson.title;
  const pages = lesson.pages;

  const textbook = {
    type: 'textbook', icon: 'menu_book',
    title: `교과서 ${pages}쪽`,
    sub: '수학 5-1 | PDF 바로보기',
    url: `https://www.textbook.or.kr/`,
  };

  if (t === 'intro') return [
    textbook,
    { type: 'video', icon: 'play_circle', title: `[단원 개관] ${unitTitle}`, sub: '아이스크림 강의 · 5분', url: '#' },
    { type: 'slide', icon: 'slideshow', title: '단원 도입 슬라이드', sub: 'PPT · 아이스크림 자료실', url: '#' },
  ];

  if (t === 'learn') return [
    textbook,
    { type: 'video', icon: 'play_circle', title: `[개념] ${topic.replace('볼까요','').trim()}`, sub: '아이스크림 강의 · 8분', url: '#' },
    { type: 'slide', icon: 'slideshow', title: '수업 슬라이드', sub: 'PPT · 아이스크림 자료실', url: '#' },
    { type: 'worksheet', icon: 'description', title: '개념 확인 활동지', sub: 'PDF · A4 1장', url: '#' },
  ];

  if (t === 'activity') return [
    textbook,
    { type: 'slide', icon: 'slideshow', title: '창의·사고력 활동 슬라이드', sub: 'PPT · 아이스크림 자료실', url: '#' },
    { type: 'worksheet', icon: 'description', title: '탐구 활동지', sub: 'PDF · A4 2장', url: '#' },
  ];

  if (t === 'play') return [
    textbook,
    { type: 'slide', icon: 'slideshow', title: '놀이 활동 안내', sub: 'PPT · 아이스크림 자료실', url: '#' },
    { type: 'worksheet', icon: 'description', title: '게임 활동지', sub: 'PDF · 모둠용', url: '#' },
  ];

  if (t === 'review') return [
    textbook,
    { type: 'video', icon: 'play_circle', title: `[정리] ${unitTitle} 핵심 요약`, sub: '아이스크림 강의 · 6분', url: '#' },
    { type: 'worksheet', icon: 'description', title: '단원 평가 문제지', sub: 'PDF · A4 2장', url: '#' },
  ];

  return [textbook];
}

function buildThinkbell(lesson) {
  const t = lesson.type;
  if (t === 'intro' || t === 'play') {
    return {
      board: { title: `${lesson.title} — 모둠 생각 나누기`, url: 'https://www.tkbell.co.kr' },
      quiz: null,
    };
  }
  if (t === 'review') {
    return {
      board: { title: '단원 마무리 보드', url: 'https://www.tkbell.co.kr' },
      quiz: { title: `${lesson.unitTitle} 단원 평가 퀴즈`, quizTopic: `${lesson.unitTitle}` },
    };
  }
  return {
    board: { title: `${lesson.title.replace('볼까요','').trim()} 개념 정리 보드`, url: 'https://www.tkbell.co.kr' },
    quiz: { title: `${lesson.title.replace('볼까요','').trim()} 퀴즈`, quizTopic: lesson.title },
  };
}

function buildPackage(lesson, unit) {
  const materials = buildMaterials(lesson, unit.shortTitle);
  const thinkbell = buildThinkbell({ ...lesson, unitTitle: unit.shortTitle });
  const adoptRates = { intro: 62, learn: 88, activity: 74, play: 70, review: 82 };
  const reasons = {
    intro: '단원 시작 전 학습 동기를 높이는 도입 자료를 준비했어요.',
    learn: '개념 이해를 돕는 강의 영상과 확인 활동지를 구성했어요.',
    activity: '창의적 사고를 키우는 탐구 활동 자료를 준비했어요.',
    play: '놀이를 통해 개념을 다지는 게임형 자료를 구성했어요.',
    review: '단원 전체 내용을 점검할 수 있는 평가 자료를 준비했어요.',
  };
  return {
    id: lesson.id,
    lessonId: lesson.id,
    title: lesson.title,
    unitTitle: unit.shortTitle,
    unitNo: unit.no,
    seq: `${lesson.seq}/${unit.totalLessons}차시`,
    pages: lesson.pages,
    goal: lesson.goal || lesson.title,
    duration: 40,
    type: lesson.type,
    materials,
    thinkbell,
    tags: lesson.tags || [],
    estimatedAdoptRate: adoptRates[lesson.type] || 75,
    reason: reasons[lesson.type] || '',
  };
}

/* ── 단원 데이터 ──────────────────────────────────────────── */
MOCK.UNITS = [
  {
    id: 'u1', no: 1,
    title: '1. 자연수의 혼합 계산',
    shortTitle: '자연수의 혼합 계산',
    totalLessons: 9,
    color: UNIT_COLORS[0],
    lessons: [
      { id: 'l1_1', seq: 1, pages: '9~11',   type: 'intro',    title: '단원 도입',                                          tags: ['도입','동기유발'] },
      { id: 'l1_2', seq: 2, pages: '12~13',  type: 'learn',    title: '덧셈과 뺄셈이 섞여 있는 식을 계산해 볼까요',           tags: ['개념학습','연산'] },
      { id: 'l1_3', seq: 3, pages: '14~15',  type: 'learn',    title: '곱셈과 나눗셈이 섞여 있는 식을 계산해 볼까요',          tags: ['개념학습','연산'] },
      { id: 'l1_4', seq: 4, pages: '16~17',  type: 'learn',    title: '덧셈, 뺄셈, 곱셈이 섞여 있는 식을 계산해 볼까요',       tags: ['개념학습','연산'] },
      { id: 'l1_5', seq: 5, pages: '18~19',  type: 'learn',    title: '덧셈, 뺄셈, 나눗셈이 섞여 있는 식을 계산해 볼까요',      tags: ['개념학습','연산'] },
      { id: 'l1_6', seq: 6, pages: '20~21',  type: 'learn',    title: '덧셈, 뺄셈, 곱셈, 나눗셈이 섞여 있는 식을 계산해 볼까요', tags: ['개념학습','연산','통합'] },
      { id: 'l1_7', seq: 7, pages: '22~23',  type: 'activity', title: '생각을 더하다 (나를 지켜주는 생존 가방)',                tags: ['창의활동','실생활'] },
      { id: 'l1_8', seq: 8, pages: '24~25',  type: 'play',     title: '놀이를 더하다 (하나, 둘, 셋 빙고!)',                   tags: ['게임형','협력활동'] },
      { id: 'l1_9', seq: 9, pages: '26~28',  type: 'review',   title: '공부한 내용을 확인해요',                              tags: ['형성평가','복습'] },
    ],
  },
  {
    id: 'u2', no: 2,
    title: '2. 약수와 배수',
    shortTitle: '약수와 배수',
    totalLessons: 10,
    color: UNIT_COLORS[1],
    lessons: [
      { id: 'l2_1',  seq: 1,  pages: '29~31',  type: 'intro',    title: '단원 도입',                                        tags: ['도입','동기유발'] },
      { id: 'l2_2',  seq: 2,  pages: '32~33',  type: 'learn',    title: '약수를 알아볼까요',                                 tags: ['개념학습'] },
      { id: 'l2_3',  seq: 3,  pages: '34~35',  type: 'learn',    title: '배수를 알아볼까요',                                 tags: ['개념학습'] },
      { id: 'l2_4',  seq: 4,  pages: '36~39',  type: 'learn',    title: '공약수와 최대공약수를 알아볼까요(1)',                  tags: ['개념학습','공약수'] },
      { id: 'l2_5',  seq: 5,  pages: '36~39',  type: 'learn',    title: '공약수와 최대공약수를 알아볼까요(2)',                  tags: ['개념학습','공약수'] },
      { id: 'l2_6',  seq: 6,  pages: '40~43',  type: 'learn',    title: '공배수와 최소공배수를 알아볼까요(1)',                  tags: ['개념학습','공배수'] },
      { id: 'l2_7',  seq: 7,  pages: '40~43',  type: 'learn',    title: '공배수와 최소공배수를 알아볼까요(2)',                  tags: ['개념학습','공배수'] },
      { id: 'l2_8',  seq: 8,  pages: '44~45',  type: 'activity', title: '생각을 더하다 (체육 대회에 어떻게 입장해야 할까요)',    tags: ['창의활동','실생활'] },
      { id: 'l2_9',  seq: 9,  pages: '46~47',  type: 'play',     title: '놀이를 더하다 (약수와 배수 이어달리기)',               tags: ['게임형','협력활동'] },
      { id: 'l2_10', seq: 10, pages: '48~50',  type: 'review',   title: '공부한 내용을 확인해요',                            tags: ['형성평가','복습'] },
    ],
  },
  {
    id: 'u3', no: 3,
    title: '3. 대응 관계',
    shortTitle: '대응 관계',
    totalLessons: 8,
    color: UNIT_COLORS[2],
    lessons: [
      { id: 'l3_1', seq: 1, pages: '51~53',  type: 'intro',    title: '단원 도입',                                          tags: ['도입','동기유발'] },
      { id: 'l3_2', seq: 2, pages: '54~55',  type: 'learn',    title: '두 양 사이의 관계를 알아볼까요(1)',                     tags: ['개념학습','규칙성'] },
      { id: 'l3_3', seq: 3, pages: '56~57',  type: 'learn',    title: '두 양 사이의 관계를 알아볼까요(2)',                     tags: ['개념학습','규칙성'] },
      { id: 'l3_4', seq: 4, pages: '58~59',  type: 'learn',    title: '대응 관계를 식으로 나타내어 볼까요',                    tags: ['개념학습','식'] },
      { id: 'l3_5', seq: 5, pages: '60~61',  type: 'learn',    title: '생활 속에서 대응 관계를 찾아 식으로 나타내어 볼까요',    tags: ['개념학습','실생활','식'] },
      { id: 'l3_6', seq: 6, pages: '62~63',  type: 'activity', title: '생각을 더하다 (소중한 물, 우리가 지켜요)',              tags: ['창의활동','환경'] },
      { id: 'l3_7', seq: 7, pages: '64~65',  type: 'play',     title: '놀이를 더하다 (자신만만 대응 관계)',                   tags: ['게임형','협력활동'] },
      { id: 'l3_8', seq: 8, pages: '66~68',  type: 'review',   title: '공부한 내용을 확인해요',                              tags: ['형성평가','복습'] },
    ],
  },
  {
    id: 'u4', no: 4,
    title: '4. 약분과 통분',
    shortTitle: '약분과 통분',
    totalLessons: 10,
    color: UNIT_COLORS[3],
    lessons: [
      { id: 'l4_1',  seq: 1,  pages: '69~71',  type: 'intro',    title: '단원 도입',                                         tags: ['도입','동기유발'] },
      { id: 'l4_2',  seq: 2,  pages: '72~73',  type: 'learn',    title: '크기가 같은 분수를 알아볼까요',                       tags: ['개념학습','분수'] },
      { id: 'l4_3',  seq: 3,  pages: '74~75',  type: 'learn',    title: '크기가 같은 분수를 만들어 볼까요',                    tags: ['개념학습','분수'] },
      { id: 'l4_4',  seq: 4,  pages: '76~77',  type: 'learn',    title: '분수를 간단하게 나타내어 볼까요',                     tags: ['개념학습','약분'] },
      { id: 'l4_5',  seq: 5,  pages: '78~79',  type: 'learn',    title: '분모가 같은 분수로 나타내어 볼까요',                  tags: ['개념학습','통분'] },
      { id: 'l4_6',  seq: 6,  pages: '80~81',  type: 'learn',    title: '분수의 크기를 비교해 볼까요',                        tags: ['개념학습','분수비교'] },
      { id: 'l4_7',  seq: 7,  pages: '82~85',  type: 'learn',    title: '분수와 소수의 크기를 비교해 볼까요',                  tags: ['개념학습','분수','소수'] },
      { id: 'l4_8',  seq: 8,  pages: '86~87',  type: 'activity', title: '생각을 더하다 (1/2을 기준으로 길이를 비교해 볼까요)',  tags: ['창의활동','측정'] },
      { id: 'l4_9',  seq: 9,  pages: '88~89',  type: 'play',     title: '놀이를 더하다 (손가락 접어!)',                        tags: ['게임형','협력활동'] },
      { id: 'l4_10', seq: 10, pages: '90~92',  type: 'review',   title: '공부한 내용을 확인해요',                             tags: ['형성평가','복습'] },
    ],
  },
  {
    id: 'u5', no: 5,
    title: '5. 분수의 덧셈과 뺄셈',
    shortTitle: '분수의 덧셈과 뺄셈',
    totalLessons: 10,
    color: UNIT_COLORS[4],
    lessons: [
      { id: 'l5_1',  seq: 1,  pages: '93~95',    type: 'intro',    title: '단원 도입',                                              tags: ['도입','동기유발'] },
      { id: 'l5_2',  seq: 2,  pages: '96~97',    type: 'learn',    title: '진분수의 덧셈 — 합이 1보다 작은 경우',                    tags: ['개념학습','분수덧셈'] },
      { id: 'l5_3',  seq: 3,  pages: '98~99',    type: 'learn',    title: '진분수의 덧셈 — 합이 1보다 큰 경우',                      tags: ['개념학습','분수덧셈'] },
      { id: 'l5_4',  seq: 4,  pages: '100~101',  type: 'learn',    title: '대분수의 덧셈을 해 볼까요',                              tags: ['개념학습','대분수덧셈'] },
      { id: 'l5_5',  seq: 5,  pages: '102~103',  type: 'learn',    title: '진분수의 뺄셈을 해 볼까요',                              tags: ['개념학습','분수뺄셈'] },
      { id: 'l5_6',  seq: 6,  pages: '104~105',  type: 'learn',    title: '대분수의 뺄셈 — 분수 부분끼리 뺄 수 있는 경우',           tags: ['개념학습','대분수뺄셈'] },
      { id: 'l5_7',  seq: 7,  pages: '106~107',  type: 'learn',    title: '대분수의 뺄셈 — 분수 부분끼리 뺄 수 없는 경우',           tags: ['개념학습','대분수뺄셈'] },
      { id: 'l5_8',  seq: 8,  pages: '108~109',  type: 'activity', title: '생각을 더하다 (음표로 분수의 덧셈을 해 볼까요)',           tags: ['창의활동','음악융합'] },
      { id: 'l5_9',  seq: 9,  pages: '110~111',  type: 'play',     title: '놀이를 더하다 (신나는 분수 윷놀이)',                      tags: ['게임형','협력활동'] },
      { id: 'l5_10', seq: 10, pages: '112~114',  type: 'review',   title: '공부한 내용을 확인해요',                                tags: ['형성평가','복습'] },
    ],
  },
  {
    id: 'u6', no: 6,
    title: '6. 다각형의 둘레와 넓이',
    shortTitle: '다각형의 둘레와 넓이',
    totalLessons: 17,
    color: UNIT_COLORS[5],
    lessons: [
      { id: 'l6_1',  seq: 1,  pages: '115~117', type: 'intro',    title: '단원 도입',                                           tags: ['도입','동기유발'] },
      { id: 'l6_2',  seq: 2,  pages: '118~119', type: 'learn',    title: '정다각형의 둘레를 구해 볼까요',                          tags: ['개념학습','둘레'] },
      { id: 'l6_3',  seq: 3,  pages: '120~121', type: 'learn',    title: '사각형의 둘레를 구해 볼까요',                            tags: ['개념학습','둘레'] },
      { id: 'l6_4',  seq: 4,  pages: '122~123', type: 'learn',    title: '1㎠를 알아볼까요',                                      tags: ['개념학습','넓이단위'] },
      { id: 'l6_5',  seq: 5,  pages: '124~125', type: 'learn',    title: '직사각형의 넓이를 구해 볼까요',                          tags: ['개념학습','넓이'] },
      { id: 'l6_6',  seq: 6,  pages: '126~129', type: 'learn',    title: '1㎠보다 더 큰 넓이의 단위를 알아볼까요(1)',               tags: ['개념학습','넓이단위'] },
      { id: 'l6_7',  seq: 7,  pages: '126~129', type: 'learn',    title: '1㎠보다 더 큰 넓이의 단위를 알아볼까요(2)',               tags: ['개념학습','넓이단위'] },
      { id: 'l6_8',  seq: 8,  pages: '130~133', type: 'learn',    title: '평행사변형의 넓이를 구해 볼까요(1)',                      tags: ['개념학습','평행사변형'] },
      { id: 'l6_9',  seq: 9,  pages: '130~133', type: 'learn',    title: '평행사변형의 넓이를 구해 볼까요(2)',                      tags: ['개념학습','평행사변형'] },
      { id: 'l6_10', seq: 10, pages: '134~137', type: 'learn',    title: '삼각형의 넓이를 구해 볼까요(1)',                         tags: ['개념학습','삼각형'] },
      { id: 'l6_11', seq: 11, pages: '134~137', type: 'learn',    title: '삼각형의 넓이를 구해 볼까요(2)',                         tags: ['개념학습','삼각형'] },
      { id: 'l6_12', seq: 12, pages: '138~139', type: 'learn',    title: '마름모의 넓이를 구해 볼까요',                            tags: ['개념학습','마름모'] },
      { id: 'l6_13', seq: 13, pages: '140~143', type: 'learn',    title: '사다리꼴의 넓이를 구해 볼까요(1)',                       tags: ['개념학습','사다리꼴'] },
      { id: 'l6_14', seq: 14, pages: '140~143', type: 'learn',    title: '사다리꼴의 넓이를 구해 볼까요(2)',                       tags: ['개념학습','사다리꼴'] },
      { id: 'l6_15', seq: 15, pages: '144~145', type: 'activity', title: '생각을 더하다 (공원을 만들어요)',                        tags: ['창의활동','설계'] },
      { id: 'l6_16', seq: 16, pages: '146~147', type: 'play',     title: '놀이를 더하다 (직사각형 보물 탐험대)',                   tags: ['게임형','협력활동'] },
      { id: 'l6_17', seq: 17, pages: '148~150', type: 'review',   title: '공부한 내용을 확인해요',                               tags: ['형성평가','복습'] },
    ],
  },
  {
    id: 'u7', no: 7,
    title: '창의 프로젝트',
    shortTitle: '창의 프로젝트',
    totalLessons: 4,
    color: UNIT_COLORS[6],
    lessons: [
      { id: 'l7_1', seq: 1, pages: '151~153', type: 'activity', title: '준비 착착: 농부의 고민을 알아보아요', tags: ['프로젝트','탐구'] },
      { id: 'l7_2', seq: 2, pages: '154~155', type: 'activity', title: '생각 쑥쑥: 밭을 탐구해요',           tags: ['프로젝트','탐구'] },
      { id: 'l7_3', seq: 3, pages: '156~157', type: 'activity', title: '해결 팡팡: 농부에게 편지를 써 보아요', tags: ['프로젝트','쓰기'] },
      { id: 'l7_4', seq: 4, pages: '158~159', type: 'play',     title: '공유 톡톡: 농부에게 쓴 편지를 소개해요', tags: ['발표','공유'] },
    ],
  },
];

/* ── 전체 차시 평탄화 ─────────────────────────────────────── */
MOCK.ALL_LESSONS = [];
MOCK.UNITS.forEach(unit => {
  unit.lessons.forEach(lesson => {
    MOCK.ALL_LESSONS.push({ ...lesson, unitId: unit.id, unitNo: unit.no, unitTitle: unit.shortTitle });
  });
});
// 전체 순번 부여
MOCK.ALL_LESSONS.forEach((l, i) => { l.globalSeq = i + 1; });

/* ── 패키지 생성 함수 ─────────────────────────────────────── */
MOCK.getPackage = function(lesson) {
  const unit = MOCK.UNITS.find(u => u.id === lesson.unitId);
  return buildPackage(lesson, unit);
};

/* ── 진도 관리 (localStorage) ────────────────────────────── */
/* 기본 진도: l2_4 (13차시) 기준, 앞 12차시 완료 상태 */
const DEFAULT_PROGRESS = {
  currentIdx: 12,  /* 0-indexed → l2_4 (공약수와 최대공약수(1)) */
  completed: ['l1_1','l1_2','l1_3','l1_4','l1_5','l1_6','l1_7','l1_8','l1_9',
              'l2_1','l2_2','l2_3'],
};

MOCK.getProgress = function() {
  try {
    const stored = localStorage.getItem('icepack_progress');
    return stored ? JSON.parse(stored) : DEFAULT_PROGRESS;
  } catch { return DEFAULT_PROGRESS; }
};

MOCK.saveProgress = function(p) {
  localStorage.setItem('icepack_progress', JSON.stringify(p));
};

MOCK.getCurrentLesson = function() {
  const p = MOCK.getProgress();
  const idx = p.currentIdx ?? 0;
  return MOCK.ALL_LESSONS[Math.min(idx, MOCK.ALL_LESSONS.length - 1)];
};

MOCK.getCompletedSet = function() {
  const p = MOCK.getProgress();
  return new Set(p.completed || []);
};

MOCK.markComplete = function(lessonId) {
  const p = MOCK.getProgress();
  const completed = p.completed || [];
  if (!completed.includes(lessonId)) completed.push(lessonId);
  // 다음 차시로 이동
  const idx = MOCK.ALL_LESSONS.findIndex(l => l.id === lessonId);
  const nextIdx = Math.min(idx + 1, MOCK.ALL_LESSONS.length - 1);
  MOCK.saveProgress({ ...p, completed, currentIdx: nextIdx });
  return MOCK.ALL_LESSONS[nextIdx];
};

MOCK.goToLesson = function(globalSeq) {
  const p = MOCK.getProgress();
  const idx = MOCK.ALL_LESSONS.findIndex(l => l.globalSeq === globalSeq);
  if (idx >= 0) MOCK.saveProgress({ ...p, currentIdx: idx });
  return MOCK.ALL_LESSONS[idx];
};

/* ── 차시별 퀴즈 URL (서버 캐시 파일 + localStorage 병합) ── */
/* window.SERVER_QUIZ_CACHE 는 index.html boot 전에 fetch로 채워짐 */
MOCK.getQuizUrls = function() {
  const server = window.SERVER_QUIZ_CACHE || {};
  try {
    const local = JSON.parse(localStorage.getItem('icepack_quiz_urls') || '{}');
    return { ...server, ...local };  /* local이 server를 덮어씀 */
  } catch { return server; }
};

MOCK.saveQuizUrl = function(lessonId, quizUrl, playUrl, quizIdx) {
  try {
    const local = JSON.parse(localStorage.getItem('icepack_quiz_urls') || '{}');
    local[lessonId] = { quizUrl, playUrl, quizIdx };
    localStorage.setItem('icepack_quiz_urls', JSON.stringify(local));
  } catch {}
};

/* ── 사용자 선호도 추적 ──────────────────────────────────── */
/* { lessonId: { accepted: 0, rejected: 0, lastAction: 'accept'|'reject', updatedAt: ts } } */
MOCK.getPreferences = function() {
  try { return JSON.parse(localStorage.getItem('icepack_prefs') || '{}'); } catch { return {}; }
};

MOCK.trackQuizAccept = function(lessonId) {
  const p = MOCK.getPreferences();
  p[lessonId] = { ...p[lessonId], accepted: (p[lessonId]?.accepted || 0) + 1, lastAction: 'accept', updatedAt: Date.now() };
  localStorage.setItem('icepack_prefs', JSON.stringify(p));
};

MOCK.trackQuizReject = function(lessonId) {
  const p = MOCK.getPreferences();
  p[lessonId] = { ...p[lessonId], rejected: (p[lessonId]?.rejected || 0) + 1, lastAction: 'reject', updatedAt: Date.now() };
  localStorage.setItem('icepack_prefs', JSON.stringify(p));
};
