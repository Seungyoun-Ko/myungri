// ============================================================
// 사주팔자 계산 엔진 (Four Pillars Calculator Engine)
// ============================================================

// ---- 천간 (天干, Heavenly Stems) ----
const CHEONGAN = ['갑','을','병','정','무','기','경','신','임','계'];
const CHEONGAN_HANJA = ['甲','乙','丙','丁','戊','己','庚','辛','壬','癸'];

// ---- 지지 (地支, Earthly Branches) ----
const JIJI = ['자','축','인','묘','진','사','오','미','신','유','술','해'];
const JIJI_HANJA = ['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥'];

// ---- 띠 (12지신) ----
const DDI = ['쥐','소','호랑이','토끼','용','뱀','말','양','원숭이','닭','개','돼지'];

// ---- 오행 (五行) ----
const OHENG = ['목','화','토','금','수'];
const OHENG_HANJA = ['木','火','土','金','水'];
const OHENG_COLOR = ['#4caf50','#f44336','#ff9800','#e0e0e0','#2196f3'];

// 천간→오행 매핑
const STEM_OHENG = [0,0,1,1,2,2,3,3,4,4];
// 지지→오행 매핑
const BRANCH_OHENG = [4,2,0,0,2,1,1,2,3,3,2,4];

// 천간 음양
const STEM_YINYANG = [0,1,0,1,0,1,0,1,0,1];
// 지지 음양
const BRANCH_YINYANG = [0,1,0,1,0,1,0,1,0,1,0,1];

// ---- 십신 (十神) ----
const SIPSIN_NAME = ['비견','겁재','식신','상관','편재','정재','편관','정관','편인','정인'];
const SIPSIN_HANJA = ['比肩','劫財','食神','傷官','偏財','正財','偏官','正官','偏印','正印'];

// ---- 12운성 ----
const UNSEONG_12 = ['장생','목욕','관대','건록','제왕','쇠','병','사','묘','절','태','양'];
const UNSEONG_START = [11, 6, 2, 9, 2, 9, 5, 0, 8, 3];

// ---- 지장간 (支藏干) ----
const JIJANGGAN = [
  [8, 9],       // 子: 임, 계
  [9, 7, 5],    // 丑: 계, 신, 기
  [4, 2, 0],    // 寅: 무, 병, 갑
  [0, 1],       // 卯: 갑, 을
  [1, 9, 4],    // 辰: 을, 계, 무
  [4, 6, 2],    // 巳: 무, 경, 병
  [2, 5, 3],    // 午: 병, 기, 정
  [3, 1, 5],    // 未: 정, 을, 기
  [5, 8, 6],    // 申: 기, 임, 경
  [6, 7],       // 酉: 경, 신
  [7, 3, 4],    // 戌: 신, 정, 무
  [4, 0, 8],    // 亥: 무, 갑, 임
];

// ---- 기둥별 가중치 ----
const PILLAR_WEIGHT = {
  year: 0.10,
  month: 0.20,
  day: 0.50,
  hour: 0.20
};

