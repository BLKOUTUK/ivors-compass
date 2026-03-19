export interface AffirmationCard {
  id: number
  text: string
  attribution?: string
  phase: 'identity' | 'connection' | 'resistance' | 'joy'
}

export const affirmations: AffirmationCard[] = [
  // Identity — Grounding, self-actualisation
  { id: 1, text: 'I am the living proof that my ancestors\' dreams were not in vain.', phase: 'identity' },
  { id: 2, text: 'My existence is not a contradiction. I am Black. I am queer. I am whole.', phase: 'identity' },
  { id: 3, text: 'I do not need permission to take up space. The space was always mine.', phase: 'identity' },
  { id: 4, text: 'I am learning to trust the wisdom my body has been holding for me.', phase: 'identity' },
  { id: 5, text: 'Today I choose to see myself through my own eyes, not theirs.', phase: 'identity' },
  { id: 6, text: 'I carry my heritage like a compass — it does not fix my direction, but it tells me where I stand.', phase: 'identity' },
  { id: 7, text: 'The parts of me I was taught to hide are the parts that make me extraordinary.', phase: 'identity' },

  // Connection — Community, vulnerability
  { id: 8, text: 'I am allowed to be seen. I am allowed to be known. I am allowed to be loved.', phase: 'connection' },
  { id: 9, text: 'My vulnerability is not weakness. It is the doorway through which connection enters.', phase: 'connection' },
  { id: 10, text: 'I do not have to earn belonging. I belong because I exist.', phase: 'connection' },
  { id: 11, text: 'The people who came before me built bridges so I wouldn\'t have to swim alone.', phase: 'connection' },
  { id: 12, text: 'When I reach out, I am not burdening anyone. I am giving them the gift of being needed.', phase: 'connection' },
  { id: 13, text: 'I am part of a lineage of care. Someone stood on a dock to welcome someone they\'d never met.', phase: 'connection' },
  { id: 14, text: 'Chosen family is not second best. It is the family that chose you back.', phase: 'connection' },
  { id: 15, text: 'I release the belief that I have to do this alone.', phase: 'connection' },

  // Resistance — Boundaries, strength
  { id: 16, text: 'My boundaries are not walls. They are the architecture of my self-respect.', phase: 'resistance' },
  { id: 17, text: 'I refuse to shrink so that others can feel comfortable with my presence.', phase: 'resistance' },
  { id: 18, text: 'Saying no is a complete sentence. I do not owe anyone my energy.', phase: 'resistance' },
  { id: 19, text: 'I can work within a system without letting the system work its way into me.', phase: 'resistance' },
  { id: 20, text: 'My anger is information. It is telling me where my values are being crossed.', phase: 'resistance' },
  { id: 21, text: 'I protect my peace not because I am fragile but because my peace is valuable.', phase: 'resistance' },
  { id: 22, text: 'I am allowed to rest. Exhaustion is not a prerequisite for worthiness.', phase: 'resistance' },
  { id: 23, text: 'Being invisible was never my choice. Being visible is.', phase: 'resistance' },

  // Joy — Celebration, pride
  { id: 24, text: 'I give myself permission to be happy without waiting for the other shoe to drop.', phase: 'joy' },
  { id: 25, text: 'My joy is an act of resistance in a world that would rather see me suffer.', phase: 'joy' },
  { id: 26, text: 'I celebrate myself today. Not for what I\'ve achieved, but for who I am.', phase: 'joy' },
  { id: 27, text: 'I am allowed to dance in the kitchen. To laugh too loud. To love without apology.', phase: 'joy' },
  { id: 28, text: 'My freedom is not a future event. It is something I practise every day.', phase: 'joy' },
  { id: 29, text: 'I am the ancestor my descendants will be grateful for.', phase: 'joy' },
  { id: 30, text: 'There are people who fought for the right to exist so that I could have the freedom to thrive.', phase: 'joy' },
  { id: 31, text: 'Today, I choose delight.', phase: 'joy' },
  { id: 32, text: 'I am not surviving. I am living. There is a difference, and I am learning it.', phase: 'joy' },
]

export const phaseColours = {
  identity: { bg: 'bg-terracotta', text: 'text-terracotta', border: 'border-terracotta', label: 'Identity' },
  connection: { bg: 'bg-amber-700', text: 'text-amber-600', border: 'border-amber-700', label: 'Connection' },
  resistance: { bg: 'bg-slate-600', text: 'text-slate-400', border: 'border-slate-600', label: 'Resistance' },
  joy: { bg: 'bg-gold-rich', text: 'text-gold', border: 'border-gold-rich', label: 'Joy' },
}
