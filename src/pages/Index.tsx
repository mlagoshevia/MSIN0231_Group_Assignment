
import React from "react";
import PresentationForm from "@/components/PresentationForm";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-ucl-light via-white to-ucl-green p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8 animate-slide-up">
          <div className="inline-block px-3 py-1 bg-ucl-purple/10 text-ucl-purple rounded-full text-sm mb-3">
            UCL Presentation Generator
          </div>
          <h1 className="text-4xl font-bold text-ucl-dark mb-2">
            Create Beautiful Presentations
          </h1>
          <p className="text-gray-600">
            Transform your bullet points into professional presentations with AI
            assistance
          </p>
        </div>
        <PresentationForm />
      </div>
    </div>
  );
};

export default Index;
