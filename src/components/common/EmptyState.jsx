import { Inbox } from 'lucide-react';
import Button from './Button.jsx';

/**
 * Reusable Fluent Design System Empty State Component
 * Uses #EBF3FF surface accent thumbnail container from DESIGN.md
 */
export default function EmptyState({
  icon: Icon = Inbox,
  title = 'No data available',
  description = 'Get started by adding your first record.',
  actionLabel,
  onAction,
  actionIcon,
  className = '',
}) {
  return (
    <div
      className={`flex flex-col items-center justify-center rounded-[15px] bg-[#FFFFFF] px-6 py-12 text-center shadow-[0px_2px_5px_0px_rgba(0,0,0,0.09)] ${className}`}
    >
      <div className="mb-4 flex h-[60px] w-[60px] items-center justify-center rounded-[5px] bg-[#EBF3FF] text-[#0063F9]">
        <Icon className="h-7 w-7" />
      </div>

      <h3 className="text-[16px] font-semibold leading-6 text-[#000000]">
        {title}
      </h3>

      {description && (
        <p className="mt-1.5 max-w-md text-[13px] font-medium leading-5 text-[#626262]">
          {description}
        </p>
      )}

      {actionLabel && onAction && (
        <div className="mt-5">
          <Button variant="primary" size="md" icon={actionIcon} onClick={onAction}>
            {actionLabel}
          </Button>
        </div>
      )}
    </div>
  );
}

