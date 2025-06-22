"use client";

import React from "react";
import { motion } from "framer-motion";
import { Presentation, BarChart3, Users, Zap, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface TemplateCardProps {
  id: string;
  title: string;
  description: string;
  category: string;
  icon: React.ReactNode;
  gradient: string;
  preview?: string;
  className?: string;
}

interface PitchDeckDashboardProps {
  templates?: TemplateCardProps[];
  onTemplateSelect?: (templateId: string) => void;
  onCreateNew?: () => void;
  className?: string;
}

const TemplateCard = ({ 
  template, 
  onSelect 
}: { 
  template: TemplateCardProps; 
  onSelect?: (id: string) => void;
}) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -8 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        "group relative min-h-[400px] cursor-pointer overflow-hidden rounded-3xl transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/10",
        template.className
      )}
      onClick={() => onSelect?.(template.id)}
    >
      {/* Full Gradient Background */}
      <div 
        className={cn(
          "absolute inset-0 transition-all duration-500 group-hover:scale-105",
          template.gradient
        )}
      />
      
      {/* Glassmorphism Overlay */}
      <div className="absolute inset-0 bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl glass" />
      
      {/* Floating Icon */}
      <div className="absolute top-8 right-8 w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl border border-white/30 flex items-center justify-center text-white text-2xl transition-all duration-500 group-hover:scale-110 group-hover:rotate-12">
        {template.icon}
      </div>

      {/* Content */}
      <div className="relative z-10 p-8 h-full flex flex-col justify-between">
        {/* Top Section */}
        <div>
          <div className="inline-block mb-6">
            <span className="text-xs font-semibold text-white/90 uppercase tracking-wider bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/30">
              {template.category}
            </span>
          </div>
          
          <h3 className="text-2xl font-bold text-white mb-4 leading-tight">
            {template.title}
          </h3>
          
          <p className="text-white/80 leading-relaxed text-sm">
            {template.description}
          </p>
        </div>

        {/* Bottom Action */}
        <div className="mt-8">
          <div className="opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 delay-100">
            <Button 
              variant="secondary" 
              size="lg"
              className="w-full bg-white/20 backdrop-blur-md border border-white/30 text-white hover:bg-white/30 hover:scale-105 transition-all duration-300 font-semibold"
            >
              Use This Template
            </Button>
          </div>
        </div>
      </div>

      {/* Animated Background Elements */}
      <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-white/5 rounded-full blur-xl transition-all duration-700 group-hover:scale-150 group-hover:bg-white/10" />
      <div className="absolute bottom-1/4 right-1/4 w-24 h-24 bg-white/5 rounded-full blur-xl transition-all duration-700 delay-200 group-hover:scale-150 group-hover:bg-white/10" />
    </motion.div>
  );
};

const FloatingActionButton = ({ onClick }: { onClick?: () => void }) => {
  return (
    <motion.button
      whileHover={{ scale: 1.1, rotate: 90 }}
      whileTap={{ scale: 0.9 }}
      className="fixed bottom-8 right-8 w-16 h-16 bg-gradient-to-r from-electric-500 to-electric-500/80 text-white rounded-2xl shadow-2xl hover:shadow-electric-500/25 transition-all duration-500 flex items-center justify-center z-50 backdrop-blur-sm border border-electric-500/20"
      onClick={onClick}
    >
      <Plus className="w-7 h-7" />
    </motion.button>
  );
};

export function PitchDeckDashboard({
  templates,
  onTemplateSelect,
  onCreateNew,
  className
}: PitchDeckDashboardProps) {
  const defaultTemplates: TemplateCardProps[] = [
    {
      id: "template-a",
      title: "Template A: Executive Brief",
      description: "Perfect for investor presentations with sleek gradients from Electric Blue to Deep Purple. Professional, modern, and data-driven.",
      category: "Investment",
      icon: <Zap className="w-6 h-6" />,
      gradient: "bg-gradient-to-br from-electric-500 via-blue-600 to-purple-700"
    },
    {
      id: "template-b", 
      title: "Template B: Strategic Focus",
      description: "Clean monochromatic design with Strategic Red highlights. Ideal for corporate presentations and strategic planning sessions.",
      category: "Corporate",
      icon: <BarChart3 className="w-6 h-6" />,
      gradient: "bg-gradient-to-br from-gray-800 via-gray-700 to-red-600"
    },
    {
      id: "template-c",
      title: "Template C: Innovation Deck",
      description: "Warm gradients from Gold to Deep Orange create an approachable yet professional feel for product launches and innovation showcases.",
      category: "Product",
      icon: <Presentation className="w-6 h-6" />,
      gradient: "bg-gradient-to-br from-yellow-500 via-orange-500 to-red-600"
    },
    {
      id: "template-d",
      title: "Template D: Growth Story",
      description: "Forest Green to Teal gradients perfect for sustainability, growth, and environmental presentations. Fresh and forward-thinking.",
      category: "Growth",
      icon: <Users className="w-6 h-6" />,
      gradient: "bg-gradient-to-br from-green-600 via-emerald-600 to-teal-600"
    }
  ];

  const displayTemplates = templates || defaultTemplates;

  return (
    <div className={cn("min-h-screen bg-gradient-to-br from-navy-900 via-gray-900 to-navy-900 text-white p-6", className)}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div>
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 leading-tight">
                Choose Your
                <span className="text-electric-500"> Perfect Template</span>
              </h1>
              <p className="text-lg text-gray-300 max-w-2xl leading-relaxed">
                Start with a professionally designed template crafted for executive presentations. 
                Each template embodies our &ldquo;Confidence through Clarity&rdquo; design philosophy.
              </p>
            </div>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                size="lg" 
                className="whitespace-nowrap bg-electric-500 text-white hover:bg-electric-500/90 px-8 py-3 rounded-xl font-semibold"
                onClick={onCreateNew}
              >
                Start from Scratch
              </Button>
            </motion.div>
          </div>
        </div>

        {/* Template Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {displayTemplates.map((template, index) => (
            <motion.div
              key={template.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
            >
              <TemplateCard
                template={template}
                onSelect={onTemplateSelect}
              />
            </motion.div>
          ))}
        </div>

        {/* Stats Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 p-8 bg-white/5 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/10"
        >
          <div className="text-center">
            <div className="text-4xl font-extrabold text-electric-500 mb-2">4</div>
            <div className="text-gray-300 text-lg">Premium Templates</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-extrabold text-electric-500 mb-2">AI</div>
            <div className="text-gray-300 text-lg">Powered Content</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-extrabold text-electric-500 mb-2">∞</div>
            <div className="text-gray-300 text-lg">Possibilities</div>
          </div>
        </motion.div>
      </div>

      {/* Floating Action Button */}
      <FloatingActionButton onClick={onCreateNew} />
    </div>
  );
} 