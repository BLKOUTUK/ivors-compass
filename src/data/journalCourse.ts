// Ivor's Compass Journal — Course Structure
// 7 chapters × 10 exercises (5 guided + 5 free, alternating) = 70 total
// Linear progression with ability to navigate back to completed exercises.

export type ChapterId =
  | 'home'
  | 'night'
  | 'fire'
  | 'threshold'
  | 'shadow'
  | 'silence'
  | 'return'

export type FreeExerciseType = 'reflect' | 'gratitude' | 'goal' | 'letter'

export type ExerciseType = 'guided' | FreeExerciseType

export interface GuidedExercise {
  id: string
  type: 'guided'
  chapter: ChapterId
  indexInChapter: number // 0-9
  prompt: string
  followUps: string[]
  /** Optional sentence starters the user can tap to prefill the text area. */
  starters?: string[]
}

export interface FreeExercise {
  id: string
  type: FreeExerciseType
  chapter: ChapterId
  indexInChapter: number // 0-9
  /** Short scaffolding headline shown above the blank text area. */
  headline: string
  /** One-line instruction under the headline. */
  instruction: string
}

export type Exercise = GuidedExercise | FreeExercise

export interface Chapter {
  id: ChapterId
  order: number
  title: string // e.g. "HOME"
  theme: string // e.g. "Origins"
  affirmation: string
  /** Colour used for chapter theming — matches table colours in the interview. */
  colour: string
  /** Short Ivor story opening shown on session 1 and available as a refresher. */
  story: string
  /** Visual direction note for illustrations / background treatment. */
  visualNote: string
}

// ============================================================================
// CHAPTERS
// ============================================================================

export const chapters: Chapter[] = [
  {
    id: 'home',
    order: 1,
    title: 'HOME',
    theme: 'Origins',
    affirmation: 'I am rooted in a history of greatness.',
    colour: '#D4AF37',
    story:
      "Ivor Cummings was born in West Hartlepool in 1913 to a Sierra Leonean doctor and an English mother. He was raised in Croydon, taken in by the Coleridge-Taylor family after his mother's death. He grew up surrounded by a Black musical family in a white suburb — claimed by the people who could see him, even when the place he lived could not.",
    visualNote:
      'Soft, nostalgic glows, focusing on roots and early life. Warm gold and sepia tones.',
  },
  {
    id: 'night',
    order: 2,
    title: 'NIGHT',
    theme: 'Survival',
    affirmation: 'I find rhythm even in the wreckage.',
    colour: '#4A90D9',
    story:
      "In 1941, a German bomb fell through the roof of the Café de Paris. Ken 'Snakehips' Johnson, the Black British bandleader at the centre of wartime London's jazz world, was killed mid-performance. Ivor helped arrange the funeral. The world he had moved through — the clubs, the bandstands, the late nights — was gone overnight. And he kept moving.",
    visualNote:
      'High-contrast jazz clubs contrasted with dramatic rubble from the Café de Paris bombing. Deep blues and whites.',
  },
  {
    id: 'fire',
    order: 3,
    title: 'FIRE',
    theme: 'Awakening',
    affirmation: 'My voice is a catalyst for change.',
    colour: '#B35A44',
    story:
      "At Aggrey House in Bloomsbury, a hostel for African and Caribbean students, Ivor was drawn into Pan-African politics. Around him were the people who would go on to lead the independence movements of a continent. He learned to think politically in a rented room with pamphlets on the table and a map of Africa on the wall. The fight began there — not on a barricade, but in conversation.",
    visualNote:
      'Dynamic "hero" poses, Pan-African symbols, and energy crackles. Terracotta and flame reds.',
  },
  {
    id: 'threshold',
    order: 4,
    title: 'THRESHOLD',
    theme: 'Action',
    affirmation: 'I open doors for those who follow.',
    colour: '#FFD700',
    story:
      "On 22 June 1948, the Empire Windrush docked at Tilbury. Ivor Cummings, by then the first Black official in the Colonial Office, stood on the dock to welcome the arrivals. He was the one who had the job of housing them — finding rooms, arguing with landlords, fighting the colour bar from inside the system. Ten years later, the Colonial Office offered him a top job in Trinidad. He turned it down. He went to Ghana instead.",
    visualNote:
      'Epic scale (Windrush hull) and bureaucratic halls. Gold and navy.',
  },
  {
    id: 'shadow',
    order: 5,
    title: 'SHADOW',
    theme: 'Erasure',
    affirmation: 'My worth exists beyond what is recorded.',
    colour: '#666666',
    story:
      "The archive has almost nothing about who Ivor loved. He was gay in a country where that was criminalised until 1967 and stigmatised for decades after. Seven fragments survive in letters, in memoirs, in the margins of other people's lives. The rest — the relationships, the desire, the tenderness — went unrecorded. Not because it didn't exist, but because it couldn't.",
    visualNote:
      'Heavy chiaroscuro shadows, empty frames, and blurred faces. Greyscale with one thread of gold.',
  },
  {
    id: 'silence',
    order: 6,
    title: 'SILENCE',
    theme: 'Absence',
    affirmation: 'I honour the stories kept in the quiet.',
    colour: '#1a1a1a',
    story:
      "When Ivor died in 1992, he left a suitcase for Paul Danquah — a younger queer Black man, actor turned statesman, whom Ivor had mentored. Inside were papers. Correspondence. Perhaps reflections. Paul never received the case. Nobody opened it. Nobody knows what was in it. For thirty years after his death, Ivor's story went untold. Not through conspiracy. Through accumulation.",
    visualNote:
      'Muted tones and the symbolic unopened suitcase. Deep charcoal with faint amber.',
  },
  {
    id: 'return',
    order: 7,
    title: 'RETURN',
    theme: 'Legacy',
    affirmation: 'I am the bridge between ancestors and the future.',
    colour: '#FAFAF5',
    story:
      "Stephen Bourne, working through boxes at the National Archives, brought Ivor back. A BBC documentary was made and then forgotten. An entry in the Oxford Dictionary of National Biography. And now, eighty years after Tilbury, a community in Croydon is saying his name out loud. The silence did not win. But recovery has its limits — and what we do with the recovered story is the next question.",
    visualNote:
      '"Astral Plane" aesthetic, merging 1940s line-art with modern vibrant energy. Warm cream and electric gold.',
  },
]

