import type { LandingCampaign } from '~/types'

// Second campaign. Note how little changes: the structure is identical, only the
// content differs. That is the whole point of the template.
export const campaign: LandingCampaign = {
  slug: 'rendah-matematik-ogos',
  level: 'rendah',
  subject: 'matematik',
  campaign: 'ogos',

  pills: ['Ambilan Ogos 2026', 'Tahun 4, 5 & 6', '100% online'],
  headline: 'Matematik sekolah rendah,',
  headlineAccent: 'asas yang kukuh.',
  subheadline:
    '8 pelajar satu kelas, jadi cikgu tahu bila anak anda diam sebab tak faham. ' +
    'Kelas dirakam, dan anda boleh tengok sendiri cara anak anda belajar.',

  cta: { label: 'Daftar kelas percubaan percuma', mode: 'both' },

  offer: {
    tag: 'Matematik · Tahun 4, 5 & 6',
    price: 120,
    period: 'bulan',
    schedule: '4 kelas sebulan, setiap Sabtu 10:00 pagi',
    includes: [
      'Kelas langsung, satu jam sahaja',
      'Rakaman setiap kelas, ibu bapa boleh tonton',
      'Lembaran kerja mengikut sukatan KSSR',
      'Laporan kehadiran setiap minggu',
    ],
    seatsTotal: 16,
    seatsTaken: 11,
    trial: { label: 'Kelas percubaan percuma', note: 'Tiada bayaran, tiada komitmen' },
  },

  proof: { stats: ['since2014', 'students', 'classSize'], testimonials: ['aisyah-rendah', 'rizal-rendah', 'meiling-rendah'] },

  included: [
    '4 kelas langsung sebulan, 1 jam',
    'Kumpulan maksimum 8 pelajar',
    'Rakaman setiap kelas',
    'Lembaran kerja KSSR',
    'Latihan mingguan bertanda',
    'Laporan kehadiran mingguan',
    'Portal ibu bapa',
    'Cikgu yang sama setiap minggu',
  ],

  // Younger children, different worries entirely
  faqs: ['can-young-child-learn-online', 'must-parent-sit-in', 'missed-class', 'device-needed', 'can-cancel'],

  form: { levelOptions: ['Tahun 4', 'Tahun 5', 'Tahun 6', 'Belum pasti'] },

  seo: {
    title: 'Kelas Matematik sekolah rendah online, asas kukuh',
    description:
      'Kelas Matematik online untuk Tahun 4, 5 dan 6. Kumpulan kecil 8 pelajar, ' +
      'cikgu yang sama setiap minggu, ibu bapa boleh lihat sendiri. Ambilan Ogos 2026.',
  },
}
