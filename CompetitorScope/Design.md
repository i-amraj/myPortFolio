# Design System

## Theme
Dark, modern "intelligence dashboard" feel. Data-focused, minimal.

## Colors
- Background:       #0B1120  (deep navy)
- Surface/cards:    #111827  (dark slate)
- Border:           #1F2937
- Primary accent:   #06B6D4  (cyan) - buttons, links, highlights
- Secondary accent: #8B5CF6  (violet) - Three.js scene, charts
- Success:          #10B981  | Warning: #F59E0B | Error: #EF4444
- Text primary:     #F9FAFB  | Text secondary: #9CA3AF

## Typography
- Headings: "Space Grotesk" (Google Fonts) - bold, technical feel
- Body/data: "Inter" (Google Fonts)
- Numbers/CIN/GST: "JetBrains Mono" (monospace for data values)

## Components
- Company card: dark surface, rounded-xl, subtle border, hover glow (cyan)
- Buttons: solid cyan primary, outline violet secondary, rounded-lg
- Detail panel: slides open below the card (accordion style)
- Loading: pulsing skeleton bars, never blank screens
- Team insights: numbers shown as large stat blocks with labels

## Three.js Scene (landing only)
- Slowly rotating particle field or wireframe globe, violet/cyan tones
- Low particle count (performance), pauses when results are shown
- Must never block or overlap the search form (z-index behind content)

## Layout
- Max width 1100px, centered
- Search form: single row on desktop, stacked on mobile
- Results: single-column list of cards (not grid) for readability
