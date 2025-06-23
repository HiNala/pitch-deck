import React from 'react';
import { Document, Page, View, Text, StyleSheet, Font } from '@react-pdf/renderer';

// Register fonts for better typography
Font.register({
  family: 'Inter',
  fonts: [
    {
      src: 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.woff2',
      fontWeight: 'normal',
    },
    {
      src: 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuGKYAZ9hiA.woff2',
      fontWeight: 'bold',
    }
  ]
});

const styles = StyleSheet.create({
  page: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    padding: 40,
    fontFamily: 'Inter',
  },
  slideContainer: {
    flex: 1,
    position: 'relative',
    minHeight: '100%',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#0A0F1C',
    lineHeight: 1.2,
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 30,
    color: '#64748B',
    lineHeight: 1.4,
  },
  content: {
    fontSize: 16,
    lineHeight: 1.6,
    color: '#334155',
  },
  bulletPoint: {
    fontSize: 16,
    marginBottom: 8,
    paddingLeft: 20,
    color: '#334155',
    lineHeight: 1.5,
  },
  section: {
    marginBottom: 20,
  },
  // Template-specific styles
  templateA: {
    borderLeft: '4px solid #2563EB',
    paddingLeft: 20,
  },
  templateB: {
    borderTop: '2px solid #DC2626',
    paddingTop: 20,
  },
  templateC: {
    background: 'linear-gradient(135deg, #F59E0B 0%, #EA580C 100%)',
  },
  templateD: {
    borderRadius: 8,
    backgroundColor: '#F0FDF4',
    padding: 20,
  },
});

export interface SlideElement {
  id: string;
  type: 'text' | 'image' | 'shape';
  x: number;
  y: number;
  width: number;
  height: number;
  content: string;
  style: Record<string, unknown>;
}

export interface Slide {
  id: string;
  title: string;
  content: string;
  backgroundColor: string;
  textColor: string;
  elements: SlideElement[];
}

interface PresentationPDFProps {
  slides: Slide[];
  template?: 'A' | 'B' | 'C' | 'D';
  title?: string;
}

const SlideContent: React.FC<{ slide: Slide; template?: string }> = ({ slide, template }) => {
  const getTemplateStyle = () => {
    switch (template) {
      case 'A': return styles.templateA;
      case 'B': return styles.templateB;
      case 'C': return styles.templateC;
      case 'D': return styles.templateD;
      default: return {};
    }
  };

  // Extract title and content from elements
  const titleElement = slide.elements.find(el => 
    el.type === 'text' && 
    (el.style.fontSize === '32px' || el.style.fontWeight === 'bold')
  );
  
  const contentElements = slide.elements.filter(el => 
    el.type === 'text' && el.id !== titleElement?.id
  );

  return (
    <View style={[styles.slideContainer, getTemplateStyle()]}>
      {titleElement && (
        <Text style={styles.title}>{titleElement.content}</Text>
      )}
      
      {slide.content && slide.content !== titleElement?.content && (
        <Text style={styles.subtitle}>{slide.content}</Text>
      )}
      
      {contentElements.map((element, index) => {
        // Parse content for bullet points
        const content = element.content;
        const lines = content.split('\n').filter(line => line.trim());
        
        return (
          <View key={element.id} style={styles.section}>
            {lines.map((line, lineIndex) => {
              const isBullet = line.trim().startsWith('- ') || line.trim().startsWith('• ');
              const cleanLine = isBullet ? line.replace(/^[-•]\s*/, '') : line;
              
              return (
                <Text 
                  key={lineIndex} 
                  style={isBullet ? styles.bulletPoint : styles.content}
                >
                  {isBullet && '• '}{cleanLine}
                </Text>
              );
            })}
          </View>
        );
      })}
    </View>
  );
};

export const PresentationPDF: React.FC<PresentationPDFProps> = ({ 
  slides, 
  template = 'A',
  title = 'Presentation'
}) => (
  <Document title={title} author="Pitch Deck AI" creator="Pitch Deck AI">
    {slides.map((slide, index) => (
      <Page 
        key={slide.id} 
        size="A4" 
        orientation="landscape" 
        style={[styles.page, { backgroundColor: slide.backgroundColor || '#ffffff' }]}
      >
        <SlideContent slide={slide} template={template} />
      </Page>
    ))}
  </Document>
);

export default PresentationPDF; 