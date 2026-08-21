import React, { useState } from 'react';
import { Volume2, Play, Pause, AlertCircle, CheckCircle2, ChevronRight, ChevronLeft } from 'lucide-react';
import { CountdownTimer } from './CountdownTimer';

export interface ListeningQuestion {
  id: number;
  audioUrl?: string;
  transcript?: string;
  question: string;
  options: string[];
  correctAnswer: number;
}

interface ListeningModuleProps {
  questions?: ListeningQuestion[];
  onComplete?: (answers: Record<number, number>) => void;
  timeRemaining?: number;
}

export const ListeningModule: React.FC<ListeningModuleProps> = ({
  questions = [],
  onComplete,
  timeRemaining = 1800,
}) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [isPlaying, setIsPlaying] = useState(false);

  const handleSelect = (optionIdx: number) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [currentIdx]: optionIdx,
    }));
  };

  const handleNext = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIdx > 0) {
      setCurrentIdx(prev => prev - 1);
    }
  };

  const handleSubmit = () => {
    if (onComplete) {
      onComplete(selectedAnswers);
    }
  };

  if (!questions || questions.length === 0) {
    return (
      <div className="p-8 text-center text-stone-500 bg-white rounded-2xl border border-stone-200">
        <AlertCircle className="w-12 h-12 mx-auto mb-3 text-amber-500" />
        <h3 className="text-lg font-bold text-stone-800">Không có dữ liệu bài thi Nghe</h3>
        <p className="text-sm">Vui lòng tải đề thi hoặc cấu hình bộ câu hỏi hợp lệ.</p>
      </div>
    );
  }

  const currentQ = questions[currentIdx];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-stone-200 shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-emerald-50 rounded-xl text-emerald-600">
            <Volume2 className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base font-bold text-stone-900">Kỹ Năng Nghe (Listening Section)</h2>
            <p className="text-xs text-stone-500">Câu hỏi {currentIdx + 1} / {questions.length}</p>
          </div>
        </div>
        <CountdownTimer initialSeconds={timeRemaining} onTimeUp={handleSubmit} />
      </div>

      <div className="p-6 bg-white rounded-2xl border border-stone-200 shadow-sm space-y-6">
        <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 flex items-center justify-between">
          <span className="text-sm font-medium text-stone-700">File âm thanh bài nghe:</span>
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="flex items-center space-x-2 px-4 py-2 bg-[#3C2A63] text-white rounded-xl text-sm font-semibold hover:bg-[#2A1D45] transition-all"
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            <span>{isPlaying ? 'Tạm dừng' : 'Phát âm thanh'}</span>
          </button>
        </div>

        <div className="space-y-4">
          <h3 className="text-base font-semibold text-stone-800">{currentQ.question}</h3>
          <div className="grid grid-cols-1 gap-3">
            {currentQ.options.map((option, idx) => {
              const isSelected = selectedAnswers[currentIdx] === idx;
              return (
                <button
                  key={idx}
                  onClick={() => handleSelect(idx)}
                  className={`p-4 rounded-xl border text-left flex items-center justify-between transition-all ${
                    isSelected
                      ? 'border-[#3C2A63] bg-purple-50 text-[#3C2A63] font-semibold'
                      : 'border-stone-200 hover:border-stone-300 text-stone-700'
                  }`}
                >
                  <span className="text-sm">{option}</span>
                  {isSelected && <CheckCircle2 className="w-5 h-5 text-[#3C2A63]" />}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-stone-100">
          <button
            onClick={handlePrev}
            disabled={currentIdx === 0}
            className="flex items-center space-x-1 px-4 py-2 border border-stone-300 rounded-xl text-sm font-medium text-stone-600 disabled:opacity-40"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Câu trước</span>
          </button>

          {currentIdx === questions.length - 1 ? (
            <button
              onClick={handleSubmit}
              className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-bold transition-all"
            >
              Nộp bài Nghe
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="flex items-center space-x-1 px-4 py-2 bg-[#3C2A63] hover:bg-[#2A1D45] text-white rounded-xl text-sm font-medium transition-all"
            >
              <span>Câu kế tiếp</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ListeningModule;
