import type { FavorKey, MonthReading, TenGodName, YearReading } from '../types';

/** Reading for each energy that enters this year. The tone line (good / steady / take care) is added separately by the app from YEAR_FAVOR. */
export const YEAR: Record<TenGodName, YearReading> = {
  비견: {
    title: 'A year to stand on your own, with solid allies beside you',
    overview:
      "This is a year when you'd rather do things your own way than wait for someone to tell you what to do. You may start studying something on your own, quietly prepare for the independence you've been putting off, or want your share of the work on the team to be clearly yours. People with similar goals tend to gather around you, and there's real fun in running alongside them. At the same time, more people may be eyeing the same spot you are, so if you set things up for cooperation before competition, the whole year runs much more smoothly. Having the patience to listen one more time before you dig your heels in becomes a real strength.",
    base: "Beneath your days runs a wish to decide things for yourself. So you don't wear yourself out handling everything alone, decide ahead of time where you can borrow a hand.",
    work: "You'll want to carry the work you're given from start to finish with your own hands. It's a good year to start a personal project, a side gig, or preparations to go independent. When your role overlaps with a coworker's, quiet tension builds easily, so write down at the very start who's handling what.",
    money:
      "Spending with friends or siblings tends to grow this year. Split costs pile up, like group dues, shared purchases, and gifts for weddings, funerals and other family occasions. Look at where money is going out before you look at what's coming in, and when a promise involves money, pin down the amount and the deadline so your mind can rest easy.",
    love: "You and a partner can easily slip into a relaxed, friend-like closeness this year. Growing closer through a shared hobby or working out together suits you well. When you each insist on your own way, small things can turn into standoffs, so choose deciding together over winning.",
    health:
      "Feeling confident in your stamina, you may pack your schedule tight. Rather than ramping up workouts alone and pushing too hard, match the intensity with someone you exercise with and it'll last longer. When tiredness builds up, give yourself a day with no plans at all.",
    relations:
      "This year brings new people who share your outlook, and old friends drift back closer too. But the urge to compare yourself with people who are a lot like you rises along with it. When you focus on your own steps instead of other people's pace, your relationships feel much lighter.",
    tips: [
      "Pick one thing you'd like to try on your own, and start it small first.",
      'With the people you work with, divide up roles and shares clearly from the very beginning.',
    ],
  },
  겁재: {
    title: 'A year your competitive fire flares, so pair boldness with clear limits',
    overview:
      "Even people who usually hang back feel a strong pull to \"go for it\" this year. You find more strength than usual when there's competition, and the courage to jump into challenges you've hesitated over. You throw real force into job changes, exams, and anything with a win or a loss on the line. By the same token, money and people come and go quickly, and when enthusiasm runs ahead, your spending or your promises can get too big. Let big decisions sit for a day or two, draw the lines you won't cross ahead of time, and this becomes a year where you gain far more.",
    base: "A quiet refusal to lose hums beneath your daily life. Rather than rushing while comparing yourself with others, write down the standard you actually want and keep to that pace.",
    work: "You grow stronger in head-to-head work this year, like competitive pitches, sales races, or breaking into a new market. But if you brush off a coworker's contribution or try to do it all yourself, people start talking behind your back. If you know how to share the credit, the next opportunity comes back to you even bigger.",
    money:
      "Money tends to go out as fast as it comes in this year. A big purchase on a day you're feeling great, money you lend to others, or a request to cosign a loan all deserve a pause before you decide. Simply keeping separate accounts for living costs and for spending makes your money flow much steadier.",
    love: "You gain the drive to approach someone you like head-on this year. If you're in a relationship, jealousy or a battle of pride may flare up out of nowhere. Instead of words aimed at winning, honestly say why you felt hurt, and you'll actually grow closer.",
    health:
      "When something's on the line, you may want to finish it even if it means staying up all night. Don't try to prove your energy with punishing workouts or heavy drinking, and protect your sleep and mealtimes first. Resting well after you've worked up a sweat is part of the workout too.",
    relations:
      "You build a strong sense of camaraderie with people chasing the same goal, but when interests get tangled, the hurt feelings can run deep too. Settle in advance how money or credit will be shared, and the closer someone is to you, the more carefully you should choose your words.",
    tips: [
      'Let any decision involving a large sum, or lending money, sit for at least a day before you decide.',
      'When you win a competition, make a point of thanking the people who helped, so the next opportunity opens wider.',
    ],
  },
  식신: {
    title: 'A generous year when what you love grows into results',
    overview:
      "Your mind finds some breathing room this year, and you keep producing results you can actually hold in your hands. As you repeat what you love, like cooking, writing, exercise, or working with your hands, it quietly becomes real skill, and that skill can easily lead to work and income. The pleasure of eating well and resting well grows too, and your face looks visibly more relaxed. But because things feel comfortable right now, it's easy to put off new challenges or let your routine go slack. Attach one small goal to your enjoyment, and this sense of plenty stays with you as real achievement.",
    base: "Small pleasures line your days this year. A delicious meal made with care and a hobby where you make something with your hands keep your heart steady and well supported.",
    work: "This is a year when you get even better at what you already know. Work you've built up a little each day is easy to gather into a portfolio or finished piece and get recognized for. Put your energy into work where you can show quality rather than speed, and just watch that picking only the comfortable tasks doesn't make you miss an opening.",
    money:
      "Money earned through your talent or skills tends to grow little by little. A hobby may even turn into a small income. But spending on food and fun tends to rise along with it, so set a monthly cap on eating out and food delivery and your sense of plenty will last longer.",
    love: "Easygoing pleasures help relationships grow this year, like hunting down good restaurants together or planning a trip. New connections tend to form naturally through hobby groups too. Comfort can quietly cut down how much you say, so don't put off the words of thanks.",
    health:
      "As your appetite improves and your body feels at ease, it's easy for your activity level to drop. Keep a light eye on your weight and digestion, and try making a short walk after meals a habit. Just cutting back on late-night snacks can change how your mornings feel.",
    relations:
      "You come across as someone people feel comfortable around, so they naturally gather near you. Treating people to a meal, or making something and sharing it, warms your relationships. Just make sure that saying yes to every favor doesn't eat into your own time.",
    tips: [
      'Put a small deadline on one thing you love doing, and leave it behind as a finished piece.',
      'Lump eating out and food delivery together and set one monthly cap for what you spend on food and fun.',
    ],
  },
  상관: {
    title: 'A year overflowing with things to say and fresh ideas',
    overview:
      "This year you'll want to get the thoughts in your head out into the world. More often you'll find yourself proposing a new approach in a meeting, making content, or finally voicing a complaint you've held in for a long time. Your expressiveness and quick wit come alive, which makes it a good time for standout results. That also means existing rules and the way people above you do things can feel stifling, and your words can easily turn sharp. If there's something you want to change, bring an alternative along with it, and choose the right moment and setting to speak. Then your cleverness turns into trust.",
    base: "Underneath your days is an urge to shake up the way things are done now. Jot down ideas the moment they pop up, and they'll become great material later.",
    work: "You shine in work that shows your thinking this year, like planning, presenting, writing, and design. But if you skip procedures or openly push back on a manager's decision, your results can get overshadowed. Attach your reasons and an alternative to your opinion, and share it one on one first.",
    money:
      "This is a good year to find new streams of income through your ideas or your way with words. On the flip side, impulse buys to lift your mood or a craving for new gear can push spending up. A good habit is to leave what you want in your cart for a day and buy it only if you still need it.",
    love: "Your charm comes through clearly this year in witty remarks and honest expression. But criticism wrapped in a joke can land painfully on the other person. When you bring up something that hurt, talk only about what they did, and avoid words that judge who they are.",
    health:
      "With a busy mind and fast talk, your nerves can get frayed. If your neck and shoulders tighten up or more nights go sleepless, switch off screens early and loosen up your body. Pouring your feelings out in writing is a good way to rest too.",
    relations:
      "It's a good year to meet new people you really click with in conversation. On the other hand, you may butt heads with people above you or anyone who puts rules first. Even when you're right, swallowing it once and rephrasing it gently helps relationships last.",
    tips: [
      'Before you voice a complaint, come prepared with one way to fix it.',
      "Write down ideas the same day they come to you, and see at least one of them all the way through.",
    ],
  },
  편재: {
    title: 'A year of wide-open doors and busy feet',
    overview:
      "Opportunities follow you as far as you're willing to move this year. Business trips, travel, new clients, and unfamiliar gatherings widen your range, and surprise offers or new work can easily come your way. Your eye for the big picture and your practical sense come alive, so you'll want to play on a bigger stage. But the more you hold in your hands, the looser your management gets, and money can flow out as fast as it came in. Setting a limit on how many things you take on and making sure you finish them is the habit that turns this year's wide openings into something truly yours.",
    base: "Your daily life runs at a busy clip, with lots of people and information passing through. Gather your scattered schedules and contacts into one place so you don't lose track of the flow.",
    work: "Outward-facing work gets a boost this year, like sales, negotiation, and planning a new venture. Several offers may arrive at once, so weigh the payoff and the time involved to set priorities. Decide who will handle the wrap-up of anything you start, and your results will stick.",
    money:
      "Your money flow grows bigger and faster this year. While more channels open for money to come in, spending on entertaining clients, getting around, and treating yourself grows along with it. Don't decide on large sums based on one person's word alone, and once a month, sort out your income and spending in actual numbers.",
    love: "There are more chances to meet new people this year, and your heart opens wide. If you're in a relationship, a trip together brings fresh energy to it. So your partner doesn't get pushed aside by a busy schedule, put time for just the two of you on the calendar first.",
    health:
      "With so many plans out of the house, it's easy to skip meals or sleep at irregular hours. If you're on the move a lot, carry water and a simple snack, and slip some breathing room in between appointments. Keep one day of the weekend for resting well at home.",
    relations:
      "The number of people you know grows fast this year, and your network widens. But what widens can easily get shallow. Share some of the care you pour into new acquaintances with your old friends and family too.",
    tips: [
      'Take on no more than two or three new ventures at a time, and make sure you finish them.',
      'Once a month, write down in numbers what came in and what went out, and check the flow.',
    ],
  },
  정재: {
    title: 'A year of building, bit by bit, a solid base for your life',
    overview:
      "What you put in honestly comes back honestly this year. Stable streams settle into place, like a regular paycheck, set contracts, and steady clients, and your wish to put your life in order grows too. It's a great year for keeping a budget, tidying up your home, or setting a savings goal. But as you calculate more, even small losses start to weigh on you, and holding back on new attempts can let opportunities slip by. You need a balance: guard firmly what's worth guarding, but don't skimp on money that helps you grow.",
    base: "A wish to keep life neat and orderly runs beneath your days. A tidy desk and plans that happen as promised put your mind noticeably more at ease.",
    work: "You build trust this year by wrapping up your tasks thoroughly. Your skill shows in work that needs every detail covered, like settling accounts, managing, and coordinating schedules. But so you don't come across as guarding only your own share, talk about the team's bigger picture too.",
    money:
      "Your income steadies and saving starts to feel rewarding. It's a good year to strengthen the basics, like setting up automatic transfers to savings or reviewing your fixed costs. But scrimp too hard and you end up cutting even the money you need for learning or your health. Decide separately where to save and where to spend.",
    love: "Rather than a passing flutter, you find yourself picturing a life built together this year. Your heart goes to someone whose daily habits and spending style match yours. If you're in a relationship, talk of the future comes up naturally, but express your feelings along with it so you don't seem calculating.",
    health:
      "Regular routines stick well this year, which makes it a good time to settle the rhythm of your meals and sleep. But busy with work and running the household, you may begrudge yourself any time off. Put your planned exercise time on the calendar too, like a promise you have to keep.",
    relations:
      "Seen as someone dependable, you often end up taking on small responsibilities. Being precise about money is a strength, but taken too far between close friends it can sting. Every now and then, being the one who picks up the tab first warms things up.",
    tips: [
      'Review your fixed costs once, and set up one savings plan that grows automatically.',
      "Set aside a separate budget you won't skimp on for learning and health that help you grow.",
    ],
  },
  편관: {
    title: 'A year when heavy challenges lift your skills to the next level',
    overview:
      "This year easily brings things that weigh on your shoulders, like suddenly being handed a task, an unexpected change, or higher expectations. Even if it feels like too much at first, under that pressure your ability to handle a crisis and make tough calls grows a lot. Pull off the work others avoid, and your reputation can jump in one go. But if you try to carry everything alone, your body and mind wear out fast. Set the order of what needs doing and build places to ask for help in advance, and this year's tension stays with you as real skill.",
    base: "A quiet tension runs under your daily life this year. Keep your to-do list short, and be sure to end each day with some time of your own to set that tension down.",
    work: "This year brings chances to show what you're made of by taking on a tough project or a hard problem. Deadlines and responsibilities may pile up, so say early what you can't do and adjust the scope. Don't absorb pressure from above on your own; keeping a written record gives you solid footing.",
    money:
      "Unexpected expenses tend to come up this year. Money you can't postpone may go out, like repair bills, wedding or funeral gifts, or sudden travel, so set aside an emergency fund. Above all, avoid signing a contract in a hurry without checking the terms.",
    love: "You may find yourself drawn to strong, responsible people this year. If you're in a relationship, tension from work can spill over and sharp words may slip out. On draining days, say you're worn out before anything else, and your partner can wait for you without misunderstanding.",
    health:
      "When tension drags on, your shoulders tend to stiffen and your sleep gets shallow. Release it with exercise that gets you out of breath, and leave time between plans to breathe deeply. If the fatigue lingers, don't put it off and go see a doctor.",
    relations:
      "You may run into people who seem to be testing you, or a demanding boss, this year. Rather than confronting them head-on, responding with clear principles and written records actually earns you trust. Make sure you keep at least one person close whom you can lean on when it's hard.",
    tips: [
      "Don't keep an overwhelming task to yourself; ask early for the scope to be adjusted.",
      'Set aside an emergency fund, separate from your living costs, for sudden expenses.',
    ],
  },
  정관: {
    title: 'A year your effort is recognized and your place grows solid',
    overview:
      "The path you've walked so faithfully is likely to be officially recognized this year. Things that put your name out there come along, like a promotion, passing an exam, or an offer of an important role, and people around you trust you with more. Order settles into your daily life too, making it a good time to build a regular rhythm. With that come more expectations and more eyes on you, and the feeling that you can't afford a mistake can drive you too hard. Rather than swallowing what you want to say to save face, practice speaking up within the rules, and the recognition will last.",
    base: "A wish to live properly and in good order runs through your days. Clear rules actually make you feel steadier, so try keeping your daily plans simple and orderly.",
    work: "You can hope for good results this year in formal settings, like reviews, promotions, and certification exams. The more you follow the set procedures and report thoroughly, the more trust builds. Just don't let the push for perfection slow the work down; get feedback before the deadline.",
    money:
      "Regular income steadies this year, and rewards that come with your role are likely to follow. Along with that, spending to keep up appearances and look the part can grow. Keep the money you spend on how you look to others separate from the money you spend on yourself, and you'll find your balance.",
    love: "You want a serious, trustworthy relationship this year. Connections are likely to come through introductions or formal occasions, and if you're in a relationship, talk of promises about the future may come up. Don't stay on your best behavior the whole time; let them see your relaxed side too.",
    health:
      "A healthy rhythm settles in nicely this year, so it's a good time to exercise and eat at set times. On the other hand, your mind can tense up from staying aware of other people's expectations. After work, cut back on work messages and protect time to rest with your mind at ease.",
    relations:
      "This is a year to earn the trust of people above you or more senior colleagues and to get good recommendations. But if you talk a lot about right and wrong, the people close to you may feel some distance. Save the strict principles for work, and be a little more generous with people.",
    tips: [
      "If there's a certification exam or review you've been putting off, set a date to take it on this time.",
      'Think deadline first, perfection second, and get frequent check-ins along the way.',
    ],
  },
  편인: {
    title: 'A year when rare insight grows in time spent alone',
    overview:
      "You find yourself looking inward rather than outward this year. You may dig deep into a new field, pick up a skill few people know, or rethink the direction of your life. Your intuition sharpens, so you sometimes notice a problem before others do. Along with that, your thoughts multiply and planning drags on, so action can easily lag behind. Spending more time alone is a natural part of this flow, but your ideas only become real when you come out among people now and then and share your thinking.",
    base: "Your days hold more quiet time lost in thought. Habits like walking slowly on your own or keeping a short note on your day help sort out a cluttered mind.",
    work: "You find answers no one else does this year in work that calls for deep thinking, like research, analysis, and planning. It's also a good time for transitions, like changing career paths or learning a new skill. But hold on to something alone for too long and you can drift off course, so share your progress along the way and get feedback.",
    money:
      "Your heart leans toward learning and experiences more than money this year. Money spent on growing yourself, like classes, books, and gear, has meaning, but subscriptions or courses you'll never finish can pile up too. Before paying, first check whether you actually have the time to use it.",
    love: "You're drawn this year to someone who understands you deeply even without many words. As your wish for time alone grows and you text less often, a partner may start to feel uneasy. When you need time to yourself, tell them why, even briefly.",
    health:
      "With one thought chasing another, it's easy to struggle to fall asleep or rush through meals. Moving your body is the fastest way to rest your mind. Slow the speed of your thoughts with gentle yoga or a walk, and at least keep your mealtimes fixed.",
    relations:
      "Your heart goes toward a few people you connect with deeply rather than a wide circle this year. If you weigh things alone, reach a conclusion, and simply announce it, misunderstandings follow. Share your thinking process bit by bit and people will follow along much better.",
    tips: [
      'Choose one field that interests you and dig into it until a small finished result comes out.',
      'Before acting on a plan you made alone, talk it over first with one person you trust and refine it.',
    ],
  },
  정인: {
    title: 'A reassuring year with learning and help arriving steadily',
    overview:
      "Helping hands reach you naturally this year. You're likely to meet a good mentor or teacher, get your family's support, or find studies and exam preparation going smoothly. You may also see good results in things that leave a paper trail, like contracts and certificates. Your mind settles and your thinking deepens, making it a great time for long-range plans. But once you get used to receiving, your drive to move on your own can slacken. Put what you've learned into practice yourself and pass the help you've received on to others, and this year's sense of security lasts even longer.",
    base: "Beneath your daily life is a sense that someone has your back. Don't put off saying thank you, and that help will keep flowing steadily all year.",
    work: "Work that builds your skills gets a boost this year, like studying, earning certifications, and training programs. Advice from people above you helps a lot, so don't wrestle with problems alone, and ask. To keep preparation from dragging on, practice putting what you learn straight into your actual work.",
    money:
      "A steady flow rather than big money continues this year. While sorting out contracts or paperwork, you may find benefits or refunds you'd missed. If you end up accepting help from family or someone close, making your thanks and your plan to repay clear puts your mind at ease.",
    love: "Your heart goes to someone who cherishes and looks after you this year. If you're in a relationship, a daily life of taking care of each other makes things stronger. But if you only lean on them, your partner can get worn out, so show your feelings as much as you receive.",
    health:
      "Your mind relaxes and your downtime grows this year. Resting is good, but the longer you spend lying around, the heavier your body feels. Work some light stretching or a walk into your daily routine, and keep your sleep regular.",
    relations:
      "Your bonds with elders, mentors, and family grow warmer this year. There are people near you who can give good advice, so open up and ask. Repay the help you get with a small gift or a quick update, and those connections will last.",
    tips: [
      "Start the studying or exam prep you've been putting off, and keep it going at a set time every day.",
      'When someone helps you, thank them within the week and share how things are going.',
    ],
  },
};

