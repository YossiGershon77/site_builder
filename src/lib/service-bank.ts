export type ServiceCategory =
  | 'CUTS'
  | 'BEARD'
  | 'COMBOS'
  | 'TREATMENTS'
  | 'EXTRAS';

export type ServiceBankItem = {
  id: string;
  category: ServiceCategory;
  name: string;
  nameHe: string;
  description: string;
  descriptionHe: string;
  imageUrl: string;
  defaultImageUrl: string;
  defaultDurationMinutes: number;
  icon: string;
};

const SERVICE_BANK_RAW: Omit<ServiceBankItem, 'defaultImageUrl'>[] = [
  // ── CUTS ──────────────────────────────────────────
  {
    id: 'cuts-haircut',
    category: 'CUTS',
    name: 'Haircut',
    nameHe: 'תספורת',
    description: 'Classic cut tailored to your face shape and style.',
    descriptionHe: 'תספורת קלאסית מותאמת לצורת הפנים ולסגנון שלך.',
    imageUrl:
      'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=600&q=80',
    defaultDurationMinutes: 45,
    icon: '✂️',
  },
  {
    id: 'cuts-fade',
    category: 'CUTS',
    name: 'Fade',
    nameHe: 'פייד',
    description: 'Skin to length, seamless gradient. Our most requested service.',
    descriptionHe: 'מעורר עור ועד אורך, מעבר חלק. השירות הכי מבוקש.',
    imageUrl:
      'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=600&q=80',
    defaultDurationMinutes: 45,
    icon: '💈',
  },
  {
    id: 'cuts-buzz',
    category: 'CUTS',
    name: 'Buzz Cut',
    nameHe: 'מספר אפס',
    description: 'Clean, even length all over. Quick and sharp.',
    descriptionHe: 'אורך אחיד ונקי בכל הראש. מהיר ומדויק.',
    imageUrl:
      'https://images.unsplash.com/photo-1521596468927-c2723965c786?w=600&q=80',
    defaultDurationMinutes: 20,
    icon: '🔲',
  },
  {
    id: 'cuts-kids',
    category: 'CUTS',
    name: 'Kids Cut',
    nameHe: 'תספורת ילדים',
    description: 'Patient and careful. For the young ones.',
    descriptionHe: 'בסבלנות ובזהירות. לקטנטנים.',
    imageUrl:
      'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=600&q=80',
    defaultDurationMinutes: 30,
    icon: '👦',
  },
  {
    id: 'cuts-head-shave',
    category: 'CUTS',
    name: 'Head Shave',
    nameHe: 'גילוח ראש',
    description: 'Smooth, clean head shave with hot towel finish.',
    descriptionHe: 'גילוח ראש חלק ונקי עם סיום במגבת חמה.',
    imageUrl:
      'https://images.unsplash.com/photo-1621605816354-3f9e69701fdb?w=600&q=80',
    defaultDurationMinutes: 30,
    icon: '🪒',
  },
  {
    id: 'cuts-design',
    category: 'CUTS',
    name: 'Design Haircut',
    nameHe: 'תספורת עיצוב',
    description: 'Lines, patterns, and creative detail work.',
    descriptionHe: 'קווים, דוגמאות ועבודת עיצוב יצירתית.',
    imageUrl:
      'https://images.unsplash.com/photo-1625036469550-f8748d5c2f07?w=600&q=80',
    defaultDurationMinutes: 60,
    icon: '🎨',
  },

  // ── BEARD & FACIAL HAIR ───────────────────────────
  {
    id: 'beard-trim',
    category: 'BEARD',
    name: 'Beard Trim & Shape',
    nameHe: 'עיצוב זקן',
    description: 'Shape, line up, and define. Pairs well with any cut.',
    descriptionHe: 'עיצוב, קו ודיוק. משתלב מצוין עם כל תספורת.',
    imageUrl:
      'https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=600&q=80',
    defaultDurationMinutes: 20,
    icon: '🧔',
  },
  {
    id: 'beard-razor-shave',
    category: 'BEARD',
    name: 'Straight Razor Shave',
    nameHe: 'גילוח סכין',
    description: 'Traditional hot-lather shave with a straight razor.',
    descriptionHe: 'גילוח מסורתי בקצף חם עם סכין ישרה.',
    imageUrl:
      'https://images.unsplash.com/photo-1532712938310-986c6f47775?w=600&q=80',
    defaultDurationMinutes: 30,
    icon: '🪒',
  },
  {
    id: 'beard-mustache',
    category: 'BEARD',
    name: 'Mustache Trim',
    nameHe: 'עיצוב שפם',
    description: 'Clean up and shape your mustache with precision.',
    descriptionHe: 'סידור ועיצוב השפם בדיוק מושלם.',
    imageUrl:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80',
    defaultDurationMinutes: 10,
    icon: '👨',
  },
  {
    id: 'beard-eyebrows',
    category: 'BEARD',
    name: 'Eyebrow Trim',
    nameHe: 'עיצוב גבות',
    description: 'Quick tidy-up to keep your brows looking sharp.',
    descriptionHe: 'סידור מהיר לשמירה על מראה מסודר ומדויק.',
    imageUrl:
      'https://images.unsplash.com/photo-1560784213-d3348e577053?w=600&q=80',
    defaultDurationMinutes: 10,
    icon: '👁️',
  },

  // ── COMBOS ────────────────────────────────────────
  {
    id: 'combo-cut-beard',
    category: 'COMBOS',
    name: 'Haircut + Beard Trim',
    nameHe: 'תספורת + זקן',
    description: 'The classic combo. Cut and beard in one session.',
    descriptionHe: 'הקומבו הקלאסי. תספורת וזקן בביקור אחד.',
    imageUrl:
      'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=600&q=80',
    defaultDurationMinutes: 60,
    icon: '✂️🧔',
  },
  {
    id: 'combo-cut-shave',
    category: 'COMBOS',
    name: 'Haircut + Hot Towel Shave',
    nameHe: 'תספורת + גילוח מגבת חמה',
    description: 'Fresh cut followed by a relaxing hot towel shave.',
    descriptionHe: 'תספורת רעננה ואחריה גילוח מפנק במגבת חמה.',
    imageUrl:
      'https://images.unsplash.com/photo-1593702275687-f8b4029d5d2?w=600&q=80',
    defaultDurationMinutes: 75,
    icon: '✂️🪒',
  },
  {
    id: 'combo-full',
    category: 'COMBOS',
    name: 'The Full Treatment',
    nameHe: 'טיפול מלא',
    description: 'Cut, beard, hot towel, and styling. The works.',
    descriptionHe: 'תספורת, זקן, מגבת חמה ועיצוב. הכל בחבילה אחת.',
    imageUrl:
      'https://images.unsplash.com/photo-1634302086706-f7a6e6c0c9e0?w=600&q=80',
    defaultDurationMinutes: 90,
    icon: '👑',
  },

  // ── TREATMENTS ────────────────────────────────────
  {
    id: 'treat-wash-style',
    category: 'TREATMENTS',
    name: 'Hair Wash + Styling',
    nameHe: 'שטיפה + עיצוב',
    description: 'Wash, condition, and style for a polished finish.',
    descriptionHe: 'שטיפה, מרכך ועיצוב לגימור מושלם.',
    imageUrl:
      'https://images.unsplash.com/photo-1594386478172-a9a62e064648?w=600&q=80',
    defaultDurationMinutes: 20,
    icon: '💇',
  },
  {
    id: 'treat-color',
    category: 'TREATMENTS',
    name: 'Hair Coloring',
    nameHe: 'צביעת שיער',
    description: 'Full color service with professional-grade products.',
    descriptionHe: 'צביעה מלאה עם מוצרים מקצועיים.',
    imageUrl:
      'https://images.unsplash.com/photo-1560066984-138d9834cd43?w=600&q=80',
    defaultDurationMinutes: 60,
    icon: '🎨',
  },
  {
    id: 'treat-keratin',
    category: 'TREATMENTS',
    name: 'Keratin Treatment',
    nameHe: 'החלקת קרטין',
    description: 'Smooth, frizz-free hair for months. Full keratin treatment.',
    descriptionHe: 'שיער חלק וללא פריז למשך חודשים. טיפול קרטין מלא.',
    imageUrl:
      'https://images.unsplash.com/photo-1629194893591-477f731fdca0?w=600&q=80',
    defaultDurationMinutes: 150,
    icon: '✨',
  },
  {
    id: 'treat-keratin-express',
    category: 'TREATMENTS',
    name: 'Express Keratin',
    nameHe: 'קרטין אקספרס',
    description: 'Faster keratin option for smoother, more manageable hair.',
    descriptionHe: 'גרסה מהירה של קרטין לשיער חלק וקל יותר לסידור.',
    imageUrl:
      'https://images.unsplash.com/photo-1522337360788-8a6992da0494?w=600&q=80',
    defaultDurationMinutes: 75,
    icon: '⚡',
  },
  {
    id: 'treat-scalp',
    category: 'TREATMENTS',
    name: 'Scalp Treatment',
    nameHe: 'טיפול קרקפת',
    description: 'Deep cleanse and massage to refresh your scalp.',
    descriptionHe: 'ניקוי עמוק ועיסוי לרענון הקרקפת.',
    imageUrl:
      'https://images.unsplash.com/photo-1516975080664-e7fb300ae963?w=600&q=80',
    defaultDurationMinutes: 30,
    icon: '💆',
  },

  // ── EXTRAS ────────────────────────────────────────
  {
    id: 'extra-nose-ear',
    category: 'EXTRAS',
    name: 'Nose & Ear Wax',
    nameHe: 'שעווה אף ואוזניים',
    description: 'Quick waxing for a clean, groomed look.',
    descriptionHe: 'שעווה מהירה למראה נקי ומסודר.',
    imageUrl:
      'https://images.unsplash.com/photo-1605490538800-4899956d2e32?w=600&q=80',
    defaultDurationMinutes: 10,
    icon: '👃',
  },
  {
    id: 'extra-hot-towel',
    category: 'EXTRAS',
    name: 'Hot Towel Facial',
    nameHe: 'מגבת חמה לפנים',
    description: 'Warm towel treatment to open pores and relax.',
    descriptionHe: 'טיפול במגבת חמה לפתיחת הנקבים והרפיה.',
    imageUrl:
      'https://images.unsplash.com/photo-1596178060512-1a0368732bea?w=600&q=80',
    defaultDurationMinutes: 15,
    icon: '♨️',
  },
  {
    id: 'extra-japanese',
    category: 'EXTRAS',
    name: 'Japanese Straightening',
    nameHe: 'החלקה יפנית',
    description: 'Permanent straightening for silky, pin-straight hair.',
    descriptionHe: 'החלקה קבועה לשיער משיי וחלק לחלוטין.',
    imageUrl:
      'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&q=80',
    defaultDurationMinutes: 210,
    icon: '🇯🇵',
  },
];

