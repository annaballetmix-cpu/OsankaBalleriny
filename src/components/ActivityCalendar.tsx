import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Flame, TrendingUp, Award } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

export function ActivityCalendar() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [completedDays, setCompletedDays] = useState<Set<string>>(new Set());

  // Load completed days from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('ballerina-activity');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setCompletedDays(new Set(parsed));
      } catch (e) {
        console.error('Failed to parse activity data', e);
      }
    }
  }, []);

  // Save to localStorage whenever completedDays changes
  useEffect(() => {
    localStorage.setItem('ballerina-activity', JSON.stringify(Array.from(completedDays)));
  }, [completedDays]);

  // Toggle day completion
  const toggleDay = (dateString: string) => {
    const newCompleted = new Set(completedDays);
    if (newCompleted.has(dateString)) {
      newCompleted.delete(dateString);
      toast.success('День отмечен как невыполненный', {
        duration: 2000,
        style: {
          background: 'linear-gradient(135deg, #F5F1ED 0%, #EDE8E3 100%)',
          border: '1px solid #E8C4B8',
          color: '#6B635D'
        }
      });
    } else {
      newCompleted.add(dateString);
      toast.success('🎉 Тренировка выполнена!', {
        duration: 2000,
        style: {
          background: 'linear-gradient(135deg, #F2DED6 0%, #EDE8E3 100%)',
          border: '1px solid #C4938A',
          color: '#2B2522'
        }
      });
    }
    setCompletedDays(newCompleted);
  };

  // Calculate current streak
  const calculateStreak = () => {
    const today = new Date();
    let streak = 0;
    let checkDate = new Date(today);
    
    while (true) {
      const dateString = checkDate.toISOString().split('T')[0];
      if (completedDays.has(dateString)) {
        streak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }
    
    return streak;
  };

  // Calculate max streak
  const calculateMaxStreak = () => {
    if (completedDays.size === 0) return 0;
    
    const sortedDates = Array.from(completedDays).sort();
    let maxStreak = 1;
    let currentStreak = 1;
    
    for (let i = 1; i < sortedDates.length; i++) {
      const prevDate = new Date(sortedDates[i - 1]);
      const currDate = new Date(sortedDates[i]);
      const diffDays = Math.floor((currDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (diffDays === 1) {
        currentStreak++;
        maxStreak = Math.max(maxStreak, currentStreak);
      } else {
        currentStreak = 1;
      }
    }
    
    return maxStreak;
  };

  // Generate activity data for the specified month
  const generateActivityData = (date: Date) => {
    const daysInMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    // Convert Sunday = 0 to Sunday = 6 (Monday = 0)
    const firstDayOffset = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;
    const today = new Date();
    
    // Add empty cells for offset
    const emptyCells = Array.from({ length: firstDayOffset }, (_, i) => ({
      day: null,
      dateString: '',
      active: false,
      isToday: false
    }));
    
    const days = Array.from({ length: daysInMonth }, (_, i) => {
      const dayDate = new Date(date.getFullYear(), date.getMonth(), i + 1);
      const dateString = dayDate.toISOString().split('T')[0];
      
      return {
        day: i + 1,
        dateString,
        active: completedDays.has(dateString),
        isToday: 
          i + 1 === today.getDate() && 
          date.getMonth() === today.getMonth() && 
          date.getFullYear() === today.getFullYear()
      };
    });
    
    return [...emptyCells, ...days];
  };

  const activities = generateActivityData(currentMonth);
  const monthName = currentMonth.toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' });
  const activeDaysInMonth = activities.filter(a => a.active).length;
  const currentStreak = calculateStreak();
  const maxStreak = calculateMaxStreak();
  const totalCompletedDays = completedDays.size;

  const goToPreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  return (
    <div className="rounded-3xl p-4 sm:p-8 border relative overflow-hidden"
         style={{ 
           background: 'var(--gradient-soft)',
           borderColor: '#E8C4B8',
           boxShadow: 'var(--shadow-elevated)'
         }}>
      
      {/* Decorative corner elements */}
      <div className="absolute top-0 right-0 w-32 h-32 opacity-30"
           style={{ background: 'radial-gradient(circle at top right, #E8C4B8 0%, transparent 70%)' }} />
      <div className="absolute bottom-0 left-0 w-24 h-24 opacity-20"
           style={{ background: 'radial-gradient(circle at bottom left, #C4938A 0%, transparent 70%)' }} />
      
      <div className="relative z-10">
        {/* Header - Mobile Optimized */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 gap-3 sm:gap-0">
          <div>
            <h2 className="text-[#2B2522] mb-1 font-light text-lg sm:text-2xl"
                style={{
                  background: 'linear-gradient(135deg, #2B2522 0%, #B37D6F 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}>
              Календарь активности
            </h2>
            <p className="text-[#6B635D] capitalize font-light text-xs sm:text-sm">{monthName}</p>
          </div>
          
          <div className="flex items-center gap-2 sm:gap-4 justify-between sm:justify-end">
            <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border backdrop-blur-sm"
                 style={{ 
                   background: 'rgba(255, 255, 255, 0.6)',
                   borderColor: '#E8C4B8'
                 }}>
              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full animate-pulse" 
                   style={{ background: 'var(--gradient-terracotta)' }} />
              <span className="text-[#B37D6F] text-[10px] sm:text-xs whitespace-nowrap">{activeDaysInMonth} активных дней</span>
            </div>
            
            <div className="flex items-center gap-1">
              <button
                onClick={goToPreviousMonth}
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-full text-[#C4938A] flex items-center justify-center transition-all duration-300 hover:scale-110 border border-[#E8C4B8]/50 backdrop-blur-sm"
                style={{
                  background: 'rgba(255, 255, 255, 0.8)',
                  boxShadow: 'var(--shadow-soft)'
                }}
              >
                <ChevronLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>
              <button
                onClick={goToNextMonth}
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-full text-[#C4938A] flex items-center justify-center transition-all duration-300 hover:scale-110 border border-[#E8C4B8]/50 backdrop-blur-sm"
                style={{
                  background: 'rgba(255, 255, 255, 0.8)',
                  boxShadow: 'var(--shadow-soft)'
                }}
              >
                <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Gradient Divider */}
        <div className="relative mb-6 h-[2px] overflow-hidden rounded-full">
          <div className="absolute inset-0 bg-[#C4938A]/20" />
          <div className="absolute inset-0 w-1/3 rounded-full animate-pulse"
               style={{ 
                 background: 'var(--gradient-terracotta)',
                 animationDuration: '3s'
               }} />
        </div>

        {/* Statistics Cards - Mobile Optimized */}
        <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-4 sm:mb-6">
          {/* Current Streak */}
          <div className="p-2 sm:p-4 rounded-xl sm:rounded-2xl border backdrop-blur-sm transition-all duration-300 hover:scale-105"
               style={{
                 background: 'rgba(255, 255, 255, 0.7)',
                 borderColor: '#E8C4B8',
                 boxShadow: 'var(--shadow-soft)'
               }}>
            <div className="flex flex-col sm:flex-row items-center sm:gap-3 text-center sm:text-left">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center mb-1 sm:mb-0"
                   style={{ background: 'linear-gradient(135deg, #F2DED6 0%, #EDE8E3 100%)' }}>
                <Flame className="w-4 h-4 sm:w-5 sm:h-5 text-[#C4938A]" />
              </div>
              <div className="min-w-0">
                <p className="text-[9px] sm:text-xs text-[#6B635D] font-light mb-0.5 leading-tight">Текущая серия</p>
                <p className="text-[#2B2522] text-sm sm:text-lg truncate" style={{ fontSize: 'clamp(12px, 3vw, 18px)' }}>
                  {currentStreak} {currentStreak === 1 ? 'д' : 'д'}
                </p>
              </div>
            </div>
          </div>

          {/* Max Streak */}
          <div className="p-2 sm:p-4 rounded-xl sm:rounded-2xl border backdrop-blur-sm transition-all duration-300 hover:scale-105"
               style={{
                 background: 'rgba(255, 255, 255, 0.7)',
                 borderColor: '#E8C4B8',
                 boxShadow: 'var(--shadow-soft)'
               }}>
            <div className="flex flex-col sm:flex-row items-center sm:gap-3 text-center sm:text-left">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center mb-1 sm:mb-0"
                   style={{ background: 'linear-gradient(135deg, #F2DED6 0%, #EDE8E3 100%)' }}>
                <Award className="w-4 h-4 sm:w-5 sm:h-5 text-[#C4938A]" />
              </div>
              <div className="min-w-0">
                <p className="text-[9px] sm:text-xs text-[#6B635D] font-light mb-0.5 leading-tight">Лучшая серия</p>
                <p className="text-[#2B2522] text-sm sm:text-lg truncate" style={{ fontSize: 'clamp(12px, 3vw, 18px)' }}>
                  {maxStreak} {maxStreak === 1 ? 'д' : 'д'}
                </p>
              </div>
            </div>
          </div>

          {/* Total Days */}
          <div className="p-2 sm:p-4 rounded-xl sm:rounded-2xl border backdrop-blur-sm transition-all duration-300 hover:scale-105"
               style={{
                 background: 'rgba(255, 255, 255, 0.7)',
                 borderColor: '#E8C4B8',
                 boxShadow: 'var(--shadow-soft)'
               }}>
            <div className="flex flex-col sm:flex-row items-center sm:gap-3 text-center sm:text-left">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center mb-1 sm:mb-0"
                   style={{ background: 'linear-gradient(135deg, #F2DED6 0%, #EDE8E3 100%)' }}>
                <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-[#C4938A]" />
              </div>
              <div className="min-w-0">
                <p className="text-[9px] sm:text-xs text-[#6B635D] font-light mb-0.5 leading-tight">Всего</p>
                <p className="text-[#2B2522] text-sm sm:text-lg truncate" style={{ fontSize: 'clamp(12px, 3vw, 18px)' }}>
                  {totalCompletedDays} {totalCompletedDays === 1 ? 'д' : 'д'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-2">
          {/* Week day headers */}
          {['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'].map((day) => (
            <div key={day} className="text-center text-[#B37D6F] text-xs py-2 font-light">
              {day}
            </div>
          ))}
          
          {/* Days */}
          {activities.map(({ day, dateString, active, isToday }, index) => (
            <div
              key={`${day}-${index}`}
              onClick={() => day !== null && toggleDay(dateString)}
              className={`aspect-square rounded-xl flex items-center justify-center text-xs transition-all duration-300 cursor-pointer relative overflow-hidden group ${
                day === null
                  ? 'border-transparent pointer-events-none'
                  : 'hover:scale-110 hover:z-10'
              }`}
              style={{
                background: day === null 
                  ? 'transparent'
                  : isToday
                  ? 'var(--gradient-terracotta)'
                  : active
                  ? 'linear-gradient(135deg, #F2DED6 0%, #EDE8E3 100%)'
                  : 'rgba(255, 255, 255, 0.6)',
                border: day === null 
                  ? 'none'
                  : isToday 
                  ? '2px solid #B37D6F'
                  : active
                  ? '1px solid #E8C4B8'
                  : '1px solid rgba(196, 147, 138, 0.15)',
                color: isToday ? '#ffffff' : active ? '#C4938A' : '#6B635D',
                boxShadow: isToday ? 'var(--shadow-glow)' : 'none'
              }}
            >
              {/* Hover glow effect */}
              {day !== null && (
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"
                     style={{ background: 'var(--gradient-terracotta)', filter: 'blur(8px)', zIndex: -1 }} />
              )}
              <span className="relative z-10">{day}</span>
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-6 mt-6 pt-6 border-t"
             style={{ borderColor: 'rgba(232, 196, 184, 0.3)' }}>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg border relative overflow-hidden"
                 style={{ 
                   background: 'linear-gradient(135deg, #F2DED6 0%, #EDE8E3 100%)',
                   borderColor: '#E8C4B8'
                 }}>
              <div className="absolute inset-0 opacity-30"
                   style={{ background: 'radial-gradient(circle at center, #C4938A 0%, transparent 70%)' }} />
            </div>
            <span className="text-[#6B635D] text-xs font-light">Выполнена</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg border"
                 style={{ 
                   background: 'rgba(255, 255, 255, 0.6)',
                   borderColor: 'rgba(196, 147, 138, 0.15)'
                 }} />
            <span className="text-[#6B635D] text-xs font-light">Без активности</span>
          </div>
        </div>
      </div>
    </div>
  );
}