/** One line for each energy that enters a month. The app chooses the tone. */
export const MONTH: Record<TenGodName, MonthReading> = {
  비견: {
    good: "A good month to push ahead your own way on work you've been handling alone. If there's something new to start, take that first step too.",
    normal: "A good month to sort out roles with your coworkers. Split up any overlapping tasks ahead of time and things will run more smoothly.",
    caution: "Stubbornness tends to creep in this month. Even if you're sure you're right, wait a beat before deciding and hear other opinions first.",
  },
  겁재: {
    good: "Competition fires you up this month. If there's a challenge you've been putting off, go ahead and sign up.",
    normal: 'A little more money tends to go out this month. Pick only the gatherings and plans you truly need.',
    caution: "Think twice before lending money or making a big purchase this month. Hold off on promises made in the heat of the moment, too.",
  },
  식신: {
    good: "A good month for producing results you can hold in your hands. Finish a hobby project or piece of work and show it off, and the response will be warm.",
    normal: "A month to refill your energy with good food and downtime. Calmly keep going with what you've been doing.",
    caution: "It's easy to drift toward whatever feels comfortable this month. Try cutting back just a little on late-night snacks and the habit of putting things off.",
  },
  상관: {
    good: 'A good month to share your ideas and present them. Put a new plan or piece of content out into the world.',
    normal: "Lots of ideas come to you this month. Jot them down, then pick just one that's worth using and polish it.",
    caution: 'Your words can easily turn sharp this month. Steer clear of arguing with people above you or pushing back in public.',
  },
  편재: {
    good: 'The more you meet people and get out and about, the more chances stick to you this month. Take a serious look at any offers that come in.',
    normal: "Plans and appointments multiply this month. Keep your calendar all in one place so nothing slips through.",
    caution: "Spending tends to swell and new projects keep sprouting this month. If you can, push new ventures and big purchases to next month.",
  },
  정재: {
    good: "A good month to sort out your income and spending and grow your savings. Finally settle any accounts you've been putting off, too.",
    normal: "A month for wrapping up your tasks carefully. Take one look at your fixed costs and you'll spot where money is leaking.",
    caution: "Small losses can weigh on your mind this month. Put people before the numbers and you'll feel more at ease.",
  },
  편관: {
    good: "A good month to take on something hard and show what you can do. Be the first to raise your hand for the task you've been avoiding.",
    normal: 'Your responsibilities grow a little this month. Keep your to-do list short and work through it in order.',
    caution: 'Pressures tend to stack up this month. Go slow on taking new work, and ask for help early with anything that feels like too much.',
  },
  정관: {
    good: "A good month to leave a strong impression in formal settings, like reviews or interviews. Show everything you've prepared.",
    normal: 'Simply keeping to set rules and schedules builds trust this month. Be thorough with your reports and updates.',
    caution: "You can wear yourself out worrying how others see you this month. Rather than straining for perfection, focus only on meeting your deadlines.",
  },
  편인: {
    good: "A good month to dig deep into a new field. Finally start that class or book you've been curious about.",
    normal: 'You need time alone to sort out your thoughts this month. Take a slow walk and refine your plans as you go.',
    caution: 'With so much on your mind, decisions can drag this month. Give yourself one day to mull it over, then act, starting with something small.',
  },
  정인: {
    good: "Studying and exam prep go smoothly this month. It's also a good time to finally sort out paperwork or contracts you've put off.",
    normal: "Advice from people around you helps this month. When you're stuck, don't wrestle with it alone; ask first.",
    caution: 'Wanting to rest can let work pile up this month. Set a goal to finish at least one thing each day.',
  },
};

