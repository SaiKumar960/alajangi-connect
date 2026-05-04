import React from 'react';
import SuggestedUsers from '../user/SuggestedUsers';
import { RiLightbulbLine, RiFireLine, RiUserFollowLine, RiRadarLine } from 'react-icons/ri';
import { useAuth } from '../../hooks/useAuth';

const AIInsightsPanel = () => {
  const { user } = useAuth();

  // Real-time trends will be fetched from API in Phase 2
  const trendingTopics = [];

  return (
    <div className="sticky top-24 w-80 flex-col gap-6 hidden lg:flex">
      
      {/* Panel 1: People Like You */}
      <div className="glass-panel rounded-2xl p-5 border border-white/5 relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-4 opacity-10 text-cyan-400 group-hover:opacity-20 transition-opacity">
          <RiUserFollowLine size={80} />
        </div>
        
        <div className="flex items-center gap-2 mb-4 relative z-10">
          <RiLightbulbLine className="text-cyan-400" size={20} />
          <h3 className="font-semibold text-white">Who to follow</h3>
        </div>
        
        <p className="text-xs text-gray-400 mb-4 relative z-10">
          Suggested profiles based on your interests.
        </p>

        <div className="relative z-10">
          <SuggestedUsers layout="vertical" />
        </div>
      </div>

      {/* Panel 2: Trending Topics */}
      <div className="glass-panel rounded-2xl p-5 border border-white/5 relative overflow-hidden group">
        <div className="absolute -right-4 -bottom-4 opacity-5 text-electric group-hover:opacity-100 transition-opacity">
          <RiFireLine size={120} />
        </div>

        <div className="flex items-center gap-2 mb-4 relative z-10">
          <RiRadarLine className="text-electric" size={20} />
          <h3 className="font-semibold text-white">Trending Topics</h3>
        </div>

        <div className="flex flex-col gap-3 relative z-10">
          {trendingTopics.length > 0 ? trendingTopics.map((topic, i) => (
            <div key={topic.tag} className="flex items-center justify-between group/tag cursor-pointer">
              <span className="text-sm font-medium text-gray-300 group-hover/tag:text-electric transition-colors">
                {topic.tag}
              </span>
              <div className="flex items-center gap-2">
                <div className="w-16 h-1 bg-white/5 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-electric to-cyan-400" 
                    style={{ width: `${topic.score}%` }}
                  ></div>
                </div>
                <span className="text-[10px] text-gray-500 font-mono w-6 text-right">
                  {topic.score}
                </span>
              </div>
            </div>
          )) : (
            <div className="py-2 text-center">
              <p className="text-[10px] text-gray-500 font-mono tracking-widest uppercase">Analyzing Network...</p>
            </div>
          )}
        </div>
      </div>

      {/* Footer info */}
      <div className="text-xs text-gray-500 text-center mt-2 font-mono flex items-center justify-center gap-2">
        <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse"></span>
        Alajangi Network Online
      </div>
      <p className="text-[10px] text-gray-600 text-center">
        © 2026 Alajangi Connect. All rights reserved.
      </p>
    </div>
  );
};

export default AIInsightsPanel;
