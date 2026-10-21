import type { AmountKey, DayComboReading, SpousePalaceReading, TenGodName } from '../types';

/** What sits in the partner spot of the chart: how you are up close, who you're drawn to, what to watch for */
export const SPOUSE_PALACE: Record<TenGodName, SpousePalaceReading> = {
  비견: {
    love: "You're as relaxed with a partner as you are with a good friend, and you want a relationship where you walk side by side rather than one person leaning on the other. Equality matters to you, like taking turns paying for dates or respecting each other's schedules, so a relationship where only one person keeps adjusting to the other is hard for you to sustain. You often grow close by working out together or sharing the same hobby.",
    attract: "Someone whose own work and life stand firmly on their own two feet. Talking with them comes easily, your tastes line up, and being together feels as comfortable as being with an old friend.",
    caution: "If you're both stubborn, even small things can turn into a contest over who wins. When an argument starts, look first for a way the two of you can decide together, before worrying about who's right.",
  },
  겁재: {
    love: "When you start to like someone, you don't hesitate to make the first move. You pour your heart into a partner, and when you're together, you want to build a little world just for the two of you. But you hate to lose, so you don't back down easily even in a squabble, and jealousy can flare up out of nowhere, sometimes surprising even you.",
    attract: "Someone bursting with energy who knows exactly what they think. With a lively partner who'll jump into unfamiliar things right alongside you, there's never a dull moment the whole time you're together.",
    caution: "If money gets blurred together without clear lines, hurt feelings tend to pile up. Agree on rules for shared money ahead of time, and when jealousy kicks in, ask directly instead of guessing.",
  },
  식신: {
    love: "You feel love in eating good food together and sharing the small moments of an ordinary day. Bringing your partner's favorite food over on a day they're worn out, or watching a movie at home in comfy clothes, is when you're happiest. Even when you argue, you don't stay sulky for long, and you guide the relationship along in a relaxed, warm way.",
    attract: "Someone who puts you at ease and laughs easily. When your rhythms of eating, resting and playing line up so well that even a day where nothing happens is fun, you get close fast.",
    caution: "Leaning on comfort makes it easy to forget to keep the spark alive. Every so often, wander through a neighborhood you've never been to, or put your gratitude into words, to breathe fresh life into the relationship.",
  },
  상관: {
    love: "You're expressive and good with words, so you're the one who sets the mood in a relationship. You might plan a surprise anniversary gift yourself or make your partner laugh with a witty message. In return, you expect thoughtful responses, so when a reply feels half-hearted, you can feel your interest cooling in an instant.",
    attract: "Someone with a sparkle of talent who's a joy to talk with. Even better if they listen to your ideas with real interest while having a clear style all their own.",
    caution: "When you're hurt, sharp words tend to come out first. If there's something you need to say, take a breath and frame it around how you feel, and your arguments will be much shorter.",
  },
  편재: {
    love: "When you like someone, you're generous with both your time and your effort. You love planning a surprise trip or picking out a gift and watching your partner's face light up. You like people and move in wide circles, so even when you're seeing someone, your calendar stays full of friends and plans. That's why you feel at home in a relationship where you both respect each other's freedom.",
    attract: "Someone easygoing with plenty of life experience. You click with a partner who happily tags along to unfamiliar places and goes along with whatever new plan you've cooked up.",
    caution: "When your attention is spread in every direction, your partner may feel pushed to the back of the line. Even in a busy week, put one block of time for just the two of you on the calendar before anything else.",
  },
  정재: {
    love: "You're a devoted partner who cares for one person steadily over the long haul. Rather than flashy gestures, you show your feelings by staying in touch every day and keeping your promises, and you find security in planning the future step by step, like the savings you'll build together or the home you'll buy. You quietly watch to see whether this is someone you could build a life with.",
    attract: "Someone dependable with good everyday sense. When you meet someone who keeps their promises and whose actions match their words, a person you can trust and lean on, you finally relax.",
    caution: "Your care can come out as nagging or checking on spending, and your partner may feel boxed in. Once in a while, enjoy a spontaneous day together that wasn't in the plan.",
  },
  편관: {
    love: "When you fall in love, you tend to fall deep and hard. You have a strong urge to protect your partner, and when trouble hits, you're the most solid presence by their side. A bit of tension in the relationship actually keeps your feelings alive, but there are also moments when things get tight over who's in charge.",
    attract: "Someone with real presence who holds their ground in their own field. Your heart flutters around a steady, grounded person who isn't shaken by much.",
    caution: "Your wish to protect your partner can feel like control. When you're worried, instead of telling them what to do, try opening with how you feel, like \"This is what I'm worried about.\"",
  },
  정관: {
    love: "You take love seriously and approach it with a sense of responsibility. Rather than dating casually, you look from the start at whether this is someone you could picture a future with, and once you've made up your mind, you keep the relationship on a steady footing with courtesy and loyalty. You want a relationship you can proudly introduce to your family and the people around you.",
    attract: "Someone upright and trustworthy, close to your ideal. Your interest grows for a person who takes full responsibility for their work and is polite even to the server at a restaurant.",
    caution: "If you have a lot of rules about how things should be, love can start to feel like homework. Give yourself the room to laugh off your partner's clumsy moments as part of who they are.",
  },
  편인: {
    love: "You want a deep connection where someone understands how you feel without you having to say it. Even when you're close, you really need time alone and room to think, so spending one weekend day apart feels natural to you. Even on days you're quieter than usual, your feelings haven't changed. You may look calm on the outside, but you have a sensitive radar that catches even the smallest change in your partner's expression.",
    attract: "Someone with an unusual point of view and real depth who sparks your curiosity. You fall for a person you can talk with late into the night about books and movies, with tastes all their own.",
    caution: "If you quietly swallow your hurt and then suddenly pull away, your partner is left confused, with no idea why. Even briefly, let them know you need some time to sort out your thoughts.",
  },
  정인: {
    love: "You want to wrap the people you love in care, and you also want to be warmly looked after yourself. You have a tender side that listens to a partner's worries all the way through and brings them medicine when they're sick, and on hard days, you long for someone who'll just hold you quietly. You dream of a comfortable, deep relationship where you're each a place for the other to rest.",
    attract: "Someone big-hearted with a lot you can learn from, the kind of person you want to lean on. You open up to a partner who listens calmly to your stories and holds you with a grown-up kind of care.",
    caution: "As your need to lean on someone grows, even a small moment of carelessness can sting deeply. If you say specifically what kind of care you'd like, it gets easier for both of you.",
  },
};

