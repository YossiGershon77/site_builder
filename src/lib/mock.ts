import {
  defaultLocale,
  translations,
  type Locale,
} from '@/lib/i18n/translations';
import { dateKeyOffset, type DayOff } from '@/lib/days-off/types';
import { SERVICE_BANK, type ServiceCategory } from '@/lib/service-bank';
import { DEFAULT_SERVICE_PRICES } from '@/lib/setup/constants';

export type UserRole = 'OWNER' | 'TEAM_MEMBER';
export type AppointmentStatus = 'CONFIRMED' | 'PENDING' | 'CANCELLED';

export interface MockUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  barberId: string;
  teamMemberId: string | null;
}

export const mockCurrentUser: MockUser = {
  id: 'u1',
  email: 'eduardo@demo.com',
  name: 'Eduardo Peretz',
  role: 'OWNER',
  barberId: '1',
  teamMemberId: null,
};

// Swap with mockCurrentUserAsStaff to test the staff view
export const mockCurrentUserAsStaff: MockUser = {
  id: 'u2',
  email: 'yossi@demo.com',
  name: 'Yossi Cohen',
  role: 'TEAM_MEMBER',
  barberId: '1',
  teamMemberId: 't1',
};

export const mockStaffUsers: MockUser[] = [
  mockCurrentUserAsStaff,
  {
    id: 'u3',
    email: 'amit@demo.com',
    name: 'Amit Peretz',
    role: 'TEAM_MEMBER',
    barberId: '1',
    teamMemberId: 't2',
  },
  {
    id: 'u4',
    email: 'daniel@demo.com',
    name: 'Daniel Levi',
    role: 'TEAM_MEMBER',
    barberId: '1',
    teamMemberId: 't3',
  },
  {
    id: 'u5',
    email: 'ronen@demo.com',
    name: 'Ronen Bar',
    role: 'TEAM_MEMBER',
    barberId: '1',
    teamMemberId: 't4',
  },
];

export const mockLoginEmails = [
  mockCurrentUser.email,
  ...mockStaffUsers.map((u) => u.email),
];

export const initialDaysOff: DayOff[] = [
  { id: 'do-t2-today', date: dateKeyOffset(0), memberId: 't2', name: 'Amit Peretz' },
  { id: 'do-t3-tomorrow', date: dateKeyOffset(1), memberId: 't3', name: 'Daniel Levi' },
  { id: 'do-owner-3d', date: dateKeyOffset(3), memberId: 'owner', name: 'Eduardo Peretz' },
];

export interface BarberService {
  id: string;
  bankId: string | null;
  name: string;
  nameHe?: string;
  description: string;
  descriptionHe?: string;
  imageUrl: string | null;
  priceDisplay: string | null;
  durationMinutes: number;
  showDuration: boolean;
  displayOrder: number;
  isActive: boolean;
}

export function localizeBarberServices(
  services: readonly BarberService[],
  locale: Locale,
): BarberService[] {
  return services
    .filter((service) => service.isActive)
    .map((service) => ({
      ...service,
      name: locale === 'he' ? (service.nameHe ?? service.name) : service.name,
      description:
        locale === 'he'
          ? (service.descriptionHe ?? service.description)
          : service.description,
    }));
}

export interface TeamMemberService {
  service: { id: string; name: string };
}

export interface TeamMember {
  id: string;
  name: string;
  profileImageUrl: string | null;
  isActive: boolean;
  inviteAccepted: boolean;
  email?: string | null;
  whatsappNumber?: string | null;
  workingDays?: string[] | null;
  workStartTime?: string | null;
  workEndTime?: string | null;
  breakStart?: string | null;
  breakEnd?: string | null;
  inviteToken?: string;
  services: readonly TeamMemberService[];
}

export interface GalleryImage {
  id: string;
  url: string;
  displayOrder: number;
  isFeatured: boolean;
}

export interface Appointment {
  id: string;
  clientName: string;
  clientPhone: string;
  startTime: Date;
  endTime: Date;
  status: AppointmentStatus;
  bookingCode: string;
  service: { id: string; name: string };
  teamMember: { id: string; name: string } | null;
}

export interface MockBarber {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  address: string;
  neighborhood: string;
  bio: string;
  whatsappNumber: string;
  instagramUrl: string | null;
  facebookUrl: string | null;
  googleMapsUrl: string | null;
  googleReviewsUrl: string | null;
  heroImageUrl: string | null;
  profileImageUrl: string | null;
  isPublished: boolean;
  workingDays: string[];
  workStartTime: string;
  workEndTime: string;
  breakStart: string | null;
  breakEnd: string | null;
  bufferMinutes: number;
  showPrices: boolean;
  services: readonly BarberService[];
  galleryImages: readonly GalleryImage[];
  teamMembers: readonly TeamMember[];
  appointments?: readonly Appointment[];
}

