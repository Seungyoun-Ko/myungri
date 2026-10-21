import type { ElementBalanceReading, LuckyReading, GeukReading } from '../types';

/** When that energy is overly strong in the chart. 0 Wood, 1 Fire, 2 Earth, 3 Metal, 4 Water */
export const ELEMENT_EXCESS: ElementBalanceReading[] = [
  {
    personality:
      "With plenty of Wood energy, you tend to have a steady stream of things you want to do. Your eyes light up in front of a new plan, and once you've picked a direction, you don't bend easily. The catch is that you can branch out in too many directions at once, so half-started projects pile up, or you insist on doing things your way and end up butting heads with the people around you.",
    health:
      "Your drive can run ahead of your body, and it's easy to pack your schedule fuller than you can actually keep up with. Wood energy has traditionally been linked with the liver, the eyes and the muscles, so on days you've stared at a screen for hours, rest your eyes and slowly stretch out your stiff shoulders. If tiredness lingers for a long time, it's worth getting checked by a doctor.",
    tip: "Look at your to-do list, keep just three things, and push the rest to next week. Pruning is part of growing, too.",
  },
  {
    personality:
      "With Fire energy running high, your feelings and reactions are quick and bright. When you walk into a gathering, the room warms up fast, and you'll throw yourself into things you love, even if it means staying up all night. By the same token, your temper catches quickly too, so words can fly out before you've thought them through, or you blaze up hot and then cool off just as suddenly.",
    health:
      "When you stay keyed up for a long time, your sleep can turn shallow and you may tire out easily. Fire energy has traditionally been linked with the heart, blood circulation and the tongue. Cutting back on caffeine at night and dimming the lights before bed are habits that help. If you often notice your heart racing, it's worth getting checked by a doctor.",
    tip: "When anger flares up, don't hit send on that reply right away. Drink a glass of water, reread it, and then decide whether to send it.",
  },
  {
    personality:
      "With thick, solid Earth energy, you don't get shaken easily, and people find you dependable. Friends often come to you to pour out their worries, and once you take on a role, you hold it for a long time. On the flip side, when change comes, you may cling to the way things have always been done, or think so long and move so slowly that good chances slip past.",
    health:
      "It's easy for you to move too little and spend long stretches sitting down. Earth energy has traditionally been linked with the stomach, digestion and the mouth. Keeping regular mealtimes and taking a light walk on days you've eaten a lot can make your body feel lighter. If stomach discomfort hangs around for a while, check in with a doctor.",
    tip: "Once a month, take a route home you've never walked before, or order something on the menu you've never tried.",
  },
  {
    personality:
      "With strong Metal energy, you draw clear lines and your judgment is sharp. You're good at sorting out murky situations, and you know how to say no when something is wrong. The trouble is that your standards are high, so you can easily become strict with yourself and with others, and your tone can turn cold enough to hurt someone without your meaning to.",
    health:
      "You tend to store tension in your body, so your breathing can easily turn shallow. Metal energy has traditionally been linked with the lungs, breathing and the skin. Take deep breaths somewhere with a good breeze, and drink water often in dry seasons. If a cough keeps hanging on, have a doctor take a look.",
    tip: "When you feel the urge to point out a mistake, first find one thing the other person did well, and offer the two together.",
  },
  {
    personality:
      "With deep Water energy, you think a lot and pick up on things fast. You can read what someone feels even when they haven't said it, and you know how to flow flexibly with whatever the situation needs. By the same token, one worry tends to lead to the next until you lose sleep at night, or you put off a decision so long that the current carries you along with it.",
    health:
      "Your body can get chilled easily, and all that thinking can wear you out. Water energy has traditionally been linked with the kidneys, the bladder and the ears. Warm yourself from the inside with warm drinks, and write your worries down on paper before bed so your mind can settle. If discomfort keeps coming back, talk it over with a doctor.",
    tip: "When you've been mulling something over for too long, set a deadline. If you still haven't decided by then, start with the smaller option.",
  },
];

