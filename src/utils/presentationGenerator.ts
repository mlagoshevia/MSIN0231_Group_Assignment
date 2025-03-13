
import PptxGenJS from "pptxgenjs";

const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.0-pro:generateContent";

// Repository images to use randomly
const REPOSITORY_IMAGES = [
  "/lovable-uploads/191fae70-1c3c-4031-9f58-0776a5d9de10.png",
  "/lovable-uploads/20bba994-fe28-4d19-b7bf-57f9cecc04c5.png",
  "/lovable-uploads/5938d1c9-574c-44a7-9d45-334cf5ce65ec.png",
  "/lovable-uploads/6b83f318-76b7-404a-83ca-9f60be513eb0.png",
  "/lovable-uploads/6b904904-4b1e-445c-bc68-c2e676f71f8e.png",
  "/lovable-uploads/702c3a84-29b0-4240-848a-6ea26b3efe60.png",
  "/lovable-uploads/91972324-64c1-4c6b-80f7-58d8d483171b.png",
  "/lovable-uploads/aade0ccc-38eb-42d1-b595-9ca4ea4d9984.png",
  "/lovable-uploads/acac0ed1-4db7-4b9d-a7ed-4ef3e795d0fc.png",
  "/lovable-uploads/acda080f-a4c5-4cfe-bec2-ea5bd50a72a9.png",
  "/lovable-uploads/d626aca5-5787-4ae5-90e4-08aa2f9f1156.png",
  "/lovable-uploads/d7b8167b-481f-4054-951f-42e5a4ee01d8.png",
  "/lovable-uploads/dc58b3fd-75c7-468e-94be-8dbb433d088d.png",
  "/lovable-uploads/e4b472d5-865e-4cb1-8fec-f80be909c236.png",
];

// Helper function to get a random image from repository
const getRandomImage = () => {
  const randomIndex = Math.floor(Math.random() * REPOSITORY_IMAGES.length);
  return REPOSITORY_IMAGES[randomIndex];
};

const generateEnhancedContent = async (apiKey: string, prompt: string) => {
  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: prompt }]
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 2048,
        },
        safetySettings: [
          {
            "category": "HARM_CATEGORY_HARASSMENT",
            "threshold": "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            "category": "HARM_CATEGORY_HATE_SPEECH",
            "threshold": "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            "category": "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            "threshold": "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            "category": "HARM_CATEGORY_DANGEROUS_CONTENT",
            "threshold": "BLOCK_MEDIUM_AND_ABOVE"
          }
        ]
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const enhancedText = data.candidates[0].content.parts[0].text;
    return enhancedText;

  } catch (error) {
    console.error("Failed to generate enhanced content:", error);
    throw error;
  }
};

const formatKeyPoints = async (title: string, keyPoints: string[], audience: string, purpose: string, apiKey: string) => {
  const slides = [];

  for (let i = 0; i < keyPoints.length; i++) {
    let point = keyPoints[i];
    let enhancedContent = "";

    if (apiKey) {
      const prompt = `Given the presentation title "${title}", the audience is "${audience}", and the purpose is "${purpose}", enhance the following key point: "${point}". Provide detailed, relevant information that would engage the audience and make the presentation more impactful.`;
      try {
        enhancedContent = await generateEnhancedContent(apiKey, prompt);
      } catch (error) {
        console.error("Failed to generate enhanced content:", error);
        enhancedContent = "Failed to generate AI enhanced content for this slide.";
      }
    } else {
      enhancedContent = "API key not provided, skipping AI enhancement.";
    }

    const slide = {
      title: point,
      points: enhancedContent.split('\n').filter(line => line.trim() !== ''),
      imagePath: getRandomImage(), // Always include a random image for each slide
    };
    slides.push(slide);
  }

  return {
    title: title,
    slides: slides,
  };
};

const generatePresentation = async (formData: any) => {
  const { title, keyPoints, audience, purpose, template, apiKey } = formData;
  
  const formattedData = await formatKeyPoints(title, keyPoints, audience, purpose, apiKey);
  return await generatePPTX(formattedData, template);
};

