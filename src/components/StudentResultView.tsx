import React, { useState } from 'react';
import { StudentSession } from '../types/cbt';
import { storageService } from '../services/storageService';
import {
  CheckCircle2,
  XCircle,
  AlertOctagon,
  Award,
  BookOpen,
  ArrowLeft,
  ShieldAlert,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import badgeImg from '../assets/images/smk_bina_karya_badge_1790566569470.jpg';

interface StudentResultViewProps {
  session: StudentSession;
  onBackToHome: () => void;
}

export const StudentResultView: React.FC<StudentResultViewProps> = ({ session, onBackToHome }) => {
  const [showDetails, setShowDetails] = useState(false);
  const questions = storageService.getQuestions();

  const isPassed = session.totalScore >= 75;
  const isDisqualified = session.status === 'disqualified';

  // Competency breakdown
  const competencyStats: Record<string, { total: number; earned: number }> = {};
  questions.forEach((q) => {
    if (!competencyStats[q.competency]) {
      competencyStats[q.competency] = { total: 0, earned: 0 };
    }
    competencyStats[q.competency].total += q.points;

    const ans = session.answers[q.id]?.answer;
    if (q.type === 'single' && typeof ans === 'string' && q.correctAnswers.includes(ans)) {
      competencyStats[q.competency].earned += q.points;
    }
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between p-4 md:p-8 font-sans">
      <div className="max-w-4xl mx-auto w-full space-y-6">
        {/* Header Branding */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <img
              src={badgeImg}
              alt="Logo SMKS Bina Karya 2 Karawang"
              className="w-12 h-12 rounded-xl object-contain bg-white/10 p-1"
              referrerPolicy="no-referrer"
            />
            <div>
              <h1 className="text-lg font-bold text-white tracking-tight">
                SMKS BINA KARYA 2 KARAWANG
              </h1>
              <p className="text-xs text-slate-400">
                Laporan Hasil Ujian CBT PMKR · Guru: Tarim, ST., MT.
              </p>
            </div>
          </div>

          <button
            onClick={onBackToHome}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali ke Beranda
          </button>
        </div>

        {/* Score Hero Card */}
        <div
          className={`rounded-2xl border p-6 md:p-8 relative overflow-hidden shadow-2xl ${
            isDisqualified
              ? 'bg-red-950/20 border-red-800/80'
              : isPassed
              ? 'bg-slate-900 border-emerald-500/50'
              : 'bg-slate-900 border-amber-500/50'
          }`}
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-2">
                {isDisqualified ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-600/30 border border-red-500 text-red-300">
                    <XCircle className="w-4 h-4" /> DISKUALIFIKASI / TERKUNCI
                  </span>
                ) : isPassed ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-600/20 border border-emerald-500 text-emerald-400">
                    <CheckCircle2 className="w-4 h-4" /> MEMENUHI KRITERIA KETUNTASAN (KKM ≥ 75)
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-600/20 border border-amber-500 text-amber-400">
                    <AlertOctagon className="w-4 h-4" /> PERLU REMEDIAL / PENGAYAAN (KKM 75)
                  </span>
                )}
              </div>

              <h2 className="text-2xl md:text-3xl font-extrabold text-white">
                {session.name}
              </h2>
              <p className="text-xs text-slate-400 font-mono">
                NIS: {session.nis} · Kelas: {session.classGroup} · Token: {session.tokenUsed}
              </p>
            </div>

            {/* Score Big Display */}
            <div className="flex flex-col items-center bg-slate-950/80 border border-slate-800 p-5 rounded-2xl min-w-44 text-center">
              <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">
                Nilai Akhir
              </span>
              <div className="flex items-baseline gap-1 my-1">
                <span
                  className={`text-5xl font-black font-mono tracking-tight ${
                    isDisqualified
                      ? 'text-red-400'
                      : isPassed
                      ? 'text-emerald-400'
                      : 'text-amber-400'
                  }`}
                >
                  {session.totalScore}
                </span>
                <span className="text-slate-500 font-mono text-sm">/ 100</span>
              </div>
              <span className="text-[11px] text-slate-400">
                Skor Otomatis: {session.autoScore} · Essay: {session.manualScore}
              </span>
            </div>
          </div>
        </div>

        {/* Violations Summary Card */}
        {session.violations.length > 0 && (
          <div className="bg-red-950/20 border border-red-900/40 rounded-2xl p-5 space-y-3">
            <div className="flex items-center gap-2 text-sm font-bold text-red-400">
              <ShieldAlert className="w-4 h-4" />
              <span>
                Catatan Pelanggaran Selama Ujian ({session.violations.length} insiden terekam)
              </span>
            </div>
            <div className="space-y-2">
              {session.violations.map((v, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between text-xs p-2.5 bg-slate-900/80 rounded-xl border border-red-900/30"
                >
                  <span className="text-slate-300">{v.description}</span>
                  <span className="text-slate-500 font-mono shrink-0 ml-2">
                    {new Date(v.timestamp).toLocaleTimeString('id-ID')}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Competency Mastery Grid */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <h3 className="font-bold text-white text-sm">Capaian Kompetensi Engine Management System</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {Object.entries(competencyStats).map(([comp, stat], idx) => {
              const pct = Math.round((stat.earned / stat.total) * 100) || 0;
              return (
                <div key={idx} className="p-3 bg-slate-950 rounded-xl border border-slate-800/80 space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="font-medium text-slate-300 truncate">{comp}</span>
                    <span className="font-mono text-cyan-400 font-bold">{pct}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 rounded-full transition-all"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Detailed Question Review Toggle */}
        <div className="text-center pt-2">
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors cursor-pointer"
          >
            <BookOpen className="w-4 h-4 text-blue-400" />
            <span>{showDetails ? 'Sembunyikan Pembahasan Soal' : 'Lihat Kunci Jawaban & Pembahasan Lengkap'}</span>
            {showDetails ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>

        {/* Detailed Questions Review List */}
        {showDetails && (
          <div className="space-y-4 pt-2">
            <h4 className="text-sm font-bold text-white">Daftar Kunci & Pembahasan 50 Butir Soal</h4>
            {questions.map((q, idx) => {
              const studentAns = session.answers[q.id]?.answer;
              return (
                <div key={q.id} className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-3">
                  <div className="flex items-center justify-between text-xs text-slate-400 border-b border-slate-800 pb-2">
                    <span className="font-bold text-blue-400">Soal No. {idx + 1} ({q.competency})</span>
                    <span className="font-mono text-amber-400">Bobot: {q.points} Poin</span>
                  </div>
                  <p className="text-sm text-slate-200 whitespace-pre-line font-medium">{q.prompt}</p>

                  <div className="p-3 bg-slate-950 rounded-xl text-xs space-y-1.5 font-mono">
                    <div className="text-slate-400">
                      Jawaban Anda: <span className="text-slate-200 font-bold">{JSON.stringify(studentAns || '-')}</span>
                    </div>
                    <div className="text-emerald-400 font-bold">
                      Kunci Jawaban: {JSON.stringify(q.correctAnswers)}
                    </div>
                  </div>

                  <div className="text-xs text-slate-300 bg-blue-950/20 border border-blue-900/30 p-3 rounded-xl leading-relaxed">
                    <strong className="text-blue-300">Pembahasan Teknis:</strong> {q.explanation}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
