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

export const COMPLETE_MESSAGE = `Interview complete. Now make your panel. On the A3 card on your table: draw the moment, write the caption, fill the speech bubble. This becomes one frame of a comic strip telling Ivor's story.`

export const LOCKED_MESSAGE = `You've used your 5 questions. How far have you got? What do you know about this man? What's missing? What couldn't the chatbot tell you? Discuss with your table.`

export const TABLE_CONFIGS: TableConfig[] = [
  { tableId: 1, direction: 'HOME',      compassPrompt: 'Where do you come from when no one place claims you?', colour: '#D4AF37' },
  { tableId: 2, direction: 'NIGHT',     compassPrompt: 'Where do you go to feel alive?',                       colour: '#4A90D9' },
  { tableId: 3, direction: 'FIRE',      compassPrompt: 'Where did you learn to fight?',                        colour: '#B35A44' },
  { tableId: 4, direction: 'THRESHOLD', compassPrompt: 'What does it look like to hold the door open?',        colour: '#FFD700' },
  { tableId: 5, direction: 'SHADOW',    compassPrompt: 'What do you carry that no record holds?',              colour: '#666666' },
  { tableId: 6, direction: 'SILENCE',   compassPrompt: 'What happens to a story no one tells for thirty years?', colour: '#1a1a1a' },
  { tableId: 7, direction: 'RETURN',    compassPrompt: 'How do you bring something back from the dead?',       colour: '#FFFFFF' },
]

export function getTableConfig(tableId: number): TableConfig | undefined {
  return TABLE_CONFIGS.find(t => t.tableId === tableId)
}
