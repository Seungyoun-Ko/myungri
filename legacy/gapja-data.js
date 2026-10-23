// 60갑자 조합별 특성 데이터베이스
const GAPJA_DB = [
  // 0: 갑자 (甲子)
  {
    stem: 0, branch: 0, name: '갑자', hanja: '甲子',
    personality: '강직하고 진취적인 성격으로 새로운 일을 개척하는 능력이 뛰어납니다.',
    career: '리더십이 강하여 관리직이나 사업가로 성공할 가능성이 높습니다.',
    wealth: '초년에는 고생하나 중년 이후 재물운이 상승합니다.',
    love: '정이 깊으나 고집이 세어 배우자와 충돌이 있을 수 있습니다.',
    health: '간 기능과 순환기 계통에 주의가 필요합니다.',
    strength: 75, fortune: 'stable'
  },
  // 1: 을축 (乙丑)
  {
    stem: 1, branch: 1, name: '을축', hanja: '乙丑',
    personality: '온화하고 성실하며 꾸준히 노력하는 타입입니다.',
    career: '전문직이나 기술직에서 두각을 나타냅니다.',
    wealth: '꾸준한 저축으로 안정적인 재물을 축적합니다.',
    love: '배우자에게 헌신적이며 가정을 소중히 여깁니다.',
    health: '소화기와 관절 건강에 유의해야 합니다.',
    strength: 68, fortune: 'stable'
  },
  // 2: 병인 (丙寅)
  {
    stem: 2, branch: 2, name: '병인', hanja: '丙寅',
    personality: '열정적이고 활동적이며 창의력이 풍부합니다.',
    career: '예술, 방송, 교육 분야에서 재능을 발휘합니다.',
    wealth: '기복이 있으나 큰 성공을 거둘 가능성이 있습니다.',
    love: '로맨틱하고 열정적인 사랑을 추구합니다.',
    health: '심장과 혈압 관리가 중요합니다.',
    strength: 82, fortune: 'rising'
  },
  // 3: 정묘 (丁卯)
  {
    stem: 3, branch: 3, name: '정묘', hanja: '丁卯',
    personality: '섬세하고 예민하며 예술적 감각이 뛰어납니다.',
    career: '문화예술, 디자인, 상담 분야에 적합합니다.',
    wealth: '안정적이나 큰 부를 이루기는 어렵습니다.',
    love: '감성적이고 낭만을 중시하는 연애관을 가집니다.',
    health: '신경성 질환과 눈 건강에 주의가 필요합니다.',
    strength: 71, fortune: 'stable'
  },
  // 4: 무진 (戊辰)
  {
    stem: 4, branch: 4, name: '무진', hanja: '戊辰',
    personality: '믿음직하고 포용력이 있으며 리더십이 강합니다.',
    career: '경영, 부동산, 건설 분야에서 성공합니다.',
    wealth: '토지나 부동산을 통해 큰 재물을 얻습니다.',
    love: '안정적이고 책임감 있는 관계를 추구합니다.',
    health: '위장과 당뇨에 주의해야 합니다.',
    strength: 85, fortune: 'rising'
  },
  // 5: 기사 (己巳)
  {
    stem: 5, branch: 5, name: '기사', hanja: '己巳',
    personality: '신중하고 계획적이며 분석력이 뛰어납니다.',
    career: '금융, 연구, IT 분야에 강점을 보입니다.',
    wealth: '계획적인 투자로 안정적인 재산을 형성합니다.',
    love: '신중한 선택을 하며 오래 고민하는 경향이 있습니다.',
    health: '소화기와 피부 건강에 유의가 필요합니다.',
    strength: 73, fortune: 'stable'
  },
  // 6: 경오 (庚午)
  {
    stem: 6, branch: 6, name: '경오', hanja: '庚午',
    personality: '강인하고 의지가 확고하며 승부욕이 강합니다.',
    career: '군인, 경찰, 체육인, 기업 임원으로 성공합니다.',
    wealth: '적극적인 사업으로 큰 재물을 얻을 수 있습니다.',
    love: '열정적이나 다소 독선적일 수 있습니다.',
    health: '호흡기와 근골격계 관리가 중요합니다.',
    strength: 88, fortune: 'rising'
  },
  // 7: 신미 (辛未)
  {
    stem: 7, branch: 7, name: '신미', hanja: '辛未',
    personality: '세련되고 품위 있으며 예술적 감각이 뛰어납니다.',
    career: '패션, 보석, 고급 서비스업에 적합합니다.',
    wealth: '중년 이후 안정적인 재물운이 상승합니다.',
    love: '이상적인 사랑을 추구하며 까다로운 면이 있습니다.',
    health: '호흡기와 대장 건강에 주의가 필요합니다.',
    strength: 70, fortune: 'stable'
  },
  // 8: 임신 (壬申)
  {
    stem: 8, branch: 8, name: '임신', hanja: '壬申',
    personality: '총명하고 재치 있으며 적응력이 뛰어납니다.',
    career: '무역, 유통, IT, 언론 분야에서 성공합니다.',
    wealth: '변동이 크나 큰 수익을 올릴 기회가 많습니다.',
    love: '활발하고 다양한 인간관계를 즐깁니다.',
    health: '신장과 방광 건강 관리가 중요합니다.',
    strength: 79, fortune: 'variable'
  },
  // 9: 계유 (癸酉)
  {
    stem: 9, branch: 9, name: '계유', hanja: '癸酉',
    personality: '지혜롭고 사려 깊으며 분석적 사고가 뛰어납니다.',
    career: '학자, 연구원, 회계사, 분석가로 적합합니다.',
    wealth: '계획적 저축과 투자로 안정적인 재산을 형성합니다.',
    love: '신중하고 진중한 태도로 관계를 이어갑니다.',
    health: '신경계와 생식기 건강에 유의해야 합니다.',
    strength: 76, fortune: 'stable'
  },
  // 10: 갑술 (甲戌)
  {
    stem: 0, branch: 10, name: '갑술', hanja: '甲戌',
    personality: '성실하고 책임감이 강하며 의리를 중시합니다.',
    career: '공무원, 교육자, 종교인으로 성공합니다.',
    wealth: '안정적이나 큰 부를 이루기는 쉽지 않습니다.',
    love: '진실하고 변함없는 사랑을 추구합니다.',
    health: '위장과 근골격계 건강에 주의가 필요합니다.',
    strength: 72, fortune: 'stable'
  },
  // 11: 을해 (乙亥)
  {
    stem: 1, branch: 11, name: '을해', hanja: '乙亥',
    personality: '온순하고 인정 많으며 배려심이 깊습니다.',
    career: '의료, 복지, 서비스업에서 재능을 발휘합니다.',
    wealth: '꾸준하지만 큰 재물은 기대하기 어렵습니다.',
    love: '헌신적이고 가족을 우선시합니다.',
    health: '순환기와 신장 건강 관리가 중요합니다.',
    strength: 69, fortune: 'stable'
  },
  // 12: 병자 (丙子)
  {
    stem: 2, branch: 0, name: '병자', hanja: '丙子',
    personality: '활달하고 낙천적이며 사교성이 뛰어납니다.',
    career: '영업, 마케팅, 방송, 엔터테인먼트에 적합합니다.',
    wealth: '변동이 크지만 기회를 잘 잡으면 성공합니다.',
    love: '매력적이나 변덕스러운 면이 있습니다.',
    health: '심장과 신장의 균형 유지가 중요합니다.',
    strength: 77, fortune: 'variable'
  },
  // 13: 정축 (丁丑)
  {
    stem: 3, branch: 1, name: '정축', hanja: '丁丑',
    personality: '차분하고 성실하며 인내심이 강합니다.',
    career: '회계, 세무, 법률 분야에서 성공합니다.',
    wealth: '느리지만 확실하게 재산을 축적합니다.',
    love: '신중하고 오래 생각한 후 결정합니다.',
    health: '소화기와 관절 건강에 유의가 필요합니다.',
    strength: 70, fortune: 'stable'
  },
  // 14: 무인 (戊寅)
  {
    stem: 4, branch: 2, name: '무인', hanja: '戊寅',
    personality: '당당하고 추진력이 강하며 리더십이 있습니다.',
    career: '사업가, 정치인, 군인으로 성공합니다.',
    wealth: '부동산이나 사업을 통해 큰 재물을 얻습니다.',
    love: '강한 주도권을 가지려는 경향이 있습니다.',
    health: '위장과 근육 건강에 주의해야 합니다.',
    strength: 84, fortune: 'rising'
  },
  // 15: 기묘 (己卯)
  {
    stem: 5, branch: 3, name: '기묘', hanja: '己卯',
    personality: '섬세하고 배려심 있으며 조화를 중시합니다.',
    career: '상담, 디자인, 교육, 의료 분야에 적합합니다.',
    wealth: '안정적이나 큰 변동은 없습니다.',
    love: '부드럽고 이해심 많은 관계를 추구합니다.',
    health: '소화기와 신경계 건강에 유의가 필요합니다.',
    strength: 68, fortune: 'stable'
  },
  // 16: 경진 (庚辰)
  {
    stem: 6, branch: 4, name: '경진', hanja: '庚辰',
    personality: '강인하고 결단력 있으며 야망이 큽니다.',
    career: '경영인, 건설업, 제조업에서 성공합니다.',
    wealth: '적극적인 투자로 큰 재물을 얻을 수 있습니다.',
    love: '강한 카리스마로 이성을 끌어당깁니다.',
    health: '호흡기와 위장 건강 관리가 중요합니다.',
    strength: 87, fortune: 'rising'
  },
  // 17: 신사 (辛巳)
  {
    stem: 7, branch: 5, name: '신사', hanja: '辛巳',
    personality: '지혜롭고 신중하며 통찰력이 뛰어납니다.',
    career: '연구, 전략 기획, 금융 분야에 강점이 있습니다.',
    wealth: '신중한 투자로 안정적인 수익을 냅니다.',
    love: '깊이 있는 관계를 선호하며 충성심이 강합니다.',
    health: '호흡기와 소화기 건강에 주의가 필요합니다.',
    strength: 74, fortune: 'stable'
  },
  // 18: 임오 (壬午)
  {
    stem: 8, branch: 6, name: '임오', hanja: '壬午',
    personality: '열정적이고 활동적이며 카리스마가 있습니다.',
    career: '언론, 광고, 스포츠, 엔터테인먼트에 적합합니다.',
    wealth: '변동이 크지만 큰 성공의 기회가 있습니다.',
    love: '정열적이나 지속성이 부족할 수 있습니다.',
    health: '심장과 신장의 균형 관리가 중요합니다.',
    strength: 81, fortune: 'variable'
  },
  // 19: 계미 (癸未)
  {
    stem: 9, branch: 7, name: '계미', hanja: '癸未',
    personality: '온화하고 사려 깊으며 예술적 감수성이 풍부합니다.',
    career: '예술, 문학, 상담, 종교 분야에 적합합니다.',
    wealth: '중년 이후 안정적인 재물운이 상승합니다.',
    love: '이상주의적이며 깊은 정서적 교감을 중시합니다.',
    health: '소화기와 신경계 건강에 유의해야 합니다.',
    strength: 71, fortune: 'stable'
  },
  // 20: 갑신 (甲申)
  {
    stem: 0, branch: 8, name: '갑신', hanja: '甲申',
    personality: '민첩하고 창의적이며 변화를 즐깁니다.',
    career: 'IT, 무역, 기획, 컨설팅 분야에서 성공합니다.',
    wealth: '다양한 수입원을 통해 재물을 축적합니다.',
    love: '활발하고 자유로운 관계를 선호합니다.',
    health: '간과 호흡기 건강에 주의가 필요합니다.',
    strength: 78, fortune: 'rising'
  },
  // 21: 을유 (乙酉)
  {
    stem: 1, branch: 9, name: '을유', hanja: '乙酉',
    personality: '세련되고 완벽주의적이며 분석력이 뛰어납니다.',
    career: '보석, 패션, 회계, 품질관리 분야에 적합합니다.',
    wealth: '계획적인 관리로 안정적인 재산을 형성합니다.',
    love: '이상형의 기준이 높으며 신중합니다.',
    health: '호흡기와 신경계 건강에 유의가 필요합니다.',
    strength: 72, fortune: 'stable'
  },
  // 22: 병술 (丙戌)
  {
    stem: 2, branch: 10, name: '병술', hanja: '丙戌',
    personality: '정직하고 의리 있으며 봉사정신이 강합니다.',
    career: '공공기관, 종교, 복지, 교육 분야에서 성공합니다.',
    wealth: '안정적이나 큰 부를 얻기는 어렵습니다.',
    love: '진실하고 변함없는 사랑을 추구합니다.',
    health: '심장과 위장 건강 관리가 중요합니다.',
    strength: 73, fortune: 'stable'
  },
  // 23: 정해 (丁亥)
  {
    stem: 3, branch: 11, name: '정해', hanja: '丁亥',
    personality: '온화하고 인정 많으며 직관력이 뛰어납니다.',
    career: '의료, 예술, 상담, 종교 분야에 적합합니다.',
    wealth: '꾸준하나 큰 재물은 기대하기 어렵습니다.',
    love: '헌신적이고 감성적인 사랑을 합니다.',
    health: '심장과 신장의 균형 유지가 중요합니다.',
    strength: 70, fortune: 'stable'
  },
  // 24: 무자 (戊子)
  {
    stem: 4, branch: 0, name: '무자', hanja: '戊子',
    personality: '신중하고 계획적이며 끈기가 있습니다.',
    career: '부동산, 건설, 금융, 경영 분야에서 성공합니다.',
    wealth: '토지나 건물을 통해 큰 재산을 형성합니다.',
    love: '안정과 신뢰를 중시하는 관계를 추구합니다.',
    health: '위장과 신장 건강에 주의가 필요합니다.',
    strength: 80, fortune: 'stable'
  },
  // 25: 기축 (己丑)
  {
    stem: 5, branch: 1, name: '기축', hanja: '己丑',
    personality: '성실하고 근면하며 책임감이 강합니다.',
    career: '농업, 축산, 부동산, 제조업에 적합합니다.',
    wealth: '느리지만 확실하게 재산을 축적합니다.',
    love: '현실적이고 안정적인 관계를 선호합니다.',
    health: '소화기와 관절 건강에 유의해야 합니다.',
    strength: 69, fortune: 'stable'
  },
  // 26: 경인 (庚寅)
  {
    stem: 6, branch: 2, name: '경인', hanja: '庚寅',
    personality: '용맹하고 진취적이며 개척정신이 강합니다.',
    career: '군인, 경찰, 사업가, 운동선수로 성공합니다.',
    wealth: '과감한 투자로 큰 성공을 거둘 수 있습니다.',
    love: '열정적이나 독선적일 수 있습니다.',
    health: '호흡기와 근골격계 관리가 중요합니다.',
    strength: 86, fortune: 'rising'
  },
  // 27: 신묘 (辛卯)
  {
    stem: 7, branch: 3, name: '신묘', hanja: '辛卯',
    personality: '우아하고 세련되며 예술적 감각이 뛰어납니다.',
    career: '디자인, 패션, 보석, 예술 분야에 적합합니다.',
    wealth: '중년 이후 안정적인 재물운이 상승합니다.',
    love: '낭만적이고 이상적인 사랑을 추구합니다.',
    health: '호흡기와 신경계 건강에 주의가 필요합니다.',
    strength: 71, fortune: 'stable'
  },
  // 28: 임진 (壬辰)
  {
    stem: 8, branch: 4, name: '임진', hanja: '壬辰',
    personality: '지혜롭고 포용력 있으며 리더십이 강합니다.',
    career: '정치, 경영, 교육, 종교 분야에서 성공합니다.',
    wealth: '큰 사업을 통해 대성할 가능성이 높습니다.',
    love: '카리스마 있으나 배우자에게 관대합니다.',
    health: '신장과 위장의 균형 관리가 중요합니다.',
    strength: 89, fortune: 'rising'
  },
  // 29: 계사 (癸巳)
  {
    stem: 9, branch: 5, name: '계사', hanja: '癸巳',
    personality: '지혜롭고 신중하며 통찰력이 뛰어납니다.',
    career: '학자, 연구원, 전략가, 상담사에 적합합니다.',
    wealth: '신중한 투자로 안정적인 수익을 냅니다.',
    love: '깊이 있고 진지한 관계를 선호합니다.',
    health: '신경계와 소화기 건강에 유의해야 합니다.',
    strength: 75, fortune: 'stable'
  },
  // 30: 갑오 (甲午)
  {
    stem: 0, branch: 6, name: '갑오', hanja: '甲午',
    personality: '당당하고 열정적이며 추진력이 강합니다.',
    career: '경영, 정치, 방송, 스포츠 분야에서 성공합니다.',
    wealth: '적극적인 사업으로 큰 재물을 얻습니다.',
    love: '열정적이고 솔직한 사랑을 합니다.',
    health: '간과 심장 건강 관리가 중요합니다.',
    strength: 83, fortune: 'rising'
  },
  // 31: 을미 (乙未)
  {
    stem: 1, branch: 7, name: '을미', hanja: '乙未',
    personality: '온화하고 배려심 있으며 예술적 감수성이 풍부합니다.',
    career: '예술, 복지, 교육, 의료 분야에 적합합니다.',
    wealth: '안정적이나 큰 변동은 없습니다.',
    love: '부드럽고 헌신적인 사랑을 합니다.',
    health: '소화기와 신경계 건강에 주의가 필요합니다.',
    strength: 67, fortune: 'stable'
  },
  // 32: 병신 (丙申)
  {
    stem: 2, branch: 8, name: '병신', hanja: '丙申',
    personality: '활발하고 재치 있으며 창의력이 뛰어납니다.',
    career: '광고, 기획, IT, 엔터테인먼트에서 성공합니다.',
    wealth: '변동이 크지만 큰 기회를 잡을 수 있습니다.',
    love: '활발하고 다양한 관계를 즐깁니다.',
    health: '심장과 호흡기 건강에 유의해야 합니다.',
    strength: 79, fortune: 'variable'
  },
  // 33: 정유 (丁酉)
  {
    stem: 3, branch: 9, name: '정유', hanja: '丁酉',
    personality: '섬세하고 완벽주의적이며 분석력이 뛰어납니다.',
    career: '보석, 회계, 연구, 품질관리 분야에 적합합니다.',
    wealth: '계획적인 투자로 안정적인 수익을 냅니다.',
    love: '신중하고 이상적인 사랑을 추구합니다.',
    health: '심장과 호흡기 건강 관리가 중요합니다.',
    strength: 73, fortune: 'stable'
  },
  // 34: 무술 (戊戌)
  {
    stem: 4, branch: 10, name: '무술', hanja: '戊戌',
    personality: '성실하고 책임감 강하며 의리를 중시합니다.',
    career: '공무원, 건설, 부동산, 종교 분야에서 성공합니다.',
    wealth: '부동산을 통해 안정적인 재산을 형성합니다.',
    love: '진실하고 변함없는 사랑을 합니다.',
    health: '위장과 근골격계 건강에 주의가 필요합니다.',
    strength: 76, fortune: 'stable'
  },
  // 35: 기해 (己亥)
  {
    stem: 5, branch: 11, name: '기해', hanja: '己亥',
    personality: '온순하고 인정 많으며 포용력이 있습니다.',
    career: '복지, 의료, 상담, 서비스업에 적합합니다.',
    wealth: '꾸준하지만 큰 재물은 기대하기 어렵습니다.',
    love: '헌신적이고 가족을 우선시합니다.',
    health: '소화기와 신장 건강 관리가 중요합니다.',
    strength: 68, fortune: 'stable'
  },
  // 36: 경자 (庚子)
  {
    stem: 6, branch: 0, name: '경자', hanja: '庚子',
    personality: '강인하고 결단력 있으며 리더십이 강합니다.',
    career: '경영, 군인, 경찰, 제조업에서 성공합니다.',
    wealth: '적극적인 사업으로 큰 재물을 얻을 수 있습니다.',
    love: '강한 주도권을 원하나 배우자를 존중합니다.',
    health: '호흡기와 신장 건강에 주의해야 합니다.',
    strength: 82, fortune: 'rising'
  },
  // 37: 신축 (辛丑)
  {
    stem: 7, branch: 1, name: '신축', hanja: '辛丑',
    personality: '성실하고 꾸준하며 완벽을 추구합니다.',
    career: '회계, 세무, 보석, 품질관리에 적합합니다.',
    wealth: '계획적인 저축으로 안정적인 재산을 형성합니다.',
    love: '신중하고 오래 생각한 후 결정합니다.',
    health: '호흡기와 관절 건강에 유의가 필요합니다.',
    strength: 70, fortune: 'stable'
  },
  // 38: 임인 (壬寅)
  {
    stem: 8, branch: 2, name: '임인', hanja: '壬寅',
    personality: '활동적이고 진취적이며 도전정신이 강합니다.',
    career: '무역, 유통, 언론, 스포츠에서 성공합니다.',
    wealth: '변동이 크지만 큰 성공의 기회가 있습니다.',
    love: '활발하고 열정적인 사랑을 합니다.',
    health: '신장과 근골격계 관리가 중요합니다.',
    strength: 81, fortune: 'variable'
  },
  // 39: 계묘 (癸卯)
  {
    stem: 9, branch: 3, name: '계묘', hanja: '癸卯',
    personality: '섬세하고 예술적이며 직관력이 뛰어납니다.',
    career: '예술, 문학, 상담, 디자인 분야에 적합합니다.',
    wealth: '안정적이나 큰 부를 얻기는 어렵습니다.',
    love: '낭만적이고 감성적인 사랑을 추구합니다.',
    health: '신경계와 눈 건강에 주의가 필요합니다.',
    strength: 69, fortune: 'stable'
  },
  // 40: 갑진 (甲辰)
  {
    stem: 0, branch: 4, name: '갑진', hanja: '甲辰',
    personality: '당당하고 포용력 있으며 야망이 큽니다.',
    career: '경영, 정치, 교육, 법조계에서 성공합니다.',
    wealth: '큰 사업을 통해 대성할 가능성이 높습니다.',
    love: '카리스마 있고 리더십 있는 관계를 추구합니다.',
    health: '간과 위장 건강 관리가 중요합니다.',
    strength: 88, fortune: 'rising'
  },
  // 41: 을사 (乙巳)
  {
    stem: 1, branch: 5, name: '을사', hanja: '乙巳',
    personality: '지혜롭고 신중하며 계획적입니다.',
    career: '연구, 금융, 컨설팅, 전략 기획에 적합합니다.',
    wealth: '신중한 투자로 안정적인 수익을 냅니다.',
    love: '깊이 있고 진지한 관계를 선호합니다.',
    health: '소화기와 순환기 건강에 유의해야 합니다.',
    strength: 72, fortune: 'stable'
  },
  // 42: 병오 (丙午)
  {
    stem: 2, branch: 6, name: '병오', hanja: '丙午',
    personality: '열정적이고 활동적이며 카리스마가 강합니다.',
    career: '방송, 광고, 정치, 스포츠에서 크게 성공합니다.',
    wealth: '변동이 크지만 큰 재물을 얻을 수 있습니다.',
    love: '강렬하고 열정적인 사랑을 합니다.',
    health: '심장과 혈압 관리가 매우 중요합니다.',
    strength: 90, fortune: 'rising'
  },
  // 43: 정미 (丁未)
  {
    stem: 3, branch: 7, name: '정미', hanja: '丁未',
    personality: '온화하고 사려 깊으며 예술적 감각이 뛰어납니다.',
    career: '예술, 문화, 교육, 복지 분야에 적합합니다.',
    wealth: '중년 이후 안정적인 재물운이 상승합니다.',
    love: '이상주의적이고 감성적인 사랑을 합니다.',
    health: '심장과 소화기 건강에 주의가 필요합니다.',
    strength: 71, fortune: 'stable'
  },
  // 44: 무신 (戊申)
  {
    stem: 4, branch: 8, name: '무신', hanja: '戊申',
    personality: '민첩하고 적응력 강하며 실용적입니다.',
    career: '무역, IT, 부동산, 경영 분야에서 성공합니다.',
    wealth: '다양한 수입원을 통해 큰 재물을 얻습니다.',
    love: '활발하고 자유로운 관계를 선호합니다.',
    health: '위장과 호흡기 건강 관리가 중요합니다.',
    strength: 80, fortune: 'rising'
  },
  // 45: 기유 (己酉)
  {
    stem: 5, branch: 9, name: '기유', hanja: '己酉',
    personality: '세련되고 완벽주의적이며 분석력이 뛰어납니다.',
    career: '회계, 보석, 금융, 연구 분야에 적합합니다.',
    wealth: '계획적인 관리로 안정적인 재산을 형성합니다.',
    love: '이상형의 기준이 높고 신중합니다.',
    health: '소화기와 호흡기 건강에 유의가 필요합니다.',
    strength: 73, fortune: 'stable'
  },
  // 46: 경술 (庚戌)
  {
    stem: 6, branch: 10, name: '경술', hanja: '庚戌',
    personality: '강직하고 의리 있으며 책임감이 강합니다.',
    career: '군인, 경찰, 공무원, 건설업에서 성공합니다.',
    wealth: '안정적이나 큰 부를 이루기는 쉽지 않습니다.',
    love: '진실하고 변함없는 사랑을 합니다.',
    health: '호흡기와 위장 건강에 주의해야 합니다.',
    strength: 75, fortune: 'stable'
  },
  // 47: 신해 (辛亥)
  {
    stem: 7, branch: 11, name: '신해', hanja: '辛亥',
    personality: '우아하고 인정 많으며 직관력이 뛰어납니다.',
    career: '패션, 의료, 예술, 상담 분야에 적합합니다.',
    wealth: '꾸준하나 큰 재물은 기대하기 어렵습니다.',
    love: '헌신적이고 낭만적인 사랑을 합니다.',
    health: '호흡기와 신장 건강 관리가 중요합니다.',
    strength: 70, fortune: 'stable'
  },
  // 48: 임자 (壬子)
  {
    stem: 8, branch: 0, name: '임자', hanja: '壬子',
    personality: '지혜롭고 총명하며 적응력이 뛰어납니다.',
    career: '학자, 연구원, 언론, 교육 분야에서 성공합니다.',
    wealth: '변동이 있으나 지혜로운 투자로 성공합니다.',
    love: '지적이고 깊이 있는 관계를 추구합니다.',
    health: '신장과 방광 건강에 특히 주의해야 합니다.',
    strength: 77, fortune: 'variable'
  },
  // 49: 계축 (癸丑)
  {
    stem: 9, branch: 1, name: '계축', hanja: '癸丑',
    personality: '성실하고 근면하며 사려 깊습니다.',
    career: '농업, 부동산, 회계, 연구 분야에 적합합니다.',
    wealth: '느리지만 확실하게 재산을 축적합니다.',
    love: '현실적이고 안정적인 관계를 선호합니다.',
    health: '소화기와 관절 건강에 유의가 필요합니다.',
    strength: 68, fortune: 'stable'
  },
  // 50: 갑인 (甲寅)
  {
    stem: 0, branch: 2, name: '갑인', hanja: '甲寅',
    personality: '진취적이고 개척정신이 강하며 리더십이 뛰어납니다.',
    career: '사업가, 정치인, 군인, 개척자로 성공합니다.',
    wealth: '과감한 투자로 큰 성공을 거둘 수 있습니다.',
    love: '열정적이고 주도적인 사랑을 합니다.',
    health: '간과 근골격계 관리가 중요합니다.',
    strength: 85, fortune: 'rising'
  },
  // 51: 을묘 (乙卯)
  {
    stem: 1, branch: 3, name: '을묘', hanja: '乙卯',
    personality: '온화하고 섬세하며 예술적 감각이 뛰어납니다.',
    career: '예술, 디자인, 교육, 상담 분야에 적합합니다.',
    wealth: '안정적이나 큰 변동은 없습니다.',
    love: '부드럽고 낭만적인 사랑을 추구합니다.',
    health: '간과 신경계 건강에 주의가 필요합니다.',
    strength: 67, fortune: 'stable'
  },
  // 52: 병진 (丙辰)
  {
    stem: 2, branch: 4, name: '병진', hanja: '丙辰',
    personality: '당당하고 포용력 있으며 리더십이 강합니다.',
    career: '경영, 정치, 교육, 방송 분야에서 크게 성공합니다.',
    wealth: '큰 사업을 통해 대성할 가능성이 높습니다.',
    love: '열정적이고 카리스마 있는 사랑을 합니다.',
    health: '심장과 위장의 균형 관리가 중요합니다.',
    strength: 89, fortune: 'rising'
  },
  // 53: 정사 (丁巳)
  {
    stem: 3, branch: 5, name: '정사', hanja: '丁巳',
    personality: '지혜롭고 신중하며 통찰력이 뛰어납니다.',
    career: '연구, 전략, 상담, 종교 분야에 적합합니다.',
    wealth: '신중한 투자로 안정적인 수익을 냅니다.',
    love: '깊이 있고 진지한 관계를 선호합니다.',
    health: '심장과 소화기 건강에 유의해야 합니다.',
    strength: 74, fortune: 'stable'
  },
  // 54: 무오 (戊午)
  {
    stem: 4, branch: 6, name: '무오', hanja: '戊午',
    personality: '열정적이고 추진력 강하며 리더십이 뛰어납니다.',
    career: '경영, 정치, 부동산, 건설업에서 크게 성공합니다.',
    wealth: '큰 사업을 통해 대규모 재물을 얻습니다.',
    love: '강렬하고 주도적인 사랑을 합니다.',
    health: '심장과 위장 건강 관리가 매우 중요합니다.',
    strength: 87, fortune: 'rising'
  },
  // 55: 기미 (己未)
  {
    stem: 5, branch: 7, name: '기미', hanja: '己未',
    personality: '온화하고 배려심 있으며 조화를 중시합니다.',
    career: '복지, 의료, 교육, 농업 분야에 적합합니다.',
    wealth: '안정적이나 큰 변동은 없습니다.',
    love: '헌신적이고 가족 중심적인 사랑을 합니다.',
    health: '소화기와 신경계 건강에 주의가 필요합니다.',
    strength: 68, fortune: 'stable'
  },
  // 56: 경신 (庚申)
  {
    stem: 6, branch: 8, name: '경신', hanja: '庚申',
    personality: '민첩하고 결단력 있으며 변화를 주도합니다.',
    career: 'IT, 제조업, 무역, 금융 분야에서 성공합니다.',
    wealth: '다양한 사업으로 큰 재물을 얻을 수 있습니다.',
    love: '활발하고 자유로운 관계를 선호합니다.',
    health: '호흡기와 근골격계 관리가 중요합니다.',
    strength: 82, fortune: 'rising'
  },
  // 57: 신유 (辛酉)
  {
    stem: 7, branch: 9, name: '신유', hanja: '辛酉',
    personality: '세련되고 완벽주의적이며 예리한 분석력이 있습니다.',
    career: '보석, 회계, 품질관리, 연구 분야에 최적입니다.',
    wealth: '계획적인 투자로 안정적인 재산을 형성합니다.',
    love: '이상형의 기준이 매우 높고 까다롭습니다.',
    health: '호흡기와 신경계 건강에 특히 유의해야 합니다.',
    strength: 74, fortune: 'stable'
  },
  // 58: 임술 (壬戌)
  {
    stem: 8, branch: 10, name: '임술', hanja: '壬戌',
    personality: '지혜롭고 의리 있으며 포용력이 강합니다.',
    career: '교육, 종교, 상담, 공공기관에서 성공합니다.',
    wealth: '안정적이나 큰 부를 얻기는 쉽지 않습니다.',
    love: '진실하고 책임감 있는 사랑을 합니다.',
    health: '신장과 위장의 균형 관리가 중요합니다.',
    strength: 73, fortune: 'stable'
  },
  // 59: 계해 (癸亥)
  {
    stem: 9, branch: 11, name: '계해', hanja: '癸亥',
    personality: '지혜롭고 인정 많으며 직관력이 뛰어납니다.',
    career: '학자, 의료, 예술, 종교 분야에 적합합니다.',
    wealth: '꾸준하나 큰 재물은 기대하기 어렵습니다.',
    love: '헌신적이고 깊은 정서적 교감을 중시합니다.',
    health: '신장과 순환기 건강에 특히 유의해야 합니다.',
    strength: 70, fortune: 'stable'
  }
];

