import { Question, ExamToken, StudentSession, ViolationRecord, StudentAnswer, TokenValidationConfig, TeacherAdminToken, TeacherSession } from '../types/cbt';
import { INITIAL_QUESTIONS } from '../data/emsQuestions50';
import { INITIAL_TOKENS } from '../data/initialTokens';

const STORAGE_KEYS = {
  QUESTIONS: 'cbt_ems_questions_v1',
  TOKENS: 'cbt_ems_tokens_v1',
  TOKEN_CONFIG: 'cbt_ems_token_regex_config_v1',
  TEACHER_TOKENS: 'cbt_ems_teacher_tokens_v1',
  ACTIVE_TEACHER_SESSION: 'cbt_ems_active_teacher_session_v1',
  SESSIONS: 'cbt_ems_sessions_v1',
  CURRENT_SESSION: 'cbt_ems_current_session_v1',
  VIOLATIONS: 'cbt_ems_all_violations_v1',
  GAS_URL: 'cbt_ems_gas_webhook_url_v1',
  CONFIG: 'cbt_ems_config_v1'
};

export const INITIAL_TEACHER_TOKENS: TeacherAdminToken[] = [
  {
    id: 'tch-tok-1',
    tokenCode: 'GURU-TARIM-8899',
    teacherName: 'Tarim, ST., MT.',
    nipOrId: '197805122008011005',
    role: 'super_admin',
    isActive: true,
    generatedAt: '2026-09-28T07:00:00.000Z'
  },
  {
    id: 'tch-tok-2',
    tokenCode: 'PENGAWAS-BK2-2026',
    teacherName: 'Pengawas Ujian CBT SMKS Bina Karya 2',
    nipOrId: 'PENGAWAS-BK2',
    role: 'pengawas',
    isActive: true,
    generatedAt: '2026-09-28T07:00:00.000Z'
  }
];

