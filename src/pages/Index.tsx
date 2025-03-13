
import React, { useEffect, useState } from "react";
import PresentationForm from "@/components/PresentationForm";
import { Sparkles } from "lucide-react";

const Index = () => {
  // Define available background colors with new color palette
  const backgroundColors = [
    "from-[#B6DCE5] via-white to-[#B6DCE5]/50", // Light blue background
    "from-[#C9D1A8] via-[#C9D1A8]/40 to-[#C9D1A8]/20", // Light green background
    "from-[#C6B0BC] via-[#C6B0BC]/40 to-[#C6B0BC]/20", // Light purple background
  ];

  // State to hold the selected background color
  const [backgroundGradient, setBackgroundGradient] = useState("");
  
  // Text color state (for contrast with backgrounds)
  const [textColor, setTextColor] = useState("text-ucl-dark");
  
  // Store the randomIndex in state so it's accessible throughout the component
  const [colorIndex, setColorIndex] = useState(0);

  useEffect(() => {
    // Choose a random background color
    const randomIndex = Math.floor(Math.random() * backgroundColors.length);
    const selectedGradient = backgroundColors[randomIndex];
    setBackgroundGradient(selectedGradient);
    setColorIndex(randomIndex); // Store the index in state
    
    // Set text color based on the background for better contrast
    // All new colors are light enough for dark text
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
            <div className={`inline-flex items-center px-3 py-1 bg-ucl-purple/10 text-ucl-purple rounded-full text-sm mb-3`}>
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
