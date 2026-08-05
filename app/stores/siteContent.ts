// Seed content for the public marketing website.
//
// Split out of academy.ts to keep that file about the domain entities. It is
// still one Pinia store: these constants are spread into its state.
//
// Language split: everything here is copy a visitor reads, so it is Malay. The
// identifiers, keys and types around it are English.
//
// The existing `subjects` and `marketingSubjects` seeds are deliberately NOT
// reused or translated. They are the portals' and the frozen /v1 archive's
// data; retranslating them would drag v1 into Malay through the shared seam.
//
// ILLUSTRATIVE, not confirmed by Hz: fee amounts, the student and tutor head
// counts, the years of experience, and the testimonials.

import type {
  Faq,
  FeeDiscount,
  FeeTier,
  SiteFooterColumn,
  SiteHero,
  SiteNavItem,
  SitePoint,
  SiteSection,
  SiteStageGroup,
  SiteStep,
  SiteSubjectCard,
  SiteTestimonial,
} from '~/types/site'

/* Navigation ------------------------------------------------------- */

const siteNav: SiteNavItem[] = [
  { to: '/', label: 'Utama' },
  { to: '/subjects', label: 'Subjek' },
  { to: '/how-it-works', label: 'Cara ia berfungsi' },
  { to: '/tutors', label: 'Cikgu' },
  { to: '/fees', label: 'Yuran' },
  { to: '/contact', label: 'Hubungi' },
]

const siteCta: SiteNavItem = { to: '/register', label: 'Daftar minat' }

/** Short descriptor under the wordmark, in the header and the footer. */
const siteBrandSub = 'Tuisyen online'

const siteFooterColumns: SiteFooterColumn[] = [
  {
    title: 'Akademi',
    links: [
      { to: '/subjects', label: 'Subjek' },
      { to: '/how-it-works', label: 'Cara ia berfungsi' },
      { to: '/tutors', label: 'Cikgu' },
      { to: '/fees', label: 'Yuran' },
    ],
  },
]

const siteFooterBlurb =
  'Tuisyen online dipercayai sejak 2014. Kelas langsung kumpulan kecil, dari Tahun 1 hingga SPM.'

/** The portal door. Deliberately in the footer, never in the header. */
const sitePortalLink = {
  title: 'Ibu bapa sedia ada',
  label: 'Log masuk portal',
  to: '/portal/login',
  note: 'Untuk semak kehadiran, jadual dan yuran anak anda.',
}

/* Home ------------------------------------------------------------- */

const siteHero: SiteHero = {
  pills: [
    { label: 'Dipercayai sejak 2014', hot: true },
    { label: '100% online' },
    { label: 'Tahun 1 hingga SPM' },
  ],
  headline: 'Belajar dari rumah,',
  headlineAccent: 'dengan cikgu yang kenal anak anda.',
  lede:
    'Kelas langsung dalam kumpulan kecil, bukan video rakaman. Cikgu yang sama setiap minggu, ' +
    'nota mengikut sukatan KPM, dan laporan kehadiran untuk ibu bapa.',
  primary: { label: 'Daftar minat anak anda', to: '/register' },
  secondary: { label: 'Lihat cara ia berfungsi', to: '/how-it-works' },
  stats: [
    { value: '700+', label: 'Pelajar aktif' },
    { value: '100+', label: 'Cikgu bertauliah' },
    { value: '12 thn', label: 'Pengalaman' },
  ],
  todayTitle: 'Kelas hari ini',
  todayDay: 'Sabtu',
  today: [
    { time: '3:00 PT', subject: 'Matematik · Tahun 4', meta: 'Cikgu Hafiz · 8 pelajar', tone: 'pink', live: true },
    { time: '4:30 PT', subject: 'Sains · Tingkatan 2', meta: 'Cikgu Mei Ling · 7 pelajar', tone: 'blue' },
    { time: '6:00 PT', subject: 'Bahasa Melayu · Tahun 6', meta: 'Cikgu Aishah · 8 pelajar', tone: 'violet' },
    { time: '8:00 ML', subject: 'Matematik · SPM', meta: 'Cikgu Suresh · 6 pelajar', tone: 'green' },
  ],
}

