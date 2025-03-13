
import React, { useEffect, useState } from "react";
import PresentationForm from "@/components/PresentationForm";
import { Sparkles } from "lucide-react";

const Index = () => {
  // Define available background colors
  const backgroundColors = [
    "from-[#FFCA36] via-white to-[#FFCA36]/50", // Yellow background
    "from-[#500778] via-[#500778]/40 to-[#500778]/20", // Purple background
    "from-[#002248] via-[#002248]/40 to-[#002248]/20", // Dark blue background
  ];

  // State to hold the selected background color
  const [backgroundGradient, setBackgroundGradient] = useState("");
  
  // Text color state (for contrast with dark backgrounds)
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
    if (randomIndex === 0) {
      setTextColor("text-ucl-dark"); // Dark text for yellow background
    } else {
      setTextColor("text-white"); // White text for dark backgrounds
    }
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
            <div className={`inline-flex items-center px-3 py-1 ${colorIndex !== 0 ? "bg-white/10" : "bg-ucl-purple/10"} ${colorIndex !== 0 ? "text-white" : "text-ucl-purple"} rounded-full text-sm mb-3`}>
              <Sparkles className="h-3.5 w-3.5 mr-1" />
              <span>AI-Powered UCL Presentation Generator</span>
            </div>
            <h1 className={`text-4xl font-bold ${textColor} mb-2`}>
              Create Intelligent Presentations
            </h1>
            <p className={`${textColor} max-w-lg mx-auto ${colorIndex !== 0 ? "opacity-80" : "text-gray-600"}`}>
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
