// How-to guides — accessible from every free session page.
// Short, practical, revisitable. Rob Berkeley's voice.

export interface HowToGuide {
  id: string
  title: string
  tagline: string
  body: string // markdown-lite: paragraphs, bold via **, bullets via - or *
}

const VOICE_NOTE = '*You can speak this instead of typing — there is a microphone button next to the text area.*'

export const howToGuides: HowToGuide[] = [
  {
    id: 'reflect',
    title: 'How to reflect',
    tagline: "Noticing, not analysing.",
    body: `${VOICE_NOTE}

Reflection isn't therapy. It isn't analysis. It's slower than both.

It's the act of paying attention to something that already happened — a moment, a feeling, a choice — without rushing to fix it. You're not trying to figure it out. You're trying to notice it.

Here's the move: a thing happened. You felt something about it. Before the world moves on, you stop and put it into words. That's it.

**Do:**
- Pick one thing. Not the whole day — one moment
- Write in the first person. "I noticed." "I felt."
- Let yourself be wrong about what you thought you were feeling
- Stop when you're done, not when the page is full

**Don't:**
- Don't explain yourself to anyone. This isn't for them
- Don't try to arrive at a lesson. Reflection isn't homework
- Don't judge what comes up. Noticing isn't scoring

**Sentence starters:**
- Today I noticed...
- What stayed with me was...
- The thing I didn't expect was...
- If I'm honest...
- The moment that landed was...

**For beginners:**

*Today I noticed that I checked my phone three times during a conversation with a friend. I felt embarrassed when I caught myself. What stayed with me is that I wasn't bored — I was anxious to seem responsive to people who weren't in the room.*

*What stayed with me from today was the way the light hit the kitchen counter while I was making coffee. I felt something I'd call peace. I'm surprised how small a thing can hold that.*`,
  },
  {
    id: 'gratitude',
    title: 'How to write a gratitude',
    tagline: 'Small. Specific. Costed.',
    body: `${VOICE_NOTE}

Gratitude isn't a list. It isn't a performance. It's not #blessed.

Gratitude is the practice of noticing what held you, and naming what it cost. That second part is the key. *"I'm grateful for my family"* is a phrase. *"I'm grateful that my sister called me on the day I couldn't get out of bed, and she didn't ask what was wrong, she just stayed on the line while I made tea"* is a gratitude.

Small. Specific. Costed.

**Do:**
- Name one thing. The smallest thing counts
- Say who or what held you — by name, not in the abstract
- Ask: what did it cost them? What did it give you?
- Let it be about a place, a meal, a song, a stranger. Not always people you love

**Don't:**
- Don't list things you're supposed to be grateful for
- Don't perform it. No one's reading
- Don't say "I'm grateful for my health" unless you have a specific story about your health

**Sentence starters:**
- Today I'm grateful that...
- The small thing I want to remember is...
- What held me today was...
- I want to say thank you for...
- Before I forget...

**For beginners:**

*Today I'm grateful that the bus driver waited when he saw me running. He didn't have to. I want to remember the small kindness of people who are under no obligation to extend it.*

*What held me today was the first cup of coffee in a quiet flat. I want to say thank you to whoever grew the beans, whoever roasted them, whoever sold them to me. A small chain of care I didn't earn and won't forget.*`,
  },
  {
    id: 'goal',
    title: 'How to set a goal',
    tagline: 'A direction, not a to-do list.',
    body: `${VOICE_NOTE}

A goal isn't a to-do list. And it isn't a resolution.

A to-do list is for today. A resolution is for January. A goal is for something in between — a direction you want your life to take, broken down into the smallest action you can actually do this week.

The move: you want something. You're honest with yourself about what it is. Then you pick *one* small thing you can do by next week that moves you a step toward it. That's it. No grand plan. No spreadsheet.

**Do:**
- Start with the want, not the action. What do you actually want more of?
- Make it small. One thing. One week
- Make it observable. You should know whether you did it or didn't
- Separate the goal from the action. The goal is where you're going. The action is the next step

**Don't:**
- Don't set more than one at a time. Multiple goals kill momentum
- Don't set a goal for someone else's life. This is about yours
- Don't punish yourself if you don't meet it. The goal is the direction, not the metric

**Sentence starters:**
- What I want more of is...
- By next week, I want to...
- The smallest thing I can do is...
- What I'll do instead of [old pattern] is...
- One honest step would be...

**For beginners:**

*What I want more of is time that isn't screen time. By next week I want to take one walk that's longer than twenty minutes without my phone. The smallest thing I can do is charge my phone in the kitchen on Saturday morning so I can leave it behind.*

*What I want more of is honest conversation with my brother. By next week I want to have called him once — not texted, not voice-noted, called — and asked him how he actually is. The smallest thing I can do is put his name in my calendar for Sunday afternoon.*`,
  },
  {
    id: 'letter',
    title: 'How to write a letter',
    tagline: "For people who aren't going to read them.",
    body: `${VOICE_NOTE}

Letters are for people who aren't going to read them.

That's the trick. You write a letter to a younger version of yourself, or to an ancestor you never met, or to someone you've lost, or to a version of yourself ten years from now — and you write it as if they *might* read it. The "might" is what makes it honest. You can't hide behind the fact that you're only writing for yourself, because part of you is writing to them. So you tell the truth.

These letters are private. They don't get sent. They live here.

**Do:**
- Start with "Dear..." — the form matters
- Pick one person and one moment. Don't try to cover everything
- Say the thing you couldn't say out loud
- End with something you want them to know, even if they can't

**Don't:**
- Don't write to a person who's alive and in your life unless you're genuinely prepared to eventually say the thing
- Don't turn it into an essay. It's a letter
- Don't force a conclusion. "I love you," "I forgive you," "I'm sorry" — these don't have to be earned by the letter

**Sentence starters:**
- Dear younger me...
- Dear [name], there's something I never told you...
- Dear ancestor I never met...
- Dear future self, by the time you read this...
- Dear Ivor, I want you to know...

**For beginners:**

*Dear younger me — you don't need to hold it all. The thing you're carrying at seventeen, the weight of trying to be right for everyone, it's not yours. You'll put it down eventually. I'm writing to tell you it's OK to put it down sooner.*

*Dear Ivor — I know you won't read this. But I want you to know that we found you. Your story walked into a room in Croydon eighty years after you stood on Tilbury Docks. We built a graphic novel out of you. Seven strangers said your name out loud. The silence didn't win.*`,
  },
]

export function getGuide(id: string): HowToGuide | undefined {
  return howToGuides.find((g) => g.id === id)
}

/** Mapping from free exercise type to the most relevant guide. */
export function guideForType(
  type: 'reflect' | 'gratitude' | 'goal' | 'letter',
): HowToGuide {
  const id = type === 'reflect' ? 'reflect' : type
  return getGuide(id)!
}