/** Two possible opening lines, depending on how well this year's energy suits you */
export const YEAR_FAVOR: Record<FavorKey, [string, string]> = {
  good: [
    "The energy entering this year is exactly what you need right now. Things that felt stuck can finally breathe, and the more you move, the more results follow.",
    "This is a year when energy arrives to fill in what you've been missing. Bring out plans you've shelved and carry them out one step at a time, and you'll find good momentum behind you.",
  ],
  normal: [
    "This year's energy doesn't lean hard either way for you; it flows along smoothly. You'll see better results by polishing what you're already doing than by chasing big changes.",
    "This is a year that doesn't tip toward good or bad. How things go depends on how you use it, so calmly take care of the basics.",
  ],
  caution: [
    "The energy entering this year may feel a little heavy for you right now. Bring your pace down a notch and work through what truly matters in order, and you'll get through it just fine.",
    "This is a year when tiredness can build up as fast as your effort does. Rather than expanding, focus on sorting things out and making time to rest, and you'll keep your footing all year.",
  ],
};

/** When this year's underlying energy clashes with, pulls toward, or matches the area of your chart about your partner */
export const YEAR_DAY: { chung: string; hap: string; same: string } = {
  chung:
    "This year, things tend to start moving around your home and your closest relationships. A move, a big clear-out at home, or a change in your daily rhythm may come along, and there may be more days when you and someone close don't see eye to eye. Treat what's changing as a chance to find a new fit together, and talk often.",
  hap: "This year, the distance between you and the people closest to you narrows naturally. A new connection may come along or talk of living together may come up, and time spent at home tends to feel more comfortable. Just as you lean on each other more, protect each other's time alone too.",
  same: "This year, familiar patterns at home and in your closest relationships come into sharper focus. As comfort grows, it also gets easier to bump into the same problem again and again. Try changing one daily habit together, and a fresh breeze will blow into the relationship.",
};
