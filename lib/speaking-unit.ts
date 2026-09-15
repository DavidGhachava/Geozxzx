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
  reviewFrom?: number[];
};

const t = (en: string, ru: string, ka: string): Localized => ({ en, ru, ka });

export const speakingUnitTitles: Record<number, Localized> = {
  1: t('First conversations', 'Первые разговоры', 'პირველი საუბრები'),
  2: t('Café confidence', 'Уверенно в кафе', 'თავდაჯერებულად კაფეში'),
  3: t('Shop with confidence', 'Покупки без стресса', 'ყიდვა თავდაჯერებულად'),
  4: t('Find your way', 'Найдите дорогу', 'გაიკვლიეთ გზა'),
  5: t('Home and neighbours', 'Дом и соседи', 'სახლი და მეზობლები'),
  6: t('Work and services', 'Работа и услуги', 'სამსახური და სერვისები'),
  7: t('Health and pharmacy', 'Здоровье и аптека', 'ჯანმრთელობა და აფთიაქი'),
  8: t('Friends and plans', 'Друзья и планы', 'მეგობრები და გეგმები'),
  9: t('Weather and small talk', 'Погода и беседа', 'ამინდი და მცირე საუბარი'),
  10: t('Time and schedules', 'Время и расписание', 'დრო და განრიგი'),
  11: t(
    'Travel and accommodation',
    'Поездки и жильё',
    'მოგზაურობა და საცხოვრებელი',
  ),
  12: t('Describe and choose', 'Опишите и выберите', 'აღწერეთ და აირჩიეთ'),
  13: t('People and family', 'Люди и семья', 'ადამიანები და ოჯახი'),
  14: t(
    'Your daily routine',
    'Ваш распорядок дня',
    'თქვენი ყოველდღიური რუტინა',
  ),
  15: t('Phone and services', 'Телефон и услуги', 'ტელეფონი და სერვისები'),
  16: t(
    'Speak independently',
    'Говорите самостоятельно',
    'ისაუბრეთ დამოუკიდებლად',
  ),
};

