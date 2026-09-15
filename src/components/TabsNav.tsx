import React from 'react';
import { Sliders, Network, FileCode, ScrollText, History, HelpCircle, PackageCheck } from 'lucide-react';

export type TabType = 'settings' | 'graph' | 'lua' | 'spoilers' | 'history' | 'guide' | 'exe-build';

interface TabsNavProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export const TabsNav: React.FC<TabsNavProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'settings', label: 'Randomizer Options', icon: Sliders },
    { id: 'graph', label: 'Door & Key Solver Map', icon: Network },
    { id: 'lua', label: 'REFramework Lua', icon: FileCode },
    { id: 'spoilers', label: 'Spoiler Log', icon: ScrollText },
    { id: 'history', label: 'Run History', icon: History },
    { id: 'guide', label: 'RE9 Install Setup', icon: HelpCircle },
    { id: 'exe-build', label: 'Build .EXE Standalone', icon: PackageCheck },
  ] as const;

  return (
    <div className="bg-surface/50 border-b border-border px-6 sticky top-[81px] z-20 backdrop-blur-md">
      <div className="max-w-7xl mx-auto flex space-x-1 overflow-x-auto scrollbar-none py-1.5">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id as TabType)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-xs font-medium transition-all duration-150 whitespace-nowrap ${
                isActive
                  ? 'bg-primary/20 text-primary border border-primary/30 shadow-sm'
                  : 'text-textSecondary hover:text-textMain hover:bg-surface'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-primary' : 'text-textSecondary'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};