/** How much partner energy there is: how easily love finds you */
export const SPOUSE_AMOUNT: Record<AmountKey, string> = {
  many: "Over the course of your life, connections with real chemistry tend to come your way naturally and often. Sparks fly often at gatherings and at work, so you have plenty of options, but your heart can also get pulled this way and that. It helps to develop a calm eye for recognizing, among many connections, the person you'll stay with for the long run.",
  normal: "The energy for connection sits at a comfortable level, so you tend to meet someone you click with when the time is right, without forcing it. With neither too much nor too little, it's a flow that makes it easy to focus on one person. Simply meeting people steadily within your everyday circles is enough.",
  few: "The energy for connection is on the quiet side, so love more often opens up when you take a step toward it than rolls in on its own. In return, you have the strength to protect a connection deeply and treasure it once it's made. If you keep showing up to groups you're interested in, or welcome it when friends want to set you up, good meetings tend to follow.",
};

/** The state of your energy in the lower part of your birth day: the texture of your personality */
export const DAY_PHASE: Record<string, string> = {
  장생: "When you step into a new environment, you adapt quickly and learn fast. Even with something you've never done before, excitement comes first, and older people and mentors tend to take a liking to you. Your energy for beginnings is strong, so you shine even more when you see things through to the end.",
  목욕: "You're curious and quick to respond to trends and new experiences. You might switch up your outfit or hairstyle often to change your mood, and you hit it off with strangers in no time. When your interest keeps hopping from thing to thing, it helps to pick one and dig into it deeply.",
  관대: "You're full of confidence and not afraid to step up front. In a presentation or a first introduction, you leave a good impression with how sure of yourself you are, and when you want to do something, you just go for it. If you keep your ears open to other people's advice now and then, that momentum lasts even longer.",
  건록: "You have a strong drive to earn your own way and solve things yourself rather than lean on anyone. From early on, you've had a habit of taking care of your own share, and you're diligent enough never to let go of a task you've taken on. It helps to remember that asking for help when things are hard is a skill too.",
  제왕: "Your energy is full to the brim, so your presence is unmistakable wherever you go. You naturally become the center of a gathering, and when something big is coming up, you tend to feel even more fired up. Your pace may feel fast to others, so if you wait a beat for them, people follow you more easily.",
  쇠: "People often tell you you're seasoned and calm beyond your years. Rather than pushing hard from the front, you know how to read the flow and wait for the right moment, so you make few mistakes and tie up loose ends neatly. Every so often, it's fine to set the calculations aside and just follow your heart.",
  병: "You have a delicate sense that picks up on changes in other people's moods faster than anyone. You're the friend who asks if someone is okay before they've said a word. As much as you look after other people's feelings, check in often on whether your own heart is worn out.",
  사: "Once you're absorbed in something, you dig in so deeply that you stop hearing what's going on around you. You're good at trimming away the extras and keeping only the core, so you can sort out complicated work cleanly. The deeper your thoughts go, the more you should step outside now and then for some fresh air.",
  묘: "You quietly store things up inside rather than putting them on display. You have a gift for collecting and treasuring things, whether money, knowledge or memories, and you get attached even to old belongings. When you take out what you've stored and share it now and then, its value grows.",
  절: "You don't get tied down by the past, and you know how to change direction cleanly. When what you're doing isn't a fit, you look for a new path without regrets, and thanks to that decisiveness, you sometimes blossom in a completely different field. If you make a habit of thinking it through one more time before you make a change, your footing will be firmer.",
  태: "You have lots of plans and dreams in your head, and you can see potential in things that haven't taken shape yet. Your notes are always full of ideas, and when you talk about them, the people listening get excited too. When you actually start with one small thing, your dreams begin turning into reality.",
  양: "You're blessed in that help and love tend to come to you naturally from the people around you. Rather than rushing, you move once you feel prepared enough, so your start may look slow, but your footing gets steadier as you go. When you remember the help you've received and give it back, your connections grow stronger.",
};

