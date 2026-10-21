import type { DayMasterReading } from '../types';

// Core day readings A, in order: Yang Wood, Yin Wood, Yang Fire, Yin Fire, Yang Earth.
export const DAY_MASTER_A: DayMasterReading[] = [
  // 0 Yang Wood: the tall tree
  {
    title: "Like a tall tree reaching straight for the sky, you see every path you choose through to the end",
    keywords: ['Drive', 'Steadfast', 'Big picture'],
    core: [
      "You're the one who raises a hand and says \"Okay, I'll take it\" when the whole room has gone quiet and nobody wants to go first. Once the direction is set, you push ahead like a tree growing upward, without wasting much time looking sideways. When someone younger or newer leans on you, you want to be the shade they rest in, and once you start looking out for a person, you keep doing it for years. That's why, as time goes on, people naturally gather around you.",
      "The flip side is that bending is unusually hard for you. When you're sure your way is right, you may start shaking your head before the other person has even finished their suggestion, and when an apology is due, the words seem to catch in your throat. Like a big tree that stands firm in a strong wind until it suddenly snaps, you can hold on and hold on, then give out all at once. If you practice letting your branches sway a little, you'll stay green and standing for much longer.",
    ],
    stress:
      "The harder things get, the more you try to carry everything yourself. Instead of asking for help, you grab even more of the work, your face sets hard, and you go quiet. At times like this, a walk on a wooded trail or a workout that leaves you sweating works like medicine. Try telling one person you trust, out loud, exactly what feels too heavy right now. You'll be surprised how quickly you can breathe again.",
    energize: ['Building something new from the ground up', 'Being trusted to make the call', 'Breathing fresh outdoor air early in the morning'],
    drain: ["Being dragged along by other people's decisions", 'Work that has stood still for years', 'People who say one thing, then another'],
    work:
      "You set a big goal and then build toward it layer by layer, starting from the foundation. You really shine when you're setting up a new team or reviving a project that has fizzled out. Roles where you lead people suit you well, but tidying up detailed numbers or doing the same routine task over and over bores you quickly. Pair up with a meticulous colleague, with you handling the trunk and them handling the small branches, and the work rolls along smoothly.",
    jobs: ['Planner', 'Team lead', 'Founder', 'Educator', 'Architect', 'Public servant', 'Landscape designer'],
    love:
      "When you start to like someone, you don't hint around. You step right up to them. Once you're together, you picture the years ahead with this person and try to be the steady support they can lean on. But if \"Leave it to me, I'll handle it\" becomes a habit, your partner may feel there's no room left for their opinion. Small habits, like taking turns choosing where to go on a date, keep the relationship fresh and growing for a long time.",
    money:
      "You save with a purpose: to have something you can grow. Rather than spending money right away, you like to plant it where it can take root over time, such as a home, an education, or a business. On the other hand, you open your wallet without a second thought to treat younger friends to dinner or help out family, so money can quietly slip away. Set a monthly limit for what you give, and both your heart and your wallet will feel lighter.",
    relations:
      "You may come across as a bit gruff at first, but your loyalty runs deep, so once you're friends, it lasts. When you hear a friend is in a tough spot, you're the one who calls first and starts working on a solution. At the same time, you care about rank and order, which can lead to clashes with people above you. If you accept that someone else's way can be right too, you'll find your circle of allies growing.",
    health:
      "Traditionally, Wood energy is linked with the liver and the eyes, and with the muscles and tendons. You're built to endure, so you tend to notice fatigue late. Long nights staring at a screen or a run of late dinners with drinks tend to weigh on your eyes and body first. Stretch often to open up your body, and if tiredness lingers, have a doctor take a look.",
    tips: [
      'Before you make a decision, build the habit of hearing at least one opposing view all the way through.',
      "Pick one of the tasks you've been holding on to alone, and hand it to someone else this month.",
      'Set aside a regular weekend morning to walk in a park full of trees, and watch how your head clears.',
    ],
  },

  // 1 Yin Wood: grass, flowers, and vines
  {
    title: 'Like a vine that flowers even in a crack in the rock, you find your way by staying flexible',
    keywords: ['Flexible', 'Easy rapport', 'Persistence'],
    core: [
      "Even at a gathering where you don't know anyone, you quickly read the room and sense who would be good to talk to. Instead of charging head-on, you find the way around, like a vine climbing a wall, and before anyone notices, the stuck thing has come loose. Your gentle way of speaking and your good instincts let you get along even with difficult people, and you have the kind of eye that can change the whole feel of a room with a single potted plant.",
      "But because you're so tuned in to other people's moods, your own feelings easily end up last. You can't bring yourself to say no, so you end up taking on favors, and only once you're home do you turn it over and over, asking yourself why you agreed. You draw strength from having someone to lean on, but that also means one person's reaction can sway your mood for the whole day. If you start voicing what you want in small matters first, your roots will grow steadily stronger.",
    ],
    stress:
      "When you're worn out, you keep smiling on the outside while wilting on the inside. You quietly cut back on replying to messages, put off what needs doing, and let the worry grow. At times like this, small pleasures are the water you need, like a cup of tea by a sunny window or a slow wander through a flower market. A long, easy chat with the one friend you can really open up to will have you lifting your head again in no time.",
    energize: ['Working alongside people you like', 'Being praised for your taste and instincts', 'Spending time in a beautiful space'],
    drain: ['Having to carry everything alone', 'Harsh, blunt words flying around', 'Having to tiptoe around too many moods'],
    work:
      "You have a gift for connecting people and polishing work until it looks good. Your skill shows when you're smoothing out communication between a client and your own team, or turning rough material into something clean and clear. You get further with a mentor you trust or a good team than by pushing through alone. When deadlines pile up, you tend to say yes to every request until your own work slips, so write down your priorities ahead of time.",
    jobs: ['Designer', 'Marketer', 'Florist', 'Coordinator', 'Counselor', 'Service planner', 'Executive assistant', 'PR specialist'],
    love:
      "You're an affectionate partner who remembers even their smallest likes and quietly acts on them. You'll remember the name of a flower you passed on a walk together, or slip their favorite snack into their bag without a word. But instead of speaking up right away when something hurts, you may let it pile up, until one day you realize your heart has drifted. The smaller the hurt, the easier it is for both of you if you bring it up lightly that same day.",
    money:
      "You have a sharp eye, so you're good at picking things that are both pretty and practical for the same money. But getting caught up in the moment when you're out with others can push your spending higher than you expect, and lots of small payments add up. Saving a little in several places suits you, so if you keep separate accounts for separate goals, they'll grow steadily. For any decision involving a big sum, talk it over one more time with someone you trust.",
    relations:
      "You get along with almost everyone and naturally become the bridge between people. When two friends get awkward with each other, you might quietly arrange a chance for them to clear the air. But in trying to be good to everyone, you sometimes forget to look after yourself. Once you experience that saying no doesn't end a relationship, being around people will feel much lighter.",
    health:
      "In East Asian tradition, Wood energy is linked with the liver and the nerves, and with the muscles of the neck and shoulders. On days when you're on edge, your shoulders tend to knot up and your hands and feet can get cold. Sip lukewarm water often, and loosen the tension with some gentle neck stretches before bed. If the stiffness keeps hanging around, it's a good idea to see a doctor.",
    tips: [
      'This week, politely turn down one request, then watch what actually happens afterward.',
      'Put a green plant on your desk or windowsill, and let watering it be your built-in break.',
      'At the end of the day, jot down one thing you wanted today, even in just a few words.',
    ],
  },

  // 2 Yang Fire: the sun
  {
    title: 'Like the midday sun shining on everything alike, you light up any place you walk into',
    keywords: ['Bright', 'Passion', 'Candor'],
    core: [
      "People often say a room lights up when you walk in. When a meeting goes flat, you're the first to crack a joke, and you greet even strangers without hesitation. You say yes when you mean yes and no when you mean no, so people see you as someone who wears their heart on their sleeve. You care about not leaving anyone out, which is why you so often end up at the center of the group.",
      "A fire that flares up big can also cool down fast. You may start lots of things bursting with enthusiasm, only to find your attention has moved elsewhere by the time they need finishing. Your mood shows right on your face, so on an irritated day, the people around you are the first to start tiptoeing. Deciding up front how each new project will wrap up, and pausing for a beat before you speak, will help your light last much longer.",
    ],
    stress:
      "When you're struggling, your voice actually gets louder and you talk faster. You may pour out your frustration on the spot and then feel sorry about it later. At times like this, it helps to burn off energy in a big, satisfying way, like a workout that leaves you drenched in sweat or a night of karaoke. Simply turning off your screens after dark and going to bed early can bring your energy back noticeably the next day.",
    energize: ['Speaking in front of a crowd', 'Seeing your effort turn into visible results', 'Moving your body in the sunshine'],
    drain: ['Sitting alone with paperwork all day', 'Having your sincerity misunderstood', 'A mood of quiet scheming behind backs'],
    work:
      "You work by stepping out front and lighting a fire in people. When it's time to launch a new product or lift the team's spirits, you bring more energy than anyone. You're quick to come up with ideas and get things going, but the details can slip past you. Ask a careful person to do the final check, and pin a midpoint review date on the calendar, so that what you start keeps shining all the way to the finish.",
    jobs: ['Broadcaster', 'Instructor', 'Salesperson', 'PR specialist', 'Show producer', 'Event host', 'Policy advocate'],
    love:
      "When you like someone, you can't hide it, and you express it very openly. You plan surprise parties for their birthday and brag about them to your friends without holding back. You're a joy to be with, but you may take it personally when your partner quietly wants some time alone. If you remember that they have their own pace, just as you have your own heat, your warmth will land as comfort rather than pressure.",
    money:
      "You tend to earn big and spend big. On a good day, \"This one's on me\" comes out naturally, and while that draws people to you, it can also leave your bank account light very quickly. If you set up an automatic transfer so a fixed amount goes into savings on payday, the money piles up without you having to think about it. For any big purchase, try sleeping on it before you decide.",
    relations:
      "You try to treat everyone the same, with no cliques or sides, so people open up to you easily. You're loyal and fair-minded, the kind who speaks up when you see something unjust, even when it isn't your fight. But your habit of saying exactly what you think can sometimes sting. Simply switching the order, offering encouragement before criticism, will keep people by your side far longer.",
    health:
      "Traditionally, Fire energy is linked with the heart, blood circulation, and the eyes. When you burn through all your energy at once and stay up late several nights in a row, you tend to run hot and tire easily. Drink plenty of water on hot days, and keep a regular bedtime. If your heart often feels like it's racing or your fatigue won't lift, get checked by a doctor for peace of mind.",
    tips: [
      'Set a rule for yourself: before starting something new, finish one thing that is already underway.',
      "When you're angry, don't reply right away. Take ten breaths, then choose your words.",
      'Make a ten-minute walk in the morning sun the way you start each day.',
    ],
  },

  // 3 Yin Fire: candle and lamp
  {
    title: 'Like a lamp that brightens a dark room, you warmly light up the person beside you',
    keywords: ['Tenderness', 'Sensitivity', 'Deep focus'],
    core: [
      "Even when a friend says nothing's wrong, you can hear it in their voice and ask, \"Something happened, didn't it?\" You don't need center stage. You have a way of quietly warming the people near you, so yours is often the first name that comes to mind when someone is having a hard day. When something captures your heart, you have the focus to dig into it late into the night, and whatever comes from your hands carries a special kind of care.",
      "Just as a candle flickers in the slightest breeze, your heart is easily stirred. A short reply in the group chat can leave you wondering for ages whether someone is upset with you, and one worry can lead to another until you lose sleep. When you spend all your flame looking after others, things can go dark inside. If you set aside some time just for yourself once a day, your light won't go out, and it will burn for a long time.",
    ],
    stress:
      "When things are hard, you turn inward without a word. You tell everyone you're fine while pouring your heart into a journal or your notes app, and you replay past conversations again and again. At times like this, a long, warm shower, or dimming the lights and listening to music you love, helps you recover. Try writing your worries down on paper and sorting them into what you can do something about and what you can't. Your mind will settle.",
    energize: ['Hearing a heartfelt thank-you', 'Getting deeply absorbed in one thing', 'A quiet night in a cozy space'],
    drain: ['Long stretches in loud, crowded places', 'Having careful work brushed aside', 'A mood where feelings must stay hidden'],
    work:
      "Like light gathered to a single point, you dig into your work deeply and in fine detail. You catch the typos and mismatched numbers others miss, and you're just as good at work that calls for sensing what people feel. Your skill shows less on a big stage and more in roles where you help people one by one or raise the quality of the finished product. Because chasing perfection can push you past deadlines, decide in advance what counts as good enough.",
    jobs: ['Counselor', 'Teacher', 'Researcher', 'Writer', 'Nurse', 'Chef', 'Editor', 'Craftsperson'],
    love:
      "You tend to give your heart to one person, deeply and for a long time. You're a romantic who remembers something your partner said in passing and gives it back to them as a handwritten note or a small gift. That also means their reactions can shake you deeply, and when you can't bring yourself to say you're hurt, you may quietly cool off on your own. Practicing how to gently put what you hope for into words will keep the relationship warm for a long time.",
    money:
      "You don't hold back where it matters, but your everyday spending tends to be calm and planned. Your wallet opens easily for gifts for people you love, or for little things that soothe your heart. The one thing to watch is impulse buying on days when you feel low. Try keeping a budget the way you'd keep a mood journal, with a quick line each day, and you'll see at a glance on which kinds of days your money slips away.",
    relations:
      "Rather than making lots of friends, you go deep with a few kindred spirits. You're warm-hearted, the kind who remembers birthdays and hard days and reaches out first. But once your feelings are hurt, you may keep smiling on the outside while quietly putting distance between you. If you don't let hurt feelings sit too long, and share them while they're still small, you won't lose the connections that matter to you.",
    health:
      "Fire energy has traditionally been linked with the heart and circulation, and with restful sleep and a settled mind. On days when your head is full, your sleep can turn shallow and your chest may feel tight. For the hour before bed, put down your screens, and turn down the fire in your mind with a warm cup of tea and a gentle walk. If sleepless nights go on for a long time, talk it over with a professional.",
    tips: [
      'Once a day, write down at least one line about something you did for yourself today.',
      'When worrying starts, set a fifteen-minute timer, and when it rings, get up and move.',
      'Make a personal rule to bring up anything that hurt you, gently, within three days.',
    ],
  },

  // 4 Yang Earth: the great mountain, the open land
  {
    title: 'Like a great mountain that holds its ground without wavering, you quietly take people in',
    keywords: ['Dependable', 'Open-hearted', 'Trust'],
    core: [
      "When the team is running around in circles, you're the one who steadies everyone with \"Let's sit down and go through this one thing at a time.\" Even when you don't say much, you have a solid presence that people naturally lean on. You listen all the way through to people with different opinions without taking sides, so when a dispute breaks out, you're often asked to mediate. And when you make a promise, you remember it and keep it, even long after.",
      "Just as a mountain doesn't move easily, you can be slow to budge when change comes. When someone suggests a new way of doing things, you may dig in with \"What we have now is fine\" and let the right moment pass. You don't show your inner thoughts much, so even people close to you can feel frustrated not knowing what you're thinking, and when you've held it in alone until you hit your limit, it finally comes out in a big burst. A habit of mentioning small discomforts as they come up will keep your mountain green.",
    ],
    stress:
      "When things get hard, you stop moving and freeze in place. You put off replying to messages, lie around all day doing nothing, or soothe yourself with food. At times like this, skip the grand plans and start by getting your body going in a small way, like a walk around the block. Sharing an unhurried meal and a slow conversation with a friend you've known for years will help you find your footing again quickly.",
    energize: ['Long, steady work finally paying off', 'People trusting you and leaning on you', 'Heading to the mountains or wide-open fields'],
    drain: ['Plans flipped upside down overnight', 'Being pushed to decide right now', 'Gatherings full of shallow small talk'],
    work:
      "You don't rush. You lay the groundwork first and then keep pushing forward steadily. When you're given work that means balancing the interests of several departments, or something that needs managing over a long stretch, you deliver results people can count on. You may look slow to start, but once things are rolling, they're hard to knock off course. Because you tend to take everything on yourself and endure in silence, share your progress regularly so the people around you can pitch in.",
    jobs: ['Manager', 'Real estate agent', 'Public servant', 'Finance professional', 'HR specialist', 'Construction manager', 'Mediator'],
    love:
      "You show your heart through consistent actions rather than flowery words. You may not text often, but you're there without fail when it counts, and you calmly think about your partner's family and your future together. Because you don't express much, though, your partner may start to worry whether you really like them. Say \"thank you\" and \"I love this\" out loud, and often, and your dependability will come across as warmth.",
    money:
      "You're good at saving bit by bit, as if burying your money safely in the ground. Rather than rushing after the latest trend, you feel more comfortable putting it somewhere you can watch over for the long haul. Just be careful not to grow so cautious that you put off even necessary spending, or to lend a large sum because your heart got the better of you. Deciding ahead of time on the most you're willing to lend will give you peace of mind.",
    relations:
      "You don't judge people quickly, and you take them in generously. You're remembered as the friend who greets someone like you saw them yesterday, even when it's been ages. On the other hand, once you close your heart, it takes a long time to open it again, and your refusal to budge can feel like a wall. Try thinking of changing your own mind as part of having a big heart, too.",
    health:
      "Traditionally, Earth energy is linked with the stomach and digestion, and with the body's flesh. When you deal with stress by eating, or spend day after day sitting for long hours, your stomach tends to feel bloated and your body heavy. Keep regular mealtimes, and build the habit of a light walk after you eat. If your stomach keeps bothering you, don't put it off. See a doctor.",
    tips: [
      "When someone suggests a new way of doing things, don't turn it down right away. Decide to test it for one week.",
      'This week, be the first to send a short message to someone you feel grateful to.',
      'Clear the center of your home, and make it cozy with beige or brown touches.',
    ],
  },
];
