import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Question, StudentSession, ExamToken, ViolationRecord, StudentAnswer } from '../types/cbt';
import { storageService } from '../services/storageService';
import { audioAlert } from '../utils/audioAlert';
import { QuestionRenderer } from './QuestionRenderer';
import { AntiCheatModal } from './AntiCheatModal';
import {
  Clock,
  Shield,
  ChevronLeft,
  ChevronRight,
  Bookmark,
  CheckCircle2,
  AlertTriangle,
  Send,
  Grid,
  Maximize,
  HelpCircle,
  LogOut,
  X
} from 'lucide-react';

interface ExamScreenProps {
  initialSession: StudentSession;
  token: ExamToken;
  onFinishExam: (finalSession: StudentSession) => void;
  onExitToLogin: () => void;
}

export const ExamScreen: React.FC<ExamScreenProps> = ({
  initialSession,
  token,
  onFinishExam,
  onExitToLogin,
}) => {
  const [session, setSession] = useState<StudentSession>(initialSession);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(session.currentQuestionIndex || 0);
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [timeRemainingSeconds, setTimeRemainingSeconds] = useState(
    token.durationMinutes * 60 - Math.floor((Date.now() - session.startTime) / 1000)
  );

  // Anti-Cheat State
  const [antiCheatModalOpen, setAntiCheatModalOpen] = useState(false);
  const [latestViolation, setLatestViolation] = useState<ViolationRecord | null>(null);
  const [isDisqualified, setIsDisqualified] = useState(session.status === 'disqualified');

  // Auto-Save State
  const [lastSavedTime, setLastSavedTime] = useState<number>(session.lastSavedAt || Date.now());
  const [isAutoSaving, setIsAutoSaving] = useState(false);

  // References to guarantee latest state during unload/pagehide
  const sessionRef = useRef<StudentSession>(session);
  sessionRef.current = session;

  const currentIndexRef = useRef<number>(currentIndex);
  currentIndexRef.current = currentIndex;

  // Load questions on mount
  useEffect(() => {
    const list = storageService.getQuestions();
    setQuestions(list);
  }, []);

  // Periodic Auto-Save Heartbeat (every 10 seconds)
  useEffect(() => {
    if (session.status !== 'in_progress') return;

    const autoSaveInterval = setInterval(() => {
      setIsAutoSaving(true);
      const snapshot: StudentSession = {
        ...sessionRef.current,
        currentQuestionIndex: currentIndexRef.current,
        lastSavedAt: Date.now()
      };
      storageService.saveCurrentSession(snapshot);
      storageService.syncAutosaveToGAS(snapshot);
      setLastSavedTime(Date.now());
      setTimeout(() => setIsAutoSaving(false), 600);
    }, 10000);

    return () => clearInterval(autoSaveInterval);
  }, [session.status]);

  // Accidental Exit Safeguard (beforeunload & pagehide)
  useEffect(() => {
    if (session.status !== 'in_progress') return;

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (sessionRef.current && sessionRef.current.status === 'in_progress') {
        const snapshot: StudentSession = {
          ...sessionRef.current,
          currentQuestionIndex: currentIndexRef.current,
          lastSavedAt: Date.now()
        };
        storageService.saveCurrentSession(snapshot);
        storageService.syncAutosaveToGAS(snapshot);

        // Prompt user confirmation to prevent accidental tab closing
        e.preventDefault();
        e.returnValue = 'Ujian sedang berlangsung! Jawaban Anda telah tersimpan otomatis.';
        return e.returnValue;
      }
    };

    const handlePageHide = () => {
      if (sessionRef.current && sessionRef.current.status === 'in_progress') {
        const snapshot: StudentSession = {
          ...sessionRef.current,
          currentQuestionIndex: currentIndexRef.current,
          lastSavedAt: Date.now()
        };
        storageService.saveCurrentSession(snapshot);
        storageService.syncAutosaveToGAS(snapshot);
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('pagehide', handlePageHide);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('pagehide', handlePageHide);
    };
  }, [session.status]);

  // Timer Countdown
  useEffect(() => {
    if (session.status !== 'in_progress') return;

    const timer = setInterval(() => {
      setTimeRemainingSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleFinalSubmit('Waktu Ujian Telah Habis');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [session.status]);

  // Format Time Helper
  const formatTime = (seconds: number) => {
    const s = Math.max(0, seconds);
    const hrs = Math.floor(s / 3600);
    const mins = Math.floor((s % 3600) / 60);
    const secs = s % 60;
    if (hrs > 0) {
      return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Record Violation Handler
  const triggerViolation = useCallback(
    (type: ViolationRecord['type'], description: string, severity: 'warning' | 'critical' = 'critical') => {
      if (session.status !== 'in_progress') return;

      audioAlert.playWarningBeep();

      const updated = storageService.recordViolation(session, {
        type,
        description,
        severity,
      });

      setSession(updated);
      setLatestViolation(updated.violations[updated.violations.length - 1]);
      setAntiCheatModalOpen(true);

      if (updated.status === 'disqualified') {
        setIsDisqualified(true);
        audioAlert.playCriticalAlarm();
      }
    },
    [session]
  );

  // Strict Anti-Cheat Event Listeners
  useEffect(() => {
    if (session.status !== 'in_progress') return;

    // 1. Visibility Change Listener (Tab switch / minimize)
    const handleVisibilityChange = () => {
      if (document.hidden) {
        triggerViolation(
          'tab_switch',
          `Terdeteksi meninggalkan tab ujian pada Soal No. ${currentIndex + 1}`,
          'critical'
        );
      }
    };

    // 2. Fullscreen Change Listener
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement && !(document as any).webkitFullscreenElement) {
        triggerViolation(
          'exit_fullscreen',
          'Siswa keluar dari mode Fullscreen (Layar Penuh)',
          'critical'
        );
      }
    };

    // 3. Window Blur Listener
    const handleWindowBlur = () => {
      // Small timeout to prevent false positives with fullscreen transitions
      setTimeout(() => {
        if (!document.hasFocus() && session.status === 'in_progress') {
          triggerViolation(
            'window_blur',
            'Fokus jendela ujian hilang (aplikasi lain terdeteksi aktif)',
            'warning'
          );
        }
      }, 300);
    };

    // 4. Block Right Click Context Menu
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      triggerViolation('right_click', 'Mencoba klik kanan mouse pada lembar soal', 'warning');
      return false;
    };

    // 5. Block Key Combinations (Ctrl+C, Ctrl+V, F12, Alt+Tab, etc.)
    const handleKeyDown = (e: KeyboardEvent) => {
      // Block F12 (DevTools)
      if (e.key === 'F12') {
        e.preventDefault();
        triggerViolation('devtools_attempt', 'Mencoba membuka inspect element (F12)', 'critical');
        return;
      }

      // Block Ctrl or Meta combinations
      if (e.ctrlKey || e.metaKey) {
        const forbiddenKeys = ['c', 'v', 'x', 'a', 'u', 'p', 's', 'j', 'i'];
        if (forbiddenKeys.includes(e.key.toLowerCase())) {
          e.preventDefault();
          triggerViolation(
            'shortcut_blocked',
            `Kombinasi tombol terlarang (Ctrl+${e.key.toUpperCase()}) dicegah`,
            'warning'
          );
          return;
        }
      }

      // Block Alt Key (Alt+Tab prevention)
      if (e.altKey) {
        e.preventDefault();
        triggerViolation(
          'shortcut_blocked',
          'Tombol Alt terdeteksi ditekan (upaya navigasi keluar window)',
          'warning'
        );
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    window.addEventListener('blur', handleWindowBlur);
    document.addEventListener('contextmenu', handleContextMenu);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      window.removeEventListener('blur', handleWindowBlur);
      document.removeEventListener('contextmenu', handleContextMenu);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [session.status, currentIndex, triggerViolation]);

  // Handle re-entering fullscreen after warning
  const handleAcknowledgeWarning = async () => {
    setAntiCheatModalOpen(false);
    if (!document.fullscreenElement) {
      try {
        await document.documentElement.requestFullscreen();
      } catch {
        // pass
      }
    }
  };

  // Answer modification handler
  const handleAnswerChange = (newAnswer: any) => {
    if (session.status !== 'in_progress') return;

    const currentQ = questions[currentIndex];
    if (!currentQ) return;

    const existingAns = session.answers[currentQ.id];
    const updatedAnswer: StudentAnswer = {
      questionId: currentQ.id,
      type: currentQ.type,
      answer: newAnswer,
      isFlagged: existingAns?.isFlagged || false,
    };

    const updatedAnswers = {
      ...session.answers,
      [currentQ.id]: updatedAnswer,
    };

    const updatedSession: StudentSession = {
      ...session,
      currentQuestionIndex: currentIndex,
      answers: updatedAnswers,
    };

    setSession(updatedSession);
    storageService.saveCurrentSession(updatedSession);
  };

  // Toggle Flag (Ragu-ragu)
  const toggleFlagCurrentQuestion = () => {
    const currentQ = questions[currentIndex];
    if (!currentQ) return;

    const existingAns = session.answers[currentQ.id] || {
      questionId: currentQ.id,
      type: currentQ.type,
      answer: null,
      isFlagged: false,
    };

    const updatedAnswer = {
      ...existingAns,
      isFlagged: !existingAns.isFlagged,
    };

    const updatedAnswers = {
      ...session.answers,
      [currentQ.id]: updatedAnswer,
    };

    const updatedSession = {
      ...session,
      answers: updatedAnswers,
    };

    setSession(updatedSession);
    storageService.saveCurrentSession(updatedSession);
  };

  // Final Submit Handler
  const handleFinalSubmit = (reason?: string) => {
    const { autoScore } = storageService.calculateAutoScore(questions, session.answers);

    const completedSession: StudentSession = {
      ...session,
      endTime: Date.now(),
      status: isDisqualified ? 'disqualified' : 'submitted',
      autoScore: autoScore,
      totalScore: autoScore, // initial total equals auto score, essays to be scored by teacher
      gradedStatus: 'pending_review',
    };

    storageService.saveCurrentSession(completedSession);
    storageService.upsertInHistory(completedSession);
    storageService.syncSubmitToGAS(completedSession);

    // Exit fullscreen
    if (document.fullscreenElement && document.exitFullscreen) {
      document.exitFullscreen().catch(() => {});
    }

    onFinishExam(completedSession);
  };

  const currentQ = questions[currentIndex];
  const currentAnswerObj = currentQ ? session.answers[currentQ.id] : undefined;

  // Stats calculation
  const totalQuestions = questions.length;
  const answeredCount = Object.values(session.answers).filter((a) => {
    if (a.answer === null || a.answer === undefined || a.answer === '') return false;
    if (Array.isArray(a.answer) && a.answer.length === 0) return false;
    if (typeof a.answer === 'object' && Object.keys(a.answer).length === 0) return false;
    return true;
  }).length;
  const flaggedCount = Object.values(session.answers).filter((a) => a.isFlagged).length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between select-none font-sans">
      {/* Top Fixed Control Bar */}
      <header className="sticky top-0 z-30 bg-slate-900/95 border-b border-slate-800 backdrop-blur-md px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          
          {/* Identity & Current Question */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex flex-col">
              <span className="text-xs font-bold text-white tracking-wide">
                SMKS BINA KARYA 2 KARAWANG
              </span>
              <span className="text-[11px] text-slate-400">
                {session.name} · {session.classGroup}
              </span>
            </div>

            <div className="h-6 w-px bg-slate-800 hidden sm:block" />

            <div className="flex items-center gap-1.5 bg-blue-950/70 border border-blue-800/60 px-3 py-1 rounded-lg">
              <span className="text-xs text-blue-300 font-semibold">Soal No:</span>
              <span className="text-sm font-bold text-white font-mono">{currentIndex + 1}</span>
              <span className="text-xs text-blue-400">/ {totalQuestions}</span>
            </div>
          </div>

          {/* Center: Realtime Countdown Timer & Auto-Save Indicator */}
          <div className="flex items-center gap-3">
            <div
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl border font-mono font-bold tracking-wider text-sm transition-colors ${
                timeRemainingSeconds <= 300
                  ? 'bg-red-950/60 border-red-500/80 text-red-400 animate-pulse'
                  : 'bg-slate-950 border-slate-800 text-cyan-400'
              }`}
            >
              <Clock className="w-4 h-4 text-cyan-400" />
              <span>{formatTime(timeRemainingSeconds)}</span>
            </div>

            {/* Auto-Save Status Badge */}
            <div className="hidden lg:flex items-center gap-1.5 text-[11px] text-slate-300 bg-slate-950/80 border border-slate-800 px-2.5 py-1.5 rounded-xl">
              <div
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  isAutoSaving ? 'bg-amber-400 scale-125' : 'bg-emerald-400'
                }`}
              />
              <span className="font-medium">
                {isAutoSaving ? 'Menyimpan...' : 'Otomatis Tersimpan'}
              </span>
              <span className="text-slate-600">·</span>
              <span className="font-mono text-slate-400 text-[10px]">
                {new Date(lastSavedTime).toLocaleTimeString('id-ID')}
              </span>
            </div>
          </div>

          {/* Right Action Controls */}
          <div className="flex items-center gap-2">
            {/* Violations Badge */}
            <div
              className={`hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border ${
                session.violations.length > 0
                  ? 'bg-amber-950/40 border-amber-800/70 text-amber-300'
                  : 'bg-slate-950 border-slate-800 text-slate-400'
              }`}
            >
              <Shield className="w-3.5 h-3.5 text-amber-400" />
              <span>Pelanggaran: {session.violations.length}/{token.maxViolationsAllowed}</span>
            </div>

            {/* Questions Grid Drawer Trigger */}
            <button
              onClick={() => setIsNavOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold border border-slate-700 transition-colors cursor-pointer"
            >
              <Grid className="w-3.5 h-3.5 text-blue-400" />
              <span className="hidden sm:inline">Daftar Soal</span>
              <span className="bg-blue-600 text-white text-[10px] px-1.5 py-0.2 rounded-full font-mono">
                {answeredCount}/{totalQuestions}
              </span>
            </button>

            {/* Finish / Submit Button */}
            <button
              onClick={() => setIsSubmitModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors cursor-pointer shadow-md shadow-emerald-950/50"
            >
              <Send className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Selesai Ujian</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Exam Body */}
      <main className="flex-1 max-w-5xl mx-auto w-full p-4 md:p-6 flex flex-col justify-between">
        {currentQ ? (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 md:p-8 shadow-xl">
            <QuestionRenderer
              question={currentQ}
              studentAnswer={currentAnswerObj}
              onAnswerChange={handleAnswerChange}
            />
          </div>
        ) : (
          <div className="text-center py-20 text-slate-400">Memuat butir soal...</div>
        )}

        {/* Bottom Pagination Controls */}
        <div className="mt-6 flex items-center justify-between gap-3 bg-slate-900/80 border border-slate-800 rounded-2xl p-3 md:p-4">
          {/* Previous Button */}
          <button
            onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
            disabled={currentIndex === 0}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:hover:bg-slate-800 text-slate-200 text-xs md:text-sm font-semibold transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Sebelumnya</span>
          </button>

          {/* Ragu-ragu / Flag Checkbox */}
          <button
            onClick={toggleFlagCurrentQuestion}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-xs md:text-sm font-semibold transition-colors cursor-pointer ${
              currentAnswerObj?.isFlagged
                ? 'bg-amber-600/20 border-amber-500 text-amber-300'
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <Bookmark className={`w-4 h-4 ${currentAnswerObj?.isFlagged ? 'fill-amber-400 text-amber-400' : ''}`} />
            <span>Ragu-ragu</span>
          </button>

          {/* Next Button / Finish on last question */}
          {currentIndex < totalQuestions - 1 ? (
            <button
              onClick={() => setCurrentIndex((prev) => Math.min(totalQuestions - 1, prev + 1))}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs md:text-sm font-semibold transition-colors cursor-pointer shadow-md shadow-blue-950/40"
            >
              <span>Berikutnya</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={() => setIsSubmitModalOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs md:text-sm font-bold transition-colors cursor-pointer shadow-md shadow-emerald-950/40"
            >
              <span>Kumpulkan Ujian</span>
              <CheckCircle2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </main>

      {/* Question Grid Navigation Drawer (Overlay Sidebar) */}
      {isNavOpen && (
        <div className="fixed inset-0 z-40 flex justify-end bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-slate-900 border-l border-slate-800 h-full flex flex-col p-6 shadow-2xl overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <h3 className="font-bold text-white text-base">Navigasi Butir Soal (50 Soal)</h3>
              <button
                onClick={() => setIsNavOpen(false)}
                className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Legend */}
            <div className="grid grid-cols-3 gap-2 my-4 text-[11px] text-slate-300">
              <div className="flex items-center gap-1.5">
                <div className="w-3.5 h-3.5 rounded bg-emerald-600" />
                <span>Terjawab ({answeredCount})</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3.5 h-3.5 rounded bg-amber-500" />
                <span>Ragu-ragu ({flaggedCount})</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3.5 h-3.5 rounded bg-slate-800 border border-slate-700" />
                <span>Belum ({totalQuestions - answeredCount})</span>
              </div>
            </div>

            {/* Numbers Grid */}
            <div className="grid grid-cols-5 gap-2.5 py-2 flex-1">
              {questions.map((q, idx) => {
                const ans = session.answers[q.id];
                const isAnswered =
                  ans?.answer !== null &&
                  ans?.answer !== undefined &&
                  ans?.answer !== '' &&
                  !(Array.isArray(ans?.answer) && ans.answer.length === 0) &&
                  !(typeof ans?.answer === 'object' && Object.keys(ans.answer).length === 0);
                const isFlagged = ans?.isFlagged;
                const isCurrent = idx === currentIndex;

                let colorClasses = 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700';
                if (isFlagged) {
                  colorClasses = 'bg-amber-500 text-slate-950 font-bold border-amber-400';
                } else if (isAnswered) {
                  colorClasses = 'bg-emerald-600 text-white font-bold border-emerald-500';
                }

                if (isCurrent) {
                  colorClasses += ' ring-2 ring-blue-400 ring-offset-2 ring-offset-slate-900';
                }

                return (
                  <button
                    key={q.id}
                    onClick={() => {
                      setCurrentIndex(idx);
                      setIsNavOpen(false);
                    }}
                    className={`h-11 rounded-xl border flex flex-col items-center justify-center text-xs transition-all cursor-pointer ${colorClasses}`}
                  >
                    <span className="font-mono">{idx + 1}</span>
                    <span className="text-[9px] opacity-75">
                      {q.type === 'single' ? 'PG' : q.type === 'multiple' ? 'PGK' : q.type === 'matching' ? 'Jdh' : q.type === 'short_answer' ? 'Isi' : 'Esy'}
                    </span>
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => {
                setIsNavOpen(false);
                setIsSubmitModalOpen(true);
              }}
              className="mt-4 w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer"
            >
              Kumpulkan Lembar Jawaban Ujian
            </button>
          </div>
        </div>
      )}

      {/* Confirmation Submit Modal */}
      {isSubmitModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-white">Konfirmasi Pengumpulan Ujian</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Apakah Anda yakin ingin mengakhiri sesi ujian dan mengumpulkan seluruh lembar jawaban?
            </p>

            <div className="p-3 bg-slate-950 rounded-xl space-y-2 text-xs font-mono">
              <div className="flex justify-between">
                <span className="text-slate-400">Total Soal:</span>
                <span className="text-white font-bold">{totalQuestions} butir</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Sudah Terjawab:</span>
                <span className="text-emerald-400 font-bold">{answeredCount} butir</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Belum Terjawab:</span>
                <span className="text-amber-400 font-bold">{totalQuestions - answeredCount} butir</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Soal Ragu-ragu:</span>
                <span className="text-amber-400 font-bold">{flaggedCount} butir</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Catatan Pelanggaran:</span>
                <span className={`font-bold ${session.violations.length > 0 ? 'text-red-400' : 'text-slate-400'}`}>
                  {session.violations.length} kali
                </span>
              </div>
            </div>

            {totalQuestions - answeredCount > 0 && (
              <div className="p-2.5 rounded-lg bg-amber-950/40 border border-amber-800/60 text-amber-300 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400" />
                <span>Masih terdapat {totalQuestions - answeredCount} soal yang belum Anda jawab!</span>
              </div>
            )}

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsSubmitModalOpen(false)}
                className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors cursor-pointer"
              >
                Lanjutkan Ujian
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsSubmitModalOpen(false);
                  handleFinalSubmit('Selesai Mandiri');
                }}
                className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors cursor-pointer shadow-lg shadow-emerald-950/50"
              >
                Ya, Kumpulkan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Strict AntiCheat Blocking Modal */}
      <AntiCheatModal
        isOpen={antiCheatModalOpen}
        latestViolation={latestViolation}
        totalViolations={session.violations.length}
        maxAllowed={token.maxViolationsAllowed}
        isDisqualified={isDisqualified}
        onAcknowledge={handleAcknowledgeWarning}
      />
    </div>
  );
};
