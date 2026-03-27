# ARTARTIST - Art Marketplace Landing Page

A modern, responsive landing page for an art marketplace built with React and Tailwind CSS.

## Features

- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Modern UI**: Clean, minimal design with bold typography
- **Interactive Elements**: Hover effects and transitions throughout
- **Component-Based Structure**: Organized, reusable React components

## Tech Stack

- **React 18**: Modern functional components with hooks
- **Tailwind CSS**: Utility-first CSS framework
- **JavaScript ES6+**: Modern JavaScript features

## Project Structure

```
src/
├── components/
│   ├── Navbar.jsx      # Navigation header with logo and menu
│   ├── Hero.jsx        # Hero section with search functionality
│   ├── Cards.jsx       # Feature cards (Art Store & NFT Launch)
│   └── Home.jsx        # Main page component
├── App.jsx             # Root application component
├── index.js            # Application entry point
└── index.css           # Tailwind CSS imports
```

## Getting Started

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Start Development Server**:
   ```bash
   npm start
   ```

3. **Open Browser**:
   Navigate to `http://localhost:3000`

## Components Overview

### Navbar.jsx
- Logo with split color design (ART in black, ARTIST in red)
- Center navigation with active state indicators
- Account button and "JOIN ARTIST HUB" CTA
- Mobile-responsive hamburger menu

### Hero.jsx
- Bold "Discover Art" heading with color split
- Interactive search bar with microphone and camera icons
- Trending tags (CANVAS, NFTS, MANDALAS)
- Fully responsive layout

### Cards.jsx
- Two-column grid layout
- **Left Card**: Art Supply Store with "LIVE NOW" badge
- **Right Card**: NFT Launch with icon and tags
- Hover effects and smooth transitions

### Home.jsx
- Main layout component combining all sections
- Clean component hierarchy

## Design Features

- **Color Scheme**: Black, white, and red accent colors
- **Typography**: Bold, impactful headings
- **Spacing**: Consistent padding and margins
- **Rounded Corners**: Modern rounded-xl and rounded-2xl styling
- **Shadows**: Subtle shadow effects for depth
- **Transitions**: Smooth hover states throughout

## Customization

The design is easily customizable using Tailwind CSS utility classes. Key areas to modify:

- Colors: Update `text-red-600`, `bg-black`, etc.
- Spacing: Adjust `p-*`, `m-*`, `gap-*` classes
- Typography: Modify `text-*`, `font-*` classes
- Layout: Change grid and flexbox utilities

## Production Build

```bash
npm run build
```

This creates an optimized production build in the `build/` directory.

# ARTAFD