function apptTime(dayOffset: number, time: string): Date {
  const [hours, minutes] = time.split(':').map(Number);
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() + dayOffset);
  date.setHours(hours, minutes, 0, 0);
  return date;
}

const baseBarber = translations[defaultLocale].barber;

function buildDefaultSelectedServices(): SetupSelectedService[] {
  return SERVICE_BANK.map((service) => ({
    bankId: service.id,
    customId: undefined,
    name: service.name,
    nameHe: service.nameHe,
    category: service.category,
    description: null,
    price: DEFAULT_SERVICE_PRICES[service.id] ?? 50,
    durationMinutes: service.defaultDurationMinutes,
    imageUrl: service.defaultImageUrl,
    useDefaultImage: true,
    showPrice: true,
    showDuration: true,
  }));
}

function buildTeamServiceEntries(
  services: readonly SetupSelectedService[],
): TeamMemberService[] {
  return services.map((service, index) => ({
    service: {
      id: `s${index + 1}`,
      name: service.name,
    },
  }));
}

const defaultSelectedServices = buildDefaultSelectedServices();
const mockSelectedServices = defaultSelectedServices;
const allMockTeamServices = buildTeamServiceEntries(mockSelectedServices);

const mockTeamMembers: TeamMember[] = [
  {
    id: 't1',
    name: 'Yossi Cohen',
    profileImageUrl:
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&q=80',
    isActive: true,
    inviteAccepted: true,
    email: 'yossi@demo.com',
    whatsappNumber: '+972501111111',
    workingDays: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'],
    workStartTime: '09:00',
    workEndTime: '19:00',
    breakStart: '13:00',
    breakEnd: '14:00',
    services: allMockTeamServices,
  },
  {
    id: 't2',
    name: 'Amit Peretz',
    profileImageUrl:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80',
    isActive: true,
    inviteAccepted: true,
    email: 'amit@demo.com',
    whatsappNumber: '+972527777777',
    workingDays: ['Sunday', 'Monday', 'Tuesday', 'Wednesday'],
    workStartTime: '10:00',
    workEndTime: '18:00',
    breakStart: null,
    breakEnd: null,
    services: allMockTeamServices,
  },
  {
    id: 't3',
    name: 'Daniel Levi',
    profileImageUrl:
      'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&q=80',
    isActive: true,
    inviteAccepted: true,
    email: 'daniel@demo.com',
    whatsappNumber: '+972502222222',
    workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday'],
    workStartTime: '09:00',
    workEndTime: '17:00',
    breakStart: '13:00',
    breakEnd: '14:00',
    services: allMockTeamServices,
  },
  {
    id: 't4',
    name: 'Ronen Bar',
    profileImageUrl:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80',
    isActive: true,
    inviteAccepted: true,
    email: 'ronen@demo.com',
    whatsappNumber: '+972503333333',
    workingDays: ['Sunday', 'Tuesday', 'Wednesday', 'Thursday'],
    workStartTime: '11:00',
    workEndTime: '19:00',
    breakStart: null,
    breakEnd: null,
    services: allMockTeamServices,
  },
];

