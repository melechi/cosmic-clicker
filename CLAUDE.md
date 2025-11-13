# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project: Cosmic Clicker

A React-based incremental/idle game where players collect stardust through clicking and automated production buildings, unlock upgrades, and prestige for permanent bonuses.

## Development Commands

### Setup
```bash
npm install          # Install dependencies (if package.json exists)
```

### Development
```bash
npm run dev          # Start Vite dev server (default: http://localhost:5173)
npm run type-check   # Run TypeScript compiler without emitting files
```

### Testing
```bash
npm test             # Run Vitest unit tests in watch mode
npm run test:ui      # Run tests with Vitest UI
npm run test:coverage # Generate coverage report (target: >80%)
npm run test:e2e     # Run Playwright E2E tests
npm run test:e2e:ui  # Run E2E tests with Playwright UI
```

### Code Quality
```bash
npm run lint         # Check for ESLint errors
npm run lint:fix     # Auto-fix ESLint errors
npm run format       # Format code with Prettier
npm run format:check # Check code formatting
```

### Build & Preview
```bash
npm run build        # Build for production (outputs to dist/)
npm run preview      # Preview production build locally
```

### Storybook
```bash
npm run storybook        # Run Storybook dev server (port 6006)
npm run build-storybook  # Build static Storybook
```

## Architecture Overview

### State Management
- **Pattern**: Context API + useReducer (not Zustand or Redux)
- **Core**: GameContext provides global game state
- **Reducer**: All state updates go through gameReducer with typed actions
- **Immutability**: State updates must be immutable (spread operators, no direct mutations)
- **Game Loop**: useGameLoop hook manages 60 FPS tick cycle using requestAnimationFrame

### Project Structure
```
src/
├── components/
│   ├── ui/          # Reusable UI primitives (Button, Card, Modal, etc.)
│   ├── game/        # Game-specific components (Clicker, BuildingList, UpgradesPanel, etc.)
│   ├── layout/      # Layout components (Header, Sidebar, MainLayout, Footer)
│   └── effects/     # Visual effects (BackgroundParticles, ClickParticle, NumberCountUp)
├── context/
│   ├── GameContext.tsx  # Context provider wrapping the app
│   ├── gameReducer.ts   # Pure reducer function for state transitions
│   └── actions.ts       # Action creators with type safety
├── hooks/
│   ├── useGameLoop.ts   # 60 FPS game loop with requestAnimationFrame
│   ├── useToast.ts      # Toast notification management
│   └── useAnimation.ts  # Animation utilities
├── utils/
│   ├── formatting/      # numberFormat.ts - Format large numbers (K, M, B, T, etc.)
│   ├── gameLogic/       # calculations.ts - Pure functions for costs, production
│   └── saveLoad/        # saveManager.ts, offlineProgress.ts - Persistence logic
├── types/              # TypeScript definitions (GameState, Building, Upgrade, etc.)
├── constants/          # Game data (buildings.ts, upgrades.ts, achievements.ts, gameConfig.ts)
├── data/              # Static game data
└── tests/             # Test setup and integration tests
```

### Component Patterns
- **Functional components only** with TypeScript
- Each component should have: `.tsx`, `.test.tsx`, and (optionally) `.stories.tsx`
- Use React.memo for frequently re-rendered components with stable props
- Use useMemo/useCallback to prevent unnecessary recalculations/re-renders

### Import Path Aliases
- `@/components/...` → `src/components/...`
- `@/utils/...` → `src/utils/...`
- `@/types` → `src/types/index.ts`
- `@/constants` → `src/constants/index.ts`

## Core Game Mechanics

### Resources
- **Stardust (SD)**: Primary currency from clicking and buildings
- **Nebula Crystals (NC)**: Prestige currency earned on reset
  - Formula: `NC = floor(sqrt(totalStardust / 1e6))`
  - Minimum: 1M total SD for first prestige
  - Effect: 1% production bonus per crystal

### Buildings (7 Tiers)
1. Space Miners (10 SD, 0.1 SD/sec)
2. Asteroid Harvesters (100 SD, 1 SD/sec)
3. Lunar Refineries (1.1K SD, 8 SD/sec)
4. Solar Collectors (12K SD, 47 SD/sec)
5. Wormhole Generators (130K SD, 260 SD/sec)
6. Galactic Nexus (1.4M SD, 1400 SD/sec)
7. Universe Engine (20M SD, 7800 SD/sec)

**Cost Scaling**: Each purchase multiplies cost by 1.15x
**Formula**: `cost = baseCost * (1.15 ^ ownedCount)`

### Critical Game Logic Functions

#### Cost Calculation
```typescript
function calculateBuildingCost(
  baseCost: number,
  multiplier: number, // typically 1.15
  currentCount: number
): number {
  return Math.floor(baseCost * Math.pow(multiplier, currentCount));
}
```

#### Offline Progress
- Cap at 8 hours maximum
- Award 50% of theoretical production
```typescript
function calculateOfflineProgress(
  lastSaveTime: number,
  currentTime: number,
  productionPerSecond: number
): number {
  const elapsedSeconds = (currentTime - lastSaveTime) / 1000;
  const cappedSeconds = Math.min(elapsedSeconds, 8 * 60 * 60);
  return productionPerSecond * cappedSeconds * 0.5;
}
```

