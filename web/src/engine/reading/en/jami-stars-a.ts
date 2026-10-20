import type { StarReading } from '../types';

// First 7 main stars. Body text never uses star names; it uses the nickname or no name at all.
export const STARS_A: Record<string, StarReading> = {
  자미: {
    nick: 'King star',
    title: 'The steady, weighty center people naturally turn to for advice',
    keywords: ['Dignity', 'Leadership', 'Pride'],
    nature:
      `This star stands at the very center of the sky and looks out over the whole board. It carries the power to gather people and set a direction, along with a strong wish to keep its dignity and good name intact. It grows stronger when good people gather around it rather than when it shines alone, so the company it keeps changes the color of this star more than anything else.`,
    self:
      `At any gathering, people quietly turn to you for your opinion even when you haven't stepped forward. You stay calm when a decision has to be made, and you see the big picture before the small details. The flip side is a strong sense of pride: being corrected in front of others can stay with you for a long time, and even when you need help, it's hard for you to be the first to ask. Now and then, try saying "Could you help me with this one?" and share the load. It makes you look bigger, not smaller.`,
    work:
      `The bigger the job you're handed, the calmer you tend to become. Your real ability shows when you're building a team, dividing up roles and making the final call. Work where you run the whole operation suits you well, such as management, running a business or heading an organization. If you keep every small hands-on detail in your own grip, though, you'll wear out fast, so it's worth practicing handing things over to people you can trust.`,
    money:
      `For you, money tends to arrive by following people and position. When your title goes up or the stage you're responsible for gets bigger, your income often grows right along with it. You may find a fair amount going out just to keep up appearances, like being the one who always picks up the bill when the group goes out. When it comes to a home, you like a well-kept place in a neighborhood with a good name, and as long as you steer clear of a loan bigger than your means, it can become a truly solid base.`,
    love:
      `Mutual respect matters more to you than anything else in a relationship. You hope a partner will carry themselves with dignity and take pride in their own work. Your care runs deep, but the way you show it is so weighty that a partner may sense a certain distance. Light touches go a long way, like a short note on an anniversary or a quick "How was your day?" on your way home from work, and they make the relationship noticeably softer.`,
    health:
      `When you carry responsibility alone, it's easy to miss meals without noticing. This star has traditionally been linked with digestion and the spleen. The busier you get, the more it helps to set fixed mealtimes and chew slowly. If your stomach is often unsettled, don't put it off; it's a good idea to get checked by a doctor.`,
    relations:
      `There's often someone in your family or circle of friends who acts as the rock everyone leans on. When something hard happens, a trusted elder or an old friend tends to show up and hold you steady. On the other hand, when both sides have strong pride, you can end up in a long standoff over who will give in first. It helps to remember that the one who picks up the phone first isn't the one who loses.`,
    life:
      `Out in the world, you tend to find your way into places where you're treated as an honored guest and into more formal gatherings. Your heart is drawn to refined pleasures, so you find comfort in things like antiques, exhibitions and food made with real care. You need time alone, away from other people's eyes, to find your center again.`,
    flow:
      `This tends to be a time when your role grows a size bigger and chances come to work with your own name on the line. As people look to you for decisions, the weight on your shoulders grows too. Instead of carrying it all alone, keep people you trust close and run things together, and you'll be able to hold on to the strength of this period for a long time.`,
  },
  천기: {
    nick: 'Wisdom star',
    title: 'A quick mind that finds the way by reworking the plan as it goes',
    keywords: ['Planning', 'Curiosity', 'Quick thinking'],
    nature:
      `This star governs everything that moves and changes. It thinks fast and weighs many possibilities at once, which calls to mind the clever strategist or trusted advisor in old stories. Rather than staying put, it is always on the move in search of a better way, and information and ideas are its weapons.`,
    self:
      `You're the person who plans a trip with three or four backup routes already mapped out. You try new gadgets and apps before anyone else, and you come up with surprisingly useful answers to your friends' problems. The shadow side is that you think too much. Before bed you may turn the same problem over in your head ten times and keep putting off the decision. Pinning down a decision date in advance makes your mind feel much lighter.`,
    work:
      `You shine in work where you solve problems with your head, like planning, analysis, research and development. The advisor role suits you especially well: the person beside the leader who maps out the route, rather than the one standing out front. You keep wanting to improve how things are done, so repeating the same task over and over bores you quickly. In a role where you can run small experiments, you can stay happy at work for a long time.`,
    money:
      `You tend to earn through ideas and information. Your wealth builds up when you try small things several times and refine your method, rather than betting big all at once. Because you know so much, it's easy to dabble in this and that until things fizzle out, so write down your own rules. You tend to move often or spend a lot fixing up and decorating your home, so it helps to set money aside for each move.`,
    love:
      `Your heart opens to someone you can really talk with. If you can walk out of a movie and keep talking about it for an hour, you'll grow close fast. Because you think things over for so long before making up your mind, though, you can miss your chance. Rather than reading a single remark from your partner five different ways and worrying alone, simply asking them directly is what protects the relationship.`,
    health:
      `When your mind never stops working, your nerves tend to tire before your body does. This star has traditionally been linked with the liver, the nerves, and the arms and legs. Get plenty of sleep, and add exercise that empties your head, like walking. If your hands and feet often go numb or tingly, see a doctor.`,
    relations:
      `Among your siblings and friends, there tend to be many people who are smart and easy to talk to. You share information, trade advice and give each other strength. The shape of your relationships changes often, though, so people you were close to may drift away as where they live or what they do changes. Reaching out first now and then keeps good connections going for a long time.`,
    life:
      `Out in the world, you tend to be on the move a lot, with plans that change often. Business trips, moving house or exploring an unfamiliar neighborhood actually widen your thinking. Your mind is always working something out, so hobbies like puzzles, reading and learning something new suit you well. On days off, set aside some time to switch your brain off completely.`,
    flow:
      `This tends to be a time of more change and movement, when you reset your direction. The urge to change your job, where you live or what you're studying can grow stronger. Picking one of the many paths, testing it on a small scale and adjusting as you see the results is the approach that fits this period best.`,
  },
  태양: {
    nick: 'Sun star',
    title: 'Someone who shines on everyone alike and steps forward to light the way',
    keywords: ['Generosity', 'Fairness', 'Vitality'],
    nature:
      `This star resembles the sun, which shines evenly on the whole world. It is bright and has nothing to hide, and it takes joy in giving rather than receiving. It is closely tied to reputation, honor and life out in the world. When its light is strong like the midday sun, people follow it, but shining too much for too long can leave it worn out.`,
    self:
      `When someone looks stuck, you're the first to offer a hand, and at a gathering you pull the person on the edges into the conversation. You're sensitive to right and wrong, so you can't just let an unfair scene slide. The shadow side is that you push your own things to the back while looking after others. Before you wear yourself out saying yes to every favor, take a moment to check how much energy you have left for today.`,
    work:
      `Meeting people and getting the word out gives you energy. Work that puts you in front of many people suits you well, such as education, the public sector, PR, broadcasting and community work. The more your results show and your name gets known, the harder you tend to work. Since it's easy for you to take on too much, deciding in advance when you'll say no lets you keep shining for a long time.`,
    money:
      `Money tends to follow as your name gets known and trust builds up. Your earning power is good, but so is your generosity, so quite a lot goes out on meals and gifts for others. Writing down what went out once a month helps you find a balance. You feel most at ease, and things tend to go better, in a home that gets plenty of sun and has an open view in front.`,
    love:
      `You love without holding back. You cheer on your partner's work as if it were your own, and when they're struggling, you're the first one to rush over. But when your heart is poured into work outside and looking after everyone else, the person right beside you can end up feeling left out. Writing time for just the two of you on the calendar first is how you protect your love.`,
    health:
      `Since you spend so much energy outward, fatigue builds up easily. This star has traditionally been linked with the eyes, the head and blood pressure. On days you've stared at screens for a long time, give your eyes a rest by closing them for a while. If headaches or dizziness come often, it's good to see a doctor.`,
    relations:
      `There's often someone in your family who is lively and busy out in the world. Among friends, you're the one who reaches out first and gets everyone together. Because you've given more than you've received, you can sometimes feel a little empty, and when that happens, it's okay to say honestly that you felt let down. Relationships last longer when the giving and receiving are in balance.`,
    life:
      `You get more energy out in the world than at home. Walking in the sunlight during the day or spending time where people gather brightens your mood. You find meaning in volunteering, clubs and talks, and hobbies where you teach others something suit you well. When late nights out start to pile up, your energy drains quickly.`,
    flow:
      `This is a time when you're out and about more and stand in front of people more often. Your name may get known, or the work you're responsible for may catch people's eye. Attention and requests grow along with it, so it helps to choose where you'll spend your light. Instead of running nonstop, be sure to protect some quiet time to wind down at the end of each day.`,
  },
  무곡: {
    nick: 'Resolve-and-Wealth star',
    title: 'Someone who acts before speaking and proves themselves through results',
    keywords: ['Follow-through', 'Money sense', 'Decisiveness'],
    nature:
      `This star is like a general put in charge of the treasury. It decides without hesitating, calculates precisely and puts results first. Its nature is firm and straight, so once it sets a goal, it walks directly toward it. It may lack a little softness, but its great strength is a solid certainty that you can rely on and hand things to.`,
    self:
      `You decide fast, whether you're choosing from a menu or facing a big contract. You weigh the gains and losses in your head in no time, and whatever you've agreed to do, you finish properly. The shadow side is that your words are short and firm, which can come across as cold. If you say "thank you" or "great work" out loud every so often, the people around you will open up to you much more easily.`,
    work:
      `You show your skill in work where numbers and results are clear, such as finance, accounting, technology and engineering. The hands-on lead who directs things on the ground is a role that suits you well too. You work hardest where goals are sharp and performance is measured precisely. On the other hand, when meetings drag on with vague standards and nothing but talk, you get frustrated quickly.`,
    money:
      `A sense for money is this star's greatest talent. You manage income and spending precisely, and you have the strength to make a plan and grow your money steadily. Being too strict about spending can frustrate your family, though, so set aside a share for enjoyment too. You choose homes and land by the numbers rather than by feeling, so you rarely make big mistakes.`,
    love:
      `You may be clumsy with words, but you show your care through action. When your partner says they're sick, you show up with medicine and a container of soup before offering any comforting words. You have a strong sense of responsibility in relationships, so once you give your heart, you stand by it for a long time. Some partners need to hear it in words, though, so even a short "I really like you" makes things much warmer.`,
    health:
      `With so much physical effort and movement in your life, it's easy to overdo it. This star has traditionally been linked with the lungs and breathing, and with the skin. Warm up before lifting anything heavy or exercising, and drink water often in dry seasons.`,
    relations:
      `You may well end up sharing money or work with a sibling or friend. You can help each other in practical ways, but when the accounts get fuzzy, things between you can turn awkward. The closer the relationship, the more it protects your bond to be clear about promises and amounts. You may not say much, but you're remembered as the person who steps up for real when it counts.`,
    life:
      `Out in the world, much of your travel is tied to work, and you prefer outings with a clear purpose to wandering aimlessly. Your mind finds satisfaction in hobbies with visible results, so strength training, hiking and sports where you track your times or records suit you well. If you only feel at ease on your days off once you've accomplished something, it's worth practicing simply resting now and then.`,
    flow:
      `This is a time when money and practical work move to the center of your life. Results tend to match your effort clearly, and chances may come to sort out your income or assets. With more decisions to make, don't push ahead too fast; run the numbers one more time. While you're absorbed in work, keep up the conversations with the people closest to you as well.`,
  },
  천동: {
    nick: 'Ease-and-Blessings star',
    title: 'An easygoing, fortunate soul who lightens the mood wherever they go',
    keywords: ['Gentleness', 'Optimism', 'Ease'],
    nature:
      `This star knows how to enjoy its blessings. Gentle and optimistic like a child, it puts people at ease and prefers making up to fighting. Even when there is hardship at first, it tends to find comfort as time goes on, so like a late-blooming flower, life often grows more abundant with age.`,
    self:
      `You have an easy warmth that lets even people you've just met relax around you. When an awkward silence falls at a team dinner, one joke from you brings the mood back to life. You love good food and good rest, and you laugh easily at little things. The shadow side is that you keep putting off things you don't want to do. If you only move when the deadline is right in front of you, try cutting a big task into small pieces and deciding on just today's share.`,
    work:
      `Work that helps people feel at ease suits you well, such as service, social care, counseling, the arts and food. In a good atmosphere your ability multiplies, and you're the one who eases the tension on the team. In fiercely competitive, high-pressure places, though, your motivation breaks easily. Having small goals you've set for yourself gives you momentum.`,
    money:
      `You'd rather have a comfortable life than chase big ambitions. When money comes in, you like spending it on enjoyment, like good restaurants and travel. You may save slowly, but if you let an automatic transfer put a little aside each month, you'll find a cushion building up before you know it. You feel most at home not in a big, flashy place but in a cozy one with friendly neighbors.`,
    love:
      `You like a relationship that's affectionate and full of fun together. Happy times, like hunting down a new restaurant every weekend, are what make your love grow. Because you hate fighting, it's easy to let hurt feelings slide, and the words you've swallowed can burst out all at once later. The relationship grows stronger when you face hard conversations together instead of avoiding them.`,
    health:
      `Because you love comfort, it's easy to move less and let your body get chilled. This star has traditionally been linked with the bladder and kidneys, the body's waterways. Drink warm water often and keep your belly and feet warm. Even adding a light walk leaves your body feeling much fresher.`,
    relations:
      `Your bonds with siblings, friends and parents tend to be gentle and full of affection. At home there's a place where you can lean back and relax, and with friends you enjoy meeting up even when nothing special is going on. But trying to be the nice one for everyone can leave you unable to say no. You can gently say, "I can't make it this time," and the relationship won't be easily shaken.`,
    life:
      `When you go out, you have a knack for finding good food, easy company and beautiful views. When you travel, taking it slow and enjoying the way suits you better than rushing. Your mind recovers through unhurried pleasures, so hobbies like cooking, listening to music and gardening are good for you. Adding one small thing to learn keeps you from simply coasting on fun and makes life even richer.`,
    flow:
      `This is a time when your mind eases and there's more to enjoy. Relationships tend to soften, and your daily life gains some breathing room. But leaning on comfort makes it easy to put off what needs doing, so choose one thing you really want to achieve during this period. Then the ease turns into opportunity.`,
  },
  염정: {
    nick: 'Passion-and-Principle star',
    title: 'Someone who throws themselves in completely yet never crosses their own lines',
    keywords: ['Passion', 'Tenacity', 'Principle'],
    nature:
      `This star holds burning passion and firm principles together. Its likes and dislikes are clear, and it shows astonishing focus on whatever captures its heart. It may look calm on the outside, but there's a flame inside: turned toward work and goals, that fire becomes great achievement, and turned toward emotions, it can burn you. The better you learn to handle it, the brighter this star shines.`,
    self:
      `Once you've made up your mind, you'll stay up all night if that's what it takes to see it through. Even when you pick up a hobby, you dig deep into the gear and the theory behind it. Your lines are clear, so you say no when something isn't right, and that's why people call you dependable. The shadow side is that your words get sharp when your emotions swing. When you're angry, the habit of waiting a day before you answer becomes a real strength.`,
    work:
      `Work that demands deep immersion suits you well, such as competitive fields, law and public administration, electronics and technology, and the arts. You have the strength to follow the rules and still push all the way to the goal. Your wish to be recognized is strong, so you do even better when you have a rival. When work and feelings get mixed, though, you tire easily, so it helps to practice seeing the task and the people separately.`,
    money:
      `Your earning power through work is strong, so growing your skills and raising your market value is the approach that suits you best. Your finances settle down as long as you watch what you spend on days when you're upset or overexcited. When you want something, a rule of thinking it over again three days later works well. You want a neat, well-ordered space, so you take your time choosing a home until it feels just right.`,
    love:
      `You love deeply and with real heat. You can't hide it when you like someone, and you give your partner your whole heart. That also means you feel hurt just as intensely, and when something small stings, you may chew it over alone for a long time. Rather than holding on to the hurt, calmly talking it through the same day keeps the relationship healthy.`,
    health:
      `Tension and emotion tend to show up in your body right away. This star has traditionally been linked with blood flow and the heart. When stress builds up, release it with light cardio, and if your heart often races or swelling lingers, see a doctor.`,
    relations:
      `Because your bonds with family and friends run deep, clashes come easily too. Each of you has a clear way of doing things, so a small difference of opinion can sometimes grow into a big one. Still, you have a loyalty that protects anyone who has become one of your people, all the way to the end. Try being the one who reaches out first after a fight, and you'll feel the relationship grow even deeper.`,
    life:
      `Out in the world, you're drawn to activities with competition or challenge. Having a goal, like a contest, an exam or a personal record to beat, brings you to life. Your mind is at ease when it has something to throw itself into, so hobbies you can dig deep into, like an instrument, drawing or crafts, suit you well. On days when your feelings are tangled, you need time alone in a quiet place to sort them out.`,
    flow:
      `This is a time of more competition and challenge. A goal worth pouring your passion into may appear, along with a chance for your skills to step up a level. At the same time, your emotional ups and downs can grow, so managing your feelings is the task of this period. Set up an outlet that lets emotions flow out, like regular exercise or a journal.`,
  },
  천부: {
    nick: 'Treasury star',
    title: 'A steady storehouse of a person who gathers, protects and shelters others',
    keywords: ['Stability', 'Big heart', 'Management'],
    nature:
      `This star guards the storehouse and the pantry. It gathers what comes in, doesn't let it slip away carelessly, and has the strength to steady the finances of a household or an organization. Its nature is generous and calm, so it can take many people under its wing. Its true worth shows not in making new things quickly but in protecting and growing what already exists.`,
    self:
      `You're the one who packs spare medicine and an extra charger for a trip. Even in a crisis you don't raise your voice; you calmly sort things out and put everyone around you at ease. You embrace people generously, but inside you carefully weigh costs, benefits and the order of things. The shadow side is that you shy away from change and tend to stick with the familiar way. Choosing a small adventure on purpose now and then widens your view.`,
    work:
      `Work that protects and runs things suits you well, such as management, finance, administration and real estate. You're good at handling an organization's resources or pulling scattered tasks together into a system. You earn trust through work that builds up over time rather than work that suddenly flips everything over. Since you lean toward stable places, keep an eye out so you don't weigh an opportunity so long that it slips away.`,
    money:
      `You have a real gift for saving and protecting what you have. Setting aside savings first, the moment your paycheck lands, comes naturally to you. Steady building suits you better than forcing quick growth, and your storehouse tends to fill as time goes on. You care a lot about homes and land, and you put real effort into securing a place to stay for the long haul. Just don't save so hard that you miss out on the joy.`,
    love:
      `You want a stable relationship, and you embrace your partner generously. You feel love in running a household together and planning the future side by side. Your habit of weighing practical matters first, though, can look calculating to a partner. If you show with words and small gifts that your heart comes before any conditions, your partner will feel far more secure.`,
    health:
      `A life of eating well and moving little can easily take hold. This star has traditionally been linked with the stomach, appetite and body weight. Adjust your portions little by little, and deliberately raise your activity, for example by choosing the stairs over the elevator.`,
    relations:
      `You're the steady support that family and friends lean on. There also tend to be people around you who are well off or reliable. When times are hard you may share money or opportunities, but you have your own standard of helping within your means rather than lending blindly. Letting people know that standard up front keeps hurt feelings from forming.`,
    life:
      `Even when you go out, you like familiar routes and your regular spots. Traveling comfortably within a planned schedule suits you best. Your mind finds stability in gathering and tending things, so hobbies like collecting, organizing your home and growing houseplants suit you well. Going somewhere unfamiliar on purpose can also be a good jolt.`,
    flow:
      `This is a time when your household and finances settle, and there's more to protect. Building your foundation, through savings or housing matters, for example, tends to become the focus. As your responsibilities grow, managing what you already have serves you better than overreaching. Sharing what you've built with the people you love makes the blessings of this period even greater.`,
  },
};
