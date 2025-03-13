
import React, { useEffect, useState } from "react";
import PresentationForm from "@/components/PresentationForm";
import { Sparkles } from "lucide-react";

// UCL color palettes based on official guidelines
const UCL_COLOR_PALETTES = [
  // Primary palette
  {
    light: "#E8E3E7",    // Light Purple
    main: "#9b87f5",     // Primary Purple
    dark: "#8A1538",     // Dark Purple
    green: "#006637",    // UCL Green
    bg: "from-[#E8E3E7] via-white to-[#E8F4EB]"
  },
  // Secondary palette
  {
    light: "#D6BCFA",     // Secondary Light Purple
    main: "#7E69AB",      // Secondary Purple
    dark: "#1A1F2C",      // Dark Blue Purple
    green: "#F2FCE2",     // Soft Green
    bg: "from-[#D6BCFA] via-white to-[#F2FCE2]"
  },
  // Tertiary palette
  {
    light: "#E5DEFF",     // Soft Purple
    main: "#8B5CF6",      // Vivid Purple
    dark: "#6E59A5",      // Tertiary Purple
    green: "#D3E4FD",     // Soft Blue
    bg: "from-[#E5DEFF] via-white to-[#D3E4FD]"
  }
];

const Index = () => {
  const [colorPalette, setColorPalette] = useState(UCL_COLOR_PALETTES[0]);
  
  // Select a random color palette on mount
  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * UCL_COLOR_PALETTES.length);
    setColorPalette(UCL_COLOR_PALETTES[randomIndex]);
    
    // Apply the selected color palette to CSS variables
    document.documentElement.style.setProperty('--ucl-purple', colorPalette.main);
    document.documentElement.style.setProperty('--ucl-dark', colorPalette.dark);
    document.documentElement.style.setProperty('--ucl-light', colorPalette.light);
    document.documentElement.style.setProperty('--ucl-green', colorPalette.green);
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
          <div className="inline-flex items-center px-3 py-1 bg-ucl-purple/10 text-ucl-purple rounded-full text-sm mb-3">
            <Sparkles className="h-3.5 w-3.5 mr-1" />
            <span>AI-Powered UCL Presentation Generator</span>
          </div>
          <h1 className="text-4xl font-bold text-ucl-dark mb-2">
            Create Intelligent Presentations
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
