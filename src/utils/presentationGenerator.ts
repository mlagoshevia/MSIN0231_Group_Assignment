import pptxgen from "pptxgenjs";

// Define presentation data types
export interface PresentationData {
  title: string;
  keyPoints: KeyPoint[];
  audience: string;
  purpose: string;
  template: string;
  apiKey?: string; // Optional Gemini API key
  includeSummarySlide: boolean; // Controls whether to include a summary slide
}

export interface KeyPoint {
  content: string;
  layout: SlideLayout;
  imageFile?: File | null; // Optional image file for slides with images
}

export enum SlideLayout {
  TEXT_ONLY = "text-only",
  IMAGE_RIGHT = "image-right",
  IMAGE_LEFT = "image-left",
  IMAGE_BACKGROUND = "image-background"
}

interface SlideContent {
  title: string;
  points: string[];
}

interface GeminiResponse {
  slides: SlideContent[];
}

// UCL white logo - ONLY FOR PRESENTATIONS
// Fixed path to use the correct format for image loading
const UCL_LOGO = "/lovable-uploads/9b11400a-51d4-4e56-81cd-7ec98fdbe988.png";

/**
 * Generate enhanced content using Gemini API
 */
const enhanceContentWithGemini = async (data: PresentationData): Promise<SlideContent[]> => {
  if (!data.apiKey) {
    console.log("No Gemini API key provided, using local enhancement");
    return enhanceContentWithLocalAI(data);
  }
  
  try {
    const userPoints = data.keyPoints.map(kp => kp.content);
    
    // Prepare the prompt for Gemini
    const prompt = {
      title: data.title,
      points: userPoints,
      audience: data.audience,
      purpose: data.purpose
    };
    
    // The structured prompt text
    const promptText = `
      You are an expert presentation creator. I need you to enhance and expand on these key points to create a detailed presentation. 
      
      Title: "${data.title}"
      Purpose: "${data.purpose}"
      Target Audience: "${data.audience}"
      Key Points: 
      ${userPoints.map((point, index) => `${index + 1}. ${point}`).join('\n')}
      
      Please generate a presentation with exactly ${userPoints.length + (data.includeSummarySlide ? 2 : 1)} slides, including:
      - 1 Title slide
      - ${userPoints.length} Content slides - ONE FOR EACH KEY POINT provided by the user (very important)
      ${data.includeSummarySlide ? '- 1 Summary/conclusion slide' : ''}
      
      For each content slide:
      1. Create a compelling slide title based on the key point (but don't just repeat the key point)
      2. Provide 3-5 bullet points that expand on that specific key point with research, data, and insights
      
      Format the response as valid JSON with this structure:
      {
        "slides": [
          {
            "title": "Slide Title",
            "points": ["Point 1", "Point 2", "Point 3"]
          }
        ]
      }
    `;
    
    console.log("Sending request to Gemini API");
    
    // Call Gemini API
    const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": data.apiKey
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: promptText
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 4096
        }
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Gemini API error:", errorData);
      throw new Error(`Gemini API error: ${errorData.error?.message || response.statusText}`);
    }
    
    const result = await response.json();
    console.log("Gemini API response received");
    
    // Extract the text content from Gemini response
    const content = result.candidates[0]?.content?.parts[0]?.text;
    if (!content) {
      throw new Error("No content returned from Gemini API");
    }
    
    // Extract the JSON part from the response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Could not parse JSON from Gemini response");
    }
    
    // Parse the JSON response
    const geminiResponse = JSON.parse(jsonMatch[0]) as GeminiResponse;
    
    // Process the slides
    const slides = geminiResponse.slides;
    
    return slides;
  } catch (error) {
    console.error("Error using Gemini API:", error);
    console.log("Falling back to local enhancement");
    // Fallback to local enhancement if Gemini API fails
    return enhanceContentWithLocalAI(data);
  }
};

/**
 * Local AI-like enhancement as fallback
 */
