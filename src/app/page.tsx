"use client";

import { PitchDeckDashboard } from "@/components/template-dashboard";

export default function Home() {
  const handleTemplateSelect = (templateId: string) => {
    console.log("Selected template:", templateId);
    // TODO: Navigate to deck editor with selected template
  };

  const handleCreateNew = () => {
    console.log("Creating new presentation from scratch");
    // TODO: Navigate to deck editor with blank template
  };

  return (
    <PitchDeckDashboard
      onTemplateSelect={handleTemplateSelect}
      onCreateNew={handleCreateNew}
    />
  );
}
