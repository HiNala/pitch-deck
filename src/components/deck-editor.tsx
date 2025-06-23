"use client";

import * as React from "react";
import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Move, 
  Type, 
  Image as ImageIcon, 
  Square, 
  Circle,
  Palette,
  Play,
  Download,
  Share,
  Plus,
  Trash2,
  Copy,
  Sparkles,
  MessageCircle,
  Loader2,
  Wand2,
  BrainCircuit,
  Check,
  AlertCircle,
  RefreshCw
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import SharingModal from "@/components/ui/sharing-modal";

interface Slide {
  id: string;
  title: string;
  content: string;
  backgroundColor: string;
  textColor: string;
  elements: SlideElement[];
}

interface SlideElement {
  id: string;
  type: 'text' | 'image' | 'shape';
  x: number;
  y: number;
  width: number;
  height: number;
  content: string;
  style: Record<string, unknown>;
}

interface DeckEditorProps {
  className?: string;
}

interface AIPromptSuggestion {
  title: string;
  prompt: string;
  icon: React.ReactNode;
}

export function DeckEditor({ className }: DeckEditorProps) {
  const [slides, setSlides] = useState<Slide[]>([
    {
      id: '1',
      title: 'Welcome Slide',
      content: 'Your presentation starts here',
      backgroundColor: '#ffffff',
      textColor: '#000000',
      elements: [
        {
          id: 'title-1',
          type: 'text',
          x: 50,
          y: 100,
          width: 400,
          height: 60,
          content: 'Welcome to Our Presentation',
          style: { fontSize: '32px', fontWeight: 'bold' }
        },
        {
          id: 'subtitle-1',
          type: 'text',
          x: 50,
          y: 180,
          width: 400,
          height: 40,
          content: 'Building the future together',
          style: { fontSize: '18px', color: '#666666' }
        }
      ]
    },
    {
      id: '2',
      title: 'About Us',
      content: 'Company overview',
      backgroundColor: '#f8f9fa',
      textColor: '#000000',
      elements: [
        {
          id: 'title-2',
          type: 'text',
          x: 50,
          y: 80,
          width: 400,
          height: 50,
          content: 'About Our Company',
          style: { fontSize: '28px', fontWeight: 'bold' }
        }
      ]
    }
  ]);

  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [zoom, setZoom] = useState(100);
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('design');
  const canvasRef = useRef<HTMLDivElement>(null);

  // AI Assistant States
  const [aiPrompt, setAiPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState<string | null>(null);
  const [generatedContent, setGeneratedContent] = useState<string | null>(null);
  const [aiGenerationType, setAiGenerationType] = useState<'slide' | 'element' | 'optimize'>('slide');

  // PDF Export States
  const [isExporting, setIsExporting] = useState(false);

  // Sharing Modal State
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  const currentSlide = slides[currentSlideIndex];

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 25, 200));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 25, 25));
  const handleResetZoom = () => setZoom(100);

  const addSlide = () => {
    const newSlide: Slide = {
      id: Date.now().toString(),
      title: `Slide ${slides.length + 1}`,
      content: 'New slide content',
      backgroundColor: '#ffffff',
      textColor: '#000000',
      elements: []
    };
    setSlides([...slides, newSlide]);
    setCurrentSlideIndex(slides.length);
  };

  const deleteSlide = (index: number) => {
    if (slides.length > 1) {
      const newSlides = slides.filter((_, i) => i !== index);
      setSlides(newSlides);
      setCurrentSlideIndex(Math.max(0, Math.min(index, newSlides.length - 1)));
    }
  };

  const duplicateSlide = (index: number) => {
    const slideToClone = slides[index];
    const newSlide: Slide = {
      ...slideToClone,
      id: Date.now().toString(),
      title: `${slideToClone.title} (Copy)`,
      elements: slideToClone.elements.map(el => ({
        ...el,
        id: `${el.id}-copy-${Date.now()}`
      }))
    };
    const newSlides = [...slides];
    newSlides.splice(index + 1, 0, newSlide);
    setSlides(newSlides);
    setCurrentSlideIndex(index + 1);
  };

  const addTextElement = () => {
    const newElement: SlideElement = {
      id: `text-${Date.now()}`,
      type: 'text',
      x: 100,
      y: 100,
      width: 200,
      height: 40,
      content: 'New Text',
      style: { fontSize: '16px', color: currentSlide.textColor }
    };
    
    const updatedSlides = slides.map((slide, index) => 
      index === currentSlideIndex 
        ? { ...slide, elements: [...slide.elements, newElement] }
        : slide
    );
    setSlides(updatedSlides);
    setSelectedElement(newElement.id);
  };

  const addShapeElement = (shapeType: 'rectangle' | 'circle') => {
    const newElement: SlideElement = {
      id: `shape-${Date.now()}`,
      type: 'shape',
      x: 150,
      y: 150,
      width: 100,
      height: 100,
      content: shapeType,
      style: { 
        backgroundColor: '#3b82f6', 
        borderRadius: shapeType === 'circle' ? '50%' : '8px' 
      }
    };
    
    const updatedSlides = slides.map((slide, index) => 
      index === currentSlideIndex 
        ? { ...slide, elements: [...slide.elements, newElement] }
        : slide
    );
    setSlides(updatedSlides);
    setSelectedElement(newElement.id);
  };

  const updateSlideProperty = (property: keyof Slide, value: string) => {
    const updatedSlides = slides.map((slide, index) => 
      index === currentSlideIndex 
        ? { ...slide, [property]: value }
        : slide
    );
    setSlides(updatedSlides);
  };

  const updateElementProperty = (elementId: string, property: string, value: string | number) => {
    const updatedSlides = slides.map((slide, index) => 
      index === currentSlideIndex 
        ? {
            ...slide,
            elements: slide.elements.map(el => 
              el.id === elementId 
                ? { ...el, [property]: value }
                : el
            )
          }
        : slide
    );
    setSlides(updatedSlides);
  };

  const deleteElement = (elementId: string) => {
    const updatedSlides = slides.map((slide, index) => 
      index === currentSlideIndex 
        ? {
            ...slide,
            elements: slide.elements.filter(el => el.id !== elementId)
          }
        : slide
    );
    setSlides(updatedSlides);
    setSelectedElement(null);
  };

  const selectedElementData = selectedElement 
    ? currentSlide.elements.find(el => el.id === selectedElement)
    : null;

  // AI Assistant Functions
  const aiPromptSuggestions: Record<string, AIPromptSuggestion[]> = {
    slide: [
      {
        title: "Introduction Slide",
        prompt: "Generate an introduction slide for a business presentation",
        icon: <MessageCircle className="w-4 h-4 text-primary" />
      },
      {
        title: "Team Overview",
        prompt: "Create a slide introducing our team members and their roles",
        icon: <MessageCircle className="w-4 h-4 text-primary" />
      },
      {
        title: "Product Features",
        prompt: "List the key features of our product in a concise slide format",
        icon: <MessageCircle className="w-4 h-4 text-primary" />
      }
    ],
    element: [
      {
        title: "Catchy Headline",
        prompt: "Write a catchy headline for my presentation slide",
        icon: <Type className="w-4 h-4 text-primary" />
      },
      {
        title: "Value Proposition",
        prompt: "Create a compelling value proposition statement",
        icon: <Type className="w-4 h-4 text-primary" />
      },
      {
        title: "Call to Action",
        prompt: "Generate a strong call to action for the final slide",
        icon: <Type className="w-4 h-4 text-primary" />
      }
    ],
    optimize: [
      {
        title: "Simplify Language",
        prompt: "Simplify the language in my selected text while keeping the meaning",
        icon: <Wand2 className="w-4 h-4 text-primary" />
      },
      {
        title: "Make More Professional",
        prompt: "Rewrite the selected text to sound more professional",
        icon: <Wand2 className="w-4 h-4 text-primary" />
      },
      {
        title: "Fix Grammar",
        prompt: "Fix any grammar or spelling issues in the selected text",
        icon: <Wand2 className="w-4 h-4 text-primary" />
      }
    ]
  };

  const handleAIGenerate = async () => {
    if (!aiPrompt.trim()) return;
    
    setIsGenerating(true);
    setGenerationError(null);
    setGeneratedContent(null);
    
    try {
      const { generateSlideContent, generateTextElement, optimizeContent } = await import('@/lib/openai/generation');
      
      let response;
      
      if (aiGenerationType === 'slide') {
        response = await generateSlideContent(aiPrompt);
      } else if (aiGenerationType === 'element') {
        response = await generateTextElement(aiPrompt);
      } else if (aiGenerationType === 'optimize' && selectedElementData) {
        response = await optimizeContent(selectedElementData.content, aiPrompt);
      } else {
        throw new Error("Invalid generation type or missing selection");
      }
      
      if (response.success) {
        setGeneratedContent(response.content);
      } else {
        setGenerationError(response.error || "Generation failed");
      }
    } catch (error) {
      console.error('AI generation error:', error);
      setGenerationError(error instanceof Error ? error.message : "Failed to generate content. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const applyGeneratedContent = () => {
    if (!generatedContent) return;
    
    if (aiGenerationType === 'slide') {
      // Create a new slide with the generated content
      const newSlide: Slide = {
        id: Date.now().toString(),
        title: 'AI Generated Slide',
        content: generatedContent,
        backgroundColor: '#ffffff',
        textColor: '#000000',
        elements: [
          {
            id: `title-${Date.now()}`,
            type: 'text',
            x: 50,
            y: 100,
            width: 400,
            height: 60,
            content: generatedContent.split('\n')[0].replace('# ', ''),
            style: { fontSize: '32px', fontWeight: 'bold' }
          },
          {
            id: `content-${Date.now()}`,
            type: 'text',
            x: 50,
            y: 180,
            width: 400,
            height: 200,
            content: generatedContent.split('\n').slice(1).join('\n'),
            style: { fontSize: '16px', color: '#666666' }
          }
        ]
      };
      
      const newSlides = [...slides];
      newSlides.splice(currentSlideIndex + 1, 0, newSlide);
      setSlides(newSlides);
      setCurrentSlideIndex(currentSlideIndex + 1);
    } else if (aiGenerationType === 'element' || (aiGenerationType === 'optimize' && selectedElementData)) {
      // Add a new text element or update the selected element
      if (aiGenerationType === 'optimize' && selectedElementData) {
        const updatedSlides = slides.map((slide, index) => 
          index === currentSlideIndex 
            ? {
                ...slide,
                elements: slide.elements.map(el => 
                  el.id === selectedElementData.id 
                    ? { ...el, content: generatedContent }
                    : el
                )
              }
            : slide
        );
        setSlides(updatedSlides);
      } else {
        const newElement: SlideElement = {
          id: `ai-text-${Date.now()}`,
          type: 'text',
          x: 100,
          y: 100,
          width: 400,
          height: 60,
          content: generatedContent,
          style: { fontSize: '24px', color: currentSlide.textColor }
        };
        
        const updatedSlides = slides.map((slide, index) => 
          index === currentSlideIndex 
            ? { ...slide, elements: [...slide.elements, newElement] }
            : slide
        );
        setSlides(updatedSlides);
        setSelectedElement(newElement.id);
      }
    }
    
    // Reset AI states
    setGeneratedContent(null);
    setAiPrompt("");
  };

  const handlePromptSuggestionSelect = (suggestion: string) => {
    setAiPrompt(suggestion);
  };

  const handleExportPDF = async () => {
    setIsExporting(true);
    
    try {
      const { generateAndDownloadPDF } = await import('@/lib/pdf/generator');
      
      const success = await generateAndDownloadPDF({
        slides,
        template: 'A', // TODO: Make this configurable
        title: 'Pitch Deck',
        filename: `pitch_deck_${new Date().toISOString().slice(0, 10)}.pdf`
      });
      
      if (!success) {
        // TODO: Show error toast/notification
        console.error('PDF export failed');
      }
    } catch (error) {
      console.error('PDF export error:', error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className={cn("flex h-screen bg-background", className)}>
      {/* Toolbar */}
      <div className="w-16 bg-muted border-r border-border flex flex-col items-center py-4 space-y-2">
        <Button variant="ghost" size="icon" className="w-12 h-12">
          <Move className="w-5 h-5" />
        </Button>
        <Button 
          variant="ghost" 
          size="icon" 
          className="w-12 h-12"
          onClick={addTextElement}
        >
          <Type className="w-5 h-5" />
        </Button>
        <Button variant="ghost" size="icon" className="w-12 h-12">
          <ImageIcon className="w-5 h-5" />
        </Button>
        <Button 
          variant="ghost" 
          size="icon" 
          className="w-12 h-12"
          onClick={() => addShapeElement('rectangle')}
        >
          <Square className="w-5 h-5" />
        </Button>
        <Button 
          variant="ghost" 
          size="icon" 
          className="w-12 h-12"
          onClick={() => addShapeElement('circle')}
        >
          <Circle className="w-5 h-5" />
        </Button>
        <Separator className="w-8" />
        <Button variant="ghost" size="icon" className="w-12 h-12">
          <Palette className="w-5 h-5" />
        </Button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Top Toolbar */}
        <div className="h-14 bg-background border-b border-border flex items-center justify-between px-4">
          <div className="flex items-center space-x-2">
            <h1 className="text-lg font-semibold">Pitch Deck Editor</h1>
            <Separator orientation="vertical" className="h-6" />
            <Button variant="ghost" size="sm">
              <Play className="w-4 h-4 mr-2" />
              Present
            </Button>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={handleExportPDF}
              disabled={isExporting}
            >
              {isExporting ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Download className="w-4 h-4 mr-2" />
              )}
              {isExporting ? 'Exporting...' : 'Export PDF'}
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setIsShareModalOpen(true)}
            >
              <Share className="w-4 h-4 mr-2" />
              Share
            </Button>
          </div>
        </div>

        {/* Canvas Area */}
        <div className="flex-1 flex">
          {/* Slide Thumbnails */}
          <div className="w-64 bg-muted/30 border-r border-border p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium">Slides</h3>
              <Button 
                variant="ghost" 
                size="icon" 
                className="w-8 h-8"
                onClick={addSlide}
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="space-y-2">
              {slides.map((slide, index) => (
                <div
                  key={slide.id}
                  className={cn(
                    "relative group p-2 rounded-lg border-2 cursor-pointer transition-colors",
                    index === currentSlideIndex 
                      ? "border-primary bg-primary/5" 
                      : "border-border hover:border-primary/50"
                  )}
                  onClick={() => setCurrentSlideIndex(index)}
                >
                  <div 
                    className="w-full h-20 rounded border bg-background mb-2"
                    style={{ backgroundColor: slide.backgroundColor }}
                  >
                    <div className="p-2 text-xs truncate" style={{ color: slide.textColor }}>
                      {slide.title}
                    </div>
                  </div>
                  
                  <div className="text-xs text-muted-foreground truncate">
                    {slide.title}
                  </div>
                  
                  <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity flex space-x-1">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="w-6 h-6"
                      onClick={(e) => {
                        e.stopPropagation();
                        duplicateSlide(index);
                      }}
                    >
                      <Copy className="w-3 h-3" />
                    </Button>
                    {slides.length > 1 && (
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="w-6 h-6"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteSlide(index);
                        }}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Canvas */}
          <div className="flex-1 bg-muted/20 p-8 overflow-auto">
            <div className="flex flex-col items-center">
              {/* Zoom Controls */}
              <div className="mb-4 flex items-center space-x-2 bg-background rounded-lg border border-border p-2">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="w-8 h-8"
                  onClick={handleZoomOut}
                >
                  <ZoomOut className="w-4 h-4" />
                </Button>
                <span className="text-sm font-medium min-w-[60px] text-center">
                  {zoom}%
                </span>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="w-8 h-8"
                  onClick={handleZoomIn}
                >
                  <ZoomIn className="w-4 h-4" />
                </Button>
                <Separator orientation="vertical" className="h-6" />
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="w-8 h-8"
                  onClick={handleResetZoom}
                >
                  <RotateCcw className="w-4 h-4" />
                </Button>
              </div>

              {/* Slide Canvas */}
              <div 
                ref={canvasRef}
                className="relative bg-white rounded-lg shadow-lg border border-border overflow-hidden"
                style={{
                  width: `${(800 * zoom) / 100}px`,
                  height: `${(600 * zoom) / 100}px`,
                  backgroundColor: currentSlide.backgroundColor,
                  transform: `scale(${zoom / 100})`,
                  transformOrigin: 'top center'
                }}
              >
                {currentSlide.elements.map((element) => (
                  <div
                    key={element.id}
                    className={cn(
                      "absolute cursor-pointer border-2 transition-colors",
                      selectedElement === element.id 
                        ? "border-primary" 
                        : "border-transparent hover:border-primary/50"
                    )}
                    style={{
                      left: element.x,
                      top: element.y,
                      width: element.width,
                      height: element.height,
                      ...element.style
                    }}
                    onClick={() => setSelectedElement(element.id)}
                  >
                    {element.type === 'text' && (
                      <div 
                        className="w-full h-full flex items-center px-2"
                        style={element.style}
                      >
                        {element.content}
                      </div>
                    )}
                    {element.type === 'shape' && (
                      <div 
                        className="w-full h-full"
                        style={element.style}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Sidebar */}
      <div className="w-80 bg-background border-l border-border">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
          <TabsList className="grid w-full grid-cols-4 m-4">
            <TabsTrigger value="design">Design</TabsTrigger>
            <TabsTrigger value="elements">Elements</TabsTrigger>
            <TabsTrigger value="ai" className="flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              <span>AI</span>
            </TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <div className="flex-1 overflow-auto">
            <TabsContent value="design" className="p-4 space-y-6">
              <div>
                <h3 className="text-sm font-medium mb-3">Slide Properties</h3>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="slide-title" className="text-xs">Title</Label>
                    <Input
                      id="slide-title"
                      value={currentSlide.title}
                      onChange={(e) => updateSlideProperty('title', e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="bg-color" className="text-xs">Background Color</Label>
                    <Input
                      id="bg-color"
                      type="color"
                      value={currentSlide.backgroundColor}
                      onChange={(e) => updateSlideProperty('backgroundColor', e.target.value)}
                      className="mt-1 h-10"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="text-color" className="text-xs">Text Color</Label>
                    <Input
                      id="text-color"
                      type="color"
                      value={currentSlide.textColor}
                      onChange={(e) => updateSlideProperty('textColor', e.target.value)}
                      className="mt-1 h-10"
                    />
                  </div>
                </div>
              </div>

              {selectedElementData && (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-medium">Selected Element</h3>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="w-6 h-6"
                      onClick={() => deleteElement(selectedElementData.id)}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                  
                  <div className="space-y-4">
                    {selectedElementData.type === 'text' && (
                      <div>
                        <Label htmlFor="element-content" className="text-xs">Content</Label>
                        <Input
                          id="element-content"
                          value={selectedElementData.content}
                          onChange={(e) => updateElementProperty(selectedElementData.id, 'content', e.target.value)}
                          className="mt-1"
                        />
                      </div>
                    )}
                    
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label htmlFor="element-x" className="text-xs">X Position</Label>
                        <Input
                          id="element-x"
                          type="number"
                          value={selectedElementData.x}
                          onChange={(e) => updateElementProperty(selectedElementData.id, 'x', parseInt(e.target.value))}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="element-y" className="text-xs">Y Position</Label>
                        <Input
                          id="element-y"
                          type="number"
                          value={selectedElementData.y}
                          onChange={(e) => updateElementProperty(selectedElementData.id, 'y', parseInt(e.target.value))}
                          className="mt-1"
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label htmlFor="element-width" className="text-xs">Width</Label>
                        <Input
                          id="element-width"
                          type="number"
                          value={selectedElementData.width}
                          onChange={(e) => updateElementProperty(selectedElementData.id, 'width', parseInt(e.target.value))}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="element-height" className="text-xs">Height</Label>
                        <Input
                          id="element-height"
                          type="number"
                          value={selectedElementData.height}
                          onChange={(e) => updateElementProperty(selectedElementData.id, 'height', parseInt(e.target.value))}
                          className="mt-1"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="elements" className="p-4 space-y-4">
              <div>
                <h3 className="text-sm font-medium mb-3">Add Elements</h3>
                <div className="grid grid-cols-2 gap-2">
                  <Button 
                    variant="outline" 
                    className="h-20 flex flex-col"
                    onClick={addTextElement}
                  >
                    <Type className="w-6 h-6 mb-2" />
                    <span className="text-xs">Text</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex flex-col">
                    <ImageIcon className="w-6 h-6 mb-2" />
                    <span className="text-xs">Image</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="h-20 flex flex-col"
                    onClick={() => addShapeElement('rectangle')}
                  >
                    <Square className="w-6 h-6 mb-2" />
                    <span className="text-xs">Rectangle</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="h-20 flex flex-col"
                    onClick={() => addShapeElement('circle')}
                  >
                    <Circle className="w-6 h-6 mb-2" />
                    <span className="text-xs">Circle</span>
                  </Button>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium mb-3">Layers</h3>
                <div className="space-y-1">
                  {currentSlide.elements.map((element) => (
                    <div
                      key={element.id}
                      className={cn(
                        "flex items-center justify-between p-2 rounded border cursor-pointer",
                        selectedElement === element.id 
                          ? "border-primary bg-primary/5" 
                          : "border-border hover:border-primary/50"
                      )}
                      onClick={() => setSelectedElement(element.id)}
                    >
                      <div className="flex items-center space-x-2">
                        {element.type === 'text' && <Type className="w-4 h-4" />}
                        {element.type === 'image' && <ImageIcon className="w-4 h-4" />}
                        {element.type === 'shape' && <Square className="w-4 h-4" />}
                        <span className="text-xs truncate">
                          {element.type === 'text' ? element.content : `${element.type} ${element.id.slice(-4)}`}
                        </span>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="w-6 h-6"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteElement(element.id);
                        }}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="ai" className="p-4 space-y-4">
              <div>
                <div className="flex items-center space-x-2 mb-3">
                  <Sparkles className="w-4 h-4 text-primary" />
                  <h3 className="text-sm font-medium">AI Content Generator</h3>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label className="text-xs">Generation Type</Label>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant={aiGenerationType === 'slide' ? 'default' : 'outline'}
                        size="sm"
                        className="flex-1"
                        onClick={() => setAiGenerationType('slide')}
                      >
                        Slide
                      </Button>
                      <Button
                        variant={aiGenerationType === 'element' ? 'default' : 'outline'}
                        size="sm"
                        className="flex-1"
                        onClick={() => setAiGenerationType('element')}
                      >
                        Element
                      </Button>
                      <Button
                        variant={aiGenerationType === 'optimize' ? 'default' : 'outline'}
                        size="sm"
                        className="flex-1"
                        onClick={() => setAiGenerationType('optimize')}
                        disabled={!selectedElementData || selectedElementData.type !== 'text'}
                      >
                        Optimize
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="ai-prompt" className="text-xs">Prompt</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-7 px-2">
                            <Wand2 className="w-3.5 h-3.5 text-muted-foreground" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-72 p-2">
                          <div className="space-y-1">
                            <h4 className="text-xs font-medium text-muted-foreground">Suggestions</h4>
                            <div className="space-y-1">
                              {aiPromptSuggestions[aiGenerationType].map((suggestion, index) => (
                                <button
                                  key={index}
                                  type="button"
                                  onClick={() => handlePromptSuggestionSelect(suggestion.prompt)}
                                  className="w-full text-left p-2 text-xs hover:bg-muted rounded-md transition-colors flex items-center gap-2"
                                >
                                  {suggestion.icon}
                                  <span>{suggestion.title}</span>
                                </button>
                              ))}
                            </div>
                          </div>
                        </PopoverContent>
                      </Popover>
                    </div>
                    <Textarea
                      id="ai-prompt"
                      value={aiPrompt}
                      onChange={(e) => setAiPrompt(e.target.value)}
                      placeholder={
                        aiGenerationType === 'slide' 
                          ? "Describe the slide you want to create..." 
                          : aiGenerationType === 'element'
                          ? "Describe the text element you want to generate..."
                          : "Describe how you want to optimize the selected text..."
                      }
                      className="min-h-[100px]"
                    />
                  </div>

                  {generationError && (
                    <div className="p-3 bg-destructive/10 text-destructive rounded-md flex items-center gap-2 text-sm">
                      <AlertCircle className="w-4 h-4" />
                      <p>{generationError}</p>
                    </div>
                  )}

                  {generatedContent && (
                    <Card className="overflow-hidden">
                      <CardContent className="p-3">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <h4 className="text-xs font-medium">Generated Content</h4>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-7 px-2"
                              onClick={() => setGeneratedContent(null)}
                            >
                              <RefreshCw className="w-3.5 h-3.5 text-muted-foreground" />
                            </Button>
                          </div>
                          <div className="p-3 bg-muted/50 rounded-md text-sm max-h-[150px] overflow-y-auto whitespace-pre-wrap">
                            {generatedContent}
                          </div>
                          <Button 
                            size="sm" 
                            className="w-full"
                            onClick={applyGeneratedContent}
                          >
                            <Check className="w-4 h-4 mr-2" />
                            Apply to {aiGenerationType === 'slide' ? 'New Slide' : aiGenerationType === 'optimize' ? 'Selected Element' : 'New Element'}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  <Button 
                    onClick={handleAIGenerate}
                    disabled={isGenerating || !aiPrompt.trim() || (aiGenerationType === 'optimize' && !selectedElementData)}
                    className="w-full"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 mr-2" />
                        Generate with AI
                      </>
                    )}
                  </Button>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="text-sm font-medium mb-3">AI Features</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-md">
                    <div className="flex items-center space-x-2">
                      <BrainCircuit className="w-4 h-4 text-primary" />
                      <span className="text-sm">Smart Layout</span>
                    </div>
                    <Button variant="outline" size="sm">
                      Apply
                    </Button>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-md">
                    <div className="flex items-center space-x-2">
                      <Wand2 className="w-4 h-4 text-primary" />
                      <span className="text-sm">Style Suggestions</span>
                    </div>
                    <Button variant="outline" size="sm">
                      View
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="settings" className="p-4 space-y-4">
              <div>
                <h3 className="text-sm font-medium mb-3">Presentation Settings</h3>
                <div className="space-y-4">
                  <div>
                    <Label className="text-xs">Slide Size</Label>
                    <div className="mt-1 text-xs text-muted-foreground">
                      16:9 (800 × 600px)
                    </div>
                  </div>
                  
                  <div>
                    <Label className="text-xs">Total Slides</Label>
                    <div className="mt-1 text-xs text-muted-foreground">
                      {slides.length} slides
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="text-sm font-medium mb-3">Export Options</h3>
                <div className="space-y-2">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={handleExportPDF}
                    disabled={isExporting}
                  >
                    {isExporting ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Download className="w-4 h-4 mr-2" />
                    )}
                    {isExporting ? 'Generating PDF...' : 'Export as PDF'}
                  </Button>
                  <Button variant="outline" className="w-full justify-start" disabled>
                    <Download className="w-4 h-4 mr-2" />
                    Export as PowerPoint (Coming Soon)
                  </Button>
                  <Button variant="outline" className="w-full justify-start" disabled>
                    <Download className="w-4 h-4 mr-2" />
                    Export as Images (Coming Soon)
                  </Button>
                </div>
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </div>

      {/* Sharing Modal */}
      <SharingModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        presentationTitle="Pitch Deck Presentation"
        presentationId="deck-123"
      />
    </div>
  );
} 