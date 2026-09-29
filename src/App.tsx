import React, { useState, useEffect } from 'react';
import { StudentSession, ExamToken, TeacherSession } from './types/cbt';
import { storageService } from './services/storageService';
import { StudentLogin } from './components/StudentLogin';
import { ExamScreen } from './components/ExamScreen';
import { StudentResultView } from './components/StudentResultView';
import { TeacherDashboard } from './components/TeacherDashboard';
import { QuestionBankEditor } from './components/QuestionBankEditor';
import { GasSetupModal } from './components/GasSetupModal';
import { TeacherLoginModal } from './components/TeacherLoginModal';

export default function App() {
  const [viewMode, setViewMode] = useState<'login' | 'exam' | 'result' | 'teacher_dashboard' | 'question_bank'>('login');
  const [activeSession, setActiveSession] = useState<StudentSession | null>(null);
  const [activeToken, setActiveToken] = useState<ExamToken | null>(null);
  const [teacherSession, setTeacherSession] = useState<TeacherSession | null>(() => storageService.getActiveTeacherSession());
  const [isTeacherLoginModalOpen, setIsTeacherLoginModalOpen] = useState(false);
  const [isGasModalOpen, setIsGasModalOpen] = useState(false);

  // Check if there is an in-progress session on boot
  useEffect(() => {
    const existing = storageService.getCurrentSession();
    if (existing && existing.status === 'in_progress') {
      const tokens = storageService.getTokens();
      const token = tokens.find((t) => t.code === existing.tokenUsed) || tokens[0];
      setActiveSession(existing);
      setActiveToken(token);
    }
  }, []);

  const handleStartExam = (session: StudentSession, token: ExamToken) => {
    setActiveSession(session);
    setActiveToken(token);
    setViewMode('exam');
  };

  const handleFinishExam = (finalSession: StudentSession) => {
    setActiveSession(finalSession);
    setViewMode('result');
  };

  const handleBackToLogin = () => {
    setViewMode('login');
  };

  const handleOpenTeacherPortal = () => {
    const active = storageService.getActiveTeacherSession();
    if (active) {
      setTeacherSession(active);
      setViewMode('teacher_dashboard');
    } else {
      setIsTeacherLoginModalOpen(true);
    }
  };

  const handleTeacherLoginSuccess = (session: TeacherSession) => {
    setTeacherSession(session);
    setIsTeacherLoginModalOpen(false);
    setViewMode('teacher_dashboard');
  };

  const handleLogoutTeacher = () => {
    storageService.logoutTeacher();
    setTeacherSession(null);
    setViewMode('login');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
      {/* 1. Student Login View */}
      {viewMode === 'login' && (
        <StudentLogin
          onStartExam={handleStartExam}
          onOpenTeacherPortal={handleOpenTeacherPortal}
        />
      )}

      {/* 2. Active Exam Screen (Strict Anti-Cheat Enforced) */}
      {viewMode === 'exam' && activeSession && activeToken && (
        <ExamScreen
          initialSession={activeSession}
          token={activeToken}
          onFinishExam={handleFinishExam}
          onExitToLogin={handleBackToLogin}
        />
      )}

      {/* 3. Student Result View */}
      {viewMode === 'result' && activeSession && (
        <StudentResultView
          session={activeSession}
          onBackToHome={handleBackToLogin}
        />
      )}

      {/* 4. Teacher / Admin Real-Time Dashboard (Protected by System-Generated Token) */}
      {viewMode === 'teacher_dashboard' && (
        teacherSession ? (
          <TeacherDashboard
            teacherSession={teacherSession}
            onLogoutTeacher={handleLogoutTeacher}
            onBackToStudentLogin={handleBackToLogin}
            onOpenQuestionBank={() => setViewMode('question_bank')}
            onOpenGasSetup={() => setIsGasModalOpen(true)}
          />
        ) : (
          <div className="min-h-screen flex items-center justify-center p-6 bg-slate-950">
            <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-6 text-center space-y-4">
              <h3 className="text-lg font-bold text-white">Akses Guru Diperlukan</h3>
              <p className="text-xs text-slate-400">
                Silakan lakukan autentikasi dengan Token Guru yang dibuatkan oleh sistem untuk mengakses panel ini.
              </p>
              <button
                onClick={() => setIsTeacherLoginModalOpen(true)}
                className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs"
              >
                Buka Login Guru
              </button>
            </div>
          </div>
        )
      )}

      {/* 5. Question Bank Editor (Insert Images, Videos, Diagrams) */}
      {viewMode === 'question_bank' && (
        <QuestionBankEditor
          onBack={() => setViewMode('teacher_dashboard')}
        />
      )}

      {/* Teacher Authentication Modal (Strict System-Generated Token Verification) */}
      <TeacherLoginModal
        isOpen={isTeacherLoginModalOpen}
        onClose={() => setIsTeacherLoginModalOpen(false)}
        onSuccessLogin={handleTeacherLoginSuccess}
      />

      {/* Google Apps Script Integration Modal */}
      <GasSetupModal
        isOpen={isGasModalOpen}
        onClose={() => setIsGasModalOpen(false)}
      />
    </div>
  );
}
