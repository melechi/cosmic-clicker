import React, { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { useGame } from '@/context/GameContext';
import { useToast } from '@/hooks/useToast';
import {
  loadSettings,
  saveSettings,
  type GameSettings,
} from '@/utils/settingsManager';
import {
  exportSave,
  importSave,
  deleteSave,
  getLastSaveTime,
} from '@/utils/saveLoad/saveManager';

export interface SettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

type TabType = 'preferences' | 'saveload' | 'about';

/**
 * Settings component
 *
 * Provides user preferences, save/load management, and game information.
 * Features three tabs: Preferences, Save/Load, and About.
 */
export const Settings: React.FC<SettingsProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<TabType>('preferences');
  const [settings, setSettings] = useState<GameSettings>(loadSettings());
  const [confirmReset, setConfirmReset] = useState(false);
  const [lastSaveTime, setLastSaveTime] = useState<number | null>(null);
  const { state, dispatch } = useGame();
  const toast = useToast();

  // Update last save time when modal opens
  useEffect(() => {
    if (isOpen) {
      setLastSaveTime(getLastSaveTime());
    }
  }, [isOpen]);

  // Update last save time periodically
  useEffect(() => {
    if (!isOpen) return;

    const interval = setInterval(() => {
      setLastSaveTime(getLastSaveTime());
    }, 1000);

    return () => clearInterval(interval);
  }, [isOpen]);

  const handleSettingChange = <K extends keyof GameSettings>(
    key: K,
    value: GameSettings[K]
  ) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    saveSettings(newSettings);

    // Apply settings immediately if needed
    if (key === 'reduceMotion') {
      // Could dispatch an action to update animations
      console.log('Reduce motion setting changed:', value);
    }
  };

  const handleExport = () => {
    try {
      const saveData = exportSave(state);
      const blob = new Blob([saveData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `cosmic-clicker-save-${Date.now()}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast.success('Save exported successfully!');
    } catch (error) {
      toast.error('Failed to export save');
      console.error('Export error:', error);
    }
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const result = importSave(content);

        if (result.success && result.gameState) {
          dispatch({ type: 'LOAD_SAVE', payload: result.gameState });
          toast.success('Save imported successfully!');
          onClose();
        } else {
          toast.error(`Failed to import save: ${result.error || 'Unknown error'}`);
        }
      } catch (error) {
        toast.error('Invalid save file');
        console.error('Import error:', error);
      }
    };

    reader.onerror = () => {
      toast.error('Failed to read file');
    };

    reader.readAsText(file);

    // Reset input so the same file can be selected again
    event.target.value = '';
  };

  const handleHardReset = () => {
    try {
      deleteSave();
      dispatch({ type: 'HARD_RESET' });
      setConfirmReset(false);
      toast.success('Game reset successfully!');
      onClose();
      // Optional: reload page to fully reset state
      // window.location.reload();
    } catch (error) {
      toast.error('Failed to reset game');
      console.error('Reset error:', error);
    }
  };

  const formatLastSaveTime = () => {
    if (!lastSaveTime) return 'Never';

    const now = Date.now();
    const diff = Math.floor((now - lastSaveTime) / 1000);

    if (diff < 60) return `${diff} seconds ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
    return `${Math.floor(diff / 86400)} days ago`;
  };

  return (
    <>
      <Modal isOpen={isOpen && !confirmReset} onClose={onClose} title="Settings">
        {/* Tabs */}
        <div className="flex border-b border-gray-200 mb-4">
          <button
            onClick={() => setActiveTab('preferences')}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === 'preferences'
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Preferences
          </button>
          <button
            onClick={() => setActiveTab('saveload')}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === 'saveload'
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Save/Load
          </button>
          <button
            onClick={() => setActiveTab('about')}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === 'about'
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            About
          </button>
        </div>

        {/* Tab content */}
        {activeTab === 'preferences' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Preferences
            </h3>

            {/* Auto-save */}
            <div className="space-y-2">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={settings.autoSaveEnabled}
                  onChange={(e) =>
                    handleSettingChange('autoSaveEnabled', e.target.checked)
                  }
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-gray-700">Enable auto-save</span>
              </label>

              {settings.autoSaveEnabled && (
                <div className="ml-6">
                  <label className="flex items-center space-x-2">
                    <span className="text-gray-700">Auto-save interval:</span>
                    <select
                      value={settings.autoSaveInterval}
                      onChange={(e) =>
                        handleSettingChange(
                          'autoSaveInterval',
                          Number(e.target.value)
                        )
                      }
                      className="rounded border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value={15}>15 seconds</option>
                      <option value={30}>30 seconds</option>
                      <option value={60}>60 seconds</option>
                    </select>
                  </label>
                </div>
              )}
            </div>

            {/* Animations */}
            <div className="space-y-2">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={settings.showParticles}
                  onChange={(e) =>
                    handleSettingChange('showParticles', e.target.checked)
                  }
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-gray-700">Show particle effects</span>
              </label>

              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={settings.reduceMotion}
                  onChange={(e) =>
                    handleSettingChange('reduceMotion', e.target.checked)
                  }
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-gray-700">Reduce motion</span>
              </label>
            </div>

            {/* Number notation */}
            <div>
              <label className="flex items-center space-x-2">
                <span className="text-gray-700">Number format:</span>
                <select
                  value={settings.numberNotation}
                  onChange={(e) =>
                    handleSettingChange(
                      'numberNotation',
                      e.target.value as GameSettings['numberNotation']
                    )
                  }
                  className="rounded border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="standard">Standard (1.5M)</option>
                  <option value="scientific">Scientific (1.5e6)</option>
                  <option value="engineering">Engineering (1.5M)</option>
                </select>
              </label>
            </div>

            {/* Tooltips */}
            <div>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={settings.showTooltips}
                  onChange={(e) =>
                    handleSettingChange('showTooltips', e.target.checked)
                  }
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-gray-700">Show tooltips</span>
              </label>
            </div>

            {/* Sound & Music (placeholders) */}
            <div className="space-y-2">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={settings.soundEnabled}
                  onChange={(e) =>
                    handleSettingChange('soundEnabled', e.target.checked)
                  }
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  disabled
                />
                <span className="text-gray-400">
                  Enable sound effects (coming soon)
                </span>
              </label>

              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={settings.musicEnabled}
                  onChange={(e) =>
                    handleSettingChange('musicEnabled', e.target.checked)
                  }
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  disabled
                />
                <span className="text-gray-400">Enable music (coming soon)</span>
              </label>
            </div>
          </div>
        )}

        {activeTab === 'saveload' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Save & Load
            </h3>

            {/* Auto-save status */}
            <div className="p-3 bg-gray-50 rounded border border-gray-200">
              <p className="text-sm text-gray-600">
                Last saved: <span className="font-medium">{formatLastSaveTime()}</span>
              </p>
            </div>

            {/* Export save */}
            <div>
              <Button onClick={handleExport} variant="primary" fullWidth>
                Export Save
              </Button>
              <p className="text-sm text-gray-500 mt-1">
                Download your save as a JSON file
              </p>
            </div>

            {/* Import save */}
            <div>
              <label className="block cursor-pointer">
                <span className="inline-block w-full">
                  <Button variant="secondary" fullWidth type="button">
                    Import Save
                  </Button>
                </span>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImport}
                  className="hidden"
                />
              </label>
              <p className="text-sm text-gray-500 mt-1">
                Load a previously exported save file
              </p>
            </div>

            {/* Hard reset */}
            <div className="pt-4 border-t border-gray-200">
              <Button
                onClick={() => setConfirmReset(true)}
                variant="danger"
                fullWidth
              >
                Hard Reset
              </Button>
              <p className="text-sm text-red-500 mt-1">
                Warning: This will delete ALL progress permanently!
              </p>
            </div>
          </div>
        )}

        {activeTab === 'about' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              About Cosmic Clicker
            </h3>

            <div className="space-y-3">
              <div>
                <p className="text-sm font-medium text-gray-700">Version</p>
                <p className="text-gray-900">1.0.0</p>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-700">Description</p>
                <p className="text-gray-600">
                  An incremental space game where you collect stardust through
                  clicking and automated production buildings, unlock upgrades,
                  and prestige for permanent bonuses.
                </p>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-700">How to Play</p>
                <ul className="list-disc list-inside text-gray-600 space-y-1">
                  <li>Click the cosmic object to collect stardust</li>
                  <li>Purchase buildings to automate production</li>
                  <li>Buy upgrades to increase efficiency</li>
                  <li>Prestige to gain Nebula Crystals for permanent bonuses</li>
                </ul>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-700">Credits</p>
                <p className="text-gray-600">
                  Built with React and TypeScript
                </p>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-700">Links</p>
                <a
                  href="https://github.com/yourusername/cosmic-clicker"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 underline"
                >
                  GitHub Repository
                </a>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Confirmation modal for hard reset */}
      <Modal
        isOpen={confirmReset}
        onClose={() => setConfirmReset(false)}
        title="Confirm Hard Reset"
        size="small"
      >
        <div className="space-y-4">
          <p className="text-gray-700">
            Are you sure you want to delete all progress? This action cannot be
            undone.
          </p>
          <p className="text-red-600 font-medium">
            You will lose:
          </p>
          <ul className="list-disc list-inside text-gray-700 space-y-1">
            <li>All stardust and resources</li>
            <li>All buildings and upgrades</li>
            <li>All achievements</li>
            <li>All Nebula Crystals</li>
            <li>All statistics</li>
          </ul>
          <div className="flex space-x-3 pt-2">
            <Button
              onClick={handleHardReset}
              variant="danger"
              fullWidth
            >
              Yes, Reset Everything
            </Button>
            <Button
              onClick={() => setConfirmReset(false)}
              variant="secondary"
              fullWidth
            >
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};
