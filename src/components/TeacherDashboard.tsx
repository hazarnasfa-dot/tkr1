import React, { useState, useEffect } from 'react';
import {
  StudentSession,
  ExamToken,
  Question,
  ViolationRecord,
  TokenValidationConfig,
  TeacherAdminToken,
  TeacherSession
} from '../types/cbt';
import { storageService } from '../services/storageService';
import { STUDENT_CLASSES } from '../data/initialTokens';
import {
  Users,
  ShieldAlert,
  BarChart3,
  BookOpen,
  Key,
  Database,
  Search,
  Filter,
  RefreshCw,
  Download,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
  Edit,
  Plus,
  Trash2,
  Copy,
  Check,
  Award,
  ArrowLeft,
  FileCheck,
  Terminal,
  Sliders,
  Code,
  LogOut,
  UserCheck,
  Sparkles,
  KeyRound,
  ShieldCheck,
  ToggleLeft,
  ToggleRight
} from 'lucide-react';
import badgeImg from '../assets/images/smk_bina_karya_badge_1790566569470.jpg';

interface TeacherDashboardProps {
  teacherSession: TeacherSession | null;
  onLogoutTeacher: () => void;
  onBackToStudentLogin: () => void;
  onOpenQuestionBank: () => void;
  onOpenGasSetup: () => void;
}

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({
  teacherSession,
  onLogoutTeacher,
  onBackToStudentLogin,
  onOpenQuestionBank,
  onOpenGasSetup,
}) => {
  const [activeTab, setActiveTab] = useState<'monitoring' | 'violations' | 'analytics' | 'grading' | 'tokens'>('monitoring');
  const [sessions, setSessions] = useState<StudentSession[]>([]);
  const [tokens, setTokens] = useState<ExamToken[]>([]);
  const [violations, setViolations] = useState<Array<{ nis: string; name: string; classGroup: string } & ViolationRecord>>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [classFilter, setClassFilter] = useState('Semua');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedToken, setCopiedToken] = useState<string | null>(null);

  // Grading Portal State
  const [selectedStudentForGrading, setSelectedStudentForGrading] = useState<StudentSession | null>(null);
  const [gradingScores, setGradingScores] = useState<Record<number, number>>({});
  const [gradingFeedback, setGradingFeedback] = useState<Record<number, string>>({});
  const [saveSuccessMsg, setSaveSuccessMsg] = useState(false);

  // New Student Token Modal State
  const [isTokenModalOpen, setIsTokenModalOpen] = useState(false);
  const [newTokenCode, setNewTokenCode] = useState('');
  const [newTokenTitle, setNewTokenTitle] = useState('');
  const [newTokenClass, setNewTokenClass] = useState('Semua Kelas XII TKR');
  const [newTokenDuration, setNewTokenDuration] = useState(90);
  const [newTokenMaxViolations, setNewTokenMaxViolations] = useState(4);

  // Teacher Tokens (System-Generated) State
  const [tokenSubTab, setTokenSubTab] = useState<'student_tokens' | 'teacher_tokens'>('student_tokens');
  const [teacherTokens, setTeacherTokens] = useState<TeacherAdminToken[]>(() => storageService.getTeacherTokens());
  const [isNewTeacherTokenModalOpen, setIsNewTeacherTokenModalOpen] = useState(false);
  const [newTeacherName, setNewTeacherName] = useState('Tarim, ST., MT.');
  const [newTeacherNip, setNewTeacherNip] = useState('197805122008011005');
  const [newTeacherRole, setNewTeacherRole] = useState<'super_admin' | 'guru_pengampu' | 'pengawas'>('guru_pengampu');

  // Google Forms Token Validation State (Regular Expression & Batch Paste)
  const [tokenConfig, setTokenConfig] = useState<TokenValidationConfig>(() => storageService.getTokenValidationConfig());
  const [isBatchModalOpen, setIsBatchModalOpen] = useState(false);
  const [batchPasteInput, setBatchPasteInput] = useState('');
  const [batchTargetClass, setBatchTargetClass] = useState('Semua Kelas XII TKR');
  const [batchDuration, setBatchDuration] = useState(90);
  const [batchCustomError, setBatchCustomError] = useState('Pastikan Token Anda Sudah Benar');
  const [testTokenInput, setTestTokenInput] = useState('');
  const [testTokenFeedback, setTestTokenFeedback] = useState<{ status: 'idle' | 'valid' | 'invalid'; message: string }>({ status: 'idle', message: '' });
  const [isDirectPatternEdit, setIsDirectPatternEdit] = useState(false);
  const [directPatternInput, setDirectPatternInput] = useState('');
  const [batchSuccessToast, setBatchSuccessToast] = useState('');

  // Load Data
  const refreshAllData = () => {
    setSessions(storageService.getSessionsHistory());
    setTokens(storageService.getTokens());
    setTeacherTokens(storageService.getTeacherTokens());
    setViolations(storageService.getAllGlobalViolations());
    setQuestions(storageService.getQuestions());
    setTokenConfig(storageService.getTokenValidationConfig());
  };

  useEffect(() => {
    refreshAllData();
    const interval = setInterval(refreshAllData, 4000);
    return () => clearInterval(interval);
  }, []);

  // Filtered Sessions
  const filteredSessions = sessions.filter((s) => {
    const matchClass = classFilter === 'Semua' || s.classGroup === classFilter;
    const matchSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.nis.includes(searchQuery) ||
      s.tokenUsed.toLowerCase().includes(searchQuery.toLowerCase());
    return matchClass && matchSearch;
  });

  // Analytics Metrics
  const submittedList = sessions.filter((s) => s.status === 'submitted');
  const totalSubmitted = submittedList.length;
  const avgScore = totalSubmitted > 0 ? Math.round(submittedList.reduce((acc, curr) => acc + curr.totalScore, 0) / totalSubmitted) : 0;
  const highestScore = totalSubmitted > 0 ? Math.max(...submittedList.map((s) => s.totalScore)) : 0;
  const lowestScore = totalSubmitted > 0 ? Math.min(...submittedList.map((s) => s.totalScore)) : 0;
  const passCount = submittedList.filter((s) => s.totalScore >= 75).length;
  const passRate = totalSubmitted > 0 ? Math.round((passCount / totalSubmitted) * 100) : 0;

  // Copy Token Helper
  const handleCopyToken = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedToken(code);
    setTimeout(() => setCopiedToken(null), 2000);
  };

  // Toggle Token
  const handleToggleToken = (code: string) => {
    storageService.toggleTokenStatus(code);
    setTokens(storageService.getTokens());
  };

  // Create Token
  const handleCreateToken = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTokenCode.trim()) return;

    const token: ExamToken = {
      id: 'tok-' + Date.now(),
      code: newTokenCode.trim().toUpperCase(),
      title: newTokenTitle.trim() || 'Evaluasi EMS PMKR',
      classTarget: newTokenClass,
      durationMinutes: Number(newTokenDuration),
      maxViolationsAllowed: Number(newTokenMaxViolations),
      isActive: true,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 48 * 3600 * 1000).toISOString(),
      createdBy: 'Tarim, ST., MT.',
    };

    storageService.addOrUpdateToken(token);
    setTokens(storageService.getTokens());
    setIsTokenModalOpen(false);
    setNewTokenCode('');
    setNewTokenTitle('');
  };

  // Google Forms Batch Paste Token Handler
  const handleBatchSaveTokens = (e: React.FormEvent) => {
    e.preventDefault();
    if (!batchPasteInput.trim()) return;

    const result = storageService.batchUpdateTokensFromPaste(batchPasteInput, {
      targetClass: batchTargetClass,
      durationMinutes: Number(batchDuration),
      customErrorMessage: batchCustomError.trim() || 'Pastikan Token Anda Sudah Benar'
    });

    setTokenConfig(result.config);
    setTokens(storageService.getTokens());
    setIsBatchModalOpen(false);
    setBatchPasteInput('');
    setBatchSuccessToast(`${result.count} Token berhasil diterapkan ke dalam Pola Validasi (Regex Kecocokan)!`);
    setTimeout(() => setBatchSuccessToast(''), 4500);
  };

  // Direct Pattern Edit Handler
  const handleSaveDirectPattern = () => {
    if (!directPatternInput.trim()) return;
    const updated: TokenValidationConfig = {
      ...tokenConfig,
      pattern: directPatternInput.trim(),
      updatedAt: new Date().toISOString()
    };
    storageService.saveTokenValidationConfig(updated);
    setTokenConfig(updated);
    setIsDirectPatternEdit(false);
    setBatchSuccessToast('Pola Regular Expression berhasil diperbarui.');
    setTimeout(() => setBatchSuccessToast(''), 4000);
  };

  // Live Token Pattern Tester Handler
  const handleTestToken = (val: string) => {
    setTestTokenInput(val);
    if (!val.trim()) {
      setTestTokenFeedback({ status: 'idle', message: '' });
      return;
    }
    const result = storageService.validateToken(val);
    if (result.valid) {
      setTestTokenFeedback({ status: 'valid', message: '✓ Token Cocok (Validasi Berhasil - Akses Dibuka)' });
    } else {
      setTestTokenFeedback({ status: 'invalid', message: `✗ ${result.message || 'Pastikan Token Anda Sudah Benar'}` });
    }
  };

  // Teacher Admin Token Management (System-Generated)
  const handleGenerateTeacherToken = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTeacherName.trim()) return;

    const generated = storageService.generateTeacherToken(newTeacherName, newTeacherNip, newTeacherRole);
    setTeacherTokens(storageService.getTeacherTokens());
    setIsNewTeacherTokenModalOpen(false);
    setBatchSuccessToast(`Token Guru baru [${generated.tokenCode}] berhasil di-generate oleh sistem!`);
    setTimeout(() => setBatchSuccessToast(''), 4500);
  };

  const handleToggleTeacherToken = (id: string) => {
    storageService.toggleTeacherTokenStatus(id);
    setTeacherTokens(storageService.getTeacherTokens());
  };

  const handleDeleteTeacherToken = (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus token guru ini?')) {
      const ok = storageService.deleteTeacherToken(id);
      if (ok) {
        setTeacherTokens(storageService.getTeacherTokens());
      } else {
        alert('Token Super Admin utama tidak boleh dihapus.');
      }
    }
  };

  // Start Grading Student
  const handleSelectForGrading = (s: StudentSession) => {
    setSelectedStudentForGrading(s);
    const initialScores: Record<number, number> = {};
    const initialFeedback: Record<number, string> = {};

    questions
      .filter((q) => q.type === 'essay' || q.type === 'short_answer')
      .forEach((q) => {
        const studentAns = s.answers[q.id];
        initialScores[q.id] = studentAns?.scoreEarned ?? (q.type === 'short_answer' ? (studentAns?.answer ? 3 : 0) : 0);
        initialFeedback[q.id] = studentAns?.teacherFeedback || '';
      });

    setGradingScores(initialScores);
    setGradingFeedback(initialFeedback);
    setSaveSuccessMsg(false);
  };

  // Save Manual Grade
  const handleSaveGrades = () => {
    if (!selectedStudentForGrading) return;

    let manualTotal = 0;
    const updatedAnswers = { ...selectedStudentForGrading.answers };

    Object.entries(gradingScores).forEach(([qIdStr, score]) => {
      const qId = Number(qIdStr);
      manualTotal += score;
      if (updatedAnswers[qId]) {
        updatedAnswers[qId] = {
          ...updatedAnswers[qId],
          scoreEarned: score,
          manualGraded: true,
          teacherFeedback: gradingFeedback[qId] || '',
        };
      }
    });

    const updatedSession: StudentSession = {
      ...selectedStudentForGrading,
      manualScore: manualTotal,
      totalScore: Math.min(100, selectedStudentForGrading.autoScore + manualTotal),
      gradedStatus: 'fully_graded',
      answers: updatedAnswers,
    };

    storageService.saveCurrentSession(updatedSession);
    storageService.upsertInHistory(updatedSession);
    storageService.syncSubmitToGAS(updatedSession);
    refreshAllData();
    setSelectedStudentForGrading(updatedSession);
    setSaveSuccessMsg(true);
    setTimeout(() => setSaveSuccessMsg(false), 3000);
  };

  // Export CSV
  const handleExportCSV = () => {
    const headers = ['No', 'NIS', 'Nama Siswa', 'Kelas', 'Token', 'Skor Total', 'Skor Otomatis', 'Skor Essay', 'Pelanggaran', 'Status'];
    const rows = sessions.map((s, idx) => [
      idx + 1,
      s.nis,
      `"${s.name}"`,
      s.classGroup,
      s.tokenUsed,
      s.totalScore,
      s.autoScore,
      s.manualScore,
      s.violations.length,
      s.status,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Rekap_Nilai_CBT_EMS_SMKS_Bina_Karya_2_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Header */}
      <header className="sticky top-0 z-20 bg-slate-900/95 border-b border-slate-800 backdrop-blur-md px-6 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img
              src={badgeImg}
              alt="Logo SMKS Bina Karya 2 Karawang"
              className="w-10 h-10 rounded-lg object-contain bg-white/10 p-1"
              referrerPolicy="no-referrer"
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm font-bold text-white tracking-tight">
                  SMKS BINA KARYA 2 KARAWANG · DASHBOARD GURU
                </h1>
                <span className="text-[10px] bg-blue-900/40 border border-blue-700/60 text-blue-300 font-mono px-2 py-0.2 rounded-full">
                  LIVE TELEMETRY
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Pemeliharaan Mesin Kendaraan Ringan (EMS) · Pengampu: Tarim, ST., MT.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {teacherSession && (
              <div className="hidden lg:flex items-center gap-2 bg-slate-800/90 border border-slate-700/80 px-3 py-1 rounded-xl text-xs">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-slate-200 font-semibold">{teacherSession.teacherName}</span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800 uppercase font-bold">
                  {teacherSession.role.replace('_', ' ')}
                </span>
              </div>
            )}

            <button
              onClick={onOpenQuestionBank}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors cursor-pointer"
            >
              <BookOpen className="w-3.5 h-3.5 text-blue-400" />
              <span className="hidden md:inline">Bank Soal (50 Butir)</span>
            </button>

            <button
              onClick={onOpenGasSetup}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-950/60 hover:bg-emerald-900/60 text-emerald-300 text-xs font-semibold border border-emerald-800/80 transition-colors cursor-pointer"
            >
              <Database className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Integrasi Google Sheets (GAS)</span>
            </button>

            <button
              onClick={onLogoutTeacher}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-950/50 hover:bg-red-900/60 text-red-300 text-xs font-semibold border border-red-800/80 transition-colors cursor-pointer"
              title="Keluar dari sesi Guru"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>

            <button
              onClick={onBackToStudentLogin}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Halaman Siswa</span>
            </button>
          </div>
        </div>
      </header>

      {/* Navigation Sub-Tabs */}
      <nav className="border-b border-slate-800/80 bg-slate-900/50 px-6 py-2">
        <div className="max-w-7xl mx-auto flex items-center gap-1.5 overflow-x-auto text-xs">
          <button
            onClick={() => { setActiveTab('monitoring'); setSelectedStudentForGrading(null); }}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer ${
              activeTab === 'monitoring'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Monitoring Siswa ({sessions.length})</span>
          </button>

          <button
            onClick={() => { setActiveTab('violations'); setSelectedStudentForGrading(null); }}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer ${
              activeTab === 'violations'
                ? 'bg-red-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <ShieldAlert className="w-4 h-4" />
            <span>Log Pelanggaran Real-time ({violations.length})</span>
          </button>

          <button
            onClick={() => { setActiveTab('analytics'); setSelectedStudentForGrading(null); }}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer ${
              activeTab === 'analytics'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Analisis Nilai & Butir Soal</span>
          </button>

          <button
            onClick={() => { setActiveTab('grading'); setSelectedStudentForGrading(null); }}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer ${
              activeTab === 'grading'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <FileCheck className="w-4 h-4" />
            <span>Penilaian Essay (Rubrik Guru)</span>
          </button>

          <button
            onClick={() => { setActiveTab('tokens'); setSelectedStudentForGrading(null); }}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer ${
              activeTab === 'tokens'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <Key className="w-4 h-4" />
            <span>Manajemen Token ({tokens.length})</span>
          </button>
        </div>
      </nav>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl mx-auto w-full p-4 md:p-6 space-y-6">

        {/* 1. MONITORING SISWA TAB */}
        {activeTab === 'monitoring' && (
          <div className="space-y-4">
            {/* Top Stat Overview Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl">
                <span className="text-xs text-slate-400 font-medium">Total Peserta Ujian</span>
                <p className="text-2xl font-bold font-mono text-white mt-1">{sessions.length}</p>
              </div>
              <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl">
                <span className="text-xs text-slate-400 font-medium">Sedang Mengerjakan</span>
                <p className="text-2xl font-bold font-mono text-blue-400 mt-1">
                  {sessions.filter((s) => s.status === 'in_progress').length}
                </p>
              </div>
              <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl">
                <span className="text-xs text-slate-400 font-medium">Sudah Mengumpulkan</span>
                <p className="text-2xl font-bold font-mono text-emerald-400 mt-1">
                  {sessions.filter((s) => s.status === 'submitted').length}
                </p>
              </div>
              <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl">
                <span className="text-xs text-slate-400 font-medium">Terdiskualifikasi</span>
                <p className="text-2xl font-bold font-mono text-red-400 mt-1">
                  {sessions.filter((s) => s.status === 'disqualified').length}
                </p>
              </div>
            </div>

            {/* Filter and Actions Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
              <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-64">
                  <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Cari Siswa / NIS / Token..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <select
                  value={classFilter}
                  onChange={(e) => setClassFilter(e.target.value)}
                  className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                >
                  <option value="Semua">Semua Kelas</option>
                  {STUDENT_CLASSES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                <button
                  onClick={refreshAllData}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
                  title="Refresh Data"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
                <button
                  onClick={handleExportCSV}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-blue-400" />
                  <span>Export CSV</span>
                </button>
                <button
                  onClick={async () => {
                    const res = await storageService.syncAllSessionsToGAS();
                    alert(`Status Webhook: ${res.success} dari ${res.total} data siswa berhasil disinkronkan ke Google Spreadsheet!`);
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-950/60 hover:bg-emerald-900/60 text-emerald-300 text-xs font-semibold border border-emerald-800/80 transition-colors cursor-pointer"
                  title="Kirim dan perbarui seluruh hasil ujian siswa ke Google Spreadsheet via Webhook"
                >
                  <Database className="w-3.5 h-3.5" />
                  <span>Sync ke Spreadsheet</span>
                </button>
              </div>
            </div>

            {/* Students Table */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950 text-slate-400 font-semibold border-b border-slate-800 uppercase tracking-wider">
                    <tr>
                      <th className="p-3.5">NIS</th>
                      <th className="p-3.5">Nama Siswa</th>
                      <th className="p-3.5">Kelas</th>
                      <th className="p-3.5">Token</th>
                      <th className="p-3.5 text-center">Status</th>
                      <th className="p-3.5 text-center">Pelanggaran</th>
                      <th className="p-3.5 text-center">Nilai Akhir</th>
                      <th className="p-3.5 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-sans">
                    {filteredSessions.map((s) => (
                      <tr key={s.nis} className="hover:bg-slate-800/30 transition-colors">
                        <td className="p-3.5 font-mono text-slate-400">{s.nis}</td>
                        <td className="p-3.5 font-semibold text-white">{s.name}</td>
                        <td className="p-3.5 text-slate-300">{s.classGroup}</td>
                        <td className="p-3.5 font-mono text-cyan-400">{s.tokenUsed}</td>
                        <td className="p-3.5 text-center">
                          {s.status === 'submitted' ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-950/60 border border-emerald-700 text-emerald-400">
                              <CheckCircle2 className="w-3 h-3" /> Selesai
                            </span>
                          ) : s.status === 'in_progress' ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-950/60 border border-blue-700 text-blue-400 animate-pulse">
                              <Clock className="w-3 h-3" /> Ujian Berjalan
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-red-950/60 border border-red-700 text-red-400">
                              <XCircle className="w-3 h-3" /> Terkunci
                            </span>
                          )}
                        </td>
                        <td className="p-3.5 text-center">
                          <span
                            className={`font-mono font-bold px-2 py-0.5 rounded ${
                              s.violations.length > 0
                                ? 'bg-red-950/60 text-red-400 border border-red-900'
                                : 'text-slate-400'
                            }`}
                          >
                            {s.violations.length} kali
                          </span>
                        </td>
                        <td className="p-3.5 text-center">
                          <span
                            className={`font-mono text-sm font-bold ${
                              s.totalScore >= 75 ? 'text-emerald-400' : 'text-amber-400'
                            }`}
                          >
                            {s.totalScore}
                          </span>
                          <span className="text-[10px] text-slate-400 ml-1">/100</span>
                        </td>
                        <td className="p-3.5 text-right">
                          <button
                            onClick={() => {
                              setActiveTab('grading');
                              handleSelectForGrading(s);
                            }}
                            className="px-2.5 py-1 rounded bg-blue-600/20 hover:bg-blue-600/40 text-blue-300 border border-blue-500/30 text-xs font-semibold transition-colors cursor-pointer"
                          >
                            Beri Nilai Essay
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* 2. LOG PELANGGARAN TAB */}
        {activeTab === 'violations' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white tracking-tight">
                  Audit Log Pelanggaran Anti-Curang (Real-time Telemetry)
                </h3>
                <p className="text-xs text-slate-400">
                  Seluruh insiden deteksi tab switch, fullscreen exit, klik kanan, dan shortcut keyboard tercatat otomatis.
                </p>
              </div>

              <span className="px-3 py-1 rounded-full bg-red-950/60 border border-red-800 text-xs text-red-300 font-mono">
                {violations.length} Kejadian Tercatat
              </span>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
              <div className="divide-y divide-slate-800/80">
                {violations.length === 0 ? (
                  <div className="p-8 text-center text-slate-500 text-xs">
                    Belum ada insiden pelanggaran yang tercatat.
                  </div>
                ) : (
                  violations.map((v, i) => (
                    <div key={i} className="p-4 flex items-start justify-between gap-4 hover:bg-slate-800/20 transition-colors">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-red-950/60 border border-red-800 flex items-center justify-center shrink-0 mt-0.5 text-red-400">
                          <ShieldAlert className="w-4 h-4" />
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-white text-xs">{v.name}</span>
                            <span className="text-[11px] text-slate-400 font-mono">({v.nis} · {v.classGroup})</span>
                            <span className="px-2 py-0.2 rounded text-[10px] font-mono uppercase bg-slate-800 text-red-400 border border-slate-700">
                              {v.type}
                            </span>
                          </div>
                          <p className="text-xs text-slate-300 leading-relaxed">{v.description}</p>
                        </div>
                      </div>

                      <div className="text-right text-[11px] text-slate-400 font-mono shrink-0">
                        {new Date(v.timestamp).toLocaleTimeString('id-ID')}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* 3. ANALISIS NILAI & BUTIR SOAL */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl">
                <span className="text-xs text-slate-400 uppercase font-semibold">Rata-rata Kelas</span>
                <p className="text-3xl font-extrabold text-blue-400 font-mono mt-1">{avgScore}</p>
                <span className="text-[11px] text-slate-400">Dari {totalSubmitted} siswa selesai</span>
              </div>
              <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl">
                <span className="text-xs text-slate-400 uppercase font-semibold">Ketuntasan (KKM ≥ 75)</span>
                <p className="text-3xl font-extrabold text-emerald-400 font-mono mt-1">{passRate}%</p>
                <span className="text-[11px] text-slate-400">{passCount} tuntas / {totalSubmitted - passCount} belum</span>
              </div>
              <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl">
                <span className="text-xs text-slate-400 uppercase font-semibold">Nilai Tertinggi</span>
                <p className="text-3xl font-extrabold text-cyan-400 font-mono mt-1">{highestScore}</p>
                <span className="text-[11px] text-slate-400">Skor maksimum perolehan</span>
              </div>
              <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl">
                <span className="text-xs text-slate-400 uppercase font-semibold">Nilai Terendah</span>
                <p className="text-3xl font-extrabold text-amber-400 font-mono mt-1">{lowestScore}</p>
                <span className="text-[11px] text-slate-400">Perlu pendampingan khusus</span>
              </div>
            </div>

            {/* Distribution of 50 Questions */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-white text-sm">Distribusi Butir Soal Evaluasi (50 Soal)</h4>
                  <p className="text-xs text-slate-400">
                    Sesuai rasio: 40% Mudah (20 butir), 20% Sedang (10 butir), 40% HOTS Kasus Riil Bengkel (20 butir).
                  </p>
                </div>
                <div className="text-xs text-slate-300 font-mono">Total Poin: 100</div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                  <span className="text-xs text-emerald-400 font-bold uppercase">Tingkat Mudah (40%)</span>
                  <div className="text-xl font-bold font-mono text-white">20 Soal</div>
                  <p className="text-[11px] text-slate-400">Pemahaman konsep dasar sensor NTC, DLC pinout, peran aktuator, dan lambang instrumen.</p>
                </div>
                <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                  <span className="text-xs text-blue-400 font-bold uppercase">Tingkat Sedang (20%)</span>
                  <div className="text-xl font-bold font-mono text-white">10 Soal</div>
                  <p className="text-[11px] text-slate-400">Metode Speed-Density D-EFI, pembacaan live data normal O2, fungsi VVT-i OCV, dan freeze frame.</p>
                </div>
                <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                  <span className="text-xs text-amber-400 font-bold uppercase">Tingkat HOTS (40%)</span>
                  <div className="text-xl font-bold font-mono text-white">20 Soal</div>
                  <p className="text-[11px] text-slate-400">Studi kasus bengkel nyata: hunting idle, P0171 vacuum leak, analisis flyback osiloskop, thermal failure CKP, re-learning ETCS Nissan.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 4. PENILAIAN ESSAY & ISIAN TAB */}
        {activeTab === 'grading' && (
          <div className="space-y-6">
            {!selectedStudentForGrading ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-bold text-white tracking-tight">
                      Portal Penilaian Jawaban Uraian & Isian Singkat
                    </h3>
                    <p className="text-xs text-slate-400">
                      Pilih siswa dari daftar untuk memeriksa jawaban essay berdasarkan rubrik 4 poin standar.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {sessions.map((s) => (
                    <div
                      key={s.nis}
                      onClick={() => handleSelectForGrading(s)}
                      className="p-4 bg-slate-900 border border-slate-800 rounded-xl hover:border-blue-500 transition-all cursor-pointer space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-white text-sm">{s.name}</span>
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded font-mono ${
                            s.gradedStatus === 'fully_graded'
                              ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                              : 'bg-amber-950 text-amber-400 border border-amber-800'
                          }`}
                        >
                          {s.gradedStatus === 'fully_graded' ? 'Dinilai' : 'Perlu Diperiksa'}
                        </span>
                      </div>
                      <div className="text-xs text-slate-400 font-mono">
                        NIS: {s.nis} · {s.classGroup}
                      </div>
                      <div className="flex justify-between items-center text-xs pt-1 border-t border-slate-800">
                        <span className="text-slate-400">Skor Saat Ini:</span>
                        <span className="font-mono font-bold text-cyan-400">{s.totalScore} / 100</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              /* Grading Sheet for Selected Student */
              <div className="space-y-6">
                <div className="flex items-center justify-between bg-slate-900 p-4 rounded-2xl border border-slate-800">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setSelectedStudentForGrading(null)}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
                    >
                      <ArrowLeft className="w-4 h-4" />
                    </button>
                    <div>
                      <h3 className="text-base font-bold text-white">
                        Menilai Lembar Jawaban: {selectedStudentForGrading.name}
                      </h3>
                      <p className="text-xs text-slate-400 font-mono">
                        NIS: {selectedStudentForGrading.nis} · {selectedStudentForGrading.classGroup} · Skor Otomatis: {selectedStudentForGrading.autoScore} Poin
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {saveSuccessMsg && (
                      <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                        <Check className="w-4 h-4" /> Nilai Berhasil Disimpan!
                      </span>
                    )}
                    <button
                      onClick={handleSaveGrades}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer shadow-lg shadow-emerald-950/40"
                    >
                      Simpan Penilaian Manual
                    </button>
                  </div>
                </div>

                {/* Questions to Grade (Soal 41-50) */}
                <div className="space-y-5">
                  {questions
                    .filter((q) => q.type === 'essay' || q.type === 'short_answer')
                    .map((q) => {
                      const studentAns = selectedStudentForGrading.answers[q.id]?.answer;
                      const currentScore = gradingScores[q.id] ?? 0;

                      return (
                        <div key={q.id} className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-3">
                          <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                            <span className="font-bold text-blue-400 text-xs">
                              Soal No. {q.id} ({q.type === 'short_answer' ? 'Isian Singkat' : 'Essay Kasus'}) · Maks: {q.points} Poin
                            </span>
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs text-slate-400">Pemberian Skor:</span>
                              <div className="flex gap-1">
                                {Array.from({ length: q.points + 1 }).map((_, pt) => (
                                  <button
                                    key={pt}
                                    type="button"
                                    onClick={() => setGradingScores((prev) => ({ ...prev, [q.id]: pt }))}
                                    className={`w-7 h-7 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                                      currentScore === pt
                                        ? 'bg-blue-600 text-white ring-2 ring-blue-400'
                                        : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                                    }`}
                                  >
                                    {pt}
                                  </button>
                                ))}
                              </div>
                            </div>
                          </div>

                          <p className="text-xs md:text-sm text-slate-200 whitespace-pre-line font-medium">{q.prompt}</p>

                          {/* Student's submitted text */}
                          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs space-y-1">
                            <span className="text-slate-400 font-semibold">Jawaban Tertulis Siswa:</span>
                            <p className="text-white whitespace-pre-line font-sans leading-relaxed">
                              {studentAns ? String(studentAns) : '(Tidak menjawab / kosong)'}
                            </p>
                          </div>

                          {/* Key & Rubric Preview */}
                          <div className="p-3 bg-blue-950/20 border border-blue-900/30 rounded-xl text-xs space-y-1.5">
                            <span className="text-blue-300 font-semibold">Pedoman Kunci & Rubrik:</span>
                            <p className="text-slate-300 leading-relaxed">{q.explanation}</p>
                          </div>

                          {/* Feedback Input */}
                          <div>
                            <input
                              type="text"
                              value={gradingFeedback[q.id] || ''}
                              onChange={(e) =>
                                setGradingFeedback((prev) => ({ ...prev, [q.id]: e.target.value }))
                              }
                              placeholder="Tambahkan catatan/feedback untuk siswa (opsional)..."
                              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-blue-500"
                            />
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* 5. MANAJEMEN TOKEN TAB (Google Forms Response Validation & System-Generated Teacher Tokens) */}
        {activeTab === 'tokens' && (
          <div className="space-y-6">
            {/* Sub-Tabs Switcher */}
            <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-3">
              <button
                type="button"
                onClick={() => setTokenSubTab('student_tokens')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  tokenSubTab === 'student_tokens'
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-900/40'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>Pola Token Siswa (Google Forms RegEx)</span>
              </button>

              <button
                type="button"
                onClick={() => setTokenSubTab('teacher_tokens')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  tokenSubTab === 'teacher_tokens'
                    ? 'bg-purple-600 text-white shadow-md shadow-purple-900/40'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Token Akses Guru / Admin ({teacherTokens.length})</span>
                <span className="text-[10px] bg-purple-950 border border-purple-800 text-purple-300 px-1.5 py-0.5 rounded-full font-mono">
                  Sistem
                </span>
              </button>
            </div>

            {batchSuccessToast && (
              <div className="p-3 bg-emerald-950 border border-emerald-700 rounded-xl text-xs text-emerald-300 flex items-center gap-2 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{batchSuccessToast}</span>
              </div>
            )}

            {/* SUB-TAB A: TOKEN SISWA (GOOGLE FORMS REGEX & BATCH PASTE) */}
            {tokenSubTab === 'student_tokens' && (
              <div className="space-y-6 animate-in fade-in">
                {/* Header & Main Actions */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                      <span>Validasi Jawaban Token (Model Google Forms)</span>
                      <span className="text-[10px] bg-blue-900/60 border border-blue-700 text-blue-300 font-mono px-2 py-0.5 rounded-full">
                        Regular Expression
                      </span>
                    </h3>
                    <p className="text-xs text-slate-400">
                      Konfigurasi pencocokan pola token dengan Ekspresi Reguler dan notifikasi kustom "Pastikan Token Anda Sudah Benar".
                    </p>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <button
                      onClick={() => {
                        setBatchPasteInput(tokenConfig.rawTokensList.join('\n'));
                        setIsBatchModalOpen(true);
                      }}
                      className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors cursor-pointer shadow-lg shadow-emerald-950/40"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>Paste Token Sekaligus</span>
                    </button>

                    <button
                      onClick={() => setIsTokenModalOpen(true)}
                      className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Tambah Token Satuan</span>
                    </button>
                  </div>
                </div>

                {/* Google Forms Response Validation Active Card */}
                <div className="p-5 bg-slate-900 border-2 border-blue-600/40 rounded-2xl shadow-xl space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400">
                        <Sliders className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                          Parameter Validasi Jawaban (Google Form Rule)
                        </h4>
                        <span className="text-[11px] text-slate-400">
                          Jenis: <strong className="text-slate-200">Ekspresi Reguler</strong> · Syarat: <strong className="text-slate-200">Kecocokan (Matches)</strong>
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setIsDirectPatternEdit(!isDirectPatternEdit);
                        setDirectPatternInput(tokenConfig.pattern);
                      }}
                      className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 font-semibold cursor-pointer"
                    >
                      <Code className="w-3.5 h-3.5" />
                      <span>{isDirectPatternEdit ? 'Tutup Editor RegEx' : 'Edit Rumus RegEx'}</span>
                    </button>
                  </div>

                  {/* Direct RegEx Formula View / Editor */}
                  {!isDirectPatternEdit ? (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-400">Pola Regex Kecocokan Aktif:</span>
                        <span className="text-slate-400 font-mono text-[11px]">
                          {tokenConfig.rawTokensList.length} Token Terdaftar dalam Pola
                        </span>
                      </div>
                      <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 font-mono text-xs text-cyan-300 break-all select-all flex items-center justify-between gap-3">
                        <code>{tokenConfig.pattern}</code>
                        <button
                          onClick={() => handleCopyToken(tokenConfig.pattern)}
                          className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-white shrink-0"
                          title="Salin Pola RegEx"
                        >
                          {copiedToken === tokenConfig.pattern ? (
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2 bg-slate-950 p-4 rounded-xl border border-blue-900/50">
                      <label className="block text-xs font-semibold text-slate-300">
                        Ketik / Edit Rumus Regular Expression Secara Langsung:
                      </label>
                      <input
                        type="text"
                        value={directPatternInput}
                        onChange={(e) => setDirectPatternInput(e.target.value)}
                        placeholder="Contoh: ^(EMS-2026-X431|BINA-KARYA-02|DIAGNOSIS-TKRO)$"
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs font-mono text-cyan-300 focus:outline-none focus:border-blue-500"
                      />
                      <div className="flex justify-end gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => setIsDirectPatternEdit(false)}
                          className="px-3 py-1 rounded bg-slate-800 text-slate-300 text-xs cursor-pointer"
                        >
                          Batal
                        </button>
                        <button
                          type="button"
                          onClick={handleSaveDirectPattern}
                          className="px-3 py-1 rounded bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs cursor-pointer"
                        >
                          Simpan Rumus
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Error Message Configuration */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                    <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl text-xs space-y-1">
                      <span className="text-slate-400 font-medium">Teks Kesalahan Kustom (Saat Tidak Cocok):</span>
                      <div className="flex items-center gap-2 text-red-400 font-semibold font-mono text-xs">
                        <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                        <span>"{tokenConfig.customErrorMessage}"</span>
                      </div>
                      <p className="text-[11px] text-slate-400">
                        Notifikasi ini otomatis muncul di layar siswa saat token yang dimasukkan tidak memenuhi pola.
                      </p>
                    </div>

                    {/* Live Pattern Tester Sandbox */}
                    <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl text-xs space-y-2">
                      <span className="text-slate-300 font-semibold flex items-center gap-1.5">
                        <Terminal className="w-3.5 h-3.5 text-blue-400" />
                        <span>Uji Coba Pola Token (Simulasi Siswa):</span>
                      </span>
                      <input
                        type="text"
                        value={testTokenInput}
                        onChange={(e) => handleTestToken(e.target.value)}
                        placeholder="Ketik token untuk menguji kecocokan..."
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500 uppercase font-mono"
                      />
                      {testTokenFeedback.status !== 'idle' && (
                        <div
                          className={`text-[11px] font-semibold flex items-center gap-1 animate-in fade-in ${
                            testTokenFeedback.status === 'valid' ? 'text-emerald-400' : 'text-red-400'
                          }`}
                        >
                          <span>{testTokenFeedback.message}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Individual Tokens Grid */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                    Daftar Rincian Token Ujian Siswa ({tokens.length} Token)
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {tokens.map((t) => (
                      <div
                        key={t.id}
                        className={`p-5 rounded-2xl border transition-all ${
                          t.isActive
                            ? 'bg-slate-900 border-slate-800'
                            : 'bg-slate-950/60 border-slate-900 opacity-60'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-xl font-black font-mono tracking-wider text-amber-400">
                                {t.code}
                              </span>
                              <button
                                onClick={() => handleCopyToken(t.code)}
                                className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
                                title="Salin Token"
                              >
                                {copiedToken === t.code ? (
                                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                                ) : (
                                  <Copy className="w-3.5 h-3.5" />
                                )}
                              </button>
                            </div>
                            <h4 className="text-xs font-bold text-slate-200 mt-1">{t.title}</h4>
                          </div>

                          <button
                            onClick={() => handleToggleToken(t.code)}
                            className={`text-xs px-3 py-1 rounded-full font-semibold border transition-colors cursor-pointer ${
                              t.isActive
                                ? 'bg-emerald-950/60 border-emerald-700 text-emerald-300'
                                : 'bg-slate-800 border-slate-700 text-slate-400'
                            }`}
                          >
                            {t.isActive ? 'Aktif' : 'Non-Aktif'}
                          </button>
                        </div>

                        <div className="mt-4 pt-3 border-t border-slate-800 grid grid-cols-3 gap-2 text-[11px] text-slate-400 font-mono">
                          <div>
                            <span>Kelas:</span>
                            <p className="text-white font-medium">{t.classTarget}</p>
                          </div>
                          <div>
                            <span>Durasi:</span>
                            <p className="text-white font-medium">{t.durationMinutes} Menit</p>
                          </div>
                          <div>
                            <span>Toleransi:</span>
                            <p className="text-white font-medium">{t.maxViolationsAllowed}x Langgar</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* SUB-TAB B: TOKEN AKSES GURU / ADMIN (SYSTEM-GENERATED) */}
            {tokenSubTab === 'teacher_tokens' && (
              <div className="space-y-6 animate-in fade-in">
                {/* Header & Main Actions */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                      <span>Token Akses Guru & Pengawas (Dibuatkan oleh Sistem)</span>
                      <span className="text-[10px] bg-purple-900/60 border border-purple-700 text-purple-300 font-mono px-2 py-0.5 rounded-full">
                        Admin Security
                      </span>
                    </h3>
                    <p className="text-xs text-slate-400">
                      Sesuai spesifikasi keamanan CBT, Panel Admin <strong>hanya bisa diakses oleh guru yang tokennya dibuatkan oleh sistem</strong>.
                    </p>
                  </div>

                  <button
                    onClick={() => setIsNewTeacherTokenModalOpen(true)}
                    className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-colors cursor-pointer shadow-lg shadow-purple-950/40"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>+ Generate Token Guru Baru (Sistem)</span>
                  </button>
                </div>

                {/* Security Guarantee Notice */}
                <div className="p-4 bg-purple-950/30 border border-purple-800/50 rounded-2xl flex items-start gap-3">
                  <ShieldCheck className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
                  <div className="text-xs text-slate-300 space-y-1">
                    <p className="font-semibold text-purple-300">
                      Proteksi Otoritas Guru SMKS Bina Karya 2 Karawang:
                    </p>
                    <p className="text-slate-400 leading-relaxed">
                      Siswa tidak dapat masuk atau memanipulasi nilai di Dashboard Guru tanpa memiliki Token Akses Guru resmi yang telah di-generate oleh sistem. Token dapat dinonaktifkan sewaktu-waktu oleh Guru Utama (Tarim, ST., MT.).
                    </p>
                  </div>
                </div>

                {/* Teacher Tokens List */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {teacherTokens.map((item) => (
                    <div
                      key={item.id}
                      className={`p-5 rounded-2xl border transition-all ${
                        item.isActive
                          ? 'bg-slate-900 border-purple-900/40 shadow-lg shadow-purple-950/20'
                          : 'bg-slate-950/60 border-slate-800 opacity-60'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-lg font-mono font-black text-amber-300 tracking-wider">
                              {item.tokenCode}
                            </span>
                            <button
                              onClick={() => handleCopyToken(item.tokenCode)}
                              className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
                              title="Salin Token Guru"
                            >
                              {copiedToken === item.tokenCode ? (
                                <Check className="w-3.5 h-3.5 text-emerald-400" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                            </button>
                          </div>
                          <h4 className="text-sm font-bold text-white mt-1">
                            {item.teacherName}
                          </h4>
                          {item.nipOrId && (
                            <p className="text-[11px] text-slate-400 font-mono">
                              NIP/ID: {item.nipOrId}
                            </p>
                          )}
                        </div>

                        <div className="flex flex-col items-end gap-2">
                          <span
                            className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border ${
                              item.role === 'super_admin'
                                ? 'bg-purple-950 border-purple-700 text-purple-300'
                                : item.role === 'pengawas'
                                ? 'bg-cyan-950 border-cyan-700 text-cyan-300'
                                : 'bg-blue-950 border-blue-700 text-blue-300'
                            }`}
                          >
                            {item.role.replace('_', ' ')}
                          </span>

                          <button
                            onClick={() => handleToggleTeacherToken(item.id)}
                            className={`text-[11px] px-2.5 py-1 rounded-lg font-semibold border transition-colors cursor-pointer ${
                              item.isActive
                                ? 'bg-emerald-950/60 border-emerald-700 text-emerald-300 hover:bg-emerald-900/60'
                                : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700'
                            }`}
                          >
                            {item.isActive ? 'Aktif' : 'Non-Aktif'}
                          </button>
                        </div>
                      </div>

                      <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                        <div>
                          <span>Dibuat: </span>
                          <span className="text-slate-300">
                            {new Date(item.generatedAt).toLocaleDateString('id-ID')}
                          </span>
                        </div>

                        {item.role !== 'super_admin' && (
                          <button
                            onClick={() => handleDeleteTeacherToken(item.id)}
                            className="text-red-400 hover:text-red-300 flex items-center gap-1 font-semibold cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Hapus</span>
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* MODAL: GENERATE TOKEN GURU BARU OLEH SISTEM */}
      {isNewTeacherTokenModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-purple-600/20 border border-purple-500/40 flex items-center justify-center text-purple-400">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Generate Token Guru (Sistem)</h3>
                  <p className="text-[11px] text-slate-400">Kode unik dibuat otomatis dengan formula kriptografis sistem</p>
                </div>
              </div>
              <button
                onClick={() => setIsNewTeacherTokenModalOpen(false)}
                className="p-1 rounded text-slate-400 hover:text-white"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleGenerateTeacherToken} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Nama Guru / Instruktur / Pengawas
                </label>
                <input
                  type="text"
                  required
                  value={newTeacherName}
                  onChange={(e) => setNewTeacherName(e.target.value)}
                  placeholder="Contoh: Tarim, ST., MT."
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  NIP / ID Guru (Opsional)
                </label>
                <input
                  type="text"
                  value={newTeacherNip}
                  onChange={(e) => setNewTeacherNip(e.target.value)}
                  placeholder="Contoh: 197805122008011005"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Hak Akses / Role
                </label>
                <select
                  value={newTeacherRole}
                  onChange={(e) => setNewTeacherRole(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-purple-500"
                >
                  <option value="guru_pengampu">Guru Pengampu (Akses Penuh PMKR)</option>
                  <option value="pengawas">Pengawas Ujian (Monitoring & Log Pelanggaran)</option>
                  <option value="super_admin">Super Admin (Akses Global)</option>
                </select>
              </div>

              <div className="p-3 bg-purple-950/40 border border-purple-900/50 rounded-xl text-[11px] text-purple-200">
                Sistem akan secara otomatis menyusun token unik dengan format:
                <div className="font-mono font-bold text-amber-300 mt-1">
                  {newTeacherRole === 'super_admin'
                    ? 'GURU-TARIM-XXXX-XXXX'
                    : newTeacherRole === 'pengawas'
                    ? 'PENGAWAS-BK2-XXXX-XXXX'
                    : 'GURU-BK2-XXXX-XXXX'}
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsNewTeacherTokenModalOpen(false)}
                  className="flex-1 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-bold transition-colors cursor-pointer shadow-md shadow-purple-950/50 flex items-center justify-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Generate Token Sistem</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 1: BATCH PASTE TOKEN SEKALIGUS (GOOGLE FORMS REGEX GENERATOR) */}
      {isBatchModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm animate-in fade-in overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-lg w-full shadow-2xl space-y-4 my-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-600/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                  <Copy className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Input / Paste Token Sekaligus</h3>
                  <p className="text-[11px] text-slate-400">Pola Regular Expression dibuat otomatis dari daftar yang ditempel</p>
                </div>
              </div>
              <button
                onClick={() => setIsBatchModalOpen(false)}
                className="p-1 rounded text-slate-400 hover:text-white"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleBatchSaveTokens} className="space-y-4 text-xs">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="font-semibold text-slate-300">
                    Tempelkan Daftar Token (Pisahkan dengan Enter / Baris Baru):
                  </label>
                  <span className="text-[11px] font-mono text-emerald-400 font-bold">
                    {batchPasteInput.split(/[\r\n,;|]+/).filter((s) => s.trim().length > 0).length} Token Terdeteksi
                  </span>
                </div>
                <textarea
                  rows={6}
                  required
                  value={batchPasteInput}
                  onChange={(e) => setBatchPasteInput(e.target.value.toUpperCase())}
                  placeholder={`EMS-2026-X431\nBINA-KARYA-02\nDIAGNOSIS-TKRO\nTKRO-FINAL-01`}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 font-mono text-xs text-amber-300 leading-relaxed uppercase focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  Tips: Anda dapat menyalin langsung satu kolom daftar token dari Excel, Google Sheets, atau catatan rapat.
                </p>
              </div>

              {/* Live RegEx Pattern Preview */}
              {batchPasteInput.trim().length > 0 && (
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                  <span className="text-slate-400 text-[11px]">Pola Kecocokan RegEx yang Dihasilkan:</span>
                  <p className="font-mono text-cyan-300 text-xs break-all">
                    {storageService.buildRegexFromRawTokens(
                      batchPasteInput.split(/[\r\n,;|]+/).filter((s) => s.trim().length > 0)
                    )}
                  </p>
                </div>
              )}

              {/* Custom Error Message Setting */}
              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  Teks Kesalahan Khusus (Google Forms Style):
                </label>
                <input
                  type="text"
                  required
                  value={batchCustomError}
                  onChange={(e) => setBatchCustomError(e.target.value)}
                  placeholder="Pastikan Token Anda Sudah Benar"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-blue-500"
                />
                <span className="text-[10px] text-slate-400 mt-0.5 block">
                  Teks ini muncul saat siswa mengetikkan token yang tidak cocok.
                </span>
              </div>

              {/* Class & Duration Configuration */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Target Kelas</label>
                  <select
                    value={batchTargetClass}
                    onChange={(e) => setBatchTargetClass(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-blue-500"
                  >
                    <option value="Semua Kelas XII TKR">Semua Kelas XII TKR</option>
                    {STUDENT_CLASSES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Durasi Ujian (Menit)</label>
                  <input
                    type="number"
                    min={15}
                    max={240}
                    value={batchDuration}
                    onChange={(e) => setBatchDuration(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white font-mono text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsBatchModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-colors cursor-pointer shadow-lg shadow-emerald-950/40"
                >
                  Terapkan Pola Token
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: BUAT TOKEN SATUAN */}
      {isTokenModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-white">Buat / Input Token Ujian Baru</h3>
            <form onSubmit={handleCreateToken} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Kode Token (Huruf Besar)</label>
                <input
                  type="text"
                  required
                  value={newTokenCode}
                  onChange={(e) => setNewTokenCode(e.target.value.toUpperCase())}
                  placeholder="Contoh: EMS-FINAL-2026"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white font-mono tracking-wider font-bold focus:outline-none focus:border-blue-500 uppercase"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Judul / Deskripsi Ujian</label>
                <input
                  type="text"
                  required
                  value={newTokenTitle}
                  onChange={(e) => setNewTokenTitle(e.target.value)}
                  placeholder="Contoh: Ujian Tengah Semester EMS"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Target Kelas</label>
                <select
                  value={newTokenClass}
                  onChange={(e) => setNewTokenClass(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="Semua Kelas XII TKR">Semua Kelas XII TKR</option>
                  {STUDENT_CLASSES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Durasi (Menit)</label>
                  <input
                    type="number"
                    min={15}
                    max={240}
                    value={newTokenDuration}
                    onChange={(e) => setNewTokenDuration(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Maks Pelanggaran</label>
                  <input
                    type="number"
                    min={1}
                    max={10}
                    value={newTokenMaxViolations}
                    onChange={(e) => setNewTokenMaxViolations(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsTokenModalOpen(false)}
                  className="flex-1 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold transition-colors cursor-pointer shadow-md shadow-blue-950/50"
                >
                  Simpan Token
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