// ============================================================================
// GUIDED EXERCISES
// 5 per chapter × 7 chapters = 35 total.
// Re-slotted from the original 58-prompt set, edited for theme coherence.
// ============================================================================

export const guidedExercises: GuidedExercise[] = [
  // ---- HOME (Origins) ----
  {
    id: 'home-g1',
    type: 'guided',
    chapter: 'home',
    indexInChapter: 0,
    prompt: 'What do you know about the place and people that shaped you before you could choose for yourself?',
    followUps: [
      'What would you want to ask them if you could?',
      'What have you kept from that time, and what have you let go?',
    ],
    starters: ['Before I could choose...', 'The place that made me...', 'The people who were there first were...'],
  },
  {
    id: 'home-g2',
    type: 'guided',
    chapter: 'home',
    indexInChapter: 2,
    prompt: 'Who claimed you? What parts of your heritage did you have to go looking for?',
    followUps: [
      'Which parts of your identity were given to you, and which did you have to find?',
      'How does it feel to be recognised by someone who understands where you come from?',
    ],
    starters: ['I was claimed by...', 'The part I had to go looking for...', 'The first person who saw me clearly was...'],
  },
  {
    id: 'home-g3',
    type: 'guided',
    chapter: 'home',
    indexInChapter: 4,
    prompt: 'Name one ancestor — biological or chosen — whose strength lives in you. What did they survive that made your life possible?',
    followUps: [
      'How do you carry them forward?',
      'What would you say to them if you could?',
    ],
    starters: ['An ancestor whose strength lives in me...', 'They survived...', 'I carry them forward by...'],
  },
  {
    id: 'home-g4',
    type: 'guided',
    chapter: 'home',
    indexInChapter: 6,
    prompt: 'What stories do you carry that others might not know about?',
    followUps: [
      'Who would you want to tell?',
      'What would change if the story were known?',
    ],
    starters: ['A story I carry...', 'I have not told...', 'If this story were known...'],
  },
  {
    id: 'home-g5',
    type: 'guided',
    chapter: 'home',
    indexInChapter: 8,
    prompt: 'What does it mean to inherit a story that was hidden from you?',
    followUps: [
      'What histories were you never told that shaped the world you live in?',
      'How does it feel to discover something that was always there but invisible?',
    ],
    starters: ['The story that was hidden from me...', 'What I was never told...', 'What I am only just finding out...'],
  },

  // ---- NIGHT (Survival) ----
  {
    id: 'night-g1',
    type: 'guided',
    chapter: 'night',
    indexInChapter: 0,
    prompt: 'What promised you something and then took it away? What held you when the institutions didn\'t?',
    followUps: [
      'Where have you experienced the gap between what was promised and what was delivered?',
      'Who or what has been your Café de Paris — the space that held you when the formal world shut its doors?',
    ],
    starters: ['Something that promised me...', 'When the institutions did not hold me...', 'What caught me instead was...'],
  },
  {
    id: 'night-g2',
    type: 'guided',
    chapter: 'night',
    indexInChapter: 2,
    prompt: 'How do you carry grief for the people and possibilities you have lost?',
    followUps: [
      'Is there a loss you haven\'t fully named?',
      'What would it look like to honour that loss without being consumed by it?',
    ],
    starters: ['A loss I am carrying...', 'The grief I have not yet named...', 'What honouring this might look like...'],
  },
  {
    id: 'night-g3',
    type: 'guided',
    chapter: 'night',
    indexInChapter: 4,
    prompt: 'When was the last time you let someone see you struggle? What happened when you did?',
    followUps: [
      'What are you afraid would happen if you did it more often?',
      'Who could you let see more of you this week?',
    ],
    starters: ['The last time I let someone see me struggle...', 'When I did...', 'What I am afraid of...'],
  },
  {
    id: 'night-g4',
    type: 'guided',
    chapter: 'night',
    indexInChapter: 6,
    prompt: 'What did you avoid today? What might be underneath that avoidance?',
    followUps: [
      'Is the avoidance protecting you or limiting you?',
      'What would taking one small step towards it look like tomorrow?',
    ],
    starters: ['I avoided...', 'Underneath the avoidance is...', 'One small step would be...'],
  },
  {
    id: 'night-g5',
    type: 'guided',
    chapter: 'night',
    indexInChapter: 8,
    prompt: 'If you are overwhelmed right now — press your feet into the floor. Feel the ground. What is one true thing?',
    followUps: [
      'You do not have to solve anything right now. What do you need in the next five minutes?',
      'Who could you reach out to? You do not have to do this alone.',
    ],
    starters: ['One true thing is...', 'What I need in the next five minutes is...', 'I could reach out to...'],
  },

  // ---- FIRE (Awakening) ----
  {
    id: 'fire-g1',
    type: 'guided',
    chapter: 'fire',
    indexInChapter: 0,
    prompt: 'Who taught you to think politically? Where did you learn to fight — not the fight itself, but who showed you how?',
    followUps: [
      'What spaces have shaped how you see the world?',
      'How has your understanding of resistance evolved over time?',
    ],
    starters: ['The person who taught me to think politically...', 'The space that shaped me was...', 'How my understanding has changed...'],
  },
  {
    id: 'fire-g2',
    type: 'guided',
    chapter: 'fire',
    indexInChapter: 2,
    prompt: 'What boundary do you need to set or reinforce today?',
    followUps: [
      'What makes this boundary hard to hold?',
      'What would it feel like if this boundary were respected?',
    ],
    starters: ['The boundary I need...', 'What makes it hard is...', 'If it were respected...'],
  },
  {
    id: 'fire-g3',
    type: 'guided',
    chapter: 'fire',
    indexInChapter: 4,
    prompt: 'Name something you are angry about right now. What is it telling you?',
    followUps: [
      'Where in your body do you hold this anger?',
      'What would healthy expression of this anger look like?',
    ],
    starters: ['What I am angry about...', 'It is telling me...', 'Healthy expression might be...'],
  },
  {
    id: 'fire-g4',
    type: 'guided',
    chapter: 'fire',
    indexInChapter: 6,
    prompt: 'What systems are you navigating right now that were not designed for you? How are you protecting yourself while moving through them?',
    followUps: [
      'What would it look like to refuse the terms without destroying yourself?',
      'Who else is inside these systems with you?',
    ],
    starters: ['A system not designed for me...', 'How I am protecting myself...', 'The people who are in it with me...'],
  },
  {
    id: 'fire-g5',
    type: 'guided',
    chapter: 'fire',
    indexInChapter: 8,
    prompt: 'Did you have to code-switch today? What did it cost you?',
    followUps: [
      'Which version of yourself did you perform? Which did you suppress?',
      'What spaces allow you to be whole without translation?',
    ],
    starters: ['Today I had to code-switch when...', 'It cost me...', 'The spaces where I do not have to translate...'],
  },

  // ---- THRESHOLD (Action) ----
  {
    id: 'threshold-g1',
    type: 'guided',
    chapter: 'threshold',
    indexInChapter: 0,
    prompt: 'What have you survived that you can now use to open a door for someone else?',
    followUps: [
      'When has someone stood at the threshold for you, welcoming you into a new chapter?',
      'Who needs you to stand at a threshold for them right now?',
    ],
    starters: ['What I have survived...', 'The person who stood at the threshold for me...', 'Who needs me now...'],
  },
  {
    id: 'threshold-g2',
    type: 'guided',
    chapter: 'threshold',
    indexInChapter: 2,
    prompt: 'What is one thing you need today that you find hard to ask for?',
    followUps: [
      'What stops you from asking?',
      'What would it mean to let someone help?',
    ],
    starters: ['What I need...', 'What stops me from asking...', 'Letting someone help would mean...'],
  },
  {
    id: 'threshold-g3',
    type: 'guided',
    chapter: 'threshold',
    indexInChapter: 4,
    prompt: 'What kind of community are you building, even if it is small? Who are the people you would call at 2am?',
    followUps: [
      'What can you offer your community today?',
      'What would make it stronger?',
    ],
    starters: ['The community I am building...', 'The people I would call at 2am...', 'What I can offer...'],
  },
  {
    id: 'threshold-g4',
    type: 'guided',
    chapter: 'threshold',
    indexInChapter: 6,
    prompt: 'What strength do you bring to today that you are not giving yourself credit for?',
    followUps: [
      'Where did this strength come from?',
      'How has it served you recently?',
    ],
    starters: ['A strength I am not crediting myself for...', 'It came from...', 'Recently it has...'],
  },
  {
    id: 'threshold-g5',
    type: 'guided',
    chapter: 'threshold',
    indexInChapter: 8,
    prompt: 'What is your intention for this week? Not your to-do list — your intention. How do you want to feel by the end of it?',
    followUps: [
      'What one decision this week could move you towards that feeling?',
      'What might get in the way, and how will you hold your ground?',
    ],
    starters: ['My intention for this week...', 'One decision that would move me there...', 'What might get in the way...'],
  },

  // ---- SHADOW (Erasure) ----
  {
    id: 'shadow-g1',
    type: 'guided',
    chapter: 'shadow',
    indexInChapter: 0,
    prompt: 'Is there any shame you are carrying about who you are — your Blackness, your queerness, your desires — that was given to you by someone else?',
    followUps: [
      'Whose voice do you hear when that shame speaks?',
      'What would it feel like to put that shame down, even for a moment?',
    ],
    starters: ['A shame I am carrying...', 'The voice I hear is...', 'Putting it down would feel like...'],
  },
  {
    id: 'shadow-g2',
    type: 'guided',
    chapter: 'shadow',
    indexInChapter: 2,
    prompt: 'What part of yourself did you hide today? What would it feel like to let it breathe?',
    followUps: [
      'Who are you when nobody is watching?',
      'What would your younger self think of who you are becoming?',
    ],
    starters: ['What I hid today...', 'Letting it breathe would feel like...', 'When nobody is watching...'],
  },
  {
    id: 'shadow-g3',
    type: 'guided',
    chapter: 'shadow',
    indexInChapter: 4,
    prompt: 'What does your desire look like when it is free from shame?',
    followUps: [
      'What would change if you trusted your desires as information rather than evidence against you?',
      'Where did you first learn that your desires needed to be hidden?',
    ],
    starters: ['My desire without shame looks like...', 'What would change...', 'I first learned to hide when...'],
  },
  {
    id: 'shadow-g4',
    type: 'guided',
    chapter: 'shadow',
    indexInChapter: 6,
    prompt: 'Where are you being hard on yourself right now? Can you hold it with tenderness instead of judgment?',
    followUps: [
      'What is the critical voice actually trying to protect you from?',
      'What would self-compassion look like in this specific situation?',
    ],
    starters: ['Where I am being hard on myself...', 'The critical voice is protecting me from...', 'Tenderness would look like...'],
  },
  {
    id: 'shadow-g5',
    type: 'guided',
    chapter: 'shadow',
    indexInChapter: 8,
    prompt: 'How much of your energy today went to scanning for danger — reading rooms, monitoring reactions, anticipating rejection?',
    followUps: [
      'What situations triggered the highest alertness?',
      'What would it feel like to lower the guard, even slightly, in one safe space?',
    ],
    starters: ['The scanning today was...', 'The situations that triggered it...', 'Lowering the guard would feel like...'],
  },

  // ---- SILENCE (Absence) ----
  {
    id: 'silence-g1',
    type: 'guided',
    chapter: 'silence',
    indexInChapter: 0,
    prompt: 'What silences have you lived inside — your own or others\'?',
    followUps: [
      'What was being held in that silence?',
      'What broke it, if anything has?',
    ],
    starters: ['A silence I have lived inside...', 'What it was holding...', 'What broke it...'],
  },
  {
    id: 'silence-g2',
    type: 'guided',
    chapter: 'silence',
    indexInChapter: 2,
    prompt: 'What can you let go of tonight that does not need to follow you into sleep? Write it here and leave it here.',
    followUps: [
      'What do you want to carry into tomorrow instead?',
      'What would it mean to trust that this will wait for you?',
    ],
    starters: ['What I am letting go of...', 'What I want to carry instead...', 'Trusting it will wait...'],
  },
  {
    id: 'silence-g3',
    type: 'guided',
    chapter: 'silence',
    indexInChapter: 4,
    prompt: 'What rest do you owe yourself that you have been putting off?',
    followUps: [
      'What is the story you tell yourself about why you cannot rest?',
      'What would an ancestor who fought for your leisure say about the way you work?',
    ],
    starters: ['Rest I owe myself...', 'The story I tell is...', 'An ancestor would say...'],
  },
  {
    id: 'silence-g4',
    type: 'guided',
    chapter: 'silence',
    indexInChapter: 6,
    prompt: 'What thought kept coming back today? Write it down. Now — is it a fact, a fear, or a habit?',
    followUps: [
      'If you told this thought to someone who loves you, what would they say?',
      'What alternative thought might be equally true?',
    ],
    starters: ['The thought that kept coming back...', 'It is a...', 'Someone who loves me would say...'],
  },
  {
    id: 'silence-g5',
    type: 'guided',
    chapter: 'silence',
    indexInChapter: 8,
    prompt: 'What would you say to the next person who walks the same path you have walked?',
    followUps: [
      'What do you know now that you wish someone had told you?',
      'What silence would you help them break?',
    ],
    starters: ['To the next person who walks this path...', 'I wish someone had told me...', 'The silence I would help them break...'],
  },

  // ---- RETURN (Legacy) ----
  {
    id: 'return-g1',
    type: 'guided',
    chapter: 'return',
    indexInChapter: 0,
    prompt: 'Whose stories have been lost? What happens when we find them again? What will you carry?',
    followUps: [
      'Whose story did you inherit from this course?',
      'Which piece of it changed what you carry?',
    ],
    starters: ['The story that was lost...', 'Finding it again means...', 'What I will carry is...'],
  },
  {
    id: 'return-g2',
    type: 'guided',
    chapter: 'return',
    indexInChapter: 2,
    prompt: 'What does thriving — not just surviving — look like for you?',
    followUps: [
      'What is one step you could take today towards that vision?',
      'Who in your life models what thriving looks like?',
    ],
    starters: ['Thriving for me looks like...', 'One step today...', 'Who models it for me...'],
  },
  {
    id: 'return-g3',
    type: 'guided',
    chapter: 'return',
    indexInChapter: 4,
    prompt: 'If joy were an act of resistance, what would yours look like this week?',
    followUps: [
      'What brings you joy that the world tells you shouldn\'t?',
      'How does your joy connect to your ancestors\' dreams for you?',
    ],
    starters: ['My joy as resistance...', 'What the world tells me I shouldn\'t enjoy...', 'My ancestors\' dreams...'],
  },
  {
    id: 'return-g4',
    type: 'guided',
    chapter: 'return',
    indexInChapter: 6,
    prompt: 'What would you say to the next person who picks up this compass?',
    followUps: [
      'What do you know now that you didn\'t at the start?',
      'How has this reflection changed what you carry?',
    ],
    starters: ['To the next person...', 'What I know now...', 'How it changed me...'],
  },
  {
    id: 'return-g5',
    type: 'guided',
    chapter: 'return',
    indexInChapter: 8,
    prompt: 'How does it feel to name something that was hidden? What power is there in reclaiming a story?',
    followUps: [
      'What will you do differently now that you have found it?',
      'What do you want the next generation to find?',
    ],
    starters: ['Naming what was hidden feels like...', 'What I will do differently...', 'What I want them to find...'],
  },
]

