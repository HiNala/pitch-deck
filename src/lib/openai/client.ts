import OpenAI from 'openai'

if (!process.env.OPENAI_API_KEY) {
  throw new Error('Missing OPENAI_API_KEY environment variable')
}

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

// Slide generation schema for function calling
export const slideSchema = {
  name: "write_slide",
  description: "Generate professional pitch deck slide content",
  parameters: {
    type: "object",
    properties: {
      heading: { 
        type: "string",
        description: "Clear, compelling slide headline"
      },
      bullets: { 
        type: "array", 
        items: { type: "string" },
        description: "3-5 concise bullet points that support the heading"
      },
      image_prompt: { 
        type: "string", 
        description: "Optional prompt for generating relevant slide imagery"
      },
      notes: {
        type: "string",
        description: "Speaker notes and additional context"
      }
    },
    required: ["heading", "bullets"]
  }
} as const

export type SlideContent = {
  heading: string
  bullets: string[]
  image_prompt?: string
  notes?: string
} 