import { NavLink, useNavigate } from 'react-router-dom';
import {
  ArrowLeftRight,
  ChevronRight,
  LayoutDashboard,
  PieChart,
  Plus,
  UserCircle,
} from 'lucide-react';

const NAV_ITEMS = [
  {
    to: '/dashboard',
    label: 'Dashboard Overview',
    icon: LayoutDashboard,
  },
  {
    to: '/transactions',
    label: 'Transactions History',
    icon: ArrowLeftRight,
  },
  {
    to: '/budgets',
    label: 'Monthly Budgets',
    icon: PieChart,
  },
  {
    to: '/profile',
    label: 'Profile & Security',
    icon: UserCircle,
  },
];

/**
 * Sidebar Navigation
 * Clean, distraction-free navigation panel with a polished "Record Transaction" trigger
 * and active/inactive navigation states matching DESIGN.md.
 */
export default function Sidebar({
  isOpen = false,
  onClose,
  onQuickAddTransaction,
}) {
  const navigate = useNavigate();

  const handleQuickAdd = () => {
    onClose?.();
    if (onQuickAddTransaction) {
      onQuickAddTransaction();
    } else {
      navigate('/transactions?action=new');
    }
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-[2px] lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed top-16 bottom-0 left-0 z-40 flex w-[310px] flex-col bg-[#FFFFFF] px-[24px] py-6 shadow-[0px_0px_4px_0px_rgba(0,0,0,0.09)] transition-transform duration-200 ease-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col gap-5">
          {/* Polished "Record Transaction" Primary Action Button */}
          <button
            type="button"
            onClick={handleQuickAdd}
            className="fluent-pressable group flex w-full items-center justify-between rounded-[10px] bg-gradient-to-r from-[#0063F9] to-[#267DFF] p-3 text-left text-[#FFFFFF]  transition-all hover:from-[#0056D6] hover:to-[#0063F9] hover:shadow-[0px_6px_16px_0px_rgba(0,99,249,0.30)]"
          >
            <div className="flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-[7px] bg-white/20 text-[#FFFFFF] transition-transform duration-150 group-hover:scale-105">
                <Plus className="h-4 w-4 stroke-[2.5]" />
              </span>
              <div>
                <p className="text-[13px] font-semibold leading-4 text-[#FFFFFF]">
                  Record Transaction
                </p>
                <p className="mt-0.5 text-[10px] font-medium text-white/80">
                  Add income or expense
                </p>
              </div>
            </div>

            <ChevronRight className="h-4 w-4 text-white/80 transition-transform duration-150 group-hover:translate-x-0.5 group-hover:text-white" />
          </button>

          {/* Primary Menu List */}
          <nav className="flex flex-col gap-1.5" aria-label="Main Navigation">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `group flex w-full items-center justify-between rounded-[7px] p-[15px] transition-colors duration-120 ${
                      isActive
                        ? 'bg-[#F1F7FF] text-[#0063F9] font-semibold'
                        : 'bg-transparent text-[#1E1E1E] font-normal hover:bg-[#F1F7FF]/60'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <div className="flex items-center gap-3">
                        <Icon
                          className={`h-4 w-4 shrink-0 ${
                            isActive
                              ? 'text-[#0063F9]'
                              : 'text-[#626262] group-hover:text-[#0063F9]'
                          }`}
                        />
                        <span className="text-[12px] leading-[16px]">
                          {item.label}
                        </span>
                      </div>

                      {isActive && (
                        <ChevronRight className="h-4 w-4 shrink-0 text-[#0063F9]" />
                      )}
                    </>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>
      </aside>
    </>
  );
}
