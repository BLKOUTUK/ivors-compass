export interface Meditation {
  id: number
  title: string
  era: string
  historicalContext: string[]
  meditationText: string
  journalPrompt: string
  imageAlt: string
}

export const meditations: Meditation[] = [
  {
    id: 1,
    title: 'Hartlepool Origins',
    era: '1913–1930s',
    historicalContext: [
      'Ivor Gustavus Cummings was born in West Hartlepool in 1913, the son of a Sierra Leonean father and an English mother. His was a childhood lived between worlds — the industrial northeast of England and the distant heritage of West Africa. Through Sierra Leonean kinship networks, Ivor was a distant cousin of Samuel Coleridge-Taylor, the celebrated Croydon-born composer whose music had captivated Victorian and Edwardian audiences.',
      'The family settled in Addiscombe, Croydon, where Ivor attended Whitgift School. It was here that Jessie Walmisley Coleridge-Taylor — the composer\'s widow — befriended the young Ivor, recognising in him perhaps something of the determination and grace that had marked her late husband\'s life. This connection to Croydon\'s own musical heritage would thread through Ivor\'s entire life.',
      'Growing up mixed-race in interwar Britain meant navigating a world that had no ready-made place for you. Ivor learned early the art of moving between communities, of building bridges where none existed, of making himself understood on his own terms.',
    ],
    meditationText: 'This meditation will be written by one of our commissioned writers, responding to the themes of origins, belonging, and growing up between worlds.',
    journalPrompt: 'Where are the places and people that shaped who you are? What did you learn about yourself from growing up between different worlds?',
    imageAlt: 'Abstract interpretation of Hartlepool docks and Croydon streets merging, in the style of a Black British queer artist',
  },
  {
    id: 2,
    title: 'Aggrey House',
    era: '1930s',
    historicalContext: [
      'In the 1930s, London was home to a growing community of Black students, intellectuals, and activists from across Africa and the Caribbean. At the heart of this community was Aggrey House in Doughty Street, Bloomsbury — a hostel and social centre for colonial students. It was here that Ivor Cummings found his people.',
      'Aggrey House was more than accommodation. It was a crucible of ideas, friendships, and political awakening. Students debated colonialism, imagined independence, and forged the networks that would later transform nations. Ivor moved through these circles with ease, building relationships that crossed boundaries of nationality, class, and background.',
      'This was community-building as a radical act — creating spaces of belonging in a city that offered none. The skills Ivor developed here, of connection and quiet leadership, would define his life\'s work.',
    ],
    meditationText: 'This meditation will be written by one of our commissioned writers, responding to the themes of community, chosen family, and finding your people.',
    journalPrompt: 'When have you found or created a space of belonging? What does it feel like to be truly among your people?',
    imageAlt: 'Interior of a 1930s London gathering space, warm lamplight, animated conversation, painted in expressive style',
  },
  {
    id: 3,
    title: 'The Colonial Office',
    era: '1940s',
    historicalContext: [
      'Ivor Cummings became the first Black official in the Colonial Office — the very institution that administered the British Empire. This was not a position of protest from the outside but of navigation from within. Working inside the machinery of empire, Ivor used his position to advocate for the welfare of colonial students and workers in Britain.',
      'The contradictions were immense. Here was a Black man, the son of a Sierra Leonean, working within the institution that governed Sierra Leone. Yet Ivor understood that power exercised from within, however compromised, could shift outcomes for real people. He became a bridge between the colonial administration and the communities it governed.',
      'His quiet diplomacy and personal warmth made him effective where confrontation might have failed. This was not accommodation — it was strategy.',
    ],
    meditationText: 'This meditation will be written by one of our commissioned writers, responding to the themes of working within systems, compromise, and using position for change.',
    journalPrompt: 'Have you ever had to work within a system you didn\'t fully agree with? How did you hold onto yourself while navigating that tension?',
    imageAlt: 'Figure in a Whitehall corridor, 1940s dress, shadows and light playing across institutional architecture',
  },
  {
    id: 4,
    title: 'Tilbury Docks',
    era: '1948',
    historicalContext: [
      'On 22 June 1948, the HMT Empire Windrush docked at Tilbury, carrying 492 passengers from Jamaica and other Caribbean islands. Among those waiting on the quayside was Ivor Cummings, there in his official capacity from the Colonial Office. He was one of the first people the Windrush generation saw when they stepped onto English soil.',
      'This was not a casual welcome. Ivor had worked to ensure that the arrivals would receive proper reception — assistance with accommodation, employment, and the bewildering bureaucracy of a new country. He understood, from his own life, what it meant to arrive somewhere that did not quite know what to do with you.',
      'The image of Tilbury Docks has become iconic in British history. But Ivor\'s presence there — a Black gay man, welcoming a generation that would transform Britain — has been largely written out of the story. Until now.',
    ],
    meditationText: 'This meditation will be written by one of our commissioned writers, responding to the themes of welcome, arrival, and standing at the threshold of change.',
    journalPrompt: 'What does it mean to welcome someone into a new chapter of their life? When has someone stood at the threshold for you?',
    imageAlt: 'Tilbury Docks 1948, figures descending a gangway, a welcoming hand extended, rendered in documentary poetic style',
  },
  {
    id: 5,
    title: 'Queer Life',
    era: '1950s–1970s',
    historicalContext: [
      'Ivor Cummings was a proudly gay man in an era when homosexuality was criminalised in Britain. The Sexual Offences Act of 1967 partially decriminalised sex between men over 21 in private — but social stigma, police harassment, and institutional discrimination continued for decades after.',
      'For a Black gay man, the invisibility was doubled. The emerging narrative of the Windrush generation had no space for queerness. The emerging gay rights movement had little space for Blackness. Ivor existed at an intersection that neither community fully acknowledged.',
      'Yet he lived his life with openness and dignity. Nicholas Boston, writing in The Independent in 2019, called him "the gay father of the Windrush generation" — a title that captures both the care he extended to new arrivals and the queerness that mainstream history chose to forget.',
    ],
    meditationText: 'This meditation will be written by one of our commissioned writers, responding to the themes of visibility, invisibility, and living authentically in hostile times.',
    journalPrompt: 'Where in your life have you felt invisible — too much of one thing for one community, not enough for another? How do you hold all of who you are?',
    imageAlt: 'Intimate portrait study, 1960s setting, dignity and quiet defiance, inspired by Rotimi Fani-Kayode\'s photography',
  },
  {
    id: 6,
    title: 'Legacy',
    era: '1992–present',
    historicalContext: [
      'Ivor Cummings died in 1992. For more than thirty years, his story was largely forgotten — too queer for the Windrush commemorations, too Black for LGBTQ+ histories, too establishment for radical narratives. He fell through every gap.',
      'It was historian Stephen Bourne who recovered Ivor\'s story through painstaking research in the National Archives. Bourne\'s work — including the biography in the Oxford Dictionary of National Biography (2012) and his book Mother Country (2010) — brought Ivor back into the light. Bourne spoke about Ivor at BLKOUT\'s Black Men Who Brunch gathering, connecting past to present.',
      'Ivor\'s Compass exists because stories like his matter. Because heritage isn\'t something behind glass in a museum — it\'s something you carry with you. Because a Black gay man who stood on Tilbury Docks in 1948 has something to say to a Black gay man in Croydon in 2026.',
    ],
    meditationText: 'This meditation will be written by one of our commissioned writers, responding to the themes of recovery, remembrance, and why we tell stories about people who have been forgotten.',
    journalPrompt: 'Whose story do you carry? What forgotten history, family memory, or untold truth do you want to make sure isn\'t lost?',
    imageAlt: 'Abstract composition of archival documents, photographs, and golden light emerging from shadows',
  },
]
