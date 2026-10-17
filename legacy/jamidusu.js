// 자미두수 (紫微斗數) 계산 엔진

/**
 * 12궁위 (Twelve Palaces)
 */
const PALACES = [
  { name: '명궁', hanja: '命宮', meaning: '자신의 성격과 운명', index: 0 },
  { name: '형제궁', hanja: '兄弟宮', meaning: '형제자매 관계', index: 1 },
  { name: '부처궁', hanja: '夫妻宮', meaning: '배우자와 결혼운', index: 2 },
  { name: '자녀궁', hanja: '子女宮', meaning: '자녀와의 인연', index: 3 },
  { name: '재백궁', hanja: '財帛宮', meaning: '재물과 수입', index: 4 },
  { name: '질액궁', hanja: '疾厄宮', meaning: '건강과 질병', index: 5 },
  { name: '천이궁', hanja: '遷移宮', meaning: '이동과 변화', index: 6 },
  { name: '노복궁', hanja: '奴僕宮', meaning: '친구와 부하', index: 7 },
  { name: '관록궁', hanja: '官祿宮', meaning: '직업과 사회적 지위', index: 8 },
  { name: '전택궁', hanja: '田宅宮', meaning: '부동산과 가정', index: 9 },
  { name: '복덕궁', hanja: '福德宮', meaning: '정신적 행복', index: 10 },
  { name: '부모궁', hanja: '父母宮', meaning: '부모와 윗사람', index: 11 }
];

/**
 * 14주성 (14 Main Stars)
 */
const MAIN_STARS = {
  ziwei: { name: '자미성', hanja: '紫微星', type: '帝王星', attr: '土', brightness: 5 },
  tianji: { name: '천기성', hanja: '天機星', type: '智慧星', attr: '木', brightness: 4 },
  taiyang: { name: '태양성', hanja: '太陽星', type: '貴人星', attr: '火', brightness: 5 },
  wuqu: { name: '무곡성', hanja: '武曲星', type: '財星', attr: '金', brightness: 4 },
  tiantong: { name: '천동성', hanja: '天同星', type: '福星', attr: '水', brightness: 4 },
  lianzhen: { name: '염정성', hanja: '廉貞星', type: '囚星', attr: '火', brightness: 4 },
  tianfu: { name: '천부성', hanja: '天府星', type: '財庫星', attr: '土', brightness: 5 },
  taiyin: { name: '태음성', hanja: '太陰星', type: '財星', attr: '水', brightness: 5 },
  tanglang: { name: '탐랑성', hanja: '貪狼星', type: '桃花星', attr: '水/木', brightness: 4 },
  jumen: { name: '거문성', hanja: '巨門星', type: '暗星', attr: '土/水', brightness: 4 },
  tianxiang: { name: '천상성', hanja: '天相星', type: '印星', attr: '水', brightness: 4 },
  tianliang: { name: '천량성', hanja: '天梁星', type: '蔭星', attr: '土', brightness: 4 },
  qisha: { name: '칠살성', hanja: '七殺星', type: '殺星', attr: '金', brightness: 4 },
  pojun: { name: '파군성', hanja: '破軍星', type: '耗星', attr: '水', brightness: 4 }
};

/**
 * 보조성 (Auxiliary Stars) - 주요 것만
 */
const AUX_STARS = {
  // 길성 (吉星)
  zuofu: { name: '좌보성', hanja: '左輔星', type: 'lucky' },
  youbi: { name: '우필성', hanja: '右弼星', type: 'lucky' },
  wenchang: { name: '문창성', hanja: '文昌星', type: 'lucky' },
  wenqu: { name: '문곡성', hanja: '文曲星', type: 'lucky' },
  tiankui: { name: '천괴성', hanja: '天魁星', type: 'lucky' },
  tianyue: { name: '천월성', hanja: '天鉞星', type: 'lucky' },

  // 흉성 (凶星)
  qingyang: { name: '경양성', hanja: '擎羊星', type: 'unlucky' },
  tuoluo: { name: '타라성', hanja: '陀羅星', type: 'unlucky' },
  huoxing: { name: '화성', hanja: '火星', type: 'unlucky' },
  lingxing: { name: '영성', hanja: '鈴星', type: 'unlucky' },
  dikong: { name: '지공성', hanja: '地空星', type: 'unlucky' },
  dijie: { name: '지겁성', hanja: '地劫星', type: 'unlucky' }
};

/**
 * 명궁 계산 (生月 + 生時)
 */