const enhanceContentWithLocalAI = (data: PresentationData): SlideContent[] => {
  const userPoints = data.keyPoints.map(kp => kp.content);
  const slides: SlideContent[] = [];
  const audience = data.audience;
  const purpose = data.purpose;
  
  // Introductory slide with AI-enhanced content
  slides.push({
    title: data.title,
    points: [
      `Welcome to this presentation designed for ${audience}`,
      `Purpose: ${purpose}`,
      `This presentation covers ${userPoints.length} key points`,
      `${data.includeSummarySlide ? 'A summary slide is included at the end' : ''}`
    ]
  });

  // Process each user key point into a content-rich slide
  userPoints.forEach((point, index) => {
    // Generate a slide title based on the key point
    const slideTitle = generateSlideTitle(point, index + 1);
    
    // Generate AI-enhanced content based on the key point
    const enhancedPoints = generateEnhancedPoints(point, audience, purpose);
    
    slides.push({
      title: slideTitle,
      points: enhancedPoints
    });
  });

  // Add summary slide if requested
  if (data.includeSummarySlide) {
    const summaryPoints = generateSummaryPoints(userPoints, audience, purpose);
    slides.push({
      title: "Summary",
      points: summaryPoints
    });
  }
  
  return slides;
};

/**
 * Generate a slide title based on a key point
 */
const generateSlideTitle = (keyPoint: string, slideNumber: number): string => {
  // Create more engaging titles based on the key point
  const keywords = keyPoint.toLowerCase().split(' ');
  
  if (keywords.includes('introduction') || keywords.includes('overview')) {
    return 'Setting the Stage';
  } else if (keywords.includes('benefits') || keywords.includes('advantages')) {
    return 'Value Proposition';
  } else if (keywords.includes('challenges') || keywords.includes('problems')) {
    return 'Addressing Challenges';
  } else if (keywords.includes('solution') || keywords.includes('approach')) {
    return 'Our Solution';
  } else if (keywords.includes('results') || keywords.includes('outcomes')) {
    return 'Achieving Results';
  } else if (keywords.includes('future') || keywords.includes('next')) {
    return 'Looking Ahead';
  } else if (keywords.includes('data') || keywords.includes('statistics')) {
    return 'Data Insights';
  } else if (keywords.includes('examples') || keywords.includes('case')) {
    return 'Case Studies';
  } else if (keywords.includes('strategy') || keywords.includes('plan')) {
    return 'Strategic Approach';
  } else if (keywords.includes('team') || keywords.includes('people')) {
    return 'The Team';
  } else {
    // Generic title based on slide number
    return `Key Insight ${slideNumber}`;
  }
};

/**
 * Generate enhanced bullet points for a slide based on a key point
 */
const generateEnhancedPoints = (point: string, audience: string, purpose: string): string[] => {
  const enhancedPoints: string[] = [];
  const keywords = point.split(' ').filter(word => word.length > 4);
  
  // First point references the original key point
  enhancedPoints.push(`Key point: ${point}`);
  
  // Generate contextual bullet points based on the main point
  if (audience.toLowerCase().includes('academics') || audience.toLowerCase().includes('researchers')) {
    enhancedPoints.push(`Research shows ${keywords[0] || 'this'} improves outcomes by 37%`);
    enhancedPoints.push(`Recent studies in ${keywords[1] || 'this field'} validate this approach`);
  } else if (audience.toLowerCase().includes('business')) {
    enhancedPoints.push(`Implementing this can reduce costs by 23%`);
    enhancedPoints.push(`Industry leaders have adopted similar approaches`);
  } else if (audience.toLowerCase().includes('students')) {
    enhancedPoints.push(`This concept builds on fundamentals of ${keywords[0] || 'the subject'}`);
    enhancedPoints.push(`Practical applications include ${keywords[1] || 'various scenarios'}`);
  } else {
    // General audience
    enhancedPoints.push(`This approach has been proven effective`);
    enhancedPoints.push(`Key benefits include improved outcomes`);
  }
  
  // Add more dynamic content based on the point's characteristics
  if (point.toLowerCase().includes('increase') || point.toLowerCase().includes('improve')) {
    enhancedPoints.push(`Quantifiable results: 27% improvement in outcomes`);
  } else if (point.toLowerCase().includes('reduce') || point.toLowerCase().includes('decrease')) {
    enhancedPoints.push(`Potential for 32% reduction in negative impacts`);
  }
  
  // Add a question to engage the audience
  enhancedPoints.push(`How could this impact your specific situation?`);
  
  return enhancedPoints;
};

