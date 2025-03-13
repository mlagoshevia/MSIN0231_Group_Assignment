import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { 
  Loader2, 
  Download, 
  Sparkles, 
  Key, 
  Plus, 
  Trash2,
  ArrowUp,
  ArrowDown,
  ExternalLink
} from "lucide-react";
import { generatePresentation, downloadPresentation } from "@/utils/presentationGenerator";

const AUDIENCE_OPTIONS = [
  "Students",
  "Academics", 
  "Business Professionals",
  "General Public",
  "Researchers",
];

const TEMPLATE_OPTIONS = [
  { name: "UCL Vibrant Purple", value: "purple" },
  { name: "UCL Dark Blue", value: "dark" },
  { name: "Light Theme", value: "light" },
  { name: "UCL Vibrant Green", value: "green" },
  { name: "UCL Vibrant Blue", value: "blue" },
  { name: "UCL Vibrant Pink", value: "pink" },
];

const PresentationForm = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [presentationBlob, setPresentationBlob] = useState<Blob | null>(null);
  const [generatingAI, setGeneratingAI] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);
  const [newKeyPoint, setNewKeyPoint] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    keyPoints: [] as string[],
    audience: "",
    purpose: "",
    template: "",
    apiKey: "",
  });

  const addKeyPoint = () => {
    if (newKeyPoint.trim() === "") return;
    
    setFormData({
      ...formData,
      keyPoints: [...formData.keyPoints, newKeyPoint.trim()]
    });
    setNewKeyPoint("");
    
    toast({
      title: "Key point added",
      description: "A new slide will be created for this point."
    });
  };

  const removeKeyPoint = (index: number) => {
    const updatedKeyPoints = [...formData.keyPoints];
    updatedKeyPoints.splice(index, 1);
    setFormData({
      ...formData,
      keyPoints: updatedKeyPoints
    });
  };

  const moveKeyPoint = (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) || 
      (direction === 'down' && index === formData.keyPoints.length - 1)
    ) {
      return;
    }
    
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    const updatedKeyPoints = [...formData.keyPoints];
    const temp = updatedKeyPoints[index];
    updatedKeyPoints[index] = updatedKeyPoints[newIndex];
    updatedKeyPoints[newIndex] = temp;
    
    setFormData({
      ...formData,
      keyPoints: updatedKeyPoints
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setPresentationBlob(null);
    
    console.log("Form submitted:", { 
      ...formData, 
      apiKey: formData.apiKey ? "********" : "" 
    });
    
    try {
      setGeneratingAI(true);
      toast({
        title: "AI is crafting your presentation",
        description: "Connecting to Gemini API and generating enhanced content...",
        duration: 3000,
      });
      
      const pptxBlob = await generatePresentation(formData);
      setPresentationBlob(pptxBlob);
      
      toast({
        title: "PowerPoint generated!",
        description: `Your "${formData.title}" presentation has been created with Gemini-enhanced content.`,
        duration: 5000,
      });
    } catch (error) {
      console.error("Error in AI generation:", error);
      toast({
        title: "AI generation failed",
        description: error instanceof Error ? error.message : "There was an error enhancing your content. Please try again.",
        variant: "destructive",
      });
    } finally {
      setGeneratingAI(false);
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (presentationBlob) {
      const filename = `${formData.title.replace(/\s+/g, '_')}_presentation.pptx`;
      downloadPresentation(presentationBlob, filename);
      
      toast({
        title: "Downloading PowerPoint",
        description: "Your PowerPoint presentation is being downloaded.",
      });
    }
  };

  const isFormValid = () => {
    return (
      formData.title.trim() !== "" &&
      formData.keyPoints.length > 0 &&
      formData.audience !== "" &&
      formData.purpose.trim() !== "" &&
      formData.template !== ""
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 animate-slide-up">
      <Card className="p-6 backdrop-blur-sm bg-white/50">
        <div className="space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-purple-100">
            <Sparkles className="text-ucl-purple h-5 w-5" />
            <h2 className="text-lg font-medium text-ucl-purple">AI-Powered Presentation Generator</h2>
          </div>
          
          <div>
            <Label htmlFor="title" className="text-sm font-medium">
              Presentation Title
            </Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="mt-1"
              placeholder="Enter your presentation title"
            />
          </div>

          <div>
            <Label htmlFor="purpose" className="text-sm font-medium">
              Presentation Purpose
            </Label>
            <Textarea
              id="purpose"
              value={formData.purpose}
              onChange={(e) =>
                setFormData({ ...formData, purpose: e.target.value })
              }
              className="mt-1"
              placeholder="Describe the purpose of your presentation"
            />
            <p className="text-xs text-gray-500 mt-1">
              This should be a brief explanation and/or structure of the purpose of this presentation.
            </p>
          </div>

          <div>
            <Label className="text-sm font-medium flex justify-between items-center">
              <span>Key Points (Each will become a slide)</span>
              <span className="text-xs text-gray-500">
                {formData.keyPoints.length} points added
              </span>
            </Label>
            <p className="text-xs text-gray-500 mb-2">
              Each point will act as a prompt. Gemini will use it as reference to generate content of that slide.
            </p>
            
            <div className="mt-2 space-y-2">
              {formData.keyPoints.map((point, index) => (
                <div 
                  key={index} 
                  className="flex items-center gap-2 p-2 rounded-md bg-purple-50 border border-purple-100 group"
                >
                  <div className="flex-none flex flex-col">
                    <Button 
                      type="button" 
                      size="icon" 
                      variant="ghost" 
                      className="h-5 w-5 opacity-70 hover:opacity-100"
                      onClick={() => moveKeyPoint(index, 'up')}
                      disabled={index === 0}
                    >
                      <ArrowUp className="h-3 w-3" />
                    </Button>
                    <Button 
                      type="button" 
                      size="icon" 
                      variant="ghost" 
                      className="h-5 w-5 opacity-70 hover:opacity-100"
                      onClick={() => moveKeyPoint(index, 'down')}
                      disabled={index === formData.keyPoints.length - 1}
                    >
                      <ArrowDown className="h-3 w-3" />
                    </Button>
                  </div>
                  
                  <div className="flex-1 text-sm font-medium">
                    <div className="bg-purple-100/50 px-2 py-1 rounded">
                      Slide {index + 1}: {point}
                    </div>
                  </div>
                  
                  <Button 
                    type="button" 
                    size="icon" 
                    variant="ghost" 
                    className="flex-none text-red-500 opacity-70 hover:opacity-100"
                    onClick={() => removeKeyPoint(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              
              {formData.keyPoints.length === 0 && (
                <div className="text-center py-4 text-gray-500 bg-gray-50 rounded-md">
                  <p>No key points added yet. Add points below.</p>
                </div>
              )}
            </div>
            
            <div className="mt-2 flex gap-2">
              <Input
                value={newKeyPoint}
                onChange={(e) => setNewKeyPoint(e.target.value)}
                placeholder="Enter a new key point"
                className="flex-1"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && newKeyPoint.trim() !== "") {
                    e.preventDefault();
                    addKeyPoint();
                  }
                }}
              />
              <Button 
                type="button" 
                onClick={addKeyPoint}
                disabled={newKeyPoint.trim() === ""}
                className="bg-ucl-purple hover:bg-ucl-purple/90"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Point
              </Button>
            </div>
            
            <p className="text-xs text-gray-500 mt-1">
              Each key point will become its own slide. Gemini AI will enhance each point with research and data.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="audience" className="text-sm font-medium">
                Target Audience
              </Label>
              <Select
                value={formData.audience}
                onValueChange={(value) =>
                  setFormData({ ...formData, audience: value })
                }
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select audience" />
                </SelectTrigger>
                <SelectContent>
                  {AUDIENCE_OPTIONS.map((audience) => (
                    <SelectItem key={audience} value={audience.toLowerCase()}>
                      {audience}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="template" className="text-sm font-medium">
                Template
              </Label>
              <Select
                value={formData.template}
                onValueChange={(value) =>
                  setFormData({ ...formData, template: value })
                }
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select template" />
                </SelectTrigger>
                <SelectContent>
                  {TEMPLATE_OPTIONS.map((template) => (
                    <SelectItem key={template.value} value={template.value}>
                      {template.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="relative">
            <Label htmlFor="apiKey" className="text-sm font-medium flex items-center gap-1">
              <Key className="h-3.5 w-3.5" />
              Gemini API Key
            </Label>
            <div className="relative mt-1">
              <Input
                id="apiKey"
                type={showApiKey ? "text" : "password"}
                value={formData.apiKey}
                onChange={(e) =>
                  setFormData({ ...formData, apiKey: e.target.value })
                }
                className="pr-24"
                placeholder="Enter your Gemini API key"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-1 top-1/2 -translate-y-1/2 h-7 text-xs"
                onClick={() => setShowApiKey(!showApiKey)}
              >
                {showApiKey ? "Hide" : "Show"}
              </Button>
            </div>
            <p className="text-xs text-gray-500 mt-1 flex items-center">
              Get a Gemini API key from the Google AI Developer Console. Required for AI-enhanced presentation content.
              <a 
                href="https://aistudio.google.com/app/apikey" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center ml-1 text-ucl-purple hover:underline"
              >
                Get API key <ExternalLink className="h-3 w-3 ml-0.5" />
              </a>
            </p>
          </div>
        </div>

        <div className="mt-6 space-y-4">
          <Button
            type="submit"
            className="w-full bg-ucl-purple hover:bg-ucl-purple/90 text-white"
            disabled={!isFormValid() || loading || generatingAI}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : generatingAI ? (
              <>
                <Sparkles className="mr-2 h-4 w-4 animate-pulse" />
                Gemini AI Enhancing Content...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Generate AI-Powered Presentation
              </>
            )}
          </Button>
          
          {presentationBlob && (
            <Button 
              type="button"
              onClick={handleDownload}
              className="w-full bg-green-600 hover:bg-green-700 text-white"
            >
              <Download className="mr-2 h-4 w-4" />
              Download Presentation
            </Button>
          )}
        </div>
      </Card>
    </form>
  );
};

export default PresentationForm;