const siteTrustClaims: string[] = [
  'Kelas langsung',
  'Maksimum 8 pelajar',
  'Rakaman setiap kelas',
  'Laporan kehadiran',
]

const siteHomeSubjectsSection: SiteSection = {
  eyebrow: 'Subjek',
  title: 'Semua subjek penting, satu bumbung',
  lede: 'Dari Tahun 1 hingga SPM, mengikut sukatan KPM. Ambil satu subjek sahaja, atau beberapa.',
}

const siteHomeSubjects: SiteSubjectCard[] = [
  { name: 'Matematik', icon: '📐', tone: 'pink', meta: 'Tahun 1 hingga SPM' },
  { name: 'Bahasa Melayu', icon: '📖', tone: 'green', meta: 'Tahun 1 hingga SPM' },
  { name: 'Bahasa Inggeris', icon: '🔤', tone: 'blue', meta: 'Tahun 1 hingga SPM' },
  { name: 'Sains', icon: '🔬', tone: 'violet', meta: 'Tahun 4 hingga SPM' },
  { name: 'Sejarah', icon: '📜', tone: 'amber', meta: 'Tingkatan 1 hingga 5' },
  { name: 'Pendidikan Islam', icon: '🕌', tone: 'green', meta: 'Tahun 1 hingga SPM' },
]

const siteHomeStepsSection: SiteSection = {
  eyebrow: 'Cara ia berfungsi',
  title: 'Empat langkah, tiada yang rumit',
}

const siteHomeSteps: SiteStep[] = [
  { n: '1', title: 'Daftar minat', body: 'Isi nama dan nombor telefon. Kurang dari satu minit.', tone: 'violet' },
  { n: '2', title: 'Kami WhatsApp anda', body: 'Kami sahkan tahap anak dan cadangkan jadual yang sesuai.', tone: 'blue' },
  { n: '3', title: 'Kelas percubaan', body: 'Satu kelas penuh bersama kumpulan sebenar, percuma.', tone: 'green' },
  { n: '4', title: 'Mula belajar', body: 'Yuran bulanan, ikut subjek yang anak anda ambil sahaja.', tone: 'pink' },
]

const siteTestimonialsSection: SiteSection = {
  eyebrow: 'Kata ibu bapa',
  title: 'Bukan janji kami, pengalaman mereka',
}

/** Keyed so spec B's campaign files can pick a subset by id. */
const siteTestimonials: SiteTestimonial[] = [
  {
    id: 'aisyah',
    quote: 'Dulu anak saya takut Matematik. Sekarang dia yang ingatkan saya jangan lupa kelas Sabtu.',
    name: 'Puan Aisyah',
    meta: 'Ibu kepada Adam, Tahun 4',
    tone: 'violet',
  },
  {
    id: 'rizal',
    quote: 'Yang saya suka, ada rakaman. Kalau anak saya terlepas, dia boleh tengok balik malam.',
    name: 'Encik Rizal',
    meta: 'Bapa kepada Nur Iman, Tingkatan 5',
    tone: 'pink',
  },
  {
    id: 'meiling',
    quote: 'Kelas kecil ni bezanya besar. Cikgu kenal anak saya, tahu mana dia lemah.',
    name: 'Puan Mei Ling',
    meta: 'Ibu kepada Wong Jia, Tingkatan 4',
    tone: 'blue',
  },
  // Sekolah Rendah voices. A campaign picks the set that matches its audience:
  // an SPM parent and a Tahun 4 parent are not reassured by the same thing.
  {
    id: 'aisyah-rendah',
    quote: 'Anak saya umur sembilan tahun, saya ingat mesti tak boleh duduk diam. Rupanya sebab kelas kecil, cikgu panggil nama dia selalu.',
    name: 'Puan Aisyah',
    meta: 'Ibu kepada Adam, Tahun 4',
    tone: 'violet',
  },
  {
    id: 'rizal-rendah',
    quote: 'Saya tengok rakaman kelas sekali, terus faham cara cikgu ajar. Senang nak bantu anak buat kerja rumah lepas tu.',
    name: 'Encik Rizal',
    meta: 'Bapa kepada Nur Iman, Tahun 5',
    tone: 'pink',
  },
  {
    id: 'meiling-rendah',
    quote: 'Dulu anak saya tak berani angkat tangan di sekolah. Dalam kelas lapan orang ni dia mula bertanya sendiri.',
    name: 'Puan Mei Ling',
    meta: 'Ibu kepada Wong Jia, Tahun 6',
    tone: 'blue',
  },
]

