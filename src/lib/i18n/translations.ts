export type Locale = 'he' | 'en';

export const defaultLocale: Locale = 'he';

export const localeLabels: Record<Locale, string> = {
  he: 'עברית',
  en: 'English',
};

const sharedBarber = {
  id: '1',
  name: 'Eduardo Peretz',
  slug: 'eduardo',
  whatsappNumber: '+972501234567',
  googleReviewsUrl: 'https://google.com/maps',
  heroImageUrl:
    'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=1400&q=80',
  profileImageUrl:
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80',
  isPublished: true,
  workingDays: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'],
  workStartTime: '09:00',
  workEndTime: '19:00',
  breakStart: '13:00',
  breakEnd: '14:00',
  bufferMinutes: 10,
  showPrices: true,
  galleryImages: [
    {
      id: 'g1',
      url: 'https://images.unsplash.com/photo-1634302086706-f7a6e6c0c9e0?w=600&q=80',
      displayOrder: 0,
      isFeatured: true,
    },
    {
      id: 'g2',
      url: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=600&q=80',
      displayOrder: 1,
      isFeatured: false,
    },
    {
      id: 'g3',
      url: 'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=600&q=80',
      displayOrder: 2,
      isFeatured: false,
    },
    {
      id: 'g4',
      url: 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=600&q=80',
      displayOrder: 3,
      isFeatured: false,
    },
    {
      id: 'g5',
      url: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=600&q=80',
      displayOrder: 4,
      isFeatured: false,
    },
    {
      id: 'g6',
      url: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=600&q=80',
      displayOrder: 5,
      isFeatured: false,
    },
  ],
};

