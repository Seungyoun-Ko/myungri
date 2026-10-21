import type {
  StrengthKey,
  StrengthReading,
  GroupKey,
  GroupManyReading,
  GroupNoneReading,
} from '../types';

/** How strong the person's own energy is: strong / balanced / weak */
export const STRENGTH: Record<StrengthKey, StrengthReading> = {
  strong: {
    personality:
      'You have plenty of inner staying power. Other people\'s opinions don\'t easily sway you, and when things get stuck, you roll up your sleeves and think, "Fine, I\'ll just do it myself." When that energy runs high, it can easily come across as stubbornness. Hearing out just one more person before you decide keeps you nicely balanced.',
    work:
      'You come alive when you can take something on and push it through to the end yourself. The clearer your authority and the bigger the goal, the more your ability shows. In setups where you need permission for every little thing, frustration builds up fast. It helps to set your own deliverables and deadlines so all that drive has somewhere to go.',
    love:
      'In relationships, too, you tend to take the lead. The way you confidently pick the date spot or map out a whole trip is a big part of your charm. But if you decide before asking what your partner wants, hurt feelings can creep in. A simple "What would you like to do?" makes things so much smoother between you.',
    money:
      'You have real drive when it comes to earning, so when you spot an opportunity, you go after it yourself. The catch is that your confidence can run ahead of you, and it\'s easy to decide on a big purchase or an overly ambitious plan all on your own. Sleeping on any large decision for a day and showing the numbers to someone you trust is the habit that protects what you\'ve built.',
    relations:
      'You have a clear presence wherever you go, so you naturally end up at the center of the group. Giving help feels more comfortable to you than receiving it, and you\'re loyal enough to be the first to look after a friend who\'s struggling. Your words can land hard at times, though. Even when you\'re right, giving the other person time to sort out their feelings helps your relationships last.',
    health:
      'You have a solid physical foundation, so even when you push a little too hard, you bounce back quickly. That\'s exactly why it\'s easy to miss the signals your body sends. Work off that surplus energy with exercise that makes you sweat, and pencil your rest days into your calendar ahead of time.',
    tip: 'Before an important decision, make a point of hearing out one opposing view.',
  },
  mid: {
    personality:
      'Your own strength and the energy around you are fairly evenly matched. You know when to step forward and when to step back, so you have a steadiness that doesn\'t tip too far either way. Because being easygoing is your strength, you can be slow to answer the question "So what do you really want?"',
    work:
      'You handle both solo work and teamwork without much trouble. When a leader is needed, you step up front, and when support is needed, you back people up from behind. That flexibility is a big strength, but if you don\'t settle on the one thing you do best, you can wear yourself out taking on a bit of everything.',
    love:
      'You naturally keep the give-and-take balanced, so your relationships don\'t tilt to one side. You can match your partner\'s pace while still protecting your own life. But if you keep letting small hurts slide to avoid conflict, they can pile up, so mention even minor discomforts gently as they come up.',
    money:
      'Your sense of the line between earning and spending is fairly stable. Impulse buys don\'t throw you off much, and you don\'t clutch every dollar too tightly either. Use that balance to set up a system where a fixed amount gets saved automatically each month, and over time it builds into a solid cushion.',
    relations:
      'You rarely feel out of place in any group, and you blend in quickly. You know how to stay calm around strong personalities and be gentle around more sensitive people. But fitting in with everyone can leave you unsure who\'s really on your side, so make a point of keeping a few people close with whom you can share things deeply.',
    health:
      'Your energy levels don\'t swing much, so as long as you keep a steady daily rhythm, you stay on an even keel. That also makes it easy to brush off small bouts of tiredness. The basics, like going to bed and eating meals at consistent times, will do the most for you.',
    tip: 'Once a month, write down the one thing you most want to do right now and start on it, even in a small way.',
  },
  weak: {
    personality:
      'The energy around you tends to be bigger than your own, so you read the mood of a room and people\'s feelings quickly. You\'re better at moving together with others than racing ahead alone, and you have a gift for absorbing other people\'s strengths and making them your own. Soaking up everyone else\'s moods can wear you out, so time to yourself is a must.',
    work:
      'Your abilities bloom far more when you have a solid team or a mentor you can trust. You shine at carefully filling in the gaps and at gathering many people\'s opinions and pulling them together. A role where you carry every burden alone can feel heavy, so it helps to think of asking for help as part of the job.',
    love:
      'The gentle way you pick up on a partner\'s feelings and meet them where they are is a big part of your charm. But if you bend too far for someone you like, your own tastes and schedule can quietly disappear. Saying no to what you don\'t want won\'t make the relationship fall apart. You\'ll feel most at ease beside someone who respects you.',
    money:
      'With money, you can easily get swept along by people\'s requests or the mood of the moment. You might find it hard to say no when someone asks to borrow money, or end up covering the group bill on your own. Decide in advance what your share is, and manage larger sums together with family or someone you trust, so both your heart and your wallet can rest easy.',
    relations:
      'You have a way of putting people at ease, so good people tend to gather around you. You fit in better than anyone in cooperative settings, and you draw strength from relationships where people help each other. Long stretches with people who drain you can burn you out fast, so stay close to the ones who leave you feeling lighter.',
    health:
      'Your energy can run low easily, so recharging habits matter. Rather than stacking plans back to back, leave breathing room in between, and build up your basic stamina with warm meals and plenty of sleep. If fatigue lingers for a long time, it\'s a good idea to get checked by a doctor.',
    tip: 'Keep one day a week completely free of plans as your own personal recharge day.',
  },
};

