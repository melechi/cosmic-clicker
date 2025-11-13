# Contributing to Cosmic Clicker

## Code Style Guidelines

### TypeScript

#### Type Safety
```typescript
// ✅ Good - Explicit types
interface BuildingData {
  id: string;
  name: string;
  baseCost: number;
  multiplier: number;
}

function calculateCost(building: BuildingData, count: number): number {
  return Math.floor(building.baseCost * Math.pow(building.multiplier, count));
}

// ❌ Bad - Using any
function calculateCost(building: any, count: any): any {
  return building.baseCost * Math.pow(building.multiplier, count);
}
```

#### Avoid Type Assertions
```typescript
// ✅ Good - Type guard
function isValidSaveData(data: unknown): data is SaveData {
  return (
    typeof data === 'object' &&
    data !== null &&
    'version' in data &&
    'stardust' in data
  );
}

// ❌ Bad - Type assertion without validation
const saveData = JSON.parse(saved) as SaveData;
```

### React Components

#### Component Structure
```typescript
// Standard component structure
import React, { useState, useEffect } from 'react';
import { useGame } from '@/context/GameContext';
import type { ComponentProps } from './types';

interface BuildingItemProps {
  buildingId: string;
  count: number;
  onPurchase: () => void;
}

/**
 * Displays a single building with purchase button
 * @param buildingId - Unique identifier for the building
 * @param count - Number of this building owned
 * @param onPurchase - Callback when purchase button is clicked
 */
export const BuildingItem: React.FC<BuildingItemProps> = ({
  buildingId,
  count,
  onPurchase,
}) => {
  // Hooks
  const { state } = useGame();
  
  // Derived state
  const building = BUILDINGS[buildingId];
  const cost = calculateCost(building, count);
  const canAfford = state.stardust >= cost;
  
  // Event handlers
  const handleClick = () => {
    if (canAfford) {
      onPurchase();
    }
  };
  
  // Render
  return (
    <div className="building-item">
      {/* JSX */}
    </div>
  );
};
```

#### Prop Types
```typescript
// ✅ Good - Explicit interface
interface ButtonProps {
  onClick: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'secondary';
  children: React.ReactNode;
}

// ❌ Bad - Inline type
const Button: React.FC<{
  onClick: () => void;
  disabled?: boolean;
  // ...
}> = ({ onClick, disabled }) => {
  // ...
};
```

#### Hooks Rules
```typescript
// ✅ Good - Proper dependency array
useEffect(() => {
  const timer = setInterval(() => {
    dispatch({ type: 'TICK' });
  }, 1000);
  
  return () => clearInterval(timer);
}, []); // Empty array - only run once

// ❌ Bad - Missing dependencies
useEffect(() => {
  doSomething(value);
}, []); // 'value' should be in dependencies
```

### State Management

#### Reducer Patterns
```typescript
// ✅ Good - Immutable update
case 'BUY_BUILDING': {
  return {
    ...state,
    stardust: state.stardust - cost,
    buildings: {
      ...state.buildings,
      [action.payload.buildingId]: 
        (state.buildings[action.payload.buildingId] || 0) + 1,
    },
  };
}

// ❌ Bad - Mutation
case 'BUY_BUILDING': {
  state.stardust -= cost;
  state.buildings[action.payload.buildingId]++;
  return state;
}
```

#### Action Types
```typescript
// ✅ Good - Typed actions
type GameAction =
  | { type: 'CLICK' }
  | { type: 'BUY_BUILDING'; payload: { buildingId: string } }
  | { type: 'BUY_UPGRADE'; payload: { upgradeId: string } }
  | { type: 'PRESTIGE' }
  | { type: 'TICK'; payload: { deltaTime: number } };

// ❌ Bad - Untyped actions
function reducer(state: GameState, action: any) {
  switch (action.type) {
    // ...
  }
}
```

### Styling

