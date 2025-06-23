"use client";

import { useRouter } from "next/navigation";
import { PitchDeckDashboard } from "@/components/template-dashboard";

export default function Home() {
  const router = useRouter();

  const handleTemplateSelect = (templateId: string) => {
    console.log("Selected template:", templateId);
    // Navigate to deck editor with selected template
    router.push(`/deck?template=${templateId}`);
  };

  const handleCreateNew = () => {
    console.log("Creating new presentation from scratch");
    // Navigate to deck editor with blank template
    router.push("/deck");
  };

  return (
    <PitchDeckDashboard
      onTemplateSelect={handleTemplateSelect}
      onCreateNew={handleCreateNew}
    />
  );
}
