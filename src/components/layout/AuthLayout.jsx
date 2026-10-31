import { Link, useLocation } from 'react-router-dom';
import {
  ArrowLeft,
  ChartPie,
  CheckCircle2,
  Sparkles,
  TrendingUp,
} from 'lucide-react';
import BrandLogo from '../common/BrandLogo.jsx';
import { APP_BRAND, CURRENT_YEAR } from '../../utils/constants.util.js';

/**
 * Executive Authentication Layout Shell for Login & Register Pages
 * Uses Fluent Design System #F6F8FC canvas, elevated cards, and institutional-grade typography
 */
export default function AuthLayout({
  title,
  subtitle,
  children,
  footerText,
  footerLinkText,
  footerLinkTo,
}) {
  const location = useLocation();
  const isRegister = location.pathname === '/register';

  return (
    <div className="relative flex min-h-screen flex-col justify-between overflow-hidden bg-[#F6F8FC] text-[#000000]">
      {/* Subtle Ambient Background Accents */}
      <div className="pointer-events-none absolute -top-32 left-1/4 h-[420px] w-[420px] rounded-full bg-[#0063F9]/[0.05] blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 right-10 h-[360px] w-[360px] rounded-full bg-[#09F7A1]/[0.06] blur-3xl" />

      {/* Top Navigation Bar */}
      <header className="relative z-10 border-b border-black/[0.06] bg-white/85 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between px-4 sm:px-6 lg:px-8">
          <BrandLogo to="/" size="md" showSubtitle />

          <div className="flex items-center gap-2.5">
            <Link
              to="/"
              className="fluent-pressable inline-flex items-center gap-1.5 rounded-[8px] border border-black/[0.07] bg-[#FFFFFF] px-3 py-1.5 text-[12px] font-semibold text-[#474747] shadow-2xs transition-colors hover:border-[#0063F9]/30 hover:bg-[#F1F7FF] hover:text-[#0063F9]"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to Home</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Split Content */}
      <main className="relative z-10 mx-auto grid w-full max-w-[1180px] flex-1 grid-cols-1 items-center gap-10 px-4 py-8 sm:px-6 lg:grid-cols-12 lg:py-12 lg:px-8">
        {/* Left Executive Showcase Column (Desktop) */}
        <div className="hidden lg:col-span-6 lg:flex lg:flex-col lg:gap-6 lg:pr-6">
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-[#0063F9]/15 bg-[#EBF3FF] px-3.5 py-1 text-[11px] font-bold uppercase tracking-[0.06em] text-[#0063F9]">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Financial Telemetry & Ledger Suite</span>
          </div>

          <h1
            className="text-[38px] font-bold leading-[46px] tracking-[-0.03em] text-[#000000]"
            style={{ fontFamily: 'var(--font-brand)' }}
          >
            Command your personal wealth with{' '}
            <span className="bg-gradient-to-r from-[#0063F9] to-[#029A6D] bg-clip-text text-transparent">
              executive precision.
            </span>
          </h1>

          <p className="text-[14px] font-medium leading-6 text-[#525252]">
            Designed for disciplined capital allocation. Monitor real-time cashflow velocity, audit multi-category spending, and enforce monthly budget guardrails from one unified workspace.
          </p>

          {/* Live Telemetry Preview Card */}
          <div className="rounded-[14px] border border-black/[0.07] bg-white p-5 shadow-[0_8px_24px_rgba(0,0,0,0.05)]">
            <div className="flex items-center justify-between border-b border-black/[0.06] pb-3.5">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.06em] text-[#767676]">
                  Portfolio Cashflow Snapshot
                </p>
                <p className="mt-0.5 text-[18px] font-bold text-[#000000]">
                  +39.7% Monthly Savings Efficiency
                </p>
              </div>
              <span className="inline-flex items-center gap-1 rounded-full bg-[#09F7A1]/20 px-2.5 py-1 text-[11px] font-bold text-[#029A6D]">
                <TrendingUp className="h-3.5 w-3.5" />
                On Track
              </span>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3.5">
              <div className="rounded-[10px] bg-[#F6F8FC] p-3.5">
                <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-[7px] bg-[#EBF3FF] text-[#0063F9]">
                  <TrendingUp className="h-4 w-4" />
                </div>
                <p className="text-[13px] font-bold text-[#000000]">
                  9+ Live Analytics Charts
                </p>
                <p className="mt-0.5 text-[11px] font-medium leading-4 text-[#626262]">
                  Cumulative wealth curves, weekday heatmaps & sparkline KPIs.
                </p>
              </div>

              <div className="rounded-[10px] bg-[#F6F8FC] p-3.5">
                <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-[7px] bg-[#09F7A1]/[0.18] text-[#029A6D]">
                  <ChartPie className="h-4 w-4" />
                </div>
                <p className="text-[13px] font-bold text-[#000000]">
                  Smart Budget Guardrails
                </p>
                <p className="mt-0.5 text-[11px] font-medium leading-4 text-[#626262]">
                  Automated threshold warnings at 80% utilization across categories.
                </p>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-black/[0.05] pt-3.5 text-[11px] font-semibold text-[#525252]">
              <span className="inline-flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-[#029A6D]" />
                Multi-Currency Engine
              </span>
              <span className="inline-flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-[#029A6D]" />
                Custom Category Ledger
              </span>
              <span className="inline-flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-[#029A6D]" />
                1-Click CSV & JSON Export
              </span>
            </div>
          </div>
        </div>

        {/* Right Form Card Column */}
        <div className="lg:col-span-6">
          <div className="mx-auto w-full max-w-[460px] rounded-[16px] border border-black/[0.08] bg-[#FFFFFF] p-6 shadow-[0_12px_36px_rgba(0,0,0,0.07)] sm:p-8">
            {/* Segmented Mode Switcher (Sign In / Create Account) */}
            <div className="mb-6 grid grid-cols-2 rounded-[10px] bg-[#F3F4F6] p-1">
              <Link
                to="/login"
                className={`rounded-[7px] py-2 text-center text-[12px] font-bold transition-all ${
                  !isRegister
                    ? 'bg-[#FFFFFF] text-[#0063F9] shadow-[0_1px_3px_rgba(0,0,0,0.08)]'
                    : 'text-[#626262] hover:text-[#000000]'
                }`}
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className={`rounded-[7px] py-2 text-center text-[12px] font-bold transition-all ${
                  isRegister
                    ? 'bg-[#FFFFFF] text-[#0063F9] shadow-[0_1px_3px_rgba(0,0,0,0.08)]'
                    : 'text-[#626262] hover:text-[#000000]'
                }`}
              >
                Create Account
              </Link>
            </div>

            <div className="mb-5">
              <h2
                className="text-[24px] font-bold leading-8 tracking-[-0.02em] text-[#000000]"
                style={{ fontFamily: 'var(--font-brand)' }}
              >
                {title}
              </h2>
              {subtitle && (
                <p className="mt-1 text-[13px] font-medium text-[#626262]">
                  {subtitle}
                </p>
              )}
            </div>

            {children}

            {footerText && footerLinkTo && (
              <div className="mt-6 border-t border-black/[0.07] pt-4 text-center text-[12px] font-semibold text-[#626262]">
                {footerText}{' '}
                <Link
                  to={footerLinkTo}
                  className="font-bold text-[#0063F9] hover:text-[#0056D6] hover:underline"
                >
                  {footerLinkText}
                </Link>
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className="relative z-10 py-4 text-center text-[11px] font-semibold text-[#767676]">
        <span>
          © {CURRENT_YEAR} {APP_BRAND.NAME} — {APP_BRAND.TAGLINE}
        </span>
      </footer>
    </div>
  );
}