#### Tailwind CSS
```typescript
// ✅ Good - Semantic class grouping
<button
  className={cn(
    // Layout
    'flex items-center justify-center',
    // Spacing
    'px-4 py-2',
    // Typography
    'text-sm font-medium',
    // Colors
    'bg-blue-500 text-white',
    // Interactions
    'hover:bg-blue-600 active:bg-blue-700',
    'disabled:bg-gray-300 disabled:cursor-not-allowed',
    // Transitions
    'transition-colors duration-200'
  )}
>
  Click Me
</button>

// ❌ Bad - Unsorted, unclear
<button className="text-sm bg-blue-500 px-4 py-2 hover:bg-blue-600 disabled:bg-gray-300 flex items-center">
```

#### Conditional Styling
```typescript
// ✅ Good - Clear conditional classes
const buttonClasses = cn(
  'base-button-classes',
  variant === 'primary' && 'bg-blue-500',
  variant === 'secondary' && 'bg-gray-500',
  disabled && 'opacity-50 cursor-not-allowed',
  canAfford && 'ring-2 ring-green-500'
);

// ❌ Bad - Inline ternaries
className={`button ${variant === 'primary' ? 'bg-blue-500' : 'bg-gray-500'} ${disabled ? 'opacity-50' : ''}`}
```

### Testing

#### Unit Tests
```typescript
describe('calculateCost', () => {
  it('should calculate cost for first building', () => {
    const result = calculateCost(100, 1.15, 0);
    expect(result).toBe(100);
  });
  
  it('should apply multiplier for subsequent buildings', () => {
    const result = calculateCost(100, 1.15, 5);
    expect(result).toBe(201); // 100 * 1.15^5
  });
  
  it('should handle large counts without overflow', () => {
    const result = calculateCost(100, 1.15, 100);
    expect(result).toBeGreaterThan(0);
    expect(isFinite(result)).toBe(true);
  });
  
  it('should return base cost for count of 0', () => {
    const result = calculateCost(1000, 1.5, 0);
    expect(result).toBe(1000);
  });
});
```

#### Component Tests
```typescript
describe('<BuildingItem />', () => {
  const mockOnPurchase = vi.fn();
  
  const defaultProps = {
    buildingId: 'miner',
    count: 0,
    onPurchase: mockOnPurchase,
  };
  
  beforeEach(() => {
    mockOnPurchase.mockClear();
  });
  
  it('should render building name and cost', () => {
    render(<BuildingItem {...defaultProps} />);
    
    expect(screen.getByText('Space Miner')).toBeInTheDocument();
    expect(screen.getByText(/10 SD/)).toBeInTheDocument();
  });
  
  it('should call onPurchase when clicked and affordable', () => {
    const { getByRole } = render(
      <TestGameProvider stardust={100}>
        <BuildingItem {...defaultProps} />
      </TestGameProvider>
    );
    
    const button = getByRole('button');
    fireEvent.click(button);
    
    expect(mockOnPurchase).toHaveBeenCalledTimes(1);
  });
  
  it('should not call onPurchase when clicked and unaffordable', () => {
    const { getByRole } = render(
      <TestGameProvider stardust={5}>
        <BuildingItem {...defaultProps} />
      </TestGameProvider>
    );
    
    const button = getByRole('button');
    fireEvent.click(button);
    
    expect(mockOnPurchase).not.toHaveBeenCalled();
  });
});
```

#### E2E Tests
```typescript
test('complete game flow', async ({ page }) => {
  await page.goto('http://localhost:5173');
  
  // Click to earn stardust
  const clicker = page.locator('[data-testid="clicker"]');
  await clicker.click({ clickCount: 10 });
  
  // Verify stardust increased
  const stardustDisplay = page.locator('[data-testid="stardust"]');
  await expect(stardustDisplay).toContainText('10');
  
  // Purchase first building
  const buyButton = page.locator('[data-testid="buy-miner"]');
  await buyButton.click();
  
  // Verify building count
  const minerCount = page.locator('[data-testid="miner-count"]');
  await expect(minerCount).toContainText('1');
  
  // Wait for production
  await page.waitForTimeout(2000);
  
  // Verify stardust increased from production
  await expect(stardustDisplay).toContainText(/[0-9]+\.[0-9]+/);
});
```

### Performance

