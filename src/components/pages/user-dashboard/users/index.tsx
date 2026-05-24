"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import HeaderDashboard from "../components/HeaderDashboard";
import UserTable from "./components/UserTable";
import { DropdownInput } from "@/components/ui/input/dropdown-input";
import { AdminDashboardService } from "@/apis";
import ReactQuery from "@/configs/react_query_keys";
import type { GetAllRolesOutput } from "@/apis/models/GetAllRolesOutput";
import { LifecycleBounds } from "@/enums/enum";
import { useDebounce } from "@/hooks/useDebounce";
import { persianToEnglish } from "@/utils/persianToEnglish";
import { sortOptions } from "./constants";
import { mapApiUserToUser, calculateTotalPages } from "./utils";

const UserManagement = () => {
  const [searchValue, setSearchValue] = useState<string>("");
  const [selectedRole, setSelectedRole] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const convertedSearchValue = persianToEnglish(searchValue);
  const debouncedSearchValue = useDebounce(convertedSearchValue, 400);

  const { data: rolesData } = useQuery({
    queryKey: [ReactQuery.allRoles],
    queryFn: () => {
      return AdminDashboardService.apiServicesAppAdmindashboardGetallrolesGet();
    },
  });

  const roleOptions = [
    { value: "all", label: "همه نقش‌ها" },
    ...(rolesData || [])
      .map((role: GetAllRolesOutput) => ({
        value: role.id?.toString() || "",
        label: role.roleName || "",
      }))
      .filter((role) => role.value && role.label),
  ];

  const selectedRoleId =
    selectedRole === "all" ? undefined : parseInt(selectedRole) || undefined;

  const lifecycleBounds =
    sortBy === "newest"
      ? (LifecycleBounds.Newest as any)
      : sortBy === "oldest"
      ? (LifecycleBounds.Oldest as any)
      : undefined;

  const { data: apiResponse, isLoading } = useQuery({
    queryKey: [
      ReactQuery.allUsersForAdmin,
      debouncedSearchValue,
      selectedRoleId,
      lifecycleBounds,
      currentPage,
      pageSize,
    ],
    queryFn: () => {
      return AdminDashboardService.apiServicesAppAdmindashboardGetallusersforadminPost(
        {
          maxResultCount: pageSize,
          skipCount: (currentPage - 1) * pageSize,
          lifecycleBounds: lifecycleBounds,
          nameOrEmailOrPhone: debouncedSearchValue || undefined,
          roleId: selectedRoleId || undefined,
        }
      );
    },
  });

  const users = (apiResponse?.items || []).map(mapApiUserToUser);
  const totalItems = apiResponse?.totalCount ?? 0;
  const totalPages = calculateTotalPages(totalItems, pageSize);

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchValue, selectedRole, sortBy]);

  return (
    <HeaderDashboard label="مدیریت کاربران">
      <section className="flex flex-col gap-6">
        <div className="flex flex-row gap-2 items-start justify-between">
          <div className="w-[40%]  ">
            <DropdownInput
              type="search"
              placeholder="جستجو"
              searchPlaceholder="جستجو"
              options={[]}
              value={searchValue}
              onInputChange={(value) => {
                setSearchValue(value);
              }}
            />
          </div>

          <div className="flex flex-row w-[60%] gap-2">
            <DropdownInput
              type="default"
              className="w-full"
              placeholder="نقش انتخاب کنید"
              options={roleOptions}
              value={selectedRole}
              onValueChange={(value) => setSelectedRole(value as string)}
            />

            <DropdownInput
              type="default"
              className="w-full"
              placeholder="جدیدترین"
              options={sortOptions}
              value={sortBy}
              onValueChange={(value) => setSortBy(value as string)}
            />
          </div>
        </div>

        <UserTable
          users={users}
          currentPage={currentPage}
          pageSize={pageSize}
          totalPages={totalPages}
          totalItems={totalItems}
          onPageChange={setCurrentPage}
          onPageSizeChange={(newSize: number) => {
            setPageSize(newSize);
            setCurrentPage(1);
          }}
          isLoading={isLoading}
        />
      </section>
    </HeaderDashboard>
  );
};

export default UserManagement;
