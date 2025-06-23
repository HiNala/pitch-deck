import { openai } from './client';

export interface GenerationRequest {
  type: 'slide' | 'element' | 'optimize';
  prompt: string;
  context?: {
    currentContent?: string;
    slideContext?: string;
    presentationTopic?: string;
  };
}

export interface GenerationResponse {
  content: string;
  success: boolean;
  error?: string;
}

export async function generateContent(request: GenerationRequest): Promise<GenerationResponse> {
  try {
    let systemPrompt = "";
    let userPrompt = request.prompt;

    switch (request.type) {
      case 'slide':
        systemPrompt = `You are a professional presentation expert creating investor-ready pitch deck content. 
        Generate slide content that is:
        - Concise and impactful
        - Business-focused and professional
        - Structured with clear hierarchy (title, subtitle, key points)
        - Compelling for investors and stakeholders
        
        Format your response as structured content with:
        - A clear, compelling title
        - Supporting content that's scannable and memorable
        - Action-oriented language where appropriate
        
        Keep content brief but powerful. Focus on value propositions, benefits, and clear messaging.`;
        break;

      case 'element':
        systemPrompt = `You are a copywriting expert specializing in presentation content.
        Generate concise, powerful text elements for business presentations that are:
        - Clear and memorable
        - Professional yet engaging
        - Focused on value and impact
        - Appropriate for executive audiences
        
        Keep responses brief - typically 1-3 lines maximum for headlines, 1-2 sentences for descriptions.`;
        break;

      case 'optimize':
        systemPrompt = `You are an expert presentation coach optimizing slide content.
        Improve the provided text to be:
        - More clear and concise
        - Professional and polished
        - Engaging and memorable
        - Appropriate for business presentations
        
        Maintain the original intent but enhance clarity, impact, and professionalism.
        If the original text contains specific details, preserve them while improving the presentation.`;
        
        if (request.context?.currentContent) {
          userPrompt = `Optimize this text: "${request.context.currentContent}"\n\nOptimization request: ${request.prompt}`;
        }
        break;
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: systemPrompt
        },
        {
          role: "user", 
          content: userPrompt
        }
      ],
      max_tokens: request.type === 'slide' ? 300 : 100,
      temperature: 0.7,
    });

    const content = completion.choices[0]?.message?.content;
    
    if (!content) {
      return {
        content: "",
        success: false,
        error: "No content generated"
      };
    }

    return {
      content: content.trim(),
      success: true
    };

  } catch (error) {
    console.error('OpenAI generation error:', error);
    
    return {
      content: "",
      success: false,
      error: error instanceof Error ? error.message : "Generation failed"
    };
  }
}

// Function-specific generation helpers
export async function generateSlideContent(prompt: string, context?: { presentationTopic?: string }): Promise<GenerationResponse> {
  return generateContent({
    type: 'slide',
    prompt,
    context
  });
}

export async function generateTextElement(prompt: string): Promise<GenerationResponse> {
  return generateContent({
    type: 'element',
    prompt
  });
}

export async function optimizeContent(currentContent: string, optimizationPrompt: string): Promise<GenerationResponse> {
  return generateContent({
    type: 'optimize',
    prompt: optimizationPrompt,
    context: { currentContent }
  });
} 