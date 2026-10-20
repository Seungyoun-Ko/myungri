import type { BigReading, FavorKey, TenGodName } from '../types';

/** Reading for each 10-year cycle, keyed by the energy entering it. The tone line comes separately from BIG_FAVOR. */
export const BIG: Record<TenGodName, BigReading> = {
  비견: {
    title: "A decade of stepping out of others' frames to stand on your own name",
    overview:
      "This 10-year cycle is about stepping out from someone else's shadow and learning, deep in your bones, how to stand on your own strength. In the first few years, it can take real effort just to make your share of the work clear where you are now. Somewhere around the middle, a project with your name on it or a field you're known for tends to come into sharp focus. Another gift of this stretch is a circle of like-minded colleagues gathering around you and turning into a team that lasts. The catch is that if you try to hold everything in your own hands, your body and mind will tire out first as the work grows. Spend these ten years building a feel for what to hand off and what to keep close, and you'll come out the other side much steadier.",
    base: "All through this cycle, there's an undercurrent of wanting to sort things out yourself rather than lean on anyone. To keep that independence from sliding into isolation, keep one or two colleagues nearby you can really open up to.",
    work: "Even inside an organization, this is a stretch where you get a clear area that's yours to run. Over a few years of hands-on experience, things tend to point toward going independent or putting together and leading a small team of your own. If you go into business with someone, spell out ownership shares and who decides what in writing from day one, and the partnership will last longer.",
    money:
      "Over these ten years, more of your income comes from money you earn directly with your own hands. In exchange, there may be stretches when the money doesn't come in evenly, so setting aside about three months of living costs first will take a lot of the wobble out. When money gets mixed up with people close to you, keep a written record starting from when the amounts are still small.",
    love: "This is a good time for a partnership in which you each respect the other's work and life. When busy years pile up back to back, your conversations can shrink down to swapping schedules, so set a regular time that belongs to just the two of you. If you're single, you're likely to meet someone in your own field or someone chasing the same goal you are.",
    health:
      "You gain real strength for looking after yourself in this stretch, and the exercise habits you build during these ten years become your stamina for decades afterward. Because you get so used to pushing through, though, it's easy to brush past signals that something hurts, so pin your yearly checkup to a fixed date on the calendar.",
    relations:
      "Rather than widening, your circle gets pared down to something solid during these ten years. The people you worked with and grew alongside are the ones who stay, and with siblings or old friends, a bit of rivalry tends to travel alongside the affection. When comparing yourself starts to rattle you, remind yourself that each of you is walking a different road.",
    tips: [
      "Pick one skill or field you want to be able to put your name to ten years from now, and add one step to it every year.",
      "Instead of trying to do it all yourself, add one colleague a year whom you can trust to take things off your plate.",
    ],
  },
  겁재: {
    title: "A decade of going big and placing bold bets, with clear limits as your strength",
    overview:
      "During this 10-year cycle, the urge to leap forward grows stronger than the wish for stability. Decisions that reshape the whole board of your life, like changing careers, starting a business, or moving into a fiercely competitive field, are likely to come knocking. Your drive and nerve get bigger, so you may grab chances in exactly the places where other people hesitate. By the same token, money and people move in and out quickly, and a single call can shape the course of several years. Each time you move forward, decide first how much you can afford to lose, and the courage of this decade will be left behind as solid results.",
    base: "For ten years, a restless wish not to fall behind anyone stirs underneath everything. Pour that heat into steadily building your skills rather than into reckless bets, and it becomes the strength that lets you go the distance.",
    work: "This is a stretch when your skill actually shows best in places where the competition is out in the open. You tend to grow a lot in work where results are settled in numbers, such as sales, negotiation, or launching new ventures. Once you start fighting the people running alongside you for credit, though, the team begins to wobble, so set a rule early that wins are shared.",
    money:
      "Over these ten years the swings get wider: a lump sum may come in, and a lump sum may go out all at once. Be especially careful about putting big money into something on someone else's word alone, or about co-signing for anyone. In the years when income is good, setting aside a fixed portion as money you simply don't touch makes it much easier to ride out the dips.",
    love: "This is a time when a strong attraction and someone who gets close fast are likely to show up. In relationships, too, the urge to hold the reins gets stronger, and small things can turn into tugs of war. When the wish to win starts rising, first remind yourself that this person is on your side.",
    health:
      "Over these ten years, your drive easily outruns your stamina, and it's easy to push your body too hard. After intense workouts or all-nighters, make sure to carve out time to recover, and don't wave off even small aches that come from straining yourself. It helps to think of rest as part of the game.",
    relations:
      "In this stretch, rivals and allies often trade places. Yesterday's opponent can become tomorrow's business partner, so rather than cutting people off, leave the door open a crack. When money gets tangled up in things, even close relationships crack easily, so keep the accounts clear.",
    tips: [
      "Before a big decision, write down in plain words the most you could lose in the worst case, and then make your move.",
      "In winning years and losing years alike, keep a record looking back on the year, and use it as material for your next bet.",
    ],
  },
  식신: {
    title: "A decade when one craft ripens and quietly supports a fuller life",
    overview:
      "This 10-year cycle is when the skills already in your hands deepen, and that craft starts to hold up your daily life in a reassuring way. Work that looked ordinary at first tends to reach the level where people come looking for you to ask questions, once you've kept at it for a few years. As your inner breathing room grows, you also find meaning in time with family, in looking after children, and in teaching people newer than you. The more comfortable things are right now, though, the easier it is to put off learning what's new. Add one new skill on top of your familiar craft every few years, and that sense of plenty will keep going for a long time.",
    base: "All through this cycle, a quiet ease and the joy of making something run underneath your days. Faithfully keeping up the small things you repeat every day turns out to be your greatest strength.",
    work: "This is a good stretch for steadily building skill in one field and settling in as an expert. As your finished work piles up, word of mouth spreads, and your scope tends to widen into teaching or making things. On the other hand, your motivation may sag in cutthroat settings, so look for an environment where you can work at your own pace.",
    money:
      "Over these ten years, steady income from your craft holds up the household, rather than one big windfall. As life gets more comfortable, spending creeps up little by little too, so every few years, sit down and check your fixed expenses. In the end it pays not to skimp on what it costs to sharpen your skills.",
    love: "This is a time when a comfortable, affectionate relationship grows. Talk of building a home together or of the family getting bigger comes up easily, and your bond deepens in the everyday business of looking after each other. If you lean on that comfort and stop making an effort, though, things can go flat, so every now and then, put in the kind of care you did when you first met.",
    health:
      "Body and mind loosen up a bit during these ten years, so your daily habits get stored straight into your body. Keep up one hobby that gets you moving for the long haul, so the hours you spend sitting don't stretch out too far. Simply keeping regular mealtimes is enough to make your condition steadier.",
    relations:
      "You have a lot to share in this stretch, so people naturally gather around you. A junior you taught and looked out for is likely to become a solid backer later on. Just set some limits so that, in trying to take care of everyone, you don't lose the rest that's yours.",
    tips: [
      "Choose one skill you'll keep at for these ten years, and gather what you make with it in one place every year.",
      "The more comfortable the stretch, the more worth it is to take one class in an unfamiliar field every few years.",
    ],
  },
  상관: {
    title: "A decade of shedding familiar molds and carving your own road again",
    overview:
      "During this 10-year cycle, you start wanting a road that makes sense to you rather than one someone else laid out. Your workplace's way of doing things may start to feel stifling, and you're likely to switch paths or move into work that puts your talent out there directly, like creative work or going independent. Your way with words, writing, and planning ripens, and your chances of getting your name known grow with it. The flip side is that you bump up against the existing order often, so friction with bosses or with the system comes easily. Sharpen your eye for what to change and what to keep, and the changes of this decade become fully your own road.",
    base: "For ten years, the itch to find a better way keeps stirring underneath. Rather than letting that frustration drain away as criticism alone, try turning it into small improvements.",
    work: "Your skill shines more where you get to invent new ways of working than where you follow a set manual. It's also likely that you'll change roles, or grow a personal project until it becomes your main work. If you stay in an organization, find a higher-up who will actually listen to your ideas, and build trust with that person first.",
    money:
      "Over these ten years, several paths open up for your talent and ideas to turn into money. While the shape of your income is shifting, though, uneven months are likely. Before starting something new, put aside enough living money to carry you for a few months, and you'll be free to make bold moves.",
    love: "In this stretch, the more honestly you express your feelings, the more a relationship can deepen, and the more it can clash. You may find yourself wanting the form of dating or marriage that fits the two of you rather than the textbook version. Instead of trying to fix the other person's ways, you'll need the ease to laugh off the places where you differ.",
    health:
      "Over these ten years your mind keeps running without a break, so tension easily builds up in your body. Treat a stiff neck and shoulders as a signal to rest, and keep a hobby close by that uses your body and lets you set your thoughts down. Cutting back on screen time before bed helps.",
    relations:
      "In this stretch, new people you really click with come along, while some older relationships may drift away. Being curious about opinions that differ from yours, instead of bristling at them, leaves you with fewer enemies. Be especially sparing with criticism in front of a group.",
    tips: [
      "When there's something you want to change, skip the complaint and make a small trial version to show people first.",
      "Gather the writing, creative work, and proposals you make during this decade in one place, and keep them as a record of your own track.",
    ],
  },
  편재: {
    title: "A decade of a wider stage, big flows of money, and fresh chances",
    overview:
      "During this 10-year cycle, the range you move in and the stage you work on get noticeably wider. Scenes of reaching outward become more common, such as moving homes or regions, work tied to other countries, or growing a business. Many chances come to you through people, and the amounts of money changing hands tend to be bigger than before. As the board gets bigger, there's also more to manage, and if you can't keep up with everything you've started, the real gains shrink. Get into the habit of thinking big but tying things off one at a time, and that wider stage turns straight into assets that are yours.",
    base: "All through this cycle, a breeze pulling you toward new places and new people blows underneath your daily life. The more you move, the more chances stick to you, so it's worth keeping notes on where you've been and who you've met.",
    work: "Your instincts come alive in work that handles the flow of people and money, such as sales, distribution, planning, or running a business. You're likely to be handed several projects at once or a role opening up new markets. Start fast, but keep a detail-minded partner nearby to handle the wrap-up, and your results will stay intact.",
    money:
      "Over these ten years, both the money coming in and the money going out grow in size. Offers that look like opportunities multiply, so before putting big money into a field you don't know well, look into it thoroughly first. In the years when you earn well, building up a cushion first is more reassuring than raising your standard of living all at once.",
    love: "As your range widens, you meet all kinds of people, and the scope of your connections widens too. With so much happening outside, time with a partner or family can easily shrink. Even in the middle of the busyness, keep creating moments that are just for the two of you, like a short trip away together.",
    health:
      "With so much travel and so many plans over these ten years, your daily rhythm easily gets scrambled. If you're on the road a lot for work or fun, at least keep your bedtime consistent. If client dinners and get-togethers come often, it helps to set your own rules for cutting back on drinks and late meals.",
    relations:
      "In this stretch, your network grows fast, and an unexpected person may connect you to a big opportunity. If you spend all your time on wide but shallow ties, though, the people closest to you can end up feeling hurt. In your own mind, sort out the people you want by your side for the long run from those you know through work.",
    tips: [
      "Each year, choose just one or two new opportunities to see all the way through, and boldly let the rest go.",
      "The better your income in a given year, the more you should grow your cushion before your lifestyle, so it can fund your next leap.",
    ],
  },
  정재: {
    title: "A decade when steady effort bears fruit in a secure home and trust",
    overview:
      "During this 10-year cycle, steady effort bears fruit layer by layer, rather than flashy change. Scenes of laying down the foundation of your life become more common, like a stable job, a plan to own your home, or building a family. As you keep handling your work without missing a beat, you're likely to settle into being the person everyone around you counts on. If the wish to protect your stability grows too strong, though, you may get touchy about small losses and start avoiding new challenges. Hold on to what deserves keeping, and every few years, try one small change.",
    base: "For ten years, a wish to keep your life in order and protect it by being careful with what you have runs underneath. To keep that thoroughness from turning into suffocating penny-pinching, set aside a share for enjoyment, too.",
    work: "This is a stretch when your ability to handle defined work accurately earns high marks. You gain trust in roles that call for consistency, such as management, accounting, or operations, and you're likely to settle in by working at one organization for a long time. If you only repeat the same tasks, though, it can feel like your growth has stalled, so widen your role little by little.",
    money:
      "Over these ten years, your sense for saving and protecting money ripens. If you set a target amount and a deadline, visible results are likely to pile up within a few years. Focusing only on cutting back can make you miss experiences you truly need, so try telling apart the spending that helps you grow from the spending that just leaks away.",
    love: "This is a time when you start wanting a serious, lasting relationship. Talk of planning a future and building a life together tends to come up naturally. Weighing practical conditions can make you hold back on showing your feelings, though, so put your thanks and affection into words often.",
    health:
      "A regular routine suits your body well over these ten years. Between work and running the household, your own body easily gets pushed to the back, so write exercise and rest into your schedule the way you'd log items in a budget. When worries pile up, clear your head with some time spent moving your body.",
    relations:
      "In this stretch, trust builds as you prove to be someone who keeps promises, and a small number of relationships grow deeper. A very precise, keep-the-books-even attitude can sometimes come across as a little cold, though. With the people close to you, offer your heart first before tallying up gains and losses.",
    tips: [
      "Set one goal for your household finances ten years out, and check each year how far you've come.",
      "Even in stable years, try one new thing on a small scale, and build up the muscle for handling change.",
    ],
  },
  편관: {
    title: "A decade of building the strength to hold on and to lead through strong winds",
    overview:
      "During this 10-year cycle, tough challenges arrive one after another, but in exchange, you get tempered in a big way. You end up taking on sudden responsibilities or crisis situations, and as you get through them, your ability to lead others grows. Your skill tends to show in urgent work like directing things on the ground or solving problems. If the tension drags on for too long, though, your body and mind tire out first. Don't shoulder every load alone, and decide in advance where you'll pause to rest, and ten years from now you'll be steadier than almost anyone.",
    base: "For ten years, a mind that's always bracing for something and on alert lies underneath. Pick a place of rest that's yours alone to loosen that tension, and you'll be able to hold on for the long haul.",
    work: "This is a stretch when you get recognized as the fixer in places where hard, urgent work piles up. You may take on an important role during a reorganization or a crisis, and your title may change along with it. If you say yes to every unreasonable demand, though, you'll burn out quickly, so practice stating clearly how much you can take on.",
    money:
      "As your responsibilities grow, your share of the income may grow too, but over these ten years unexpected expenses are likely to show up alongside it. Some costs are hard to dodge, like family matters or a sudden repair, so take one look at sorting out what your insurance covers, and over a few years grow an emergency fund you don't dip into easily.",
    love: "This is a time when connections with a strong pull and a certain tension are likely to come along. With so much pressure from outside, there may be days when you snap at the people closest to you. When something is hard, saying first that you're struggling right now, instead of hiding it, is what protects the relationship.",
    health:
      "Over these ten years, tension and overwork pile up in your body easily, so managing recovery matters as much as your skill does. If your sleep gets shallow or headaches come more often, take it as a sign to cut back your workload. If discomfort keeps up, don't put it off, and go see a doctor.",
    relations:
      "In this stretch, a tight, comrade-like bond forms with the people who got through hard times with you. On the other hand, people who keep you in check or weigh on you are also likely to appear. Rather than straining to get along with everyone, make sure to take good care of the few people who will really be on your side.",
    tips: [
      "Twice a year, block out a rest period completely away from work on your calendar before anything else goes on it.",
      "Every time you get through a crisis, write down what worked, and build up your own playbook for handling the next one.",
    ],
  },
  정관: {
    title: "A decade when your place and name in the world settle in clearly",
    overview:
      "During this 10-year cycle, your place and role in society become clear. You tend to gain titles others recognize, like a promotion, a position, or an official qualification, and the responsibility you carry inside an organization grows. Your upright attitude and diligence build into a reputation, and more people trust you with important work. If you keep thinking about appearances and expectations, though, you may feel stifled, as if you're living to fit other people's eyes rather than your own heart. The homework of this decade is sorting out which principles to keep and which expectations you can set down.",
    base: "For ten years, a wish to live properly and be recognized props up your everyday life from underneath. So that this uprightness doesn't squeeze you too tight, allow yourself the occasional day with no plan at all.",
    work: "This is a good flow for climbing steadily within an organization's structure. You're likely to settle into places where procedure and trust matter, such as public institutions, big companies, or management roles. If you get wrapped up only in following rules, though, you may hear that you're inflexible, so listen to the circumstances of the people under you, too.",
    money:
      "These ten years are good for a stable income structure to take hold. As your rank and experience rise, your income is likely to rise like steps on a staircase, so rather than spending every raise on living costs, lock part of it into long-term goals. Just looking at the spending you do to keep up appearances can free up room.",
    love: "This is a time when your heart turns toward a serious relationship and official commitments. Things that announce your relationship to the people around you, like a wedding or family occasions, are likely to come up. Your standards for a partner may rise, so treasure the process of adjusting to each other more than a picture-perfect image.",
    health:
      "Over these ten years, your sense of duty can make you stay at your post even when you're unwell. Since you sit at work for long hours, get up and move often so your lower back and neck don't take the strain. Treating regular checkups like items on your work calendar suits you well.",
    relations:
      "This is a good stretch for earning both the confidence of the people above you and the respect of those below. You may also take on a representative role in an official gathering or organization. Polite distance can come across as cold, though, so in relaxed settings, be the first to let your guard down.",
    tips: [
      "Choose one qualification or title you want to earn in this decade, and gather the experience that fits it each year.",
      "On a sheet of paper, split other people's expectations from your own wishes, and make sure you keep at least one wish of your own.",
    ],
  },
  편인: {
    title: "A decade of digging deep into roads less taken and finding your own lens",
    overview:
      "During this 10-year cycle, your thinking deepens, and a point of view that's different from everyone else's comes into sharp focus. You're likely to dig deep into one field, like psychology, technology, art, or philosophy, and build real expertise, or to turn toward a completely different field. Your intuition sharpens, so you may catch currents that others missed before they do. If your time alone with your thoughts runs long, though, worries can pile up and action can lag behind. Practice putting what you've realized out into the world, even in small ways, and the insights of this decade become real skill.",
    base: "For ten years, a wish to look beneath the surface rather than at it flows underneath. When one thought keeps chasing another, moving your body to air out your head brings things back into balance.",
    work: "In this stretch, your true value shows in specialized skills or niche fields rather than on the standard path. You're well suited to work that involves deep thinking, such as research, analysis, counseling, or planning, and a decision to change direction midway is also likely. Rather than holding your results close until the end, share them along the way, and recognition will follow.",
    money:
      "Over these ten years, your way of earning is often unusual or comes from one particular expertise. If your interests shift a lot, the cost of learning can add up, so before buying a new course or new gear, look back at whether you used the last ones all the way through.",
    love: "This is a time when you want deep conversations where minds truly meet. You may look calm on the outside but have so much going on inside that a partner feels a distance. Before reaching conclusions on your own, share what's on your mind right now, even briefly, and the relationship warms up.",
    health:
      "Over these ten years, a busy mind easily pushes your bedtime later and throws off your daily rhythm. Simply going to bed and getting up at the same times can make your mind noticeably calmer. If your mood stays low for a long time, don't just endure it alone; talking to a counselor is a good option too.",
    relations:
      "In this stretch, your circle may get smaller, but you stay close for a long time with the few who really get you. With more time alone, it's easy to go quiet on people, so reach out first to the ones who matter to you. Unexpected connections can also come from groups built around a shared interest.",
    tips: [
      "Choose one subject to dig into over these ten years, and each year sum up what you've learned in writing or in a talk.",
      "When your thinking drags on, set a deadline for deciding, and start right away with a small experiment.",
    ],
  },
  정인: {
    title: "A decade of learning, being cared for, and putting down deeper roots",
    overview:
      "During this 10-year cycle, learning and help keep flowing in, letting your life put down deep roots. You're likely to finish a long course of study, like a degree or a certification, or to meet a good teacher or elder who points the way. Things that end up on paper, like housing or contracts, become more stable, and your mind grows noticeably calmer too. If you get too used to being looked after, though, you may end up with fewer chances to make your own decisions and try things for yourself. Make a point of creating chances to put the knowledge and help you've received to use with your own hands, and this decade becomes solid groundwork for everything after.",
    base: "For ten years, someone's encouragement and the energy of learning quietly hold you up. Remember the help you receive, and one day pass it on to someone else, and the flow widens even further.",
    work: "This is a good stretch for settling into work grounded in knowledge and trust, such as education, research, counseling, or caregiving. Seniors and mentors often pass opportunities your way, and professional credentials are likely to become stepping stones in your career. Just make sure the preparation doesn't drag on, and build up real hands-on experience alongside it.",
    money:
      "These ten years are more about building a stable base than about making big money fast. When something comes up involving your home or a contract, reading the paperwork carefully is the most reassuring safeguard. Money you spend on learning during this time tends to become an asset that lasts.",
    love: "This is a time when a relationship of warmly caring for each other and being cared for grows. Both the wish to lean on your partner and the wish to look after them grow together. To keep it from turning into one person doing all the caring, talk often about what each of you has received, and keep things in balance.",
    health:
      "As your mind settles, these ten years are a good time for your body to recover calmly too. Leaning on that comfort can easily cut down how much you move, though, so attach some light exercise to your daily routine. You may also find yourself looking after the health of your parents or older relatives.",
    relations:
      "In this stretch, your ties deepen with people who guide you, such as elders, teachers, and mentors. Your relationships with family are likely to grow noticeably closer as well. So that it doesn't become a relationship where you only receive, start by offering the small kinds of help you're able to give.",
    tips: [
      "Choose one course of study or credential you want to finish within ten years, and break the big schedule into pieces for each year.",
      "Don't keep what you've learned to yourself; teach it to someone or put it to use in real work.",
    ],
  },
};

/** Two opening lines for a 10-year cycle, depending on how well its energy suits you */
export const BIG_FAVOR: Record<FavorKey, [string, string]> = {
  good: [
    "This 10-year cycle is a time when an energy you really need right now stays with you for a long while. Work you keep pushing forward steadily is likely to come back as a big harvest.",
    "This is a 10-year cycle that fills in strength you've been missing. It's a good time to bring out the plans you've long held close and grow them step by step.",
  ],
  normal: [
    "The energy of this 10-year cycle flows evenly, without tipping heavily to one side. What shapes the flow is which choices you keep stacking up.",
    "This is a 10-year cycle with good things and hard things mixed in fairly evenly. It's a good time to strengthen your fundamentals and calmly prepare for opportunities.",
  ],
  caution: [
    "The energy of this 10-year cycle sets a somewhat heavy load on you as you are now. Don't rush; build your foundation one step a year, and you'll grow plenty solid.",
    "This is a 10-year cycle when fatigue can pile up as fast as your effort does. Put your strength into firming things up rather than expanding, take care to rest, and this stretch becomes a sturdy base for what comes next.",
  ],
};
