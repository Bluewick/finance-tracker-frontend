import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeftRight,
  Check,
  ChevronDown,
  Coins,
  LayoutDashboard,
  LogOut,
  Menu,
  PieChart,
  Plus,
  Search,
  Settings,
  User,
  X,
} from 'lucide-react';
import useAuth from '../../hooks/useAuth.js';
import useToast from '../../hooks/useToast.js';
import { SUPPORTED_CURRENCIES } from '../../utils/constants.util.js';
import {
  getCurrencySymbol,
  getExchangeRateLabel,
} from '../../utils/formatters.util.js';
import BrandLogo from '../common/BrandLogo.jsx';
import Spinner from '../feedback/Spinner.jsx';

/**
 * Global Navigation Bar (Header)
 * Refined medium height (64px / h-16) with:
 * - Compact Search Bar & subtle "Ctrl K" shortcut tag
 * - Sleek "Transaction +" pill action button
 * - Interactive Currency Popover Dropdown (switches currency via PATCH /api/users/me)
 * - Interactive Profile Avatar Popover Dropdown (Profile, Navigation, Settings, and Sign out)
 * - No notification bell or cluttered inline buttons
 */
export default function Navbar({
  onToggleMobileSidebar,
  isMobileSidebarOpen = false,
  onQuickAddTransaction,
}) {
  const { user, currency, updateProfile, logout } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [currencyMenuOpen, setCurrencyMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [updatingCurrency, setUpdatingCurrency] = useState('');
  const [loggingOut, setLoggingOut] = useState(false);

  const searchInputRef = useRef(null);
  const currencyDropdownRef = useRef(null);
  const profileDropdownRef = useRef(null);

  // Support Ctrl+K / Cmd+K keyboard shortcut to focus search & Escape to close menus
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      } else if (e.key === 'Escape') {
        setCurrencyMenuOpen(false);
        setProfileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Close dropdown menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        currencyDropdownRef.current &&
        !currencyDropdownRef.current.contains(e.target)
      ) {
        setCurrencyMenuOpen(false);
      }
      if (
        profileDropdownRef.current &&
        !profileDropdownRef.current.contains(e.target)
      ) {
        setProfileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const trimmed = searchQuery.trim();
    if (trimmed) {
      navigate(`/transactions?search=${encodeURIComponent(trimmed)}`);
    } else {
      navigate('/transactions');
    }
  };

  const handleQuickAdd = () => {
    if (onQuickAddTransaction) {
      onQuickAddTransaction();
    } else {
      navigate('/transactions?action=new');
    }
  };

  const handleCurrencySelect = async (newCode) => {
    if (newCode === currency) {
      setCurrencyMenuOpen(false);
      return;
    }

    setUpdatingCurrency(newCode);
    try {
      await updateProfile({
        name: user?.name || 'User',
        currency: newCode,
      });
      toast.success(
        `Converted all figures to ${newCode} (${getCurrencySymbol(newCode)}) • ${getExchangeRateLabel(newCode)}.`,
        'Currency Converted'
      );
      setCurrencyMenuOpen(false);
    } catch (err) {
      toast.error(
        err.message || 'Could not update currency preference.',
        'Currency Error'
      );
    } finally {
      setUpdatingCurrency('');
    }
  };

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await logout();
      setProfileMenuOpen(false);
      toast.info('You have been signed out safely.', 'Signed Out');
      navigate('/login', { replace: true });
    } finally {
      setLoggingOut(false);
    }
  };

  const userInitials = (user?.name || 'User')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');

  return (
    <header className="fixed top-0 right-0 left-0 z-50 flex h-16 w-full items-center justify-between bg-[#FFFFFF] px-4 sm:px-6 lg:px-10 shadow-[0px_2px_5px_0px_rgba(0,0,0,0.07)]">
      {/* Left: Mobile Menu Trigger + Brand Lockup */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onToggleMobileSidebar}
          className="fluent-pressable flex h-9 w-9 items-center justify-center rounded-[7px] bg-black/[0.04] text-[#1E1E1E] lg:hidden"
          aria-label="Toggle navigation menu"
        >
          {isMobileSidebarOpen ? (
            <X className="h-4 w-4" />
          ) : (
            <Menu className="h-4 w-4" />
          )}
        </button>

        <BrandLogo to="/dashboard" size="md" />
      </div>

      {/* Center: Compact Global Search Input with subtle Ctrl+K tag */}
      <form
        onSubmit={handleSearchSubmit}
        className="hidden md:flex w-full max-w-[380px] items-center justify-between rounded-[8px] bg-[#F5F5F5] py-1.5 pr-1.5 pl-3 transition-all focus-within:bg-[#FFFFFF] focus-within:ring-2 focus-within:ring-[#0063F9]/25"
      >
        <div className="flex flex-1 items-center gap-2">
          <Search className="h-4 w-4 shrink-0 text-[#767676]" />
          <input
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search transactions, notes..."
            className="w-full bg-transparent text-[13px] font-semibold leading-5 text-[#000000] placeholder:font-medium placeholder:text-[#767676] focus:outline-none"
          />
        </div>
        <kbd className="shrink-0 rounded-[4px] bg-[#FFFFFF] px-1.5 py-0.5 text-[10px] font-semibold leading-4 text-[#767676] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.08)]">
          Ctrl K
        </kbd>
      </form>

      {/* Right: Quick Action Pill + Currency Dropdown + Profile Avatar Dropdown */}
      <div className="flex items-center gap-2.5">
        {/* Sleek Pill Action Button (inspired by "Share +" pill in reference design) */}
        <button
          type="button"
          onClick={handleQuickAdd}
          className="fluent-pressable hidden sm:inline-flex items-center gap-1.5 rounded-full border border-black/[0.08] bg-[#F6F8FC] px-3.5 py-1.5 text-[13px] font-semibold text-[#000000] shadow-[0px_1px_2px_rgba(0,0,0,0.04)] hover:border-[#0063F9]/30 hover:bg-[#F1F7FF] hover:text-[#0063F9]"
        >
          <span>Record</span>
          <Plus className="h-3.5 w-3.5" />
        </button>

        {/* 1. Currency Selector Dropdown */}
        <div ref={currencyDropdownRef} className="relative">
          <button
            type="button"
            onClick={() => {
              setCurrencyMenuOpen((prev) => !prev);
              setProfileMenuOpen(false);
            }}
            aria-expanded={currencyMenuOpen}
            aria-haspopup="menu"
            title="Switch Display Currency"
            className={`fluent-pressable inline-flex h-9 items-center gap-1.5 rounded-full border px-3 text-[12px] font-semibold transition-all ${
              currencyMenuOpen
                ? 'border-[#0063F9]/40 bg-[#F1F7FF] text-[#0063F9]'
                : 'border-black/[0.08] bg-[#FFFFFF] text-[#1E1E1E] hover:bg-[#F5F5F5]'
            }`}
          >
            <span className="font-bold text-[#0063F9]">
              {getCurrencySymbol(currency)}
            </span>
            <span>{currency}</span>
            <ChevronDown
              className={`h-3.5 w-3.5 text-[#767676] transition-transform duration-150 ${
                currencyMenuOpen ? 'rotate-180 text-[#0063F9]' : ''
              }`}
            />
          </button>

          {currencyMenuOpen && (
            <div
              role="menu"
              className="absolute right-0 mt-2 w-56 origin-top-right rounded-[16px] border border-black/[0.06] bg-[#FFFFFF] p-2 shadow-[0px_10px_30px_0px_rgba(0,0,0,0.10)]"
            >
              <div className="px-3 py-1.5">
                <p className="text-[11px] font-semibold tracking-wide text-[#767676] uppercase">
                  Display Currency
                </p>
              </div>

              <div className="space-y-0.5">
                {SUPPORTED_CURRENCIES.map((curr) => {
                  const isSelected = curr.code === currency;
                  const isSavingThis = updatingCurrency === curr.code;

                  return (
                    <button
                      key={curr.code}
                      type="button"
                      role="menuitem"
                      disabled={Boolean(updatingCurrency)}
                      onClick={() => handleCurrencySelect(curr.code)}
                      className={`flex w-full items-center justify-between rounded-[10px] px-3 py-2 text-left text-[13px] font-semibold transition-colors ${
                        isSelected
                          ? 'bg-[#F5F5F5] text-[#000000]'
                          : 'text-[#474747] hover:bg-[#F5F5F5]/80 hover:text-[#000000]'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="flex h-6 w-6 items-center justify-center rounded-[6px] bg-[#F1F7FF] text-[12px] font-bold text-[#0063F9]">
                          {curr.symbol}
                        </span>
                        <div>
                          <p className="leading-4">{curr.code}</p>
                          <p className="text-[11px] font-medium text-[#767676]">
                            {curr.name.replace(/\s*\(.*\)/, '')}
                          </p>
                          <p className="text-[10px] font-semibold text-[#0063F9]">
                            {getExchangeRateLabel(curr.code)}
                          </p>
                        </div>
                      </div>

                      {isSavingThis ? (
                        <Spinner size="xs" variant="primary" />
                      ) : isSelected ? (
                        <Check className="h-4 w-4 text-[#0063F9]" />
                      ) : null}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* 2. Profile Avatar Trigger & Floating Dropdown Menu (matching uploaded reference image) */}
        <div ref={profileDropdownRef} className="relative">
          <button
            type="button"
            onClick={() => {
              setProfileMenuOpen((prev) => !prev);
              setCurrencyMenuOpen(false);
            }}
            aria-expanded={profileMenuOpen}
            aria-haspopup="menu"
            aria-label="Open account menu"
            className={`fluent-pressable flex h-10 w-10 items-center justify-center rounded-full p-0.5 transition-all ${
              profileMenuOpen
                ? 'ring-2 ring-[#0063F9] ring-offset-1'
                : 'ring-1 ring-black/10 hover:ring-[#0063F9]/50'
            }`}
          >
            <div className="flex h-full w-full items-center justify-center rounded-full bg-gradient-to-tr from-[#0063F9] to-[#4891FF] text-[12px] font-bold text-[#FFFFFF]">
              {userInitials}
            </div>
          </button>

          {profileMenuOpen && (
            <div
              role="menu"
              className="absolute right-0 mt-2.5 w-60 origin-top-right rounded-[16px] border border-black/[0.06] bg-[#FFFFFF] p-2 shadow-[0px_10px_30px_0px_rgba(0,0,0,0.10)]"
            >
              {/* Signed-In User Header */}
              <div className="mb-1 border-b border-black/[0.06] px-3 py-2">
                <p className="truncate text-[13px] font-semibold text-[#000000]">
                  {user?.name || 'Personal Account'}
                </p>
                <p className="truncate text-[11px] font-medium text-[#767676]">
                  {user?.email}
                </p>
              </div>

              {/* Primary Menu Items */}
              <div className="space-y-0.5">
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    setProfileMenuOpen(false);
                    navigate('/profile');
                  }}
                  className="flex w-full items-center gap-3 rounded-[10px] px-3 py-2 text-left text-[13px] font-semibold text-[#1E1E1E] transition-colors hover:bg-[#F5F5F5]"
                >
                  <User className="h-4 w-4 text-[#474747]" />
                  <span>Profile</span>
                </button>

                <button
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    setProfileMenuOpen(false);
                    navigate('/dashboard');
                  }}
                  className="flex w-full items-center gap-3 rounded-[10px] px-3 py-2 text-left text-[13px] font-semibold text-[#1E1E1E] transition-colors hover:bg-[#F5F5F5]"
                >
                  <LayoutDashboard className="h-4 w-4 text-[#474747]" />
                  <span>Dashboard</span>
                </button>

                <button
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    setProfileMenuOpen(false);
                    navigate('/transactions');
                  }}
                  className="flex w-full items-center gap-3 rounded-[10px] px-3 py-2 text-left text-[13px] font-semibold text-[#1E1E1E] transition-colors hover:bg-[#F5F5F5]"
                >
                  <ArrowLeftRight className="h-4 w-4 text-[#474747]" />
                  <span>Transactions</span>
                </button>

                <button
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    setProfileMenuOpen(false);
                    navigate('/budgets');
                  }}
                  className="flex w-full items-center justify-between rounded-[10px] px-3 py-2 text-left text-[13px] font-semibold text-[#1E1E1E] transition-colors hover:bg-[#F5F5F5]"
                >
                  <div className="flex items-center gap-3">
                    <PieChart className="h-4 w-4 text-[#474747]" />
                    <span>Budgets</span>
                  </div>
                  <span className="rounded-[6px] bg-[#F1F7FF] px-2 py-0.5 text-[10px] font-bold text-[#0063F9]">
                    CAP
                  </span>
                </button>

                <button
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    setProfileMenuOpen(false);
                    navigate('/profile');
                  }}
                  className="flex w-full items-center justify-between rounded-[10px] px-3 py-2 text-left text-[13px] font-semibold text-[#1E1E1E] transition-colors hover:bg-[#F5F5F5]"
                >
                  <div className="flex items-center gap-3">
                    <Settings className="h-4 w-4 text-[#474747]" />
                    <span>Settings</span>
                  </div>
                  <span className="inline-flex items-center gap-1 rounded-[6px] bg-[#F5F5F5] px-1.5 py-0.5 text-[10px] font-semibold text-[#626262]">
                    <Coins className="h-3 w-3 text-[#0063F9]" />
                    {currency}
                  </span>
                </button>
              </div>

              {/* Subtle Divider + Sign out */}
              <div className="my-1.5 border-t border-black/[0.06]" />

              <button
                type="button"
                role="menuitem"
                disabled={loggingOut}
                onClick={handleLogout}
                className="flex w-full items-center gap-3 rounded-[10px] px-3 py-2 text-left text-[13px] font-semibold text-[#1E1E1E] transition-colors hover:bg-[#F70909]/[0.07] hover:text-[#840000] disabled:opacity-60"
              >
                {loggingOut ? (
                  <Spinner size="xs" variant="danger" />
                ) : (
                  <LogOut className="h-4 w-4 text-[#474747]" />
                )}
                <span>{loggingOut ? 'Signing out...' : 'Sign out'}</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
