import type { PalaceReading, JamiExtraReading } from '../types';

/** The 12 areas of life in the chart. Keys are the Korean area names; body text uses plain words only. */
export const PALACES: Record<string, PalaceReading> = {
  명궁: {
    intro:
      "This area shows your inborn personality and temperament, and the basic attitude you bring to the world. It's the starting point for reading every other area, so once you understand it, it gets much easier to see in which situations you come alive and in which moments you tend to wobble.",
    empty:
      "No central star sits here, so we borrow the energy from the area directly across to read it. It means you're highly adaptable: rather than following a fixed mold, you take on a different shape depending on the surroundings you're in and the people you meet.",
  },
  형제궁: {
    intro:
      "This area shows the kind of bonds you form not just with brothers and sisters, but also with the colleagues you work beside and the peers walking alongside you. Once you know whether these are relationships of mutual help or of quiet comparison, and how much distance feels comfortable, finding your place on a team gets a lot easier.",
    empty:
      "Your relationships with the people closest to you don't come in a preset shape; they tend to change depending on who you're with. When you meet good colleagues, the bond tends to grow just as warm and dependable as they are.",
  },
  부처궁: {
    intro:
      "This area shows how you share your heart with a partner or spouse, what kind of person draws you in, and what you hope for when you build a life together. Knowing your own habits in love helps you get hurt less often over the same old things and tend the relationship more easily.",
    empty:
      "The shape of your love isn't set from the start, so the color of a relationship can change quite a bit depending on the other person's nature. A kind of love where you talk often and adjust to each other together suits you well.",
  },
  자녀궁: {
    intro:
      "This area shows your bond with children, and with the people you look out for and help grow, like juniors at work or members of your team. It also reveals what comes naturally to you when you're raising or teaching something, which makes it useful for looking back at how you treat the people who look up to you.",
    empty:
      "The way you look after others tends to shift flexibly to fit the situation. If you first take in a child's or a junior's personality and approach them in a way that suits it, you may actually connect even better.",
  },
  재백궁: {
    intro:
      "This area shows your own particular habits and instincts around how you earn money, where you spend it, and how much you save. Rather than telling you whether a big sum is coming, it reveals the way you get comfortable with money, which makes it a clue for finding the kind of money management that fits you.",
    empty:
      "The way you handle money isn't fixed to one style, so it's strongly shaped by where you work and by the habits of the people around you. Keep good role models nearby, and your sense for managing money grows quickly.",
  },
  질액궁: {
    intro:
      "This area shows the ups and downs your physical and mental condition tends to ride, and where fatigue likes to build up. It isn't a place for predicting anything; it's best read as a nudge to find the way of resting and the daily rhythm that suit you, and to look after yourself ahead of time.",
    empty:
      "Your condition tends to depend more on your surroundings and daily habits than on the constitution you were born with. Get your sleep and meals in sync with the rhythm of the people you live with, and your body will feel that much more at ease.",
  },
  천이궁: {
    intro:
      "This area shows how people see you outside your home, and what kind of energy you run into in unfamiliar places, on trips, and when you're on the move, whether that's moving house or traveling for work. It's where you can see the other side of yourself that comes out once you step beyond your familiar walls.",
    empty:
      "How you come across out in the world shifts freely depending on where you go and who you meet. You have a knack for blending into new surroundings quickly, so there's no need to be too nervous about unfamiliar settings.",
  },
  노복궁: {
    intro:
      "This area shows the kind of ties you form across your wider network, like friends, acquaintances, and business contacts. Once you know who tends to help you, whom it's easier to keep at arm's length, and what role you tend to slip into in a group, you'll find people a lot less draining.",
    empty:
      "Your network has no fixed shape, so your relationships change a lot depending on which groups you join. Develop an eye for choosing a crowd you truly click with, and good connections will follow on their own.",
  },
  관록궁: {
    intro:
      "This area shows your attitude toward work, the shape of work that suits you, and the achievements and standing you build up in the world. Knowing in which settings your skills shine through gives you a solid yardstick when you're choosing a job or changing the way you work.",
    empty:
      "Rather than your career pointing one way from the very start, paths tend to open up depending on the organizations and colleagues you come across. Trying a range of work and finding your way to the right fit is itself what makes you strong.",
  },
  전택궁: {
    intro:
      "This area shows what your home, property, and the spaces you live in mean to you. It also holds how you run your household and what the mood is like with your family, so it offers clues for making a nest where your heart can rest.",
    empty:
      "Your taste and circumstances in choosing where to live tend to shift to match the people you live with and the feel of the neighborhood. Wherever you are, if you tend your own space little by little, it soon becomes a comfortable home.",
  },
  복덕궁: {
    intro:
      "This area shows the ease and joy deep in your heart, and what you recharge with when you're on your own. It holds your hobbies, your habits of thought, and the way you feel happiness, so it helps you find ways to take care of yourself in the middle of a busy life.",
    empty:
      "What brings you joy isn't fixed, so you easily pick up the hobbies and new experiences the people around you recommend. It's a good idea to lightly try a variety of things and then keep the ones that suit you.",
  },
  부모궁: {
    intro:
      "This area shows your relationship with your parents, and with elders who guide you, like a boss at work or a teacher. Knowing how you learn from older people and how much distance feels comfortable makes it much easier to ask for help or to get on the same page.",
    empty:
      "Your relationships with elders don't follow a set pattern; they tend to change a lot depending on which older people you meet. Seek out people worth looking up to and keep them close, and you'll gain a dependable source of support.",
  },
};

