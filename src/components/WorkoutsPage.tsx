import { useState, useEffect } from 'react';
import { ArrowLeft, Check, ChevronDown, Clock, Heart, Play, Lock, Camera } from 'lucide-react';
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
  const [completedWorkouts, setCompletedWorkouts] = useState<number[]>([])
  const [currentTime, setCurrentTime] = useState(Date.now());
  
  const Icon = section.icon;

  // Load favorites from localStorage
  useEffect(() => {
    const savedFavorites = localStorage.getItem('workout-favorites');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }

    // Initialize course start date if not set
    if (!localStorage.getItem('course-start-date')) {
      localStorage.setItem('course-start-date', Date.now().toString());
    }

    // Update timer every second
    const timer = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Check if a week is unlocked
  const isWeekUnlocked = (weekNumber: number): boolean => {
    // Always unlock all workouts for sections without weeks (Зарядки, Бонусные)
    if (section.id !== 1) return true;

    const startDate = parseInt(localStorage.getItem('course-start-date') || Date.now().toString());
    const daysPassed = Math.floor((currentTime - startDate) / (1000 * 60 * 60 * 24));
    
    // Week 1 is always unlocked
    if (weekNumber === 1) return true;
    
    // Each subsequent week unlocks after (weekNumber - 1) * 7 days
    return daysPassed >= (weekNumber - 1) * 7;
  };

  // Get time remaining until unlock
  const getTimeUntilUnlock = (weekNumber: number): { days: number; hours: number; minutes: number; seconds: number } => {
    const startDate = parseInt(localStorage.getItem('course-start-date') || Date.now().toString());
    const unlockDate = startDate + (weekNumber - 1) * 7 * 24 * 60 * 60 * 1000;
    const timeRemaining = Math.max(0, unlockDate - currentTime);
    
    const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);
    
    return { days, hours, minutes, seconds };
  };

  const toggleWeek = (weekNumber: number) => {
    setExpandedWeeks(prev => 
      prev.includes(weekNumber)
        ? prev.filter(w => w !== weekNumber)
        : [...prev, weekNumber]
    );
  };

  // Get video URL for specific workout
  const getVideoUrl = (workoutId: number): string => {
    const videoMap: { [key: number]: string } = {
      1: 'https://www.youtube.com/embed/84ANPnayiJE', // Раскрытие грудного отдела (Неделя 1)
      2: 'https://www.youtube.com/embed/w_RoJzpxqbA', // Расслабление поясницы через ТБС
      16: 'https://www.youtube.com/embed/vxJHhy0FKqs', // Расслабление поясницы (зарядка)
      17: 'https://www.youtube.com/embed/Y-x_LNl14wQ', // Суставной разогрев (зарядка)
      // Add more video mappings here as needed
    };
    
    // Return specific video URL if mapped, otherwise return default
    return videoMap[workoutId] || 'https://www.youtube.com/embed/L35FkSd-0d4';
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
            <>
              {/* Progress Photos Banner - Only for main workouts */}
              {section.id === 1 && (
                <div
                  onClick={() => onSelectWorkout({
                    id: -1, // Special ID for progress photos
                    title: 'Фото До / После',
                    duration: '',
                    sectionTitle: section.title
                  })}
                  className="bg-white rounded-2xl overflow-hidden border border-[#C9B8A4]/10 transition-all duration-300 hover:shadow-lg cursor-pointer group mb-6"
                >
                  <div className="p-8 flex items-center justify-between hover:bg-[#F5F2EE]/30 transition-all duration-300">
                    <div className="flex items-center gap-5">
                      <div className="w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-110"
                           style={{ background: 'var(--gradient-soft)' }}>
                        <Camera className="w-7 h-7 text-[#C4938A]" />
                      </div>
                      <div>
                        <h3 className="text-[#3D2E2B] mb-1 text-lg">
                          Фото До / После
                        </h3>
                        <p className="text-[#6D5D54] text-sm font-light">
                          Отслеживайте свой прогресс визуально
                        </p>
                      </div>
                    </div>
                    <div className="w-10 h-10 rounded-full flex items-center justify-center bg-[#C9B8A4]/10 group-hover:bg-[#C9B8A4] transition-all duration-300">
                      <ChevronDown className="w-5 h-5 text-[#C4938A] group-hover:text-white -rotate-90 transition-colors duration-300" />
                    </div>
                  </div>
                </div>
              )}

              {/* Render weeks structure */}
              {weeks.map((week) => {
                const isUnlocked = isWeekUnlocked(week.weekNumber);
                const isExpanded = expandedWeeks.includes(week.weekNumber);
                const weekCompleted = week.workouts.filter(w => completedWorkouts.includes(w.id)).length;
                const weekTotal = week.workouts.length;
                const timeRemaining = !isUnlocked ? getTimeUntilUnlock(week.weekNumber) : null;
                
                return (
                  <div
                    key={week.weekNumber}
                    className={`bg-white rounded-2xl overflow-hidden border transition-all duration-300 ${
                      isUnlocked 
                        ? 'border-[#C4938A]/10' 
                        : 'border-[#C4938A]/5 bg-gradient-to-br from-white to-[#F5F2EE]/30'
                    }`}
                  >
                    {/* Week Header */}
                    <button
                      onClick={() => isUnlocked && toggleWeek(week.weekNumber)}
                      disabled={!isUnlocked}
                      className={`w-full p-8 flex items-center justify-between transition-all duration-300 group ${
                        isUnlocked ? 'hover:bg-[#EDE8E3]/20 cursor-pointer' : 'cursor-not-allowed'
                      }`}
                    >
                      <div className="flex items-center gap-5 flex-1">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 border ${
                          !isUnlocked
                            ? 'bg-[#F5F2EE] text-[#C4938A]/40 border-[#C4938A]/10'
                            : weekCompleted === weekTotal 
                              ? 'bg-[#C4938A] text-white border-[#C4938A]' 
                              : 'bg-white text-[#C4938A] border-[#C4938A]/30'
                        }`}>
                          {!isUnlocked ? (
                            <Lock className="w-5 h-5" />
                          ) : weekCompleted === weekTotal ? (
                            <Check className="w-5 h-5" />
                          ) : (
                            <span className="text-sm">{week.weekNumber}</span>
                          )}
                        </div>
                        <div className="text-left flex-1">
                          <h2 className={`mb-1 ${!isUnlocked ? 'text-[#6B635D]/50' : 'text-[#2B2522]'}`}>
                            {week.title}
                          </h2>
                          {!isUnlocked && timeRemaining ? (
                            <div className="flex items-center gap-2 text-[#C4938A] text-sm font-light">
                              <Clock className="w-3.5 h-3.5" />
                              <span>
                                Откроется через: {timeRemaining.days > 0 && `${timeRemaining.days}д `}
                                {String(timeRemaining.hours).padStart(2, '0')}:
                                {String(timeRemaining.minutes).padStart(2, '0')}:
                                {String(timeRemaining.seconds).padStart(2, '0')}
                              </span>
                            </div>
                          ) : (
                            <p className="text-[#6B635D] text-sm font-light">
                              {weekCompleted} из {weekTotal} тренировок завершено
                            </p>
                          )}
                        </div>
                      </div>
                      {isUnlocked && (
                        <div className={`transform transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
                          <ChevronDown className="w-5 h-5 text-[#C4938A]" />
                        </div>
                      )}
                    </button>

                    {/* Workouts */}
                    {isUnlocked && isExpanded && (
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
                                videoUrl: getVideoUrl(workout.id),
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
              })}
            </>
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
                    videoUrl: getVideoUrl(workout.id),
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