export const translations = {
  he: {
    meta: {
      description: 'תספורות בסגנון ישן, דיוק בסגנון חדש',
    },
    common: {
      bookNow: 'קביעת תור',
      viewServices: 'לצפייה בשירותים',
      min: 'דק׳',
      poweredBy: 'Powered by CutSite',
      whatsapp: 'WhatsApp',
      demoBanner: '🚧 מצב הדגמה — נתונים לדוגמה',
    },
    nav: {
      services: 'שירותים',
      gallery: 'גלריה',
      about: 'אודות',
      reviews: 'ביקורות',
      openMenu: 'פתיחת תפריט',
      closeMenu: 'סגירת תפריט',
    },
    home: {
      whatWeDo: 'מה אנחנו עושים',
      seeAllServices: 'לכל השירותים ←',
      theTeam: 'הצוות',
      ctaTitle: 'מוכנים לתספורת חדשה?',
    },
    services: {
      title: 'שירותים',
      readyToBook: 'מוכנים לקבוע תור?',
      chooseService: 'בחרו שירות וקבעו את הזמן המתאים לכם.',
    },
    gallery: {
      title: 'גלריה',
      empty: 'תמונות בקרוב',
      imageAlt: 'תמונה מהגלריה',
    },
    about: {
      label: 'אודות',
      bookAppointment: 'קביעת תור',
      theTeam: 'הצוות',
    },
    reviews: {
      title: 'מה הלקוחות אומרים',
      description:
        'אנחנו גאים בעבודה שלנו. קראו מה הלקוחות שלנו אומרים עלינו ב-Google.',
      readGoogleReviews: 'לקריאת הביקורות ב-Google ←',
      comingSoon: 'ביקורות בקרוב',
    },
    booking: {
      title: 'קביעת תור',
      subtitle: 'בחרו שירות כדי להתחיל',
      step1: '1. בחירת שירות',
      step2: '2. עם מי תרצו?',
      step3: '3. בחירת תאריך ושעה',
      step2NoTeam: '2. בחירת תאריך ושעה',
      step4: '4. הפרטים שלכם',
      step3NoTeam: '3. הפרטים שלכם',
      anyone: 'כל מי שפנוי',
      name: 'שם',
      namePlaceholder: 'שם מלא',
      phone: 'מספר טלפון',
      phoneHint: 'נשלח את אישור התור ב-WhatsApp',
      phonePlaceholder: '+972 50 000 0000',
      notes: 'הערות',
      optional: '(אופציונלי)',
      notesPlaceholder: 'בקשות מיוחדות...',
      confirm: 'אישור התור',
      continue: 'המשך',
      back: 'חזרה',
      staffError: 'אנא בחרו איש צוות אחר',
      noTimesAvailable: 'אין שעות פנויות ביום זה',
      selectDateHint: 'בחרו תאריך כדי לראות שעות פנויות',
      stepOf: 'שלב {current} מתוך {total}',
      wizardSteps: {
        service: 'בחירת שירות',
        barber: 'בחירת ספר',
        datetime: 'תאריך ושעה',
        details: 'פרטים ואישור',
      },
      monthNames: [
        'ינואר',
        'פברואר',
        'מרץ',
        'אפריל',
        'מאי',
        'יוני',
        'יולי',
        'אוגוסט',
        'ספטמבר',
        'אוקטובר',
        'נובמבר',
        'דצמבר',
      ],
      dayNames: ['א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ש'],
      dayAbbrev: ['א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ש'],
    },
    whatsapp: {
      ariaLabel: 'צ׳אט ב-WhatsApp',
      tooltip: 'דברו איתנו',
    },
    barber: {
      ...sharedBarber,
      tagline: 'תספורות בסגנון ישן, דיוק בסגנון חדש',
      neighborhood: 'פלורנטין, תל אביב',
      bio: '25 שנים מאחורי הכיסא. ראיתי טרנדים באים והולכים. מה שלא משתנה זה החשיבות של תספורת נקייה, שיחה אמיתית, ולהרגיש שכל לקוח הוא היחיד בחדר. מגיעים בלי תור? בכיף. לקוחות קבועים? עדיפות.',
      services: [
        {
          id: 's1',
          name: 'תספורת',
          description: 'תספורת קלאסית מותאמת לצורת הפנים ולסגנון שלך.',
          imageUrl:
            'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=600&q=80',
          priceDisplay: '₪80',
          durationMinutes: 45,
          displayOrder: 0,
          isActive: true,
        },
        {
          id: 's2',
          name: 'פייד',
          description: 'מעורר עור ועד אורך, מעבר חלק. השירות הכי מבוקש.',
          imageUrl:
            'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=600&q=80',
          priceDisplay: '₪100',
          durationMinutes: 60,
          displayOrder: 1,
          isActive: true,
        },
        {
          id: 's3',
          name: 'עיצוב זקן',
          description: 'עיצוב, קו ודיוק. משתלב מצוין עם כל תספורת.',
          imageUrl:
            'https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=600&q=80',
          priceDisplay: '₪50',
          durationMinutes: 30,
          displayOrder: 2,
          isActive: true,
        },
        {
          id: 's4',
          name: 'תספורת ילדים',
          description: 'בסבלנות ובזהירות. לקטנטנים.',
          imageUrl:
            'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=600&q=80',
          priceDisplay: '₪60',
          durationMinutes: 30,
          displayOrder: 3,
          isActive: true,
        },
      ],
      teamMembers: [
        {
          id: 't1',
          name: 'Yossi Cohen',
          profileImageUrl:
            'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&q=80',
          isActive: true,
          inviteAccepted: true,
          services: [
            { service: { id: 's1', name: 'תספורת' } },
            { service: { id: 's2', name: 'פייד' } },
          ],
        },
        {
          id: 't2',
          name: 'Amit Peretz',
          profileImageUrl:
            'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80',
          isActive: true,
          inviteAccepted: true,
          services: [
            { service: { id: 's1', name: 'תספורת' } },
            { service: { id: 's3', name: 'עיצוב זקן' } },
          ],
        },
        {
          id: 't3',
          name: 'Daniel Levi',
          profileImageUrl:
            'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&q=80',
          isActive: true,
          inviteAccepted: true,
          services: [
            { service: { id: 's2', name: 'פייד' } },
            { service: { id: 's4', name: 'תספורת ילדים' } },
          ],
        },
        {
          id: 't4',
          name: 'Ronen Bar',
          profileImageUrl:
            'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80',
          isActive: true,
          inviteAccepted: true,
          services: [
            { service: { id: 's1', name: 'תספורת' } },
            { service: { id: 's3', name: 'עיצוב זקן' } },
            { service: { id: 's4', name: 'תספורת ילדים' } },
          ],
        },
      ],
    },
  },
  en: {
    meta: {
      description: 'Old school cuts, new school precision',
    },
    common: {
      bookNow: 'Book Now',
      viewServices: 'View Services',
      min: 'min',
      poweredBy: 'Powered by CutSite',
      whatsapp: 'WhatsApp',
      demoBanner: '🚧 Demo mode — using mock data',
    },
    nav: {
      services: 'Services',
      gallery: 'Gallery',
      about: 'About',
      reviews: 'Reviews',
      openMenu: 'Open menu',
      closeMenu: 'Close menu',
    },
    home: {
      whatWeDo: 'What we do',
      seeAllServices: 'See all services →',
      theTeam: 'The team',
      ctaTitle: 'Ready for a fresh cut?',
    },
    services: {
      title: 'Services',
      readyToBook: 'Ready to book?',
      chooseService: 'Choose a service and pick your time.',
    },
    gallery: {
      title: 'Gallery',
      empty: 'Photos coming soon',
      imageAlt: 'Gallery image',
    },
    about: {
      label: 'About',
      bookAppointment: 'Book an appointment',
      theTeam: 'The team',
    },
    reviews: {
      title: 'What clients say',
      description:
        "We're proud of our work. Read what our clients say about us on Google.",
      readGoogleReviews: 'Read our Google Reviews →',
      comingSoon: 'Reviews coming soon',
    },
    booking: {
      title: 'Book an appointment',
      subtitle: 'Choose a service to get started',
      step1: '1. Choose a service',
      step2: '2. Who would you like?',
      step3: '3. Pick a date & time',
      step2NoTeam: '2. Pick a date & time',
      step4: '4. Your details',
      step3NoTeam: '3. Your details',
      anyone: 'Anyone',
      name: 'Name',
      namePlaceholder: 'Your full name',
      phone: 'Phone number',
      phoneHint: "We'll send your confirmation via WhatsApp",
      phonePlaceholder: '+972 50 000 0000',
      notes: 'Notes',
      optional: '(optional)',
      notesPlaceholder: 'Any special requests...',
      confirm: 'Confirm Booking',
      continue: 'Continue',
      back: 'Back',
      staffError: 'Please choose another staff member',
      noTimesAvailable: 'No available times on this day',
      selectDateHint: 'Select a date to see available times',
      stepOf: 'Step {current} of {total}',
      wizardSteps: {
        service: 'Choose a service',
        barber: 'Choose a barber',
        datetime: 'Date & time',
        details: 'Details & confirm',
      },
      monthNames: [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
      ],
      dayNames: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
      dayAbbrev: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
    },
    whatsapp: {
      ariaLabel: 'Chat on WhatsApp',
      tooltip: 'Chat with us',
    },
    barber: {
      ...sharedBarber,
      tagline: 'Old school cuts, new school precision',
      neighborhood: 'Florentin, Tel Aviv',
      bio: "25 years behind the chair. I've seen trends come and go. What never changes is the importance of a clean cut, a real conversation, and making every client feel like they're the only one in the room. Walk-ins welcome, regulars preferred.",
      services: [
        {
          id: 's1',
          name: 'Haircut',
          description: 'Classic cut tailored to your face shape and style.',
          imageUrl:
            'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=600&q=80',
          priceDisplay: '₪80',
          durationMinutes: 45,
          displayOrder: 0,
          isActive: true,
        },
        {
          id: 's2',
          name: 'Fade',
          description: 'Skin to length, seamless gradient. Our most requested service.',
          imageUrl:
            'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=600&q=80',
          priceDisplay: '₪100',
          durationMinutes: 60,
          displayOrder: 1,
          isActive: true,
        },
        {
          id: 's3',
          name: 'Beard Trim',
          description: 'Shape, line up, and define. Pairs well with any cut.',
          imageUrl:
            'https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=600&q=80',
          priceDisplay: '₪50',
          durationMinutes: 30,
          displayOrder: 2,
          isActive: true,
        },
        {
          id: 's4',
          name: 'Kids Cut',
          description: 'Patient and careful. For the young ones.',
          imageUrl:
            'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=600&q=80',
          priceDisplay: '₪60',
          durationMinutes: 30,
          displayOrder: 3,
          isActive: true,
        },
      ],
      teamMembers: [
        {
          id: 't1',
          name: 'Yossi Cohen',
          profileImageUrl:
            'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&q=80',
          isActive: true,
          inviteAccepted: true,
          services: [
            { service: { id: 's1', name: 'Haircut' } },
            { service: { id: 's2', name: 'Fade' } },
          ],
        },
        {
          id: 't2',
          name: 'Amit Peretz',
          profileImageUrl:
            'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80',
          isActive: true,
          inviteAccepted: true,
          services: [
            { service: { id: 's1', name: 'Haircut' } },
            { service: { id: 's3', name: 'Beard Trim' } },
          ],
        },
        {
          id: 't3',
          name: 'Daniel Levi',
          profileImageUrl:
            'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&q=80',
          isActive: true,
          inviteAccepted: true,
          services: [
            { service: { id: 's2', name: 'Fade' } },
            { service: { id: 's4', name: 'Kids Cut' } },
          ],
        },
        {
          id: 't4',
          name: 'Ronen Bar',
          profileImageUrl:
            'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80',
          isActive: true,
          inviteAccepted: true,
          services: [
            { service: { id: 's1', name: 'Haircut' } },
            { service: { id: 's3', name: 'Beard Trim' } },
            { service: { id: 's4', name: 'Kids Cut' } },
          ],
        },
      ],
    },
  },
} as const;

export type Translations = (typeof translations)[Locale];
