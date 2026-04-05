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

/* ═══════════════════════════════════════════════════════════
   타 교과 차시 데이터 (5학년 1학기)
   TIMETABLE_GRID 기반 슬롯 정의 + 단원·차시 데이터
   ═══════════════════════════════════════════════════════════ */

// 과목별 주간 슬롯 (TIMETABLE_GRID에서 추출, day/period 0-indexed)
const SUBJECT_SLOTS = {
  '과학': [{ day:1,period:0 },{ day:1,period:1 },{ day:3,period:2 }],           // 화1,2 / 목3
  '사회': [{ day:1,period:2 },{ day:2,period:1 },{ day:0,period:4 },{ day:3,period:5 }], // 화3/수2/월5/목6
  '영어': [{ day:0,period:2 },{ day:2,period:0 },{ day:4,period:2 }],           // 월3/수1/금3
  '체육': [{ day:0,period:3 },{ day:2,period:2 },{ day:4,period:1 }],           // 월4/수3/금2
  '미술': [{ day:1,period:3 },{ day:1,period:4 }],                               // 화4,5
  '실과': [{ day:3,period:3 },{ day:4,period:3 }],                               // 목4/금4
  '음악': [{ day:3,period:4 },{ day:4,period:4 }],                               // 목5/금5
};
MOCK.SUBJECT_SLOTS = SUBJECT_SLOTS;

MOCK.SUBJECT_UNITS   = {};   // { subjectName: unitsArray }
MOCK.SUBJECT_LESSONS = {};   // { subjectName: flatLessonsArray }

function _buildSubjectData(subjectName, units) {
  MOCK.SUBJECT_UNITS[subjectName] = units;
  const all = [];
  units.forEach(unit => {
    unit.lessons.forEach(lesson => {
      all.push({ ...lesson, unitId: unit.id, unitNo: unit.no, unitTitle: unit.shortTitle, subject: subjectName });
    });
  });
  all.forEach((l, i) => { l.globalSeq = i + 1; });
  MOCK.SUBJECT_LESSONS[subjectName] = all;
}

/* ── 과학 5-1 (50차시) ──────────────────────────────────────── */
_buildSubjectData('과학', [
  { id:'sci_u1', no:1, title:'1. 과학과 탐구', shortTitle:'과학과 탐구', totalLessons:5, color:'#0c8599', lessons:[
    { id:'sci_1_1', seq:1, pages:'8~10',   type:'intro',    title:'단원 도입' },
    { id:'sci_1_2', seq:2, pages:'11~13',  type:'learn',    title:'탐구 문제 정하기와 가설 세우기' },
    { id:'sci_1_3', seq:3, pages:'14~17',  type:'learn',    title:'변인 통제와 실험 계획하기' },
    { id:'sci_1_4', seq:4, pages:'18~21',  type:'activity', title:'실험 수행과 자료 변환하기' },
    { id:'sci_1_5', seq:5, pages:'22~24',  type:'review',   title:'결론 도출과 탐구 보고서 쓰기' },
  ]},
  { id:'sci_u2', no:2, title:'2. 온도와 열', shortTitle:'온도와 열', totalLessons:13, color:'#f59f00', lessons:[
    { id:'sci_2_1',  seq:1,  pages:'26~27',  type:'intro',    title:'단원 도입' },
    { id:'sci_2_2',  seq:2,  pages:'28~29',  type:'learn',    title:'온도를 어떻게 측정할까요' },
    { id:'sci_2_3',  seq:3,  pages:'30~31',  type:'learn',    title:'온도가 다른 두 물체를 접촉하면 어떻게 될까요' },
    { id:'sci_2_4',  seq:4,  pages:'32~33',  type:'learn',    title:'고체에서 열은 어떻게 이동할까요(1)' },
    { id:'sci_2_5',  seq:5,  pages:'32~33',  type:'learn',    title:'고체에서 열은 어떻게 이동할까요(2)' },
    { id:'sci_2_6',  seq:6,  pages:'34~35',  type:'learn',    title:'고체의 종류에 따라 열의 이동 빠르기는 어떻게 다를까요' },
    { id:'sci_2_7',  seq:7,  pages:'36~37',  type:'activity', title:'액체에서 열은 어떻게 이동할까요' },
    { id:'sci_2_8',  seq:8,  pages:'38~39',  type:'activity', title:'기체에서 열은 어떻게 이동할까요' },
    { id:'sci_2_9',  seq:9,  pages:'40~41',  type:'learn',    title:'단열이란 무엇일까요' },
    { id:'sci_2_10', seq:10, pages:'42~43',  type:'activity', title:'생활 속 단열 예 찾기' },
    { id:'sci_2_11', seq:11, pages:'44~45',  type:'play',     title:'단열 도시락 만들기' },
    { id:'sci_2_12', seq:12, pages:'46~47',  type:'review',   title:'단원 마무리' },
    { id:'sci_2_13', seq:13, pages:'48~49',  type:'review',   title:'단원 평가' },
  ]},
  { id:'sci_u3', no:3, title:'3. 태양계와 별', shortTitle:'태양계와 별', totalLessons:11, color:'#1864ab', lessons:[
    { id:'sci_3_1',  seq:1,  pages:'50~51',  type:'intro',    title:'단원 도입' },
    { id:'sci_3_2',  seq:2,  pages:'52~53',  type:'learn',    title:'태양계를 구성하는 천체는 무엇이 있을까요' },
    { id:'sci_3_3',  seq:3,  pages:'54~55',  type:'learn',    title:'태양계 행성의 크기를 비교해 볼까요' },
    { id:'sci_3_4',  seq:4,  pages:'56~57',  type:'learn',    title:'태양과 행성 사이의 거리를 비교해 볼까요' },
    { id:'sci_3_5',  seq:5,  pages:'58~59',  type:'learn',    title:'태양계 행성의 특징을 알아볼까요(1)' },
    { id:'sci_3_6',  seq:6,  pages:'58~59',  type:'learn',    title:'태양계 행성의 특징을 알아볼까요(2)' },
    { id:'sci_3_7',  seq:7,  pages:'60~61',  type:'activity', title:'행성 탐사 보고서 작성하기' },
    { id:'sci_3_8',  seq:8,  pages:'62~63',  type:'learn',    title:'별과 별자리를 알아볼까요' },
    { id:'sci_3_9',  seq:9,  pages:'64~65',  type:'learn',    title:'북쪽 하늘의 별자리를 알아볼까요' },
    { id:'sci_3_10', seq:10, pages:'66~67',  type:'activity', title:'계절별 대표 별자리 알아보기' },
    { id:'sci_3_11', seq:11, pages:'68~70',  type:'review',   title:'단원 평가' },
  ]},
  { id:'sci_u4', no:4, title:'4. 용해와 용액', shortTitle:'용해와 용액', totalLessons:11, color:'#099268', lessons:[
    { id:'sci_4_1',  seq:1,  pages:'72~73',  type:'intro',    title:'단원 도입' },
    { id:'sci_4_2',  seq:2,  pages:'74~75',  type:'learn',    title:'용해란 무엇일까요' },
    { id:'sci_4_3',  seq:3,  pages:'76~77',  type:'learn',    title:'물에 용해된 물질은 어떻게 될까요' },
    { id:'sci_4_4',  seq:4,  pages:'78~79',  type:'learn',    title:'온도에 따라 용질이 녹는 양은 어떻게 다를까요' },
    { id:'sci_4_5',  seq:5,  pages:'80~81',  type:'learn',    title:'물의 양에 따라 용질이 녹는 양은 어떻게 다를까요' },
    { id:'sci_4_6',  seq:6,  pages:'82~83',  type:'activity', title:'더 많은 양의 용질 녹이기' },
    { id:'sci_4_7',  seq:7,  pages:'84~85',  type:'learn',    title:'용액의 진하기를 어떻게 비교할까요' },
    { id:'sci_4_8',  seq:8,  pages:'86~87',  type:'activity', title:'용액의 진하기를 비교하는 도구 만들기' },
    { id:'sci_4_9',  seq:9,  pages:'88~89',  type:'activity', title:'재결정으로 물질 분리하기' },
    { id:'sci_4_10', seq:10, pages:'90~91',  type:'play',     title:'생활 속 용액 활용 사례 탐구' },
    { id:'sci_4_11', seq:11, pages:'92~94',  type:'review',   title:'단원 평가' },
  ]},
  { id:'sci_u5', no:5, title:'5. 다양한 생물과 우리 생활', shortTitle:'다양한 생물', totalLessons:10, color:'#2f9e44', lessons:[
    { id:'sci_5_1',  seq:1,  pages:'96~97',  type:'intro',    title:'단원 도입' },
    { id:'sci_5_2',  seq:2,  pages:'98~99',  type:'learn',    title:'곰팡이와 버섯의 생김새와 특징' },
    { id:'sci_5_3',  seq:3,  pages:'100~101',type:'learn',    title:'짚신벌레와 해캄의 생김새와 특징' },
    { id:'sci_5_4',  seq:4,  pages:'102~103',type:'activity', title:'현미경으로 미생물 관찰하기' },
    { id:'sci_5_5',  seq:5,  pages:'104~105',type:'learn',    title:'세균의 특징을 알아볼까요' },
    { id:'sci_5_6',  seq:6,  pages:'106~107',type:'learn',    title:'다양한 생물이 우리 생활에 미치는 영향' },
    { id:'sci_5_7',  seq:7,  pages:'108~109',type:'activity', title:'생물 이용 기술 조사하기' },
    { id:'sci_5_8',  seq:8,  pages:'110~111',type:'play',     title:'미생물 탐구 발표하기' },
    { id:'sci_5_9',  seq:9,  pages:'112~113',type:'review',   title:'단원 마무리' },
    { id:'sci_5_10', seq:10, pages:'114~116',type:'review',   title:'단원 평가' },
  ]},
]);

