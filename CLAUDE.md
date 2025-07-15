# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- **Start development server**: `npm run dev`
- **Build for production**: `npm run build` (runs TypeScript compilation then Vite build)
- **Lint code**: `npm run lint`
- **Preview production build**: `npm run preview`

## Architecture Overview

This is a React 19 + TypeScript dashboard application using a **modular use-case-based architecture**. The project follows a feature-driven approach where each feature is self-contained.

### Key Technologies
- **Frontend**: React 19, TypeScript 5.x, Vite 7
- **Styling**: Tailwind CSS 3.4 + HeroUI components
- **Routing**: React Router DOM v6
- **HTTP Client**: Axios
- **Icons**: Lucide React, Iconify
- **Animation**: Framer Motion

### Folder Structure
```
src/
├── app/                    # Application setup (router, layout, providers)
│   ├── layout/            # Layout components (AppLayout, sidebars)
│   └── router.tsx         # Route configuration
├── features/              # Feature modules (each feature is isolated)
│   ├── auth/             # Authentication (login, register)
│   ├── dashboard/        # Dashboard home
│   └── example/          # Example pages (forms, tables, data fetching)
├── shared/               # Reusable components, hooks, utilities
│   └── components/       # Shared UI components
└── App.tsx              # Root component with routing
```

### Routing Structure
- **Auth routes** (no layout): `/login`, `/register`
- **Protected routes** (with AppLayout): `/`, `/dashboard`, `/form`, `/chart`, `/table`, `/rup`

### Important Configuration Details

1. **API Proxy**: Vite is configured with a proxy for `/rup-api` that forwards to `https://isb.lkpp.go.id`
2. **TypeScript**: Uses project references with separate configs for app and node
3. **Dark Mode**: Tailwind is configured with class-based dark mode
4. **HeroUI**: Component library integrated with Tailwind
5. **ESLint**: Configured for TypeScript + React with hooks and refresh plugins

### Development Notes

- The layout system uses React Router v6 nested routes with `<Outlet />`
- Sidebar navigation is responsive with mobile toggle functionality
- External API integration example in `GetdataPage.tsx` shows data fetching patterns
- All components should use TypeScript and follow existing patterns
- Use HeroUI components for consistent UI (Table, Button, etc.)

### Code Patterns to Follow

1. **Feature isolation**: Each feature in `features/` should be self-contained
2. **Component structure**: UI components in `ui/` subdirectories
3. **TypeScript first**: All files use `.tsx/.ts` extensions
4. **Tailwind styling**: Use utility classes, avoid custom CSS
5. **Responsive design**: Mobile-first approach with responsive navigation