export const SERVICE_BANK: ServiceBankItem[] = SERVICE_BANK_RAW.map((item) => ({
  ...item,
  defaultImageUrl: item.imageUrl,
}));

export const CATEGORY_META: Record<
  ServiceCategory,
  {
    label: string;
    labelHe: string;
    description: string;
  }
> = {
  CUTS: {
    label: 'Cuts',
    labelHe: 'תספורות',
    description: 'Haircuts and styling',
  },
  BEARD: {
    label: 'Beard & Facial Hair',
    labelHe: 'זקן ושיער פנים',
    description: 'Beard, mustache, and eyebrow services',
  },
  COMBOS: {
    label: 'Combos',
    labelHe: 'חבילות',
    description: 'Bundled services at a better value',
  },
  TREATMENTS: {
    label: 'Treatments',
    labelHe: 'טיפולים',
    description: 'Coloring, straightening, and hair care',
  },
  EXTRAS: {
    label: 'Extras',
    labelHe: 'תוספות',
    description: 'Quick add-on services',
  },
};

const CATEGORY_ORDER: ServiceCategory[] = [
  'CUTS',
  'BEARD',
  'COMBOS',
  'TREATMENTS',
  'EXTRAS',
];

export function getServicesByCategory(
  category: ServiceCategory,
): ServiceBankItem[] {
  return SERVICE_BANK.filter((service) => service.category === category);
}

export function getServiceById(id: string): ServiceBankItem | undefined {
  return SERVICE_BANK.find((service) => service.id === id);
}

export function getAllCategories(): ServiceCategory[] {
  return [...CATEGORY_ORDER];
}

export function getLocalizedServiceBankItem(
  item: ServiceBankItem,
  locale: 'he' | 'en',
) {
  return {
    ...item,
    displayName: locale === 'he' ? item.nameHe : item.name,
    displayDescription: locale === 'he' ? item.descriptionHe : item.description,
  };
}
