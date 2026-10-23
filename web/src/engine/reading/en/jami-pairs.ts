import type { JamiPatternKey, JamiPatternReading, PairStarReading } from '../types';

// Readings for two main stars sharing the self area, plus whole-chart patterns.
// Body text uses star nicknames and plain words only, never star, area or pattern names.
export const PAIR_STARS: Record<string, PairStarReading> = {
  '자미+천부': {
    title: 'The king beside the treasury',
    text: `With the King star and the Treasury star side by side, you were born with two gifts at once: the pull to lead people and the instinct to protect what's been built. Big decisions rarely rush you, and you look after everyone so generously that people treat you like the eldest in the family. What you gather, you seldom lose. The catch is a fondness for the tried-and-true way, which can leave you late to new trends. Try being the first to hear out a younger person's odd idea now and then. It makes your reach noticeably wider.`,
  },
  '자미+탐랑': {
    title: 'A crowned charmer',
    text: `The King star with the Charm star beside it gives you dignity and flair in the same package. At a party you can lift the mood without ever losing your center, and with so many hobbies and interests, you're easy company for a long conversation. The risk is that loving so many things lets pleasure crowd out the bigger goal. Keep one steady habit that anchors you, like a class you never skip or a regular workout. With that in place, your charm stops being a spark and becomes a lasting strength.`,
  },
  '자미+천상': {
    title: 'A king with a trusted minister',
    text: `Pairing the King star with the Trust star makes you someone with real presence who still treats people fairly. When a dispute breaks out, you're often the one who listens to both sides and sorts it out calmly. Because your sense of duty runs so deep, you can end up carrying everyone's expectations alone and feeling boxed in, though that pressure is exactly what hardens your skills. Rather than saying yes to every request, be clear about how much you can actually take on. Things feel much lighter once you do.`,
  },
  '자미+칠살': {
    title: 'A king commanding a general',
    text: `Here the King star has the General star under its command, so rough, restless energy turns into authority and drive. Once a goal is set, you push ahead without hesitating, and you shine brightest when a crisis puts you in charge. Bowing to others doesn't come easily, and your temper runs quick, so it's tempting to decide everything alone and carry it alone. Build the habit of asking one or two people you trust before a big call. Your decisions will then have far more people pulling in the same direction.`,
  },
  '자미+파군': {
    title: 'A king who redraws the map',
    text: `When the King star meets the Pioneer star, the urge to clear away old structures and build a new order runs strong. Following a path someone else laid out bores you; fixing and reshaping things is what gets you out of bed. Boldness like this brings plenty of twists in life, and staying in one place too long can start to feel stifling. Before tearing anything down, decide first what deserves to stay. Then change reads less like loss and more like growth.`,
  },
  '천기+태음': {
    title: 'A planner by moonlight',
    text: `The Wisdom star and the Moon star together give you a quick mind wrapped around a delicate sensitivity. Schedules, budgets and numbers come naturally, and you catch small shifts that everyone else misses. Thoughts and feelings rise and fall together, though, so your mind changes often, and moves such as a new home or a new job may come around more than for most. Give each decision a deadline and write down how you reached it. The wobbling settles, and your gift for planning gets its full room to work.`,
  },
  '천기+거문': {
    title: 'A sharp mind with a sharp tongue',
    text: `Put the Wisdom star together with the Words-and-Inquiry star and you get an unusual talent for analyzing, questioning and explaining. You ask "Why?" about things other people take for granted, then dig until you hit bottom, which is how you earn a reputation as the expert. Overthinking can deepen into suspicion, and a cutting remark can be misread. Research, teaching and counseling, any work where words and knowledge are the skill itself, let you shine. Just add a warm line at the end of what you say.`,
  },
  '천기+천량': {
    title: 'The wise advisor',
    text: `With the Wisdom star and the Elder star sharing space, you have a real gift for seeing ahead and giving advice. When friends hit a problem, you're the first person they call, and your ability shows best when you're planning strategy or teaching. Questions about how life works, the kind that philosophy and inner reflection explore, interest you deeply. The danger is talking an idea through so fully that the doing gets delayed. Pick one good idea and try it yourself, even on a small scale. That keeps things in balance.`,
  },
  '태양+태음': {
    title: 'Holding both sun and moon',
    text: `The Sun star and the Moon star sit together here, so you carry two sides: one that steps out brightly into the world and one that prefers to stay quietly inside. You might be upbeat and energetic in front of people all day, then badly need time alone by evening. Work and home, logic and feeling, you can handle both, but caught between two minds, you may put decisions off. When your mood keeps swinging, ask yourself plainly whether this is a moment to step forward or to rest. Balance comes back fast.`,
  },
  '태양+거문': {
    title: 'Words that carry light',
    text: `The Sun star shines straight onto the Words-and-Inquiry star, an arrangement that helps your words and knowledge earn recognition in public. Your explanations are clear and persuasive, so you can build a name in fields where talking is the work, such as teaching, broadcasting, law or sales. You can't let a wrong thing slide, which can sound blunt, and once an argument starts you may want to see it through to the end. The truer your point, the more carefully you should choose the time and place. Then your words move people.`,
  },
  '태양+천량': {
    title: 'A big-hearted elder for everyone',
    text: `The Sun star and the Elder star together give you a generous drive to look after people and lead them. Exams, credentials and public-service work are good places to be recognized, and you earn respect by looking out for younger colleagues and siblings. A strong sense of justice means you're often first to speak up when someone is treated unfairly. Wanting to help everyone, though, makes it easy to give away too much of your own time and energy. Draw the line ahead of time between what you'll help with and what you'll decline. That's how you keep shining for the long haul.`,
  },
  '무곡+천부': {
    title: 'A sturdy keeper of the vault',
    text: `When the Resolve-and-Wealth star meets the Treasury star, the knack for earning money and the knack for keeping it both come alive in you. You choose the sure path over a reckless gamble, and what you save rarely gets scattered. Put you in charge of a household budget or a company's accounts and people say they feel safe. Push frugality too far, though, and you can come across as tight with money. Think of money spent on people and experiences as an investment in yourself. Your relationships and opportunities will both grow.`,
  },
  '무곡+탐랑': {
    title: 'A late bloomer with big petals',
    text: `The Resolve-and-Wealth star joins the Charm star here, giving you a strong drive to actually get your hands on what you want. Ambition and practical sense sit evenly in you, so you have a good feel for trade and business, plus a talent for persuading people onto your side. Early on there's plenty of trial and error, and things may not seem to move as fast as you'd hoped. Experience is what makes you stronger. Rein in that early impatience, and the skills and people you steadily collect come back later as a rich harvest.`,
  },
  '무곡+천상': {
    title: 'The one people trust with the money',
    text: `With the Resolve-and-Wealth star and the Trust star together, you handle both money and promises with precision. Roles where you look after other people's assets and affairs, like accounting or office management, are where trust in you builds quickly. You keep an eye on what's practical, yet you're never stingy about helping others. When loyalty and profit pull in different directions, though, you can deliberate for so long that the decision slips. Write down a few lines about your own principles in advance. At a crossroads, you'll waver far less.`,
  },
  '무곡+칠살': {
    title: 'A warrior who cuts their own path',
    text: `The Resolve-and-Wealth star meets the General star, making you tough-minded and quick to act. The harder the task, the more stubborn determination you find, and you'll push through jobs others have given up on until you get results. A common pattern is going through a rough start and coming out much stronger. Trying to do it all yourself, however, can wear down your body and your relationships, and money moves can be made in a hurry. Sleep on any big decision for at least one night. That habit protects your courage.`,
  },
  '무곡+파군': {
    title: 'A builder who knocks down and rebuilds',
    text: `The Resolve-and-Wealth star and the Pioneer star together leave you fearless about breaking familiar molds and launching something new. Your energy comes alive in your own business or independent work more readily than in years spent under someone else. Bold starts mean big swings in what comes in and what goes out, and trying to change too much at once can scatter your strength. Each time you begin something new, set aside a share you won't touch. If you stumble, you'll still have ground to stand back up on.`,
  },
  '천동+태음': {
    title: 'A soul as gentle as moonlight',
    text: `The Ease-and-Blessings star meets the Moon star, giving you a soft temperament and a rich emotional life. Faced with a choice between arguing and adjusting, you'll usually adjust, and you find joy in hands-on, sensory things like music, painting or cooking. People often say they feel at ease around you. Your love of comfort, though, can make resolutions fade fast, and hurt feelings tend to get swallowed rather than spoken. Write small goals down with a date beside each one. That gives your gentleness some backbone.`,
  },
  '천동+거문': {
    title: 'A deep, thoughtful storyteller',
    text: `The Ease-and-Blessings star shares space with the Words-and-Inquiry star, so you look easygoing on the outside while layers of thought and feeling pile up inside. The part of you that wants a peaceful life collides with the part that wants to question everything, and you may end up stewing alone. Misunderstandings and arguments can wear on you when you're young, but that experience turns into a rare ability to read people, which shines in counseling or specialized skills. Keep putting your inner world into writing or conversation, and life grows easier with every year.`,
  },
  '천동+천량': {
    title: 'A kind protector',
    text: `With the Ease-and-Blessings star and the Elder star together, you're warm-hearted and used to taking care of people. When a friend is struggling, the first thing you do is make sure they've eaten, and work that helps people, such as health care, social services or education, gives you real satisfaction. You also have a lucky streak: when trouble hits, someone tends to appear with a helping hand. A love of leisure, however, can keep you drifting without putting down roots. Choose one goal worth holding on to for years.`,
  },
  '염정+천부': {
    title: 'A principled guardian of resources',
    text: `The Passion-and-Principle star meets the Treasury star, so a fiery spirit is governed by calm management skills. You rarely wear your emotions openly, and you run whatever household or organization you're given with care and fairness. Since you prefer to finish preparing before you move rather than act without a plan, mistakes are few. Too much caution, though, can let good chances slip by. When something is genuinely trustworthy, find the courage to start first, even on a small scale.`,
  },
  '염정+탐랑': {
    title: 'Blazing charm and desire',
    text: `The Passion-and-Principle star and the Charm star together give you a powerful pull on people and a fierce hunger for what you want to do. Sociable and multitalented, you can shine in people-facing work like the arts, performance, hospitality or sales. Fun and temptation, however, can pull your routine apart or make your work uneven. Hold to the limits you set for yourself, and pour your passion into one craft. That charm then settles into solid, lasting skill.`,
  },
  '염정+천상': {
    title: 'A referee of principle and trust',
    text: `Pairing the Passion-and-Principle star with the Trust star makes you someone who draws clear lines between right and wrong and takes promises seriously. Making and keeping rules, or settling conflicts fairly, is where people come to rely on you. Fields where standards matter, like law, auditing or quality control, suit you well. Being torn between principle and personal loyalty, though, can cause you real grief. Take a moment to hear out the other person's circumstances once more. That small pause makes your fairness feel warm.`,
  },
  '염정+칠살': {
    title: 'Like tempered steel',
    text: `The Passion-and-Principle star meets the General star, giving you the will and stamina to break through hardship head-on. You grow stronger on the rough road than the easy one, and once you've set your mind on something, you see it through however long it takes. Hard years when you're young often become valuable capital later on. Your stubborn streak and hatred of losing, however, can lead to clashes with the people around you. Make going forward together the goal, not winning. People will follow.`,
  },
  '염정+파군': {
    title: 'Rising again through upheaval',
    text: `With the Passion-and-Principle star and the Pioneer star together, dramatic change visits your life often, and each time you stand up as someone new. Routine feels suffocating, and you have the creativity to turn situations upside down in ways no one saw coming. When emotions surge, though, you may decide on impulse and regret it later. On days when you're angry or overexcited, put big decisions on hold, and plan your changes in advance. That energy then fuels your growth.`,
  },
};

