import { useState, useEffect } from 'react';
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

  // Start game loop
  useGameLoop();

  // Load saved game on mount and handle offline progress
  useEffect(() => {
    const savedState = loadGame();
    if (savedState) {
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

          // Apply offline progress
          dispatch(
            actions.applyOfflineProgress(
              offlineInfo.stardustEarned,
              offlineInfo.timeAway
            )
          );
        }
      }

      // Load the saved state
      dispatch(actions.loadSave(savedState));

      toast.success('Game loaded successfully!');
    }
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
            stardust={state.stardust}
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
            stardust={state.stardust}
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
            stardust={state.stardust}
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
          stardust: state.stardust,
          productionPerSecond: state.productionPerSecond,
          nebulaCrystals: state.nebulaCrystals,
          clickPower: state.clickPower,
        }}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Clicker section */}
          <div className="flex items-center justify-center">
            <Clicker onClick={handleClick} clickPower={state.clickPower} />
          </div>

          {/* Content panel */}
          <div className="flex flex-col">{renderContent()}</div>
        </div>
      </MainLayout>

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
