'use client';

import { Button } from '@/components/ui/button';

const tabs = [
  { id: 'profile', label: 'مشخصات کاربر' },
  { id: 'speakers', label: 'اسپیکرها' },
  { id: 'voice-assistants', label: 'دستیاران صوتی' },
  { id: 'wallet', label: 'کیف پول' },
  { id: 'payments', label: 'پرداخت ها' },
  { id: 'support', label: 'پشتیبانی' },
  { id: 'questions', label: 'سؤالات' },
];

interface NavigationTabsProps {
  activeTab?: string;
  onTabChange?: (tabId: string) => void;
}

const NavigationTabs = ({
  activeTab = 'profile',
  onTabChange,
}: NavigationTabsProps) => {
  const handleTabClick = (tabId: string) => {
    onTabChange?.(tabId);
  };

  return (
    <div className="w-full bg-base-black border-b border-linePrimary relative overflow-hidden">
      <div className="flex items-center justify-start gap-8 pt-4 pb-0 flex-nowrap">
        {tabs.map(tab => {
          const isActive = activeTab === tab.id;
          return (
            <Button
              key={tab.id}
              variant="link"
              className={`
                relative whitespace-nowrap transition-colors cursor-pointer pb-4 text-md-demibold flex-shrink-0
                ${
                  isActive
                    ? 'text-gray-25'
                    : 'text-textSecondary hover:text-textSecondary/70'
                }
              `}
              onClick={() => handleTabClick(tab.id)}
            >
              {tab.label}
              {isActive && (
                <span className="absolute bottom-[-1px] right-[-4px] left-[-4px] h-[2px] bg-white z-10" />
              )}
            </Button>
          );
        })}
      </div>
    </div>
  );
};

export default NavigationTabs;
