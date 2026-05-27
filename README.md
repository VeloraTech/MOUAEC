# MOUAU Entrepreneurship Club's Week - Voting Platform

## 📋 Overview

MOUAEC's Week is an interactive, modern voting platform designed to celebrate and recognize the top entrepreneurs and leaders at Michael Okpara University of Agriculture (MOUAU). This dynamic web application enables students to cast votes for the prestigious **Ambassador of MOUAEC** title during the university's annual Entrepreneurship Club celebration week.

## 🎯 Project Purpose

The platform serves as the digital hub for MOUAU's Entrepreneurship Club annual week celebration, featuring:

- **Live voting system** with real-time vote tracking
- **Interactive leaderboard** displaying current standings
- **Hero landing page** with engaging visual experience
- **Responsive design** optimized for all devices
- **Sponsor integration** for event partnerships

## 🎨 Features

### 1. **Hero Landing Page** (`mouau-hero.html`)

- Eye-catching hero section with animated glows and gradients
- Navigation with university and club branding
- Call-to-action buttons for voting and sponsorship
- Smooth scroll animations powered by GSAP

### 2. **Live Voting Dashboard** (`voting-dashboard.html`)

- Real-time leaderboard of contestants
- Live vote counting and rankings
- Visual vote distribution indicators
- Responsive grid layout for contestant cards
- Rank-based highlighting system

### 3. **Static Information Sections** (`voting-simple-sections.html`)

- "How It Works" guide
- Event timeline and schedule
- Sponsor showcasing section
- FAQ and event information
- Detailed voting mechanics explanation

### 4. **Dynamic Animations**

- GSAP animations for smooth transitions
- ScrollTrigger integration for scroll-based effects
- Gold and green gradient glows
- Noise and grid overlay effects
- Pulsing live badges and indicators

## 🛠️ Tech Stack

| Technology        | Purpose                                                  |
| ----------------- | -------------------------------------------------------- |
| **HTML5**         | Semantic markup structure                                |
| **CSS3**          | Modern styling with CSS variables and gradients          |
| **JavaScript**    | Interactive functionality and animations                 |
| **GSAP**          | Professional animation library                           |
| **ScrollTrigger** | Scroll-based animation control                           |
| **Google Fonts**  | Typography (Playfair Display, Montserrat, Syne, DM Mono) |

## 📁 Project Structure

```
MOUAU/
├── index.html                      # Main entry point
├── mouau-hero.html                 # Hero landing page
├── voting-dashboard.html           # Live voting dashboard
├── voting-simple-sections.html     # Static information sections
├── script.js                       # Core JavaScript functionality
├── styles.css                      # Global stylesheet
├── gsap.min.js                     # GSAP animation library
├── ScrollTrigger.min.js            # GSAP ScrollTrigger plugin
├── MOUOU_LOGO.webp                 # MOUAU university logo
└── IMG-20260526-WA0007-removebg-preview.png  # Club branding asset
```

## 🎨 Design System

### Color Palette

- **Background**: `#07080d` (Deep Navy)
- **Surface**: `#0e1018` (Dark Slate)
- **Primary Accent**: `#f5c842` (Gold)
- **Success**: Green glows for branding
- **Text**: `#eeeef5` (Off-white)
- **Muted**: `#4a4a5a` (Gray)

### Typography

- **Headlines**: Playfair Display, Montserrat, Syne (sans-serif)
- **Body**: DM Mono, Syne (monospace/sans-serif)
- **Weights**: 300-900 for visual hierarchy

### Components

- **Hero Badge**: Live voting indicator with pulsing dot
- **Vote Cards**: Contestant profile cards with vote bars
- **CTA Buttons**: Primary and secondary action buttons
- **Leaderboard**: Ranked display with visual emphasis

## 🚀 Getting Started

### Installation

1. Clone or download the project
2. No build process required - open in any modern browser
3. Ensure all assets (images, fonts) are in the same directory

### Running Locally

```bash
# Using Python's built-in server (Python 3.x)
python -m http.server 8000

# Or using Node.js http-server
npx http-server

# Then navigate to: http://localhost:8000
```

### File Linking

- All internal links use relative paths
- Update `mouau.edu.ng` reference if university domain changes
- Image assets must be in the root directory

## 📱 Responsive Design

The platform is fully responsive across all device breakpoints:

- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

Optimizations include:

- Flexible grid layouts
- Mobile-first CSS approach
- Scalable typography (clamp functions)
- Touch-friendly button sizes
- Adaptive image loading

## ♿ Accessibility Features

- Semantic HTML structure
- Proper heading hierarchy
- Alt text for images
- Color contrast compliance
- Keyboard navigation support
- ARIA labels where applicable

## 🔒 Browser Compatibility

- Chrome/Chromium (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 📊 Performance Optimizations

- Minified animation libraries (GSAP, ScrollTrigger)
- WebP image format for logos
- CSS variable system for reduced file size
- Optimized font loading
- Reduced motion support for accessibility

## 🎓 Educational Purpose

This project demonstrates modern web development practices including:

- Semantic HTML markup
- CSS custom properties and grid layouts
- JavaScript DOM manipulation
- Third-party library integration (GSAP)
- Responsive design patterns
- Event-driven architecture

## 🤝 Sponsorship Integration

The platform includes dedicated sponsor sections and calls-to-action, allowing partners to showcase support for MOUAU's entrepreneurship initiative.

## 📧 Contact & Support

For questions about the voting platform or event details, visit:

- **University Website**: [mouau.edu.ng](https://mouau.edu.ng)
- **Event Date**: Students' Week 2025
- **Voting Status**: Check live badges on the platform

## 📄 License

This project is created for Michael Okpara University of Agriculture (MOUAU) Entrepreneurship Club. All rights reserved.

---

**Last Updated**: May 26, 2026

**Project Status**: ✅ Live & Active

**Maintained By**: MOUAU Entrepreneurship Club (MOUAEC)