// 오행 상생상극 분석 엔진
const OHENG_RELATION = {
  // 상생(生): 0=목, 1=화, 2=토, 3=금, 4=수
  generating: {
    0: 1, // 목생화
    1: 2, // 화생토
    2: 3, // 토생금
    3: 4, // 금생수
    4: 0  // 수생목
  },
  // 상극(剋)
  overcoming: {
    0: 2, // 목극토
    1: 3, // 화극금
    2: 4, // 토극수
    3: 0, // 금극목
    4: 1  // 수극화
  }
};

// 기둥별 가중치 (년주:10%, 월주:20%, 일주:50%, 시주:20%)
const PILLAR_WEIGHT = {
  year: 0.10,
  month: 0.20,
  day: 0.50,
  hour: 0.20
};

/**
 * 60갑자 인덱스로 특성 데이터 가져오기
 */
function getGapjaData(gapjaIndex) {
  return GAPJA_DB[gapjaIndex] || null;
}

/**
 * 천간+지지 조합으로 60갑자 인덱스 계산
 */
function calcGapjaIndex(stem, branch) {
  // 60갑자 공식: (천간 * 6 + 지지 * 5) % 60
  for (let i = 0; i < 60; i++) {
    if (i % 10 === stem && i % 12 === branch) {
      return i;
    }
  }
  return 0;
}

