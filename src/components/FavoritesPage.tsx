import { useState, useEffect } from 'react';
import { ArrowLeft, Heart, Play, Check, Clock } from 'lucide-react';

interface FavoritesPageProps {
  sections: {
    id: number;
    title: string;
    weeks?: {
      weekNumber: number;
      workouts: {
        id: number;
        title: string;
        duration: string;
        completed: boolean;
      }[];
    }[];
    workouts?: {
      id: number;
      title: string;
      duration: string;
      completed: boolean;
    }[];
  }[];
  onBack: () => void;
  onSelectWorkout: (workout: { id: number; title: string; duration: string; videoUrl?: string; sectionTitle: string }) => void;
}

export function FavoritesPage({ sections, onBack, onSelectWorkout }: FavoritesPageProps) {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [completedWorkouts, setCompletedWorkouts] = useState<number[]>([]);

  // Load favorites from localStorage
  useEffect(() => {
    const savedFavorites = localStorage.getItem('workout-favorites');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  const toggleFavorite = (workoutKey: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newFavorites = favorites.includes(workoutKey)
      ? favorites.filter(id => id !== workoutKey)
      : [...favorites, workoutKey];
    
    setFavorites(newFavorites);
    localStorage.setItem('workout-favorites', JSON.stringify(newFavorites));
  };

  const toggleComplete = (workoutId: number) => {
    setCompletedWorkouts(prev => 
      prev.includes(workoutId)
        ? prev.filter(id => id !== workoutId)
        : [...prev, workoutId]
    );
  };

  // Collect all workouts from all sections
  const allWorkouts: Array<{ 
    id: number; 
    title: string; 
    duration: string; 
    sectionTitle: string;
    workoutKey: string;
    sectionId: number;
    weekNumber?: number;
  }> = [];

  sections.forEach(section => {
    if (section.weeks) {
      section.weeks.forEach(week => {
        week.workouts.forEach(workout => {
          const workoutKey = `${week.weekNumber}-${workout.id}`;
          allWorkouts.push({
            ...workout,
            sectionTitle: section.title,
            workoutKey,
            sectionId: section.id,
            weekNumber: week.weekNumber
          });
        });
      });
    } else if (section.workouts) {
      section.workouts.forEach(workout => {
        const workoutKey = `direct-${workout.id}`;
        allWorkouts.push({
          ...workout,
          sectionTitle: section.title,
          workoutKey,
          sectionId: section.id
        });
      });
    }
  });

  // Filter workouts that are in favorites
  const favoriteWorkouts = allWorkouts.filter(workout => 
    favorites.includes(workout.workoutKey)
  );

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ background: 'var(--gradient-warm)' }}>
      {/* Decorative Background Elements */}
      <div className="absolute top-20 right-20 w-48 h-48 border border-[#E8C4B8]/30 rounded-full blur-sm" />
      <div className="absolute bottom-40 left-10 w-32 h-32 border-2 border-[#D4A59A]/20 rounded-full" />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
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
          <span className="font-light">Вернуться к разделам</span>
        </button>

        {/* Header */}
        <div className="mb-16 relative">
          <div className="absolute -top-4 left-12 w-32 h-32 opacity-10 blur-3xl rounded-full"
               style={{ background: 'var(--gradient-terracotta)' }} />
          
          <div className="relative z-10 max-w-3xl">
            <div className="flex items-center gap-4 mb-3">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center relative"
                   style={{
                     background: 'linear-gradient(135deg, rgba(242, 222, 214, 0.4) 0%, rgba(237, 232, 227, 0.4) 100%)',
                   }}>
                <Heart className="w-6 h-6 text-[#C4938A] fill-[#C4938A]" />
              </div>
              <h1 className="text-[#2B2522] font-light tracking-wide"
                  style={{
                    background: 'linear-gradient(135deg, #2B2522 0%, #B37D6F 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                  }}>
                Избранное
              </h1>
            </div>
            
            <p className="text-[#6B635D] italic font-light text-lg pl-16">
              Ваши любимые тренировки в одном месте
            </p>
          </div>
        </div>

        {/* Favorite Workouts List */}
        {favoriteWorkouts.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-24 h-24 mx-auto mb-6 rounded-3xl flex items-center justify-center"
                 style={{
                   background: 'linear-gradient(135deg, rgba(242, 222, 214, 0.4) 0%, rgba(237, 232, 227, 0.4) 100%)',
                 }}>
              <Heart className="w-12 h-12 text-[#C4938A]" />
            </div>
            <h3 className="text-[#2B2522] mb-3">
              Пока нет избранных тренировок
            </h3>
            <p className="text-[#6B635D] font-light">
              Отмечайте понравившиеся тренировки сердечком, чтобы добавить их сюда
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {favoriteWorkouts.map((workout) => {
              const isCompleted = completedWorkouts.includes(workout.id);
              
              return (
                <div
                  key={workout.workoutKey}
                  className="relative bg-white rounded-xl p-6 hover:shadow-xl transition-all duration-300 border border-[#C4938A]/10 cursor-pointer group/workout"
                >
                  {/* Heart Icon - Filled */}
                  <button
                    onClick={(e) => toggleFavorite(workout.workoutKey, e)}
                    className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-white hover:bg-[#EDE8E3] transition-all duration-300 border border-[#C4938A]/10 group/heart"
                  >
                    <Heart 
                      className="w-5 h-5 transition-all duration-300 fill-[#C4938A] stroke-[#C4938A]"
                    />
                  </button>

                  <div 
                    className="flex items-start gap-6 pr-12"
                    onClick={() => {
                      const videoUrl = workout.id === 18 ? 'https://www.youtube.com/embed/L35FkSd-0d4?autoplay=1&mute=1' : undefined;
                      if (videoUrl) {
                        onSelectWorkout({
                          id: workout.id,
                          title: workout.title,
                          duration: workout.duration,
                          videoUrl,
                          sectionTitle: workout.sectionTitle
                        });
                      } else {
                        toggleComplete(workout.id);
                      }
                    }}
                  >
                    {/* Play/Check Icon */}
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                      isCompleted 
                        ? 'bg-[#C4938A] text-white' 
                        : 'bg-[#EDE8E3] text-[#C4938A]'
                    }`}>
                      {isCompleted ? (
                        <Check className="w-6 h-6" />
                      ) : (
                        <Play className="w-5 h-5 ml-0.5" />
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <div className="mb-2">
                        <span className="text-xs text-[#C4938A] font-light">
                          {workout.sectionTitle}
                        </span>
                      </div>
                      <h3 className="mb-2 transition-all duration-300 text-[#2B2522]">
                        {workout.title}
                      </h3>
                      <div className="flex items-center gap-2 text-[#6B635D]">
                        <Clock className="w-4 h-4 text-[#C4938A]" />
                        <span className="text-sm">{workout.duration}</span>
                      </div>
                    </div>
                  </div>

                  {/* Hover indicator */}
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#C4938A] transform scale-x-0 group-hover/workout:scale-x-100 transition-transform duration-300 rounded-b-xl" />
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
