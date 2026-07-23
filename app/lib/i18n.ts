export const defaultLocale = "en";

export const localeCodes = ["en", "es", "pt-br", "de", "fr", "ja", "zh"] as const;

export type LocaleCode = (typeof localeCodes)[number];

export type LocaleInfo = {
  code: LocaleCode;
  label: string;
  nativeLabel: string;
  htmlLang: string;
  path: string;
};

export const locales: LocaleInfo[] = [
  { code: "en", label: "English", nativeLabel: "English", htmlLang: "en", path: "/" },
  { code: "es", label: "Spanish", nativeLabel: "Español", htmlLang: "es", path: "/es" },
  { code: "pt-br", label: "Portuguese", nativeLabel: "Português", htmlLang: "pt-BR", path: "/pt-br" },
  { code: "de", label: "German", nativeLabel: "Deutsch", htmlLang: "de", path: "/de" },
  { code: "fr", label: "French", nativeLabel: "Français", htmlLang: "fr", path: "/fr" },
  { code: "ja", label: "Japanese", nativeLabel: "日本語", htmlLang: "ja", path: "/ja" },
  { code: "zh", label: "Chinese", nativeLabel: "中文", htmlLang: "zh-CN", path: "/zh" },
];

export const siteUrl = "https://sleepcalculator.life";

export function isLocaleCode(value: string): value is LocaleCode {
  return localeCodes.includes(value as LocaleCode);
}

export function getLocaleInfo(locale: LocaleCode) {
  return locales.find((item) => item.code === locale) || locales[0];
}

export function getLanguageAlternates() {
  return locales.reduce<Record<string, string>>((links, locale) => {
    links[locale.htmlLang] = locale.path;
    return links;
  }, {});
}

export const localizedLandingCopy: Record<
  Exclude<LocaleCode, "en">,
  {
    title: string;
    description: string;
    eyebrow: string;
    headline: string;
    intro: string;
    calculatorCta: string;
    planCta: string;
    benefitsTitle: string;
    benefits: string[];
    workflowTitle: string;
    workflow: string[];
    faqTitle: string;
    faqs: [string, string][];
  }