/**
 * 오행 관계 분석 (상생/상극/비화)
 */
function analyzeOhengRelation(oheng1, oheng2) {
  if (oheng1 === oheng2) {
    return { type: 'same', score: 50, desc: '비화(같은 기운)' };
  }
  if (OHENG_RELATION.generating[oheng1] === oheng2) {
    return { type: 'generate', score: 80, desc: '상생(나를 돕는 관계)' };
  }
  if (OHENG_RELATION.generating[oheng2] === oheng1) {
    return { type: 'beGenerated', score: 70, desc: '상생(내가 돕는 관계)' };
  }
  if (OHENG_RELATION.overcoming[oheng1] === oheng2) {
    return { type: 'overcome', score: 30, desc: '상극(내가 극하는 관계)' };
  }
  if (OHENG_RELATION.overcoming[oheng2] === oheng1) {
    return { type: 'beOvercome', score: 20, desc: '상극(나를 극하는 관계)' };
  }
  return { type: 'neutral', score: 50, desc: '중립' };
}

/**
 * 일주 기반 종합 성격 분석
 */
function analyzeDayPillarPersonality(dayStem, dayBranch) {
  const gapjaIdx = calcGapjaIndex(dayStem, dayBranch);
  const data = getGapjaData(gapjaIdx);

  if (!data) {
    return '일주 데이터를 찾을 수 없습니다.';
  }

  return {
    gapja: data.name + '(' + data.hanja + ')',
    personality: data.personality,
    strength: data.strength,
    fortune: data.fortune
  };
}

