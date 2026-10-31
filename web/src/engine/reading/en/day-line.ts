import type { DayLineTable } from '../types';

/** One line for today: the day's energy × how well it suits you */
export const DAY_LINE: DayLineTable = {
  비견: {
    good: "Going at your own pace works out today. Knock out that task only you can do before the day ends.",
    normal: "A nice day to catch up casually with a friend or coworker. Even one shared lunch can lift your energy.",
    caution: "It's easy to insist on doing things your way today. Reread your group chat replies once before you hit send.",
  },
  겁재: {
    good: "Your competitive streak works in your favor today. Pull a step ahead at the gym or on a deadline.",
    normal: "Invitations may keep rolling in today. Set a spending limit for the day first thing in the morning.",
    caution: "Impulse buys and spur-of-the-moment plans pile up easily today. Leave the shopping cart alone until tomorrow.",
  },
  식신: {
    good: "Making something with your hands will brighten your whole mood today. Cook a meal or finish one small project.",
    normal: "Eat well and rest on time, and the work moves along smoothly today. Whatever happens, don't skip lunch.",
    caution: "Your body may feel sluggish today. Pick just one task and get it done before noon.",
  },
  상관: {
    good: "Your wit comes alive in both speech and writing today. Bring out that pitch or piece you've been sitting on.",
    normal: "Ideas keep popping up today. Jot them in your phone's notes app and they'll come in handy later.",
    caution: "Even one remark can land sharper than you meant today. If you want to push back, sleep on it and say it tomorrow.",
  },
  편재: {
    good: "Unexpected openings show up when you're out and about today. Answer any messages that come in quickly.",
    normal: "Plans may shift around a lot today. Double-check the time and place of every meeting.",
    caution: "Don't rush any decision involving serious money today. Give that contract another read tomorrow.",
  },
  정재: {
    good: "Being thorough pays off directly today. Sorting your receipts and budget will leave you feeling refreshed.",
    normal: "All today asks is that you work through what's already set. Cross items off your list in order.",
    caution: "Small sums can set your nerves on edge today. Check every transfer and payment twice.",
  },
  편관: {
    good: "The harder the job, the more your ability shows today. Start with the trickiest task on your plate.",
    normal: "Tasks bunch up a little today. Choose the three most urgent ones and handle them one by one.",
    caution: "Pressure can hit from every side at once today. Ask for help with anything too heavy before lunch.",
  },
  정관: {
    good: "A tidy, composed manner leaves a strong impression today. Walk into any meeting or interview with confidence.",
    normal: "Keeping your promises and deadlines is plenty for today. Make your updates short and accurate.",
    caution: "Worrying about how others see you can wear you out today. Covering the basics is more than enough.",
  },
  편인: {
    good: "Bright ideas come easily today. Give a topic you've been curious about one focused hour.",
    normal: "You need a bit of quiet time to think today. Put in your earbuds and take a short walk.",
    caution: "One worry can easily lead to the next today. Write down only the pros and cons, then decide in the evening.",
  },
  정인: {
    good: "What you learn sinks right in today. It's a good day to open a book or deal with paperwork.",
    normal: "Notes carry more weight than talk today. Wrap up any important calls or messages in the morning.",
    caution: "Waiting for someone else to handle things can leave your work piling up today. Finish one small task yourself.",
  },
};
