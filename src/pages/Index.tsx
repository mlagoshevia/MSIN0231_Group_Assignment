
import React, { useEffect, useState } from "react";
import PresentationForm from "@/components/PresentationForm";
import { Sparkles } from "lucide-react";

const Index = () => {
  // Define background color options
  const backgroundColors = [
    "from-[#C6B0BC] via-[#C6B0BC]/40 to-[#C6B0BC]/20", // Light purple
    "from-[#DAD6CA] via-[#DAD6CA]/40 to-[#DAD6CA]/20", // Beige
    "from-[#DEB8C3] via-[#DEB8C3]/40 to-[#DEB8C3]/20", // Pink (replaced light blue)
  ];

  // State to hold the selected background color
  const [backgroundGradient, setBackgroundGradient] = useState("");
  
  // Text color state
  const [textColor, setTextColor] = useState("text-ucl-dark");
  
  // Accent color for purple text elements - always UCL purple
  const [accentColor, setAccentColor] = useState("#500778");

  useEffect(() => {
    // Choose a random background color
    const randomIndex = Math.floor(Math.random() * backgroundColors.length);
    setBackgroundGradient(backgroundColors[randomIndex]);
    
    // Set text color for better contrast
    setTextColor("text-ucl-dark");
  }, []);

  return (
    <div className={`min-h-screen bg-gradient-to-br ${backgroundGradient}`}>
      {/* Logo centered at top */}
      <div className="w-full py-3 px-4 flex justify-center">
        <img 
          src="/lovable-uploads/443f9a9f-bf35-4ad6-8987-021b3e0d695b.png" 
          alt="UCL Logo" 
          className="h-16"
        />
      </div>
      
      <div className="p-4 max-w-4xl mx-auto">
        <div className="flex flex-col items-center mb-8 animate-slide-up">
          <div className="text-center">
            <div style={{ backgroundColor: `${accentColor}10`, color: accentColor }} 
                className="inline-flex items-center px-3 py-1 rounded-full text-sm mb-3">
              <Sparkles className="h-3.5 w-3.5 mr-1" />
              <span>AI-Powered UCL Presentation Generator</span>
            </div>
            <h1 className={`text-4xl font-bold ${textColor} mb-2`}>
              Create Intelligent Presentations
            </h1>
            <p className={`${textColor} max-w-lg mx-auto text-gray-600`}>
              Transform your bullet points into professionally designed, content-rich presentations. 
              Our AI enhances your ideas with relevant details tailored to your audience.
            </p>
          </div>
        </div>
        <PresentationForm />
      </div>
    </div>
  );
};

export default Index;
