'use client';

import type { GetAllAssistantsForAdminOutput } from '@/apis';
import {
  AdminDashboardService,
  CategoriesService,
  LanguageService,
} from '@/apis';
import { ArrowLeft2Icon } from '@/assets/images/svg/ArrowLeft2';
import { ArrowLeftAuthIcon } from '@/assets/images/svg/ArrowLeftAuth';
import { DashboardCloseIcon } from '@/assets/images/svg/DashboardClose';
import { DashboardTrashIcon } from '@/assets/images/svg/DashboardTrash';
import { EditIcon } from '@/assets/images/svg/Edit';
import { RedButtonIcon } from '@/assets/images/svg/RedButton';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog';
import { DropdownInput } from '@/components/ui/input/dropdown-input';
import { Pagination } from '@/components/ui/pagination/index';
import { TableSkeleton } from '@/components/ui/table';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table/table';
import ReactQuery from '@/configs/react_query_keys';
import { useDebounce } from '@/hooks/useDebounce';
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

const STATUS_OPTIONS = [
  { label: 'همه', value: 'all' },
  { label: 'فعال', value: 'active' },
  { label: 'غیرفعال', value: 'inactive' },
];

const AdminAssistantsPage = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [searchInput, setSearchInput] = useState('');
  const debouncedSearch = useDebounce(searchInput, 500);

  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [languageFilter, setLanguageFilter] = useState<string>('all');

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedAssistantId, setSelectedAssistantId] = useState<number | null>(
    null,
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, statusFilter, categoryFilter, languageFilter]);

  const isActiveFilter = useMemo(() => {
    if (statusFilter === 'all') {
      return undefined;
    }
    return statusFilter === 'active';
  }, [statusFilter]);

  const categoryIdFilter = useMemo(() => {
    if (categoryFilter === 'all') {
      return undefined;
    }
    const numValue = Number(categoryFilter);
    return isNaN(numValue) ? undefined : numValue;
  }, [categoryFilter]);

  const languageIdFilter = useMemo(() => {
    if (languageFilter === 'all') {
      return undefined;
    }
    const numValue = Number(languageFilter);
    return isNaN(numValue) ? undefined : numValue;
  }, [languageFilter]);

  const { data, isLoading, isFetching } = useQuery({
    queryKey: [
      ReactQuery.GetAllAssistantsForAdmin,
      currentPage,
      pageSize,
      debouncedSearch,
      isActiveFilter,
      categoryIdFilter,
      languageIdFilter,
    ],
    queryFn: () =>
      AdminDashboardService.apiServicesAppAdmindashboardGetallassistantsforadminPost(
        {
          skipCount: (currentPage - 1) * pageSize,
          maxResultCount: pageSize,
          sorting: null,
          searchTerm: debouncedSearch || undefined,
          isActive: isActiveFilter ?? undefined,
          categoryId: categoryIdFilter ?? undefined,
          languageId: languageIdFilter ?? undefined,
        },
      ),
    placeholderData: keepPreviousData,
  });

  const showLoading = isLoading || isFetching;

  const { data: categories } = useQuery({
    queryKey: [ReactQuery.allMenuChildren],
    queryFn: () =>
      CategoriesService.apiServicesAppCategoriesGetallassistantcategoriesGet(),
  });

  const { data: languages } = useQuery({
    queryKey: [ReactQuery.allLanguages],
    queryFn: () => LanguageService.apiServicesAppLanguageAppgetlanguagesGet(),
  });

  const { assistants, totalCount, totalPages } = useMemo(() => {
    const assistantsList: GetAllAssistantsForAdminOutput[] = data?.items ?? [];
    const count = data?.totalCount ?? 0;
    const pages = Math.ceil(count / pageSize);
    return {
      assistants: assistantsList,
      totalCount: count,
      totalPages: pages,
    };
  }, [data?.items, data?.totalCount, pageSize]);

  const categoryOptions = useMemo(() => {
    if (!categories) {
      return [];
    }
    return categories
      .filter(item => item.category?.id && item.category?.title)
      .map(item => ({
        label: item.category!.title!,
        value: String(item.category!.id!),
      }));
  }, [categories]);

  const languageOptions = useMemo(() => {
    if (!languages) {
      return [];
    }
    return languages
      .filter(lang => lang.id != null && lang.displayName)
      .map(lang => ({
        label: lang.displayName ?? '',
        value: String(lang.id!),
      }));
  }, [languages]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  const deleteAssistantMutation = useMutation({
    mutationFn: (assistantId: number) =>
      AdminDashboardService.apiServicesAppAdmindashboardDeleteassistantbyidDelete(
        assistantId,
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [ReactQuery.GetAllAssistantsForAdmin],
      });
      setDeleteModalOpen(false);
      setSelectedAssistantId(null);
    },
  });

  const handleDeleteClick = (assistantId: number) => {
    setSelectedAssistantId(assistantId);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (selectedAssistantId !== null) {
      deleteAssistantMutation.mutate(selectedAssistantId);
    }
  };

  const handleDeleteModalClose = () => {
    if (deleteAssistantMutation.isPending) {
      return;
    }
    setDeleteModalOpen(false);
    setSelectedAssistantId(null);
  };

  return (
    <section className="flex flex-col gap-8">
      <div className="flex gap-2 flex-wrap">
        <DropdownInput
          className="w-full md:w-auto md:flex-1"
          options={[]}
          placeholder="جستجو..."
          searchPlaceholder="جستجو کنید"
          type="search"
          value={searchInput}
          onInputChange={value => {
            setSearchInput(value.trim());
          }}
        />

        <DropdownInput
          className="w-full md:w-auto md:min-w-[180px]"
          options={STATUS_OPTIONS}
          placeholder="انتخاب وضعیت"
          value={statusFilter}
          onValueChange={value => {
            setStatusFilter(value as string);
            setCurrentPage(1);
          }}
        />

        <DropdownInput
          className="w-full md:w-auto md:min-w-[180px]"
          placeholder="انتخاب دسته‌بندی"
          value={categoryFilter}
          options={[
            { label: 'همه دسته‌بندی‌ها', value: 'all' },
            ...categoryOptions,
          ]}
          onValueChange={value => {
            setCategoryFilter(value as string);
            setCurrentPage(1);
          }}
        />

        <DropdownInput
          className="w-full md:w-auto md:min-w-[180px]"
          options={[{ label: 'همه زبان‌ها', value: 'all' }, ...languageOptions]}
          placeholder="انتخاب زبان"
          value={languageFilter}
          onValueChange={value => {
            setLanguageFilter(value as string);
            setCurrentPage(1);
          }}
        />
      </div>

      {showLoading ? (
        <TableSkeleton columns={11} rows={8} />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>#</TableHead>
              <TableHead>نام فارسی</TableHead>
              <TableHead>نام انگلیسی</TableHead>
              <TableHead>وضعیت</TableHead>
              <TableHead>توضیحات برای کاربر</TableHead>
              <TableHead>دسته‌بندی</TableHead>
              <TableHead>زبان‌ها</TableHead>
              <TableHead>استفاده از دانش عمومی</TableHead>
              <TableHead />
              <TableHead />
              <TableHead />
            </TableRow>
          </TableHeader>

          <TableBody>
            {assistants.length === 0 ? (
              <TableRow>
                <TableCell
                  className="text-center text-textSecondary"
                  colSpan={11}
                >
                  دستیاری یافت نشد
                </TableCell>
              </TableRow>
            ) : (
              <>
                {assistants.map((assistant, index) => (
                  <TableRow key={assistant.id ?? index}>
                    <TableCell className="text-textSecondary">
                      {(currentPage - 1) * pageSize + index + 1}
                    </TableCell>
                    <TableCell className="text-textTertiary">
                      {assistant.persianName ?? '-'}
                    </TableCell>
                    <TableCell className="font-semibold text-gray-25">
                      {assistant.englishName ?? '-'}
                    </TableCell>
                    <TableCell>
                      <Badge
                        size="sm"
                        variant={assistant.isActive ? 'success' : 'error'}
                      >
                        {assistant.isActive ? 'فعال' : 'غیرفعال'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-textSecondary">
                      {assistant.userDescription ?? '-'}
                    </TableCell>
                    <TableCell>
                      {assistant.category ? (
                        <Badge size="sm" variant="primary">
                          {assistant.category}
                        </Badge>
                      ) : (
                        '-'
                      )}
                    </TableCell>
                    <TableCell className="">
                      <div className="flex gap-1">
                        {assistant.languages &&
                        assistant.languages.length > 0 ? (
                          assistant.languages.map((lang, langIndex) => (
                            <Badge key={langIndex} size="sm" variant="gray">
                              {lang}
                            </Badge>
                          ))
                        ) : (
                          <span className="text-textSecondary">-</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        size="sm"
                        variant={
                          assistant.usePublicKnowledge ? 'success' : 'error'
                        }
                      >
                        {assistant.usePublicKnowledge ? 'فعال' : 'غیرفعال'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <button
                        className="font-semibold flex gap-2 items-center hover:text-primary-400 transition-colors cursor-pointer"
                        onClick={() => {
                          router.push(
                            `/dashboard/voice-assistants/${assistant.id}?tab=comments`,
                          );
                        }}
                      >
                        مشاهده نظرات{' '}
                        <ArrowLeft2Icon className="text-gray-600" />
                      </button>
                    </TableCell>
                    <TableCell className="text-center">
                      <button
                        className="text-primary-300 flex gap-2 items-center hover:text-primary-400 transition-colors cursor-pointer"
                        onClick={() => {
                          router.push(
                            `/dashboard/voice-assistants/${assistant.id}?tab=questions`,
                          );
                        }}
                      >
                        مشاهده سؤالات{' '}
                        <ArrowLeftAuthIcon className="text-red-600" />
                      </button>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2 items-center">
                        <Button
                          size="sm"
                          variant="linkColor"
                          onClick={() => {
                            router.push(
                              `/dashboard/voice-assistants/${assistant.id}`,
                            );
                          }}
                        >
                          <EditIcon />
                        </Button>
                        <Button
                          className="text-error-500 hover:text-error-400"
                          size="sm"
                          variant="linkColor"
                          onClick={() => {
                            if (assistant.id) {
                              handleDeleteClick(assistant.id);
                            }
                          }}
                        >
                          <RedButtonIcon />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}

                <TableRow>
                  <TableCell className="p-4" colSpan={11}>
                    <Pagination
                      currentPage={currentPage}
                      pageSize={pageSize}
                      pageSizeOptions={[12, 24, 48]}
                      totalItems={totalCount}
                      totalPages={totalPages}
                      onPageChange={handlePageChange}
                      onPageSizeChange={handlePageSizeChange}
                    />
                  </TableCell>
                </TableRow>
              </>
            )}
          </TableBody>
        </Table>
      )}

      <Dialog
        open={deleteModalOpen}
        onOpenChange={open =>
          !deleteAssistantMutation.isPending && setDeleteModalOpen(open)
        }
      >
        <DialogContent
          className="bg-surfacePrimary rounded-lg p-0 w-[400px]"
          showCloseButton={false}
        >
          <DialogClose asChild>
            <Button
              aria-label="بستن"
              className="absolute top-4 left-4 p-1 hover:opacity-70 transition-opacity cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={deleteAssistantMutation.isPending}
              variant="linkColor"
              onClick={handleDeleteModalClose}
            >
              <DashboardCloseIcon />
            </Button>
          </DialogClose>

          <div className="flex flex-col items-start px-6 pt-[32px] pb-6">
            <div className="w-16 h-16 rounded-full bg-error-600 border-8 border-error-900 flex items-center justify-center">
              <DashboardTrashIcon />
            </div>
            <div className="mt-3 gap-4 flex flex-col items-start">
              <DialogTitle className="text-lg-demibold text-gray-25">
                حذف دستیار
              </DialogTitle>

              <p className="text-sm-regular text-textTertiary leading-relaxed">
                آیا مطمئن هستید که می‌خواهید این دستیار را حذف کنید؟ این عمل
                قابل لغو نیست.
              </p>
            </div>

            <div className="flex flex-row gap-3 w-full mt-8">
              <Button
                className="flex-1"
                disabled={deleteAssistantMutation.isPending}
                size="lg"
                variant="secondary"
                onClick={handleDeleteModalClose}
              >
                لغو
              </Button>
              <Button
                className="flex-1"
                disabled={deleteAssistantMutation.isPending}
                loading={deleteAssistantMutation.isPending}
                size="lg"
                variant="error"
                onClick={handleDeleteConfirm}
              >
                حذف
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default AdminAssistantsPage;