// ============================================================
// 음력 데이터 (1900~2050)
// ============================================================
const LUNAR_DATA = [
  0x04bd8, 0x04ae0, 0x0a570, 0x054d5, 0x0d260, 0x0d950, 0x16554, 0x056a0, 0x09ad0, 0x055d2,
  0x04ae0, 0x0a5b6, 0x0a4d0, 0x0d250, 0x1d255, 0x0b540, 0x0d6a0, 0x0ada2, 0x095b0, 0x14977,
  0x04970, 0x0a4b0, 0x0b4b5, 0x06a50, 0x06d40, 0x1ab54, 0x02b60, 0x09570, 0x052f2, 0x04970,
  0x06566, 0x0d4a0, 0x0ea50, 0x06e95, 0x05ad0, 0x02b60, 0x186e3, 0x092e0, 0x1c8d7, 0x0c950,
  0x0d4a0, 0x1d8a6, 0x0b550, 0x056a0, 0x1a5b4, 0x025d0, 0x092d0, 0x0d2b2, 0x0a950, 0x0b557,
  0x06ca0, 0x0b550, 0x15355, 0x04da0, 0x0a5b0, 0x14573, 0x052b0, 0x0a9a8, 0x0e950, 0x06aa0,
  0x0aea6, 0x0ab50, 0x04b60, 0x0aae4, 0x0a570, 0x05260, 0x0f263, 0x0d950, 0x05b57, 0x056a0,
  0x096d0, 0x04dd5, 0x04ad0, 0x0a4d0, 0x0d4d4, 0x0d250, 0x0d558, 0x0b540, 0x0b6a0, 0x195a6,
  0x095b0, 0x049b0, 0x0a974, 0x0a4b0, 0x0b27a, 0x06a50, 0x06d40, 0x0af46, 0x0ab60, 0x09570,
  0x04af5, 0x04970, 0x064b0, 0x074a3, 0x0ea50, 0x06b58, 0x05ac0, 0x0ab60, 0x096d5, 0x092e0,
  0x0c960, 0x0d954, 0x0d4a0, 0x0da50, 0x07552, 0x056a0, 0x0abb7, 0x025d0, 0x092d0, 0x0cab5,
  0x0a950, 0x0b4a0, 0x0baa4, 0x0ad50, 0x055d9, 0x04ba0, 0x0a5b0, 0x15176, 0x052b0, 0x0a930,
  0x07954, 0x06aa0, 0x0ad50, 0x05b52, 0x04b60, 0x0a6e6, 0x0a4e0, 0x0d260, 0x0ea65, 0x0d530,
  0x05aa0, 0x076a3, 0x096d0, 0x04afb, 0x04ad0, 0x0a4d0, 0x1d0b6, 0x0d250, 0x0d520, 0x0dd45,
  0x0b5a0, 0x056d0, 0x055b2, 0x049b0, 0x0a577, 0x0a4b0, 0x0aa50, 0x1b255, 0x06d20, 0x0ada0,
  0x14b63
];

function lunarMonthDays(year) {
  const data = LUNAR_DATA[year - 1900];
  const months = [];
  for (let i = 0; i < 12; i++) {
    months.push((data >> (4 + i)) & 1 ? 30 : 29);
  }
  return months;
}

function lunarLeapMonth(year) {
  return LUNAR_DATA[year - 1900] & 0xf;
}

function lunarLeapMonthDays(year) {
  const leap = lunarLeapMonth(year);
  if (!leap) return 0;
  return (LUNAR_DATA[year - 1900] >> 16) & 1 ? 30 : 29;
}

function lunarYearDays(year) {
  let total = 0;
  const months = lunarMonthDays(year);
  for (let i = 0; i < 12; i++) total += months[i];
  total += lunarLeapMonthDays(year);
  return total;
}

function solarToLunar(sy, sm, sd) {
  const baseDate = new Date(1900, 0, 31);
  const target = new Date(sy, sm - 1, sd);
  let offset = Math.floor((target - baseDate) / 86400000);

  let lunarYear = 1900;
  let yearDays;
  while (lunarYear < 2051 && offset > 0) {
    yearDays = lunarYearDays(lunarYear);
    if (offset < yearDays) break;
    offset -= yearDays;
    lunarYear++;
  }

  const leap = lunarLeapMonth(lunarYear);
  const months = lunarMonthDays(lunarYear);
  let lunarMonth = 1;
  let isLeap = false;
  let monthDays;

  for (let i = 0; i < 12; i++) {
    monthDays = months[i];
    if (offset < monthDays) {
      lunarMonth = i + 1;
      break;
    }
    offset -= monthDays;

    if (leap === (i + 1)) {
      monthDays = lunarLeapMonthDays(lunarYear);
      if (offset < monthDays) {
        lunarMonth = i + 1;
        isLeap = true;
        break;
      }
      offset -= monthDays;
    }
    if (i === 11) lunarMonth = 12;
  }

  return { year: lunarYear, month: lunarMonth, day: offset + 1, isLeap };
}

