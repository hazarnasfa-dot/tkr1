export type QuestionType = 'single' | 'multiple' | 'matching' | 'short_answer' | 'essay';

export type DifficultyLevel = 'mudah' | 'sedang' | 'hots';

export interface QuestionOption {
  id: string; // 'A', 'B', 'C', 'D', 'E'
  text: string;
}

export interface MatchingPair {
  id: string;
  premise: string; // e.g. "Sensor CKP (Crankshaft Position)"
  target: string;  // e.g. "Mendeteksi sudut putaran poros engkol & posisi TMA silinder 1"
  correctMatch?: string;
}

export interface EssayRubricItem {
  criterion: string;
  maxPoints: number;
  description: string;
}

export interface Question {
  id: number;
  type: QuestionType;
  difficulty: DifficultyLevel;
  points: number;
  competency: string; // e.g. "Sensor EMS", "Aktuator EMS", "Trouble Diagnosis & DTC", "Scanner X-431 & Osiloskop"
  prompt: string;
  caseScenario?: string;
  mediaUrl?: string;
  mediaType?: 'image' | 'video' | 'scanner_telemetry' | 'waveform';
  mediaCaption?: string;
  options?: QuestionOption[]; // for single and multiple
  correctAnswers: string[]; // single: ['A'], multiple: ['A', 'C'], short_answer: ['MAF', 'Mass Air Flow Sensor']
  matchingPairs?: MatchingPair[]; // for matching
  explanation: string;
  rubric?: EssayRubricItem[]; // for essay / short answer
}

export interface StudentAnswer {
  questionId: number;
  type: QuestionType;
  answer: any; // string, string[], Record<string, string>, etc.
  isFlagged?: boolean;
  scoreEarned?: number;
  manualGraded?: boolean;
  teacherFeedback?: string;
}

export type ViolationType = 
  | 'tab_switch' 
  | 'exit_fullscreen' 
  | 'right_click' 
  | 'shortcut_blocked' 
  | 'window_blur' 
  | 'devtools_attempt';

export interface ViolationRecord {
  id: string;
  timestamp: number;
  type: ViolationType;
  description: string;
  severity: 'warning' | 'critical';
}

export interface StudentSession {
  nis: string;
  name: string;
  classGroup: string;
  tokenUsed: string;
  startTime: number;
  endTime?: number;
  durationMinutes: number;
  status: 'idle' | 'in_progress' | 'submitted' | 'disqualified';
  currentQuestionIndex: number;
  answers: Record<number, StudentAnswer>;
  violations: ViolationRecord[];
  totalScore: number;
  maxPossibleScore: number;
  autoScore: number;
  manualScore: number;
  gradedStatus: 'pending_review' | 'fully_graded';
  lastSavedAt?: number;
}

export interface ExamToken {
  id: string;
  code: string;
  title: string;
  classTarget: string;
  durationMinutes: number;
  maxViolationsAllowed: number;
  isActive: boolean;
  createdAt: string;
  expiresAt: string;
  createdBy: string;
}

export interface TokenValidationConfig {
  type: 'regex';
  rule: 'matches' | 'contains'; // Google Form: Kecocokan / Berisi
  pattern: string; // Pola Regular Expression
  customErrorMessage: string; // Teks kesalahan kustom: "Pastikan Token Anda Sudah Benar"
  caseSensitive: boolean;
  rawTokensList: string[]; // List of tokens pasted simultaneously by admin
  updatedAt: string;
}

export interface TeacherAdminToken {
  id: string;
  tokenCode: string; // Token akses sistem, misal: GURU-TARIM-8899 atau SYS-ADMIN-9421
  teacherName: string; // e.g. Tarim, ST., MT.
  nipOrId: string;
  role: 'super_admin' | 'guru_pengampu' | 'pengawas';
  isActive: boolean;
  generatedAt: string;
  expiresAt?: string;
  lastUsedAt?: string;
}

export interface TeacherSession {
  tokenCode: string;
  teacherName: string;
  role: string;
  loginTime: number;
}

export interface ExamConfig {
  schoolName: string;
  subject: string;
  competency: string;
  instructor: string;
  kkmScore: number;
  allowReviewAfterSubmit: boolean;
  maxViolationsAllowed: number;
}
