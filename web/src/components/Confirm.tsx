import type { ReactElement } from 'react';
import { Modal } from './Modal';
import { Button } from './Button';
 
interface ConfirmProps {
  open: boolean;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'primary';
  isPending?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}
 
// Thin wrapper around Modal for the common "Are you sure?" pattern.
export const Confirm = ({
  open,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'primary',
  isPending = false,
  onConfirm,
  onCancel,
}: ConfirmProps): ReactElement => {
  return (
    <Modal
      open={open}
      onClose={onCancel}
      title={title}
      {...(description !== undefined && { description })}
      size="sm"
      footer={
        <>
          <Button variant="secondary" onClick={onCancel} disabled={isPending}>
            {cancelLabel}
          </Button>
          <Button
            variant={variant === 'danger' ? 'danger' : 'primary'}
            onClick={onConfirm}
            isLoading={isPending}
          >
            {confirmLabel}
          </Button>
        </>
      }
    >
      {/* Body intentionally empty — title + description on the header are enough
          for confirmation prompts. Pass children via the Modal directly if you
          need richer content. */}
      <span className="sr-only">{title}</span>
    </Modal>
  );
};
