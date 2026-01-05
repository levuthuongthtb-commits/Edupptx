
import pptxgen from "pptxgenjs";
import { GeneratedLesson, SlideContent } from "../types";

export async function exportToPPTX(lesson: GeneratedLesson) {
  const pres = new pptxgen();
  
  // Master Slide Setup
  pres.defineSlideMaster({
    title: "MASTER_SLIDE",
    background: { color: "FFFFFF" },
    objects: [
      { rect: { x: 0, y: 0, w: "100%", h: 0.6, fill: { color: "3b82f6" } } },
      { text: { text: "Global Success English - Grade " + lesson.fileName.split('_')[1], options: { x: 0.2, y: 0.1, color: "FFFFFF", fontSize: 14 } } },
    ],
  });

  lesson.slides.forEach((slideData: SlideContent, idx: number) => {
    const slide = pres.addSlide({ masterName: idx === 0 ? undefined : "MASTER_SLIDE" });
    
    if (idx === 0) {
      // Title Slide
      slide.background = { color: "3b82f6" };
      slide.addText(slideData.title, { 
        x: 0.5, y: 2.0, w: "90%", 
        fontSize: 36, color: "FFFFFF", 
        bold: true, align: "center", fontFace: "Quicksand" 
      });
      slide.addText(slideData.points.join("\n"), { 
        x: 0.5, y: 3.5, w: "90%", 
        fontSize: 18, color: "FFFFFF", 
        align: "center" 
      });
    } else {
      // Content Slides
      slide.addText(slideData.title, { 
        x: 0.5, y: 0.7, w: "90%", 
        fontSize: 28, color: "1e293b", 
        bold: true, fontFace: "Quicksand" 
      });

      const bodyText = slideData.points.map(p => `• ${p}`).join("\n\n");
      slide.addText(bodyText, { 
        x: 0.5, y: 1.5, w: "90%", h: 3.5,
        fontSize: 20, color: "334155", 
        valign: "top",
        bullet: true
      });

      // Add activity badge
      slide.addText(slideData.activityType, {
        x: 8.0, y: 0.1, w: 1.8, h: 0.4,
        fontSize: 12, color: "FFFFFF",
        fill: { color: "f59e0b" },
        align: "center",
        bold: true
      });
    }
  });

  await pres.writeFile({ fileName: lesson.fileName });
}
