import React, { useState, useEffect } from 'react';
import { STUDENT_CLASSES } from '../data/initialTokens';
import { storageService } from '../services/storageService';
import { ExamToken, StudentSession } from '../types/cbt';
import {
  ShieldCheck,
  Lock,
  User,
  GraduationCap,
  AlertOctagon,
  ArrowRight,
  BookOpen,
  KeyRound,
  Play,
  RotateCcw,
  CheckCircle2,
  Clock,
  Sparkles
} from 'lucide-react';
import badgeImg from '../assets/images/smk_bina_karya_badge_1790566569470.jpg';

interface StudentLoginProps {
  onStartExam: (session: StudentSession, token: ExamToken) => void;
  onOpenTeacherPortal: () => void;
}

export const StudentLogin: React.FC<StudentLoginProps> = ({
  onStartExam,
  onOpenTeacherPortal,
}) => {
  const [name, setName] = useState('');
  const [nis, setNis] = useState('');
  const [classGroup, setClassGroup] = useState(STUDENT_CLASSES[0]);
  const [tokenInput, setTokenInput] = useState('');
  const [tokenError, setTokenError] = useState('');
  const [tokenTouched, setTokenTouched] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [interruptedSession, setInterruptedSession] = useState<StudentSession | null>(null);

  // Check for interrupted / auto-saved session on mount
  useEffect(() => {
    const current = storageService.getCurrentSession();
    if (current && current.status === 'in_progress') {
      setInterruptedSession(current);
      setName(current.name);
      setNis(current.nis);
      setClassGroup(current.classGroup);
      setTokenInput(current.tokenUsed);
    }
  }, []);

  // Resume interrupted session
  const handleResumeInterruptedSession = async () => {
    if (!interruptedSession) return;
    setIsLoading(true);

    try {
      const tokens = storageService.getTokens();
      const token = tokens.find((t) => t.code.toUpperCase() === interruptedSession.tokenUsed.toUpperCase()) || {
        id: 'tok-resumed',
        code: interruptedSession.tokenUsed,
        title: 'Evaluasi EMS PMKR (Lanjutan)',
        classTarget: interruptedSession.classGroup,
        durationMinutes: interruptedSession.durationMinutes || 90,
        maxViolationsAllowed: 4,
        isActive: true,
        createdAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 86400000).toISOString(),
        createdBy: 'Tarim, ST., MT.'
      };

      if (document.documentElement.requestFullscreen) {
        try {
          await document.documentElement.requestFullscreen();
        } catch {
          // pass
        }
      }

      onStartExam(interruptedSession, token);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDiscardInterruptedSession = () => {
    if (confirm('Apakah Anda yakin ingin membatalkan sesi sebelumnya dan memulai dari awal?')) {
      storageService.clearCurrentSession();
      setInterruptedSession(null);
    }
  };

  const handleTokenChange = (val: string) => {
    const sanitizedVal = val.replace(/\s+/g, ' ');
    setTokenInput(sanitizedVal);
    setErrorMessage('');
    if (tokenTouched) {
      if (!sanitizedVal.trim()) {
        setTokenError('Pastikan Token Anda Sudah Benar');
      } else {
        const result = storageService.validateToken(sanitizedVal, classGroup, name);
        setTokenError(result.valid ? '' : result.message || 'Pastikan Token Anda Sudah Benar');
      }
    }
  };

  const handleTokenBlur = () => {
    setTokenTouched(true);
    if (!tokenInput.trim()) {
      setTokenError('Pastikan Token Anda Sudah Benar');
    } else {
      const result = storageService.validateToken(tokenInput, classGroup, name);
      setTokenError(result.valid ? '' : result.message || 'Pastikan Token Anda Sudah Benar');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setTokenTouched(true);

    if (!name.trim()) {
      setErrorMessage('Silakan isi Nama Lengkap Anda.');
      return;
    }
    if (!nis.trim()) {
      setErrorMessage('Silakan isi Nomor Induk Siswa (NIS).');
      return;
    }
    if (!tokenInput.trim()) {
      setTokenError('Pastikan Token Anda Sudah Benar');
      setErrorMessage('Pastikan Token Anda Sudah Benar');
      return;
    }

    setIsLoading(true);

    try {
      // Validate token with Google Forms style Regular Expression Matching & Name-based token support
      const result = storageService.validateToken(tokenInput, classGroup, name);

      if (!result.valid || !result.token) {
        const errorText = result.message || 'Pastikan Token Anda Sudah Benar';
        setTokenError(errorText);
        setErrorMessage(errorText);
        setIsLoading(false);
        return;
      }

      setTokenError('');

      // Enter Fullscreen
      if (document.documentElement.requestFullscreen) {
        try {
          await document.documentElement.requestFullscreen();
        } catch {
          // Some browsers require explicit user click context, which this is
        }
      }

      // Check if this student already had an in-progress session with this token
      const existing = storageService.findExistingSession(nis.trim(), result.token.code);
      if (existing) {
        // Automatically restore previous session so no answers are lost!
        onStartExam(existing, result.token);
        return;
      }

      // Create new session if no previous session found
      const newSession: StudentSession = {
        nis: nis.trim(),
        name: name.trim(),
        classGroup,
        tokenUsed: result.token.code,
        startTime: Date.now(),
        durationMinutes: result.token.durationMinutes,
        status: 'in_progress',
        currentQuestionIndex: 0,
        answers: {},
        violations: [],
        totalScore: 0,
        maxPossibleScore: 100,
        autoScore: 0,
        manualScore: 0,
        gradedStatus: 'pending_review',
        lastSavedAt: Date.now()
      };

      storageService.saveCurrentSession(newSession);
      onStartExam(newSession, result.token);
    } catch (err: any) {
      setErrorMessage('Terjadi kendala saat memulai sesi: ' + (err.message || 'Coba lagi.'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-blue-600 selection:text-white">
      {/* Top Header */}
      <header className="border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-md px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={badgeImg}
              alt="Logo SMKS Bina Karya 2 Karawang"
              className="w-10 h-10 rounded-lg object-contain bg-white/10 p-0.5"
              referrerPolicy="no-referrer"
            />
            <div>
              <h1 className="text-base font-bold text-white tracking-tight">
                SMKS BINA KARYA 2 KARAWANG
              </h1>
              <p className="text-xs text-slate-400">
                Teknik Kendaraan Ringan Otomotif · CBT Terpadu
              </p>
            </div>
          </div>

          <button
            onClick={onOpenTeacherPortal}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors cursor-pointer"
          >
            <KeyRound className="w-3.5 h-3.5 text-blue-400" />
            Portal Guru / Admin
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-8 flex flex-col lg:flex-row items-center justify-center gap-8">
        
        {/* Left Side: Exam Identity & Rules */}
        <div className="w-full lg:w-1/2 space-y-6">
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-400 bg-blue-950/60 border border-blue-800/60 px-3 py-1 rounded-full">
              Sistem Evaluasi Berbasis Komputer
            </span>
            <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight leading-snug">
              Pemeliharaan Mesin Kendaraan Ringan (PMKR)
            </h2>
            <p className="text-sm text-slate-300">
              Kompetensi Keahlian: <strong className="text-white">Engine Management System (EMS)</strong>, Sensor & Aktuator EFI, Troubleshooting Malfungsi, dan Alat Diagnosis Scanner Launch X-431.
            </p>
            <div className="text-xs text-slate-400 flex items-center gap-2 pt-1 font-medium">
              <span>Guru / Instruktur: <strong className="text-slate-200">Tarim, ST., MT.</strong></span>
            </div>
          </div>

          {/* Security Banner Card */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-3">
            <div className="flex items-center gap-2 text-sm font-bold text-amber-400">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>Sistem Proteksi Anti-Curang (Strict Anti-Cheat Engine)</span>
            </div>
            <ul className="text-xs text-slate-300 space-y-2 leading-relaxed">
              <li className="flex items-start gap-2">
                <span className="text-blue-400 font-bold">1.</span>
                <span><strong>Wajib Fullscreen:</strong> Layar penuh otomatis terkunci selama ujian berjalan.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400 font-bold">2.</span>
                <span><strong>Deteksi Tab & Aplikasi:</strong> Berpindah tab browser atau membuka aplikasi lain akan memicu alarm dan mencatat poin pelanggaran ke dashboard guru secara real-time.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400 font-bold">3.</span>
                <span><strong>Blokir Shortcut & Klik Kanan:</strong> Fungsi salin-tempel (Ctrl+C/V), developer tools (F12), dan klik kanan dinonaktifkan sepenuhnya.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Right Side: Login Form */}
        <div className="w-full lg:w-1/2 max-w-md">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-cyan-400 to-indigo-500" />

            <div className="mb-6">
              <h3 className="text-xl font-bold text-white tracking-tight">
                Masuk Ujian CBT Siswa
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Lengkapi identitas diri dan masukkan token ujian aktif.
              </p>
            </div>

            {/* Auto-Saved Interrupted Session Recovery Box */}
            {interruptedSession && (
              <div className="mb-5 p-4 rounded-xl bg-emerald-950/40 border-2 border-emerald-500/60 shadow-lg shadow-emerald-950/40 space-y-3 animate-in fade-in">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-xs">
                    <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Sesi Ujian Aktif Ditemukan (Auto-Saved)</span>
                  </div>
                  <span className="text-[10px] bg-emerald-900/60 text-emerald-300 font-mono px-2 py-0.5 rounded-full border border-emerald-700/50">
                    Tersimpan Aman
                  </span>
                </div>

                <p className="text-[11px] text-slate-300 leading-relaxed">
                  Sistem mendeteksi Anda sebelumnya keluar dari halaman ujian tanpa sengaja. Seluruh jawaban Anda telah tersimpan secara otomatis dan dapat langsung dilanjutkan.
                </p>

                <div className="text-xs text-slate-300 space-y-1 bg-slate-950/70 p-2.5 rounded-lg border border-slate-800">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Nama Siswa:</span>
                    <span className="font-semibold text-white">{interruptedSession.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">NIS / Kelas:</span>
                    <span className="font-mono text-slate-200">{interruptedSession.nis} · {interruptedSession.classGroup}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Status Token:</span>
                    <span className="text-emerald-400 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Terverifikasi Sistem
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Jawaban Tersimpan:</span>
                    <span className="font-semibold text-emerald-400">
                      {Object.keys(interruptedSession.answers).length} dari 50 Soal
                    </span>
                  </div>
                  {interruptedSession.lastSavedAt && (
                    <div className="flex justify-between text-[11px] pt-1 border-t border-slate-800/80">
                      <span className="text-slate-400">Waktu Terakhir Disimpan:</span>
                      <span className="text-slate-400 font-mono">
                        {new Date(interruptedSession.lastSavedAt).toLocaleTimeString('id-ID')}
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handleResumeInterruptedSession}
                    disabled={isLoading}
                    className="flex-1 py-2.5 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-md shadow-emerald-950/50 cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Lanjutkan Ujian (Jawaban Aman)</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleDiscardInterruptedSession}
                    title="Mulai sesi baru dari awal"
                    className="p-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-red-400 text-xs transition-colors cursor-pointer border border-slate-700"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {errorMessage && (
              <div className="mb-4 p-3 rounded-xl bg-red-950/60 border border-red-800 text-xs text-red-200 flex items-start gap-2">
                <AlertOctagon className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Nama Lengkap */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Nama Lengkap Siswa
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Contoh: Muhammad Rizky"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* NIS */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Nomor Induk Siswa (NIS)
                </label>
                <div className="relative">
                  <GraduationCap className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    value={nis}
                    onChange={(e) => setNis(e.target.value)}
                    placeholder="Contoh: 23241088"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 font-mono"
                  />
                </div>
              </div>

              {/* Kelas */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Kelas & Jurusan
                </label>
                <select
                  value={classGroup}
                  onChange={(e) => setClassGroup(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
                >
                  {STUDENT_CLASSES.map((cls) => (
                    <option key={cls} value={cls}>
                      {cls} - Teknik Kendaraan Ringan
                    </option>
                  ))}
                </select>
              </div>

              {/* Token Ujian (Google Forms Response Validation Style) */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-slate-300">
                    Token Ujian
                  </label>
                  {tokenTouched && !tokenError && tokenInput.trim().length > 0 && (
                    <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1 animate-in fade-in">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Token Cocok
                    </span>
                  )}
                </div>
                <div className="relative">
                  <Lock className={`w-4 h-4 absolute left-3.5 top-3 transition-colors ${tokenError ? 'text-red-400' : 'text-slate-500'}`} />
                  <input
                    type="text"
                    required
                    value={tokenInput}
                    onChange={(e) => handleTokenChange(e.target.value.replace(/\s+/g, ' ').toUpperCase())}
                    onBlur={handleTokenBlur}
                    placeholder="Masukkan Token Ujian"
                    className={`w-full bg-slate-950 border rounded-xl pl-10 pr-4 py-2.5 text-sm font-mono tracking-wider font-bold placeholder:font-normal placeholder:tracking-normal placeholder:text-slate-600 focus:outline-none uppercase transition-all ${
                      tokenError
                        ? 'border-red-500 text-red-200 focus:border-red-500 focus:ring-1 focus:ring-red-500 shadow-sm shadow-red-950/50 bg-red-950/10'
                        : 'border-slate-800 text-amber-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
                    }`}
                  />
                </div>
                {/* Google Forms Custom Error Notification */}
                {tokenError && (
                  <div className="flex items-center gap-1.5 text-xs text-red-400 font-semibold mt-2 animate-in fade-in">
                    <AlertOctagon className="w-4 h-4 shrink-0 text-red-400" />
                    <span>{tokenError}</span>
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-4 py-3 px-5 rounded-xl bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-900/40 cursor-pointer disabled:opacity-50"
              >
                {isLoading ? (
                  <span>Menyiapkan Lembar Soal...</span>
                ) : (
                  <>
                    <span>Mulai Mengerjakan Ujian</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/60 bg-slate-950/80 py-3 text-center text-xs text-slate-400">
        <p>
          © 2026 SMKS Bina Karya 2 Karawang · Kompetensi Keahlian Teknik Kendaraan Ringan Otomotif · Instruktur: Tarim, ST., MT.
        </p>
      </footer>
    </div>
  );
};
