
import React, { useEffect, useState } from "react";
import PresentationForm from "@/components/PresentationForm";
import { Sparkles } from "lucide-react";

const Index = () => {
  // Set a fixed background color - light purple only
  const backgroundColor = "from-[#C6B0BC] via-[#C6B0BC]/40 to-[#C6B0BC]/20";

  // State to hold the selected background color
  const [backgroundGradient, setBackgroundGradient] = useState("");
  
  // Text color state
  const [textColor, setTextColor] = useState("text-ucl-dark");

  useEffect(() => {
    // Use the single fixed background color
    setBackgroundGradient(backgroundColor);
    
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
            <div className={`inline-flex items-center px-3 py-1 bg-[#500778]/10 text-[#500778] rounded-full text-sm mb-3`}>
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
