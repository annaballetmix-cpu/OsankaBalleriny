import { ArrowLeft, Clock, Heart } from 'lucide-react';
import { useState } from 'react';

interface WorkoutDetailPageProps {
  workout: {
    id: number;
    title: string;
    duration: string;
    videoUrl?: string;
    sectionTitle: string;
  };
  onBack: () => void;
}

export function WorkoutDetailPage({ workout, onBack }: WorkoutDetailPageProps) {
  const [isFavorite, setIsFavorite] = useState(false);

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ background: 'var(--gradient-warm)' }}>
      {/* Decorative Background Elements */}
      <div className="absolute top-20 right-20 w-48 h-48 border border-[#E8C4B8]/30 rounded-full blur-sm" />
      <div className="absolute bottom-40 left-10 w-32 h-32 border-2 border-[#D4A59A]/20 rounded-full" />
      
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        {/* Back Button */}
        <button 
          onClick={onBack}
          className="mb-10 flex items-center gap-2 px-5 py-2.5 rounded-full transition-all duration-300 group border backdrop-blur-sm hover:scale-105"
          style={{
            background: 'var(--gradient-soft)',
            borderColor: '#E8C4B8',
            color: '#6B635D'
          }}
        >
          <ArrowLeft className="w-5 h-5 transform transition-transform duration-200 group-hover:-translate-x-1 text-[#C4938A]" />
          <span className="font-light">Вернуться к {workout.sectionTitle}</span>
        </button>

        {/* Workout Header */}
        <div className="bg-white rounded-2xl overflow-hidden border border-[#C9B8A4]/10 mb-8 shadow-lg">
          <div className="p-10" style={{ background: 'var(--gradient-soft)' }}>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h1 className="text-[#3D2E2B] mb-4">
                  {workout.title}
                </h1>
                <div className="flex items-center gap-2 text-[#6D5D54]">
                  <Clock className="w-4 h-4 text-[#C9B8A4]" />
                  <span className="font-light">{workout.duration}</span>
                </div>
              </div>
              
              {/* Favorite Button */}
              <button
                onClick={() => setIsFavorite(!isFavorite)}
                className="w-12 h-12 flex items-center justify-center rounded-full bg-white hover:bg-[#F5F2EE] transition-all duration-300 border border-[#C9B8A4]/10 group"
              >
                <Heart 
                  className={`w-6 h-6 transition-all duration-300 ${
                    isFavorite 
                      ? 'fill-[#C9B8A4] stroke-[#C9B8A4]' 
                      : 'stroke-[#C9B8A4] group-hover:fill-[#C9B8A4]/20'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Video Section */}
        {workout.videoUrl && (
          <div className="bg-white rounded-2xl overflow-hidden border border-[#C9B8A4]/10 p-8 mb-8 shadow-lg">
            <div className="aspect-video bg-[#F5F2EE] rounded-lg overflow-hidden">
              <iframe
                className="w-full h-full"
                src={workout.videoUrl}
                title={workout.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        )}

        {/* Description Section */}
        <div className="bg-white rounded-2xl overflow-hidden border border-[#C9B8A4]/10 p-10 shadow-lg">
          <h2 className="text-[#3D2E2B] mb-6 text-2xl">О тренировке</h2>
          <div className="space-y-4 text-[#6D5D54] leading-relaxed font-light">
            <p>
              Эта тренировка направлена на улучшение осанки, укрепление мышц спины и развитие гибкости. 
              Выполняйте упражнения плавно, следите за дыханием и своими ощущениями.
            </p>
            <p>
              Во время занятия вы будете работать над:
            </p>
            <ul className="list-disc list-inside space-y-2 pl-4">
              <li>Раскрытием грудного отдела</li>
              <li>Укреплением мышц спины</li>
              <li>Развитием гибкости позвоночника</li>
              <li>Улучшением координации и баланса</li>
            </ul>
            <p className="pt-4 italic text-[#C9B8A4]">
              Рекомендуется выполнять тренировку в комфортной одежде на коврике для йоги.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}