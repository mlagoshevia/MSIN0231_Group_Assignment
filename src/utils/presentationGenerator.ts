
import pptxgen from "pptxgenjs";

// Define the type for a slide
interface Slide {
  title: string;
  content: string[];
}

// Define the type for presentation input
export interface PresentationInput {
  title: string;
  slides: Slide[];
  totalLength?: number;
  audienceLevel?: string;
  colors?: {
    main: string;
    light: string;
    dark: string;
    accent: string;
  };
}

// Main function to generate a presentation
export const generatePresentation = async (
  input: PresentationInput
): Promise<Blob> => {
  // Create a new presentation
  const pres = new pptxgen();

  // Set presentation properties
  pres.layout = "LAYOUT_16x9";
  pres.title = input.title;

  // Create the master slide with UCL branding
  createMasterSlide(pres, input.colors);

  // Generate a cover slide
  generateCoverSlide(pres, input);

  // Generate content slides
  generateContentSlides(pres, input);

  // Return the PPTX as a blob
  // Use the correct property for PPTXGenJS
  return pres.writeFile({ outputType: "blob" }) as Promise<Blob>;
};

// Helper function to download a blob as a file
export const downloadPresentation = (blob: Blob, filename: string) => {
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
};

// Function to create a branded master slide
const createMasterSlide = (
  pres: pptxgen,
  colors?: { main: string; light: string; dark: string; accent: string }
) => {
  // Get the default colors if none are provided
  const mainColor = colors?.main || "#500778"; // Default UCL purple
  const lightColor = colors?.light || "#C6B0BC"; // Default UCL light purple
  const darkColor = colors?.dark || "#2C0442"; // Default UCL dark purple
  const accentColor = colors?.accent || "#52C152"; // Default UCL accent green

  // Create a master slide
  pres.defineSlideMaster({
    title: "UCL_MASTER",
    background: { color: "#FFFFFF" },
    objects: [
      // UCL Logo in the background (maintaining original proportions)
      {
        image: {
          path: "/lovable-uploads/702c3a84-29b0-4240-848a-6ea26b3efe60.png",
          x: 9.0,  // Position on the right side
          y: 5.0,  // Position at the bottom
          w: 1.0,  // Width (keeping proportions)
          h: 0.5,  // Height (keeping proportions)
          transparency: 20,
        }
      },
      // Text: "UCL Presentation Generator"
      {
        text: {
          text: "UCL Presentation Generator",
          x: 0.3,  // Position on the left side
          y: 5.0,  // Position at the bottom
          w: 3.0,  
          h: 0.5,
          color: darkColor,
          fontFace: "Arial",
          fontSize: 8,
          bold: false,
          italic: false,
        }
      },
      // Footer line
      {
        line: {
          x: 0.3,
          y: 5.0,
          w: 9.4,
          h: 0,
          line: { color: lightColor, width: 1 },
        }
      },
    ],
  });
};

// Function to generate the cover slide
const generateCoverSlide = (pres: pptxgen, input: PresentationInput) => {
  // Get repository images for random selection
  const repoImages = [
    "/lovable-uploads/191fae70-1c3c-4031-9f58-0776a5d9de10.png",
    "/lovable-uploads/20bba994-fe28-4d19-b7bf-57f9cecc04c5.png",
    "/lovable-uploads/5938d1c9-574c-44a7-9d45-334cf5ce65ec.png",
    "/lovable-uploads/6b83f318-76b7-404a-83ca-9f60be513eb0.png",
    "/lovable-uploads/6b904904-4b1e-445c-bc68-c2e676f71f8e.png",
    "/lovable-uploads/91972324-64c1-4c6b-80f7-58d8d483171b.png",
    "/lovable-uploads/aade0ccc-38eb-42d1-b595-9ca4ea4d9984.png",
    "/lovable-uploads/acac0ed1-4db7-4b9d-a7ed-4ef3e795d0fc.png",
    "/lovable-uploads/acda080f-a4c5-4cfe-bec2-ea5bd50a72a9.png",
    "/lovable-uploads/d626aca5-5787-4ae5-90e4-08aa2f9f1156.png",
    "/lovable-uploads/d7b8167b-481f-4054-951f-42e5a4ee01d8.png",
    "/lovable-uploads/dc58b3fd-75c7-468e-94be-8dbb433d088d.png",
    "/lovable-uploads/e4b472d5-865e-4cb1-8fec-f80be909c236.png",
  ];
  const randomIndex = Math.floor(Math.random() * repoImages.length);
  const randomImage = repoImages[randomIndex];

  // Create the title slide
  const titleSlide = pres.addSlide({ masterName: "UCL_MASTER" });

  // Add background image with semi-transparency
  titleSlide.background = {
    color: input.colors?.light || "#FFFFFF",
  };

  // Add a random image from repository with reduced opacity
  titleSlide.addImage({
    path: randomImage,
    x: 0,
    y: 0,
    w: "100%",
    h: "100%",
    transparency: 90,
  });

  // Add title text with attractive styling
  titleSlide.addText(input.title, {
    x: 0.5,
    y: 1.5,
    w: 9.0,
    h: 1.5,
    fontSize: 44,
    color: input.colors?.dark || "#2C0442",
    fontFace: "Arial",
    align: "center",
    bold: true,
  });

  // Add subtitle if available
  if (input.audienceLevel) {
    titleSlide.addText(`Prepared for ${input.audienceLevel} audience`, {
      x: 0.5,
      y: 3.2,
      w: 9.0,
      h: 0.5,
      fontSize: 18,
      color: input.colors?.main || "#500778",
      fontFace: "Arial",
      align: "center",
      italic: true,
    });
  }
};

// Function to generate content slides
const generateContentSlides = (pres: pptxgen, input: PresentationInput) => {
  // Loop through each slide
  input.slides.forEach((slide, index) => {
    // Create a new slide
    const contentSlide = pres.addSlide({ masterName: "UCL_MASTER" });

    // Add slide title
    contentSlide.addText(slide.title, {
      x: 0.5,
      y: 0.5,
      w: 9.0,
      h: 0.8,
      fontSize: 32,
      color: input.colors?.main || "#500778",
      fontFace: "Arial",
      align: "left",
      bold: true,
    });

    // Create bullet points
    const bulletPoints = slide.content
      .map((point) => ({ text: point, indentLevel: 0 }));

    // Add bullet points to slide
    contentSlide.addText(bulletPoints, {
      x: 0.5,
      y: 1.5,
      w: 9.0,
      h: 3.0,
      fontSize: 18,
      color: "#333333",
      fontFace: "Arial",
      bullet: { type: "bullet" },
    });
  });
};
