import * as React from 'react';
import { AnalysisResult } from '../types';
import { ArrowDown, BrainCircuit, Target, ShieldCheck, Lightbulb } from 'lucide-react';

interface ResultDisplayProps {
  result: AnalysisResult;
  reset: () => void;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({ result, reset }) => {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-10 duration-700 max-w-4xl mx-auto space-y-8 pb-20">
      
      {/* Header Summary */}
      <div className="glass-panel p-6 rounded-xl border-l-4 border-primary">
        <h3 className="text-sm font-mono text-gray-400 mb-2 flex items-center gap-2">
            <BrainCircuit size={16}/> FRAMEWORKS APPLIED
        </h3>
        <div className="flex flex-wrap gap-2">
            {result.selectedFrameworks.map((fw, i) => (
                <span key={i} className="px-2 py-1 bg-white/5 rounded text-xs text-blue-200 border border-white/10">
                    {fw}
                </span>
            ))}
        </div>
      </div>

      {/* Drill Down Visualization (Textual) */}
      <div className="relative">
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-gray-700 via-primary to-gray-700 opacity-30"></div>
          <div className="space-y-6 pl-12 relative">
             <h3 className="text-sm font-mono text-gray-500 uppercase tracking-widest -ml-12 mb-6">Deep Dive Analysis</h3>
             {result.reasoningChain.map((step, idx) => (
                 <div key={idx} className="relative group">
                     <div className="absolute -left-[39px] top-1 w-4 h-4 rounded-full bg-gray-800 border-2 border-gray-600 group-hover:border-primary transition-colors"></div>
                     <p className="text-gray-400 text-sm leading-relaxed">{step}</p>
                 </div>
             ))}
             <div className="flex justify-center -ml-12 py-4">
                 <ArrowDown className="text-primary animate-bounce" />
             </div>
          </div>
      </div>

      {/* The Core Deliverable */}
      <div className="space-y-6">
        
        {/* Root Cause */}
        <div className="bg-red-950/20 border border-red-900/50 p-8 rounded-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
                <Target size={100} />
            </div>
            <h2 className="text-red-400 font-mono text-sm uppercase tracking-wider mb-3">Root Cause</h2>
            <p className="text-2xl md:text-3xl font-bold text-white leading-tight">
                {result.rootCause}
            </p>
        </div>

        {/* Final Answer */}
        <div className="space-y-4">
            <div className="bg-emerald-950/20 border border-emerald-900/50 p-8 rounded-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                    <ShieldCheck size={100} />
                </div>
                <h2 className="text-emerald-400 font-mono text-sm uppercase tracking-wider mb-3">Final Answer</h2>
                <p className="text-lg md:text-xl text-gray-200 leading-relaxed">
                    {result.finalAnswer}
                </p>
            </div>

            {/* Layman Summary - Integrated under the answer */}
            <div className="bg-white/5 border border-white/10 p-6 rounded-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-5 text-white">
                    <Lightbulb size={60} />
                </div>
                <h2 className="text-gray-400 font-mono text-[10px] uppercase tracking-[0.2em] mb-2 flex items-center gap-2">
                    <Lightbulb size={12} className="text-yellow-500/50" /> Layman's Terms
                </h2>
                <p className="text-base text-gray-300 leading-relaxed font-medium italic">
                    {result.laymanSummary}
                </p>
            </div>
        </div>

      </div>

      <div className="flex justify-center pt-8">
        <button 
            onClick={reset}
            className="px-8 py-3 bg-white/5 hover:bg-white/10 border border-white/20 rounded-full text-sm font-mono transition-all hover:scale-105"
        >
            ANALYZE ANOTHER PROBLEM
        </button>
      </div>

    </div>
  );
};

export default ResultDisplay;