export type Phase = 'identity' | 'connection' | 'resistance' | 'joy'
export type PromptCategory = 'morning' | 'evening' | 'deep'
export type Archetype = 'elder' | 'brother' | 'gentle-giant'

export interface JournalPrompt {
  id: number
  text: string
  category: PromptCategory
  phase: Phase | null
  followUps: string[]
  intendedOutcome: string
  heritageChapter: number | null
  archetype: Archetype
}

export const phaseConfig: Record<Phase, { label: string; color: string; description: string }> = {
  identity: {
    label: 'Identity',
    color: '#802918',
    description: 'Grounding. Reclaiming self, celebrating Blackness and Queerness, ancestral pride.',
  },
  connection: {
    label: 'Connection',
    color: '#A67C52',
    description: 'Vulnerability. Chosen family, breaking generational silence, letting yourself be seen.',
  },
  resistance: {
    label: 'Resistance',
    color: '#4A5568',
    description: 'Strength. Boundaries, rest as resistance, decoupling worth from productivity.',
  },
  joy: {
    label: 'Joy',
    color: '#D97706',
    description: 'Celebration. Radical Black Queer Joy, pleasure, play, future-dreaming.',
  },
}

export const heritageChapters: Record<number, string> = {
  1: 'The Cafe de Paris',
  2: 'Finding Family',
  3: 'Education, Jazz, and Loss',
  4: 'Aggrey House',
  5: 'Tilbury Docks',
  6: 'Silence and Reclamation',
}

export const phaseAffirmations: Record<Phase, string> = {
  identity: 'My Blackness is my strength; my queerness is my light. I am a descendant of kings and creators who lived unapologetically.',
  connection: 'I am worthy of authentic connection. I release the need to mask my truth to be loved. My community sees me and holds me.',
  resistance: 'I do not have to work twice as hard to be worthy. My existence is enough. I choose peace in a world that demands my labor.',
  joy: 'My joy is my protest. I am entitled to pleasure and play. I celebrate the vibrant colours of my life today.',
}

