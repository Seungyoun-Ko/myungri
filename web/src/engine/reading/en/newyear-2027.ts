import type { NewYearIntro, NewYearZodiacReading } from '../types';

/** 2027, the Year of the Fire Goat */
export const NEW_YEAR_2027_INTRO: NewYearIntro = {
  title: 'The Year of the Fire Goat: a year for steady warmth and careful craft',
  intro:
    'In the Korean and East Asian zodiac, 2027 is the Year of the Fire Goat. This is not a bonfire kind of Fire. Picture a lamp or a candle that burns low and long, set on earth baked dry by the midsummer sun. That mix rewards care over spectacle: polishing the work already in your hands, looking after the people close to you, and finally finishing the project you keep setting aside. It is a fine year to sharpen a skill or master a craft. The catch is dryness. Fire on parched earth burns out easily, so build in real rest the way you would water a plant before it wilts. One detail people often miss: the zodiac year turns over at Ipchun, the traditional first day of spring around February 4, not on January 1.',
  tips: [
    'Skip the grand launch. Pick one thing to refine with care this year, and keep showing up for it.',
    'Reach out first to someone you are grateful to. Small gestures like that widen your circle all year long.',
    'The busier things get, the more you need cooling down: a glass of water, a short walk, an early night.',
  ],
};