export const speakingUnitOutcomes: Record<number, Localized> = {
  1: t(
    'Start and repair a conversation',
    'Начать и поддержать разговор',
    'საუბრის დაწყება და გაგრძელება',
  ),
  2: t(
    'Order and pay without switching language',
    'Заказать и оплатить без смены языка',
    'შეკვეთა და გადახდა ენის შეცვლის გარეშე',
  ),
  3: t(
    'Find, choose, and buy essentials',
    'Найти, выбрать и купить нужное',
    'საჭირო ნივთების პოვნა, არჩევა და ყიდვა',
  ),
  4: t(
    'Ask directions and use transport',
    'Спросить дорогу и воспользоваться транспортом',
    'გზის კითხვა და ტრანსპორტით სარგებლობა',
  ),
  5: t(
    'Handle everyday life at home',
    'Решать бытовые вопросы дома',
    'ყოველდღიური საკითხების მოგვარება სახლში',
  ),
  6: t(
    'Arrange work and service tasks',
    'Организовать рабочие и бытовые дела',
    'სამუშაოსა და სერვისების ორგანიზება',
  ),
  7: t(
    'Explain a basic health problem',
    'Объяснить простую проблему со здоровьем',
    'ჯანმრთელობის მარტივი პრობლემის ახსნა',
  ),
  8: t(
    'Make social plans naturally',
    'Естественно договориться о встрече',
    'შეხვედრის ბუნებრივად დაგეგმვა',
  ),
  9: t(
    'Make friendly small talk',
    'Поддержать дружескую беседу',
    'მეგობრული მცირე საუბარი',
  ),
  10: t(
    'Understand and arrange times',
    'Понять и назначить время',
    'დროის გაგება და შეთანხმება',
  ),
  11: t(
    'Travel and check in independently',
    'Путешествовать и заселиться самостоятельно',
    'მოგზაურობა და დამოუკიდებლად განთავსება',
  ),
  12: t(
    'Compare things and express a choice',
    'Сравнить и выразить выбор',
    'შედარება და არჩევანის გამოხატვა',
  ),
  13: t(
    'Talk about people close to you',
    'Рассказать о близких людях',
    'ახლობელ ადამიანებზე საუბარი',
  ),
  14: t(
    'Describe a normal day',
    'Описать обычный день',
    'ჩვეულებრივი დღის აღწერა',
  ),
  15: t(
    'Solve phone and internet problems',
    'Решать проблемы с телефоном и интернетом',
    'ტელეფონისა და ინტერნეტის პრობლემების მოგვარება',
  ),
  16: t(
    'Combine your Georgian in real situations',
    'Объединить грузинский в реальных ситуациях',
    'ქართული რეალურ სიტუაციებში გამოიყენოთ',
  ),
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
    words: ['გამარჯობა', 'მადლობა', 'გთხოვთ'],
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
    words: ['ბოდიში', 'კი', 'დიახ', 'არა', 'კარგი', 'ცუდი'],
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
  {
    number: 25,
    unit: 5,
    kind: 'lesson',
    minutes: 6,
    title: t('Your home', 'Ваш дом', 'თქვენი სახლი'),
    subtitle: t(
      'Talk about rooms, doors, and keys.',
      'Говорите о комнатах, дверях и ключах.',
      'ისაუბრეთ ოთახებზე, კარებსა და გასაღებებზე.',
    ),
    words: ['სახლი', 'ოთახი', 'კარი', 'გასაღები', 'შიგნით'],
  },
  {
    number: 26,
    unit: 5,
    kind: 'lesson',
    minutes: 6,
    title: t('Daily life at home', 'Дела дома', 'ყოველდღიური ცხოვრება სახლში'),
    subtitle: t(
      'Describe a simple daily routine.',
      'Опишите простой распорядок дня.',
      'აღწერეთ მარტივი ყოველდღიური რუტინა.',
    ),
    words: ['ვცხოვრობ', 'ვიღვიძებ', 'ვდგები', 'ვიძინებ', 'ვბრუნდები'],
  },
  {
    number: 27,
    unit: 5,
    kind: 'lesson',
    minutes: 6,
    title: t(
      'Solve a home problem',
      'Решите проблему дома',
      'მოაგვარეთ პრობლემა სახლში',
    ),
    subtitle: t(
      'Point out what needs attention.',
      'Объясните, что требует внимания.',
      'თქვით, რას სჭირდება ყურადღება.',
    ),
    words: ['შუქი', 'ფანჯარა', 'აბაზანა', 'წყალი', 'ლიფტი'],
  },
  {
    number: 28,
    unit: 5,
    kind: 'lesson',
    minutes: 6,
    title: t('Welcome a guest', 'Встретьте гостя', 'მიიღეთ სტუმარი'),
    subtitle: t(
      'Help someone feel at home.',
      'Помогите гостю освоиться.',
      'დაეხმარეთ სტუმარს თავი შინ იგრძნოს.',
    ),
    words: ['სტუმარი', 'სკამი', 'მაგიდა', 'სამზარეულო', 'სუფთა'],
  },
  {
    number: 29,
    unit: 5,
    kind: 'review',
    minutes: 5,
    title: t(
      'Memory Check · Home',
      'Проверка памяти · Дом',
      'მეხსიერება · სახლი',
    ),
    subtitle: t(
      'Bring home language back to mind.',
      'Вспомните слова для дома.',
      'გაიხსენეთ სახლის სიტყვები.',
    ),
    words: [
      'სახლი',
      'ოთახი',
      'კარი',
      'გასაღები',
      'ვცხოვრობ',
      'შუქი',
      'აბაზანა',
      'სტუმარი',
      'სამზარეულო',
    ],
  },
  {
    number: 30,
    unit: 5,
    kind: 'mission',
    minutes: 6,
    title: t(
      'Mission · Help a neighbour',
      'Миссия · Помогите соседу',
      'მისია · დაეხმარეთ მეზობელს',
    ),
    subtitle: t(
      'Handle a small conversation at home.',
      'Проведите короткий разговор дома.',
      'წარმართეთ მოკლე საუბარი სახლში.',
    ),
    words: [],
    scenarios: [
      {
        prompt: t(
          'Say: “I live here.”',
          'Скажите: «Я живу здесь».',
          'თქვით: „მე აქ ვცხოვრობ“.',
        ),
        options: ['აქ ვცხოვრობ', 'აქ ვიძინებ', 'სახლი შორს'],
        correct: 0,
        meaning: t('I live here.', 'Я живу здесь.', 'აქ ვცხოვრობ.'),
      },
      {
        prompt: t('Ask for the key.', 'Попросите ключ.', 'ითხოვეთ გასაღები.'),
        options: ['კარი, მადლობა', 'გასაღები, გთხოვთ', 'ოთახი არა'],
        correct: 1,
        meaning: t(
          'The key, please.',
          'Ключ, пожалуйста.',
          'გასაღები, გთხოვთ.',
        ),
      },
      {
        prompt: t(
          'Show where the bathroom is.',
          'Покажите, где ванная.',
          'აჩვენეთ, სად არის აბაზანა.',
        ),
        options: ['აბაზანა აქ არის', 'ლიფტი შორს არის', 'წყალი მინდა'],
        correct: 0,
        meaning: t(
          'The bathroom is here.',
          'Ванная здесь.',
          'აბაზანა აქ არის.',
        ),
      },
    ],
  },
  {
    number: 31,
    unit: 6,
    kind: 'lesson',
    minutes: 6,
    title: t('Work basics', 'Главное на работе', 'მთავარი სამსახურში'),
    subtitle: t(
      'Say where and how you work.',
      'Скажите, где и как вы работаете.',
      'თქვით, სად და როგორ მუშაობთ.',
    ),
    words: ['ვმუშაობ', 'ოფისი', 'ვიწყებ', 'ვამთავრებ', 'დაკავებული'],
  },
  {
    number: 32,
    unit: 6,
    kind: 'lesson',
    minutes: 6,
    title: t('Arrange a time', 'Договоритесь о времени', 'შეთანხმდით დროზე'),
    subtitle: t(
      'Use today, tomorrow, hours, and minutes.',
      'Используйте сегодня, завтра, часы и минуты.',
      'გამოიყენეთ დღეს, ხვალ, საათი და წუთი.',
    ),
    words: ['დღეს', 'ხვალ', 'საათი', 'წუთი', 'ველოდები'],
  },
  {
    number: 33,
    unit: 6,
    kind: 'lesson',
    minutes: 6,
    title: t('Call and reply', 'Позвоните и ответьте', 'დარეკეთ და უპასუხეთ'),
    subtitle: t(
      'Handle a short work message.',
      'Разберитесь с коротким рабочим сообщением.',
      'უპასუხეთ მოკლე სამუშაო შეტყობინებას.',
    ),
    words: ['ვურეკავ', 'ვპასუხობ', 'შეტყობინება', 'ტელეფონი', 'ნომერი'],
  },
  {
    number: 34,
    unit: 6,
    kind: 'lesson',
    minutes: 7,
    title: t(
      'Use everyday services',
      'Пользуйтесь услугами',
      'გამოიყენეთ ყოველდღიური სერვისები',
    ),
    subtitle: t(
      'Ask for help at a bank or office.',
      'Попросите помощи в банке или офисе.',
      'ითხოვეთ დახმარება ბანკში ან ოფისში.',
    ),
    words: ['ბანკი', 'მისამართი', 'ბარათი', 'ვიღებ', 'ვაძლევ'],
  },
  {
    number: 35,
    unit: 6,
    kind: 'review',
    minutes: 5,
    title: t(
      'Memory Check · Work',
      'Проверка памяти · Работа',
      'მეხსიერება · სამსახური',
    ),
    subtitle: t(
      'Recall words for schedules and services.',
      'Вспомните слова для работы и услуг.',
      'გაიხსენეთ სამუშაოსა და სერვისების სიტყვები.',
    ),
    words: [
      'ვმუშაობ',
      'ოფისი',
      'დღეს',
      'ხვალ',
      'საათი',
      'ვურეკავ',
      'შეტყობინება',
      'ბანკი',
      'მისამართი',
    ],
  },
  {
    number: 36,
    unit: 6,
    kind: 'mission',
    minutes: 7,
    title: t(
      'Mission · Arrange a meeting',
      'Миссия · Договоритесь о встрече',
      'მისია · დაგეგმეთ შეხვედრა',
    ),
    subtitle: t(
      'Confirm a place and time.',
      'Подтвердите место и время.',
      'დაადასტურეთ ადგილი და დრო.',
    ),
    words: [],
    scenarios: [
      {
        prompt: t(
          'Say you work in an office.',
          'Скажите, что работаете в офисе.',
          'თქვით, რომ ოფისში მუშაობთ.',
        ),
        options: ['ოფისში ვმუშაობ', 'ოფისი ძვირია', 'ოფისში ვიძინებ'],
        correct: 0,
        meaning: t(
          'I work in an office.',
          'Я работаю в офисе.',
          'ოფისში ვმუშაობ.',
        ),
      },
      {
        prompt: t(
          'Ask: “Tomorrow?”',
          'Спросите: «Завтра?»',
          'იკითხეთ: „ხვალ?“',
        ),
        options: ['გუშინ?', 'ხვალ?', 'გვიან?'],
        correct: 1,
        meaning: t('Tomorrow?', 'Завтра?', 'ხვალ?'),
      },
      {
        prompt: t(
          'Say you are waiting here.',
          'Скажите, что ждёте здесь.',
          'თქვით, რომ აქ ელოდებით.',
        ),
        options: ['აქ ველოდები', 'აქ ვპასუხობ', 'აქ ვამთავრებ'],
        correct: 0,
        meaning: t('I am waiting here.', 'Я жду здесь.', 'აქ ველოდები.'),
      },
    ],
  },
  {
    number: 37,
    unit: 7,
    kind: 'lesson',
    minutes: 6,
    title: t(
      'Say how you feel',
      'Скажите, как вы себя чувствуете',
      'თქვით, როგორ გრძნობთ თავს',
    ),
    subtitle: t(
      'Explain pain, fever, and a cough.',
      'Объясните боль, температуру и кашель.',
      'ახსენით ტკივილი, სიცხე და ხველა.',
    ),
    words: ['ავად', 'ტკივილი', 'მტკივა', 'ცხელება', 'ხველა'],
  },
  {
    number: 38,
    unit: 7,
    kind: 'lesson',
    minutes: 6,
    title: t('Where it hurts', 'Где болит', 'სად გტკივათ'),
    subtitle: t(
      'Name common parts of the body.',
      'Назовите основные части тела.',
      'დაასახელეთ სხეულის ძირითადი ნაწილები.',
    ),
    words: ['თავი', 'ყელი', 'მუცელი', 'ზურგი', 'კბილი'],
  },
  {
    number: 39,
    unit: 7,
    kind: 'lesson',
    minutes: 6,
    title: t('At the pharmacy', 'В аптеке', 'აფთიაქში'),
    subtitle: t(
      'Ask for a doctor, medicine, or help.',
      'Попросите врача, лекарство или помощь.',
      'ითხოვეთ ექიმი, წამალი ან დახმარება.',
    ),
    words: ['აფთიაქი', 'წამალი', 'ექიმი', 'საავადმყოფო', 'მჭირდება'],
  },
  {
    number: 40,
    unit: 7,
    kind: 'lesson',
    minutes: 6,
    title: t(
      'Describe your condition',
      'Опишите состояние',
      'აღწერეთ თქვენი მდგომარეობა',
    ),
    subtitle: t(
      'Say whether you feel cold, tired, or weak.',
      'Скажите, холодно ли вам, устали ли вы или слабы.',
      'თქვით, გცივათ, დაღლილი ხართ თუ სუსტი.',
    ),
    words: ['მცივა', 'მცხელა', 'დაღლილი', 'სუსტი', 'ჯანმრთელი'],
  },
  {
    number: 41,
    unit: 7,
    kind: 'review',
    minutes: 5,
    title: t(
      'Memory Check · Health',
      'Проверка памяти · Здоровье',
      'მეხსიერება · ჯანმრთელობა',
    ),
    subtitle: t(
      'Recall the words you may need quickly.',
      'Вспомните слова, которые могут понадобиться быстро.',
      'გაიხსენეთ სიტყვები, რომლებიც შეიძლება სწრაფად დაგჭირდეთ.',
    ),
    words: [
      'ავად',
      'მტკივა',
      'ცხელება',
      'თავი',
      'ყელი',
      'აფთიაქი',
      'წამალი',
      'ექიმი',
      'მჭირდება',
    ],
  },
  {
    number: 42,
    unit: 7,
    kind: 'mission',
    minutes: 7,
    title: t(
      'Mission · Visit a pharmacy',
      'Миссия · Посетите аптеку',
      'მისია · შედით აფთიაქში',
    ),
    subtitle: t(
      'Explain the problem and ask for help.',
      'Объясните проблему и попросите помощи.',
      'ახსენით პრობლემა და ითხოვეთ დახმარება.',
    ),
    words: [],
    scenarios: [
      {
        prompt: t(
          'Say your head hurts.',
          'Скажите, что у вас болит голова.',
          'თქვით, რომ თავი გტკივათ.',
        ),
        options: ['თავი მტკივა', 'თავი კარგია', 'თავი მინდა'],
        correct: 0,
        meaning: t('My head hurts.', 'У меня болит голова.', 'თავი მტკივა.'),
      },
      {
        prompt: t(
          'Say you need medicine.',
          'Скажите, что вам нужно лекарство.',
          'თქვით, რომ წამალი გჭირდებათ.',
        ),
        options: ['წამალი მჭირდება', 'წამალი შორს არის', 'წამალი არა'],
        correct: 0,
        meaning: t(
          'I need medicine.',
          'Мне нужно лекарство.',
          'წამალი მჭირდება.',
        ),
      },
      {
        prompt: t('Ask for a doctor.', 'Попросите врача.', 'ითხოვეთ ექიმი.'),
        options: ['ექიმი, გთხოვთ', 'ექიმი ძვირია', 'ექიმი ხვალ'],
        correct: 0,
        meaning: t('A doctor, please.', 'Врача, пожалуйста.', 'ექიმი, გთხოვთ.'),
      },
    ],
  },
  {
    number: 43,
    unit: 8,
    kind: 'lesson',
    minutes: 6,
    title: t('People close to you', 'Близкие люди', 'თქვენთან ახლო ადამიანები'),
    subtitle: t(
      'Talk about friends, family, and guests.',
      'Говорите о друзьях, семье и гостях.',
      'ისაუბრეთ მეგობრებზე, ოჯახსა და სტუმრებზე.',
    ),
    words: ['მეგობარი', 'ოჯახი', 'სტუმარი', 'ერთად', 'თავისუფალი'],
  },
  {
    number: 44,
    unit: 8,
    kind: 'lesson',
    minutes: 6,
    title: t('Make a plan', 'Составьте план', 'შეადგინეთ გეგმა'),
    subtitle: t(
      'Choose today, tomorrow, morning, or evening.',
      'Выберите сегодня, завтра, утро или вечер.',
      'აირჩიეთ დღეს, ხვალ, დილა ან საღამო.',
    ),
    words: ['დღეს', 'ხვალ', 'დილა', 'საღამო', 'მოდი'],
  },
  {
    number: 45,
    unit: 8,
    kind: 'lesson',
    minutes: 6,
    title: t(
      'Share what you like',
      'Расскажите, что вам нравится',
      'თქვით, რა მოგწონთ',
    ),
    subtitle: t(
      'React warmly in a conversation.',
      'Тепло отреагируйте в разговоре.',
      'თბილად უპასუხეთ საუბარში.',
    ),
    words: ['მიყვარს', 'მომწონს', 'საინტერესო', 'სასაცილო', 'ბედნიერი'],
  },
  {
    number: 46,
    unit: 8,
    kind: 'lesson',
    minutes: 7,
    title: t('Meet outside', 'Встретьтесь в городе', 'შეხვდით ქალაქში'),
    subtitle: t(
      'Choose a place and wait for a friend.',
      'Выберите место и подождите друга.',
      'აირჩიეთ ადგილი და დაელოდეთ მეგობარს.',
    ),
    words: ['პარკი', 'რესტორანი', 'კაფე', 'ზღვა', 'ველოდები'],
  },
  {
    number: 47,
    unit: 8,
    kind: 'review',
    minutes: 5,
    title: t(
      'Memory Check · Plans',
      'Проверка памяти · Планы',
      'მეხსიერება · გეგმები',
    ),
    subtitle: t(
      'Recall the language for making plans.',
      'Вспомните слова для планов.',
      'გაიხსენეთ გეგმებისთვის საჭირო სიტყვები.',
    ),
    words: [
      'მეგობარი',
      'ოჯახი',
      'ერთად',
      'თავისუფალი',
      'ხვალ',
      'საღამო',
      'მოდი',
      'მომწონს',
      'პარკი',
    ],
  },
  {
    number: 48,
    unit: 8,
    kind: 'mission',
    minutes: 7,
    title: t(
      'Mission · Make a plan',
      'Миссия · Договоритесь о планах',
      'მისია · დაგეგმეთ შეხვედრა',
    ),
    subtitle: t(
      'Invite a friend and choose a place.',
      'Пригласите друга и выберите место.',
      'მოიწვიეთ მეგობარი და აირჩიეთ ადგილი.',
    ),
    words: [],
    scenarios: [
      {
        prompt: t(
          'Ask to meet tomorrow.',
          'Предложите встретиться завтра.',
          'შესთავაზეთ შეხვედრა ხვალ.',
        ),
        options: ['ხვალ ერთად?', 'გუშინ მარტო?', 'დღეს არა'],
        correct: 0,
        meaning: t('Together tomorrow?', 'Вместе завтра?', 'ხვალ ერთად?'),
      },
      {
        prompt: t(
          'Say you like the café.',
          'Скажите, что вам нравится кафе.',
          'თქვით, რომ კაფე მოგწონთ.',
        ),
        options: ['კაფე მომწონს', 'კაფე მტკივა', 'კაფე ვიძინებ'],
        correct: 0,
        meaning: t('I like the café.', 'Мне нравится кафе.', 'კაფე მომწონს.'),
      },
      {
        prompt: t(
          'Say you are waiting in the park.',
          'Скажите, что ждёте в парке.',
          'თქვით, რომ პარკში ელოდებით.',
        ),
        options: ['პარკში ველოდები', 'პარკში ვმუშაობ', 'პარკი შორს'],
        correct: 0,
        meaning: t(
          'I am waiting in the park.',
          'Я жду в парке.',
          'პარკში ველოდები.',
        ),
      },
    ],
  },
];