/**
 * 사주 전체 기둥 분석
 */
function analyzeFourPillars(yearStem, yearBranch, monthStem, monthBranch,
                             dayStem, dayBranch, hourStem, hourBranch) {
  const pillars = [
    { name: '년주', stem: yearStem, branch: yearBranch, weight: PILLAR_WEIGHT.year },
    { name: '월주', stem: monthStem, branch: monthBranch, weight: PILLAR_WEIGHT.month },
    { name: '일주', stem: dayStem, branch: dayBranch, weight: PILLAR_WEIGHT.day },
    { name: '시주', stem: hourStem, branch: hourBranch, weight: PILLAR_WEIGHT.hour }
  ];

  let totalStrength = 0;
  const pillarData = pillars.map(p => {
    const idx = calcGapjaIndex(p.stem, p.branch);
    const data = getGapjaData(idx);
    totalStrength += (data?.strength || 70) * p.weight;
    return {
      name: p.name,
      gapja: data?.name || '',
      hanja: data?.hanja || '',
      data: data,
      weight: p.weight
    };
  });

  return {
    pillars: pillarData,
    overallStrength: Math.round(totalStrength)
  };
}

/**
 * 궁합 점수 계산 (두 사람의 일주 비교)
 */
function calculateCompatibility(person1DayStem, person1DayBranch,
                                 person2DayStem, person2DayBranch) {
  const stem1Oheng = [0,0,1,1,2,2,3,3,4,4][person1DayStem];
  const stem2Oheng = [0,0,1,1,2,2,3,3,4,4][person2DayStem];
  const branch1Oheng = [4,2,0,0,2,1,1,2,3,3,2,4][person1DayBranch];
  const branch2Oheng = [4,2,0,0,2,1,1,2,3,3,2,4][person2DayBranch];

  const stemRelation = analyzeOhengRelation(stem1Oheng, stem2Oheng);
  const branchRelation = analyzeOhengRelation(branch1Oheng, branch2Oheng);

  // 천간 60%, 지지 40% 비율로 점수 계산
  const compatScore = Math.round(stemRelation.score * 0.6 + branchRelation.score * 0.4);

  return {
    score: compatScore,
    stemRelation: stemRelation,
    branchRelation: branchRelation,
    description: getCompatibilityDescription(compatScore)
  };
}

/**
 * 궁합 점수에 따른 설명
 */
function getCompatibilityDescription(score) {
  if (score >= 80) {
    return '매우 좋은 궁합입니다. 서로를 이해하고 발전시키는 관계입니다.';
  } else if (score >= 65) {
    return '좋은 궁합입니다. 서로 존중하며 안정적인 관계를 유지할 수 있습니다.';
  } else if (score >= 50) {
    return '보통 궁합입니다. 노력하면 좋은 관계를 만들 수 있습니다.';
  } else if (score >= 35) {
    return '다소 어려운 궁합입니다. 서로의 차이를 인정하고 이해하는 노력이 필요합니다.';
  } else {
    return '궁합이 좋지 않습니다. 많은 노력과 배려가 필요한 관계입니다.';
  }
}
