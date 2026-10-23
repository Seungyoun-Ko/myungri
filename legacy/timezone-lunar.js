// 한국 시간대 및 서머타임, 음력 변환 시스템

/**
 * 한국 서머타임(일광절약시간) 이력
 * - 1948-1951: 6/1~9/30 (UTC+9.5)
 * - 1955-1960: 5/5~9/8 (UTC+9.5)
 * - 1987-1988: 5/10~10/10 (UTC+10)
 */
const KST_DST_HISTORY = [
  { year: 1948, start: {month: 6, day: 1}, end: {month: 9, day: 30}, offset: 0.5 },
  { year: 1949, start: {month: 6, day: 1}, end: {month: 9, day: 30}, offset: 0.5 },
  { year: 1950, start: {month: 6, day: 1}, end: {month: 9, day: 30}, offset: 0.5 },
  { year: 1951, start: {month: 6, day: 1}, end: {month: 9, day: 30}, offset: 0.5 },
  { year: 1955, start: {month: 5, day: 5}, end: {month: 9, day: 8}, offset: 0.5 },
  { year: 1956, start: {month: 5, day: 5}, end: {month: 9, day: 8}, offset: 0.5 },
  { year: 1957, start: {month: 5, day: 5}, end: {month: 9, day: 8}, offset: 0.5 },
  { year: 1958, start: {month: 5, day: 5}, end: {month: 9, day: 8}, offset: 0.5 },
  { year: 1959, start: {month: 5, day: 5}, end: {month: 9, day: 8}, offset: 0.5 },
  { year: 1960, start: {month: 5, day: 5}, end: {month: 9, day: 8}, offset: 0.5 },
  { year: 1987, start: {month: 5, day: 10}, end: {month: 10, day: 11}, offset: 1.0 },
  { year: 1988, start: {month: 5, day: 8}, end: {month: 10, day: 9}, offset: 1.0 }
];

/**
 * 한국 지역별 표준시 차이 (과거 이력)
 * 1908년 이전: 지역마다 다른 지방시 사용
 * 1908-1911: 일본 표준시 (UTC+9) 도입
 * 1912-1954: 한국 표준시 변동
 * 1954-현재: UTC+9 고정
 */
const KOREA_REGIONS = [
  { name: '서울/경기', code: 'seoul', offset: 0 },
  { name: '부산/경남', code: 'busan', offset: 0 },
  { name: '대구/경북', code: 'daegu', offset: 0 },
  { name: '인천', code: 'incheon', offset: 0 },
  { name: '광주/전남', code: 'gwangju', offset: 0 },
  { name: '대전/충남', code: 'daejeon', offset: 0 },
  { name: '울산', code: 'ulsan', offset: 0 },
  { name: '강원', code: 'gangwon', offset: 0 },
  { name: '충북', code: 'chungbuk', offset: 0 },
  { name: '전북', code: 'jeonbuk', offset: 0 },
  { name: '제주', code: 'jeju', offset: 0 }
];

/**
 * 서머타임 적용 여부 확인 및 시간 조정
 */
function applyDST(year, month, day, hour) {
  const dst = KST_DST_HISTORY.find(d => {
    if (d.year !== year) return false;

    // 시작일과 종료일 사이인지 확인
    const isAfterStart = (month > d.start.month) ||
                        (month === d.start.month && day >= d.start.day);
    const isBeforeEnd = (month < d.end.month) ||
                       (month === d.end.month && day <= d.end.day);

    return isAfterStart && isBeforeEnd;
  });

  if (dst) {
    // 서머타임이 적용되는 경우, 시간을 조정
    const adjustedHour = hour - dst.offset;
    return {
      applied: true,
      offset: dst.offset,
      adjustedHour: adjustedHour < 0 ? adjustedHour + 24 : adjustedHour,
      dayAdjust: adjustedHour < 0 ? -1 : 0,
      message: `서머타임 적용 (UTC+${9 + dst.offset})`
    };
  }

  return {
    applied: false,
    offset: 0,
    adjustedHour: hour,
    dayAdjust: 0,
    message: '서머타임 미적용'
  };
}

