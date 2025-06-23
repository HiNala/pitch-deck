import { renderToStream } from '@react-pdf/renderer';
import { PresentationPDF } from '@/components/pdf/slide-template';
import type { Slide } from '@/components/pdf/slide-template';

export interface PDFGenerationOptions {
  slides: Slide[];
  template?: 'A' | 'B' | 'C' | 'D';
  title?: string;
  filename?: string;
}

export interface PDFGenerationResult {
  success: boolean;
  url?: string;
  filename?: string;
  error?: string;
}

/**
 * Generate PDF from slides (client-side download)
 */
export async function generatePDFDownload(options: PDFGenerationOptions): Promise<PDFGenerationResult> {
  try {
    const { slides, template = 'A', title = 'Presentation', filename } = options;
    
    // Import React dynamically for client-side usage
    const React = await import('react');
    
    // Create PDF document
    const pdfDocument = React.createElement(PresentationPDF, {
      slides,
      template,
      title
    });
    
    // Generate PDF stream
    const stream = await renderToStream(pdfDocument);
    
    // Convert stream to blob for download
    const chunks: Buffer[] = [];
    
    // Handle the readable stream
    await new Promise<void>((resolve, reject) => {
      stream.on('data', (chunk: Buffer) => chunks.push(chunk));
      stream.on('end', () => resolve());
      stream.on('error', reject);
    });
    
    const buffer = Buffer.concat(chunks);
    const blob = new Blob([buffer], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    
    // Generate filename
    const timestamp = new Date().toISOString().slice(0, 19).replace(/[:-]/g, '');
    const pdfFilename = filename || `${title.replace(/[^a-zA-Z0-9]/g, '_')}_${timestamp}.pdf`;
    
    return {
      success: true,
      url,
      filename: pdfFilename
    };
    
  } catch (error) {
    console.error('PDF generation error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'PDF generation failed'
    };
  }
}

/**
 * Trigger PDF download in browser
 */
export function downloadPDF(url: string, filename: string): void {
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.style.display = 'none';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  // Clean up object URL
  setTimeout(() => {
    URL.revokeObjectURL(url);
  }, 100);
}

/**
 * Generate and immediately download PDF
 */
export async function generateAndDownloadPDF(options: PDFGenerationOptions): Promise<boolean> {
  try {
    const result = await generatePDFDownload(options);
    
    if (result.success && result.url && result.filename) {
      downloadPDF(result.url, result.filename);
      return true;
    } else {
      console.error('PDF generation failed:', result.error);
      return false;
    }
  } catch (error) {
    console.error('PDF download failed:', error);
    return false;
  }
}

/**
 * Get PDF file size estimate
 */
export function estimatePDFSize(slideCount: number): string {
  // Rough estimate: ~50KB per slide for text-based slides
  const estimatedKB = slideCount * 50;
  
  if (estimatedKB < 1024) {
    return `~${estimatedKB}KB`;
  } else {
    const estimatedMB = (estimatedKB / 1024).toFixed(1);
    return `~${estimatedMB}MB`;
  }
}

/**
 * Validate slides for PDF generation
 */
export function validateSlidesForPDF(slides: Slide[]): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (!slides || slides.length === 0) {
    errors.push('No slides provided');
  }
  
  slides.forEach((slide, index) => {
    if (!slide.id) {
      errors.push(`Slide ${index + 1}: Missing ID`);
    }
    
    if (!slide.title || slide.title.trim() === '') {
      errors.push(`Slide ${index + 1}: Missing title`);
    }
    
    // Check for text elements
    const hasContent = slide.elements.some(el => 
      el.type === 'text' && el.content && el.content.trim() !== ''
    );
    
    if (!hasContent && (!slide.content || slide.content.trim() === '')) {
      errors.push(`Slide ${index + 1}: No content found`);
    }
  });
  
  return {
    valid: errors.length === 0,
    errors
  };
} 