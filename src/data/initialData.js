export const INITIAL_USERS = [
  {
    id: 'admin-1',
    username: 'mazal',
    password: 'mazal2024',
    name: 'מזל בורדו',
    role: 'admin',
    currentStage: null,
  },
  {
    id: 'client-1',
    username: 'sarah',
    password: '1234',
    name: 'שרה כהן',
    role: 'client',
    currentStage: 2,
    joinDate: '2024-01-15',
    notes: 'לקוחה ותיקה, מתקדמת יפה',
  },
  {
    id: 'client-2',
    username: 'dana',
    password: '1234',
    name: 'דנה לוי',
    role: 'client',
    currentStage: 1,
    joinDate: '2024-03-01',
    notes: '',
  },
];

export const INITIAL_STAGES = [
  {
    id: 1,
    title: 'שלב 1 — הכרות והגדרת מטרות',
    description: 'בשלב זה נכיר את דפוסי הקשר שלך, נמפה את החרדות הזוגיות ונגדיר יחד לאן את רוצה להגיע.',
    order: 1,
    color: '#C4909A',
  },
  {
    id: 2,
    title: 'שלב 2 — עבודה על הדפוסים',
    description: 'נצלול לעומק הדפוסים שיצרת, נבין את שורשם ונתחיל לבנות כלים חדשים לקשר בריא יותר.',
    order: 2,
    color: '#A52A2A',
  },
  {
    id: 3,
    title: 'שלב 3 — שינוי ויישום',
    description: 'הגיע הזמן ליישם! נתרגל את הכלים החדשים, נתמודד עם אתגרים ונראה שינוי אמיתי בחיי הקשר.',
    order: 3,
    color: '#7B1F1F',
  },
  {
    id: 4,
    title: 'שלב 4 — איחוד ועצמאות',
    description: 'בשלב הסיום נסכם את המסע, נחזק את הכלים שרכשת ונבנה תוכנית המשך לחיים של אהבה בריאה.',
    order: 4,
    color: '#5A1515',
  },
];

export const INITIAL_EVENTS = [
  {
    id: 'ev-1',
    title: 'שיחת אישי — שרה',
    date: '2024-04-10',
    time: '10:00',
    type: 'meeting',
    description: 'פגישת מעקב שבועית',
    clientId: 'client-1',
  },
  {
    id: 'ev-2',
    title: 'לייב קבוצתי — כלים לרגיעה',
    date: '2024-04-12',
    time: '20:00',
    type: 'live',
    description: 'לייב לכל המשתתפות בתוכנית. נלמד 3 כלים מעשיים להרגעת חרדה זוגית.',
    clientId: 'all',
  },
  {
    id: 'ev-3',
    title: 'וובינר — גבולות בקשר',
    date: '2024-04-20',
    time: '19:30',
    type: 'event',
    description: 'אירוע מיוחד על הצבת גבולות בריאים בקשר זוגי.',
    clientId: 'all',
  },
];

export const INITIAL_TASKS = [
  {
    id: 'task-1',
    title: 'כתיבת יומן — מה גרם לי לחרדה השבוע?',
    description: 'הקדישי 15 דקות לכתיבה חופשית על רגע שבו הרגשת חרדה זוגית. ללא שיפוטיות.',
    dueDate: '2024-04-14',
    completed: false,
    clientId: 'client-1',
  },
  {
    id: 'task-2',
    title: 'תרגיל נשימה — 5-4-6',
    description: 'תרגלי את תרגיל הנשימה שלמדנו פעמיים ביום, במשך 5 דקות.',
    dueDate: '2024-04-15',
    completed: true,
    clientId: 'client-1',
  },
  {
    id: 'task-3',
    title: 'צפייה בסרטון "דפוס ההיצמדות"',
    description: 'צפי בסרטון בספריית הוידאו וכתבי 3 תובנות שעלו לך.',
    dueDate: '2024-04-13',
    completed: false,
    clientId: 'client-2',
  },
];

export const INITIAL_VIDEOS = [
  {
    id: 'vid-1',
    title: 'ברוכה הבאה לתוכנית!',
    description: 'סרטון פתיחה — מה נעשה יחד ואיך הכי כדאי להיעזר בתוכנית.',
    url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    thumbnail: '',
    category: 'פתיחה',
    uploadDate: '2024-01-01',
    accessLevel: 'all',
  },
  {
    id: 'vid-2',
    title: 'דפוס ההיצמדות — מאיפה זה בא?',
    description: 'הסבר מעמיק על דפוס ההיצמדות הרגשי, שורשיו הילדותיים ואיך הוא מתבטא בזוגיות.',
    url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    thumbnail: '',
    category: 'דפוסי קשר',
    uploadDate: '2024-01-10',
    accessLevel: 'all',
  },
  {
    id: 'vid-3',
    title: '3 כלים לרגיעה מיידית',
    description: 'כלים מעשיים שאפשר להשתמש בהם ברגע של חרדה זוגית.',
    url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    thumbnail: '',
    category: 'כלים מעשיים',
    uploadDate: '2024-02-01',
    accessLevel: 'all',
  },
];
