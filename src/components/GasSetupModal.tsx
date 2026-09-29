import React, { useState } from 'react';
import { GAS_BACKEND_CODE } from '../services/gasBackendTemplate';
import { storageService } from '../services/storageService';
import {
  Database,
  Copy,
  Check,
  CheckCircle2,
  AlertCircle,
  X,
  Send,
  Sparkles,
  RefreshCw,
  FileSpreadsheet,
  Cpu,
  Layers,
  Table
} from 'lucide-react';

interface GasSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GasSetupModal: React.FC<GasSetupModalProps> = ({ isOpen, onClose }) => {
  const [gasUrl, setGasUrl] = useState(storageService.getGasUrl());
  const [isCopied, setIsCopied] = useState(false);
  const [testStatus, setTestStatus] = useState<'idle' | 'testing' | 'success' | 'failed'>('idle');
  const [testMessage, setTestMessage] = useState('');
  const [isSyncingAll, setIsSyncingAll] = useState(false);
  const [isTestingSample, setIsTestingSample] = useState(false);

  if (!isOpen) return null;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(GAS_BACKEND_CODE);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleSaveUrl = () => {
    storageService.setGasUrl(gasUrl);
    setTestStatus('success');
    setTestMessage('Webhook URL Google Apps Script berhasil disimpan ke sistem CBT!');
    setTimeout(() => setTestMessage(''), 3500);
  };

  const handleTestConnection = async () => {
    if (!gasUrl.trim()) {
      setTestStatus('failed');
      setTestMessage('Masukkan Web App URL terlebih dahulu.');
      return;
    }

    setTestStatus('testing');
    try {
      const pingUrl = gasUrl.includes('?') ? `${gasUrl}&action=PING` : `${gasUrl}?action=PING`;
      const res = await fetch(pingUrl, { method: 'GET' });
      const data = await res.json();
      if (data.success) {
        setTestStatus('success');
        setTestMessage(data.message || 'Koneksi ke Google Sheets Cloud Berhasil! Server Webhook Aktif.');
      } else {
        setTestStatus('failed');
        setTestMessage(data.error || 'Server GAS merespon tetapi mengembalikan error.');
      }
    } catch {
      setTestStatus('failed');
      setTestMessage(
        'Gagal menghubungi Web App URL. Pastikan akses saat deploy diatur ke "Anyone" (Siapa saja).'
      );
    }
  };

  const handleTestSampleSubmit = async () => {
    if (!gasUrl.trim()) {
      setTestStatus('failed');
      setTestMessage('Simpan Web App URL terlebih dahulu sebelum menguji kirim.');
      return;
    }

    setIsTestingSample(true);
    setTestStatus('testing');
    setTestMessage('Mengirim data sampel penilaian siswa ke Spreadsheet...');

    try {
      const res = await storageService.testSendSampleToGAS();
      if (res.success) {
        setTestStatus('success');
        setTestMessage('Berhasil! Data sampel siswa telah terkirim dan dicatat ke tab DB_SISWA_HASIL di Spreadsheet.');
      } else {
        setTestStatus('failed');
        setTestMessage('Gagal: ' + (res.message || 'Tidak dapat menulis ke Spreadsheet.'));
      }
    } catch (err: any) {
      setTestStatus('failed');
      setTestMessage('Kendala jaringan: ' + (err?.message || 'Periksa koneksi internet'));
    } finally {
      setIsTestingSample(false);
    }
  };

