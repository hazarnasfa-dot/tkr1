import { Question } from '../types/cbt';

export const EMS_EXAM_METADATA = {
  school: "SMKS Bina Karya 2 Karawang",
  subject: "Pemeliharaan Mesin Kendaraan Ringan (PMKR)",
  competency: "Engine Management System (EMS) Kendaraan Ringan (Sensor, Aktuator, Trouble Diagnosis & Scanner Launch X-431)",
  instructor: "Tarim, ST., MT.",
  targetClass: "XII Teknik Kendaraan Ringan Otomotif (TKRO)",
  passingScore: 75,
  totalPoints: 100,
  durationMinutes: 90
};

export const INITIAL_QUESTIONS: Question[] = [
  // ==========================================
  // BAGIAN 1: PILIHAN GANDA BIASA (15 Soal, Poin 1 per soal = 15 poin)
  // ==========================================
  {
    id: 1,
    type: 'single',
    difficulty: 'mudah',
    points: 1,
    competency: 'Sensor EMS',
    prompt: 'Sensor pada sistem Engine Management System (EMS) yang bertugas mendeteksi suhu cairan pendingin mesin untuk menentukan koreksi pengabutan bahan bakar saat start dingin adalah...',
    options: [
      { id: 'A', text: 'Intake Air Temperature (IAT) Sensor' },
      { id: 'B', text: 'Engine Coolant Temperature (ECT) Sensor' },
      { id: 'C', text: 'Throttle Position Sensor (TPS)' },
      { id: 'D', text: 'Manifold Absolute Pressure (MAP) Sensor' },
      { id: 'E', text: 'Knock Sensor' }
    ],
    correctAnswers: ['B'],
    explanation: 'ECT (Engine Coolant Temperature) sensor menggunakan thermistor tipe NTC (Negative Temperature Coefficient) untuk membaca suhu air pendingin mesin sebagai acuan utama sistem cold start enrichment (pengayaan campuran saat mesin dingin).'
  },
  {
    id: 2,
    type: 'single',
    difficulty: 'mudah',
    points: 1,
    competency: 'Sensor EMS',
    prompt: 'Prinsip kerja thermistor tipe NTC (Negative Temperature Coefficient) yang digunakan pada sensor IAT dan ECT adalah...',
    options: [
      { id: 'A', text: 'Semakin tinggi suhu mesin, nilai resistansi thermistor akan semakin meningkat' },
      { id: 'B', text: 'Semakin tinggi suhu mesin, nilai resistansi thermistor akan semakin menurun' },
      { id: 'C', text: 'Nilai resistansi thermistor konstan pada rentang suhu 0°C hingga 100°C' },
      { id: 'D', text: 'Tegangan keluaran sensor selalu 5.0 Volt pada segala kondisi suhu' },
      { id: 'E', text: 'Menghasilkan arus bolak-balik (AC) berdasarkan getaran blok silinder' }
    ],
    correctAnswers: ['B'],
    explanation: 'Thermistor NTC memiliki karakteristik resistansi berbanding terbalik dengan temperatur. Ketika suhu meningkat, nilai hambatannya (Ohm) mengecil sehingga tegangan sinyal yang terbaca oleh pin THW/THA di ECM mengecil.'
  },
  {
    id: 3,
    type: 'single',
    difficulty: 'mudah',
    points: 1,
    competency: 'Aktuator EMS',
    prompt: 'Komponen aktuator pada sistem Electronic Fuel Injection (EFI) yang berfungsi menyemprotkan bahan bakar bertekanan ke dalam saluran hisap (intake manifold) atau langsung ke ruang bakar adalah...',
    options: [
      { id: 'A', text: 'Fuel Pressure Regulator' },
      { id: 'B', text: 'Injektor Bensin (Fuel Injector)' },
      { id: 'C', text: 'Idle Air Control Valve (IACV)' },
      { id: 'D', text: 'Canister Purge Solenoid' },
      { id: 'E', text: 'Fuel Pump Relay' }
    ],
    correctAnswers: ['B'],
    explanation: 'Injektor adalah solenoid elektromagnetik presisi yang dikendalikan pulsa ground (pulsa durasi penginjeksian) dari ECM untuk mengabutkan bahan bakar.'
  },
  {
    id: 4,
    type: 'single',
    difficulty: 'mudah',
    points: 1,
    competency: 'Sensor EMS',
    prompt: 'Sensor yang berfungsi mendeteksi posisi sudut bukaan katup gas (throttle butterfly valve) untuk mengenali mode akselerasi, deselerasi, dan beban penuh adalah...',
    options: [
      { id: 'A', text: 'Throttle Position Sensor (TPS)' },
      { id: 'B', text: 'Crankshaft Position Sensor (CKP)' },
      { id: 'C', text: 'Camshaft Position Sensor (CMP)' },
      { id: 'D', text: 'Vehicle Speed Sensor (VSS)' },
      { id: 'E', text: 'Exhaust Gas Recirculation (EGR) Sensor' }
    ],
    correctAnswers: ['A'],
    explanation: 'TPS (Throttle Position Sensor) memberikan sinyal analog (atau Hall effect digital pada throttle-by-wire) yang menginformasikan derajat bukaan katup gas ke ECM.'
  },
  {
    id: 5,
    type: 'single',
    difficulty: 'mudah',
    points: 1,
    competency: 'Scanner Launch X-431 & Osiloskop',
    prompt: 'Konektor standar internasional yang digunakan untuk menghubungkan scanner diagnosis seperti Launch X-431 ke sistem komputer kendaraan modern (OBD-II) memiliki jumlah pin sebanyak...',
    options: [
      { id: 'A', text: '12 Pin' },
      { id: 'B', text: '14 Pin' },
      { id: 'C', text: '16 Pin' },
      { id: 'D', text: '20 Pin' },
      { id: 'E', text: '24 Pin' }
    ],
    correctAnswers: ['C'],
    explanation: 'Soket DLC (Data Link Connector) standar OBD-II (SAE J1962) memiliki 16 pin, di mana Pin 4 & 5 adalah Ground, Pin 6 & 14 adalah CAN Bus High/Low, dan Pin 16 adalah Baterai 12V.'
  },
  {
    id: 6,
    type: 'single',
    difficulty: 'mudah',
    points: 1,
    competency: 'Trouble Diagnosis & DTC',
    prompt: 'Lampu indikator pada instrumen dashboard kendaraan yang akan menyala ketika ECM mendeteksi adanya malfungsi atau kegagalan pada sistem emisi/manajemen mesin disebut...',
    options: [
      { id: 'A', text: 'Oil Pressure Warning Lamp' },
      { id: 'B', text: 'Malfunction Indicator Lamp (MIL) / Check Engine' },
      { id: 'C', text: 'Charging Warning Lamp' },
      { id: 'D', text: 'Brake Warning Indicator' },
      { id: 'E', text: 'ABS Indicator Lamp' }
    ],
    correctAnswers: ['B'],
    explanation: 'MIL (Malfunction Indicator Lamp) atau lampu Check Engine menyala ketika ECM mendeteksi sinyal sensor di luar batas wajar (out of range) atau misfire berbahaya.'
  },
  {
    id: 7,
    type: 'single',
    difficulty: 'mudah',
    points: 1,
    competency: 'Sensor EMS',
    prompt: 'Sensor yang menggunakan elemen piezo-elektrik untuk mendeteksi gelombang ketukan (knocking/detonasi) pada blok silinder mesin adalah...',
    options: [
      { id: 'A', text: 'Knock Sensor' },
      { id: 'B', text: 'Oxygen (O2) Sensor' },
      { id: 'C', text: 'Oil Pressure Switch' },
      { id: 'D', text: 'Mass Air Flow Sensor' },
      { id: 'E', text: 'Crankshaft Position Sensor' }
    ],
    correctAnswers: ['A'],
    explanation: 'Knock Sensor memanfaatkan kristal piezoelektrik yang menghasilkan tegangan AC kecil ketika terkena frekuensi getaran detonasi mesin (sekitar 5-8 kHz), memicu ECM memundurkan sudut pengapian (ignition retard).'
  },
  {
    id: 8,
    type: 'single',
    difficulty: 'sedang',
    points: 1,
    competency: 'Sensor EMS',
    prompt: 'Pada sistem D-EFI (D-Jetronic), parameter utama yang digunakan oleh ECM untuk mengkalkulasi volume udara masuk ke silinder adalah...',
    options: [
      { id: 'A', text: 'Massa aliran udara langsung melalui kawat panas MAF' },
      { id: 'B', text: 'Kerapatan udara berdasarkan tekanan absolut intake manifold (MAP) dan putaran mesin (RPM)' },
      { id: 'C', text: 'Hanya berdasarkan sudut bukaan katup gas (TPS) saja' },
      { id: 'D', text: 'Berdasarkan konsentrasi gas oksigen pada knalpot' },
      { id: 'E', text: 'Berdasarkan sinyal tegangan dari sensor Knock' }
    ],
    correctAnswers: ['B'],
    explanation: 'Sistem D-EFI (D = Druck/Tekanan) menggunakan metode Speed-Density, yaitu mengkalkulasi massa udara dari tekanan absolut manifold (MAP sensor), suhu udara (IAT), dan putaran mesin (CKP sensor).'
  },
  {
    id: 9,
    type: 'single',
    difficulty: 'sedang',
    points: 1,
    competency: 'Scanner Launch X-431 & Osiloskop',
    prompt: 'Saat menggunakan scanner Launch X-431 pada menu Live Data Stream di mesin Toyota Avanza 1.3 dual VVT-i dalam kondisi idle bersuhu kerja normal, nilai normal pembacaan tegangan Heated Oxygen Sensor 1 (Bank 1 Sensor 1) adalah berosilasi antara...',
    options: [
      { id: 'A', text: '0.1 Volt sampai 0.9 Volt' },
      { id: 'B', text: '4.5 Volt sampai 5.0 Volt konstan' },
      { id: 'C', text: '11.5 Volt sampai 14.2 Volt' },
      { id: 'D', text: '0.0 Volt flat tanpa fluktuasi' },
      { id: 'E', text: '2.4 Volt sampai 2.6 Volt konstan' }
    ],
    correctAnswers: ['A'],
    explanation: 'Narrowband Zirconia O2 Sensor menghasilkan tegangan 0.1V (campuran kurus/lean) hingga 0.9V (campuran kaya/rich) yang berayun cepat melewati titik stokiometri 0.45V saat closed-loop.'
  },
  {
    id: 10,
    type: 'single',
    difficulty: 'sedang',
    points: 1,
    competency: 'Aktuator EMS',
    prompt: 'Fungsi dari sistem VVT-i (Variable Valve Timing - intelligent) yang dikendalikan oleh aktuator Oil Control Valve (OCV) pada mesin bensin modern adalah...',
    options: [
      { id: 'A', text: 'Mengatur tekanan bahan bakar di fuel rail secara elektronik' },
      { id: 'B', text: 'Mengatur sudut overlap dan waktu buka-tutup katup masuk sesuai beban dan putaran mesin' },
      { id: 'C', text: 'Memutus aliran oli pelumas saat putaran mesin tinggi' },
      { id: 'D', text: 'Menaikkan tekanan kompresi silinder saat mesin mati' },
      { id: 'E', text: 'Menggantikan peran busi dalam membakar campuran bahan bakar' }
    ],
    correctAnswers: ['B'],
    explanation: 'OCV mengalirkan tekanan oli hidrolis ke camshaft phaser (sprocket VVT-i) guna memajukan (advance) atau memundurkan (retard) waktu buka katup hisap untuk efisiensi volumetrik dan emisi optimal.'
  },
  {
    id: 11,
    type: 'single',
    difficulty: 'sedang',
    points: 1,
    competency: 'Scanner Launch X-431 & Osiloskop',
    prompt: 'Fitur pada scanner Launch X-431 yang merekam kondisi seluruh parameter sensor dan aktuator tepat pada detik terjadinya malfungsi (saat kode DTC tersimpan) dinamakan...',
    options: [
      { id: 'A', text: 'Clear DTC / Erase Memory' },
      { id: 'B', text: 'Freeze Frame Data' },
      { id: 'C', text: 'Special Functions / Coding' },
      { id: 'D', text: 'Actuation Test' },
      { id: 'E', text: 'ECU Version Information' }
    ],
    correctAnswers: ['B'],
    explanation: 'Freeze Frame Data adalah snapshot rekaman parameter operasi mesin (seperti RPM, Vehicle Speed, ECT, Fuel Trim, MAP) yang disimpan ECU tepat saat sebuah DTC trip/muncul.'
  },
  {
    id: 12,
    type: 'single',
    difficulty: 'hots',
    points: 1,
    competency: 'Trouble Diagnosis & DTC',
    prompt: 'Sebuah mobil Daihatsu Xenia 1.3L mengalami putaran idle tidak stabil (hunting 500-1100 RPM) dan mesin mati saat AC dihidupkan. Pada scanner X-431 tidak ditemukan DTC aktif. Berdasarkan kasus ini, komponen yang paling mungkin mengalami penumpukan jelaga kotoran karbon adalah...',
    options: [
      { id: 'A', text: 'Elemen pemanas O2 Sensor' },
      { id: 'B', text: 'Rotary Idle Air Control Valve (IACV) / Throttle Body Idle Port' },
      { id: 'C', text: 'Sensor Knocking di silinder block' },
      { id: 'D', text: 'Fuel Pressure Regulator spring' },
      { id: 'E', text: 'Sensor Camshaft (CMP)' }
    ],
    correctAnswers: ['B'],
    explanation: 'Penumpukan karbon pada celah rotary valve IACV atau throttle bore menghalangi bypass udara kompensasi idle-up saat beban AC menyala, mengakibatkan mesin drop atau hunting tanpa memicu DTC kelistrikan karena sirkuit selenoid IACV tidak putus.'
  },
  {
    id: 13,
    type: 'single',
    difficulty: 'hots',
    points: 1,
    competency: 'Trouble Diagnosis & DTC',
    prompt: 'Pada pembacaan scanner Launch X-431, mekanik menemukan kode DTC P0171 (System Too Lean - Bank 1) disertai nilai Long Term Fuel Trim (LTFT) mencapai +28% (kondisi idle). Namun saat mesin digas ke 2.500 RPM, nilai STFT dan LTFT berangsur turun mendekati 0%. Penyebab utama gangguan ini adalah...',
    options: [
      { id: 'A', text: 'Kebocoran kevakuman (vacuum leak) pada intake manifold atau slang PCV' },
      { id: 'B', text: 'Pompa bahan bakar (fuel pump) mengalami drop total tekanan tinggi' },
      { id: 'C', text: 'Filter bensin tersumbat parah di semua rentang RPM' },
      { id: 'D', text: 'Injektor silinder 1 macet terbuka (stuck open)' },
      { id: 'E', text: 'Knalpot mengalami penyumbatan pada Catalytic Converter' }
    ],
    correctAnswers: ['A'],
    explanation: 'Kebocoran vakum memiliki pengaruh paling drastis saat idle (karena rasio udara bocor terhadap total udara masuk sangat besar). Pada 2.500 RPM volume udara hisap normal jauh melimpah sehingga efek udara bocor relatif tereduksi dan Fuel Trim kembali normal.'
  },
  {
    id: 14,
    type: 'single',
    difficulty: 'hots',
    points: 1,
    competency: 'Scanner Launch X-431 & Osiloskop',
    prompt: 'Saat menguji sinyal injektor bensin menggunakan osiloskop otomotif, teknisi menemukan bahwa puncak tegangan induksi balik (inductive flyback spike) yang seharusnya mencapai 60V–80V ternyata hanya terukur sebesar 12V (flat tidak ada lonjakan spike saat ground diputus ECM). Kesimpulan diagnosis yang tepat adalah...',
    options: [
      { id: 'A', text: 'Koil pengapian mengalami kebocoran insulasi sekunder' },
      { id: 'B', text: 'Solenoid injektor mengalami internal short circuit atau tidak terjadi pengisian medan magnet' },
      { id: 'C', text: 'Tekanan bahan bakar dari tangki terlalu tinggi' },
      { id: 'D', text: 'Sensor Oksigen memberikan sinyal rich terus menerus' },
      { id: 'E', text: 'Sensor MAP menghasilkan tegangan frekuensi tinggi' }
    ],
    correctAnswers: ['B'],
    explanation: 'Spike tegangan induksi balik (flyback ~60-80V) tercipta dari keruntuhan medan magnet (collapse of magnetic field) pada kumparan solenoid injektor ketika saklar transistor ECM off. Bila flat 12V, kumparan injektor putus/konslet atau sirkuit kontrol tidak mengalirkan arus.'
  },
  {
    id: 15,
    type: 'single',
    difficulty: 'hots',
    points: 1,
    competency: 'Trouble Diagnosis & DTC',
    prompt: 'Mesin Toyota Avanza mogok tiba-tiba saat berjalan. Hasil scan dengan Launch X-431 terbaca DTC P0335 (Crankshaft Position Sensor "A" Circuit Malfunction). Setelah dicek, sensor CKP tipe Hall Effect memiliki 3 pin kabel. Prosedur pengetesan tegangan referensi dan ground pada soket harness yang dilepas (kunci kontak ON) adalah...',
    options: [
      { id: 'A', text: 'Pin Power harus ada 12V/5V, Pin Ground harus ada kontinuitas ke massa bodi (<1 Ohm), Pin Signal terukur tegangan pull-up sekitar 5V' },
      { id: 'B', text: 'Ketiga pin harus mengeluarkan tegangan baterai 12.6 Volt' },
      { id: 'C', text: 'Semua pin harus dihubungkan langsung dengan kabel jumper ke kutub positif baterai' },
      { id: 'D', text: 'Pin 1 dan 2 harus menghasilkan resistansi 0 Ohm tanpa ground' },
      { id: 'E', text: 'Sensor diukur dengan megger tegangan 500 Volt' }
    ],
    correctAnswers: ['A'],
    explanation: 'Sensor Hall effect 3-kabel membutuhkan tegangan catu (Power 5V atau 12V), Ground yang solid (<1 Ohm), dan jalur Sinyal dengan tegangan referensi/pull-up dari ECM (biasanya 5V) saat soket terbuka.'
  },

  // ==========================================
  // BAGIAN 2: PILIHAN GANDA KOMPLEKS (15 Soal, Poin 2 per soal = 30 poin)
  // *Multiple select: Lebih dari satu jawaban benar*
  // ==========================================
  {
    id: 16,
    type: 'multiple',
    difficulty: 'mudah',
    points: 2,
    competency: 'Sensor EMS',
    prompt: 'Manakah dari komponen sensor berikut yang menghasilkan sinyal analog tegangan bervariasi langsung ke ECM berdasarkan parameter fisik mesin? (Pilih 2 jawaban yang benar)',
    options: [
      { id: 'A', text: 'Throttle Position Sensor (tipe potensiometer)' },
      { id: 'B', text: 'Engine Coolant Temperature Sensor (tipe thermistor)' },
      { id: 'C', text: 'Switch Pedal Rem (Brake Pedal Switch on/off)' },
      { id: 'D', text: 'Park/Neutral Position Switch' }
    ],
    correctAnswers: ['A', 'B'],
    explanation: 'TPS potensiometer dan ECT thermistor menghasilkan sinyal analog kontinyu (0-5 Volt). Sementara switch pedal rem dan park/neutral switch adalah sensor digital dua status (ON/OFF).'
  },
  {
    id: 17,
    type: 'multiple',
    difficulty: 'mudah',
    points: 2,
    competency: 'Aktuator EMS',
    prompt: 'Berikut ini yang merupakan komponen aktuator keluaran (output devices) yang dikendalikan langsung oleh ECM pada mobil bensin injeksi adalah... (Pilih 3 jawaban yang benar)',
    options: [
      { id: 'A', text: 'Electronic Fuel Injector' },
      { id: 'B', text: 'Ignition Coil / Igniter' },
      { id: 'C', text: 'Oxygen Sensor' },
      { id: 'D', text: 'Purge Control Solenoid Valve' },
      { id: 'E', text: 'Manifold Absolute Pressure Sensor' }
    ],
    correctAnswers: ['A', 'B', 'D'],
    explanation: 'Injektor, Koil pengapian, dan Purge Valve adalah aktuator (output). O2 sensor dan MAP sensor adalah sensor (input).'
  },
  {
    id: 18,
    type: 'multiple',
    difficulty: 'mudah',
    points: 2,
    competency: 'Scanner Launch X-431 & Osiloskop',
    prompt: 'Fungsi utama yang tersedia pada menu diagnosis sistem OBD-II di scanner Launch X-431 meliputi... (Pilih 3 jawaban yang benar)',
    options: [
      { id: 'A', text: 'Read Trouble Code (Membaca kode kerusakan DTC)' },
      { id: 'B', text: 'Clear Trouble Code (Menghapus riwayat DTC dan mematikan MIL)' },
      { id: 'C', text: 'Read Data Stream (Menampilkan data parameter live engine sensor)' },
      { id: 'D', text: 'Menambah kapasitas silinder (cc) mesin secara mekanik' },
      { id: 'E', text: 'Mengubah bahan bakar bensin menjadi solar secara otomatis' }
    ],
    correctAnswers: ['A', 'B', 'C'],
    explanation: 'Read DTC, Clear DTC, dan Data Stream adalah pilar utama fungsi scan tool diagnostik elektronik.'
  },
  {
    id: 19,
    type: 'multiple',
    difficulty: 'mudah',
    points: 2,
    competency: 'Sensor EMS',
    prompt: 'Sensor posisi poros (CKP dan CMP) pada kendaraan otomotif modern umumnya memanfaatkan prinsip kerja tipe... (Pilih 2 jawaban yang benar)',
    options: [
      { id: 'A', text: 'Induktif / Variable Reluctance (pembangkit sinyal AC 2 kabel)' },
      { id: 'B', text: 'Hall Effect (pembangkit sinyal gelombang kotak DC 3 kabel)' },
      { id: 'C', text: 'Bimetal Strip Termal' },
      { id: 'D', text: 'Kapasitor Mika Statis' }
    ],
    correctAnswers: ['A', 'B'],
    explanation: 'Sensor poros engkol (CKP) dan poros bubungan (CMP) pada otomotif modern memanfaatkan sensor induktif elektromagnetik (2 pin) atau Hall Effect / Magnetoresistive (3 pin).'
  },
  {
    id: 20,
    type: 'multiple',
    difficulty: 'mudah',
    points: 2,
    competency: 'Trouble Diagnosis & DTC',
    prompt: 'Kondisi di bawah ini yang dapat menyebabkan lampu Malfunction Indicator Lamp (MIL) berkedip cepat (flashing) saat mobil melaju adalah... (Pilih 2 jawaban yang benar)',
    options: [
      { id: 'A', text: 'Terjadi severe misfire (kegagalan pembakaran parah) pada salah satu atau lebih silinder' },
      { id: 'B', text: 'Kondisi misfire berisiko merusak Catalytic Converter akibat bahan bakar mentah terbakar di knalpot' },
      { id: 'C', text: 'Air wiper tangki cadangan habis' },
      { id: 'D', text: 'Kaca spion samping terlipat' }
    ],
    correctAnswers: ['A', 'B'],
    explanation: 'Menurut standar OBD-II, MIL yang berkedip (blinking/flashing) mengindikasikan misfire tingkat berat (kategori Catalyst Damaging Misfire) yang dapat melelehkan matriks honeycomb catalytic converter.'
  },
  {
    id: 21,
    type: 'multiple',
    difficulty: 'sedang',
    points: 2,
    competency: 'Sensor EMS',
    prompt: 'Karakteristik dari sensor Mass Air Flow (MAF) tipe Hot-Wire pada sistem L-EFI meliputi... (Pilih 3 jawaban yang benar)',
    options: [
      { id: 'A', text: 'Mengukur langsung massa udara (gram/detik) yang masuk tanpa terpengaruh variasi kerapatan udara akibat ketinggian' },
      { id: 'B', text: 'Kawat platinum dipanaskan hingga selisih suhu konstan tertentu di atas suhu udara masuk' },
      { id: 'C', text: 'Memiliki fungsi burn-off circuit untuk membersihkan kotoran kawat saat mesin baru dimatikan' },
      { id: 'D', text: 'Menggunakan flap/pintu geser mekanis dengan pegas pengembali' },
      { id: 'E', text: 'Menghasilkan sinyal hidrolik oli menuju ECM' }
    ],
    correctAnswers: ['A', 'B', 'C'],
    explanation: 'MAF hot-wire mengukur mass flow rate langsung dengan mempertahankan suhu kawat lebih panas ~100-200°C di atas ambient air, memiliki burn-off cleaner. MAF tipe vane/flap menggunakan pintu mekanis (sistem lawas L-Jetronic).'
  },
  {
    id: 22,
    type: 'multiple',
    difficulty: 'sedang',
    points: 2,
    competency: 'Aktuator EMS',
    prompt: 'Ketika ECM melakukan kontrol loop terbuka (Open Loop Mode), faktor apa saja yang menyebabkan sistem mengabaikan sinyal koreksi dari Sensor Oksigen? (Pilih 3 jawaban yang benar)',
    options: [
      { id: 'A', text: 'Mesin masih dalam fase pemanasan awal (Cold Start / Warm Up phase)' },
      { id: 'B', text: 'Pengendara menginjak pedal gas penuh (Wide Open Throttle / Full Load Acceleration)' },
      { id: 'C', text: 'Kondisi deselerasi dengan pemutusan bahan bakar (Deceleration Fuel Cut-Off)' },
      { id: 'D', text: 'Mobil melaju konstan di jalan tol pada kecepatan 80 km/jam dengan suhu kerja normal' },
      { id: 'E', text: 'Sensor Oksigen telah mencapai suhu operasional 350°C' }
    ],
    correctAnswers: ['A', 'B', 'C'],
    explanation: 'Open Loop terjadi saat cold start, akselerasi penuh (butuh power enrichment tanpa memperhatikan AFR stokiometri), dan fuel cut off saat deselerasi. Kecepatan jelajah stabil adalah domain Closed Loop.'
  },
  {
    id: 23,
    type: 'multiple',
    difficulty: 'sedang',
    points: 2,
    competency: 'Scanner Launch X-431 & Osiloskop',
    prompt: 'Manakah tindakan keselamatan kerja (K3) dan prosedur standar saat melakukan pengujian Actuation Test pada scanner Launch X-431 di bengkel? (Pilih 2 jawaban yang benar)',
    options: [
      { id: 'A', text: 'Memastikan tuas transmisi pada posisi Netral/Parkir dan rem parkir aktif' },
      { id: 'B', text: 'Menghindari menyentuh bilah kipas radiator yang dapat menyala mendadak saat Cooling Fan Relay diuji' },
      { id: 'C', text: 'Melepas kabel kutub positif baterai saat proses scanner berkomunikasi dengan ECU' },
      { id: 'D', text: 'Menghubungkan pin CAN High langsung ke massa bodi dengan obeng minus' }
    ],
    correctAnswers: ['A', 'B'],
    explanation: 'Saat actuation test, ECM menggerakkan aktuator secara paksa (misal fan, fuel pump, injector). Posisi kendaraan harus terkunci aman dan tangan teknisi jauh dari bilah kipas atau puli bergerak.'
  },
  {
    id: 24,
    type: 'multiple',
    difficulty: 'hots',
    points: 2,
    competency: 'Trouble Diagnosis & DTC',
    prompt: 'Sebuah mobil Toyota Yaris mengalami akselerasi tersendat-sendat (hesitation) saat pedal gas ditekan mendadak. Pada scanner terbaca DTC P0121 (TPS Range/Performance). Hasil pengetesan osiloskop pada kabel sinyal TPS tipe analog saat pedal ditekan perlahan menunjukkan grafik tegangan yang mengalami drop tajam (spike ke 0 Volt) pada sudut bukaan 25%. Kerusakan yang terjadi adalah... (Pilih 2 jawaban yang benar)',
    options: [
      { id: 'A', text: 'Lintasan jalur resistif karbon (carbon resistor track) TPS aus atau tergores pada posisi sudut 25%' },
      { id: 'B', text: 'Wiper arm potensiometer kehilangan kontak sesaat (dead zone / open circuit) pada titik tersebut' },
      { id: 'C', text: 'Tekanan ban depan kiri kurang dari 30 psi' },
      { id: 'D', text: 'Koil pengapian silinder 4 mengalami kabel ground putus total' }
    ],
    correctAnswers: ['A', 'B'],
    explanation: 'Grafik TPS analog harus naik mulus tanpa drop (glitch-free). Glitch/drop tegangan ke 0V saat diayun adalah bukti fisik ausnya jalur karbon atau jari kontak wiper yang kotor/rusak pada area sudut tertentu.'
  },
  {
    id: 25,
    type: 'multiple',
    difficulty: 'hots',
    points: 2,
    competency: 'Trouble Diagnosis & DTC',
    prompt: 'Pada pembacaan Live Data scanner Launch X-431 mobil Honda Brio, parameter Short Term Fuel Trim (STFT) terbaca -18% dan Long Term Fuel Trim (LTFT) terbaca -15%. Kondisi ini menunjukkan ECM sedang memangkas suplai bahan bakar (mengurangi durasi injeksi). Apa sajakah penyebab mekanikal/elektrikal yang mungkin menimbulkan kondisi "Rich" tersebut? (Pilih 3 jawaban yang benar)',
    options: [
      { id: 'A', text: 'Tekanan bahan bakar terlalu tinggi akibat saluran balik (fuel return line) tersumbat atau regulator macet tertutup' },
      { id: 'B', text: 'Injektor silinder bocor atau menetes (leaking/dripping injector)' },
      { id: 'C', text: 'EVAP Purge Valve macet terbuka terus menerus (stuck open) sehingga uap bensin dari tangki terhisap liar' },
      { id: 'D', text: 'Terjadi kebocoran udara masuk pada paking manifold setelah sensor MAF' },
      { id: 'E', text: 'Pompa bahan bakar menghasilkan tekanan di bawah 1.5 bar' }
    ],
    correctAnswers: ['A', 'B', 'C'],
    explanation: 'Fuel trim negatif (memiskinkan campuran) dipicu oleh kelebihan bensin riil atau uap bensin tak terkontrol: fuel pressure terlalu tinggi, injektor bocor menetes, atau canister purge valve bocor/terbuka terus. Kebocoran vakum justru memicu fuel trim positif.'
  },
  {
    id: 26,
    type: 'multiple',
    difficulty: 'hots',
    points: 2,
    competency: 'Trouble Diagnosis & DTC',
    prompt: 'Mobil Suzuki Ertiga bermesin K14B mengalami keluhan mesin mati mendadak saat kondisi panas (setelah dikendarai 30 menit). Ketika distarter saat mesin panas, mesin hanya berputar (cranking) tetapi tidak mau hidup. Namun setelah mesin didiamkan dingin selama 45 menit, mesin dapat dihidupkan dengan normal kembali. Analisis diagnosis yang paling akurat untuk kasus thermal failure ini adalah... (Pilih 2 jawaban yang benar)',
    options: [
      { id: 'A', text: 'Sensor CKP atau CMP tipe induktif mengalami sirkuit terbuka (open circuit) akibat kawat kumparan halus memuai dan putus saat temperatur tinggi' },
      { id: 'B', text: 'Setelah dingin, kawat kumparan sensor menyusut kembali dan terhubung (kontinuitas pulih)' },
      { id: 'C', text: 'Timing belt terlepas sendiri saat panas lalu terpasang otomatis saat dingin' },
      { id: 'D', text: 'Platina pengapian aus pada celah kontak' }
    ],
    correctAnswers: ['A', 'B'],
    explanation: 'Thermal open-circuit failure pada kumparan sensor CKP/CMP magnetik sangat sering dijumpai di bengkel. Panas mesin menyebabkan micro-fracture kawat memuai dan putus, menghilangkan sinyal RPM ke ECU sehingga injeksi dan api busi diputus total.'
  },
  {
    id: 27,
    type: 'multiple',
    difficulty: 'hots',
    points: 2,
    competency: 'Scanner Launch X-431 & Osiloskop',
    prompt: 'Pemeriksaan bentuk gelombang arus primer koil pengapian (Primary Ignition Current Ramp) menggunakan current clamp osiloskop bertujuan untuk memastikan... (Pilih 2 jawaban yang benar)',
    options: [
      { id: 'A', text: 'Besaran arus saturasi koil (umumnya mencapai 6A - 9A) dan waktu dwell charge tercapai sempurna' },
      { id: 'B', text: 'Tidak adanya pemotongan arus dini (current limiting) yang terlalu cepat akibat koil konslet internal' },
      { id: 'C', text: 'Tingkat kekentalan oli gardan pada roda belakang' },
      { id: 'D', text: 'Jumlah putaran alternator pada puli water pump' }
    ],
    correctAnswers: ['A', 'B'],
    explanation: 'Ramp arus primer koil yang diukur dengan tang ampere osiloskop memverifikasi dwell time transistor pengemudi, saturasi medan magnet koil, dan integritas resistansi kumparan primer.'
  },
  {
    id: 28,
    type: 'multiple',
    difficulty: 'hots',
    points: 2,
    competency: 'Trouble Diagnosis & DTC',
    prompt: 'Scanner X-431 menampilkan DTC P0302 (Cylinder 2 Misfire Detected). Untuk memastikan apakah penyebab misfire berada pada sistem pengapian atau komponen lain tanpa membongkar komponen secara rumit, teknik swap test (tukar silang) yang paling efisien dilakukan adalah... (Pilih 2 jawaban yang benar)',
    options: [
      { id: 'A', text: 'Menukar koil pengapian silinder 2 ke silinder 1, lalu cek apakah DTC berpindah menjadi P0301' },
      { id: 'B', text: 'Menukar busi silinder 2 ke silinder 3, lalu membaca data missfire counter pada live data scanner' },
      { id: 'C', text: 'Mengganti seluruh kepala silinder (cylinder head) baru' },
      { id: 'D', text: 'Memotong kabel harness ECM silinder 2 dengan tang potong' }
    ],
    correctAnswers: ['A', 'B'],
    explanation: 'Metode penukaran komponen (swap test) antara koil silinder 2 ke silinder 1 atau busi ke silinder 3 adalah prosedur diagnostik standar bengkel modern untuk melacak komponen rusak secara logis dan cepat.'
  },
  {
    id: 29,
    type: 'multiple',
    difficulty: 'hots',
    points: 2,
    competency: 'Scanner Launch X-431 & Osiloskop',
    prompt: 'Saat memeriksa sinyal CAN Bus (Controller Area Network) pada pin 6 (CAN High) dan pin 14 (CAN Low) soket DLC menggunakan osiloskop berkecepatan tinggi, karakteristik sinyal yang menandakan jaringan normal adalah... (Pilih 3 jawaban yang benar)',
    options: [
      { id: 'A', text: 'Tegangan recessive (diam/idle) berada di sekitar 2.5 Volt pada kedua jalur' },
      { id: 'B', text: 'Saat data dominant ditransmisikan, CAN High naik ke ~3.5 Volt dan CAN Low turun ke ~1.5 Volt' },
      { id: 'C', text: 'Bentuk sinyal gelombang digital pada CAN High dan CAN Low merupakan cerminan simetris (mirror differential signal)' },
      { id: 'D', text: 'Tegangan pada pin 6 konstan 12.0 Volt DC tanpa ada denyut sinyal' },
      { id: 'E', text: 'Resistansi total antara Pin 6 dan Pin 14 terukur sekitar 60 Ohm (kunci kontak OFF)' }
    ],
    correctAnswers: ['A', 'B', 'C'],
    explanation: 'CAN Bus differential signal bekerja pada recessive 2.5V, dominant CAN-H 3.5V & CAN-L 1.5V (mirroring untuk noise immunity). Resistansi terminasi kedua resistor 120 Ohm paralel adalah 60 Ohm.'
  },
  {
    id: 30,
    type: 'multiple',
    difficulty: 'hots',
    points: 2,
    competency: 'Trouble Diagnosis & DTC',
    prompt: 'Mesin mobil bensin injeksi mengalami gejala: starter panjang saat pagi hari, knalpot berasap hitam pekat, bau bensin tajam dari knalpot, dan busi cepat berjelaga hitam kering. Data scanner menunjukkan nilai ECT Sensor terbaca -40°C secara konstan meskipun mesin sudah dihidupkan 15 menit. Kesimpulan diagnosis dan penyebabnya adalah... (Pilih 2 jawaban yang benar)',
    options: [
      { id: 'A', text: 'Sirkuit sensor ECT mengalami rangkaian terbuka (open circuit / soket terlepas / kabel putus)' },
      { id: 'B', text: 'ECM mengasumsikan mesin berada pada suhu sangat beku sehingga mengaktifkan injeksi pengayaan maksimum (extreme rich cold enrichment)' },
      { id: 'C', text: 'Sensor Oksigen mengalami korsleting ke tegangan baterai 14V' },
      { id: 'D', text: 'Sensor Knocking mendeteksi getaran gempa bumi' }
    ],
    correctAnswers: ['A', 'B'],
    explanation: 'Thermistor NTC: jika sirkuit putus (open circuit), resistansi menjadi tak terhingga, tegangan sinyal pull-up terbaca 5.0V, yang oleh tabel lookup ECM dikonversi sebagai temperatur paling dingin (-40°C). Akibatnya ECU menyemprotkan bensin berlebih hingga knalpot berasap hitam dan busi basah/berjelaga.'
  },

  // ==========================================
  // BAGIAN 3: MENJODOHKAN (10 Soal, Poin 2 per soal = 20 poin)
  // *Matching pairs: Hubungkan premis dengan fungsi/target yang tepat*
  // ==========================================
  {
    id: 31,
    type: 'matching',
    difficulty: 'mudah',
    points: 2,
    competency: 'Sensor EMS',
    prompt: 'Jodohkan nama sensor EMS berikut dengan fungsi deteksi utamanya:',
    matchingPairs: [
      { id: 'p1', premise: 'Sensor CKP (Crankshaft Position)', target: 'Mendeteksi sudut poros engkol & kecepatan RPM mesin', correctMatch: 'Mendeteksi sudut poros engkol & kecepatan RPM mesin' },
      { id: 'p2', premise: 'Sensor CMP (Camshaft Position)', target: 'Mendeteksi posisi langkah silinder 1 (Top Kompresi)', correctMatch: 'Mendeteksi posisi langkah silinder 1 (Top Kompresi)' },
      { id: 'p3', premise: 'Sensor IAT (Intake Air Temp)', target: 'Mendeteksi suhu udara yang masuk ke saringan udara', correctMatch: 'Mendeteksi suhu udara yang masuk ke saringan udara' }
    ],
    correctAnswers: ['CKP->RPM', 'CMP->TMA_Silinder1', 'IAT->SuhuUdara'],
    explanation: 'CKP menentukan timing pengapian dasar & RPM, CMP menentukan sekuensial silinder 1, dan IAT mengkoreksi densitas udara masuk.'
  },
  {
    id: 32,
    type: 'matching',
    difficulty: 'mudah',
    points: 2,
    competency: 'Aktuator EMS',
    prompt: 'Jodohkan jenis aktuator berikut dengan sistem kerja mekanisnya:',
    matchingPairs: [
      { id: 'p1', premise: 'Electronic Fuel Injector', target: 'Solenoid elektromagnet pembuka jarum pintle bensin', correctMatch: 'Solenoid elektromagnet pembuka jarum pintle bensin' },
      { id: 'p2', premise: 'Drive-By-Wire Throttle Actuator', target: 'Motor DC servo penggerak katup gas elektronik', correctMatch: 'Motor DC servo penggerak katup gas elektronik' },
      { id: 'p3', premise: 'VVT-i Oil Control Valve', target: 'Katup spool hidrolik pengatur aliran oli camshaft phaser', correctMatch: 'Katup spool hidrolik pengatur aliran oli camshaft phaser' }
    ],
    correctAnswers: ['Injector->Solenoid', 'DBW->MotorDC', 'OCV->SpoolHidrolik'],
    explanation: 'Injektor menggunakan selenoid bertekanan, katup gas ETCS menggunakan motor DC servo, dan OCV menggunakan spool valve hidrolik tekanan oli.'
  },
  {
    id: 33,
    type: 'matching',
    difficulty: 'mudah',
    points: 2,
    competency: 'Scanner Launch X-431 & Osiloskop',
    prompt: 'Jodohkan kode awalan Diagnostic Trouble Code (DTC) standar SAE/ISO berikut dengan sistem kendaraannya:',
    matchingPairs: [
      { id: 'p1', premise: 'Awalan Huruf P (Powertrain)', target: 'Sistem Mesin, Transmisi, dan Emisi Emisinya', correctMatch: 'Sistem Mesin, Transmisi, dan Emisi Emisinya' },
      { id: 'p2', premise: 'Awalan Huruf B (Body)', target: 'Sistem AC, Airbag, Central Lock, dan Panel Bodi', correctMatch: 'Sistem AC, Airbag, Central Lock, dan Panel Bodi' },
      { id: 'p3', premise: 'Awalan Huruf C (Chassis)', target: 'Sistem Rem ABS, Traction Control, dan Suspensi', correctMatch: 'Sistem Rem ABS, Traction Control, dan Suspensi' },
      { id: 'p4', premise: 'Awalan Huruf U (Network)', target: 'Sistem Komunikasi Jaringan CAN Bus dan Data Antar Modul', correctMatch: 'Sistem Komunikasi Jaringan CAN Bus dan Data Antar Modul' }
    ],
    correctAnswers: ['P->Powertrain', 'B->Body', 'C->Chassis', 'U->Network'],
    explanation: 'Standar OBD-II: P = Powertrain, B = Body, C = Chassis, U = Network/Communication.'
  },
  {
    id: 34,
    type: 'matching',
    difficulty: 'mudah',
    points: 2,
    competency: 'Sensor EMS',
    prompt: 'Jodohkan jenis sensor EMS dengan jenis sinyal keluaran (output signal) yang dikirimkannya ke ECM:',
    matchingPairs: [
      { id: 'p1', premise: 'Sensor ECT (Thermistor NTC)', target: 'Sinyal Tegangan Analog (0.5V - 4.5V DC)', correctMatch: 'Sinyal Tegangan Analog (0.5V - 4.5V DC)' },
      { id: 'p2', premise: 'Sensor CKP Tipe Reluctance/Induktif', target: 'Sinyal Tegangan Bolak-Balik Sinusoidal (AC Voltage)', correctMatch: 'Sinyal Tegangan Bolak-Balik Sinusoidal (AC Voltage)' },
      { id: 'p3', premise: 'Sensor CKP Tipe Hall Effect', target: 'Sinyal Gelombang Kotak Digital (Digital Square Wave)', correctMatch: 'Sinyal Gelombang Kotak Digital (Digital Square Wave)' }
    ],
    correctAnswers: ['ECT->Analog', 'CKP_Induktif->AC', 'CKP_Hall->Kotak'],
    explanation: 'Sensor NTC menghasilkan tegangan analog bervariasi, sensor induktif menghasilkan sinusoidal AC, dan Hall effect menghasilkan square pulse digital.'
  },
  {
    id: 35,
    type: 'matching',
    difficulty: 'mudah',
    points: 2,
    competency: 'Scanner Launch X-431 & Osiloskop',
    prompt: 'Jodohkan nomor terminal pin Data Link Connector (DLC 16-Pin OBD-II) berikut dengan konfigurasinya:',
    matchingPairs: [
      { id: 'p1', premise: 'Terminal Pin 16', target: 'Tegangan Positif Baterai (+12V Unswitched)', correctMatch: 'Tegangan Positif Baterai (+12V Unswitched)' },
      { id: 'p2', premise: 'Terminal Pin 4 & Pin 5', target: 'Chassis Ground dan Signal Ground', correctMatch: 'Chassis Ground dan Signal Ground' },
      { id: 'p3', premise: 'Terminal Pin 6', target: 'CAN High Bus Line (ISO 15765-4)', correctMatch: 'CAN High Bus Line (ISO 15765-4)' },
      { id: 'p4', premise: 'Terminal Pin 14', target: 'CAN Low Bus Line (ISO 15765-4)', correctMatch: 'CAN Low Bus Line (ISO 15765-4)' }
    ],
    correctAnswers: ['Pin16->12V', 'Pin4_5->Ground', 'Pin6->CAN_H', 'Pin14->CAN_L'],
    explanation: 'Standar J1962: Pin 16 (+12V), Pin 4 (Chassis GND), Pin 5 (Signal GND), Pin 6 (CAN High), Pin 14 (CAN Low).'
  },
  {
    id: 36,
    type: 'matching',
    difficulty: 'sedang',
    points: 2,
    competency: 'Trouble Diagnosis & DTC',
    prompt: 'Jodohkan kode DTC kerusakan EMS berikut dengan deskripsi masalah standarnya:',
    matchingPairs: [
      { id: 'p1', premise: 'DTC P0102', target: 'Mass or Volume Air Flow Circuit Low Input', correctMatch: 'Mass or Volume Air Flow Circuit Low Input' },
      { id: 'p2', premise: 'DTC P0118', target: 'Engine Coolant Temperature Circuit High Input', correctMatch: 'Engine Coolant Temperature Circuit High Input' },
      { id: 'p3', premise: 'DTC P0300', target: 'Random/Multiple Cylinder Misfire Detected', correctMatch: 'Random/Multiple Cylinder Misfire Detected' },
      { id: 'p4', premise: 'DTC P0420', target: 'Catalyst System Efficiency Below Threshold (Bank 1)', correctMatch: 'Catalyst System Efficiency Below Threshold (Bank 1)' }
    ],
    correctAnswers: ['P0102->MAF_Low', 'P0118->ECT_High', 'P0300->Misfire_Random', 'P0420->Catalyst'],
    explanation: 'DTC P0102 terkait sirkuit MAF low, P0118 sirkuit ECT tegangan tinggi/open, P0300 misfire acak, P0420 efisiensi katalitik converter di bawah ambang batas.'
  },
  {
    id: 37,
    type: 'matching',
    difficulty: 'sedang',
    points: 2,
    competency: 'Scanner Launch X-431 & Osiloskop',
    prompt: 'Jodohkan parameter Live Data pada scanner Launch X-431 dengan interpretasi nilai normalnya saat mesin idle bersuhu 85°C:',
    matchingPairs: [
      { id: 'p1', premise: 'Engine Speed (RPM)', target: '700 - 800 RPM (stabil tanpa beban AC)', correctMatch: '700 - 800 RPM (stabil tanpa beban AC)' },
      { id: 'p2', premise: 'Short Term Fuel Trim (STFT)', target: 'Fluktuasi seimbang antara -5% hingga +5%', correctMatch: 'Fluktuasi seimbang antara -5% hingga +5%' },
      { id: 'p3', premise: 'Injection Pulse Width', target: '2.0 ms hingga 3.2 ms pada kondisi idle', correctMatch: '2.0 ms hingga 3.2 ms pada kondisi idle' },
      { id: 'p4', premise: 'Intake Manifold Vacuum / MAP', target: '25 kPa hingga 35 kPa (kondisi idle sehat)', correctMatch: '25 kPa hingga 35 kPa (kondisi idle sehat)' }
    ],
    correctAnswers: ['RPM->750', 'STFT->-5to+5', 'InjWidth->2.5ms', 'MAP->30kPa'],
    explanation: 'Mesin bensin 4 silinder sehat pada suhu kerja memiliki idle ~750 RPM, STFT dekat 0%, durasi injeksi ~2.5 ms, dan tekanan absolut intake manifold 25-35 kPa (kevakuman tinggi).'
  },
  {
    id: 38,
    type: 'matching',
    difficulty: 'sedang',
    points: 2,
    competency: 'Aktuator EMS',
    prompt: 'Jodohkan jenis sistem pengapian elektronik berikut dengan ciri fisiknya pada kendaraan:',
    matchingPairs: [
      { id: 'p1', premise: 'Distributor Electronic Ignition (DLI lawas)', target: 'Memiliki rotor dan tutup distributor putar pembagi tegangan', correctMatch: 'Memiliki rotor dan tutup distributor putar pembagi tegangan' },
      { id: 'p2', premise: 'Wasted Spark Ignition System (DIS)', target: '1 koil menyuplai 2 busi secara bersamaan (silinder kembar)', correctMatch: '1 koil menyuplai 2 busi secara bersamaan (silinder kembar)' },
      { id: 'p3', premise: 'Coil On Plug (COP / Independent Ignition)', target: 'Setiap busi silinder memiliki 1 koil mandiri di atasnya', correctMatch: 'Setiap busi silinder memiliki 1 koil mandiri di atasnya' }
    ],
    correctAnswers: ['DLI->RotorDistributor', 'DIS->WastedSpark', 'COP->Independen'],
    explanation: 'Sistem COP modern mengeliminasi kabel tegangan tinggi dan distributor mekanis, di mana satu koil mini terpasang langsung di atas masing-masing busi.'
  },
  {
    id: 39,
    type: 'matching',
    difficulty: 'hots',
    points: 2,
    competency: 'Scanner Launch X-431 & Osiloskop',
    prompt: 'Jodohkan pembacaan bentuk gelombang osiloskop berikut dengan interpretasi kerusakannya pada sistem EMS:',
    matchingPairs: [
      { id: 'p1', premise: 'Peak flyback spike injektor hanya 14V (tidak ada lonjakan 60V-80V)', target: 'Kumparan koil solenoid injektor short internal atau rusak', correctMatch: 'Kumparan koil solenoid injektor short internal atau rusak' },
      { id: 'p2', premise: 'Bentuk sinus gelombang sensor CKP terpotong/hilang 1 gigi pada interval acak', target: 'Roda reluktor (tonewheel) gigi poros engkol patah/gompal', correctMatch: 'Roda reluktor (tonewheel) gigi poros engkol patah/gompal' },
      { id: 'p3', premise: 'Tegangan O2 Sensor flat di angka 0.1 Volt konstan saat diakselerasi', target: 'Campuran bahan bakar ekstrem kurus (Lean) atau sensor mati', correctMatch: 'Campuran bahan bakar ekstrem kurus (Lean) atau sensor mati' },
      { id: 'p4', premise: 'Garis ground injektor terangkat ke 2.5 Volt saat transistor ON', target: 'Tahanan kabel ground ECM ke massa bodi terlalu tinggi (bad ground)', correctMatch: 'Tahanan kabel ground ECM ke massa bodi terlalu tinggi (bad ground)' }
    ],
    correctAnswers: ['Spike14V->Short', 'MissingTooth->ReluctorDamage', 'O2Flat01->Lean', 'Ground25V->BadGround'],
    explanation: 'Analisis osiloskop mendalam: lonjakan induktif hilang = koil solenoid rusak; gigi sinus bolong liar = tonewheel rusak; ground floating = bad ground; O2 stuck low = lean condition.'
  },
  {
    id: 40,
    type: 'matching',
    difficulty: 'hots',
    points: 2,
    competency: 'Trouble Diagnosis & DTC',
    prompt: 'Jodohkan skenario kasus gangguan di bengkel berikut dengan kemungkinan akar masalahnya:',
    matchingPairs: [
      { id: 'p1', premise: 'Mesin tersendat saat basah terkena cipratan air hujan', target: 'Kebocoran insulasi karet cop koil pengapian (spark flashover)', correctMatch: 'Kebocoran insulasi karet cop koil pengapian (spark flashover)' },
      { id: 'p2', premise: 'Konsumsi bensin sangat boros disertai busi basah hitam', target: 'Sensor ECT putus sirkuit atau regulator tekanan bensin jebol', correctMatch: 'Sensor ECT putus sirkuit atau regulator tekanan bensin jebol' },
      { id: 'p3', premise: 'Tarikan mesin tertahan seperti kehabisan nafas di atas 3500 RPM', target: 'Tekanan fuel pump drop atau Catalytic Converter mampet', correctMatch: 'Tekanan fuel pump drop atau Catalytic Converter mampet' },
      { id: 'p4', premise: 'P0340 muncul dan timing pengapian meloncat liar saat digas', target: 'Rantai keteng (timing chain) aus meregang (slack/elongation)', correctMatch: 'Rantai keteng (timing chain) aus meregang (slack/elongation)' }
    ],
    correctAnswers: ['Basah->InsulasiKoil', 'Boros->ECT_Regulator', 'DropRPMTinggi->FuelPump_Katalis', 'P0340->RantaiTiming'],
    explanation: 'Karet cop retak bocor saat lembab; ECT rusak memicu pengayaan ekstrem; fuel pump lemah tidak sanggup menyuplai volume RPM tinggi; timing chain mulur memicu desinkronisasi CKP dan CMP.'
  },

  // ==========================================
  // BAGIAN 4: ISIAN SINGKAT (5 Soal, Poin 3 per soal = 15 poin)
  // *Kunci jawaban teks eksak / sinonim valid*
  // ==========================================
  {
    id: 41,
    type: 'short_answer',
    difficulty: 'mudah',
    points: 3,
    competency: 'Sensor EMS',
    prompt: 'Sebutkan singkatan nama sensor yang berfungsi mengukur volume massa aliran udara murni yang dihisap masuk ke dalam intake manifold secara langsung menggunakan teknologi kawat panas!',
    correctAnswers: ['MAF', 'Mass Air Flow', 'MAF Sensor', 'Mass Air Flow Sensor'],
    explanation: 'MAF (Mass Air Flow) sensor adalah sensor yang mengukur massa udara secara presisi dalam satuan gram/detik.',
    rubric: [
      { criterion: 'Menjawab singkatan atau kepanjangan MAF (Mass Air Flow)', maxPoints: 3, description: 'Jawaban tepat: MAF atau Mass Air Flow Sensor.' }
    ]
  },
  {
    id: 42,
    type: 'short_answer',
    difficulty: 'mudah',
    points: 3,
    competency: 'Trouble Diagnosis & DTC',
    prompt: 'Berapakah perbandingan rasio stokiometri ideal teoritis antara udara dan bahan bakar (Air-Fuel Ratio / AFR) untuk mesin bensin pada pembakaran sempurna? (Tuliskan dalam format angka contoh: 14.7:1)',
    correctAnswers: ['14.7:1', '14,7:1', '14.7', '14,7'],
    explanation: 'Rasio stokiometri ideal bahan bakar bensin adalah 14,7 bagian massa udara berbanding 1 bagian massa bahan bakar (AFR 14.7:1) dengan nilai lambda (λ) = 1.0.',
    rubric: [
      { criterion: 'Menuliskan angka rasio 14.7:1 dengan benar', maxPoints: 3, description: 'Format 14.7:1 atau 14,7:1 dinilai penuh.' }
    ]
  },
  {
    id: 43,
    type: 'short_answer',
    difficulty: 'mudah',
    points: 3,
    competency: 'Scanner Launch X-431 & Osiloskop',
    prompt: 'Sebutkan nama fungsi atau menu pada scanner Launch X-431 yang digunakan untuk menguji fungsionalitas aktuator secara paksa (seperti menyalakan kipas radiator, memutus injektor silinder tertentu, atau mengaktifkan pompa bahan bakar) langsung dari layar scanner tanpa mesin hidup!',
    correctAnswers: ['Actuation Test', 'Actuator Test', 'Active Test', 'Bi-directional Control', 'Uji Aktuator'],
    explanation: 'Menu Actuation Test / Active Test (kontrol dua arah / bi-directional) memungkinkan scanner memerintahkan ECM untuk mengaktifkan aktuator secara selektif guna pengetesan sirkuit kelistrikan.',
    rubric: [
      { criterion: 'Menyebutkan Actuation Test / Active Test / Actuator Test', maxPoints: 3, description: 'Poin penuh untuk istilah actuation test/active test.' }
    ]
  },
  {
    id: 44,
    type: 'short_answer',
    difficulty: 'hots',
    points: 3,
    competency: 'Trouble Diagnosis & DTC',
    prompt: 'Sebuah mobil Daihatsu Gran Max menunjukkan kode DTC P0303. Pada silinder manakah mesin kendaraan tersebut mengalami kegagalan pembakaran (misfire)? (Tuliskan nomor silindernya)',
    correctAnswers: ['3', 'Silinder 3', 'Silinder nomor 3', 'Cylinder 3'],
    explanation: 'Digit terakhir pada kode P030X menunjukkan nomor silinder spesifik yang mengalami misfire. P0301 = silinder 1, P0302 = silinder 2, P0303 = silinder 3, P0304 = silinder 4.',
    rubric: [
      { criterion: 'Menjawab tepat Silinder 3', maxPoints: 3, description: 'Poin penuh 3 untuk jawaban silinder 3.' }
    ]
  },
  {
    id: 45,
    type: 'short_answer',
    difficulty: 'hots',
    points: 3,
    competency: 'Sensor EMS',
    prompt: 'Tegangan referensi standar (V-Ref) yang disuplai oleh Electronic Control Module (ECM) ke sebagian besar sensor analog 3-kabel seperti TPS, MAP, dan sensor tekanan AC adalah sebesar berapa Volt? (Tuliskan angkanya)',
    correctAnswers: ['5', '5V', '5 Volt', '5.0', '5.0V', '5.0 Volt'],
    explanation: 'ECM menggunakan sirkuit regulator internal presisi tinggi untuk menyuplai tegangan referensi stabil sebesar 5.0 Volt (V-Ref/VCC) agar pembacaan sensor tidak terpengaruh naik-turunnya tegangan baterai/alternator kendaraan (12-14V).',
    rubric: [
      { criterion: 'Menjawab nilai tegangan referensi 5 Volt', maxPoints: 3, description: 'Poin penuh 3 untuk jawaban 5 Volt.' }
    ]
  },

  // ==========================================
  // BAGIAN 5: ESSAY ANALISIS & DIAGNOSIS KASUS (5 Soal, Poin 4 per soal = 20 poin)
  // *Kasus riil bengkel dengan rubrik penilaian bertingkat*
  // ==========================================
  {
    id: 46,
    type: 'essay',
    difficulty: 'hots',
    points: 4,
    competency: 'Trouble Diagnosis & DTC',
    prompt: 'Sebuah mobil Toyota Avanza 1.5L bertransmisi manual masuk ke bengkel dengan keluhan: Lampu Check Engine (MIL) menyala, mesin bergetar pincang (rough idle) saat stasioner, dan kehilangan tenaga saat menanjak. Mekanik mencolokkan scanner Launch X-431 dan membaca DTC "P0300 - Random/Multiple Cylinder Misfire Detected".\n\nJelaskan secara sistematis langkah-langkah diagnosis yang harus dilakukan mekanik untuk mengisolasi penyebab gangguan tersebut (mulai dari pemeriksaan data scanner, sistem pengapian, sistem bahan bakar, hingga kompresi mekanik silinder)!',
    correctAnswers: [
      '1. Baca Live Data Scanner (Freeze Frame, Misfire Counter per silinder, Short & Long Term Fuel Trim, MAP sensor).\n2. Periksa sistem pengapian: swap test koil dan busi antar silinder, cek celah dan keausan elektroda busi.\n3. Periksa sistem bahan bakar: ukur tekanan fuel rail dengan pressure gauge (~3.0-3.5 bar), periksa pola pengabutan injektor dan hambatan solenoid.\n4. Cek kebocoran vakum intake manifold (PCV hose, gasket).\n5. Lakukan tes kompresi kering dan basah silinder (standar ~11-13 bar).'
    ],
    explanation: 'Kasus P0300 membutuhkan pendekatan terstruktur dari yang paling sering terjadi (busi/koil), sistem bahan bakar (tekanan drop/injektor), intake leak, hingga integritas mekanikal (celah katup/tekanan kompresi).',
    rubric: [
      { criterion: 'Pemeriksaan Live Data Scanner & Misfire Counter', maxPoints: 1, description: 'Menjelaskan analisis data stream scanner (fuel trim, freeze frame, deteksi silinder terdampak).' },
      { criterion: 'Pemeriksaan Sistem Pengapian (Busi & Koil COP)', maxPoints: 1, description: 'Menjelaskan pengecekan fisik busi, swap test koil pengapian, atau uji loncatan bunga api.' },
      { criterion: 'Pemeriksaan Sistem Bahan Bakar & Kebocoran Vakum', maxPoints: 1, description: 'Menjelaskan pengukuran tekanan pompa bensin (fuel pressure gauge), cek injektor, dan kebocoran vakum intake.' },
      { criterion: 'Pemeriksaan Mekanikal (Tes Tekanan Kompresi Silinder)', maxPoints: 1, description: 'Menjelaskan uji kompresi mekanikal mesin untuk memastikan tidak ada katup bocor/ring piston aus.' }
    ]
  },
  {
    id: 47,
    type: 'essay',
    difficulty: 'hots',
    points: 4,
    competency: 'Scanner Launch X-431 & Osiloskop',
    prompt: 'Jelaskan perbedaan mendasar antara pengujian komponen injektor menggunakan Scanner Diagnosis (Launch X-431) dibandingkan dengan menggunakan Osiloskop Digital Otomotif! Apa saja informasi kerusakan spesifik yang HANYA bisa diketahui melalui osiloskop tetapi TIDAK BISA dideteksi oleh scanner?',
    correctAnswers: [
      'Scanner membaca data olahan digital yang dilaporkan ECM (seperti durasi injeksi terhitung dan status sirkuit DTC), sedangkan osiloskop membaca tegangan dan arus listrik riil secara real-time pada kawat harness.\nInformasi yang hanya terdeteksi osiloskop: 1) Besaran lonjakan tegangan induksi balik (flyback voltage spike) penentu kesehatan kumparan selenoid; 2) Bentuk kurva arus (current ramp) dan pantulan pintle hump (gerakan fisik jarum katup injektor membuka); 3) Penurunan tegangan ground (voltage drop) pada jalur kontrol transistor ECM.'
    ],
    explanation: 'Scanner hanya menyajikan data yang dipersepsikan oleh software ECU dengan laju sampling terbatas (update rate rendah ~10-20 Hz). Osiloskop bekerja pada orde Megahertz sehingga mampu menangkap glitch mikrodetik, degradasi flyback spike, dan pergerakan mekanis jarum pintle (pintle hump).',
    rubric: [
      { criterion: 'Perbedaan konsep kerja Scanner vs Osiloskop', maxPoints: 1, description: 'Mampu menjelaskan scanner membaca data komputasi ECU sedangkan osiloskop membaca sinyal listrik riil langsung dari sirkuit.' },
      { criterion: 'Analisis tegangan induktif balik (flyback spike)', maxPoints: 1, description: 'Menyebutkan lonjakan induksi balik (~60-80V) sebagai indikator kesehatan isolasi kumparan solenoid.' },
      { criterion: 'Analisis pergerakan mekanikal pintle hump / kurva arus', maxPoints: 1, description: 'Menjelaskan pintle hump pada kurva arus untuk membuktikan jarum injektor benar-benar bergerak secara mekanik.' },
      { criterion: 'Deteksi voltage drop & noise kelistrikan ground', maxPoints: 1, description: 'Menjelaskan identifikasi bad ground transistor pengemudi ECU dan noise listrik yang tak terdeteksi scanner.' }
    ]
  },
  {
    id: 48,
    type: 'essay',
    difficulty: 'hots',
    points: 4,
    competency: 'Trouble Diagnosis & DTC',
    prompt: 'Seorang pelanggan mengeluhkan mobil Honda Jazz i-VTEC miliknya sangat boros bahan bakar dan knalpotnya berbau sangit menyengat. Pada scanner Launch X-431, mekanik mengamati parameter Fuel Trim:\n- Short Term Fuel Trim (STFT): -22%\n- Long Term Fuel Trim (LTFT): -18%\n- O2 Sensor Bank 1 Sensor 1 terbaca: 0.92 Volt konstan (tidak mau berfluktuasi ke bawah 0.45V).\n\nAnalisislah makna data diagnosis di atas dan uraikan minimal 3 kemungkinan komponen yang mengalami malfungsi sehingga menyebabkan kondisi tersebut!',
    correctAnswers: [
      'Makna data: Mesin mengalami kondisi "Too Rich" (campuran terlalu kaya bensin/kurang udara). ECM membaca O2 sensor stuck di tegangan tinggi (0.92V) dan merespon dengan memangkas bensin secara drastis (STFT -22%, LTFT -18%).\nTiga kemungkinan komponen rusak: 1) Injektor bensin bocor/menetes terus (leaking injector) sehingga bensin berlebih masuk ke silinder; 2) Fuel Pressure Regulator macet tertutup atau pipa return tersumbat sehingga tekanan fuel rail berlebih; 3) O2 sensor mengalami internal short-circuit ke 12V heater atau keracunan karbon sehingga macet mengeluarkan sinyal kaya; 4) EVAP Canister Purge Valve bocor mengalirkan uap bensin pekat dari tangki terus-menerus.'
    ],
    explanation: 'Fuel trim negatif ekstrem (-18% s.d -22%) adalah respon koreksi ECU terhadap laporan campuran super kaya dari O2 sensor (0.92V). Penyebabnya bisa karena bensin riil berlebih (injektor menetes, fuel pressure tinggi, purge valve terbuka) atau O2 sensor yang rusak/korslet mengirim sinyal palsu.',
    rubric: [
      { criterion: 'Interpretasi makna Fuel Trim negatif & sinyal O2 Sensor', maxPoints: 1, description: 'Menjelaskan kondisi campuran terlalu kaya (rich) dan usaha ECU memangkas suplai bahan bakar.' },
      { criterion: 'Penyebab 1: Malfungsi Injektor / Tekanan Bensin', maxPoints: 1, description: 'Mengidentifikasi injektor bocor menetes atau fuel pressure regulator rusak.' },
      { criterion: 'Penyebab 2: Kerusakan O2 Sensor atau Sistem Emisi EVAP', maxPoints: 1, description: 'Mengidentifikasi sensor oksigen short/rusak atau katup EVAP purge valve stuck open.' },
      { criterion: 'Penyebab 3: Pasokan udara terhambat / sensor MAF terdistorsi', maxPoints: 1, description: 'Menjelaskan filter udara tersumbat total atau sensor MAF terkontaminasi minyak yang salah membaca aliran udara.' }
    ]
  },
  {
    id: 49,
    type: 'essay',
    difficulty: 'hots',
    points: 4,
    competency: 'Trouble Diagnosis & DTC',
    prompt: 'Mobil Suzuki APV mengalami mogok total di tengah jalan. Saat kunci kontak diputar ke posisi START, dinamo starter memutar mesin (cranking) dengan normal dan kuat, tetapi mesin sama sekali tidak mau hidup (no spark, no injection). Scanner Launch X-431 tidak dapat menampilkan putaran RPM mesin saat proses cranking (RPM terbaca 0 RPM).\n\nUraikan hipotesis utama penyebab mogok tersebut dan buatkan urutan prosedur pengujian menggunakan alat ukur multimeter/osiloskop untuk membuktikan sensor manakah yang rusak!',
    correctAnswers: [
      'Hipotesis utama: Sensor Crankshaft Position (CKP) atau sirkuit kabelnya rusak/putus. Karena ECU tidak menerima sinyal RPM/sudut poros engkol saat cranking, ECU tidak dapat mengaktifkan relai pompa bensin, pulsa injektor, dan pengapian busi.\nProsedur pengujian:\n1. Cek tegangan suplai pada soket sensor CKP (kunci kontak ON): harus ada tegangan referensi 5V/12V dan massa ground yang baik (<1 Ohm).\n2. Jika tipe induktif 2 kabel: ukur nilai resistansi kumparan sensor dengan multimeter (standar ~800 - 1500 Ohm), pastikan tidak open/short ke bodi.\n3. Hubungkan probe osiloskop/multimeter AC ke kabel sinyal CKP saat mesin di-cranking: perhatikan apakah muncul gelombang tegangan bolak-balik AC (tipe induktif min 1.0 Vpp) atau sinyal gelombang kotak 0-5V (tipe Hall effect).\n4. Jika sinyal tidak muncul meski kabel normal, periksa jarak celah (air gap) dan kebersihan ujung sensor dari gram besi, atau ganti sensor CKP.'
    ],
    explanation: 'Sinyal CKP adalah sinyal primer hidupnya mesin. Tanpa sinyal CKP, ECM tidak tahu mesin sedang berputar, sehingga mematikan sistem injeksi dan pengapian demi alasan keselamatan.',
    rubric: [
      { criterion: 'Hipotesis Sensor CKP dan kegagalan sinyal putaran mesin (RPM 0)', maxPoints: 1, description: 'Mengidentifikasi sensor CKP sebagai penyebab tidak adanya pulsa injeksi dan api busi saat cranking.' },
      { criterion: 'Pemeriksaan tegangan suplai & kontinuitas ground kabel harness', maxPoints: 1, description: 'Menjelaskan pengujian V-Ref 5V/12V dan kontinuitas kabel ground dari soket ke ECM.' },
      { criterion: 'Pengukuran resistansi sensor dan pengujian sinyal saat cranking', maxPoints: 1, description: 'Menjelaskan pengukuran resistansi kumparan atau pengetesan tegangan sinyal AC/gelombang kotak osiloskop saat di-starter.' },
      { criterion: 'Pemeriksaan mekanikal celah (air gap) & reluktor poros engkol', maxPoints: 1, description: 'Memeriksa kebersihan ujung magnetik sensor dan kondisi gigi roda reluktor.' }
    ]
  },
  {
    id: 50,
    type: 'essay',
    difficulty: 'hots',
    points: 4,
    competency: 'Scanner Launch X-431 & Osiloskop',
    prompt: 'Setelah mekanik SMKS Bina Karya 2 Karawang melakukan pembersihan throttle body (TB) dan penggantian sensor TPS pada mobil Nissan Grand Livina 1.5L, mesin mengalami masalah baru: putaran idle tertahan tinggi di angka 1.500 RPM dan tidak mau turun meskipun mesin telah mencapai suhu kerja normal. Tidak ditemukan kode kerusakan (DTC No Fault Code) pada scanner Launch X-431.\n\nJelaskan mengapa masalah tersebut terjadi pada mobil berteknologi Drive-By-Wire (Electronic Throttle Control System / ETCS) dan sebutkan prosedur kalibrasi/pembelajaran ulang (Re-learning procedure) yang harus dieksekusi menggunakan scanner Launch X-431 untuk mengembalikan putaran idle ke standar pabrik!',
    correctAnswers: [
      'Penyebab masalah: ECM menyimpan memori adaptasi sudut bukaan katup gas sebelumnya (throttle learned value) yang telah terkompensasi untuk celah kotoran jelaga karbon. Ketika throttle body dibersihkan atau diganti, celah udara menjadi lebih longgar sehingga udara yang masuk lebih banyak pada sudut adaptasi lama, menyebabkan idle melambung ke 1.500 RPM.\nProsedur Kalibrasi (Re-learning) dengan Launch X-431:\n1. Pastikan syarat pra-kondisi terpenuhi: suhu coolant mesin (ECT) minimal 70°C - 80°C, beban listrik mati (AC, lampu, audio OFF), setir lurus, dan transmisi posisi Park/Netral.\n2. Masuk ke menu "Special Function" pada scanner Launch X-431 untuk sistem Engine Nissan.\n3. Pilih menu "Idle Air Volume Learn" (IAVL) atau "Throttle Valve Closed Position Learning".\n4. Tekan tombol Start/Execute pada scanner dan biarkan proses kalibrasi berlangsung otomatis (sekitar 20 detik) hingga status menunjukkan "Completed / Successful".\n5. Matikan kunci kontak, hidupkan kembali mesin, dan verifikasi putaran idle telah kembali normal di rentang 700 ± 50 RPM.'
    ],
    explanation: 'Pada sistem ETCS/DBW, ECM mengendalikan idle speed dengan memiringkan katup kupu-kupu utama menggunakan motor servo berdasarkan nilai pembelajaran memori (adaptive learning). Pembersihan TB merubah airflow mekanis sehingga membutuhkan reset adaptasi via prosedur "Idle Air Volume Learn" pada scanner.',
    rubric: [
      { criterion: 'Penjelasan fenomena akumulasi memori adaptasi katup gas (ETCS)', maxPoints: 1, description: 'Menjelaskan bahwa ECU masih menyimpan data bukaan katup gas lama yang terkompensasi jelaga kotoran.' },
      { criterion: 'Syarat pra-kondisi sebelum kalibrasi (Suhu, Beban Kelistrikan)', maxPoints: 1, description: 'Menyebutkan suhu kerja normal (70-80°C), AC off, lampu off, posisi transmisi N/P.' },
      { criterion: 'Menu eksekusi pada Scanner Launch X-431 (Special Function)', maxPoints: 1, description: 'Menyebutkan menu "Special Function" -> "Idle Air Volume Learn" (IAVL) / Throttle Learning.' },
      { criterion: 'Verifikasi hasil idle standar setelah re-learning', maxPoints: 1, description: 'Menjelaskan pemantauan putaran idle kembali stabil ke angka standar (~700 RPM) setelah prosedur selesai.' }
    ]
  }
];
