import { NavLink } from 'react-router-dom';
import {
  ArrowLeftRight,
  LayoutDashboard,
  PieChart,
  UserCircle,
} from 'lucide-react';

const MOBILE_LINKS = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/transactions', label: 'Transactions', icon: ArrowLeftRight },
  { to: '/budgets', label: 'Budgets', icon: PieChart },
  { to: '/profile', label: 'Profile', icon: UserCircle },
];

/**
 * Bottom Navigation Bar for Mobile Viewports (< 1024px)
 */
export default function MobileNav() {
  return (
    <nav
      aria-label="Mobile Bottom Navigation"
      className="fixed right-0 bottom-0 left-0 z-40 flex h-[64px] items-center justify-around bg-[#FFFFFF] px-2 shadow-[0px_-2px_6px_0px_rgba(0,0,0,0.08)] lg:hidden"
    >
      {MOBILE_LINKS.map((item) => {
        const Icon = item.icon;
        return (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center gap-1 rounded-[7px] px-3 py-1.5 text-[10px] font-semibold transition-colors ${
                isActive
                  ? 'bg-[#F1F7FF] text-[#0063F9]'
                  : 'text-[#626262] hover:text-[#000000]'
              }`
            }
          >
            <Icon className="h-4 w-4" />
            <span>{item.label}</span>
          </NavLink>
        );
      })}
    </nav>
  );
}