/**
 * 음력 데이터 (1900-2050년)
 * 각 년도의 음력 달 크기 정보 (작은달=29일, 큰달=30일)
 * 16진수로 인코딩: 1=큰달, 0=작은달
 * 윤달 정보 포함
 */
const LUNAR_DATA = {
  // 1900-1949
  1900: [0, 2, 4, 5, 6, 7, 9, 10, 11, 12, 1, 3], // 예시 데이터
  // ... (실제로는 150년치 데이터 필요)
  // 간략화를 위해 주요 연도만 포함하고, 실제 서비스에서는 전체 데이터 필요
};

/**
 * 음력 -> 양력 변환 (간략 버전)
 * 실제로는 더 정확한 천문 계산 알고리즘 필요
 */
function lunarToSolar(lunarYear, lunarMonth, lunarDay, isLeapMonth = false) {
  // 음력 1월 1일의 양력 날짜 기준점 (실제로는 천문 계산 필요)
  const baseDate = new Date(lunarYear, 0, 21); // 대략적인 기준

  // 월별 일수 계산 (대략적)
  let daysToAdd = 0;
  for (let m = 1; m < lunarMonth; m++) {
    // 음력 큰달(30일), 작은달(29일) 고려 (실제로는 LUNAR_DATA 사용)
    daysToAdd += (m % 2 === 0) ? 30 : 29;
  }
  daysToAdd += lunarDay - 1;

  // 윤달 고려 (간략화)
  if (isLeapMonth) {
    daysToAdd += 29;
  }

  const result = new Date(baseDate.getTime() + daysToAdd * 24 * 60 * 60 * 1000);

  return {
    year: result.getFullYear(),
    month: result.getMonth() + 1,
    day: result.getDate(),
    warning: '음력 변환은 근사값입니다. 정확한 변환을 위해서는 전문 천문력을 참조하세요.'
  };
}

/**
 * 음력 데이터 - 1900년부터 2100년까지
 * 형식: 0xABCDE
 * - 상위 4비트(A): 윤달이 있는 달 (0=없음, 1-12=해당 달)
 * - 하위 12비트(BCDE): 각 달의 크기 (1=30일, 0=29일)
 */
