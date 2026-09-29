import React from 'react';

interface LoadingProps {
  message?: string;
  submessage?: string;
}

export const Loading: React.FC<LoadingProps> = ({ 
  message = 'Đang thêu dệt tà áo...', 
  submessage = 'Hòa quyện tinh hoa nghìn năm cùng nhịp sống đương đại'
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#FBF8F3]/85 backdrop-blur-sm transition-all duration-300">
      <div className="flex flex-col items-center max-w-sm px-6 text-center">
        {/* Rotating Sun / Lac Bird Motif */}
        <div className="relative w-20 h-20 mb-4 flex items-center justify-center">
          {/* Outer ring */}
          <div className="absolute inset-0 rounded-full border-2 border-dashed border-[#9B2226]/40 animate-spin" style={{ animationDuration: '10s' }} />
          {/* Inner ring spinning opposite */}
          <div className="absolute inset-2 rounded-full border border-[#D4A373] animate-spin" style={{ animationDuration: '6s', animationDirection: 'reverse' }} />
          {/* Dong Son 8-ray sun in center */}
          <div className="text-[#9B2226] animate-pulse">
            <svg viewBox="0 0 40 40" className="w-10 h-10" fill="currentColor">
              <circle cx="20" cy="20" r="4" fill="#9B2226" />
              {Array.from({ length: 8 }).map((_, i) => (
                <polygon
                  key={i}
                  points="20,8 18.5,15 20,16 21.5,15"
                  transform={`rotate(${i * 45} 20 20)`}
                />
              ))}
            </svg>
          </div>
        </div>

        <h3 className="font-heritage text-lg font-bold text-[#800E13] tracking-wide">
          {message}
        </h3>
        {submessage && (
          <p className="mt-1 text-xs text-[#6C584C] font-light">
            {submessage}
          </p>
        )}
      </div>
    </div>
  );
};