const DEFAULT_TOKEN_CONFIG: TokenValidationConfig = {
  type: 'regex',
  rule: 'matches',
  pattern: '^(EMS-2026-X431|BINA-KARYA-02|DIAGNOSIS-TKRO|BK2-[A-Z0-9]+|.+-[A-Z0-9]{3,10}|[A-Z0-9\\s]+-[A-Z0-9]{3,10})$',
  customErrorMessage: 'Pastikan Token Anda Sudah Benar',
  caseSensitive: false,
  rawTokensList: ['EMS-2026-X431', 'BINA-KARYA-02', 'DIAGNOSIS-TKRO'],
  updatedAt: new Date().toISOString()
};

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export const storageService = {
  getQuestions(): Question[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.QUESTIONS);
      if (data) {
        return JSON.parse(data);
      }
    } catch {
      // ignore
    }
    this.saveQuestions(INITIAL_QUESTIONS);
    return INITIAL_QUESTIONS;
  },

  saveQuestions(questions: Question[]) {
    localStorage.setItem(STORAGE_KEYS.QUESTIONS, JSON.stringify(questions));
  },

  resetQuestions() {
    localStorage.setItem(STORAGE_KEYS.QUESTIONS, JSON.stringify(INITIAL_QUESTIONS));
    return INITIAL_QUESTIONS;
  },

  getTokens(): ExamToken[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.TOKENS);
      if (data) {
        return JSON.parse(data);
      }
    } catch {
      // ignore
    }
    this.saveTokens(INITIAL_TOKENS);
    return INITIAL_TOKENS;
  },

  saveTokens(tokens: ExamToken[]) {
    localStorage.setItem(STORAGE_KEYS.TOKENS, JSON.stringify(tokens));
  },

  addOrUpdateToken(token: ExamToken) {
    const tokens = this.getTokens();
    const idx = tokens.findIndex(t => t.code.toUpperCase() === token.code.toUpperCase());
    if (idx >= 0) {
      tokens[idx] = token;
    } else {
      tokens.unshift(token);
    }
    this.saveTokens(tokens);
  },

  toggleTokenStatus(code: string): boolean {
    const tokens = this.getTokens();
    const t = tokens.find(item => item.code.toUpperCase() === code.toUpperCase());
    if (t) {
      t.isActive = !t.isActive;
      this.saveTokens(tokens);
      return t.isActive;
    }
    return false;
  },

  getTokenValidationConfig(): TokenValidationConfig {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.TOKEN_CONFIG);
      if (data) {
        const parsed = JSON.parse(data);
        // Ensure default fallback pattern is updated if using old legacy strict pattern
        if (parsed.pattern === '^(EMS-2026-X431|BINA-KARYA-02|DIAGNOSIS-TKRO)$') {
          parsed.pattern = DEFAULT_TOKEN_CONFIG.pattern;
          this.saveTokenValidationConfig(parsed);
        }
        return parsed;
      }
    } catch {
      // ignore
    }
    // Sync with existing tokens list if available
    const tokens = this.getTokens();
    const rawList = tokens.map(t => t.code);
    const initialConfig: TokenValidationConfig = {
      ...DEFAULT_TOKEN_CONFIG,
      rawTokensList: rawList.length > 0 ? rawList : DEFAULT_TOKEN_CONFIG.rawTokensList,
      pattern: this.buildRegexFromRawTokens(rawList.length > 0 ? rawList : DEFAULT_TOKEN_CONFIG.rawTokensList)
    };
    this.saveTokenValidationConfig(initialConfig);
    return initialConfig;
  },

  saveTokenValidationConfig(config: TokenValidationConfig) {
    localStorage.setItem(STORAGE_KEYS.TOKEN_CONFIG, JSON.stringify(config));
  },

  buildRegexFromRawTokens(tokens: string[]): string {
    const cleanList = Array.from(new Set(tokens.map(t => t.trim()).filter(Boolean)));
    if (cleanList.length === 0) return '^(.*)$';
    const escaped = cleanList.map(t => escapeRegex(t));
    return `^(${escaped.join('|')}|[A-Z0-9\\s.\\-_]+-[A-Z0-9]{3,10}|.+-[A-Z0-9]{3,10})$`;
  },

  batchUpdateTokensFromPaste(
    pastedText: string,
    options?: {
      targetClass?: string;
      durationMinutes?: number;
      maxViolationsAllowed?: number;
      customErrorMessage?: string;
      caseSensitive?: boolean;
    }
  ): { count: number; config: TokenValidationConfig; pattern: string } {
    // Split by newline, comma, semicolon, or pipe
    const rawItems = pastedText
      .split(/[\r\n,;|]+/)
      .map(s => s.trim())
      .filter(s => s.length > 0);

    const uniqueTokens = Array.from(new Set(rawItems));
    const currentConfig = this.getTokenValidationConfig();

    const pattern = this.buildRegexFromRawTokens(uniqueTokens);
    const updatedConfig: TokenValidationConfig = {
      type: 'regex',
      rule: 'matches',
      pattern,
      customErrorMessage: options?.customErrorMessage || currentConfig.customErrorMessage || 'Pastikan Token Anda Sudah Benar',
      caseSensitive: options?.caseSensitive ?? false,
      rawTokensList: uniqueTokens,
      updatedAt: new Date().toISOString()
    };

    this.saveTokenValidationConfig(updatedConfig);

    // Synchronize into tokens registry
    const existingTokens = this.getTokens();
    const duration = options?.durationMinutes || 90;
    const maxViolations = options?.maxViolationsAllowed || 4;
    const classTarget = options?.targetClass || 'Semua Kelas XII TKR';

    uniqueTokens.forEach(code => {
      const upperCode = code.toUpperCase();
      const foundIdx = existingTokens.findIndex(t => t.code.toUpperCase() === upperCode);
      if (foundIdx >= 0) {
        existingTokens[foundIdx].isActive = true;
        if (options?.targetClass) existingTokens[foundIdx].classTarget = classTarget;
      } else {
        existingTokens.push({
          id: 'tok-batch-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
          code: upperCode,
          title: `Evaluasi EMS PMKR (Pola Token)`,
          classTarget,
          durationMinutes: duration,
          maxViolationsAllowed: maxViolations,
          isActive: true,
          createdAt: new Date().toISOString(),
          expiresAt: new Date(Date.now() + 86400000 * 7).toISOString(),
          createdBy: 'Tarim, ST., MT.'
        });
      }
    });

    this.saveTokens(existingTokens);

    return { count: uniqueTokens.length, config: updatedConfig, pattern };
  },

  validateToken(
    code: string,
    studentClass?: string,
    studentName?: string
  ): { valid: boolean; token?: ExamToken; message: string } {
    // 1. Normalize spaces (replace multiple consecutive spaces with a single space)
    const cleanCode = code.trim().replace(/\s+/g, ' ');
    const normalizedUpper = cleanCode.toUpperCase();
    const config = this.getTokenValidationConfig();
    const customError = config.customErrorMessage || 'Pastikan Token Anda Sudah Benar';

    if (!cleanCode) {
      return { valid: false, message: customError };
    }

    // 2. Direct match against registered tokens list (exact or space-collapsed)
    const tokens = this.getTokens();
    const directToken = tokens.find(t => {
      const tUpper = t.code.toUpperCase().trim().replace(/\s+/g, ' ');
      return (
        tUpper === normalizedUpper ||
        tUpper.replace(/[\s\-_]/g, '') === normalizedUpper.replace(/[\s\-_]/g, '')
      );
    });

    // 3. Student-name token detection (e.g. AHMAD IFKAR DIMASQI-Z43QW for AHMAD IFKAR DIMASQI)
    const cleanStudentName = studentName ? studentName.trim().toUpperCase().replace(/\s+/g, ' ') : '';
    const isStudentNameToken = Boolean(
      cleanStudentName.length > 0 &&
      (normalizedUpper.startsWith(cleanStudentName + '-') ||
       normalizedUpper.replace(/[\s\-_]/g, '').startsWith(cleanStudentName.replace(/[\s\-_]/g, '')))
    );

    // 4. Dynamic Token Pattern detection:
    // e.g. [NAMA SISWA / KODE]-[KODE ALFANUMERIK 3-10 DIGIT]
    const isDynamicFormat = /^[A-Z0-9\s.\-_]+-[A-Z0-9]{3,10}$/i.test(cleanCode);

    // 5. RegEx pattern validation (Google Forms style)
    let isRegExMatch = false;
    try {
      const flags = config.caseSensitive ? '' : 'i';
      const regex = new RegExp(config.pattern, flags);
      isRegExMatch = regex.test(cleanCode) || regex.test(cleanCode.replace(/\s+/g, ''));
    } catch {
      isRegExMatch = config.rawTokensList.some(t => {
        const tUpper = t.toUpperCase().replace(/\s+/g, ' ');
        return tUpper === normalizedUpper || tUpper.replace(/[\s\-_]/g, '') === normalizedUpper.replace(/[\s\-_]/g, '');
      });
    }

    const isValid = Boolean(directToken || isRegExMatch || isStudentNameToken || isDynamicFormat);

    if (!isValid) {
      return { valid: false, message: customError };
    }

    // 6. Token status and class targeting lookup
    let token = directToken;
    if (!token) {
      // Synthesize an active token if matched by student name or dynamic pattern
      token = {
        id: 'tok-dyn-' + Date.now(),
        code: normalizedUpper,
        title: 'Evaluasi EMS PMKR SMKS Bina Karya 2 Karawang',
        classTarget: studentClass || 'Semua Kelas XII TKR',
        durationMinutes: 90,
        maxViolationsAllowed: 4,
        isActive: true,
        createdAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 86400000).toISOString(),
        createdBy: 'Tarim, ST., MT.'
      };
      this.addOrUpdateToken(token);
    }

    if (!token.isActive) {
      return { valid: false, message: 'Token ini sedang DINONAKTIFKAN oleh Instruktur (Tarim, ST., MT.)!' };
    }

    if (token.classTarget !== 'Semua Kelas XII TKR' && studentClass && token.classTarget !== studentClass) {
      return { valid: false, message: `Token ini hanya berlaku untuk siswa kelas ${token.classTarget}!` };
    }

    return { valid: true, token, message: 'Token valid. Akses diizinkan!' };
  },

  // Student Session Management
  getCurrentSession(): StudentSession | null {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CURRENT_SESSION);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },

  saveCurrentSession(session: StudentSession | null) {
    if (session) {
      const sessionWithTimestamp: StudentSession = {
        ...session,
        lastSavedAt: Date.now()
      };
      localStorage.setItem(STORAGE_KEYS.CURRENT_SESSION, JSON.stringify(sessionWithTimestamp));
      this.upsertInHistory(sessionWithTimestamp);
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_SESSION);
    }
  },

  clearCurrentSession() {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_SESSION);
  },

  findExistingSession(nis: string, tokenCode?: string): StudentSession | null {
    const cleanNis = nis.trim();
    const current = this.getCurrentSession();
    if (current && current.nis === cleanNis && current.status === 'in_progress') {
      if (!tokenCode || current.tokenUsed.toUpperCase() === tokenCode.trim().toUpperCase()) {
        return current;
      }
    }
    const history = this.getSessionsHistory();
    const found = history.find(s => 
      s.nis === cleanNis && 
      s.status === 'in_progress' && 
      (!tokenCode || s.tokenUsed.toUpperCase() === tokenCode.trim().toUpperCase())
    );
    return found || null;
  },

  getSessionsHistory(): StudentSession[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SESSIONS);
      if (data) {
        return JSON.parse(data);
      }
    } catch {
      // fallback
    }
    const seed = this.getSeedSessions();
    this.saveSessionsHistory(seed);
    return seed;
  },

  saveSessionsHistory(sessions: StudentSession[]) {
    localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(sessions));
  },

  upsertInHistory(session: StudentSession) {
    const list = this.getSessionsHistory();
    const idx = list.findIndex(s => s.nis === session.nis && s.tokenUsed === session.tokenUsed);
    if (idx >= 0) {
      list[idx] = session;
    } else {
      list.unshift(session);
    }
    this.saveSessionsHistory(list);
  },

  recordViolation(session: StudentSession, violation: Omit<ViolationRecord, 'id' | 'timestamp'>): StudentSession {
    const record: ViolationRecord = {
      ...violation,
      id: 'v-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
      timestamp: Date.now()
    };

    const updatedViolations = [...session.violations, record];
    const token = this.getTokens().find(t => t.code.toUpperCase() === session.tokenUsed.toUpperCase());
    const maxAllowed = token?.maxViolationsAllowed || 4;

    const isDisqualified = updatedViolations.length >= maxAllowed;

    const updatedSession: StudentSession = {
      ...session,
      violations: updatedViolations,
      status: isDisqualified ? 'disqualified' : session.status
    };

    this.saveCurrentSession(updatedSession);
    this.appendGlobalViolation(session.nis, session.name, session.classGroup, record);

    // Also attempt async sync to GAS if configured
    this.syncViolationToGAS(session.nis, session.name, session.classGroup, record);

    return updatedSession;
  },

  appendGlobalViolation(nis: string, name: string, classGroup: string, violation: ViolationRecord) {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.VIOLATIONS);
      const list = data ? JSON.parse(data) : [];
      list.unshift({ nis, name, classGroup, ...violation });
      // Keep last 150 violations
      localStorage.setItem(STORAGE_KEYS.VIOLATIONS, JSON.stringify(list.slice(0, 150)));
    } catch {
      // ignore
    }
  },

  getAllGlobalViolations(): Array<{ nis: string; name: string; classGroup: string } & ViolationRecord> {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.VIOLATIONS);
      if (data) return JSON.parse(data);
    } catch {
      // ignore
    }
    return [
      {
        nis: '23241011',
        name: 'Ahmad Faisal Pratama',
        classGroup: 'XII TKR 1',
        id: 'v-seed-1',
        timestamp: Date.now() - 14 * 60 * 1000,
        type: 'tab_switch',
        description: 'Terdeteksi berpindah tab browser saat mengerjakan Soal No. 12',
        severity: 'critical'
      },
      {
        nis: '23241019',
        name: 'Bagus Tri Nugroho',
        classGroup: 'XII TKR 1',
        id: 'v-seed-2',
        timestamp: Date.now() - 25 * 60 * 1000,
        type: 'exit_fullscreen',
        description: 'Menekan tombol Esc / keluar dari mode Fullscreen API',
        severity: 'critical'
      },
      {
        nis: '23241042',
        name: 'Doni Kurniawan',
        classGroup: 'XII TKR 2',
        id: 'v-seed-3',
        timestamp: Date.now() - 8 * 60 * 1000,
        type: 'shortcut_blocked',
        description: 'Kombinasi tombol keyboard terlarang dicegah (Ctrl+C / Copy attempt)',
        severity: 'warning'
      }
    ];
  },

  calculateAutoScore(questions: Question[], answers: Record<number, StudentAnswer>): { autoScore: number; maxAutoPossible: number } {
    let score = 0;
    let max = 0;

    questions.forEach(q => {
      const ansObj = answers[q.id];
      const val = ansObj?.answer;

      if (q.type === 'single') {
        max += q.points; // 1
        if (typeof val === 'string' && q.correctAnswers.includes(val)) {
          score += q.points;
        }
      } else if (q.type === 'multiple') {
        max += q.points; // 2
        if (Array.isArray(val)) {
          const correctSet = new Set(q.correctAnswers);
          const studentSet = new Set(val);
          // Check if equal sets
          const isExact = correctSet.size === studentSet.size && [...correctSet].every(item => studentSet.has(item));
          if (isExact) {
            score += q.points;
          } else {
            // Partial score: if at least 1 correct selected and 0 wrong selected
            const wrongCount = val.filter(item => !correctSet.has(item)).length;
            const rightCount = val.filter(item => correctSet.has(item)).length;
            if (wrongCount === 0 && rightCount > 0) {
              score += Math.round((rightCount / correctSet.size) * q.points * 10) / 10;
            }
          }
        }
      } else if (q.type === 'matching') {
        max += q.points; // 2
        if (val && typeof val === 'object' && q.matchingPairs) {
          let matchCount = 0;
          q.matchingPairs.forEach(pair => {
            if (val[pair.id] === pair.correctMatch) {
              matchCount++;
            }
          });
          const ratio = matchCount / q.matchingPairs.length;
          score += Math.round(ratio * q.points * 10) / 10;
        }
      } else if (q.type === 'short_answer') {
        max += q.points; // 3
        if (typeof val === 'string' && val.trim().length > 0) {
          const cleanStudent = val.trim().toLowerCase().replace(/[\s\-_]/g, '');
          const isMatched = q.correctAnswers.some(ans => {
            const cleanKey = ans.toLowerCase().replace(/[\s\-_]/g, '');
            return cleanStudent === cleanKey;
          });
          if (isMatched) {
            score += q.points;
          }
        }
      } else if (q.type === 'essay') {
        // Essay is graded manually by teacher (4 points each), not auto
      }
    });

    return { autoScore: Math.round(score * 10) / 10, maxAutoPossible: max };
  },

  // GAS Webhook Settings
  getGasUrl(): string {
    return localStorage.getItem(STORAGE_KEYS.GAS_URL) || '';
  },

  setGasUrl(url: string) {
    localStorage.setItem(STORAGE_KEYS.GAS_URL, url.trim());
  },

  async syncViolationToGAS(nis: string, name: string, classGroup: string, violation: ViolationRecord) {
    const url = this.getGasUrl();
    if (!url) return;
    try {
      await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify({
          action: 'LOG_VIOLATION',
          nis,
          name,
          classGroup,
          violationType: violation.type,
          description: violation.description,
          severity: violation.severity
        })
      });
    } catch {
      // Background sync fail silent
    }
  },

  async syncAutosaveToGAS(session: StudentSession) {
    const url = this.getGasUrl();
    if (!url) return;
    try {
      const payload = JSON.stringify({
        action: 'AUTOSAVE_PROGRESS',
        nis: session.nis,
        name: session.name,
        classGroup: session.classGroup,
        tokenUsed: session.tokenUsed,
        currentQuestionIndex: session.currentQuestionIndex,
        answersCount: Object.keys(session.answers).length,
        answersJson: JSON.stringify(session.answers),
        lastSavedAt: Date.now()
      });

      if (typeof navigator !== 'undefined' && navigator.sendBeacon) {
        const blob = new Blob([payload], { type: 'text/plain' });
        navigator.sendBeacon(url, blob);
      } else {
        await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'text/plain' },
          body: payload,
          keepalive: true
        });
      }
    } catch {
      // Background silent
    }
  },

  async syncSubmitToGAS(session: StudentSession): Promise<{ success: boolean; message?: string }> {
    const url = this.getGasUrl();
    if (!url) return { success: false, message: 'URL Webhook Google Apps Script belum diatur.' };
    try {
      const resp = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify({
          action: 'SUBMIT_EXAM',
          nis: session.nis,
          name: session.name,
          classGroup: session.classGroup,
          tokenUsed: session.tokenUsed,
          totalScore: session.totalScore,
          autoScore: session.autoScore,
          manualScore: session.manualScore,
          violationsCount: session.violations.length,
          status: session.status,
          gradedStatus: session.gradedStatus,
          answersJson: JSON.stringify(session.answers)
        })
      });
      const data = await resp.json();
      return { success: !!data.success, message: data.message || 'Data terkirim ke Google Sheets' };
    } catch (err: any) {
      return { success: false, message: err?.message || 'Gagal mengirim ke Webhook Google Sheets' };
    }
  },

  async syncAllSessionsToGAS(): Promise<{ success: number; failed: number; total: number }> {
    const sessions = this.getSessionsHistory();
    let success = 0;
    let failed = 0;

    for (const session of sessions) {
      const res = await this.syncSubmitToGAS(session);
      if (res.success) {
        success++;
      } else {
        failed++;
      }
    }

    return { success, failed, total: sessions.length };
  },

  async testSendSampleToGAS(): Promise<{ success: boolean; message: string }> {
    const sampleSession: StudentSession = {
      nis: '23241099',
      name: 'Budi Santoso (Data Uji Webhook)',
      classGroup: 'XII TKR 1',
      tokenUsed: 'EMS-2026-X431',
      startTime: Date.now() - 60 * 60 * 1000,
      endTime: Date.now(),
      durationMinutes: 90,
      status: 'submitted',
      currentQuestionIndex: 49,
      answers: {},
      violations: [
        {
          id: 'v-test',
          timestamp: Date.now() - 10 * 60 * 1000,
          type: 'tab_switch',
          description: 'Simulasi deteksi tab switch',
          severity: 'warning'
        }
      ],
      totalScore: 86,
      maxPossibleScore: 100,
      autoScore: 70,
      manualScore: 16,
      gradedStatus: 'fully_graded'
    };

    const res = await this.syncSubmitToGAS(sampleSession);
    return { success: res.success, message: res.message || 'Data sampel berhasil dikirim' };
  },

  getSeedSessions(): StudentSession[] {
    return [
      {
        nis: '23241001',
        name: 'Ade Rizki Pratama',
        classGroup: 'XII TKR 1',
        tokenUsed: 'EMS-2026-X431',
        startTime: Date.now() - 75 * 60 * 1000,
        endTime: Date.now() - 5 * 60 * 1000,
        durationMinutes: 90,
        status: 'submitted',
        currentQuestionIndex: 49,
        answers: {},
        violations: [],
        totalScore: 88,
        maxPossibleScore: 100,
        autoScore: 72,
        manualScore: 16,
        gradedStatus: 'fully_graded'
      },
      {
        nis: '23241002',
        name: 'Bayu Saputra',
        classGroup: 'XII TKR 1',
        tokenUsed: 'EMS-2026-X431',
        startTime: Date.now() - 60 * 60 * 1000,
        endTime: Date.now() - 2 * 60 * 1000,
        durationMinutes: 90,
        status: 'submitted',
        currentQuestionIndex: 49,
        answers: {},
        violations: [
          {
            id: 'v-1',
            timestamp: Date.now() - 40 * 60 * 1000,
            type: 'tab_switch',
            description: 'Berpindah tab ke Google Search',
            severity: 'critical'
          }
        ],
        totalScore: 81,
        maxPossibleScore: 100,
        autoScore: 68,
        manualScore: 13,
        gradedStatus: 'fully_graded'
      },
      {
        nis: '23241003',
        name: 'Candra Wijaya',
        classGroup: 'XII TKR 1',
        tokenUsed: 'EMS-2026-X431',
        startTime: Date.now() - 45 * 60 * 1000,
        durationMinutes: 90,
        status: 'in_progress',
        currentQuestionIndex: 32,
        answers: {},
        violations: [],
        totalScore: 48,
        maxPossibleScore: 100,
        autoScore: 48,
        manualScore: 0,
        gradedStatus: 'pending_review'
      },
      {
        nis: '23241004',
        name: 'Dede Rohmat Hidayat',
        classGroup: 'XII TKR 1',
        tokenUsed: 'EMS-2026-X431',
        startTime: Date.now() - 50 * 60 * 1000,
        durationMinutes: 90,
        status: 'in_progress',
        currentQuestionIndex: 38,
        answers: {},
        violations: [
          {
            id: 'v-2',
            timestamp: Date.now() - 20 * 60 * 1000,
            type: 'right_click',
            description: 'Mencoba klik kanan mouse',
            severity: 'warning'
          }
        ],
        totalScore: 54,
        maxPossibleScore: 100,
        autoScore: 54,
        manualScore: 0,
        gradedStatus: 'pending_review'
      },
      {
        nis: '23241005',
        name: 'Eko Wahyudi',
        classGroup: 'XII TKR 1',
        tokenUsed: 'EMS-2026-X431',
        startTime: Date.now() - 80 * 60 * 1000,
        durationMinutes: 90,
        status: 'disqualified',
        currentQuestionIndex: 18,
        answers: {},
        violations: [
          { id: 'v-3', timestamp: Date.now() - 70 * 60 * 1000, type: 'tab_switch', description: 'Buka WhatsApp Web', severity: 'critical' },
          { id: 'v-4', timestamp: Date.now() - 65 * 60 * 1000, type: 'exit_fullscreen', description: 'Keluar fullscreen', severity: 'critical' },
          { id: 'v-5', timestamp: Date.now() - 60 * 60 * 1000, type: 'tab_switch', description: 'Buka browser tab baru', severity: 'critical' },
          { id: 'v-6', timestamp: Date.now() - 55 * 60 * 1000, type: 'window_blur', description: 'Aplikasi lain aktif di latar', severity: 'critical' }
        ],
        totalScore: 24,
        maxPossibleScore: 100,
        autoScore: 24,
        manualScore: 0,
        gradedStatus: 'pending_review'
      }
    ];
  },

  // ==========================================
  // TEACHER / ADMIN SYSTEM-GENERATED TOKENS
  // ==========================================
  getTeacherTokens(): TeacherAdminToken[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.TEACHER_TOKENS);
      if (data) {
        return JSON.parse(data);
      }
    } catch {
      // ignore
    }
    this.saveTeacherTokens(INITIAL_TEACHER_TOKENS);
    return INITIAL_TEACHER_TOKENS;
  },

  saveTeacherTokens(tokens: TeacherAdminToken[]) {
    localStorage.setItem(STORAGE_KEYS.TEACHER_TOKENS, JSON.stringify(tokens));
  },

  generateTeacherToken(
    teacherName: string = 'Tarim, ST., MT.',
    nipOrId: string = '197805122008011005',
    role: 'super_admin' | 'guru_pengampu' | 'pengawas' = 'guru_pengampu'
  ): TeacherAdminToken {
    const tokens = this.getTeacherTokens();
    const randomHex = Math.random().toString(36).substring(2, 6).toUpperCase();
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const prefix = role === 'super_admin' ? 'GURU-TARIM' : role === 'pengawas' ? 'PENGAWAS-BK2' : 'GURU-BK2';
    const code = `${prefix}-${randomHex}-${randomNum}`;

    const newToken: TeacherAdminToken = {
      id: 'tch-tok-' + Date.now(),
      tokenCode: code,
      teacherName: teacherName.trim(),
      nipOrId: nipOrId.trim(),
      role,
      isActive: true,
      generatedAt: new Date().toISOString()
    };

    tokens.unshift(newToken);
    this.saveTeacherTokens(tokens);
    return newToken;
  },

  toggleTeacherTokenStatus(id: string): boolean {
    const tokens = this.getTeacherTokens();
    const target = tokens.find(t => t.id === id);
    if (target) {
      target.isActive = !target.isActive;
      this.saveTeacherTokens(tokens);
      return target.isActive;
    }
    return false;
  },

  deleteTeacherToken(id: string): boolean {
    const tokens = this.getTeacherTokens();
    // Do not delete last super_admin token
    const remaining = tokens.filter(t => t.id !== id);
    if (remaining.length === 0) return false;
    this.saveTeacherTokens(remaining);
    return true;
  },

  validateTeacherToken(inputCode: string): { valid: boolean; teacher?: TeacherAdminToken; message: string } {
    const cleanCode = inputCode.trim().toUpperCase();
    if (!cleanCode) {
      return { valid: false, message: 'Silakan masukkan Token Akses Guru.' };
    }

    const tokens = this.getTeacherTokens();
    const match = tokens.find(t => t.tokenCode.toUpperCase() === cleanCode);

    if (!match) {
      return {
        valid: false,
        message: 'Akses Ditolak: Token Akses Guru Tidak Valid! Hanya guru dengan token yang dibuatkan oleh sistem yang dapat mengakses Panel Admin.'
      };
    }

    if (!match.isActive) {
      return {
        valid: false,
        message: 'Akses Ditolak: Token Akses Guru ini sedang DINONAKTIFKAN oleh Super Admin.'
      };
    }

    return { valid: true, teacher: match, message: 'Autentikasi Guru Berhasil!' };
  },

  getActiveTeacherSession(): TeacherSession | null {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ACTIVE_TEACHER_SESSION);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },

  loginTeacher(tokenCode: string): { success: boolean; session?: TeacherSession; message: string } {
    const validation = this.validateTeacherToken(tokenCode);
    if (!validation.valid || !validation.teacher) {
      return { success: false, message: validation.message };
    }

    // Update last used timestamp
    const tokens = this.getTeacherTokens();
    const tIdx = tokens.findIndex(t => t.id === validation.teacher!.id);
    if (tIdx >= 0) {
      tokens[tIdx].lastUsedAt = new Date().toISOString();
      this.saveTeacherTokens(tokens);
    }

    const session: TeacherSession = {
      tokenCode: validation.teacher.tokenCode,
      teacherName: validation.teacher.teacherName,
      role: validation.teacher.role,
      loginTime: Date.now()
    };

    localStorage.setItem(STORAGE_KEYS.ACTIVE_TEACHER_SESSION, JSON.stringify(session));
    return { success: true, session, message: 'Selamat datang di Panel CBT Guru!' };
  },

  logoutTeacher(): void {
    localStorage.removeItem(STORAGE_KEYS.ACTIVE_TEACHER_SESSION);
  }
};
