# AI Assistant App

A Next.js project with TypeScript, Tailwind CSS, and shadcn/ui components.

## Tech Stack

- **Framework**: Next.js 15.5.4 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui
- **Package Manager**: pnpm
- **Linting**: ESLint

## Project Structure

```
src/
├── app/                 # Next.js App Router
│   ├── globals.css     # Global styles with Tailwind CSS
│   ├── layout.tsx      # Root layout
│   └── page.tsx        # Home page
├── components/         # React components
│   └── ui/            # shadcn/ui components
│       └── button.tsx # Button component
├── lib/               # Utility functions
│   └── utils.ts       # Utility functions (cn helper)
├── hooks/             # Custom React hooks
├── types/             # TypeScript type definitions
├── utils/             # Additional utility functions
├── constants/         # Application constants
└── styles/            # Additional styles
```

## Getting Started

1. Install dependencies:
   ```bash
   pnpm install
   ```

2. Run the development server:
   ```bash
   pnpm dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint

## shadcn/ui

This project uses shadcn/ui for UI components. The configuration is in `components.json`.

To add more components:
```bash
pnpm dlx shadcn@latest add [component-name]
```

## Features

- ✅ Next.js 15 with App Router
- ✅ TypeScript configuration
- ✅ Tailwind CSS v4 with shadcn/ui integration
- ✅ Dark theme enabled by default
- ✅ RTL (Right-to-Left) support for Persian/Arabic languages
- ✅ ESLint configuration
- ✅ Standard folder structure
- ✅ Button component with all variants for testing
- ✅ RTL layout demonstration with Persian text# ai-assistant
