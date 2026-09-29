import React from 'react';
import { AlertTriangle, ShieldAlert, Maximize2, XCircle } from 'lucide-react';
import { ViolationRecord } from '../types/cbt';

interface AntiCheatModalProps {
  isOpen: boolean;
  latestViolation: ViolationRecord | null;
  totalViolations: number;
  maxAllowed: number;
  isDisqualified: boolean;
  onAcknowledge: () => void;
}

export const AntiCheatModal: React.FC<AntiCheatModalProps> = ({
  isOpen,
  latestViolation,
  totalViolations,
  maxAllowed,
  isDisqualified,
  onAcknowledge,
}) => {
  if (!isOpen) return null;

  const violationTypeLabel = (type?: string) => {
    switch (type) {
      case 'tab_switch':
        return 'Deteksi Berpindah Tab / Membuka Aplikasi Lain';
      case 'exit_fullscreen':
        return 'Keluar Dari Mode Layar Penuh (Fullscreen)';
      case 'right_click':
        return 'Percobaan Klik Kanan / Context Menu Dilarang';
      case 'shortcut_blocked':
        return 'Penggunaan Tombol Kombinasi Shortcut Terlarang';
      case 'window_blur':
        return 'Fokus Layar Ujian Hilang (Membuka Window Eksternal)';
      default:
        return 'Pelanggaran Keamanan CBT';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/95 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-slate-900 border-2 border-red-500 rounded-2xl p-6 md:p-8 shadow-2xl shadow-red-950/50 text-center">
        
        {/* Warning Icon Badge */}
        <div className="mx-auto w-16 h-16 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center mb-5 text-red-500 animate-pulse">
          {isDisqualified ? (
            <XCircle className="w-9 h-9" />
          ) : (
            <ShieldAlert className="w-9 h-9" />
          )}
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold tracking-tight text-white mb-2">
          {isDisqualified
            ? 'UJIAN DIBATALKAN / TERKUNCI'
            : 'PERINGATAN KERAS: PELANGGARAN CBT'}
        </h2>

        {/* Violation Tag */}
        <p className="text-red-400 font-semibold text-sm md:text-base mb-4">
          {violationTypeLabel(latestViolation?.type)}
        </p>

        {/* Description Box */}
        <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 mb-6 text-left space-y-2">
          <div className="flex items-start gap-2 text-slate-300 text-sm">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <span>
              {latestViolation?.description ||
                'Aktivitas mencurigakan di luar ketentuan ujian telah terekam ke sistem pengawas.'}
            </span>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800 font-mono">
            <span>Waktu Kejadian: {new Date(latestViolation?.timestamp || Date.now()).toLocaleTimeString('id-ID')}</span>
            <span className="text-red-400 font-semibold">Tercatat di Server Guru</span>
          </div>
        </div>

        {/* Violations Counter */}
        <div className="mb-6 p-3 bg-red-950/30 border border-red-900/50 rounded-xl">
          <div className="flex justify-between items-center text-sm font-medium mb-1.5">
            <span className="text-slate-300">Akumulasi Pelanggaran Anda:</span>
            <span className={`font-mono text-base font-bold ${totalViolations >= maxAllowed ? 'text-red-400' : 'text-amber-400'}`}>
              {totalViolations} / {maxAllowed} kali
            </span>
          </div>
          <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${
                totalViolations >= maxAllowed ? 'bg-red-500' : 'bg-amber-500'
              }`}
              style={{ width: `${Math.min((totalViolations / maxAllowed) * 100, 100)}%` }}
            />
          </div>
          <p className="text-xs text-slate-400 text-left mt-2">
            {isDisqualified
              ? 'Anda telah melampaui batas toleransi. Lembar jawaban Anda telah dibekukan. Segera hubungi pengawas ujian Pak Tarim, ST., MT.'
              : `Peringatan: Mencapai ${maxAllowed} kali pelanggaran akan menyebabkan lembar ujian didiskualifikasi secara otomatis.`}
          </p>
        </div>

        {/* Action Button */}
        {!isDisqualified ? (
          <button
            onClick={onAcknowledge}
            className="w-full py-3.5 px-6 rounded-xl bg-red-600 hover:bg-red-500 active:bg-red-700 text-white font-semibold text-sm transition-colors flex items-center justify-center gap-2 shadow-lg shadow-red-900/30 cursor-pointer"
          >
            <Maximize2 className="w-4 h-4" />
            Saya Mengerti & Kembali ke Layar Penuh
          </button>
        ) : (
          <div className="p-3 bg-red-900/40 rounded-xl text-xs text-red-200 font-medium">
            Sistem Ujian Terkunci. Silakan melapor ke pengawas di ruang bengkel.
          </div>
        )}
      </div>
    </div>
  );
};