const LUNAR_MONTH_DATA = {
  1900: 0x04bd8, 1901: 0x004ae, 1902: 0x00a57, 1903: 0x054d5, 1904: 0x0d260,
  1905: 0x0d950, 1906: 0x16554, 1907: 0x056a0, 1908: 0x09ad0, 1909: 0x055d2,
  1910: 0x04ae0, 1911: 0x0a5b6, 1912: 0x0a4d0, 1913: 0x0d250, 1914: 0x1d255,
  1915: 0x0b540, 1916: 0x0d6a0, 1917: 0x0ada2, 1918: 0x095b0, 1919: 0x14977,
  1920: 0x04970, 1921: 0x0a4b0, 1922: 0x0b4b5, 1923: 0x06a50, 1924: 0x06d40,
  1925: 0x1ab54, 1926: 0x02b60, 1927: 0x09570, 1928: 0x052f2, 1929: 0x04970,
  1930: 0x06566, 1931: 0x0d4a0, 1932: 0x0ea50, 1933: 0x06e95, 1934: 0x05ad0,
  1935: 0x02b60, 1936: 0x186e3, 1937: 0x092e0, 1938: 0x1c8d7, 1939: 0x0c950,
  1940: 0x0d4a0, 1941: 0x1d8a6, 1942: 0x0b550, 1943: 0x056a0, 1944: 0x1a5b4,
  1945: 0x025d0, 1946: 0x092d0, 1947: 0x0d2b2, 1948: 0x0a950, 1949: 0x0b557,
  1950: 0x06ca0, 1951: 0x0b550, 1952: 0x15355, 1953: 0x04da0, 1954: 0x0a5b0,
  1955: 0x14573, 1956: 0x052b0, 1957: 0x0a9a8, 1958: 0x0e950, 1959: 0x06aa0,
  1960: 0x0aea6, 1961: 0x0ab50, 1962: 0x04b60, 1963: 0x0aae4, 1964: 0x0a570,
  1965: 0x05260, 1966: 0x0f263, 1967: 0x0d950, 1968: 0x05b57, 1969: 0x056a0,
  1970: 0x096d0, 1971: 0x04dd5, 1972: 0x04ad0, 1973: 0x0a4d0, 1974: 0x0d4d4,
  1975: 0x0d250, 1976: 0x0d558, 1977: 0x0b540, 1978: 0x0b6a0, 1979: 0x195a6,
  1980: 0x095b0, 1981: 0x049b0, 1982: 0x0a974, 1983: 0x0a4b0, 1984: 0x0b27a,
  1985: 0x06a50, 1986: 0x06d40, 1987: 0x0af46, 1988: 0x0ab60, 1989: 0x09570,
  1990: 0x04af5, 1991: 0x04970, 1992: 0x064b0, 1993: 0x074a3, 1994: 0x0ea50,
  1995: 0x06b58, 1996: 0x055c0, 1997: 0x0ab60, 1998: 0x096d5, 1999: 0x092e0,
  2000: 0x0c960, 2001: 0x0d954, 2002: 0x0d4a0, 2003: 0x0da50, 2004: 0x07552,
  2005: 0x056a0, 2006: 0x0abb7, 2007: 0x025d0, 2008: 0x092d0, 2009: 0x0cab5,
  2010: 0x0a950, 2011: 0x0b4a0, 2012: 0x0baa4, 2013: 0x0ad50, 2014: 0x055d9,
  2015: 0x04ba0, 2016: 0x0a5b0, 2017: 0x15176, 2018: 0x052b0, 2019: 0x0a930,
  2020: 0x07954, 2021: 0x06aa0, 2022: 0x0ad50, 2023: 0x05b52, 2024: 0x04b60,
  2025: 0x0a6e6, 2026: 0x0a4e0, 2027: 0x0d260, 2028: 0x0ea65, 2029: 0x0d530,
  2030: 0x05aa0, 2031: 0x076a3, 2032: 0x096d0, 2033: 0x04afb, 2034: 0x04ad0,
  2035: 0x0a4d0, 2036: 0x1d0b6, 2037: 0x0d250, 2038: 0x0d520, 2039: 0x0dd45,
  2040: 0x0b5a0, 2041: 0x056d0, 2042: 0x055b2, 2043: 0x049b0, 2044: 0x0a577,
  2045: 0x0a4b0, 2046: 0x0aa50, 2047: 0x1b255, 2048: 0x06d20, 2049: 0x0ada0,
  2050: 0x14b63, 2051: 0x09370, 2052: 0x049f8, 2053: 0x04970, 2054: 0x064b0,
  2055: 0x168a6, 2056: 0x0ea50, 2057: 0x06b20, 2058: 0x1a6c4, 2059: 0x0aae0,
  2060: 0x0a2e0, 2061: 0x0d2e3, 2062: 0x0c960, 2063: 0x0d557, 2064: 0x0d4a0,
  2065: 0x0da50, 2066: 0x05d55, 2067: 0x056a0, 2068: 0x0a6d0, 2069: 0x055d4,
  2070: 0x052d0, 2071: 0x0a9b8, 2072: 0x0a950, 2073: 0x0b4a0, 2074: 0x0b6a6,
  2075: 0x0ad50, 2076: 0x055a0, 2077: 0x0aba4, 2078: 0x0a5b0, 2079: 0x052b0,
  2080: 0x0b273, 2081: 0x06930, 2082: 0x07337, 2083: 0x06aa0, 2084: 0x0ad50,
  2085: 0x14b55, 2086: 0x04b60, 2087: 0x0a570, 2088: 0x054e4, 2089: 0x0d160,
  2090: 0x0e968, 2091: 0x0d520, 2092: 0x0daa0, 2093: 0x16aa6, 2094: 0x056d0,
  2095: 0x04ae0, 2096: 0x0a9d4, 2097: 0x0a2d0, 2098: 0x0d150, 2099: 0x0f252,
  2100: 0x0d520
};

/**
 * 정확한 음력->양력 변환
 */
