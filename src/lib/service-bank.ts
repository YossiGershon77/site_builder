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
    description:
      'A tailored cut shaped to your face, hair type, and personal style. Whether you prefer a clean classic or something modern, every cut starts with a consultation and ends with styling.',
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
    description:
      "A seamless gradient from skin to length, blended with precision. Low, mid, or high — we'll dial in the exact fade line that works for your look.",
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
    description:
      "Clean, even, and low-maintenance. One guard length all over for a sharp uniform look that's easy to maintain between visits.",
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
    description:
      'A patient, gentle cut for the little ones. We keep it fun and relaxed so they leave the chair looking sharp and feeling proud.',
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
    description:
      'A full head shave taken down to the skin with a razor for a perfectly smooth finish. Includes hot towel prep and aftershave balm.',
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
    description:
      'Custom lines, patterns, or geometric shapes carved into a fade or short cut. Bring a reference photo or let us create something original.',
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
    description:
      'A full beard shape-up with crisp cheek and neck lines. We sculpt and define using clippers and a straight razor for edges that stay sharp for days.',
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
    description:
      "The classic barbershop experience. Hot towel, rich lather, and a straight razor for the closest, smoothest shave you'll ever feel.",
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
    description:
      'A detailed trim and shape of the mustache using precision scissors. We clean up the lip line and shape the edges to match your style.',
    descriptionHe: 'סידור ועיצוב השפם בדיוק מושלם.',
    imageUrl:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80',
    defaultDurationMinutes: 10,
    icon: '👨',
  },
  // ── COMBOS ────────────────────────────────────────
  {
    id: 'combo-cut-beard',
    category: 'COMBOS',
    name: 'Haircut + Beard Trim',
    nameHe: 'תספורת + זקן',
    description:
      'Our most popular pairing. A full haircut followed by a hot towel straight razor shave. Walk in scruffy, walk out polished.',
    descriptionHe: 'הקומבו הקלאסי. תספורת וזקן בביקור אחד.',
    imageUrl:
      'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=600&q=80',
    defaultDurationMinutes: 60,
    icon: '✂️🧔',
  },
  // ── TREATMENTS ────────────────────────────────────
  {
    id: 'treat-wash-style',
    category: 'TREATMENTS',
    name: 'Hair Wash + Styling',
    nameHe: 'שטיפה + עיצוב',
    description:
      'A relaxing hair wash followed by a professional blow-dry and styling. Perfect before a big event, date night, or whenever you want to look your best.',
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
    description:
      'From covering grays to a full color transformation. We use professional-grade color matched to your skin tone for a natural, seamless result.',
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
    description:
      'A smoothing treatment that eliminates frizz and adds mirror-like shine for months. Your hair will be straighter, softer, and dramatically easier to manage.',
    descriptionHe: 'שיער חלק וללא פריז למשך חודשים. טיפול קרטין מלא.',
    imageUrl:
      'https://images.unsplash.com/photo-1629194893591-477f731fdca0?w=600&q=80',
    defaultDurationMinutes: 150,
    icon: '✨',
  },
  // ── EXTRAS ────────────────────────────────────────
  {
    id: 'extra-nose-ear',
    category: 'EXTRAS',
    name: 'Nose & Ear Wax',
    nameHe: 'שעווה אף ואוזניים',
    description:
      'A quick and hygienic wax to remove unwanted nose and ear hair. Fast, effective, and results last weeks longer than trimming.',
    descriptionHe: 'שעווה מהירה למראה נקי ומסודר.',
    imageUrl:
      'https://images.unsplash.com/photo-1605490538800-4899956d2e32?w=600&q=80',
    defaultDurationMinutes: 10,
    icon: '👃',
  },
  {
    id: 'extra-japanese',
    category: 'EXTRAS',
    name: 'Japanese Straightening',
    nameHe: 'החלקה יפנית',
    description:
      'A permanent straightening treatment for a sleek, pin-straight result that lasts until new growth comes in. The ultimate solution for unruly or curly hair.',
    descriptionHe: 'החלקה קבועה לשיער משיי וחלק לחלוטין.',
    imageUrl:
      'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&q=80',
    defaultDurationMinutes: 210,
    icon: '🇯🇵',
  },
];

export const FALLBACK_SERVICE_IMAGE =
  '/images/services/haircut.jpg';

const SERVICE_IMAGE_BY_ID: Record<string, string> = {
  'cuts-haircut': '/images/services/haircut.jpg',
  'cuts-fade': '/images/services/fade.jpg',
  'cuts-buzz': '/images/services/buzzcut.png',
  'cuts-kids': '/images/services/kids_cut.png',
  'cuts-head-shave': '/images/services/head_shave.png',
  'cuts-design': '/images/services/design_haircut-clean.png',
  'beard-trim': '/images/services/beard_trim.png',
  'beard-razor-shave': '/images/services/straight_razor_shave.png',
  'beard-mustache': '/images/services/mustache_trim.png',
  'combo-cut-beard': '/images/services/hair_plus_shave_combo.png',
  'treat-wash-style': '/images/services/hair_wash_plus_styling.png',
  'treat-color': '/images/services/hair_coloring.png',
  'treat-keratin': '/images/services/keratin_treatment.png',
  'extra-nose-ear': '/images/services/ear_nose_wax.png',
  'extra-japanese': '/images/services/japanese_straightening-clean.png',
};

export const SERVICE_BANK: ServiceBankItem[] = SERVICE_BANK_RAW.map((item) => ({
  ...item,
  defaultImageUrl: SERVICE_IMAGE_BY_ID[item.id] ?? FALLBACK_SERVICE_IMAGE,
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