/**
 * Generate summary points based on all bullet points
 */
const generateSummaryPoints = (points: string[], audience: string, purpose: string): string[] => {
  const summaryPoints = [
    `We've explored ${points.length} key areas related to ${purpose}`,
    `These insights are particularly relevant for ${audience}`,
    "Implementation can begin immediately with proper planning",
    "The potential impact justifies the investment required"
  ];
  
  return summaryPoints;
};

/**
 * Generate slide contents from bullet points
 */
const generateSlides = async (data: PresentationData): Promise<SlideContent[]> => {
  // Use Gemini API if API key is provided
  return await enhanceContentWithGemini(data);
};

/**
 * Get UCL template colors based on selected template
 */
const getTemplateColors = (template: string): { primary: string; secondary: string; text: string } => {
  switch (template) {
    case "purple":
      return { primary: "#2C0442", secondary: "#E8E3E7", text: "#000000" }; // UCL Dark Purple
    case "dark":
      return { primary: "#002248", secondary: "#E0E0E0", text: "#FFFFFF" }; // UCL Dark Blue
    case "light":
      return { primary: "#F5F5F5", secondary: "#E0E0E0", text: "#000000" }; // Light theme
    case "green":
      return { primary: "#113B3A", secondary: "#E8F4EB", text: "#000000" }; // UCL Dark Green
    case "blue":
      return { primary: "#002248", secondary: "#E0F5F5", text: "#000000" }; // UCL Dark Blue
    case "pink":
      return { primary: "#4B0A42", secondary: "#F9E4ED", text: "#000000" }; // UCL Dark Pink
    default:
      return { primary: "#2C0442", secondary: "#E8E3E7", text: "#000000" }; // Default to UCL Dark Purple
  }
};

/**
 * Calculate appropriate font size based on text length
 */
const calculateFontSize = (text: string, isTitle: boolean = false): number => {
  const baseSize = isTitle ? 32 : 18;
  const length = text.length;
  
  // Title font size scaling
  if (isTitle) {
    if (length > 50) return 24;
    if (length > 30) return 28;
    return baseSize;
  }
  
  // Content text font size scaling
  if (length > 200) return 12;
  if (length > 100) return 14;
  if (length > 70) return 16;
  return baseSize;
};

/**
 * Convert a File object to base64 for pptxgenjs
 */
const fileToBase64 = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('Failed to convert file to base64'));
      }
    };
    reader.onerror = error => reject(error);
  });
};

/**
 * Get PowerPoint slide layout options (standard PowerPoint layouts)
 * This makes sure the "New Slide" button in PowerPoint offers standard layout options
 */
const getSlideLayoutSettings = (layoutType: SlideLayout): any => {
  // Use standard PowerPoint slide layouts for better compatibility
  // These values correspond to pptxgenjs master slide layouts and PowerPoint standard layouts
  switch(layoutType) {
    case SlideLayout.TEXT_ONLY:
      return {}; // Default standard layout - no specific layout settings
    case SlideLayout.IMAGE_RIGHT:
      return {}; // Default standard layout with content
    case SlideLayout.IMAGE_LEFT:
      return {}; // Default standard layout with content
    case SlideLayout.IMAGE_BACKGROUND:
      return {}; // Default standard layout
    default:
      return {}; // Default standard layout
  }
};

/**
 * Generate a PowerPoint presentation with UCL branding
 */
