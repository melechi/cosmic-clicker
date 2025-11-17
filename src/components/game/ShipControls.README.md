# ShipControls Component

## Overview

The `ShipControls` component provides a comprehensive interface for managing ship speed and monitoring fuel consumption in Cosmic Clicker Phase 1. It allows players to select from five speed settings, view real-time fuel consumption rates, monitor fuel tank levels, and receive warnings when fuel is running low.

## Features

### Speed Control
- **5 Speed Settings**: Stop, Slow, Normal, Fast, Boost
- **Visual Indicators**: Active speed is highlighted with a ring border
- **Lock States**: Speeds not yet unlocked are disabled with lock icons
- **Emoji Icons**: Each speed has a distinct emoji for easy recognition

### Fuel Management
- **Fuel Tank Display**: Progress bar showing current fuel / max capacity
- **Fuel Percentage**: Real-time percentage display
- **Low Fuel Warning**: Alert when fuel drops below 10%
- **Out of Fuel Alert**: Prominent warning when fuel is depleted
- **Color-Coded Progress**: Changes color based on fuel level (blue → yellow → red)

### Information Display
- **Current Speed**: Large display showing active speed setting
- **Fuel Consumption Rate**: Shows fuel/sec for current speed
- **Distance Rate**: Displays speed multiplier (0x to 3x)
- **Per-Speed Stats**: Tooltips show consumption and distance for each speed

### Keyboard Shortcuts
- **1-5 Keys**: Select speed directly (1=Stop, 2=Slow, 3=Normal, 4=Fast, 5=Boost)
- **Spacebar**: Toggle between stop and resume (normal speed)
- **Smart Input Detection**: Shortcuts disabled when typing in text fields

### Accessibility
- **ARIA Labels**: All buttons have descriptive aria-label attributes
- **Keyboard Navigation**: Full keyboard support for all controls
- **Tooltip Information**: Hover tooltips provide detailed speed information
- **Visual Feedback**: Clear indication of active speed and locked states

## Props

```typescript
interface ShipControlsProps {
  /** Current ship speed */
  currentSpeed: ShipSpeed;

  /** Current fuel amount */
  fuel: number;

  /** Fuel tank capacity */
  tankCapacity: number;

  /** Maximum speed unlocked */
  maxSpeedUnlocked: ShipSpeed;

  /** Fuel efficiency percentage (lower = less consumption) */
  fuelEfficiencyPercent: number;

  /** Callback when speed changes */
  onSpeedChange: (speed: ShipSpeed) => void;

  /** Optional CSS class names */
  className?: string;
}
```

## Speed Settings

Based on GAME_DESIGN_V2.md specifications:

| Speed | Emoji | Fuel Consumption | Distance Multiplier | Use Case |
|-------|-------|------------------|-------------------|----------|
| Stop | ⏸️ | 0x | 0x | Emergency conservation, mining specific area |
| Slow | 🐌 | 0.5x | 0.5x | Fuel efficient, more time to mine objects |
| Normal | ➡️ | 1x | 1x | Balanced (default) |
| Fast | ⏩ | 2x | 2x | Speed through empty areas |
| Boost | 🚀 | 5x | 3x | Emergency escape, very inefficient |

## Usage

### Basic Integration with GameContext

```tsx
import { ShipControls } from '@/components/game';
import { useGameContext } from '@/context/GameContext';
import { actions } from '@/context/actions';

export const GameView = () => {
  const { state, dispatch } = useGameContext();

  return (
    <ShipControls
      currentSpeed={state.shipSpeed}
      fuel={state.fuel}
      tankCapacity={state.modules.engine.tankCapacity}
      maxSpeedUnlocked={state.modules.engine.maxSpeedUnlocked}
      fuelEfficiencyPercent={state.modules.engine.fuelEfficiencyPercent}
      onSpeedChange={(speed) => dispatch(actions.setShipSpeed(speed))}
    />
  );
};
```

### In a Tab-Based Layout

```tsx
<div className="game-tabs">
  <TabPanel name="ship">
    <ShipControls
      currentSpeed={state.shipSpeed}
      fuel={state.fuel}
      tankCapacity={state.modules.engine.tankCapacity}
      maxSpeedUnlocked={state.modules.engine.maxSpeedUnlocked}
      fuelEfficiencyPercent={state.modules.engine.fuelEfficiencyPercent}
      onSpeedChange={(speed) => dispatch(actions.setShipSpeed(speed))}
    />
  </TabPanel>
  <TabPanel name="mining">
    {/* Other content */}
  </TabPanel>
</div>
```

### As a Floating Panel

```tsx
<div className="fixed bottom-4 right-4 max-w-md">
  <ShipControls
    currentSpeed={state.shipSpeed}
    fuel={state.fuel}
    tankCapacity={state.modules.engine.tankCapacity}
    maxSpeedUnlocked={state.modules.engine.maxSpeedUnlocked}
    fuelEfficiencyPercent={state.modules.engine.fuelEfficiencyPercent}
    onSpeedChange={(speed) => dispatch(actions.setShipSpeed(speed))}
  />
</div>
```

## Integration Points

The ShipControls component can be integrated in several locations:

### 1. Bottom Tab Navigation (Recommended)
Add a "Ship" or "Controls" tab to the bottom navigation alongside other game panels:
- Resources
- Upgrades
- Ship Controls ← New tab
- Achievements
- Settings

### 2. Sidebar Panel
Display as a fixed sidebar panel that's always visible during gameplay:
- Place on left or right side of screen
- Combine with other ship-related information
- Keep it compact for desktop users

