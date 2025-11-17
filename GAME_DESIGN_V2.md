# Cosmic Clicker - Game Design Document v2.0

**Genre**: Incremental/Idle Space Journey Game
**Platform**: Web Browser (React/TypeScript)
**Target Audience**: Incremental game enthusiasts, casual players

---

## Table of Contents

1. [Game Concept](#game-concept)
2. [Core Gameplay Loop](#core-gameplay-loop)
3. [Resource Economy](#resource-economy)
4. [Ship Systems](#ship-systems)
5. [Zone System](#zone-system)
6. [Objects & Interactions](#objects--interactions)
7. [Upgrade Trees](#upgrade-trees)
8. [Progression Systems](#progression-systems)
9. [Implementation Roadmap](#implementation-roadmap)

---

## Game Concept

### Overview
Players pilot a spaceship on an endless journey through space zones. The ship constantly drifts forward, consuming fuel to move. Players actively mine passing objects (asteroids, debris, derelicts) for resources, which can be converted to fuel or sold for credits. The goal is to reach each zone's fuel requirement to power the Jump Drive and advance to the next zone.

### Core Philosophy
- **Active + Idle Hybrid**: Active clicking mines objects, passive bots provide backup income
- **Resource Management**: Balance fuel consumption, resource conversion, and credit spending
- **Strategic Depth**: Upgrade tree choices affect playstyle and efficiency
- **Progressive Challenge**: Each zone increases difficulty and resource variety

---

## Core Gameplay Loop

### Primary Loop (Per Zone)
1. **Ship drifts forward** → Consumes fuel based on speed setting
2. **Objects appear** → Asteroids, debris, derelicts drift through the zone
3. **Player mines objects** → Active clicking or idle bots extract resources
4. **Resources collected** → Stored in Cargo Hold (limited capacity)
5. **Resource conversion** → Converter module transforms resources → fuel
6. **Resource selling** → Sell resources for Credits (main upgrade currency)
7. **Purchase upgrades** → Spend Credits on ship modules and upgrades
8. **Reach fuel goal** → Power Jump Drive to warp to next zone
9. **Zone transition** → Choose 1 of 3 Prestige Cards (temporary run bonuses)

### Secondary Loop (Long-term)
- **Prestige System**: Reset when zones become impossible, gain permanent bonuses
- **Artifact Collection**: Rare permanent bonuses from special objects
- **Secret Zones**: Discover hidden zones via Gates or special coordinates

---

## Resource Economy

### Primary Resources

#### Fuel ⛽
- **Purpose**: Ship propulsion (consumed continuously), zone progression currency
- **Sources**:
  - Convert other resources via Converter module
  - Zone completion bonus
  - Prestige bonuses
- **Consumption**: Varies by ship speed setting (Stop/Slow/Normal/Fast/Boost)

#### Credits 💰
- **Purpose**: Main upgrade currency
- **Sources**:
  - Sell resources for Credits (market prices vary by zone)
  - Complete achievements
  - Find credit caches in derelicts
- **Usage**: Purchase all module upgrades, unlock new modules

### Extractable Resources

#### Tier 1 (Early Zones 1-2)
| Resource | Fuel Conversion | Rarity | Found In |
|----------|----------------|--------|----------|
| Stone 🪨 | 1:1 | Common | Asteroids |
| Carbon ⚫ | 1:1 | Common | Asteroids, Debris |

#### Tier 2 (Zones 2-4)
| Resource | Fuel Conversion | Rarity | Found In |
|----------|----------------|--------|----------|
| Iron 🔩 | 1:2 | Uncommon | Iron Asteroids, Derelicts |
| Ice ❄️ | 1:1.5 | Uncommon | Ice Asteroids |

#### Tier 3 (Zones 4-6)
| Resource | Fuel Conversion | Rarity | Found In |
|----------|----------------|--------|----------|
| Gold 🏅 | 1:5 | Rare | Rich Asteroids, Derelicts |
| Titanium 🔧 | 1:4 | Rare | Advanced Derelicts |

#### Tier 4 (Zones 6+)
| Resource | Fuel Conversion | Rarity | Found In |
|----------|----------------|--------|----------|
| Platinum 💎 | 1:10 | Very Rare | Platinum Asteroids |
| Iridium ⭐ | 1:15 | Very Rare | Exotic Objects |
| Dark Matter 🌌 | 1:50 | Legendary | Anomalies, Secret Zones |

### Resource Conversion System

**Converter Module**:
- Converts resources → fuel automatically over time
- **Manual Control Slider (0-100%)**: What % of incoming resources to auto-convert
  - 0% = Store all resources (sell for Credits later)
  - 100% = Auto-convert everything to fuel immediately
  - 50% = Convert half, store half
- **Conversion Speed**: Resources/second, upgradeable
- **Efficiency**: Fuel ratio, upgradeable (start at base rates, can improve)
- **Priority Queue**: Choose which resource types convert first

---

## Ship Systems

### Ship Movement & Fuel Consumption

#### Speed Settings
| Speed | Fuel/sec | Distance/sec | Use Case |
|-------|----------|--------------|----------|
| Stop ⏸️ | 0 | 0 | Emergency conservation, mining specific area |
| Slow 🐌 | 0.5x | 0.5x | Fuel efficient, more time to mine objects |
| Normal ➡️ | 1x | 1x | Balanced (default) |
| Fast ⏩ | 2x | 2x | Speed through empty areas |
| Boost 🚀 | 5x | 3x | Emergency escape, very inefficient |

- **Out of Fuel**: Ship stops automatically, can still mine to generate more fuel
- **Fuel Tank Capacity**: Upgradeable limit (start: 1000, max: 1,000,000+)

### Core Modules

#### 1. Laser System 🔫
**Purpose**: Active mining tool - fire at objects to extract resources

**Base Stats**:
- Damage: 1 (resources extracted per click)
- Range: 100px (can hit objects within this radius)
- Cooldown: 0.5s (time between shots)
- Lasers: 1 (simultaneous beams)

**Upgrade Path**:
1. **Damage**: 1 → 2 → 5 → 10 → 25 → 50 → 100
2. **Range**: 100 → 150 → 200 → 300 → 500 → 800 → 1200px
3. **Cooldown Reduction**: 0.5s → 0.3s → 0.2s → 0.1s → 0.05s
4. **Multi-Laser**: 1 → 2 → 3 → 5 → 8 lasers
5. **Piercing**: Hit multiple objects in a line
6. **Auto-Target**: Laser auto-fires at nearest object (toggle)

#### 2. Bot Bay Module 🤖
**Purpose**: Idle mining - bots autonomously collect resources

**Base Stats**:
- Bots: 0 (must unlock first)
- Mining Speed: 1 resource/5s per bot
- Range: 80px from ship
- Capacity: 10 resources per bot before returning

**Upgrade Path**:
1. **Unlock Bots**: Purchase first bot bay
2. **Bot Count**: 1 → 3 → 5 → 10 → 20 → 50 bots
3. **Mining Speed**: 1/5s → 1/3s → 1/s → 2/s → 5/s
4. **Range**: 80 → 120 → 180 → 300 → 500px
5. **Capacity**: 10 → 25 → 50 → 100 → 250 resources
6. **Intelligence**: Prioritize high-value resources, avoid empty objects
7. **Repair Bots**: Bots can repair ship hull (future damage system)

#### 3. Converter Module ⚗️
**Purpose**: Transform resources into fuel

**Base Stats**:
- Speed: 1 resource/2s
- Efficiency: 100% of base conversion rates
- Auto-Convert %: 50% (manual slider control)
- Unlocked Resources: Tier 1 only (Stone, Carbon)

**Upgrade Path**:
1. **Conversion Speed**: 1/2s → 1/s → 2/s → 5/s → 10/s → 25/s
2. **Efficiency Boost**: 100% → 110% → 125% → 150% → 200%
3. **Unlock Tier 2**: Enable Ice, Iron conversion
4. **Unlock Tier 3**: Enable Gold, Titanium conversion
5. **Unlock Tier 4**: Enable Platinum, Iridium, Dark Matter
6. **Parallel Processing**: Convert multiple resource types simultaneously
7. **Smart Mode**: Auto-adjust conversion % based on fuel levels

#### 4. Cargo Hold 📦
**Purpose**: Store collected resources before conversion/selling

**Base Stats**:
- Total Capacity: 100 resources
- Resource Slots: 3 (can store 3 different resource types)
- Compression: None

**Upgrade Path**:
1. **Capacity**: 100 → 250 → 500 → 1000 → 2500 → 5000 → 10,000
2. **Resource Slots**: 3 → 5 → 8 → 12 → 20 (all types)
3. **Compression**: Reduce resource stack size (store more per slot)
4. **Quick-Sell**: Sell all cargo with one click
5. **Price Scanner**: See market value before selling
6. **Auto-Sell**: Automatically sell specific resources when cargo full

#### 5. Engine & Fuel System 🚀
**Purpose**: Ship movement and fuel efficiency

**Base Stats**:
- Fuel Efficiency: 100% (1 fuel = 1 distance at Normal speed)
- Max Speed: Normal (Fast/Boost locked)
- Tank Capacity: 1000 fuel

**Upgrade Path**:
1. **Fuel Efficiency**: 100% → 90% → 80% → 70% → 50% → 25% consumption
2. **Unlock Fast Speed**: Enable Fast mode
3. **Unlock Boost Speed**: Enable Boost mode
4. **Tank Capacity**: 1K → 5K → 10K → 50K → 100K → 500K → 1M
5. **Regenerative Braking**: Recover 10-50% fuel when slowing down
6. **Emergency Tank**: Reserve 10% fuel, can't be consumed normally
7. **Fuel Synthesizer**: Slowly generate fuel (0.1-1/s) when stopped

#### 6. Jump Drive 🌀
**Purpose**: Warp between zones

**Base Stats**:
- Tier: 1 (can jump zones 1-3)
- Charge Time: 10s (time to warp after activating)
- Efficiency: 100% (fuel cost to activate)

**Upgrade Path**:
1. **Tier 2 Jump Drive**: Unlock zones 4-6
2. **Tier 3 Jump Drive**: Unlock zones 7-10
3. **Tier 4 Jump Drive**: Unlock zones 11-15
4. **Charge Time**: 10s → 7s → 5s → 3s → 1s → Instant
5. **Efficiency**: 100% → 90% → 75% → 50% → 25% fuel cost
6. **Emergency Jump**: Jump backwards to previous zone (expensive)
7. **Coordinate System**: Unlock secret zones via found coordinates
8. **Gate Detector**: Reveal hidden Gates to bonus zones

#### 7. Scanner & Sensors 📡
**Purpose**: Detect objects, resources, and secrets

**Base Stats**:
- Detection Range: 300px (shows objects before they appear on screen)
- Resource Info: None (can't see what's in objects)
- Artifact Detection: None

**Upgrade Path**:
1. **Detection Range**: 300 → 500 → 800 → 1200 → 2000px → Full zone
2. **Resource Scanner**: See resource type and quantity in objects
3. **Artifact Detector**: Highlight objects containing artifacts
4. **Gate Finder**: Detect hidden Gates to secret zones
5. **Value Display**: Show credit value of objects
6. **Rarity Filter**: Toggle display of common/uncommon/rare objects
7. **Predictive Path**: Show object trajectories
8. **Anomaly Sensor**: Detect special events (wormholes, merchant ships)

---

## Zone System

### Zone Structure

Each zone is a vertical scrolling area where objects drift from top to bottom. The ship is positioned at the bottom, flying upward as fuel is collected.

#### Zone Properties
- **Number**: Zone ID (1, 2, 3, ..., ?, ??)
- **Name**: Thematic name (Asteroid Belt, Debris Field, etc.)
- **Fuel Requirement**: Total fuel needed to power Jump Drive
- **Object Spawn Table**: Which objects appear and their frequencies
- **Background**: Visual theme (colors, particle effects)
- **Difficulty Multiplier**: Affects object health, spawn rate, etc.

### Base Zone Progression (Zones 1-10)

| Zone | Name | Fuel Required | Dominant Resources | New Mechanics |
|------|------|---------------|-------------------|---------------|
| 1 | Asteroid Belt | 10,000 | Stone, Carbon | Learn basics |
| 2 | Debris Field | 50,000 | Carbon, Iron | Derelicts appear |
| 3 | Ice Ring | 250,000 | Ice, Iron | Ice asteroids |
| 4 | Mining Outpost | 1,000,000 | Gold, Titanium | Trading post |
| 5 | Junk Yard | 5,000,000 | All Tier 1-3 | Huge derelicts |
| 6 | Rich Belt | 25,000,000 | Gold, Platinum | Rare resources |
| 7 | Anomaly Zone | 100,000,000 | Iridium, Dark Matter | Exotic objects |
| 8 | Deep Space | 500,000,000 | Platinum, Iridium | Sparse, valuable |
| 9 | Event Horizon | 2,500,000,000 | Dark Matter | Extreme difficulty |
| 10 | ??? | ??? | ??? | Mystery zone |

### Secret/Bonus Zones

**Access Methods**:
1. **Gates**: Rare objects that appear in normal zones, clicking opens portal
2. **Coordinates**: Find coordinate chips in derelicts, enter in Jump Drive
3. **Artifacts**: Some artifacts unlock access to hidden zones
4. **Achievements**: Completing special achievements reveals secrets

**Examples**:
- **Crystal Cavern**: 100% Ice and Platinum asteroids, limited time
- **Derelict Graveyard**: Giant ship wrecks, massive resource caches
- **Dark Matter Nebula**: Pure Dark Matter objects, very dangerous
- **Merchant Fleet**: NPCs that offer special trades (resources ↔ credits)
- **Ancient Ruins**: Artifact-rich zone, puzzle mechanics

---

## Objects & Interactions

### Object Types

#### Asteroids 🪨
**Common** (60% spawn rate)
- **Health**: 10-100 (clicks to fully mine)
- **Resources**: 5-50 resources upon destruction
- **Types**: Stone, Carbon, Iron, Ice, Gold, Platinum asteroids
- **Movement**: Slow drift downward
- **Variants**:
  - Small: 10 HP, 5-10 resources
  - Medium: 50 HP, 20-30 resources
  - Large: 100 HP, 40-50 resources
  - Rich: Same HP, 2x resources

#### Debris 🛠️
**Uncommon** (30% spawn rate)
- **Health**: 5-30 (fragile, easy to mine)
- **Resources**: 3-20 resources, mixed types
- **Types**: Ship parts, scrap metal, containers
- **Movement**: Tumbling, erratic drift
- **Variants**:
  - Scrap: Carbon, Iron
  - Containers: Random resources (loot box)
  - Fuel Tanks: Direct fuel bonus (no conversion)

#### Derelicts 🚢
**Rare** (8% spawn rate)
- **Health**: 200-1000 (takes time to fully salvage)
- **Resources**: 100-500 resources, high-tier materials
- **Types**: Escape pods, shuttles, cruisers, stations
- **Movement**: Slow drift or stationary
- **Special Drops**:
  - Credits (direct currency)
  - Coordinate chips (secret zones)
  - Blueprints (unlock upgrades early)
  - Artifacts (permanent bonuses)

#### Special Objects ⭐
**Very Rare** (2% spawn rate)
- **Gates**: Portal to secret zone (click to enter)
- **Anomalies**: Dark Matter sources, dangerous but rewarding
- **Artifacts**: One-time pickup, permanent bonus
- **Merchants**: NPC ships offering trades
- **Wormholes**: Instant warp forward in zone (skip distance)

### Object Spawning System

**Spawn Logic**:
- Objects spawn at the top of the screen (y = 0)
- Random x position (within zone bounds)
- Spawn rate increases with zone difficulty
- Spawn table determines object type distribution

**Zone 1 Example Spawn Table**:
```
Stone Asteroid (Small): 30%
Stone Asteroid (Medium): 15%
Carbon Asteroid (Small): 20%
Carbon Asteroid (Medium): 10%
Debris (Scrap): 15%
Debris (Container): 5%
Derelict (Escape Pod): 4%
Gate: 1%
```

**Dynamic Spawning**:
- Spawn rate adjusts based on ship speed (faster = more objects)
- Empty periods (no spawns) to create tension/relief
- Special events: "Asteroid Shower" (10x spawn rate for 30s)

---

## Upgrade Trees

### Purchase System
- **Currency**: Credits 💰 (from selling resources)
- **Unlock Requirements**: Some upgrades require prerequisites
  - Example: "Multi-Laser 2" requires "Multi-Laser 1"
  - Example: "Tier 2 Jump Drive" requires Zone 3 completion
- **Cost Scaling**: Each upgrade costs more than the last
- **Respec**: Cannot refund upgrades (choose wisely!)

### Upgrade Tree UI
- Tab-based navigation (Laser, Bots, Converter, Cargo, Engine, Jump Drive, Scanner)
- Visual tree showing locked/unlocked/available upgrades
- Tooltips show exact stat changes and costs
- Highlight "best value" upgrades based on current playstyle

---

## Progression Systems

### Achievements 🏆
**Purpose**: Guide player progression, reward exploration

**Categories**:
1. **Fuel Milestones**: Collect 10K, 100K, 1M, 10M, 100M fuel
2. **Resource Collection**: Mine 1K, 10K, 100K of each resource type
3. **Zone Completion**: Complete each zone, speedrun challenges
4. **Upgrades**: Purchase first upgrade in each tree, max out a tree
5. **Secrets**: Find all Gates, discover all secret zones, collect all artifacts
6. **Combat** (future): Destroy hostile objects, survive attacks

**Rewards**:
- Credits
- Fuel bonus
- Unlock special upgrades
- Cosmetic ship skins

### Prestige System 💫

**Trigger**: Player chooses to prestige OR runs out of fuel and can't progress

**On Prestige**:
1. **Keep**:
   - Nebula Crystals (prestige currency)
   - Artifacts (permanent bonuses)
   - Achievement progress
   - Unlocked secret zones
2. **Reset**:
   - Fuel, Credits, Resources
   - Ship upgrades (all modules reset to Tier 1)
   - Zone progress (back to Zone 1)
   - Prestige Cards (lose temporary bonuses)

**Nebula Crystals**:
- Formula: `NC = floor(sqrt(totalFuelEarned / 1e6))`
- Effect: +1% production per crystal (multiplicative)
- Example: 1M fuel → 1 NC (+1%), 4M fuel → 2 NC (+2%), 100M fuel → 10 NC (+10%)

**Prestige Upgrades** (spend Nebula Crystals):
- Permanent production bonuses
- Start with more fuel
- Unlock modules earlier
- Reduce upgrade costs
- Increase artifact drop rates

### Prestige Cards 🃏

**Trigger**: Complete a zone (power Jump Drive and warp)

**Mechanics**:
1. On zone completion, pause game
2. Show 3 random Prestige Cards
3. Player chooses 1 card
4. Card effect lasts for the current run (until prestige/reset)
5. Cards stack (choosing the same card multiple times increases effect)

**Card Categories**:

#### Production Cards
- **Efficient Converter**: +25% conversion efficiency
- **Speedy Bots**: +50% bot mining speed
- **Laser Focus**: +30% laser damage
- **Fuel Saver**: -20% fuel consumption

#### Economic Cards
- **Wealthy**: +50% credits from selling resources
- **Lucky Find**: +25% chance for double resources
- **Cargo Master**: +50% cargo capacity
- **Market Insider**: Resources sell for 2x credits

#### Exploration Cards
- **Scout**: +100% scanner range
- **Gate Finder**: 2x Gate spawn rate
- **Artifact Hunter**: 3x artifact drop rate
- **Fast Travel**: -50% fuel required for zone completion

#### Risk/Reward Cards
- **High Roller**: 2x resources from objects, -50% object spawn rate
- **Overclocked**: +100% production, +50% fuel consumption
- **All or Nothing**: Random resource gives 10x, others give 0.5x
- **Gambler's Dream**: 10% chance each object drops a full cargo hold

### Artifacts 🔮

**Purpose**: Rare permanent bonuses that persist through prestige

**Acquisition**:
- Random drop from Derelicts (1% chance)
- Guaranteed in specific secret zones
- Achievement rewards
- Special events

**Artifact Examples**:

| Artifact | Effect | Rarity |
|----------|--------|--------|
| Ancient Battery | +500 starting fuel after prestige | Common |
| Quantum Core | +10% to all production | Rare |
| Wormhole Stabilizer | Gates appear 2x more often | Rare |
| Dark Matter Engine | Fuel consumption -25% | Very Rare |
| Master Scanner | See all objects in zone at all times | Very Rare |
| Merchant's Token | Unlock Merchant zone | Legendary |
| Infinity Converter | Can convert Dark Matter | Legendary |
| Time Crystal | Game runs 1.5x speed | Legendary |

**Artifact Slots**:
- Start with 3 active artifact slots
- Unlock more slots with prestige upgrades (max 10)
- Can swap artifacts between runs

---

## Implementation Roadmap

### Phase 1: Core Refactor (Current → Playable Prototype)
**Goal**: Transition from static clicker to moving ship with basic resource system

#### Tasks:
1. ✅ Replace stardust → fuel terminology (COMPLETE)
2. ✅ Add zone system and progress bar (COMPLETE)
3. ✅ Create spaceship visual and move to bottom (COMPLETE)
4. ✅ Implement bottom tab navigation (COMPLETE)
5. ⏳ **Object Spawning System**
   - Create Object base component
   - Implement spawn manager (spawn objects at top of screen)
   - Add basic asteroid types (Stone, Carbon)
   - Objects drift downward and disappear at bottom
6. ⏳ **Active Mining Mechanic**
   - Click on objects to mine (reduce HP)
   - Object destruction drops resources
   - Visual feedback (laser beam, damage numbers)
7. ⏳ **Basic Resource System**
   - Add 2-3 resource types (Stone, Carbon, Iron)
   - Implement Cargo Hold (limited capacity)
   - Add Converter module (manual conversion to fuel)
8. ⏳ **Ship Movement**
   - Ship drifts upward constantly
   - Fuel consumption based on speed
   - Speed controls (Stop, Normal, Fast)
   - Out of fuel = ship stops

**Acceptance Criteria**:
- Player can click objects to mine them
- Resources are collected and stored in cargo
- Converter transforms resources → fuel
- Ship moves using fuel
- Zone progress increases as fuel is collected
- Can complete Zone 1 and warp to Zone 2

---

### Phase 2: Idle Mechanics & Credits
**Goal**: Add bot mining and credit economy

#### Tasks:
1. **Bot Bay Module**
   - Implement first bot (manual purchase with credits)
   - Bots fly to objects and mine autonomously
   - Visual bot representation (reuse MiningBot component)
   - Bots return resources to ship
2. **Credit System**
   - Add credits currency
   - "Sell Resources" button in cargo hold
   - Resources have credit values
   - Credits persist through zones
3. **First Upgrade Tree** (Laser)
   - Create Upgrades UI panel
   - Implement 3-5 laser upgrades (damage, cooldown, range)
   - Purchase with credits
   - Upgrades persist through zones (reset on prestige)
4. **Cargo Management**
   - Cargo full warning
   - Auto-sell toggle
   - Resource priority (which to keep/sell first)

**Acceptance Criteria**:
- Bots autonomously mine objects
- Player can sell resources for credits
- Can purchase laser upgrades
- Upgrades have visible effect on gameplay
- Cargo management feels smooth

---

### Phase 3: Expanded Modules & Zones
**Goal**: Full upgrade tree system and 5-6 zones

#### Tasks:
1. **Complete Upgrade Trees**
   - Bot Bay (6-8 upgrades)
   - Converter (6-8 upgrades)
   - Cargo Hold (5-7 upgrades)
   - Engine (6-8 upgrades)
   - Jump Drive (5-7 upgrades)
   - Scanner (6-8 upgrades)
2. **Zone Expansion**
   - Create Zones 2-6 with unique spawn tables
   - Zone-specific backgrounds/visuals
   - Increase difficulty per zone
3. **New Object Types**
   - Debris (fragile, mixed resources)
   - Derelicts (high HP, valuable)
   - Ice asteroids, Iron asteroids, Gold asteroids
4. **Resource Tier System**
   - Add Tier 2 resources (Ice, Iron)
   - Add Tier 3 resources (Gold, Titanium)
   - Unlock via Converter upgrades

**Acceptance Criteria**:
- All 7 module upgrade trees functional
- 6 zones playable with distinct feel
- Multiple resource types with different values
- Progression curve feels balanced

---

### Phase 4: Prestige & Progression
**Goal**: Long-term progression loop

#### Tasks:
1. **Nebula Crystals**
   - Calculate NC based on total fuel earned
   - "Prestige" button in menu
   - Prestige confirmation modal
   - Reset game state, keep NC
2. **Prestige Upgrades**
   - Create Prestige Upgrade panel
   - 10-15 permanent upgrades (spend NC)
   - Production bonuses, starting fuel, unlock shortcuts
3. **Prestige Cards**
   - Card selection UI (choose 1 of 3)
   - Trigger on zone completion
   - 20-30 different cards
   - Card effects applied to current run
4. **Achievements**
   - Achievement system (unlock conditions)
   - Achievement panel UI
   - Rewards (credits, fuel, unlocks)
   - 30-50 achievements

**Acceptance Criteria**:
- Prestige system functional and rewarding
- Prestige cards add strategic depth
- Achievements guide player progression
- Second prestige run is notably faster

---

### Phase 5: Artifacts & Secrets
**Goal**: Rare collectibles and hidden content

#### Tasks:
1. **Artifact System**
   - Artifact data structure and definitions
   - Artifact drops from Derelicts
   - Artifact inventory UI
   - Artifact slot system (equip/unequip)
   - 15-20 artifacts with unique effects
2. **Secret Zones**
   - Gate objects (spawn in normal zones)
   - Gate click → warp to secret zone
   - 3-5 secret zones with unique rewards
   - Coordinate system (find coordinates, enter in Jump Drive)
3. **Special Objects**
   - Anomalies (dangerous, high reward)
   - Merchants (trade interface)
   - Wormholes (skip forward)
   - Event objects (limited-time)

**Acceptance Criteria**:
- Players can discover and collect artifacts
- Secret zones are discoverable and rewarding
- Special objects add variety to gameplay
- Exploration feels rewarding

---

### Phase 6: Polish & Balance
**Goal**: Smooth gameplay experience

#### Tasks:
1. **Visual Polish**
   - Particle effects (explosions, resource pickups)
   - Smooth animations (object destruction, bot mining)
   - UI animations (panel transitions, number count-ups)
   - Zone-specific backgrounds and themes
2. **Audio** (optional)
   - Sound effects (laser fire, object destruction, purchases)
   - Background music (zone-specific tracks)
   - Volume controls
3. **Balance Pass**
   - Adjust upgrade costs
   - Tune zone fuel requirements
   - Resource conversion rates
   - Object spawn rates
   - Prestige card power levels
4. **Tutorial & Onboarding**
   - First-time player tutorial
   - Tooltips and help text
   - Key binding reference
   - "How to Play" panel
5. **Performance Optimization**
   - Object pooling (reuse destroyed objects)
   - Reduce re-renders
   - Optimize particle systems
   - Lazy load zone data

**Acceptance Criteria**:
- Game runs at 60 FPS with 50+ objects on screen
- New players understand core mechanics within 5 minutes
- Progression feels smooth and rewarding
- No major balance issues or exploits

---

### Phase 7: Advanced Features (Post-Launch)
**Goal**: Long-term content and replayability

#### Tasks:
1. **Challenge Modes**
   - Daily challenges with special rules
   - Leaderboards (fastest zone completion, highest fuel/run)
   - Hardcore mode (permadeath, no prestige)
2. **Combat System**
   - Hostile objects (pirates, drones)
   - Ship HP and shields
   - Weapon upgrades (separate from mining laser)
   - Boss fights (zone guardians)
3. **Multiplayer** (optional)
   - Compare progress with friends
   - Trade resources/artifacts
   - Co-op zones (shared objects)
4. **Endless Mode**
   - Procedural zone generation
   - Infinite progression
   - Unique rewards past Zone 10
5. **Cosmetics**
   - Ship skins (unlock via achievements)
   - Laser colors
   - Bot appearances
   - Particle effects

---

## Technical Considerations

### State Management
- Expand GameState to include:
  - `resources: Record<ResourceType, number>` (cargo)
  - `credits: number`
  - `moduleUpgrades: Record<ModuleType, string[]>` (purchased upgrades)
  - `artifacts: string[]` (collected artifacts)
  - `equippedArtifacts: string[]` (active artifacts)
  - `prestigeCards: string[]` (active cards this run)
  - `objects: Object[]` (on-screen objects)

### Performance
- Object pooling: Reuse destroyed objects instead of creating new ones
- Virtual scrolling: Only render objects near the ship
- Debounce resource calculations: Don't recalculate every frame
- Web Workers: Offload heavy calculations (pathfinding, spawn logic)

### Save System
- Save all new state properties
- Version migration for new save formats
- Cloud save support (future)

### Accessibility
- Keyboard controls (WASD for speed, spacebar to fire laser)
- Screen reader support for all UI
- Colorblind mode (adjust resource colors)
- Reduce motion option

---

## Success Metrics

### Engagement
- **Session Length**: Average 20-40 minutes per session
- **Return Rate**: 60%+ players return within 24 hours
- **Prestige Rate**: 80%+ players prestige at least once
- **Zone Completion**: 50%+ players reach Zone 5

### Balance
- **Zone 1 Completion**: 10-20 minutes for new players
- **First Prestige**: 45-90 minutes of play
- **Second Prestige**: 30-50% faster than first
- **Zone 5 Completion**: 4-6 hours of total play

### Retention
- **Day 1**: 70%+ return
- **Day 7**: 40%+ return
- **Day 30**: 15%+ return

---

## Conclusion

This design transforms Cosmic Clicker from a simple incremental clicker into a deep, strategic space journey game. The combination of active mining, resource management, upgrade trees, and prestige systems creates a compelling long-term gameplay loop.

**Core Pillars**:
1. **Active + Idle**: Engage players with clicking while bots provide passive income
2. **Strategic Depth**: Upgrade choices meaningfully impact playstyle
3. **Discovery**: Secrets, artifacts, and prestige cards reward exploration
4. **Progression**: Clear goals (zone completion) with satisfying long-term growth

**Next Steps**:
Begin Phase 1 implementation, focusing on object spawning and active mining mechanics. This will establish the core gameplay feel before expanding into idle mechanics and complex systems.