// ============================================================================
// FREE EXERCISES
// 5 per chapter × 7 chapters = 35 total.
// Types rotate: reflect, gratitude, goal, letter, reflect (for review session).
// All free exercises use the same blank-page template — the headline is the
// only scaffolding, everything else is the writer's.
// ============================================================================

function freeSet(chapter: ChapterId, theme: string): FreeExercise[] {
  const base = [
    {
      type: 'reflect' as const,
      indexInChapter: 1,
      headline: 'Reflection',
      instruction: `Take a few minutes to sit with the theme of ${theme.toLowerCase()}. Write whatever comes.`,
    },
    {
      type: 'gratitude' as const,
      indexInChapter: 3,
      headline: 'Gratitude',
      instruction: 'Name one thing you are grateful for — small, specific, and costed.',
    },
    {
      type: 'goal' as const,
      indexInChapter: 5,
      headline: 'Intention',
      instruction: 'One small action you could take this week. Write it down so you mean it.',
    },
    {
      type: 'letter' as const,
      indexInChapter: 7,
      headline: 'Letter',
      instruction: 'Write a letter — to a younger self, an ancestor, a future self, or Ivor. No one is going to read it except you.',
    },
    {
      type: 'reflect' as const,
      indexInChapter: 9,
      headline: 'Chapter review',
      instruction: `Look back across this chapter. What stayed with you? What do you want to carry into ${chapter === 'return' ? 'the rest of your life' : 'the next chapter'}?`,
    },
  ]
  return base.map((b) => ({
    id: `${chapter}-f${b.indexInChapter}`,
    type: b.type,
    chapter,
    indexInChapter: b.indexInChapter,
    headline: b.headline,
    instruction: b.instruction,
  }))
}

