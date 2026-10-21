// 풀이 조각의 성향 태그 (모순 거르기용). 키: 'dm.<i>.<field>' (core는 'dm.<i>.core0' / 'dm.<i>.core1'), 'strength.<key>.<field>', 'many.<그룹>.<field>', 'none.<그룹>.<field>', 'excess.<i>', 'lack.<i>', 'geuk.<name>.<field>', 'lucky.<i>', 'spouse.<십신>', 'spouseAmount.<key>', 'phase.<name>', 'combo.<hap|chung>.<field>', 'charm', 'wealthAmount.<key>'
// 축: social(outgoing|reserved) · expression(open|private) · pace(fast|slow) · role(leader|supporter) · help(giver|receiver)
//     ideas(generator|executor) · money(spender|saver) · bond(many|few) · change(seeks|resists)
// 조각이 분명하고 중심적으로 주장하는 성향만 붙였습니다. 스트레스 문단(조건부 상태)과 행운 소개(채워 줄 기운)는 태그하지 않습니다.
export const TAGS: Record<string, string[]> = {
  // ---------------------------------------------------------------- 일간 (DAY_MASTER)
  // 0 갑목
  'dm.0.core0': ['role:leader', 'help:giver'], // "제가 해 볼게요" 손을 드는, 그늘이 되어 주려
  'dm.0.work': ['role:leader', 'ideas:generator'], // 사람을 이끄는 자리, 새 부서를 꾸리는 일 / 반복 업무는 지루
  'dm.0.love': ['expression:open', 'pace:fast'], // 돌려 말하지 않고 성큼 다가가는
  'dm.0.money': ['money:saver'], // 당장 쓰기보다 오래 자랄 곳에 심어 두는
  'dm.0.relations': ['social:reserved', 'help:giver'], // 처음엔 무뚝뚝해 보여도 / 해결책부터 찾아 주는
  // 1 을목
  'dm.1.core0': ['social:outgoing'], // 처음 가는 모임에서도 금세 분위기를 읽고
  'dm.1.core1': ['expression:private'], // 내 마음은 뒤로 미루기 쉬워요, 싫다는 말을 못 해
  'dm.1.work': ['role:supporter'], // 혼자 밀어붙이기보다 선배나 팀과 함께, 사이를 잇고 다듬는
  'dm.1.love': ['expression:private'], // 서운한 일을 바로 말하지 않고 쌓아 두다가
  'dm.1.relations': ['social:outgoing'], // 누구와도 잘 어울리고
  // 2 병화
  'dm.2.core0': ['social:outgoing', 'expression:open'], // 방이 환해진다, 모임의 중심 / 숨김없이 말해서
  'dm.2.core1': ['ideas:generator', 'expression:open'], // 여러 일을 벌였다가 / 기분이 얼굴에 그대로
  'dm.2.work': ['role:leader', 'ideas:generator', 'pace:fast'], // 앞에 나서서 / 아이디어를 내고 판을 벌이는 속도는 빠르지만
  'dm.2.love': ['expression:open'], // 표현이 아주 솔직해요
  'dm.2.money': ['money:spender'], // 쓰는 손도 큰, "오늘은 내가 살게"
  'dm.2.relations': ['social:outgoing', 'expression:open'], // 사람들이 쉽게 마음을 열어요 / 생각을 그대로 말하는 솔직함
  // 3 정화
  'dm.3.core0': ['role:supporter', 'help:giver'], // 크게 나서지 않아도 곁에 있는 사람을 조용히 데워 주는
  'dm.3.work': ['role:supporter'], // 큰 무대 앞보다 한 사람 한 사람을 돕는 자리
  'dm.3.love': ['expression:private'], // 서운함을 말하지 못해 혼자 식어
  'dm.3.money': ['money:saver'], // 평소 씀씀이는 차분하고 계획적
  'dm.3.relations': ['bond:few'], // 넓게 사귀기보다 마음 맞는 몇 사람과 깊게
  // 4 무토
  'dm.4.core0': ['role:leader', 'help:giver'], // 팀이 우왕좌왕할 때 중심을 잡는 / 사람들이 자연스럽게 기대 와요
  'dm.4.core1': ['change:resists', 'expression:private'], // 변화 앞에서 무거워지는 / 속마음을 잘 드러내지 않아
  'dm.4.work': ['pace:slow'], // 서두르지 않고 기반을 다진 뒤, 처음 속도는 느려 보여도
  'dm.4.love': ['expression:private'], // 표현이 적어서
  'dm.4.money': ['money:saver'], // 차곡차곡 모으는 데 강해요
  // 5 기토
  'dm.5.core0': ['help:giver'], // 누가 시키지 않아도 알려 주는, 손에 잡히는 도움을 먼저 건네고
  'dm.5.core1': ['expression:private'], // 내 마음은 뒤로 미루기 쉬워요, 부탁을 거절하지 못해
  'dm.5.work': ['role:supporter'], // 큰 그림을 내세우기보다 빈틈을 메우는
  'dm.5.love': ['pace:slow', 'expression:private'], // 천천히 스며드는 사랑 / 원하는 걸 말하지 않다가
  'dm.5.money': ['money:saver'], // 새지 않게 지키는 쪽
  'dm.5.relations': ['role:supporter'], // 말을 가장 많이 하진 않아도 먼저 알아채는, 연락을 이어 주는 역할
  // 6 경금
  'dm.6.core0': ['role:leader', 'pace:fast', 'help:giver'], // "이걸로 가죠" 선을 긋는 / 말보다 몸이 앞서서 / 끝까지 편을 들어 주고
  'dm.6.core1': ['expression:open'], // 틀린 걸 보면 그 자리에서 짚어야
  'dm.6.work': ['role:leader', 'pace:fast'], // 앞장서는 / 결정은 빠르게
  'dm.6.money': ['money:spender'], // 고민 없이 쓰고, 밥값을 먼저 계산
  'dm.6.relations': ['bond:few', 'social:reserved'], // 적지만 깊은 관계 / 처음엔 무뚝뚝해 보여 다가가기 어렵다
  // 7 신금
  'dm.7.core1': ['expression:private'], // 겉으로는 우아하게 웃어넘기지만 속으로는 오래 기억
  'dm.7.work': ['pace:slow'], // 빠르게 많이 해내기보다 한 가지를 정확하게
  'dm.7.love': ['expression:private'], // 서운한 일이 생겨도 바로 말하지 않고 거리를 두며
  'dm.7.relations': ['social:reserved'], // 처음 만난 사람과는 적당한 거리, 쉽게 친해지기는 어렵다
  // 8 임수
  'dm.8.core0': ['social:outgoing'], // 낯선 사람들 사이에서도 금세 물처럼 어울려요
  'dm.8.core1': ['change:seeks', 'expression:private'], // 똑같은 하루가 반복되면 답답해 방향을 틀기도 / 속마음은 깊은 물 아래 감춰
  'dm.8.work': ['ideas:generator'], // 전체 판을 읽고 전략, 규칙에 묶이면 능률이 떨어지는, 시작하는 힘
  'dm.8.love': ['expression:private'], // 깊은 감정은 쉽게 꺼내지 않아
  'dm.8.money': ['money:spender'], // 나가는 물길도 넓다, 시원하게 빠져나가
  'dm.8.relations': ['social:outgoing', 'bond:many'], // 어느 모임에 가도 금방 섞여 들고 / 여러 분야에 아는 사람이 많아
  // 9 계수
  'dm.9.core1': ['expression:private'], // 하고 싶은 말이 있어도 분위기를 깰까 봐 삼키고
  'dm.9.work': ['role:supporter'], // 눈에 띄지 않는 곳에서 흐름을 매끄럽게, 일을 슬쩍 나눠 들어요
  'dm.9.money': ['money:saver'], // 빗방울 모으듯 조금씩 쌓는
  'dm.9.relations': ['social:reserved', 'bond:few'], // 여럿이 시끌벅적하게보다 한두 명과 깊은 대화

  // ---------------------------------------------------------------- 힘의 세기 (STRENGTH)
  'strength.strong.work': ['role:leader'], // 권한이 분명하고 목표가 큰 자리
  'strength.strong.love': ['role:leader'], // 관계에서도 주도권을 잡고 이끄는
  'strength.strong.money': ['money:spender'], // 자신감이 앞서 큰 지출이나 무리한 계획
  'strength.strong.relations': ['social:outgoing', 'help:giver'], // 모임에서 자연스럽게 중심 / 도움을 받기보다 주는 쪽이 편하고
  'strength.mid.relations': ['social:outgoing'], // 어느 무리에 가도 겉돌지 않고 금방 섞여요
  'strength.weak.personality': ['role:supporter'], // 혼자 앞서기보다 함께 맞춰 가는
  'strength.weak.work': ['role:supporter'], // 든든한 팀이 있을 때, 빈틈을 메우는 일
  'strength.weak.love': ['role:supporter'], // 상대의 마음을 알아채고 맞춰 주는

  // ---------------------------------------------------------------- 가장 많은 무리 (GROUP_MANY)
  'many.비겁.relations': ['bond:many', 'role:leader'], // 친구와 동료가 많고 / 무리 안에서 대장 역할
  'many.식상.personality': ['expression:open'], // 생각을 밖으로 꺼내야 직성이, 하고 싶은 말을 참기 어려워
  'many.식상.work': ['ideas:generator'], // 아이디어를 내고 직접 만들어 보이는 / 정해진 틀 반복은 지루
  'many.식상.love': ['expression:open'], // 표현이 풍부한 연애
  'many.식상.money': ['money:spender'], // 즐거움을 위한 소비에 지갑이 잘 열려요
  'many.식상.relations': ['social:outgoing'], // 분위기를 띄우는, 처음 만난 사람과도 금방 대화
  'many.관성.work': ['ideas:executor'], // 체계가 잘 갖춰진 조직, 책임 있는 자리를 묵묵히 해내요
  'many.관성.love': ['pace:slow'], // 가볍게 시작하기보다 천천히 살펴요
  'many.관성.money': ['money:saver'], // 계획된 지출, 차곡차곡 모으는
  'many.관성.relations': ['expression:private'], // 속마음을 털어놓기 어려워해요
  'many.인성.personality': ['pace:slow', 'help:receiver'], // 행동하기 전에 충분히 생각, 시작이 늦어지고 / 도움과 보살핌을 잘 받는 복
  'many.인성.love': ['help:receiver'], // 돌봄을 받는 데 익숙해져 기대는 마음

  // ---------------------------------------------------------------- 거의 없는 무리 (GROUP_NONE)
  'none.비겁.love': ['expression:private'], // 내 의견을 숨기다 보면
  'none.식상.personality': ['expression:private', 'social:reserved'], // 속마음을 안에서 정리 / 말수가 적어 차분해 보이지만
  'none.식상.work': ['ideas:executor'], // 아이디어를 쏟아내기보다 주어진 일을 정확히
  'none.식상.love': ['expression:private'], // 말로 표현하는 게 쑥스러워요
  'none.식상.relations': ['social:reserved'], // 처음 만난 자리에서는 조용한 편이라 차갑다는 오해
  'none.재성.relations': ['social:outgoing'], // 누구나 편하게 다가오는 사람
  'none.관성.money': ['money:spender'], // 계획보다 그때그때의 필요에 따라 쓰는
  'none.인성.personality': ['pace:fast'], // 결정이 빠르고 몸이 먼저 움직여요
  'none.인성.love': ['help:giver'], // 챙기는 데는 적극적이지만 돌봄을 받는 건 어색해해요
  'none.인성.relations': ['help:giver'], // 도움을 청하는 게 익숙하지 않아 (받는 쪽이 아님)

  // ---------------------------------------------------------------- 오행 치우침 (ELEMENT_EXCESS / ELEMENT_LACK)
  'excess.0': ['ideas:generator'], // 하고 싶은 일이 끊임없이, 새 계획 앞에서 눈이 반짝
  'excess.1': ['expression:open', 'social:outgoing'], // 감정과 반응이 빠르고 환해요, 말이 먼저 / 모임 분위기가 금세 달아오르고
  'excess.2': ['change:resists', 'pace:slow'], // 변화 앞에서 "하던 대로" / 움직임은 늦어져
  'excess.3': ['expression:open'], // 아닌 건 아니라고 말할 줄 알아요
  'excess.4': ['pace:slow'], // 생각이 많고, 결정을 미루다
  'lack.0': ['ideas:executor', 'pace:slow'], // 새 일을 벌이기보다 주어진 흐름을 따르는 / 신중함, "나중에"로 미루는
  'lack.1': ['expression:private'], // 감정을 겉으로 크게 드러내지 않고, 말로 꺼내지 않아
  'lack.2': ['change:seeks'], // 변화에 잘 적응, 마음이 이리저리 옮겨 다녀
  'lack.3': ['expression:private'], // 거절을 어려워하는
  'lack.4': ['pace:fast'], // 생각보다 행동이 먼저 나가는

  // ---------------------------------------------------------------- 격국 (GEUK)
  'geuk.월겁격.weapon': ['role:leader'], // 사람을 끌어모아 함께 밀고 가는 힘
  'geuk.양인격.weapon': ['pace:fast', 'role:leader'], // 모두가 머뭇거릴 때 먼저 결정하고 밀고 나가는
  'geuk.양인격.work': ['role:leader', 'pace:fast'], // "이렇게 갑시다"라고 정리 / 속도를 앞세우다
  'geuk.식신격.work': ['ideas:executor'], // 같은 일을 반복하면서도 조금씩 더 낫게
  'geuk.상관격.work': ['ideas:generator'], // 더 나은 대안, 틀에 박힌 업무보다 새 판을 짜는 일
  'geuk.편재격.work': ['ideas:generator'], // 새 시장 찾기, 프로젝트를 크게 벌이는
  'geuk.정재격.weapon': ['ideas:executor'], // 맡은 것을 빈틈없이 차곡차곡 관리
  'geuk.정재격.work': ['ideas:executor', 'change:resists'], // 꼼꼼함이 필요한 일 / 계획에 없던 변화에 스트레스
  'geuk.정관격.weapon': ['ideas:executor'], // 정해진 약속과 절차를 지키며 한결같이
  'geuk.정관격.work': ['ideas:executor'], // 체계가 잡힌 조직, 규칙에 없는 상황에서 망설임
  'geuk.편인격.weapon': ['ideas:generator'], // 남들과 다른 각도, 아무도 생각 못 한 답
  'geuk.정인격.weapon': ['help:giver'], // 주변 사람을 따뜻하게 챙기며 함께 성장시키는
  'geuk.정인격.work': ['pace:slow'], // 준비가 완벽해질 때까지 시작을 미루기 쉬워요

  // ---------------------------------------------------------------- 배우자 자리 · 12운성 · 합충 · 매력 (love.ts)
  'spouse.겁재': ['pace:fast'], // 망설이지 않고 먼저 다가가는
  'spouse.상관': ['expression:open', 'role:leader'], // 감정 표현이 풍부 / 연애할 때 분위기를 이끄는 쪽
  'spouse.편재': ['bond:many'], // 사람을 좋아하고 활동 반경이 넓어 친구 모임과 일정이 많은
  'phase.장생': ['change:seeks'], // 새로운 환경에 금방 적응, 처음 해 보는 일에도 설레는
  'phase.목욕': ['change:seeks', 'social:outgoing'], // 새로운 경험에 민감 / 낯선 사람과도 금세 어울려요
  'phase.관대': ['social:outgoing', 'role:leader', 'pace:fast'], // 첫인사 자리에서 당당 / 앞에 나서는 걸 두려워하지 않아 / 일단 부딪쳐 봐요
  'phase.건록': ['help:giver'], // 누구에게 기대기보다 스스로 해결 (받는 쪽이 아님)
  'phase.제왕': ['social:outgoing', 'role:leader'], // 모임에서 자연스럽게 중심 / 사람들이 따라와요
  'phase.쇠': ['pace:slow'], // 앞에서 밀어붙이기보다 알맞은 때를 기다릴 줄
  'phase.병': ['help:giver'], // 먼저 괜찮냐고 물어봐 주는 사람
  'phase.묘': ['expression:private', 'money:saver'], // 겉으로 드러내기보다 안에 쌓아 두는 / 모으고 아끼는
  'phase.절': ['change:seeks'], // 미련 없이 새 길을 찾고
  'phase.태': ['ideas:generator'], // 계획과 꿈이 많고 아이디어 메모가 늘 가득
  'phase.양': ['help:receiver', 'pace:slow'], // 도움과 사랑을 자연스럽게 받는 복 / 서두르기보다 충분히 준비한 뒤
  'combo.chung.love': ['change:seeks'], // 함께 변화하고 움직이는 관계
  'combo.chung.relations': ['change:seeks', 'bond:many'], // 새로운 사람과 환경 속에서 / 넓은 인맥
  charm: ['social:outgoing'], // 처음 만난 자리에서도 눈길을 끌고 사람들이 쉽게 다가와요
};

export const OPPOSITE: Record<string, string> = {
  'social:outgoing': 'social:reserved',
  'social:reserved': 'social:outgoing',
  'expression:open': 'expression:private',
  'expression:private': 'expression:open',
  'pace:fast': 'pace:slow',
  'pace:slow': 'pace:fast',
  'role:leader': 'role:supporter',
  'role:supporter': 'role:leader',
  'help:giver': 'help:receiver',
  'help:receiver': 'help:giver',
  'ideas:generator': 'ideas:executor',
  'ideas:executor': 'ideas:generator',
  'money:spender': 'money:saver',
  'money:saver': 'money:spender',
  'bond:many': 'bond:few',
  'bond:few': 'bond:many',
  'change:seeks': 'change:resists',
  'change:resists': 'change:seeks',
};
