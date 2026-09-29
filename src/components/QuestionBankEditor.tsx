import React, { useState } from 'react';
import { Question, QuestionType, DifficultyLevel } from '../types/cbt';
import { storageService } from '../services/storageService';
import {
  BookOpen,
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  Image,
  Video,
  ArrowLeft,
  CheckCircle2,
  RotateCcw,
  Save,
  X,
  ExternalLink
} from 'lucide-react';
import cutawayImg from '../assets/images/ems_engine_cutaway_1790566530909.jpg';
import scannerImg from '../assets/images/scanner_x431_diagnostic_1790566545951.jpg';
import scopeImg from '../assets/images/oscilloscope_injector_waveform_1790566558379.jpg';

interface QuestionBankEditorProps {
  onBack: () => void;
}

export const QuestionBankEditor: React.FC<QuestionBankEditorProps> = ({ onBack }) => {
  const [questions, setQuestions] = useState<Question[]>(storageService.getQuestions());
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [difficultyFilter, setDifficultyFilter] = useState<string>('all');
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [saveToast, setSaveToast] = useState(false);

  // Filtered Questions
  const filteredQuestions = questions.filter((q) => {
    const matchSearch =
      q.prompt.toLowerCase().includes(search.toLowerCase()) ||
      q.competency.toLowerCase().includes(search.toLowerCase()) ||
      q.id.toString() === search;
    const matchType = typeFilter === 'all' || q.type === typeFilter;
    const matchDiff = difficultyFilter === 'all' || q.difficulty === difficultyFilter;
    return matchSearch && matchType && matchDiff;
  });

  const handleOpenEdit = (q: Question) => {
    setEditingQuestion({ ...q });
    setIsEditModalOpen(true);
  };

  const handleOpenCreate = () => {
    const newQ: Question = {
      id: questions.length > 0 ? Math.max(...questions.map((item) => item.id)) + 1 : 1,
      type: 'single',
      difficulty: 'mudah',
      points: 1,
      competency: 'Sensor EMS',
      prompt: '',
      correctAnswers: ['A'],
      options: [
        { id: 'A', text: '' },
        { id: 'B', text: '' },
        { id: 'C', text: '' },
        { id: 'D', text: '' },
        { id: 'E', text: '' },
      ],
      explanation: '',
    };
    setEditingQuestion(newQ);
    setIsEditModalOpen(true);
  };

  const handleSaveQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingQuestion) return;

    const list = [...questions];
    const idx = list.findIndex((q) => q.id === editingQuestion.id);
    if (idx >= 0) {
      list[idx] = editingQuestion;
    } else {
      list.push(editingQuestion);
    }

    setQuestions(list);
    storageService.saveQuestions(list);
    setIsEditModalOpen(false);
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 2500);
  };

  const handleDelete = (id: number) => {
    if (confirm(`Hapus Soal No. ${id}?`)) {
      const list = questions.filter((q) => q.id !== id);
      setQuestions(list);
      storageService.saveQuestions(list);
    }
  };

  const handleResetDefault = () => {
    if (confirm('Kembalikan seluruh bank soal ke 50 butir standar awal kurikulum EMS?')) {
      const list = storageService.resetQuestions();
      setQuestions(list);
      setSaveToast(true);
      setTimeout(() => setSaveToast(false), 2500);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Header */}
      <header className="sticky top-0 z-20 bg-slate-900/95 border-b border-slate-800 backdrop-blur-md px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <h1 className="text-base font-bold text-white tracking-tight">
                Bank Soal Evaluasi EMS PMKR ({questions.length} Butir)
              </h1>
              <p className="text-xs text-slate-400">
                SMKS Bina Karya 2 Karawang · Guru Pengampu: Tarim, ST., MT.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleResetDefault}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 border border-slate-700 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
              <span>Reset 50 Butir Default</span>
            </button>

            <button
              onClick={handleOpenCreate}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-xs font-bold text-white transition-colors cursor-pointer shadow-md shadow-blue-950/50"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Tambah Butir Soal</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full p-4 md:p-6 space-y-4">
        {saveToast && (
          <div className="p-3 bg-emerald-950 border border-emerald-700 rounded-xl text-xs text-emerald-300 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>Perubahan bank soal berhasil disimpan ke sistem!</span>
          </div>
        )}

        {/* Filter Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-900/60 p-3 rounded-xl border border-slate-800 text-xs">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari teks soal / topik kompetensi..."
              className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
            >
              <option value="all">Semua Tipe Soal</option>
              <option value="single">Pilihan Ganda Biasa (1 pt)</option>
              <option value="multiple">Pilihan Ganda Kompleks (2 pt)</option>
              <option value="matching">Menjodohkan (2 pt)</option>
              <option value="short_answer">Isian Singkat (3 pt)</option>
              <option value="essay">Essay Kasus (4 pt)</option>
            </select>

            <select
              value={difficultyFilter}
              onChange={(e) => setDifficultyFilter(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
            >
              <option value="all">Semua Tingkat</option>
              <option value="mudah">Mudah (40%)</option>
              <option value="sedang">Sedang (20%)</option>
              <option value="hots">HOTS Kasus Bengkel (40%)</option>
            </select>
          </div>
        </div>

        {/* Questions Grid / List */}
        <div className="space-y-3">
          {filteredQuestions.map((q) => (
            <div
              key={q.id}
              className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-3 hover:border-slate-700 transition-colors"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="font-mono font-bold text-white bg-slate-800 px-2.5 py-0.5 rounded-lg border border-slate-700">
                    No. {q.id}
                  </span>
                  <span className="font-semibold text-blue-400">{q.competency}</span>
                  <span className="text-slate-600">·</span>
                  <span className="text-slate-400 capitalize">{q.difficulty}</span>
                  <span className="text-slate-600">·</span>
                  <span className="text-amber-400 font-mono font-semibold">
                    {q.points} Poin ({q.type})
                  </span>
                  {q.mediaUrl && (
                    <span className="inline-flex items-center gap-1 text-[11px] text-cyan-400 bg-cyan-950/60 border border-cyan-800 px-2 py-0.5 rounded">
                      <Image className="w-3 h-3" /> Ada Media/Gambar
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenEdit(q)}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-blue-400 transition-colors cursor-pointer"
                    title="Edit Soal"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(q.id)}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-red-400 transition-colors cursor-pointer"
                    title="Hapus Soal"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <p className="text-xs md:text-sm text-slate-200 whitespace-pre-line font-medium leading-relaxed">
                {q.prompt}
              </p>

              {q.mediaUrl && (
                <div className="max-w-xs rounded-lg overflow-hidden border border-slate-800">
                  <img src={q.mediaUrl} alt="Media Soal" className="w-full h-32 object-cover" />
                </div>
              )}

              <div className="p-2.5 bg-slate-950/80 rounded-xl text-xs space-y-1 font-mono text-slate-400">
                <div>
                  Kunci:{' '}
                  <span className="text-emerald-400 font-bold">
                    {JSON.stringify(q.correctAnswers)}
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 font-sans line-clamp-2">
                  Pembahasan: {q.explanation}
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Edit / Create Question Modal with Insert Media Capability */}
      {isEditModalOpen && editingQuestion && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm animate-in fade-in overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-2xl w-full shadow-2xl space-y-4 my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">
                {editingQuestion.id ? `Edit Soal No. ${editingQuestion.id}` : 'Tambah Butir Soal Baru'}
              </h3>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveQuestion} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Tipe Soal</label>
                  <select
                    value={editingQuestion.type}
                    onChange={(e) =>
                      setEditingQuestion({
                        ...editingQuestion,
                        type: e.target.value as QuestionType,
                        points:
                          e.target.value === 'single'
                            ? 1
                            : e.target.value === 'multiple' || e.target.value === 'matching'
                            ? 2
                            : e.target.value === 'short_answer'
                            ? 3
                            : 4,
                      })
                    }
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="single">Pilihan Ganda Biasa</option>
                    <option value="multiple">Pilihan Ganda Kompleks</option>
                    <option value="matching">Menjodohkan</option>
                    <option value="short_answer">Isian Singkat</option>
                    <option value="essay">Essay Analisis / Kasus</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Tingkat Kesulitan</label>
                  <select
                    value={editingQuestion.difficulty}
                    onChange={(e) =>
                      setEditingQuestion({
                        ...editingQuestion,
                        difficulty: e.target.value as DifficultyLevel,
                      })
                    }
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="mudah">Mudah</option>
                    <option value="sedang">Sedang</option>
                    <option value="hots">HOTS (Kasus Bengkel)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Bobot Poin</label>
                  <input
                    type="number"
                    min={1}
                    max={10}
                    value={editingQuestion.points}
                    onChange={(e) =>
                      setEditingQuestion({ ...editingQuestion, points: Number(e.target.value) })
                    }
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white font-mono focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Topik Kompetensi</label>
                <input
                  type="text"
                  required
                  value={editingQuestion.competency}
                  onChange={(e) =>
                    setEditingQuestion({ ...editingQuestion, competency: e.target.value })
                  }
                  placeholder="Contoh: Sensor EMS, Aktuator EMS, Scanner Launch X-431"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Pertanyaan / Narasi Kasus</label>
                <textarea
                  rows={4}
                  required
                  value={editingQuestion.prompt}
                  onChange={(e) =>
                    setEditingQuestion({ ...editingQuestion, prompt: e.target.value })
                  }
                  placeholder="Ketikkan butir soal evaluasi otomotif..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-blue-500 leading-relaxed font-sans"
                />
              </div>

              {/* MEDIA INSERTION SECTION (Images & Videos) */}
              <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-cyan-400 flex items-center gap-1.5">
                    <Image className="w-4 h-4" /> Sisipkan Gambar / Diagram / Video URL
                  </span>
                  {editingQuestion.mediaUrl && (
                    <button
                      type="button"
                      onClick={() => setEditingQuestion({ ...editingQuestion, mediaUrl: '', mediaCaption: '' })}
                      className="text-[11px] text-red-400 hover:underline cursor-pointer"
                    >
                      Hapus Media
                    </button>
                  )}
                </div>

                <div className="space-y-2">
                  <input
                    type="text"
                    value={editingQuestion.mediaUrl || ''}
                    onChange={(e) =>
                      setEditingQuestion({ ...editingQuestion, mediaUrl: e.target.value })
                    }
                    placeholder="Masukkan URL Gambar atau Video (atau pilih preset diagram di bawah)..."
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white font-mono text-xs focus:outline-none focus:border-cyan-500"
                  />

                  {/* Preset Shortcuts */}
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[10px] text-slate-500">Preset Diagram:</span>
                    <button
                      type="button"
                      onClick={() =>
                        setEditingQuestion({
                          ...editingQuestion,
                          mediaUrl: cutawayImg,
                          mediaCaption: 'Diagram 3D Cutaway Sensor & Aktuator Mesin Bensin EFI',
                        })
                      }
                      className="text-[10px] px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-blue-300 border border-slate-700 cursor-pointer"
                    >
                      Cutaway Mesin EFI
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setEditingQuestion({
                          ...editingQuestion,
                          mediaUrl: scannerImg,
                          mediaCaption: 'Tampilan Live Data Stream & DTC Scanner Launch X-431 Pro',
                        })
                      }
                      className="text-[10px] px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-blue-300 border border-slate-700 cursor-pointer"
                    >
                      Scanner X-431 Display
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setEditingQuestion({
                          ...editingQuestion,
                          mediaUrl: scopeImg,
                          mediaCaption: 'Bentuk Gelombang Osiloskop Flyback Injektor (70V Spike)',
                        })
                      }
                      className="text-[10px] px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-blue-300 border border-slate-700 cursor-pointer"
                    >
                      Waveform Osiloskop
                    </button>
                  </div>

                  <input
                    type="text"
                    value={editingQuestion.mediaCaption || ''}
                    onChange={(e) =>
                      setEditingQuestion({ ...editingQuestion, mediaCaption: e.target.value })
                    }
                    placeholder="Caption / Keterangan Gambar Diagram..."
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white text-xs focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              {/* Options for Single / Multiple */}
              {(editingQuestion.type === 'single' || editingQuestion.type === 'multiple') && editingQuestion.options && (
                <div className="space-y-2">
                  <label className="block text-slate-300 font-semibold">Pilihan Jawaban (A s/d E)</label>
                  {editingQuestion.options.map((opt, idx) => (
                    <div key={opt.id} className="flex items-center gap-2">
                      <span className="w-6 text-center font-bold text-blue-400">{opt.id}</span>
                      <input
                        type="text"
                        value={opt.text}
                        onChange={(e) => {
                          const updatedOpts = [...(editingQuestion.options || [])];
                          updatedOpts[idx] = { ...updatedOpts[idx], text: e.target.value };
                          setEditingQuestion({ ...editingQuestion, options: updatedOpts });
                        }}
                        className="flex-1 bg-slate-950 border border-slate-800 rounded-lg p-2 text-white focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  ))}

                  <div className="pt-2">
                    <label className="block text-slate-300 font-semibold mb-1">
                      Kunci Jawaban Benar (Pisahkan koma jika &gt; 1, contoh: A, C)
                    </label>
                    <input
                      type="text"
                      required
                      value={editingQuestion.correctAnswers.join(', ')}
                      onChange={(e) =>
                        setEditingQuestion({
                          ...editingQuestion,
                          correctAnswers: e.target.value
                            .split(',')
                            .map((s) => s.trim().toUpperCase())
                            .filter(Boolean),
                        })
                      }
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white font-mono uppercase focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
              )}

              {/* Explanation & Rubric */}
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Kunci Jawaban / Penjelasan Teknis & Rubrik Penilaian
                </label>
                <textarea
                  rows={3}
                  required
                  value={editingQuestion.explanation}
                  onChange={(e) =>
                    setEditingQuestion({ ...editingQuestion, explanation: e.target.value })
                  }
                  placeholder="Uraikan dasar teori, kunci jawaban, dan panduan penilaian..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-blue-500 leading-relaxed font-sans"
                />
              </div>

              <div className="flex gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold transition-colors cursor-pointer shadow-lg shadow-blue-950/40"
                >
                  Simpan Soal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
