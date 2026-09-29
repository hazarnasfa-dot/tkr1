import { ExamToken } from '../types/cbt';

export const INITIAL_TOKENS: ExamToken[] = [
  {
    id: 'tok-1',
    code: 'EMS-2026-X431',
    title: 'Penilaian Sumatif Akhir Jenjang (PSAJ) PMKR - EMS Gasal',
    classTarget: 'XII TKR 1',
    durationMinutes: 90,
    maxViolationsAllowed: 4,
    isActive: true,
    createdAt: '2026-09-27T07:30:00.000Z',
    expiresAt: '2026-09-28T18:00:00.000Z',
    createdBy: 'Tarim, ST., MT.'
  },
  {
    id: 'tok-2',
    code: 'BINA-KARYA-02',
    title: 'Uji Kompetensi Keahlian (UKK) Diagnosis Scanner Launch X-431',
    classTarget: 'XII TKR 2',
    durationMinutes: 90,
    maxViolationsAllowed: 3,
    isActive: true,
    createdAt: '2026-09-27T08:00:00.000Z',
    expiresAt: '2026-09-28T18:00:00.000Z',
    createdBy: 'Tarim, ST., MT.'
  },
  {
    id: 'tok-3',
    code: 'DIAGNOSIS-TKRO',
    title: 'Evaluasi Berkala Troubleshooting Sensor & Aktuator EFI',
    classTarget: 'XII TKR 3',
    durationMinutes: 90,
    maxViolationsAllowed: 5,
    isActive: true,
    createdAt: '2026-09-27T08:30:00.000Z',
    expiresAt: '2026-09-28T18:00:00.000Z',
    createdBy: 'Tarim, ST., MT.'
  },
  {
    id: 'tok-4',
    code: 'REMIDI-EMS-BK',
    title: 'Remedial & Pengayaan Engine Management System',
    classTarget: 'Semua Kelas XII TKR',
    durationMinutes: 60,
    maxViolationsAllowed: 3,
    isActive: false,
    createdAt: '2026-09-25T10:00:00.000Z',
    expiresAt: '2026-09-26T18:00:00.000Z',
    createdBy: 'Tarim, ST., MT.'
  }
];

export const STUDENT_CLASSES = [
  'XII TKR 1',
  'XII TKR 2',
  'XII TKR 3',
  'XII TKR 4'
];