function accurateLunarToSolar(lunarYear, lunarMonth, lunarDay, isLeapMonth = false) {
  if (!LUNAR_MONTH_DATA[lunarYear]) {
    return null; // 데이터 없음
  }

  // 음력 1월 1일의 양력 날짜 (춘절 기준점)
  const springFestival = getSpringFestival(lunarYear);

  let daysToAdd = 0;
  const yearData = LUNAR_MONTH_DATA[lunarYear];
  const leapMonth = (yearData >> 16) & 0x0F;

  // 해당 월까지의 일수 계산
  for (let m = 1; m < lunarMonth; m++) {
    const bit = 1 << (12 - m);
    const days = (yearData & bit) ? 30 : 29;
    daysToAdd += days;

    // 윤달이 현재 월 이전이면 윤달 일수 추가
    if (leapMonth > 0 && m === leapMonth && !isLeapMonth) {
      const leapBit = 1 << (12 - leapMonth);
      const leapDays = (yearData & leapBit) ? 30 : 29;
      daysToAdd += leapDays;
    }
  }

  daysToAdd += (lunarDay - 1);

  const result = new Date(springFestival.getTime() + daysToAdd * 24 * 60 * 60 * 1000);

  return {
    year: result.getFullYear(),
    month: result.getMonth() + 1,
    day: result.getDate()
  };
}

/**
 * 춘절(음력 1월 1일) 양력 날짜 - 정확한 데이터
 */
function getSpringFestival(year) {
  const springDates = {
    1900: [1, 31], 1901: [2, 19], 1902: [2, 8], 1903: [1, 29], 1904: [2, 16],
    1905: [2, 4], 1906: [1, 25], 1907: [2, 13], 1908: [2, 2], 1909: [1, 22],
    1910: [2, 10], 1911: [1, 30], 1912: [2, 18], 1913: [2, 6], 1914: [1, 26],
    1915: [2, 14], 1916: [2, 3], 1917: [1, 23], 1918: [2, 11], 1919: [2, 1],
    1920: [2, 20], 1921: [2, 8], 1922: [1, 28], 1923: [2, 16], 1924: [2, 5],
    1925: [1, 24], 1926: [2, 13], 1927: [2, 2], 1928: [1, 23], 1929: [2, 10],
    1930: [1, 30], 1931: [2, 17], 1932: [2, 6], 1933: [1, 26], 1934: [2, 14],
    1935: [2, 4], 1936: [1, 24], 1937: [2, 11], 1938: [1, 31], 1939: [2, 19],
    1940: [2, 8], 1941: [1, 27], 1942: [2, 15], 1943: [2, 5], 1944: [1, 25],
    1945: [2, 13], 1946: [2, 2], 1947: [1, 22], 1948: [2, 10], 1949: [1, 29],
    1950: [2, 17], 1951: [2, 6], 1952: [1, 27], 1953: [2, 14], 1954: [2, 3],
    1955: [1, 24], 1956: [2, 12], 1957: [1, 31], 1958: [2, 18], 1959: [2, 8],
    1960: [1, 28], 1961: [2, 15], 1962: [2, 5], 1963: [1, 25], 1964: [2, 13],
    1965: [2, 2], 1966: [1, 21], 1967: [2, 9], 1968: [1, 30], 1969: [2, 17],
    1970: [2, 6], 1971: [1, 27], 1972: [2, 15], 1973: [2, 3], 1974: [1, 23],
    1975: [2, 11], 1976: [1, 31], 1977: [2, 18], 1978: [2, 7], 1979: [1, 28],
    1980: [2, 16], 1981: [2, 5], 1982: [1, 25], 1983: [2, 13], 1984: [2, 2],
    1985: [2, 20], 1986: [2, 9], 1987: [1, 29], 1988: [2, 17], 1989: [2, 6],
    1990: [1, 27], 1991: [2, 15], 1992: [2, 4], 1993: [1, 23], 1994: [2, 10],
    1995: [1, 31], 1996: [2, 19], 1997: [2, 7], 1998: [1, 28], 1999: [2, 16],
    2000: [2, 5], 2001: [1, 24], 2002: [2, 12], 2003: [2, 1], 2004: [1, 22],
    2005: [2, 9], 2006: [1, 29], 2007: [2, 18], 2008: [2, 7], 2009: [1, 26],
    2010: [2, 14], 2011: [2, 3], 2012: [1, 23], 2013: [2, 10], 2014: [1, 31],
    2015: [2, 19], 2016: [2, 8], 2017: [1, 28], 2018: [2, 16], 2019: [2, 5],
    2020: [1, 25], 2021: [2, 12], 2022: [2, 1], 2023: [1, 22], 2024: [2, 10],
    2025: [1, 29], 2026: [2, 17], 2027: [2, 6], 2028: [1, 26], 2029: [2, 13],
    2030: [2, 3], 2031: [1, 23], 2032: [2, 11], 2033: [1, 31], 2034: [2, 19],
    2035: [2, 8], 2036: [1, 28], 2037: [2, 15], 2038: [2, 4], 2039: [1, 24],
    2040: [2, 12], 2041: [2, 1], 2042: [1, 22], 2043: [2, 10], 2044: [1, 30],
    2045: [2, 17], 2046: [2, 6], 2047: [1, 26], 2048: [2, 14], 2049: [2, 2],
    2050: [1, 23], 2051: [2, 11], 2052: [2, 1], 2053: [2, 19], 2054: [2, 8],
    2055: [1, 28], 2056: [2, 15], 2057: [2, 4], 2058: [1, 24], 2059: [2, 12],
    2060: [2, 2], 2061: [1, 21], 2062: [2, 9], 2063: [1, 29], 2064: [2, 17],
    2065: [2, 5], 2066: [1, 26], 2067: [2, 14], 2068: [2, 3], 2069: [1, 23],
    2070: [2, 11], 2071: [1, 31], 2072: [2, 19], 2073: [2, 7], 2074: [1, 27],
    2075: [2, 15], 2076: [2, 5], 2077: [1, 24], 2078: [2, 12], 2079: [2, 2],
    2080: [1, 22], 2081: [2, 9], 2082: [1, 29], 2083: [2, 17], 2084: [2, 6],
    2085: [1, 26], 2086: [2, 14], 2087: [2, 3], 2088: [1, 24], 2089: [2, 10],
    2090: [1, 30], 2091: [2, 18], 2092: [2, 7], 2093: [1, 27], 2094: [2, 15],
    2095: [2, 5], 2096: [1, 25], 2097: [2, 12], 2098: [2, 1], 2099: [1, 21],
    2100: [2, 9]
  };

  const date = springDates[year];
  if (date) {
    return new Date(year, date[0] - 1, date[1]);
  }
  return new Date(year, 1, 1); // 기본값
}

