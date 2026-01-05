import { CourseSection } from './components/CourseSection';
import { WorkoutsPage } from './components/WorkoutsPage';
import { WorkoutDetailPage } from './components/WorkoutDetailPage';
import { ProgressPhotosPage } from './components/ProgressPhotosPage';
import { ActivityCalendar } from './components/ActivityCalendar';
import { FavoritesSection } from './components/FavoritesSection';
import { FavoritesPage } from './components/FavoritesPage';
import { Play, Sun, Gift, MessageCircle } from 'lucide-react';
import { useState } from 'react';
import { Toaster } from 'sonner@2.0.3';
import img1 from "figma:asset/5c993789ff5c984980086fc5470c85afd16819fa.png";
import img2 from "figma:asset/6e9366e895eca9001ea8be955f11437c404284ef.png";
import img3 from "figma:asset/9000cedfcc56344d2123d652d1763eae4372296f.png";

export default function App() {
  const [selectedSection, setSelectedSection] = useState<number | null>(null);
  const [selectedWorkout, setSelectedWorkout] = useState<{ id: number; title: string; duration: string; videoUrl?: string; sectionTitle: string } | null>(null);
  const [showProgressPhotos, setShowProgressPhotos] = useState(false);

  const sections = [
    {
      id: 1,
      title: 'Основные тренировки',
      description: 'Комплексные занятия для формирования правильной осанки',
      icon: Play,
      imageUrl: img1,
      lessonsCount: 12,
      duration: '20-30 мин',
      color: 'from-amber-50 to-orange-50',
      weeks: [
        {
          weekNumber: 1,
          title: 'Неделя 1',
          workouts: [
            { id: 1, title: 'Раскрытие грудного отдела', duration: '25 мин', completed: false },
            { id: 2, title: 'Расслабление поясницы через ТБС', duration: '20 мин', completed: false },
            { id: 3, title: 'Укрепляем спину', duration: '28 мин', completed: false },
          ]
        },
        {
          weekNumber: 2,
          title: 'Неделя 2',
          workouts: [
            { id: 4, title: 'Расслабляем поясницу', duration: '30 мин', completed: false },
            { id: 5, title: 'Волны. Мобильность позвоночника', duration: '25 мин', completed: false },
            { id: 6, title: 'Ягодицы без боли в пояснице', duration: '28 мин', completed: false },
          ]
        },
        {
          weekNumber: 3,
          title: 'Неделя 3',
          workouts: [
            { id: 7, title: 'Работа с плечами', duration: '30 мин', completed: false },
            { id: 8, title: 'Сила центра', duration: '27 мин', completed: false },
            { id: 9, title: 'Координация и баланс', duration: '29 мин', completed: false },
          ]
        },
        {
          weekNumber: 4,
          title: 'Неделя 4',
          workouts: [
            { id: 10, title: 'Грация в движении', duration: '30 мин', completed: false },
            { id: 11, title: 'Гибкость позвоночника', duration: '28 мин', completed: false },
            { id: 12, title: 'Финальная тренировка', duration: '35 мин', completed: false },
          ]
        },
      ]
    },
    {
      id: 2,
      title: 'Зарядки',
      description: 'Короткие утренние комплексы для бодрого начала дня',
      icon: Sun,
      imageUrl: img2,
      lessonsCount: 6,
      duration: '5-15 мин',
      color: 'from-yellow-50 to-amber-50',
      workouts: [
        { id: 16, title: 'Расслабление поясницы', duration: '5 мин', completed: false },
        { id: 17, title: 'Суставной разогрев', duration: '5 мин', completed: false },
        { id: 18, title: 'Против сутулости', duration: '5 мин', completed: false },
        { id: 13, title: 'Утренняя растяжка', duration: '10 мин', completed: false },
        { id: 14, title: 'Пробуждение тела', duration: '12 мин', completed: false },
        { id: 15, title: 'Энергия на весь день', duration: '15 мин', completed: false },
      ]
    },
    {
      id: 3,
      title: 'Бонусные тренировки',
      description: 'Специальные упражнения для углубленной работы',
      icon: Gift,
      imageUrl: img3,
      lessonsCount: 5,
      duration: '20-30 мин',
      color: 'from-stone-100 to-amber-100',
      workouts: [
        { id: 8, title: 'Грация в движении', duration: '25 мин', completed: false },
        { id: 9, title: 'Красивая походка', duration: '20 мин', completed: false },
        { id: 10, title: 'Уверенность в теле', duration: '30 мин', completed: false },
      ]
    }
  ];

  const currentSection = sections.find(s => s.id === selectedSection);

  // Handle Progress Photos Page
  if (showProgressPhotos) {
    return (
      <ProgressPhotosPage 
        sectionTitle={currentSection?.title || 'Основные тренировки'}
        onBack={() => setShowProgressPhotos(false)}
      />
    );
  }

  if (selectedWorkout) {
    return (
      <WorkoutDetailPage 
        workout={selectedWorkout} 
        onBack={() => setSelectedWorkout(null)}
      />
    );
  }

  // Handle favorites section
  if (selectedSection === 999) {
    return (
      <FavoritesPage 
        sections={sections}
        onBack={() => setSelectedSection(null)}
        onSelectWorkout={(workout) => setSelectedWorkout(workout)}
      />
    );
  }

  if (selectedSection && currentSection) {
    return (
      <WorkoutsPage 
        section={currentSection} 
        onBack={() => setSelectedSection(null)}
        onSelectWorkout={(workout) => {
          // Check if it's the progress photos banner
          if (workout.id === -1) {
            setShowProgressPhotos(true);
          } else {
            setSelectedWorkout(workout);
          }
        }}
      />
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ background: 'var(--gradient-warm)' }}>
      <Toaster position="top-center" />
      
      {/* Decorative Background Elements */}
      <div className="absolute top-20 right-20 w-48 h-48 border border-[#D4C4B0]/20 rounded-full blur-sm animate-pulse" style={{ animationDuration: '4s' }} />
      <div className="absolute bottom-40 left-10 w-32 h-32 border-2 border-[#C9B8A4]/15 rounded-full" />
      <div className="absolute top-1/2 left-1/4 w-2 h-2 bg-[#C9B8A4]/30 rounded-full blur-sm" />
      <div className="absolute top-1/3 right-1/3 w-3 h-3 bg-[#D4C4B0]/40 rounded-full blur-sm" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
        {/* Header */}
        <header className="text-center mb-24 relative">
          <div className="inline-block mb-6 relative">
            <h1 className="text-[#3D2E2B] tracking-[0.4em] font-light text-4xl relative z-10"
                style={{
                  background: 'linear-gradient(135deg, #3D2E2B 0%, #8C7A6F 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}>
              ОСАНКА БАЛЕРИНЫ
            </h1>
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-12 bg-[#D4C4B0]/15 blur-2xl rounded-full" />
          </div>
          <div className="w-20 h-[2px] mx-auto mb-6 rounded-full" style={{ background: 'var(--gradient-terracotta)' }} />
          <p className="text-[#6D5D54] max-w-2xl mx-auto italic text-lg leading-relaxed font-light">
            ��ация, уверенность и красота в каждом движении
          </p>
        </header>

        {/* Course Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-24">
          {sections.map((section) => (
            <CourseSection 
              key={section.id} 
              section={section}
              onClick={() => setSelectedSection(section.id)}
            />
          ))}
        </div>

        {/* Favorites Section - Compact Banner */}
        <div className="mb-24 max-w-2xl mx-auto">
          <FavoritesSection onClick={() => setSelectedSection(999)} />
        </div>

        {/* Telegram Chat Button */}
        <div className="mb-24 text-center">
          <a 
            href="https://t.me/your_chat_link" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-10 py-5 text-white rounded-full transition-all duration-300 transform hover:-translate-y-1 hover:scale-105 group relative overflow-hidden"
            style={{ 
              background: 'var(--gradient-terracotta)',
              boxShadow: 'var(--shadow-colored)'
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[#C9B8A4] to-[#B8A794] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <MessageCircle className="w-6 h-6 transition-transform duration-300 group-hover:rotate-12 relative z-10" />
            <span className="font-light text-lg relative z-10">Чат участников</span>
          </a>
        </div>

        {/* Activity Calendar */}
        <ActivityCalendar />

        {/* Footer Info */}
        <div className="mt-20 text-center">
          <div className="inline-flex items-center gap-3 px-8 py-4 rounded-full border backdrop-blur-md relative overflow-hidden"
               style={{ 
                 background: 'var(--gradient-soft)',
                 borderColor: '#D4C4B0',
                 boxShadow: 'var(--shadow-soft)'
               }}>
            <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: 'var(--gradient-terracotta)' }} />
            <span className="text-[#6D5D54] text-sm font-light">
              Начните занятия в любое время
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}