/** When that energy is missing or very weak in the chart. 0 Wood, 1 Fire, 2 Earth, 3 Metal, 4 Water */
export const ELEMENT_LACK: ElementBalanceReading[] = [
  {
    personality:
      "With little Wood energy, you may feel more comfortable going along with the flow you're given than kicking off something new yourself. Being careful is a strength, but it's easy to slip into the habit of saying \"later\" even about things you really want to do. If you make lots of small starts, the energy to grow builds up faster than you'd expect.",
    health:
      "There may be mornings when your body feels heavy as you wake up. A walk through a park full of green leaves, or a good long stretch, can bring your energy back. It also helps to put seasonal greens and leafy vegetables on the table often. If tiredness hangs on for a long time, check in with a doctor.",
    tip: "Put a small potted plant on your desk or windowsill, water it every day, and watch it grow.",
  },
  {
    personality:
      "With little Fire energy, you tend to be calm and don't show your feelings in big ways. Your composure is a real strength, but because you don't always put affection or praise into words, you can come across as indifferent. If you deliberately let yourself get swept up in something exciting, your passion comes alive more easily than you'd think.",
    health:
      "You may have days when your hands and feet are cold or your mood sinks low. Try walking outside for about twenty minutes in the middle of a sunny day, and keep warm tea and cooked food close at hand. Putting on music you love and moving your body to it helps too. If a heavy, listless feeling lasts a long time, talk to a doctor.",
    tip: "Once a day, tell someone you're grateful to how you feel, even in just a few words.",
  },
  {
    personality:
      "With little Earth energy, your thoughts move freely and lightly. You adapt well to change, but your mind can drift from one thing to the next, and you may feel it's hard to put down roots anywhere. One small habit you do at the same time every day can become solid ground under your feet.",
    health:
      "It's easy for your meals to get irregular, or for days of just grabbing whatever to pile up. Simply eating at roughly the same times and chewing slowly can steady your body. Try adding foods that grow in the ground, like sweet potatoes or squash. If your stomach often feels off, have it looked at by a doctor.",
    tip: "Start by fixing the time you get up and the time you go to sleep, and keep them the same every day.",
  },
  {
    personality:
      "With little Metal energy, you tend to be generous at heart and find it hard to say no. You put people at ease, but when it's time to wrap something up or cut it off, you hesitate, and work or relationships can drag on. If you write down your own standards ahead of time, decisions become much lighter.",
    health:
      "Spending a long time in stuffy air can easily leave you feeling closed in. Open the windows often to let fresh air through, and a few times a day, breathe in deeply and breathe out slowly. Try adding white foods too, such as pears, radishes and cauliflower. If you often get short of breath, see a doctor to be safe.",
    tip: "Every week, clear out five things you no longer use. As your space gets tidier, your own standards get clearer too.",
  },
  {
    personality:
      "With little Water energy, you tend to act before you think. You're great at getting things done, but because you keep running without a break, you rarely get time to step back and look at where you've been. A habit of pausing at the end of the day to sort through your thoughts adds depth.",
    health:
      "Your body can easily get dried out, and you tend to push through without taking breaks. Keep a water bottle nearby and sip from it little and often, and at the end of the day, loosen up in a warm shower or bath. Plenty of sleep is the easiest way to fill up this energy. If fatigue keeps building, get checked by a doctor.",
    tip: "For the last ten minutes before sleep, put your phone down and write three lines about what happened today.",
  },
];