#### Memoization
```typescript
// ✅ Good - Memoize expensive calculations
const MemoizedBuilding = React.memo(BuildingItem, (prev, next) => {
  return (
    prev.buildingId === next.buildingId &&
    prev.count === next.count &&
    prev.canAfford === next.canAfford
  );
});

// Use useMemo for expensive calculations
const totalProduction = useMemo(() => {
  return Object.entries(state.buildings).reduce((total, [id, count]) => {
    const building = BUILDINGS[id];
    return total + (building.production * count * multipliers);
  }, 0);
}, [state.buildings, multipliers]);

// Use useCallback for functions passed as props
const handlePurchase = useCallback(() => {
  dispatch({ type: 'BUY_BUILDING', payload: { buildingId } });
}, [buildingId]);
```

### Documentation

#### JSDoc Comments
```typescript
/**
 * Calculates the cost of purchasing the next building
 * 
 * Uses the formula: baseCost * multiplier^currentCount
 * 
 * @param baseCost - The base cost of the building
 * @param multiplier - The cost multiplier per building (e.g., 1.15)
 * @param currentCount - Number of this building currently owned
 * @returns The cost of the next building, floored to integer
 * 
 * @example
 * ```typescript
 * const cost = calculateCost(100, 1.15, 5);
 * console.log(cost); // 201
 * ```
 */
function calculateCost(
  baseCost: number,
  multiplier: number,
  currentCount: number
): number {
  return Math.floor(baseCost * Math.pow(multiplier, currentCount));
}
```

### File Organization

#### Import Order
```typescript
// 1. React and external libraries
import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';

// 2. Internal components
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

// 3. Context and hooks
import { useGame } from '@/context/GameContext';
import { useToast } from '@/hooks/useToast';

// 4. Utils and helpers
import { formatNumber } from '@/utils/formatting/numberFormat';
import { calculateCost } from '@/utils/gameLogic/calculations';

// 5. Types
import type { Building, Upgrade } from '@/types';

// 6. Constants
import { BUILDINGS } from '@/constants/buildings';

// 7. Styles (if any)
import './Component.css';
```

#### Export Patterns
```typescript
// ✅ Good - Named exports for better tree-shaking
export { Button } from './Button';
export { Card } from './Card';
export { Tooltip } from './Tooltip';

// For types
export type { ButtonProps } from './Button';
export type { CardProps } from './Card';

// ❌ Avoid - Default exports (harder to refactor)
export default Button;
```

## Git Workflow

### Commit Messages
Follow conventional commits format:

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types**: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

**Examples**:
```
feat(buildings): add building purchase functionality

Implemented buy 1/10/100/max purchase options
Added cost calculation for bulk purchases
Added tests for purchase edge cases

Closes #23
```

```
fix(save): prevent data loss on invalid save format

Added validation for save data structure
Gracefully handle corrupted localStorage
Migrate old save format to new version

Fixes #45
```

### Branch Naming
- `main` - Production ready code
- `develop` - Development branch
- `feature/task-1-1-project-setup` - Feature branches
- `fix/save-data-corruption` - Bug fix branches
- `test/e2e-prestige-flow` - Test-specific branches

## Accessibility

### Required Practices
- All images need alt text
- All interactive elements keyboard accessible
- Proper ARIA labels on custom controls
- Sufficient color contrast (4.5:1 minimum)
- Focus indicators visible
- Screen reader tested

```typescript
// ✅ Good - Accessible button
<button
  onClick={handleClick}
  disabled={!canAfford}
  aria-label={`Purchase ${building.name} for ${formatNumber(cost)} stardust`}
  aria-disabled={!canAfford}
  className="building-button"
>
  <span aria-hidden="true">{building.icon}</span>
  <span>{building.name}</span>
</button>

// ❌ Bad - Not accessible
<div onClick={handleClick} className="building-button">
  {building.icon} {building.name}
</div>
```

## Code Review Checklist

Before submitting:
- [ ] TypeScript compiles with no errors
- [ ] All tests pass
- [ ] Code coverage >80%
- [ ] ESLint shows no errors
- [ ] Prettier formatted
- [ ] JSDoc comments added
- [ ] No console.logs
- [ ] Accessibility checked
- [ ] Performance profiled
- [ ] Mobile tested

## Questions?

If you're unsure about any guideline:
1. Check existing code for patterns
2. Refer to CLAUDE_CODE_INSTRUCTIONS.md
3. Open an issue for discussion
4. Default to industry best practices