/** 2027 readings by zodiac animal. Keys 0 to 11 = Rat, Ox, Tiger, Rabbit, Dragon, Snake, Horse, Goat, Monkey, Rooster, Dog, Pig */
export const NEW_YEAR_2027: Record<number, NewYearZodiacReading> = {
  0: {
    title: 'Choose your words with care, and misunderstandings melt into trust',
    overview:
      'Quick-witted and sharp-eyed, Rats usually move fast. This year asks you to slow down a little. You say something clearly, or so you think, and the other person hears something else entirely. Tiny things leave someone quietly hurt. A two-word reply in the group chat lands as cold when you only meant to be brief. So the key for 2027 is checking, then checking again. Have the important conversations face to face, and put what you agreed on in writing. Do that and the knots come loose one by one. By the second half of the year, the places where misunderstandings were cleared up tend to become the places where trust runs deepest.',
    work: 'You get things done quickly, but messages can get crossed somewhere between you and everyone else. After a meeting, send a one-line recap of who is doing what and by when. That small extra step heads off trouble later and quietly earns you a reputation for being thorough.',
    money:
      'Money itself is rarely the problem this year. The promises around it are. When you split a bill with friends or lend someone something, settle it right away instead of letting it drift. Scrolling through your automatic payments and subscriptions just once may show you exactly where money has been leaking out.',
    love: 'The feelings have not changed, yet the way they come out can miss the mark and leave you both a little hurt. Rather than filling in the gaps with guesses, try asking, "Wait, did you mean this?" It clears things up far faster. If you are meeting someone new, getting to know them slowly works in your favor.',
    health:
      'A crowded mind tends to make for shallow sleep this year. Put the phone down before bed and jot a few lines about whatever is still nagging at you from the day. Once it is on paper, your thoughts settle. A cup of warm tea helps too.',
    tip: 'Do not let important plans and decisions live only in conversation. Write them down, even briefly, and confirm.',
  },
  1: {
    title: 'Shake up a long-settled routine and set things up anew',
    overview:
      'Oxen are known for holding their ground and working steadily, which makes 2027 an unusually busy year in motion. A move, a transfer to another team, a job change, or a long-overdue clear-out can reshape the routines you know well. It may feel unfamiliar and a bit of a hassle at first. It is also your chance to fix what has felt stuck for years. Rather than bracing against the shake-up, decide for yourself what stays and what goes, and the change starts working for you. Expect more contracts and paperwork than usual too. A habit of reading everything one more time, without rushing, will protect you all year.',
    work: 'The scope of your role, or the people you work alongside, may well change this year. Instead of clinging to the old way of doing things, look for what the new setting can teach you. If you are weighing a job move, compare the offers side by side on paper before you act. You will have fewer regrets.',
    money:
      'Change comes with costs: moving, replacing equipment, extra travel. For anything big, get quotes from two or three places, and double-check the dates and amounts on every contract. Savings you set aside earlier become a sturdy cushion now.',
    love: 'Fresh air blows through your relationships too. With a partner, you may find yourselves revisiting how you live together or what you want down the road. Instead of digging in, ask about each other\'s pace. That kind of conversation makes the bond noticeably stronger.',
    health:
      'Adjusting to a new environment can scramble your daily rhythm. Whatever else shifts, keep your bedtime and mealtimes steady. On days full of travel or errands, a few minutes of stretching will loosen up a stiff body.',
    tip: 'List what you want to change and what you want to keep, and reread every document before you sign it.',
  },
  2: {
    title: 'Your drive becomes the spark that warms everyone around you',
    overview:
      'Tigers have drive to spare. This year, though, your strength shows less in charging ahead and more in warming up the people around you. The effort and ideas you pour in can light a fire under someone else\'s project, and the results may travel further than you expect. Mentoring younger colleagues or organizing a group suits you well right now. The risk is that in looking after everyone, you can run yourself down without noticing. Ease off the urge to do it all, hand off what others can handle, and your enthusiasm will burn far longer. One steady goal you keep coming back to will shine brighter than a single bold leap.',
    work: 'Leading a team or teaching someone tends to land on your desk naturally this year. You will get more done by spotting what each person does best than by pulling everyone along yourself. When the work piles up, set priorities and be ruthless about what you drop.',
    money:
      'Generosity can quietly stretch your budget. Picking up the check or choosing gifts feels good, and you can keep that joy by setting a monthly limit for it. Money spent on learning something new tends to pay you back well.',
    love: 'The way you look after people comes across as genuinely attractive this year. With a partner, ask what they want before deciding what to do for them. New connections are most likely to spark while you are learning something together or helping out side by side.',
    health:
      'Enthusiasm can push you past what your body has to give. Aim for consistency over intensity in your workouts, and keep one day a week completely free for rest. When your body says it is tired, listen now, not later.',
    tip: 'Sort out what to help with and what to hand off, and rest before you run on empty.',
  },
  3: {
    title: 'Bloom alongside people who work in step with you',
    overview:
      'Rabbits bring a fine eye and a delicate touch, and this year things go smoothly whenever you work with others. Someone may show up ready to lend a hand to an idea you have been mulling over alone, and pooling everyone\'s strengths makes the result much more solid. Joint projects, clubs and collaborations are all promising ground for satisfying wins. Luck also favors anything you make or decorate with your own hands. Just watch the habit of swallowing your opinion to keep the mood pleasant, since it can leave you with regrets later. Speak up, gently if you like. The team runs better when your view is on the table.',
    work: 'Collaboration is where your talent stands out this year. Roles that call for taste, like design, planning or styling, are especially likely to win you recognition. Agree on who does what and who gets credit at the very start, and the good mood can last all the way to the finish.',
    money:
      'Useful tips and paid work may come to you through other people. Still, think twice before joining a group purchase or a pricey outing just because everyone else is in. This is a good year to test a small side gig that turns your handiwork into income.',
    love: 'You drift naturally toward people who share your taste. An introduction from a friend or a club meetup could be where you meet someone. If you are in a relationship, try a date where you make something together. A flower market or a weekend workshop fits the mood perfectly.',
    health:
      'With so many people to see, time alone can run short. Leave some evenings deliberately unplanned, and give your mind a break with an easy walk or a little time tending your plants.',
    tip: 'Even when you are working as a team, put at least one of your own ideas into words.',
  },
  4: {
    title: 'The groundwork you laid firms up into solid results',
    overview:
      'Dragons love to think big, yet this year favors strengthening foundations over flashy expansion. Wrap up the projects you started one at a time and put your daily life in order, and you will likely find more left in your hands at the end. You may feel drawn to redoing your home or workspace, or to bringing home things built to last. People may also lean on you to find the middle ground between clashing opinions, and your calm in that role turns into trust. Results may not show right away. Stay patient, and by year\'s end you will be able to point to something real and lasting.',
    work: 'Rather than starting new things, polishing what is already underway is what earns you good reviews this year. You may end up as the person who brings differing views together. Simply hearing both sides out to the end is a bigger contribution than it looks.',
    money:
      'Your knack for saving and holding on to money gets stronger. Instead of spending income as soon as it arrives, split it up by purpose and you will be pleased with the total in December. Before paying for anything home-related or built to last, compare the options carefully.',
    love: 'Comfortable trust deepens this year, more than giddy excitement. With a partner, expect more talk about sharing space and lining up daily habits. Something new could begin with a person you have known for a long time.',
    health:
      'Long hours sitting down can leave your body feeling heavy. Keep regular mealtimes, choose food that is easy on your stomach, and get outside for a walk at least once a day.',
    tip: 'Pick one of the projects you have started and see it all the way through before the year is out.',
  },
  5: {
    title: 'A hidden passion catches fire and your presence shines',
    overview:
      'Snakes tend to dig deep and keep quiet about it. In 2027 that hidden passion comes out into the open. What you want becomes clear, and chances to step in front of people or show your work start to multiply. Presentations, launches and publications, anything that puts your name out there, get a real boost. Because this year\'s energy runs hot in one direction, though, impatience and a sharp tongue can creep in. The hotter things get, the more you need to pause and breathe. Spread that blazing motivation across a steady schedule and your light will last the whole year.',
    work: 'A stage may open up for the skills you have been quietly building. Do not dodge the moments that put you on display, whether that is a presentation, a portfolio, or a conversation about promotion. Taking on everything at once will wear you out fast, so stagger your deadlines.',
    money:
      'When your mood is high, your wallet tends to open with it. If something catches your eye, leave it in the cart overnight before you buy. Money spent on growing your skills is the kind that pays off over the long run.',
    love: 'Your charm comes through clearly this year and draws attention. You may even find the nerve to make the first move on someone you like. In a relationship, hold your words while emotions run hot, then talk it through calmly once things cool. Misunderstandings shrink when you do.',
    health:
      'Heat seems to rise to your head this year, and sleep can get shorter. Drink water often and ease up on spicy, greasy food. In the evening, a lukewarm shower and an early bedtime work wonders.',
    tip: 'The longer your wish list grows, the more it helps to pick just three things to focus on each month.',
  },
  6: {
    title: 'You find a trusted partner and run side by side',
    overview:
      'Lively and straightforward, Horses gain a strong ally in 2027. A colleague or partner who truly gets you may appear, and work that felt like too much alone becomes far lighter shared between two. Good opportunities may also arrive through a referral or an introduction. Close relationships, romance and marriage included, take on a warm glow this year. The one thing to watch is getting too relaxed when everything is going smoothly. Give back as much as you receive from the people who help you, keep your promises faithfully, and these good connections will last for years.',
    work: 'Teaming up with someone on the same wavelength multiplies what you can achieve. Offers for joint projects or even a business partnership may come your way. Spell out each person\'s role and share from day one, and you will enjoy the work right through to the end.',
    money:
      'Your income can grow through the people around you, with paid work that comes by recommendation or a venture you build together. Even with close friends, though, nail down money matters right down to the numbers and dates.',
    love: 'Romance warms up beautifully this year. If you are single, an introduction or a social gathering is a likely place to meet someone you click with. If you are with someone, it is a lovely time to sketch out plans for your future together. A single kind word goes a long way.',
    health:
      'With so many fun plans on the calendar, meals and sleep can slide out of rhythm. In weeks packed with get-togethers, head home early at least one night. Find a buddy to walk or work out with.',
    tip: 'Thank the people who stood by you this year, in words and in actions.',
  },
  7: {
    title: 'Your own zodiac year returns: a time to look back and refine',
    overview:
      'For Goats, 2027 brings back the same energy as the year you were born. Your own zodiac year comes around only once every twelve years, which makes this a natural moment to look back on how far you have come and choose your direction again. You may see clearly which familiar habits have been wearing you down. Being too strict with yourself, though, can leave you feeling drained and parched inside. Instead of scolding yourself for what is missing, start by giving yourself credit for what you have done well. Add small habits of self-care one at a time, and you will build a foundation that carries you through the next twelve years.',
    work: 'Instead of launching something big, this is a good year to review how you work now. Studying to take your skills up a level, or preparing for a certification, suits you well. Try not to rush because of how others are doing. Keep your own pace.',
    money:
      'It is a good year to take an honest look at how you spend. Write down a month of expenses and you may spot patterns you never noticed. A small treat for yourself is fine, but pause before any impulse buy meant to lift a low mood.',
    love: 'You may find yourself thinking again about what kind of relationship lets you feel at ease. If something has been bothering you about your partner, raise it gently rather than letting it pile up. Single Goats may find that time spent caring for themselves first draws the right person in.',
    health:
      'Mental fatigue can show up in your body this year. Keep sleep and meals on a steady rhythm, and let go of tension with a warm bath or some gentle yoga. If discomfort lingers, see a doctor.',
    tip: 'Start a notebook reflecting on your year, and begin by writing down the things you did well.',
  },
  8: {
    title: 'With solid support behind you, hone your talents into real skill',
    overview:
      'Clever and full of talents, Monkeys find learning and support arriving together this year. You might meet a mentor or teacher you can trust, and the resources and openings you need may come more easily than you expect. Like a gentle flame tempering metal, this is the time to shape a scattered handful of talents into one solid skill. A certification or a specialist course suits you well. Your mind moves fast, which means persistence can be the first thing to fade, so practice carrying small goals all the way through. Once consistency kicks in, you will meet a noticeably different version of yourself by December.',
    work: 'Backing or advice from people above you can make work go more smoothly this year. Do not brush off feedback. Jot it down and apply it to the next task. Training or a certification that deepens your expertise is likely to pay off.',
    money:
      'Spending on courses and equipment may rise, but it tends to come back as skill. Rather than paying for several classes or programs at once, finish one before choosing the next. It is also a good time to ask an older person you trust for advice on managing money.',
    love: 'You are drawn to people who are easy to talk to. Someone you meet in a class or through work may naturally become closer. With a partner, conversations where you cheer on each other\'s dreams take the relationship deeper.',
    health:
      'All that brainwork can leave your shoulders and neck stiff. Get up and move every hour, and do not cut back on sleep even on study days. Light exercise helps you stay focused for longer.',
    tip: 'Choose one skill to sharpen this year, and keep at it a little every day while tracking your progress.',
  },
  9: {
    title: 'Carefully polished work gleams and earns recognition',
    overview:
      'Meticulous and holding high standards, Roosters will see their work set before others and judged this year. Like soft lamplight on a gemstone, the things you have polished with care catch the eye, and your name may start to spread. That spotlight also brings pressure to do even better. Instead of waiting for perfect and missing your moment, you need the courage to show your work when it is good enough. Treat even blunt feedback as the polishing that makes you shine, and you will grow a great deal. A neat appearance and a tidy space help your luck shine brighter still.',
    work: 'Expect more work that gets judged on the result: reports, presentations, creative pieces. Your eye for detail is a real asset, but do not let endless revisions push you past the deadline. Decide in advance what finished looks like and you will feel much calmer.',
    money:
      'Quality catches your eye this year. Choosing well-made things that last is smart, but write a shopping list ahead of time so you do not keep adding luxuries on a whim. It is also a good year to talk about pay, using what you have achieved as your case.',
    love: 'Your polished charm stands out and wins people over easily. Holding a partner to the same high standards you set for yourself, though, can create distance. Laugh off the small slips and mention what you like about them first. Things between you will feel much softer.',
    health:
      'Long stretches of tension and dry air can leave your throat scratchy. Drink water often and keep an eye on indoor humidity. After work, switch off the screens and take an easy walk to clear your head.',
    tip: 'Do not wait for perfect. Share your work with the world when it is good enough.',
  },
  10: {
    title: 'Calmly drawing the line between principle and flexibility',
    overview:
      'Loyal and honest to the core, Dogs may find their principles rubbing against the people around them this year. What you believe is right and someone else\'s circumstances can pull in different directions, sparking small frictions, and matters involving rules and procedures may multiply. Contracts, paperwork and official processes will likely need extra checking. None of that is a reason to pull back. When emotions rise, hold off on responding and lay out the facts first, and most situations resolve smoothly. In fact, this is a good year to update outdated rules and redraw the boundaries in your relationships.',
    work: 'Opinions may split over how work gets done or who is responsible for what. Before you argue your case out loud, gather your records and evidence. Read contracts and official documents carefully before signing, and always ask about any clause you do not understand.',
    money:
      'Money tied to paperwork needs close attention this year. Mark deadlines for taxes, insurance and contract renewals on your calendar. If someone asks you to put your name on their financial commitment, think it over very carefully.',
    love: 'Clashing principles can turn into small arguments. Instead of settling who is right, listen for what each of you is trying to protect. The moment you set your stubbornness down a little, trust grows deeper.',
    health:
      'Built-up tension and fatigue can leave your body stiff. Loosen tight muscles with regular walks or stretching, and when anger flares, make a habit of stepping outside for a moment to catch your breath.',
    tip: 'When feelings run high, sleep on it, then sort out the facts calmly the next day.',
  },
  11: {
    title: 'Warm connections gather and laughter comes more often',
    overview:
      'Big-hearted and affectionate, Pigs can look forward to a warm wave of good people this year. You may meet kindred spirits in a new group or club, and reconnect with people you lost touch with long ago. Kindness you showed in the past may come back as unexpected help. When a crowd pulls together on something, you are the one who keeps spirits high. Saying no is hard for you, though, and that can drain your time and money. Decide in advance how much you are happy to give, and stick to it. That limit is what keeps these connections warm for the long haul.',
    work: 'Your talents shine brightest in work done with and among other people. Organizing events and gatherings, or lifting team morale, is where you are most likely to be recognized. When work comes through an introduction, check the terms carefully before you say yes.',
    money:
      'Spending on people tends to climb: get-togethers, celebrations, gifts. Show your affection, but set a monthly budget for it and the strain eases. Useful information may also reach you through mutual friends.',
    love: 'Exciting new connections are likely this year. A friend of a friend, or someone from a group you belong to, could naturally capture your interest. If you are with someone, make sure you protect time for just the two of you. Spreading yourself across a crowd can leave a partner feeling overlooked.',
    health:
      'All those good times can mean overeating and late nights. The day after a get-together, eat light and rest early. Drinking plenty of water and keeping your body warm also help.',
    tip: 'Set aside time and money for yourself first, then share what is left with joy.',
  },
};