function calculateMingPalace(birthMonth, birthHour) {
  // 인월부터 시작 (寅=1월)
  // 자시=0, 축시=1, ... 해시=11
  const hourIndex = Math.floor(birthHour / 2);

  // 명궁 = (생월 + 생시) mod 12
  // 인월(음력 1월)은 지지 인(2)에 해당
  const monthZhi = (birthMonth + 1) % 12; // 음력 1월=인=2
  const mingPalace = (monthZhi + hourIndex) % 12;

  return mingPalace;
}

/**
 * 신궁 계산 (身宮)
 */
function calculateShenPalace(birthMonth, birthHour) {
  const hourIndex = Math.floor(birthHour / 2);
  const monthZhi = (birthMonth + 1) % 12;

  // 신궁 = (생월 - 생시 + 14) mod 12
  const shenPalace = (monthZhi - hourIndex + 14) % 12;

  return shenPalace;
}

/**
 * 자미성 위치 계산
 */
function calculateZiweiPosition(birthDay, mingPalace) {
  // 음력 생일 기준
  // 복잡한 계산식 (간략화)
  const base = Math.floor((birthDay - 1) / 10);
  const position = (mingPalace + base) % 12;

  return position;
}

/**
 * 천부성 위치 계산 (자미성과 대궁)
 */
function calculateTianfuPosition(ziweiPos) {
  return (ziweiPos + 6) % 12;
}

/**
 * 14주성 배치 계산
 */
function calculate14Stars(birthYear, birthMonth, birthDay, birthHour) {
  const mingPalace = calculateMingPalace(birthMonth, birthHour);
  const shenPalace = calculateShenPalace(birthMonth, birthHour);
  const ziweiPos = calculateZiweiPosition(birthDay, mingPalace);
  const tianfuPos = calculateTianfuPosition(ziweiPos);

  // 자미계 별들 배치 (자미성부터 시계방향)
  const ziweiGroup = {
    0: 'ziwei',
    1: 'tianji',
    2: 'taiyang',
    3: 'wuqu',
    4: 'tiantong',
    5: 'lianzhen'
  };

  // 천부계 별들 배치 (천부성부터 시계방향)
  const tianfuGroup = {
    0: 'tianfu',
    1: 'taiyin',
    2: 'tanglang',
    3: 'jumen',
    4: 'tianxiang',
    5: 'tianliang',
    6: 'qisha',
    7: 'pojun'
  };

  // 12궁에 별 배치
  const palaceStars = Array(12).fill(null).map(() => []);

  // 자미계 배치
  for (let i = 0; i < 6; i++) {
    const pos = (ziweiPos + i) % 12;
    palaceStars[pos].push(MAIN_STARS[ziweiGroup[i]]);
  }

  // 천부계 배치
  for (let i = 0; i < 8; i++) {
    const pos = (tianfuPos + i) % 12;
    const starKey = tianfuGroup[i];
    if (starKey) {
      palaceStars[pos].push(MAIN_STARS[starKey]);
    }
  }

  return {
    mingPalace,
    shenPalace,
    palaceStars,
    ziweiPosition: ziweiPos,
    tianfuPosition: tianfuPos
  };
}

/**
 * 보조성 배치 계산 (간략화)
 */
function calculateAuxStars(birthYear, birthMonth, birthDay) {
  const auxStars = Array(12).fill(null).map(() => []);

  // 년간 기준 보조성 (간략화)
  const yearStem = (birthYear - 4) % 10;

  // 좌보우필 배치 (간략)
  const zuofuPos = (yearStem + 4) % 12;
  const youbiPos = (yearStem + 10) % 12;
  auxStars[zuofuPos].push(AUX_STARS.zuofu);
  auxStars[youbiPos].push(AUX_STARS.youbi);

  // 문창문곡 배치 (간략)
  const birthHourZhi = Math.floor(birthDay / 3) % 12;
  const wenchangPos = (birthHourZhi + yearStem) % 12;
  const wenquPos = (birthHourZhi + 10 - yearStem) % 12;
  auxStars[wenchangPos].push(AUX_STARS.wenchang);
  auxStars[wenquPos].push(AUX_STARS.wenqu);

  // 경양타라 배치 (간략)
  const qingyangPos = (yearStem + 1) % 12;
  const tuoluoPos = (yearStem + 11) % 12;
  auxStars[qingyangPos].push(AUX_STARS.qingyang);
  auxStars[tuoluoPos].push(AUX_STARS.tuoluo);

  return auxStars;
}