const downloadPresentation = (pptxBlob: Blob, filename: string) => {
  const url = window.URL.createObjectURL(pptxBlob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
};

const getColorPalette = (template: string) => {
  switch (template) {
    case "dark":
      return {
        background: "#1A1F2C",
        primary: "#34C6C6",      // Vibrant Blue
        secondary: "#52C152",    // Vibrant Green
        text: "#FFFFFF",         // White
        dark: "#002248"          // Dark Blue
      };
    case "light":
      return {
        background: "#FFFFFF",   // White
        primary: "#500778",      // Vibrant Purple
        secondary: "#AC145A",    // Vibrant Pink
        text: "#000000",         // Black
        dark: "#2C0442"          // Dark Purple
      };
    case "green":
      return {
        background: "#F2FCE2",
        primary: "#52C152",      // Vibrant Green
        secondary: "#FFCA36",    // Vibrant Yellow
        text: "#000000",         // Black
        dark: "#113B3A"          // Dark Green
      };
    default:
      return {
        background: "#F5F0F5",
        primary: "#500778",      // Vibrant Purple
        secondary: "#52C152",    // Vibrant Green
        text: "#000000",         // Black
        dark: "#2C0442"          // Dark Purple
      };
  }
};

const addTitleSlideMaster = (pptx: PptxGenJS, colors: any) => {
  pptx.defineSlideMaster({
    title: "TITLE_SLIDE",
    background: { color: colors.background },
    objects: [
      { rect: { x: 0, y: 0, w: "100%", h: "100%", fill: { color: colors.background } } },
      { image: { x: 0.5, y: 0.5, w: 2, h: 1, path: '/lovable-uploads/702c3a84-29b0-4240-848a-6ea26b3efe60.png' } },
      { text: { text: "UCL Presentation Generator", w: 6, h: 1, fontSize: 24, color: colors.primary, bold: true } },
      { rect: { x: 0, y: '95%', w: '100%', h: 0.3, fill: { color: colors.primary } } },
      { text: { text: "UCL Presentation Generator", w: 5, h: 0.3, fontSize: 8, color: "#FFFFFF", align: 'left' } }
    ]
  });
};

const addContentSlideMaster = (pptx: PptxGenJS, colors: any) => {
  pptx.defineSlideMaster({
    title: "CONTENT_SLIDE",
    background: { color: colors.background },
    objects: [
      { rect: { x: 0, y: 0, w: "100%", h: "100%", fill: { color: colors.background } } },
      { image: { x: 0.3, y: 0.2, w: 1.5, h: 0.75, path: '/lovable-uploads/702c3a84-29b0-4240-848a-6ea26b3efe60.png', transparency: 90 } }, // Background logo
      { rect: { x: 0, y: '95%', w: '100%', h: 0.3, fill: { color: colors.primary } } },
      { text: { text: "UCL Presentation Generator", w: 5, h: 0.3, fontSize: 8, color: "#FFFFFF", align: 'left' } }
    ]
  });
};

const addFooter = (pptx: PptxGenJS, colors: any) => {
  pptx.defineSlideMaster({
    title: "FOOTER_MASTER",
    objects: [
      { rect: { x: 0, y: 0, w: "100%", h: "100%", fill: { color: colors.background } } },
      { rect: { x: 0, y: '95%', w: '100%', h: 0.3, fill: { color: colors.primary } } },
      { text: { text: "UCL Presentation Generator", w: 5, h: 0.3, fontSize: 8, color: "#FFFFFF", align: 'left' } }
    ]
  });
};

const generatePPTX = async (formattedData: any, template: string) => {
  const colors = getColorPalette(template);
  let pptx = new PptxGenJS();

  // Define slide masters
  addTitleSlideMaster(pptx, colors);
  addContentSlideMaster(pptx, colors);
  addFooter(pptx, colors);

  // Create title slide
  pptx.addSection({ title: "Title" });
  let pptxSlide = pptx.addSlide({ masterName: "TITLE_SLIDE" });

  pptxSlide.addText(formattedData.title, { 
    w: '80%', 
    h: 1.5,
    fontSize: 44, 
    color: colors.primary,
    bold: true,
    align: 'left' 
  });

  pptxSlide.addText("AI-Enhanced Presentation", {
    w: '80%',
    h: 0.5,
    fontSize: 18,
    color: colors.dark,
    italic: true,
    align: 'left'
  });

  formattedData.slides.forEach((slide: any, index: number) => {
    pptx.addSection({ title: `Slide ${index + 1}` });
    pptxSlide = pptx.addSlide({ masterName: "CONTENT_SLIDE" });

    pptxSlide.addText(slide.title, {
      w: '80%', 
      h: 1.5, 
      fontSize: 44, 
      color: colors.primary,
      bold: true,
      align: 'left'
    });

    slide.points.forEach((point: any, pointIndex: number) => {
      pptxSlide.addText(point, {
        w: '80%',
        h: 0.6,
        fontSize: 20,
        color: colors.dark,
        bullet: { type: "number" },
        align: 'left'
      });
    });

    // Always add a random image to each slide
    pptxSlide.addImage({
      x: 8,
      y: 2,
      w: 5,
      h: 3,
      path: slide.imagePath,
    });

    pptxSlide.addText("University College London", {
      w: '80%',
      h: 0.5,
      fontSize: 14,
      color: colors.primary,
      italic: true,
      align: 'left'
    });
  });

  // Fix TypeScript error by explicitly returning a Blob
  return pptx.write("blob") as Promise<Blob>;
};

export { generatePresentation, downloadPresentation };