/**
 * 양력 -> 음력 변환 (역산)
 */
function solarToLunar(solarYear, solarMonth, solarDay) {
  const targetDate = new Date(solarYear, solarMonth - 1, solarDay);
  const springFestival = getSpringFestival(solarYear);

  // 목표 날짜가 춘절 이전이면 전년도 음력
  if (targetDate < springFestival) {
    return solarToLunarCalc(solarYear - 1, targetDate);
  }

  return solarToLunarCalc(solarYear, targetDate);
}

function solarToLunarCalc(lunarYear, targetDate) {
  const springFestival = getSpringFestival(lunarYear);
  const daysDiff = Math.floor((targetDate - springFestival) / (24 * 60 * 60 * 1000));

  const yearData = LUNAR_MONTH_DATA[lunarYear];
  const leapMonth = (yearData >> 16) & 0x0F;

  let daysCount = 0;
  let month = 1;
  let isLeap = false;

  while (month <= 12) {
    const bit = 1 << (12 - month);
    const monthDays = (yearData & bit) ? 30 : 29;

    if (daysCount + monthDays > daysDiff) {
      break;
    }

    daysCount += monthDays;

    // 윤달 처리
    if (month === leapMonth && !isLeap) {
      isLeap = true;
      continue;
    }

    month++;
    isLeap = false;
  }

  const day = daysDiff - daysCount + 1;

  return {
    year: lunarYear,
    month: month,
    day: day,
    isLeapMonth: isLeap
  };
}
