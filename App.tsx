
import React, { useState } from 'react';
import { 
  BookOpen, 
  Settings, 
  Download, 
  Sparkles, 
  Layers, 
  UserCheck, 
  Gamepad2, 
  Users,
  Loader2,
  FileText,
  Presentation,
  BookMarked
} from 'lucide-react';
import { Grade, LessonType, Level, Style, LessonConfig, GeneratedLesson } from './types';
import { GRADES, UNITS, LESSON_TYPES, LEVELS, STYLES } from './constants';
import { generateLessonContent } from './services/geminiService';
import { exportToPPTX } from './services/pptxService';

const App: React.FC = () => {
  const [config, setConfig] = useState<LessonConfig>({
    grade: Grade.GRADE_6,
    unit: 'Unit 1',
    lesson: LessonType.GETTING_STARTED,
    level: Level.STANDARD,
    style: Style.DYNAMIC,
    includeGroupWork: true,
    includeMiniGames: true,
  });

  const [loading, setLoading] = useState(false);
  const [generatedLesson, setGeneratedLesson] = useState<GeneratedLesson | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    try {
      const lesson = await generateLessonContent(config);
      setGeneratedLesson(lesson);
    } catch (err: any) {
      console.error(err);
      setError("Có lỗi xảy ra khi kết nối với AI. Vui lòng kiểm tra lại kết nối và thử lại.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!generatedLesson) return;
    try {
      await exportToPPTX(generatedLesson);
    } catch (err) {
      console.error(err);
      alert("Không thể xuất file PowerPoint. Vui lòng thử lại sau.");
    }
  };

  return (
    <div className="min-h-screen bg-[#f1f5f9] flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl shadow-md">
              <Presentation className="text-white w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold font-brand text-slate-800 leading-none">Gemini Edu <span className="text-blue-600">PPTX Pro</span></h1>
              <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider mt-1">Sư phạm Tiếng Anh Global Success</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
             <div className="hidden lg:flex items-center gap-4 text-sm font-medium mr-4">
               <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full flex items-center gap-1.5">
                 <BookMarked className="w-3.5 h-3.5" /> Grade 6-9
               </span>
               <span className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full flex items-center gap-1.5">
                 <UserCheck className="w-3.5 h-3.5" /> CTGDPT 2018
               </span>
             </div>
             <button 
              onClick={handleGenerate}
              disabled={loading}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white px-6 py-2.5 rounded-full font-bold transition-all shadow-lg hover:shadow-blue-200 active:scale-95"
             >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              {loading ? 'Đang soạn...' : 'Soạn bài ngay'}
             </button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Sidebar Config */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 overflow-hidden relative">
            <div className="absolute top-0 left-0 w-1 h-full bg-blue-600"></div>
            <div className="flex items-center gap-2 mb-6 pb-2 border-b border-slate-50">
              <Settings className="w-5 h-5 text-blue-600" />
              <h2 className="font-bold text-slate-800 uppercase text-xs tracking-widest">Cấu hình bài học</h2>
            </div>

            <div className="space-y-5">
              {/* Grade Selection */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-tighter">Khối lớp</label>
                  <select 
                    value={config.grade}
                    onChange={(e) => setConfig({...config, grade: e.target.value as Grade})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-700 focus:ring-2 focus:ring-blue-500 outline-none transition-all appearance-none cursor-pointer"
                  >
                    {GRADES.map(g => <option key={g} value={g}>Lớp {g}</option>)}
                  </select>
                </div>
                <div>
                   <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-tighter">Đơn vị bài (Unit)</label>
                   <select 
                    value={config.unit}
                    onChange={(e) => setConfig({...config, unit: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-700 focus:ring-2 focus:ring-blue-500 outline-none transition-all appearance-none cursor-pointer"
                   >
                    {UNITS.map(u => <option key={u} value={u}>{u}</option>)}
                   </select>
                </div>
              </div>

              {/* Lesson Type */}
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-tighter">Tiết học (Lesson)</label>
                <select 
                  value={config.lesson}
                  onChange={(e) => setConfig({...config, lesson: e.target.value as LessonType})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-700 focus:ring-2 focus:ring-blue-500 outline-none transition-all appearance-none cursor-pointer"
                >
                  {LESSON_TYPES.map(l => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>

              {/* Level & Style */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-tighter">Mức độ</label>
                  <select 
                    value={config.level}
                    onChange={(e) => setConfig({...config, level: e.target.value as Level})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-700 focus:ring-2 focus:ring-blue-500 outline-none transition-all appearance-none cursor-pointer"
                  >
                    {LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
                  </select>
                </div>
                <div>
                   <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-tighter">Phong cách</label>
                   <select 
                    value={config.style}
                    onChange={(e) => setConfig({...config, style: e.target.value as Style})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-700 focus:ring-2 focus:ring-blue-500 outline-none transition-all appearance-none cursor-pointer"
                   >
                    {STYLES.map(s => <option key={s} value={s}>{s}</option>)}
                   </select>
                </div>
              </div>

              {/* Toggles */}
              <div className="space-y-4 pt-4 border-t border-slate-50">
                <label className="flex items-center justify-between cursor-pointer group p-2 hover:bg-slate-50 rounded-xl transition-colors">
                  <span className="text-sm font-semibold text-slate-700 group-hover:text-blue-600 transition-colors flex items-center gap-2">
                    <Users className="w-4 h-4 text-blue-400" /> Hoạt động nhóm
                  </span>
                  <div className={`w-10 h-6 rounded-full transition-colors relative ${config.includeGroupWork ? 'bg-blue-600' : 'bg-slate-200'}`}>
                    <input 
                      type="checkbox" 
                      className="hidden" 
                      checked={config.includeGroupWork}
                      onChange={() => setConfig({...config, includeGroupWork: !config.includeGroupWork})}
                    />
                    <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${config.includeGroupWork ? 'translate-x-4' : ''}`}></div>
                  </div>
                </label>

                <label className="flex items-center justify-between cursor-pointer group p-2 hover:bg-slate-50 rounded-xl transition-colors">
                  <span className="text-sm font-semibold text-slate-700 group-hover:text-blue-600 transition-colors flex items-center gap-2">
                    <Gamepad2 className="w-4 h-4 text-blue-400" /> Mini game cuối bài
                  </span>
                  <div className={`w-10 h-6 rounded-full transition-colors relative ${config.includeMiniGames ? 'bg-blue-600' : 'bg-slate-200'}`}>
                    <input 
                      type="checkbox" 
                      className="hidden" 
                      checked={config.includeMiniGames}
                      onChange={() => setConfig({...config, includeMiniGames: !config.includeMiniGames})}
                    />
                    <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${config.includeMiniGames ? 'translate-x-4' : ''}`}></div>
                  </div>
                </label>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
             <div className="flex items-center gap-2 mb-3">
               <Sparkles className="w-4 h-4 text-amber-500" />
               <h4 className="text-sm font-bold text-slate-800 uppercase tracking-tighter">Hướng dẫn</h4>
             </div>
             <p className="text-xs text-slate-500 leading-relaxed italic">
               Hệ thống sẽ dựa trên cấu trúc SGK <b>Global Success</b> hiện hành để soạn thảo mục tiêu, từ vựng và bài tập phù hợp với lứa tuổi THCS.
             </p>
          </div>
        </div>

        {/* Content Area */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-2xl text-sm font-medium animate-in fade-in slide-in-from-top-2">
              {error}
            </div>
          )}

          {!generatedLesson && !loading ? (
             <div className="bg-white border-2 border-dashed border-slate-200 rounded-[2.5rem] p-16 flex flex-col items-center justify-center text-center shadow-sm">
                <div className="w-24 h-24 bg-blue-50 rounded-[2rem] flex items-center justify-center mb-8 rotate-3 shadow-inner">
                  <BookOpen className="w-12 h-12 text-blue-400 -rotate-3" />
                </div>
                <h3 className="text-2xl font-bold text-slate-800 mb-3">Sẵn sàng để soạn bài?</h3>
                <p className="text-slate-500 max-w-md mb-10 leading-relaxed">
                  Chọn lớp và bài học bạn muốn soạn, Gemini sẽ tự động thiết kế dàn ý sư phạm và nội dung từng slide theo chuẩn <b>Global Success</b>.
                </p>
                <button 
                  onClick={handleGenerate}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-4 rounded-2xl font-bold transition-all shadow-xl shadow-blue-100 hover:shadow-blue-200 hover:-translate-y-1 active:translate-y-0"
                >
                  Bắt đầu soạn thảo ngay
                </button>
             </div>
          ) : loading ? (
            <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 p-16 flex flex-col items-center justify-center text-center">
               <div className="relative mb-10">
                 <Loader2 className="w-20 h-20 text-blue-600 animate-spin" />
                 <Sparkles className="absolute top-0 right-0 w-6 h-6 text-amber-400 animate-pulse" />
               </div>
               <h3 className="text-2xl font-bold text-slate-800 mb-3">Đang soạn giáo án điện tử...</h3>
               <p className="text-slate-500 max-w-md leading-relaxed">
                 Gemini đang phân tích chương trình <b>Global Success</b> lớp {config.grade} để tạo các slide chất lượng cao. Vui lòng đợi trong giây lát.
               </p>
               <div className="mt-8 flex gap-2">
                 {[1,2,3].map(i => <div key={i} className={`w-2 h-2 rounded-full bg-blue-600 animate-bounce delay-${i*100}`}></div>)}
               </div>
            </div>
          ) : generatedLesson ? (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {/* Preview Header */}
              <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center">
                    <FileText className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-slate-800">Đã hoàn thành soạn bài!</h2>
                    <p className="text-xs text-slate-400 font-mono mt-1">{generatedLesson.fileName}</p>
                  </div>
                </div>
                <button 
                  onClick={handleDownload}
                  className="w-full md:w-auto flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3.5 rounded-2xl font-bold shadow-lg shadow-emerald-100 transition-all hover:-translate-y-1 active:scale-95"
                >
                  <Download className="w-5 h-5" /> Tải về (.pptx)
                </button>
              </div>

              {/* Outline View */}
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 -mr-16 -mt-16 rounded-full"></div>
                <h3 className="font-bold text-slate-800 mb-6 pb-2 border-b flex items-center gap-2 relative z-10">
                   <Layers className="w-5 h-5 text-blue-600" /> Dàn ý bài giảng sư phạm
                </h3>
                <div className="bg-slate-50/80 backdrop-blur-sm p-6 rounded-2xl border border-slate-100 prose prose-slate max-w-none text-slate-700 text-sm leading-relaxed whitespace-pre-line relative z-10">
                  {generatedLesson.outline}
                </div>
              </div>

              {/* Slides Preview */}
              <div className="space-y-6">
                 <div className="flex items-center justify-between px-2">
                   <h3 className="font-bold text-slate-800 flex items-center gap-2 uppercase tracking-widest text-xs">
                     Chi tiết Slide ({generatedLesson.slides.length})
                   </h3>
                 </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {generatedLesson.slides.map((slide, idx) => (
                      <div key={idx} className="group bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl hover:border-blue-200 transition-all duration-300 flex flex-col">
                        <div className="p-5 border-b bg-slate-50 flex items-center justify-between">
                          <div>
                            <span className="text-[10px] font-bold text-blue-500 uppercase tracking-widest block mb-1">Slide {idx + 1}</span>
                            <h4 className="font-bold text-slate-800 text-sm line-clamp-1">{slide.title}</h4>
                          </div>
                          <div className="px-3 py-1 bg-white border border-slate-200 rounded-full text-[10px] font-bold text-slate-500 uppercase shadow-sm">
                            {slide.activityType}
                          </div>
                        </div>
                        <div className="p-6 space-y-3 flex-1 bg-white min-h-[160px]">
                          {slide.points.map((p, pIdx) => (
                            <div key={pIdx} className="flex gap-3 text-xs text-slate-600 leading-relaxed font-medium">
                              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 flex-shrink-0"></span>
                              <span>{p}</span>
                            </div>
                          ))}
                        </div>
                        {slide.teacherNotes && (
                           <div className="p-4 bg-amber-50/50 border-t border-amber-100 flex gap-2">
                             <Sparkles className="w-3.5 h-3.5 text-amber-500 flex-shrink-0 mt-0.5" />
                             <p className="text-[10px] text-amber-800 leading-relaxed italic">
                               <span className="font-bold not-italic">Notes:</span> {slide.teacherNotes}
                             </p>
                           </div>
                        )}
                      </div>
                    ))}
                 </div>
              </div>
            </div>
          ) : null}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-10 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center">
           <div className="flex justify-center gap-6 mb-4">
             <div className="flex flex-col items-center">
               <span className="text-xl font-bold text-slate-800">6-9</span>
               <span className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">Grades</span>
             </div>
             <div className="w-px h-8 bg-slate-200"></div>
             <div className="flex flex-col items-center">
               <span className="text-xl font-bold text-slate-800">12</span>
               <span className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">Units</span>
             </div>
             <div className="w-px h-8 bg-slate-200"></div>
             <div className="flex flex-col items-center">
               <span className="text-xl font-bold text-slate-800">GS</span>
               <span className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">Success</span>
             </div>
           </div>
           <p className="text-slate-500 text-xs font-medium">
             &copy; 2024 Gemini Edu Pro — Công cụ hỗ trợ giáo viên Tiếng Anh Việt Nam.
           </p>
           <p className="text-slate-400 text-[10px] mt-2 max-w-lg mx-auto leading-relaxed">
             Ứng dụng sử dụng trí tuệ nhân tạo Gemini để soạn thảo. Nội dung chỉ mang tính chất tham khảo dựa trên SGK Global Success. Vui lòng hiệu chỉnh nội dung phù hợp với thực tế lớp học.
           </p>
        </div>
      </footer>
    </div>
  );
};

export default App;
