/**
 * Contract & Legal Document Auto-Generator Service
 * Fills variable placeholders, formats corporate letterheads, and supports Word (.doc) & Print export.
 */

export const DEFAULT_TEMPLATE_FIELDS = {
  firstParty: 'PT NUSANTARA ENERGI',
  firstPartyRep: 'Ir. Bambang Trihatmodjo (Direktur Utama)',
  firstPartyAddress: 'Gedung Energy Tower Lt. 28, Kawasan SCBD Lot 11, Jl. Jend. Sudirman Kav. 52-53, Jakarta Selatan',
  secondParty: 'PT MITRA TEKNIK NUSANTARA',
  secondPartyRep: 'Hendrawan Kusuma, S.T. (Direktur)',
  secondPartyAddress: 'Jl. R.E. Martadinata No. 88, Bandung, Jawa Barat',
  docNumber: '048/NE-LEGAL/KTR/X/2026',
  docDate: new Date().toISOString().slice(0, 10),
  effectiveDate: new Date().toISOString().slice(0, 10),
  contractValue: 2500000000,
  durationMonths: '12 (dua belas) bulan',
  projectLocation: 'Proyek PLTS Cirata & Patuha Geothermal Complex',
  governingLaw: 'Hukum Negara Republik Indonesia',
  arbitrationForum: 'Badan Arbitrase Nasional Indonesia (BANI) di Jakarta',
  subjectOrPurpose: 'Pekerjaan Penyediaan Jasa Rekayasa Teknis & Maintenance Turbin Pembangkit Listrik'
};

/**
 * Generate full legal document based on template ID and user inputs
 */
