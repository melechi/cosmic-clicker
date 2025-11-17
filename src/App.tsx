import { useState, useEffect, useRef } from 'react';
import { GameProvider, useGame } from '@/context';
import { ToastProvider } from '@/context/ToastContext';
import { actions } from '@/context/actions';
import { useGameLoop } from '@/hooks/useGameLoop';
import { useToast } from '@/hooks/useToast';
import { MainLayout } from '@/components/layout';
import type { SidebarTab } from '@/components/layout';
import {
  Clicker,
  BuildingList,
  UpgradesPanel,
  AchievementsPanel,
  Statistics,
  PrestigePanel,
  Settings,
  ZoneProgressBar,
  DebugPanel,
} from '@/components/game';
import { BackgroundParticles } from '@/components/effects';
import { Modal } from '@/components/ui/Modal';
import { loadGame, saveGame } from '@/utils/saveLoad/saveManager';
import { getOfflineProgressInfo, shouldShowOfflinePopup } from '@/utils/saveLoad/offlineProgress';
import { formatNumber } from '@/utils/formatting/numberFormat';
import {
  ACHIEVEMENTS,
  BUILDINGS,
  CLICK_UPGRADES,
  PRODUCTION_UPGRADES,
  AUTO_CLICK_UPGRADES,
  PRESTIGE_UPGRADES,
  GAME_CONFIG,
  getFuelRequiredForZone,
  canWarpToNextZone,
} from '@/constants';
import {
  calculateBuildingCost,
  calculatePrestigeReward,
} from '@/utils/gameLogic/calculations';

/**
 * Main game content component
 * Contains all game logic and UI
 */
