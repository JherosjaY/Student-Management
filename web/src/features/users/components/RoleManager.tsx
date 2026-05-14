import { useState, type ReactElement } from 'react';
import { Badge } from '@/components/Badge';
import { Button } from '@/components/Button';
import { Select } from '@/components/Select';
import { errorMessage } from '@/lib/api-error';
import { toast } from '@/store/toast-store';
import { roleNameSchema, type PublicUser, type RoleName } from '@/features/auth/schemas';
import { useAddRole, useRemoveRole } from '../hooks';
 
interface RoleManagerProps {
  user: PublicUser;
}
 
const ALL_ROLES = roleNameSchema.options;
 
export const RoleManager = ({ user }: RoleManagerProps): ReactElement => {
  const addRole = useAddRole();
  const removeRole = useRemoveRole();
  const availableToAdd = ALL_ROLES.filter((r) => !user.roles.includes(r));
  const [selected, setSelected] = useState<RoleName | ''>('');
 
  const onAdd = (): void => {
    if (selected === '') {
      return;
    }
    const role = selected;
    addRole.mutate(
      { id: user.id, role },
      {
        onSuccess: () => {
          toast.success(`Added ${role}`);
          setSelected('');
        },
        onError: (err) => {
          toast.error(errorMessage(err));
        },
      },
    );
  };
 
  const onRemove = (role: RoleName): void => {
    removeRole.mutate(
      { id: user.id, role },
      {
        onSuccess: () => {
          toast.success(`Removed ${role}`);
        },
        onError: (err) => {
          toast.error(errorMessage(err));
        },
      },
    );
  };
 
  const isPending = addRole.isPending || removeRole.isPending;
 
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
      <div>
        <h3 style={{ fontSize: 'var(--font-size-sm)', marginBottom: 'var(--space-2)' }}>
          Current roles
        </h3>
        {user.roles.length === 0 ? (
          <p style={{ color: 'var(--color-fg-muted)', fontSize: 'var(--font-size-sm)' }}>
            No roles assigned.
          </p>
        ) : (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
            {user.roles.map((role) => (
              <span
                key={role}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 'var(--space-1)',
                  padding: '2px var(--space-2)',
                  borderRadius: 'var(--radius-md)',
                  background: 'color-mix(in srgb, var(--color-accent) 10%, transparent)',
                  border: '1px solid color-mix(in srgb, var(--color-accent) 30%, transparent)',
                }}
              >
                <Badge variant="accent">{role}</Badge>
                <button
                  type="button"
                  aria-label={`Remove ${role} role`}
                  onClick={() => {
                    onRemove(role);
                  }}
                  disabled={isPending}
                  style={{
                    width: '1.25rem',
                    height: '1.25rem',
                    display: 'grid',
                    placeItems: 'center',
                    borderRadius: 'var(--radius-sm)',
                    color: 'var(--color-fg-muted)',
                    fontSize: 'var(--font-size-base)',
                    lineHeight: 1,
                  }}
                >
                  <span aria-hidden="true">×</span>
                </button>
              </span>
            ))}
          </div>
        )}
      </div>
 
      {availableToAdd.length > 0 && (
        <div>
          <h3 style={{ fontSize: 'var(--font-size-sm)', marginBottom: 'var(--space-2)' }}>
            Add a role
          </h3>
          <div style={{ display: 'flex', gap: 'var(--space-2)', alignItems: 'flex-end' }}>
            <div style={{ flex: 1, maxWidth: '16rem' }}>
              <Select
                value={selected}
                onChange={(e) => {
                  setSelected(e.target.value as RoleName | '');
                }}
                aria-label="Role to add"
              >
                <option value="">Select role…</option>
                {availableToAdd.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </Select>
            </div>
            <Button onClick={onAdd} disabled={selected === '' || isPending} isLoading={addRole.isPending}>
              Add role
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