export function generateLegalDocument(templateId, fields = {}) {
  const f = { ...DEFAULT_TEMPLATE_FIELDS, ...fields };
  const formattedValue = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(f.contractValue);

  switch (templateId) {
    case 'TMPL-001': // Mutual NDA Bilingual
      return `MUTUAL NON-DISCLOSURE AGREEMENT
PERJANJIAN KERAHASIAAN BERSAMA
Nomor: ${f.docNumber}

Perjanjian Kerahasiaan Bersama ini ("Perjanjian") dibuat dan disepakati pada tanggal ${f.docDate}, oleh dan antara:

1. ${f.firstParty}, suatu perseroan terbatas yang didirikan berdasarkan hukum Republik Indonesia, berkedudukan di ${f.firstPartyAddress}, dalam hal ini diwakili secara sah oleh ${f.firstPartyRep} (selanjutnya disebut "PIHAK PERTAMA"); dan

2. ${f.secondParty}, suatu perseroan yang didirikan berdasarkan hukum Indonesia, berkedudukan di ${f.secondPartyAddress}, dalam hal ini diwakili secara sah oleh ${f.secondPartyRep} (selanjutnya disebut "PIHAK KEDUA").

PIHAK PERTAMA dan PIHAK KEDUA secara bersama-sama disebut sebagai "PARA PIHAK" dan masing-masing disebut sebagai "PIHAK".

MENERANGKAN TERLEBIH DAHULU:
Bahwa PARA PIHAK bermaksud untuk melakukan penjajakan kerjasama strategis mengenai ${f.subjectOrPurpose} ("Tujuan Kerjasama"), dan sehubungan dengan itu perlu saling bertukar informasi yang bersifat rahasia.

MAKA, PARA PIHAK DENGAN INI SEPAKAT SEBAGAI BERIKUT:

PASAL 1: DEFINISI INFORMASI RAHASIA
"Informasi Rahasia" berarti segala informasi teknis, keuangan, hukum, operasional, kekayaan intelektual, dan bisnis yang diungkapkan baik secara lisan, tertulis, maupun elektronik oleh salah satu Pihak Pengungkap kepada Pihak Penerima.

PASAL 2: KEWAJIBAN KERAHASIAAN
Pihak Penerima wajib:
a. Memperlakukan Informasi Rahasia dengan standar kehati-hatian yang ketat sekurang-kurangnya setara dengan perlindungan terhadap informasi rahasianya sendiri.
b. Tidak membocorkan, menerbitkan, atau menyebarkan Informasi Rahasia kepada pihak ketiga mana pun tanpa persetujuan tertulis terlebih dahulu dari Pihak Pengungkap.
c. Membatasi akses Informasi Rahasia hanya kepada direksi, komisaris, karyawan, dan penasihat hukum yang memiliki urgensi *need-to-know*.

PASAL 3: JANGKA WAKTU
Perjanjian ini berlaku selama ${f.durationMonths} terhitung sejak Tanggal Efektif (${f.effectiveDate}). Kewajiban kerahasiaan akan tetap mengikat PARA PIHAK selama 5 (lima) tahun setelah berakhirnya Perjanjian ini.

PASAL 4: HUKUM YANG BERLAKU DAN ARBITRASE
Perjanjian ini tunduk dan ditafsirkan berdasarkan ${f.governingLaw}. Setiap sengketa yang timbul akan diselesaikan secara eksklusif melalui arbitrase di ${f.arbitrationForum} sesuai dengan Peraturan dan Prosedur Arbitrase BANI.

Demikian Perjanjian ini dibuat dalam rangkap 2 (dua) bermeterai cukup dan memiliki kekuatan hukum yang sama.

PIHAK PERTAMA,                                 PIHAK KEDUA,
${f.firstParty}                                ${f.secondParty}



_______________________                        _______________________
${f.firstPartyRep}                             ${f.secondPartyRep}`;

    case 'TMPL-002': // MoU
      return `MEMORANDUM OF UNDERSTANDING (NOTA KESEPAHAMAN)
KERJASAMA EKSPLORASI KEMITRAAN STRATEGIS
Nomor: ${f.docNumber}

Pada hari ini, tanggal ${f.docDate}, bertempat di Jakarta, kami yang bertanda tangan di bawah ini:
1. ${f.firstParty}, beralamat di ${f.firstPartyAddress}, diwakili oleh ${f.firstPartyRep} ("Pihak Pertama");
2. ${f.secondParty}, beralamat di ${f.secondPartyAddress}, diwakili oleh ${f.secondPartyRep} ("Pihak Kedua");

SEPAKAT MEMBUAT NOTA KESEPAHAMAN DENGAN KETENTUAN SEBAGAI BERIKUT:

PASAL 1: RUANG LINGKUP & MAKSUD KERJASAMA
Para Pihak bersepakat untuk melaksanakan studi kelayakan bersama, uji tuntas hukum, dan tinjauan teknis-komersial terkait:
"${f.subjectOrPurpose}" yang berlokasi di ${f.projectLocation}.

PASAL 2: SIFAT TIDAK MENGIKAT (NON-BINDING NATURE)
Kecuali ketentuan Kerahasiaan (Pasal 3) dan Penyelesaian Perselisihan (Pasal 4), Nota Kesepahaman ini bersifat pendahuluan (non-binding preliminary agreement) dan tidak menimbulkan kewajiban finansial yang mengikat sampai ditandatanganinya Perjanjian Definitif.

PASAL 3: BIAYA DAN KERAHASIAAN
Masing-masing Pihak menanggung sendiri seluruh biaya dan pengeluaran yang timbul dalam rangka pelaksanaan nota kesepahaman ini. Seluruh data hasil studi kelayakan wajib dijaga kerahasiaannya selama 3 (tiga) tahun.

PASAL 4: JANGKA WAKTU
Nota Kesepahaman ini berlaku selama ${f.durationMonths} sejak tanggal penandatanganan dan dapat diperpanjang atas kesepakatan tertulis Para Pihak.

PIHAK PERTAMA,                                 PIHAK KEDUA,
${f.firstParty}                                ${f.secondParty}



_______________________                        _______________________
${f.firstPartyRep}                             ${f.secondPartyRep}`;

    case 'TMPL-003': // General Service Agreement
      return `PERJANJIAN PENYEDIAAN JASA PROFESIONAL (GENERAL SERVICE AGREEMENT)
Nomor: ${f.docNumber}

ANTARA:
${f.firstParty} ("PENGGUNA JASA")
DAN
${f.secondParty} ("PENYEDIA JASA")

TENTANG:
${f.subjectOrPurpose.toUpperCase()}

PASAL 1: NILAI KONTRAK & CARA PEMBAYARAN
Total nilai pekerjaan dalam Perjanjian ini adalah sebesar ${formattedValue} (sudah termasuk PPN 11%). Pembayaran dilaksanakan secara bertahap berbasis Berita Acara Serah Terima (BAST) pekerjaan yang disetujui Pengguna Jasa.

PASAL 2: JANGKA WAKTU & LOKASI
Penyedia Jasa wajib merampungkan seluruh lingkup pekerjaan dalam jangka waktu ${f.durationMonths} berlokasi di ${f.projectLocation}.

PASAL 3: DENDA KETERLAMBATAN (LIQUIDATED DAMAGES)
Apabila Penyedia Jasa terlambat menyelesaikan pekerjaan bukan karena Keadaan Memaksa, maka dikenakan denda keterlambatan sebesar 1/1000 (satu per mil) per hari keterlambatan dari total nilai kontrak, setinggi-tingginya 5% (lima persen).

PASAL 4: PENYELESAIAN SENGKETA
Perselisihan yang timbul dari Perjanjian ini diselesaikan melalui musyawarah untuk mufakat dalam waktu 30 hari kalender. Apabila mufakat tidak tercapai, sengketa diputus oleh ${f.arbitrationForum}.

PENGGUNA JASA,                                PENYEDIA JASA,
${f.firstParty}                                ${f.secondParty}



_______________________                        _______________________
${f.firstPartyRep}                             ${f.secondPartyRep}`;

    case 'TMPL-006': // Somasi Wanprestasi
      return `SURAT PERINGATAN / SOMASI WANPRESTASI
Nomor: ${f.docNumber}

Jakarta, ${f.docDate}

Kepada Yth.,
Direksi ${f.secondParty}
${f.secondPartyAddress}
Up. ${f.secondPartyRep}

Perihal: SOMASI I / TEGURAN HUKUM ATAS KELALAIAN PEMENUHAN KEWAJIBAN KONTRAKTUAL

Dengan hormat,
Bertindak untuk dan atas nama serta mewakili kepentingan hukum ${f.firstParty}, bersama surat ini kami sampaikan hal-hal sebagai berikut:

1. Bahwa antara Klien kami (${f.firstParty}) dan Perusahaan Saudara (${f.secondParty}) telah terikat dalam perjanjian mengenai:
   "${f.subjectOrPurpose}" dengan total nilai pekerjaan ${formattedValue}.

2. Bahwa sampai dengan tanggal jatuh tempo yang telah disepakati, Perusahaan Saudara telah lalai dan terbukti tidak memenuhi kewajiban kontraktual pokok (wanprestasi), yang telah menimbulkan kerugian nyata bagi Klien kami.

3. Bahwa tindakan Saudara tersebut telah melanggar ketentuan Pasal 1243 Kitab Undang-Undang Hukum Perdata (KUHPerdata).

MAKA DENGAN INI KAMI MEMBERIKAN SOMASI / TEGURAN KERAS KEPADA SAUDARA:
Agar dalam waktu selambat-lambatnya 7 (tujuh) hari kalender sejak diterimanya surat ini, Saudara segera memenuhi seluruh kewajiban yang tertunggak dan/atau memberikan jadwal penyelesaian tertulis yang konkret.

Apabila dalam batas waktu 7 (tujuh) hari kalender Saudara tetap tidak mengindahkan somasi ini, Klien kami akan mengambil segala langkah hukum yang diperlukan baik secara perdata (gugatan ganti rugi dan pembatalan kontrak) maupun melaporkan ke instansi berwenang serta pendaftaran perkara ke ${f.arbitrationForum}.

Demikian somasi ini kami sampaikan agar Saudara indahkan dengan penuh tanggung jawab.

Hormat kami,
Kuasa Hukum & Legal Department
${f.firstParty}



______________________________
${f.firstPartyRep}`;

    case 'TMPL-007': // Legal Opinion
      return `LEGAL OPINION (PENDAPAT HUKUM INTERNAL)
Nomor Register: ${f.docNumber}
Tanggal: ${f.docDate}

KEPADA : Direksi & Manajemen ${f.firstParty}
DARI   : Departemen Hukum & Kepatuhan Korporat (Corporate Legal & Compliance)
PERIHAL: Pendapat Hukum Mengenai ${f.subjectOrPurpose}

I. DUDUK PERKARA & FAKTA HUKUM (FACTUAL BACKGROUND)
1. Bahwa perseroan saat ini sedang melaksanakan evaluasi terhadap ${f.subjectOrPurpose} yang berlokasi di ${f.projectLocation} dengan perkiraan eksposur finansial sebesar ${formattedValue}.
2. Rekanan/kontraktor terkait adalah ${f.secondParty}.

II. POKOK PERMASALAHAN HUKUM (LEGAL ISSUES)
1. Apakah struktur kesepakatan telah memenuhi ketentuan ${f.governingLaw}?
2. Apa saja potensi risiko hukum (legal exposure) terkait regulasi sektoral dan klausul tanggung jawab?
3. Mekanisme penyelesaian sengketa manakah yang paling aman untuk melindungi kepentingan perseroan?

III. LANDASAN HUKUM & REGULASI TERKAIT (APPLICABLE REGULATIONS)
1. Kitab Undang-Undang Hukum Perdata (KUHPerdata) Buku III tentang Perikatan.
2. UU No. 40 Tahun 2007 tentang Perseroan Terbatas jo. UU No. 6 Tahun 2023.
3. Pedoman Arbitrase ${f.arbitrationForum}.

IV. ANALISIS YURIDIS (LEGAL ANALYSIS)
Berdasarkan telaah mendalam terhadap klausul kontrak dan regulasi yang berlaku, Legal Department berpendapat bahwa perseroan memiliki hak retensi dan hak ganti rugi penuh atas setiap wanprestasi yang ditimbulkan mitra kerja. Pembatasan tanggung jawab harus ditegaskan maksimum sebesar 100% dari nilai kontrak aktual.

V. KESIMPULAN & REKOMENDASI MITIGASI (CONCLUSIONS & ACTIONABLE RECOMMENDATIONS)
1. Disarankan untuk menambahkan klausul proteksi ganti rugi (*indemnity*) bebas tuntutan pihak ketiga.
2. Memasukkan pengabaian berlakunya Pasal 1266 KUHPerdata untuk pengakhiran sepihak tanpa putusan pengadilan.
3. Menetapkan forum penyelesaian sengketa definitif melalui ${f.arbitrationForum}.

Disusun oleh:                                   Disetujui oleh:
Senior Legal Counsel                            Lead Legal Director & General Counsel



_____________________                           _____________________
PIC Legal Department                            ${f.firstPartyRep}`;

    default: // Generic contract
      return `PERJANJIAN KERJASAMA
Nomor: ${f.docNumber}
Tanggal: ${f.docDate}

ANTARA: ${f.firstParty}
DAN: ${f.secondParty}
TENTANG: ${f.subjectOrPurpose}
NILAI: ${formattedValue}

Diselesaikan di ${f.arbitrationForum}.`;
  }
}

