import { BookOpen, Clock } from 'lucide-react';
import { LucideIcon } from 'lucide-react';
import { useState } from 'react';

interface CourseSectionProps {
  section: {
    id: number;
    title: string;
    description: string;
    icon: LucideIcon;
    imageUrl: string;
    lessonsCount: number;
    duration: string;
    color: string;
  };
  onClick: () => void;
}

export function CourseSection({ section, onClick }: CourseSectionProps) {
  const [isHovered, setIsHovered] = useState(false);
  const Icon = section.icon;

  return (
    <div
      className="group cursor-pointer"
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="bg-white rounded-3xl overflow-hidden transition-all duration-500 transform hover:-translate-y-3"
           style={{ 
             boxShadow: isHovered ? 'var(--shadow-elevated)' : 'var(--shadow-soft)'
           }}>
        
        {/* Image Section */}
        <div className="relative h-52 overflow-hidden">
          <img
            src={section.imageUrl}
            alt={section.title}
            className={`w-full h-full object-cover transition-all duration-700 ${
              isHovered ? 'scale-110 brightness-105' : 'scale-100'
            }`}
            style={{ display: 'block' }}
          />

          {/* Icon Badge */}
          <div className="absolute bottom-4 left-4">
            <div className="w-12 h-12 bg-white/95 backdrop-blur-md rounded-full flex items-center justify-center transform transition-all duration-300 group-hover:scale-110 border border-white/30"
                 style={{ 
                   boxShadow: isHovered ? '0 8px 24px rgba(201, 184, 164, 0.25)' : '0 4px 12px rgba(0, 0, 0, 0.1)'
                 }}>
              <Icon className="w-5 h-5 text-[#C9B8A4] transition-colors duration-300 group-hover:text-[#B8A794]" />
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-6">
          {/* Title */}
          <h3 className="text-[#3D2E2B] mb-2.5 transition-all duration-300 group-hover:text-[#C9B8A4]">
            {section.title}
          </h3>

          {/* Description */}
          <p className="text-[#6D5D54] text-sm mb-5 leading-relaxed font-light">
            {section.description}
          </p>

          {/* Meta Information */}
          <div className="flex items-center gap-5 text-[#6D5D54]">
            <div className="flex items-center gap-2 transition-transform duration-300 group-hover:translate-x-1">
              <div className="w-7 h-7 rounded-full flex items-center justify-center"
                   style={{ background: 'linear-gradient(135deg, #EBE6DF 0%, #F5F2EE 100%)' }}>
                <BookOpen className="w-3.5 h-3.5 text-[#C9B8A4]" />
              </div>
              <span className="text-xs font-light">{section.lessonsCount} тренировок</span>
            </div>
            <div className="flex items-center gap-2 transition-transform duration-300 group-hover:translate-x-1">
              <div className="w-7 h-7 rounded-full flex items-center justify-center"
                   style={{ background: 'linear-gradient(135deg, #EBE6DF 0%, #F5F2EE 100%)' }}>
                <Clock className="w-3.5 h-3.5 text-[#C9B8A4]" />
              </div>
              <span className="text-xs font-light">{section.duration}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}