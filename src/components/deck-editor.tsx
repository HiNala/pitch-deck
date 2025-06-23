"use client";

import * as React from "react";
import { useState, useRef } from "react";
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
  Copy
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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
            <Button variant="ghost" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button variant="ghost" size="sm">
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
          <TabsList className="grid w-full grid-cols-3 m-4">
            <TabsTrigger value="design">Design</TabsTrigger>
            <TabsTrigger value="elements">Elements</TabsTrigger>
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
                  <Button variant="outline" className="w-full justify-start">
                    <Download className="w-4 h-4 mr-2" />
                    Export as PDF
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Download className="w-4 h-4 mr-2" />
                    Export as PowerPoint
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Download className="w-4 h-4 mr-2" />
                    Export as Images
                  </Button>
                </div>
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
} 