/* Landing pages ---------------------------------------------------- */

// Chrome shared by every campaign. Anything that differs per campaign lives in
// the campaign's own file under app/content/landings/, never here.
const landingTrustClaims: string[] = [
  'Cikgu bertauliah',
  'Kumpulan kecil 8 pelajar',
  'Rakaman setiap kelas',
  'Laporan kehadiran mingguan',
]

/** Hero headline numbers, keyed so a campaign names the three it wants. */
const landingStats: Record<string, { value: string, label: string }> = {
  since2014: { value: '2014', label: 'Dipercayai sejak' },
  students: { value: '700+', label: 'Pelajar aktif' },
  classSize: { value: '8', label: 'Pelajar satu kelas' },
  recorded: { value: '100%', label: 'Kelas dirakam' },
}

const landingHowSection: SiteSection = {
  eyebrow: 'Cara ia berjalan',
  title: 'Empat langkah, tiada yang rumit',
  lede: 'Kelas online masih baharu untuk ramai ibu bapa. Ini apa yang berlaku selepas anda daftar.',
}

const landingHowSteps: SiteStep[] = [
  { n: '1', title: 'Daftar minat', body: 'Isi nama dan nombor telefon. Ambil masa kurang satu minit.', tone: 'violet' },
  { n: '2', title: 'Kami WhatsApp anda', body: 'Dalam masa 15 minit pada waktu pejabat. Kami sahkan tahap anak dan jadual yang sesuai.', tone: 'blue' },
  { n: '3', title: 'Kelas percubaan percuma', body: 'Satu kelas penuh bersama kumpulan sebenar. Tiada bayaran, tiada komitmen.', tone: 'green' },
  { n: '4', title: 'Mula kelas mingguan', body: 'Kalau anak anda selesa, barulah kita teruskan. Kalau tidak, tiada apa yang perlu dibayar.', tone: 'pink' },
]

const landingIncludedSection: SiteSection = {
  eyebrow: 'Apa yang termasuk',
  title: 'Semua sekali, satu yuran',
  lede:
    'Tiada bayaran tersembunyi untuk nota, rakaman atau laporan. Yuran bulanan meliputi semuanya '
    + 'di sebelah.',
}

const landingOfferCopy = {
  title: 'Cuba satu kelas dahulu, percuma',
  body:
    'Kami tidak minta anda percaya begitu sahaja. Sertai satu kelas penuh bersama kumpulan '
    + 'sebenar, lihat sendiri cara cikgu mengajar, kemudian baru buat keputusan.',
  freeLabel: 'Percuma',
  freeNote: 'untuk kelas pertama',
  ctaLabel: 'Daftar sekarang',
  fineprint: 'Tiada kad kredit diperlukan',
}

const landingFinalSection: SiteSection = {
  eyebrow: 'Langkah terakhir',
  title: 'Daftar kelas percubaan percuma',
  lede: 'Isi ruangan di bawah, atau terus WhatsApp kami kalau lebih selesa berbual.',
}

const landingFormLabels = {
  name: 'Nama ibu atau bapa',
  namePlaceholder: 'Cth: Puan Aisyah',
  phone: 'No. telefon (WhatsApp)',
  phonePlaceholder: 'Cth: 012-345 6789',
  level: 'Tahap anak',
  or: 'atau',
  whatsapp: 'WhatsApp kami terus',
  reply: 'Kami biasanya membalas dalam masa 15 minit pada waktu pejabat.',
  sentTitle: 'Terima kasih',
  sentBody: 'Kami akan WhatsApp anda, biasanya dalam 15 minit pada waktu pejabat.',
  incomplete: 'Isi nama, nombor telefon dan tandakan kebenaran untuk menghantar.',
}

