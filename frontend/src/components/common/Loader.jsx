import React from 'react';

const Loader = ({ fullPage = false, inline = false, text = '' }) => {
  const PulseDots = () => (
    <div className="flex items-center justify-center gap-1.5">
      <div className="w-2.5 h-2.5 bg-electric rounded-full animate-[bounce_1s_infinite_0ms] shadow-[0_0_8px_rgba(139,92,246,0.8)]"></div>
      <div className="w-2.5 h-2.5 bg-cyan-400 rounded-full animate-[bounce_1s_infinite_200ms] shadow-[0_0_8px_rgba(6,182,212,0.8)]"></div>
      <div className="w-2.5 h-2.5 bg-electric rounded-full animate-[bounce_1s_infinite_400ms] shadow-[0_0_8px_rgba(139,92,246,0.8)]"></div>
    </div>
  );

  if (inline) {
    return <PulseDots />;
  }

  if (fullPage) {
    return (
      <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-void">
        <div className="relative">
          {/* Glowing orbital ring */}
          <div className="absolute -inset-8 border border-white/5 rounded-full animate-[spin_4s_linear_infinite]">
            <div className="absolute top-0 left-1/2 w-3 h-3 -ml-1.5 -mt-1.5 bg-electric rounded-full shadow-[0_0_15px_rgba(139,92,246,1)]"></div>
            <div className="absolute bottom-0 left-1/2 w-2 h-2 -ml-1 -mb-1 bg-cyan-400 rounded-full shadow-[0_0_10px_rgba(6,182,212,1)]"></div>
          </div>
          <img src="/logo.png" alt="Loading" className="w-16 h-16 object-contain animate-pulse" />
        </div>
        <p className="mt-12 text-gray-400 font-mono text-sm tracking-widest uppercase animate-pulse">
          {text || 'Initializing System'}
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-8 gap-4">
      <PulseDots />
      {text && <p className="text-gray-400 text-sm font-medium">{text}</p>}
    </div>
  );
};

export default Loader;
