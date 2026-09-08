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
  unit: number;
  kind: 'lesson' | 'review' | 'scenario' | 'mission';
  title: Localized;
  subtitle: Localized;
  minutes: number;
  words: string[];
  scenarios?: SpeakingScenario[];
};

const t = (en: string, ru: string, ka: string): Localized => ({ en, ru, ka });

export const speakingUnitTitles: Record<number, Localized> = {
  1: t('First conversations', 'Первые разговоры', 'პირველი საუბრები'),
  2: t('Café confidence', 'Уверенно в кафе', 'თავდაჯერებულად კაფეში'),
  3: t('Shop with confidence', 'Покупки без стресса', 'ყიდვა თავდაჯერებულად'),
  4: t('Find your way', 'Найдите дорогу', 'გაიკვლიეთ გზა'),
};

export const speakingUnit: SpeakingStep[] = [
  {
    number: 1,
    unit: 1,
    kind: 'lesson',
    minutes: 6,
    title: t(
      'Hello and be polite',
      'Приветствие и вежливость',
      'მისალმება და თავაზიანობა',
    ),
    subtitle: t(
      'Open every conversation well.',
      'Начинайте разговор правильно.',
      'სწორად დაიწყეთ საუბარი.',
    ),
    words: ['გამარჯობა', 'მადლობა', 'გთხოვთ', 'ბოდიში'],
  },
  {
    number: 2,
    unit: 1,
    kind: 'lesson',
    minutes: 5,
    title: t('React naturally', 'Отвечайте естественно', 'უპასუხეთ ბუნებრივად'),
    subtitle: t(
      'Say yes, no, good, and bad.',
      'Скажите: да, нет, хорошо и плохо.',
      'თქვით: კი, არა, კარგი და ცუდი.',
    ),
    words: ['კი', 'დიახ', 'არა', 'კარგი', 'ცუდი'],
  },
  {
    number: 3,
    unit: 1,
    kind: 'lesson',
    minutes: 6,
    title: t('Meet someone', 'Познакомьтесь', 'გაიცანით ვინმე'),
    subtitle: t(
      'Talk about you and your name.',
      'Скажите о себе и своём имени.',
      'თქვით ვინ ხართ და რა გქვიათ.',
    ),
    words: ['მე', 'თქვენ', 'ჩემი', 'სახელი', 'მეგობარი'],
  },
  {
    number: 4,
    unit: 1,
    kind: 'lesson',
    minutes: 6,
    title: t(
      'Keep the conversation going',
      'Продолжите разговор',
      'გააგრძელეთ საუბარი',
    ),
    subtitle: t(
      'Understand, ask again, and slow things down.',
      'Попросите повторить или говорить медленнее.',
      'სთხოვეთ გამეორება ან ნელა საუბარი.',
    ),
    words: ['როგორ', 'მესმის', 'ისევ', 'ნელა', 'გაიმეორე'],
  },
  {
    number: 5,
    unit: 1,
    kind: 'review',
    minutes: 5,
    title: t(
      'Memory Check · First talk',
      'Проверка памяти · Знакомство',
      'მეხსიერება · გაცნობა',
    ),
    subtitle: t(
      'Recall the language without hints.',
      'Вспомните слова без подсказок.',
      'გაიხსენეთ სიტყვები მინიშნებების გარეშე.',
    ),
    words: [
      'გამარჯობა',
      'მადლობა',
      'გთხოვთ',
      'ბოდიში',
      'კი',
      'არა',
      'მე',
      'თქვენ',
      'სახელი',
      'ნელა',
    ],
  },
  {
    number: 6,
    unit: 1,
    kind: 'mission',
    minutes: 5,
    title: t(
      'Mission · Meet a neighbour',
      'Миссия · Знакомство с соседом',
      'მისია · მეზობლის გაცნობა',
    ),
    subtitle: t(
      'Complete your first useful exchange.',
      'Проведите первый полезный диалог.',
      'დაასრულეთ პირველი სასარგებლო საუბარი.',
    ),
    words: [],
    scenarios: [
      {
        prompt: t(
          'Greet your neighbour.',
          'Поздоровайтесь с соседом.',
          'მიესალმეთ მეზობელს.',
        ),
        options: ['გამარჯობა', 'ცუდი', 'არა'],
        correct: 0,
        meaning: t('Hello', 'Здравствуйте', 'გამარჯობა'),
      },
      {
        prompt: t(
          'Say: “My name is David.”',
          'Скажите: «Меня зовут Давид».',
          'თქვით: „მე მქვია დავითი“.',
        ),
        options: ['თქვენ დავით', 'მე მქვია დავითი', 'ჩემი კარგი'],
        correct: 1,
        meaning: t(
          'My name is David.',
          'Меня зовут Давид.',
          'მე მქვია დავითი.',
        ),
      },
      {
        prompt: t(
          'Ask them to speak slowly.',
          'Попросите говорить медленнее.',
          'სთხოვეთ ნელა ისაუბრონ.',
        ),
        options: ['ცუდი, მადლობა', 'არა, სახელი', 'ნელა, გთხოვთ'],
        correct: 2,
        meaning: t(
          'Slowly, please.',
          'Медленнее, пожалуйста.',
          'ნელა, გთხოვთ.',
        ),
      },
    ],
  },
  {
    number: 7,
    unit: 2,
    kind: 'lesson',
    minutes: 6,
    title: t(
      'Say what you need',
      'Скажите, что вам нужно',
      'თქვით, რა გჭირდებათ',
    ),
    subtitle: t(
      'Express hunger, thirst, wants, and needs.',
      'Скажите, что вы хотите или что вам нужно.',
      'თქვით, რა გინდათ ან გჭირდებათ.',
    ),
    words: ['მინდა', 'მჭირდება', 'მშია', 'მწყურია', 'შეიძლება'],
  },
  {
    number: 8,
    unit: 2,
    kind: 'lesson',
    minutes: 6,
    title: t(
      'Drinks you will actually order',
      'Напитки, которые вы закажете',
      'სასმელები, რომლებსაც შეუკვეთავთ',
    ),
    subtitle: t(
      'Coffee, tea, water, milk, and juice.',
      'Кофе, чай, вода, молоко и сок.',
      'ყავა, ჩაი, წყალი, რძე და წვენი.',
    ),
    words: ['ყავა', 'ჩაი', 'წყალი', 'რძე', 'წვენი'],
  },
  {
    number: 9,
    unit: 2,
    kind: 'lesson',
    minutes: 7,
    title: t(
      'Build a simple order',
      'Составьте простой заказ',
      'შეადგინეთ მარტივი შეკვეთა',
    ),
    subtitle: t(
      'Choose food and say what you like.',
      'Выберите еду и скажите, что вам нравится.',
      'აირჩიეთ საჭმელი და თქვით, რა მოგწონთ.',
    ),
    words: ['საჭმელი', 'პური', 'ყველი', 'სალათი', 'მომწონს'],
  },
  {
    number: 10,
    unit: 2,
    kind: 'lesson',
    minutes: 6,
    title: t(
      'Pay and finish',
      'Оплатите и завершите',
      'გადაიხადეთ და დაასრულეთ',
    ),
    subtitle: t(
      'Ask the price and choose card or cash.',
      'Узнайте цену и выберите карту или наличные.',
      'იკითხეთ ფასი და აირჩიეთ ბარათი ან ნაღდი.',
    ),
    words: ['რამდენი', 'ფასი', 'ფული', 'ბარათი', 'ნაღდი'],
  },
  {
    number: 11,
    unit: 2,
    kind: 'review',
    minutes: 5,
    title: t(
      'Memory Check · Café',
      'Проверка памяти · Кафе',
      'მეხსიერება · კაფე',
    ),
    subtitle: t(
      'Recall the order before the mission.',
      'Вспомните заказ перед миссией.',
      'გაიხსენეთ შეკვეთა მისიის წინ.',
    ),
    words: [
      'მინდა',
      'მშია',
      'მწყურია',
      'ყავა',
      'ჩაი',
      'წყალი',
      'პური',
      'სალათი',
      'ფასი',
      'ბარათი',
    ],
  },
  {
    number: 12,
    unit: 2,
    kind: 'mission',
    minutes: 6,
    title: t(
      'Mission · Order at a café',
      'Миссия · Заказ в кафе',
      'მისია · შეკვეთა კაფეში',
    ),
    subtitle: t(
      'Order, respond, and pay.',
      'Закажите, ответьте и оплатите.',
      'შეუკვეთეთ, უპასუხეთ და გადაიხადეთ.',
    ),
    words: [],
    scenarios: [
      {
        prompt: t(
          'Order coffee politely.',
          'Вежливо закажите кофе.',
          'თავაზიანად შეუკვეთეთ ყავა.',
        ),
        options: ['ყავა მინდა, გთხოვთ', 'ყავა ცუდი', 'ჩემი ყავა'],
        correct: 0,
        meaning: t(
          'I would like coffee, please.',
          'Я хочу кофе, пожалуйста.',
          'ყავა მინდა, გთხოვთ.',
        ),
      },
      {
        prompt: t(
          'Ask for water too.',
          'Попросите ещё воду.',
          'წყალიც ითხოვეთ.',
        ),
        options: ['წყალი არა', 'წყალიც, გთხოვთ', 'მე წყალი'],
        correct: 1,
        meaning: t(
          'Water too, please.',
          'И воду, пожалуйста.',
          'წყალიც, გთხოვთ.',
        ),
      },
      {
        prompt: t(
          'Ask if you may pay by card.',
          'Спросите, можно ли оплатить картой.',
          'იკითხეთ, შეიძლება თუ არა ბარათით გადახდა.',
        ),
        options: ['ბარათი ცუდი?', 'რამდენი ყავა?', 'ბარათით შეიძლება?'],
        correct: 2,
        meaning: t(
          'Can I pay by card?',
          'Можно оплатить картой?',
          'ბარათით შეიძლება?',
        ),
      },
      {
        prompt: t(
          'Finish politely.',
          'Завершите вежливо.',
          'თავაზიანად დაასრულეთ.',
        ),
        options: ['მადლობა', 'მშია', 'რამდენი'],
        correct: 0,
        meaning: t('Thank you.', 'Спасибо.', 'მადლობა.'),
      },
    ],
  },
  {
    number: 13,
    unit: 3,
    kind: 'lesson',
    minutes: 6,
    title: t(
      'Shopping essentials',
      'Главное для покупок',
      'მთავარი საყიდლებისთვის',
    ),
    subtitle: t(
      'Find the shop, item, and price.',
      'Найдите магазин, товар и цену.',
      'იპოვეთ მაღაზია, ნივთი და ფასი.',
    ),
    words: ['მაღაზია', 'ვეძებ', 'ეს', 'რა', 'ღირს'],
  },
  {
    number: 14,
    unit: 3,
    kind: 'lesson',
    minutes: 6,
    title: t('Choose an amount', 'Выберите количество', 'აირჩიეთ რაოდენობა'),
    subtitle: t(
      'Use small numbers, bottles, and bags.',
      'Используйте числа, бутылки и пакеты.',
      'გამოიყენეთ რიცხვები, ბოთლები და ჩანთები.',
    ),
    words: ['ერთი', 'ორი', 'სამი', 'ბოთლი', 'ჩანთა'],
  },
  {
    number: 15,
    unit: 3,
    kind: 'lesson',
    minutes: 7,
    title: t('Fill your basket', 'Наполните корзину', 'შეავსეთ კალათა'),
    subtitle: t(
      'Buy common food without searching a dictionary.',
      'Купите обычные продукты без словаря.',
      'იყიდეთ ყოველდღიური პროდუქტები ლექსიკონის გარეშე.',
    ),
    words: ['ხილი', 'ბოსტნეული', 'ვაშლი', 'კვერცხი', 'ხორცი'],
  },
  {
    number: 16,
    unit: 3,
    kind: 'lesson',
    minutes: 6,
    title: t(
      'Handle the checkout',
      'Разберитесь на кассе',
      'გადაიხადეთ სალაროსთან',
    ),
    subtitle: t(
      'Compare prices, pay, and ask for a receipt.',
      'Сравните цены, оплатите и попросите чек.',
      'შეადარეთ ფასები, გადაიხადეთ და მოითხოვეთ ქვითარი.',
    ),
    words: ['ძვირი', 'იაფი', 'ვიხდი', 'ხურდა', 'ქვითარი'],
  },
  {
    number: 17,
    unit: 3,
    kind: 'review',
    minutes: 5,
    title: t(
      'Memory Check · Shopping',
      'Проверка памяти · Покупки',
      'მეხსიერება · საყიდლები',
    ),
    subtitle: t(
      'Retrieve the language needed at checkout.',
      'Вспомните слова, нужные на кассе.',
      'გაიხსენეთ სალაროსთან საჭირო სიტყვები.',
    ),
    words: [
      'მაღაზია',
      'ვეძებ',
      'რა',
      'ღირს',
      'ერთი',
      'ბოთლი',
      'ხილი',
      'ვაშლი',
      'იაფი',
      'ქვითარი',
    ],
  },
  {
    number: 18,
    unit: 3,
    kind: 'mission',
    minutes: 7,
    title: t(
      'Mission · Shop independently',
      'Миссия · Покупки самостоятельно',
      'მისია · იყიდეთ დამოუკიდებლად',
    ),
    subtitle: t(
      'Find, choose, ask the price, and pay.',
      'Найдите, выберите, узнайте цену и оплатите.',
      'იპოვეთ, აირჩიეთ, იკითხეთ ფასი და გადაიხადეთ.',
    ),
    words: [],
    scenarios: [
      {
        prompt: t(
          'Say you are looking for water.',
          'Скажите, что ищете воду.',
          'თქვით, რომ წყალს ეძებთ.',
        ),
        options: ['წყალი ძვირია', 'წყალს ვეძებ', 'წყალი არა'],
        correct: 1,
        meaning: t('I am looking for water.', 'Я ищу воду.', 'წყალს ვეძებ.'),
      },
      {
        prompt: t(
          'Ask for two bottles.',
          'Попросите две бутылки.',
          'ითხოვეთ ორი ბოთლი.',
        ),
        options: ['ორი ბოთლი, გთხოვთ', 'ერთი ჩანთა', 'სამი ვაშლი'],
        correct: 0,
        meaning: t(
          'Two bottles, please.',
          'Две бутылки, пожалуйста.',
          'ორი ბოთლი, გთხოვთ.',
        ),
      },
      {
        prompt: t(
          'Ask: “How much is this?”',
          'Спросите: «Сколько это стоит?»',
          'იკითხეთ: „ეს რა ღირს?“',
        ),
        options: ['ეს სად არის?', 'რამდენი ბოთლი?', 'ეს რა ღირს?'],
        correct: 2,
        meaning: t('How much is this?', 'Сколько это стоит?', 'ეს რა ღირს?'),
      },
      {
        prompt: t(
          'Ask for the receipt.',
          'Попросите чек.',
          'მოითხოვეთ ქვითარი.',
        ),
        options: ['ხურდა ძვირია', 'ქვითარი, გთხოვთ', 'ბარათი არა'],
        correct: 1,
        meaning: t(
          'The receipt, please.',
          'Чек, пожалуйста.',
          'ქვითარი, გთხოვთ.',
        ),
      },
    ],
  },
  {
    number: 19,
    unit: 4,
    kind: 'lesson',
    minutes: 6,
    title: t('Places around you', 'Места вокруг вас', 'ადგილები თქვენ გარშემო'),
    subtitle: t(
      'Find streets, stops, pharmacies, and the centre.',
      'Найдите улицу, остановку, аптеку и центр.',
      'იპოვეთ ქუჩა, გაჩერება, აფთიაქი და ცენტრი.',
    ),
    words: ['სად', 'ქუჩა', 'გაჩერება', 'აფთიაქი', 'ცენტრი'],
  },
  {
    number: 20,
    unit: 4,
    kind: 'lesson',
    minutes: 6,
    title: t(
      'Understand directions',
      'Поймите направление',
      'გაიგეთ მიმართულება',
    ),
    subtitle: t(
      'Go right, left, straight, near, or far.',
      'Идите направо, налево, прямо, близко или далеко.',
      'წადით მარჯვნივ, მარცხნივ, პირდაპირ, ახლოს ან შორს.',
    ),
    words: ['მარჯვნივ', 'მარცხნივ', 'პირდაპირ', 'ახლოს', 'შორს'],
  },
  {
    number: 21,
    unit: 4,
    kind: 'lesson',
    minutes: 6,
    title: t(
      'Use city transport',
      'Пользуйтесь транспортом',
      'იმგზავრეთ ქალაქში',
    ),
    subtitle: t(
      'Recognize buses, taxis, stations, and tickets.',
      'Узнайте автобус, такси, станцию и билет.',
      'იცანით ავტობუსი, ტაქსი, სადგური და ბილეთი.',
    ),
    words: ['ავტობუსი', 'ტაქსი', 'სადგური', 'ბილეთი', 'მძღოლი'],
  },
  {
    number: 22,
    unit: 4,
    kind: 'lesson',
    minutes: 7,
    title: t(
      'Ask and recover',
      'Спросите и не потеряйтесь',
      'იკითხეთ და არ დაიკარგოთ',
    ),
    subtitle: t(
      'Explain where you are going and ask for help.',
      'Объясните, куда идёте, и попросите помощи.',
      'თქვით, სად მიდიხართ და ითხოვეთ დახმარება.',
    ),
    words: ['მივდივარ', 'დამეხმარეთ', 'მაჩვენე', 'მისამართი', 'რუკა'],
  },
  {
    number: 23,
    unit: 4,
    kind: 'review',
    minutes: 5,
    title: t(
      'Memory Check · Getting around',
      'Проверка памяти · Дорога',
      'მეხსიერება · გადაადგილება',
    ),
    subtitle: t(
      'Recall directions before the final mission.',
      'Вспомните направления перед финальной миссией.',
      'გაიხსენეთ მიმართულებები საბოლოო მისიის წინ.',
    ),
    words: [
      'სად',
      'გაჩერება',
      'აფთიაქი',
      'მარჯვნივ',
      'მარცხნივ',
      'პირდაპირ',
      'ავტობუსი',
      'ტაქსი',
      'დამეხმარეთ',
      'მისამართი',
    ],
  },
  {
    number: 24,
    unit: 4,
    kind: 'mission',
    minutes: 7,
    title: t(
      'Mission · Cross the city',
      'Миссия · Доберитесь через город',
      'მისია · გაიარეთ ქალაქი',
    ),
    subtitle: t(
      'Ask for a place and follow the answer.',
      'Спросите дорогу и поймите ответ.',
      'იკითხეთ გზა და გაიგეთ პასუხი.',
    ),
    words: [],
    scenarios: [
      {
        prompt: t(
          'Ask where the bus stop is.',
          'Спросите, где автобусная остановка.',
          'იკითხეთ, სად არის ავტობუსის გაჩერება.',
        ),
        options: [
          'ავტობუსი რა ღირს?',
          'ავტობუსის გაჩერება სად არის?',
          'ტაქსი მინდა',
        ],
        correct: 1,
        meaning: t(
          'Where is the bus stop?',
          'Где автобусная остановка?',
          'ავტობუსის გაჩერება სად არის?',
        ),
      },
      {
        prompt: t(
          'You hear “პირდაპირ”. Which way?',
          'Вы слышите «პირდაპირ». Куда идти?',
          'გესმით „პირდაპირ“. საით უნდა წახვიდეთ?',
        ),
        options: ['მარცხნივ', 'უკან', 'პირდაპირ'],
        correct: 2,
        meaning: t('Go straight.', 'Идите прямо.', 'წადით პირდაპირ.'),
      },
      {
        prompt: t(
          'Ask whether the centre is far.',
          'Спросите, далеко ли центр.',
          'იკითხეთ, ცენტრი შორს არის თუ არა.',
        ),
        options: ['ცენტრი შორს არის?', 'ცენტრი რა ღირს?', 'ცენტრი მარცხნივ'],
        correct: 0,
        meaning: t('Is the centre far?', 'Центр далеко?', 'ცენტრი შორს არის?'),
      },
      {
        prompt: t(
          'You are lost. Ask for help.',
          'Вы потерялись. Попросите помощи.',
          'დაიკარგეთ. ითხოვეთ დახმარება.',
        ),
        options: ['კარგი მისამართი', 'არა, პირდაპირ', 'დამეხმარეთ, გთხოვთ'],
        correct: 2,
        meaning: t(
          'Please help me.',
          'Помогите, пожалуйста.',
          'დამეხმარეთ, გთხოვთ.',
        ),
      },
    ],
  },
];