### 3. Floating Overlay
Create a draggable or fixed-position overlay:
- Can be minimized when not needed
- Useful for quick access without changing tabs
- Good for mobile devices

### 4. Ship Management Screen
Combine with other ship modules in a comprehensive management interface:
- Engine upgrades section
- Ship Controls component
- Fuel conversion settings
- Module status displays

## State Management

The component integrates with the game's global state through the GameContext:

### Required State Properties
- `state.shipSpeed`: Current speed setting
- `state.fuel`: Current fuel amount
- `state.modules.engine.tankCapacity`: Maximum fuel capacity
- `state.modules.engine.maxSpeedUnlocked`: Highest speed available
- `state.modules.engine.fuelEfficiencyPercent`: Efficiency multiplier

### Actions Dispatched
- `SET_SHIP_SPEED`: Updates the ship's speed setting

## Visual States

### Normal State
- All unlocked speeds are interactive
- Current speed highlighted with ring border
- Fuel bar shows blue progress indicator

### Low Fuel State (< 10%)
- Yellow warning banner appears
- Progress bar turns yellow
- Percentage displayed prominently

### Out of Fuel State (0%)
- Red alert banner appears
- Progress bar turns red
- Ship automatically stops
- Instructions to mine for more fuel

### Locked Speed State
- Button disabled with reduced opacity
- Lock icon (🔒) shown in corner
- Tooltip explains unlock requirement

## Calculations

### Fuel Consumption
```typescript
actualConsumption = baseRate × speedMultiplier × (fuelEfficiencyPercent / 100)
```

Example:
- Base rate: 1.0 fuel/sec
- Speed: Normal (1x multiplier)
- Efficiency: 100%
- Result: 1.0 fuel/sec

With upgraded efficiency (50%):
- Result: 0.5 fuel/sec

### Distance Rate
```typescript
distancePerSecond = baseDistance × speedMultiplier
```

Example:
- Speed: Boost (3x distance multiplier)
- Result: 3x normal distance traveled

## Responsive Design

The component is mobile-friendly with:
- Touch-friendly button sizes (adequate tap targets)
- Responsive grid layout for speed buttons
- Readable text sizes on small screens
- Proper spacing for mobile devices

For smaller screens, consider:
```tsx
<ShipControls
  className="text-sm" // Smaller text
  // ... other props
/>
```

## Testing

The component includes comprehensive tests covering:
- ✅ Rendering all speed buttons
- ✅ Displaying fuel tank information
- ✅ Speed selection functionality
- ✅ Lock state for unavailable speeds
- ✅ Low fuel warnings
- ✅ Out of fuel alerts
- ✅ Fuel consumption calculations
- ✅ Keyboard shortcuts
- ✅ Accessibility features

Run tests:
```bash
npm test -- ShipControls.test.tsx
```

## Storybook

View component variants in Storybook:
```bash
npm run storybook
```

Available stories:
- Default (normal speed, adequate fuel)
- All Speeds Unlocked
- Low Fuel Warning
- Out of Fuel
- Stopped Ship
- Boost Speed
- Improved Efficiency
- Early Game
- Late Game

## Dependencies

### Internal Components
- `Card`: Container component
- `Button`: Speed selector buttons
- `ProgressBar`: Fuel tank level indicator
- `Tooltip`: Speed information tooltips

### Utilities
- `formatNumber`: Number formatting with abbreviations
- `SPEED_FUEL_MULTIPLIERS`: Fuel consumption rates
- `SPEED_DISTANCE_MULTIPLIERS`: Distance rates

### Types
- `ShipSpeed`: Speed setting type definition

## Performance Considerations

- Uses `React.memo` for optimization (if needed)
- Keyboard event listeners cleaned up on unmount
- Efficient re-renders only when relevant props change
- No heavy calculations in render cycle

## Future Enhancements

Potential improvements for later phases:

1. **Autopilot Mode**: Auto-adjust speed based on fuel levels
2. **Speed Presets**: Save and recall speed configurations
3. **Fuel Efficiency Graph**: Visual chart of consumption over time
4. **Distance Traveled Counter**: Track total distance in current zone
5. **Speed Change Animation**: Smooth visual transition between speeds
6. **Sound Effects**: Audio feedback for speed changes and warnings
7. **Advanced Tooltips**: Show estimated time until fuel depletion

## Troubleshooting

### Keyboard shortcuts not working
- Ensure user is not focused on an input field
- Check that event listeners are properly attached
- Verify no conflicts with other keyboard handlers

### Speed button disabled when it should be unlocked
- Verify `maxSpeedUnlocked` prop is correctly set
- Check `SPEED_UNLOCK_ORDER` array for proper ordering
- Ensure engine module state is updated

### Fuel consumption calculation incorrect
- Verify `fuelEfficiencyPercent` is a percentage (0-100)
- Check `SPEED_FUEL_MULTIPLIERS` constants
- Ensure calculations use correct formulas

## Related Files

- `/src/components/game/ShipControls.tsx` - Main component
- `/src/components/game/ShipControls.test.tsx` - Unit tests
- `/src/components/game/ShipControls.stories.tsx` - Storybook stories
- `/src/components/game/ShipControls.example.tsx` - Integration examples
- `/src/types/modules.ts` - Type definitions
- `/src/context/actions.ts` - Action creators
- `/src/context/gameReducer.ts` - State reducer
- `/src/utils/gameLogic/resourceConversion.ts` - Conversion utilities

## Credits

Component created for Cosmic Clicker Phase 1 based on specifications in GAME_DESIGN_V2.md.