// ============================================================
// 절기 계산
// ============================================================
const JEOLGI_NAMES = [
  '소한','대한','입춘','우수','경칩','춘분',
  '청명','곡우','입하','소만','망종','하지',
  '소서','대서','입추','처서','백로','추분',
  '한로','상강','입동','소설','대설','동지'
];

function getJD(y, m, d) {
  if (m <= 2) { y--; m += 12; }
  const A = Math.floor(y / 100);
  const B = 2 - A + Math.floor(A / 4);
  return Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + d + B - 1524.5;
}

function jdToDate(jd) {
  jd += 0.5;
  const Z = Math.floor(jd);
  const F = jd - Z;
  let A;
  if (Z < 2299161) { A = Z; }
  else {
    const alpha = Math.floor((Z - 1867216.25) / 36524.25);
    A = Z + 1 + alpha - Math.floor(alpha / 4);
  }
  const B = A + 1524;
  const C = Math.floor((B - 122.1) / 365.25);
  const D = Math.floor(365.25 * C);
  const E = Math.floor((B - D) / 30.6001);
  const day = B - D - Math.floor(30.6001 * E) + F;
  const month = (E < 14) ? E - 1 : E - 13;
  const year = (month > 2) ? C - 4716 : C - 4715;
  return { year, month, day: Math.floor(day), hour: (day % 1) * 24 };
}

function getSunLongitude(jd) {
  const T = (jd - 2451545.0) / 36525.0;
  let L0 = 280.46646 + 36000.76983 * T + 0.0003032 * T * T;
  let M = 357.52911 + 35999.05029 * T - 0.0001537 * T * T;
  M = M * Math.PI / 180;
  const C = (1.914602 - 0.004817 * T - 0.000014 * T * T) * Math.sin(M)
          + (0.019993 - 0.000101 * T) * Math.sin(2 * M)
          + 0.000289 * Math.sin(3 * M);
  let lon = L0 + C;
  const omega = 125.04 - 1934.136 * T;
  lon = lon - 0.00569 - 0.00478 * Math.sin(omega * Math.PI / 180);
  lon = ((lon % 360) + 360) % 360;
  return lon;
}

function getSolarTermDate(year, termIndex) {
  const targetLongitudes = [
    285, 300, 315, 330, 345, 0, 15, 30, 45, 60, 75, 90,
    105, 120, 135, 150, 165, 180, 195, 210, 225, 240, 255, 270
  ];

  const targetLon = targetLongitudes[termIndex];
  const monthApprox = [1.05, 1.20, 2.04, 2.19, 3.06, 3.21, 4.05, 4.20,
                       5.06, 5.21, 6.06, 6.21, 7.07, 7.23, 8.07, 8.23,
                       9.08, 9.23, 10.08, 10.23, 11.07, 11.22, 12.07, 12.22];

  const approxMonth = Math.floor(monthApprox[termIndex]);
  const approxDay = Math.round((monthApprox[termIndex] % 1) * 100);

  let jd = getJD(year, approxMonth, approxDay);

  for (let i = 0; i < 50; i++) {
    const lon = getSunLongitude(jd);
    let diff = targetLon - lon;
    if (diff > 180) diff -= 360;
    if (diff < -180) diff += 360;
    if (Math.abs(diff) < 0.0001) break;
    jd += diff / 360 * 365.25;
  }

  return jdToDate(jd);
}

const jeolgiCache = {};
function getYearJeolgi(year) {
  if (jeolgiCache[year]) return jeolgiCache[year];
  const terms = [];
  for (let i = 0; i < 24; i++) {
    const d = getSolarTermDate(year, i);
    terms.push({ name: JEOLGI_NAMES[i], month: d.month, day: d.day, hour: d.hour, index: i });
  }
  jeolgiCache[year] = terms;
  return terms;
}

