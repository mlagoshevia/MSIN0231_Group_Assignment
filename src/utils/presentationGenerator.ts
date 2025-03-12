
import pptxgen from "pptxgenjs";

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
 * Generate a PowerPoint presentation with UCL branding
 */
export const generatePresentation = (data: PresentationData): Blob => {
  const slides = generateSlides(data);
  const colors = getTemplateColors(data.template);
  
  // Create new PowerPoint presentation
  const pptx = new pptxgen();
  
  // Set presentation properties
  pptx.layout = "LAYOUT_16x9";
  pptx.author = "UCL Presentation Generator";
  pptx.title = data.title;
  pptx.subject = data.purpose;
  
  // Create master slide with UCL branding
  pptx.defineSlideMaster({
    title: "UCL_MASTER",
    background: { color: colors.secondary },
    objects: [
      // Header
      { rect: { x: 0, y: 0, w: '100%', h: 0.5, fill: { color: colors.primary } } },
      // Footer
      { rect: { x: 0, y: '95%', w: '100%', h: 0.3, fill: { color: colors.primary } } },
      { text: { text: "UCL Presentation Generator", x: 0.5, y: '96.5%', w: 4, color: "#FFFFFF", fontSize: 8 } }
    ]
  });
  
  // Generate each slide
  slides.forEach((slide, index) => {
    const pptxSlide = pptx.addSlide({ masterName: "UCL_MASTER" });
    
    if (index === 0) {
      // Title slide
      pptxSlide.addText(slide.title, {
        x: '10%', 
        y: '40%', 
        w: '80%', 
        h: 1.5, 
        fontSize: 44, 
        color: colors.primary, 
        bold: true, 
        align: 'center'
      });
      
      // Purpose and audience
      slide.points.forEach((point, pointIndex) => {
        pptxSlide.addText(point, {
          x: '10%',
          y: `${50 + (pointIndex * 8)}%`,
          w: '80%',
          fontSize: 20,
          color: colors.text === "#FFFFFF" ? "#FFFFFF" : colors.primary,
          align: 'center'
        });
      });
      
      // UCL branding on title slide
      pptxSlide.addText("University College London", {
        x: '10%',
        y: '85%',
        w: '80%',
        fontSize: 14,
        color: colors.primary,
        align: 'center'
      });
    } else {
      // Content slides
      pptxSlide.addText(slide.title, {
        x: 0.5,
        y: 0.7,
        w: '95%',
        fontSize: 32,
        color: colors.text === "#FFFFFF" ? "#FFFFFF" : colors.primary,
        bold: true
      });
      
      // Add bullet points
      slide.points.forEach((point, pointIndex) => {
        pptxSlide.addText(point, {
          x: 0.7,
          y: 1.5 + (pointIndex * 0.6),
          w: '90%',
          fontSize: 18,
          color: colors.text,
          bullet: { type: 'bullet' }
        });
      });
    }
    
    // Add slide number to footer (except title slide)
    if (index > 0) {
      pptxSlide.addText(`Slide ${index + 1}/${slides.length}`, {
        x: '85%',
        y: '96.5%',
        w: 2,
        color: "#FFFFFF",
        fontSize: 8
      });
    }
  });
  
  // Generate the PowerPoint as a Blob
  return pptx.writeFile({ outputType: 'blob' }) as unknown as Blob;
};

/**
 * Trigger download of the presentation
 */
export const downloadPresentation = (blob: Blob, filename: string): void => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename.endsWith(".pptx") ? filename : `${filename}.pptx`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
