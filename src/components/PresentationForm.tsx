
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
import { Loader2 } from "lucide-react";

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
  { name: "Green Nature", value: "green" },
];

const PresentationForm = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    bulletPoints: "",
    audience: "",
    purpose: "",
    template: "",
    slideCount: 5,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Log the form data
    console.log("Form submitted:", formData);
    
    try {
      // Simulate API call - replace with actual API call in the future
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Show success toast
      toast({
        title: "Presentation generated!",
        description: `Your "${formData.title}" presentation has been created successfully.`,
        duration: 5000,
      });
      
      // Future: Add code to generate and download the presentation
      
    } catch (error) {
      // Show error toast
      toast({
        title: "Generation failed",
        description: "There was an error generating your presentation. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
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
              Bullet Points
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
        </div>

        <div className="mt-6">
          <Button
            type="submit"
            className="w-full bg-ucl-purple hover:bg-ucl-purple/90 text-white"
            disabled={!isFormValid() || loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              "Generate Presentation"
            )}
          </Button>
        </div>
      </Card>
    </form>
  );
};

export default PresentationForm;
