import React from 'react';
import getMediaUrl from '../../utils/getMediaUrl';

const Avatar = ({ src, name, size = 'md', className = '' }) => {
  const seed = name ? encodeURIComponent(name) : 'User';
  // Futuristic DiceBear avatar fallback
  const fallback = `https://api.dicebear.com/7.x/bottts/svg?seed=${seed}&colors=8b5cf6,06b6d4,161625&texture=circuits`;

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24',
    xxl: 'w-32 h-32'
  };

  const finalSrc = src ? getMediaUrl(src) : fallback;

  return (
    <div className={`relative inline-block ${sizeClasses[size]} ${className} group`}>
      {/* Outer Glow Ring on Hover */}
      <div className="absolute -inset-1 bg-gradient-to-tr from-electric to-cyan-500 rounded-full blur-sm opacity-0 group-hover:opacity-70 transition-opacity duration-300"></div>
      
      {/* Avatar Image */}
      <img
        src={finalSrc}
        alt={name || 'Avatar'}
        className="w-full h-full object-cover rounded-full border-2 border-white/10 relative z-10 bg-void"
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = fallback;
        }}
      />
    </div>
  );
};

export default Avatar;
