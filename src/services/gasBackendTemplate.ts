export const GAS_BACKEND_CODE = `/**
 * =========================================================================
 * GOOGLE APPS SCRIPT (GAS) BACKEND CBT SMKS BINA KARYA 2 KARAWANG
 * Mata Pelajaran : Pemeliharaan Mesin Kendaraan Ringan (PMKR)
 * Kompetensi     : Engine Management System (EMS) Kendaraan Ringan
 * Guru Pengampu  : Tarim, ST., MT.
 * =========================================================================
 * 
 * PANDUAN DEPLOYMENT:
 * 1. Buat Google Spreadsheet baru di Google Drive Anda.
 * 2. Buka menu Extensions (Ekstensi) > Apps Script.
 * 3. Hapus seluruh kode bawaan di editor, lalu paste kode ini secara utuh.
 * 4. Jalankan fungsi "initSpreadsheet()" sekali untuk otomatis membuat sheet & tabel.
 * 5. Klik tombol "Deploy" (Terapkan) > "New deployment" (Penerapan baru).
 * 6. Pilih type "Web app" (Aplikasi Web).
 * 7. Konfigurasi:
 *    - Execute as : "Me" (Email Google Anda)
 *    - Who has access : "Anyone" (Siapa saja, termasuk anonim)
 * 8. Klik Deploy, salin Web App URL (contoh: https://script.google.com/macros/s/.../exec).
 * 9. Tempelkan URL tersebut ke menu Integrasi GAS di aplikasi CBT.
 */

// Konstanta Nama Sheet Database
const SHEET_TOKENS = "DB_TOKEN";
const SHEET_HASIL = "DB_SISWA_HASIL";
const SHEET_PELANGGARAN = "LOG_PELANGGARAN";
const SHEET_BANK_SOAL = "BANK_SOAL";

/**
 * Inisialisasi otomatis lembar kerja Google Sheets
 */
function initSpreadsheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  
  // 1. Buat / Siapkan Sheet Token
  let sToken = ss.getSheetByName(SHEET_TOKENS);
  if (!sToken) {
    sToken = ss.insertSheet(SHEET_TOKENS);
    sToken.appendRow(["Token Code", "Judul Ujian", "Target Kelas", "Durasi (Menit)", "Maks Pelanggaran", "Status Aktif", "Dibuat Oleh", "Tanggal"]);
    sToken.getRange("A1:H1").setBackground("#1E293B").setFontColor("#FFFFFF").setFontWeight("bold");
    
    // Seed Token Bawaan
    sToken.appendRow(["EMS-2026-X431", "PSAJ PMKR Gasal 2026", "XII TKR 1", 90, 4, "TRUE", "Tarim, ST., MT.", new Date()]);
    sToken.appendRow(["BINA-KARYA-02", "UKK Diagnosis Scanner X-431", "XII TKR 2", 90, 3, "TRUE", "Tarim, ST., MT.", new Date()]);
    sToken.appendRow(["DIAGNOSIS-TKRO", "Evaluasi Troubleshooting EFI", "XII TKR 3", 90, 5, "TRUE", "Tarim, ST., MT.", new Date()]);
  }
  
  // 2. Buat / Siapkan Sheet Hasil Siswa
  let sHasil = ss.getSheetByName(SHEET_HASIL);
  if (!sHasil) {
    sHasil = ss.insertSheet(SHEET_HASIL);
    sHasil.appendRow(["Timestamp", "NIS", "Nama Siswa", "Kelas", "Token Digunakan", "Total Skor", "Skor Otomatis", "Skor Manual (Essay)", "Jumlah Pelanggaran", "Status Ujian", "Status Penilaian", "Detail Jawaban JSON"]);
    sHasil.getRange("A1:L1").setBackground("#0F766E").setFontColor("#FFFFFF").setFontWeight("bold");
  }
  
  // 3. Buat / Siapkan Sheet Log Pelanggaran Real-time
  let sLog = ss.getSheetByName(SHEET_PELANGGARAN);
  if (!sLog) {
    sLog = ss.insertSheet(SHEET_PELANGGARAN);
    sLog.appendRow(["Waktu Kejadian", "NIS", "Nama Siswa", "Kelas", "Jenis Pelanggaran", "Tingkat Keparahan", "Keterangan Insiden"]);
    sLog.getRange("A1:G1").setBackground("#991B1B").setFontColor("#FFFFFF").setFontWeight("bold");
  }

  return "Inisialisasi tabel Google Spreadsheet CBT EMS berhasil disiapkan!";
}

/**
 * Handler GET Request
 */
function doGet(e) {
  try {
    const action = e.parameter.action || "PING";
    const ss = SpreadsheetApp.getActiveSpreadsheet();

    if (action === "PING") {
      return jsonResponse({
        success: true,
        message: "Server Google Apps Script CBT SMKS Bina Karya 2 Karawang Online",
        timestamp: new Date().toISOString()
      });
    }

    if (action === "GET_TOKENS") {
      const sheet = ss.getSheetByName(SHEET_TOKENS);
      const data = sheet.getDataRange().getValues();
      const tokens = [];
      for (let i = 1; i < data.length; i++) {
        tokens.push({
          code: data[i][0],
          title: data[i][1],
          classTarget: data[i][2],
          durationMinutes: Number(data[i][3]),
          maxViolationsAllowed: Number(data[i][4]),
          isActive: String(data[i][5]).toUpperCase() === "TRUE" || data[i][5] === true,
          createdBy: data[i][6]
        });
      }
      return jsonResponse({ success: true, tokens: tokens });
    }

    if (action === "GET_RESULTS") {
      const sheet = ss.getSheetByName(SHEET_HASIL);
      const data = sheet.getDataRange().getValues();
      const results = [];
      for (let i = 1; i < data.length; i++) {
        results.push({
          timestamp: data[i][0],
          nis: data[i][1],
          name: data[i][2],
          classGroup: data[i][3],
          tokenUsed: data[i][4],
          totalScore: Number(data[i][5]),
          autoScore: Number(data[i][6]),
          manualScore: Number(data[i][7]),
          violationsCount: Number(data[i][8]),
          status: data[i][9],
          gradedStatus: data[i][10]
        });
      }
      return jsonResponse({ success: true, results: results });
    }

    return jsonResponse({ success: false, error: "Aksi GET tidak dikenali" });
  } catch (err) {
    return jsonResponse({ success: false, error: err.toString() });
  }
}

/**
 * Handler POST Request
 */
function doPost(e) {
  try {
    const postData = JSON.parse(e.postData.contents);
    const action = postData.action;
    const ss = SpreadsheetApp.getActiveSpreadsheet();

    // 1. Validasi Token Ujian
    if (action === "VALIDATE_TOKEN") {
      const { tokenCode, studentClass } = postData;
      const sheet = ss.getSheetByName(SHEET_TOKENS);
      const data = sheet.getDataRange().getValues();
      
      let tokenFound = null;
      for (let i = 1; i < data.length; i++) {
        const code = String(data[i][0]).trim().toUpperCase();
        const isActive = String(data[i][5]).toUpperCase() === "TRUE" || data[i][5] === true;
        const targetClass = String(data[i][2]).trim();

        if (code === String(tokenCode).trim().toUpperCase()) {
          tokenFound = {
            code: code,
            title: data[i][1],
            classTarget: targetClass,
            durationMinutes: Number(data[i][3]),
            maxViolationsAllowed: Number(data[i][4]),
            isActive: isActive
          };
          break;
        }
      }

      if (!tokenFound) {
        return jsonResponse({ success: false, message: "Token ujian tidak ditemukan di database!" });
      }

      if (!tokenFound.isActive) {
        return jsonResponse({ success: false, message: "Token saat ini tidak aktif / dinonaktifkan guru!" });
      }

      if (tokenFound.classTarget !== "Semua Kelas XII TKR" && studentClass && tokenFound.classTarget !== studentClass) {
        return jsonResponse({ 
          success: false, 
          message: "Token ini hanya diperuntukkan bagi kelas " + tokenFound.classTarget + "!" 
        });
      }

      return jsonResponse({ success: true, token: tokenFound, message: "Token valid. Selamat mengerjakan!" });
    }

    // 2. Pencatatan Log Pelanggaran Siswa Real-time
    if (action === "LOG_VIOLATION") {
      const { nis, name, classGroup, violationType, description, severity } = postData;
      const sheet = ss.getSheetByName(SHEET_PELANGGARAN);
      sheet.appendRow([
        new Date().toLocaleString("id-ID", { timeZone: "Asia/Jakarta" }),
        nis,
        name,
        classGroup,
        violationType,
        severity,
        description
      ]);
      return jsonResponse({ success: true, message: "Log pelanggaran berhasil dicatat ke server" });
    }

    // 3. Auto-Save Lembar Jawaban Berkala (Perlindungan saat Siswa Keluar Tanpa Sengaja)
    if (action === "AUTOSAVE_PROGRESS") {
      const { nis, name, classGroup, tokenUsed, currentQuestionIndex, answersCount, answersJson } = postData;
      const sheet = ss.getSheetByName(SHEET_HASIL);
      const data = sheet.getDataRange().getValues();
      let rowIndex = -1;
      for (let i = 1; i < data.length; i++) {
        if (String(data[i][1]) === String(nis) && String(data[i][4]) === String(tokenUsed)) {
          rowIndex = i + 1;
          break;
        }
      }

      const rowValues = [
        new Date().toLocaleString("id-ID", { timeZone: "Asia/Jakarta" }),
        nis,
        name,
        classGroup,
        tokenUsed,
        0, // Skor sementara
        0,
        0,
        0,
        "in_progress (Auto-Saved: " + answersCount + " soal)",
        "pending_review",
        answersJson || "{}"
      ];

      if (rowIndex > 0) {
        // Hanya update jika belum pernah submitted
        if (String(data[rowIndex - 1][9]).indexOf("submitted") === -1) {
          sheet.getRange(rowIndex, 1, 1, rowValues.length).setValues([rowValues]);
        }
      } else {
        sheet.appendRow(rowValues);
      }

      return jsonResponse({ success: true, message: "Progress jawaban berhasil di-autosave ke cloud!" });
    }

    // 4. Penyimpanan Hasil Akhir Ujian Siswa
    if (action === "SUBMIT_EXAM") {
      const { 
        nis, name, classGroup, tokenUsed, 
        totalScore, autoScore, manualScore, 
        violationsCount, status, gradedStatus, answersJson 
      } = postData;

      const sheet = ss.getSheetByName(SHEET_HASIL);
      
      // Cek apakah siswa sudah pernah submit (update or insert)
      const data = sheet.getDataRange().getValues();
      let rowIndex = -1;
      for (let i = 1; i < data.length; i++) {
        if (String(data[i][1]) === String(nis) && String(data[i][4]) === String(tokenUsed)) {
          rowIndex = i + 1;
          break;
        }
      }

      const rowValues = [
        new Date().toLocaleString("id-ID", { timeZone: "Asia/Jakarta" }),
        nis,
        name,
        classGroup,
        tokenUsed,
        totalScore,
        autoScore,
        manualScore,
        violationsCount,
        status,
        gradedStatus,
        answersJson || "{}"
      ];

      if (rowIndex > 0) {
        sheet.getRange(rowIndex, 1, 1, rowValues.length).setValues([rowValues]);
      } else {
        sheet.appendRow(rowValues);
      }

      return jsonResponse({ success: true, message: "Lembar jawaban berhasil tersimpan permanen di cloud!" });
    }

    // 4. Update / Tambah Token Baru dari Dashboard Guru
    if (action === "SAVE_TOKEN") {
      const { tokenCode, title, classTarget, durationMinutes, maxViolationsAllowed, isActive, createdBy } = postData;
      const sheet = ss.getSheetByName(SHEET_TOKENS);
      const data = sheet.getDataRange().getValues();

      let targetRow = -1;
      for (let i = 1; i < data.length; i++) {
        if (String(data[i][0]).toUpperCase() === String(tokenCode).toUpperCase()) {
          targetRow = i + 1;
          break;
        }
      }

      const rowPayload = [
        String(tokenCode).toUpperCase(),
        title,
        classTarget,
        durationMinutes,
        maxViolationsAllowed,
        isActive ? "TRUE" : "FALSE",
        createdBy || "Tarim, ST., MT.",
        new Date()
      ];

      if (targetRow > 0) {
        sheet.getRange(targetRow, 1, 1, rowPayload.length).setValues([rowPayload]);
      } else {
        sheet.appendRow(rowPayload);
      }

      return jsonResponse({ success: true, message: "Token berhasil disimpan di database!" });
    }

    return jsonResponse({ success: false, error: "Aksi POST tidak valid" });
  } catch (err) {
    return jsonResponse({ success: false, error: err.toString() });
  }
}

/**
 * Utilitas Response JSON dengan Header CORS
 */
function jsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
`;
