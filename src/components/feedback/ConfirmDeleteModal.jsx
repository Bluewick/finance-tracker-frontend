import { Trash2, TriangleAlert } from 'lucide-react';
import Modal from '../common/Modal.jsx';
import Button from '../common/Button.jsx';

/**
 * Confirmation Modal for Destructive Actions (Deleting Transactions or Budgets)
 * Features loading button state to prevent duplicate clicks.
 */
export default function ConfirmDeleteModal({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Deletion',
  itemName = 'this item',
  description,
  confirmText = 'Delete Permanently',
  loading = false,
}) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={loading ? undefined : onClose}
      title={title}
      maxWidth="max-w-md"
      footer={
        <>
          <Button
            variant="ghost"
            size="md"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            variant="dangerSolid"
            size="md"
            icon={Trash2}
            loading={loading}
            loadingText="Deleting..."
            onClick={onConfirm}
          >
            {confirmText}
          </Button>
        </>
      }
    >
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[7px] bg-[#F70909]/[0.08] text-[#840000]">
          <TriangleAlert className="h-6 w-6" />
        </div>
        <div>
          <p className="text-[14px] font-semibold leading-5 text-[#000000]">
            Are you sure you want to delete {itemName}?
          </p>
          <p className="mt-1.5 text-[13px] font-medium leading-5 text-[#626262]">
            {description ||
              'This action cannot be undone and will permanently remove this record from your financial history.'}
          </p>
        </div>
      </div>
    </Modal>
  );
}