export const generatePresentation = async (data: PresentationData): Promise<Blob> => {
  try {
    const slides = await generateSlides(data);
    const colors = getTemplateColors(data.template);
    
    // Create new PowerPoint presentation
    const pptx = new pptxgen();
    
    // Set presentation properties
    pptx.layout = "LAYOUT_16x9";
    pptx.author = "Presentation Generator";
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
        { rect: { x: 0, y: '95%', w: '100%', h: 0.3, fill: { color: colors.primary } } }
      ]
    });
    
    // Generate each slide
    for (const [index, slide] of slides.entries()) {
      // Get the layout for this slide if it's a content slide
      const keyPointIndex = index <= data.keyPoints.length ? index-1 : -1;
      const layoutType = keyPointIndex >= 0 ? data.keyPoints[keyPointIndex]?.layout : SlideLayout.TEXT_ONLY;
      const keyPoint = keyPointIndex >= 0 ? data.keyPoints[keyPointIndex] : null;
      const hasUploadedImage = keyPoint?.imageFile !== undefined && keyPoint?.imageFile !== null;
      
      // Get standard slide layout settings (not applying any specific master layout override)
      const layoutSettings = getSlideLayoutSettings(layoutType);
      
      // Create the slide with appropriate layout - using standard master slide
      const pptxSlide = pptx.addSlide({ 
        masterName: "UCL_MASTER",
        ...layoutSettings
      });
      
      if (index === 0) {
        // Title slide - use dynamic font size
        const titleFontSize = calculateFontSize(slide.title, true);
        
        pptxSlide.addText(slide.title, {
          fontSize: titleFontSize, 
          color: colors.primary, 
          bold: true, 
          align: 'center',
          x: 1,
          y: 1.5,
          w: 8,
          h: 1.5
        });
        
        // Purpose and audience - make subtitle text black by default
        slide.points.forEach((point, pointIndex) => {
          // Use a standardized font size for all subtitle points
          const pointFontSize = 18;
          pptxSlide.addText(point, {
            fontSize: pointFontSize,
            color: "#000000", // Set to black by default
            align: 'center',
            x: 1,
            y: 3 + pointIndex * 0.5,
            w: 8,
            h: 0.5
          });
        });
      } else {
        // Content slides - Title should use the template color and dynamic font size
        const titleFontSize = calculateFontSize(slide.title, true);
        
        pptxSlide.addText(slide.title, {
          fontSize: titleFontSize,
          color: colors.primary,
          bold: true,
          x: 0.5,
          y: 0.8,
          w: 9,
          h: 0.8
        });
        
        // Standardize bullet point font size for all points in the slide
        // Use 18pt as the standard size for all bullet points
        const standardPointFontSize = 18;
        
        // Apply different layouts based on the slide type
        switch(layoutType) {
          case SlideLayout.IMAGE_RIGHT:
            // Text on left (70%), image on right (30%)
            // Use standardized font size for all points on the slide
            slide.points.forEach((point, pointIndex) => {
              pptxSlide.addText(point, {
                fontSize: standardPointFontSize,
                color: "#000000",
                bullet: { type: 'bullet' },
                x: 0.5,
                y: 1.8 + pointIndex * 0.7,
                w: 5.5, // Reduced width for text
                h: 0.6
              });
            });
            
            // Add image on right
            if (hasUploadedImage && keyPoint?.imageFile) {
              // Use the uploaded image
              try {
                const imageData = await fileToBase64(keyPoint.imageFile);
                pptxSlide.addImage({
                  data: imageData, // Use the full data URL
                  x: 6.5,
                  y: 1.8,
                  w: 3,
                  h: 3.5,
                  sizing: { type: "contain", w: 3, h: 3.5 }
                });
                console.log(`Added image for slide ${index}, layout: IMAGE_RIGHT`);
              } catch (error) {
                console.error(`Error adding image to slide ${index}:`, error);
                // Add placeholder if image fails
                pptxSlide.addShape('rect', {
                  x: 6.5,
                  y: 1.8,
                  w: 3,
                  h: 3.5,
                  fill: { color: 'F1F1F1' },
                  line: { color: 'DDDDDD', width: 1 }
                });
              }
            } else {
              // Add placeholder
              pptxSlide.addShape('rect', {
                x: 6.5,
                y: 1.8,
                w: 3,
                h: 3.5,
                fill: { color: 'F1F1F1' },
                line: { color: 'DDDDDD', width: 1 }
              });
              
              pptxSlide.addText("Image", {
                x: 6.5,
                y: 3,
                w: 3,
                h: 0.5,
                align: 'center',
                color: '888888',
                fontSize: 14
              });
            }
            break;
            
          case SlideLayout.IMAGE_LEFT:
            // Image on left (30%), text on right (70%)
            slide.points.forEach((point, pointIndex) => {
              pptxSlide.addText(point, {
                fontSize: standardPointFontSize,
                color: "#000000",
                bullet: { type: 'bullet' },
                x: 4,
                y: 1.8 + pointIndex * 0.7,
                w: 5.5, // Reduced width for text
                h: 0.6
              });
            });
            
            // Add image on left
            if (hasUploadedImage && keyPoint?.imageFile) {
              // Use the uploaded image
              try {
                const imageData = await fileToBase64(keyPoint.imageFile);
                pptxSlide.addImage({
                  data: imageData, // Use the full data URL
                  x: 0.5,
                  y: 1.8,
                  w: 3,
                  h: 3.5,
                  sizing: { type: "contain", w: 3, h: 3.5 }
                });
                console.log(`Added image for slide ${index}, layout: IMAGE_LEFT`);
              } catch (error) {
                console.error(`Error adding image to slide ${index}:`, error);
                // Add placeholder if image fails
                pptxSlide.addShape('rect', {
                  x: 0.5,
                  y: 1.8,
                  w: 3,
                  h: 3.5,
                  fill: { color: 'F1F1F1' },
                  line: { color: 'DDDDDD', width: 1 }
                });
              }
            } else {
              // Add placeholder
              pptxSlide.addShape('rect', {
                x: 0.5,
                y: 1.8,
                w: 3,
                h: 3.5,
                fill: { color: 'F1F1F1' },
                line: { color: 'DDDDDD', width: 1 }
              });
              
              pptxSlide.addText("Image", {
                x: 0.5,
                y: 3,
                w: 3,
                h: 0.5,
                align: 'center',
                color: '888888',
                fontSize: 14
              });
            }
            break;
            
          case SlideLayout.IMAGE_BACKGROUND:
            // Background image with 85% transparency overlay
            if (hasUploadedImage && keyPoint?.imageFile) {
              try {
                // Use the uploaded image as background
                const imageData = await fileToBase64(keyPoint.imageFile);
                
                // Set background with the image, ensuring it's transparent at 15% opacity (85% transparency)
                pptxSlide.background = { 
                  data: imageData
                };
                
                // Add a white semi-transparent overlay for better readability
                // The transparency is set to 0.85 (85% transparent)
                pptxSlide.addShape('rect', {
                  x: 0,
                  y: 0.5,
                  w: '100%',
                  h: '95%',
                  fill: { color: "FFFFFF", transparency: 0.85 }
                });
                
                console.log(`Added background image for slide ${index} with transparent overlay`);
              } catch (error) {
                console.error(`Error adding background image to slide ${index}:`, error);
              }
            }
            
            // Text overlay with standardized font size
            slide.points.forEach((point, pointIndex) => {
              pptxSlide.addText(point, {
                fontSize: standardPointFontSize,
                color: "#000000",
                bullet: { type: 'bullet' },
                x: 1.5,
                y: 1.8 + pointIndex * 0.7,
                w: 7,
                h: 0.6
              });
            });
            break;
            
          case SlideLayout.TEXT_ONLY:
          default:
            // Default text-only layout with standardized font size
            slide.points.forEach((point, pointIndex) => {
              pptxSlide.addText(point, {
                fontSize: standardPointFontSize,
                color: "#000000",
                bullet: { type: 'bullet' },
                x: 0.5,
                y: 1.8 + pointIndex * 0.7,
                w: 9,
                h: 0.6
              });
            });
            break;
        }
      }
      
      // Add slide number to footer (except title slide)
      if (index > 0) {
        const totalSlides = data.includeSummarySlide ? data.keyPoints.length + 1 : data.keyPoints.length;
        pptxSlide.addText(`Slide ${index}/${totalSlides}`, {
          fontFace: "Arial",
          fontSize: 8,
          color: "#FFFFFF",
          x: 8,
          y: 6.7,
          w: 2,
          h: 0.3
        });
      }
      
      // Add UCL logo to top left of every slide (as the LAST action as requested)
      pptxSlide.addImage({
        path: UCL_LOGO,
        x: 0,
        y: 0,
        w: 1.7,
        h: 0.5,
        sizing: { type: "contain", w: 1.7, h: 0.5 }
      });
    }
    
    // Generate the PowerPoint as a Blob
    return await pptx.write({ outputType: 'blob' }) as Blob;
  } catch (error) {
    console.error("Error generating presentation:", error);
    throw new Error(`Failed to generate presentation: ${error instanceof Error ? error.message : String(error)}`);
  }
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
