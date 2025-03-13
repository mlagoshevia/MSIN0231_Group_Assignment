import PptxGenJS from "pptxgenjs";

const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.0-pro:generateContent";

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

const formatKeyPoints = async (title: string, keyPoints: string[], audience: string, purpose: string, apiKey: string, slideImages: boolean[]) => {
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
      includeImage: slideImages[i] || false, // Use the slideImages array to determine if image should be included
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
  const slideImages = formData.slideImages || []; // Ensure slideImages is always an array

  const formattedData = await formatKeyPoints(title, keyPoints, audience, purpose, apiKey, slideImages);
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
        primary: "#00AEEF",
        secondary: "#7ABB3B",
        text: "#FFFFFF",
        dark: "#1A1F2C"
      };
    case "light":
      return {
        background: "#FFFFFF",
        primary: "#8F3F97",
        secondary: "#EE2E74",
        text: "#000000",
        dark: "#1A1F2C"
      };
    case "green":
      return {
        background: "#F2FCE2",
        primary: "#006637",
        secondary: "#FFD100",
        text: "#000000",
        dark: "#1A1F2C"
      };
    default:
      return {
        background: "#E8E3E7",
        primary: "#8F3F97",
        secondary: "#006637",
        text: "#000000",
        dark: "#1A1F2C"
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
      { text: { text: "AI-Powered Presentation", x: 3, y: 0.75, w: 6, h: 1, fontSize: 24, color: colors.primary, bold: true } },
      { rect: { x: 0, y: '95%', w: '100%', h: 0.3, fill: { color: colors.primary } } },
      { text: { text: "UCL Presentation Generator", y: '95%', w: 5, h: 0.3, fontSize: 8, color: "#FFFFFF", align: 'left' } }
    ]
  });
};

const addContentSlideMaster = (pptx: PptxGenJS, colors: any) => {
  pptx.defineSlideMaster({
    title: "CONTENT_SLIDE",
    background: { color: colors.background },
    objects: [
      { rect: { x: 0, y: 0, w: "100%", h: "100%", fill: { color: colors.background } } },
      { rect: { x: 0, y: '95%', w: '100%', h: 0.3, fill: { color: colors.primary } } },
      { text: { text: "UCL Presentation Generator", y: '95%', w: 5, h: 0.3, fontSize: 8, color: "#FFFFFF", align: 'left' } }
    ]
  });
};

const addFooter = (pptx: PptxGenJS, colors: any) => {
  pptx.defineSlideMaster({
    title: "FOOTER_MASTER",
    objects: [
      { rect: { x: 0, y: 0, w: "100%", h: "100%", fill: { color: colors.background } } },
      
      { rect: { x: 0, y: '95%', w: '100%', h: 0.3, fill: { color: colors.primary } } },
      { text: { text: "UCL Presentation Generator", y: '95%', w: 5, h: 0.3, fontSize: 8, color: "#FFFFFF", align: 'left' } }
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
    y: 1.5, 
    w: '80%', 
    h: 1.5,
    fontSize: 44, 
    color: colors.primary,
    bold: true,
    align: 'left' 
  });

  pptxSlide.addText("AI-Enhanced Presentation", {
    y: 3.0,
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
      y: 1.5,
      w: '80%', 
      h: 1.5, 
      fontSize: 44, 
      color: colors.primary,
      bold: true,
      align: 'left'
    });

    slide.points.forEach((point: any, pointIndex: number) => {
      pptxSlide.addText(point, {
        y: 3 + pointIndex * 0.7,
        w: '80%',
        h: 0.6,
        fontSize: 20,
        color: colors.dark,
        bullet: { type: "number" },
        align: 'left'
      });
    });

    if (slide.includeImage) {
      pptxSlide.addImage({
        x: 8,
        y: 2,
        w: 5,
        h: 3,
        path: "https://picsum.photos/500/300",
      });
    }

    pptxSlide.addText("University College London", {
      y: 5.5,
      w: '80%',
      h: 0.5,
      fontSize: 14,
      color: colors.primary,
      italic: true,
      align: 'left'
    });
  });

  return await pptx.write("blob");
};

export { generatePresentation, downloadPresentation };
