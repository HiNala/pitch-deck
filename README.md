# Pitch Deck AI 🚀

> Transform raw ideas into investor-ready pitch decks in minutes with AI-powered design and content generation.

## 🎯 Project Overview

**Pitch Deck AI** is a world-class platform that combines sophisticated AI content generation with professional design templates to create compelling pitch decks. Built with Next.js 15.3.3, Supabase, and OpenAI.

### Core Philosophy
- **Executive Presence**: Boardroom-ready design, never amateur
- **Effortless Power**: Complex AI hidden behind intuitive interfaces
- **Speed & Polish**: Every interaction feels fast and refined
- **Trust Through Transparency**: Users always know what's happening

---

## 🏗️ Development Progress

### ✅ Phase 1: Foundation & Infrastructure (COMPLETED)

#### Tech Stack
- **Next.js 15.3.3** with App Router and TypeScript
- **Tailwind CSS v4** with complete design system
- **Prisma ORM v5.x** with PostgreSQL
- **Supabase** for backend and authentication
- **OpenAI v4.x** for AI content generation
- **React-PDF** for export functionality

#### Current Status
- [x] Project structure with src directory
- [x] Complete design system implementation
- [x] Database schema with all models
- [x] Authentication middleware
- [x] AI integration setup
- [x] Build system optimized

---

## 🔄 Phase 2: Authentication & Database (IN PROGRESS)

### Google OAuth Setup Required

**To complete authentication setup:**

1. **Google Cloud Console**: https://console.cloud.google.com/
2. **Create OAuth 2.0 Credentials**
3. **Configure these URLs**:

```
Authorized JavaScript Origins:
- http://localhost:3000
- https://yourdomain.com

Authorized Redirect URIs:
- https://uwnvyvmhqhngbnffjrub.supabase.co/auth/v1/callback
```

### Database Deployment Checklist
- [ ] Deploy Prisma schema to Supabase
- [ ] Set up row-level security policies
- [ ] Create seed data for templates
- [ ] Test authentication flow

---

## 🎨 Phase 3: Core Components (NEXT)

### Magic MCP Integration Strategy

Use Cursor's Magic MCP tools for rapid development:

#### Dashboard Grid
```
Magic MCP Builder Prompt:
"Create a responsive dashboard grid showcasing 4 template cards in a 2x2 layout. Each card should be 280px wide with 24px gaps, featuring subtle hover states that lift the card 4px with a soft shadow."
```

#### Editor Layout
```
Magic MCP Section Prompt:
"Design a two-panel editor layout: left panel (60%) shows live slide canvas with zoom controls, right panel (40%) contains editing sidebar with tabs for Content, Design, and AI Assist."
```

### Component Checklist
- [ ] Template selection dashboard
- [ ] Dual-panel deck editor
- [ ] Live slide canvas
- [ ] AI assistance sidebar
- [ ] Navigation and toolbar
- [ ] Modal system (auth, export, share)

---

## 🤖 Phase 4: AI Integration (READY)

### OpenAI Implementation
- Content generation with function calling
- Real-time assistance
- Context-aware suggestions
- Style and tone optimization

### AI Features Checklist
- [ ] Slide content generation
- [ ] Image prompt creation
- [ ] Speaker notes generation
- [ ] Content optimization
- [ ] Bulk generation capabilities

---

## 📄 Phase 5: PDF Generation & Export

### Export Pipeline
- React-PDF template components
- Supabase storage integration
- Version management
- Download and sharing URLs

### Export Checklist
- [ ] PDF template components (A, B, C, D)
- [ ] Server-side generation
- [ ] Version control system
- [ ] Share link generation

---

## 🚀 Quick Start

### Prerequisites
- Node.js 20 LTS (use `.nvmrc`)
- pnpm 8.x
- Supabase account
- OpenAI API key

### Installation

```bash
# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env.local
# Add your API keys to .env.local

# Generate Prisma client
pnpm db:generate

# Start development server
pnpm dev
```

Visit http://localhost:3000 to see your app!

---

## 🛠️ Available Scripts

```bash
# Development
pnpm dev          # Start development server
pnpm build        # Production build
pnpm start        # Start production server
pnpm lint         # Run ESLint

# Database
pnpm db:generate  # Generate Prisma client
pnpm db:push      # Push schema to database
pnpm db:migrate   # Run database migrations
pnpm db:seed      # Seed database with sample data
```

---

## 🎨 Design System

### Color Palette - "Investor Confidence"
- **Deep Navy** (#0A0F1C) - Authority, trust
- **Electric Blue** (#2563EB) - Innovation, AI
- **Success Green** (#10B981) - Completion
- **Warning Amber** (#F59E0B) - Attention

### Typography
- **Primary**: Inter (web interfaces)
- **Presentation**: Source Sans Pro (PDF exports)

### Template Themes
- **A**: Electric Blue → Deep Purple gradient
- **B**: Monochromatic with Strategic Red
- **C**: Warm Gold → Deep Orange  
- **D**: Forest Green → Teal

---

## 🔐 Environment Variables

Required environment variables (see `.env.example`):

```env
# Database
DATABASE_URL="postgresql://..."

# Supabase
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
SUPABASE_SERVICE_ROLE="your-service-role-key"

# Google OAuth
NEXT_PUBLIC_GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# OpenAI
OPENAI_API_KEY="sk-proj-..."

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

---

## 🏛️ Architecture

### Database Models
- **User**: Authentication and profile data
- **Deck**: Presentation containers with templates
- **Slide**: Individual slide content and layout
- **DeckVersion**: Version history and snapshots
- **DeckVisit**: Analytics and sharing metrics

### Authentication Flow
- Google OAuth via Supabase Auth
- Route protection middleware
- Row-level security policies
- Session management

### AI Integration
- OpenAI function calling for content
- Real-time assistance
- Context-aware suggestions
- Multiple content generation modes

---

## 📈 Features

### Current (v1.0)
- [ ] Template-based deck creation
- [ ] AI-powered content generation
- [ ] Real-time editing
- [ ] PDF export
- [ ] Public sharing
- [ ] Basic analytics

### Future (v2.0+)
- [ ] Team collaboration
- [ ] Advanced analytics
- [ ] Custom branding
- [ ] API integrations
- [ ] Mobile app
- [ ] White-label solutions

---

## 🤝 Contributing

1. **Fork the repository**
2. **Create your feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit your changes**: `git commit -m 'Add amazing feature'`
4. **Push to the branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

### Development Guidelines
- Use Magic MCP tools for component creation
- Follow the established design system
- Write TypeScript with strict mode
- Test on multiple devices/browsers
- Maintain accessibility standards

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🌟 Acknowledgments

- **Next.js Team** for the incredible framework
- **Supabase** for the backend platform
- **OpenAI** for AI capabilities
- **Tailwind CSS** for the design system
- **shadcn/ui** for component primitives

---

**Built with ❤️ for entrepreneurs who deserve world-class pitch decks**
