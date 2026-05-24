import type {
  CreateRoleInput,
  CustomRoleForViewDto,
  EditRoleInput,
} from '@/apis';
import { AdminDashboardService } from '@/apis';
import { XCloseModalIcon } from '@/assets/images/svg/XCloseModal';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { TextInput } from '@/components/ui/input/text-input';
import ReactQuery from '@/configs/react_query_keys';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import RenderPermissions from './RenderPrermissions';

type FormValues = {
  displayName: string;
  permissions: string[];
};

const CreateRole = ({
  open,
  onOpenChange,
  id,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  id: number;
}) => {
  const {
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { isSubmitting },
  } = useForm<FormValues>({
    defaultValues: {
      displayName: '',
      permissions: [],
    },
  });
  const queryClient = useQueryClient();

  const { data: permissions } = useQuery({
    queryKey: [ReactQuery.permissions],
    queryFn: () =>
      AdminDashboardService.apiServicesAppAdmindashboardAppgetallpermissionsGet(),
    enabled: open,
  });

  const getRoleDetail = useMutation({
    mutationFn: async (id: number) => {
      const res =
        await AdminDashboardService.apiServicesAppAdmindashboardGetrolebyidGet(
          id,
        );
      return res;
    },
    onSuccess: (data: CustomRoleForViewDto) => {
      const grantedPermissionNames = data.permissions?.filter(p => p.isGranted);
      reset({
        displayName: data.displayName || '',
        permissions: grantedPermissionNames?.map(p => p.name!) || [],
      });
    },
  });

  const createRole = useMutation({
    mutationFn: async (data: CreateRoleInput) => {
      const res =
        await AdminDashboardService.apiServicesAppAdmindashboardCreaterolePost(
          data,
        );
      return res;
    },
    onSuccess: (data: CustomRoleForViewDto) => {
      onOpenChange(false);
      queryClient.invalidateQueries({
        queryKey: [ReactQuery.roles],
      });
    },
  });

  const editRole = useMutation({
    mutationFn: async (data: EditRoleInput) => {
      const res =
        await AdminDashboardService.apiServicesAppAdmindashboardEditrolePost(
          data,
        );
      return res;
    },
    onSuccess: (data: CustomRoleForViewDto) => {
      onOpenChange(false);
      queryClient.invalidateQueries({
        queryKey: [ReactQuery.roles],
      });
    },
  });

  useEffect(() => {
    if (id !== 0) {
      getRoleDetail.mutate(id);
    } else {
      reset({
        displayName: '',
        permissions: [],
      });
    }
  }, [id]);

  const onSubmit = async (data: FormValues) => {
    const final = {
      displayName: data.displayName,
      grantedPermissionNames: data.permissions,
    };
    if (id == 0) {
      createRole.mutate(final);
    } else {
      editRole.mutate({ ...final, id });
    }
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="p-0 bg-surfacePrimary rounded-lg"
        showCloseButton={false}
      >
        <DialogHeader className="w-full flex flex-row-reverse justify-between items-center px-6 pt-6 pb-4 relative">
          <DialogClose asChild>
            <button
              aria-label="بستن"
              className="p-1 hover:opacity-70 transition-opacity cursor-pointer flex-shrink-0"
              onClick={handleCancel}
            >
              <XCloseModalIcon className="text-gray-25 [&_path]:stroke-gray-500" />
            </button>
          </DialogClose>

          <DialogTitle className="text-lg-demibold">ایجاد نقش جدید</DialogTitle>
        </DialogHeader>

        <form
          className="px-6 pb-6 flex flex-col gap-3"
          onSubmit={handleSubmit(onSubmit)}
        >
          {getRoleDetail.isPending ? (
            <div className="py-8 text-center text-textSecondary">
              در حال بارگذاری...
            </div>
          ) : (
            <>
              <Controller
                control={control}
                name="displayName"
                render={({ field }) => (
                  <TextInput
                    className="mb-2"
                    placeholder="نام نقش"
                    {...field}
                  />
                )}
              />

              <RenderPermissions
                control={control}
                name="permissions"
                permissions={permissions}
              />

              <DialogFooter className="px-0 gap-3 flex-row mt-4">
                <div className="flex gap-3 ml-auto">
                  <Button
                    className="cursor-pointer"
                    type="submit"
                    variant="primary"
                    disabled={
                      isSubmitting || createRole.isPending || editRole.isPending
                    }
                  >
                    {isSubmitting || createRole.isPending || editRole.isPending
                      ? 'در حال ارسال...'
                      : 'ثبت نقش'}
                  </Button>
                  <Button
                    className="cursor-pointer"
                    disabled={getRoleDetail.isPending}
                    type="button"
                    variant="secondary"
                    onClick={handleCancel}
                  >
                    لغو
                  </Button>
                </div>
              </DialogFooter>
            </>
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateRole;