export const freeExercises: FreeExercise[] = [
  ...freeSet('home', 'Origins'),
  ...freeSet('night', 'Survival'),
  ...freeSet('fire', 'Awakening'),
  ...freeSet('threshold', 'Action'),
  ...freeSet('shadow', 'Erasure'),
  ...freeSet('silence', 'Absence'),
  ...freeSet('return', 'Legacy'),
]

// ============================================================================
// COMPLETE COURSE (flattened, in order)
// ============================================================================

export const courseExercises: Exercise[] = (() => {
  const all: Exercise[] = []
  for (const ch of chapters) {
    const inChapter = [
      ...guidedExercises.filter((e) => e.chapter === ch.id),
      ...freeExercises.filter((e) => e.chapter === ch.id),
    ]
    inChapter.sort((a, b) => a.indexInChapter - b.indexInChapter)
    all.push(...inChapter)
  }
  return all
})()

export const TOTAL_EXERCISES = courseExercises.length // 70
export const EXERCISES_PER_CHAPTER = 10

export function getChapter(id: ChapterId): Chapter | undefined {
  return chapters.find((c) => c.id === id)
}

export function getExercisesForChapter(id: ChapterId): Exercise[] {
  return courseExercises.filter((e) => e.chapter === id)
}

export function getGlobalIndex(exercise: Exercise): number {
  return courseExercises.findIndex((e) => e.id === exercise.id)
}