function buildAppointments(): Appointment[] {
  return [
    {
      id: 'a1',
      clientName: 'Avi Levi',
      clientPhone: '+972521111111',
      startTime: apptTime(0, '09:00'),
      endTime: apptTime(0, '09:45'),
      status: 'CONFIRMED',
      bookingCode: 'AV1234',
      service: { id: 's1', name: 'Haircut' },
      teamMember: null,
    },
    {
      id: 'a2',
      clientName: 'Dana Katz',
      clientPhone: '+972522222222',
      startTime: apptTime(0, '10:00'),
      endTime: apptTime(0, '11:00'),
      status: 'CONFIRMED',
      bookingCode: 'DK5678',
      service: { id: 's2', name: 'Fade' },
      teamMember: { id: 't1', name: 'Yossi Cohen' },
    },
    {
      id: 'a3',
      clientName: 'Moshe Ben David',
      clientPhone: '+972523333333',
      startTime: apptTime(0, '11:15'),
      endTime: apptTime(0, '11:45'),
      status: 'PENDING',
      bookingCode: 'MB9012',
      service: { id: 's3', name: 'Beard Trim' },
      teamMember: { id: 't2', name: 'Amit Peretz' },
    },
    {
      id: 'a4',
      clientName: 'Shira Goldman',
      clientPhone: '+972524444444',
      startTime: apptTime(0, '12:00'),
      endTime: apptTime(0, '12:30'),
      status: 'CONFIRMED',
      bookingCode: 'SG3456',
      service: { id: 's4', name: 'Kids Cut' },
      teamMember: { id: 't3', name: 'Daniel Levi' },
    },
    {
      id: 'a5',
      clientName: 'Tamar Friedman',
      clientPhone: '+972525555555',
      startTime: apptTime(0, '14:00'),
      endTime: apptTime(0, '14:45'),
      status: 'CONFIRMED',
      bookingCode: 'TF7890',
      service: { id: 's1', name: 'Haircut' },
      teamMember: { id: 't1', name: 'Yossi Cohen' },
    },
    {
      id: 'a6',
      clientName: 'Idan Mor',
      clientPhone: '+972526666666',
      startTime: apptTime(0, '15:30'),
      endTime: apptTime(0, '16:30'),
      status: 'CONFIRMED',
      bookingCode: 'IM2345',
      service: { id: 's2', name: 'Fade' },
      teamMember: { id: 't4', name: 'Ronen Bar' },
    },
    {
      id: 'a7',
      clientName: 'Gal Rosen',
      clientPhone: '+972527777777',
      startTime: apptTime(0, '16:45'),
      endTime: apptTime(0, '17:15'),
      status: 'CONFIRMED',
      bookingCode: 'GR6789',
      service: { id: 's3', name: 'Beard Trim' },
      teamMember: null,
    },
    {
      id: 'a8',
      clientName: 'Ronen Shaked',
      clientPhone: '+972528888888',
      startTime: apptTime(1, '09:00'),
      endTime: apptTime(1, '09:45'),
      status: 'CONFIRMED',
      bookingCode: 'RS9012',
      service: { id: 's1', name: 'Haircut' },
      teamMember: null,
    },
    {
      id: 'a9',
      clientName: 'Maya Cohen',
      clientPhone: '+972529999999',
      startTime: apptTime(1, '10:30'),
      endTime: apptTime(1, '11:15'),
      status: 'CONFIRMED',
      bookingCode: 'MC3456',
      service: { id: 's1', name: 'Haircut' },
      teamMember: { id: 't2', name: 'Amit Peretz' },
    },
    {
      id: 'a10',
      clientName: 'Liat Azulay',
      clientPhone: '+972520000000',
      startTime: apptTime(1, '12:00'),
      endTime: apptTime(1, '13:00'),
      status: 'CANCELLED',
      bookingCode: 'LA7890',
      service: { id: 's2', name: 'Fade' },
      teamMember: { id: 't3', name: 'Daniel Levi' },
    },
    {
      id: 'a11',
      clientName: 'Tom Berger',
      clientPhone: '+972521234567',
      startTime: apptTime(1, '14:00'),
      endTime: apptTime(1, '14:30'),
      status: 'CONFIRMED',
      bookingCode: 'TB1234',
      service: { id: 's4', name: 'Kids Cut' },
      teamMember: { id: 't4', name: 'Ronen Bar' },
    },
  ];
}

export type SetupStatus = 'IN_PROGRESS' | 'COMPLETED';

export type SetupSelectedService = {
  bankId: string | null;
  customId?: string;
  name: string;
  nameHe?: string;
  category?: ServiceCategory;
  description: string | null;
  price: number;
  durationMinutes: number;
  imageUrl: string | null;
  useDefaultImage: boolean;
  showPrice: boolean;
  showDuration: boolean;
  isCustom?: boolean;
};

export type SetupInvite = {
  id: string;
  name: string;
  email: string;
};

export type SetupGalleryPhoto = {
  id: string;
  url: string;
  isFeatured: boolean;
};

export type SetupData = {
  details: {
    name: string;
    tagline: string;
    whatsappNumber: string;
    instagramUrl: string;
    facebookUrl: string;
    subdomain: string;
    googleMapsUrl: string;
    address: string;
    about: string;
  };
  services: {
    selectedServices: SetupSelectedService[];
    globalShowPrices: boolean;
    globalShowDurations: boolean;
  };
  hours: {
    workingDays: string[];
    workStartTime: string;
    workEndTime: string;
    breakStart: string;
    breakEnd: string;
    hasBreak: boolean;
  };
  gallery: {
    placePhotos: SetupGalleryPhoto[];
    profilePhoto: string | null;
  };
  staff: {
    invites: SetupInvite[];
  };
};