/* ── 사회 5-1 (56차시) ──────────────────────────────────────── */
_buildSubjectData('사회', [
  { id:'soc_u1', no:1, title:'1. 국토와 자연환경', shortTitle:'국토와 자연환경', totalLessons:28, color:'#e67700', lessons:[
    { id:'soc_1_1',  seq:1,  pages:'8~9',    type:'intro',    title:'단원 도입 — 우리 땅, 우리나라' },
    { id:'soc_1_2',  seq:2,  pages:'10~11',  type:'learn',    title:'우리나라의 수리적 위치' },
    { id:'soc_1_3',  seq:3,  pages:'12~13',  type:'learn',    title:'우리나라의 지리적·관계적 위치' },
    { id:'soc_1_4',  seq:4,  pages:'14~15',  type:'learn',    title:'우리나라의 영토, 영해, 영공' },
    { id:'soc_1_5',  seq:5,  pages:'16~17',  type:'learn',    title:'독도의 지리적 위치와 중요성' },
    { id:'soc_1_6',  seq:6,  pages:'18~19',  type:'activity', title:'우리나라 영토 지도 그리기' },
    { id:'soc_1_7',  seq:7,  pages:'20~21',  type:'learn',    title:'우리나라 지형의 특징 — 산지와 평야' },
    { id:'soc_1_8',  seq:8,  pages:'22~23',  type:'learn',    title:'우리나라 지형의 특징 — 강과 해안' },
    { id:'soc_1_9',  seq:9,  pages:'24~25',  type:'activity', title:'우리나라 지형 특징 정리하기' },
    { id:'soc_1_10', seq:10, pages:'26~27',  type:'learn',    title:'우리나라 기온의 특징' },
    { id:'soc_1_11', seq:11, pages:'28~29',  type:'learn',    title:'우리나라 강수량의 특징' },
    { id:'soc_1_12', seq:12, pages:'30~31',  type:'learn',    title:'계절별 기후 특징' },
    { id:'soc_1_13', seq:13, pages:'32~33',  type:'activity', title:'기후와 생활 모습 관계 조사' },
    { id:'soc_1_14', seq:14, pages:'34~35',  type:'learn',    title:'우리나라의 자연재해 — 홍수와 가뭄' },
    { id:'soc_1_15', seq:15, pages:'36~37',  type:'learn',    title:'우리나라의 자연재해 — 태풍과 황사' },
    { id:'soc_1_16', seq:16, pages:'38~39',  type:'learn',    title:'우리나라의 자연재해 — 지진과 화산' },
    { id:'soc_1_17', seq:17, pages:'40~41',  type:'activity', title:'자연재해 대처 방법 조사하기' },
    { id:'soc_1_18', seq:18, pages:'42~43',  type:'learn',    title:'자연환경을 활용하는 생활 — 산지와 강' },
    { id:'soc_1_19', seq:19, pages:'44~45',  type:'learn',    title:'자연환경을 활용하는 생활 — 평야와 해안' },
    { id:'soc_1_20', seq:20, pages:'46~47',  type:'activity', title:'우리 지역 자연환경 조사하기' },
    { id:'soc_1_21', seq:21, pages:'48~49',  type:'play',     title:'우리나라 지형 퀴즈 게임' },
    { id:'soc_1_22', seq:22, pages:'50~51',  type:'learn',    title:'국토 환경 보전의 중요성' },
    { id:'soc_1_23', seq:23, pages:'52~53',  type:'activity', title:'환경 보전 캠페인 만들기' },
    { id:'soc_1_24', seq:24, pages:'54~55',  type:'review',   title:'단원 마무리(1)' },
    { id:'soc_1_25', seq:25, pages:'54~55',  type:'review',   title:'단원 마무리(2)' },
    { id:'soc_1_26', seq:26, pages:'56~57',  type:'review',   title:'단원 평가(1)' },
    { id:'soc_1_27', seq:27, pages:'56~57',  type:'review',   title:'단원 평가(2)' },
    { id:'soc_1_28', seq:28, pages:'58~59',  type:'play',     title:'국토 탐험 프로젝트' },
  ]},
  { id:'soc_u2', no:2, title:'2. 인권 존중과 정의로운 사회', shortTitle:'인권과 정의', totalLessons:28, color:'#c2255c', lessons:[
    { id:'soc_2_1',  seq:1,  pages:'62~63',  type:'intro',    title:'단원 도입 — 인권이란 무엇일까요' },
    { id:'soc_2_2',  seq:2,  pages:'64~65',  type:'learn',    title:'인권의 의미와 중요성' },
    { id:'soc_2_3',  seq:3,  pages:'66~67',  type:'learn',    title:'역사 속 인권 침해 사례' },
    { id:'soc_2_4',  seq:4,  pages:'68~69',  type:'learn',    title:'현대 사회의 인권 침해 사례' },
    { id:'soc_2_5',  seq:5,  pages:'70~71',  type:'activity', title:'인권 침해 사례 탐구하기' },
    { id:'soc_2_6',  seq:6,  pages:'72~73',  type:'learn',    title:'인권 보호를 위한 개인과 시민 단체의 노력' },
    { id:'soc_2_7',  seq:7,  pages:'74~75',  type:'learn',    title:'인권 보호를 위한 국가와 국제기구의 노력' },
    { id:'soc_2_8',  seq:8,  pages:'76~77',  type:'activity', title:'인권 보호 활동 조사하기' },
    { id:'soc_2_9',  seq:9,  pages:'78~79',  type:'play',     title:'인권 존중 표어 만들기' },
    { id:'soc_2_10', seq:10, pages:'80~81',  type:'learn',    title:'법의 의미와 역할' },
    { id:'soc_2_11', seq:11, pages:'82~83',  type:'learn',    title:'우리 생활과 법' },
    { id:'soc_2_12', seq:12, pages:'84~85',  type:'activity', title:'생활 속 법 사례 조사하기' },
    { id:'soc_2_13', seq:13, pages:'86~87',  type:'learn',    title:'정의로운 사회를 위한 법과 제도' },
    { id:'soc_2_14', seq:14, pages:'88~89',  type:'activity', title:'공정한 규칙 만들기 토론' },
    { id:'soc_2_15', seq:15, pages:'90~91',  type:'learn',    title:'사회적 약자와 차별' },
    { id:'soc_2_16', seq:16, pages:'92~93',  type:'learn',    title:'차별을 없애기 위한 노력' },
    { id:'soc_2_17', seq:17, pages:'94~95',  type:'activity', title:'차별 해소 방안 토론하기' },
    { id:'soc_2_18', seq:18, pages:'96~97',  type:'play',     title:'공정한 사회 만들기 게임' },
    { id:'soc_2_19', seq:19, pages:'98~99',  type:'learn',    title:'헌법의 의미와 역할' },
    { id:'soc_2_20', seq:20, pages:'100~101',type:'learn',    title:'헌법과 기본권' },
    { id:'soc_2_21', seq:21, pages:'102~103',type:'activity', title:'우리 헌법 탐구하기' },
    { id:'soc_2_22', seq:22, pages:'104~105',type:'learn',    title:'권리와 의무의 관계' },
    { id:'soc_2_23', seq:23, pages:'106~107',type:'learn',    title:'민주주의와 시민 참여' },
    { id:'soc_2_24', seq:24, pages:'108~109',type:'activity', title:'시민 참여 방법 조사하기' },
    { id:'soc_2_25', seq:25, pages:'110~111',type:'play',     title:'민주주의 사회 토론 게임' },
    { id:'soc_2_26', seq:26, pages:'112~113',type:'review',   title:'단원 마무리(1)' },
    { id:'soc_2_27', seq:27, pages:'112~113',type:'review',   title:'단원 마무리(2)' },
    { id:'soc_2_28', seq:28, pages:'114~116',type:'review',   title:'단원 평가' },
  ]},
]);

