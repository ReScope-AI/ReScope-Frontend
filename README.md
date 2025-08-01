<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://user-images.githubusercontent.com/9113740/201498864-2a900c64-d88f-4ed4-b5cf-770bcb57e1f5.png">
  <source media="(prefers-color-scheme: light)" srcset="https://user-images.githubusercontent.com/9113740/201498152-b171abb8-9225-487a-821c-6ff49ee48579.png">
</picture>

<div align="center"><strong>ReScope - Retrospective Management Platform</strong></div>
<div align="center">Built with Next.js 15 App Router & Modern Tech Stack</div>
<br />
<div align="center">
<a href="#">View Demo</a>
<span>
</div>

## Overview

ReScope is a comprehensive retrospective management platform designed to help teams conduct effective retrospectives and improve their development processes. Built with modern web technologies, it provides a collaborative environment for sprint retrospectives, team feedback, and continuous improvement.

### Tech Stack

- **Framework** - [Next.js 15](https://nextjs.org/15) with App Router
- **Language** - [TypeScript](https://www.typescriptlang.org)
- **Error Tracking** - [Sentry](https://sentry.io/for/nextjs/)
- **Styling** - [Tailwind CSS v4](https://tailwindcss.com)
- **UI Components** - [Shadcn-ui](https://ui.shadcn.com)
- **State Management** - [Zustand](https://zustand-demo.pmnd.rs)
- **Real-time Communication** - [Socket.io](https://socket.io/)
- **Charts & Analytics** - [Recharts](https://recharts.org/)
- **Forms** - [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev)
- **Data Fetching** - [TanStack Query](https://tanstack.com/query)
- **Drag & Drop** - [@dnd-kit](https://dndkit.com/)
- **Command Interface** - [kbar](https://kbar.vercel.app/)
- **Development Tools** - ESLint, Prettier, Husky

## Features

### Core Functionality

| Feature                     | Description                                                                                             |
| --------------------------- | ------------------------------------------------------------------------------------------------------- |
| **Authentication**          | Secure user authentication with Clerk, supporting multiple sign-in methods and user management          |
| **Dashboard Overview**      | Analytics dashboard with interactive charts showing team performance metrics and retrospective insights |
| **Retrospective Sessions**  | Real-time collaborative retrospective sessions with live updates via WebSocket                          |
| **Kanban Board**            | Interactive task management board with drag-and-drop functionality for organizing retrospective items   |
| **Poll System**             | AI-powered poll generation and voting system for gathering team feedback                                |
| **Team Management**         | User profile management and team organization features                                                  |
| **Real-time Collaboration** | Live updates and real-time communication during retrospective sessions                                  |

### Key Components

- **Parallel Routes**: Independent loading states and error handling for dashboard sections
- **Real-time Updates**: WebSocket integration for live collaboration
- **AI Integration**: Smart poll generation and retrospective assistance
- **Responsive Design**: Mobile-first approach with adaptive layouts
- **Theme Support**: Dark/light mode with system preference detection

## Project Structure

```plaintext
src/
├── app/                    # Next.js App Router
│   ├── auth/              # Authentication routes
│   │   ├── sign-in/       # Sign in pages
│   │   └── sign-up/       # Sign up pages
│   ├── dashboard/         # Main dashboard
│   │   ├── overview/      # Analytics dashboard
│   │   ├── retrospective/ # Retrospective sessions
│   │   └── profile/       # User profile management
│   └── layout.tsx         # Root layout
│
├── components/            # Shared components
│   ├── ui/               # Shadcn UI components
│   ├── layout/           # Layout components
│   └── common/           # Common utilities
│
├── features/             # Feature-based modules
│   ├── auth/            # Authentication features
│   ├── overview/        # Dashboard analytics
│   ├── retrospectives/  # Retrospective functionality
│   ├── kanban/          # Kanban board features
│   └── profile/         # Profile management
│
├── hooks/               # Custom React hooks
├── stores/              # Zustand state management
├── types/               # TypeScript type definitions
├── lib/                 # Utility functions
└── config/              # Configuration files
```

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm
- Git

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd ReScope-Frontend
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Environment Setup**

   ```bash
   cp env.example.txt .env.local
   ```

   Configure your environment variables in `.env.local`:

   - **Clerk Authentication**: Set up Clerk for authentication (supports keyless mode)
   - **Sentry Error Tracking**: Configure Sentry for error monitoring
   - **Real-time Features**: Configure WebSocket connections

4. **Start Development Server**

   ```bash
   pnpm dev
   ```

   The application will be available at `http://localhost:3001`

### Environment Configuration

The project uses the following environment variables:

#### Authentication (Clerk)

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_SIGN_IN_URL="/auth/sign-in"
NEXT_PUBLIC_CLERK_SIGN_UP_URL="/auth/sign-up"
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL="/dashboard/overview"
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL="/dashboard/overview"
```

#### Error Tracking (Sentry)

```env
NEXT_PUBLIC_SENTRY_DSN=
NEXT_PUBLIC_SENTRY_ORG=
NEXT_PUBLIC_SENTRY_PROJECT=
SENTRY_AUTH_TOKEN=
NEXT_PUBLIC_SENTRY_DISABLED="false"
```

## Development

### Available Scripts

- `pnpm dev` - Start development server with Turbopack
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint
- `pnpm lint:fix` - Fix linting issues
- `pnpm format` - Format code with Prettier

### Code Quality

- **ESLint**: Code linting with strict rules
- **Prettier**: Code formatting
- **Husky**: Git hooks for pre-commit checks
- **TypeScript**: Type safety throughout the application

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

Built with ❤️ for better team retrospectives and continuous improvement.