/** Extras: star brightness, the four transformations, helper stars, friction stars, and the area your heart turns to with age */
export const JAMI_EXTRA: JamiExtraReading = {
  bright: [
    "The starlight here is shining brightly. Your natural strengths come through without any strain, so the people around you are quick to recognize that power too.",
    "The star's energy is vividly alive here, so your good side comes to the surface easily. Trust this strength and step forward first, and results tend to follow faster than you'd expect.",
  ],
  dim: [
    "The starlight here is soft, so your strengths grow slowly rather than showing all at once. Depth comes as experience builds, and over time they actually become sturdier.",
    "The star's energy is quietly tucked away, so at first it may be hard to notice your own strength. As you stack up small successes one by one, that strength comes into clearer focus.",
  ],
  sihwa: {
    록: {
      natal:
        "This is an area where good fortune and opportunity are generously built in from birth. A lot comes back in proportion to the effort you put in, and when you need it, people or resources tend to gather around you naturally.",
      period:
        "During this time, good opportunities and abundance flow into this area. If you bring out plans you've shelved, they're likely to go more smoothly than you expect, and welcome offers tend to come your way.",
    },
    권: {
      natal:
        "This is an area where you were born with a strong power to lead and decide for yourself. Your skills come alive when you take charge directly instead of leaving things to others, and you tend to end up in the central role quite naturally.",
      period:
        "During this time, the reins in this area pass to you. You may take on a position of responsibility or face more decisions, and if you use that power gently, people's trust in you grows along with it.",
    },
    과: {
      natal:
        "You were born with an energy that makes it easy to earn a good reputation and recognition. Effort you build up faithfully leaves its mark as a good name, and when things get hard, you tend to meet people who graciously lend a hand.",
      period:
        "This is a time when the effort you've put in is likely to become known and recognized. It's a good moment to earn a credential or pull your results together to show people, and the praise you receive leads on to your next opportunity.",
    },
    기: {
      natal:
        "This is an area holding a knot that asks a little more care from you. Instead of letting ambition lead, approach it calmly and steadily, and even if it takes a long time, you'll reap results with real depth to match.",
      period:
        "During this time, things in this area are likely to get tangled or weigh on your mind. Rather than rushing or forcing your way through, step back and look things over, and the knot will loosen more gently than you'd think.",
    },
  },
  aux: {
    좌보: "Someone shows up beside you who quietly lends a hand, so things go far more smoothly here than when you go it alone.",
    우필: "Help often appears from places you never expected, letting some air back into situations that felt stuck.",
    문창: "A boost to your writing and studying power means that habits of organizing and taking notes bring good results here.",
    문곡: "A boost to your way with words and your talents means that your knack for telling stories and expressing yourself moves people's hearts here.",
    천괴: "You have a pull that gets elders and seniors to open doors for you, so don't hesitate to ask for advice; it tends to lead to good opportunities.",
    천월: "There's a helper looking out for you behind the scenes, so in hard moments, you're likely to receive help quietly.",
    녹존: "A power to steadily protect and grow what you have is added here, giving you a stable footing that doesn't shake easily.",
    천마: "The more you move around and get out there, the more opportunities follow you, so the more you travel and stay active, the more things come alive.",
  },
  sal: {
    경양: "Sharp competition or clashes come up easily here. Treat that tension as a spur to hone your skills, and it becomes a drive few others have.",
    타라: "Things tend to move slowly here, or stubbornness gets out in front. If you don't rush and hold on patiently, you'll get solid results, even if they come late.",
    화성: "Sudden changes or flashes of temper tend to flare up here. Put that quickness to work in handling crises, and you can turn the situation around faster than anyone.",
    영성: "Tension you haven't voiced tends to build up inside here. Release it regularly through writing or exercise, and that sensitivity turns into fine, focused attention.",
    지공: "The plans in your head and reality easily drift apart here. Keep the big picture alive but check it in small steps, and your unusual ideas gain real force.",
    지겁: "Unexpected expenses or losses come up easily here. Keep spare money set aside and get into the habit of tracking it, and you'll get through without being shaken.",
  },
  shen: "As you get older, you tend to pour more of your heart and energy into the '{field}' area of your life. Even if your interests are scattered all over when you're young, over time this area becomes the center of gravity in your life.",
  shenSame:
    "Even as you get older, your heart's center tends to stay with yourself rather than out in the world. The more you keep refining your natural tendencies, the more your life becomes truly your own.",
};