/** Lifestyle that brings in the energy you need most. 0 Wood, 1 Fire, 2 Earth, 3 Metal, 4 Water */
export const LUCKY: LuckyReading[] = [
  {
    intro:
      "Wood energy is the power to grow and reach outward. It fills you with the courage to start something new, the urge to keep learning, and the generosity to rise together with the people around you. It gives you the feeling that whatever was stuck is starting to move again.",
    colors: ['Green', 'Teal'],
    numbers: [3, 8],
    direction: 'East',
    season: 'Spring',
    activities: ['Start the day with a morning walk', 'Tend houseplants or a vegetable patch', 'Take a class in something new'],
    places: ['Shady forest trails', 'Botanical gardens'],
  },
  {
    intro:
      "Fire energy is the power to light up and warm things. It fills you with the courage to show who you are, the confidence to express yourself in front of people, and the passion to throw yourself into what you love. It lifts a sinking mood and helps you share warmth with the people around you.",
    colors: ['Red', 'Orange', 'Purple'],
    numbers: [2, 7],
    direction: 'South',
    season: 'Summer',
    activities: ['Take a walk in the midday sun', 'Sing your heart out at karaoke or a concert', 'Invite friends over to cook together'],
    places: ['Sunny window seats', 'Concert halls and festivals'],
  },
  {
    intro:
      "Earth energy is the power to hold things up and hold them close. It keeps you centered when life shakes you, and fills you with the persistence to keep going with what you've started and the generosity that connects people. When you take good care of the heart of your home and your workplace, your life settles into a steady rhythm.",
    colors: ['Yellow', 'Beige', 'Brown'],
    numbers: [5, 10],
    direction: 'Center',
    season: 'Between seasons',
    activities: ['Cook home meals at regular times', 'Work with clay at a pottery studio', 'Tidy up the center of your living room'],
    places: ['Familiar favorite spots', 'Wide open fields'],
  },
  {
    intro:
      "Metal energy is the power to refine and put things in order. It fills you with the judgment to separate what you'll do from what you won't, and the decisiveness to finish things cleanly. It neatly sorts out work and feelings that have gotten tangled up.",
    colors: ['White', 'Silver', 'Gold'],
    numbers: [4, 9],
    direction: 'West',
    season: 'Autumn',
    activities: ['Clear out and organize closets and drawers', 'Practice deep breathing or meditation', 'Hone your hands with an instrument or craft'],
    places: ['Quiet library reading rooms', 'Breezy mountaintops'],
  },
  {
    intro:
      "Water energy is the power to seep in and flow. It fills you with the wisdom to think deeply, the knack for moving flexibly with the situation, and the stillness that lets a tired mind rest. It makes room to catch your breath when your days have been running nonstop.",
    colors: ['Black', 'Navy'],
    numbers: [1, 6],
    direction: 'North',
    season: 'Winter',
    activities: ['Drink plenty of water and sleep well', 'Unwind with a swim or a warm bath', 'Journal alone somewhere quiet'],
    places: ['Riversides and beaches', 'Quiet neighborhood pools'],
  },
];

