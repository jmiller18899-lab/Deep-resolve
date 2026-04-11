import * as React from 'react';
import { useState } from 'react';
import { AppState, AnalysisResult } from './types';
import { analyzeProblem } from './services/geminiService';
import FrameworkVisualizer from './components/FrameworkVisualizer';
import ProcessingSteps from './components/ProcessingSteps';
import ResultDisplay from './components/ResultDisplay';
import { AlertCircle, BrainCircuit, ArrowRight, Sparkles } from 'lucide-react';

const App: React.FC = () => {
  const [input, setInput] = useState('');
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!input.trim()) return;
    
    setAppState(AppState.ANALYZING);
    setError(null);
    setResult(null);

    try {
      const analysis = await analyzeProblem(input);
      setResult(analysis);
      setAppState(AppState.COMPLETED);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An unknown error occurred during analysis.");
      setAppState(AppState.ERROR);
    }
  };

  const resetApp = () => {
    setInput('');
    setAppState(AppState.IDLE);
    setResult(null);
  };

  return (
    <div className="flex h-screen bg-background text-gray-100 selection:bg-primary/30 font-sans overflow-hidden">
      <div className="flex-1 flex flex-col relative overflow-y-auto">
        
        {/* Background Ambience */}
        <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[128px]"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-[128px]"></div>
        </div>

        <div className="relative z-10 w-full max-w-5xl mx-auto px-6 py-12 md:py-20 flex-grow">
          
          {/* Header */}
          <header className="mb-12 text-center">
              <div className="inline-flex items-center justify-center p-3 mb-6 bg-white/5 rounded-2xl border border-white/10 shadow-xl shadow-primary/5">
                  <BrainCircuit className="w-8 h-8 text-primary" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-200 to-gray-500">
              DeepResolve
              </h1>
              <p className="text-gray-400 text-lg max-w-xl mx-auto">
              Advanced root cause analysis using 940+ cognitive frameworks. 
              Drill down to first principles. Find the truth.
              </p>
          </header>

          <main className="min-h-[400px]">
              
              {/* IDLE STATE: Input Form */}
              {appState === AppState.IDLE && (
                  <div className="animate-in fade-in zoom-in-95 duration-500 max-w-2xl mx-auto">
                      <div className="glass-panel p-1 rounded-2xl">
                          <div className="bg-surface/80 rounded-xl p-6 space-y-4">
                              <label className="block text-sm font-medium text-gray-400 ml-1">
                                  DESCRIBE THE PROBLEM
                              </label>
                              <textarea 
                                  value={input}
                                  onChange={(e) => setInput(e.target.value)}
                                  placeholder="e.g., Our engineering team velocity has dropped by 30% despite hiring more seniors..."
                                  className="w-full h-40 bg-black/20 border border-white/10 rounded-lg p-4 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none font-mono text-sm leading-relaxed"
                              />
                              <div className="flex justify-end">
                                  <button 
                                      onClick={handleSubmit}
                                      disabled={!input.trim()}
                                      className="group relative inline-flex items-center justify-center px-8 py-3 font-semibold text-white transition-all duration-200 bg-primary hover:bg-blue-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
                                  >
                                      <span className="mr-2">Initiate Analysis</span>
                                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                      <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent z-20"></div>
                                  </button>
                              </div>
                          </div>
                      </div>
                      
                      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 text-center text-xs text-gray-500 font-mono">
                           <div className="p-4 rounded-lg border border-white/5 bg-white/5 flex flex-col items-center gap-2">
                              <Sparkles className="w-4 h-4 text-accent" />
                              <span>940+ FRAMEWORKS</span>
                           </div>
                           <div className="p-4 rounded-lg border border-white/5 bg-white/5 flex flex-col items-center gap-2">
                              <BrainCircuit className="w-4 h-4 text-primary" />
                              <span>DEEP REASONING</span>
                           </div>
                           <div className="p-4 rounded-lg border border-white/5 bg-white/5 flex flex-col items-center gap-2">
                              <ArrowRight className="w-4 h-4 text-success" />
                              <span>ACTIONABLE TRUTH</span>
                           </div>
                      </div>
                  </div>
              )}

              {/* ANALYZING STATE: Visualizer & Steps */}
              {appState === AppState.ANALYZING && (
                  <div className="animate-in fade-in duration-700 space-y-8">
                      <FrameworkVisualizer isActive={true} />
                      <ProcessingSteps isComplete={false} />
                      <div className="text-center font-mono text-xs text-gray-500 animate-pulse">
                          APPLYING COGNITIVE MODELS...
                      </div>
                  </div>
              )}

              {/* COMPLETED STATE: Results */}
              {appState === AppState.COMPLETED && result && (
                  <div className="space-y-8">
                       <ResultDisplay result={result} reset={resetApp} />
                  </div>
              )}

              {/* ERROR STATE */}
              {appState === AppState.ERROR && (
                  <div className="animate-in fade-in zoom-in-95 duration-300 max-w-md mx-auto text-center p-8 glass-panel rounded-xl border-red-500/20">
                      <div className="inline-flex bg-red-500/10 p-4 rounded-full mb-4">
                          <AlertCircle className="w-8 h-8 text-red-500" />
                      </div>
                      <h3 className="text-xl font-bold text-white mb-2">Analysis Failed</h3>
                      <p className="text-gray-400 mb-6">{error}</p>
                      <button 
                          onClick={() => setAppState(AppState.IDLE)}
                          className="px-6 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-medium transition-colors"
                      >
                          Try Again
                      </button>
                  </div>
              )}

          </main>

          <footer className="mt-20 text-center text-xs text-gray-600 font-mono">
              POWERED BY GOOGLE GEMINI 3.0 • DEEP RESOLVE ENGINE
          </footer>
        </div>
      </div>
    </div>
  );
};

export default App;