export type WordEntry = {
  id: string;
  ka: string;
  tr: string;
  en: string;
  ru: string;
};

const rows = `
მე|me|I|я
შენ|shen|you (informal)|ты
თქვენ|tkven|you (formal/plural)|вы
ის|is|he / she / it|он / она / оно
ჩვენ|chven|we|мы
ისინი|isini|they|они
ეს|es|this|это
აქ|ak|here|здесь
იქ|ik|there|там
ჩემი|chemi|my / mine|мой
შენი|sheni|your / yours|твой
მისი|misi|his / her|его / её
ვარ|var|I am|я есть
ხარ|khar|you are|ты есть
არის|aris|is|есть
მაქვს|makvs|I have|у меня есть
გაქვს|gakvs|you have|у тебя есть
აქვს|akvs|has|имеет
და|da|and|и
ან|an|or|или
მაგრამ|magram|but|но
არ|ar|not|не
კი|ki|yes / indeed|да
დიახ|diakh|yes (formal)|да
არა|ara|no|нет
ვინ|vin|who|кто
რა|ra|what|что
სად|sad|where|где
როდის|rodis|when|когда
რატომ|ratom|why|почему
როგორ|rogor|how|как
რომელი|romeli|which|который
რამდენი|ramdeni|how many / much|сколько
ვისი|visi|whose|чей
გამარჯობა|gamarjoba|hello|привет
მადლობა|madloba|thank you|спасибо
გთხოვთ|gtkhovt|please|пожалуйста
ბოდიში|bodishi|sorry / excuse me|извините
კარგი|kargi|good / okay|хорошо
ცუდი|tsudi|bad|плохой
შეიძლება|sheidzleba|possible / may I?|можно
მესმის|mesmis|I understand|я понимаю
ვიცი|vitsi|I know|я знаю
მახსოვს|makhsovs|I remember|я помню
ისევ|isev|again|снова
ნელა|nela|slowly|медленно
სწრაფად|stsrapad|quickly|быстро
სწორია|stsoria|correct|правильно
არასწორია|arastsoria|incorrect|неправильно
დამეხმარეთ|damekhmaret|help me|помогите
მინდა|minda|I want|я хочу
მჭირდება|mchirdeba|I need|мне нужно
მშია|mshia|I am hungry|я голоден
მწყურია|mtsquria|I am thirsty|я хочу пить
მიყვარს|miqvars|I love|я люблю
მომწონს|momtsons|I like|мне нравится
შემიძლია|shemidzlia|I can|я могу
ვერ|ver|cannot|не могу
მივდივარ|mivdivar|I am going|я иду
მოვდივარ|movdivar|I am coming|я прихожу
ვჭამ|vcham|I eat|я ем
ვსვამ|vsvam|I drink|я пью
ვყიდულობ|vqidulob|I am buying|я покупаю
ვიხდი|vikhdi|I am paying|я плачу
ვეძებ|vedzeb|I am looking for|я ищу
ვხედავ|vkhedav|I see|я вижу
ვუსმენ|vusmen|I am listening|я слушаю
ვლაპარაკობ|vlaparakob|I speak|я говорю
ვსწავლობ|vstsavlob|I am learning|я учусь
ვმუშაობ|vmushaob|I work|я работаю
ვცხოვრობ|vtskhovrob|I live|я живу
ველოდები|velodebi|I am waiting|я жду
გავიგე|gavige|I understood|я понял
მოვედი|movedi|I arrived|я пришёл
წავედი|tsavedi|I left / I am off|я ушёл
ადამიანი|adamiani|person|человек
კაცი|katsi|man|мужчина
ქალი|kali|woman|женщина
ბავშვი|bavshvi|child|ребёнок
მეგობარი|megobari|friend|друг
ოჯახი|ojakhi|family|семья
დედა|deda|mother|мать
მამა|mama|father|отец
ძმა|dzma|brother|брат
შვილი|shvili|son / daughter|ребёнок
ქმარი|kmari|husband|муж
ცოლი|tsoli|wife|жена
ბიჭი|bichi|boy|мальчик
გოგო|gogo|girl|девочка
სტუმარი|stumari|guest|гость
მასწავლებელი|mastsavlebeli|teacher|учитель
ექიმი|ekimi|doctor|врач
პოლიციელი|politsieli|police officer|полицейский
მძღოლი|mdzgholi|driver|водитель
სახელი|sakheli|name|имя
წყალი|tsqali|water|вода
პური|puri|bread|хлеб
ყავა|qava|coffee|кофе
ჩაი|chai|tea|чай
რძე|rdze|milk|молоко
შაქარი|shakari|sugar|сахар
მარილი|marili|salt|соль
ხორცი|khortsi|meat|мясо
ქათამი|katami|chicken|курица
თევზი|tevzi|fish|рыба
კვერცხი|kvertskhi|egg|яйцо
ყველი|qveli|cheese|сыр
ბოსტნეული|bostneuli|vegetables|овощи
ხილი|khili|fruit|фрукты
ვაშლი|vashli|apple|яблоко
ბანანი|banani|banana|банан
საჭმელი|sachmeli|food|еда
საუზმე|sauzme|breakfast|завтрак
სადილი|sadili|lunch|обед
ვახშამი|vakhshami|dinner|ужин
სახლი|sakhli|home / house|дом
ოთახი|otakhi|room|комната
ტუალეტი|tualeti|toilet|туалет
აბაზანა|abazana|bathroom|ванная
სასტუმრო|sastumro|hotel|отель
რესტორანი|restorani|restaurant|ресторан
კაფე|kafe|café|кафе
მაღაზია|maghazia|shop|магазин
აფთიაქი|aptiaki|pharmacy|аптека
საავადმყოფო|saavadmqopo|hospital|больница
ბანკი|banki|bank|банк
ბაზარი|bazari|market|рынок
ქუჩა|kucha|street|улица
გზა|gza|road / way|дорога
ქალაქი|kalaki|city|город
სოფელი|sopeli|village|деревня
გაჩერება|gachereba|stop|остановка
სადგური|sadguri|station|вокзал
აეროპორტი|aeroporti|airport|аэропорт
ზღვა|zghva|sea|море
სკოლა|skola|school|школа
უნივერსიტეტი|universiteti|university|университет
ოფისი|opisi|office|офис
პარკი|parki|park|парк
ცენტრი|tsentri|centre|центр
ავტობუსი|avtobusi|bus|автобус
მატარებელი|matarebeli|train|поезд
ტაქსი|taksi|taxi|такси
მანქანა|mankana|car|машина
ველოსიპედი|velosipedi|bicycle|велосипед
ბილეთი|bileti|ticket|билет
მარჯვნივ|marjvniv|right|направо
მარცხნივ|martskhniv|left|налево
პირდაპირ|pirdapir|straight|прямо
ახლოს|akhlos|near|близко
შორს|shors|far|далеко
შიგნით|shignit|inside|внутри
გარეთ|garet|outside|снаружи
ზემოთ|zemot|above / upstairs|наверху
ქვემოთ|kvemot|below / downstairs|внизу
წინ|tsin|ahead / in front|впереди
უკან|ukan|back / behind|назад
შესასვლელი|shesasvleli|entrance|вход
გასასვლელი|gasasvleli|exit|выход
რუკა|ruka|map|карта
ერთი|erti|one|один
ორი|ori|two|два
სამი|sami|three|три
ოთხი|otkhi|four|четыре
ხუთი|khuti|five|пять
ექვსი|ekvsi|six|шесть
შვიდი|shvidi|seven|семь
რვა|rva|eight|восемь
ცხრა|tskhra|nine|девять
ათი|ati|ten|десять
საათი|saati|hour / clock|час
წუთი|tsuti|minute|минута
დილა|dila|morning|утро
შუადღე|shuadghe|noon|полдень
საღამო|saghamo|evening|вечер
ღამე|ghame|night|ночь
დღეს|dghes|today|сегодня
ხვალ|khval|tomorrow|завтра
გუშინ|gushin|yesterday|вчера
ახლა|akhla|now|сейчас
დიდი|didi|big|большой
პატარა|patara|small|маленький
ახალი|akhali|new|новый
ძველი|dzveli|old|старый
ძვირი|dzviri|expensive|дорогой
იაფი|iapi|cheap|дешёвый
ცხელი|tskheli|hot|горячий
ცივი|tsivi|cold|холодный
სუფთა|supta|clean|чистый
ბინძური|bindzuri|dirty|грязный
ადვილი|advili|easy|лёгкий
რთული|rtuli|difficult|сложный
ტელეფონი|teleponi|telephone|телефон
ფული|puli|money|деньги
ბარათი|barati|card|карта
გასაღები|gasaghebi|key|ключ
ტკივილი|tkivili|pain|боль
წამალი|tsamali|medicine|лекарство
პოლიცია|politsia|police|полиция
საფრთხე|saprtkhe|danger|опасность
ვიღვიძებ|vighvidzeb|I wake up|я просыпаюсь
ვდგები|vdgebi|I get up|я встаю
ვიძინებ|vidzineb|I sleep|я засыпаю
ვიბან|viban|I wash myself|я моюсь
ვიცვამ|vitsvam|I get dressed|я одеваюсь
ვხსნი|vkhsni|I open|я открываю
ვკეტავ|vketav|I close / lock|я закрываю
ვიწყებ|vitsqeb|I begin|я начинаю
ვამთავრებ|vamtavreb|I finish|я заканчиваю
ვკითხულობ|vkitkhulob|I read|я читаю
ვწერ|vtser|I write|я пишу
ვურეკავ|vurekav|I call|я звоню
ვპასუხობ|vpasukhob|I answer|я отвечаю
ვეკითხები|vekitkhebi|I ask|я спрашиваю
ვამზადებ|vamzadeb|I prepare|я готовлю
ვაკეთებ|vaketeb|I do / make|я делаю
ვიყენებ|viqeneb|I use|я использую
ვიღებ|vigheb|I take / receive|я беру
ვაძლევ|vadzlev|I give|я даю
ვდგავარ|vdgavar|I am standing|я стою
ვზივარ|vzivar|I am sitting|я сижу
ვბრუნდები|vbrundebi|I return|я возвращаюсь
ვრჩები|vrchebi|I stay|я остаюсь
ვხვდები|vkhvdebi|I understand / realize|я понимаю
ვცდილობ|vtsdilob|I try|я стараюсь
მოდი|modi|come|иди сюда
წადი|tsadi|go|иди
დაჯექი|dajeki|sit down|сядь
ადექი|adeki|stand up|встань
მომეცი|mometsi|give me|дай мне
აიღე|aighe|take it|возьми
ნახე|nakhe|look / see|посмотри
მომისმინე|momismine|listen to me|послушай меня
დამელოდე|damelode|wait for me|подожди меня
გაჩერდი|gacherdi|stop|остановись
გახსენით|gakhsenit|open (polite)|откройте
დაკეტეთ|daketet|close (polite)|закройте
შედი|shedi|enter|входи
გამოდი|gamodi|come outside|выходи
ჭამე|chame|eat|ешь
დალიე|dalie|drink|выпей
თქვი|tkvi|say it|скажи
გაიმეორე|gaimeore|repeat|повтори
დარეკე|dareke|call|позвони
მაჩვენე|machvene|show me|покажи мне
მითხარი|mitkhari|tell me|скажи мне
წამომყევი|tsamomqevi|come with me|иди за мной
ფრთხილად|prtkhilad|carefully / watch out|осторожно
ჩუმად|chumad|quietly|тихо
საკმარისია|sakmarisia|enough|достаточно
საწოლი|satsoli|bed|кровать
მაგიდა|magida|table|стол
სკამი|skami|chair|стул
კარი|kari|door|дверь
ფანჯარა|panjara|window|окно
სამზარეულო|samzareulo|kitchen|кухня
მაცივარი|matsivari|refrigerator|холодильник
ღუმელი|ghumeli|oven / stove|духовка
ჭიქა|chika|glass|стакан
ფინჯანი|pinjani|cup|чашка
თეფში|tepshi|plate|тарелка
კოვზი|kovzi|spoon|ложка
ჩანგალი|changali|fork|вилка
დანა|dana|knife|нож
ბოთლი|botli|bottle|бутылка
პირსახოცი|pirsakhotsi|towel|полотенце
საპონი|saponi|soap|мыло
ჯაგრისი|jagrisi|brush|щётка
კბილისპასტა|kbilispasta|toothpaste|зубная паста
სარკე|sarke|mirror|зеркало
შუქი|shuki|light|свет
კედელი|kedeli|wall|стена
იატაკი|iataki|floor|пол
ლიფტი|lipti|elevator|лифт
კიბე|kibe|stairs|лестница
ღვინო|ghvino|wine|вино
ლუდი|ludi|beer|пиво
წვენი|tsveni|juice|сок
სუპი|supi|soup|суп
ბრინჯი|brinji|rice|рис
კარტოფილი|kartopili|potato|картофель
პომიდორი|pomidori|tomato|помидор
კიტრი|kitri|cucumber|огурец
ხახვი|khakhvi|onion|лук
ნიორი|niori|garlic|чеснок
ლობიო|lobio|beans|фасоль
სალათი|salati|salad|салат
მაკარონი|makaroni|pasta|макароны
ნამცხვარი|namtskhvari|cake / pastry|пирожное
შოკოლადი|shokoladi|chocolate|шоколад
ნაყინი|naqini|ice cream|мороженое
კარაქი|karaki|butter|масло
ზეთი|zeti|oil|растительное масло
თაფლი|tapli|honey|мёд
ლიმონი|limoni|lemon|лимон
ფორთოხალი|portokhali|orange|апельсин
ყურძენი|qurdzeni|grapes|виноград
მარწყვი|martsqvi|strawberry|клубника
ატამი|atami|peach|персик
საზამთრო|sazamtro|watermelon|арбуз
თავი|tavi|head|голова
ხელი|kheli|hand / arm|рука
ფეხი|pekhi|foot / leg|нога
თვალი|tvali|eye|глаз
ყური|quri|ear|ухо
ცხვირი|tskhviri|nose|нос
პირი|piri|mouth|рот
კბილი|kbili|tooth|зуб
ყელი|qeli|throat / neck|горло
გული|guli|heart|сердце
მუცელი|mutseli|stomach|живот
ზურგი|zurgi|back|спина
სისხლი|siskhli|blood|кровь
ცხელება|tskheleba|fever|температура
ხველა|khvela|cough|кашель
გაციება|gatsieba|cold / illness|простуда
ჭრილობა|chriloba|wound|рана
ავად|avad|sick|болен
ჯანმრთელი|janmrteli|healthy|здоровый
დაღლილი|daghlili|tired|уставший
სუსტი|susti|weak|слабый
მტკივა|mtkiva|it hurts|мне больно
ვახველებ|vakhveleb|I am coughing|я кашляю
მცივა|mtsiva|I feel cold|мне холодно
მცხელა|mtskhela|I feel hot|мне жарко
ტანსაცმელი|tansatsmeli|clothing|одежда
პერანგი|perangi|shirt|рубашка
მაისური|maisuri|T-shirt|футболка
შარვალი|sharvali|trousers|брюки
კაბა|kaba|dress|платье
ქურთუკი|kurtuki|jacket|куртка
ფეხსაცმელი|pekhsatsmeli|shoes|обувь
წინდა|tsinda|sock|носок
ქუდი|kudi|hat|шапка
ჩანთა|chanta|bag|сумка
საფულე|sapule|wallet|кошелёк
ქოლგა|kolga|umbrella|зонт
ზომა|zoma|size|размер
ფასი|pasi|price|цена
ფასდაკლება|pasdakleba|discount|скидка
ქვითარი|kvitari|receipt|чек
ნაღდი|naghdi|cash|наличные
ხურდა|khurda|change / coins|сдача
იყიდება|iqideba|for sale|продаётся
ღირს|ghirs|costs / is worth|стоит
მოვიზომავ|movizomav|I will try it on|я примерю
შესაფერისი|shesaperisi|suitable|подходящий
ვიწრო|vitsro|narrow / tight|узкий
გრძელი|grdzeli|long|длинный
მოკლე|mokle|short|короткий
მზე|mze|sun|солнце
წვიმა|tsvima|rain|дождь
თოვლი|tovli|snow|снег
ქარი|kari|wind|ветер
ღრუბელი|ghrubeli|cloud|облако
ამინდი|amindi|weather|погода
ცხელა|tskhela|it is hot|жарко
ცივა|tsiva|it is cold|холодно
წვიმს|tsvims|it is raining|идёт дождь
თოვს|tovs|it is snowing|идёт снег
მთვარე|mtvare|moon|луна
ცა|tsa|sky|небо
მთა|mta|mountain|гора
მდინარე|mdinare|river|река
ტბა|tba|lake|озеро
ტყე|tqe|forest|лес
ხე|khe|tree|дерево
ყვავილი|qvavili|flower|цветок
ბალახი|balakhi|grass|трава
ცხოველი|tskhoveli|animal|животное
ძაღლი|dzaghli|dog|собака
კატა|kata|cat|кошка
ჩიტი|chiti|bird|птица
წვიმიანი|tsvimiani|rainy|дождливый
მზიანი|mziani|sunny|солнечный
ბედნიერი|bednieri|happy|счастливый
მოწყენილი|motsqenili|sad|грустный
გაბრაზებული|gabrazebuli|angry|злой
შეშინებული|sheshinebuli|frightened|испуганный
დამშვიდდი|damshviddi|calm down|успокойся
დაკავებული|dakavebuli|busy|занятый
თავისუფალი|tavisupali|free / available|свободный
მზად|mzad|ready|готов
დარწმუნებული|dartsmunebuli|sure / confident|уверенный
მნიშვნელოვანი|mnishvnelovani|important|важный
საინტერესო|saintereso|interesting|интересный
სასაცილო|sasatsilo|funny|смешной
ადრე|adre|early / before|рано
გვიან|gvian|late|поздно
ერთად|ertad|together|вместе
მარტო|marto|alone / only|один
ყოველთვის|qoveltvis|always|всегда
არასდროს|arasdros|never|никогда
ხშირად|khshirad|often|часто
ზოგჯერ|zogjer|sometimes|иногда
ინტერნეტი|interneti|internet|интернет
პაროლი|paroli|password|пароль
შეტყობინება|shetqobineba|message / notification|сообщение
მისამართი|misamarti|address|адрес
ნომერი|nomeri|number / room number|номер
`;

export const wordLibrary: WordEntry[] = rows
  .trim()
  .split('\n')
  .map((row, index) => {
    const [ka, tr, en, ru] = row.split('|');
    return {
      id: `word-${String(index + 1).padStart(3, '0')}`,
      ka,
      tr,
      en,
      ru,
    };
  });
