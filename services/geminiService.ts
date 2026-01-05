
import { GoogleGenAI, Type } from "@google/genai";
import { LessonConfig, GeneratedLesson } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export async function generateLessonContent(config: LessonConfig): Promise<GeneratedLesson> {
  const prompt = `
    Bạn là một giáo viên Tiếng Anh THCS chuyên gia về bộ sách Global Success (Kết nối tri thức với cuộc sống).
    Hãy soạn nội dung bài giảng PowerPoint chuyên nghiệp, bám sát CTGDPT 2018 cho:
    
    THÔNG TIN BÀI HỌC:
    - Lớp: ${config.grade}
    - Sách: Global Success (Bộ Kết nối tri thức)
    - ${config.unit}
    - Tiết học (Lesson): ${config.lesson}
    - Mức độ: ${config.level}
    - Phong cách giảng dạy: ${config.style}
    - Bao gồm: ${config.includeGroupWork ? 'Hoạt động nhóm (Group work)' : ''} ${config.includeMiniGames ? 'Mini game sinh động' : ''}

    YÊU CẦU NỘI DUNG TỪNG SLIDE (Mỗi slide ≤ 6 dòng text):
    1. Slide 1 (Introduction): Tên Unit, Lesson, và 3-4 Objectives (Mục tiêu bài học) bằng Tiếng Anh.
    2. Slide 2 (Warm-up): 1 trò chơi nhỏ (Lead-in) hoặc 3-5 câu hỏi thảo luận liên quan đến chủ đề bài học.
    3. Slide 3-5 (Presentation): 
       - Từ vựng: Liệt kê 5-7 từ mới quan trọng nhất của tiết học kèm IPA, Word class, Meaning (Tiếng Việt) và Example.
       - Ngữ pháp (nếu có): Cấu trúc, công thức rõ ràng, có ví dụ minh họa sinh động.
    4. Slide 6-8 (Practice): 
       - Các bài tập từ SGK được chuyển đổi thành dạng dễ dạy (Trắc nghiệm/Điền từ/Nối).
       - Có đáp án (Answers) hiển thị rõ ràng.
    5. Slide 9 (Production): Hoạt động luyện tập thực tế (Nói/Viết/Đóng vai) áp dụng kiến thức vừa học.
    6. Slide 10 (Consolidation): Tóm tắt lại 3 điểm chính đã học (Summary).
    7. Slide 11 (Homework): 2-3 nhiệm vụ về nhà kèm lời dặn dò.

    LƯU Ý QUAN TRỌNG:
    - Ngôn ngữ: Sử dụng Tiếng Anh là chính. Chú thích Tiếng Việt ở các phần giải nghĩa từ vựng hoặc hướng dẫn bài tập khó.
    - Kiến thức: Phải chuẩn xác theo chương trình Global Success của Bộ Giáo dục & Đào tạo Việt Nam.
    - Sư phạm: Các hoạt động phải phát triển được 4 kỹ năng (Nghe - Nói - Đọc - Viết).
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          outline: { type: Type.STRING, description: "Tóm tắt sư phạm của bài giảng" },
          fileName: { type: Type.STRING, description: "Tên file theo chuẩn: English_Lop_Unit_Lesson_GlobalSuccess.pptx" },
          slides: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING, description: "Tiêu đề Slide" },
                points: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Nội dung chính của slide (tối đa 6 dòng)" },
                teacherNotes: { type: Type.STRING, description: "Hướng dẫn dành cho giáo viên khi dạy slide này" },
                activityType: { type: Type.STRING, description: "Loại hoạt động: Vocabulary, Grammar, Practice, Game..." }
              },
              required: ["title", "points", "activityType"]
            }
          }
        },
        required: ["outline", "slides", "fileName"]
      }
    }
  });

  const jsonStr = response.text || '';
  return JSON.parse(jsonStr) as GeneratedLesson;
}
