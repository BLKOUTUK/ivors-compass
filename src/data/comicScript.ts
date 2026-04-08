/**
 * Life of Ivor — Graphic Novel Script
 *
 * 20 pages: 13 AI-generated, 7 participant slots, 1 photo slot.
 * Participant slots are filled in real-time during the launch event.
 */

export interface ComicBeat {
  page: number
  type: 'ai' | 'participant' | 'photo'
  tableId?: number
  direction?: string
  compassPrompt?: string
  scene: string
  caption: string
  dialogue?: string
  era: string
  colour: string
}

export const COMIC_SCRIPT: ComicBeat[] = [
  // Page 1: Cover
  {
    page: 1,
    type: 'ai',
    scene: 'A golden compass rose on aged paper, the title "The Life of Ivor" in serif lettering. London skyline faintly visible through the compass lines — Croydon clocktower, Thames, Tilbury cranes. Warm sepia tones.',
    caption: 'The Life of Ivor',
    dialogue: 'A community-generated graphic novel',
    era: '1913–present',
    colour: '#D4AF37',
  },

  // Page 2: Setup — Croydon 1913
  {
    page: 2,
    type: 'ai',
    scene: 'Edwardian Croydon street, 1913. A mixed-race boy stands between two worlds — a terraced English street on one side, a Sierra Leonean family photograph on the other. Golden afternoon light. The boy looks directly at the viewer.',
    caption: 'Ivor Gustavus Cummings was born in West Hartlepool in 1913, the son of a Sierra Leonean father and an English mother. The family settled in Addiscombe, Croydon.',
    era: '1913',
    colour: '#D4AF37',
  },

  // Page 3: TABLE 1 — HOME
  {
    page: 3,
    type: 'participant',
    tableId: 1,
    direction: 'HOME',
    compassPrompt: 'Where do you come from when no one place claims you?',
    scene: '',
    caption: '',
    era: '1910s–1920s',
    colour: '#D4AF37',
  },

  // Page 4: Whitgift, Sierra Leone, doors closing
  {
    page: 4,
    type: 'ai',
    scene: 'Split panel: Left — a school corridor at Whitgift, Croydon, a boy being pushed. Right — a young man on the deck of a ship bound for Freetown, looking at the horizon. Both halves connected by a single line of golden light.',
    caption: 'Bullied out of Whitgift School. Sent to Sierra Leone to join his father. Denied medical school for lack of funds. Rejected by the RAF — officers had to be "of pure European descent." Four doors closed before Ivor turned twenty-five.',
    era: '1920s–1930s',
    colour: '#B54A32',
  },

  // Page 5: Jessie Coleridge-Taylor claims him
  {
    page: 5,
    type: 'ai',
    scene: 'A warmly lit Croydon parlour. An elderly woman (Jessie Coleridge-Taylor) extends her hand to a young Ivor. On the wall behind her, a framed portrait of Samuel Coleridge-Taylor with a violin. Sheet music scattered on a piano. The gesture is one of recognition — she is claiming him.',
    caption: 'Jessie Coleridge-Taylor — widow of the celebrated Croydon-born composer — recognised something in young Ivor. Through Sierra Leonean kinship networks, he was a distant cousin. She introduced him to his cousins Avril and Hiawatha. He was claimed.',
    era: '1920s',
    colour: '#D4AF37',
  },

  // Page 6: TABLE 2 — NIGHT
  {
    page: 6,
    type: 'participant',
    tableId: 2,
    direction: 'NIGHT',
    compassPrompt: 'Where do you go to feel alive?',
    scene: '',
    caption: '',
    era: '1930s–1940s',
    colour: '#4A90D9',
  },

  // Page 7: Ken Johnson, Café de Paris, the bomb
  {
    page: 7,
    type: 'ai',
    scene: 'The Café de Paris, London, 1941. Ken "Snakehips" Johnson mid-performance, radiant, the band behind him. The room is alive — dancers, smoke, wartime glamour. In the audience, Ivor watches, cigarette holder in hand. A faint crack appears in the ceiling above.',
    caption: 'Ken Johnson was the most celebrated bandleader in London. His West Indian Dance Orchestra made the Café de Paris the most exciting room in wartime England. On 8 March 1941, a bomb fell down a ventilation shaft and killed Ken mid-performance. He was 26.',
    dialogue: 'Ivor arranged Ken\'s funeral.',
    era: '8 March 1941',
    colour: '#4A90D9',
  },

  // Page 8: TABLE 3 — FIRE
  {
    page: 8,
    type: 'participant',
    tableId: 3,
    direction: 'FIRE',
    compassPrompt: 'Where did you learn to fight?',
    scene: '',
    caption: '',
    era: '1930s–1940s',
    colour: '#B35A44',
  },

  // Page 9: Aggrey House, Pan-Africanism
  {
    page: 9,
    type: 'ai',
    scene: 'A Bloomsbury townhouse interior, late 1930s. Young men from across Africa and the Caribbean sit around a table covered in pamphlets and newspapers. Cecil Belfield-Clarke stands at the head. Ivor leans forward, listening intently. A map of Africa on the wall, with colonial borders in red ink.',
    caption: 'Aggrey House in Doughty Street — more than a hostel, a crucible. Students debated colonialism, imagined independence, forged the networks that would transform nations. Ivor met Cecil Belfield-Clarke here — a queer Black Bajan doctor and activist. A firm friendship formed around shared purpose.',
    era: '1930s',
    colour: '#B35A44',
  },

  // Page 10: Colonial Office, fighting the colour bar
  {
    page: 10,
    type: 'ai',
    scene: 'A wood-panelled Whitehall office. Ivor, immaculately dressed with his cigarette holder, sits across from uncomfortable white officials. He is calm, controlled, powerful in his stillness. On his desk: files marked "Colour Bar" and "Colonial Welfare." Through the window, wartime London.',
    caption: 'He entered the Colonial Office and mastered its language without ever becoming of it. Fastidious, elegant, addressing everyone as "dear boy" — performing adjacency to power while using that proximity to dismantle the colour bar from inside.',
    era: '1940s',
    colour: '#FFD700',
  },

  // Page 11: TABLE 4 — THRESHOLD
  {
    page: 11,
    type: 'participant',
    tableId: 4,
    direction: 'THRESHOLD',
    compassPrompt: 'What does it look like to hold the door open?',
    scene: '',
    caption: '',
    era: '1948',
    colour: '#FFD700',
  },

  // Page 12: Tilbury Docks, 22 June 1948
  {
    page: 12,
    type: 'ai',
    scene: 'Tilbury Docks, summer 1948. The HMT Empire Windrush towers in the background. Ivor stands on the quayside, arm extended in welcome, as passengers descend the gangway — families, young men in suits, women in hats, children looking around with wide eyes. The Thames glitters behind. Joy and uncertainty in equal measure.',
    caption: 'On 22 June 1948, Ivor stood on Tilbury Docks welcoming the Windrush generation. A Black gay man born in Hartlepool, raised in Croydon, welcoming a generation that would transform Britain.',
    dialogue: 'Let me welcome you... and express the hope that you will all achieve the objects which have brought you here.',
    era: '22 June 1948',
    colour: '#FFD700',
  },

  // Page 13: Ghana, Nkrumah, refusing Trinidad
  {
    page: 13,
    type: 'ai',
    scene: 'Two panels side by side. Left: a Colonial Office corridor, a senior official offering Ivor a folder marked "Trinidad — Senior Post." Right: Kwame Nkrumah at a podium in Accra, the new Ghanaian flag rising behind him. Ivor turns away from the corridor toward Ghana. The folder falls to the floor.',
    caption: 'The Colonial Office offered a career. Africa offered a purpose. When Nkrumah wanted him to help build Ghana\'s diplomatic infrastructure, Ivor refused Trinidad and chose liberation.',
    era: '1957',
    colour: '#666666',
  },

  // Page 14: TABLE 5 — SHADOW
  {
    page: 14,
    type: 'participant',
    tableId: 5,
    direction: 'SHADOW',
    compassPrompt: 'What do you carry that no record holds?',
    scene: '',
    caption: '',
    era: '1960s–1992',
    colour: '#666666',
  },

  // Page 15: Sierra Leone, Arnold, death in 1992
  {
    page: 15,
    type: 'ai',
    scene: 'Freetown, Sierra Leone. An older Ivor on a veranda, laughing with a younger man (Arnold). Tropical light, a ceiling fan turning slowly. Ivor still has the cigarette holder, still the quip and the laugh. He is surrounded by people — still at the centre of a network, still helping, still holding.',
    caption: 'In Freetown, Arnold got to know him as always ready with a quip and a laugh, still at the centre of a network of people drawn to him, helped by him, held by him. Ivor died in 1992.',
    era: '1970s–1992',
    colour: '#666666',
  },

  // Page 16: The suitcase
  {
    page: 16,
    type: 'ai',
    scene: 'A single suitcase on a bare table in a dim room. Light falls on it from a high window. The suitcase is closed, latched, waiting. Around it — nothing. The room is empty. The weight of the image is in what is NOT there.',
    caption: 'When Ivor died, he left a suitcase. Papers he wanted passed to Paul Danquah — a younger queer Black man he had mentored. Paul gave the eulogy at Ivor\'s funeral. He never received the case. It was never opened.',
    era: '1992',
    colour: '#1a1a1a',
  },

  // Page 17: TABLE 6 — SILENCE
  {
    page: 17,
    type: 'participant',
    tableId: 6,
    direction: 'SILENCE',
    compassPrompt: 'What happens to a story no one tells for thirty years?',
    scene: '',
    caption: '',
    era: '1992–2010s',
    colour: '#1a1a1a',
  },

  // Page 18: Stephen Bourne, the archive, recovery
  {
    page: 18,
    type: 'ai',
    scene: 'The National Archives at Kew. A historian (Stephen Bourne) bent over boxes of documents, photographs, Colonial Office records. As he reads, ghostly golden figures rise from the pages — Ivor at Aggrey House, Ivor at Tilbury, Ivor in Ghana. The archive is giving back what silence took.',
    caption: 'It was historian Stephen Bourne who recovered Ivor\'s story through painstaking research. His biography in the Oxford Dictionary of National Biography brought Ivor back into the light. Nicholas Boston named him "the forgotten gay mentor of the Windrush generation."',
    era: '2010s',
    colour: '#FFFFFF',
  },

  // Page 19: TABLE 7 — RETURN
  {
    page: 19,
    type: 'participant',
    tableId: 7,
    direction: 'RETURN',
    compassPrompt: 'How do you bring something back from the dead?',
    scene: '',
    caption: '',
    era: 'Now',
    colour: '#FFFFFF',
  },

  // Page 20: The workshop photograph
  {
    page: 20,
    type: 'photo',
    scene: 'A photograph from the launch event at Stanley Arts, 12 April 2026. The community, the room, the moment.',
    caption: 'Ivor\'s story continues. The meditations go deeper. The journal is yours.',
    era: '12 April 2026',
    colour: '#D4AF37',
  },
]

export const AI_PAGES = COMIC_SCRIPT.filter(b => b.type === 'ai')
export const PARTICIPANT_PAGES = COMIC_SCRIPT.filter(b => b.type === 'participant')
export const PHOTO_PAGES = COMIC_SCRIPT.filter(b => b.type === 'photo')
