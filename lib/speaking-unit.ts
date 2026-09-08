export type SpeakingLocale = 'en' | 'ru' | 'ka';
type Localized = Record<SpeakingLocale, string>;

export type SpeakingScenario = {
  prompt: Localized;
  options: string[];
  correct: number;
  meaning: Localized;
};

export type SpeakingStep = {
  number: number;
  kind: 'lesson' | 'review' | 'scenario' | 'mission';
  title: Localized;
  subtitle: Localized;
  minutes: number;
  words: string[];
  scenarios?: SpeakingScenario[];
};

const t = (en: string, ru: string, ka: string): Localized => ({ en, ru, ka });

export const speakingUnit: SpeakingStep[] = [
  {
    number: 1,
    kind: 'lesson',
    title: t(
      'Hello and be polite',
      'Приветствие и вежливость',
      'მისალმება და თავაზიანობა',
    ),
    subtitle: t(
      'Start and finish a friendly exchange.',
      'Начните дружелюбный разговор.',
      'დაიწყეთ მეგობრული საუბარი.',
    ),
    minutes: 6,
    words: ['გამარჯობა', 'მადლობა', 'გთხოვთ', 'ბოდიში'],
  },
  {
    number: 2,
    kind: 'lesson',
    title: t('React naturally', 'Отвечайте естественно', 'უპასუხეთ ბუნებრივად'),
    subtitle: t(
      'Say yes, no, good, and bad.',
      'Скажите: да, нет, хорошо и плохо.',
      'თქვით: კი, არა, კარგი და ცუდი.',
    ),
    minutes: 5,
    words: ['კარგი', 'კი', 'არა', 'ცუდი'],
  },
  {
    number: 3,
    kind: 'review',
    title: t('Memory Check 1', 'Проверка памяти 1', 'მეხსიერების შემოწმება 1'),
    subtitle: t(
      'Recall Lessons 1–2 from sound.',
      'Вспомните уроки 1–2 по звуку.',
      'გაიხსენეთ 1–2 გაკვეთილი ხმით.',
    ),
    minutes: 4,
    words: [
      'გამარჯობა',
      'მადლობა',
      'გთხოვთ',
      'ბოდიში',
      'კარგი',
      'კი',
      'არა',
      'ცუდი',
    ],
  },
  {
    number: 4,
    kind: 'lesson',
    title: t('Meet someone', 'Познакомьтесь', 'გაიცანით ვინმე'),
    subtitle: t(
      'Talk about you and your name.',
      'Скажите о себе и своём имени.',
      'თქვით ვინ ხართ და რა გქვიათ.',
    ),
    minutes: 6,
    words: ['მე', 'შენ', 'ჩემი', 'სახელი'],
  },
  {
    number: 5,
    kind: 'lesson',
    title: t('How are you?', 'Как дела?', 'როგორ ხარ?'),
    subtitle: t(
      'Build your first short exchange.',
      'Составьте первый короткий диалог.',
      'ააწყვეთ პირველი მოკლე დიალოგი.',
    ),
    minutes: 6,
    words: ['როგორ', 'ვარ', 'ხარ', 'არის'],
  },
  {
    number: 6,
    kind: 'review',
    title: t('Memory Check 2', 'Проверка памяти 2', 'მეხსიერების შემოწმება 2'),
    subtitle: t(
      'Bring people and greetings together.',
      'Соедините знакомство и приветствия.',
      'შეაერთეთ გაცნობა და მისალმება.',
    ),
    minutes: 4,
    words: ['მე', 'შენ', 'ჩემი', 'სახელი', 'როგორ', 'ვარ', 'ხარ', 'კარგი'],
  },
  {
    number: 7,
    kind: 'lesson',
    title: t(
      'Say what you need',
      'Скажите, что вам нужно',
      'თქვით, რა გჭირდებათ',
    ),
    subtitle: t(
      'Ask for water, food, or help.',
      'Попросите воду, еду или помощь.',
      'ითხოვეთ წყალი, საჭმელი ან დახმარება.',
    ),
    minutes: 7,
    words: ['მინდა', 'მჭირდება', 'წყალი', 'საჭმელი', 'დამეხმარეთ'],
  },
  {
    number: 8,
    kind: 'scenario',
    title: t('Café mission', 'Миссия в кафе', 'მისია კაფეში'),
    subtitle: t(
      'Use what you know in a real exchange.',
      'Используйте знания в настоящем диалоге.',
      'გამოიყენეთ ცოდნა რეალურ დიალოგში.',
    ),
    minutes: 5,
    words: [],
    scenarios: [
      {
        prompt: t(
          'Greet the café worker.',
          'Поздоровайтесь с работником кафе.',
          'მიესალმეთ კაფეს თანამშრომელს.',
        ),
        options: ['გამარჯობა', 'ბოდიში', 'არა'],
        correct: 0,
        meaning: t('Hello', 'Привет', 'მისალმება'),
      },
      {
        prompt: t(
          'Ask for coffee politely.',
          'Вежливо попросите кофе.',
          'თავაზიანად ითხოვეთ ყავა.',
        ),
        options: ['ყავა მინდა, გთხოვთ', 'ყავა არა', 'ჩემი ყავა'],
        correct: 0,
        meaning: t(
          'I would like coffee, please.',
          'Я хочу кофе, пожалуйста.',
          'ყავა მინდა, გთხოვთ.',
        ),
      },
      {
        prompt: t('Thank them.', 'Поблагодарите их.', 'მადლობა გადაუხადეთ.'),
        options: ['ცუდი', 'მადლობა', 'როგორ'],
        correct: 1,
        meaning: t('Thank you', 'Спасибо', 'მადლობა'),
      },
    ],
  },
  {
    number: 9,
    kind: 'review',
    title: t('Memory Check 3', 'Проверка памяти 3', 'მეხსიერების შემოწმება 3'),
    subtitle: t(
      'Strengthen the words most useful outside.',
      'Закрепите самые полезные слова.',
      'გაიმყარეთ ყველაზე საჭირო სიტყვები.',
    ),
    minutes: 5,
    words: [
      'გამარჯობა',
      'მადლობა',
      'გთხოვთ',
      'კარგი',
      'მე',
      'როგორ',
      'მინდა',
      'მჭირდება',
      'წყალი',
      'დამეხმარეთ',
    ],
  },
  {
    number: 10,
    kind: 'mission',
    title: t(
      'First real conversation',
      'Первый настоящий разговор',
      'პირველი რეალური საუბარი',
    ),
    subtitle: t(
      'Complete a full exchange with fewer hints.',
      'Завершите разговор почти без подсказок.',
      'დაასრულეთ საუბარი მინიშნებების გარეშე.',
    ),
    minutes: 7,
    words: [],
    scenarios: [
      {
        prompt: t(
          'Someone says: გამარჯობა',
          'Вам говорят: გამარჯობა',
          'გეუბნებიან: გამარჯობა',
        ),
        options: ['გამარჯობა', 'ცუდი', 'არა'],
        correct: 0,
        meaning: t(
          'Return the greeting.',
          'Ответьте на приветствие.',
          'უპასუხეთ მისალმებას.',
        ),
      },
      {
        prompt: t(
          'Ask: “How are you?”',
          'Спросите: «Как дела?»',
          'იკითხეთ: „როგორ ხარ?“',
        ),
        options: ['როგორ ხარ?', 'მე წყალი', 'სახელი არის'],
        correct: 0,
        meaning: t('How are you?', 'Как дела?', 'როგორ ხარ?'),
      },
      {
        prompt: t(
          'Say: “I am good.”',
          'Скажите: «У меня всё хорошо».',
          'თქვით: „კარგად ვარ“.',
        ),
        options: ['კარგად ვარ', 'კარგი ხარ', 'ცუდი არის'],
        correct: 0,
        meaning: t('I am good.', 'У меня всё хорошо.', 'კარგად ვარ.'),
      },
      {
        prompt: t(
          'Ask for water politely.',
          'Вежливо попросите воду.',
          'თავაზიანად ითხოვეთ წყალი.',
        ),
        options: ['წყალი მინდა, გთხოვთ', 'წყალი ცუდი', 'მე სახელი'],
        correct: 0,
        meaning: t(
          'I would like water, please.',
          'Я хочу воды, пожалуйста.',
          'წყალი მინდა, გთხოვთ.',
        ),
      },
    ],
  },
];
