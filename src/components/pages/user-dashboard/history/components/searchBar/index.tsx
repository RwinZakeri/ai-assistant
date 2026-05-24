import { DropdownInput } from '@/components/ui/input/dropdown-input';
import { Input } from '@/components/ui/input/text-input/components/TextField';
import { LifecycleBounds } from '@/enums/enum';

interface SearchBarProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  sortValue: string | undefined;
  onSortChange: (value: string) => void;
}

const sortOptions = [
  { label: 'همه', value: 'all' },
  { label: 'جدیدترین', value: String(LifecycleBounds.Newest) },
  { label: 'قدیمی‌ترین', value: String(LifecycleBounds.Oldest) },
];

const SearchBar = ({
  searchValue,
  onSearchChange,
  sortValue,
  onSortChange,
}: SearchBarProps) => {
  const handleSortChange = (value: string | string[]) => {
    if (typeof value === 'string') {
      onSortChange(value);
    }
  };

  return (
    <div className="grid grid-cols-4 items-center gap-2">
      <div className="col-span-3 w-full">
        <Input
          className="w-full"
          placeholder="جستجو..."
          type="text"
          value={searchValue}
          onChange={event => {
            onSearchChange(event.target.value);
          }}
        />
      </div>
      <div className="col-span-1">
        <DropdownInput
          className="w-full"
          options={sortOptions}
          placeholder="مرتب‌سازی"
          type="default"
          value={sortValue}
          onValueChange={handleSortChange}
        />
      </div>
    </div>
  );
};

export default SearchBar;
