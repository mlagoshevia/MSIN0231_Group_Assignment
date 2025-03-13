
import pptxgen from "pptxgenjs";

// Define presentation data types
export interface PresentationData {
  title: string;
  keyPoints: string[];
  audience: string;
  purpose: string;
  template: string;
  apiKey?: string; // Optional Gemini API key
  slideImages: boolean[]; // Array of booleans for images per slide
}

interface SlideContent {
  title: string;
  points: string[];
  image?: string;
}

interface GeminiResponse {
  slides: SlideContent[];
}

// UCL campus images - excluding the logo
const UCL_IMAGES = [
  "public/lovable-uploads/acda080f-a4c5-4cfe-bec2-ea5bd50a72a9.png",
  "public/lovable-uploads/6b83f318-76b7-404a-83ca-9f60be513eb0.png",
  "public/lovable-uploads/e4b472d5-865e-4cb1-8fec-f80be909c236.png",
  "public/lovable-uploads/d7b8167b-481f-4054-951f-42e5a4ee01d8.png",
  "public/lovable-uploads/5938d1c9-574c-44a7-9d45-334cf5ce65ec.png",
  "public/lovable-uploads/20bba994-fe28-4d19-b7bf-57f9cecc04c5.png",
  "public/lovable-uploads/91972324-64c1-4c6b-80f7-58d8d483171b.png",
  "public/lovable-uploads/191fae70-1c3c-4031-9f58-0776a5d9de10.png",
  "public/lovable-uploads/dc58b3fd-75c7-468e-94be-8dbb433d088d.png",
  "public/lovable-uploads/acac0ed1-4db7-4b9d-a7ed-4ef3e795d0fc.png",
  "public/lovable-uploads/aade0ccc-38eb-42d1-b595-9ca4ea4d9984.png",
  "public/lovable-uploads/d626aca5-5787-4ae5-90e4-08aa2f9f1156.png",
  "public/lovable-uploads/6b904904-4b1e-445c-bc68-c2e676f71f8e.png"
];

// UCL logo (separate from random images)
const UCL_LOGO = "public/lovable-uploads/702c3a84-29b0-4240-848a-6ea26b3efe60.png";

// Get a random image from the UCL images collection
const getRandomImage = (): string => {
  const randomIndex = Math.floor(Math.random() * UCL_IMAGES.length);
  return UCL_IMAGES[randomIndex];
};

/**
 * Generate enhanced content using Gemini API
 */
const enhanceContentWithGemini = async (data: PresentationData): Promise<SlideContent[]> => {
  if (!data.apiKey) {
    console.log("No Gemini API key provided, using local enhancement");
    return enhanceContentWithLocalAI(data);
  }
  
  try {
    const userPoints = data.keyPoints;
    
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
      
      Please generate a presentation with exactly ${userPoints.length + 2} slides, including:
      - 1 Title slide
      - ${userPoints.length} Content slides - ONE FOR EACH KEY POINT provided by the user (very important)
      - 1 Summary/conclusion slide
      
      For each content slide:
      1. Use the exact key point as the slide title
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
    
    // Process the slides - add images only for the title slide and the slides where images are enabled
    return processSlideImagesPerSlide(geminiResponse.slides, data.slideImages);
  } catch (error) {
    console.error("Error using Gemini API:", error);
    console.log("Falling back to local enhancement");
    // Fallback to local enhancement if Gemini API fails
    return enhanceContentWithLocalAI(data);
  }
};

/**
 * Process slides to add images based on per-slide settings
 */
const processSlideImagesPerSlide = (slides: SlideContent[], slideImages: boolean[]): SlideContent[] => {
  // Process the slides and add images where enabled
  return slides.map((slide, index) => {
    // Always add image to title slide (index 0) and summary slide (last slide)
    const isSpecialSlide = index === 0 || index === slides.length - 1;
    
    // Get the corresponding slideImages setting (offset by 1 since slideImages doesn't include title slide)
    const shouldAddImage = isSpecialSlide || 
      (index > 0 && index < slides.length - 1 && slideImages[index - 1]);
    
    if (shouldAddImage) {
      return { ...slide, image: getRandomImage() };
    }
    
    return slide;
  });
};

/**
 * Local AI-like enhancement as fallback
 */
