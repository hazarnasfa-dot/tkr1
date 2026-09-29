import React, { useState } from 'react';
import { storageService } from '../services/storageService';
import { TeacherSession } from '../types/cbt';
import {
  ShieldCheck,
  KeyRound,
  Lock,
  ArrowRight,
  AlertOctagon,
  X,
  UserCheck,
  Sparkles,
  Info,
  Check
} from 'lucide-react';
import badgeImg from '../assets/images/smk_bina_karya_badge_1790566569470.jpg';

interface TeacherLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccessLogin: (session: TeacherSession) => void;
}

export const TeacherLoginModal: React.FC<TeacherLoginModalProps> = ({
  isOpen,
  onClose,
  onSuccessLogin,
}) => {
  const [tokenInput, setTokenInput] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showHelperTokens, setShowHelperTokens] = useState(false);
  const [copiedToken, setCopiedToken] = useState<string | null>(null);

  if (!isOpen) return null;

  const availableTeacherTokens = storageService.getTeacherTokens().filter(t => t.isActive);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!tokenInput.trim()) {
      setErrorMessage('Silakan masukkan Token Akses Guru.');
      return;
    }

    setIsLoading(true);

    try {
      const res = storageService.loginTeacher(tokenInput.trim());
      if (res.success && res.session) {
        onSuccessLogin(res.session);
      } else {
        setErrorMessage(
          res.message ||
            'Akses Ditolak: Token Akses Guru Tidak Valid! Hanya guru dengan token yang dibuatkan oleh sistem yang dapat masuk ke Panel Admin.'
        );
      }
    } catch (err: any) {
      setErrorMessage('Terjadi kendala autentikasi: ' + (err.message || 'Coba lagi.'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleUseQuickToken = (code: string) => {
    setTokenInput(code);
    setErrorMessage('');
    // Auto-login on quick click
    const res = storageService.loginTeacher(code);
    if (res.success && res.session) {
      onSuccessLogin(res.session);
    } else {
      setErrorMessage(res.message);
    }
  };

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedToken(code);
    setTimeout(() => setCopiedToken(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md shadow-2xl relative overflow-hidden flex flex-col">
        {/* Top Accent Line */}
        <div className="h-1.5 bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600 w-full" />

        {/* Modal Header */}
        <div className="p-6 pb-4 border-b border-slate-800 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <img
              src={badgeImg}
              alt="Logo SMKS Bina Karya 2 Karawang"
              className="w-11 h-11 rounded-xl object-contain bg-white/10 p-1 shrink-0"
              referrerPolicy="no-referrer"
            />
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400 bg-blue-950/60 border border-blue-800/60 px-2 py-0.5 rounded-full">
                  Khusus Guru / Admin
                </span>
              </div>
              <h3 className="text-base font-bold text-white tracking-tight mt-1">
                Autentikasi Guru CBT
              </h3>
              <p className="text-xs text-slate-400">
                SMKS Bina Karya 2 Karawang · PMKR
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5">
          {/* Security Notice */}
          <div className="p-3.5 bg-blue-950/40 border border-blue-800/60 rounded-xl text-xs space-y-1.5">
            <div className="flex items-center gap-2 text-blue-300 font-semibold">
              <ShieldCheck className="w-4 h-4 text-blue-400 shrink-0" />
              <span>Sistem Proteksi Panel Admin Terverifikasi</span>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              Panel Admin hanya dapat diakses oleh Instruktur / Pengawas yang memiliki <strong>Token Khusus Guru yang di-generate langsung oleh sistem</strong>.
            </p>
          </div>

          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-red-950/60 border border-red-800 text-xs text-red-200 flex items-start gap-2.5 animate-in fade-in">
              <AlertOctagon className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <span className="leading-snug">{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Token Akses Guru (Dibuatkan oleh Sistem)
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="text"
                  required
                  autoFocus
                  value={tokenInput}
                  onChange={(e) => {
                    setTokenInput(e.target.value.toUpperCase());
                    setErrorMessage('');
                  }}
                  placeholder="Masukkan Token Guru..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm font-mono text-cyan-300 font-bold uppercase tracking-wider placeholder:font-normal placeholder:tracking-normal placeholder:text-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-1.5">
                Token resmi dibuat oleh sistem untuk <strong>Tarim, ST., MT.</strong>
              </p>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-5 rounded-xl bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-900/40 cursor-pointer disabled:opacity-50"
            >
              {isLoading ? (
                <span>Memverifikasi Token Sistem...</span>
              ) : (
                <>
                  <UserCheck className="w-4 h-4" />
                  <span>Masuk ke Panel Guru</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* System Generated Tokens Helper Box */}
          <div className="pt-2 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setShowHelperTokens(!showHelperTokens)}
              className="w-full flex items-center justify-between text-xs text-slate-400 hover:text-slate-200 transition-colors py-1 cursor-pointer"
            >
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Lihat Token Guru Resmi di Sistem ({availableTeacherTokens.length})</span>
              </span>
              <span className="text-[10px] text-blue-400 font-semibold underline">
                {showHelperTokens ? 'Sembunyikan' : 'Buka Kunci Akses'}
              </span>
            </button>

            {showHelperTokens && (
              <div className="mt-3 p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2.5 animate-in fade-in">
                <div className="text-[11px] text-slate-400 flex items-center gap-1">
                  <Info className="w-3 h-3 text-slate-500 shrink-0" />
                  <span>Klik tombol di bawah untuk langsung menggunakan token:</span>
                </div>

                <div className="space-y-2">
                  {availableTeacherTokens.map((t) => (
                    <div
                      key={t.id}
                      className="p-2.5 bg-slate-900/90 border border-slate-800 rounded-lg flex items-center justify-between gap-2 hover:border-slate-700 transition-colors"
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-xs text-amber-300">
                            {t.tokenCode}
                          </span>
                          <span className="text-[9px] uppercase font-semibold px-1.5 py-0.5 rounded bg-blue-950 border border-blue-800 text-blue-300">
                            {t.role.replace('_', ' ')}
                          </span>
                        </div>
                        <div className="text-[10px] text-slate-400 truncate">
                          {t.teacherName} {t.nipOrId ? `· NIP: ${t.nipOrId}` : ''}
                        </div>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          onClick={() => handleCopy(t.tokenCode)}
                          title="Salin Kode"
                          className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition-colors cursor-pointer"
                        >
                          {copiedToken === t.tokenCode ? (
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <KeyRound className="w-3.5 h-3.5" />
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleUseQuickToken(t.tokenCode)}
                          className="px-2.5 py-1.5 rounded bg-blue-600 hover:bg-blue-500 text-white font-semibold text-[11px] transition-colors cursor-pointer"
                        >
                          Gunakan
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
