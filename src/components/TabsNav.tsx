import React from 'react';
import { Sliders, Network, FileCode, ScrollText, History, HelpCircle, PackageCheck } from 'lucide-react';

export type TabType = 'settings' | 'graph' | 'lua' | 'spoilers' | 'history' | 'guide' | 'exe-build';

interface TabsNavProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export const TabsNav: React.FC<TabsNavProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'settings', label: 'Randomizer Rules', icon: Sliders },
    { id: 'graph', label: 'Door & Logic Map', icon: Network },
    { id: 'lua', label: 'REFramework Code', icon: FileCode },
    { id: 'spoilers', label: 'Spoiler Log', icon: ScrollText },
    { id: 'history', label: 'Run Archives', icon: History },
    { id: 'guide', label: 'Installation Setup', icon: HelpCircle },
    { id: 'exe-build', label: 'Standalone .EXE', icon: PackageCheck },
  ] as const;

  return (
    <div className="bg-[#0e0e14]/80 border-b border-white/[0.06] px-6 sticky top-[67px] z-20 backdrop-blur-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between py-2 overflow-x-auto scrollbar-none">
        <div className="flex space-x-1.5 p-1 bg-[#151520] border border-white/[0.06] rounded-xl">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id as TabType)}
                className={`relative flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 whitespace-nowrap ${
                  isActive
                    ? 'bg-gradient-to-r from-primary/20 to-secondary/20 text-white border border-primary/40 shadow-sm'
                    : 'text-textSecondary hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 transition-colors ${isActive ? 'text-primary' : 'text-textSecondary'}`} />
                <span>{tab.label}</span>
                {isActive && (
                  <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-4 h-0.5 bg-primary rounded-full shadow-glow-sm" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