const lesson = (
  number: number,
  unit: number,
  title: Localized,
  subtitle: Localized,
  words: string[],
  minutes = 6,
): SpeakingStep => ({
  number,
  unit,
  kind: 'lesson',
  title,
  subtitle,
  words,
  minutes,
});

const spiralReview = (
  number: number,
  unit: number,
  title: Localized,
  subtitle: Localized,
  words: string[],
  reviewFrom: number[],
): SpeakingStep => ({
  number,
  unit,
  kind: 'review',
  title,
  subtitle,
  words,
  reviewFrom,
  minutes: 6,
});

const mission = (
  number: number,
  unit: number,
  title: Localized,
  subtitle: Localized,
  scenarios: SpeakingScenario[],
): SpeakingStep => ({
  number,
  unit,
  kind: 'mission',
  title,
  subtitle,
  words: [],
  scenarios,
  minutes: 8,
});

const advancedSpeakingUnits: SpeakingStep[] = [
  lesson(
    49,
    9,
    t('Read the weather', 'Поймите погоду', 'გაიგეთ ამინდი'),
    t(
      'Recognize the weather around you.',
      'Опишите погоду вокруг.',
      'აღწერეთ ამინდი თქვენს გარშემო.',
    ),
    ['ამინდი', 'მზე', 'წვიმა', 'თოვლი', 'ქარი'],
  ),
  lesson(
    50,
    9,
    t('Hot, cold, sunny', 'Жарко, холодно, солнечно', 'ცხელა, ცივა, მზიანია'),
    t(
      'Say what today feels like.',
      'Скажите, какая сегодня погода.',
      'თქვით, როგორი ამინდია დღეს.',
    ),
    ['ცხელა', 'ცივა', 'წვიმს', 'თოვს', 'მზიანი'],
  ),
  lesson(
    51,
    9,
    t('Nature around Georgia', 'Природа вокруг', 'ბუნება საქართველოში'),
    t(
      'Name the places you see outdoors.',
      'Назовите места вокруг вас.',
      'დაასახელეთ ადგილები ბუნებაში.',
    ),
    ['მთა', 'მდინარე', 'ტბა', 'ტყე', 'ზღვა'],
  ),
  lesson(
    52,
    9,
    t(
      'React and connect',
      'Реагируйте и связывайте',
      'უპასუხეთ და დააკავშირეთ',
    ),
    t(
      'Join simple thoughts naturally.',
      'Связывайте простые мысли.',
      'დააკავშირეთ მარტივი აზრები.',
    ),
    ['და', 'ან', 'მაგრამ', 'კარგი', 'მომწონს'],
  ),
  spiralReview(
    53,
    9,
    t(
      'Spiral review · Small talk',
      'Повторение · Беседа',
      'სპირალური გამეორება · საუბარი',
    ),
    t(
      'Weather returns with greetings and plans.',
      'Погода возвращается вместе с приветствиями и планами.',
      'ამინდი მისალმებებსა და გეგმებთან ერთად ბრუნდება.',
    ),
    [
      'გამარჯობა',
      'დღეს',
      'ხვალ',
      'მომწონს',
      'ამინდი',
      'მზიანი',
      'წვიმა',
      'ცივა',
      'მეგობარი',
    ],
    [1, 8, 9],
  ),
  mission(
    54,
    9,
    t(
      'Mission · Start small talk',
      'Миссия · Начните беседу',
      'მისია · დაიწყეთ მცირე საუბარი',
    ),
    t(
      'Greet someone and talk about today.',
      'Поздоровайтесь и поговорите о сегодняшнем дне.',
      'მიესალმეთ და ისაუბრეთ დღევანდელ დღეზე.',
    ),
    [
      {
        prompt: t(
          'Say the weather is sunny today.',
          'Скажите, что сегодня солнечно.',
          'თქვით, რომ დღეს მზიანი ამინდია.',
        ),
        options: ['დღეს მზიანი ამინდია', 'დღეს თოვს', 'ხვალ ცივა'],
        correct: 0,
        meaning: t(
          'The weather is sunny today.',
          'Сегодня солнечная погода.',
          'დღეს მზიანი ამინდია.',
        ),
      },
      {
        prompt: t(
          'Say it is hot today.',
          'Скажите, что сегодня жарко.',
          'თქვით, რომ დღეს ცხელა.',
        ),
        options: ['დღეს ცხელა', 'დღეს მთაა', 'დღეს ქარია?'],
        correct: 0,
        meaning: t('It is hot today.', 'Сегодня жарко.', 'დღეს ცხელა.'),
      },
      {
        prompt: t(
          'Say you do not like rain.',
          'Скажите, что не любите дождь.',
          'თქვით, რომ წვიმა არ მოგწონთ.',
        ),
        options: ['წვიმა არ მომწონს', 'წვიმა მინდა', 'წვიმა შორსაა'],
        correct: 0,
        meaning: t(
          'I do not like rain.',
          'Мне не нравится дождь.',
          'წვიმა არ მომწონს.',
        ),
      },
    ],
  ),

  lesson(
    55,
    10,
    t('When things happen', 'Когда это происходит', 'როდის ხდება'),
    t(
      'Place events in time.',
      'Расположите события во времени.',
      'მოვლენები დროში განათავსეთ.',
    ),
    ['როდის', 'ახლა', 'დღეს', 'ხვალ', 'გუშინ'],
  ),
  lesson(
    56,
    10,
    t('Count past three', 'Считайте дальше трёх', 'დათვალეთ სამზე მეტი'),
    t(
      'Use the numbers that schedules need.',
      'Используйте числа для расписания.',
      'გამოიყენეთ განრიგისთვის საჭირო რიცხვები.',
    ),
    ['ოთხი', 'ხუთი', 'ექვსი', 'შვიდი', 'ათი'],
  ),
  lesson(
    57,
    10,
    t('Parts of the day', 'Части дня', 'დღის ნაწილები'),
    t(
      'Choose morning, noon, evening, or night.',
      'Выберите утро, день, вечер или ночь.',
      'აირჩიეთ დილა, შუადღე, საღამო ან ღამე.',
    ),
    ['დილა', 'შუადღე', 'საღამო', 'ღამე', 'საათი'],
  ),
  lesson(
    58,
    10,
    t(
      'Start, finish, wait',
      'Начните, закончите, подождите',
      'დაიწყეთ, დაასრულეთ, დაელოდეთ',
    ),
    t(
      'Arrange a meeting without confusion.',
      'Договоритесь о встрече без путаницы.',
      'შეხვედრაზე გარკვევით შეთანხმდით.',
    ),
    ['ვიწყებ', 'ვამთავრებ', 'ველოდები', 'ადრე', 'გვიან'],
  ),
  spiralReview(
    59,
    10,
    t(
      'Spiral review · Time',
      'Повторение · Время',
      'სპირალური გამეორება · დრო',
    ),
    t(
      'Mix time with work and social plans.',
      'Соедините время, работу и планы.',
      'დრო სამუშაოსა და გეგმებს დაუკავშირეთ.',
    ),
    [
      'ხვალ',
      'საათი',
      'დილა',
      'საღამო',
      'ველოდები',
      'ვმუშაობ',
      'მოდი',
      'ადრე',
      'გვიან',
    ],
    [6, 8, 10],
  ),
  mission(
    60,
    10,
    t(
      'Mission · Arrange a time',
      'Миссия · Назначьте время',
      'მისია · შეთანხმდით დროზე',
    ),
    t(
      'Ask when, choose a time, and confirm.',
      'Спросите когда, выберите время и подтвердите.',
      'იკითხეთ როდის, აირჩიეთ დრო და დაადასტურეთ.',
    ),
    [
      {
        prompt: t(
          'Ask when it starts.',
          'Спросите, когда начинается.',
          'იკითხეთ, როდის იწყება.',
        ),
        options: ['როდის იწყება?', 'სად მიდიხარ?', 'რა ღირს?'],
        correct: 0,
        meaning: t('When does it start?', 'Когда начинается?', 'როდის იწყება?'),
      },
      {
        prompt: t(
          'Choose five o’clock.',
          'Выберите пять часов.',
          'აირჩიეთ ხუთი საათი.',
        ),
        options: ['ხუთ საათზე', 'ხუთი ბილეთი', 'ხუთი ოთახი'],
        correct: 0,
        meaning: t('At five o’clock.', 'В пять часов.', 'ხუთ საათზე.'),
      },
      {
        prompt: t(
          'Say you will wait here tomorrow.',
          'Скажите, что завтра будете ждать здесь.',
          'თქვით, რომ ხვალ აქ დაელოდებით.',
        ),
        options: ['ხვალ აქ დაგელოდები', 'გუშინ აქ ვიყავი', 'ხვალ გვიანაა'],
        correct: 0,
        meaning: t(
          'I will wait for you here tomorrow.',
          'Я буду ждать вас здесь завтра.',
          'ხვალ აქ დაგელოდები.',
        ),
      },
    ],
  ),

  lesson(
    61,
    11,
    t('Begin a journey', 'Начните поездку', 'დაიწყეთ მოგზაურობა'),
    t(
      'Find airports, trains, and stations.',
      'Найдите аэропорт, поезд и вокзал.',
      'იპოვეთ აეროპორტი, მატარებელი და სადგური.',
    ),
    ['აეროპორტი', 'მატარებელი', 'სადგური', 'ბილეთი', 'მივდივარ'],
  ),
  lesson(
    62,
    11,
    t('Check in', 'Заселитесь', 'განთავსდით'),
    t(
      'Ask for the hotel and your room.',
      'Спросите о гостинице и номере.',
      'იკითხეთ სასტუმროსა და ოთახის შესახებ.',
    ),
    ['სასტუმრო', 'ოთახი', 'ნომერი', 'გასაღები', 'სტუმარი'],
  ),
  lesson(
    63,
    11,
    t(
      'Move through a building',
      'Ориентируйтесь в здании',
      'იმოძრავეთ შენობაში',
    ),
    t(
      'Find entrances, exits, stairs, and lifts.',
      'Найдите вход, выход, лестницу и лифт.',
      'იპოვეთ შესასვლელი, გასასვლელი, კიბე და ლიფტი.',
    ),
    ['შესასვლელი', 'გასასვლელი', 'ზემოთ', 'ქვემოთ', 'კიბე'],
  ),
  lesson(
    64,
    11,
    t('Ask for what is missing', 'Попросите недостающее', 'ითხოვეთ რაც აკლია'),
    t(
      'Handle a basic room problem.',
      'Решите простую проблему в номере.',
      'მოაგვარეთ ოთახის მარტივი პრობლემა.',
    ),
    ['პირსახოცი', 'საპონი', 'შუქი', 'ფანჯარა', 'სუფთა'],
  ),
  spiralReview(
    65,
    11,
    t(
      'Spiral review · Travel',
      'Повторение · Поездка',
      'სპირალური გამეორება · მოგზაურობა',
    ),
    t(
      'Travel language returns with directions and payment.',
      'Поездка соединяется с дорогой и оплатой.',
      'მოგზაურობა მიმართულებებსა და გადახდას უკავშირდება.',
    ),
    [
      'აეროპორტი',
      'მატარებელი',
      'ბილეთი',
      'სასტუმრო',
      'ოთახი',
      'სად',
      'პირდაპირ',
      'ბარათი',
      'დამეხმარეთ',
    ],
    [2, 4, 11],
  ),
  mission(
    66,
    11,
    t(
      'Mission · Reach your room',
      'Миссия · Доберитесь до номера',
      'მისია · მიაღწიეთ თქვენს ოთახს',
    ),
    t(
      'Find the hotel and complete check-in.',
      'Найдите гостиницу и заселитесь.',
      'იპოვეთ სასტუმრო და განთავსდით.',
    ),
    [
      {
        prompt: t(
          'Ask where the hotel is.',
          'Спросите, где гостиница.',
          'იკითხეთ, სად არის სასტუმრო.',
        ),
        options: ['სასტუმრო სად არის?', 'სასტუმრო რა ღირს?', 'სასტუმრო ცივია?'],
        correct: 0,
        meaning: t(
          'Where is the hotel?',
          'Где гостиница?',
          'სასტუმრო სად არის?',
        ),
      },
      {
        prompt: t(
          'Ask for one room.',
          'Попросите один номер.',
          'ითხოვეთ ერთი ოთახი.',
        ),
        options: ['ერთი ოთახი მინდა', 'ორი ბილეთი მინდა', 'ოთახი შორსაა'],
        correct: 0,
        meaning: t(
          'I would like one room.',
          'Я хочу один номер.',
          'ერთი ოთახი მინდა.',
        ),
      },
      {
        prompt: t(
          'Ask for a towel, please.',
          'Попросите полотенце.',
          'ითხოვეთ პირსახოცი.',
        ),
        options: ['პირსახოცი, გთხოვთ', 'გასაღები ძვირია', 'ფანჯარა ქვემოთაა'],
        correct: 0,
        meaning: t(
          'A towel, please.',
          'Полотенце, пожалуйста.',
          'პირსახოცი, გთხოვთ.',
        ),
      },
    ],
  ),

  lesson(
    67,
    12,
    t(
      'Big, small, new, old',
      'Большой, маленький, новый, старый',
      'დიდი, პატარა, ახალი, ძველი',
    ),
    t(
      'Describe everyday things clearly.',
      'Чётко опишите обычные вещи.',
      'ნათლად აღწერეთ ყოველდღიური ნივთები.',
    ),
    ['დიდი', 'პატარა', 'ახალი', 'ძველი', 'კარგი'],
  ),
  lesson(
    68,
    12,
    t('Easy, difficult, clean', 'Легко, сложно, чисто', 'ადვილი, რთული, სუფთა'),
    t(
      'Give a useful opinion.',
      'Дайте полезную оценку.',
      'გამოხატეთ პრაქტიკული აზრი.',
    ),
    ['ადვილი', 'რთული', 'სუფთა', 'ბინძური', 'შესაფერისი'],
  ),
  lesson(
    69,
    12,
    t('Clothes and size', 'Одежда и размер', 'ტანსაცმელი და ზომა'),
    t(
      'Find clothing that fits your needs.',
      'Найдите подходящую одежду.',
      'იპოვეთ თქვენთვის შესაფერისი ტანსაცმელი.',
    ),
    ['ტანსაცმელი', 'პერანგი', 'შარვალი', 'ფეხსაცმელი', 'ზომა'],
  ),
  lesson(
    70,
    12,
    t('Make a choice', 'Сделайте выбор', 'გააკეთეთ არჩევანი'),
    t(
      'Say which one and whether it works.',
      'Скажите, какой вариант подходит.',
      'თქვით, რომელი ვარიანტი გამოგადგებათ.',
    ),
    ['რომელი', 'ეს', 'შესაფერისი', 'მინდა', 'მოვიზომავ'],
  ),
  spiralReview(
    71,
    12,
    t(
      'Spiral review · Choosing',
      'Повторение · Выбор',
      'სპირალური გამეორება · არჩევანი',
    ),
    t(
      'Compare things while shopping and travelling.',
      'Сравните вещи в магазине и поездке.',
      'შეადარეთ ნივთები საყიდლებისა და მოგზაურობისას.',
    ),
    [
      'დიდი',
      'პატარა',
      'ძვირი',
      'იაფი',
      'ზომა',
      'რომელი',
      'ეს',
      'მინდა',
      'ფასი',
    ],
    [3, 11, 12],
  ),
  mission(
    72,
    12,
    t(
      'Mission · Choose confidently',
      'Миссия · Выберите уверенно',
      'მისია · აირჩიეთ თავდაჯერებულად',
    ),
    t(
      'Ask for a size and make your choice.',
      'Спросите размер и сделайте выбор.',
      'იკითხეთ ზომა და გააკეთეთ არჩევანი.',
    ),
    [
      {
        prompt: t(
          'Ask whether they have another size.',
          'Спросите, есть ли другой размер.',
          'იკითხეთ, აქვთ თუ არა სხვა ზომა.',
        ),
        options: ['სხვა ზომა გაქვთ?', 'ეს ზომა სადაა?', 'ზომა არ ვიცი'],
        correct: 0,
        meaning: t(
          'Do you have another size?',
          'У вас есть другой размер?',
          'სხვა ზომა გაქვთ?',
        ),
      },
      {
        prompt: t(
          'Say this is too small.',
          'Скажите, что это слишком мало.',
          'თქვით, რომ ეს ძალიან პატარაა.',
        ),
        options: ['ეს ძალიან პატარაა', 'ეს ძალიან იაფია', 'ეს ძველი არაა'],
        correct: 0,
        meaning: t(
          'This is too small.',
          'Это слишком маленькое.',
          'ეს ძალიან პატარაა.',
        ),
      },
      {
        prompt: t(
          'Say you will try it on.',
          'Скажите, что примерите.',
          'თქვით, რომ მოიზომებთ.',
        ),
        options: ['მოვიზომავ', 'ვიხდი', 'ველოდები'],
        correct: 0,
        meaning: t('I will try it on.', 'Я примерю.', 'მოვიზომავ.'),
      },
    ],
  ),

  lesson(
    73,
    13,
    t('People around you', 'Люди вокруг вас', 'ადამიანები თქვენს გარშემო'),
    t(
      'Name people you meet every day.',
      'Назовите людей, которых встречаете.',
      'დაასახელეთ ადამიანები, რომლებსაც ხვდებით.',
    ),
    ['ადამიანი', 'კაცი', 'ქალი', 'ბავშვი', 'მეგობარი'],
  ),
  lesson(
    74,
    13,
    t('Your family', 'Ваша семья', 'თქვენი ოჯახი'),
    t(
      'Talk about close family members.',
      'Расскажите о близких родственниках.',
      'ისაუბრეთ ოჯახის წევრებზე.',
    ),
    ['ოჯახი', 'დედა', 'მამა', 'ძმა', 'შვილი'],
  ),
  lesson(
    75,
    13,
    t('Whose and who', 'Кто и чей', 'ვინ და ვისი'),
    t(
      'Identify people and belongings.',
      'Уточните, кто это и чья вещь.',
      'გაარკვიეთ, ვინ არის და ვის ეკუთვნის.',
    ),
    ['ვინ', 'ვისი', 'ჩემი', 'შენი', 'მისი'],
  ),
  lesson(
    76,
    13,
    t('Be and have', 'Быть и иметь', 'ყოფნა და ქონა'),
    t(
      'Build short statements about people.',
      'Составьте короткие фразы о людях.',
      'შეადგინეთ მოკლე წინადადებები ადამიანებზე.',
    ),
    ['ვარ', 'ხარ', 'არის', 'მაქვს', 'გაქვს'],
  ),
  spiralReview(
    77,
    13,
    t(
      'Spiral review · People',
      'Повторение · Люди',
      'სპირალური გამეორება · ადამიანები',
    ),
    t(
      'People return with introductions and plans.',
      'Люди возвращаются со знакомствами и планами.',
      'ადამიანები გაცნობასა და გეგმებთან ერთად ბრუნდებიან.',
    ),
    [
      'მე',
      'თქვენ',
      'სახელი',
      'მეგობარი',
      'ოჯახი',
      'ვინ',
      'ჩემი',
      'არის',
      'ერთად',
    ],
    [1, 8, 13],
  ),
  mission(
    78,
    13,
    t(
      'Mission · Introduce your people',
      'Миссия · Представьте близких',
      'მისია · გააცანით ახლობლები',
    ),
    t(
      'Introduce a friend and talk about family.',
      'Представьте друга и расскажите о семье.',
      'წარადგინეთ მეგობარი და ისაუბრეთ ოჯახზე.',
    ),
    [
      {
        prompt: t(
          'Say this is your friend.',
          'Скажите, что это ваш друг.',
          'თქვით, რომ ეს თქვენი მეგობარია.',
        ),
        options: ['ეს ჩემი მეგობარია', 'ეს ჩემი სახლია', 'მეგობარი შორსაა'],
        correct: 0,
        meaning: t('This is my friend.', 'Это мой друг.', 'ეს ჩემი მეგობარია.'),
      },
      {
        prompt: t(
          'Ask who this is.',
          'Спросите, кто это.',
          'იკითხეთ, ვინ არის ეს.',
        ),
        options: ['ეს ვინ არის?', 'ეს სად არის?', 'ეს რა ღირს?'],
        correct: 0,
        meaning: t('Who is this?', 'Кто это?', 'ეს ვინ არის?'),
      },
      {
        prompt: t(
          'Say your family is here.',
          'Скажите, что ваша семья здесь.',
          'თქვით, რომ თქვენი ოჯახი აქ არის.',
        ),
        options: ['ჩემი ოჯახი აქ არის', 'ჩემი ოჯახი მიდის', 'ოჯახი რა ღირს?'],
        correct: 0,
        meaning: t(
          'My family is here.',
          'Моя семья здесь.',
          'ჩემი ოჯახი აქ არის.',
        ),
      },
    ],
  ),

  lesson(
    79,
    14,
    t('Start the day', 'Начните день', 'დაიწყეთ დღე'),
    t(
      'Describe your morning routine.',
      'Опишите утренний распорядок.',
      'აღწერეთ დილის რუტინა.',
    ),
    ['ვიღვიძებ', 'ვდგები', 'ვიბან', 'ვიცვამ', 'საუზმე'],
  ),
  lesson(
    80,
    14,
    t('Eat and drink', 'Еда и напитки', 'ჭამა და სმა'),
    t(
      'Say what you eat and drink.',
      'Скажите, что вы едите и пьёте.',
      'თქვით, რას ჭამთ და სვამთ.',
    ),
    ['ვჭამ', 'ვსვამ', 'ვამზადებ', 'სადილი', 'ვახშამი'],
  ),
  lesson(
    81,
    14,
    t('Work and learn', 'Работайте и учитесь', 'იმუშავეთ და ისწავლეთ'),
    t(
      'Describe the active part of your day.',
      'Опишите активную часть дня.',
      'აღწერეთ დღის აქტიური ნაწილი.',
    ),
    ['ვსწავლობ', 'ვმუშაობ', 'ვკითხულობ', 'ვწერ', 'ვაკეთებ'],
  ),
  lesson(
    82,
    14,
    t('End the day', 'Закончите день', 'დაასრულეთ დღე'),
    t(
      'Return home and talk about rest.',
      'Вернитесь домой и расскажите об отдыхе.',
      'დაბრუნდით სახლში და ისაუბრეთ დასვენებაზე.',
    ),
    ['ვბრუნდები', 'ვრჩები', 'ვიძინებ', 'დაღლილი', 'სახლი'],
  ),
  spiralReview(
    83,
    14,
    t(
      'Spiral review · Routine',
      'Повторение · Распорядок',
      'სპირალური გამეორება · რუტინა',
    ),
    t(
      'Daily actions return with food, home, and time.',
      'Действия соединяются с едой, домом и временем.',
      'ყოველდღიური მოქმედებები საკვებს, სახლსა და დროს უკავშირდება.',
    ),
    [
      'დილა',
      'ვიღვიძებ',
      'ვჭამ',
      'ვსვამ',
      'ვმუშაობ',
      'საღამო',
      'ვბრუნდები',
      'სახლი',
      'ვიძინებ',
    ],
    [2, 5, 6, 10, 14],
  ),
  mission(
    84,
    14,
    t(
      'Mission · Describe your day',
      'Миссия · Опишите день',
      'მისია · აღწერეთ თქვენი დღე',
    ),
    t(
      'Tell a simple story from morning to night.',
      'Расскажите о дне от утра до вечера.',
      'მოყევით მარტივი ამბავი დილიდან საღამომდე.',
    ),
    [
      {
        prompt: t(
          'Say you wake up in the morning.',
          'Скажите, что просыпаетесь утром.',
          'თქვით, რომ დილით იღვიძებთ.',
        ),
        options: ['დილით ვიღვიძებ', 'დილით ვიძინებ', 'დილა შორსაა'],
        correct: 0,
        meaning: t(
          'I wake up in the morning.',
          'Я просыпаюсь утром.',
          'დილით ვიღვიძებ.',
        ),
      },
      {
        prompt: t(
          'Say you drink coffee.',
          'Скажите, что пьёте кофе.',
          'თქვით, რომ ყავას სვამთ.',
        ),
        options: ['ყავას ვსვამ', 'ყავა მტკივა', 'ყავა მიდის'],
        correct: 0,
        meaning: t('I drink coffee.', 'Я пью кофе.', 'ყავას ვსვამ.'),
      },
      {
        prompt: t(
          'Say you return home in the evening.',
          'Скажите, что вечером возвращаетесь домой.',
          'თქვით, რომ საღამოს სახლში ბრუნდებით.',
        ),
        options: [
          'საღამოს სახლში ვბრუნდები',
          'საღამოს ოფისში ვიძინებ',
          'სახლი საღამოა',
        ],
        correct: 0,
        meaning: t(
          'I return home in the evening.',
          'Вечером я возвращаюсь домой.',
          'საღამოს სახლში ვბრუნდები.',
        ),
      },
    ],
  ),

  lesson(
    85,
    15,
    t('Phone essentials', 'Телефон', 'ტელეფონი'),
    t(
      'Handle calls and messages.',
      'Разберитесь со звонками и сообщениями.',
      'მართეთ ზარები და შეტყობინებები.',
    ),
    ['ტელეფონი', 'ნომერი', 'ვურეკავ', 'ვპასუხობ', 'შეტყობინება'],
  ),
  lesson(
    86,
    15,
    t('Internet access', 'Доступ в интернет', 'ინტერნეტთან წვდომა'),
    t(
      'Ask about internet and passwords.',
      'Спросите об интернете и пароле.',
      'იკითხეთ ინტერნეტისა და პაროლის შესახებ.',
    ),
    ['ინტერნეტი', 'პაროლი', 'ვიყენებ', 'ვიცი', 'არ'],
  ),
  lesson(
    87,
    15,
    t('Explain the problem', 'Объясните проблему', 'ახსენით პრობლემა'),
    t(
      'Say what you can and cannot do.',
      'Скажите, что можете и не можете.',
      'თქვით, რისი გაკეთება შეგიძლიათ და არ შეგიძლიათ.',
    ),
    ['შემიძლია', 'ვერ', 'ვცდილობ', 'მესმის', 'არასწორია'],
  ),
  lesson(
    88,
    15,
    t('Ask for service', 'Попросите об услуге', 'ითხოვეთ მომსახურება'),
    t(
      'Ask, show, and receive help.',
      'Спросите, покажите и получите помощь.',
      'იკითხეთ, აჩვენეთ და მიიღეთ დახმარება.',
    ),
    ['ვეკითხები', 'მაჩვენე', 'მითხარი', 'ვიღებ', 'დამეხმარეთ'],
  ),
  spiralReview(
    89,
    15,
    t(
      'Spiral review · Services',
      'Повторение · Услуги',
      'სპირალური გამეორება · სერვისები',
    ),
    t(
      'Digital problems return with work and clarification.',
      'Цифровые вопросы соединяются с работой и уточнением.',
      'ციფრული საკითხები სამუშაოსა და დაზუსტებას უკავშირდება.',
    ),
    [
      'ტელეფონი',
      'ნომერი',
      'ინტერნეტი',
      'პაროლი',
      'ვერ',
      'მესმის',
      'ისევ',
      'ნელა',
      'დამეხმარეთ',
    ],
    [1, 6, 15],
  ),
  mission(
    90,
    15,
    t(
      'Mission · Fix a connection',
      'Миссия · Исправьте соединение',
      'მისია · გაასწორეთ კავშირი',
    ),
    t(
      'Explain the problem and ask for help.',
      'Объясните проблему и попросите помощь.',
      'ახსენით პრობლემა და ითხოვეთ დახმარება.',
    ),
    [
      {
        prompt: t(
          'Say the internet does not work.',
          'Скажите, что интернет не работает.',
          'თქვით, რომ ინტერნეტი არ მუშაობს.',
        ),
        options: [
          'ინტერნეტი არ მუშაობს',
          'ინტერნეტი გემრიელია',
          'ინტერნეტი შორსაა',
        ],
        correct: 0,
        meaning: t(
          'The internet does not work.',
          'Интернет не работает.',
          'ინტერნეტი არ მუშაობს.',
        ),
      },
      {
        prompt: t(
          'Say you do not know the password.',
          'Скажите, что не знаете пароль.',
          'თქვით, რომ პაროლი არ იცით.',
        ),
        options: ['პაროლი არ ვიცი', 'პაროლი მომწონს', 'პაროლი მტკივა'],
        correct: 0,
        meaning: t(
          'I do not know the password.',
          'Я не знаю пароль.',
          'პაროლი არ ვიცი.',
        ),
      },
      {
        prompt: t(
          'Ask for help politely.',
          'Вежливо попросите помощь.',
          'თავაზიანად ითხოვეთ დახმარება.',
        ),
        options: [
          'შეგიძლიათ დამეხმაროთ?',
          'შეგიძლიათ წახვიდეთ?',
          'დახმარება ძვირია?',
        ],
        correct: 0,
        meaning: t(
          'Can you help me?',
          'Вы можете мне помочь?',
          'შეგიძლიათ დამეხმაროთ?',
        ),
      },
    ],
  ),

  lesson(
    91,
    16,
    t('Ask any question', 'Задайте любой вопрос', 'დასვით ნებისმიერი კითხვა'),
    t(
      'Use the question words that unlock conversations.',
      'Используйте ключевые вопросительные слова.',
      'გამოიყენეთ საუბრისთვის საჭირო კითხვითი სიტყვები.',
    ),
    ['ვინ', 'რა', 'სად', 'როდის', 'რატომ'],
  ),
  lesson(
    92,
    16,
    t(
      'Keep control of the conversation',
      'Управляйте разговором',
      'მართეთ საუბარი',
    ),
    t(
      'Ask people to say, show, or repeat.',
      'Попросите сказать, показать или повторить.',
      'სთხოვეთ თქმა, ჩვენება ან გამეორება.',
    ),
    ['თქვი', 'გაიმეორე', 'მაჩვენე', 'მითხარი', 'მომისმინე'],
  ),
  lesson(
    93,
    16,
    t(
      'Act when it matters',
      'Действуйте в важный момент',
      'იმოქმედეთ საჭირო დროს',
    ),
    t(
      'Recognize urgent instructions.',
      'Распознайте срочные указания.',
      'გაიგეთ გადაუდებელი მითითებები.',
    ),
    ['გაჩერდი', 'ფრთხილად', 'საფრთხე', 'პოლიცია', 'ექიმი'],
  ),
  lesson(
    94,
    16,
    t('Speak with confidence', 'Говорите уверенно', 'ისაუბრეთ თავდაჯერებულად'),
    t(
      'Use the language that keeps you independent.',
      'Используйте язык для самостоятельности.',
      'გამოიყენეთ დამოუკიდებლობისთვის საჭირო ენა.',
    ),
    ['ვიცი', 'შემიძლია', 'გავიგე', 'მზად', 'დარწმუნებული'],
  ),
  spiralReview(
    95,
    16,
    t(
      'Final spiral review',
      'Итоговое повторение',
      'საბოლოო სპირალური გამეორება',
    ),
    t(
      'Recall language from the whole survival course.',
      'Вспомните язык из всего курса.',
      'გაიხსენეთ მთელი პრაქტიკული კურსის ენა.',
    ),
    [
      'გამარჯობა',
      'მინდა',
      'სად',
      'რამდენი',
      'ხვალ',
      'მომწონს',
      'მჭირდება',
      'დამეხმარეთ',
      'შემიძლია',
      'გავიგე',
    ],
    [1, 2, 3, 4, 7, 8, 10, 15, 16],
  ),
  mission(
    96,
    16,
    t(
      'Final mission · A day in Georgia',
      'Финальная миссия · День в Грузии',
      'საბოლოო მისია · ერთი დღე საქართველოში',
    ),
    t(
      'Recover, ask, and solve three real situations.',
      'Сориентируйтесь и решите три реальные ситуации.',
      'გაერკვიეთ და მოაგვარეთ სამი რეალური სიტუაცია.',
    ),
    [
      {
        prompt: t(
          'Say you are lost and ask for help.',
          'Скажите, что заблудились, и попросите помощь.',
          'თქვით, რომ დაიკარგეთ და ითხოვეთ დახმარება.',
        ),
        options: ['დავიკარგე, დამეხმარეთ', 'მივდივარ, მადლობა', 'აქ ვცხოვრობ'],
        correct: 0,
        meaning: t(
          'I am lost. Help me.',
          'Я заблудился. Помогите.',
          'დავიკარგე, დამეხმარეთ.',
        ),
      },
      {
        prompt: t(
          'Ask them to repeat more slowly.',
          'Попросите повторить медленнее.',
          'სთხოვეთ, უფრო ნელა გაიმეორონ.',
        ),
        options: [
          'უფრო ნელა გაიმეორეთ, გთხოვთ',
          'სწრაფად წადით',
          'არასდროს გაიმეოროთ',
        ],
        correct: 0,
        meaning: t(
          'Repeat more slowly, please.',
          'Повторите медленнее, пожалуйста.',
          'უფრო ნელა გაიმეორეთ, გთხოვთ.',
        ),
      },
      {
        prompt: t(
          'Say you understand and thank them.',
          'Скажите, что поняли, и поблагодарите.',
          'თქვით, რომ გაიგეთ და მადლობა გადაუხადეთ.',
        ),
        options: ['გავიგე, მადლობა', 'არ მესმის, ბოდიში', 'ვერ, არა'],
        correct: 0,
        meaning: t(
          'I understand. Thank you.',
          'Я понял. Спасибо.',
          'გავიგე, მადლობა.',
        ),
      },
    ],
  ),
];

speakingUnit.push(...advancedSpeakingUnits);
