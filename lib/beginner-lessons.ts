export type LessonLocale = 'en' | 'ru' | 'ka';

type LocalizedText = Record<LessonLocale, string>;

export type BeginnerLesson = {
  number: number;
  title: LocalizedText;
  outcome: LocalizedText;
  preview: LocalizedText;
  words: string[];
  previewWords?: Array<{
    ka: string;
    tr: string;
    en: string;
    ru: string;
  }>;
  minutes: number;
};

export const beginnerLessons: BeginnerLesson[] = [
  {
    number: 1,
    title: {
      en: 'Your first Georgian words',
      ru: 'Первые слова по-грузински',
      ka: 'პირველი ქართული სიტყვები',
    },
    outcome: {
      en: 'Greet someone, be polite, and react naturally.',
      ru: 'Поздоровайтесь, будьте вежливы и отвечайте естественно.',
      ka: 'მიესალმეთ, იყავით თავაზიანი და ბუნებრივად უპასუხეთ.',
    },
    preview: {
      en: 'გამარჯობა · Hello',
      ru: 'გამარჯობა · Привет',
      ka: 'გამარჯობა · მისალმება',
    },
    words: [
      'გამარჯობა',
      'დილა მშვიდობისა',
      'კარგი',
      'მადლობა',
      'გთხოვთ',
      'კი',
      'არა',
      'გემრიელია',
      'ნახვამდის',
      'ბოდიში',
    ],
    previewWords: [
      { ka: 'გამარჯობა', tr: 'gamarjoba', en: 'hello', ru: 'привет' },
      {
        ka: 'დილა მშვიდობისა',
        tr: 'dila mshvidobisa',
        en: 'good morning',
        ru: 'доброе утро',
      },
      { ka: 'კარგი', tr: 'kargi', en: 'good', ru: 'хорошо' },
      { ka: 'მადლობა', tr: 'madloba', en: 'thank you', ru: 'спасибо' },
      { ka: 'გთხოვთ', tr: 'gtkhovt', en: 'please', ru: 'пожалуйста' },
      { ka: 'კი', tr: 'ki', en: 'yes', ru: 'да' },
      { ka: 'არა', tr: 'ara', en: 'no', ru: 'нет' },
      {
        ka: 'გემრიელია',
        tr: 'gemrielia',
        en: "it's delicious",
        ru: 'вкусно',
      },
      { ka: 'ნახვამდის', tr: 'nakhvamdis', en: 'goodbye', ru: 'до свидания' },
      { ka: 'ბოდიში', tr: 'bodishi', en: 'sorry / excuse me', ru: 'извините' },
    ],
    minutes: 8,
  },
  {
    number: 2,
    title: {
      en: 'Me, you, and how are you?',
      ru: 'Я, ты и «как дела?»',
      ka: 'მე, შენ და „როგორ ხარ?“',
    },
    outcome: {
      en: 'Introduce people and build your first short exchange.',
      ru: 'Назовите участников и составьте первый короткий диалог.',
      ka: 'დაასახელეთ ადამიანები და ააწყვეთ პირველი მოკლე დიალოგი.',
    },
    preview: {
      en: 'როგორ ხარ? · How are you?',
      ru: 'როგორ ხარ? · Как дела?',
      ka: 'როგორ ხარ? · მოკლე კითხვა',
    },
    words: [
      'მე',
      'შენ',
      'ის',
      'ჩვენ',
      'თქვენ',
      'არიან',
      'ვარ',
      'ხარ',
      'არის',
      'როგორ',
    ],
    previewWords: [
      { ka: 'მე', tr: 'me', en: 'I / me', ru: 'я' },
      { ka: 'შენ', tr: 'shen', en: 'you (informal)', ru: 'ты' },
      { ka: 'ის', tr: 'is', en: 'he / she', ru: 'он / она' },
      { ka: 'ჩვენ', tr: 'chven', en: 'we', ru: 'мы' },
      { ka: 'თქვენ', tr: 'tkven', en: 'you (formal / plural)', ru: 'вы' },
      { ka: 'არიან', tr: 'arian', en: 'they are', ru: 'они' },
      { ka: 'ვარ', tr: 'var', en: 'I am', ru: 'я есть' },
      { ka: 'ხარ', tr: 'khar', en: 'you are', ru: 'ты есть' },
      { ka: 'არის', tr: 'aris', en: 'is / it is', ru: 'есть' },
      { ka: 'როგორ', tr: 'rogor', en: 'how', ru: 'как' },
    ],
    minutes: 9,
  },
  {
    number: 3,
    title: {
      en: 'Say what you want',
      ru: 'Скажите, чего вы хотите',
      ka: 'თქვით, რა გინდათ',
    },
    outcome: {
      en: 'Ask for water, food, coffee, or help in one useful pattern.',
      ru: 'Попросите воду, еду, кофе или помощь по одной простой схеме.',
      ka: 'ერთი მარტივი ფორმით ითხოვეთ წყალი, საჭმელი, ყავა ან დახმარება.',
    },
    preview: {
      en: 'წყალი მინდა · I want water',
      ru: 'წყალი მინდა · Я хочу воды',
      ka: 'წყალი მინდა · მარტივი თხოვნა',
    },
    words: [
      'მინდა',
      'მჭირდება',
      'წყალი',
      'საჭმელი',
      'ყავა',
      'ჩაი',
      'დახმარება',
      'მშია',
      'მწყურია',
      'კიდევ',
    ],
    previewWords: [
      { ka: 'მინდა', tr: 'minda', en: 'I want', ru: 'я хочу' },
      { ka: 'მჭირდება', tr: 'mchirdeba', en: 'I need', ru: 'мне нужно' },
      { ka: 'წყალი', tr: 'tsqali', en: 'water', ru: 'вода' },
      { ka: 'საჭმელი', tr: 'sachmeli', en: 'food', ru: 'еда' },
      { ka: 'ყავა', tr: 'qava', en: 'coffee', ru: 'кофе' },
      { ka: 'ჩაი', tr: 'chai', en: 'tea', ru: 'чай' },
      { ka: 'დახმარება', tr: 'dakhmareba', en: 'help', ru: 'помощь' },
      { ka: 'მშია', tr: 'mshia', en: 'I am hungry', ru: 'я голоден / голодна' },
      { ka: 'მწყურია', tr: 'mtsquria', en: 'I am thirsty', ru: 'я хочу пить' },
      { ka: 'კიდევ', tr: 'kidev', en: 'more / again', ru: 'ещё' },
    ],
    minutes: 8,
  },
  {
    number: 4,
    title: { en: 'Find your way', ru: 'Найдите дорогу', ka: 'გაიკვლიეთ გზა' },
    outcome: {
      en: 'Understand here, there, left, right, near, and far.',
      ru: 'Поймите: здесь, там, налево, направо, близко и далеко.',
      ka: 'გაიგეთ: აქ, იქ, მარცხნივ, მარჯვნივ, ახლოს და შორს.',
    },
    preview: {
      en: 'სად არის? · Where is it?',
      ru: 'სად არის? · Где это?',
      ka: 'სად არის? · მიმართულება',
    },
    words: [
      'სად',
      'აქ',
      'იქ',
      'მარცხნივ',
      'მარჯვნივ',
      'პირდაპირ',
      'ახლოს',
      'შორს',
    ],
    minutes: 9,
  },
  {
    number: 5,
    title: {
      en: 'Buy and pay',
      ru: 'Покупайте и платите',
      ka: 'იყიდეთ და გადაიხადეთ',
    },
    outcome: {
      en: 'Ask the price and choose cash or card.',
      ru: 'Узнайте цену и выберите наличные или карту.',
      ka: 'იკითხეთ ფასი და აირჩიეთ ნაღდი ან ბარათი.',
    },
    preview: {
      en: 'რა ღირს? · How much?',
      ru: 'რა ღირს? · Сколько стоит?',
      ka: 'რა ღირს? · ფასის კითხვა',
    },
    words: [
      'ფასი',
      'ფული',
      'ბარათი',
      'ნაღდი',
      'იაფი',
      'ძვირი',
      'ყიდვა',
      'გაყიდვა',
    ],
    minutes: 8,
  },
  {
    number: 6,
    title: { en: 'At a café', ru: 'В кафе', ka: 'კაფეში' },
    outcome: {
      en: 'Order a simple meal and respond to the server.',
      ru: 'Закажите простую еду и ответьте официанту.',
      ka: 'შეუკვეთეთ მარტივი საჭმელი და უპასუხეთ მიმტანს.',
    },
    preview: {
      en: 'ყავა, გთხოვთ · Coffee, please',
      ru: 'ყავა, გთხოვთ · Кофе, пожалуйста',
      ka: 'ყავა, გთხოვთ · შეკვეთა',
    },
    words: [
      'მენიუ',
      'პური',
      'ყავა',
      'ჩაი',
      'რძე',
      'შაქარი',
      'ანგარიში',
      'გემრიელია',
    ],
    minutes: 10,
  },
  {
    number: 7,
    title: { en: 'Meet people', ru: 'Знакомьтесь', ka: 'გაიცანით ადამიანები' },
    outcome: {
      en: 'Share your name, home, work, and who you are with.',
      ru: 'Расскажите, как вас зовут, где вы живёте и работаете.',
      ka: 'თქვით თქვენი სახელი, საცხოვრებელი, სამუშაო და ვისთან ხართ.',
    },
    preview: {
      en: 'მე მქვია… · My name is…',
      ru: 'მე მქვია… · Меня зовут…',
      ka: 'მე მქვია… · გაცნობა',
    },
    words: [
      'სახელი',
      'მეგობარი',
      'ოჯახი',
      'ვცხოვრობ',
      'ვმუშაობ',
      'ქალაქი',
      'ქვეყანა',
      'ერთად',
    ],
    minutes: 10,
  },
  {
    number: 8,
    title: { en: 'Time and plans', ru: 'Время и планы', ka: 'დრო და გეგმები' },
    outcome: {
      en: 'Make simple plans for today and tomorrow.',
      ru: 'Составляйте простые планы на сегодня и завтра.',
      ka: 'შეადგინეთ მარტივი გეგმები დღესა და ხვალისთვის.',
    },
    preview: {
      en: 'ხვალ შევხვდებით · See you tomorrow',
      ru: 'ხვალ შევხვდებით · Увидимся завтра',
      ka: 'ხვალ შევხვდებით · გეგმა',
    },
    words: [
      'დღეს',
      'ხვალ',
      'გუშინ',
      'ახლა',
      'დილა',
      'საღამო',
      'როდის',
      'საათი',
    ],
    minutes: 9,
  },
  {
    number: 9,
    title: { en: 'Get help', ru: 'Получите помощь', ka: 'მიიღეთ დახმარება' },
    outcome: {
      en: 'Handle an urgent health or safety situation.',
      ru: 'Объяснитесь в срочной ситуации со здоровьем или безопасностью.',
      ka: 'იმოქმედეთ ჯანმრთელობის ან უსაფრთხოების გადაუდებელ სიტუაციაში.',
    },
    preview: {
      en: 'დამეხმარეთ · Help me',
      ru: 'დამეხმარეთ · Помогите',
      ka: 'დამეხმარეთ · დახმარება',
    },
    words: [
      'დახმარება',
      'ექიმი',
      'აფთიაქი',
      'ტკივილი',
      'საფრთხე',
      'პოლიცია',
      'სასწრაფო',
      'ავად',
    ],
    minutes: 9,
  },
  {
    number: 10,
    title: {
      en: 'Your first real conversation',
      ru: 'Ваш первый настоящий разговор',
      ka: 'თქვენი პირველი რეალური საუბარი',
    },
    outcome: {
      en: 'Combine greetings, introductions, requests, directions, and thanks.',
      ru: 'Соедините приветствие, знакомство, просьбу, маршрут и благодарность.',
      ka: 'შეაერთეთ მისალმება, გაცნობა, თხოვნა, მიმართულება და მადლობა.',
    },
    preview: {
      en: 'Ready to speak · 1–9 review',
      ru: 'Готовы говорить · повтор 1–9',
      ka: 'საუბრისთვის მზად · 1–9 გამეორება',
    },
    words: [
      'გამარჯობა',
      'მე',
      'მინდა',
      'სად',
      'ფასი',
      'გთხოვთ',
      'მადლობა',
      'ნახვამდის',
    ],
    minutes: 12,
  },
];
