
import React from "react";
import PresentationForm from "@/components/PresentationForm";
import { Sparkles } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-ucl-light via-white to-ucl-green">
      {/* Black banner with logo at right */}
      <div className="w-full bg-black py-3 px-4 flex justify-end">
        <img 
          src="/lovable-uploads/c2323a50-fb1c-437a-8482-980488b23cf7.png" 
          alt="UCL Logo" 
          className="h-10"
        />
      </div>
      
      <div className="p-4 max-w-4xl mx-auto">
        <div className="flex flex-col items-center mb-8 animate-slide-up">
          <div className="text-center">
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
        </div>
        <PresentationForm />
      </div>
    </div>
  );
};

export default Index;
