import { useState, useEffect } from 'react';
import { ArrowLeft, Check, ChevronDown, Clock, Heart, Play } from 'lucide-react';
import { LucideIcon } from 'lucide-react';

interface WorkoutsPageProps {
  section: {
    id: number;
    title: string;
    description: string;
    icon: LucideIcon;
    imageUrl: string;
    lessonsCount: number;
    duration: string;
    color: string;
    weeks?: {
      weekNumber: number;
      title: string;
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
  };
  onBack: () => void;
  onSelectWorkout: (workout: { id: number; title: string; duration: string; videoUrl?: string; sectionTitle: string }) => void;
}

export function WorkoutsPage({ section, onBack, onSelectWorkout }: WorkoutsPageProps) {
  const [expandedWeeks, setExpandedWeeks] = useState<number[]>([1]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [completedWorkouts, setCompletedWorkouts] = useState<number[]>([]);
  const [expandedWorkouts, setExpandedWorkouts] = useState<number[]>([]);
  
  const Icon = section.icon;

  // Load favorites from localStorage
  useEffect(() => {
    const savedFavorites = localStorage.getItem('workout-favorites');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  const toggleWeek = (weekNumber: number) => {
    setExpandedWeeks(prev => 
      prev.includes(weekNumber)
        ? prev.filter(w => w !== weekNumber)
        : [...prev, weekNumber]
    );
  };

  const toggleFavorite = (workoutId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newFavorites = favorites.includes(workoutId)
      ? favorites.filter(id => id !== workoutId)
      : [...favorites, workoutId];
    
    setFavorites(newFavorites);
    localStorage.setItem('workout-favorites', JSON.stringify(newFavorites));
  };

  const toggleComplete = (weekNumber: number, workoutId: number) => {
    setCompletedWorkouts(prev => 
      prev.includes(workoutId)
        ? prev.filter(id => id !== workoutId)
        : [...prev, workoutId]
    );
  };

  const toggleWorkoutExpand = (workoutId: number) => {
    setExpandedWorkouts(prev => 
      prev.includes(workoutId)
        ? prev.filter(id => id !== workoutId)
        : [...prev, workoutId]
    );
  };

  // Calculate progress
  const weeks = section.weeks || [];
  const directWorkouts = section.workouts || [];
  const allWorkouts = weeks.length > 0 
    ? weeks.flatMap(w => w.workouts)
    : directWorkouts;
  const completedCount = completedWorkouts.length;
  const progress = allWorkouts.length > 0 ? Math.round((completedCount / allWorkouts.length) * 100) : 0;

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

        {/* Header - Lightweight Design */}
        <div className="mb-16 relative">
          {/* Subtle decorative element */}
          <div className="absolute -top-4 left-12 w-32 h-32 opacity-10 blur-3xl rounded-full"
               style={{ background: 'var(--gradient-terracotta)' }} />
          
          <div className="relative z-10 max-w-3xl">
            {/* Icon and Title */}
            <div className="flex items-center gap-4 mb-3">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center relative"
                   style={{
                     background: 'linear-gradient(135deg, rgba(242, 222, 214, 0.4) 0%, rgba(237, 232, 227, 0.4) 100%)',
                   }}>
                <Icon className="w-6 h-6 text-[#C4938A]" />
              </div>
              <h1 className="text-[#2B2522] font-light tracking-wide"
                  style={{
                    background: 'linear-gradient(135deg, #2B2522 0%, #B37D6F 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                  }}>
                {section.title}
              </h1>
            </div>
            
            {/* Description */}
            <p className="text-[#6B635D] italic font-light text-lg pl-16 mb-6">
              {section.description}
            </p>

            {/* Progress - Minimal Style */}
            <div className="pl-16">
              <div className="flex items-center gap-4 mb-2">
                <span className="text-[#6B635D] text-sm font-light">
                  Прогресс
                </span>
                <span className="text-[#B37D6F] text-sm font-light">
                  {completedCount} из {allWorkouts.length}
                </span>
              </div>
              <div className="w-full max-w-md h-1.5 rounded-full overflow-hidden relative"
                   style={{ background: 'rgba(196, 147, 138, 0.15)' }}>
                <div 
                  className="h-full transition-all duration-700 rounded-full relative"
                  style={{ 
                    width: `${progress}%`,
                    background: 'var(--gradient-terracotta)',
                    boxShadow: progress > 0 ? '0 0 12px rgba(196, 147, 138, 0.4)' : 'none'
                  }}
                >
                  <div className="absolute inset-0 animate-pulse opacity-50"
                       style={{ background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 50%, transparent 100%)' }} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Weeks List */}
        <div className="space-y-6">
          {weeks.length > 0 ? (
            // Render weeks structure
            weeks.map((week) => {
              const isExpanded = expandedWeeks.includes(week.weekNumber);
              const weekCompleted = week.workouts.filter(w => completedWorkouts.includes(w.id)).length;
              const weekTotal = week.workouts.length;
              
              return (
                <div
                  key={week.weekNumber}
                  className="bg-white rounded-2xl overflow-hidden border border-[#C4938A]/10 transition-all duration-300"
                >
                  {/* Week Header */}
                  <button
                    onClick={() => toggleWeek(week.weekNumber)}
                    className="w-full p-8 flex items-center justify-between hover:bg-[#EDE8E3]/20 transition-all duration-300 group"
                  >
                    <div className="flex items-center gap-5">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 border ${
                        weekCompleted === weekTotal 
                          ? 'bg-[#C4938A] text-white border-[#C4938A]' 
                          : 'bg-white text-[#C4938A] border-[#C4938A]/30'
                      }`}>
                        {weekCompleted === weekTotal ? (
                          <Check className="w-5 h-5" />
                        ) : (
                          <span className="text-sm">{week.weekNumber}</span>
                        )}
                      </div>
                      <div className="text-left">
                        <h2 className="text-[#2B2522] mb-1">
                          {week.title}
                        </h2>
                        <p className="text-[#6B635D] text-sm font-light">
                          {weekCompleted} из {weekTotal} тренировок завершено
                        </p>
                      </div>
                    </div>
                    <div className={`transform transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
                      <ChevronDown className="w-5 h-5 text-[#C4938A]" />
                    </div>
                  </button>

                  {/* Workouts */}
                  {isExpanded && (
                    <div className="px-8 pb-8 space-y-4 bg-[#F5F1ED]/30">
                      {week.workouts.map((workout, index) => {
                        const workoutKey = `${week.weekNumber}-${workout.id}`;
                        const isFavorite = favorites.includes(workoutKey);
                        const isCompleted = completedWorkouts.includes(workout.id);

                        return (
                          <div
                            key={workout.id}
                            className="bg-white rounded-xl border border-[#C9B8A4]/10 transition-all duration-300 hover:shadow-lg group/card cursor-pointer"
                            onClick={() => onSelectWorkout({
                              id: workout.id,
                              title: workout.title,
                              duration: workout.duration,
                              videoUrl: 'https://www.youtube.com/embed/L35FkSd-0d4',
                              sectionTitle: section.title
                            })}
                          >
                            <div className="relative p-5 hover:bg-[#F5F2EE]/50 transition-all duration-300">
                              <div className="flex items-center gap-4">
                                {/* Play Icon */}
                                <div className="w-11 h-11 rounded-full bg-[#C9B8A4]/10 flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover/card:bg-[#C9B8A4] group-hover/card:scale-110">
                                  <Play className="w-5 h-5 text-[#C9B8A4] ml-0.5 group-hover/card:text-white transition-colors duration-300" />
                                </div>

                                {/* Title and Duration */}
                                <div className="flex-1">
                                  <h3 className="text-[#3D2E2B] transition-all duration-300 mb-1">
                                    {workout.title}
                                  </h3>
                                  <div className="flex items-center gap-1.5 text-[#6D5D54]">
                                    <Clock className="w-3.5 h-3.5 text-[#C9B8A4]" />
                                    <span className="text-sm font-light">{workout.duration}</span>
                                  </div>
                                </div>

                                {/* Right Side: Check and Heart */}
                                <div className="flex items-center gap-2">
                                  {/* Check Icon */}
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      toggleComplete(week.weekNumber, workout.id);
                                    }}
                                    className={`w-9 h-9 flex items-center justify-center rounded-full transition-all duration-300 ${
                                      isCompleted 
                                        ? 'bg-[#C9B8A4] hover:bg-[#B8A793]' 
                                        : 'hover:bg-[#F5F2EE] border border-[#C9B8A4]/20'
                                    }`}
                                  >
                                    <Check 
                                      className={`w-5 h-5 transition-all duration-300 ${
                                        isCompleted 
                                          ? 'text-white' 
                                          : 'text-[#C9B8A4] opacity-30'
                                      }`}
                                    />
                                  </button>

                                  {/* Heart Icon */}
                                  <button
                                    onClick={(e) => toggleFavorite(workoutKey, e)}
                                    className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-[#F5F2EE] transition-all duration-300 group/heart"
                                  >
                                    <Heart 
                                      className={`w-5 h-5 transition-all duration-300 ${
                                        isFavorite 
                                          ? 'fill-[#C9B8A4] stroke-[#C9B8A4]' 
                                          : 'stroke-[#C9B8A4] group-hover/heart:fill-[#C9B8A4]/20'
                                      }`}
                                    />
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            // Render direct workouts (for Зарядки and Бонусные)
            directWorkouts.map((workout, index) => {
              const workoutKey = `direct-${workout.id}`;
              const isFavorite = favorites.includes(workoutKey);
              const isCompleted = completedWorkouts.includes(workout.id);

              return (
                <div
                  key={workout.id}
                  className="bg-white rounded-xl border border-[#C9B8A4]/10 transition-all duration-300 hover:shadow-lg group/card cursor-pointer"
                  onClick={() => onSelectWorkout({
                    id: workout.id,
                    title: workout.title,
                    duration: workout.duration,
                    videoUrl: 'https://www.youtube.com/embed/L35FkSd-0d4',
                    sectionTitle: section.title
                  })}
                >
                  <div className="relative p-5 hover:bg-[#F5F2EE]/50 transition-all duration-300">
                    <div className="flex items-center gap-4">
                      {/* Play Icon */}
                      <div className="w-11 h-11 rounded-full bg-[#C9B8A4]/10 flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover/card:bg-[#C9B8A4] group-hover/card:scale-110">
                        <Play className="w-5 h-5 text-[#C9B8A4] ml-0.5 group-hover/card:text-white transition-colors duration-300" />
                      </div>

                      {/* Title and Duration */}
                      <div className="flex-1">
                        <h3 className="text-[#3D2E2B] transition-all duration-300 mb-1">
                          {workout.title}
                        </h3>
                        <div className="flex items-center gap-1.5 text-[#6D5D54]">
                          <Clock className="w-3.5 h-3.5 text-[#C9B8A4]" />
                          <span className="text-sm font-light">{workout.duration}</span>
                        </div>
                      </div>

                      {/* Right Side: Check and Heart */}
                      <div className="flex items-center gap-2">
                        {/* Check Icon */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleComplete(0, workout.id);
                          }}
                          className={`w-9 h-9 flex items-center justify-center rounded-full transition-all duration-300 ${
                            isCompleted 
                              ? 'bg-[#C9B8A4] hover:bg-[#B8A793]' 
                              : 'hover:bg-[#F5F2EE] border border-[#C9B8A4]/20'
                          }`}
                        >
                          <Check 
                            className={`w-5 h-5 transition-all duration-300 ${
                              isCompleted 
                                ? 'text-white' 
                                : 'text-[#C9B8A4] opacity-30'
                            }`}
                          />
                        </button>

                        {/* Heart Icon */}
                        <button
                          onClick={(e) => toggleFavorite(workoutKey, e)}
                          className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-[#F5F2EE] transition-all duration-300 group/heart"
                        >
                          <Heart 
                            className={`w-5 h-5 transition-all duration-300 ${
                              isFavorite 
                                ? 'fill-[#C9B8A4] stroke-[#C9B8A4]' 
                                : 'stroke-[#C9B8A4] group-hover/heart:fill-[#C9B8A4]/20'
                            }`}
                          />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}