/** When the lower part of your birth day pulls together with or clashes against its neighbors in the chart */
export const DAY_COMBO: { hap: DayComboReading; chung: DayComboReading } = {
  hap: {
    love: "Once you give your heart to someone close, you don't easily take it back, and your affection runs deep. You're the loyal type who shares the details of each day with a partner and stays by their side for the long haul. But if you're together all the time, your time on your own can shrink, so keep carving out a little room for yourself too.",
    relations: "Your ties with family and old friends tend to be unusually strong. Many of your relationships are the kind where you reach out first and look after each other when times are hard, which is reassuring, but you can also end up shouldering burdens because you can't turn down a request. If you set your own limits, that affection lasts even longer.",
  },
  chung: {
    love: "Rather than a relationship that stays in the same place, you want one where you change and move together. Travel and new challenges bring energy to your relationship, and when you have room to breathe, your feelings actually grow deeper. It helps to agree ahead of time that you'll respect each other's space.",
    relations: "You tend to come alive among new people and surroundings more than in familiar places. You may move house or change jobs often, but you gain a wide network in return. When you and your family don't see eye to eye, things go much more smoothly if you take a day's distance before talking instead of confronting it right away.",
  },
};

/** How much wealth energy there is: how money flows for you */
export const WEALTH_AMOUNT: Record<AmountKey, string> = {
  many: "You tend to see chances for money coming in from many directions, and often. Work and side-gig offers come your way easily, and your money sense is quick, so you're good at earning, but just as many ways for it to go back out can open up. If you build the habit of setting aside a fixed share every time income comes in, your savings stack up steadily.",
  normal: "Money tends to flow in and out of your life in a smooth, balanced way. You find stability in work that earns steadily without big ups and downs, and you know where to spend and where to save. If you review your fixed monthly expenses once in a while and set a small savings goal, a nice sum builds up faster than you'd expect.",
  few: "For you, money tends to follow when you build skill and trust rather than chasing money itself. Instead of aiming for a big windfall all at once, growing your own edge, like a skill or a credential, steadies your income. Use a budgeting app so you can see where your money goes, and make a money plan with someone you trust for extra peace of mind.",
};

/** The charm that draws people in */
export const CHARM: string =
  "You have a natural charm that catches people's eye, even at a first meeting. Warmth comes through in your smile and the way you talk, so people find you easy to approach. But being sweet to everyone can sometimes lead to misunderstandings, so be clear about where your heart lies.";