/** The social "weapon" set by the birth month. Keys are terms; text is plain language */
export const GEUK: Record<string, GeukReading> = {
  건록격: {
    weapon:
      "Your secret weapon is the independence to carve out your own place without leaning on anyone, and the practical sense to knock out whatever task lands in your hands.",
    work:
      "Even with a brand-new task, you'd rather learn the way by doing it than by hunting for the manual first. You plan your own schedule and deliver results without a boss checking in on every step, so people know you actually do better when left to it. That said, you're not great at asking for help, so you can easily end up carrying everything yourself. When you're short-handed, practice handing pieces off early.",
  },
  월겁격: {
    weapon:
      "Grit that refuses to lose, the pull to rally people around a shared push, and a competitive streak that makes you sharper the stiffer the competition gets.",
    work:
      "You get better with colleagues or rivals around you than working alone. Team up with people chasing a similar goal and your momentum builds; seeing what the person next to you has pulled off spurs you to deliver even more. Because you often end up competing for the same share, though, feelings can get bruised easily. Split roles and credit clearly from day one, and the rivalry turns into real teamwork.",
  },
  양인격: {
    weapon:
      "Your secret weapon is the decisiveness to make the call first while everyone else hesitates, and the strong drive to push through a blocked path.",
    work:
      "Your true worth shows when a deadline is right around the corner and everything has gone sideways. When a meeting keeps circling without a conclusion, you're the one who wraps it up with \"Here's how we're going to do it,\" and the fiercer the competition, the more energized you feel. But putting speed first can make you look like you're pushing people around. If you explain your reasons once more after making a decision, people follow you willingly.",
  },
  식신격: {
    weapon:
      "Your secret weapon is steady persistence: you stick with what you love for a long time and keep polishing it until, over the years, it becomes a skill others find hard to match.",
    work:
      "Your career is built from what you turn out day by day. Whether it's cooking, code or design, you know the joy of doing the same thing over and over while making it a little better each time. You're unhurried about results, and that calm puts your coworkers at ease too. Still, you can get too comfortable with the methods you know, so now and then, put your work out into the world and get some feedback on it.",
  },
  상관격: {
    weapon:
      "Your secret weapon is the ability to ask \"Why?\" about things everyone else takes for granted, and to lay out your thinking persuasively in speech and in writing.",
    work:
      "You quickly spot the gaps in the way things have always been done and come up with better alternatives. You shine especially in settings that show off your thinking, like presentations and proposals, and you're stronger at setting up a new game than at routine, by-the-book work. But if you push back on a manager's decision in front of a crowd, even a good idea can get buried. Pair your criticism with an alternative, and you'll be recognized as someone who makes change happen.",
  },
  편재격: {
    weapon:
      "Your secret weapon is a knack for spotting money-making opportunities in scattered information before anyone else, and for weaving people and resources together widely to make the whole thing bigger.",
    work:
      "Things go well for you when you're meeting lots of people and getting out into the field rather than staying in one spot. You show unusual nerve when negotiating with clients, finding new markets or launching big projects. But when you've got a lot going at once, the follow-through can get fuzzy. Team up with a detail-minded coworker, and the ground you've opened up will hold firm as real results.",
  },
  정재격: {
    weapon:
      "Your secret weapon is diligent management: you keep track of numbers and schedules without missing a thing, and you steadily grow whatever is placed in your care.",
    work:
      "Hand you work that needs careful attention, like budget sheets, inventory or schedules, and you deliver results people can count on. Your style is to keep stacking up small wins rather than going for one big hit, so the trust people place in you grows deeper over time. On the other hand, unplanned changes can really stress you out. If you leave some buffer time in your schedule ahead of time, you can stay calm even when something comes up out of nowhere.",
  },
  칠살격: {
    weapon:
      "Your secret weapon is nerve: the harder the pressure, the sharper your focus gets, and you take on the tough problems others avoid head-on.",
    work:
      "Your skill shows when you're handed the things everyone dreads, like a problem that suddenly blows up, a customer whose frustration has been building, or a project on a brutally tight deadline. Once you've pulled through a crisis, your standing in the organization grows considerably. But working on high alert all the time can wear you out easily. After you've made it over a big hurdle, make a point of taking some time to rest.",
  },
  정관격: {
    weapon:
      "Your secret weapon is the trust you inspire: you keep your commitments and follow the process, working so consistently that people feel safe leaving things in your hands.",
    work:
      "You steadily grow your place within a well-structured organization. You report on time and keep accurate records, so both your managers and your coworkers see you as the standard to go by. Fairness matters a lot to you, and you shine more as your role grows. But in situations the rules don't cover, you can hesitate to make a call. Practicing making small decisions on your own helps.",
  },
  편인격: {
    weapon:
      "Your secret weapon is insight: you look at things from an angle no one else does, dig deep into one subject, and find answers nobody else thought of.",
    work:
      "Your abilities really come alive in an environment where you can get absorbed on your own. You're strong at work that needs depth, like research that digs through material and gets to the underlying principles, analysis or planning, and ideas that once looked odd sometimes turn out to be the key later on. But once your interest cools, finishing tends to get put off. A habit of summing up your results and sharing them, even briefly, turns your insight into real results.",
  },
  정인격: {
    weapon:
      "Your secret weapon is the trust you earn with knowledge you've steadily learned and practiced, and the power to look after the people around you warmly and help them grow along with you.",
    work:
      "You're strong at things that build step by step, like certifications and study, and you're good at passing on what you've learned in a way others can easily understand. When someone new joins, you naturally end up in the role of teaching them, and you become the person people trust to go to with questions. But you may hold off on starting until your preparation feels perfect. Once you're about 70 percent ready, find the courage to just go for it.",
  },
};
