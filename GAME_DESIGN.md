# Cosmic Clicker - Game Design Document

## Core Mechanics

### Resource: Stardust (SD)
The primary currency collected through clicking and automated production.

**Initial click value**: 1 SD per click
**Number formatting**: Use abbreviations (K, M, B, T, Qa, Qi, etc.)

### Secondary Resource: Nebula Crystals (NC)
Prestige currency earned when resetting the game.

**Formula**: `NC = floor(sqrt(totalStardust / 1e6))`
**Minimum for prestige**: 1 NC (requires 1M total stardust)

## Production Buildings

### Tier 1: Space Miners
- **Base cost**: 10 SD
- **Cost multiplier**: 1.15x per purchase
- **Production**: 0.1 SD/sec
- **Description**: "Small drones that collect stardust automatically"

### Tier 2: Asteroid Harvesters
- **Base cost**: 100 SD
- **Cost multiplier**: 1.15x per purchase
- **Production**: 1 SD/sec
- **Description**: "Automated facilities that mine asteroids"

### Tier 3: Lunar Refineries
- **Base cost**: 1,100 SD
- **Cost multiplier**: 1.15x per purchase
- **Production**: 8 SD/sec
- **Description**: "Advanced refineries on lunar surfaces"

### Tier 4: Solar Collectors
- **Base cost**: 12,000 SD
- **Cost multiplier**: 1.15x per purchase
- **Production**: 47 SD/sec
- **Description**: "Massive arrays that harness solar energy"

### Tier 5: Wormhole Generators
- **Base cost**: 130,000 SD
- **Cost multiplier**: 1.15x per purchase
- **Production**: 260 SD/sec
- **Description**: "Exotic technology that generates stardust from quantum fluctuations"

### Tier 6: Galactic Nexus
- **Base cost**: 1,400,000 SD
- **Cost multiplier**: 1.15x per purchase
- **Production**: 1,400 SD/sec
- **Description**: "A vast network connecting stellar production facilities"

### Tier 7: Universe Engine
- **Base cost**: 20,000,000 SD
- **Cost multiplier**: 1.15x per purchase
- **Production**: 7,800 SD/sec
- **Description**: "Reality-bending machinery that creates stardust from the fabric of spacetime"

## Click Upgrades

### Manual Click Power
1. **Improved Collectors** (Cost: 100 SD) - 2x click power
2. **Enhanced Collectors** (Cost: 500 SD) - 2x click power
3. **Advanced Collectors** (Cost: 2,500 SD) - 2x click power
4. **Quantum Collectors** (Cost: 25,000 SD) - 3x click power
5. **Cosmic Collectors** (Cost: 500,000 SD) - 5x click power

### Auto-clicker Unlocks
1. **Basic Auto-clicker** (Cost: 1,000 SD) - 1 click per second
2. **Improved Auto-clicker** (Cost: 10,000 SD) - 2 clicks per second
3. **Advanced Auto-clicker** (Cost: 100,000 SD) - 5 clicks per second
4. **Quantum Auto-clicker** (Cost: 1,000,000 SD) - 10 clicks per second

## Production Upgrades

### Global Production Multipliers
1. **Efficient Mining** (Cost: 500 SD) - 2x production for all buildings
2. **Advanced Automation** (Cost: 5,000 SD) - 2x production for all buildings
3. **Neural Networks** (Cost: 50,000 SD) - 2x production for all buildings
4. **Quantum Computing** (Cost: 500,000 SD) - 2x production for all buildings
5. **Singularity Core** (Cost: 5,000,000 SD) - 3x production for all buildings

### Building-Specific Upgrades
Each building type has 3 upgrade tiers (2x, 3x, 5x multipliers) unlocked at specific ownership thresholds (10, 25, 50 of that building).

## Prestige System

### Nebula Crystals
- Earned by resetting all progress
- Provide permanent 1% production bonus per crystal
- Formula: `Production Multiplier = 1 + (crystals * 0.01)`

