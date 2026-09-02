# E-commerce Frontend

Modern e-commerce frontend built with Next.js 14, TypeScript, and Tailwind CSS.

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm (or npm)

### Installation

```bash
# Install dependencies
pnpm install

# Create .env.local from .env.example
cp .env.example .env.local

# Update .env.local with your API URL
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

### Development

```bash
# Start development server
pnpm dev

# Open http://localhost:3001 in your browser
```

### Build & Production

```bash
# Build for production
pnpm build

# Start production server
pnpm start
```

## Project Structure

```
src/
├── app/              # Next.js App Router pages
├── components/       # React components
├── context/          # React Context
├── hooks/            # Custom React hooks
├── lib/              # Utilities and helpers
├── services/         # API services
├── types/            # TypeScript types
└── styles/           # Global styles
```

## Technology Stack

- **Framework:** Next.js 14
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** shadcn/ui (built on Radix UI)
- **State Management:** React Query + Context API
- **HTTP Client:** Axios
- **Forms:** React Hook Form + Zod
- **Testing:** Jest + React Testing Library

## Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint
- `pnpm lint:fix` - Fix ESLint issues
- `pnpm typecheck` - Type checking with TypeScript
- `pnpm test` - Run tests
- `pnpm test:watch` - Run tests in watch mode

## Features

- Authentication (Login/Register)
- Product browsing and search
- Shopping cart
- Checkout process
- Order history
- User profile management

## Implementation Phases

1. **Phase 1:** Setup & Infrastructure ✅
2. **Phase 2:** Authentication (Login/Register) - In Progress
3. **Phase 3:** Product Browsing (Home, Products, Detail)
4. **Phase 4:** Shopping (Cart, Checkout)
5. **Phase 5:** Account (Orders, Profile)
6. **Phase 6:** Polish & Testing
7. **Phase 7:** Deployment

## Documentation

- [Implementation Plan](../../docs/FRONTEND_IMPLEMENTATION_PLAN.md)
- [Architecture](../../docs/FRONTEND_ARCHITECTURE.md)
- [API Mappings](../../docs/API_MAPPINGS.md)
- [Database Seeds](../../docs/DATABASE_SEEDS.md)
- [Checklist](../../docs/IMPLEMENTATION_CHECKLIST.md)

## Environment Variables

Create `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api
NEXT_PUBLIC_APP_URL=http://localhost:3001
```

## API Configuration

The API client is configured in `src/lib/api-client.ts` with:
- JWT token management
- Automatic token injection in requests
- 401 error handling and auto-redirect to login

## License

MIT
