import React, { useState, useEffect } from 'react';
import { DIMENSIONS } from './constants';
import { Scores, Step } from './types';
import { StepWizard } from './components/StepWizard';
import { ResultsView } from './components/ResultsView';
import { generateAnalysis } from './services/geminiService';
import { Heart, Loader2, Sparkles } from 'lucide-react';

const App: React.FC = () => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [appState, setAppState] = useState<Step>(Step.intro);
  const [scores, setScores] = useState<Scores>({});
  const [analysisReport, setAnalysisReport] = useState<string>('');

  // Scroll to top on step change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentStepIndex, appState]);

  const handleScoreChange = (itemId: string, type: 'self' | 'partner', value: number) => {
    setScores(prev => ({
      ...prev,
      [itemId]: {
        ...prev[itemId],
        [type]: value
      }
    }));
  };

  const handleNext = async () => {
    if (currentStepIndex < DIMENSIONS.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
    } else {
      setAppState(Step.analyzing);
      // Process Data & Call API
      const report = await generateAnalysis(scores);
      setAnalysisReport(report);
      setAppState(Step.results);
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
    } else {
      setAppState(Step.intro);
    }
  };

  const handleStart = () => {
    setAppState(Step.assessment);
    setCurrentStepIndex(0);
  };

  const handleReset = () => {
    if (window.confirm("确定要重新开始吗？当前数据将丢失。")) {
      setScores({});
      setAnalysisReport('');
      setCurrentStepIndex(0);
      setAppState(Step.intro);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 selection:bg-rose-200 selection:text-rose-900">
      
      {/* Top Navigation Bar */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 px-4 md:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-rose-500 p-1.5 rounded-lg text-white">
            <Heart size={20} fill="currentColor" />
          </div>
          <span className="font-bold text-xl tracking-tight text-slate-900">IntiMate</span>
        </div>
        {appState === Step.assessment && (
          <div className="hidden md:flex items-center gap-2 text-sm font-medium text-slate-500">
            <span>进度</span>
            <div className="w-32 h-2 bg-slate-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-indigo-600 transition-all duration-500 ease-out"
                style={{ width: `${((currentStepIndex + 1) / DIMENSIONS.length) * 100}%` }}
              ></div>
            </div>
            <span>{currentStepIndex + 1} / {DIMENSIONS.length}</span>
          </div>
        )}
      </nav>

      <main className="container mx-auto px-4 py-8 md:py-12">
        {/* Intro Screen */}
        {appState === Step.intro && (
          <div className="flex flex-col items-center justify-center min-h-[70vh] text-center animate-fadeIn">
            <div className="mb-6 relative">
              <div className="absolute -inset-4 bg-rose-200 rounded-full opacity-30 blur-xl animate-pulse"></div>
              <Heart size={80} className="text-rose-500 relative z-10" fill="#f43f5e" />
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 leading-tight">
              探索你们的<br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-indigo-600">亲密关系DNA</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-600 max-w-2xl mb-10 leading-relaxed">
              基于大五人格、依恋理论与生活价值观的专业评估。<br/>
              找出潜藏的优势与风险，获取AI定制的改善方案。
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl w-full mb-12">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <div className="text-3xl mb-3">🧩</div>
                <h3 className="font-bold text-slate-800 mb-2">全维度分析</h3>
                <p className="text-sm text-slate-500">涵盖人格、生活、价值观等6大核心板块。</p>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <div className="text-3xl mb-3">⚖️</div>
                <h3 className="font-bold text-slate-800 mb-2">双视角对比</h3>
                <p className="text-sm text-slate-500">同时评估“自己”与“对方”，精准定位认知偏差。</p>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <div className="text-3xl mb-3">🤖</div>
                <h3 className="font-bold text-slate-800 mb-2">AI 深度诊断</h3>
                <p className="text-sm text-slate-500">Gemini大模型生成详细的匹配报告与建议。</p>
              </div>
            </div>

            <button 
              onClick={handleStart}
              className="group relative inline-flex items-center justify-center px-8 py-4 font-bold text-white transition-all duration-200 bg-slate-900 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900 hover:bg-slate-800 hover:scale-105"
            >
              开始专业评估 <Sparkles className="ml-2 w-5 h-5 group-hover:animate-spin" />
            </button>
            <p className="mt-4 text-xs text-slate-400">预计耗时 5-8 分钟 • 数据仅本地处理</p>
          </div>
        )}

        {/* Assessment Wizard */}
        {appState === Step.assessment && (
          <StepWizard
            dimension={DIMENSIONS[currentStepIndex]}
            scores={scores}
            onScoreChange={handleScoreChange}
            onNext={handleNext}
            onPrev={handlePrev}
            isFirst={currentStepIndex === 0}
            isLast={currentStepIndex === DIMENSIONS.length - 1}
          />
        )}

        {/* Analyzing Loader */}
        {appState === Step.analyzing && (
          <div className="flex flex-col items-center justify-center h-[60vh] animate-fadeIn">
            <Loader2 size={64} className="text-indigo-600 animate-spin mb-6" />
            <h2 className="text-2xl font-bold text-slate-800 mb-2">AI正在分析你们的关系数据...</h2>
            <p className="text-slate-500">正在计算匹配度、识别风险点并生成建议</p>
          </div>
        )}

        {/* Results */}
        {appState === Step.results && (
          <ResultsView 
            scores={scores} 
            analysis={analysisReport} 
            onReset={handleReset} 
          />
        )}
      </main>
    </div>
  );
};

export default App;