// ============================================================
// 사주 계산
// ============================================================
function getDayGapjaIndex(y, m, d) {
  const jd = getJD(y, m, d);
  return ((Math.floor(jd) + 50) % 60 + 60) % 60;
}

function gapjaToStemBranch(index) {
  return { stem: index % 10, branch: index % 12 };
}

function getYearPillar(year, month, day, terms) {
  const ipchun = terms.find(t => t.name === '입춘');
  let adjYear = year;
  if (month < ipchun.month || (month === ipchun.month && day < ipchun.day)) {
    adjYear = year - 1;
  }
  const idx = ((adjYear - 4) % 60 + 60) % 60;
  return { gapja: idx, ...gapjaToStemBranch(idx) };
}

function getMonthPillar(year, month, day, yearStem, terms) {
  const jeolIp = [
    { idx: 2, branch: 2 },
    { idx: 4, branch: 3 },
    { idx: 6, branch: 4 },
    { idx: 8, branch: 5 },
    { idx: 10, branch: 6 },
    { idx: 12, branch: 7 },
    { idx: 14, branch: 8 },
    { idx: 16, branch: 9 },
    { idx: 18, branch: 10 },
    { idx: 20, branch: 11 },
    { idx: 22, branch: 0 },
    { idx: 0, branch: 1 },
  ];

  let monthBranch = 1;
  const prevTerms = getYearJeolgi(year - 1);
  const nextTerms = getYearJeolgi(year + 1);
  const allEntries = [];

  for (const ji of jeolIp) {
    let t;
    if (ji.idx === 0) {
      t = terms.find(tt => tt.index === ji.idx);
      if (month >= 11) {
        const nextSohan = nextTerms.find(tt => tt.index === 0);
        allEntries.push({ month: nextSohan.month + 12, day: nextSohan.day, branch: ji.branch });
      }
      allEntries.push({ month: t.month, day: t.day, branch: ji.branch });
    } else {
      t = terms.find(tt => tt.index === ji.idx);
      allEntries.push({ month: t.month, day: t.day, branch: ji.branch });
    }
  }

  allEntries.sort((a, b) => a.month !== b.month ? a.month - b.month : a.day - b.day);

  for (let i = allEntries.length - 1; i >= 0; i--) {
    const e = allEntries[i];
    if (month > e.month || (month === e.month && day >= e.day)) {
      monthBranch = e.branch;
      break;
    }
  }

  const monthStemStart = [2, 4, 6, 8, 0];
  const stemStart = monthStemStart[yearStem % 5];
  const monthStem = (stemStart + ((monthBranch - 2 + 12) % 12)) % 10;

  const gapja = (function() {
    for (let i = 0; i < 60; i++) {
      if (i % 10 === monthStem && i % 12 === monthBranch) return i;
    }
    return 0;
  })();

  return { gapja, stem: monthStem, branch: monthBranch };
}

function getHourPillar(hour, minute, dayStem) {
  let adjustedHour = hour;
  let adjustedMin = minute - 30;
  if (adjustedMin < 0) {
    adjustedMin += 60;
    adjustedHour -= 1;
  }
  if (adjustedHour < 0) adjustedHour += 24;

  const totalMin = adjustedHour * 60 + adjustedMin;

  let branchIdx;
  if (totalMin >= 23 * 60 || totalMin < 1 * 60) branchIdx = 0;
  else if (totalMin < 3 * 60) branchIdx = 1;
  else if (totalMin < 5 * 60) branchIdx = 2;
  else if (totalMin < 7 * 60) branchIdx = 3;
  else if (totalMin < 9 * 60) branchIdx = 4;
  else if (totalMin < 11 * 60) branchIdx = 5;
  else if (totalMin < 13 * 60) branchIdx = 6;
  else if (totalMin < 15 * 60) branchIdx = 7;
  else if (totalMin < 17 * 60) branchIdx = 8;
  else if (totalMin < 19 * 60) branchIdx = 9;
  else if (totalMin < 21 * 60) branchIdx = 10;
  else branchIdx = 11;

  const hourStemStart = [0, 2, 4, 6, 8];
  const stemStart = hourStemStart[dayStem % 5];
  const hourStem = (stemStart + branchIdx) % 10;

  const gapja = (function() {
    for (let i = 0; i < 60; i++) {
      if (i % 10 === hourStem && i % 12 === branchIdx) return i;
    }
    return 0;
  })();

  return { gapja, stem: hourStem, branch: branchIdx };
}

