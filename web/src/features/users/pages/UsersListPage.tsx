import { useMemo, useState, type ReactElement } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/Button';
import { Confirm } from '@/components/Confirm';
import { PageHeader } from '@/components/PageHeader';
import { Pagination } from '@/components/Pagination';
import { SearchInput } from '@/components/SearchInput';
import { Select } from '@/components/Select';
import { errorMessage } from '@/lib/api-error';
import { toast } from '@/store/toast-store';
import { roleNameSchema, type PublicUser } from '@/features/auth/schemas';
import { useDeleteUser, useUsersList } from '../hooks';
import { listUsersQuerySchema, type ListUsersQuery } from '../schemas';
import { UsersTable } from '../components/UsersTable';
import './UsersListPage.css';
 
const ALL_ROLES = roleNameSchema.options;
 
// Extract a typed query from the current URL params, falling back to defaults.
const parseQueryFromParams = (params: URLSearchParams): ListUsersQuery => {
  const candidate = {
    page: params.get('page') ?? undefined,
    pageSize: params.get('pageSize') ?? undefined,
    sortBy: params.get('sortBy') ?? undefined,
    sortOrder: params.get('sortOrder') ?? undefined,
    search: params.get('search') ?? undefined,
    role: params.get('role') ?? undefined,
    isActive: params.get('isActive') ?? undefined,
  };
  const result = listUsersQuerySchema.safeParse(candidate);
  if (result.success) {
    return result.data;
  }
  return listUsersQuerySchema.parse({});
};
 
export const UsersListPage = (): ReactElement => {
  const [params, setParams] = useSearchParams();
  const query = useMemo(() => parseQueryFromParams(params), [params]);
  const list = useUsersList(query);
  const deleteUser = useDeleteUser();
 
  const [pendingDelete, setPendingDelete] = useState<PublicUser | null>(null);
 
  // Helper that merges new params into the URL, dropping any whose value is
  // undefined or matches the schema default.
  const updateParams = (next: Partial<ListUsersQuery>): void => {
    const merged: ListUsersQuery = { ...query, ...next };
    const url = new URLSearchParams();
    if (merged.page !== 1) {
      url.set('page', String(merged.page));
    }
    if (merged.pageSize !== 20) {
      url.set('pageSize', String(merged.pageSize));
    }
    if (merged.sortBy !== 'createdAt') {
      url.set('sortBy', merged.sortBy);
    }
    if (merged.sortOrder !== 'desc') {
      url.set('sortOrder', merged.sortOrder);
    }
    if (merged.search !== undefined && merged.search !== '') {
      url.set('search', merged.search);
    }
    if (merged.role !== undefined) {
      url.set('role', merged.role);
    }
    if (merged.isActive !== undefined) {
      url.set('isActive', merged.isActive);
    }
    setParams(url);
  };
 
  const onSort = (key: string): void => {
    if (!isSortable(key)) {
      return;
    }
    if (query.sortBy === key) {
      updateParams({ sortOrder: query.sortOrder === 'asc' ? 'desc' : 'asc', page: 1 });
      return;
    }
    updateParams({ sortBy: key, sortOrder: 'asc', page: 1 });
  };
 
  const onConfirmDelete = (): void => {
    if (pendingDelete === null) {
      return;
    }
    deleteUser.mutate(pendingDelete.id, {
      onSuccess: () => {
        toast.success('User deleted');
        setPendingDelete(null);
      },
      onError: (err) => {
        toast.error(errorMessage(err));
      },
    });
  };
 
  return (
    <>
      <PageHeader
        title="Users"
        description="Manage every account in the system. Soft-deleting a user revokes their sessions immediately."
        actions={
          <Link to="/users/new">
            <Button>+ New user</Button>
          </Link>
        }
      />
 
      <div className="users-list__filters">
        <div className="users-list__filters-search">
          <SearchInput
            value={query.search ?? ''}
            onDebouncedChange={(value) => {
              updateParams({ search: value === '' ? undefined : value, page: 1 });
            }}
            placeholder="Search by name or email"
            ariaLabel="Search users"
          />
        </div>
        <div className="users-list__filters-control">
          <Select
            value={query.role ?? ''}
            onChange={(e) => {
              const value = e.target.value;
              updateParams({
                role: value === '' ? undefined : (value as ListUsersQuery['role']),
                page: 1,
              });
            }}
            aria-label="Filter by role"
          >
            <option value="">All roles</option>
            {ALL_ROLES.map((role) => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </Select>
        </div>
        <div className="users-list__filters-control">
          <Select
            value={query.isActive ?? ''}
            onChange={(e) => {
              const value = e.target.value;
              updateParams({
                isActive: value === '' ? undefined : (value as 'true' | 'false'),
                page: 1,
              });
            }}
            aria-label="Filter by active status"
          >
            <option value="">All statuses</option>
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </Select>
        </div>
      </div>
 
      <div className="users-list__panel">
        <UsersTable
          users={list.data?.items ?? []}
          isLoading={list.isLoading}
          isError={list.isError}
          sortBy={query.sortBy}
          sortOrder={query.sortOrder}
          onSort={onSort}
          onDelete={setPendingDelete}
        />
        {list.data !== undefined && list.data.totalCount > 0 && (
          <Pagination
            page={list.data.page}
            pageSize={list.data.pageSize}
            totalCount={list.data.totalCount}
            totalPages={list.data.totalPages}
            hasNextPage={list.data.hasNextPage}
            hasPrevPage={list.data.hasPrevPage}
            onPageChange={(page) => {
              updateParams({ page });
            }}
            onPageSizeChange={(pageSize) => {
              updateParams({ pageSize, page: 1 });
            }}
          />
        )}
      </div>
 
      <Confirm
        open={pendingDelete !== null}
        title={`Delete ${pendingDelete?.firstName ?? ''} ${pendingDelete?.lastName ?? ''}?`}
        description="This soft-deletes the user and revokes every active session. They can be restored from the database."
        confirmLabel="Delete user"
        variant="danger"
        isPending={deleteUser.isPending}
        onConfirm={onConfirmDelete}
        onCancel={() => {
          setPendingDelete(null);
        }}
      />
    </>
  );
};
 
// Type-narrow which keys the table actually allows sorting on, mirroring
// listUsersQuerySchema.sortBy enum.
const isSortable = (key: string): key is ListUsersQuery['sortBy'] => {
  return ['firstName', 'lastName', 'email', 'createdAt', 'lastLoginAt'].includes(key);
};
