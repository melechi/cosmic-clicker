# Project Structure

This document shows the complete file structure for Cosmic Clicker after all tasks are completed.

```
cosmic-clicker/
│
├── .github/
│   └── workflows/
│       ├── ci.yml                          # Continuous integration
│       └── deploy.yml                      # Deployment to GitHub Pages
│
├── .storybook/
│   ├── main.ts                             # Storybook configuration
│   └── preview.ts                          # Storybook preview settings
│
├── docs/
│   ├── GAMEPLAY.md                         # How to play guide
│   ├── MECHANICS.md                        # Detailed game mechanics
│   └── FAQ.md                              # Frequently asked questions
│
├── e2e/
│   ├── gameStart.spec.ts                   # E2E: Initial game experience
│   ├── purchasing.spec.ts                  # E2E: Buying buildings/upgrades
│   ├── prestige.spec.ts                    # E2E: Prestige system
│   ├── saveLoad.spec.ts                    # E2E: Save/load functionality
│   └── responsive.spec.ts                  # E2E: Responsive design
│
├── public/
│   ├── favicon.ico
│   └── assets/                             # Static assets
│       ├── icons/                          # Building/upgrade icons (SVG)
│       └── images/                         # Background images
│
├── src/
│   ├── components/
│   │   ├── effects/
│   │   │   ├── BackgroundParticles.tsx     # Animated background
│   │   │   ├── NumberCountUp.tsx           # Number animation component
│   │   │   └── ClickParticle.tsx           # Particle on click
│   │   │
│   │   ├── game/
│   │   │   ├── Clicker.tsx                 # Main clickable element
│   │   │   ├── Clicker.test.tsx
│   │   │   ├── Clicker.stories.tsx
│   │   │   │
│   │   │   ├── BuildingList.tsx            # List of all buildings
│   │   │   ├── BuildingList.test.tsx
│   │   │   ├── BuildingList.stories.tsx
│   │   │   ├── BuildingItem.tsx            # Individual building display
│   │   │   ├── BuildingItem.test.tsx
│   │   │   ├── BuildingItem.stories.tsx
│   │   │   │
│   │   │   ├── UpgradesPanel.tsx           # Upgrades interface
│   │   │   ├── UpgradesPanel.test.tsx
│   │   │   ├── UpgradesPanel.stories.tsx
│   │   │   ├── UpgradeItem.tsx             # Individual upgrade display
│   │   │   ├── UpgradeItem.test.tsx
│   │   │   ├── UpgradeItem.stories.tsx
│   │   │   │
│   │   │   ├── PrestigePanel.tsx           # Prestige interface
│   │   │   ├── PrestigePanel.test.tsx
│   │   │   ├── PrestigeButton.tsx          # Prestige action button
│   │   │   ├── PrestigeUpgrades.tsx        # Prestige upgrades list
│   │   │   │
│   │   │   ├── AchievementsPanel.tsx       # Achievements display
│   │   │   ├── AchievementsPanel.test.tsx
│   │   │   ├── AchievementItem.tsx         # Individual achievement
│   │   │   ├── AchievementItem.test.tsx
│   │   │   │
│   │   │   ├── Statistics.tsx              # Game statistics
│   │   │   ├── Statistics.test.tsx
│   │   │   │
│   │   │   ├── Settings.tsx                # Settings panel
│   │   │   ├── Settings.test.tsx
│   │   │   │
│   │   │   ├── Tutorial.tsx                # First-time tutorial
│   │   │   ├── Tutorial.test.tsx
│   │   │   ├── HelpModal.tsx               # Help documentation
│   │   │   └── HelpModal.test.tsx
│   │   │
│   │   ├── layout/
│   │   │   ├── Header.tsx                  # Top navigation/resource display
│   │   │   ├── Header.test.tsx
│   │   │   ├── Header.stories.tsx
│   │   │   │
│   │   │   ├── Sidebar.tsx                 # Side panel (collapsible)
│   │   │   ├── Sidebar.test.tsx
│   │   │   ├── Sidebar.stories.tsx
│   │   │   │
│   │   │   ├── MainLayout.tsx              # Main responsive layout
│   │   │   ├── MainLayout.test.tsx
│   │   │   ├── MainLayout.stories.tsx
│   │   │   │
│   │   │   ├── Footer.tsx                  # Footer with stats/links
│   │   │   ├── Footer.test.tsx
│   │   │   └── Footer.stories.tsx
│   │   │
│   │   └── ui/
│   │       ├── Button.tsx                  # Reusable button
│   │       ├── Button.test.tsx
│   │       ├── Button.stories.tsx
│   │       │
│   │       ├── Card.tsx                    # Card container
│   │       ├── Card.test.tsx
│   │       ├── Card.stories.tsx
│   │       │
│   │       ├── ProgressBar.tsx             # Progress bar component
│   │       ├── ProgressBar.test.tsx
│   │       ├── ProgressBar.stories.tsx
│   │       │
│   │       ├── Tooltip.tsx                 # Tooltip component
│   │       ├── Tooltip.test.tsx
│   │       ├── Tooltip.stories.tsx
│   │       │
│   │       ├── Modal.tsx                   # Modal dialog
│   │       ├── Modal.test.tsx
│   │       ├── Modal.stories.tsx
│   │       │
│   │       ├── Toast.tsx                   # Toast notification
│   │       ├── Toast.test.tsx
│   │       ├── ToastContainer.tsx          # Toast manager
│   │       └── Toast.stories.tsx
│   │
│   ├── constants/
│   │   ├── buildings.ts                    # All building definitions
│   │   ├── upgrades.ts                     # All upgrade definitions
│   │   ├── achievements.ts                 # All achievement definitions
│   │   ├── gameConfig.ts                   # General game configuration
│   │   └── index.ts                        # Export all constants
│   │
│   ├── context/
│   │   ├── GameContext.tsx                 # Game state context provider
│   │   ├── GameContext.test.tsx
│   │   ├── gameReducer.ts                  # State reducer function
│   │   ├── gameReducer.test.ts
│   │   └── actions.ts                      # Action creators
│   │
│   ├── hooks/
│   │   ├── useGameLoop.ts                  # Game tick hook
│   │   ├── useGameLoop.test.ts
│   │   ├── useToast.ts                     # Toast notification hook
│   │   ├── useAnimation.ts                 # Animation utilities hook
│   │   └── index.ts                        # Export all hooks
│   │
│   ├── tests/
│   │   ├── setup.ts                        # Test configuration
│   │   ├── utils.tsx                       # Test utilities/helpers
│   │   │
│   │   └── integration/
│   │       ├── gameFlow.test.tsx           # Full game flow tests
│   │       ├── saveLoad.test.tsx           # Save/load integration
│   │       └── prestige.test.tsx           # Prestige system integration
│   │
│   ├── types/
│   │   ├── game.ts                         # Core game state types
│   │   ├── buildings.ts                    # Building-related types
│   │   ├── upgrades.ts                     # Upgrade-related types
│   │   ├── achievements.ts                 # Achievement-related types
│   │   ├── save.ts                         # Save data types
│   │   └── index.ts                        # Export all types
│   │
│   ├── utils/
│   │   ├── animations.ts                   # Animation utilities
│   │   ├── errorTracking.ts                # Error tracking/logging
│   │   ├── settingsManager.ts              # User settings management
│   │   │
│   │   ├── formatting/
│   │   │   ├── numberFormat.ts             # Number formatting (K, M, B, etc.)
│   │   │   ├── numberFormat.test.ts
│   │   │   └── index.ts
│   │   │
│   │   ├── gameLogic/
│   │   │   ├── calculations.ts             # Core game calculations
│   │   │   ├── calculations.test.ts
│   │   │   └── index.ts
│   │   │
│   │   └── saveLoad/
│   │       ├── saveManager.ts              # Save/load functionality
│   │       ├── saveManager.test.ts
│   │       ├── offlineProgress.ts          # Offline earnings calculation
│   │       ├── offlineProgress.test.ts
│   │       └── index.ts
│   │
│   ├── App.tsx                             # Main application component
│   ├── App.test.tsx
│   ├── ErrorBoundary.tsx                   # Error boundary component
│   ├── main.tsx                            # Application entry point
│   ├── index.css                           # Global styles
│   └── vite-env.d.ts                       # Vite type definitions
│
├── .eslintrc.json                          # ESLint configuration
├── .gitignore                              # Git ignore rules
├── .prettierrc                             # Prettier configuration
├── CHANGELOG.md                            # Version history
├── CLAUDE_CODE_INSTRUCTIONS.md             # Instructions for Claude Code
├── CONTRIBUTING.md                         # Contribution guidelines
├── GAME_DESIGN.md                          # Game design document
├── package.json                            # Dependencies and scripts
├── playwright.config.ts                    # Playwright E2E config
├── PROJECT_STRUCTURE.md                    # This file
├── QUICK_START.md                          # Quick start guide
├── README.md                               # Project README
├── tailwind.config.js                      # Tailwind CSS configuration
├── TASKS.md                                # Development task list
├── tsconfig.json                           # TypeScript configuration
├── tsconfig.node.json                      # TypeScript config for Node
├── vite.config.ts                          # Vite configuration
└── vitest.config.ts                        # Vitest test configuration
```

