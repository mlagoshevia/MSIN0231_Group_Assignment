
import { jsPDF } from "jspdf";

// Define presentation data types
export interface PresentationData {
  title: string;
  bulletPoints: string;
  audience: string;
  purpose: string;
  template: string;
  slideCount: number;
}

interface SlideContent {
  title: string;
  points: string[];
}

/**
 * Parse bullet points from user input
 */
const parseBulletPoints = (bulletPointsText: string): string[] => {
  return bulletPointsText
    .split("\n")
    .map(line => line.trim())
    .filter(line => line.startsWith("-"))
    .map(line => line.substring(1).trim());
};

/**
 * Generate slide contents from bullet points
 */
const generateSlides = (data: PresentationData): SlideContent[] => {
  const points = parseBulletPoints(data.bulletPoints);
  const slides: SlideContent[] = [];
  
  // Title slide
  slides.push({
    title: data.title,
    points: [
      `Purpose: ${data.purpose}`,
      `Audience: ${data.audience}`
    ]
  });
  
  // Content slides - distribute bullet points across slides
  const maxSlidesForContent = data.slideCount - 2; // Minus title and conclusion slides
  
  if (points.length <= maxSlidesForContent) {
    // One point per slide
    points.forEach((point, index) => {
      slides.push({
        title: `Key Point ${index + 1}`,
        points: [point]
      });
    });
  } else {
    // Group points across available slides
    const pointsPerSlide = Math.ceil(points.length / maxSlidesForContent);
    
    for (let i = 0; i < Math.min(maxSlidesForContent, points.length); i++) {
      const startIdx = i * pointsPerSlide;
      const slidePoints = points.slice(startIdx, startIdx + pointsPerSlide);
      
      slides.push({
        title: `Key Points ${startIdx + 1}-${startIdx + slidePoints.length}`,
        points: slidePoints
      });
    }
  }
  
  // Conclusion slide
  slides.push({
    title: "Conclusion",
    points: [
      "Thank you for your attention",
      "Questions?"
    ]
  });
  
  // Trim to requested slide count
  return slides.slice(0, data.slideCount);
};

/**
 * Get UCL template colors based on selected template
 */
const getTemplateColors = (template: string): { primary: string; secondary: string; text: string } => {
  switch (template) {
    case "purple":
      return { primary: "#8A1538", secondary: "#E8E3E7", text: "#000000" }; // UCL Purple
    case "dark":
      return { primary: "#1D1D1D", secondary: "#333333", text: "#FFFFFF" }; // Dark theme
    case "light":
      return { primary: "#F5F5F5", secondary: "#E0E0E0", text: "#000000" }; // Light theme
    case "green":
      return { primary: "#006637", secondary: "#E8F4EB", text: "#000000" }; // UCL Green
    default:
      return { primary: "#8A1538", secondary: "#E8E3E7", text: "#000000" }; // Default to UCL Purple
  }
};

/**
 * Generate a PDF presentation with PowerPoint-like styling
 */
export const generatePresentation = (data: PresentationData): string => {
  const slides = generateSlides(data);
  const colors = getTemplateColors(data.template);
  
  // Create PDF document in landscape orientation (PowerPoint-like)
  const doc = new jsPDF({
    orientation: "landscape",
    unit: "mm",
  });
  
  // Generate each slide
  slides.forEach((slide, index) => {
    if (index > 0) {
      doc.addPage();
    }
    
    // Slide background
    doc.setFillColor(colors.secondary);
    doc.rect(0, 0, 297, 210, "F");
    
    // Header bar (PowerPoint-style)
    doc.setFillColor(colors.primary);
    doc.rect(0, 0, 297, 20, "F");
    
    // Title formatting depends on slide type
    if (index === 0) {
      // Title slide
      doc.setTextColor(colors.primary);
      doc.setFontSize(36);
      doc.setFont("helvetica", "bold");
      doc.text(slide.title, 148.5, 80, { align: "center" });
      
      doc.setFontSize(20);
      doc.setFont("helvetica", "normal");
      slide.points.forEach((point, pointIndex) => {
        doc.text(point, 148.5, 120 + (pointIndex * 15), { align: "center" });
      });
      
      // UCL Logo text placeholder (would be an image in a real implementation)
      doc.setFontSize(14);
      doc.setTextColor(colors.primary);
      doc.text("University College London", 148.5, 190, { align: "center" });
    } else {
      // Content slides
      doc.setTextColor(colors.text === "#FFFFFF" ? "#FFFFFF" : colors.primary);
      doc.setFontSize(28);
      doc.setFont("helvetica", "bold");
      doc.text(slide.title, 20, 40);
      
      // Content with bullet points
      doc.setTextColor(colors.text);
      doc.setFontSize(20);
      doc.setFont("helvetica", "normal");
      
      slide.points.forEach((point, pointIndex) => {
        const yPos = 70 + (pointIndex * 15);
        doc.text(`• ${point}`, 30, yPos);
      });
    }
    
    // Footer with UCL branding and slide number
    doc.setFillColor(colors.primary);
    doc.rect(0, 200, 297, 10, "F");
    
    doc.setFontSize(10);
    doc.setTextColor("#FFFFFF");
    doc.text("UCL Presentation Generator", 20, 207);
    doc.text(`Slide ${index + 1}/${slides.length}`, 250, 207);
  });
  
  // Get the generated PDF as a data URL
  const pdfDataUri = doc.output("datauristring");
  return pdfDataUri;
};

/**
 * Trigger download of the presentation
 */
export const downloadPresentation = (dataUri: string, filename: string): void => {
  const link = document.createElement("a");
  link.href = dataUri;
  link.download = filename.endsWith(".pdf") ? filename : `${filename}.pdf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
