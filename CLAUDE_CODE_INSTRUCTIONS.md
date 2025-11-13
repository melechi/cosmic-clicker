# Instructions for Claude Code

## Project Overview
You are building **Cosmic Clicker**, a complete incremental/idle game in React with TypeScript. This document provides specific guidance for autonomous development.

## Work Strategy

### 1. Task Execution Order
- **Always** start with Phase 1 tasks (setup)
- Complete tasks sequentially within each phase
- Tasks marked as **Critical** priority must be completed first
- Some tasks can be delegated to sub-agents in parallel (see Parallelization section)

### 2. Sub-Agent Delegation
You can create sub-agents to work on independent tasks simultaneously. Ideal for:
- **Infrastructure + Testing** (Tasks 1.1 and 1.2 can run in parallel)
- **Type definitions + Constants** (Tasks 1.3, 2.1 can run in parallel after infrastructure)
- **UI Components** (Phase 4 tasks are mostly independent)
- **Game Components** (Phase 5 tasks can be parallelized once Phase 4 completes)
- **Documentation tasks** (Can run alongside implementation)

**Example Parallelization Strategy**:
```
Phase 1: Task 1.1 + 1.2 (parallel) → 1.3
Phase 2: Task 2.1 + 2.2 (parallel) → 2.3 → 2.4
Phase 3: Sequential (state depends on previous tasks)
Phase 4: All tasks can run in parallel
Phase 5: Tasks can run in parallel once context is ready
```

### 3. Testing Requirements

**Every task with code MUST include tests**. Follow this pattern:

```typescript
// For utilities/functions:
describe('functionName', () => {
  it('should handle normal case', () => { /* ... */ });
  it('should handle edge case', () => { /* ... */ });
  it('should throw error for invalid input', () => { /* ... */ });
});

// For components:
describe('<ComponentName />', () => {
  it('should render correctly', () => { /* ... */ });
  it('should handle user interaction', () => { /* ... */ });
  it('should update on prop change', () => { /* ... */ });
});
```

**Coverage Target**: >80% for all code, 100% for critical game logic

### 4. Code Quality Standards

#### TypeScript
- **No `any` types** - always provide specific types
- **No `@ts-ignore`** - fix type errors properly
- Export all types from `src/types/index.ts`
- Use interfaces for objects, type aliases for unions

#### React
- Use functional components with hooks
- Properly type all props with interfaces
- Memoize expensive calculations with `useMemo`
- Memoize callbacks with `useCallback`
- Use `React.memo` for components that render frequently with same props

#### File Organization
```typescript
// 1. Imports (grouped: React, third-party, local)
import React, { useState } from 'react';
import { format } from 'date-fns';
import { useGame } from '@/context/GameContext';
import { Button } from '@/components/ui/Button';
import type { Building } from '@/types';

// 2. Types/Interfaces
interface ComponentProps {
  // ...
}

// 3. Component
export const Component: React.FC<ComponentProps> = ({ prop }) => {
  // ...
};

// 4. Helper functions (if needed)
function helperFunction() {
  // ...
}
```

#### Naming Conventions
- **Components**: PascalCase (`BuildingList`)
- **Files**: Match component name (`BuildingList.tsx`)
- **Functions**: camelCase (`calculateCost`)
- **Constants**: UPPER_SNAKE_CASE (`MAX_BUILDINGS`)
- **Hooks**: start with `use` (`useGameLoop`)
- **Types**: PascalCase (`GameState`)

### 5. Common Patterns to Use

#### State Updates (Immutable)
```typescript
// ✅ Good
const newState = {
  ...state,
  buildings: {
    ...state.buildings,
    [buildingId]: state.buildings[buildingId] + 1
  }
};

// ❌ Bad
state.buildings[buildingId] += 1;
```

#### Performance - Avoid Unnecessary Re-renders
```typescript
// ✅ Good
const MemoizedComponent = React.memo(Component);

const expensiveValue = useMemo(() => {
  return complexCalculation(data);
}, [data]);

// ❌ Bad - recalculates every render
const expensiveValue = complexCalculation(data);
```

#### Number Formatting
```typescript
// Always use the formatNumber utility
import { formatNumber } from '@/utils/formatting/numberFormat';

<span>{formatNumber(largeNumber)}</span>
```

### 6. Specific Implementation Guidance

#### Game Loop (Task 3.2)
- Use `requestAnimationFrame` for smooth 60 FPS
- Calculate delta time: `(currentTime - lastTime) / 1000`
- Update production based on delta: `production * deltaTime`
- Pause when document is hidden (Page Visibility API)

```typescript
useEffect(() => {
  let lastTime = performance.now();
  let animationId: number;

  const loop = (currentTime: number) => {
    const deltaTime = (currentTime - lastTime) / 1000;
    lastTime = currentTime;
    
    // Dispatch tick with deltaTime
    dispatch({ type: 'TICK', payload: { deltaTime } });
    
    animationId = requestAnimationFrame(loop);
  };

  animationId = requestAnimationFrame(loop);
  
  return () => cancelAnimationFrame(animationId);
}, []);
```