function calculateDaeun(yearStem, monthPillar, gender, birthYear, birthMonth, birthDay, terms) {
  const isYangStem = STEM_YINYANG[yearStem] === 0;
  const isMale = gender === 'M';
  const isForward = (isMale && isYangStem) || (!isMale && !isYangStem);

  const jeolIpIndices = [2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 0];
  const allTerms = [];

  for (let yOff = -1; yOff <= 1; yOff++) {
    const yTerms = getYearJeolgi(birthYear + yOff);
    for (const t of yTerms) {
      if (jeolIpIndices.includes(t.index)) {
        allTerms.push({
          ...t,
          year: birthYear + yOff,
          dateValue: (birthYear + yOff) * 10000 + t.month * 100 + t.day
        });
      }
    }
  }
  allTerms.sort((a, b) => a.dateValue - b.dateValue);

  const birthValue = birthYear * 10000 + birthMonth * 100 + birthDay;

  let targetTerm;
  if (isForward) {
    targetTerm = allTerms.find(t => t.dateValue > birthValue);
  } else {
    for (let i = allTerms.length - 1; i >= 0; i--) {
      if (allTerms[i].dateValue <= birthValue) {
        targetTerm = allTerms[i];
        break;
      }
    }
  }

  let daysDiff = 0;
  if (targetTerm) {
    const d1 = new Date(birthYear, birthMonth - 1, birthDay);
    const d2 = new Date(targetTerm.year, targetTerm.month - 1, targetTerm.day);
    daysDiff = Math.abs(Math.floor((d2 - d1) / 86400000));
  }

  let daeunAge = Math.floor(daysDiff / 3);
  if (daysDiff % 3 === 2) daeunAge++;

  const daeunList = [];
  let currentGapja = monthPillar.gapja;

  for (let i = 0; i < 10; i++) {
    if (isForward) {
      currentGapja = (currentGapja + 1) % 60;
    } else {
      currentGapja = (currentGapja - 1 + 60) % 60;
    }
    const age = daeunAge + i * 10;
    const calYear = birthYear + age;
    daeunList.push({
      gapja: currentGapja,
      stem: currentGapja % 10,
      branch: currentGapja % 12,
      age,
      year: calYear
    });
  }

  return { startAge: daeunAge, isForward, list: daeunList };
}

function getUnseong(stemIdx, branchIdx) {
  const start = UNSEONG_START[stemIdx];
  if (STEM_YINYANG[stemIdx] === 0) {
    return UNSEONG_12[((branchIdx - start + 12) % 12)];
  } else {
    return UNSEONG_12[((start - branchIdx + 12) % 12)];
  }
}

function getSipsin(dayStemIdx, targetStemIdx) {
  const dayOheng = STEM_OHENG[dayStemIdx];
  const targetOheng = STEM_OHENG[targetStemIdx];
  const dayYY = STEM_YINYANG[dayStemIdx];
  const targetYY = STEM_YINYANG[targetStemIdx];
  const relation = ((targetOheng - dayOheng + 5) % 5);
  const sameYY = (dayYY === targetYY) ? 0 : 1;
  return SIPSIN_NAME[relation * 2 + sameYY];
}

function getSipsinBranch(dayStemIdx, branchIdx) {
  const branchMainStem = [9,5,0,1,4,2,3,5,6,7,4,8];
  return getSipsin(dayStemIdx, branchMainStem[branchIdx]);
}