const landingFooterNote = 'Tuisyen online, dipercayai sejak 2014.'

/** Seat counter wording, e.g. "13 daripada 18 penuh". */
const landingSeatsLabel = 'Tempat ambilan'

const siteHomeCta = {
  title: 'Cuba satu kelas dahulu, percuma',
  body:
    'Sertai satu kelas penuh bersama kumpulan sebenar. Lihat sendiri cara cikgu mengajar, ' +
    'kemudian baru buat keputusan.',
  cta: { label: 'Daftar minat sekarang', to: '/register' } as SiteNavItem,
}

/* Subjects page ---------------------------------------------------- */

const siteSubjectsSection: SiteSection = {
  eyebrow: 'Subjek dan tahap',
  title: 'Apa yang kami ajar',
  lede:
    'Semua kelas mengikut sukatan KPM. Anak anda boleh ambil satu subjek sahaja, atau beberapa, ' +
    'dan yuran dikira mengikut subjek yang diambil.',
}

const siteStageGroups: SiteStageGroup[] = [
  {
    key: 'rendah',
    title: 'Sekolah Rendah',
    tag: 'Tahun 1 hingga 6',
    subjects: [
      { name: 'Matematik', icon: '📐', tone: 'pink', meta: 'Asas kukuh, teknik menjawab pantas' },
      { name: 'Bahasa Melayu', icon: '📖', tone: 'green', meta: 'Karangan, tatabahasa, pemahaman' },
      { name: 'Bahasa Inggeris', icon: '🔤', tone: 'blue', meta: 'Pertuturan, penulisan, keyakinan' },
      { name: 'Sains', icon: '🔬', tone: 'violet', meta: 'Tahun 4 ke atas' },
      { name: 'Pendidikan Islam', icon: '🕌', tone: 'green', meta: 'Jawi, tajwid dan akhlak' },
    ],
  },
  {
    key: 'mr',
    title: 'Menengah Rendah',
    tag: 'Tingkatan 1 hingga 3',
    subjects: [
      { name: 'Matematik', icon: '📐', tone: 'pink', meta: 'Persediaan PT3 yang mantap' },
      { name: 'Bahasa Melayu', icon: '📖', tone: 'green', meta: 'Karangan dan komsas' },
      { name: 'Bahasa Inggeris', icon: '🔤', tone: 'blue', meta: 'Tatabahasa dan penulisan' },
      { name: 'Sains', icon: '🔬', tone: 'violet', meta: 'Eksperimen dan fakta mudah diingat' },
      { name: 'Sejarah', icon: '📜', tone: 'amber', meta: 'Teknik hafalan dan nota ringkas' },
      { name: 'Pendidikan Islam', icon: '🕌', tone: 'green', meta: 'Mengikut sukatan KSSM' },
    ],
  },
  {
    key: 'ma',
    title: 'Menengah Atas',
    tag: 'Tingkatan 4 dan 5 · SPM',
    subjects: [
      { name: 'Matematik dan Add Maths', icon: '📐', tone: 'pink', meta: 'Fokus skor A, teknik peperiksaan' },
      { name: 'Bahasa Melayu', icon: '📖', tone: 'green', meta: 'Karangan berformat SPM' },
      { name: 'Bahasa Inggeris', icon: '🔤', tone: 'blue', meta: 'Esei dan pemahaman' },
      { name: 'Fizik, Kimia, Biologi', icon: '🔬', tone: 'violet', meta: 'Aliran sains tulen' },
      { name: 'Sejarah', icon: '📜', tone: 'amber', meta: 'Peta minda dan kertas percubaan' },
      { name: 'Pendidikan Islam', icon: '🕌', tone: 'green', meta: 'Persediaan SPM' },
    ],
  },
]

