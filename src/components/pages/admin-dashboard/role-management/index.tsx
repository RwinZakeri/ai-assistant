'use client';

import { AdminDashboardService } from '@/apis';
import HeaderDashboard from '@/components/pages/user-dashboard/components/HeaderDashboard';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableSkeleton,
} from '@/components/ui/table';
import { TableHeader } from '@/components/ui/table/table';
import ReactQuery from '@/configs/react_query_keys';
import { useQuery } from '@tanstack/react-query';
import React from 'react';
import CreateRole from './components/CreateRole';

const roleTableHeaders = [
  { id: '1', label: 'ردیف' },
  { id: '2', label: 'نام ' },
  { id: '3', label: 'اقدام' },
];
const RoleManagement = () => {
  const [openCreateModal, setOpenCreateModal] = React.useState(false);
  const [roleId, setRoleId] = React.useState(0);

  const openCreateRoleModal = () => {
    setOpenCreateModal(true);
    setRoleId(0);
  };

  const { data: roles, isLoading } = useQuery({
    queryKey: [ReactQuery.roles],
    queryFn: () =>
      AdminDashboardService.apiServicesAppAdmindashboardGetallrolesGet(),
  });

  const editHandler = (id: number) => {
    setOpenCreateModal(true);
    setRoleId(id);
  };

  return (
    <HeaderDashboard
      actionButton={<Button onClick={openCreateRoleModal}>افزودن نقش</Button>}
      label="مدیریت نقش‌ها"
    >
      <div>
        {isLoading ? (
          <TableSkeleton columns={3} rows={5} />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                {roleTableHeaders.map((header, index) => (
                  <TableHead key={header.id + index}>{header.label}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {roles?.map((item, index) => (
                <TableRow key={item?.roleName}>
                  <TableCell className="text-textSecondary">
                    {index + 1}
                  </TableCell>
                  <TableCell className="font-medium text-textTertiary">
                    {item.roleName}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="linkColor"
                      onClick={() => editHandler(item.id as number)}
                    >
                      ویرایش
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
      <CreateRole
        id={roleId}
        open={openCreateModal}
        onOpenChange={setOpenCreateModal}
      />
    </HeaderDashboard>
  );
};

export default RoleManagement;