#### Save/Load (Task 2.4)
- **Always validate** loaded data structure
- Handle version migrations gracefully
- Provide default values for missing fields
- Catch and handle JSON parse errors

```typescript
function loadGame(): GameState | null {
  try {
    const saved = localStorage.getItem('cosmicClicker_save');
    if (!saved) return null;
    
    const data = JSON.parse(saved);
    
    // Validate version and migrate if needed
    if (data.version !== CURRENT_VERSION) {
      return migrateData(data);
    }
    
    // Validate data structure
    if (!isValidSaveData(data)) {
      console.error('Invalid save data');
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Failed to load save:', error);
    return null;
  }
}
```

#### Offline Progress (Task 2.4)
```typescript
function calculateOfflineProgress(
  lastSaveTime: number,
  currentTime: number,
  productionPerSecond: number
): number {
  const elapsedSeconds = (currentTime - lastSaveTime) / 1000;
  
  // Cap at 8 hours
  const cappedSeconds = Math.min(elapsedSeconds, 8 * 60 * 60);
  
  // Award 50% of theoretical production
  return productionPerSecond * cappedSeconds * 0.5;
}
```

#### Cost Calculation (Task 2.3)
```typescript
function calculateBuildingCost(
  baseCost: number,
  multiplier: number,
  currentCount: number
): number {
  return Math.floor(baseCost * Math.pow(multiplier, currentCount));
}

// For "buy max" calculation
function calculateMaxAffordable(
  currentStardust: number,
  baseCost: number,
  multiplier: number,
  currentCount: number
): number {
  // Binary search or geometric series formula
  // This is a complex calculation - implement carefully!
}
```

### 7. Debugging & Troubleshooting

If tests are failing:
1. Read the error message carefully
2. Check if types are correct
3. Verify mock data matches expected structure
4. Use `console.log` strategically (remove before committing)
5. Test in isolation first, then integration

If performance is poor:
1. Profile with React DevTools Profiler
2. Check for unnecessary re-renders
3. Verify game loop isn't doing heavy calculations
4. Memoize expensive operations
5. Consider virtual scrolling for long lists

### 8. Git Commit Messages

Use conventional commit format:
```
feat: add building purchase functionality
fix: correct prestige calculation overflow
test: add unit tests for number formatting
docs: update gameplay guide with prestige info
refactor: optimize game loop performance
style: format code with Prettier
```

### 9. When to Ask for Help

You should create an issue or note for human review if:
- A requirement seems ambiguous or contradictory
- You've attempted a fix 3+ times and tests still fail
- Performance can't meet targets (60 FPS, <200KB bundle)
- A design decision significantly impacts architecture
- You discover a major bug in the game design

### 10. Success Checklist (Before Marking Complete)

For each task, verify:
- [ ] All acceptance criteria met
- [ ] Tests written and passing (>80% coverage)
- [ ] No TypeScript errors or warnings
- [ ] No ESLint errors
- [ ] Code formatted with Prettier
- [ ] JSDoc comments added
- [ ] No console.logs left in code
- [ ] Performance is acceptable
- [ ] Accessibility considerations addressed
- [ ] Works on mobile and desktop

## Phase-Specific Notes

### Phase 1: Setup
- Don't skip configuration tasks - they prevent issues later
- Set up path aliases in both tsconfig.json and vite.config.ts
- Verify test setup by creating a simple passing test

### Phase 2: Core Logic
- These are the foundation - take time to get them right
- 100% test coverage is non-negotiable here
- Pure functions are easier to test - keep game logic pure
- Consider edge cases: 0, negative, very large numbers, infinity

### Phase 3: State Management
- Keep reducer pure (no side effects)
- All state changes go through reducer actions
- Test reducer thoroughly before building UI

### Phase 4-5: Components
- Start with simpler components first (Button, Card)
- Test components in isolation with mock data
- Build Storybook stories alongside components
- Consider responsive design from the start

### Phase 6: Integration
- This is where everything comes together
- Take time to test interactions between components
- Watch for performance issues as complexity increases

### Phase 7: Testing
- Don't rush this phase
- Real bugs will be found here
- E2E tests catch integration issues unit tests miss

### Phase 8: Deployment
- Test production build locally before deploying
- Verify environment variables are set correctly
- Monitor first deployment carefully

### Phase 9: Polish
- This phase makes the difference between "working" and "great"
- Get external feedback if possible
- Small UX improvements have big impact

## Game Balance Testing

As you implement features, periodically test game balance:
- Can you afford first building in <30 seconds?
- Can you reach first prestige in ~30-60 minutes of active play?
- Does each building tier become relevant before the next?
- Are upgrades impactful and exciting?

If balance feels off, adjust constants in `src/constants/` files.

## Final Thoughts

This is a significant project (~28 hours estimated). Work systematically, test thoroughly, and don't skip documentation. The quality of your implementation will be evident in:
- Code clarity and maintainability
- Test coverage and test quality
- User experience smoothness
- Performance under load
- Documentation completeness

Good luck! Build something amazing! 🚀
