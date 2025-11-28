import React from 'react';
import { Dimension, Scores } from '../types';
import { AlertCircle, ArrowLeft, ArrowRight, Heart } from 'lucide-react';

interface StepWizardProps {
  dimension: Dimension;
  scores: Scores;
  onScoreChange: (itemId: string, type: 'self' | 'partner', value: number) => void;
  onNext: () => void;
  onPrev: () => void;
  isFirst: boolean;
  isLast: boolean;
}

const RatingInput: React.FC<{
  label: string;
  value: number;
  onChange: (val: number) => void;
  colorClass: string;
}> = ({ label, value, onChange, colorClass }) => (
  <div className="flex flex-col gap-2 flex-1">
    <div className="flex justify-between text-xs font-medium text-gray-500 uppercase tracking-wide">
      <span>{label}</span>
      <span>{value > 0 ? value : '-'} / 5</span>
    </div>
    <div className="flex gap-1 h-10 items-center bg-gray-50 rounded-lg p-1 border border-gray-100">
      {[1, 2, 3, 4, 5].map((num) => (
        <button
          key={num}
          onClick={() => onChange(num)}
          className={`flex-1 h-full rounded-md transition-all duration-200 text-sm font-bold ${
            value === num
              ? `${colorClass} text-white shadow-md transform scale-105`
              : 'bg-white text-gray-400 hover:bg-gray-100'
          }`}
        >
          {num}
        </button>
      ))}
    </div>
    <div className="flex justify-between text-[10px] text-gray-400 px-1">
      <span>低/弱</span>
      <span>高/强</span>
    </div>
  </div>
);

export const StepWizard: React.FC<StepWizardProps> = ({
  dimension,
  scores,
  onScoreChange,
  onNext,
  onPrev,
  isFirst,
  isLast,
}) => {
  // Check if current step is fully completed
  const isStepComplete = dimension.items.every(
    (item) => scores[item.id]?.self > 0 && scores[item.id]?.partner > 0
  );

  return (
    <div className="max-w-3xl mx-auto w-full animate-fadeIn">
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">{dimension.title}</h2>
        <p className="text-slate-500 text-sm max-w-lg mx-auto">{dimension.description}</p>
      </div>

      <div className="space-y-8 mb-12">
        {dimension.items.map((item) => (
          <div key={item.id} className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 relative overflow-hidden group hover:shadow-md transition-shadow">
            {item.reverse && (
              <div className="absolute top-0 right-0 bg-rose-100 text-rose-600 text-[10px] px-2 py-1 rounded-bl-lg font-bold flex items-center gap-1">
                <AlertCircle size={10} /> 风险指标
              </div>
            )}
            
            <div className="mb-4">
              <h3 className="font-semibold text-slate-800 text-lg flex items-center gap-2">
                {item.label}
              </h3>
              <p className="text-slate-400 text-xs mt-1">{item.subLabel}</p>
            </div>

            <div className="flex flex-col md:flex-row gap-6 md:gap-10">
              <RatingInput
                label="我自己 (Self)"
                value={scores[item.id]?.self || 0}
                onChange={(val) => onScoreChange(item.id, 'self', val)}
                colorClass="bg-indigo-600"
              />
              <div className="hidden md:block w-px bg-slate-100"></div>
              <RatingInput
                label="对方 (Partner)"
                value={scores[item.id]?.partner || 0}
                onChange={(val) => onScoreChange(item.id, 'partner', val)}
                colorClass="bg-rose-500"
              />
            </div>
          </div>
        ))}
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-md border-t border-slate-200 z-10 flex justify-center gap-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        <div className="max-w-3xl w-full flex justify-between">
          <button
            onClick={onPrev}
            disabled={isFirst}
            className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-colors ${
              isFirst
                ? 'text-slate-300 cursor-not-allowed'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <ArrowLeft size={18} />
            上一步
          </button>

          <button
            onClick={onNext}
            disabled={!isStepComplete}
            className={`flex items-center gap-2 px-8 py-3 rounded-full font-bold shadow-lg transition-all transform ${
              !isStepComplete
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                : isLast
                ? 'bg-gradient-to-r from-rose-500 to-orange-500 text-white hover:scale-105 shadow-rose-200'
                : 'bg-slate-900 text-white hover:bg-slate-800 hover:scale-105'
            }`}
          >
            {isLast ? (
              <>
                生成诊断报告 <Heart size={18} className="fill-current" />
              </>
            ) : (
              <>
                下一步 <ArrowRight size={18} />
              </>
            )}
          </button>
        </div>
      </div>
      {/* Spacer for fixed bottom bar */}
      <div className="h-24"></div> 
    </div>
  );
};