/**
 * Trigger download of document in MS Word (.doc) format with clean legal typography
 */
export function downloadAsWordDoc(filename, title, content) {
  const htmlContent = `
    <!DOCTYPE html>
    <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
    <head>
      <meta charset='utf-8'>
      <title>${title}</title>
      <style>
        body { font-family: 'Times New Roman', serif; font-size: 12pt; line-height: 1.5; color: #000; padding: 2cm; }
        h1, h2, h3 { text-align: center; font-weight: bold; text-transform: uppercase; margin-bottom: 12pt; }
        .letterhead { text-align: center; border-bottom: 2pt solid #000; padding-bottom: 8pt; margin-bottom: 18pt; }
        .letterhead h2 { margin: 0; font-size: 14pt; }
        .letterhead p { margin: 2pt 0; font-size: 9pt; color: #333; }
        .content { white-space: pre-wrap; text-align: justify; }
      </style>
    </head>
    <body>
      <div class="letterhead">
        <h2>PT NUSANTARA ENERGI TBK</h2>
        <p>Energy Tower 28th Fl., SCBD Lot 11, Jl. Jend. Sudirman Kav. 52-53, Jakarta Selatan 12190</p>
        <p>Telp: (021) 5289-7000 | Email: legal@nusantara-energi.co.id | Website: www.nusantara-energi.co.id</p>
      </div>
      <div class="content">${content.replace(/\n/g, '<br/>')}</div>
    </body>
    </html>
  `;

  const blob = new Blob(['\ufeff', htmlContent], {
    type: 'application/msword'
  });

  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${filename.replace(/[^a-zA-Z0-9_-]/g, '_')}.doc`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
