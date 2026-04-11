import * as React from 'react';
import { UserCheck, ShieldAlert, CreditCard, Loader2 } from 'lucide-react';

interface SupportAgentProps {
  isWaiting: boolean;
  onPay: () => void;
}

const SupportAgent: React.FC<SupportAgentProps> = ({ isWaiting, onPay }) => {
  return (
    <div className="glass-panel p-6 rounded-2xl border-yellow-500/20 mb-8 overflow-hidden relative">
      <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
        <UserCheck size={120} />
      </div>
      
      <div className="flex flex-col md:flex-row items-center gap-6 relative z-10">
        <div className="flex-shrink-0">
          <div className="w-16 h-16 bg-yellow-500/20 rounded-full flex items-center justify-center border border-yellow-500/30">
            <UserCheck className="w-8 h-8 text-yellow-500" />
          </div>
        </div>
        
        <div className="flex-grow text-center md:text-left">
          <h3 className="text-xl font-bold text-white mb-1">SUPPORT AGENT</h3>
          <p className="text-gray-400 text-sm max-w-lg">
            Human-in-the-loop oversight is available for critical computations. 
            Initiate a high-priority session for real-time verification.
          </p>
        </div>

        <div className="flex-shrink-0 w-full md:w-auto">
          {!isWaiting ? (
            <button 
              onClick={onPay}
              className="w-full md:w-auto px-8 py-3 bg-yellow-500 hover:bg-yellow-400 text-black font-bold rounded-xl transition-all flex items-center justify-center gap-2 group shadow-lg shadow-yellow-500/10"
            >
              <CreditCard size={18} />
              PAY WITH PAYPAL
              <span className="text-xs opacity-60 ml-1 font-mono">$120</span>
            </button>
          ) : (
            <div className="flex flex-col items-center gap-2 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-xl animate-pulse">
              <div className="flex items-center gap-2 text-yellow-500 font-mono text-sm">
                <Loader2 className="w-4 h-4 animate-spin" />
                WAITING FOR VERIFICATION
              </div>
              <p className="text-[10px] text-yellow-500/70 max-w-[200px] text-center">
                I am a gateway only. I cannot verify bank transfers.
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-white/5 flex items-center gap-2 text-[10px] text-gray-500 font-mono uppercase tracking-widest">
        <ShieldAlert size={12} className="text-yellow-500/50" />
        Gateway Protocol Active • Secure Hand-off Only
      </div>
    </div>
  );
};

export default SupportAgent;