/** When this group is the most plentiful in the chart */
export const GROUP_MANY: Record<GroupKey, GroupManyReading> = {
  비겁: {
    keyword: 'Independence',
    personality:
      'You like to make your own decisions and take responsibility for them yourself. When someone decides for you, you feel more boxed in than grateful, and when a friend pulls ahead, a competitive "I can do that too" flares up inside you. That drive fuels your growth, but if you treat everything as a matter of winning or losing, your heart gets tired fast.',
    work:
      'You find your energy in work that carries your own name, and in standing shoulder to shoulder with colleagues who share the same goal. You\'re especially strong where results are compared in hard numbers, and many people like you dream of going independent or starting a business. In partnerships or joint projects, it\'s wise to put roles and shares in writing from the very start.',
    jobs: ['Small business owner', 'Salesperson', 'Athlete', 'Freelancer', 'Entrepreneur', 'Site manager'],
    love:
      'You want an equal relationship with a partner, almost like close friends. Dating where you each respect the other\'s life feels comfortable, and if one side only leans on the other, you quickly feel the weight of it. When you argue, not wanting to lose can make your apology come late. It helps to remember that reaching out first isn\'t the same as losing.',
    money:
      'You feel most at ease when you\'ve earned the money yourself. The tricky part is that money easily gets tangled up with friends or siblings, and out of loyalty you might cosign a loan or lend money you never get back. Draw a clear line between money you\'ll share and money that\'s yours, and keep records for shared funds like group dues.',
    relations:
      'You have lots of friends and colleagues, and once you count someone as being on your side, you look after them to the end. You often slip naturally into the role of leader in a group. With people who are a lot like you, though, you can easily clash over who\'s in charge. Giving others a chance to step up front actually earns you deeper respect.',
    energize: 'Racing toward a shared goal with teammates',
    drain: 'Having your decisions taken out of your hands',
  },
  식상: {
    keyword: 'Expression',
    personality:
      'You can\'t rest until the ideas in your head get out into the world. You feel most alive when you\'re making something, whether with words, in writing, or with your hands, and you have a sharp eye for what\'s fun. Because it\'s hard for you to hold back what you want to say, a single offhand remark can sometimes lead to misunderstandings.',
    work:
      'You\'re strong at coming up with ideas and building them so others can see. In planning meetings you throw out directions nobody else thought of, and you enjoy the hands-on process of polishing something until it\'s finished. Work that just repeats a set template bores you quickly, so leave room for small experiments or creative touches in your job, and you can enjoy it for a long time.',
    jobs: ['Designer', 'Instructor', 'Chef', 'Writer', 'Broadcaster', 'Software developer'],
    love:
      'You love expressively. You often show your feelings through words and surprise gifts, and you\'re drawn to people you can laugh with. When conversations feel flat or your partner doesn\'t react much, though, you might feel as if their feelings have cooled. Accepting that quiet stretches are part of a relationship too lets things grow deeper.',
    money:
      'Your talent and skill can turn straight into income, so a hobby sometimes becomes a side gig. On the other hand, your wallet opens easily for fun, whether it\'s good food, concert tickets, or gear for a new hobby. Setting aside a separate budget just for fun lets you spend without guilt and still protect your savings.',
    relations:
      'You lift the mood with your way with words and your sense of humor. You hit it off quickly even with people you\'ve just met, and you look out for those younger or newer than you. Speaking bluntly about higher-ups or rules can sometimes make you enemies, though. Even the same words land much better when you pick a moment the other person is ready to hear them.',
    energize: 'Seeing something you made make someone smile',
    drain: 'Having to bite your tongue',
  },
  재성: {
    keyword: 'Practical sense',
    personality:
      'You\'re a realist who cares about tangible results. Before any vague dream, you ask, "So how much will it cost, and when will it be done?" Comparing price and value is second nature to you, even on a simple grocery run. But when you chase only results, it\'s easy to miss the joy of the process and what people are feeling.',
    work:
      'Your abilities show in work that handles numbers and resources and makes results visible. You\'re quick and accurate at building budgets, assigning schedules and people, and calculating profit and loss. Your motivation grows in roles where the reward clearly matches the effort, so setting your goals in numbers keeps you driven for the long haul.',
    jobs: ['Accountant', 'Retail and distribution', 'Finance professional', 'Real estate agent', 'Purchasing manager', 'Business owner'],
    love:
      'You show love through action and practical care more than words. You make sure your partner has what they need and plan your future together in concrete terms. Sometimes, though, what your partner wants isn\'t a solution but simple empathy. Set the calculations aside for a moment and say "Oh, that must have been tough" first, and you\'ll feel much closer.',
    money:
      'You have a good feel for how money flows. You quickly notice where it\'s leaking and where it\'s growing, and habits like keeping a budget or splitting your money into separate accounts for different purposes suit you well. Because you see so many opportunities, you can easily take on too much. Deciding ahead of time how much you can handle helps you hold on to what you\'ve saved for the long run.',
    relations:
      'You keep the give-and-take clear with people, too. When you owe someone a favor, you want to repay it, and when you help, you offer something practical. That can get you misread as weighing relationships by gains and losses. A message just to check in, for no reason at all, adds warmth to your connections.',
    energize: 'Watching your effort turn into real results',
    drain: 'Watching time and money slip away',
  },
  관성: {
    keyword: 'Responsibility',
    personality:
      'You take your role seriously, along with the lines you know you shouldn\'t cross. If you\'re running late, you text ahead, and you follow the rules even when nobody\'s watching. You pick up on what people expect of you and work hard to live up to it. The bar you set for yourself is high, so even a small mistake can weigh on your mind for a long time.',
    work:
      'Your skills shine in a well-structured organization. The clearer the roles and the chain of reporting, the more secure you feel, and when you\'re given a position of responsibility, you quietly get it done. You can hold steady under pressure that others find hard to bear. Rather than holding on to every task yourself, practice choosing which work to let go of.',
    jobs: ['Public servant', 'Military officer', 'Police officer', 'Legal professional', 'Manager', 'Auditor'],
    love:
      'You want a serious, committed relationship. Rather than starting things casually, you take your time to see whether someone is trustworthy. Once your mind is made up, you keep your promises and stay by their side for a long time. You might quietly hold your partner to certain standards, though, so try putting each other\'s comfort ahead of getting everything right.',
    money:
      'You like a steady income and planned spending. Saving bit by bit within a set flow, like a regular paycheck, suits you well. The catch is that keeping up appearances can make spending on things like wedding and funeral gifts or treating people swell quickly. Setting a cap on social expenses as well takes a lot of the pressure off.',
    relations:
      'You\'re polite and respect boundaries, which earns you the trust of people above you. In groups, too, you faithfully handle whatever role you\'re given and come across as dependable. Because you\'re so mindful of how others see you, opening up about your real feelings can be hard. One or two friends you can see casually, without your job title, become a real place of rest.',
    energize: 'Having your effort fairly recognized',
    drain: 'Work that drifts with no clear standard',
  },
  인성: {
    keyword: 'Learning',
    personality:
      'You think things through and want to understand before you act. When something makes you curious, you look it up in books and sources, and you only feel at ease once you understand how it works. You\'re also lucky when it comes to receiving help and care from the people around you. When your thinking runs long, though, getting started gets delayed, and plans can pile up neatly in your head without ever leaving it.',
    work:
      'Your depth shows in studying, researching, and teaching. Fields where official papers like certifications or degrees carry weight suit you, and you\'re strong at organizing material carefully to build a solid case. Waiting until you\'re perfectly prepared can mean missing your chance, so once you\'re about 70 percent ready, go ahead and start.',
    jobs: ['Teacher', 'Researcher', 'Counselor', 'Librarian', 'Translator', 'Nurse'],
    love:
      'You\'re a warm partner who\'s deeply moved by a single kind word or a small gesture. You try hard to understand your partner and love sharing your heart through conversation. Because you\'re used to being cared for, you can sometimes find yourself leaning on your partner more and more. Giving back as much as you receive, and putting it into words, makes the relationship stronger.',
    money:
      'You put your effort into building knowledge and credibility before the nuts and bolts of making money. You spend freely on books and courses, but tend to put off the actual steps that would raise your income. Try small experiments that connect what you\'ve learned to income, one at a time, and keep the habit of reading contracts all the way through.',
    relations:
      'You tend to cross paths easily with dependable elders and mentors. You listen well and offer advice, so people often come to you with their worries. With so much on your mind, you can be slow to reply to messages or retreat into your own world. Sending even a short hello keeps your relationships going without misunderstandings.',
    energize: 'Learning something new and grasping how it works',
    drain: 'Being rushed along with no time to think',
  },
};

