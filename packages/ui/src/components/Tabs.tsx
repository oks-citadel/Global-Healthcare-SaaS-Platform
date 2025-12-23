// @ts-nocheck
import React, { useState } from 'react';
import clsx from 'clsx';

export interface Tab {
  id: string;
  label: string;
  content: React.ReactNode;
  icon?: React.ReactNode;
  disabled?: boolean;
}

export interface TabsProps {
  tabs: Tab[];
  defaultTab?: string;
  activeTab?: string;
  onChange?: (tabId: string) => void;
  variant?: 'line' | 'pills' | 'enclosed';
  fullWidth?: boolean;
  className?: string;
}

export const Tabs: React.FC<TabsProps> = ({
  tabs,
  defaultTab,
  activeTab: controlledActiveTab,
  onChange,
  variant = 'line',
  fullWidth = false,
  className,
}) => {
  const [internalActiveTab, setInternalActiveTab] = useState(
    defaultTab || tabs[0]?.id || ''
  );

  const isControlled = controlledActiveTab !== undefined;
  const activeTab = isControlled ? controlledActiveTab : internalActiveTab;

  const handleTabChange = (tabId: string) => {
    if (!isControlled) {
      setInternalActiveTab(tabId);
    }
    onChange?.(tabId);
  };

  const activeTabContent = tabs.find((tab) => tab.id === activeTab)?.content;

  const lineVariantStyles = (isActive: boolean) =>
    clsx(
      'px-4 py-2 border-b-2 transition-all',
      isActive
        ? 'border-primary-600 text-primary-600 font-medium'
        : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
    );

  const pillsVariantStyles = (isActive: boolean) =>
    clsx(
      'px-4 py-2 rounded-lg transition-all',
      isActive
        ? 'bg-primary-600 text-white font-medium shadow-sm'
        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
    );

  const enclosedVariantStyles = (isActive: boolean) =>
    clsx(
      'px-4 py-2 border-t-2 border-x-2 transition-all',
      isActive
        ? 'border-gray-300 border-b-0 bg-white text-primary-600 font-medium -mb-px'
        : 'border-transparent text-gray-600 hover:text-gray-900 bg-gray-50'
    );

  const getTabStyles = (isActive: boolean) => {
    switch (variant) {
      case 'pills':
        return pillsVariantStyles(isActive);
      case 'enclosed':
        return enclosedVariantStyles(isActive);
      case 'line':
      default:
        return lineVariantStyles(isActive);
    }
  };

  return (
    <div className={clsx('w-full', className)}>
      {/* Tab Headers */}
      <div
        className={clsx(
          'flex gap-1',
          variant === 'line' && 'border-b border-gray-200',
          variant === 'enclosed' && 'border-b border-gray-300',
          fullWidth && 'w-full'
        )}
        role="tablist"
      >
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              role="tab"
              aria-selected={isActive}
              aria-controls={`panel-${tab.id}`}
              disabled={tab.disabled}
              onClick={() => !tab.disabled && handleTabChange(tab.id)}
              className={clsx(
                'inline-flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
                'disabled:opacity-50 disabled:cursor-not-allowed',
                getTabStyles(isActive),
                fullWidth && 'flex-1 justify-center'
              )}
            >
              {tab.icon && <span>{tab.icon}</span>}
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div
        role="tabpanel"
        id={`panel-${activeTab}`}
        aria-labelledby={activeTab}
        className={clsx(
          'mt-4',
          variant === 'enclosed' && 'border border-t-0 border-gray-300 rounded-b-lg p-4'
        )}
      >
        {activeTabContent}
      </div>
    </div>
  );
};

Tabs.displayName = 'Tabs';