/* ── 영어 5-1 (48차시) ──────────────────────────────────────── */
_buildSubjectData('영어', [
  { id:'eng_u1', no:1, title:'Unit 1. Hello, Again!', shortTitle:'Hello, Again!', totalLessons:6, color:'#6741d9', lessons:[
    { id:'eng_1_1', seq:1, pages:'6~7',   type:'intro',    title:'단원 도입 — Hello, I\'m back!' },
    { id:'eng_1_2', seq:2, pages:'8~9',   type:'learn',    title:'Words & Sounds (1) — 인사말 표현 듣고 말하기' },
    { id:'eng_1_3', seq:3, pages:'10~11', type:'learn',    title:'Words & Sounds (2) — 자기소개 표현' },
    { id:'eng_1_4', seq:4, pages:'12~13', type:'activity', title:'Let\'s Read — 대화문 읽고 이해하기' },
    { id:'eng_1_5', seq:5, pages:'14~15', type:'play',     title:'Let\'s Play — 인사 게임' },
    { id:'eng_1_6', seq:6, pages:'16~17', type:'review',   title:'Review — 단원 평가' },
  ]},
  { id:'eng_u2', no:2, title:'Unit 2. What Time Do You Get Up?', shortTitle:'What Time?', totalLessons:6, color:'#7048e8', lessons:[
    { id:'eng_2_1', seq:1, pages:'18~19', type:'intro',    title:'단원 도입' },
    { id:'eng_2_2', seq:2, pages:'20~21', type:'learn',    title:'Words & Sounds (1) — 시간 표현 듣고 말하기' },
    { id:'eng_2_3', seq:3, pages:'22~23', type:'learn',    title:'Words & Sounds (2) — 일과 표현' },
    { id:'eng_2_4', seq:4, pages:'24~25', type:'activity', title:'Let\'s Read — 하루 일과 대화문' },
    { id:'eng_2_5', seq:5, pages:'26~27', type:'play',     title:'Let\'s Play — 하루 일과 게임' },
    { id:'eng_2_6', seq:6, pages:'28~29', type:'review',   title:'Review — 단원 평가' },
  ]},
  { id:'eng_u3', no:3, title:'Unit 3. I Can Do It!', shortTitle:'I Can Do It!', totalLessons:6, color:'#845ef7', lessons:[
    { id:'eng_3_1', seq:1, pages:'30~31', type:'intro',    title:'단원 도입' },
    { id:'eng_3_2', seq:2, pages:'32~33', type:'learn',    title:'Words & Sounds (1) — 능력 표현 can' },
    { id:'eng_3_3', seq:3, pages:'34~35', type:'learn',    title:'Words & Sounds (2) — 취미와 활동 표현' },
    { id:'eng_3_4', seq:4, pages:'36~37', type:'activity', title:'Let\'s Read — 능력 표현 대화문' },
    { id:'eng_3_5', seq:5, pages:'38~39', type:'play',     title:'Let\'s Play — 능력 빙고 게임' },
    { id:'eng_3_6', seq:6, pages:'40~41', type:'review',   title:'Review — 단원 평가' },
  ]},
  { id:'eng_u4', no:4, title:'Unit 4. What Would You Like?', shortTitle:'What Would You Like?', totalLessons:6, color:'#7950f2', lessons:[
    { id:'eng_4_1', seq:1, pages:'42~43', type:'intro',    title:'단원 도입' },
    { id:'eng_4_2', seq:2, pages:'44~45', type:'learn',    title:'Words & Sounds (1) — 음식 표현' },
    { id:'eng_4_3', seq:3, pages:'46~47', type:'learn',    title:'Words & Sounds (2) — 주문하기 표현' },
    { id:'eng_4_4', seq:4, pages:'48~49', type:'activity', title:'Let\'s Read — 식당 대화문' },
    { id:'eng_4_5', seq:5, pages:'50~51', type:'play',     title:'Let\'s Play — 음식 주문 역할극' },
    { id:'eng_4_6', seq:6, pages:'52~53', type:'review',   title:'Review — 단원 평가' },
  ]},
  { id:'eng_u5', no:5, title:'Unit 5. How Much Is It?', shortTitle:'How Much?', totalLessons:6, color:'#9775fa', lessons:[
    { id:'eng_5_1', seq:1, pages:'54~55', type:'intro',    title:'단원 도입' },
    { id:'eng_5_2', seq:2, pages:'56~57', type:'learn',    title:'Words & Sounds (1) — 가격 표현' },
    { id:'eng_5_3', seq:3, pages:'58~59', type:'learn',    title:'Words & Sounds (2) — 물건 사기 표현' },
    { id:'eng_5_4', seq:4, pages:'60~61', type:'activity', title:'Let\'s Read — 시장 대화문' },
    { id:'eng_5_5', seq:5, pages:'62~63', type:'play',     title:'Let\'s Play — 시장 놀이' },
    { id:'eng_5_6', seq:6, pages:'64~65', type:'review',   title:'Review — 단원 평가' },
  ]},
  { id:'eng_u6', no:6, title:'Unit 6. Where Is the Library?', shortTitle:'Where Is It?', totalLessons:6, color:'#ae3ec9', lessons:[
    { id:'eng_6_1', seq:1, pages:'66~67', type:'intro',    title:'단원 도입' },
    { id:'eng_6_2', seq:2, pages:'68~69', type:'learn',    title:'Words & Sounds (1) — 위치 표현' },
    { id:'eng_6_3', seq:3, pages:'70~71', type:'learn',    title:'Words & Sounds (2) — 길 안내 표현' },
    { id:'eng_6_4', seq:4, pages:'72~73', type:'activity', title:'Let\'s Read — 길 안내 대화문' },
    { id:'eng_6_5', seq:5, pages:'74~75', type:'play',     title:'Let\'s Play — 길찾기 게임' },
    { id:'eng_6_6', seq:6, pages:'76~77', type:'review',   title:'Review — 단원 평가' },
  ]},
  { id:'eng_u7', no:7, title:'Unit 7. What Are You Doing?', shortTitle:'What Are You Doing?', totalLessons:6, color:'#862e9c', lessons:[
    { id:'eng_7_1', seq:1, pages:'78~79', type:'intro',    title:'단원 도입' },
    { id:'eng_7_2', seq:2, pages:'80~81', type:'learn',    title:'Words & Sounds (1) — 현재 진행형 표현' },
    { id:'eng_7_3', seq:3, pages:'82~83', type:'learn',    title:'Words & Sounds (2) — 활동 묻고 답하기' },
    { id:'eng_7_4', seq:4, pages:'84~85', type:'activity', title:'Let\'s Read — 일상 활동 대화문' },
    { id:'eng_7_5', seq:5, pages:'86~87', type:'play',     title:'Let\'s Play — 나는 무엇을 하고 있을까요' },
    { id:'eng_7_6', seq:6, pages:'88~89', type:'review',   title:'Review — 단원 평가' },
  ]},
  { id:'eng_u8', no:8, title:'Unit 8. When Is Your Birthday?', shortTitle:'Birthday!', totalLessons:6, color:'#6d28d9', lessons:[
    { id:'eng_8_1', seq:1, pages:'90~91', type:'intro',    title:'단원 도입' },
    { id:'eng_8_2', seq:2, pages:'92~93', type:'learn',    title:'Words & Sounds (1) — 날짜·월 표현' },
    { id:'eng_8_3', seq:3, pages:'94~95', type:'learn',    title:'Words & Sounds (2) — 생일 표현' },
    { id:'eng_8_4', seq:4, pages:'96~97', type:'activity', title:'Let\'s Read — 생일 파티 대화문' },
    { id:'eng_8_5', seq:5, pages:'98~99', type:'play',     title:'Let\'s Play — 생일 달력 만들기' },
    { id:'eng_8_6', seq:6, pages:'100~101',type:'review',  title:'Review — 단원 평가' },
  ]},
]);