> = {
  es: {
    title: "Calculadora de sueño: hora de dormir, despertar y rutina",
    description:
      "Calcula tu hora ideal para dormir, opciones de ciclos de sueño, puntuación de hábitos y una rutina sencilla para descansar mejor.",
    eyebrow: "Calculadora de sueño",
    headline: "Encuentra tu mejor hora para dormir esta noche.",
    intro:
      "Usa la calculadora principal para planificar la hora de acostarte, la hora de despertar y una rutina de relajación antes de apagar la luz.",
    calculatorCta: "Abrir calculadora",
    planCta: "Ver plan de 7 días",
    benefitsTitle: "Qué puedes planificar",
    benefits: [
      "Hora de dormir basada en ciclos de 90 minutos.",
      "Hora de despertar según tu objetivo de sueño.",
      "Puntuación rápida de hábitos de sueño.",
      "Rutina práctica para reducir pantallas, cafeína y retrasos nocturnos.",
    ],
    workflowTitle: "Cómo usarlo",
    workflow: [
      "Elige si quieres calcular por hora de despertar o por hora de dormir.",
      "Ajusta cuánto tardas normalmente en dormirte.",
      "Compara las opciones y guarda el mejor horario para probarlo durante una semana.",
    ],
    faqTitle: "Preguntas frecuentes",
    faqs: [
      ["¿Es una herramienta médica?", "No. Es una herramienta educativa para planificar el sueño, no un diagnóstico."],
      ["¿Necesito registrarme?", "La calculadora es gratuita. El inicio de sesión solo se usa para guardar compras digitales."],
      ["¿Por qué habla de ciclos?", "El MVP usa ciclos de 90 minutos como una forma simple de comparar horarios."],
    ],
  },
  "pt-br": {
    title: "Calculadora do sono: horário para dormir, acordar e rotina",
    description:
      "Calcule seu melhor horário para dormir, opções de ciclos de sono, pontuação de hábitos e uma rotina simples para desacelerar.",
    eyebrow: "Calculadora do sono",
    headline: "Encontre o melhor horário para dormir hoje.",
    intro:
      "Use a calculadora principal para planejar horário de dormir, horário de acordar e uma rotina prática antes de apagar as luzes.",
    calculatorCta: "Abrir calculadora",
    planCta: "Ver plano de 7 dias",
    benefitsTitle: "O que você pode planejar",
    benefits: [
      "Horário de dormir baseado em ciclos de 90 minutos.",
      "Horário de acordar alinhado à sua meta de sono.",
      "Pontuação simples dos seus hábitos de sono.",
      "Rotina de desaceleração para telas, cafeína, cochilos e consistência.",
    ],
    workflowTitle: "Como usar",
    workflow: [
      "Escolha calcular a partir do horário de acordar ou de dormir.",
      "Ajuste quanto tempo você costuma levar para pegar no sono.",
      "Compare os resultados e teste o melhor horário por sete dias.",
    ],
    faqTitle: "Perguntas frequentes",
    faqs: [
      ["Isso é aconselhamento médico?", "Não. É uma ferramenta educacional de planejamento, não diagnóstico."],
      ["Preciso criar conta?", "A calculadora é gratuita. Login só é necessário para compras digitais."],
      ["Por que usar ciclos de sono?", "O MVP usa ciclos de 90 minutos para comparar horários de forma simples."],
    ],
  },
  de: {
    title: "Schlafrechner: Schlafenszeit, Aufwachzeit und Routine",
    description:
      "Berechne deine passende Schlafenszeit, Schlafzyklen, einen Schlafgewohnheiten-Score und eine einfache Abendroutine.",
    eyebrow: "Schlafrechner",
    headline: "Finde die beste Schlafenszeit für heute Abend.",
    intro:
      "Nutze den Hauptrechner, um Schlafenszeit, Aufwachzeit und eine praktische Routine vor dem Lichtausmachen zu planen.",
    calculatorCta: "Rechner öffnen",
    planCta: "7-Tage-Plan ansehen",
    benefitsTitle: "Was du planen kannst",
    benefits: [
      "Schlafenszeit auf Basis von 90-Minuten-Zyklen.",
      "Aufwachzeit passend zu deinem Schlafziel.",
      "Ein schneller Score für Schlafgewohnheiten.",
      "Abendroutine für Bildschirmzeit, Koffein, Nickerchen und Konsistenz.",
    ],
    workflowTitle: "So funktioniert es",
    workflow: [
      "Wähle, ob du ab Aufwachzeit oder Schlafenszeit rechnen möchtest.",
      "Trage ein, wie lange du normalerweise zum Einschlafen brauchst.",
      "Vergleiche die Optionen und teste die beste Zeit eine Woche lang.",
    ],
    faqTitle: "Häufige Fragen",
    faqs: [
      ["Ist das medizinische Beratung?", "Nein. Es ist eine Bildungs- und Planungshilfe, keine Diagnose."],
      ["Brauche ich ein Konto?", "Der Rechner ist kostenlos. Login wird nur für digitale Käufe genutzt."],
      ["Warum Schlafzyklen?", "Das MVP nutzt 90-Minuten-Zyklen als einfache Vergleichsgrundlage."],
    ],
  },
  fr: {
    title: "Calculateur de sommeil : coucher, réveil et routine",
    description:
      "Calculez votre heure idéale de coucher, vos cycles de sommeil, un score d'habitudes et une routine simple pour mieux dormir.",
    eyebrow: "Calculateur de sommeil",
    headline: "Trouvez votre meilleure heure de coucher ce soir.",
    intro:
      "Utilisez le calculateur principal pour planifier l'heure du coucher, l'heure du réveil et une routine de détente avant d'éteindre la lumière.",
    calculatorCta: "Ouvrir le calculateur",
    planCta: "Voir le plan 7 jours",
    benefitsTitle: "Ce que vous pouvez planifier",
    benefits: [
      "Heure de coucher basée sur des cycles de 90 minutes.",
      "Heure de réveil alignée sur votre objectif de sommeil.",
      "Score rapide de vos habitudes de sommeil.",
      "Routine du soir pour écrans, caféine, siestes et régularité.",
    ],
    workflowTitle: "Comment l'utiliser",
    workflow: [
      "Choisissez un calcul à partir de l'heure de réveil ou de coucher.",
      "Ajoutez votre temps habituel pour vous endormir.",
      "Comparez les options et testez le meilleur horaire pendant sept jours.",
    ],
    faqTitle: "Questions fréquentes",
    faqs: [
      ["Est-ce un conseil médical ?", "Non. C'est un outil éducatif de planification, pas un diagnostic."],
      ["Faut-il créer un compte ?", "Le calculateur est gratuit. La connexion sert seulement aux achats numériques."],
      ["Pourquoi parler de cycles ?", "Le MVP utilise des cycles de 90 minutes pour comparer simplement les horaires."],
    ],
  },
  ja: {
    title: "睡眠計算ツール：就寝時間・起床時間・睡眠ルーティン",
    description:
      "理想的な就寝時間、起床時間、睡眠サイクル、睡眠習慣スコア、寝る前のルーティンを簡単に計算できます。",
    eyebrow: "睡眠計算ツール",
    headline: "今夜の最適な就寝時間を見つけましょう。",
    intro:
      "メインの計算ツールで、就寝時間、起床時間、睡眠サイクル、消灯前のリラックス習慣を計画できます。",
    calculatorCta: "計算ツールを開く",
    planCta: "7日間プランを見る",
    benefitsTitle: "計画できること",
    benefits: [
      "90分サイクルをもとにした就寝時間。",
      "睡眠目標に合わせた起床時間。",
      "睡眠習慣の簡単なスコア。",
      "画面時間、カフェイン、昼寝、習慣化を整える夜のルーティン。",
    ],
    workflowTitle: "使い方",
    workflow: [
      "起床時間から計算するか、就寝時間から計算するかを選びます。",
      "普段どれくらいで眠りにつくかを入力します。",
      "候補を比較し、最適な時間を7日間試します。",
    ],
    faqTitle: "よくある質問",
    faqs: [
      ["医療アドバイスですか？", "いいえ。睡眠計画のための教育ツールであり、診断ではありません。"],
      ["登録は必要ですか？", "計算ツールは無料です。ログインはデジタル購入の保存にのみ使います。"],
      ["なぜ睡眠サイクルを使うのですか？", "MVPでは90分サイクルを使って、時間を簡単に比較しています。"],
    ],
  },
  zh: {
    title: "睡眠计算器：就寝时间、起床时间和睡眠计划",
    description:
      "用睡眠计算器规划今晚的就寝时间、起床时间、睡眠周期、睡眠习惯评分和睡前放松流程。",
    eyebrow: "睡眠计算器",
    headline: "找到今晚最适合你的就寝时间。",
    intro:
      "使用主计算器输入起床时间、睡眠目标和入睡耗时，快速得到可执行的睡眠周期和睡前放松安排。",
    calculatorCta: "打开计算器",
    planCta: "查看7天计划",
    benefitsTitle: "你可以规划什么",
    benefits: [
      "基于90分钟睡眠周期的就寝时间。",
      "与睡眠目标匹配的起床时间。",
      "睡眠习惯快速评分。",
      "围绕屏幕、咖啡因、小睡和规律性的睡前流程。",
    ],
    workflowTitle: "使用方式",
    workflow: [
      "选择按起床时间、就寝时间或睡眠时长计算。",
      "填写你通常需要多久入睡。",
      "对比结果，并把最合适的时间连续测试7天。",
    ],
    faqTitle: "常见问题",
    faqs: [
      ["这是医疗建议吗？", "不是。这是通用睡眠规划和教育工具，不用于诊断。"],
      ["需要注册吗？", "计算器免费使用。登录只用于保存数字产品购买记录。"],
      ["为什么使用睡眠周期？", "MVP 使用90分钟周期作为简单的时间比较方法。"],
    ],
  },
};
