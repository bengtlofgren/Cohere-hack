# CRUSH.md - Development Guidelines

## Core Commands
- **Dev Server**: `bun dev` (hot reloading on http://localhost:3000)
- **Build**: `bun run build` 
- **Lint**: `bun run lint`
- **Typecheck**: `tsc --noEmit`

## Code Style Guidelines
- **Language**: TypeScript with strict typing
- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS with shadcn/ui components
- **Component Library**: Radix UI primitives
- **State Management**: React hooks and ai/react for AI integration

## Naming Conventions
- Files: kebab-case (.tsx, .ts)
- Components: PascalCase
- Functions/Variables: camelCase
- Interfaces/Types: PascalCase with I prefix for interfaces
- Constants: UPPER_SNAKE_CASE

## Import Order
1. React and React-related libraries
2. Next.js modules
3. External libraries
4. Internal imports (absolute paths preferred)
5. Relative imports
6. Types
7. Styles/CSS

## Type Safety
- Use TypeScript interfaces for props and state
- Prefer strict types over 'any'
- Leverage Zod for schema validation
- Use React.FC<Props> for component typing

## Component Structure
- Use functional components with React hooks
- Destructure props in function parameters
- Place types directly above components
- Use class-variance-authority for dynamic styling
- Follow shadcn/ui composition patterns

## AI Integration
- Use @ai-sdk/cohere and @ai-sdk/openai for model access
- Leverage ai/react for streamable UI components
- Implement proper error handling for API calls
- Use nanoid for unique message IDs

## Testing
- Component testing with Jest/React Testing Library
- End-to-end testing with Playwright
- Run single test: `bun test [filename]`

## Error Handling
- Use try/catch for async operations
- Implement proper loading states
- Handle API errors gracefully
- Log errors appropriately (no sensitive data)

## Git Workflow
- Squash commits before merge
- Use conventional commit messages
- Keep PRs focused on single features
- Review code before requesting review