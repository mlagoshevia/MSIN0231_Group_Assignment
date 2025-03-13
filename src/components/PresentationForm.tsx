
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
import { Loader2, Download, Sparkles, Key } from "lucide-react";
import { generatePresentation, downloadPresentation } from "@/utils/presentationGenerator";

const AUDIENCE_OPTIONS = [
  "Students",
  "Academics", 
  "Business Professionals",
  "General Public",
  "Researchers",
];

const TEMPLATE_OPTIONS = [
  { name: "UCL Purple", value: "purple" },
  { name: "Dark Theme", value: "dark" },
  { name: "Light Theme", value: "light" },
  { name: "UCL Green", value: "green" },
];

const PresentationForm = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [presentationBlob, setPresentationBlob] = useState<Blob | null>(null);
  const [generatingAI, setGeneratingAI] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    bulletPoints: "",
    audience: "",
    purpose: "",
    template: "",
    slideCount: 5,
    apiKey: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setPresentationBlob(null);
    
    // Log the form data
    console.log("Form submitted:", { 
      ...formData, 
      apiKey: formData.apiKey ? "********" : "" // Hide API key in logs
    });
    
    try {
      // Start the AI generation process
      setGeneratingAI(true);
      toast({
        title: "AI is crafting your presentation",
        description: "Connecting to Gemini API and generating enhanced content...",
        duration: 3000,
      });
      
      // Generate the presentation with Gemini-enhanced content
      const pptxBlob = await generatePresentation(formData);
      setPresentationBlob(pptxBlob);
      
      // Show success toast
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
      formData.bulletPoints.trim() !== "" &&
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
            <Label htmlFor="bulletPoints" className="text-sm font-medium">
              Key Points (Gemini AI will enhance these)
            </Label>
            <Textarea
              id="bulletPoints"
              value={formData.bulletPoints}
              onChange={(e) =>
                setFormData({ ...formData, bulletPoints: e.target.value })
              }
              className="mt-1 h-32"
              placeholder="Enter your bullet points (one per line, starting with -)"
            />
            <p className="text-xs text-gray-500 mt-1">
              Each point should start with a dash (-). Example:<br />
              - First important point<br />
              - Second important point
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
          </div>

          <div>
            <Label htmlFor="slideCount" className="text-sm font-medium">
              Number of Slides: {formData.slideCount}
            </Label>
            <input
              type="range"
              min="3"
              max="15"
              value={formData.slideCount}
              onChange={(e) =>
                setFormData({ ...formData, slideCount: parseInt(e.target.value) })
              }
              className="w-full h-2 bg-ucl-purple/20 rounded-lg appearance-none cursor-pointer mt-2"
            />
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
            <p className="text-xs text-gray-500 mt-1">
              Get a Gemini API key from the Google AI Developer Console. If no key is provided, simple AI enhancement will be used.
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
