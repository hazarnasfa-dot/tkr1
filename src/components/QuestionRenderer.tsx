import React from 'react';
import { Question, StudentAnswer } from '../types/cbt';
import { CheckSquare, Square, FileText, CheckCircle2, HelpCircle } from 'lucide-react';
import { DiagnosticDisplay } from './DiagnosticDisplay';

interface QuestionRendererProps {
  question: Question;
  studentAnswer: StudentAnswer | undefined;
  onAnswerChange: (answer: any) => void;
  isReviewMode?: boolean;
}

export const QuestionRenderer: React.FC<QuestionRendererProps> = ({
  question,
  studentAnswer,
  onAnswerChange,
  isReviewMode = false,
}) => {
  const currentAnswer = studentAnswer?.answer;

  // Single Choice
  const handleSingleSelect = (optionId: string) => {
    if (isReviewMode) return;
    onAnswerChange(optionId);
  };

  // Multiple Choice (Array of selected option IDs)
  const handleMultipleSelect = (optionId: string) => {
    if (isReviewMode) return;
    const currentList: string[] = Array.isArray(currentAnswer) ? [...currentAnswer] : [];
    const index = currentList.indexOf(optionId);
    if (index >= 0) {
      currentList.splice(index, 1);
    } else {
      currentList.push(optionId);
    }
    onAnswerChange(currentList);
  };

  // Matching pair
  const handleMatchingChange = (premiseId: string, matchedTarget: string) => {
    if (isReviewMode) return;
    const currentMap: Record<string, string> =
      currentAnswer && typeof currentAnswer === 'object' ? { ...currentAnswer } : {};
    currentMap[premiseId] = matchedTarget;
    onAnswerChange(currentMap);
  };

  // Short Answer
  const handleShortAnswerChange = (val: string) => {
    if (isReviewMode) return;
    onAnswerChange(val);
  };

  // Essay
  const handleEssayChange = (val: string) => {
    if (isReviewMode) return;
    onAnswerChange(val);
  };

  return (
    <div className="space-y-6">
      {/* Question Header & Meta */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2 text-xs">
          <span className="font-semibold text-blue-400 uppercase tracking-wider">
            {question.competency}
          </span>
          <span className="text-slate-600">·</span>
          <span className="text-slate-400 capitalize">Tingkat: {question.difficulty}</span>
          <span className="text-slate-600">·</span>
          <span className="text-amber-400 font-mono font-medium">Bobot: {question.points} Poin</span>
        </div>

        {question.type === 'multiple' && (
          <span className="text-xs text-amber-300 font-medium bg-amber-950/40 border border-amber-800/60 px-2.5 py-0.5 rounded-full">
            Pilihan Ganda Kompleks (Pilih lebih dari 1 jawaban benar)
          </span>
        )}
        {question.type === 'matching' && (
          <span className="text-xs text-cyan-300 font-medium bg-cyan-950/40 border border-cyan-800/60 px-2.5 py-0.5 rounded-full">
            Soal Menjodohkan (Pasangkan pernyataan di kiri dengan target di kanan)
          </span>
        )}
      </div>

      {/* Question Prompt */}
      <div className="text-slate-100 text-base md:text-lg leading-relaxed whitespace-pre-line font-medium">
        {question.prompt}
      </div>

      {/* Embedded Diagnostic Simulation or Media */}
      {(question.id === 9 || question.id === 11 || question.id === 13 || question.id === 25 || question.id === 46 || question.id === 48) && (
        <DiagnosticDisplay
          scannerData={[
            { parameter: 'ENGINE SPEED (RPM)', value: '750', unit: 'RPM', normal: '700 - 800' },
            { parameter: 'COOLANT TEMP (ECT)', value: '88.5', unit: '°C', normal: '80.0 - 95.0' },
            { parameter: 'SHORT TERM FUEL TRIM', value: question.id === 25 || question.id === 48 ? '-22.0' : '+1.5', unit: '%', normal: '-5.0 ~ +5.0' },
            { parameter: 'LONG TERM FUEL TRIM', value: question.id === 25 || question.id === 48 ? '-18.0' : '+2.3', unit: '%', normal: '-5.0 ~ +5.0' },
            { parameter: 'O2 SENSOR B1S1', value: question.id === 48 ? '0.92' : '0.12 ~ 0.85', unit: 'V', normal: '0.1 - 0.9 V' },
            { parameter: 'INJECTION DURATION', value: '2.45', unit: 'ms', normal: '2.0 - 3.2 ms' }
          ]}
          dtcList={
            question.id === 13 ? [{ code: 'P0171', status: 'ACTIVE', description: 'System Too Lean - Bank 1' }] :
            question.id === 46 ? [{ code: 'P0300', status: 'ACTIVE', description: 'Random/Multiple Misfire' }] :
            [{ code: 'P0171', status: 'CONFIRMED', description: 'System Too Lean' }]
          }
        />
      )}

      {/* Attached Media Image if present */}
      {question.mediaUrl && (
        <div className="my-4 rounded-xl overflow-hidden border border-slate-800 bg-slate-900">
          <img
            src={question.mediaUrl}
            alt={question.mediaCaption || 'Diagram Teknis Soal EMS'}
            className="w-full max-h-80 object-contain mx-auto bg-slate-950"
            referrerPolicy="no-referrer"
          />
          {question.mediaCaption && (
            <p className="p-2.5 text-xs text-center text-slate-400 italic border-t border-slate-800">
              {question.mediaCaption}
            </p>
          )}
        </div>
      )}

      {/* Render Answer Section by Question Type */}
      
      {/* 1. Single Choice */}
      {question.type === 'single' && question.options && (
        <div className="space-y-3 pt-2">
          {question.options.map((opt) => {
            const isSelected = currentAnswer === opt.id;
            return (
              <label
                key={opt.id}
                onClick={() => handleSingleSelect(opt.id)}
                className={`flex items-start gap-3.5 p-4 rounded-xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-blue-600/15 border-blue-500 text-white shadow-md shadow-blue-950/40'
                    : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:bg-slate-800/60 hover:border-slate-700'
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 border text-xs font-bold transition-colors ${
                    isSelected
                      ? 'bg-blue-600 border-blue-500 text-white'
                      : 'border-slate-600 text-slate-400 bg-slate-800'
                  }`}
                >
                  {opt.id}
                </div>
                <div className="text-sm md:text-base pt-0.5 leading-relaxed">{opt.text}</div>
              </label>
            );
          })}
        </div>
      )}

      {/* 2. Multiple Choice (Complex) */}
      {question.type === 'multiple' && question.options && (
        <div className="space-y-3 pt-2">
          <div className="text-xs text-slate-400 mb-1">
            Terpilih:{' '}
            <span className="font-semibold text-blue-400">
              {Array.isArray(currentAnswer) ? currentAnswer.length : 0} jawaban
            </span>
          </div>
          {question.options.map((opt) => {
            const isSelected = Array.isArray(currentAnswer) && currentAnswer.includes(opt.id);
            return (
              <label
                key={opt.id}
                onClick={() => handleMultipleSelect(opt.id)}
                className={`flex items-start gap-3.5 p-4 rounded-xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-blue-600/15 border-blue-500 text-white shadow-md shadow-blue-950/40'
                    : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:bg-slate-800/60 hover:border-slate-700'
                }`}
              >
                <div className="pt-0.5 shrink-0 text-blue-400">
                  {isSelected ? (
                    <CheckSquare className="w-5 h-5 fill-blue-600 text-white" />
                  ) : (
                    <Square className="w-5 h-5 text-slate-500" />
                  )}
                </div>
                <div className="flex-1">
                  <span className="font-bold text-blue-400 mr-2">{opt.id}.</span>
                  <span className="text-sm md:text-base leading-relaxed">{opt.text}</span>
                </div>
              </label>
            );
          })}
        </div>
      )}

      {/* 3. Matching Pairs */}
      {question.type === 'matching' && question.matchingPairs && (
        <div className="space-y-4 pt-2">
          <p className="text-xs text-slate-400">
            Pilihlah pasangan yang sesuai pada kolom sebelah kanan untuk setiap pernyataan di sebelah kiri:
          </p>
          <div className="space-y-3">
            {question.matchingPairs.map((pair, idx) => {
              const selectedValue =
                currentAnswer && typeof currentAnswer === 'object' ? currentAnswer[pair.id] || '' : '';

              return (
                <div
                  key={pair.id}
                  className="grid grid-cols-1 md:grid-cols-12 gap-3 p-4 bg-slate-900/70 border border-slate-800 rounded-xl items-center"
                >
                  <div className="md:col-span-5 text-sm font-semibold text-slate-200">
                    <span className="text-blue-400 mr-2 font-mono">{idx + 1}.</span>
                    {pair.premise}
                  </div>
                  <div className="md:col-span-1 text-center text-slate-600 hidden md:block">➔</div>
                  <div className="md:col-span-6">
                    <select
                      value={selectedValue}
                      disabled={isReviewMode}
                      onChange={(e) => handleMatchingChange(pair.id, e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs md:text-sm text-slate-200 focus:outline-none focus:border-blue-500"
                    >
                      <option value="">-- Pilih Pasangan Jawaban --</option>
                      {question.matchingPairs?.map((targetOpt) => (
                        <option key={targetOpt.id} value={targetOpt.target}>
                          {targetOpt.target}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 4. Short Answer */}
      {question.type === 'short_answer' && (
        <div className="space-y-3 pt-2">
          <label className="block text-xs font-medium text-slate-400">
            Ketikkan jawaban singkat Anda di bawah ini (singkatan / istilah teknis):
          </label>
          <input
            type="text"
            value={typeof currentAnswer === 'string' ? currentAnswer : ''}
            disabled={isReviewMode}
            onChange={(e) => handleShortAnswerChange(e.target.value)}
            placeholder="Contoh: MAF, 14.7:1, atau Actuation Test..."
            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-base text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
          <div className="text-[11px] text-slate-400">
            Sistem evaluasi otomatis mentolerir variasi kapitalisasi dan tanda baca standar.
          </div>
        </div>
      )}

      {/* 5. Essay / Diagnosis Case */}
      {question.type === 'essay' && (
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-1.5 font-medium text-slate-300">
              <FileText className="w-4 h-4 text-blue-400" /> Lembar Jawaban Uraian & Analisis Mekanik
            </span>
            <span className="font-mono text-slate-400">
              {typeof currentAnswer === 'string' ? currentAnswer.trim().split(/\s+/).filter(Boolean).length : 0} Kata
            </span>
          </div>

          <textarea
            rows={7}
            value={typeof currentAnswer === 'string' ? currentAnswer : ''}
            disabled={isReviewMode}
            onChange={(e) => handleEssayChange(e.target.value)}
            placeholder="Tuliskan analisis diagnosis kerusakan, urutan langkah pengujian alat ukur/scanner, dan interpretasi Anda secara sistematis dan rinci..."
            className="w-full bg-slate-900 border border-slate-700 rounded-xl p-4 text-sm md:text-base text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 leading-relaxed font-sans"
          />

          {/* Rubric Criteria Preview */}
          {question.rubric && question.rubric.length > 0 && (
            <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl text-xs text-slate-400 space-y-1.5">
              <div className="flex items-center gap-1.5 text-slate-300 font-semibold mb-1">
                <HelpCircle className="w-3.5 h-3.5 text-blue-400" />
                <span>Kriteria Penilaian Guru (Rubrik 4 Poin Maksimal):</span>
              </div>
              <ul className="list-disc list-inside space-y-1 text-slate-400 pl-1">
                {question.rubric.map((r, i) => (
                  <li key={i}>
                    <span className="text-slate-300 font-medium">{r.criterion}</span> ({r.maxPoints} Poin)
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Review Mode Explanation / Answer Key */}
      {isReviewMode && (
        <div className="mt-6 p-4 rounded-xl bg-blue-950/30 border border-blue-800/40 text-sm space-y-2">
          <div className="flex items-center gap-2 text-blue-300 font-semibold">
            <CheckCircle2 className="w-4 h-4" />
            <span>Kunci Jawaban & Pembahasan Teknis:</span>
          </div>
          <div className="text-slate-300 text-xs md:text-sm leading-relaxed whitespace-pre-line">
            {question.explanation}
          </div>
          <div className="text-xs text-slate-400 pt-1 font-mono">
            Kunci Resmi: {JSON.stringify(question.correctAnswers)}
          </div>
        </div>
      )}
    </div>
  );
};
