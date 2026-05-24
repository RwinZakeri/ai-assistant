import type { GetCustomPermissionOutput } from '@/apis';
import { Checkbox } from '@/components/ui/checkbox';
import type { Control } from 'react-hook-form';
import { Controller } from 'react-hook-form';

interface RenderPermissionsProps {
  permissions?: GetCustomPermissionOutput[];
  control: Control<any>;
  name: string;
}

const RenderPermissions = ({
  permissions,
  control,
  name,
}: RenderPermissionsProps) => {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { value, onChange } }) => {
        const handleChange = (permission: string) => {
          if (value?.includes(permission)) {
            onChange(value.filter((item: string) => item !== permission));
          } else {
            onChange([...(value || []), permission]);
          }
        };

        return (
          <div className="max-h-80 overflow-y-auto border border-gray-500 rounded-md p-4">
            <div className="grid grid-cols-2 gap-2">
              {permissions?.map(permission => (
                <Checkbox
                  key={(permission.title as string) + permission.id}
                  checked={value?.includes(permission.title)}
                  label={permission.persianTitle as string}
                  labelClassName="text-sm-medium"
                  onCheckedChange={() => handleChange(permission.title!)}
                />
              ))}
            </div>
          </div>
        );
      }}
    />
  );
};

export default RenderPermissions;
