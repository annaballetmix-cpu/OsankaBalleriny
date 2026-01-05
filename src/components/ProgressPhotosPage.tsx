import { ArrowLeft, Camera, Upload, Image as ImageIcon, Eye, Sparkles, TrendingUp } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

interface ProgressPhotosPageProps {
  sectionTitle: string;
  onBack: () => void;
}

export function ProgressPhotosPage({ sectionTitle, onBack }: ProgressPhotosPageProps) {
  const [beforePhoto, setBeforePhoto] = useState<string | null>(null);
  const [afterPhoto, setAfterPhoto] = useState<string | null>(null);
  const beforeInputRef = useRef<HTMLInputElement>(null);
  const afterInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Load photos from localStorage
    const savedBefore = localStorage.getItem('progress-photo-before');
    const savedAfter = localStorage.getItem('progress-photo-after');
    
    if (savedBefore) setBeforePhoto(savedBefore);
    if (savedAfter) setAfterPhoto(savedAfter);
  }, []);

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>, type: 'before' | 'after') => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      
      if (type === 'before') {
        setBeforePhoto(base64String);
        localStorage.setItem('progress-photo-before', base64String);
      } else {
        setAfterPhoto(base64String);
        localStorage.setItem('progress-photo-after', base64String);
      }
    };
    
    reader.readAsDataURL(file);
  };

  const handleDeletePhoto = (type: 'before' | 'after') => {
    if (type === 'before') {
      setBeforePhoto(null);
      localStorage.removeItem('progress-photo-before');
    } else {
      setAfterPhoto(null);
      localStorage.removeItem('progress-photo-after');
    }
  };

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
          <span className="font-light">Вернуться к {sectionTitle}</span>
        </button>

        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4"
               style={{ background: 'var(--gradient-soft)' }}>
            <Camera className="w-8 h-8 text-[#C4938A]" />
          </div>
          <h1 className="text-[#3D2E2B] mb-4">
            Фото До / После
          </h1>
          <p className="text-[#6D5D54] max-w-2xl mx-auto font-light leading-relaxed">
            Запечатлейте свой путь к совершенству! Сделайте фото в начале курса и сравните результаты через месяц.
          </p>
        </div>

        {/* Motivation Section */}
        <div className="bg-white rounded-2xl p-8 border border-[#C9B8A4]/10 mb-8 shadow-lg">
          <h2 className="text-[#3D2E2B] mb-6 text-xl">Почему это важно?</h2>
          <div className="space-y-5">
            <div className="flex gap-4 items-start">
              <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                   style={{ background: 'var(--gradient-soft)' }}>
                <Eye className="w-5 h-5 text-[#C4938A]" />
              </div>
              <div className="flex-1">
                <p className="text-[#6D5D54] font-light leading-relaxed">
                  <span className="italic text-[#3D2E2B]">Визуальный прогресс</span> — самый мощный мотиватор. Изменения в осанке происходят постепенно, и порой мы не замечаем их в зеркале
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                   style={{ background: 'var(--gradient-soft)' }}>
                <Sparkles className="w-5 h-5 text-[#C4938A]" />
              </div>
              <div className="flex-1">
                <p className="text-[#6D5D54] font-light leading-relaxed">
                  Фотография покажет реальные результаты: как раскрылись плечи, выровнялась спина, появилась грация в силуэте
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                   style={{ background: 'var(--gradient-soft)' }}>
                <TrendingUp className="w-5 h-5 text-[#C4938A]" />
              </div>
              <div className="flex-1">
                <p className="text-[#6D5D54] font-light leading-relaxed">
                  Это ваше доказательство того, что каждая тренировка приближает вас к цели. Сохраните момент "до" — и будьте готовы удивиться через месяц!
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Photo Upload Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Before Photo */}
          <div className="bg-white rounded-2xl overflow-hidden border border-[#C9B8A4]/10 shadow-lg">
            <div className="p-6 border-b border-[#C9B8A4]/10" style={{ background: 'var(--gradient-soft)' }}>
              <h3 className="text-[#3D2E2B] text-lg">Фото "До"</h3>
              <p className="text-[#6D5D54] text-sm font-light mt-1">Начало вашего пути</p>
            </div>
            
            <div className="p-6">
              {beforePhoto ? (
                <div className="space-y-4">
                  <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-[#F5F2EE]">
                    <img 
                      src={beforePhoto} 
                      alt="Фото до" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => beforeInputRef.current?.click()}
                      className="flex-1 px-4 py-3 rounded-xl text-[#6D5D54] border border-[#C9B8A4]/20 hover:bg-[#F5F2EE] transition-all duration-300 font-light"
                    >
                      Заменить фото
                    </button>
                    <button
                      onClick={() => handleDeletePhoto('before')}
                      className="px-4 py-3 rounded-xl text-[#C4938A] border border-[#C4938A]/20 hover:bg-[#C4938A]/5 transition-all duration-300 font-light"
                    >
                      Удалить
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => beforeInputRef.current?.click()}
                  className="w-full aspect-[3/4] rounded-xl border-2 border-dashed border-[#C9B8A4]/30 hover:border-[#C9B8A4]/60 transition-all duration-300 flex flex-col items-center justify-center gap-4 group"
                  style={{ background: 'var(--gradient-soft)' }}
                >
                  <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Upload className="w-8 h-8 text-[#C4938A]" />
                  </div>
                  <div className="text-center">
                    <p className="text-[#3D2E2B] mb-1">Загрузить фото</p>
                    <p className="text-[#6D5D54] text-sm font-light">Нажмите, чтобы выбрать</p>
                  </div>
                </button>
              )}
              
              <input
                ref={beforeInputRef}
                type="file"
                accept="image/*"
                onChange={(e) => handlePhotoUpload(e, 'before')}
                className="hidden"
              />
            </div>
          </div>

          {/* After Photo */}
          <div className="bg-white rounded-2xl overflow-hidden border border-[#C9B8A4]/10 shadow-lg">
            <div className="p-6 border-b border-[#C9B8A4]/10" style={{ background: 'var(--gradient-soft)' }}>
              <h3 className="text-[#3D2E2B] text-lg">Фото "После"</h3>
              <p className="text-[#6D5D54] text-sm font-light mt-1">Ваш результат через месяц</p>
            </div>
            
            <div className="p-6">
              {afterPhoto ? (
                <div className="space-y-4">
                  <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-[#F5F2EE]">
                    <img 
                      src={afterPhoto} 
                      alt="Фото после" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => afterInputRef.current?.click()}
                      className="flex-1 px-4 py-3 rounded-xl text-[#6D5D54] border border-[#C9B8A4]/20 hover:bg-[#F5F2EE] transition-all duration-300 font-light"
                    >
                      Заменить фото
                    </button>
                    <button
                      onClick={() => handleDeletePhoto('after')}
                      className="px-4 py-3 rounded-xl text-[#C4938A] border border-[#C4938A]/20 hover:bg-[#C4938A]/5 transition-all duration-300 font-light"
                    >
                      Удалить
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => afterInputRef.current?.click()}
                  className="w-full aspect-[3/4] rounded-xl border-2 border-dashed border-[#C9B8A4]/30 hover:border-[#C9B8A4]/60 transition-all duration-300 flex flex-col items-center justify-center gap-4 group"
                  style={{ background: 'var(--gradient-soft)' }}
                >
                  <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Upload className="w-8 h-8 text-[#C4938A]" />
                  </div>
                  <div className="text-center">
                    <p className="text-[#3D2E2B] mb-1">Загрузить фото</p>
                    <p className="text-[#6D5D54] text-sm font-light">Нажмите, чтобы выбрать</p>
                  </div>
                </button>
              )}
              
              <input
                ref={afterInputRef}
                type="file"
                accept="image/*"
                onChange={(e) => handlePhotoUpload(e, 'after')}
                className="hidden"
              />
            </div>
          </div>
        </div>

        {/* Tips */}
        <div className="mt-8 p-6 rounded-xl border border-[#C9B8A4]/10" style={{ background: 'var(--gradient-soft)' }}>
          <h3 className="text-[#3D2E2B] mb-3 flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-[#C4938A]" />
            Советы для лучшего сравнения
          </h3>
          <ul className="space-y-2 text-[#6D5D54] text-sm font-light">
            <li>• Фотографируйтесь в одной и той же одежде (облегающей)</li>
            <li>• Используйте одинаковое освещение и ракурс</li>
            <li>• Делайте снимки в профиль и анфас</li>
            <li>• Фотографируйтесь в одно и то же время суток</li>
          </ul>
        </div>
      </div>
    </div>
  );
}