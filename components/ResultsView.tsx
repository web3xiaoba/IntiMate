import React from 'react';
import { AnalysisResult, Scores, Dimension } from '../types';
import { DIMENSIONS } from '../constants';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import ReactMarkdown from 'react-markdown';
import { Download, RefreshCw, Share2 } from 'lucide-react';

interface ResultsViewProps {
  scores: Scores;
  analysis: string;
  onReset: () => void;
}

export const ResultsView: React.FC<ResultsViewProps> = ({ scores, analysis, onReset }) => {
  
  // Calculate aggregated data for charts
  const radarData = DIMENSIONS.map(dim => {
    let selfTotal = 0;
    let partnerTotal = 0;
    let count = 0;

    dim.items.forEach(item => {
      selfTotal += scores[item.id]?.self || 0;
      partnerTotal += scores[item.id]?.partner || 0;
      count++;
    });

    return {
      dimension: dim.title.split('：')[1] || dim.title, // Clean title
      self: count ? +(selfTotal / count).toFixed(1) : 0,
      partner: count ? +(partnerTotal / count).toFixed(1) : 0,
      fullMark: 5,
    };
  });

  // Calculate compatibility score (simple algorithm for visual, AI does the real work)
  const calculateCompatibility = () => {
    let totalGap = 0;
    let totalItems = 0;
    let riskScore = 0;

    DIMENSIONS.forEach(dim => {
      dim.items.forEach(item => {
        const gap = Math.abs((scores[item.id]?.self || 0) - (scores[item.id]?.partner || 0));
        totalItems++;
        
        if (item.reverse) {
          // Risk items: Higher scores are bad
           riskScore += (scores[item.id]?.self || 0) + (scores[item.id]?.partner || 0);
        } else {
           totalGap += gap;
        }
      });
    });

    // Inverse gap logic + risk penalty
    const baseScore = 100 - (totalGap / totalItems) * 20; 
    const riskPenalty = riskScore * 1.5; // Heuristic
    return Math.max(0, Math.min(100, Math.round(baseScore - riskPenalty)));
  };

  const score = calculateCompatibility();
  
  const getScoreColor = (s: number) => {
    if (s >= 80) return 'text-green-500';
    if (s >= 60) return 'text-blue-500';
    return 'text-rose-500';
  };

  return (
    <div className="max-w-4xl mx-auto w-full animate-fadeIn pb-20">
      
      {/* Header Summary */}
      <div className="bg-white rounded-3xl p-8 shadow-xl mb-8 text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
        <h2 className="text-3xl font-bold text-slate-800 mb-2">亲密关系诊断报告</h2>
        <div className="flex flex-col items-center justify-center my-6">
           <div className="relative">
             <svg className="w-32 h-32 transform -rotate-90">
               <circle cx="64" cy="64" r="60" stroke="#f1f5f9" strokeWidth="8" fill="transparent" />
               <circle 
                 cx="64" cy="64" r="60" 
                 stroke={score >= 80 ? '#22c55e' : score >= 60 ? '#3b82f6' : '#f43f5e'} 
                 strokeWidth="8" 
                 fill="transparent" 
                 strokeDasharray={377} 
                 strokeDashoffset={377 - (377 * score) / 100}
                 className="transition-all duration-1000 ease-out"
               />
             </svg>
             <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
               <span className={`text-4xl font-black ${getScoreColor(score)}`}>{score}</span>
               <span className="block text-[10px] text-gray-400 uppercase tracking-wider">匹配指数</span>
             </div>
           </div>
        </div>
        <p className="text-slate-500">
          基于 {DIMENSIONS.reduce((acc, d) => acc + d.items.length, 0)} 个专业维度点的深度分析
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        {/* Radar Chart */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-700 mb-4 text-center">维度对比雷达图</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis dataKey="dimension" tick={{ fill: '#64748b', fontSize: 12 }} />
                <PolarRadiusAxis angle={30} domain={[0, 5]} tick={false} axisLine={false} />
                <Radar name="我自己" dataKey="self" stroke="#4f46e5" fill="#4f46e5" fillOpacity={0.3} />
                <Radar name="对方" dataKey="partner" stroke="#f43f5e" fill="#f43f5e" fillOpacity={0.3} />
                <Legend iconType="circle" />
                <Tooltip 
                   contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bar Chart for Gaps */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
           <h3 className="text-lg font-bold text-slate-700 mb-4 text-center">维度得分总览</h3>
           <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={radarData} layout="vertical" margin={{ left: 20 }}>
                <XAxis type="number" domain={[0, 5]} hide />
                <YAxis dataKey="dimension" type="category" width={100} tick={{ fontSize: 11 }} />
                <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{ borderRadius: '8px' }} />
                <Legend />
                <Bar dataKey="self" name="我自己" fill="#4f46e5" radius={[0, 4, 4, 0]} barSize={10} />
                <Bar dataKey="partner" name="对方" fill="#f43f5e" radius={[0, 4, 4, 0]} barSize={10} />
              </BarChart>
            </ResponsiveContainer>
           </div>
        </div>
      </div>

      {/* AI Analysis Report */}
      <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden">
        <div className="bg-slate-900 px-8 py-4 flex items-center justify-between">
          <h3 className="text-white font-bold flex items-center gap-2">
             <span className="text-yellow-400">✦</span> 智能深度诊断
          </h3>
          <span className="text-xs text-slate-400 bg-slate-800 px-2 py-1 rounded">Generated by Gemini</span>
        </div>
        <div className="p-8 prose prose-slate max-w-none prose-headings:font-bold prose-headings:text-slate-800 prose-p:text-slate-600 prose-strong:text-indigo-600 prose-li:text-slate-600">
           <ReactMarkdown>{analysis}</ReactMarkdown>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-8 flex justify-center gap-4">
        <button 
          onClick={onReset}
          className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 text-slate-600 rounded-full font-medium hover:bg-slate-50 transition-colors"
        >
          <RefreshCw size={18} /> 重新测评
        </button>
        <button className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-full font-medium hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200">
          <Download size={18} /> 保存报告
        </button>
      </div>
    </div>
  );
};