// TODO [ASAF]: Replace with real API call
export const mockSetupSession = {
  id: 'setup-1',
  token: 'abc123xyz',
  status: 'IN_PROGRESS' as SetupStatus,
  currentStep: 1,
  createdAt: new Date(),
  expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  data: {
    details: {
      name: 'Eduardo Peretz',
      tagline: 'Old school cuts, new school precision',
      whatsappNumber: '+972501234567',
      instagramUrl: 'https://instagram.com/eduardo.barber',
      facebookUrl: '',
      subdomain: 'eduardo',
      googleMapsUrl: 'https://maps.google.com/?cid=123456',
      address: 'Florentin 42, Tel Aviv',
      about: '25 years behind the chair. Walk-ins welcome, regulars preferred.',
    },
    services: {
      selectedServices: mockSelectedServices,
      globalShowPrices: true,
      globalShowDurations: true,
    },
    hours: {
      workingDays: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'] as string[],
      workStartTime: '09:00',
      workEndTime: '19:00',
      breakStart: '13:00',
      breakEnd: '14:00',
      hasBreak: true,
    },
    gallery: {
      // TODO: Replace with real gallery images
      placePhotos: baseBarber.galleryImages.map((image) => ({
        id: image.id,
        url: image.url,
        isFeatured: image.isFeatured,
      })) as SetupGalleryPhoto[],
      profilePhoto: baseBarber.profileImageUrl,
    },
    staff: {
      invites: [] as SetupInvite[],
    },
  } satisfies SetupData,
};

export function buildBarberFromSetup(setup: SetupData): MockBarber {
  return {
    id: '1',
    name: setup.details.name,
    slug: setup.details.subdomain,
    tagline: setup.details.tagline || '',
    whatsappNumber: setup.details.whatsappNumber,
    instagramUrl: setup.details.instagramUrl || null,
    facebookUrl: setup.details.facebookUrl || null,
    address: setup.details.address,
    neighborhood: setup.details.address,
    bio: setup.details.about || '',
    googleMapsUrl: setup.details.googleMapsUrl || null,
    googleReviewsUrl: setup.details.googleMapsUrl || null,
    heroImageUrl: setup.gallery.placePhotos[0]?.url || null,
    profileImageUrl: setup.gallery.profilePhoto || null,
    isPublished: true,
    workingDays: setup.hours.workingDays,
    workStartTime: setup.hours.workStartTime,
    workEndTime: setup.hours.workEndTime,
    breakStart: setup.hours.breakStart || null,
    breakEnd: setup.hours.breakEnd || null,
    bufferMinutes: 10,
    showPrices: setup.services.globalShowPrices,
    services: setup.services.selectedServices.map((service, index) => {
      const bankItem = SERVICE_BANK.find((item) => item.id === service.bankId);
      return {
        id: service.customId ?? `s${index + 1}`,
        bankId: service.bankId,
        name: service.name || bankItem?.name || '',
        nameHe: service.nameHe || bankItem?.nameHe || service.name || '',
        description: service.description?.trim() || bankItem?.description || '',
        descriptionHe: bankItem?.descriptionHe,
        imageUrl: service.imageUrl || bankItem?.defaultImageUrl || null,
        priceDisplay:
          service.showPrice && service.price ? `₪${service.price}` : null,
        durationMinutes:
          service.durationMinutes || bankItem?.defaultDurationMinutes || 30,
        showDuration: service.showDuration,
        displayOrder: index,
        isActive: true,
      };
    }),
    galleryImages: setup.gallery.placePhotos.map((photo, index) => ({
      id: `g${index + 1}`,
      url: photo.url,
      displayOrder: index,
      isFeatured: index === 0,
    })),
    teamMembers: setup.staff.invites.map((invite, index) => ({
      id: `t${index + 1}`,
      name: invite.name,
      email: invite.email,
      profileImageUrl: null,
      isActive: false,
      inviteAccepted: false,
      services: [],
    })),
    appointments: buildAppointments(),
  };
}

// The public site reads from this object.
// It's built from the same data the wizard saves.
export const mockBarber = buildBarberFromSetup(mockSetupSession.data);

export function getBarberServiceByBankId(
  bankId: string,
): BarberService | undefined {
  return mockBarber.services.find(
    (service) => service.bankId === bankId && service.isActive,
  );
}