/**
 * 종합 명반 생성
 */
function generateJamidusuChart(birthYear, birthMonth, birthDay, birthHour, gender) {
  const mainResult = calculate14Stars(birthYear, birthMonth, birthDay, birthHour);
  const auxStars = calculateAuxStars(birthYear, birthMonth, birthDay);

  // 각 궁에 주성과 보조성 합치기
  const chart = [];
  for (let i = 0; i < 12; i++) {
    const palaceIndex = (mainResult.mingPalace + i) % 12;
    chart.push({
      palace: PALACES[i],
      position: palaceIndex,
      mainStars: mainResult.palaceStars[palaceIndex] || [],
      auxStars: auxStars[palaceIndex] || [],
      isMing: palaceIndex === mainResult.mingPalace,
      isShen: palaceIndex === mainResult.shenPalace
    });
  }

  return {
    chart,
    mingPalace: mainResult.mingPalace,
    shenPalace: mainResult.shenPalace,
    birthInfo: { year: birthYear, month: birthMonth, day: birthDay, hour: birthHour, gender }
  };
}

/**
 * 궁위별 해석
 */
function interpretPalace(palaceData) {
  const { palace, mainStars, auxStars, isMing, isShen } = palaceData;

  let interpretation = `<strong>${palace.name}(${palace.hanja})</strong>: ${palace.meaning}\n`;

  if (isMing) {
    interpretation += `\n📍 <span style="color:var(--gold)">명궁(命宮)</span> - 가장 중요한 궁위입니다.\n`;
  }
  if (isShen) {
    interpretation += `\n📍 <span style="color:var(--water)">신궁(身宮)</span> - 후천적 발전 방향입니다.\n`;
  }

  if (mainStars.length > 0) {
    interpretation += `\n주성(主星):\n`;
    mainStars.forEach(star => {
      interpretation += `  • ${star.name}(${star.hanja}) - ${star.type}\n`;
      interpretation += `    ${getStarInterpretation(star, palace)}\n`;
    });
  }

  if (auxStars.length > 0) {
    interpretation += `\n보조성(輔星):\n`;
    auxStars.forEach(star => {
      interpretation += `  • ${star.name}(${star.hanja}) - ${star.type === 'lucky' ? '길성' : '흉성'}\n`;
    });
  }

  return interpretation;
}

/**
 * 별의 궁위별 해석
 */