const siteSubjectsNote: SitePoint = {
  lead: 'Tidak pasti tahap yang sesuai untuk anak anda?',
  body:
    'WhatsApp kami. Kami akan tanya beberapa soalan ringkas dan cadangkan kelas yang paling sesuai, ' +
    'tanpa sebarang komitmen.',
}

/* How it works page ------------------------------------------------ */

const siteHowSection: SiteSection = {
  eyebrow: 'Cara ia berfungsi',
  title: 'Kelas online, diterangkan dengan jujur',
  lede: 'Kalau anak anda belum pernah belajar secara online, ini yang sebenarnya berlaku setiap minggu.',
}

const siteHowPoints: SitePoint[] = [
  {
    lead: 'Kelas berlaku secara langsung.',
    body:
      'Cikgu mengajar pada waktu yang ditetapkan melalui Zoom, dan pelajar boleh bertanya terus. ' +
      'Ini bukan video rakaman lama.',
  },
  {
    lead: 'Kumpulan kecil, maksimum 8 pelajar.',
    body: 'Cukup kecil untuk cikgu tahu siapa yang diam dan siapa yang faham.',
  },
  {
    lead: 'Cikgu yang sama setiap minggu.',
    body: 'Anak anda tidak berjumpa cikgu berbeza setiap kali.',
  },
  {
    lead: 'Rakaman dihantar selepas kelas.',
    body: 'Untuk ulang kaji, atau kalau terlepas.',
  },
  {
    lead: 'Nota dan latihan mengikut sukatan KPM.',
    body: 'Dihantar sebelum kelas bermula.',
  },
]

const siteWhatYouNeed = {
  title: 'Apa yang anak anda perlukan',
  items: [
    'Telefon pintar, tablet atau komputer riba',
    'Sambungan internet yang stabil',
    'Aplikasi Zoom, percuma untuk dimuat turun',
    'Buku nota dan alat tulis, seperti biasa',
  ],
  note: 'Telefon pintar sudah memadai, tetapi skrin yang lebih besar lebih selesa untuk menulis nota.',
}

const siteFirstWeekSection: SiteSection = {
  eyebrow: 'Minggu pertama',
  title: 'Dari daftar sehingga kelas pertama',
}

const siteFirstWeekSteps: SiteStep[] = [
  { n: '1', title: 'Anda daftar minat', body: 'Nama, nombor telefon dan tahap anak. Kurang satu minit.', tone: 'violet' },
  { n: '2', title: 'Kami hubungi', body: 'Melalui WhatsApp, biasanya dalam 15 minit pada waktu pejabat.', tone: 'blue' },
  { n: '3', title: 'Kelas percubaan', body: 'Satu kelas penuh, percuma, bersama kumpulan sebenar.', tone: 'green' },
  { n: '4', title: 'Anda putuskan', body: 'Kalau sesuai, kami hantar maklumat yuran dan jadual tetap.', tone: 'pink' },
]

/* FAQs ------------------------------------------------------------- */

const siteFaqSection: SiteSection = {
  eyebrow: 'Soalan lazim',
  title: 'Soalan yang ibu bapa selalu tanya',
}