#### Game Loop Pattern
```typescript
// In useGameLoop hook
useEffect(() => {
  let lastTime = performance.now();
  let animationId: number;

  const loop = (currentTime: number) => {
    const deltaTime = (currentTime - lastTime) / 1000;
    lastTime = currentTime;

    dispatch({ type: 'TICK', payload: { deltaTime } });

    animationId = requestAnimationFrame(loop);
  };

  animationId = requestAnimationFrame(loop);
  return () => cancelAnimationFrame(animationId);
}, []);
```

### Save System
- **Auto-save**: Every 30 seconds to localStorage
- **Key**: `cosmicClicker_save`
- **Structure**: Includes version, timestamp, all resources, buildings, upgrades, achievements, statistics
- **Validation**: Always validate loaded data and handle version migrations
- **Offline**: Calculate on load using timestamp delta

## TypeScript Standards

### Strict Rules
- **No `any` types** - Always provide specific types
- **No `@ts-ignore`** - Fix type errors properly
- Export all types from `src/types/index.ts`
- Use interfaces for object shapes, type aliases for unions/primitives

### Type Organization
```typescript
// src/types/game.ts
export interface GameState {
  stardust: number;
  totalStardustEarned: number;
  buildings: Record<string, number>;
  // ...
}

// src/types/buildings.ts
export interface Building {
  id: string;
  name: string;
  baseCost: number;
  production: number;
  // ...
}

// Import from index
import type { GameState, Building } from '@/types';
```

## Testing Requirements

### Coverage Target
- **Minimum**: 80% overall coverage
- **Game logic**: 100% coverage (utils/gameLogic/)
- **Save/load**: 100% coverage (critical for data integrity)

### Test Patterns
```typescript
// Unit tests for utilities
describe('calculateBuildingCost', () => {
  it('should calculate correct cost for first purchase', () => {
    expect(calculateBuildingCost(10, 1.15, 0)).toBe(10);
  });

  it('should handle large numbers correctly', () => {
    // Test edge cases
  });
});

// Component tests
describe('<BuildingItem />', () => {
  it('should disable purchase button when not affordable', () => {
    // Test with insufficient stardust
  });

  it('should dispatch purchase action on click', () => {
    // Test user interaction
  });
});
```

### E2E Test Scenarios
- gameStart.spec.ts - Initial load, first clicks, first purchase
- purchasing.spec.ts - Buy buildings, buy upgrades, bulk purchase
- prestige.spec.ts - Prestige workflow, keep NC, verify bonuses
- saveLoad.spec.ts - Auto-save, manual save, export/import, offline progress
- responsive.spec.ts - Mobile layout, touch interactions

## Common Pitfalls to Avoid

### React/State
- ❌ Mutating state directly: `state.stardust += 10`
- ✅ Immutable updates: `{ ...state, stardust: state.stardust + 10 }`
- ❌ Missing dependencies in useEffect/useMemo/useCallback
- ❌ Heavy calculations in render without useMemo

### TypeScript
- ❌ Using `any` instead of proper types
- ❌ Ignoring errors with `@ts-ignore`
- ❌ Not exporting types from index files

### Game Logic
- ❌ Floating point precision errors in cost calculations
- ❌ Not capping offline progress
- ❌ Not validating save data before loading
- ❌ Forgetting to floor/ceil costs (can cause fractional resources)

### Performance
- ❌ Not using React.memo for expensive list items
- ❌ Creating new functions/objects in render (causes re-renders)
- ❌ Running game loop calculations in component render
- ❌ Not cleaning up requestAnimationFrame in useEffect

## Game Balance Guidelines

- First building (Space Miner) should be affordable in <30 seconds of clicking
- First prestige target: ~30-60 minutes of active play to reach 1M SD
- Each building tier should become relevant before the next unlocks
- Upgrades should feel impactful (minimum 2x multiplier)
- Each prestige run should be ~30-50% faster than the previous

## Performance Targets

- **Game loop**: Stable 60 FPS
- **Bundle size**: <200KB gzipped total
- **First load**: <3 seconds time to interactive
- **Lighthouse score**: >90
- **Memory**: <50MB after 1 hour of gameplay

## Accessibility Requirements

- Keyboard navigation for all interactive elements
- ARIA labels on all buttons and interactive components
- Screen reader announcements for stardust changes
- High contrast mode support
- Reduced motion option (disable particle effects)

## Task Execution Strategy

Tasks are organized in 9 phases in TASKS.md:
1. **Phase 1**: Project setup (Vite, TypeScript, testing)
2. **Phase 2**: Core game logic (calculations, save/load)
3. **Phase 3**: State management (context, reducer, game loop)
4. **Phase 4**: UI foundation (base components, layout)
5. **Phase 5**: Game components (clicker, buildings, upgrades)
6. **Phase 6**: Integration (wire everything together)
7. **Phase 7**: Testing (unit, integration, E2E)
8. **Phase 8**: Deployment (CI/CD, production build)
9. **Phase 9**: Polish (accessibility, optimization)

**Work sequentially through phases** - each phase builds on the previous.

## Key Files to Reference

- **TASKS.md** - Detailed task list with acceptance criteria
- **CLAUDE_CODE_INSTRUCTIONS.md** - In-depth development guidance and patterns
- **GAME_DESIGN.md** - Complete game mechanics specification
- **PROJECT_STRUCTURE.md** - Full file structure and organization

## Notes

- This is a greenfield project - no src/ directory exists yet
- Follow the task list in TASKS.md sequentially
- Write tests for every feature (non-negotiable)
- Game loop must use requestAnimationFrame, not setInterval
- All game calculations must be pure functions in utils/gameLogic/
- Save system must handle versioning and data validation
- Numbers must be formatted with abbreviations (use utils/formatting/numberFormat)
