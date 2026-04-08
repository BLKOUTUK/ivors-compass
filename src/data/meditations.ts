export interface Meditation {
  id: number
  title: string
  phase: string | null
  phaseEnergy: string | null
  era: string
  historicalContext: string[]
  meditationText: string[]
  meditationAuthor?: string
  meditationAuthorBio?: string
  journalPrompt: string
  followUpQuestions: string[]
  image: string
  imageAlt: string
}

export const meditations: Meditation[] = [
  {
    id: 1,
    title: 'Let me welcome you\u2026',
    phase: null,
    phaseEnergy: null,
    era: '8 March 1941',
    historicalContext: [
      'Café de Paris, 8 March 1941. Ken "Snakehips" Johnson leads the West Indian Dance Orchestra — the most popular band in wartime London. His friend Ivor Cummings is in the audience. By day, Ivor is the first Black official in the Colonial Office. By night, he moves through a world of jazz, community, and desire.',
      'Ken Johnson was born in British Guiana in 1914 and came to England as a boy. By his mid-twenties, he was the most celebrated bandleader in London — his West Indian Dance Orchestra made the Café de Paris the most exciting room in wartime England. Ivor and Ken were part of the same world: young, Black, brilliant, navigating a city that admired their talent but policed their presence.',
      'That night, a bomb fell down a ventilation shaft and killed Ken mid-performance. He was 26. Seven years later, Ivor would stand on Tilbury Docks welcoming the Windrush generation. But his story — too queer for Windrush history, too Black for LGBTQ+ history — would be invisible for decades.',
    ],
    meditationText: [
      'This is a journal. Not a textbook, not a museum, not a lecture. Five writers have sat with different chapters of Ivor Cummings\u2019 life and written what came up for them \u2014 about identity, loss, resistance, joy, and the silence that swallows stories unless we curate them for ourselves. Each reflection ends with a question. The question is for you.',
      'You can read in order or skip to whatever draws you. You can write your response or speak it \u2014 the journal accepts both. You can sit with a chapter for a week or move through all six in an afternoon. There is no correct pace. Some questions will land immediately. Others will sit in you for days before they produce anything. That\u2019s not failure \u2014 that\u2019s the work doing what it\u2019s supposed to do.',
      'Ivor\u2019s story was invisible for decades \u2014 too queer for one history, too Black for another. It survived because a handful of people refused to let it disappear. This journal asks whether you might do the same thing \u2014 not for posterity, or the archive, but for yourself. What power is there in understanding your own story better? How can you use it, to heal, to grow?',
      'Your entries are private. They stay on your device. No one sees them unless you choose to share. This is not a performance. It\u2019s a practice.',
      'Ivor Cummings, Tilbury Docks, 22 June 1948: \u201CLet me welcome you \u2026 and express the hope that you will all achieve the objects which have brought you here.\u201D',
    ],
    journalPrompt: 'What does it mean to inherit a story that was hidden from you?',
    followUpQuestions: [
      'What histories were you never told that shaped the world you live in?',
      'How does it feel to discover something that was always there but invisible?',
      'What stories do you carry that others might not know about?',
    ],
    image: '/images/meditation-1.png',
    imageAlt: 'Interior of the Café de Paris, 1941, warm light, a bandleader mid-performance, the energy of wartime London',
  },
  {
    id: 2,
    title: 'Dear boy',
    phase: 'Identity',
    phaseEnergy: 'Grounding',
    era: '1913–1930s',
    historicalContext: [
      'Ivor Gustavus Cummings was born in West Hartlepool in 1913, the son of a Sierra Leonean father and an English mother. The family settled in Addiscombe, Croydon, where Ivor attended Whitgift School. It was here that his life became entangled with one of the most remarkable families in Black British history.',
      'Jessie Walmisley Coleridge-Taylor — the widow of the celebrated Croydon-born composer Samuel Coleridge-Taylor — reached out to the Cummings family. She recognised in the young Ivor something of the determination that had marked her late husband\'s life. Through Sierra Leonean kinship networks, Ivor was a distant cousin of the composer. Jessie introduced him to his cousins Avril and Hiawatha Coleridge-Taylor. He was claimed.',
      'Later, Ivor would travel to Sierra Leone to reconnect with his father\'s homeland — his African heritage. Identity, for Ivor, was something you had to go and find, not something handed to you. Three generations of Black British cultural life, rooted in Croydon: the composer, his widow, and the young man she drew into the family.',
    ],
    meditationText: [
      'Whitgift School: bullied out for being Black. Sierra Leone: sent to join his father, returned feeling an outsider. Medical school: denied for lack of funds, though his father was a wealthy surgeon. The RAF: rejected because officers had to be "of pure European descent." Four doors closed before Ivor Cummings turned twenty-five. None of them closed quietly.',
      'James Baldwin, in his last interview, offered the only sane response to this kind of systematic refusal: "You have to decide who you are and force the world to deal with you, not with its idea of you."',
      'This is what Ivor did — not once, in a single dramatic gesture, but repeatedly, across decades. When the identities he reached for were slapped away, he didn\'t mourn what he couldn\'t become. He built something none of those institutions had a category for. adrienne maree brown reminds us that when only two people show up instead of twenty, there is a conversation that only this group can have at this juncture. Ivor\'s life is that principle applied to identity itself. Work with what\'s in the room — including the parts of yourself that nobody else knows what to do with.',
      'He entered the Colonial Office and mastered its language without ever becoming of it. Not working class, but willing to play with class markers. Fastidious, elegant, chain-smoking with a cigarette holder, addressing everyone as "dear boy" — performing adjacency to power while using that proximity to dismantle the colour bar from inside. The world had an idea of what a Black civil servant should be. Ivor forced it to deal with him.',
      'And when the Colonial Office offered him its idea of his future — a senior post in Trinidad, the respectable reward — he refused. For a Black man, a Pan-Africanist who had been organising toward this moment since the 1930s, the most exciting thing imaginable was happening: Africa was liberating itself. Nkrumah wanted him to help build Ghana\'s diplomatic infrastructure. The Colonial Office offered a career. Africa offered a purpose. Then Sierra Leone — diamonds, then PR — and Freetown, where Arnold first got to know him as always ready with a quip and a laugh, still at the centre of a network of people drawn to him, helped by him, held by him.',
      'Consider too what he chose not to carry. His father had supported siblings into medicine but not him. He had reason for resentment. Instead he chose to work alongside his father, recruiting nurses from Sierra Leone for the NHS. At Ivor\'s funeral, Paul Danquah — the breakthrough screen actor turned World Bank international lawyer — recalled his mentor\'s advice: "You must not disparage your father. Your father is a very important person and you have this heritage." Ivor wasn\'t dispensing wisdom from a distance. He was passing on the hardest thing he\'d learned himself. Claim it. Don\'t let other people\'s discomfort with your complexity become your own.',
      'A journal is where you practise this discipline before you step outside. You try on language, discard it, try again. You decide who you are — not once, but daily. Because here is what Ivor understood and Baldwin named: authenticity is not just self-preservation. It is a gift to everyone around you. Ivor\'s completeness — his refusal to hide, to diminish, to perform someone else\'s idea of him — disarmed those who opposed him. MPs who wanted to divert the Windrush to staff Kenyan peanut farms. Londoners sheltering from the Luftwaffe\'s bombs who couldn\'t bring themselves to share safe haven with Black and Asian seamen. Radical visionaries who thought the Colonial Office warden was a sellout. He met them all as himself, and in doing so reminded them to be their best selves. Before you can force the world to deal with you, you have to know which "you" you\'re bringing. The tools for reflection, gratitude, and growth in this journal can help you to find out.',
    ],
    meditationAuthor: 'Rob Berkeley',
    journalPrompt: 'Who claimed you? What parts of your heritage did you have to go looking for?',
    followUpQuestions: [
      'What do you know about the place and people that shaped you before you could choose for yourself?',
      'Which parts of your identity were given to you, and which did you have to find?',
      'How does it feel to be recognised — truly seen — by someone who understands where you come from?',
    ],
    image: '/images/meditation-2.png',
    imageAlt: 'Addiscombe, Croydon, 1920s — a young man between two worlds, the streets of South London and the heritage of West Africa',
  },
  {
    id: 3,
    title: 'Lost in Music',
    phase: 'Vulnerability',
    phaseEnergy: 'Connection',
    era: '1920s–1941',
    historicalContext: [
      'Education was a site of both aspiration and violence. At Whitgift School in Croydon, Ivor faced racial harassment — ultimately attacked. He moved to Dulwich College, bigger and more intimidating. He wanted to attend medical school but was blocked by fees and discrimination. The institutions that promised him a future withheld it.',
      'What held him when the institutions didn\'t was the jazz world — the social life of Black cultural London. Ken "Snakehips" Johnson, the Café de Paris, the clubs and salons where Black men could be brilliant and visible and desired. This was community as survival — the warmth that kept you going when the formal world shut its doors.',
      'On 8 March 1941, a bomb fell down a ventilation shaft at the Café de Paris and killed Ken mid-performance. He was 26. Ivor was still only 29 — he arranged Ken\'s funeral and memorial. The vulnerability of desire, friendship, and loss.',
    ],
    meditationText: ['This meditation will be written by one of our commissioned writers, responding to the themes of what institutions promise and withhold, what holds you when they don\'t, and what you lose.'],
    journalPrompt: 'What promised you something and then took it away? What held you when the institutions didn\'t?',
    followUpQuestions: [
      'Where have you experienced the gap between what was promised and what was delivered?',
      'Who or what has been your Café de Paris — the space that held you when the formal world shut its doors?',
      'How do you carry grief for the people and possibilities you\'ve lost?',
    ],
    image: '/images/meditation-3.png',
    imageAlt: 'A school corridor dissolving into a jazz club, the tension between institutional coldness and communal warmth',
  },
  {
    id: 4,
    title: 'Guncle Ivor',
    phase: 'Resistance',
    phaseEnergy: 'Strength',
    era: '1930s–1940s',
    historicalContext: [
      'Ivor\'s first job was at Aggrey House — the colonial students\' hostel in Doughty Street, Bloomsbury. It was more than accommodation. It was a crucible of ideas, friendships, and political awakening. Students from across Africa and the Caribbean debated colonialism, imagined independence, and forged the networks that would later transform nations.',
      'Ivor was politicised here. He worked with Cecil Bellfield-Clarke. He built intellectual alliances with "the group" — Pan-Africanists organising in London. This was the political education that transformed a young man blocked from medical school into someone who could navigate the Colonial Office.',
      'Resistance as formation, not protest. The skills Ivor developed here — of connection, quiet leadership, and strategic thinking — would define his life\'s work. The mentors who taught him how to think politically gave him tools he would use for the next fifty years.',
    ],
    meditationText: [
      'While best known as the man who welcomed the Windrush passengers to Britain in 1948, Ivor Cummings — Secretary to the Advisory Committee on the Welfare of Colonial People in the United Kingdom — had been fighting for Black rights from inside the state for years before that ship docked. During the Blitz, he defended Black workers denied entry to air raid shelters. When the US Army attempted to bring Jim Crow to Britain, he advocated for Caribbean servicemen and colonial workers facing racial prejudice. In 1946, he sat across the table from the British Boxing Board of Control and challenged Rule 24 — the regulation requiring title contestants to have "two white parents," a colour bar that had stood since 1911. By the time he was orchestrating travel, shelter, and employment for the Windrush intake, working on the inside to fight racist exclusion was a pattern.',
      'But how did Cummings become this man? Political consciousness isn\'t born — it\'s built.',
      'After being rejected from medical studies for lack of funds, he became warden of Aggrey House, a Bloomsbury hostel for students arriving from the Colonies. There he met Cecil Belfield-Clarke, a queer Black Bajan doctor and prominent activist. A firm friendship formed around shared purpose: supporting liberation movements across Britain\'s colonies — at a time when no Black nation had yet broken free of imperial rule — fighting the colour bar, and working toward the betterment of race relations in Britain. That purpose drew them into the Pan-African movement and into contact with many who would become leaders of independence movements across the African diaspora.',
      'What makes Cummings instructive is how he worked within white institutions while remaining authentically himself. His overt homosexuality was not separate from his politics; the intersection of his marginalised identities sharpened his understanding of exclusion. He moved through 1930s London nightlife as part of "the Group" — Black intellectuals including gay men like John Payne and Reginald Foresythe — and carried that defiance into the corridors of the state. Aggrey House, Belfield-Clarke, the League, the Group — each connection taught him resistance.',
      'As a human rights defender from the Caribbean, currently embroiled in a landmark civil suit to strike down British colonial-era laws that criminalise LGBTQ+ people, I always reflect on whose shoulders I stand upon. The queer Black people who walked so I could run.',
      'When we see rollbacks of queer rights across African countries and the erroneous belief that queerness is "un-African," we must ensure these legacies emerge from the shadows — not only celebrated, but cemented into the fabric of Black history, today and tomorrow.',
      'Cummings has been affectionately described as the "Gay Father of the Windrush generation" — the Guncle. That title speaks to something deeper: queer people have always held space in Black communities, sometimes, like Guncle Ivor, in ways that require us to broaden our language and thinking to articulate our interdependence. Let\'s learn from Ivor. His life is proof that resistance, while sharpened by exclusion, is learned in community, and made powerful when you refuse to leave any part of who you are at the door.',
      'A luta continua!',
    ],
    meditationAuthor: 'Jason Jones',
    meditationAuthorBio: 'Jason Jones is a human rights defender from Trinidad and Tobago and the litigant in a landmark legal challenge for LGBTQ+ equality in the Commonwealth.',
    journalPrompt: 'Who taught you to think politically? Where did you learn to fight — not the fight itself, but the people who showed you how?',
    followUpQuestions: [
      'What spaces have shaped how you see the world?',
      'Who are the mentors — formal or informal — who changed how you think?',
      'How has your understanding of resistance evolved over time?',
    ],
    image: '/images/meditation-4.png',
    imageAlt: 'Interior of a 1930s London gathering space, warm lamplight, animated conversation, books and pamphlets on tables',
  },
  {
    id: 5,
    title: 'The Insider?',
    phase: 'Joy',
    phaseEnergy: 'Celebration',
    era: '1948',
    historicalContext: [
      'Ivor joined the Colonial Office — becoming its first Black official. He became the unofficial envoy to Black communities in Britain. He recruited for the NHS. He fought for recognition — receiving his OBE in the 1948 Birthday Honours for his Colonial Office work.',
      'And then, that same year, he stood on Tilbury Docks welcoming the Windrush generation. On 22 June 1948, the HMT Empire Windrush docked carrying 492 passengers from Jamaica and other Caribbean islands. Ivor was one of the first people they saw when they stepped onto English soil. He had worked to ensure proper reception — assistance with accommodation, employment, and the bewildering bureaucracy of a new country.',
      'Everything he built, everything he survived, turned into opening the door for others. The image of Tilbury Docks has become iconic in British history. But Ivor\'s presence there — a Black gay man born in Hartlepool, raised in Croydon, welcoming a generation that would transform Britain — has been largely written out of the story.',
    ],
    meditationText: [
      'What does it mean to be Black, and work for the British colonial office?',
      'I picture you standing on Tilbury Docks, nervously awaiting their arrival.',
      'There are workmen scuttling around you, busy making preparations for that huge, yawning, fourteen-thousand-tonne motor ship to pull into the northern side of the River Thames. At last you see it on the horizon. Its tall steam funnel gleaming in the summer sun. There it is. The fruit of your labour, creeping through the estuary. Coming closer. Closer. Closer. Soon you can see figures on deck. Hopeful faces peering over the white railings, and into their new beginning\u2026',
      'When I think of that moment \u2013 the ship discharging its happy passengers, a flurry of luggage and lives unloaded from boat to land, you standing there, a smile spilling across your chin \u2013 I see joy. And also contradiction. Complexities.',
      'Did you know that the HMS Empire Windrush was German in origin, Ivor? I didn\u2019t until very recently. It was built for a German shipping company in 1930 \u2013 originally called the MV Monte Rosa. Under Nazi rule it was chartered to spread Nazi propaganda at home and abroad. Then, during the war it was repurposed into a Nazi troopship. Eventually being used to deport Norwegian Jews to their deaths in Auschwitz, occupied Poland.',
      'When the British won, they took it for themselves. The spoils of war.',
      'So there it sits in 1948, glittering like a gem in the Thames. A stolen ship, bearing the descendants of stolen people. To the very country that enriched itself on their forefathers\u2019 enslavement.',
      'A complicated picture isn\u2019t it?',
      'But the Tilbury scene is a far cry from the middle passage. Or from Nazi warships\u2026 There is a customary Caribbean joy in it all as you welcome people: the atmosphere is buzzing. There\u2019s anticipation. Ambition. The excitement of economic opportunities. Perhaps you lock eyes with some lookers, Ivor? See a man or two in the crowd and know just how you\u2019d help him feel\u2026 extra at home, let\u2019s say?',
      'Later, you guide the passengers to the ex-air raid shelter in Clapham that will be their accommodation: a bunker, beneath the land, hidden. Like a secret. Like a colonial history \u2013 or a stigmatised sexuality \u2013 that needs to be repressed.',
      'What does it mean to be Black, and work for the British colonial office? Your life asks me a question, Ivor. As a queer, trans, Black British man, with roots reaching back to the Caribbean, and beyond that to the motherland \u2013 where am I a cog in the wheel, and where am I the tree branch that dislodges and disrupts the system? Because real joy, is collective, not colonial.',
      'I think you knew this. Ten years after standing on Tilbury Docks, ushering the occupants of HMS Empire Windrush into Britain, you quit. Taking up work under Ghanaian revolutionary Kwame Nkrumah instead. What a twist. I bet the British didn\u2019t see that coming: esteemed colonial office employee resigns to serve post-independence Ghana\u2026',
    ],
    meditationAuthor: 'Jackson King',
    meditationAuthorBio: 'Jackson King is a writer and storyteller.',
    journalPrompt: 'What have you survived that you can now use to open a door for someone else?',
    followUpQuestions: [
      'When has someone stood at the threshold for you — welcoming you into a new chapter?',
      'What does it feel like to turn your own struggle into someone else\'s support?',
      'How do you celebrate what you\'ve built, even when the world doesn\'t recognise it?',
    ],
    image: '/images/meditation-5.png',
    imageAlt: 'Tilbury Docks 1948, figures descending a gangway, a welcoming hand extended, rendered in documentary poetic style',
  },
  {
    id: 6,
    title: 'The Grip of Silence',
    phase: null,
    phaseEnergy: null,
    era: '1992–present',
    historicalContext: [
      'Ivor Cummings was a proudly gay man across every chapter of his life — desire navigated in Aggrey House, the jazz clubs, the Colonial Office, the docks. In an era when homosexuality was criminalised, he lived with openness and dignity. For a Black gay man, the invisibility was doubled: too queer for the emerging Windrush narrative, too Black for the emerging gay rights movement.',
      'After his death in 1992, his story was invisible for decades. It was historian Stephen Bourne who recovered it through painstaking research in the National Archives. Bourne\'s work — including the biography in the Oxford Dictionary of National Biography (2012) and his book Mother Country (2010) — brought Ivor back into the light. Nicholas Boston named him "the forgotten gay mentor of the Windrush generation."',
      'Ivor\'s Compass exists because stories like his matter. Because heritage isn\'t something behind glass in a museum — it\'s something you carry with you. Because a Black gay man who stood on Tilbury Docks in 1948 has something to say to a Black queer man in Croydon in 2026.',
    ],
    meditationText: [
      'When Ivor Cummings died in 1992, he left behind a suitcase. In it, by his friend Arnold\'s account, were papers Ivor had been collecting — documents, correspondence, perhaps reflections — that he wanted passed to Paul Danquah, a younger queer Black man he had mentored as something close to a son. Paul gave the eulogy at Ivor\'s funeral. He never received the case. Ivor\'s half-sister, as executor of his will, didn\'t pass it on. Arnold says there never seemed an appropriate time to intercede. The suitcase, wherever it is, was never opened. What was in it? We\'ll never know.',
      'I want to sit with that for a moment — not in accusation, but in recognition. A brother dies. A sister grieves. The private papers of a gay man in 1992 carry a weight that is difficult to overstate. Perhaps she didn\'t understand their significance. Perhaps she understood it all too well. Grief doesn\'t wait for us to become ready, and the things we can\'t deal with get folded into the silence alongside the things we choose not to. This is how erasure works, most of the time. Not through conspiracy, but through accumulation. Not yet. Not now. Not the right moment. Until "not yet" becomes "never" and silence becomes the only record.',
      'I think about my own suitcases — plural, because we all carry more than one. There\'s the private one: love letters, angsty late-teen outpourings of hope and frustration. A collection of what no one would realistically describe as "erotic literature." I remember having an "if anything should happen" pact with a friend to extract that particular stash, to save any post-mortem blushes — as if they could actually be a thing. And then there\'s the other case entirely: twenty copies of late-eighties Smash Hits, because pop matters desperately when you\'re thirteen. Five years of The Face, because I was a trainee cool gay kid, one who happily paid to be advertised to by the right brands, who paid magazines to find me, allowing for something called journalism in which a few lucky people got paid to write about youth culture — often without having had to endure trial by reality television. Very different suitcases. One with Jodeci, the other with Jovonnie. If you know, you know.',
      'But here\'s the thing: both cases tell you something true. The private one says who I desired. The public one says who I was becoming. And neither is the whole story — they\'re snapshots, partial and caught mid-sentence. That\'s what a journal is too. You write not because you\'ve arrived at clarity but because writing is how you move toward it. Each entry is a marker, not a monument. Read back over weeks and months, the entries reveal patterns you couldn\'t see while you were living them. The silence between entries is as eloquent as the words.',
      'The archives at Kew hold Ivor\'s official life — memos, committee minutes, the logistics of Windrush. What they cannot hold is what he thought about any of it. Schrödinger\'s suitcase: full and empty at once, containing everything and nothing. His journal never reached its reader. The act of writing your own is how you refuse the same silence — not with certainty, but with presence. To defeat the tyranny of silence does not require certainty. There is victory in the refusal. As Audre Lorde — Black, lesbian, poet, warrior, mother — left us in no doubt: "your silence will not protect you." She knew what Ivor may have realised too late: that if we do not define ourselves for ourselves, we will be crunched up in other people\'s fantasies for us and eaten alive. We write ourselves into the record because we\'ve seen what happens when we don\'t.',
    ],
    meditationAuthor: 'Rob Berkeley',
    journalPrompt: 'Whose stories have been lost? What happens when we find them again? What will you carry?',
    followUpQuestions: [
      'What silences have you lived inside — your own or others\'?',
      'How does it feel to name something that was hidden?',
      'What story will you make sure isn\'t lost?',
    ],
    image: '/images/meditation-6.png',
    imageAlt: 'Abstract composition of archival documents, photographs, and golden light emerging from shadows',
  },
]