### Prestige Upgrades (Permanent)
1. **Stardust Affinity** (Cost: 5 NC) - Start each run with 100 SD
2. **Mining Experience** (Cost: 10 NC) - Start with 5 Space Miners
3. **Click Master** (Cost: 15 NC) - 2x base click power permanently
4. **Production Expert** (Cost: 25 NC) - 2x all production permanently
5. **Automation Mastery** (Cost: 50 NC) - Unlock auto-clicker at start of run
6. **Cosmic Insight** (Cost: 100 NC) - 10% more NC from prestige

## Achievement System

### Click-based
- **First Click**: Click once
- **Click Novice**: Click 100 times
- **Click Adept**: Click 1,000 times
- **Click Master**: Click 10,000 times
- **Click Legend**: Click 100,000 times

### Production-based
- **Mining Beginner**: Own 1 Space Miner
- **Mining Fleet**: Own 50 Space Miners
- **Asteroid Baron**: Own 25 Asteroid Harvesters
- **Solar Magnate**: Own 10 Solar Collectors
- **Reality Shaper**: Own 1 Universe Engine

### Milestone-based
- **Dust Collector**: Earn 1,000 SD (lifetime)
- **Stellar Miner**: Earn 1M SD (lifetime)
- **Galactic Tycoon**: Earn 1B SD (lifetime)
- **Universe Creator**: Earn 1T SD (lifetime)

### Prestige-based
- **First Ascension**: Prestige once
- **Ascension Master**: Prestige 10 times
- **Crystal Collector**: Earn 100 NC (total)
- **Cosmic Veteran**: Earn 1,000 NC (total)

**Achievement Rewards**: Each achievement grants +1% production bonus

## Save System

### Auto-save
- Trigger every 30 seconds
- Save to localStorage
- Include timestamp for offline progress

### Offline Progress
- Calculate time elapsed since last save
- Cap offline earnings at 8 hours (to prevent abuse)
- Award 50% of theoretical production during offline time
- Display popup on return showing offline earnings

### Save Data Structure
```typescript
{
  version: string,
  timestamp: number,
  stardust: number,
  totalStardustEarned: number,
  totalClicks: number,
  nebulaCrystals: number,
  buildings: { [key: string]: number },
  upgrades: { [key: string]: boolean },
  prestigeUpgrades: { [key: string]: boolean },
  achievements: { [key: string]: boolean },
  statistics: {
    totalPrestige: number,
    lifetimeStardust: number,
    lifetimeClicks: number,
    startTime: number,
    totalPlaytime: number
  }
}
```

## UI/UX Requirements

### Main Screen Layout
- **Top Bar**: Current stardust, production rate, NC count
- **Center**: Large clickable cosmic object with particles
- **Left Panel**: Buildings list with costs and owned count
- **Right Panel**: Upgrades organized by category
- **Bottom Bar**: Statistics, achievements, prestige button

### Visual Feedback
- Number animations when collecting stardust
- Particle effects on click
- Glowing effects when upgrades are affordable
- Smooth transitions and hover effects
- Progress bars for next building/upgrade

### Responsive Design
- Mobile-friendly layout (stack panels vertically)
- Touch-friendly click targets
- Optimized for both desktop and mobile

## Balancing Goals

1. **Early game (0-5 minutes)**: Focus on clicking and first buildings
2. **Mid game (5-30 minutes)**: Balance clicking vs. automation, unlock most upgrades
3. **Late game (30+ minutes)**: Automation dominates, working toward first prestige
4. **Prestige runs**: Each run should be ~30-50% faster than previous

## Technical Requirements

### Performance
- 60 FPS animation target
- Efficient game loop (requestAnimationFrame)
- Debounced save operations
- Optimized re-renders using React.memo where appropriate

### Accessibility
- Keyboard navigation support
- Screen reader friendly labels
- High contrast mode option
- Reduce motion option for animations

### Testing Coverage
- Unit tests for all game logic functions
- Component tests for UI elements
- Integration tests for save/load
- E2E tests for complete game flows
- Target: >80% code coverage