function GameContent() {
  const { state, dispatch } = useGame();
  const toast = useToast();
  const [activeTab, setActiveTab] = useState<SidebarTab>('buildings');
  const [showOfflineModal, setShowOfflineModal] = useState(false);
  const [offlineProgress, setOfflineProgress] = useState({
    stardustEarned: 0,
    timeAway: 0,
    timeAwayDisplay: '',
    wasCapped: false,
  });
  const [hasLoaded, setHasLoaded] = useState(false);
  const hasLoadedRef = useRef(false);

  // Start game loop
  useGameLoop();

  // Load saved game on mount and handle offline progress
  useEffect(() => {
    // Prevent double-loading in React StrictMode
    if (hasLoadedRef.current) {
      console.log('⏭️ Skipping duplicate load (StrictMode)');
      return;
    }
    hasLoadedRef.current = true;

    const savedState = loadGame();
    console.log('📁 Loading game from localStorage:', savedState ? 'Found save data' : 'No save found');

    if (savedState) {
      // Load the saved state FIRST
      dispatch(actions.loadSave(savedState));
      console.log('✅ Game state loaded:', {
        fuel: savedState.fuel,
        buildings: savedState.buildings
      });

      const now = Date.now();
      const lastSave = savedState.lastSaveTime || now;

      // Check if we should show offline popup
      if (shouldShowOfflinePopup(lastSave, now)) {
        // Calculate offline progress
        const offlineInfo = getOfflineProgressInfo(
          lastSave,
          now,
          savedState.productionPerSecond
        );

        if (offlineInfo.stardustEarned > 0) {
          setOfflineProgress(offlineInfo);
          setShowOfflineModal(true);

          // Apply offline progress AFTER loading
          dispatch(
            actions.applyOfflineProgress(
              offlineInfo.stardustEarned,
              offlineInfo.timeAway
            )
          );
        }
      }

      toast.success('Game loaded!');
    } else {
      console.log('🆕 Starting new game');
    }

    setHasLoaded(true);
  }, [dispatch, toast]);

  // Auto-save every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      try {
        saveGame(state);
      } catch (error) {
        toast.error('Failed to auto-save game');
        console.error('Auto-save error:', error);
      }
    }, GAME_CONFIG.AUTO_SAVE_INTERVAL);

    return () => clearInterval(interval);
  }, [state, toast]);

  // Save on meaningful state changes (not every tick)
  // Track only the values that matter for saving
  useEffect(() => {
    // Skip until game is loaded
    if (!hasLoaded) {
      return;
    }

    console.log('🎯 Important state changed! Scheduling save...');

    // Longer debounce to survive multiple rapid changes
    const timeoutId = setTimeout(() => {
      try {
        console.log('💾 Saving game now...', {
          fuel: Math.floor(state.fuel),
          buildings: state.buildings,
          totalStardust: Math.floor(state.totalStardustEarned)
        });

        saveGame(state);

        console.log('✅ Game saved to localStorage');

        // Verify it was saved
        const saved = localStorage.getItem('cosmicClicker_save');
        if (saved) {
          const parsed = JSON.parse(saved);
          console.log('✅ Verified in localStorage:', {
            buildings: parsed.gameState.buildings,
            fuel: Math.floor(parsed.gameState.fuel)
          });
        } else {
          console.error('❌ Nothing in localStorage after save!');
        }
      } catch (error) {
        console.error('❌ Failed to save game:', error);
      }
    }, 2000); // 2 second debounce

    return () => clearTimeout(timeoutId);
  }, [
    // Only track meaningful changes, not continuous production
    state.buildings,
    state.upgrades,
    state.achievements,
    state.nebulaCrystals,
    state.statistics.totalClicks,
    state.statistics.buildingsPurchased,
    state.statistics.upgradesPurchased,
    hasLoaded
  ]);

  // Check achievements periodically
  useEffect(() => {
    const checkAchievements = () => {
      ACHIEVEMENTS.forEach((achievement) => {
        // Skip if already unlocked
        if (state.achievements.includes(achievement.id)) return;

        let shouldUnlock = false;

        // Check different achievement conditions
        switch (achievement.condition) {
          case 'totalClicks':
            shouldUnlock = state.statistics.totalClicks >= achievement.threshold;
            break;
          case 'totalStardustEarned':
            shouldUnlock = state.totalStardustEarned >= achievement.threshold;
            break;
          case 'buildingCount':
            if (achievement.buildingId) {
              const count = state.buildings[achievement.buildingId] || 0;
              shouldUnlock = count >= achievement.threshold;
            }
            break;
          case 'totalPrestiges':
            shouldUnlock = state.statistics.totalPrestiges >= achievement.threshold;
            break;
          case 'totalNebulaCrystals':
            shouldUnlock = state.nebulaCrystals >= achievement.threshold;
            break;
        }

        // Unlock achievement if condition met
        if (shouldUnlock) {
          dispatch(actions.unlockAchievement(achievement.id));
          toast.success(`Achievement unlocked: ${achievement.name}!`, {
            duration: 5000,
          });
        }
      });
    };

    // Check immediately on mount
    checkAchievements();

    // Then check every 5 seconds
    const interval = setInterval(checkAchievements, 5000);

    return () => clearInterval(interval);
  }, [state, dispatch, toast]);

  // Handle clicking
  const handleClick = () => {
    dispatch(actions.click());
  };

  // Handle closing offline modal
  const handleCloseOfflineModal = () => {
    setShowOfflineModal(false);
  };

  // Calculate building costs
  const buildingCosts: Record<string, number> = {};
  const buildingProduction: Record<string, number> = {};
  BUILDINGS.forEach((building) => {
    const owned = state.buildings[building.id] || 0;
    buildingCosts[building.id] = calculateBuildingCost(
      building.baseCost,
      building.costMultiplier,
      owned
    );
    buildingProduction[building.id] = building.production * owned;
  });

  // Calculate prestige info
  const crystalsToGain = calculatePrestigeReward(state.totalStardustEarned, 0);
  const canPrestige = crystalsToGain > 0;
  const prestigeBonus = state.nebulaCrystals * GAME_CONFIG.NEBULA_CRYSTAL_BONUS;

  // Get achievement progress
  const getAchievementProgress = (achievementId: string): number => {
    const achievement = ACHIEVEMENTS.find((a) => a.id === achievementId);
    if (!achievement) return 0;

    let current = 0;
    switch (achievement.condition) {
      case 'totalClicks':
        current = state.statistics.totalClicks;
        break;
      case 'totalStardustEarned':
        current = state.totalStardustEarned;
        break;
      case 'buildingCount':
        if (achievement.buildingId) {
          current = state.buildings[achievement.buildingId] || 0;
        }
        break;
      case 'totalPrestiges':
        current = state.statistics.totalPrestiges;
        break;
      case 'totalNebulaCrystals':
        current = state.nebulaCrystals;
        break;
    }

    return Math.min((current / achievement.threshold) * 100, 100);
  };

  // Render content based on active tab
  const renderContent = () => {
    switch (activeTab) {
      case 'buildings':
        return (
          <BuildingList
            buildings={BUILDINGS}
            ownedCounts={state.buildings}
            currentCosts={buildingCosts}
            stardust={state.fuel}
            onPurchase={(buildingId) => dispatch(actions.buyBuilding(buildingId, 1))}
            productionByBuilding={buildingProduction}
          />
        );
      case 'upgrades':
        return (
          <UpgradesPanel
            clickUpgrades={CLICK_UPGRADES}
            productionUpgrades={PRODUCTION_UPGRADES}
            autoClickUpgrades={AUTO_CLICK_UPGRADES}
            prestigeUpgrades={PRESTIGE_UPGRADES}
            purchasedUpgrades={new Set(state.upgrades)}
            stardust={state.fuel}
            onPurchase={(upgradeId) => dispatch(actions.buyUpgrade(upgradeId))}
          />
        );
      case 'achievements':
        return (
          <AchievementsPanel
            achievements={ACHIEVEMENTS}
            unlockedAchievements={new Set(state.achievements)}
            getAchievementProgress={getAchievementProgress}
          />
        );
      case 'prestige':
        return (
          <PrestigePanel
            totalStardustEarned={state.totalStardustEarned}
            currentNebulaCrystals={state.nebulaCrystals}
            crystalsToGain={crystalsToGain}
            canPrestige={canPrestige}
            productionBonus={prestigeBonus}
            onPrestige={() => dispatch(actions.prestige())}
          />
        );
      case 'statistics':
        return <Statistics statistics={state.statistics} />;
      case 'settings':
        return <Settings isOpen={true} onClose={() => setActiveTab('buildings')} />;
      default:
        return (
          <BuildingList
            buildings={BUILDINGS}
            ownedCounts={state.buildings}
            currentCosts={buildingCosts}
            stardust={state.fuel}
            onPurchase={(buildingId) => dispatch(actions.buyBuilding(buildingId, 1))}
            productionByBuilding={buildingProduction}
          />
        );
    }
  };

  return (
    <>
      {/* Background effects */}
      <BackgroundParticles />

      {/* Main layout */}
      <MainLayout
        headerProps={{
          fuel: state.fuel,
          productionPerSecond: state.productionPerSecond,
          nebulaCrystals: state.nebulaCrystals,
          clickPower: state.clickPower,
        }}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      >
        {/* Main layout with fixed right sidebar */}
        <div className="flex flex-col lg:flex-row h-full relative">
          {/* Main content area */}
          <div className="flex-1 flex flex-col relative min-h-[calc(100vh-200px)]">
            {/* Game view area - spaceship will be at bottom */}
            <div className="flex-1 relative">
              {/* This is where zone backgrounds, asteroids, etc will go */}
            </div>

            {/* Spaceship at bottom center */}
            <div className="flex items-end justify-center pb-8">
              <Clicker
                onClick={handleClick}
                clickPower={state.clickPower}
                spaceMinerCount={state.buildings['spaceMiner'] || 0}
              />
            </div>
          </div>

          {/* Zone Progress Bar - Fixed right sidebar */}
          <div className="lg:w-80 lg:sticky lg:top-0 lg:h-screen lg:overflow-y-auto p-4 bg-gray-950">
            <ZoneProgressBar
              currentZone={state.currentZone}
              currentFuel={state.zoneProgress}
              fuelRequired={getFuelRequiredForZone(state.currentZone)}
              onWarpToNextZone={() => dispatch(actions.warpToNextZone())}
            />
          </div>
        </div>

        {/* Bottom tabs for content */}
        <div className="fixed bottom-0 left-0 right-0 lg:right-80 bg-gray-900 border-t border-gray-700 z-40">
          <div className="flex justify-around items-center p-2">
            <button
              onClick={() => setActiveTab(activeTab === 'buildings' ? 'buildings' : 'buildings')}
              className="flex-1 px-4 py-3 text-sm font-semibold text-white hover:bg-gray-800 rounded transition-colors"
            >
              📦 Modules
            </button>
            <button
              onClick={() => setActiveTab(activeTab === 'upgrades' ? 'buildings' : 'upgrades')}
              className="flex-1 px-4 py-3 text-sm font-semibold text-white hover:bg-gray-800 rounded transition-colors"
            >
              ⚡ Upgrades
            </button>
            <button
              onClick={() => setActiveTab(activeTab === 'achievements' ? 'buildings' : 'achievements')}
              className="flex-1 px-4 py-3 text-sm font-semibold text-white hover:bg-gray-800 rounded transition-colors"
            >
              🏆 Achievements
            </button>
            <button
              onClick={() => setActiveTab(activeTab === 'statistics' ? 'buildings' : 'statistics')}
              className="flex-1 px-4 py-3 text-sm font-semibold text-white hover:bg-gray-800 rounded transition-colors"
            >
              📊 Stats
            </button>
          </div>

          {/* Content panel - slides up when tab active */}
          {activeTab !== 'buildings' && (
            <div className="max-h-96 overflow-y-auto bg-gray-800 p-4 border-t border-gray-700">
              {renderContent()}
            </div>
          )}
        </div>
      </MainLayout>

      {/* Debug Panel */}
      <DebugPanel
        onAddFuel={(amount) => dispatch(actions.addFuel(amount))}
        onSetZone={(zone) => dispatch(actions.setZone(zone))}
        onAddBuilding={(buildingId, quantity) => {
          for (let i = 0; i < quantity; i++) {
            dispatch(actions.buyBuilding(buildingId, 1));
          }
        }}
        onResetGame={() => dispatch(actions.hardReset())}
        currentFuel={state.fuel}
        currentZone={state.currentZone}
      />

      {/* Offline progress modal */}
      <Modal
        isOpen={showOfflineModal}
        onClose={handleCloseOfflineModal}
        title="Welcome Back!"
        size="medium"
      >
        <div className="text-center space-y-4">
          <div className="text-6xl">💫</div>
          <h3 className="text-2xl font-bold text-gray-900">
            While you were away...
          </h3>
          <p className="text-gray-600">
            You were gone for <strong>{offlineProgress.timeAwayDisplay}</strong>
          </p>
          <div className="bg-purple-100 rounded-lg p-6 space-y-2">
            <p className="text-sm text-purple-600 font-medium">
              Stardust Earned:
            </p>
            <p className="text-4xl font-bold text-purple-700">
              {formatNumber(offlineProgress.stardustEarned)}
            </p>
          </div>
          {offlineProgress.wasCapped && (
            <p className="text-sm text-orange-600">
              Offline progress is capped at {GAME_CONFIG.MAX_OFFLINE_HOURS} hours
            </p>
          )}
          <button
            onClick={handleCloseOfflineModal}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            Continue Playing
          </button>
        </div>
      </Modal>
    </>
  );
}

/**
 * Root App component with providers
 */
function App() {
  return (
    <ToastProvider position="top-right" maxToasts={5}>
      <GameProvider>
        <GameContent />
      </GameProvider>
    </ToastProvider>
  );
}

export default App;