/** When this group is nearly absent from the chart */
export const GROUP_NONE: Record<GroupKey, GroupNoneReading> = {
  비겁: {
    personality:
      'Rather than pushing your own way, you tend to move with the situation and the people around you. That makes you flexible, but you may be slow to answer the question "What do I actually want?" There\'s strength inside you that simply doesn\'t show on the surface yet, and times will come when a 10-year cycle or a particular year fills that strength in.',
    work:
      'You feel more at ease on a team where roles are shared than in a position where you carry everything alone. Fiercely competitive environments can wear you out quickly, so protect your confidence with the habit of recording your achievements and giving yourself credit for them.',
    love:
      'You have a kind way of adapting to your partner, but if you keep hiding your own opinions, the relationship can tilt to one side. Practicing saying "I\'d like this one," starting with small choices like picking where to eat, makes for a relationship that\'s comfortable for both of you.',
    money:
      'Your spending can easily shift with the mood around you. So you don\'t end up buying something just because everyone else did, jot down your own spending rules on your phone and check them once before you pay.',
    relations:
      'Because it\'s hard for you to turn down requests, your own time sometimes shrinks. If you start a group where you exercise together or share a hobby, you\'ll find people on your side who give each other strength without anyone having to lean too hard.',
    tip: 'Each day, make at least one decision entirely on your own without asking anyone else.',
  },
  식상: {
    personality:
      'Rather than voicing what\'s inside, you tend to sort it out internally. Your quiet makes you seem calm, but it\'s not that you have nothing on your mind. Your outlet for expressing it just isn\'t as wide open. Talents may be hidden where others can\'t see them, and in a year when the energy of expression comes in, words start to flow naturally, as if something has come unstuck.',
    work:
      'You\'re more comfortable doing assigned work precisely than pouring out ideas on the spot. If presentations or planning feel like a burden, organize your thoughts in notes beforehand. That keeps your work from looking smaller than your real ability.',
    love:
      'Putting your feelings for someone into words feels a little awkward to you. Your partner may not know how you feel, so showing it often in low-pressure ways, like a short message or a small gift, gets it across just fine.',
    money:
      'Turning your talents into money may not come easily, but you have a real knack for holding on to a stable income. If you keep a steady record of what you\'re good at, in writing or photos, unexpected ways to earn can open up.',
    relations:
      'You tend to be quiet when you first meet people, so you\'re sometimes misread as cold. Asking a question first or reacting a little more visibly helps people quickly remember you as someone easy to be around.',
    tip: 'Pick up a hobby that gets your feelings out into the world, like journaling, short writing, or drawing.',
  },
  재성: {
    personality:
      'You tend to look at meaning, people, and values before money or profit. You\'re not big on calculating, so people sometimes call you pure-hearted. This doesn\'t mean money isn\'t in the cards for you. It just means the knack for managing it isn\'t as ingrained yet, and a 10-year cycle can come along that fills in that sense.',
    work:
      'You\'re more motivated by work that feels meaningful than by work judged in numbers. Putting a price on your own effort may not be your strong suit, so when you negotiate a salary or fee, look up the going rate before you walk in.',
    love:
      'You\'re drawn to people you connect with emotionally more than to their credentials. It\'s easy to push practical planning aside, so talking comfortably about concrete things, like where you\'ll live together or how you\'ll handle living costs, makes the relationship much sturdier.',
    money:
      'It\'s easy for money to slip out without you noticing quite where it went. Just splitting your accounts by purpose and skimming your spending once a month can start to bring your money flow into clear focus.',
    relations:
      'You don\'t size people up by what they can do for you, so anyone feels comfortable approaching you. When a request involves money, though, you may be a soft touch, so setting a lending limit in advance protects both your relationships and your peace of mind.',
    tip: 'Set one day a month to open your budgeting app and sort through your spending.',
  },
  관성: {
    personality:
      'You\'re a free spirit who feels most at ease doing things your own way rather than within a fixed framework. You\'ll follow rules once you\'re convinced of why they\'re needed. That\'s not irresponsibility. It\'s because you trust the standards you\'ve set for yourself. When a period of responsibility and defined roles comes your way, you may be surprised how well you carry that weight.',
    work:
      'You\'re more productive in roles with wide discretion than in organizations with layer upon layer of approvals. Since you have to keep track of deadlines and priorities yourself, keeping a to-do list and schedule where you can see them helps you stay on track.',
    love:
      'You like relaxed relationships where no one feels tied down. If you brush past plans or anniversaries, your partner may feel hurt, so simply writing important dates on your calendar ahead of time builds a lot of trust.',
    money:
      'You tend to spend based on what you need in the moment rather than on a plan. Set up an automatic transfer so savings leave your account first thing on payday, and money will pile up on its own without relying on willpower.',
    relations:
      'Bosses, elders, and formal settings may feel a little uncomfortable to you. On the flip side, you get along more easily than anyone in relationships where everyone is on equal footing. Just keeping basic courtesies like greetings and promises lets you enjoy your freedom without being misunderstood.',
    tip: 'When you start your day, write down three things to finish today, and check in the evening whether you crossed them off.',
  },
  인성: {
    personality:
      'You\'re a hands-on type who learns by doing rather than mulling things over. You decide fast, and your body moves before your head does. Trying to solve everything alone with no one to lean on can wear you out, though. In periods when hidden energy in your chart surfaces or the energy of learning arrives, chances to study and people who help you tend to follow naturally.',
    work:
      'Work where you learn by diving in on the ground suits you better than theory. Skipping the fundamentals can trip you up later, so adding a short course or certification program here and there turns your experience into solid skill.',
    love:
      'You\'re proactive about caring for your partner, but being cared for feels awkward to you. It\'s okay to lean on someone when things are hard. When you admit, "I\'m a bit worn out today," your partner will feel closer to you too.',
    money:
      'It\'s easy for you to skim past contracts and terms and conditions. Read them once more before you sign, and ask an expert or someone you trust about anything you don\'t understand, so you can head off losses in advance.',
    relations:
      'Asking for help doesn\'t come naturally to you, so you sometimes struggle in silence. Choosing one senior colleague or mentor you can go to for advice gives you a reliable guide whenever you get stuck.',
    tip: 'Make steady time to learn, with one book or one course each month.',
  },
};
