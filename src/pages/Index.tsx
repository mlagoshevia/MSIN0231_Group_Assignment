import React, { useState } from "react";
import PresentationForm from "@/components/PresentationForm";
import { Sparkles } from "lucide-react";
const Index = () => {
  // Text color state - always dark for good contrast with beige background
  const [textColor, setTextColor] = useState("text-ucl-dark");

  // Accent color for purple text elements - always UCL purple
  const [accentColor, setAccentColor] = useState("#500778");
  return <div className="min-h-screen bg-[#DAD6CA]">
      {/* Logo centered at top */}
      <div className="w-full py-3 px-4 flex justify-center">
        <img src="/lovable-uploads/443f9a9f-bf35-4ad6-8987-021b3e0d695b.png" alt="UCL Logo" className="h-16" />
      </div>
      
      <div className="p-4 max-w-4xl mx-auto">
        <div className="flex flex-col items-center mb-8 animate-slide-up">
          <div className="text-center">
            <div style={{
            backgroundColor: `${accentColor}10`,
            color: accentColor
          }} className="inline-flex items-center px-3 py-1 rounded-full text-sm mb-3">
              <Sparkles className="h-3.5 w-3.5 mr-1" />
              <span>AI-Powered UCL Presentation Generator</span>
            </div>
            <h1 className={`text-4xl font-bold ${textColor} mb-2`}>AcaDeck AI:
AI-Powered Presentation Generator</h1>
            <p className={`${textColor} max-w-lg mx-auto text-gray-600`}>
              Transform your bullet points into professionally designed, content-rich presentations. 
              Our AI enhances your ideas with relevant details tailored to your audience.
            </p>
          </div>
        </div>
        <PresentationForm />
      </div>
    </div>;
};
export default Index;