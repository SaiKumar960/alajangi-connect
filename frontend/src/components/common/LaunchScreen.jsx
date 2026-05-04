import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

const LaunchScreen = ({ onComplete }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      if (onComplete) onComplete();
    }, 3500); // 3.5 seconds for the launch experience

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
          className="fixed inset-0 z-[9999] bg-void flex flex-col items-center justify-center p-6 text-center"
        >
          {/* Background effects */}
          <div className="absolute inset-0 neural-bg opacity-30 pointer-events-none"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-electric/20 rounded-full blur-[120px] opacity-50"></div>

          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="relative"
          >
            {/* Logo with Glow */}
            <div className="absolute -inset-4 bg-electric/30 rounded-full blur-2xl opacity-0 animate-pulse-slow"></div>
            <img 
              src="/logo.png" 
              alt="Alajangi Logo" 
              className="w-32 h-32 md:w-48 md:h-48 object-contain relative z-10 drop-shadow-[0_0_25px_rgba(139,92,246,0.6)]" 
            />
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="mt-12 space-y-4"
          >
            <h1 className="text-4xl md:text-6xl font-sans font-bold tracking-tighter text-white">
              Alajangi <span className="text-electric">Connect</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-400 font-medium max-w-md mx-auto leading-relaxed italic">
              "Share your moments. Stand by your people. Stay close, always."
            </p>
          </motion.div>

          {/* Loading line */}
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: '200px' }}
            transition={{ duration: 3, ease: 'linear' }}
            className="absolute bottom-20 h-1 bg-gradient-to-r from-electric to-cyan-400 rounded-full shadow-[0_0_10px_rgba(6,182,212,0.5)]"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LaunchScreen;
