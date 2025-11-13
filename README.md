# Cosmic Clicker - An Incremental Space Game

## Project Overview

Cosmic Clicker is a React-based incremental game where players start as a small space miner collecting stardust and progressively unlock upgrades, automation, and prestige mechanics to build an interstellar empire.

## Game Concept

**Theme**: Space exploration and resource management
**Core Loop**: Click to gather stardust → Purchase upgrades → Unlock automation → Prestige for permanent bonuses

### Key Features
- **Manual clicking**: Primary resource generation through user interaction
- **Automated production**: Unlock miners and facilities that generate resources passively
- **Upgrade system**: Multiple tiers of upgrades with increasing costs and benefits
- **Prestige mechanics**: Reset progress for permanent multipliers
- **Achievement system**: Unlock achievements for hitting milestones
- **Save/Load**: Automatic and manual save functionality with offline progress
- **Responsive UI**: Beautiful, animated interface with particle effects
- **Statistics**: Track lifetime stats and efficiency metrics

## Technical Stack

- **Framework**: React 18+ with TypeScript
- **Build Tool**: Vite
- **State Management**: Context API + useReducer (or Zustand if complexity warrants)
- **Styling**: Tailwind CSS + CSS animations
- **Testing**: Vitest + React Testing Library + Playwright for E2E
- **Code Quality**: ESLint + Prettier
- **Documentation**: JSDoc comments + Storybook for components

## Project Structure

```
cosmic-clicker/
├── src/
│   ├── components/        # React components
│   │   ├── ui/           # Reusable UI components
│   │   ├── game/         # Game-specific components
│   │   └── layout/       # Layout components
│   ├── hooks/            # Custom React hooks
│   ├── context/          # Context providers
│   ├── utils/            # Utility functions
│   │   ├── gameLogic/   # Core game calculations
│   │   ├── saveLoad/    # Save/load functionality
│   │   └── formatting/  # Number formatting, etc.
│   ├── types/            # TypeScript type definitions
│   ├── constants/        # Game constants and config
│   ├── data/             # Game data (upgrades, achievements, etc.)
│   └── tests/            # Test files
├── docs/                 # Documentation
├── .storybook/          # Storybook configuration
└── e2e/                 # End-to-end tests
```

## Setup Instructions

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Run tests
npm run test

# Run E2E tests
npm run test:e2e

# Build for production
npm run build

# Run Storybook
npm run storybook
```

## Development Workflow

1. Read through TASKS.md for ordered task list
2. Complete each task following the acceptance criteria
3. Write tests for each feature
4. Update documentation as you build
5. Commit changes with descriptive messages

## Game Design Document

See [GAME_DESIGN.md](./GAME_DESIGN.md) for detailed game mechanics, balancing, and progression curves.

## Contributing

This project is designed to be built autonomously by Claude Code. Each task in TASKS.md should be completed sequentially with full testing and documentation.

## License

MIT
