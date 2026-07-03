/*
 * pureFM landing - движок теста: роль, грейд и вилка по ответам на жаргоне.
 * Единый источник истины: грузится и в node (require, для calibrate.js),
 * и в браузере классическим <script src="engine.js"> по file://.
 */
(function (root) {
  'use strict';

  // Роли рынка high-risk payments. pos - позиция на шкале зарплат (0..100),
  // вход слева, топ справа. Названия под реальные findable-вакансии (PSP, мерч, iGaming).
  var ROLES = {
    support: {
      title: 'Специалист поддержки платежей',
      salary: '$1-2к',
      level: 'вход',
      pos: 5,
      short: 'Поддержка',
      search: 'специалист поддержки платежей, payment support, monitoring, техподдержка финтех',
      org: 'PSP / процессинг',
      reqs: ['опыт поддержки или мониторинга платежей', 'внимательность к статусам и холдам', 'английский на чтение'],
      terms: ['заявки', 'статусы', 'холды', 'мониторинг', 'эскалации'],
      summary: 'Твой уверенный вход это операционная поддержка потока. Заявки, статусы, холды, споры, ночной мониторинг. Ценят тех, кто быстро видит где именно сломался платёж.',
      gaps: ['английский для рабочих чатов', 'таблицы и базовый Excel', 'описать свои кейсы без серых деталей']
    },
    settlement: {
      title: 'Финансовый менеджер / Reconciliation',
      salary: '$2-3к',
      level: 'среднее',
      pos: 15,
      short: 'Финансы',
      search: 'финансовый менеджер, финансовый аналитик, reconciliation, расчёты в PSP',
      org: 'PSP / финансы',
      reqs: ['опыт сверки и работы с выгрузками', 'уверенный Excel или Google Sheets', 'понимание баланса вход-выход'],
      terms: ['сверка', 'баланс', 'хвосты', 'reconciliation', 'отчёт'],
      summary: 'Ты видишь деньги после заявки: что дошло, что зависло, где хвост, почему баланс не сходится. На найме это финансовый менеджер и reconciliation в PSP, дальше казначейство.',
      gaps: ['Excel и Google Sheets на уверенном уровне', 'база accounting-терминов', 'структура daily-отчёта']
    },
    compliance: {
      title: 'Compliance / KYC-менеджер',
      salary: '$2-4к',
      level: 'среднее',
      pos: 22,
      short: 'Compliance',
      search: 'compliance officer, KYC, AML specialist, комплаенс менеджер',
      org: 'PSP / compliance',
      reqs: ['база 115-ФЗ и AML', 'опыт проверок и онбординга', 'умение читать регуляторку'],
      terms: ['115-ФЗ', 'AML', 'KYC', 'онбординг', 'проверки'],
      summary: 'Ты по опыту знаешь где прилетает 115 и 161, какие доки и проверки закрывают вопрос. Это переводится в compliance и KYC: онбординг, проверки, чтение регуляторки.',
      gaps: ['AML-basics терминами найма', 'читать и применять регуляторку', 'описать правила без палевных схем']
    },
    ops: {
      title: 'Payment Manager',
      salary: '$2.5-5к',
      level: 'среднее',
      pos: 32,
      short: 'Payments',
      search: 'payment manager, менеджер по платежам, payment operations, PSP operations',
      org: 'PSP / платежи',
      reqs: ['опыт управления платёжным потоком', 'понимание каскада и конверсии', 'работа с провайдерами'],
      terms: ['каскад', 'конверсия', 'провайдеры', 'SR', 'инциденты'],
      summary: 'Твой опыт про управление потоком: каскад, конверсия, провайдеры, инциденты, ручные решения под риск. Это уже язык payment operations, и на рынке идёт как менеджерский.',
      gaps: ['метрики SR и конверсии словами найма', 'база про API и H2H', 'английский для переписки с провайдерами']
    },
    kam: {
      title: 'Key Account Manager',
      salary: '$2.5-5к',
      level: 'среднее',
      pos: 40,
      short: 'KAM',
      search: 'key account manager, менеджер по работе с клиентами, account manager fintech',
      org: 'High-risk мерч',
      reqs: ['опыт работы с контрагентами', 'удержание и рост оборота', 'переговоры и CRM'],
      terms: ['клиенты', 'оборот', 'удержание', 'переговоры', 'CRM'],
      summary: 'Ты умеешь вести людей и обороты: удерживать контрагентов, растить объём, гасить конфликты. На стороне PSP и мерча это Key Account и partner-management.',
      gaps: ['дисциплина CRM и Jira', 'английский для переговоров', 'считать LTV и удержание клиента']
    },
    risk: {
      title: 'Risk / Antifraud-аналитик',
      salary: '$3-6к',
      level: 'среднее',
      pos: 50,
      short: 'Risk',
      search: 'риск аналитик, anti-fraud specialist, fraud analyst, антифрод, transaction monitoring',
      org: 'PSP / антифрод',
      reqs: ['опыт в антифроде или риск-мониторинге', 'чтение подозрительных паттернов', 'SQL как плюс'],
      terms: ['антифрод', 'паттерны', 'связки', 'chargeback', 'правила'],
      summary: 'Твой актив это чтение подозрительных паттернов: связки, повторные реквизиты, поведение, chargeback-логика, где сядет блок. Это вход в risk-мониторинг и антифрод.',
      gaps: ['базовый SQL как усилитель', 'chargeback-терминология', 'оформить правила без спалённых деталей']
    },
    integration: {
      title: 'Integration Manager',
      salary: '$3-6к',
      level: 'среднее',
      pos: 58,
      short: 'Интеграции',
      search: 'integration manager, technical account manager, менеджер по интеграциям',
      org: 'PSP / интеграции',
      reqs: ['понимание API и H2H', 'постановка задач разработке', 'чтение JSON и логов'],
      terms: ['H2H', 'API', 'JSON', 'интеграции', 'приёмка'],
      summary: 'Ты технический мост: H2H, API, постановка задач разрабам, приёмка и боевой запуск. На найме это Integration и technical account management.',
      gaps: ['читать API-доки и JSON спокойно', 'базовый SQL', 'английский для тех-переписки']
    },
    bdm: {
      title: 'BDM / менеджер по развитию',
      salary: '$3-7к+%',
      level: 'среднее',
      pos: 66,
      short: 'BDM',
      search: 'менеджер по развитию бизнеса, business development, sales manager финтех, партнёрства',
      org: 'High-risk / iGaming',
      reqs: ['опыт продаж или развития бизнеса', 'сеть контактов в индустрии', 'переговоры и питч'],
      terms: ['продажи', 'мерчи', 'трафик', 'партнёрства', 'growth'],
      summary: 'У тебя коммерческий профиль: договариваться, приводить оборот, не путать красивую комсу с живым трафиком. Это заходит в sales, BDM и partner growth, часто с процентом сверху.',
      gaps: ['воронка продаж на языке отчёта', 'английский для питча', 'упаковать свою сеть контактов легально']
    },
    head: {
      title: 'Head of Payments',
      salary: '$5-12к',
      level: 'топ',
      pos: 90,
      short: 'Head',
      search: 'head of payments, руководитель платежей, payments lead',
      org: 'PSP группа',
      reqs: ['опыт руководства платёжным направлением', 'ownership: люди, PnL, провайдеры', 'английский upper'],
      terms: ['ownership', 'PnL', 'каскад', 'банки', 'стратегия'],
      summary: 'У тебя был реальный ownership: люди, деньги, каскад, провайдеры, переговоры с банками, решения под риск на тебе. Это уровень Head. Решает не стаж, а способность вести всё это уверенно и на их языке.',
      gaps: ['английский upper для переговоров', 'финансовая отчётность на уровне P&L', 'кейсы ownership словами найма, без серых имён']
    }
  };

  // Порядок ролей для карты (по зарплате, вход к топу)
  var ROLE_ORDER = ['support', 'settlement', 'compliance', 'ops', 'kam', 'risk', 'integration', 'bdm', 'head'];

  /*
   * Вопросы. Каждый ответ:
   *  r  - веса ролям
   *  g  - сигналы грейда: vol (объём), own (управление людьми),
   *       neg (переговоры), dep (глубина методов), eng (английский), yrs (опыт)
   * По умолчанию один ответ (radio). Если у вопроса multi:true - можно
   * отметить несколько (checkbox), веса всех выбранных суммируются.
   */
  var QUESTIONS = [
    {
      kicker: 'Бэкграунд',
      q: 'Чем ты реально занимался? Можно отметить несколько.',
      multi: true,
      a: [
        { t: 'Крутил P2P сам: методы, карты, круги, курсы', r: { settlement: 2, ops: 1, risk: 1 }, g: { dep: 1 } },
        { t: 'Сидел на саппорте площадки или обменника: тикеты, статусы, споры', r: { support: 3 }, g: {} },
        { t: 'Держал связки и дропов, вёл контрагентов', r: { kam: 2, compliance: 1, risk: 1 }, g: {} },
        { t: 'Заводил трафик и мерчей, договаривался по условиям', r: { bdm: 2, kam: 1, ops: 1 }, g: { neg: 1 } },
        { t: 'Техчасть: H2H, API, интеграции, ставил задачи разрабам', r: { integration: 3 }, g: { dep: 1 } }
      ]
    },
    {
      kicker: 'Объём',
      q: 'Какой объём ты крутил в сутки?',
      a: [
        { t: 'до 500к в сутки', r: { support: 1, settlement: 1 }, g: { vol: 1 } },
        { t: '500к - 2 млн в сутки', r: { settlement: 1, ops: 1 }, g: { vol: 2 } },
        { t: '2 - 10 млн в сутки', r: { ops: 1, settlement: 1 }, g: { vol: 3 } },
        { t: 'больше 10 млн, поток нескольких проектов', r: { ops: 2 }, g: { vol: 3 } }
      ]
    },
    {
      kicker: 'Сверка',
      q: 'Сводил, сколько прошло по ЛК и сколько из этого прибыль?',
      a: [
        { t: 'Да, каждый день: оборот, остаток, где потери', r: { settlement: 3 }, g: { dep: 1 } },
        { t: 'Считал прибыль, но без детальной сверки оборота', r: { settlement: 1, support: 1 }, g: {} },
        { t: 'Вёл это по нескольким ЛК и площадкам разом', r: { settlement: 2, ops: 1 }, g: { vol: 1 } },
        { t: 'Этим занимался не я', r: {}, g: {} }
      ]
    },
    {
      kicker: 'Каскад',
      q: 'Когда умирал банк или ЛК, что делал ты? Можно отметить несколько.',
      multi: true,
      a: [
        { t: 'Перекидывал траф на другие ЛК и устройства, поток не падал', r: { ops: 3 }, g: { dep: 1 } },
        { t: 'Смотрел у кого сегодня живёт SR, туда и гнал', r: { ops: 2 }, g: {} },
        { t: 'Включал альтернативные методы', r: { ops: 2, integration: 1 }, g: {} },
        { t: 'Отрубал слабый канал по просадке, вёл свою логику маршрута', r: { ops: 2, risk: 1 }, g: { dep: 1 } },
        { t: 'Каскадом рулил кто-то другой', r: { support: 1 }, g: {} }
      ]
    },
    {
      kicker: 'Риск',
      q: 'Что тебе даётся легко в разборе подозрительного?',
      a: [
        { t: 'Вижу дроп-связки, повторные реквизиты, странные цепочки', r: { risk: 3 }, g: { dep: 1 } },
        { t: 'Разбирал чарджи: откуда прилетело и чего не хватило', r: { risk: 2, compliance: 1 }, g: {} },
        { t: 'Знаю где сядет 115 и 161, какие реквизиты не пройдут', r: { compliance: 2, risk: 1 }, g: {} },
        { t: 'Это не моя сильная сторона', r: {}, g: {} }
      ]
    },
    {
      kicker: 'Compliance',
      q: 'Насколько ты в теме проверок и доков?',
      a: [
        { t: 'Проверял мерча и материал: кто он, откуда деньги, что запросить', r: { compliance: 3 }, g: { dep: 1 } },
        { t: 'Знаю какие анкеты и доки закрывают вопрос по банку', r: { compliance: 2 }, g: {} },
        { t: 'Сталкивался, но глубоко не лез', r: { compliance: 1, support: 1 }, g: {} },
        { t: 'Не про меня', r: {}, g: {} }
      ]
    },
    {
      kicker: 'Провайдеры',
      q: 'Был ли у тебя опыт подключать и вести провайдеров?',
      a: [
        { t: 'Подключал новый банк или PSP: тест мелким, потом разгон', r: { ops: 2, integration: 1 }, g: { dep: 1 } },
        { t: 'Договаривался по комсе, страховому, условиям', r: { bdm: 2, kam: 1 }, g: { neg: 1 } },
        { t: 'Вёл отношения с площадками и контрагентами вдолгую', r: { kam: 3 }, g: {} },
        { t: 'С провайдерами работал не я', r: { support: 1 }, g: {} }
      ]
    },
    {
      kicker: 'Техника',
      q: 'Насколько ты близко к технической части?',
      a: [
        { t: 'Запускал H2H и API, разговаривал с разрабами на их языке', r: { integration: 3 }, g: { dep: 1 } },
        { t: 'Понимаю как это работает, но сам не собирал', r: { integration: 1, ops: 1 }, g: {} },
        { t: 'Читаю JSON и логи, могу разобрать где отвалилось', r: { integration: 2, risk: 1 }, g: {} },
        { t: 'Техника не моё', r: {}, g: {} }
      ]
    },
    {
      kicker: 'Коммерция',
      q: 'Как у тебя с «привести и удержать» деньги и людей?',
      a: [
        { t: 'Приводил мерчей и трафик, умею продавать ценность', r: { bdm: 3 }, g: { neg: 1 } },
        { t: 'Держал ключевых клиентов, растил их оборот', r: { kam: 3 }, g: { neg: 1 } },
        { t: 'Договариваюсь нормально, но продажи не моя роль', r: { kam: 1, ops: 1 }, g: {} },
        { t: 'Я больше про процесс, чем про людей и продажи', r: { settlement: 1, support: 1 }, g: {} }
      ]
    },
    {
      kicker: 'Команда',
      q: 'Кем ты управлял по-настоящему?',
      a: [
        { t: 'Вёл команду: смены, задачи, ответственность за результат', r: { ops: 1, kam: 1 }, g: { own: 3 } },
        { t: 'Были один-два человека под контролем', r: { ops: 1 }, g: { own: 1 } },
        { t: 'Координировал дроповодов или саппортов без формальной команды', r: { kam: 1 }, g: { own: 1 } },
        { t: 'Управлял только собой', r: {}, g: {} }
      ]
    },
    {
      kicker: 'Деньги',
      q: 'Отвечал ли ты за деньги и юнит-экономику проекта?',
      a: [
        { t: 'Да: считал маржу, потери, окупаемость, отвечал за P&L потока', r: { ops: 1 }, g: { dep: 2 } },
        { t: 'Частично: видел цифры, но решал не я', r: { settlement: 1 }, g: { vol: 1 } },
        { t: 'Отвечал за свой результат, не за проект', r: {}, g: {} },
        { t: 'За деньги проекта отвечали другие', r: { support: 1 }, g: {} }
      ]
    },
    {
      kicker: 'Переговоры',
      q: 'Как часто ты садился договариваться о деньгах и условиях?',
      a: [
        { t: 'Постоянно: комса, страховой, лимиты, спорные ситуации', r: { bdm: 1, kam: 1 }, g: { neg: 2 } },
        { t: 'Иногда, когда надо было продавить условие', r: {}, g: { neg: 1 } },
        { t: 'Редко, чаще исполнял договорённости', r: { support: 1 }, g: {} },
        { t: 'Переговоры вёл не я', r: {}, g: {} }
      ]
    },
    {
      kicker: 'Гео',
      q: 'С каким гео и методами ты работал? Можно отметить несколько.',
      multi: true,
      a: [
        { t: 'Cross-border: РФ, СНГ, USDT-мост, карты KZ и AM', r: { ops: 1, settlement: 1 }, g: { dep: 1 } },
        { t: 'В основном РФ: банки, СБП, карты', r: { ops: 1 }, g: {} },
        { t: 'Крипта и обмен: TRC20, биржи, спреды', r: { settlement: 1, risk: 1 }, g: {} },
        { t: 'Одно узкое направление', r: { support: 1 }, g: {} }
      ]
    },
    {
      kicker: 'Стаж',
      q: 'Сколько ты в индустрии?',
      a: [
        { t: 'Больше трёх лет, прошёл несколько циклов рынка', r: {}, g: { yrs: 3 } },
        { t: 'Год-два, уже уверенно ориентируюсь', r: {}, g: { yrs: 2 } },
        { t: 'Меньше года, ещё набираю', r: {}, g: { yrs: 1 } },
        { t: 'Совсем недавно зашёл', r: { support: 1 }, g: {} }
      ]
    },
    {
      kicker: 'Английский',
      q: 'Как у тебя с английским?',
      a: [
        { t: 'Свободно веду переписку и созвоны', r: {}, g: { eng: 3 } },
        { t: 'Читаю и пишу, говорю с трудом', r: {}, g: { eng: 2 } },
        { t: 'Базовый, со словарём', r: {}, g: { eng: 1 } },
        { t: 'Пока никак', r: {}, g: {} }
      ]
    },
    {
      kicker: 'Куда тянет',
      q: 'Куда тебя самого тянет в найме?',
      a: [
        { t: 'Ближе к деньгам и цифрам: сэтл, баланс, отчёт', r: { settlement: 2 }, g: {} },
        { t: 'Ближе к людям: клиенты, продажи, переговоры', r: { kam: 1, bdm: 1 }, g: {} },
        { t: 'Ближе к риску и контролю: антифрод, проверки', r: { risk: 1, compliance: 1 }, g: {} },
        { t: 'Ближе к системе: интеграции, процессы, автоматизация', r: { integration: 1, ops: 1 }, g: {} }
      ]
    }
  ];

  function emptyScores() {
    var s = {};
    for (var k in ROLES) { if (ROLES.hasOwnProperty(k)) s[k] = 0; }
    return s;
  }

  function emptyGrade() {
    return { vol: 0, own: 0, neg: 0, dep: 0, eng: 0, yrs: 0 };
  }

  /*
   * answers - массив длиной QUESTIONS.length с индексами выбранных ответов
   * (число, либо null для пропущенного - пропуск просто не добавляет весов).
   */
  function scoreRoles(answers) {
    var roles = emptyScores();
    var g = emptyGrade();
    for (var i = 0; i < QUESTIONS.length; i++) {
      var pick = answers[i];
      if (pick === null || pick === undefined) continue;
      // multi-вопрос отдаёт массив индексов, обычный - число; нормализуем в массив
      var picks = Array.isArray(pick) ? pick : [pick];
      for (var j = 0; j < picks.length; j++) {
        var ans = QUESTIONS[i].a[picks[j]];
        if (!ans) continue;
        if (ans.r) for (var rk in ans.r) { if (ans.r.hasOwnProperty(rk)) roles[rk] += ans.r[rk]; }
        if (ans.g) for (var gk in ans.g) { if (ans.g.hasOwnProperty(gk)) g[gk] += ans.g[gk]; }
      }
    }
    return { roles: roles, grade: g };
  }

  // Head достижим только при реальном ownership. Иначе ветеран уходит в senior-ops.
  function headEligible(g) {
    return g.own >= 2 && g.neg >= 2 && g.vol >= 2 && g.yrs >= 2;
  }

  function topRole(roles) {
    var best = null, bestVal = -1;
    // Стабильный порядок при равенстве: по ROLE_ORDER (вход раньше топа),
    // чтобы не выкидывать в дорогую роль на ничьей.
    for (var i = 0; i < ROLE_ORDER.length; i++) {
      var k = ROLE_ORDER[i];
      if (roles[k] > bestVal) { bestVal = roles[k]; best = k; }
    }
    return best;
  }

  function computeGrade(g) {
    // Взвешенный сигнал зрелости.
    var maturity = g.own * 2 + g.neg + g.yrs + g.dep + Math.min(g.vol, 3);
    var senior = maturity >= 8 && (g.dep >= 1 || g.yrs >= 2) && (g.own >= 1 || g.vol >= 2);
    var middle = maturity >= 4;
    if (senior) return { key: 'senior', label: 'Senior', note: 'Опыта хватает, чтобы заходить не с низа. Дело за упаковкой и языком найма.' };
    if (middle) return { key: 'middle', label: 'Middle', note: 'Крепкий средний уровень. Реально целиться в менеджерскую вилку, а не во вход.' };
    return { key: 'junior', label: 'Junior', note: 'Заходишь с понятной роли, дальше добираешь опытом и упаковкой.' };
  }

  function buildResult(answers) {
    var s = scoreRoles(answers);
    var roles = s.roles;
    var g = s.grade;

    var pickKey = topRole(roles);

    // Guardrail: если движок дал head-веса напрямую (их нет в вопросах),
    // либо роль оказалась head без реального ownership - понижаем в ops.
    if (pickKey === 'head' && !headEligible(g)) pickKey = 'ops';

    // Апгрейд в Head: сильный ownership поверх любой средней роли поднимает в Head.
    var promotedToHead = false;
    if (pickKey !== 'head' && headEligible(g) && ROLES[pickKey].level !== 'вход') {
      pickKey = 'head';
      promotedToHead = true;
    }

    var role = ROLES[pickKey];
    var grade = computeGrade(g);

    // Грейд не должен противоречить уровню роли: senior на вход-роли ($1-2к)
    // читается как сломанный тест. Прижимаем к middle.
    var GRADE_RANK = { junior: 0, middle: 1, senior: 2 };
    if (role.level === 'вход' && GRADE_RANK[grade.key] > 1) {
      grade = { key: 'middle', label: 'Middle', note: 'Опыта заметно больше типичного входа. На собесе дави на это и целься выше стартовой вилки.' };
    }

    // Head сам по себе senior-уровень.
    if (pickKey === 'head' && grade.key !== 'senior') {
      grade = { key: 'senior', label: 'Senior', note: 'Уровень ownership тянет на Head. Осталось перевести это на язык найма без серых имён.' };
    }

    return {
      roleKey: pickKey,
      role: role,
      grade: grade,
      gradeSignals: g,
      scores: roles,
      promotedToHead: promotedToHead
    };
  }

  var api = {
    ROLES: ROLES,
    ROLE_ORDER: ROLE_ORDER,
    QUESTIONS: QUESTIONS,
    scoreRoles: scoreRoles,
    topRole: topRole,
    headEligible: headEligible,
    computeGrade: computeGrade,
    buildResult: buildResult
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;
  } else {
    root.PUREFM = api;
  }
})(typeof window !== 'undefined' ? window : this);