const enhanceContentWithLocalAI = (data: PresentationData): SlideContent[] => {
  const userPoints = data.keyPoints;
  const slides: SlideContent[] = [];
  const audience = data.audience;
  const purpose = data.purpose;
  
  // Introductory slide with AI-enhanced content
  const introSlide: SlideContent = {
    title: data.title,
    points: [
      `Welcome to this presentation designed for ${audience}`,
      `Purpose: ${purpose}`,
      `This presentation covers ${userPoints.length} key points`
    ],
    image: getRandomImage() // Title slide always gets an image
  };
  
  slides.push(introSlide);

  // Process each user key point into a content-rich slide
  userPoints.forEach((point, index) => {
    // Generate AI-enhanced content based on the bullet point
    const enhancedPoints = generateEnhancedPoints(point, audience, purpose);
    
    const slide: SlideContent = {
      title: point,
      points: enhancedPoints
    };
    
    // Add image only if enabled for this slide
    if (data.slideImages[index]) {
      slide.image = getRandomImage();
    }
    
    slides.push(slide);
  });

  // Add summary slide
  const summaryPoints = generateSummaryPoints(userPoints, audience, purpose);
  const summarySlide: SlideContent = {
    title: "Summary",
    points: summaryPoints,
    image: getRandomImage() // Summary slide always gets an image
  };
  
  slides.push(summarySlide);
  
  return slides;
};

/**
 * Generate enhanced bullet points for a slide based on a key point
 */
const generateEnhancedPoints = (point: string, audience: string, purpose: string): string[] => {
  const enhancedPoints: string[] = [];
  const keywords = point.split(' ').filter(word => word.length > 4);
  
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
  
  // Add implementation details
  enhancedPoints.push(`Implementation requires careful planning and execution`);
  
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
export const generatePresentation = async (data: PresentationData): Promise<Blob> => {
  const slides = await generateSlides(data);
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
      // Footer text
      { text: { text: "UCL Presentation Generator", x: 0.5, y: '95%', w: 5, h: 0.3, fontSize: 8, color: "#FFFFFF", align: 'left' } }
    ]
  });
  
  // Generate each slide
  slides.forEach((slide, index) => {
    const pptxSlide = pptx.addSlide({ masterName: "UCL_MASTER" });
    
    // Add UCL logo to top left of every slide with proper sizing
    pptxSlide.addImage({
      path: UCL_LOGO,
      y: 0.05,
      x: 0.05,
      h: 0.4,
      w: 1.0,
      sizing: { type: "contain", w: 1.0, h: 0.4 }
    });
    
    // Add background image for visual interest if this slide has an image
    if (slide.image) {
      pptxSlide.addImage({
        path: slide.image,
        y: 0,
        x: 0,
        w: '100%',
        h: '100%',
        sizing: { type: "cover", w: '100%', h: '100%' },
        transparency: 85 // 85% transparent
      });
    }
    
    if (index === 0) {
      // Title slide
      pptxSlide.addText(slide.title, {
        y: 1.5,
        w: '80%', 
        h: 1.5, 
        fontSize: 44, 
        color: colors.primary, 
        bold: true, 
        align: 'center',
        valign: 'middle',
        margin: [0, 0, 0, 0],
        fit: 'shrink'
      });
      
      // Purpose and audience
      slide.points.forEach((point, pointIndex) => {
        pptxSlide.addText(point, {
          y: 3 + pointIndex * 0.7, // Increased spacing between points
          w: '80%',
          h: 0.6, // Added height constraint
          fontSize: 20,
          color: colors.text === "#FFFFFF" ? "#FFFFFF" : colors.primary,
          align: 'center',
          valign: 'middle', 
          margin: [0, 0, 0, 0],
          fit: 'shrink'
        });
      });
      
      // UCL branding on title slide
      pptxSlide.addText("University College London", {
        y: 5.5, // Moved down to avoid overlap
        w: '80%',
        h: 0.5, // Added height constraint
        fontSize: 14,
        color: colors.primary,
        align: 'center',
        margin: [0, 0, 0, 0]
      });
    } else {
      // Content slides
      pptxSlide.addText(slide.title, {
        y: 0.8,
        x: 0.5,
        w: '95%',
        h: 0.8, // Added height constraint
        fontSize: 32,
        color: colors.text === "#FFFFFF" ? "#FFFFFF" : colors.primary,
        bold: true,
        align: 'left',
        margin: [0.5, 0, 0, 0],
        fit: 'shrink'
      });
      
      // Add bullet points with proper spacing to avoid overlap
      slide.points.forEach((point, pointIndex) => {
        pptxSlide.addText(point, {
          y: 1.8 + pointIndex * 0.8, // Increased spacing between points
          x: 0.5,
          w: '90%',
          h: 0.7, // Added height constraint
          fontSize: 18,
          color: colors.text,
          bullet: { type: 'bullet' },
          align: 'left',
          valign: 'top',
          margin: [0.5, 0, 0, 0],
          fit: 'shrink'
        });
      });
    }
    
    // Add slide number to footer (except title slide)
    if (index > 0) {
      pptxSlide.addText(`Slide ${index}/${slides.length - 1}`, {
        x: pptx.presLayout.width - 1.5,
        y: pptx.presLayout.height - 0.5,
        w: 1.5,
        h: 0.2,
        fontSize: 8,
        color: "#FFFFFF",
        align: 'right',
        margin: [0, 0.3, 0, 0]
      });
    }
  });
  
  // Generate the PowerPoint as a Blob
  return await pptx.write({ outputType: 'blob' }) as Blob;
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