/* ── 체육 5-1 (48차시) ──────────────────────────────────────── */
_buildSubjectData('체육', [
  { id:'pe_u1', no:1, title:'1. 건강 활동 — 체력과 건강', shortTitle:'체력과 건강', totalLessons:9, color:'#c92a2a', lessons:[
    { id:'pe_1_1', seq:1, pages:'6~7',   type:'intro',    title:'단원 도입 — 체력이 뭘까요' },
    { id:'pe_1_2', seq:2, pages:'8~9',   type:'learn',    title:'체력의 의미와 중요성' },
    { id:'pe_1_3', seq:3, pages:'10~11', type:'learn',    title:'건강 체력의 구성 요소(1) — 심폐지구력·유연성' },
    { id:'pe_1_4', seq:4, pages:'12~13', type:'learn',    title:'건강 체력의 구성 요소(2) — 근력·근지구력' },
    { id:'pe_1_5', seq:5, pages:'14~15', type:'activity', title:'체력 측정하기' },
    { id:'pe_1_6', seq:6, pages:'16~17', type:'learn',    title:'체력 향상을 위한 운동 방법' },
    { id:'pe_1_7', seq:7, pages:'18~19', type:'activity', title:'체력 운동 프로그램 만들기' },
    { id:'pe_1_8', seq:8, pages:'20~21', type:'activity', title:'개인 운동 계획표 만들기' },
    { id:'pe_1_9', seq:9, pages:'22~23', type:'review',   title:'건강 활동 평가' },
  ]},
  { id:'pe_u2', no:2, title:'2. 도전 활동 — 달리기와 뛰기', shortTitle:'달리기와 뛰기', totalLessons:10, color:'#e03131', lessons:[
    { id:'pe_2_1',  seq:1,  pages:'26~27', type:'intro',    title:'단원 도입' },
    { id:'pe_2_2',  seq:2,  pages:'28~29', type:'learn',    title:'단거리달리기의 자세와 방법' },
    { id:'pe_2_3',  seq:3,  pages:'30~31', type:'activity', title:'출발 자세와 달리기 연습(1)' },
    { id:'pe_2_4',  seq:4,  pages:'30~31', type:'activity', title:'출발 자세와 달리기 연습(2)' },
    { id:'pe_2_5',  seq:5,  pages:'32~33', type:'play',     title:'단거리달리기 기록 측정' },
    { id:'pe_2_6',  seq:6,  pages:'34~35', type:'learn',    title:'멀리뛰기의 자세와 방법' },
    { id:'pe_2_7',  seq:7,  pages:'36~37', type:'activity', title:'도움닫기와 발구름 연습' },
    { id:'pe_2_8',  seq:8,  pages:'38~39', type:'activity', title:'멀리뛰기 연습(1)' },
    { id:'pe_2_9',  seq:9,  pages:'38~39', type:'activity', title:'멀리뛰기 연습(2)' },
    { id:'pe_2_10', seq:10, pages:'40~41', type:'review',   title:'도전 기록 평가' },
  ]},
  { id:'pe_u3', no:3, title:'3. 경쟁 활동 — 구기 운동', shortTitle:'구기 운동', totalLessons:12, color:'#f59f00', lessons:[
    { id:'pe_3_1',  seq:1,  pages:'44~45', type:'intro',    title:'단원 도입 — 피구를 알아볼까요' },
    { id:'pe_3_2',  seq:2,  pages:'46~47', type:'learn',    title:'피구의 규칙과 기술' },
    { id:'pe_3_3',  seq:3,  pages:'48~49', type:'activity', title:'피구 기초 기술 — 던지기 연습' },
    { id:'pe_3_4',  seq:4,  pages:'48~49', type:'activity', title:'피구 기초 기술 — 받기·피하기 연습' },
    { id:'pe_3_5',  seq:5,  pages:'50~51', type:'play',     title:'피구 게임(1)' },
    { id:'pe_3_6',  seq:6,  pages:'50~51', type:'play',     title:'피구 게임(2)' },
    { id:'pe_3_7',  seq:7,  pages:'52~53', type:'learn',    title:'풋살의 규칙과 기술' },
    { id:'pe_3_8',  seq:8,  pages:'54~55', type:'activity', title:'풋살 기초 기술 — 패스 연습' },
    { id:'pe_3_9',  seq:9,  pages:'54~55', type:'activity', title:'풋살 기초 기술 — 슛 연습' },
    { id:'pe_3_10', seq:10, pages:'56~57', type:'play',     title:'미니 풋살 게임(1)' },
    { id:'pe_3_11', seq:11, pages:'56~57', type:'play',     title:'미니 풋살 게임(2)' },
    { id:'pe_3_12', seq:12, pages:'58~59', type:'review',   title:'경쟁 활동 평가' },
  ]},
  { id:'pe_u4', no:4, title:'4. 표현 활동 — 창작 체조', shortTitle:'창작 체조', totalLessons:10, color:'#2f9e44', lessons:[
    { id:'pe_4_1',  seq:1,  pages:'62~63', type:'intro',    title:'단원 도입 — 몸으로 표현해요' },
    { id:'pe_4_2',  seq:2,  pages:'64~65', type:'learn',    title:'창작 체조의 기본 동작' },
    { id:'pe_4_3',  seq:3,  pages:'66~67', type:'activity', title:'신체 표현 연습(1) — 개인' },
    { id:'pe_4_4',  seq:4,  pages:'66~67', type:'activity', title:'신체 표현 연습(2) — 짝활동' },
    { id:'pe_4_5',  seq:5,  pages:'68~69', type:'learn',    title:'표현 작품 만들기' },
    { id:'pe_4_6',  seq:6,  pages:'70~71', type:'activity', title:'모둠 창작 작품 구성(1)' },
    { id:'pe_4_7',  seq:7,  pages:'70~71', type:'activity', title:'모둠 창작 작품 구성(2)' },
    { id:'pe_4_8',  seq:8,  pages:'72~73', type:'activity', title:'발표 연습' },
    { id:'pe_4_9',  seq:9,  pages:'74~75', type:'play',     title:'창작 작품 발표회' },
    { id:'pe_4_10', seq:10, pages:'76~77', type:'review',   title:'표현 활동 평가' },
  ]},
  { id:'pe_u5', no:5, title:'5. 안전 — 운동과 안전', shortTitle:'운동과 안전', totalLessons:7, color:'#0c8599', lessons:[
    { id:'pe_5_1', seq:1, pages:'80~81', type:'intro',    title:'단원 도입' },
    { id:'pe_5_2', seq:2, pages:'82~83', type:'learn',    title:'운동 부상 예방과 처치' },
    { id:'pe_5_3', seq:3, pages:'84~85', type:'learn',    title:'야외 활동 안전 수칙' },
    { id:'pe_5_4', seq:4, pages:'86~87', type:'activity', title:'응급처치 방법 연습' },
    { id:'pe_5_5', seq:5, pages:'88~89', type:'activity', title:'스포츠 안전 수칙 포스터 만들기' },
    { id:'pe_5_6', seq:6, pages:'90~91', type:'play',     title:'안전 지식 퀴즈' },
    { id:'pe_5_7', seq:7, pages:'92~93', type:'review',   title:'안전 평가' },
  ]},
]);

