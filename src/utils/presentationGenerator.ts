
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
        title: `Point ${index + 1}`,
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
 * Get template colors based on selected template
 */
const getTemplateColors = (template: string): { primary: string; secondary: string; text: string } => {
  switch (template) {
    case "purple":
      return { primary: "#8f1f6a", secondary: "#d6d3d8", text: "#000000" };
    case "dark":
      return { primary: "#1c1c1c", secondary: "#333333", text: "#ffffff" };
    case "light":
      return { primary: "#f5f5f5", secondary: "#e0e0e0", text: "#000000" };
    case "green":
      return { primary: "#006653", secondary: "#d6edde", text: "#000000" };
    default:
      return { primary: "#8f1f6a", secondary: "#d6d3d8", text: "#000000" }; // Default to UCL Purple
  }
};

/**
 * Generate a PDF presentation and trigger download
 */
export const generatePresentation = (data: PresentationData): string => {
  const slides = generateSlides(data);
  const colors = getTemplateColors(data.template);
  
  // Create PDF document
  const doc = new jsPDF({
    orientation: "landscape",
    unit: "mm",
  });
  
  // Generate each slide
  slides.forEach((slide, index) => {
    if (index > 0) {
      doc.addPage();
    }
    
    // Background
    doc.setFillColor(colors.secondary);
    doc.rect(0, 0, 297, 210, "F");
    
    // Header bar
    doc.setFillColor(colors.primary);
    doc.rect(0, 0, 297, 20, "F");
    
    // Title
    doc.setTextColor(index === 0 ? colors.text : "#ffffff");
    doc.setFontSize(index === 0 ? 30 : 24);
    doc.text(slide.title, 20, index === 0 ? 60 : 35);
    
    // Content
    doc.setTextColor(colors.text);
    doc.setFontSize(16);
    
    slide.points.forEach((point, pointIndex) => {
      const yPos = (index === 0 ? 80 : 50) + (pointIndex * 12);
      doc.text(`• ${point}`, 30, yPos);
    });
    
    // Footer with UCL branding
    doc.setFontSize(10);
    doc.setTextColor(colors.text);
    doc.text("UCL Presentation Generator", 20, 200);
    doc.text(`Slide ${index + 1}/${slides.length}`, 250, 200);
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
