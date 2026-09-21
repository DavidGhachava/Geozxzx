export type SpeakingLocale = 'en' | 'ru' | 'ka';
export type LocalizedCourseText = Record<SpeakingLocale, string>;

export type SpeakingScenario = {
  prompt: LocalizedCourseText;
  options: string[];
  correct: number;
  meaning: LocalizedCourseText;
};

export type SpeakingStep = {
  number: number;
  unit: number;
  kind: 'lesson' | 'review' | 'scenario' | 'mission';
  title: LocalizedCourseText;
  subtitle: LocalizedCourseText;
  minutes: number;
  words: string[];
  scenarios?: SpeakingScenario[];
  reviewFrom?: number[];
};

const localized = (
  en: string,
  ru: string,
  ka: string,
): LocalizedCourseText => ({ en, ru, ka });

export const SPEAKING_UNIT_COUNT = 16;
export const SPEAKING_STEPS_PER_UNIT = 6;
export const SPEAKING_STEP_COUNT = 96;
export const SPEAKING_COURSE_WORD_COUNT = 253;
export const SPEAKING_SCENARIO_COUNT = 51;

export const speakingUnitTitles: Record<number, LocalizedCourseText> = {
  1: localized('First conversations', 'Первые разговоры', 'პირველი საუბრები'),
  2: localized('Café confidence', 'Уверенно в кафе', 'თავდაჯერებულად კაფეში'),
  3: localized(
    'Shop with confidence',
    'Покупки без стресса',
    'ყიდვა თავდაჯერებულად',
  ),
  4: localized('Find your way', 'Найдите дорогу', 'გაიკვლიეთ გზა'),
  5: localized('Home and neighbours', 'Дом и соседи', 'სახლი და მეზობლები'),
  6: localized(
    'Work and services',
    'Работа и услуги',
    'სამსახური და სერვისები',
  ),
  7: localized(
    'Health and pharmacy',
    'Здоровье и аптека',
    'ჯანმრთელობა და აფთიაქი',
  ),
  8: localized('Friends and plans', 'Друзья и планы', 'მეგობრები და გეგმები'),
  9: localized(
    'Weather and small talk',
    'Погода и беседа',
    'ამინდი და მცირე საუბარი',
  ),
  10: localized('Time and schedules', 'Время и расписание', 'დრო და განრიგი'),
  11: localized(
    'Travel and accommodation',
    'Поездки и жильё',
    'მოგზაურობა და საცხოვრებელი',
  ),
  12: localized(
    'Describe and choose',
    'Опишите и выберите',
    'აღწერეთ და აირჩიეთ',
  ),
  13: localized('People and family', 'Люди и семья', 'ადამიანები და ოჯახი'),
  14: localized(
    'Your daily routine',
    'Ваш распорядок дня',
    'თქვენი ყოველდღიური რუტინა',
  ),
  15: localized(
    'Phone and services',
    'Телефон и услуги',
    'ტელეფონი და სერვისები',
  ),
  16: localized(
    'Speak independently',
    'Говорите самостоятельно',
    'ისაუბრეთ დამოუკიდებლად',
  ),
};

export const speakingUnitOutcomes: Record<number, LocalizedCourseText> = {
  1: localized(
    'Start and repair a conversation',
    'Начать и поддержать разговор',
    'საუბრის დაწყება და გაგრძელება',
  ),
  2: localized(
    'Order and pay without switching language',
    'Заказать и оплатить без смены языка',
    'შეკვეთა და გადახდა ენის შეცვლის გარეშე',
  ),
  3: localized(
    'Find, choose, and buy essentials',
    'Найти, выбрать и купить нужное',
    'საჭირო ნივთების პოვნა, არჩევა და ყიდვა',
  ),
  4: localized(
    'Ask directions and use transport',
    'Спросить дорогу и воспользоваться транспортом',
    'გზის კითხვა და ტრანსპორტით სარგებლობა',
  ),
  5: localized(
    'Handle everyday life at home',
    'Решать бытовые вопросы дома',
    'ყოველდღიური საკითხების მოგვარება სახლში',
  ),
  6: localized(
    'Arrange work and service tasks',
    'Организовать рабочие и бытовые дела',
    'სამუშაოსა და სერვისების ორგანიზება',
  ),
  7: localized(
    'Explain a basic health problem',
    'Объяснить простую проблему со здоровьем',
    'ჯანმრთელობის მარტივი პრობლემის ახსნა',
  ),
  8: localized(
    'Make social plans naturally',
    'Естественно договориться о встрече',
    'შეხვედრის ბუნებრივად დაგეგმვა',
  ),
  9: localized(
    'Make friendly small talk',
    'Поддержать дружескую беседу',
    'მეგობრული მცირე საუბარი',
  ),
  10: localized(
    'Understand and arrange times',
    'Понять и назначить время',
    'დროის გაგება და შეთანხმება',
  ),
  11: localized(
    'Travel and check in independently',
    'Путешествовать и заселиться самостоятельно',
    'მოგზაურობა და დამოუკიდებლად განთავსება',
  ),
  12: localized(
    'Compare things and express a choice',
    'Сравнить и выразить выбор',
    'შედარება და არჩევანის გამოხატვა',
  ),
  13: localized(
    'Talk about people close to you',
    'Рассказать о близких людях',
    'ახლობელ ადამიანებზე საუბარი',
  ),
  14: localized(
    'Describe a normal day',
    'Описать обычный день',
    'ჩვეულებრივი დღის აღწერა',
  ),
  15: localized(
    'Solve phone and internet problems',
    'Решать проблемы с телефоном и интернетом',
    'ტელეფონისა და ინტერნეტის პრობლემების მოგვარება',
  ),
  16: localized(
    'Combine your Georgian in real situations',
    'Объединить грузинский в реальных ситуациях',
    'ქართული რეალურ სიტუაციებში გამოიყენოთ',
  ),
};

export const speakingUnitNumbers = Array.from(
  { length: SPEAKING_UNIT_COUNT },
  (_, index) => index + 1,
);

export const unitForSpeakingStep = (stepNumber: number) =>
  Math.min(
    SPEAKING_UNIT_COUNT,
    Math.max(1, Math.ceil(stepNumber / SPEAKING_STEPS_PER_UNIT)),
  );
