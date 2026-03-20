export interface Meditation {
  id: number
  title: string
  phase: string | null
  phaseEnergy: string | null
  era: string
  historicalContext: string[]
  meditationText: string
  journalPrompt: string
  followUpQuestions: string[]
  imageAlt: string
}

export const meditations: Meditation[] = [
  {
    id: 1,
    title: 'The Café de Paris',
    phase: null,
    phaseEnergy: null,
    era: '8 March 1941',
    historicalContext: [
      'Café de Paris, 8 March 1941. Ken "Snakehips" Johnson leads the West Indian Dance Orchestra — the most popular band in wartime London. His friend Ivor Cummings is in the audience. By day, Ivor is the first Black official in the Colonial Office. By night, he moves through a world of jazz, community, and desire.',
      'Ken Johnson was born in British Guiana in 1914 and came to England as a boy. By his mid-twenties, he was the most celebrated bandleader in London — his West Indian Dance Orchestra made the Café de Paris the most exciting room in wartime England. Ivor and Ken were part of the same world: young, Black, brilliant, navigating a city that admired their talent but policed their presence.',
      'That night, a bomb fell down a ventilation shaft and killed Ken mid-performance. He was 26. Seven years later, Ivor would stand on Tilbury Docks welcoming the Windrush generation. But his story — too queer for Windrush history, too Black for LGBTQ+ history — would be lost for thirty years.',
    ],
    meditationText: 'This meditation will be written by one of our commissioned writers, framing who Ivor was, why his story was lost, and what this journal asks of the reader.',
    journalPrompt: 'What does it mean to inherit a story that was hidden from you?',
    followUpQuestions: [
      'What histories were you never told that shaped the world you live in?',
      'How does it feel to discover something that was always there but invisible?',
      'What stories do you carry that others might not know about?',
    ],
    imageAlt: 'Interior of the Café de Paris, 1941, warm light, a bandleader mid-performance, the energy of wartime London',
  },
  {
    id: 2,
    title: 'Finding Family',
    phase: 'Identity',
    phaseEnergy: 'Grounding',
    era: '1913–1930s',
    historicalContext: [
      'Ivor Gustavus Cummings was born in West Hartlepool in 1913, the son of a Sierra Leonean father and an English mother. The family settled in Addiscombe, Croydon, where Ivor attended Whitgift School. It was here that his life became entangled with one of the most remarkable families in Black British history.',
      'Jessie Walmisley Coleridge-Taylor — the widow of the celebrated Croydon-born composer Samuel Coleridge-Taylor — reached out to the Cummings family. She recognised in the young Ivor something of the determination that had marked her late husband\'s life. Through Sierra Leonean kinship networks, Ivor was a distant cousin of the composer. Jessie introduced him to his cousins Avril and Hiawatha Coleridge-Taylor. He was claimed.',
      'Later, Ivor would travel to Sierra Leone to reconnect with his father\'s homeland — his African heritage. Identity, for Ivor, was something you had to go and find, not something handed to you. Three generations of Black British cultural life, rooted in Croydon: the composer, his widow, and the young man she drew into the family.',
    ],
    meditationText: 'This meditation will be written by one of our commissioned writers, responding to the themes of origins, belonging, and identity as something you go looking for.',
    journalPrompt: 'Who claimed you? What parts of your heritage did you have to go looking for?',
    followUpQuestions: [
      'What do you know about the place and people that shaped you before you could choose for yourself?',
      'Which parts of your identity were given to you, and which did you have to find?',
      'How does it feel to be recognised — truly seen — by someone who understands where you come from?',
    ],
    imageAlt: 'Addiscombe, Croydon, 1920s — a young man between two worlds, the streets of South London and the heritage of West Africa',
  },
  {
    id: 3,
    title: 'Education, Jazz, and Loss',
    phase: 'Vulnerability',
    phaseEnergy: 'Connection',
    era: '1920s–1941',
    historicalContext: [
      'Education was a site of both aspiration and violence. At Whitgift School in Croydon, Ivor faced racial harassment — ultimately attacked. He moved to Dulwich College, bigger and more intimidating. He wanted to attend medical school but was blocked by fees and discrimination. The institutions that promised him a future withheld it.',
      'What held him when the institutions didn\'t was the jazz world — the social life of Black cultural London. Ken "Snakehips" Johnson, the Café de Paris, the clubs and salons where Black men could be brilliant and visible and desired. This was community as survival — the warmth that kept you going when the formal world shut its doors.',
      'On 8 March 1941, a bomb fell down a ventilation shaft at the Café de Paris and killed Ken mid-performance. He was 26. Ivor was still only 29 — he arranged Ken\'s funeral and memorial. The vulnerability of desire, friendship, and loss.',
    ],
    meditationText: 'This meditation will be written by one of our commissioned writers, responding to the themes of what institutions promise and withhold, what holds you when they don\'t, and what you lose.',
    journalPrompt: 'What promised you something and then took it away? What held you when the institutions didn\'t?',
    followUpQuestions: [
      'Where have you experienced the gap between what was promised and what was delivered?',
      'Who or what has been your Café de Paris — the space that held you when the formal world shut its doors?',
      'How do you carry grief for the people and possibilities you\'ve lost?',
    ],
    imageAlt: 'A school corridor dissolving into a jazz club, the tension between institutional coldness and communal warmth',
  },
  {
    id: 4,
    title: 'Aggrey House',
    phase: 'Resistance',
    phaseEnergy: 'Strength',
    era: '1930s–1940s',
    historicalContext: [
      'Ivor\'s first job was at Aggrey House — the colonial students\' hostel in Doughty Street, Bloomsbury. It was more than accommodation. It was a crucible of ideas, friendships, and political awakening. Students from across Africa and the Caribbean debated colonialism, imagined independence, and forged the networks that would later transform nations.',
      'Ivor was politicised here. He worked with Cecil Bellfield-Clarke. He built intellectual alliances with "the group" — Pan-Africanists organising in London. This was the political education that transformed a young man blocked from medical school into someone who could navigate the Colonial Office.',
      'Resistance as formation, not protest. The skills Ivor developed here — of connection, quiet leadership, and strategic thinking — would define his life\'s work. The mentors who taught him how to think politically gave him tools he would use for the next fifty years.',
    ],
    meditationText: 'This meditation will be written by one of our commissioned writers, responding to the themes of political education, community formation, and resistance as something you learn from the people around you.',
    journalPrompt: 'Who taught you to think politically? Where did you learn to fight — not the fight itself, but the people who showed you how?',
    followUpQuestions: [
      'What spaces have shaped how you see the world?',
      'Who are the mentors — formal or informal — who changed how you think?',
      'How has your understanding of resistance evolved over time?',
    ],
    imageAlt: 'Interior of a 1930s London gathering space, warm lamplight, animated conversation, books and pamphlets on tables',
  },
  {
    id: 5,
    title: 'Tilbury Docks',
    phase: 'Joy',
    phaseEnergy: 'Celebration',
    era: '1948',
    historicalContext: [
      'Ivor joined the Colonial Office — becoming its first Black official. He became the unofficial envoy to Black communities in Britain. He recruited for the NHS. He fought for recognition — receiving his OBE in June 1948, won in Lagos.',
      'And then, that same year, he stood on Tilbury Docks welcoming the Windrush generation. On 22 June 1948, the HMT Empire Windrush docked carrying 492 passengers from Jamaica and other Caribbean islands. Ivor was one of the first people they saw when they stepped onto English soil. He had worked to ensure proper reception — assistance with accommodation, employment, and the bewildering bureaucracy of a new country.',
      'Everything he built, everything he survived, turned into opening the door for others. The image of Tilbury Docks has become iconic in British history. But Ivor\'s presence there — a Black gay man born in Hartlepool, raised in Croydon, welcoming a generation that would transform Britain — has been largely written out of the story.',
    ],
    meditationText: 'This meditation will be written by one of our commissioned writers, responding to the themes of paying it forward, using what you\'ve survived to open doors for others, and the joy of welcome.',
    journalPrompt: 'What have you survived that you can now use to open a door for someone else?',
    followUpQuestions: [
      'When has someone stood at the threshold for you — welcoming you into a new chapter?',
      'What does it feel like to turn your own struggle into someone else\'s support?',
      'How do you celebrate what you\'ve built, even when the world doesn\'t recognise it?',
    ],
    imageAlt: 'Tilbury Docks 1948, figures descending a gangway, a welcoming hand extended, rendered in documentary poetic style',
  },
  {
    id: 6,
    title: 'Silence and Reclamation',
    phase: null,
    phaseEnergy: null,
    era: '1992–present',
    historicalContext: [
      'Ivor Cummings was a proudly gay man across every chapter of his life — desire navigated in Aggrey House, the jazz clubs, the Colonial Office, the docks. In an era when homosexuality was criminalised, he lived with openness and dignity. For a Black gay man, the invisibility was doubled: too queer for the emerging Windrush narrative, too Black for the emerging gay rights movement.',
      'After his death in 1992, his story disappeared for over thirty years. It was historian Stephen Bourne who recovered it through painstaking research in the National Archives. Bourne\'s work — including the biography in the Oxford Dictionary of National Biography (2012) and his book Mother Country (2010) — brought Ivor back into the light. Sociologist Nicholas Boston dubbed him "the gay father of the Windrush generation."',
      'Ivor\'s Compass exists because stories like his matter. Because heritage isn\'t something behind glass in a museum — it\'s something you carry with you. Because a Black gay man who stood on Tilbury Docks in 1948 has something to say to a Black queer man in Croydon in 2026.',
    ],
    meditationText: 'This meditation will be written by one of our commissioned writers, responding to the themes of silence, erasure, reclamation, and what we carry forward.',
    journalPrompt: 'Whose stories have been lost? What happens when we find them again? What will you carry?',
    followUpQuestions: [
      'What silences have you lived inside — your own or others\'?',
      'How does it feel to name something that was hidden?',
      'What story will you make sure isn\'t lost?',
    ],
    imageAlt: 'Abstract composition of archival documents, photographs, and golden light emerging from shadows',
  },
]
