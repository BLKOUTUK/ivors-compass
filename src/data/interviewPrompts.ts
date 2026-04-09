/**
 * Ivor's Compass — Interview Challenge (Client Config)
 *
 * Table directions, compass prompts, and UI constants.
 * System prompts live server-side in ivor-core.
 */

export interface TableConfig {
  tableId: number
  direction: string
  compassPrompt: string
  colour: string
}

export const UNLOCK_CODE = 'COMPASS26'

export const ROUND1_INTRO = `A research assistant has fed everything they could find about a man called Ivor Cummings into this chatbot. You have 5 questions. Choose carefully.`

export const ROUND2_REFRAME = `3 more questions. This time — ask about what's missing. What did the chatbot dodge? What's in the silence?`

export const COMPLETE_MESSAGE = `Interview complete. Now make your panel. On the A3 card on your table: draw the moment, write the caption, fill the speech bubble. This becomes your page in a graphic novel of Ivor's life.\n\nFor your scene description: don't name Ivor directly. Instead, describe the atmosphere — the room, the objects, the lighting, the feeling. A figure defined by shadows and a cigarette holder. A dock at dawn. A suitcase in an empty room. The AI builds the world from your words.`

export const LOCKED_MESSAGE = `You've used your 5 questions. How far have you got? What do you know about this man? What's missing? What couldn't the chatbot tell you? Discuss with your table.`

export const TABLE_CONFIGS: TableConfig[] = [
  { tableId: 1, direction: 'HOME',      compassPrompt: 'Find out where Ivor came from — his family, his childhood, and who claimed him.', colour: '#D4AF37' },
  { tableId: 2, direction: 'NIGHT',     compassPrompt: 'Find out about Ivor\u2019s social life — the jazz clubs, the friendships, and what happened at the Caf\u00e9 de Paris.', colour: '#4A90D9' },
  { tableId: 3, direction: 'FIRE',      compassPrompt: 'Find out how Ivor became political — the people he met, the movements he joined, and how he learned to fight.', colour: '#B35A44' },
  { tableId: 4, direction: 'THRESHOLD', compassPrompt: 'Find out what Ivor did at the Colonial Office and at Tilbury Docks — and who he helped.', colour: '#FFD700' },
  { tableId: 5, direction: 'SHADOW',    compassPrompt: 'Find out what the chatbot won\u2019t tell you. Ask about Ivor\u2019s personal life, his relationships, who he loved.', colour: '#666666' },
  { tableId: 6, direction: 'SILENCE',   compassPrompt: 'Find out what happened after Ivor died — the suitcase, the silence, and why his story disappeared.', colour: '#1a1a1a' },
  { tableId: 7, direction: 'RETURN',    compassPrompt: 'Find out how Ivor\u2019s story was recovered — who found it, where, and why it took thirty years.', colour: '#FFFFFF' },
]

export function getTableConfig(tableId: number): TableConfig | undefined {
  return TABLE_CONFIGS.find(t => t.tableId === tableId)
}
