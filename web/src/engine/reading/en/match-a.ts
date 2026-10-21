import type { MatchPairReading } from '../types';

// Compatibility A: pairs where the first person is a tall tree, a wildflower or the sun. Keys are `${a}-${b}`, a <= b.
export const MATCH_A: Record<string, MatchPairReading> = {
  // tall tree + tall tree
  '0-0': {
    title: 'Two tall trees side by side, growing into a forest together',
    summary:
      "Both of you carry the energy of a tall tree that wants to grow straight up. Standing shoulder to shoulder, you become a forest that breaks the wind for each other, though it's just as easy to start measuring who's taller while you reach for the same sunlight. Your ways of thinking, and your particular brand of stubbornness, are so alike that conversation comes easily, and each of you respects the other as an equal. Work out who leads where, and this is a bond that keeps growing for years.",
    together:
      "Once a goal is set, neither of you hesitates, so anything you take on together moves fast. When one of you runs out of steam, the other becomes the shade to rest in, and since you both treat a promise as something heavy, trust builds quickly. If romance enters the picture, it tends to look like two comrades cheering on each other's dreams.",
    friction:
      "Bending isn't either of your strong suits, so when you disagree, nobody steps back first. Even a simple trip plan can turn into a standoff of \"my way is the right way.\" And when one of you gets promoted or praised first, the other may offer real congratulations while quietly keeping score inside.",
    tips: [
      'For anything you do together, divide it into zones and let each person own theirs.',
      "When you can't agree, make a rule to sleep on it and pick the conversation back up the next day.",
    ],
  },
  // tall tree + vine
  '0-1': {
    title: 'A vine climbing a tall tree: one leans, the other holds steady',
    summary:
      "One of you is the tall, upright tree; the other is the vine that winds its way up the trunk. You seem to grow from the same root, so your instincts match and closeness comes easily from the start. The tree offers something solid to lean on, and the vine dresses the tree in flowers and fresh life. Being this close, though, it's also easy for a quiet habit of tallying who gets what to grow right alongside you.",
    together:
      "The tree-like person sets the broad direction, and the vine-like person finds clever paths within it. When one makes the big call, the other smooths over the gaps between people, which makes you a strong unit whenever you work as a team. As partners in love, you trade a place to lean for a reason to laugh.",
    friction:
      "The vine-like person may lean in lightly while still making sure to collect their share, and the tree-like person can find that a little galling. Flip it around, and when the tree decides everything alone, the vine feels smothered. Splitting a dinner bill or sorting out who gets credit for a project are the moments when small resentments pile up.",
    tips: [
      'From the very beginning, keep shared money and personal money in separate pots.',
      'Make a habit of saying thank you out loud on the same day someone does something kind.',
    ],
  },
  // tall tree + sun
  '0-2': {
    title: 'A tall tree turning greener in the sunlight, each making the other shine',
    summary:
      "Picture a tall tree growing quietly and the midday sun pouring down on it. That's the two of you. Thanks to the sun, the tree spreads its leaves wide, and thanks to the tree, the sun's warmth becomes something you can actually see. Together, the mood lifts and ideas that were stuck inside come tumbling out. It's a bright pairing. The only thing to watch is a pattern where one side does all the giving.",
    together:
      "The sunny person brings laughter and energy to the tree-like person's serious plans, while the tree-like person takes the sunny one's ideas and actually grows them into something real. In a meeting, one floats a thought and the other picks it up and makes it concrete. As a couple, you're the kind of pair other people simply enjoy watching together.",
    friction:
      "The tree-like person can pour so much energy into making the other shine that exhaustion hits out of nowhere. The sunny person moves on impulse while the tree-like person wants to stick to the plan, so even one weekend schedule can put you out of step. If the praise always lands on the same person, hurt feelings follow.",
    tips: [
      'Once a month, spend a whole day doing things exactly the way the other person chooses.',
      "When credit is being handed out, be the first to say the other person's name.",
    ],
  },
  // tall tree + lamp
  '0-3': {
    title: 'A tall tree that becomes firewood to keep a lamp burning long',
    summary:
      "One of you is a big, solid tree; the other is a lamp glowing softly in the dark. The tree becomes the steady fuel that keeps the flame from going out, and the lamp turns the tree's rough, unpolished feelings into warm, visible light. It isn't a flashy bond, but it lights a night road for a very long time. Still, a whole log has to be split before it will catch, and in the same way, you'll need a little time to shape yourselves to each other.",
    together:
      "With a careful eye, the lamp-like person spots what the tree-like person's plans have missed, and the tree-like person's unshakable consistency is deeply reassuring in return. This is a connection that deepens the later the conversation runs into the night, and if it turns into romance, a quiet but rich affection builds up over time.",
    friction:
      "The tree-like person pushes ahead looking only at the big trunk of things, while the lamp-like person can be stirred by a single small remark, so your emotional temperatures drift apart. If one of you swallows hurt feelings instead of saying them, talks can turn awkward and stiff. Watch, too, for a setup where the tree side is always the one giving.",
    tips: [
      'Before any big decision, make sure to ask at least one question about how the other person feels.',
      "Set aside regular evenings where the phones go down and it's just the two of you talking.",
    ],
  },
  // tall tree + mountain
  '0-4': {
    title: 'A tall tree rooted in a great mountain, covering it in green',
    summary:
      "This pairing brings together a tree reaching upward and a great mountain holding its ground. The tree sinks roots into the mountain and finds a place to stand firm, and because of the tree, the mountain gets to wear a green forest. One pushes forward while the other holds steady behind, which makes you a good pair for taking on something big together. But just as roots work their way into rock, one side's urge to pull the other along can grow too strong.",
    together:
      "The tree-like person sets goals and leads the way, and the mountain-like person guards the rear with a calm that's hard to shake. Long-haul projects like starting a business or buying a home bring out the best in both of you. In love, you become a hillside the other can lean back against.",
    friction:
      "The tree-like person wants change, and soon. The mountain-like person is comfortable right where things are, so talk of moving house or switching jobs is where you clash most. The more the tree pushes, the more the mountain refuses to budge. And when the mountain-like person feels dragged along, it's easy for them to close off quietly without saying a word.",
    tips: [
      'When you suggest a change, settle on a generous timeline together instead of springing a deadline.',
      'Deliberately create chances for the mountain-like person to be the one who picks and decides first.',
    ],
  },
  // tall tree + garden soil: strong pull
  '0-5': {
    title: "Rich soil cradling a great tree's roots, a pair with a natural pull",
    summary:
      "One of you is a tall, upright tree; the other is the rich garden soil that wraps gently around its roots. Of all the pairings, this one is counted among those with the strongest mutual pull, so from the first meeting there's a strange sense of ease and trust. Rooted in that soil, the tree stops wobbling, and with the tree there, the soil feels useful and needed. Because the attraction runs so deep, the real task is balance, so neither of you leans on the other too much.",
    together:
      "The soil-like person shapes the tree-like person's big ambitions into practical plans. Beside the tree, the soil-like person finds stability; beside the soil, the tree-like person learns how to rest. As lovers, you can easily become a long-lasting pair who move in sync without needing words, and as coworkers, you're the kind who hand each other work without a second thought.",
    friction:
      "The soil-like person may keep putting their own things off to look after the other, and then one day feel strangely hollow. The tree-like person can start taking that care for granted and isn't great at expressing thanks. And with both of you constantly adjusting to each other, your individual colors can fade until you both feel a bit stifled.",
    tips: [
      "Put time for each person's solo hobby on the calendar and protect it for each other.",
      'Name the specific things the soil-like person did for you, and say thank you for each one.',
    ],
  },
  // tall tree + iron ax
  '0-6': {
    title: 'A tall tree meets the ax and becomes useful timber',
    summary:
      "Picture a towering tree, and then a hard iron ax. The ax trims and shapes the tree into timber fit for beams and posts. So this relationship is marked less by comfort than by a tension that toughens you both. You may clash sharply at first, but over time, each of you tends to feel that the other has made you stronger.",
    together:
      "The metal-like person makes quick decisions and cuts away the fluff, ranking priorities in the tree-like person's overflowing plans. In return, the tree-like person shows the metal-like person what long endurance looks like, and how to make room for people. Meet at work and you'll be a team that delivers results. In love, it's a romance with an edge of tension, built on genuine respect.",
    friction:
      "The metal-like person's short, blunt words can hurt the tree-like person like branches being lopped off. Both of you have plenty of pride, so once an argument starts, it easily turns into a contest over who wins. If the mood settles into lots of criticism and very little praise, one of you will burn out first.",
    tips: [
      'Make a rule that every piece of criticism comes paired with one honest word of recognition.',
      "Pick a shared goal and train for it together, whether it's a fitness challenge or a race.",
    ],
  },
  // tall tree + carving knife
  '0-7': {
    title: 'A carving knife bringing out the grain of a great tree',
    summary:
      "One of you is a big, sturdy tree; the other is a small but razor-sharp carving knife. Where the tree might have stayed a plain log, the knife brings out its grain and etches beautiful patterns into it. Your temperaments differ enough to create a curious attraction, and in this pairing, the tree-like person gets polished into something more refined. Just remember that even a small blade stings when it touches you too often.",
    together:
      "The knife-like person has a sharp eye and clear standards, neatly tidying up the tree-like person's rough edges. The tree-like person, with a generous spirit, makes room for the knife-like person's sensitivity. If you're together romantically, you carry yourselves with a certain class and feel proud of each other. At work, you get both the big picture and finished quality at once.",
    friction:
      "The knife-like person can't let even small flaws slide, down to an outfit or a tone of voice, and when those comments pile up, the tree-like person hears nagging. Then if the tree side waves it off with \"It's not a big deal,\" the knife side feels dismissed. The key is not to let a difference in standards grow into a fight.",
    tips: [
      "If there's something you'd like the other to change, bring up only one thing at a time.",
      'Visit a workshop together and make a small piece out of wood or metal side by side.',
    ],
  },
  // tall tree + great river
  '0-8': {
    title: 'A tree rooted by a wide river, receiving plenty and growing tall',
    summary:
      "A tall tree stands upright, and beside it a broad river flows generously. That's the picture here. The river soaks the tree's roots so they never dry out, and the tree casts shade on the bank, making a place to stop and rest. The river-like person's wide view of the world helps the tree-like person grow. But just as a flood can wash a tree away, care that goes too far starts to feel like a weight.",
    together:
      "The river-like person keeps sending a steady stream of information, contacts and fresh perspectives, and the tree-like person takes all of it and grows it into real results. You fit especially well as teacher and learner, so studying together or meeting as mentor and mentee speeds up growth for you both. In romance, it's an easy match between a generous soul and a steadfast one.",
    friction:
      "The river-like person's stories wander off in every direction, while the tree-like person wants to focus on one thing, so your conversations run at different speeds. When the advice overflows, the tree-like person starts to feel their own judgment isn't trusted. And because the river side values freedom, contact can come in unpredictable bursts that leave the tree side uneasy.",
    tips: [
      'Before offering advice, ask first: "Do you want help with this, or just an ear?"',
      'Agree ahead of time on how often you will check in each day, at a pace that feels easy for both.',
    ],
  },
  // tall tree + rain
  '0-9': {
    title: 'Soft rain soaking in, quietly helping a great tree grow',
    summary:
      "Think of a towering tree and a gentle rain that falls without a sound. Without any fuss, the rain seeps all the way down to the deepest roots and helps the tree grow. That's why, in this relationship, care that never shows on the surface becomes a real source of strength. As long as the tree-like person notices that quiet nurturing, you'll stay grateful to each other for a long time.",
    together:
      "The rain-like person reads shifts in the other's mood early and quietly has what's needed ready before anyone asks. The tree-like person, steady and unshaken, becomes the support the rain-like person can lean on. When you work together, ideas come from the rain side and momentum from the tree side. If it turns into love, expect a calm romance that keeps deepening.",
    friction:
      "Even when hurt, the rain-like person won't say it out loud and ends up overthinking alone, while the tree-like person charges ahead, eyes forward, without noticing. Then when the rain side finally pours out everything at once, the tree side is caught completely off guard. Keep an eye on how differently you express things, so it doesn't swell into a misunderstanding.",
    tips: [
      'Once a week, each share one thing you were grateful for and one thing that stung.',
      'Create a small ritual for rainy days, like a walk under one umbrella or a pot of tea together.',
    ],
  },
  // wildflower + wildflower
  '1-1': {
    title: 'Two flowers sharing one garden bed, blooming together',
    summary:
      "Both of you have the energy of wildflowers or vines that bend gracefully as they grow. You're both quick to pick up on a mood and read a room, so there are plenty of moments when you understand each other without a word. Like vines twining together, you have a knack for getting through hard times side by side. Wanting the same sunlight and water, though, you can also slip into quiet comparison and keeping an eye on each other.",
    together:
      "You're both gifted at filling the gaps between people, so in any group or team, you become the duo that keeps the energy up. Each of you knows exactly what hurts the other, which makes your words of comfort precise and warm. With similar taste, decorating or shopping together is a pleasure, and in a relationship, you fill everyday life with sweet little touches.",
    friction:
      "Neither of you likes head-on conflict, so you both tend to talk around things and say you're fine even when you're hurt. You can grow sensitive about who gets more recognition or who does more caring, until a single message in the group chat feels loaded. And when you look only to each other for something to lean on, you can both end up wobbling at the same time.",
    tips: [
      'Instead of hinting at what hurt, say it briefly and clearly.',
      'Choose one shared goal outside of each other that you can both lean on together.',
    ],
  },
  // wildflower + sun
  '1-2': {
    title: 'A flower opening wide in the sunshine, a dazzling match',
    summary:
      "A delicate flower coming into bloom, and the sunlight shining brightly on it: that's you two. Under the sun, the flower shows its loveliest colors, and with the flower there, the sun's warmth looks even brighter. Together, you light up everyone around you. It's a radiant pairing. But just as petals wilt when the sun is too hot, you'll need to match the temperature of your enthusiasm.",
    together:
      "The flower-like person uses taste and flair to dress up the sunny person's big ideas, and the sunny person draws the flower-like person's talents out into the open and puts them on stage. You click especially well on anything meant to be seen, like taking photos or designing a space. In love, this is the kind of relationship where the flutter lasts a long time.",
    friction:
      "The sunny person loves crowds and packed schedules, and the flower-like person can wear out quickly trying to keep pace. The flower side may spend every bit of energy making the other shine, then suddenly feel overlooked. And the sunny side's unfiltered honesty can land on the flower side like a sunburn.",
    tips: [
      'When you make plans, also schedule a day together where you do absolutely nothing.',
      'When the flower-like person has even a small win, let the sunny person celebrate it in a big way.',
    ],
  },
  // wildflower + candle
  '1-3': {
    title: 'A small lantern lighting a night garden, two kindred sensibilities',
    summary:
      "One of you is a tender wildflower; the other is a candle burning softly nearby. Just as a handful of dry grass can bring a tiny ember back to life, the flower-like person kindles a fire in the candle-like person. You're both emotionally attuned and treasure atmosphere, so time together feels cozy and sheltered. Being so sensitive, though, each of you easily catches the other's emotional weather.",
    together:
      "The flower-like person offers ideas and inspiration, and the candle-like person shapes them into warm words and finished work. Anything that takes delicate hands, like writing, music or crafts, can turn out remarkably well when you do it together. Late-night talks run especially deep, and as a couple, you notice each other's feelings with real tenderness.",
    friction:
      "When one of you feels low, the other tends to sink right along, and you can both end up drooping together. Reading meaning into every tone of voice and every reply time can let misunderstandings snowball. Practical matters like bills and schedules also tend to get pushed aside by both of you until they all land at once.",
    tips: [
      "Agree in advance that on low-mood days, you'll both give each other permission to rest.",
      'Assign clear owners for the boring tasks, like paying bills or making reservations.',
    ],
  },
  // wildflower + mountain
  '1-4': {
    title: 'Wildflowers embroidering a great mountain, a small touch changing a vast view',
    summary:
      "Imagine a wildflower or vine that can grow even in the cracks between rocks, and a broad, heavy mountain. The wildflower leans on the mountain to find a foothold, and thanks to the wildflower, the mountain gets a new face every season. Your size and pace seem worlds apart, yet you fill in exactly what the other lacks. Just make sure the smaller side doesn't wear itself out trying to move the bigger one.",
    together:
      "With a talent for connecting people and a practical, savvy sense, the wildflower-like person lets some air into the mountain-like person's heavy workload. The mountain-like person, with unwavering trust, becomes solid ground where the wildflower can spread out without worry. Run a household or a small shop together and management and stability mesh well. In love, you trade steadiness for liveliness.",
    friction:
      "The wildflower-like person wants quick reactions and quick changes, while the mountain-like person lingers on \"Let me think about it,\" which can get frustrating. When the wildflower side starts pressing about every little thing, the mountain side feels the weight and grows even heavier. The mountain's unreadable expression is easily taken by the wildflower as a lack of interest.",
    tips: [
      "When an answer is going to take a while, let the mountain-like person say upfront by when they'll decide.",
      'On a weekend morning, take a slow walk together up a low hill or along a forest trail.',
    ],
  },
  // flower + garden soil
  '1-5': {
    title: 'Garden soil and the flower above it, blooming with every bit of care',
    summary:
      "One of you is a delicate, swaying flower; the other is the soft garden soil that raises it. On paper, this is about the most natural pairing there is, so your daily rhythms line up from the start. The soil feeds the flower, and the flower crowns the soil with color and fragrance, completing the garden. But the more the flower draws, the drier the soil becomes, so it's important to keep an eye on the balance of give and take.",
    together:
      "You're both meticulous and practical, so whenever details matter, like running a home, planning a trip or a small side business, you work together like clockwork. The soil-like person quietly takes care of things, and the flower-like person polishes the results and presents them beautifully to others. Romantically, you lovingly tend the small moments of everyday life.",
    friction:
      "The flower-like person has a gentle way of getting what they want in the end, so the soil-like person can easily become the one who always gives in. Since you both care about the small stuff, even a grocery list can set off a round of nagging. And if the soil side hides being worn out until it suddenly bursts, the flower side is left confused about what just happened.",
    tips: [
      "So it's not always the same person yielding, take turns being the one who gets to choose.",
      'Pick out a houseplant or a small vegetable patch and take turns looking after it together.',
    ],
  },
  // vine + rock: strong pull
  '1-6': {
    title: "A vine embracing solid rock, drawn together because they're opposites",
    summary:
      "One of you is a vine or flower that wraps around things softly; the other is solid rock or cast iron. Your natures couldn't be more different, yet you pull at each other like magnets, so whenever you meet, your eyes keep drifting back and your feelings lean in. The strong one softens around the gentle one, and the gentle one feels secure next to the strong one. With an attraction this powerful, it takes practice to respect how different you are.",
    together:
      "The rock-like person clears the way with decisiveness and action, and the vine-like person reads people and smooths that path out. One takes charge of principles, the other of flexibility, so oddly enough, you find your rhythm best in a crisis. As lovers, the urge to cherish and protect each other runs so strong that this becomes a relationship you remember for a long time.",
    friction:
      "A single firm word from the rock-like person can leave a lasting mark on the vine-like person. The vine-like person tends to express hurt indirectly, and the rock-like person often misses it completely and moves on. Wanting to protect, taken too far, turns into meddling; wanting to lean, taken too far, starts to look like clinging.",
    tips: [
      'Even when you need to be firm, start with "I get how you feel" before the hard part.',
      "Respect each other's friend groups and each person's need for time alone.",
    ],
  },
  // flower + shears
  '1-7': {
    title: 'A flower trimmed by shears into a bouquet, beauty with an edge of tension',
    summary:
      "One of you is a tender flower or grass; the other is a pair of sharp shears, or a finely cut gem. Pruning stings when the shears snip the stem, but a well-trimmed flower becomes a stunning bouquet. This relationship is defined by a tension that sharpens and refines you both. You're both sensitive and proud, so your words can easily get an edge, but keep respect intact and you'll make each other more polished than anyone else could.",
    together:
      "The shears-like person has a discerning eye and clear standards, arranging the flower-like person's talents so they stand out even more. With a supple sense of things, the flower-like person softens the shears-like person's sharpness. Work together on something where finish matters, like design or editing, and the results stand apart. In love, you keep seeing each other with fresh, fluttering eyes.",
    friction:
      "The shears-like person points something out because they care, but the flower-like person can easily hear it as \"You're not good enough.\" You both tend to chew on hurt feelings, so a small spat can drag on for days. And when the urge to reshape the other person by your own standards grows, the relationship quickly goes taut.",
    tips: [
      'Agree that advice and feedback get offered only when the other person asks for them.',
      'Try something where you pick, trim and finish together, like a flower arranging class.',
    ],
  },
  // flower + great river
  '1-8': {
    title: 'A lotus blooming on a great river, plenty of water raising a lovely flower',
    summary:
      "One of you is a graceful flower or a waterside reed; the other is a wide, deep river. The river keeps the flower generously watered so it never wilts, and the flower blooms on the river's surface and makes the water beautiful. The river-like person's generosity is a big source of comfort for the flower-like person. Still, a strong current can sweep a flower downstream, so take care that one side's pace doesn't carry the other away.",
    together:
      "The river-like person shares a wide view of the world and a wealth of experience without holding back, and the flower-like person takes it all in with care and blooms in their own colors. You click especially well as mentor and learner, or as travel companions. In love, one embraces and the other brings the laughter, which makes for an easy, comfortable romance.",
    friction:
      "The river-like person's plans are big and change often, which leaves the flower-like person anxious, unsure where to put down roots. As the flower side leans more on the other, its own ability to decide can weaken. And the river side's free-spirited style can sometimes feel like indifference to the flower side.",
    tips: [
      'When a big plan changes, tell the other person the same day, along with the reason why.',
      'Plan a date or outing where the flower-like person decides everything and takes the lead.',
    ],
  },
  // wildflower + dew
  '1-9': {
    title: 'Like dew on morning petals, quietly refreshing each other',
    summary:
      "Picture a tender wildflower and the dew that settles on it at dawn, or a fine drizzle. Without a sound, the dew moistens the petals and brings them to life, and the flower holds those droplets and grows fresher still. You're both quiet and perceptive, so feelings travel between you through glances and small gestures more than words. Since you both tend to keep your true feelings tucked away, though, unchecked guesses can quietly pile up.",
    together:
      "The dew-like person senses what the other needs before being told and slips it to them, and the flower-like person receives that care gratefully and returns it with warm words. You spark each other's imagination, which suits work that calls for feeling, like writing, photography or planning. If it becomes love, it won't be loud, but it will soak in deep.",
    friction:
      "Both of you would rather guess on your own than ask directly, so \"I thought you'd know without me saying it\" easily becomes a sore spot for both. Worry can feed on worry until you're both overthinking on the same day. And when a decision is due, each of you may wait for the other to make the call, and a good chance slips by.",
    tips: [
      "When you're curious about something, don't guess. Ask the other person that same day.",
      'For important decisions, set a deadline in advance and make the call together on that day.',
    ],
  },
  // sun + sun
  '2-2': {
    title: 'Two suns in one sky, burning even hotter together',
    summary:
      "Both of you carry the energy of a sun riding high and lighting up everything around it. You share an honest, breezy personality, so you click from the start, and together your energy doubles. But two suns in one sky are dazzling to look at, and in moments when you both want to be the star, your light overlaps. Learn to share the stage, and few pairs have more fun than you.",
    together:
      "You're both overflowing with drive and passion, so you launch new things fast and each other's ideas catch fire instantly. Neither of you holds a grudge for long, so even after a fight, you're laughing again before long. Travel, events, a startup: anything big gets an extra jolt of life when you do it together, and as partners, you never run out of things to talk about.",
    friction:
      "In a group, you both reach for the center of the conversation, so you talk over each other and cut each other off. You both start things with a bang but hope the other will wrap them up, so the cleanup keeps getting pushed back. When pride collides, voices get louder, and since neither of you likes losing, a few chilly days can follow.",
    tips: [
      "When you start something new, decide right away who's responsible for finishing it.",
      'Take turns setting up days where one of you gets to be the star, with the other cheering.',
    ],
  },
  // sun + candle
  '2-3': {
    title: 'The sun shines by day, the candle by night',
    summary:
      "One of you is the sun filling the whole sky; the other is a candle lighting up the dark. You carry the same warmth, so your feelings connect easily, and you can grow as close as siblings. Yet just as a candle is hard to see at noon, the candle-like person's light can get lost beside the sunny one. Take turns having your moment to glow, and this relationship stays bright around the clock.",
    together:
      "The sunny person draws a wide circle of people and gets the mood going, while the candle-like person looks after each person one by one with real care. Let the sun side handle big events and the candle side handle heart-to-hearts, and nothing slips through the cracks. You're both big-hearted, so neither hesitates to take the other's side, and between partners, warmth simply overflows.",
    friction:
      "If the sunny person absentmindedly talks over the other or takes all the credit, the candle-like person quietly stores up hurt. The candle side may feel a hint of rivalry, which can spark a subtle tug-of-war between you. And when emotions heat up, both of your words run hot, until things come out that never needed to be said.",
    tips: [
      "Stick to an order where the candle-like person's opinion is heard first, before the sunny one speaks.",
      'Share calm time together, like an evening walk or sitting by a campfire watching the flames.',
    ],
  },
  // sun + mountain
  '2-4': {
    title: 'The morning sun rising over a great mountain, painting a grand view together',
    summary:
      "Think of the sun blazing with nothing held back, and a great mountain quietly standing its ground. Like the sun rising over a mountain ridge, the picture you make together is wide and breathtaking. The sunny person gives the mountain-like one warmth and energy, and the mountain takes in that light and becomes a sturdy stage. Still, the sun moves fast and the mountain stays put, so accepting the difference in your speeds is the work here.",
    together:
      "The sunny person grows the work with ideas and a gift for expression, and the mountain-like person sees it through to the end with caution and grit. Beside the sun, the mountain-like person becomes a little brighter; beside the mountain, the sunny person becomes a little calmer. Together as a pair, you're dependable and cheerful, and proud of each other.",
    friction:
      "The sunny person wants a quick reaction, but the mountain-like person answers only after a long think, which can feel stifling. When the sun side keeps turning up the heat, the mountain side digs in silently and grows heavier. To the sun side's eyes, the mountain's quiet stubbornness can easily look like not caring.",
    tips: [
      'Give the mountain-like person plenty of time to think, and wait patiently for the answer.',
      "For New Year's or an anniversary, plan a trip to watch the sunrise together.",
    ],
  },
  // sun + farmland
  '2-5': {
    title: 'Sunlight warming a field and ripening its grain, a match that bears real fruit',
    summary:
      "One of you is sunlight pouring down brightly; the other is soft farmland holding seeds. Just as grain grows when the sun warms a field, this relationship produces visible results the longer you're together. The sunny person draws out the field-like person's hidden talents, and the field-like person turns that passion into a real-world harvest. But if the sun beats down too hard, the ground dries out, so the intensity of that passion needs adjusting.",
    together:
      "The sunny person contributes big dreams and drive, and the field-like person adds careful plans and solid management. Things where results pile up in daily life, like running a shop or running a household, are where you feel most secure together. The sunny person melts away the field-like person's worries with laughter, and romance between you is affectionate and grounded at once.",
    friction:
      "The sunny person says \"Let's just try it\" and goes big, while the field-like person checks costs and risks first, so you often part ways at the planning stage. The sun side's unfiltered words can sound careless to the field side. And when the field side ends up cleaning up every mess, weariness builds.",
    tips: [
      'Before starting anything new, agree on a spending limit together first.',
      'Try projects where the results are easy to see, like growing a few vegetables or cooking a meal together.',
    ],
  },
  // sun + iron
  '2-6': {
    title: 'Iron heating up under a blazing sun, tempered in the heat',
    summary:
      "Here, a scorching sun meets heavy, solid iron or rock. The sun's heat warms and tempers the iron, and the iron, taking in that heat, either hardens further or throws the light back. You're both direct and strong, so sparks fly at first, but that also makes this a relationship with nothing hidden. Through every clash, you help each other grow.",
    together:
      "You're both quick-deciding people of action, so when something gets stuck, you have tremendous force for breaking through together. The sunny person brings warmth to the iron-like person's hardness, and the iron-like person adds real-world weight to the sunny person's excitable passion. In anything competitive, you make ideal partners, and in love, it's a hot, wholehearted romance.",
    friction:
      "Neither of you backs down, so a difference of opinion in a meeting or a minor squabble can heat up in a flash. The sunny person tries to change the iron side, and the more they push, the harder the iron side holds its ground. Once it becomes about winning and losing, hurtful words come out all too easily, with regret arriving later.",
    tips: [
      "Promise each other that when a fight gets heated, you'll take thirty minutes off before talking again.",
      "Make time to sweat together, whether it's hiking, a workout or a pickup game.",
    ],
  },
  // sun + gem: strong pull
  '2-7': {
    title: 'A gem sparkling in the sunlight, a dazzling mutual pull',
    summary:
      "Imagine the brilliant sun and an exquisitely cut gem. A gem sparkles most beautifully when it catches sunlight, and the sun is delighted to see its own light reflected back. This has long been counted among the classic pairings of attraction, so your eyes find each other the moment you meet, and together you both go soft inside. Being this comfortable together, though, can cost both of you your sharp edge.",
    together:
      "The sunny person shows the world the gem-like person's subtle value, and the gem-like person adds a refined finish to the sunny person's big passion. Team up on something meant to be shown, like a brand or creative content, and the synergy is real. As lovers, it's a romantic match where you're drawn to each other as if under a spell.",
    friction:
      "With an attraction this strong, it's easy to get lazy together, so each person's own to-do list keeps sliding. The gem-like person is sensitive and proud, and can be easily hurt by the sun side's offhand, brush-it-off remarks. Focusing only on each other may also leave other relationships neglected.",
    tips: [
      'Draw a line between time spent together and time each of you spends absorbed in your own work.',
      "Regularly plan get-togethers where you both hang out with each other's friends.",
    ],
  },
  // sun + great river
  '2-8': {
    title: "Sunlight pouring onto a wide river, each reflecting the other's sparkle",
    summary:
      "In this pairing, a sun that fills the sky meets a wide, deep river. Like sunlight breaking into glitter on the water's surface, your strengths stand out boldly when you're together. Fire and water have opposite natures, but you both think big and act with open-hearted ease, so you have more in common than you'd expect. Just as water can put out a fire, though, one side's cool words can douse the other's enthusiasm.",
    together:
      "The sunny person leads people with passion and expressiveness, and the river-like person maps out strategy with a broad view and sharp wits. Take on something large-scale together, like a major project or international work, and you fill in each other's gaps. The river-like person draws energy from the sun, and as lovers, you make an impressive pair who truly admire each other.",
    friction:
      "The sunny person shows feelings exactly as they are, while the river-like person rarely reveals what's underneath, so the sunny side can feel a certain distance. The river side's cool analysis can sound to the sunny side like a bucket of cold water. And since you both have firm ways of doing things, you may tussle over who's in charge.",
    tips: [
      "Before voicing a different opinion, start by naming what's good about the other person's idea.",
      'Take a slow, unhurried trip together somewhere with a wide-open view of the sea or a river.',
    ],
  },
  // sun + rain
  '2-9': {
    title: 'Like a rainbow after the rain, a picture the sun and rain paint together',
    summary:
      "One of you is a sun shining with nothing held back; the other is a gentle rain or a passing cloud. The rain cools the sun's blazing heat, and the sun hangs a rainbow in the sky once the rain clears. Your temperaments differ enough that you find each other fascinating, and that's where the pull comes from. Still, just as clouds can cover the sun, there will be days when one side's worries cast a shadow over the other's brightness.",
    together:
      "With a perceptive eye, the rain-like person flags risks the sunny person has missed, and the sunny person brightly shakes off the rain-like person's worries. When one handles planning and analysis and the other handles presenting and doing, the work rolls along smoothly. As a couple, you keep finding each other's different sides attractive for a long time.",
    friction:
      "When the sunny person excitedly shares a plan, the rain-like person may start by pointing out practical problems, and the wind goes right out of the sails. The rain-like person has cloudy-mood days, and the sunny person, not knowing why, gets frustrated. One speaks bluntly and the other talks around things, so conversations miss each other.",
    tips: [
      'When the rain-like person voices a worry, listen first before jumping to solutions.',
      'Make a rule just for the two of you: on gray days, stay in, watch a movie and rest.',
    ],
  },
};