## Key Directories

### `/src/components/`
All React components organized by type:
- **effects/**: Visual effects and animations
- **game/**: Game-specific components (clicker, buildings, upgrades)
- **layout/**: Layout structure components
- **ui/**: Reusable UI primitives

Each component should have:
- Main component file (`.tsx`)
- Test file (`.test.tsx`)
- Storybook story (`.stories.tsx`) - optional for some

### `/src/constants/`
All game data and configuration:
- Building definitions (costs, production, descriptions)
- Upgrade definitions (effects, costs, descriptions)
- Achievement definitions (requirements, rewards)
- General game configuration

### `/src/context/`
State management:
- GameContext provider
- Reducer for state transitions
- Action creators

### `/src/hooks/`
Custom React hooks:
- useGameLoop: Main game loop
- useToast: Toast notifications
- useAnimation: Animation helpers

### `/src/types/`
TypeScript type definitions:
- All interfaces and types used throughout the app
- Organized by domain (game, buildings, upgrades, etc.)

### `/src/utils/`
Utility functions organized by purpose:
- **formatting/**: Number formatting, date formatting
- **gameLogic/**: Core game calculations
- **saveLoad/**: Persistence and offline progress

### `/docs/`
User-facing documentation:
- How to play guide
- Detailed mechanics explanations
- FAQ

### `/e2e/`
End-to-end tests using Playwright:
- Critical user flows
- Multi-step interactions
- Cross-browser compatibility

### `/.github/workflows/`
CI/CD pipelines:
- Automated testing on PRs
- Deployment to production

## File Naming Conventions

- **Components**: PascalCase (e.g., `BuildingList.tsx`)
- **Utilities**: camelCase (e.g., `numberFormat.ts`)
- **Test files**: Match source file with `.test.ts(x)` (e.g., `BuildingList.test.tsx`)
- **Story files**: Match source file with `.stories.tsx` (e.g., `BuildingList.stories.tsx`)
- **Types**: camelCase for files, PascalCase for type names
- **Constants**: camelCase for files, UPPER_SNAKE_CASE for exports

## Import Path Aliases

Configured in `tsconfig.json` and `vite.config.ts`:

```typescript
// Instead of: import { Button } from '../../../components/ui/Button';
import { Button } from '@/components/ui/Button';

// Instead of: import { GameState } from '../../../types/game';
import type { GameState } from '@/types';

// Instead of: import { formatNumber } from '../../../utils/formatting/numberFormat';
import { formatNumber } from '@/utils/formatting/numberFormat';
```

## Code Organization Patterns

### Barrel Exports
Each major directory has an `index.ts` that re-exports:

```typescript
// src/types/index.ts
export * from './game';
export * from './buildings';
export * from './upgrades';
export * from './achievements';
export * from './save';

// Usage:
import type { GameState, Building, Upgrade } from '@/types';
```

### Component Co-location
Related files stay together:

```
BuildingList/
├── BuildingList.tsx
├── BuildingList.test.tsx
├── BuildingList.stories.tsx
└── BuildingItem.tsx         # Sub-component only used by BuildingList
```

Or flat when preferred:
```
BuildingList.tsx
BuildingList.test.tsx
BuildingList.stories.tsx
BuildingItem.tsx
BuildingItem.test.tsx
```

## Build Artifacts (Ignored in Git)

```
cosmic-clicker/
├── node_modules/              # Dependencies
├── dist/                      # Production build
├── .storybook-out/           # Storybook build
├── coverage/                  # Test coverage reports
└── playwright-report/         # E2E test reports
```

## Environment Files

```
.env                           # Local environment variables
.env.local                     # Local overrides (git-ignored)
.env.production               # Production variables
```

## Total File Count Estimate

- **Components**: ~40 files (components + tests + stories)
- **Utils**: ~15 files (utils + tests)
- **Context/Hooks**: ~10 files (context + hooks + tests)
- **Types**: ~6 files
- **Constants**: ~5 files
- **Tests**: ~10 integration/E2E tests
- **Config**: ~12 configuration files
- **Docs**: ~8 documentation files
- **Total**: ~105-110 source files

## Bundle Size Targets

Production build should be:
- **Total**: <200KB gzipped
- **Main bundle**: <150KB gzipped
- **Vendor**: <50KB gzipped
- **Lazy chunks**: <30KB each

## Performance Targets

- **First Contentful Paint**: <1.5s
- **Time to Interactive**: <3s
- **Lighthouse Score**: >90
- **Game Loop**: 60 FPS stable
- **Memory**: <50MB after 1 hour of play

---

This structure is designed for:
- ✅ Clear separation of concerns
- ✅ Easy navigation and discovery
- ✅ Scalability (add features without restructuring)
- ✅ Testability (tests co-located with code)
- ✅ Maintainability (consistent patterns throughout)
