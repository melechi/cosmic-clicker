import React from 'react';
import { Card } from '@/components/ui/Card';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { PrestigeButton } from './PrestigeButton';
import { formatNumber } from '@/utils/formatting/numberFormat';

export interface PrestigePanelProps {
  totalStardustEarned: number;
  currentNebulaCrystals: number;
  crystalsToGain: number;
  canPrestige: boolean;
  productionBonus: number;
  onPrestige: () => void;
}

/**
 * Panel explaining prestige system with confirmation modal
 */
export const PrestigePanel: React.FC<PrestigePanelProps> = ({
  totalStardustEarned,
  currentNebulaCrystals,
  crystalsToGain,
  canPrestige,
  productionBonus,
  onPrestige,
}) => {
  const [showConfirmation, setShowConfirmation] = React.useState(false);

  const handlePrestigeClick = () => {
    if (canPrestige) {
      setShowConfirmation(true);
    }
  };

  const handleConfirm = () => {
    setShowConfirmation(false);
    onPrestige();
  };

  const handleCancel = () => {
    setShowConfirmation(false);
  };

  const minStardustRequired = 1000000;
  const progressToPrestige = Math.min((totalStardustEarned / minStardustRequired) * 100, 100);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="mb-4">
        <h2 className="text-2xl font-bold text-white mb-2">Prestige</h2>
        <p className="text-gray-400 text-sm">
          Reset your progress to gain powerful Nebula Crystals for permanent bonuses
        </p>
      </div>

      {/* Current Status */}
      <Card title="Current Status" className="p-4">
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Nebula Crystals</span>
            <span className="text-purple-400 font-bold text-xl">
              {formatNumber(currentNebulaCrystals)}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Production Bonus</span>
            <span className="text-green-400 font-semibold">+{productionBonus}%</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Total Stardust Earned</span>
            <span className="text-blue-400 font-semibold">
              {formatNumber(totalStardustEarned)}
            </span>
          </div>
        </div>
      </Card>

      {/* How Prestige Works */}
      <Card title="How Prestige Works" className="p-4">
        <ul className="space-y-2 text-sm text-gray-300">
          <li className="flex items-start gap-2">
            <span className="text-purple-400 mt-0.5">•</span>
            <span>
              Prestige resets all your buildings, upgrades, and stardust (except Nebula Crystals)
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-purple-400 mt-0.5">•</span>
            <span>
              You gain Nebula Crystals based on your total stardust earned:{' '}
              <code className="text-blue-400">floor(sqrt(totalStardust / 1M))</code>
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-purple-400 mt-0.5">•</span>
            <span>Each Nebula Crystal provides a permanent +1% production bonus</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-purple-400 mt-0.5">•</span>
            <span>Minimum requirement: 1M total stardust earned</span>
          </li>
        </ul>
      </Card>

      {/* Progress to Prestige */}
      {!canPrestige && (
        <Card title="Progress to Prestige" className="p-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-400">
              <span>Total Stardust Earned</span>
              <span>
                {formatNumber(totalStardustEarned)} / {formatNumber(minStardustRequired)}
              </span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div
                className="bg-purple-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progressToPrestige}%` }}
                role="progressbar"
                aria-valuenow={progressToPrestige}
                aria-valuemin={0}
                aria-valuemax={100}
              />
            </div>
            <p className="text-xs text-gray-500 mt-2">
              You need {formatNumber(minStardustRequired - totalStardustEarned)} more total stardust
              to unlock prestige
            </p>
          </div>
        </Card>
      )}

      {/* Prestige Button */}
      <PrestigeButton
        canPrestige={canPrestige}
        crystalsToGain={crystalsToGain}
        onPrestige={handlePrestigeClick}
      />

      {/* Confirmation Modal */}
      <Modal
        isOpen={showConfirmation}
        onClose={handleCancel}
        title="Confirm Prestige"
      >
        <div className="space-y-4">
          <p className="text-gray-300">
            Are you sure you want to prestige? This will reset all your progress except Nebula
            Crystals.
          </p>

          <div className="bg-purple-900/30 border border-purple-500/50 rounded-lg p-4">
            <div className="text-center">
              <div className="text-sm text-gray-400 mb-1">You will gain</div>
              <div className="text-3xl font-bold text-purple-400">
                +{formatNumber(crystalsToGain)} Nebula Crystals
              </div>
              <div className="text-sm text-gray-400 mt-1">
                (+{crystalsToGain}% production bonus)
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <Button variant="secondary" fullWidth onClick={handleCancel}>
              Cancel
            </Button>
            <Button variant="success" fullWidth onClick={handleConfirm}>
              Prestige
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