export const journalPrompts: JournalPrompt[] = [
  // --- INTRO (Chapter 1 - Cafe de Paris) ---
  {
    id: 1,
    text: 'What does it mean to inherit a story that was hidden from you?',
    category: 'deep',
    phase: null,
    followUps: [
      'What histories were you never told that shaped the world you live in?',
      'How does it feel to discover something that was always there but invisible?',
    ],
    intendedOutcome: 'Opening awareness of inherited silence and the power of reclaimed narrative.',
    heritageChapter: 1,
    archetype: 'elder',
  },
  {
    id: 2,
    text: 'What stories do you carry that others might not know about?',
    category: 'evening',
    phase: null,
    followUps: [
      'Who would you want to tell?',
      'What would change if the story were known?',
    ],
    intendedOutcome: 'Recognising the weight of untold stories and the relief of naming them.',
    heritageChapter: 1,
    archetype: 'gentle-giant',
  },

  // --- IDENTITY (Grounding) — Chapter 2: Finding Family ---
  {
    id: 3,
    text: 'Who claimed you? What parts of your heritage did you have to go looking for?',
    category: 'deep',
    phase: 'identity',
    followUps: [
      'Which parts of your identity were given to you, and which did you have to find?',
      'How does it feel to be recognised by someone who understands where you come from?',
    ],
    intendedOutcome: 'Grounding in the work of self-discovery and the power of being claimed.',
    heritageChapter: 2,
    archetype: 'elder',
  },
  {
    id: 4,
    text: 'What do you know about the place and people that shaped you before you could choose for yourself?',
    category: 'morning',
    phase: 'identity',
    followUps: [
      'What would you want to ask them if you could?',
      'What have you kept from that time, and what have you let go?',
    ],
    intendedOutcome: 'Connecting with origins as a source of strength rather than limitation.',
    heritageChapter: 2,
    archetype: 'elder',
  },
  {
    id: 5,
    text: 'What part of yourself did you hide today? What would it feel like to let it breathe?',
    category: 'evening',
    phase: 'identity',
    followUps: [
      'Who are you when nobody is watching?',
      'What would your younger self think of who you are becoming?',
    ],
    intendedOutcome: 'Gentle excavation of the parts of self suppressed for survival.',
    heritageChapter: 2,
    archetype: 'gentle-giant',
  },
  {
    id: 6,
    text: 'Today I choose to see myself through my own eyes. What do I see?',
    category: 'morning',
    phase: 'identity',
    followUps: [
      'What is one thing about yourself that you are learning to love?',
      'How does your body feel when you claim who you are without apology?',
    ],
    intendedOutcome: 'Practising self-regard free from the gaze of others.',
    heritageChapter: 2,
    archetype: 'brother',
  },
  {
    id: 7,
    text: 'Where in your body do you feel your identity most strongly?',
    category: 'morning',
    phase: 'identity',
    followUps: [
      'Is that feeling comfortable or something you are still getting used to?',
      'What would it mean to honour that part of yourself today?',
    ],
    intendedOutcome: 'Body awareness as a path to self-knowledge and grounding.',
    heritageChapter: 2,
    archetype: 'gentle-giant',
  },
  {
    id: 8,
    text: 'What does freedom feel like in your body right now?',
    category: 'deep',
    phase: 'identity',
    followUps: [
      'When was the last time you felt truly free?',
      'What would you need to feel that way more often?',
    ],
    intendedOutcome: 'Embodied self-knowledge and reconnection with personal sovereignty.',
    heritageChapter: 2,
    archetype: 'elder',
  },
  {
    id: 9,
    text: 'Name one ancestor, biological or chosen, whose strength lives in you.',
    category: 'morning',
    phase: 'identity',
    followUps: [
      'What did they survive that made your life possible?',
      'How do you carry them forward?',
    ],
    intendedOutcome: 'Ancestral connection as a grounding practice.',
    heritageChapter: 2,
    archetype: 'elder',
  },

  // --- CONNECTION (Vulnerability) — Chapter 3: Education, Jazz, and Loss ---
  {
    id: 10,
    text: 'What promised you something and then took it away? What held you when the institutions didn\'t?',
    category: 'deep',
    phase: 'connection',
    followUps: [
      'Where have you experienced the gap between what was promised and what was delivered?',
      'Who or what has been your Cafe de Paris — the space that held you when the formal world shut its doors?',
    ],
    intendedOutcome: 'Naming institutional betrayal and the communities that catch us.',
    heritageChapter: 3,
    archetype: 'elder',
  },
  {
    id: 11,
    text: 'Who is someone you trust enough to be seen by — fully, without performance?',
    category: 'evening',
    phase: 'connection',
    followUps: [
      'What does it feel like to drop the mask with them?',
      'What would you want them to know that you haven\'t said yet?',
    ],
    intendedOutcome: 'Naming safe relationships and practising vulnerability.',
    heritageChapter: 3,
    archetype: 'brother',
  },
  {
    id: 12,
    text: 'What is one thing you need today that you find hard to ask for?',
    category: 'morning',
    phase: 'connection',
    followUps: [
      'What stops you from asking?',
      'What would it mean to let someone help?',
    ],
    intendedOutcome: 'Practising the muscle of asking, reducing isolation.',
    heritageChapter: 3,
    archetype: 'brother',
  },
  {
    id: 13,
    text: 'How do you carry grief for the people and possibilities you have lost?',
    category: 'deep',
    phase: 'connection',
    followUps: [
      'Is there a loss you haven\'t fully named?',
      'What would it look like to honour that loss without being consumed by it?',
    ],
    intendedOutcome: 'Creating space for grief as a form of connection to what mattered.',
    heritageChapter: 3,
    archetype: 'gentle-giant',
  },
  {
    id: 14,
    text: 'When was the last time you let someone see you struggle?',
    category: 'evening',
    phase: 'connection',
    followUps: [
      'What happened when you did?',
      'What are you afraid would happen if you did it more often?',
    ],
    intendedOutcome: 'Examining the relationship between vulnerability and strength.',
    heritageChapter: 3,
    archetype: 'brother',
  },
  {
    id: 15,
    text: 'What kind of community are you building, even if it is small?',
    category: 'morning',
    phase: 'connection',
    followUps: [
      'Who are the people you would call at 2am?',
      'What can you offer your community today?',
    ],
    intendedOutcome: 'Active community-building as a wellness practice.',
    heritageChapter: 3,
    archetype: 'brother',
  },
  {
    id: 16,
    text: 'What does chosen family mean to you? Who chose you back?',
    category: 'deep',
    phase: 'connection',
    followUps: [
      'How did that relationship begin?',
      'What makes it different from obligation?',
    ],
    intendedOutcome: 'Honouring chosen bonds as legitimate and sustaining.',
    heritageChapter: 3,
    archetype: 'gentle-giant',
  },

  // --- RESISTANCE (Strength) — Chapter 4: Aggrey House ---
  {
    id: 17,
    text: 'Who taught you to think politically? Where did you learn to fight — not the fight itself, but who showed you how?',
    category: 'deep',
    phase: 'resistance',
    followUps: [
      'What spaces have shaped how you see the world?',
      'How has your understanding of resistance evolved over time?',
    ],
    intendedOutcome: 'Tracing the lineage of your political consciousness.',
    heritageChapter: 4,
    archetype: 'elder',
  },
  {
    id: 18,
    text: 'Where did you spend your energy today that was not worth it? Where was it worth it?',
    category: 'evening',
    phase: 'resistance',
    followUps: [
      'What would you do differently tomorrow?',
      'How can you protect your energy for the things that matter?',
    ],
    intendedOutcome: 'Auditing energy expenditure as a form of self-governance.',
    heritageChapter: 4,
    archetype: 'brother',
  },
  {
    id: 19,
    text: 'What boundary do you need to set or reinforce today?',
    category: 'morning',
    phase: 'resistance',
    followUps: [
      'What makes this boundary hard to hold?',
      'What would it feel like if this boundary were respected?',
    ],
    intendedOutcome: 'Boundary-setting as daily practice, not crisis response.',
    heritageChapter: 4,
    archetype: 'brother',
  },
  {
    id: 20,
    text: 'What systems are you navigating right now that were not designed for you?',
    category: 'deep',
    phase: 'resistance',
    followUps: [
      'How are you protecting yourself while moving through them?',
      'What would it look like to refuse the terms without destroying yourself?',
    ],
    intendedOutcome: 'Strategic awareness of systemic navigation without self-erasure.',
    heritageChapter: 4,
    archetype: 'elder',
  },
  {
    id: 21,
    text: 'What rest do you owe yourself that you have been putting off?',
    category: 'evening',
    phase: 'resistance',
    followUps: [
      'What is the story you tell yourself about why you cannot rest?',
      'What would Ivor\'s generation say about the way you work?',
    ],
    intendedOutcome: 'Rest as resistance — decoupling worth from productivity.',
    heritageChapter: 4,
    archetype: 'gentle-giant',
  },
  {
    id: 22,
    text: 'Name something you are angry about right now. What is it telling you?',
    category: 'deep',
    phase: 'resistance',
    followUps: [
      'Where in your body do you hold this anger?',
      'What would healthy expression of this anger look like?',
    ],
    intendedOutcome: 'Anger as information, not pathology.',
    heritageChapter: 4,
    archetype: 'elder',
  },
  {
    id: 23,
    text: 'What are you doing today simply because you are expected to?',
    category: 'morning',
    phase: 'resistance',
    followUps: [
      'What would happen if you didn\'t?',
      'How much of your day is yours?',
    ],
    intendedOutcome: 'Recognising performative obligation and reclaiming agency.',
    heritageChapter: 4,
    archetype: 'brother',
  },

  // --- JOY (Celebration) — Chapter 5: Tilbury Docks ---
  {
    id: 24,
    text: 'What have you survived that you can now use to open a door for someone else?',
    category: 'deep',
    phase: 'joy',
    followUps: [
      'When has someone stood at the threshold for you, welcoming you into a new chapter?',
      'How do you celebrate what you have built, even when the world doesn\'t recognise it?',
    ],
    intendedOutcome: 'Transforming survival into generosity and legacy.',
    heritageChapter: 5,
    archetype: 'elder',
  },
  {
    id: 25,
    text: 'What made you laugh today? What brought you genuine pleasure?',
    category: 'evening',
    phase: 'joy',
    followUps: [
      'Do you give yourself permission to enjoy things without guilt?',
      'What would your ideal ordinary day look like?',
    ],
    intendedOutcome: 'Tracking joy as a wellness metric.',
    heritageChapter: 5,
    archetype: 'brother',
  },
  {
    id: 26,
    text: 'What are you looking forward to? Let yourself feel the anticipation.',
    category: 'morning',
    phase: 'joy',
    followUps: [
      'What is something you could plan today that would give future-you something to smile about?',
      'How does anticipation feel different from anxiety for you?',
    ],
    intendedOutcome: 'Future-oriented joy and the practice of positive anticipation.',
    heritageChapter: 5,
    archetype: 'brother',
  },
  {
    id: 27,
    text: 'If joy were an act of resistance, what would yours look like today?',
    category: 'morning',
    phase: 'joy',
    followUps: [
      'What brings you joy that the world tells you shouldn\'t?',
      'How does your joy connect to your ancestors\' dreams for you?',
    ],
    intendedOutcome: 'Radical joy as political and spiritual practice.',
    heritageChapter: 5,
    archetype: 'elder',
  },
  {
    id: 28,
    text: 'What is something about your life right now that your younger self would be proud of?',
    category: 'evening',
    phase: 'joy',
    followUps: [
      'What would you tell them about the road between then and now?',
      'What has surprised you most about who you have become?',
    ],
    intendedOutcome: 'Self-celebration and compassionate retrospection.',
    heritageChapter: 5,
    archetype: 'gentle-giant',
  },
  {
    id: 29,
    text: 'Describe a moment of beauty you noticed recently, no matter how small.',
    category: 'evening',
    phase: 'joy',
    followUps: [
      'What would it mean to notice more of these moments?',
      'How does beauty sustain you?',
    ],
    intendedOutcome: 'Cultivating attention to beauty as a grounding practice.',
    heritageChapter: 5,
    archetype: 'gentle-giant',
  },
  {
    id: 30,
    text: 'What does thriving, not just surviving, look like for you?',
    category: 'deep',
    phase: 'joy',
    followUps: [
      'What is one step you could take today towards that vision?',
      'Who in your life models what thriving looks like?',
    ],
    intendedOutcome: 'Moving from survival mode to an expansive vision of life.',
    heritageChapter: 5,
    archetype: 'elder',
  },

  // =========================================================================
  // THERAPEUTIC BACKBONE — Prompts grounded in clinical wellness frameworks
  // These work independently of the heritage content. The commissioned writers
  // add heritage context; these provide the self-care, mindfulness, and
  // psychotherapeutic foundation.
  // =========================================================================

  // --- MINDFULNESS & GROUNDING (MBSR / Kabat-Zinn) ---
  {
    id: 34,
    text: 'Pause. Take three slow breaths. What do you notice in your body right now — without trying to change it?',
    category: 'morning',
    phase: 'identity',
    followUps: [
      'Where is there tension? Where is there ease?',
      'What would your body ask of you today if it could speak?',
    ],
    intendedOutcome: 'Body scan awareness — MBSR foundation. Non-judgmental somatic check-in.',
    heritageChapter: null,
    archetype: 'gentle-giant',
  },
  {
    id: 35,
    text: 'Name five things you can see. Four you can touch. Three you can hear. Two you can smell. One you can taste.',
    category: 'morning',
    phase: 'resistance',
    followUps: [
      'How do you feel after grounding yourself in your senses?',
      'Which sense felt most anchoring?',
    ],
    intendedOutcome: '5-4-3-2-1 grounding technique — evidence-based anxiety and dissociation intervention.',
    heritageChapter: null,
    archetype: 'gentle-giant',
  },
  {
    id: 36,
    text: 'What is here, right now, in this exact moment? Not yesterday, not tomorrow. Just now.',
    category: 'morning',
    phase: 'identity',
    followUps: [
      'What happens when you let go of the next thing for just sixty seconds?',
      'What is your mind trying to pull you towards? Can you notice it without following?',
    ],
    intendedOutcome: 'Present-moment awareness — core MBSR practice. Reduces rumination and anticipatory anxiety.',
    heritageChapter: null,
    archetype: 'elder',
  },

  // --- SELF-COMPASSION (Kristin Neff) ---
  {
    id: 37,
    text: 'What would you say to a friend going through exactly what you are going through right now?',
    category: 'evening',
    phase: 'connection',
    followUps: [
      'Can you offer those same words to yourself?',
      'What makes it harder to be kind to yourself than to others?',
    ],
    intendedOutcome: 'Self-kindness component of self-compassion (Neff). Externalising to bypass self-criticism.',
    heritageChapter: null,
    archetype: 'gentle-giant',
  },
  {
    id: 38,
    text: 'What are you struggling with right now that you think you are the only one dealing with?',
    category: 'deep',
    phase: 'connection',
    followUps: [
      'How many other Black queer men might be feeling this same thing tonight?',
      'What would it mean to know you are not alone in this?',
    ],
    intendedOutcome: 'Common humanity — Neff self-compassion framework. Reduces isolation of suffering.',
    heritageChapter: null,
    archetype: 'brother',
  },
  {
    id: 39,
    text: 'Where are you being hard on yourself right now? Can you hold that with tenderness instead of judgment?',
    category: 'evening',
    phase: 'identity',
    followUps: [
      'What is the critical voice actually trying to protect you from?',
      'What would self-compassion look like in this specific situation?',
    ],
    intendedOutcome: 'Mindful self-compassion — observing self-criticism without being consumed by it.',
    heritageChapter: null,
    archetype: 'gentle-giant',
  },

  // --- GRATITUDE PRACTICE (Emmons / Positive Psychology) ---
  {
    id: 40,
    text: 'Name three things you are genuinely grateful for right now. Let yourself feel it, not just think it.',
    category: 'morning',
    phase: 'joy',
    followUps: [
      'How does gratitude feel in your body?',
      'Who contributed to these things? Have you told them?',
    ],
    intendedOutcome: 'Gratitude practice — Emmons research: 3 items daily improves wellbeing over 10 weeks.',
    heritageChapter: null,
    archetype: 'brother',
  },
  {
    id: 41,
    text: 'What is one small, ordinary thing that went well today?',
    category: 'evening',
    phase: 'joy',
    followUps: [
      'What role did you play in making it happen?',
      'What would it mean to notice more of these moments?',
    ],
    intendedOutcome: 'Savouring practice — extending positive emotion by attending to small goods.',
    heritageChapter: null,
    archetype: 'brother',
  },

  // --- MINORITY STRESS PROCESSING (Meyer / Hatzenbuehler) ---
  {
    id: 42,
    text: 'Did you have to code-switch today? What did it cost you?',
    category: 'evening',
    phase: 'resistance',
    followUps: [
      'Which version of yourself did you perform? Which did you suppress?',
      'What spaces allow you to be whole without translation?',
    ],
    intendedOutcome: 'Code-switching awareness — minority stress framework. Names the cognitive and emotional tax.',
    heritageChapter: null,
    archetype: 'brother',
  },
  {
    id: 43,
    text: 'Is there any shame you are carrying about who you are — your Blackness, your queerness, your desires — that was given to you by someone else?',
    category: 'deep',
    phase: 'identity',
    followUps: [
      'Whose voice do you hear when that shame speaks?',
      'What would it feel like to put that shame down, even for a moment?',
    ],
    intendedOutcome: 'Internalized stigma processing — proximal minority stress. Externalising shame as received, not inherent.',
    heritageChapter: null,
    archetype: 'elder',
  },
  {
    id: 44,
    text: 'How much of your energy today went to scanning for danger — reading rooms, monitoring reactions, anticipating rejection?',
    category: 'evening',
    phase: 'resistance',
    followUps: [
      'What situations triggered the highest alertness?',
      'What would it feel like to lower the guard, even slightly, in one safe space?',
    ],
    intendedOutcome: 'Hypervigilance awareness — chronic minority stress. Naming surveillance labour as real exhaustion.',
    heritageChapter: null,
    archetype: 'brother',
  },
  {
    id: 45,
    text: 'Did anything happen today that made you feel unseen, dismissed, or reduced? Name it plainly.',
    category: 'evening',
    phase: 'resistance',
    followUps: [
      'How did your body respond in the moment?',
      'What do you need right now to process that experience?',
    ],
    intendedOutcome: 'Microaggression processing — research shows naming reduces physiological stress response.',
    heritageChapter: null,
    archetype: 'gentle-giant',
  },

  // --- SOMATIC / NERVOUS SYSTEM REGULATION (Levine / Porges) ---
  {
    id: 46,
    text: 'Place your hand on your chest. Breathe into it slowly. What does your nervous system need right now — activation or calm?',
    category: 'morning',
    phase: 'identity',
    followUps: [
      'Are you in fight mode, freeze mode, or somewhere steady?',
      'What is one thing you could do in the next five minutes to move towards what you need?',
    ],
    intendedOutcome: 'Polyvagal awareness — Porges. Identifying autonomic state to choose appropriate regulation.',
    heritageChapter: null,
    archetype: 'gentle-giant',
  },
  {
    id: 47,
    text: 'Where in your body do you store the week? Jaw? Shoulders? Stomach? Chest? What would it take to soften there?',
    category: 'evening',
    phase: 'identity',
    followUps: [
      'What was your body holding that your mind hadn\'t named yet?',
      'Can you give yourself permission to release it, even partially?',
    ],
    intendedOutcome: 'Somatic tension release — body-based stress processing. Bridges cognitive and physical wellbeing.',
    heritageChapter: null,
    archetype: 'gentle-giant',
  },

  // --- BEHAVIORAL ACTIVATION (Martell / Jacobson) ---
  {
    id: 48,
    text: 'If your energy is low today, what is the smallest possible thing you could do that might shift something?',
    category: 'morning',
    phase: 'joy',
    followUps: [
      'Not the biggest or the best — the smallest. What is it?',
      'Can you do it in the next ten minutes?',
    ],
    intendedOutcome: 'Behavioral activation — evidence-based depression intervention. Small action breaks inertia cycles.',
    heritageChapter: null,
    archetype: 'brother',
  },
  {
    id: 49,
    text: 'What did you avoid today? What might be underneath that avoidance?',
    category: 'evening',
    phase: 'connection',
    followUps: [
      'Is the avoidance protecting you or limiting you?',
      'What would taking one small step towards it look like tomorrow?',
    ],
    intendedOutcome: 'Avoidance awareness — behavioral activation framework. Gentle confrontation without judgment.',
    heritageChapter: null,
    archetype: 'brother',
  },

  // --- SLEEP & EVENING WIND-DOWN ---
  {
    id: 50,
    text: 'What can you let go of tonight that does not need to follow you into sleep?',
    category: 'evening',
    phase: 'resistance',
    followUps: [
      'Write it here and leave it here.',
      'What do you want to carry into tomorrow instead?',
    ],
    intendedOutcome: 'Cognitive offloading — putting unfinished concerns on paper reduces sleep-onset latency.',
    heritageChapter: null,
    archetype: 'gentle-giant',
  },
  {
    id: 51,
    text: 'Rate your day from 1 to 10. Now — what made it that number, not one lower?',
    category: 'evening',
    phase: 'joy',
    followUps: [
      'What would have made it one point higher?',
      'What part of it was entirely in your control?',
    ],
    intendedOutcome: 'Solution-focused brief therapy technique — exception finding. Redirects attention to what worked.',
    heritageChapter: null,
    archetype: 'brother',
  },

  // --- EMBODIED PLEASURE & DESIRE (Queer-Affirming) ---
  {
    id: 52,
    text: 'What brings you physical pleasure that has nothing to do with anyone else? A texture, a temperature, a movement, a taste.',
    category: 'morning',
    phase: 'joy',
    followUps: [
      'How often do you give yourself that pleasure without guilt?',
      'What did you learn about pleasure — who taught you to enjoy things, and who taught you not to?',
    ],
    intendedOutcome: 'Embodied pleasure reconnection — queer-affirming somatic practice. Reclaiming the body as a site of joy.',
    heritageChapter: null,
    archetype: 'brother',
  },
  {
    id: 53,
    text: 'What does your desire look like when it is free from shame?',
    category: 'deep',
    phase: 'joy',
    followUps: [
      'What would change if you trusted your desires as information rather than evidence against you?',
      'Where did you first learn that your desires needed to be hidden?',
    ],
    intendedOutcome: 'Desire reclamation — critical for queer men. Disentangling desire from internalised pathologisation.',
    heritageChapter: null,
    archetype: 'elder',
  },

  // --- COGNITIVE PATTERN AWARENESS (CBT-informed) ---
  {
    id: 54,
    text: 'What thought kept coming back today? Write it down. Now — is it a fact, a fear, or a habit?',
    category: 'evening',
    phase: 'resistance',
    followUps: [
      'If you told this thought to someone who loves you, what would they say?',
      'What alternative thought might be equally true?',
    ],
    intendedOutcome: 'Cognitive distortion awareness — CBT foundation. Observing thoughts as mental events, not truths.',
    heritageChapter: null,
    archetype: 'elder',
  },
  {
    id: 55,
    text: 'What patterns are you noticing in your thoughts, emotions, or behaviours this week?',
    category: 'deep',
    phase: 'connection',
    followUps: [
      'Which patterns serve you and which hold you back?',
      'If you could shift one pattern this month, which would create the most positive change?',
    ],
    intendedOutcome: 'Meta-cognitive awareness — recognising patterns is the first step to changing them.',
    heritageChapter: null,
    archetype: 'elder',
  },

  // --- MORNING INTENTIONS (Positive Psychology) ---
  {
    id: 56,
    text: 'What is your intention for today? Not your to-do list — your intention. How do you want to feel tonight?',
    category: 'morning',
    phase: 'joy',
    followUps: [
      'What one decision today could move you towards that feeling?',
      'What might get in the way, and how will you hold your ground?',
    ],
    intendedOutcome: 'Intentional living — values-aligned daily planning. Shifts from reactive to chosen experience.',
    heritageChapter: null,
    archetype: 'brother',
  },
  {
    id: 57,
    text: 'What strength do you bring to today that you are not giving yourself credit for?',
    category: 'morning',
    phase: 'identity',
    followUps: [
      'Where did this strength come from?',
      'How has it served you recently?',
    ],
    intendedOutcome: 'Character strengths identification — VIA Strengths framework (Peterson & Seligman).',
    heritageChapter: null,
    archetype: 'elder',
  },

  // --- CRISIS / OVERWHELMING MOMENTS ---
  {
    id: 58,
    text: 'If you are overwhelmed right now: you are safe. You are here. Press your feet into the floor. Feel the ground. What is one true thing?',
    category: 'deep',
    phase: 'resistance',
    followUps: [
      'You do not have to solve anything right now. What do you need in the next five minutes?',
      'Who could you reach out to? You do not have to do this alone.',
    ],
    intendedOutcome: 'Crisis grounding — trauma-informed immediate stabilisation. Safety, orientation, one-step-at-a-time.',
    heritageChapter: null,
    archetype: 'gentle-giant',
  },

  // --- CONCLUSION (Chapter 6 - Silence and Reclamation) ---
  {
    id: 31,
    text: 'Whose stories have been lost? What happens when we find them again? What will you carry?',
    category: 'deep',
    phase: null,
    followUps: [
      'What silences have you lived inside — your own or others\'?',
      'What story will you make sure isn\'t lost?',
    ],
    intendedOutcome: 'Commitment to carrying forward what has been reclaimed.',
    heritageChapter: 6,
    archetype: 'elder',
  },
  {
    id: 32,
    text: 'What would you say to the next person who picks up this compass?',
    category: 'evening',
    phase: null,
    followUps: [
      'What do you know now that you wish someone had told you?',
      'How has this reflection changed what you carry?',
    ],
    intendedOutcome: 'Closing the circle — from recipient to contributor.',
    heritageChapter: 6,
    archetype: 'gentle-giant',
  },
  {
    id: 33,
    text: 'How does it feel to name something that was hidden?',
    category: 'deep',
    phase: null,
    followUps: [
      'What power is there in reclaiming a story?',
      'What will you do differently now that you have found it?',
    ],
    intendedOutcome: 'The transformative act of naming and reclaiming.',
    heritageChapter: 6,
    archetype: 'elder',
  },
]