/** Keyed individually so a campaign file can name the five it wants. */
const faqs: Record<string, Faq> = {
  'live-or-recorded': {
    q: 'Kelas ini langsung atau rakaman sahaja?',
    a:
      'Langsung. Cikgu mengajar secara langsung pada waktu yang ditetapkan dan pelajar boleh bertanya ' +
      'terus. Rakaman diberi selepas kelas untuk ulang kaji, bukan sebagai ganti kelas.',
  },
  'missed-class': {
    q: 'Kalau anak saya terlepas satu kelas?',
    a:
      'Rakaman dihantar pada hari yang sama berserta nota dan latihan. Kalau terlepas dua kelas ' +
      'berturut-turut, cikgu akan hubungi anda.',
  },
  'attendance-proof': {
    q: 'Macam mana saya tahu anak saya betul-betul masuk kelas?',
    a:
      'Anda akan terima laporan kehadiran setiap minggu. Kehadiran direkod secara automatik apabila ' +
      'pelajar masuk ke kelas, bukan ditanda secara manual.',
  },
  'one-subject': {
    q: 'Boleh ambil satu subjek sahaja?',
    a:
      'Boleh. Yuran dikira mengikut subjek yang diambil, jadi anda hanya bayar untuk apa yang anak ' +
      'anda belajar.',
  },
  'can-cancel': {
    q: 'Boleh berhenti bila-bila masa?',
    a:
      'Boleh. Yuran dibayar bulanan dan tiada kontrak jangka panjang. Beritahu kami sebelum bulan ' +
      'berikutnya bermula.',
  },
  'device-needed': {
    q: 'Perlu komputer atau telefon sahaja sudah memadai?',
    a:
      'Telefon pintar sudah memadai. Tablet atau komputer riba lebih selesa untuk menulis nota, ' +
      'tetapi bukan satu kewajipan.',
  },
  // Sekolah Rendah campaigns face a different worry entirely: not "is it
  // effective" but "can a nine year old do this at all".
  'can-young-child-learn-online': {
    q: 'Anak saya baru sepuluh tahun. Boleh ke dia belajar online?',
    a:
      'Boleh. Kelas hanya satu jam, kumpulan kecil, dan cikgu panggil nama setiap pelajar supaya ' +
      'tiada siapa duduk diam sepanjang kelas. Pada minggu pertama kami bantu anak anda masuk kelas.',
  },
  'must-parent-sit-in': {
    q: 'Perlu saya duduk sebelah anak sepanjang kelas?',
    a:
      'Tidak perlu. Kebanyakan ibu bapa hanya bantu buka kelas pada minggu pertama. Selepas itu ' +
      'anak anda boleh masuk sendiri, dan anda terima laporan kehadiran setiap minggu.',
  },
}

/** Named sets. The website uses 'website'; spec B's campaigns pick their own keys. */
const faqSets: Record<string, string[]> = {
  website: ['live-or-recorded', 'missed-class', 'attendance-proof', 'one-subject', 'can-cancel'],
}

/* Tutors page ------------------------------------------------------ */

const siteTutorsSection: SiteSection = {
  eyebrow: 'Cikgu kami',
  title: 'Orang yang mengajar anak anda',
  lede:
    'Lebih 100 cikgu bertauliah mengajar di Hz Academy. Setiap kelas dikendalikan oleh cikgu yang ' +
    'sama setiap minggu, supaya mereka benar-benar kenal pelajar mereka.',
}

/** Public-only fields, keyed by educator id. Rate and hours never appear here. */
const educatorPublic: Record<string, { years: number; bio: string }> = {
  hafiz: { years: 9, bio: 'Pakar teknik menjawab kertas SPM.' },
  meiling: { years: 7, bio: 'Eksperimen yang mudah difahami dari rumah.' },
  suresh: { years: 6, bio: 'Fokus pada keyakinan bertutur dan penulisan.' },
  aishah: { years: 11, bio: 'Bekas guru sekolah menengah.' },
  faridah: { years: 8, bio: 'Sabar dengan pelajar yang lemah asas.' },
  daniel: { years: 10, bio: 'Robotik, pengekodan dan sains gunaan.' },
}

const siteTutorsNote: SitePoint = {
  lead: 'Setiap cikgu disaring sebelum mengajar.',
  body:
    'Kelayakan disemak, sesi percubaan dinilai, dan prestasi dipantau melalui maklum balas ibu bapa ' +
    'setiap penggal.',
}

/* Fees page -------------------------------------------------------- */

const siteFeesSection: SiteSection = {
  eyebrow: 'Yuran',
  title: 'Yuran kami, dinyatakan terus terang',
  lede:
    'Yuran dikira mengikut subjek yang anak anda ambil. Tiada bayaran tersembunyi untuk nota, ' +
    'rakaman atau laporan.',
}

