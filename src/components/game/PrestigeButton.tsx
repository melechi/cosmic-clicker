import React from 'react';
import { Button } from '@/components/ui/Button';
import { Tooltip } from '@/components/ui/Tooltip';
import { formatNumber } from '@/utils/formatting/numberFormat';

export interface PrestigeButtonProps {
  canPrestige: boolean;
  crystalsToGain: number;
  onPrestige: () => void;
  disabled?: boolean;
}

/**
 * Button to perform prestige action
 */
export const PrestigeButton: React.FC<PrestigeButtonProps> = ({
  canPrestige,
  crystalsToGain,
  onPrestige,
  disabled = false,
}) => {
  const tooltipContent = canPrestige
    ? `Reset your progress to gain ${formatNumber(crystalsToGain)} Nebula Crystals`
    : 'You need at least 1M total fuel to prestige';

  return (
    <Tooltip content={tooltipContent}>
      <Button
        variant={canPrestige ? 'success' : 'secondary'}
        size="large"
        fullWidth
        onClick={onPrestige}
        disabled={!canPrestige || disabled}
        aria-label={
          canPrestige
            ? `Prestige to gain ${formatNumber(crystalsToGain)} Nebula Crystals`
            : 'Prestige not available yet'
        }
        className={canPrestige ? 'animate-pulse' : ''}
      >
        <div className="flex flex-col items-center py-2">
          <span className="text-3xl mb-2">💫</span>
          <span className="text-xl font-bold">PRESTIGE</span>
          {canPrestige ? (
            <span className="text-sm mt-1">
              Gain {formatNumber(crystalsToGain)} Nebula Crystals
            </span>
          ) : (
            <span className="text-sm mt-1 opacity-75">Not available yet</span>
          )}
        </div>
      </Button>
    </Tooltip>
  );
};