/* ── 미술 5-1 (32차시) ──────────────────────────────────────── */
_buildSubjectData('미술', [
  { id:'art_u1', no:1, title:'1. 자연에서 얻은 아이디어', shortTitle:'자연과 미술', totalLessons:8, color:'#a61e4d', lessons:[
    { id:'art_1_1', seq:1, pages:'6~7',   type:'intro',    title:'단원 도입 — 자연과 미술' },
    { id:'art_1_2', seq:2, pages:'8~9',   type:'learn',    title:'자연물의 형태와 색 관찰하기' },
    { id:'art_1_3', seq:3, pages:'10~11', type:'activity', title:'자연물로 판화 찍기(1)' },
    { id:'art_1_4', seq:4, pages:'10~11', type:'activity', title:'자연물로 판화 찍기(2)' },
    { id:'art_1_5', seq:5, pages:'12~13', type:'activity', title:'자연물을 이용한 콜라주(1)' },
    { id:'art_1_6', seq:6, pages:'12~13', type:'activity', title:'자연물을 이용한 콜라주(2)' },
    { id:'art_1_7', seq:7, pages:'14~15', type:'play',     title:'자연물 아트 전시하기' },
    { id:'art_1_8', seq:8, pages:'16~17', type:'review',   title:'단원 감상 및 평가' },
  ]},
  { id:'art_u2', no:2, title:'2. 다양한 재료로 표현해요', shortTitle:'다양한 재료', totalLessons:8, color:'#c2255c', lessons:[
    { id:'art_2_1', seq:1, pages:'20~21', type:'intro',    title:'단원 도입 — 다양한 재료 탐색' },
    { id:'art_2_2', seq:2, pages:'22~23', type:'learn',    title:'혼합 재료의 특성과 활용법' },
    { id:'art_2_3', seq:3, pages:'24~25', type:'activity', title:'아크릴 물감으로 그리기(1)' },
    { id:'art_2_4', seq:4, pages:'24~25', type:'activity', title:'아크릴 물감으로 그리기(2)' },
    { id:'art_2_5', seq:5, pages:'26~27', type:'activity', title:'스크래치 기법으로 표현하기' },
    { id:'art_2_6', seq:6, pages:'28~29', type:'activity', title:'입체 작품 만들기(1)' },
    { id:'art_2_7', seq:7, pages:'28~29', type:'activity', title:'입체 작품 만들기(2)' },
    { id:'art_2_8', seq:8, pages:'30~31', type:'review',   title:'단원 감상 및 평가' },
  ]},
  { id:'art_u3', no:3, title:'3. 주제를 담은 그림', shortTitle:'주제 그림', totalLessons:8, color:'#d6336c', lessons:[
    { id:'art_3_1', seq:1, pages:'34~35', type:'intro',    title:'단원 도입 — 이야기를 그림으로' },
    { id:'art_3_2', seq:2, pages:'36~37', type:'learn',    title:'스토리 이미지 구성 방법' },
    { id:'art_3_3', seq:3, pages:'38~39', type:'activity', title:'연속 그림 그리기(1)' },
    { id:'art_3_4', seq:4, pages:'38~39', type:'activity', title:'연속 그림 그리기(2)' },
    { id:'art_3_5', seq:5, pages:'40~41', type:'activity', title:'생활 속 장면 표현하기(1)' },
    { id:'art_3_6', seq:6, pages:'40~41', type:'activity', title:'생활 속 장면 표현하기(2)' },
    { id:'art_3_7', seq:7, pages:'42~43', type:'play',     title:'이야기 그림 전시 및 감상' },
    { id:'art_3_8', seq:8, pages:'44~45', type:'review',   title:'단원 감상 및 평가' },
  ]},
  { id:'art_u4', no:4, title:'4. 미술 감상', shortTitle:'미술 감상', totalLessons:8, color:'#9c36b5', lessons:[
    { id:'art_4_1', seq:1, pages:'48~49', type:'intro',    title:'단원 도입 — 미술과 삶' },
    { id:'art_4_2', seq:2, pages:'50~51', type:'learn',    title:'시대별 미술 작품 감상' },
    { id:'art_4_3', seq:3, pages:'52~53', type:'learn',    title:'한국의 전통 미술 감상' },
    { id:'art_4_4', seq:4, pages:'54~55', type:'activity', title:'명화 모작 그리기(1)' },
    { id:'art_4_5', seq:5, pages:'54~55', type:'activity', title:'명화 모작 그리기(2)' },
    { id:'art_4_6', seq:6, pages:'56~57', type:'activity', title:'우리 지역 미술 작품 조사하기' },
    { id:'art_4_7', seq:7, pages:'58~59', type:'play',     title:'미술 작품 발표 및 비평' },
    { id:'art_4_8', seq:8, pages:'60~61', type:'review',   title:'단원 감상 및 평가' },
  ]},
]);