const feeTiers: FeeTier[] = [
  { stage: 'rendah', title: 'Sekolah Rendah', levels: 'Tahun 1 hingga 6', format: '4 kelas sebulan, 1 jam setiap kelas', monthly: 120 },
  { stage: 'mr', title: 'Menengah Rendah', levels: 'Tingkatan 1 hingga 3', format: '4 kelas sebulan, 1.5 jam setiap kelas', monthly: 150 },
  { stage: 'ma', title: 'Menengah Atas', levels: 'Tingkatan 4 dan 5', format: '4 kelas sebulan, 1.5 jam setiap kelas', monthly: 180 },
]

const feeIncludes: string[] = [
  '4 kelas langsung sebulan',
  'Kumpulan maksimum 8 pelajar',
  'Rakaman setiap kelas',
  'Nota dan latihan mengikut KPM',
  'Laporan kehadiran mingguan',
  'Portal ibu bapa',
]

const feeDiscounts: FeeDiscount[] = [
  { label: '2 subjek', note: 'diskaun 5%' },
  { label: '3 subjek atau lebih', note: 'diskaun 10%' },
  { label: 'Adik-beradik', note: 'diskaun 10% untuk anak kedua dan seterusnya' },
]

const feeDiscountLede =
  'Ambil lebih daripada satu subjek, atau daftar lebih daripada seorang anak, dan yuran dikurangkan ' +
  'secara automatik.'

const feePaymentNote =
  'Yuran dibayar setiap bulan melalui perbankan online, FPX atau DuitNow. Resit dihantar secara ' +
  'automatik selepas pembayaran diterima.'

/* Contact page ----------------------------------------------------- */

const siteContactSection: SiteSection = {
  eyebrow: 'Hubungi kami',
  title: 'Ada soalan? WhatsApp kami.',
  lede:
    'Cara paling cepat untuk dapatkan jawapan. Kami biasanya membalas dalam masa 15 minit pada ' +
    'waktu pejabat.',
}

const siteOfficeHours: string[] = [
  'Isnin hingga Jumaat · 9:00 pagi hingga 6:00 petang',
  'Sabtu · 9:00 pagi hingga 1:00 petang',
]

/** Prefilled WhatsApp message. Encoded at the call site. */
const siteWhatsAppMessage = 'Salam, saya berminat dengan kelas Hz Academy'

const siteEnquiryLevels: string[] = [
  'Sekolah Rendah, Tahun 1 hingga 6',
  'Menengah Rendah, Tingkatan 1 hingga 3',
  'Menengah Atas, Tingkatan 4 dan 5',
  'Belum pasti',
]

const siteConsentLabel =
  'Saya bersetuju Hz Academy menghubungi saya melalui WhatsApp berkenaan kelas tuisyen.'

export const siteContent = {
  siteNav,
  siteCta,
  siteBrandSub,
  siteFooterColumns,
  siteFooterBlurb,
  sitePortalLink,
  siteHero,
  siteTrustClaims,
  siteHomeSubjectsSection,
  siteHomeSubjects,
  siteHomeStepsSection,
  siteHomeSteps,
  siteTestimonialsSection,
  siteTestimonials,
  siteHomeCta,
  siteSubjectsSection,
  siteStageGroups,
  siteSubjectsNote,
  siteHowSection,
  siteHowPoints,
  siteWhatYouNeed,
  siteFirstWeekSection,
  siteFirstWeekSteps,
  siteFaqSection,
  faqs,
  faqSets,
  siteTutorsSection,
  educatorPublic,
  siteTutorsNote,
  siteFeesSection,
  feeTiers,
  feeIncludes,
  feeDiscounts,
  feeDiscountLede,
  feePaymentNote,
  siteContactSection,
  siteOfficeHours,
  siteWhatsAppMessage,
  siteEnquiryLevels,
  siteConsentLabel,
  landingTrustClaims,
  landingStats,
  landingHowSection,
  landingHowSteps,
  landingIncludedSection,
  landingOfferCopy,
  landingFinalSection,
  landingFormLabels,
  landingFooterNote,
  landingSeatsLabel,
}
