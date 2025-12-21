import { Heart } from 'lucide-react';
import { useState } from 'react';

interface FavoritesSectionProps {
  onClick: () => void;
}

export function FavoritesSection({ onClick }: FavoritesSectionProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="group cursor-pointer"
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="bg-white rounded-2xl overflow-hidden transition-all duration-500 transform hover:-translate-y-2 border border-[#C9B8A4]/10"
           style={{ 
             boxShadow: isHovered ? 'var(--shadow-elevated)' : 'var(--shadow-soft)'
           }}>
        
        {/* Content Section - No Image, Compact Design */}
        <div className="p-6 relative overflow-hidden">
          {/* Decorative Background */}
          <div className="absolute top-0 right-0 w-32 h-32 opacity-5 blur-2xl rounded-full"
               style={{ background: 'var(--gradient-terracotta)' }} />
          
          <div className="relative z-10 flex items-center gap-4">
            {/* Icon Badge */}
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 transform transition-all duration-300 group-hover:scale-110"
                 style={{ 
                   background: 'linear-gradient(135deg, rgba(235, 230, 223, 0.6) 0%, rgba(245, 242, 238, 0.6) 100%)',
                 }}>
              <Heart className="w-6 h-6 text-[#C9B8A4] transition-all duration-300 group-hover:fill-[#C9B8A4]" />
            </div>

            <div className="flex-1">
              {/* Title */}
              <h3 className="text-[#3D2E2B] mb-1 transition-all duration-300 group-hover:text-[#C9B8A4] text-lg">
                Избранное
              </h3>

              {/* Description */}
              <p className="text-[#6D5D54] text-sm leading-relaxed font-light">
                Ваши любимые тренировки в одном месте
              </p>
            </div>

            {/* Arrow Indicator */}
            <div className="flex-shrink-0 transition-transform duration-300 group-hover:translate-x-1">
              <svg 
                className="w-5 h-5 text-[#C9B8A4]" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}