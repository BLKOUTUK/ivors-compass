export interface AffirmationCard {
  id: number
  text: string
  attribution?: string
  phase: 'identity' | 'connection' | 'resistance' | 'joy'
}

export const affirmations: AffirmationCard[] = [
  // Identity — Grounding, self-actualisation (12 cards)
  { id: 1, text: 'I am the living proof that my ancestors\' dreams were not in vain.', phase: 'identity' },
  { id: 2, text: 'My existence is not a contradiction. I am Black. I am queer. I am whole.', phase: 'identity' },
  { id: 3, text: 'I do not need permission to take up space. The space was always mine.', phase: 'identity' },
  { id: 4, text: 'I am learning to trust the wisdom my body has been holding for me.', phase: 'identity' },
  { id: 5, text: 'Today I choose to see myself through my own eyes, not theirs.', phase: 'identity' },
  { id: 6, text: 'I carry my heritage like a compass — it does not fix my direction, but it tells me where I stand.', phase: 'identity' },
  { id: 7, text: 'The parts of me I was taught to hide are the parts that make me extraordinary.', phase: 'identity' },
  { id: 33, text: 'I am not who they said I was. I am who I have always known myself to be.', phase: 'identity' },
  { id: 34, text: 'My name, my skin, my desire — none of these are problems to be solved.', phase: 'identity' },
  { id: 35, text: 'I am still becoming. That is not a failure. That is the work of a life.', phase: 'identity' },
  { id: 36, text: 'I honour the version of me who survived long enough to arrive here.', phase: 'identity' },
  { id: 37, text: 'My body is not evidence. My body is home.', phase: 'identity' },

  // Connection — Community, vulnerability (12 cards)
  { id: 8, text: 'I am allowed to be seen. I am allowed to be known. I am allowed to be loved.', phase: 'connection' },
  { id: 9, text: 'My vulnerability is not weakness. It is the doorway through which connection enters.', phase: 'connection' },
  { id: 10, text: 'I do not have to earn belonging. I belong because I exist.', phase: 'connection' },
  { id: 11, text: 'The people who came before me built bridges so I wouldn\'t have to swim alone.', phase: 'connection' },
  { id: 12, text: 'When I reach out, I am not burdening anyone. I am giving them the gift of being needed.', phase: 'connection' },
  { id: 13, text: 'I am part of a lineage of care. Someone stood on a dock to welcome someone they\'d never met.', phase: 'connection' },
  { id: 14, text: 'Chosen family is not second best. It is the family that chose you back.', phase: 'connection' },
  { id: 15, text: 'I release the belief that I have to do this alone.', phase: 'connection' },
  { id: 38, text: 'The right people will not ask me to perform. They will ask me to stay.', phase: 'connection' },
  { id: 39, text: 'I am learning that trust is built in small moments, not grand gestures.', phase: 'connection' },
  { id: 40, text: 'Someone out there is waiting for exactly the friendship I have to offer.', phase: 'connection' },
  { id: 41, text: 'I do not need to be fixed. I need to be heard.', phase: 'connection' },

  // Resistance — Boundaries, strength (12 cards)
  { id: 16, text: 'My boundaries are not walls. They are the architecture of my self-respect.', phase: 'resistance' },
  { id: 17, text: 'I refuse to shrink so that others can feel comfortable with my presence.', phase: 'resistance' },
  { id: 18, text: 'Saying no is a complete sentence. I do not owe anyone my energy.', phase: 'resistance' },
  { id: 19, text: 'I can work within a system without letting the system work its way into me.', phase: 'resistance' },
  { id: 20, text: 'My anger is information. It is telling me where my values are being crossed.', phase: 'resistance' },
  { id: 21, text: 'I protect my peace not because I am fragile but because my peace is valuable.', phase: 'resistance' },
  { id: 22, text: 'I am allowed to rest. Exhaustion is not a prerequisite for worthiness.', phase: 'resistance' },
  { id: 23, text: 'Being invisible was never my choice. Being visible is.', phase: 'resistance' },
  { id: 42, text: 'I do not owe anyone a palatable version of my truth.', phase: 'resistance' },
  { id: 43, text: 'The world\'s discomfort with who I am is not my responsibility to manage.', phase: 'resistance' },
  { id: 44, text: 'I choose my battles. And I choose them well.', phase: 'resistance' },
  { id: 45, text: 'Rest is not retreat. It is how I sharpen myself for what matters.', phase: 'resistance' },

  // Joy — Celebration, pride (12 cards)
  { id: 24, text: 'I give myself permission to be happy without waiting for the other shoe to drop.', phase: 'joy' },
  { id: 25, text: 'My joy is an act of resistance in a world that would rather see me suffer.', phase: 'joy' },
  { id: 26, text: 'I celebrate myself today. Not for what I\'ve achieved, but for who I am.', phase: 'joy' },
  { id: 27, text: 'I am allowed to dance in the kitchen. To laugh too loud. To love without apology.', phase: 'joy' },
  { id: 28, text: 'My freedom is not a future event. It is something I practise every day.', phase: 'joy' },
  { id: 29, text: 'I am the ancestor my descendants will be grateful for.', phase: 'joy' },
  { id: 30, text: 'There are people who fought for the right to exist so that I could have the freedom to thrive.', phase: 'joy' },
  { id: 31, text: 'Today, I choose delight.', phase: 'joy' },
  { id: 32, text: 'I am not surviving. I am living. There is a difference, and I am learning it.', phase: 'joy' },
  { id: 46, text: 'My laughter is ancient. It carries the joy of everyone who was told they had no reason to smile.', phase: 'joy' },
  { id: 47, text: 'I deserve pleasure without a permission slip.', phase: 'joy' },
  { id: 48, text: 'The future I am building has room for softness in it.', phase: 'joy' },

  // Wild — Outside the phase system, tied to heritage intro and conclusion (4 cards)
  { id: 49, text: 'Some stories survive because someone refused to let them die. I am that someone now.', phase: 'identity' },
  { id: 50, text: 'I was not supposed to find this story. But here I am, and here it is, and now it belongs to both of us.', phase: 'connection' },
  { id: 51, text: 'Heritage is not behind glass. It is something I carry with me.', phase: 'joy' },
  { id: 52, text: 'The silence ends with me.', phase: 'resistance' },
]

export const phaseColours = {
  identity: { bg: 'bg-terracotta', text: 'text-terracotta', border: 'border-terracotta', label: 'Identity' },
  connection: { bg: 'bg-amber-700', text: 'text-amber-600', border: 'border-amber-700', label: 'Connection' },
  resistance: { bg: 'bg-slate-600', text: 'text-slate-400', border: 'border-slate-600', label: 'Resistance' },
  joy: { bg: 'bg-gold-rich', text: 'text-gold', border: 'border-gold-rich', label: 'Joy' },
}