function getStarInterpretation(star, palace) {
  const interpretations = {
    // 자미성 해석
    '자미성': {
      '명궁': '제왕의 기질로 리더십이 뛰어나고 권위를 지닙니다. 고귀한 품격과 결단력을 가지고 있습니다.',
      '재백궁': '재물운이 왕성하고 사업에서 큰 성공을 거둘 수 있습니다.',
      '관록궁': '높은 지위에 오를 수 있으며, 관직이나 경영자로 성공합니다.',
      'default': '고귀한 기운이 깃들어 있어 품격 있는 삶을 살아갑니다.'
    },
    '천기성': {
      '명궁': '지혜롭고 계획적이며, 두뇌 회전이 빠릅니다. 전략적 사고에 능합니다.',
      '관록궁': '기획, 연구, 전략 분야에서 두각을 나타냅니다.',
      'default': '똑똑하고 분석적인 면모를 보입니다.'
    },
    '태양성': {
      '명궁': '밝고 적극적이며 귀인의 도움을 많이 받습니다. 남성에게 유리합니다.',
      '부처궁': '배우자가 밝고 활동적이며, 사회생활을 활발히 합니다.',
      'default': '빛나는 존재로 주변을 밝힙니다.'
    },
    '무곡성': {
      '명궁': '강직하고 결단력 있으며, 재물을 다루는 능력이 뛰어납니다.',
      '재백궁': '돈을 버는 능력이 탁월하고, 금융 분야에 적합합니다.',
      'default': '의리 있고 강한 성품을 지닙니다.'
    },
    '천동성': {
      '명궁': '복이 많고 온화하며, 평안한 삶을 추구합니다.',
      '복덕궁': '정신적 안정과 행복을 누리며, 여유로운 삶을 즐깁니다.',
      'default': '복록이 깃든 길한 기운입니다.'
    },
    '염정성': {
      '명궁': '예리하고 카리스마가 있으나, 감정 기복이 있을 수 있습니다.',
      '관록궁': '정치, 법조계에서 활약할 수 있으나 부침이 있습니다.',
      'default': '강렬하고 복잡한 성품을 지닙니다.'
    },
    '천부성': {
      '명궁': '재물을 모으는 능력이 뛰어나고, 안정적이고 보수적입니다.',
      '재백궁': '재물 관리 능력이 탁월하고 저축을 잘합니다.',
      'default': '재고를 잘 관리하는 능력이 있습니다.'
    },
    '태음성': {
      '명궁': '섬세하고 조용하며, 여성에게 특히 길합니다. 예술적 감각이 있습니다.',
      '재백궁': '부동산이나 안정적인 투자로 재물을 모읍니다.',
      'default': '부드럽고 달 같은 기운을 지닙니다.'
    },
    '탐랑성': {
      '명궁': '다재다능하고 욕망이 강하며, 이성에게 인기가 많습니다.',
      '부처궁': '연애 경험이 많고, 배우자가 매력적입니다.',
      'default': '욕심과 재능이 함께 있습니다.'
    },
    '거문성': {
      '명궁': '말을 잘하지만 오해를 받기 쉽습니다. 법률, 언론 분야에 적합합니다.',
      '형제궁': '형제와의 관계에 갈등이 있을 수 있습니다.',
      'default': '어둠 속에서 빛을 찾는 노력이 필요합니다.'
    },
    '천상성': {
      '명궁': '겉모습이 좋고 품위 있으며, 봉사정신이 강합니다.',
      '관록궁': '공직이나 대기업에서 안정적으로 성공합니다.',
      'default': '인자하고 품격 있는 기운입니다.'
    },
    '천량성': {
      '명궁': '어른스럽고 책임감 강하며, 윗사람의 도움을 받습니다.',
      '부모궁': '부모의 은혜가 크고, 효심이 깊습니다.',
      'default': '그늘을 만들어주는 기둥 같은 존재입니다.'
    },
    '칠살성': {
      '명궁': '고독하지만 강하고, 독립적이며 개척정신이 있습니다.',
      '관록궁': '군인, 경찰, 무술인으로 성공할 수 있습니다.',
      'default': '날카롭고 결단력 있는 기운입니다.'
    },
    '파군성': {
      '명궁': '파격적이고 변화를 좋아하며, 기존 것을 깨뜨립니다.',
      '천이궁': '이동과 변화가 많고, 외국과 인연이 있습니다.',
      'default': '변화와 혁신의 기운을 가집니다.'
    }
  };

  const starInterp = interpretations[star.name];
  if (starInterp) {
    return starInterp[palace.name] || starInterp['default'] || '';
  }

  return '';
}

/**
 * 종합 운세 분석
 */
function analyzeJamidusu(chartData) {
  const { chart, mingPalace, birthInfo } = chartData;

  // 명궁 찾기
  const mingPalaceData = chart.find(p => p.position === mingPalace);

  // 주요 길흉성 카운트
  let luckyStars = 0;
  let unluckyStars = 0;

  chart.forEach(p => {
    p.auxStars.forEach(s => {
      if (s.type === 'lucky') luckyStars++;
      if (s.type === 'unlucky') unluckyStars++;
    });
  });

  const overallScore = Math.min(100, 50 + (luckyStars * 8) - (unluckyStars * 5));

  return {
    mingPalace: mingPalaceData,
    overallScore,
    luckyStars,
    unluckyStars,
    summary: generateSummary(mingPalaceData, overallScore)
  };
}

/**
 * 종합 요약 생성
 */
function generateSummary(mingPalace, score) {
  let summary = '';

  if (score >= 80) {
    summary = '명반이 매우 길하여 복록이 많고 귀인의 도움을 받습니다. 인생에서 큰 성공을 거둘 가능성이 높습니다.';
  } else if (score >= 65) {
    summary = '명반이 좋은 편으로 노력하면 좋은 결과를 얻을 수 있습니다. 길성의 도움으로 순조로운 인생입니다.';
  } else if (score >= 50) {
    summary = '명반이 보통입니다. 길흉이 섞여 있어 노력과 지혜가 필요합니다.';
  } else {
    summary = '명반에 흉성이 있어 어려움이 있을 수 있으나, 노력과 수양으로 극복할 수 있습니다.';
  }

  if (mingPalace && mingPalace.mainStars.length > 0) {
    const mainStar = mingPalace.mainStars[0];
    summary += ` 명궁에 ${mainStar.name}이 있어 ${mainStar.type}의 특성을 지닙니다.`;
  }

  return summary;
}
