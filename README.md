# HeyCss

A collection of CSS style tools providing real-time display of predefined CSS effects with convenient code reuse features.

## Overview

HeyCss is a web-based tool that helps developers discover, preview, and copy CSS effects including:

- **Border Effects** - Various border styles and animations
- **Box Shadows** - Professional shadow presets
- **Shapes** - CSS geometric shapes
- **Text Effects** - Typography styling and animations

## Features

- **Real-time Preview** - View CSS effects instantly
- **One-click Copy** - Copy CSS code to clipboard with a single click
- **Dynamic Background** - Customize background color for preview


## Tech Stack

- **Framework**: Next.js 16
- **Styling**: Tailwind CSS 4
- **UI Components**: Shadcn-ui
- **Icons**: Lucide React
- **Language**: TypeScript

## Getting Started

1. Clone the Repository

```bash
git clone https://github.com/isixe/HeyCss.git
cd HeyCss
```

2. Install Dependencies

```bash
pnpm install
```

3. Start Development Server

```bash
pnpm dev
```

The application will be available at `http://localhost:3000` in your browser.

## Project Structure

```
HeyCss/
├── public/data/              # CSS effect data (JSON files)
│   ├── border.json
│   ├── boxShadow.json
│   ├── shape.json
│   └── text.json
├── src/
│   ├── app/                  # Next.js App Router
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/           # React components
│   │   ├── layout/           # Layout components
│   │   ├── ui/               # UI components (shadcn-ui)
│   │   └── widget/           # Feature widgets
│   ├── core/                 # Core logic
│   │   └── parser.ts
│   ├── data/                 # Static data
│   │   └── enum.ts
│   ├── hooks/                # Custom React hooks
│   │   ├── use-mobile.ts
│   │   └── use-toast.ts
│   ├── lib/                  # Utilities
│   │   └── utils.ts
│   ├── styles/               # Global styles
│   │   └── globals.css
│   ├── types/                # TypeScript definitions
│   └── utils/                # Helper functions
│       └── clipboard.ts
├── .gitignore
├── components.json           # shadcn-ui config
├── next.config.mjs           # Next.js config
├── package.json
├── postcss.config.mjs        # PostCSS config
├── pnpm-lock.yaml
└── tsconfig.json            # TypeScript config
```
## License

This project is licensed under the [MIT License](LICENSE).

