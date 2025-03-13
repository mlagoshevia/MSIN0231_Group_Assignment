
import React, { useEffect, useState } from "react";
import PresentationForm from "@/components/PresentationForm";
import { Sparkles } from "lucide-react";

// UCL color palettes based on provided color definitions
const UCL_COLOR_PALETTES = [
  // Primary vibrant palette
  {
    light: "#C6B0BC",    // Muted Purple
    main: "#500778",     // Vibrant Purple
    dark: "#2C0442",     // Dark Purple
    accent: "#52C152",   // Vibrant Green
    bg: "from-[#C6B0BC] via-white to-[#C9D1A8]"
  },
  // Blue palette
  {
    light: "#B6DCE5",    // Muted Blue
    main: "#34C6C6",     // Vibrant Blue
    dark: "#002248",     // Dark Blue
    accent: "#FFCA36",   // Vibrant Yellow
    bg: "from-[#B6DCE5] via-white to-[#DAD6CA]"
  },
  // Pink palette
  {
    light: "#DEB8C3",    // Muted Pink
    main: "#AC145A",     // Vibrant Pink
    dark: "#4B0A42",     // Dark Pink
    accent: "#34C6C6",   // Vibrant Blue
    bg: "from-[#DEB8C3] via-white to-[#B6DCE5]"
  }
];

const Index = () => {
  const [colorPalette, setColorPalette] = useState(UCL_COLOR_PALETTES[0]);
  
  // Select a random color palette on mount
  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * UCL_COLOR_PALETTES.length);
    setColorPalette(UCL_COLOR_PALETTES[randomIndex]);
  }, []);

  return (
    <div className={`min-h-screen bg-gradient-to-br ${colorPalette.bg} p-4`}>
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-center mb-6">
          <img 
            src="/lovable-uploads/702c3a84-29b0-4240-848a-6ea26b3efe60.png" 
            alt="UCL Logo" 
            className="h-14 object-contain"
          />
        </div>
        
        <div className="text-center mb-8 animate-slide-up">
          <div className="inline-flex items-center px-3 py-1" style={{ backgroundColor: `${colorPalette.main}20`, color: colorPalette.main }} className="rounded-full text-sm mb-3">
            <Sparkles className="h-3.5 w-3.5 mr-1" />
            <span>UCL Presentation Generator</span>
          </div>
          <h1 className="text-4xl font-bold mb-2" style={{ color: colorPalette.dark }}>
            Create Professional Presentations
          </h1>
          <p className="text-gray-600 max-w-lg mx-auto">
            Transform your bullet points into professionally designed, content-rich presentations. 
            Our AI enhances your ideas with relevant details tailored to your audience.
          </p>
        </div>
        <PresentationForm />
      </div>
    </div>
  );
};

export default Index;
