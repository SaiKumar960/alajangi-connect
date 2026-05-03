import React from 'react';

const GlowButton = ({ 
  children, 
  variant = 'primary', // primary, secondary, ghost, danger
  size = 'md', // sm, md, lg
  fullWidth = false,
  disabled = false,
  loading = false,
  className = '',
  ...props 
}) => {
  const baseStyles = "relative inline-flex items-center justify-center font-medium rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-void disabled:opacity-50 disabled:cursor-not-allowed group overflow-hidden";
  
  const sizeStyles = {
    sm: "px-4 py-1.5 text-sm",
    md: "px-6 py-2.5 text-base",
    lg: "px-8 py-3 text-lg"
  };
  
  const widthStyle = fullWidth ? "w-full" : "";

  const variants = {
    primary: "bg-gradient-to-r from-electric to-cyan-500 text-white hover:shadow-[0_0_20px_rgba(139,92,246,0.6)] focus:ring-electric",
    secondary: "bg-white/5 border border-white/10 text-white hover:bg-white/10 hover:border-electric/50 focus:ring-electric",
    ghost: "bg-transparent text-gray-300 hover:text-white hover:bg-white/5 focus:ring-gray-500",
    danger: "bg-danger/10 border border-danger/30 text-danger hover:bg-danger hover:text-white focus:ring-danger hover:shadow-[0_0_20px_rgba(239,68,68,0.4)]",
  };

  return (
    <button
      className={`${baseStyles} ${sizeStyles[size]} ${widthStyle} ${variants[variant]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {/* Animated background glow on hover for primary */}
      {variant === 'primary' && !disabled && (
        <div className="absolute inset-0 bg-white/20 translate-y-[100%] group-hover:translate-y-[0%] transition-transform duration-300 ease-out"></div>
      )}

      {/* Content wrapper */}
      <div className="relative flex items-center justify-center gap-2">
        {loading ? (
          <span className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"></span>
        ) : children}
      </div>
    </button>
  );
};

export default GlowButton;
