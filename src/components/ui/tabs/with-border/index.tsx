'use client';
import { cn } from '@/lib/utils';

const WithBorderTabs = ({
  label,
  tabs,
  activeTab,
  setActiveTab,
  className,
  containerClassName,
  tabClassName,
  activeTabClassName,
  inactiveTabClassName,
}: {
  label?: string;
  tabs: { label: string; value: number }[];
  activeTab: number;
  setActiveTab: (index: number) => void;
  className?: string;
  containerClassName?: string;
  tabClassName?: string;
  activeTabClassName?: string;
  inactiveTabClassName?: string;
}) => {
  const handleTabClick = (value: number) => {
    setActiveTab(value);
  };

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      {label && <p className="text-md-medium text-textSecondary">{label}</p>}
      <div
        className={cn(
          'flex gap-2 border-linePrimary border p-[6px] rounded-lg',
          containerClassName,
        )}
      >
        {tabs.map((tab, index) => (
          <div
            key={index}
            className={cn(
              'w-full h-full flex items-center justify-center cursor-pointer rounded-[6px] px-[14px] py-[10px] h-11',
              activeTab === tab.value
                ? 'bg-surfaceSecondary text-textTertiary'
                : 'text-textSecondary',
              tabClassName,
              activeTab === tab.value
                ? activeTabClassName
                : inactiveTabClassName,
            )}
            onClick={() => {
              handleTabClick(tab.value);
            }}
          >
            <p className="w-fit text-center whitespace-nowrap text-sm-demibold">
              {tab.label}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WithBorderTabs;