export const JAMI_PATTERNS: Record<JamiPatternKey, JamiPatternReading> = {
  salPaRang: {
    title: 'The pioneer who rides the waves',
    text: `The General star, the Pioneer star and the Charm star all gather in the areas that surround you. Rather than drifting along calmly, your life tends to change course sharply a few times, and each turn opens a fresh chapter. You're a pioneer at heart. Your ability shows less in a secure post and more in places full of change, on roads no one else has taken. With highs and lows this big, store something away in the good times, and decide on a basic daily routine to return to when things shake. Every bend then becomes a record of growth.`,
  },
  giWolDongRyang: {
    title: 'The steady hands that hold things up',
    text: `The Wisdom star, the Moon star, the Ease-and-Blessings star and the Elder star surround you. Rather than staking everything on one big bet, your strength lies in making a plan and building step by step. You do your best work in structured organizations, such as companies, institutions or the public sector, especially in planning, management or support roles. Careful and diligent, you earn deep trust from the people around you. The downside is that steering clear of risk can mean missing a chance. Every so often, take one step further than feels comfortable.`,
  },
  jaBuYeomMuSang: {
    title: 'Built to run the operation',
    text: `The King star, the Treasury star, the Passion-and-Principle star, the Resolve-and-Wealth star and the Trust star all surround you. A knack for gathering people into an organization sits alongside a feel for managing money and resources. Roles as a manager, an executive or the person in charge of finances are where your true capacity tends to show. The more responsibility you take on, the stronger you become, yet guarding your reputation and stability can make you slow to change. Listen closely to fresh ideas from the people who work under you. Your capacity grows even larger.`,
  },
  myeongjuChulhae: {
    title: 'A full moon in a clear night sky',
    text: `The Moon star sits in the spot where it shines brightest, a prized arrangement that tradition likens to a full moon in a clear night sky. You're never loud about it, but quiet elegance and refined taste win people over. Work that needs calm focus, such as writing, design, planning or finance, is where you shine, and your household and savings tend to grow without fuss. Don't sell yourself short. Show your eye for quality with confidence, and more doors open.`,
  },
  ilwolByeongmyeong: {
    title: 'Sun and moon both bright',
    text: `The Sun star and the Moon star both shine brightly on you from strong positions. Your mind is clear and your judgment decisive, so you tend to see right through the ins and outs of work and people. Out in the world you can gain recognition and a good name, and at home, stability and a well-run household. Help from parents or older mentors is often part of your luck too. Because the light is so strong, though, other people's opinions may weigh on you. Practice moving forward by your own standards.`,
  },
  ilwolBanbae: {
    title: 'Fruit that ripens in the shade',
    text: `The Sun star and the Moon star both sit where their light is faint. When you're young, your efforts may not get the notice they deserve, which can sting, but it also means a long stretch of building real skill out of sight. You often focus best at night while others rest, or working backstage, and fields that reward depth, such as technical work or research, suit you well. Don't rush. Keep stacking up your work, and solid achievements are likely to bloom later, from midlife onward.`,
  },
  seokjungEunok: {
    title: 'Jade hidden in stone',
    text: `The Words-and-Inquiry star sits in its deepest spot with a helpful boost added, an arrangement tradition compares to jade hidden inside a rough stone. Your worth may not show at first, but the longer you polish yourself, the more it gleams. Expertise built through speaking, writing, analysis and research becomes your greatest asset. Instead of stepping into the spotlight too early, build your skill fully first. The recognition then lasts much longer. Just take care that your words don't turn sharp.`,
  },
  jwauHyeopmyeong: {
    title: 'Helping hands on either side',
    text: `Two supporting stars flank you, one on each side. Things go far more smoothly when you work with others than when you struggle alone, and colleagues and friends who lend a hand tend to appear right when you need them. Your strength multiplies in work that involves building teams or connecting people. Never take that help for granted, and say thank you often. Those ties then last for years and come back as bigger opportunities. Don't hesitate to ask for help.`,
  },
  changgokHyeopmyeong: {
    title: 'Learning and letters at your side',
    text: `Two stars of writing and learning flank you, one on each side. Reading, writing and organizing your thoughts come naturally, and your speech and manners often carry a neat, quiet grace. Exams, certifications and work with documents tend to go well for you. Keep notes on what you learn or turn it into writing, and that record becomes a résumé all your own. Make learning part of everyday life, and opportunities keep arriving.`,
  },
  yangtaHyeopgi: {
    title: 'Step by step under pressure',
    text: `Two sharp influences squeeze in from both sides on an area that already carries a blocked energy. In that part of life, burdens may pile up from every direction at once, and it's easy to feel hemmed in. Trying to break through in one push usually just drains you. The more urgent things feel, the more it helps to cut the work into small pieces and solve them one at a time, and when emotions flare, take a day off. The patience you build by holding on becomes a toughness few people have, and the squeeze does ease.`,
  },
  nokmaGyochi: {
    title: 'Wealth that grows as you move',
    text: `Here an energy that draws in wealth meets an energy of movement. Money and opportunity tend to follow you the more you travel around and meet people, rather than when you stay put. You have a good sense for earning income from anything that keeps things moving, such as trade, distribution, jobs with frequent business trips or online selling. The busier you are, though, the more you may spend. Set up a habit of automatically putting aside part of everything that comes in.`,
  },
  hwatam: {
    title: 'Chances that strike like lightning',
    text: `The Charm star sits with a fast, fiery energy. Opportunities can flash into view at the most unexpected moments, and your reflexes for grabbing them are exceptional. Eye-catching results can come in a short time, but the ups and downs come just as quickly. When luck is running your way, stay level-headed and set part of your gains aside. Then a dip won't shake you nearly as much. Put your effort into training your eye to spot the next opportunity, rather than counting on one lucky break.`,
  },
  ssangnok: {
    title: 'A storehouse filled twice over',
    text: `Two energies that attract wealth and good fortune both land in the areas around you. You're blessed with a steady supply of money, resources and helpful people when you need them, along with the strength to hold on to what you've built. Your household finances tend to grow comfortable, and business or management work leaves you breathing room. Lean on that comfort and let your guard down, however, and the momentum can slacken. Add the wisdom to share what you have and put it to sensible use. Then your good fortune stays a long while.`,
  },
  muguiGyeok: {
    title: 'A door that opens after thirty',
    text: `The Resolve-and-Wealth star and the Charm star shine on you together, a combination tradition says stays quiet in youth and rises strongly with age. In your twenties, results may lag behind your hopes and leave you restless. From around thirty, though, the skills and experience you've stored up are likely to turn into solid, practical results. Think of the years before that as a preparation period for gathering ability and allies. Treat early trial and error as tuition, and you'll feel much more at ease.`,
  },
};
