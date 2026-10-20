import type { MonthDetail, TenGodName } from '../types';

/** Detailed reading for each month's surface energy. The tone (good, steady, take care) is chosen separately by the app */
export const MONTH_DETAIL: Record<TenGodName, MonthDetail> = {
  비견: {
    overview:
      'This is a month when you want to handle your own business with your own hands. From the drawer you\'ve been meaning to clear out to the tasks that are yours alone, dealing with things directly feels easier than asking others. You may also draw strength from sharing worries with a friend in a similar situation. In meetings, though, clinging to your own view can make the room stiffen, so at least once, hear the other person out to the end.',
    work: 'Wrap up anything you can finish on your own within this month. If you end up working on the same thing as a coworker, briefly agree on who handles what on the very first day, and things will go more smoothly.',
    money: 'Splitting meals and group outings with friends can become more frequent. Settle up the same day, and gently draw a line at expenses that aren\'t really yours to cover.',
    love: 'Easy, friend-like conversation flows well this month. But if you both insist on doing things your own way, small things can turn into standoffs, so take turns planning your dates.',
    health: 'Your body feels light, so it\'s tempting to suddenly ramp up your workouts. Increase a little at a time each day, and on days your muscles feel tight, give them a good, thorough stretch.',
  },
  겁재: {
    overview:
      'This is a month when a stubborn streak flares up whenever you\'re compared with someone. If a coworker gets results first, the feeling that you can\'t lose makes you speed up, and that push might help you clear a backlog in one go. On the flip side, it\'s easy to pay for something on a high or say yes to a friend\'s request too quickly. For anything involving money or promises, sleep on it before you answer.',
    work: 'Your focus sharpens in head-to-head settings like competitive bids or results presentations. When things go well, mentioning the contributions of the people you worked with first lifts the whole team\'s mood.',
    money: 'Even when money comes in, it can slip out fast this month. Don\'t answer requests to borrow money right away, and lowering your card limit below the usual gives you peace of mind.',
    love: 'You may find the courage to approach someone you like first this month. If jealousy rises, though, skip the testing remarks and simply say that your feelings were hurt.',
    health: 'Wanting to win can keep you up late into the night. Set aside the urge to beat your workout records for a while, and at least stick to the bedtime you planned.',
  },
  식신: {
    overview:
      'This is a month when your mind relaxes and your hands get busy. Baking bread on the weekend, tending your plants, or slowly refining a project you\'ve been working on all feel enjoyable. What you make may even come back to you as compliments. It\'s easy to get so comfortable that you put off messages or paperwork you need to handle, though, so finish one task first each morning and then enjoy the rest of your day.',
    work: 'This is a good month to raise the quality of the work you\'ve been steadily doing. Rather than taking on new things, wrapping up what you have and sharing it in a polished form gets a good response.',
    money: 'A small talent might turn into a bit of pocket money this month. Spending on new restaurants and snacks can quietly creep up, though, so check what you\'ve spent once a week.',
    love: 'Simple moments like cooking together or strolling around the neighborhood warm up your relationship. New connections are likely to form naturally in places where people share a hobby.',
    health: 'Your appetite perks up, making it easy to overeat this month. Have a lighter dinner a bit earlier than usual, and avoid lying down right after a full meal, and your mornings will feel much fresher.',
  },
  상관: {
    overview:
      'This month, the things you want to say and the things you want to change stand out clearly. Better ways of doing things come to mind during meetings, and you feel like expressing your thoughts in writing or video. A witty remark from you can liven up the room. On tired days, though, a joke can easily come across as sarcasm. Making a habit of rereading a message once before you send it to the group chat will keep this month on track.',
    work: 'This is a good month to pitch new ideas. Rather than pushing back on the spot in front of your boss, going to them separately with your reasoning and an alternative makes your point much easier to accept.',
    money: 'The urge for retail therapy or new gear can grow. Write what you want to buy on a list, and slow things down by buying it only if you still need it a few days later.',
    love: 'Your honest, playful way of talking comes across as charm this month. When you bring up something that hurt, point to one specific thing that happened that day rather than your partner\'s personality.',
    health: 'Your mind won\'t switch off, so there may be nights when it\'s hard to fall asleep. Put the screens down before bed, and empty your head by writing whatever thoughts come up on paper.',
  },
  편재: {
    overview:
      'This is a month when your circle widens and messages pick up. An acquaintance you haven\'t heard from in a while might reach out with a job offer, or you might pick up useful information at an unfamiliar gathering. The more you move around, the more opportunities stick to you. Starting too many things at once can blur how they end, though. Pick just three things you must finish this month, and you\'ll have as much to show for it as you were busy.',
    work: 'Outside meetings and client calls carry extra weight this month. When offers come in, write down the income and the time each would take side by side and compare before choosing, and you\'ll make fewer mistakes.',
    money: 'Both the money coming in and the money going out can grow this month. Keep a separate eye on transportation and social spending, and avoid moving large sums based only on what someone else tells you.',
    love: 'Chances to meet new people increase this month. If you\'re in a relationship, walking somewhere new together, even close to home, brings fresh life to your conversations.',
    health: 'With so many outings, it\'s easy to skip meals. Carry water and a handful of nuts in your bag, and on the day after a packed schedule, let yourself sleep in.',
  },
  정재: {
    overview:
      'This is a month when you want to put your life neatly in order. Going over your card statement carefully, clearing out the fridge and closet, or drawing up a fresh budget for the month all suit you well. The care you put in comes back to you honestly. Small differences in amounts can set your nerves on edge, though, so loosen up the accounting a little with the people close to you.',
    work: 'This month, you earn trust by handling deadlines and numbers without mistakes. So you don\'t lose track of the team\'s flow while holding on to your own tasks, share short progress updates often.',
    money: 'This is a good month to firm up your saving habits. Setting a fixed amount to leave your account right on payday makes it easy. Just don\'t skimp on what you truly need, like medical bills or money for learning.',
    love: 'This is a good month to show your feelings through small actions rather than words. It\'s also a fine time to comfortably bring up practical topics, like how you split the cost of dates.',
    health: 'This is a good month to get a scattered daily rhythm back on track. It\'s easy to skimp on breaks while you work through your to-do list, so after lunch, close your eyes and rest for ten minutes.',
  },
  편관: {
    overview:
      'This is a month when unexpected tasks suddenly land in your hands. An urgent call might come on your day off, or you might have to step in and clean up after someone else\'s work. It\'s a burden, but if you move calmly in moments like these, people\'s trust in you grows a great deal. Simply gritting your teeth alone will wear you out fast, though, so when it\'s too much, say so early.',
    work: 'A chance comes this month to show what you\'re made of by solving an urgent problem. When work piles up, decide what comes first together with your manager, and keep written records of the instructions you exchange.',
    money: 'Expenses you can\'t put off, like sudden repair bills or gifts for weddings and funerals, may come up. Be ready in advance to dip into your emergency fund, and look over the terms of any big contract carefully.',
    love: 'You may find yourself drawn to responsible, steady people this month. On days when work has you on edge, your tone can get sharp, so let your partner know you\'re tired up front.',
    health: 'Ongoing tension can make your shoulders and neck stiffen this month. Loosen up with exercise that gets you sweating, and if headaches or fatigue linger, have a doctor take a look.',
  },
  정관: {
    overview:
      'This is a month when you show a polished side of yourself in your role. You might be handed an important report, see your name on an event lineup, or have someone recommend you. Your habit of keeping promises and following procedures carries straight into how you\'re evaluated. The feeling that you mustn\'t slip up can make you hard on yourself, though, so be sure to leave time to unwind after work.',
    work: 'Formal occasions like one-on-ones or reviews are likely to come up this month. Prepare documents in the required format, and clarify any vague instructions on the spot.',
    money: 'Your regular income keeps flowing in steadily this month. Gifts or social spending done to keep up appearances can grow, though, so set an amount that\'s just enough to show you care.',
    love: 'Your heart leans toward a serious, trustworthy relationship this month. Connections are likely to form through introductions, and if you\'re dating, talk about each other\'s families or your future may come up naturally.',
    health: 'Your routine tends to fall neatly into place this month, making it a good time to set regular workout times. If tension builds from trying to meet others\' expectations, soak in a warm bath to let it go.',
  },
  편인: {
    overview:
      'This is a month when you want to turn your thoughts over alone in a quiet place. On the way home from work, you might fall deep into videos about an unfamiliar field, or suddenly find yourself rethinking your career path. Your eye for spotting problems others missed gets sharper too. Your thinking can drag on and your replies can get slow, though, so get back to people the same day, even briefly.',
    work: 'This is a good month to find unusual answers in work that digs deep, like analysis or research. Don\'t hold on to it alone for too long. Show your midway results to a coworker at least once and get their input.',
    money: 'The urge to learn can lead to more spending on courses, books, and subscriptions this month. Before paying for something new, you\'ll get more out of using up what you already have.',
    love: 'You may talk less this month, which can leave your partner feeling a little hurt. If you think you\'ll be harder to reach, leave a quick note in advance, and keep one weekend evening free to sit down face to face and talk.',
    health: 'With so much on your mind, you may toss and turn at night or rush through meals. Take walks in the daylight, and at least eat your meals at regular times.',
  },
  정인: {
    overview:
      'This is a month when help and encouragement from the people around you gather naturally. A mentor might offer advice before you ask, family might send over some home-cooked food, or paperwork that was stuck might move along smoothly. It\'s also a good fit for picking your studies back up. Relying on that comfort can loosen the plans you set for yourself, though, so do even a small amount on your own every day.',
    work: 'Efforts to build your skills, like training or certification study, get a boost this month. Ask experienced people about anything you\'re stuck on, and put what you learn to work right away.',
    money: 'This month brings a calm flow without big swings. Taking a fresh look at long-standing contracts, like insurance or your phone plan, may reveal places to save.',
    love: 'Your heart leans toward someone who looks after you warmly this month. Say thank you in words whenever you feel it, and this time, be the first to look after your partner\'s day.',
    health: 'Feeling at ease can make you sluggish this month. Instead of lying around all weekend, wake your body up with some light stretching, and keep your bedtime consistent.',
  },
};
