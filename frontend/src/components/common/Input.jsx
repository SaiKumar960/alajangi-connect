import React from 'react';

const Input = React.forwardRef(({ 
  label, 
  error, 
  icon: Icon,
  className = '', 
  ...props 
}, ref) => {
  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-300 mb-1.5 ml-1">
          {label}
        </label>
      )}
      
      <div className="relative group">
        {/* Animated glow ring behind the input */}
        <div className="absolute -inset-0.5 bg-gradient-to-r from-electric to-cyan-500 rounded-xl blur opacity-0 group-focus-within:opacity-30 transition duration-500"></div>
        
        <div className="relative flex items-center bg-void/50 border border-white/10 rounded-xl overflow-hidden focus-within:border-electric/50 transition-colors">
          {Icon && (
            <div className="pl-4 pr-2 text-gray-400 group-focus-within:text-electric transition-colors">
              <Icon size={20} />
            </div>
          )}
          
          <input
            ref={ref}
            className={`w-full bg-transparent text-white px-4 py-3 focus:outline-none placeholder-gray-600 ${!Icon ? 'pl-4' : 'pl-0'}`}
            {...props}
          />
        </div>
      </div>
      
      {error && (
        <p className="mt-1.5 text-sm text-danger ml-1 flex items-center gap-1 animate-in fade-in slide-in-from-top-1">
          <span className="w-1 h-1 rounded-full bg-danger"></span>
          {error}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
