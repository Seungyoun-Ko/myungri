// 일주 타입 이름: 천간의 색 + 지지의 동물 (예: 경진 = 흰 용, White Dragon)
// 천간 색은 오행 색(갑을 푸른, 병정 붉은, 무기 노란, 경신 흰, 임계 검은)을 따릅니다.
const COLOR_KO = ['푸른', '푸른', '붉은', '붉은', '노란', '노란', '흰', '흰', '검은', '검은'];
const COLOR_EN = ['Blue', 'Blue', 'Red', 'Red', 'Yellow', 'Yellow', 'White', 'White', 'Black', 'Black'];
const ANIMAL_KO = ['쥐', '소', '호랑이', '토끼', '용', '뱀', '말', '양', '원숭이', '닭', '개', '돼지'];
const ANIMAL_EN = ['Rat', 'Ox', 'Tiger', 'Rabbit', 'Dragon', 'Snake', 'Horse', 'Goat', 'Monkey', 'Rooster', 'Dog', 'Pig'];

export const iljuTypeKo = (stem: number, branch: number) => `${COLOR_KO[stem]} ${ANIMAL_KO[branch]}`;
export const iljuTypeEn = (stem: number, branch: number) => `${COLOR_EN[stem]} ${ANIMAL_EN[branch]}`;
