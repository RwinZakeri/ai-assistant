import type { GetCustomPermissionOutput } from '@/apis';
import { Checkbox } from '@/components/ui/checkbox';
import type { Control, FieldValues, Path } from 'react-hook-form';
import { Controller } from 'react-hook-form';

interface RenderPermissionsProps<TFieldValues extends FieldValues> {
  permissions?: GetCustomPermissionOutput[];
  control: Control<TFieldValues>;
  name: Path<TFieldValues>;
}

const RenderPermissions = <TFieldValues extends FieldValues>({
  permissions,
  control,
  name,
}: RenderPermissionsProps<TFieldValues>) => {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { value, onChange } }) => {
        const selectedPermissions = (value ?? []) as string[];

        const handleChange = (permission: string) => {
          if (selectedPermissions.includes(permission)) {
            onChange(selectedPermissions.filter(item => item !== permission));
          } else {
            onChange([...selectedPermissions, permission]);
          }
        };

        return (
          <div className="max-h-80 overflow-y-auto border border-gray-500 rounded-md p-4">
            <div className="grid grid-cols-2 gap-2">
              {permissions?.map(permission => (
                <Checkbox
                  key={(permission.title as string) + permission.id}
                  checked={selectedPermissions.includes(permission.title!)}
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