/* ── 실과 5-1 (32차시) ──────────────────────────────────────── */
_buildSubjectData('실과', [
  { id:'prac_u1', no:1, title:'1. 나와 가족의 생활', shortTitle:'나와 가족', totalLessons:8, color:'#5c4033', lessons:[
    { id:'prac_1_1', seq:1, pages:'6~7',   type:'intro',    title:'단원 도입 — 가정생활이란' },
    { id:'prac_1_2', seq:2, pages:'8~9',   type:'learn',    title:'가정생활 문화와 다양성' },
    { id:'prac_1_3', seq:3, pages:'10~11', type:'learn',    title:'가족 구성원의 역할과 책임' },
    { id:'prac_1_4', seq:4, pages:'12~13', type:'activity', title:'생활 도구 안전하게 사용하기' },
    { id:'prac_1_5', seq:5, pages:'14~15', type:'activity', title:'가정의 물건 정리·정돈하기(1)' },
    { id:'prac_1_6', seq:6, pages:'14~15', type:'activity', title:'가정의 물건 정리·정돈하기(2)' },
    { id:'prac_1_7', seq:7, pages:'16~17', type:'play',     title:'우리 집 정리 달인 되기' },
    { id:'prac_1_8', seq:8, pages:'18~19', type:'review',   title:'단원 평가' },
  ]},
  { id:'prac_u2', no:2, title:'2. 음식과 식생활', shortTitle:'음식과 식생활', totalLessons:8, color:'#6d4c41', lessons:[
    { id:'prac_2_1', seq:1, pages:'22~23', type:'intro',    title:'단원 도입 — 건강한 식생활' },
    { id:'prac_2_2', seq:2, pages:'24~25', type:'learn',    title:'영양소의 종류와 기능' },
    { id:'prac_2_3', seq:3, pages:'26~27', type:'learn',    title:'균형 잡힌 식사 계획하기' },
    { id:'prac_2_4', seq:4, pages:'28~29', type:'activity', title:'음식 만들기(1) — 간단한 요리' },
    { id:'prac_2_5', seq:5, pages:'28~29', type:'activity', title:'음식 만들기(2) — 요리 실습' },
    { id:'prac_2_6', seq:6, pages:'30~31', type:'activity', title:'음식 재료 손질하기' },
    { id:'prac_2_7', seq:7, pages:'32~33', type:'play',     title:'건강 도시락 만들기' },
    { id:'prac_2_8', seq:8, pages:'34~35', type:'review',   title:'단원 평가' },
  ]},
  { id:'prac_u3', no:3, title:'3. 옷과 의생활', shortTitle:'옷과 의생활', totalLessons:8, color:'#795548', lessons:[
    { id:'prac_3_1', seq:1, pages:'38~39', type:'intro',    title:'단원 도입 — 옷의 기능과 종류' },
    { id:'prac_3_2', seq:2, pages:'40~41', type:'learn',    title:'옷의 기능과 소재' },
    { id:'prac_3_3', seq:3, pages:'42~43', type:'learn',    title:'상황에 맞는 옷차림' },
    { id:'prac_3_4', seq:4, pages:'44~45', type:'activity', title:'옷 손질하기(1) — 세탁 방법' },
    { id:'prac_3_5', seq:5, pages:'44~45', type:'activity', title:'옷 손질하기(2) — 다리미질' },
    { id:'prac_3_6', seq:6, pages:'46~47', type:'activity', title:'간단한 옷 수선하기' },
    { id:'prac_3_7', seq:7, pages:'48~49', type:'play',     title:'친환경 패션 디자인하기' },
    { id:'prac_3_8', seq:8, pages:'50~51', type:'review',   title:'단원 평가' },
  ]},
  { id:'prac_u4', no:4, title:'4. 기술과 우리 생활', shortTitle:'기술과 생활', totalLessons:8, color:'#8d6e63', lessons:[
    { id:'prac_4_1', seq:1, pages:'54~55', type:'intro',    title:'단원 도입 — 기술이란 무엇일까요' },
    { id:'prac_4_2', seq:2, pages:'56~57', type:'learn',    title:'기술의 의미와 특성' },
    { id:'prac_4_3', seq:3, pages:'58~59', type:'learn',    title:'기술이 우리 생활을 어떻게 변화시켰나요' },
    { id:'prac_4_4', seq:4, pages:'60~61', type:'activity', title:'생활 속 기술 사례 탐구(1)' },
    { id:'prac_4_5', seq:5, pages:'60~61', type:'activity', title:'생활 속 기술 사례 탐구(2)' },
    { id:'prac_4_6', seq:6, pages:'62~63', type:'activity', title:'간단한 만들기 활동(1)' },
    { id:'prac_4_7', seq:7, pages:'62~63', type:'activity', title:'간단한 만들기 활동(2)' },
    { id:'prac_4_8', seq:8, pages:'64~65', type:'review',   title:'단원 평가' },
  ]},
]);

/* ── 음악 5-1 (32차시) ──────────────────────────────────────── */
_buildSubjectData('음악', [
  { id:'mus_u1', no:1, title:'1. 장단과 리듬', shortTitle:'장단과 리듬', totalLessons:8, color:'#1c3a5e', lessons:[
    { id:'mus_1_1', seq:1, pages:'6~7',   type:'intro',    title:'단원 도입 — 음악 속 리듬' },
    { id:'mus_1_2', seq:2, pages:'8~9',   type:'learn',    title:'우리나라 전통 장단 알아보기' },
    { id:'mus_1_3', seq:3, pages:'10~11', type:'activity', title:'장구 기초 주법 배우기(1)' },
    { id:'mus_1_4', seq:4, pages:'10~11', type:'activity', title:'장구 기초 주법 배우기(2)' },
    { id:'mus_1_5', seq:5, pages:'12~13', type:'learn',    title:'3박자와 4박자 리듬 패턴' },
    { id:'mus_1_6', seq:6, pages:'14~15', type:'activity', title:'리듬 악기로 연주하기' },
    { id:'mus_1_7', seq:7, pages:'16~17', type:'play',     title:'리듬 앙상블 발표하기' },
    { id:'mus_1_8', seq:8, pages:'18~19', type:'review',   title:'단원 평가' },
  ]},
  { id:'mus_u2', no:2, title:'2. 가락과 노래', shortTitle:'가락과 노래', totalLessons:8, color:'#1971c2', lessons:[
    { id:'mus_2_1', seq:1, pages:'22~23', type:'intro',    title:'단원 도입 — 노래와 가락' },
    { id:'mus_2_2', seq:2, pages:'24~25', type:'learn',    title:'바른 자세와 호흡으로 노래 부르기' },
    { id:'mus_2_3', seq:3, pages:'26~27', type:'activity', title:'한국 민요 배우기(1) — 흥부가' },
    { id:'mus_2_4', seq:4, pages:'26~27', type:'activity', title:'한국 민요 배우기(2)' },
    { id:'mus_2_5', seq:5, pages:'28~29', type:'learn',    title:'세계 여러 나라의 노래' },
    { id:'mus_2_6', seq:6, pages:'30~31', type:'activity', title:'세계 민요 배우기' },
    { id:'mus_2_7', seq:7, pages:'32~33', type:'play',     title:'노래 발표회' },
    { id:'mus_2_8', seq:8, pages:'34~35', type:'review',   title:'단원 평가' },
  ]},
  { id:'mus_u3', no:3, title:'3. 악기 연주', shortTitle:'악기 연주', totalLessons:8, color:'#1864ab', lessons:[
    { id:'mus_3_1', seq:1, pages:'38~39', type:'intro',    title:'단원 도입 — 악기의 세계' },
    { id:'mus_3_2', seq:2, pages:'40~41', type:'learn',    title:'리코더 기초 자세와 운지법' },
    { id:'mus_3_3', seq:3, pages:'42~43', type:'activity', title:'리코더 연습(1) — 기본 음계' },
    { id:'mus_3_4', seq:4, pages:'42~43', type:'activity', title:'리코더 연습(2) — 멜로디 연주' },
    { id:'mus_3_5', seq:5, pages:'44~45', type:'activity', title:'리코더 연습(3) — 합주 곡' },
    { id:'mus_3_6', seq:6, pages:'46~47', type:'activity', title:'오카리나 또는 단소 체험' },
    { id:'mus_3_7', seq:7, pages:'48~49', type:'play',     title:'악기 합주 발표하기' },
    { id:'mus_3_8', seq:8, pages:'50~51', type:'review',   title:'단원 평가' },
  ]},
  { id:'mus_u4', no:4, title:'4. 음악 감상과 창작', shortTitle:'감상과 창작', totalLessons:8, color:'#1098ad', lessons:[
    { id:'mus_4_1', seq:1, pages:'54~55', type:'intro',    title:'단원 도입 — 음악 감상의 즐거움' },
    { id:'mus_4_2', seq:2, pages:'56~57', type:'learn',    title:'클래식 음악 감상(1) — 관현악' },
    { id:'mus_4_3', seq:3, pages:'58~59', type:'learn',    title:'클래식 음악 감상(2) — 실내악' },
    { id:'mus_4_4', seq:4, pages:'60~61', type:'activity', title:'우리나라 음악 감상' },
    { id:'mus_4_5', seq:5, pages:'62~63', type:'learn',    title:'리듬 창작 방법' },
    { id:'mus_4_6', seq:6, pages:'64~65', type:'activity', title:'간단한 리듬 창작하기' },
    { id:'mus_4_7', seq:7, pages:'66~67', type:'play',     title:'음악 감상 발표 및 토론' },
    { id:'mus_4_8', seq:8, pages:'68~69', type:'review',   title:'단원 평가' },
  ]},
]);

