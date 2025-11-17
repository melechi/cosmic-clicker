import React from 'react';
import type { ResourceType } from '@/types';
import { RESOURCES } from '@/constants/resources';
import { Button } from '@/components/ui/Button';

interface ResourcePriorityListProps {
  /** Current priority order (highest priority first) */
  priority: ResourceType[];
  /** Callback when priority changes */
  onPriorityChange: (newPriority: ResourceType[]) => void;
  /** Optional className for styling */
  className?: string;
}

/**
 * Resource Priority List Component
 * Allows users to reorder resources to control which are kept/sold during auto-sell
 */
export const ResourcePriorityList: React.FC<ResourcePriorityListProps> = ({
  priority,
  onPriorityChange,
  className = '',
}) => {
  const moveUp = (index: number) => {
    if (index === 0) return; // Already at top
    const newPriority = [...priority];
    [newPriority[index - 1], newPriority[index]] = [newPriority[index], newPriority[index - 1]];
    onPriorityChange(newPriority);
  };

  const moveDown = (index: number) => {
    if (index === priority.length - 1) return; // Already at bottom
    const newPriority = [...priority];
    [newPriority[index], newPriority[index + 1]] = [newPriority[index + 1], newPriority[index]];
    onPriorityChange(newPriority);
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="text-xs text-gray-400 mb-3">
        <p className="mb-1">
          <strong>Priority Order:</strong> Higher priority resources are kept, lower priority sold
          first.
        </p>
        <p className="text-gray-500">
          When cargo is full with auto-sell enabled, the lowest priority resources are sold
          automatically.
        </p>
      </div>

      <div className="space-y-1">
        {priority.map((resourceType, index) => {
          const resource = RESOURCES.find((r) => r.id === resourceType);
          if (!resource) return null;

          return (
            <div
              key={resourceType}
              className="flex items-center gap-2 bg-gray-800 p-2 rounded border border-gray-700"
            >
              {/* Priority number */}
              <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-gray-700 rounded font-semibold text-sm">
                {index + 1}
              </div>

              {/* Resource info */}
              <div className="flex-1 flex items-center gap-2">
                <span className="text-lg">{resource.icon}</span>
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-200">{resource.name}</div>
                  <div className="text-xs text-gray-500">
                    Tier {resource.tier} • {resource.rarity}
                  </div>
                </div>
              </div>

              {/* Move buttons */}
              <div className="flex flex-col gap-1">
                <Button
                  size="small"
                  variant="secondary"
                  onClick={() => moveUp(index)}
                  disabled={index === 0}
                  className="!px-2 !py-1 text-xs"
                  aria-label={`Move ${resource.name} up`}
                >
                  ↑
                </Button>
                <Button
                  size="small"
                  variant="secondary"
                  onClick={() => moveDown(index)}
                  disabled={index === priority.length - 1}
                  className="!px-2 !py-1 text-xs"
                  aria-label={`Move ${resource.name} down`}
                >
                  ↓
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
