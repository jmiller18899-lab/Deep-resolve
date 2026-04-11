import * as React from 'react';
import { Settings, ShieldCheck, Link2 } from 'lucide-react';

interface AdminSidebarProps {
  paypalLink: string;
  setPaypalLink: (val: string) => void;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ paypalLink, setPaypalLink }) => {
  return (
    <div className="w-80 h-full border-r border-white/5 bg-black/40 backdrop-blur-xl flex flex-col p-6 overflow-y-auto">
      <div className="flex items-center gap-3 mb-10">
        <div className="p-2 bg-primary/10 rounded-lg">
          <Settings size={18} className="text-primary" />
        </div>
        <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-gray-400">Admin Settings</h2>
      </div>

      <div className="space-y-8">
        <div className="space-y-3">
          <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest">
            Payment Gateway
          </label>
          <div className="space-y-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-600">
                <Link2 size={14} />
              </div>
              <input 
                type="text" 
                value={paypalLink}
                onChange={(e) => setPaypalLink(e.target.value)}
                placeholder="paypal.me/handle"
                className="w-full bg-white/5 border border-white/10 rounded-lg py-2 pl-9 pr-3 text-sm text-gray-300 focus:outline-none focus:border-primary/50 placeholder:text-gray-700 transition-colors"
              />
            </div>
            <p className="text-[10px] text-gray-600 leading-relaxed italic">
              * Shorthand characters (+, .paypal) will be automatically stripped during hand-off.
            </p>
          </div>
        </div>

        <div className="pt-6 border-t border-white/5">
          <div className="flex items-center gap-2 text-[10px] text-gray-500 font-mono mb-4">
            <ShieldCheck size={12} className="text-success/50" />
            GATEWAY STATUS: READY
          </div>
          <div className="p-4 bg-white/5 rounded-xl border border-white/5">
             <div className="w-full h-1 bg-white/10 rounded-full mb-3 overflow-hidden">
                <div className="w-full h-full bg-success/50"></div>
             </div>
             <p className="text-[9px] text-gray-600 font-mono">
                System monitoring enabled. Verification state will persist until manual override or session reset.
             </p>
          </div>
        </div>
      </div>

      <div className="mt-auto pt-6 text-[9px] text-gray-700 font-mono uppercase text-center tracking-widest">
        DeepResolve v3.1.0-Admin
      </div>
    </div>
  );
};

export default AdminSidebar;