/* ── 타 교과 패키지 빌더 ──────────────────────────────────── */
const SUBJECT_ICON_MAP = {
  과학: 'science', 사회: 'public', 영어: 'language',
  체육: 'sports_soccer', 미술: 'palette', 실과: 'handyman', 음악: 'music_note',
};
const SUBJECT_COLOR_MAP = {
  수학:'#228be6', 과학:'#0c8599', 사회:'#e67700', 영어:'#6741d9',
  체육:'#c92a2a', 미술:'#a61e4d', 실과:'#5c4033', 음악:'#1c3a5e', 국어:'#495057',
};
MOCK.SUBJECT_COLOR_MAP = SUBJECT_COLOR_MAP;

function buildSubjectMaterials(lesson, unitTitle, subjectName) {
  const t = lesson.type;
  const pages = lesson.pages;
  const icon = SUBJECT_ICON_MAP[subjectName] || 'menu_book';
  const color = SUBJECT_COLOR_MAP[subjectName] || '#228be6';

  const textbook = {
    type: 'textbook', icon: 'menu_book',
    title: `교과서 ${pages}쪽`,
    sub: `${subjectName} 5-1 | PDF 바로보기`,
    url: 'https://www.textbook.or.kr/',
  };

  const icreamBase = [
    { type: 'video',     icon: 'play_circle', title: `[강의] ${lesson.title}`, sub: `아이스크림 강의 · ${subjectName}`, url: '#' },
    { type: 'slide',     icon: 'slideshow',   title: '수업 슬라이드', sub: `PPT · 아이스크림 자료실`, url: '#' },
    { type: 'worksheet', icon: 'description', title: '활동지', sub: `PDF · A4 1장`, url: '#' },
  ];

  if (t === 'intro')    return [textbook, icreamBase[1]];
  if (t === 'learn')    return [textbook, icreamBase[0], icreamBase[1], icreamBase[2]];
  if (t === 'activity') return [textbook, icreamBase[1], icreamBase[2]];
  if (t === 'play')     return [textbook, icreamBase[1], icreamBase[2]];
  if (t === 'review')   return [textbook, icreamBase[0], icreamBase[2]];
  return [textbook];
}

MOCK.getSubjectPackage = function(lesson) {
  const subjectName = lesson.subject;
  const units = MOCK.SUBJECT_UNITS[subjectName] || [];
  const unit = units.find(u => u.id === lesson.unitId);
  if (!unit) return null;

  const adoptRates = { intro:62, learn:85, activity:74, play:70, review:80 };
  const reasons = {
    intro:    '단원 시작 전 학습 동기를 높이는 도입 자료를 준비했어요.',
    learn:    '개념 이해를 돕는 강의 영상과 확인 활동지를 구성했어요.',
    activity: '창의적 사고를 키우는 탐구 활동 자료를 준비했어요.',
    play:     '놀이를 통해 개념을 다지는 게임형 자료를 구성했어요.',
    review:   '단원 전체 내용을 점검할 수 있는 평가 자료를 준비했어요.',
  };

  return {
    id: lesson.id,
    lessonId: lesson.id,
    title: lesson.title,
    unitTitle: unit.shortTitle,
    unitNo: unit.no,
    subject: subjectName,
    seq: `${lesson.seq}/${unit.totalLessons}차시`,
    pages: lesson.pages,
    goal: lesson.title,
    duration: 40,
    type: lesson.type,
    materials: buildSubjectMaterials(lesson, unit.shortTitle, subjectName),
    thinkbell: {
      board: { title: `${lesson.title} — 모둠 활동`, url: 'https://www.tkbell.co.kr' },
      quiz: lesson.type === 'review' || lesson.type === 'learn'
        ? { title: `${lesson.title} 퀴즈`, quizTopic: lesson.title }
        : null,
    },
    tags: lesson.tags || [],
    estimatedAdoptRate: adoptRates[lesson.type] || 75,
    reason: reasons[lesson.type] || '',
  };
};

/* ── 주간 스케줄 관리 ────────────────────────────────────────
   슬롯 키: "day-period" (0-indexed, 예: "1-5" = 화요일 6교시)
   localStorage 키: icepack_schedule
   구조: { "YYYY-Www": { "day-period": { lessonId, status } } }
─────────────────────────────────────────────────────────── */

// Math 슬롯 정의 (index.html의 MATH_SLOTS와 동기화)
const _MATH_SLOTS_DEF = [
  { day: 1, period: 5 }, // 화 6교시
  { day: 2, period: 4 }, // 수 5교시
  { day: 3, period: 1 }, // 목 2교시
  { day: 4, period: 5 }, // 금 6교시
];

MOCK.getMathSlots = function() { return _MATH_SLOTS_DEF; };

MOCK.getISOWeek = function(date) {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  // ISO 8601: 주의 첫날은 월요일, 첫 번째 주는 그 해의 첫 번째 목요일을 포함하는 주
  const dayNum = d.getUTCDay() || 7; // 1(Mon)..7(Sun)
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
  return `${d.getUTCFullYear()}-W${String(weekNo).padStart(2, '0')}`;
};

// ISO 주 문자열("YYYY-Www")에서 해당 주 월요일 Date 반환
MOCK.weekStrToMonday = function(weekStr) {
  const [yearStr, wStr] = weekStr.split('-W');
  const year = parseInt(yearStr, 10);
  const week = parseInt(wStr, 10);
  const jan4 = new Date(Date.UTC(year, 0, 4)); // 1월 4일은 항상 1주차에 포함
  const jan4Day = jan4.getUTCDay() || 7;
  const monday = new Date(jan4);
  monday.setUTCDate(jan4.getUTCDate() - (jan4Day - 1) + (week - 1) * 7);
  return monday;
};

// 이전/다음 주 ISO 문자열 반환
MOCK.offsetWeek = function(weekStr, delta) {
  const monday = MOCK.weekStrToMonday(weekStr);
  monday.setUTCDate(monday.getUTCDate() + delta * 7);
  return MOCK.getISOWeek(new Date(monday.getUTCFullYear(), monday.getUTCMonth(), monday.getUTCDate()));
};