  const handleSyncAllSessions = async () => {
    if (!gasUrl.trim()) {
      setTestStatus('failed');
      setTestMessage('Simpan Web App URL terlebih dahulu sebelum sinkronisasi.');
      return;
    }

    setIsSyncingAll(true);
    setTestStatus('testing');
    setTestMessage('Sedang menyinkronkan seluruh riwayat hasil ujian siswa ke Google Spreadsheet...');

    try {
      const res = await storageService.syncAllSessionsToGAS();
      setTestStatus('success');
      setTestMessage(
        `Sinkronisasi selesai! ${res.success} dari ${res.total} data siswa berhasil diperbarui ke Google Spreadsheet.`
      );
    } catch (err: any) {
      setTestStatus('failed');
      setTestMessage('Gagal menyinkronkan data: ' + (err?.message || 'Coba lagi'));
    } finally {
      setIsSyncingAll(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm animate-in fade-in overflow-y-auto font-sans">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 max-w-4xl w-full shadow-2xl space-y-6 my-6 max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">
                Integrasi Webhook Google Spreadsheet (GAS Backend)
              </h2>
              <p className="text-xs text-slate-400">
                Penyimpanan Otomatis Hasil Assesment Siswa & Log Anti-Cheat ke Google Sheets Pak Tarim
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Webhook URL Input & Actions */}
        <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <label className="block text-xs font-semibold text-slate-200">
              Web App URL Deployment (Webhook Endpoint):
            </label>
            <span className="text-[11px] text-emerald-400 font-mono">
              Action: SUBMIT_EXAM · AUTOSAVE_PROGRESS · LOG_VIOLATION
            </span>
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={gasUrl}
              onChange={(e) => setGasUrl(e.target.value)}
              placeholder="https://script.google.com/macros/s/.../exec"
              className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs font-mono text-cyan-300 placeholder:text-slate-600 focus:outline-none focus:border-emerald-500"
            />
            <div className="flex gap-2">
              <button
                onClick={handleSaveUrl}
                className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition-colors cursor-pointer"
              >
                Simpan URL
              </button>
              <button
                onClick={handleTestConnection}
                disabled={testStatus === 'testing' || isTestingSample || isSyncingAll}
                className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer flex items-center gap-1.5 shadow-md shadow-emerald-950/40 disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Uji PING</span>
              </button>
            </div>
          </div>

          {/* Quick Push / Sync Buttons */}
          <div className="pt-2 flex flex-wrap gap-2 border-t border-slate-900">
            <button
              onClick={handleTestSampleSubmit}
              disabled={isTestingSample || isSyncingAll}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <Table className="w-3.5 h-3.5" />
              <span>{isTestingSample ? 'Mengirim Data...' : 'Kirim Baris Sampel Siswa ke Sheet'}</span>
            </button>

            <button
              onClick={handleSyncAllSessions}
              disabled={isSyncingAll || isTestingSample}
              className="px-3.5 py-2 rounded-xl bg-blue-600/80 hover:bg-blue-500 text-white border border-blue-500/40 text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncingAll ? 'animate-spin' : ''}`} />
              <span>{isSyncingAll ? 'Sedang Sinkronisasi...' : 'Sinkronkan Semua Data Siswa Saat Ini'}</span>
            </button>
          </div>

          {testMessage && (
            <div
              className={`p-3 rounded-xl text-xs flex items-center gap-2.5 animate-in fade-in ${
                testStatus === 'success'
                  ? 'bg-emerald-950/70 border border-emerald-800 text-emerald-200'
                  : 'bg-red-950/70 border border-red-800 text-red-200'
              }`}
            >
              {testStatus === 'success' ? (
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
              ) : (
                <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              )}
              <span className="leading-snug">{testMessage}</span>
            </div>
          )}

          <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>
              Catatan: Jika Webhook belum disiapkan, CBT tetap menyimpan seluruh hasil dan progres secara lokal (Local Storage) tanpa ada data yang hilang.
            </span>
          </div>
        </div>

        {/* Logika & Arsitektur Penyelesaian Webhook */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Cpu className="w-4 h-4 text-blue-400" />
            <span>Logika Penyelesaian Integrasi Webhook ke Google Spreadsheet:</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            <div className="p-3.5 bg-slate-950/60 border border-slate-800 rounded-xl space-y-1.5">
              <div className="flex items-center gap-1.5 text-blue-400 font-bold">
                <Layers className="w-3.5 h-3.5" />
                <span>1. Trigger di Frontend</span>
              </div>
              <p className="text-slate-400 leading-relaxed text-[11px]">
                Saat siswa mengklik <strong>"Kumpulkan Ujian"</strong> atau waktu habis, sistem CBT menghitung skor otomatis (PG, PGK, Matching, Isian), menggabungkannya dengan token, NIS, kelas, dan log pelanggaran, lalu mengirim payload JSON ke Webhook URL via <code>fetch(POST)</code> / <code>sendBeacon</code>.
              </p>
            </div>

            <div className="p-3.5 bg-slate-950/60 border border-slate-800 rounded-xl space-y-1.5">
              <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                <Cpu className="w-3.5 h-3.5" />
                <span>2. Parser di Apps Script</span>
              </div>
              <p className="text-slate-400 leading-relaxed text-[11px]">
                Fungsi <code>doPost(e)</code> di Google Apps Script mengurai <code>JSON.parse(e.postData.contents)</code>. Jika <code>action === 'SUBMIT_EXAM'</code>, skrip mencari apakah siswa sudah memiliki baris sebelumnya berdasarkan kombinasi <strong>NIS & Token</strong>.
              </p>
            </div>

            <div className="p-3.5 bg-slate-950/60 border border-slate-800 rounded-xl space-y-1.5">
              <div className="flex items-center gap-1.5 text-purple-400 font-bold">
                <Table className="w-3.5 h-3.5" />
                <span>3. Rekap di Tab Spreadsheet</span>
              </div>
              <p className="text-slate-400 leading-relaxed text-[11px]">
                Data langsung ditulis ke sheet <strong>DB_SISWA_HASIL</strong> (Timestamp, NIS, Nama, Kelas, Token, Total Skor, Skor Auto, Skor Manual, Pelanggaran, Status, JSON Jawaban). Log insiden kecurangan juga ditulis ke sheet <strong>LOG_PELANGGARAN</strong>.
              </p>
            </div>
          </div>
        </div>

        {/* 4 Langkah Deployment */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Database className="w-4 h-4 text-emerald-400" />
            <span>4 Langkah Mudah Penerapan di Akun Google Guru:</span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5 text-xs">
            <div className="p-3 bg-slate-950/40 border border-slate-800/80 rounded-xl space-y-1">
              <span className="font-bold text-amber-400">1. Spreadsheet</span>
              <p className="text-[11px] text-slate-400">
                Buat Spreadsheet baru di Drive bernama <em>"Database CBT PMKR SMKS BK2"</em>.
              </p>
            </div>
            <div className="p-3 bg-slate-950/40 border border-slate-800/80 rounded-xl space-y-1">
              <span className="font-bold text-amber-400">2. Apps Script</span>
              <p className="text-[11px] text-slate-400">
                Pilih menu <strong>Ekstensi &gt; Apps Script</strong>, salin kode di bawah ke <code>Code.gs</code>.
              </p>
            </div>
            <div className="p-3 bg-slate-950/40 border border-slate-800/80 rounded-xl space-y-1">
              <span className="font-bold text-amber-400">3. Inisialisasi</span>
              <p className="text-[11px] text-slate-400">
                Pilih & jalankan fungsi <code>initSpreadsheet()</code> sekali untuk buat header otomatis.
              </p>
            </div>
            <div className="p-3 bg-slate-950/40 border border-slate-800/80 rounded-xl space-y-1">
              <span className="font-bold text-amber-400">4. Deploy Web App</span>
              <p className="text-[11px] text-slate-400">
                Klik <strong>Deploy &gt; New deployment &gt; Web app</strong>. Akses: <em>Anyone</em>. Salin URL-nya ke atas.
              </p>
            </div>
          </div>
        </div>

        {/* Copyable Code Box */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-300">
              Kode Sumber Backend Google Apps Script (Code.gs):
            </span>
            <button
              onClick={handleCopyCode}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer shadow-md shadow-blue-950/40"
            >
              {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{isCopied ? 'Tersalin ke Clipboard!' : 'Salin Kode Code.gs'}</span>
            </button>
          </div>

          <pre className="p-4 bg-slate-950 rounded-xl border border-slate-800 font-mono text-[11px] text-slate-300 max-h-60 overflow-y-auto leading-relaxed select-all">
            {GAS_BACKEND_CODE}
          </pre>
        </div>

        {/* Close Button */}
        <div className="pt-2 text-right">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
          >
            Tutup Jendela
          </button>
        </div>
      </div>
    </div>
  );
};
