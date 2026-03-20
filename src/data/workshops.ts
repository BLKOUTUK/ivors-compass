import type { Phase } from './journalPrompts'

export type StepType = 'text' | 'prompt' | 'breathing' | 'body-scan' | 'affirmation'
export type Difficulty = 'gentle' | 'moderate' | 'deep'

export interface WorkshopStep {
  type: StepType
  content: string
  duration?: string
}

export interface Workshop {
  id: string
  title: string
  description: string
  duration: string
  phase: Phase
  difficulty: Difficulty
  icon: string
  steps: WorkshopStep[]
}

export const PHASE_COLORS: Record<Phase, string> = {
  identity: '#802918',
  connection: '#A67C52',
  resistance: '#4A5568',
  joy: '#D97706',
}

export const PHASE_LABELS: Record<Phase, string> = {
  identity: 'Identity',
  connection: 'Connection',
  resistance: 'Resistance',
  joy: 'Joy',
}

export const DIFFICULTY_LABELS: Record<Difficulty, string> = {
  gentle: 'Gentle',
  moderate: 'Moderate',
  deep: 'Deep',
}

export const workshops: Workshop[] = [
  {
    id: 'anxiety-spirals',
    title: 'When Anxiety Spirals',
    description:
      'Grounding techniques to slow the spiral. Breathing, sensory anchoring, and gentle thought observation.',
    duration: '15 minutes',
    phase: 'resistance',
    difficulty: 'gentle',
    icon: '🌀',
    steps: [
      {
        type: 'text',
        content:
          'Anxiety is your nervous system doing its job — scanning for danger, preparing you to act. But when the alarm keeps ringing after the danger has passed, you need a way to tell your body: you are safe right now. This workshop will walk you through grounding techniques drawn from clinical practice. There is nothing to fix here. We are just coming back to the present.',
      },
      {
        type: 'breathing',
        content:
          'Let us start with your breath. Breathe in through your nose for 4 seconds. Hold gently for 7 seconds. Breathe out slowly through your mouth for 8 seconds. Repeat this cycle four times. If the hold feels too long, shorten it — what matters is that your exhale is longer than your inhale.',
        duration: '3 minutes',
      },
      {
        type: 'text',
        content:
          'Now we will use the 5-4-3-2-1 grounding technique. This anchors you in your senses and pulls attention away from spiralling thoughts. Name five things you can see. Four things you can touch right now. Three things you can hear. Two things you can smell. One thing you can taste. Take your time with each one. Really notice.',
        duration: '3 minutes',
      },
      {
        type: 'body-scan',
        content:
          'Bring your attention to your body. Start at the crown of your head and move slowly downward. Notice your forehead, your jaw, your shoulders, your chest, your stomach, your hands, your legs, your feet. Where is the anxiety sitting? You do not need to push it away. Just notice it, name the place, and breathe into it gently.',
        duration: '4 minutes',
      },
      {
        type: 'text',
        content:
          'Thought observation: imagine you are sitting by a river. Each thought that comes is a leaf floating past on the water. You do not need to pick any of them up. You do not need to follow them downstream. Just watch them arrive and let them go. If you catch yourself grabbing one, notice that too — and gently put it back on the water.',
        duration: '3 minutes',
      },
      {
        type: 'prompt',
        content:
          'What was the anxiety trying to protect you from? Now that you are calmer, what do you actually need right now?',
      },
      {
        type: 'affirmation',
        content:
          'I am safe in this moment. My body is learning to stand down. I do not have to solve everything right now.',
      },
    ],
  },
  {
    id: 'processing-anger',
    title: 'Processing Anger',
    description:
      'Anger is information, not pathology. Locate it in your body, understand its message, and channel it towards healthy boundaries.',
    duration: '20 minutes',
    phase: 'resistance',
    difficulty: 'moderate',
    icon: '🔥',
    steps: [
      {
        type: 'text',
        content:
          'Anger gets a bad reputation — especially for Black men, especially for queer people. We are taught that our anger is dangerous, disproportionate, threatening. But anger is information. It tells you where your values are being crossed, where your boundaries have been breached. This workshop is not about suppressing anger. It is about understanding it so you can use it wisely.',
      },
      {
        type: 'breathing',
        content:
          'Before we explore your anger, let us create some space. Breathe in for 4 seconds. Hold for 7. Out for 8. Do this three times. We are not trying to calm the anger away. We are creating enough room to look at it without being consumed by it.',
        duration: '2 minutes',
      },
      {
        type: 'body-scan',
        content:
          'Where does your anger live in your body? Scan slowly: jaw, throat, chest, fists, stomach, shoulders. For many men, anger gathers in the jaw and the fists. For others, it sits in the chest like a heavy stone. Find where yours is right now. Place your hand there if you can. Breathe into that place. Do not try to release it yet — just acknowledge it.',
        duration: '4 minutes',
      },
      {
        type: 'text',
        content:
          'Now ask the anger: what are you protecting? Anger often stands guard over hurt, fear, grief, or violated values. A microaggression at work might trigger anger, but underneath is the exhaustion of never being seen. A friend cancelling might trigger fury, but underneath is the fear of being unimportant. What is underneath your anger right now?',
        duration: '4 minutes',
      },
      {
        type: 'prompt',
        content:
          'Name something you are angry about right now. What is it telling you? What boundary needs to be set or reinforced?',
      },
      {
        type: 'text',
        content:
          'Healthy expression does not mean suppression. It means choosing how and when. Some options: write it out without filtering. Move your body — push-ups, a walk, dancing. Speak it aloud to someone you trust using "I feel" statements. Set the boundary directly: "This is not acceptable to me." The goal is not to eliminate anger but to stop it from being stored in your body unprocessed.',
        duration: '4 minutes',
      },
      {
        type: 'affirmation',
        content:
          'My anger is information. It is telling me where my values are being crossed. I honour it by listening, not by swallowing it.',
      },
    ],
  },
  {
    id: 'low-mood',
    title: 'Low Mood & Getting Unstuck',
    description:
      'When everything feels heavy and nothing feels worth starting. Behavioral activation, the smallest possible action, and gentle momentum.',
    duration: '15 minutes',
    phase: 'joy',
    difficulty: 'gentle',
    icon: '🌱',
    steps: [
      {
        type: 'text',
        content:
          'Low mood lies to you. It says: nothing will help, so why bother. It says: you do not have the energy. It says: tomorrow. The clinical truth is that action often comes before motivation, not after. You do not wait to feel better before you move — you move, and feeling better follows. This workshop uses behavioral activation, one of the most effective interventions for low mood. We start impossibly small.',
      },
      {
        type: 'breathing',
        content:
          'Take a long, slow breath in. Let it out with an audible sigh — really let the air fall out of you. Do this three times. Sighing activates your parasympathetic nervous system. You are not trying to be positive. You are just arriving.',
        duration: '2 minutes',
      },
      {
        type: 'text',
        content:
          'The smallest possible action: what is one thing you could do in the next ten minutes that might shift something, even slightly? Not the biggest or the best — the smallest. Open a curtain. Drink a glass of water. Step outside for sixty seconds. Send one message. The bar is on the ground, and that is exactly right. Low mood narrows your world. Any action that widens it, even a crack, is meaningful.',
        duration: '3 minutes',
      },
      {
        type: 'prompt',
        content:
          'If your energy is low today, what is the smallest possible thing you could do that might shift something? Can you do it in the next ten minutes?',
      },
      {
        type: 'text',
        content:
          'Gratitude practice — not toxic positivity, but honest noticing. Name three things you are genuinely grateful for right now. They can be ordinary: a working radiator, a message from someone, the fact that you are here doing this. Let yourself feel it in your body, not just think it. Gratitude is a muscle. Right now it might feel weak. That is fine.',
        duration: '3 minutes',
      },
      {
        type: 'prompt',
        content:
          'Describe what your life looks like when you are thriving, not just surviving. What does an ordinary good day contain? Hold that image for a moment.',
      },
      {
        type: 'affirmation',
        content:
          'I do not need to feel ready to begin. I just need to begin. The smallest step still counts.',
      },
    ],
  },
  {
    id: 'internalized-shame',
    title: 'Internalized Shame',
    description:
      'Exploring minority stress, externalizing shame that was placed on you, and reconnecting with self-compassion and ancestral strength.',
    duration: '20 minutes',
    phase: 'identity',
    difficulty: 'deep',
    icon: '🪞',
    steps: [
      {
        type: 'text',
        content:
          'Shame is not the same as guilt. Guilt says: I did something wrong. Shame says: I am something wrong. For Black queer men, shame is often not yours — it was placed on you by a world that pathologized your Blackness, your queerness, your desire. Minority stress theory (Meyer, 2003) shows that internalized stigma — absorbing society\'s negative attitudes about your identity — is one of the most damaging forms of psychological stress. This workshop is about noticing the shame and putting it back where it belongs: outside of you.',
      },
      {
        type: 'breathing',
        content:
          'This work requires gentleness. Breathe in for 4 counts. Hold for 4. Out for 6. Repeat four times. Place your hand on your heart if that feels comfortable. You are creating a container of safety before we look at difficult material.',
        duration: '3 minutes',
      },
      {
        type: 'text',
        content:
          'Think about a moment when you felt ashamed of who you are — your Blackness, your queerness, your desires, your body. Whose voice do you hear when that shame speaks? Is it a parent? A teacher? A stranger on the street? A community that should have held you? Notice: the shame has a source. It was transmitted. You were not born with it.',
        duration: '4 minutes',
      },
      {
        type: 'prompt',
        content:
          'Is there any shame you are carrying about who you are — your Blackness, your queerness, your desires — that was given to you by someone else? Whose voice do you hear when that shame speaks?',
      },
      {
        type: 'text',
        content:
          'Self-compassion practice (Kristin Neff): Say to yourself, silently or aloud: "This is a moment of suffering. Suffering is part of being human. Many people feel this way. May I be kind to myself." If that feels too formal, try: "This is hard. I am not alone in this. I deserve my own kindness right now." You are not trying to make the pain disappear. You are changing your relationship to it.',
        duration: '3 minutes',
      },
      {
        type: 'body-scan',
        content:
          'Where does shame live in your body? Many people feel it in the chest — a caving inward, a heaviness. Others feel it in the stomach, or as heat in the face. Find it. Breathe into it. Now imagine drawing on the strength of everyone who came before you who lived fully despite a world that told them not to. Ivor Cummings was a proudly gay Black man in an era when both were criminalized. That strength lives in you.',
        duration: '4 minutes',
      },
      {
        type: 'affirmation',
        content:
          'The shame I carry was given to me. I can put it down. My existence is not a contradiction. I am Black. I am queer. I am whole.',
      },
    ],
  },
  {
    id: 'loneliness-isolation',
    title: 'Loneliness & Isolation',
    description:
      'Common humanity, the ache of disconnection, chosen family, and small steps towards being seen.',
    duration: '15 minutes',
    phase: 'connection',
    difficulty: 'moderate',
    icon: '🤝',
    steps: [
      {
        type: 'text',
        content:
          'Loneliness is not the same as being alone. You can be alone and feel peaceful. You can be in a crowd and feel utterly unseen. For Black queer men, loneliness often has layers: the loneliness of code-switching, of not quite fitting in Black spaces or queer spaces, of performing a version of yourself that is legible to others but hollow to you. This workshop is about naming that loneliness and taking one small step towards genuine connection.',
      },
      {
        type: 'text',
        content:
          'Common humanity: right now, at this exact moment, thousands of Black queer men across the world are feeling some version of what you are feeling. Not the same circumstances, but the same ache. You are not uniquely broken. You are experiencing something deeply human that is intensified by minority stress. Knowing this does not fix the loneliness. But it changes its shape.',
        duration: '3 minutes',
      },
      {
        type: 'breathing',
        content:
          'Breathe in for 4 seconds. Hold for 7. Out for 8. As you breathe, imagine expanding the space around your heart — not to fill it with anything, but to make room for what might come.',
        duration: '2 minutes',
      },
      {
        type: 'prompt',
        content:
          'Who is someone you trust enough to be seen by — fully, without performance? If no one comes to mind, who comes closest? What would you want them to know that you have not said yet?',
      },
      {
        type: 'text',
        content:
          'Vulnerability practice: connection requires risk. Not dramatic vulnerability — just one degree more open than you were yesterday. This might mean: replying honestly when someone asks how you are. Reaching out to someone you have been meaning to contact. Admitting that you are struggling, even to yourself. Ivor Cummings built his world through connection — Aggrey House, the jazz clubs, the docks. Community is not given. It is built, one honest exchange at a time.',
        duration: '4 minutes',
      },
      {
        type: 'prompt',
        content:
          'What kind of community are you building, even if it is small? What is one step you could take this week towards being more connected?',
      },
      {
        type: 'affirmation',
        content:
          'I do not have to do this alone. Connection is not weakness. My people are out there, and I am allowed to reach for them.',
      },
    ],
  },
  {
    id: 'reclaiming-pleasure',
    title: 'Reclaiming Pleasure',
    description:
      'Embodied pleasure without shame, desire as something to trust, radical joy as political and spiritual practice.',
    duration: '15 minutes',
    phase: 'joy',
    difficulty: 'moderate',
    icon: '✨',
    steps: [
      {
        type: 'text',
        content:
          'Pleasure is political. For Black queer men, pleasure has been surveilled, pathologized, criminalized, and shamed. You may have learned to associate your desire with danger, your body with something to be controlled. This workshop is about reclaiming your right to feel good — not as indulgence but as restoration. Audre Lorde wrote that the erotic is a source of power and information. We are going to reconnect with that.',
      },
      {
        type: 'breathing',
        content:
          'Breathe in slowly for 4 counts, filling your chest and your belly. Hold for 2. Breathe out for 6, softening your jaw, your shoulders, your hands. Do this four times. Notice where your body begins to soften. That softening is your body remembering that it is allowed to feel good.',
        duration: '3 minutes',
      },
      {
        type: 'body-scan',
        content:
          'Scan your body slowly, but this time look for pleasure — not pain. Where does your body feel comfortable right now? The warmth of your hands. The texture of your clothes. The weight of your body supported by the chair or the bed. The temperature of the air. We spend so much time scanning for danger. Right now, scan for goodness.',
        duration: '3 minutes',
      },
      {
        type: 'prompt',
        content:
          'What brings you physical pleasure that has nothing to do with anyone else? A texture, a temperature, a movement, a taste. How often do you give yourself that pleasure without guilt?',
      },
      {
        type: 'text',
        content:
          'Desire without shame: what does your desire look like when it is free from judgment? Not desire filtered through what you think you should want, or what is acceptable, or what is safe to admit. Your actual desire. You do not have to act on it or share it. Just let yourself know what it is. Desire is information about what makes you feel alive.',
        duration: '3 minutes',
      },
      {
        type: 'prompt',
        content:
          'If joy were an act of resistance, what would yours look like today? What brings you joy that the world tells you it should not?',
      },
      {
        type: 'affirmation',
        content:
          'My joy is my protest. My pleasure is my birthright. I am allowed to feel good without apology.',
      },
    ],
  },
]