// 진행 상태 기반 기본 스케줄 생성 (특정 주에 편집 없을 때 사용)
MOCK.getDefaultWeekSchedule = function(weekStr) {
  const progress = MOCK.getProgress();
  const currentIdx = progress.currentIdx;
  const completedSet = MOCK.getCompletedSet();

  // 이번 주 월요일과 오늘 날짜
  const monday = MOCK.weekStrToMonday(weekStr);
  const today = new Date();
  const todayMonday = MOCK.weekStrToMonday(MOCK.getISOWeek(today));
  const isCurrentWeek = monday.getTime() === todayMonday.getTime();

  // 지난 슬롯 수 계산 (현재 주인 경우에만 의미 있음)
  let passedSlots = 0;
  if (isCurrentWeek) {
    const dow = today.getDay(); // 0=Sun, 2=Mon..6=Sat
    // MATH_SLOTS 순서: 화(1), 수(2), 목(3), 금(4) → DOW_TO_SLOT: {2:0, 3:1, 4:2, 5:3}
    const DOW_TO_SLOT = { 2: 0, 3: 1, 4: 2, 5: 3 };
    const todaySlot = DOW_TO_SLOT[dow] ?? -1;
    passedSlots = todaySlot >= 0 ? todaySlot : 0;
  }

  // 미래 주는 현재 진행 기준으로 다음 차시들을 순차 할당
  // 과거 주는 이미 완료된 차시 기준으로 역산
  const weekOffset = Math.round((monday.getTime() - todayMonday.getTime()) / (7 * 86400000));
  const baseIdx = currentIdx - passedSlots + weekOffset * _MATH_SLOTS_DEF.length;

  // 현재 주차 (0-indexed, 수학 기준)
  const currentWeek = Math.floor((currentIdx - passedSlots) / _MATH_SLOTS_DEF.length);
  const targetWeekIdx = currentWeek + weekOffset;

  const schedule = {};

  // 수학 슬롯
  _MATH_SLOTS_DEF.forEach((slot, i) => {
    const li = baseIdx + i;
    if (li >= 0 && li < MOCK.ALL_LESSONS.length) {
      const lesson = MOCK.ALL_LESSONS[li];
      schedule[`${slot.day}-${slot.period}`] = {
        lessonId: lesson.id,
        status: completedSet.has(lesson.id) ? 'completed' : 'planned',
        subject: '수학',
      };
    }
  });

  // 타 교과 슬롯 — 수학 주차 기반으로 동기화
  Object.entries(SUBJECT_SLOTS).forEach(([subjectName, slots]) => {
    const subjectLessons = MOCK.SUBJECT_LESSONS[subjectName];
    if (!subjectLessons || !subjectLessons.length) return;
    const subjectBaseIdx = targetWeekIdx * slots.length;
    slots.forEach((slot, i) => {
      const li = subjectBaseIdx + i;
      if (li >= 0 && li < subjectLessons.length) {
        const lesson = subjectLessons[li];
        schedule[`${slot.day}-${slot.period}`] = {
          lessonId: lesson.id,
          status: 'planned',
          subject: subjectName,
        };
      }
    });
  });

  return schedule;
};

// 모든 교과에서 lessonId로 차시 찾기
MOCK.findLesson = function(lessonId) {
  if (!lessonId) return null;
  // 수학 먼저
  const math = MOCK.ALL_LESSONS.find(l => l.id === lessonId);
  if (math) return { lesson: math, subject: '수학' };
  // 타 교과
  for (const [subjectName, lessons] of Object.entries(MOCK.SUBJECT_LESSONS)) {
    const found = lessons.find(l => l.id === lessonId);
    if (found) return { lesson: found, subject: subjectName };
  }
  return null;
};

MOCK.getWeekSchedule = function(weekStr) {
  try {
    const all = JSON.parse(localStorage.getItem('icepack_schedule') || '{}');
    if (all[weekStr]) return all[weekStr];
  } catch {}
  return MOCK.getDefaultWeekSchedule(weekStr);
};

MOCK.saveWeekSchedule = function(weekStr, schedule) {
  try {
    const all = JSON.parse(localStorage.getItem('icepack_schedule') || '{}');
    all[weekStr] = schedule;
    localStorage.setItem('icepack_schedule', JSON.stringify(all));
  } catch {}
};

MOCK.swapSlots = function(weekStr, keyA, keyB) {
  const sched = MOCK.getWeekSchedule(weekStr);
  const tmp = sched[keyA];
  sched[keyA] = sched[keyB] || null;
  sched[keyB] = tmp || null;
  // null인 슬롯은 제거
  if (!sched[keyA]) delete sched[keyA];
  if (!sched[keyB]) delete sched[keyB];
  MOCK.saveWeekSchedule(weekStr, sched);
};

MOCK.deleteSlot = function(weekStr, key) {
  const sched = MOCK.getWeekSchedule(weekStr);
  const cancelledData = sched[key];

  // 취소되는 슬롯의 실제 교과 및 커리큘럼 순서 파악
  let subj = null, allSubjLessons = null, orderedKeys = null;

  if (cancelledData && cancelledData.lessonId) {
    const found = MOCK.findLesson(cancelledData.lessonId);
    subj = found ? found.subject : null;
  }

  if (subj === '수학') {
    allSubjLessons = MOCK.ALL_LESSONS;
    orderedKeys = _MATH_SLOTS_DEF.map(s => `${s.day}-${s.period}`);
  } else if (subj && SUBJECT_SLOTS[subj]) {
    allSubjLessons = MOCK.SUBJECT_LESSONS[subj] || [];
    orderedKeys = SUBJECT_SLOTS[subj].map(s => `${s.day}-${s.period}`);
  }

  if (!orderedKeys) {
    sched[key] = { lessonId: null, status: 'cancelled' };
    MOCK.saveWeekSchedule(weekStr, sched);
    return;
  }

  const cancelIdx = orderedKeys.indexOf(key);
  if (cancelIdx === -1) {
    // 스왑으로 다른 과목 슬롯에 배치된 경우 — 단순 취소
    sched[key] = { lessonId: null, status: 'cancelled' };
    MOCK.saveWeekSchedule(weekStr, sched);
    return;
  }

  // 취소 슬롯 이후 차시들을 한 칸씩 당김
  for (let i = cancelIdx; i < orderedKeys.length - 1; i++) {
    const thisKey = orderedKeys[i];
    const nextKey = orderedKeys[i + 1];
    const nextSlot = sched[nextKey];
    if (nextSlot && nextSlot.lessonId) {
      sched[thisKey] = { lessonId: nextSlot.lessonId, status: nextSlot.status || 'planned' };
    } else {
      delete sched[thisKey];
    }
  }

  // 마지막 슬롯: 커리큘럼에서 다음 차시 가져오기
  const lastKey = orderedKeys[orderedKeys.length - 1];
  const lastSlotData = sched[lastKey]; // 아직 이동 전 원본 값
  const lastLessonId = lastSlotData && lastSlotData.lessonId ? lastSlotData.lessonId : null;

  let nextLessonId = null;
  if (lastLessonId) {
    const lastIdx = allSubjLessons.findIndex(l => l.id === lastLessonId);
    if (lastIdx >= 0 && lastIdx + 1 < allSubjLessons.length) {
      nextLessonId = allSubjLessons[lastIdx + 1].id;
    }
  }

  if (nextLessonId) {
    sched[lastKey] = { lessonId: nextLessonId, status: 'planned' };
  } else {
    delete sched[lastKey];
  }

  MOCK.saveWeekSchedule(weekStr, sched);
};
