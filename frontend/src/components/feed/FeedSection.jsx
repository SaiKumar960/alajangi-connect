import React from 'react';

const FeedSection = ({ title, icon: Icon, children, layout = 'list', className = '' }) => {
  const layouts = {
    list: 'flex flex-col gap-4',
    masonry: 'grid grid-cols-1 md:grid-cols-2 gap-4',
    spotlight: 'flex flex-col' // Specific for Highlight cards
  };

  return (
    <section className={`mb-10 ${className}`}>
      {/* Header */}
      <div className="flex items-center gap-3 mb-5 px-1">
        <div className="p-2 bg-white/5 rounded-xl border border-white/10 text-electric">
          <Icon size={20} />
        </div>
        <h2 className="text-xl font-bold tracking-tight text-white">{title}</h2>
      </div>

      {/* Content */}
      <div className={layouts[layout]}>
        {children}
      </div>
    </section>
  );
};

export default FeedSection;
