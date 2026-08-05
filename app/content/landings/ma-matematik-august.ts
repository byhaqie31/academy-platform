import type { LandingCampaign } from '~/types'

// Campaign file. Slug convention: <level>-<subject>-<campaign>.
// The same string is the file name, the route slug, the Pixel content_name,
// the UTM campaign value and the enquiry tag.
//
// ILLUSTRATIVE, not confirmed by Hz: the price and the seat counts. Scarcity
// only works if it is true, so both need checking before this runs as an ad.
export const campaign: LandingCampaign = {
  slug: 'ma-matematik-august',
  level: 'ma',
  subject: 'matematik',
  campaign: 'august',

  pills: ['Ambilan Ogos 2026', 'Tingkatan 4 dan 5', '100% online'],
  headline: 'Kelas Matematik SPM online,',
  headlineAccent: 'kumpulan kecil.',
  subheadline:
    '8 pelajar satu kelas. Cikgu yang sama setiap minggu, bukan cikgu berbeza setiap kali. '
    + 'Setiap kelas dirakam, jadi anak anda boleh ulang kaji bila-bila masa.',

  cta: { label: 'Daftar kelas percubaan percuma', mode: 'both' },

  offer: {
    tag: 'Matematik · Tingkatan 4 dan 5',
    price: 180,
    period: 'bulan',
    schedule: '4 kelas sebulan, setiap Sabtu 8:00 malam',
    includes: [
      'Kelas langsung, bukan video rakaman lama',
      'Rakaman setiap kelas untuk ulang kaji',
      'Nota dan latihan mengikut format SPM',
      'Laporan kehadiran untuk ibu bapa',
    ],
    seatsTotal: 18,
    seatsTaken: 13,
    trial: { label: 'Kelas percubaan percuma', note: 'Tiada bayaran, tiada komitmen' },
  },

  proof: {
    stats: ['since2014', 'students', 'classSize'],
    testimonials: ['aisyah', 'rizal', 'meiling'],
  },

  included: [
    '4 kelas langsung sebulan',
    'Kumpulan maksimum 8 pelajar',
    'Rakaman setiap kelas',
    'Nota mengikut format SPM',
    'Latihan dan kertas percubaan',
    'Laporan kehadiran mingguan',
    'Portal ibu bapa',
    'Cikgu yang sama setiap minggu',
  ],

  faqs: ['live-or-recorded', 'missed-class', 'attendance-proof', 'device-needed', 'can-cancel'],

  form: { levelOptions: ['Tingkatan 4', 'Tingkatan 5', 'Belum pasti'] },

  seo: {
    title: 'Kelas Matematik SPM online, kumpulan kecil',
    description:
      'Kelas Matematik SPM online untuk Tingkatan 4 dan 5. Kumpulan kecil 8 pelajar, '
      + 'cikgu yang sama setiap minggu, rakaman untuk ulang kaji. Ambilan Ogos 2026.',
  },
}
