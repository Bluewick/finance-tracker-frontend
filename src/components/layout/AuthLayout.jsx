import { Link } from 'react-router-dom';
import { ChartPie, ShieldCheck, TrendingUp, Wallet } from 'lucide-react';

/**
 * Authentication Layout Shell for Login & Register Pages
 * Uses Fluent Design System #F6F8FC canvas, #FFFFFF 15px elevated cards, and Montserrat brand lockup
 */
export default function AuthLayout({ title, subtitle, children, footerText, footerLinkText, footerLinkTo }) {
  return (
    <div className="flex min-h-screen flex-col justify-between bg-[#F6F8FC] text-[#000000]">
      {/* Minimal Top Brand Header */}
      <header className="flex h-16 w-full items-center justify-between bg-[#FFFFFF] px-6 md:px-10 shadow-[0px_2px_5px_0px_rgba(0,0,0,0.07)]">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-[6px] bg-[#0063F9] text-[#FFFFFF]">
            <Wallet className="h-4 w-4" />
          </div>
          <span
            className="text-[21px] font-bold leading-6 tracking-[-0.07em] text-[#000000]"
            style={{ fontFamily: 'var(--font-brand)' }}
          >
            FluentFinance
          </span>
        </Link>

        <div className="hidden sm:flex items-center gap-2 rounded-[21px] bg-[#09F7A1]/[0.10] px-3 py-1 text-[11px] font-semibold text-[#029A6D]">
          <ShieldCheck className="h-3.5 w-3.5" />
          <span>End-to-End JWT Protected</span>
        </div>
      </header>

      {/* Main Split Content */}
      <main className="mx-auto grid w-full max-w-[1160px] flex-1 grid-cols-1 items-center gap-8 px-4 py-10 lg:grid-cols-12 lg:px-8">
        {/* Left Showcase Column (Desktop) */}
        <div className="hidden lg:col-span-6 lg:flex lg:flex-col lg:gap-6 lg:pr-6">
          <span className="inline-flex w-fit items-center gap-1.5 rounded-[5px] bg-[#F1F7FF] px-3 py-1 text-[11px] font-semibold text-[#0063F9]">
            PERSONAL FINANCE INTELLIGENCE
          </span>

          <h1 className="text-[40px] font-semibold leading-[48px] tracking-[-0.02em] text-[#000000]">
            Clarity over every rupee, dollar, and budget goal.
          </h1>

          <p className="text-[14px] font-semibold leading-6 text-[#626262]">
            Track income and expenses across categories, visualize monthly cashflow trends, and stay ahead of spending limits in real time.
          </p>

          {/* Mini Feature Cards matching DESIGN.md */}
          <div className="grid grid-cols-2 gap-4 pt-2">
            <div className="fluent-card p-4">
              <div className="mb-2.5 flex h-10 w-10 items-center justify-center rounded-[5px] bg-[#EBF3FF] text-[#0063F9]">
                <TrendingUp className="h-5 w-5" />
              </div>
              <p className="text-[14px] font-semibold text-[#000000]">
                Visual Cashflow
              </p>
              <p className="mt-1 text-[12px] font-medium text-[#626262]">
                Interactive category breakdowns & 12-month savings trends.
              </p>
            </div>

            <div className="fluent-card p-4">
              <div className="mb-2.5 flex h-10 w-10 items-center justify-center rounded-[5px] bg-[#09F7A1]/[0.15] text-[#029A6D]">
                <ChartPie className="h-5 w-5" />
              </div>
              <p className="text-[14px] font-semibold text-[#000000]">
                Smart Budgets
              </p>
              <p className="mt-1 text-[12px] font-medium text-[#626262]">
                Overall & per-category monthly guardrails with instant alerts.
              </p>
            </div>
          </div>
        </div>

        {/* Right Form Card Column */}
        <div className="lg:col-span-6">
          <div className="fluent-card mx-auto w-full max-w-[460px] p-6 sm:p-8">
            <div className="mb-6">
              <h2 className="text-[26px] font-semibold leading-8 tracking-[-0.02em] text-[#000000]">
                {title}
              </h2>
              {subtitle && (
                <p className="mt-1.5 text-[14px] font-semibold text-[#626262]">
                  {subtitle}
                </p>
              )}
            </div>

            {children}

            {footerText && footerLinkTo && (
              <div className="mt-6 border-t border-black/10 pt-5 text-center text-[13px] font-semibold text-[#626262]">
                {footerText}{' '}
                <Link
                  to={footerLinkTo}
                  className="text-[#0063F9] hover:text-[#0056D6] hover:underline"
                >
                  {footerLinkText}
                </Link>
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className="py-4 text-center text-[12px] font-semibold text-[#767676]">
        FluentFinance — Personal Finance Tracker
      </footer>
    </div>
  );
}

