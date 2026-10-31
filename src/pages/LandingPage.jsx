import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowDownLeft,
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  CheckCircle2,
  Coins,
  Download,
  Layers,
  Lock,
  PieChart,
  Plus,
  Sparkles,
  Target,
  TrendingUp,
} from 'lucide-react';
import BrandLogo from '../components/common/BrandLogo.jsx';
import useAuth from '../hooks/useAuth.js';
import { APP_BRAND, SUPPORTED_CURRENCIES } from '../utils/constants.util.js';
import { formatCurrency } from '../utils/formatters.util.js';

const PREVIEW_BARS = [
  { month: 'May', income: 62, expense: 38, savings: 48 },
  { month: 'Jun', income: 70, expense: 42, savings: 54 },
  { month: 'Jul', income: 66, expense: 35, savings: 58 },
  { month: 'Aug', income: 78, expense: 44, savings: 64 },
  { month: 'Sep', income: 84, expense: 39, savings: 72 },
  { month: 'Oct', income: 95, expense: 32, savings: 86 },
];

const CORE_FEATURES = [
  {
    icon: Layers,
    title: 'Smart Categorization & Custom Labels',
    description:
      'Log inflows and outflows across curated categories or define your own custom categories on the fly with instant search and date-range filtering.',
    badge: 'Smart Ledger',
  },
  {
    icon: BarChart3,
    title: '7+ Interactive Financial Charts',
    description:
      'Visualize 12-month cashflow bars, category donut shares, cumulative net worth trajectories, weekday spending patterns, and KPI sparklines.',
    badge: 'Visual Intelligence',
  },
  {
    icon: Target,
    title: 'Monthly Budget Guardrails',
    description:
      'Set an overall monthly ceiling ("ALL") alongside granular category caps with real-time progress bars and overspending alerts.',
    badge: 'Cap Tracking',
  },
  {
    icon: Coins,
    title: 'Native Multi-Currency Formatting',
    description:
      'Switch seamlessly between INR (₹), USD ($), EUR (€), and GBP (£) with locale-accurate number grouping across every metric and chart.',
    badge: '4 Currencies',
  },
  {
    icon: Download,
    title: 'One-Click CSV Reporting',
    description:
      'Export your complete or filtered transaction history into clean, accountant-ready CSV spreadsheets directly from your browser.',
    badge: 'Instant Export',
  },
  {
    icon: Lock,
    title: 'Private & Secure by Design',
    description:
      'Your personal financial records stay isolated to your private workspace with full self-service account and password controls.',
    badge: 'Privacy First',
  },
];

const WORKFLOW_STEPS = [
  {
    step: '01',
    title: 'Create Your Workspace',
    description:
      'Sign up in seconds and select your preferred display currency (INR, USD, EUR, or GBP) anytime from the top bar.',
  },
  {
    step: '02',
    title: 'Record & Set Monthly Caps',
    description:
      'Add your income and expense entries from any screen and configure monthly budget limits for key categories.',
  },
  {
    step: '03',
    title: 'Track Wealth & Optimize Spend',
    description:
      'Monitor your live savings rate, cumulative net balance curve, and category ticket averages in real time.',
  },
];

/**
 * Professional SaaS Landing Page (/)
 * Strictly aligned with DESIGN.md (Fluent Design System)
 * Links directly to dedicated /login and /register routes (or /dashboard if signed in)
 */
export default function LandingPage() {
  const { isAuthenticated, user } = useAuth();
  const [previewCurrency, setPreviewCurrency] = useState('INR');

  // Base INR sample figures — formatCurrency automatically converts using live FX rates
  const sampleIncome = 85000;
  const sampleExpense = 24800;
  const sampleNet = sampleIncome - sampleExpense;

  return (
    <div className="min-h-screen bg-[#F6F8FC] text-[#000000]">
      {/* Top Navigation Bar (h-16, #FFFFFF, soft ambient shadow) */}
      <header className="sticky top-0 z-50 flex h-16 w-full items-center justify-between bg-[#FFFFFF]/95 px-4 sm:px-8 lg:px-14 shadow-[0px_2px_5px_0px_rgba(0,0,0,0.07)] backdrop-blur-md">
        <BrandLogo to="/" size="md" />

        {/* Center Section Anchors (Desktop) */}
        <nav className="hidden md:flex items-center gap-7 text-[13px] font-semibold text-[#474747]">
          <a
            href="#features"
            className="transition-colors hover:text-[#0063F9]"
          >
            Capabilities
          </a>
          <a
            href="#workflow"
            className="transition-colors hover:text-[#0063F9]"
          >
            How It Works
          </a>
          <a
            href="#preview"
            className="transition-colors hover:text-[#0063F9]"
          >
            Live Preview
          </a>
        </nav>

        {/* Right Auth CTAs */}
        <div className="flex items-center gap-2.5">
          {isAuthenticated ? (
            <Link
              to="/dashboard"
              className="fluent-pressable inline-flex items-center gap-2 rounded-[7px] bg-[#0063F9] px-4 py-2 text-[13px] font-semibold text-[#FFFFFF] shadow-[0px_2px_5px_0px_rgba(0,0,0,0.09)] hover:bg-[#0056D6]"
            >
              <span>Go to Dashboard ({user?.name?.split(' ')[0] || 'Account'})</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          ) : (
            <>
              <Link
                to="/login"
                className="fluent-pressable rounded-[7px] px-3.5 py-2 text-[13px] font-semibold text-[#1E1E1E] transition-colors hover:bg-[#F1F7FF] hover:text-[#0063F9]"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="fluent-pressable inline-flex items-center gap-1.5 rounded-[7px] bg-[#0063F9] px-4 py-2 text-[13px] font-semibold text-[#FFFFFF] shadow-[0px_2px_5px_0px_rgba(0,0,0,0.09)] hover:bg-[#0056D6]"
              >
                <span>Get Started</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="mx-auto max-w-[1320px] px-4 pt-10 pb-16 sm:px-8 lg:px-14 lg:pt-16 lg:pb-24">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12">
          {/* Left Hero Copy */}
          <div className="flex flex-col items-start lg:col-span-6">
            <div className="inline-flex items-center gap-2 rounded-full bg-[#F1F7FF] px-3.5 py-1.5 text-[11px] font-semibold text-[#0063F9] ring-1 ring-[#0063F9]/20">
              <Sparkles className="h-3.5 w-3.5" />
              <span>PERSONAL FINANCE INTELLIGENCE PLATFORM</span>
            </div>

            <h1 className="mt-5 text-[34px] sm:text-[44px] xl:text-[50px] font-semibold leading-[1.12] tracking-[-0.025em] text-[#000000]">
              Clarity over every transaction, budget cap, and savings goal.
            </h1>

            <p className="mt-4 max-w-xl text-[15px] font-medium leading-7 text-[#474747]">
              {APP_BRAND.NAME} pairs high-signal visual analytics with effortless daily expense tracking. Monitor category breakdowns, monthly cashflow trends, and budget guardrails in one luminous workspace.
            </p>

            {/* Primary Hero CTA Buttons */}
            <div className="mt-7 flex flex-wrap items-center gap-3.5">
              {isAuthenticated ? (
                <Link
                  to="/dashboard"
                  className="fluent-pressable inline-flex items-center gap-2 rounded-[8px] bg-[#0063F9] px-6 py-3 text-[14px] font-semibold text-[#FFFFFF] shadow-[0px_4px_14px_0px_rgba(0,99,249,0.28)] hover:bg-[#0056D6]"
                >
                  <span>Open Your Dashboard</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              ) : (
                <>
                  <Link
                    to="/register"
                    className="fluent-pressable inline-flex items-center gap-2 rounded-[8px] bg-[#0063F9] px-6 py-3 text-[14px] font-semibold text-[#FFFFFF] shadow-[0px_4px_14px_0px_rgba(0,99,249,0.28)] hover:bg-[#0056D6]"
                  >
                    <span>Create Free Account</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>

                  <Link
                    to="/login"
                    className="fluent-pressable inline-flex items-center gap-2 rounded-[8px] bg-[#FFFFFF] px-6 py-3 text-[14px] font-semibold text-[#1E1E1E] shadow-[0px_2px_5px_0px_rgba(0,0,0,0.09)] hover:bg-[#F1F7FF] hover:text-[#0063F9]"
                  >
                    <span>Sign In to Existing Account</span>
                  </Link>
                </>
              )}
            </div>

            {/* Trust Highlights */}
            <div className="mt-8 grid grid-cols-3 gap-4 border-t border-black/10 pt-6 w-full max-w-lg">
              <div>
                <p className="text-[20px] font-bold text-[#000000]">9+ Charts</p>
                <p className="text-[12px] font-medium text-[#626262]">
                  Live Visual Analytics
                </p>
              </div>
              <div>
                <p className="text-[20px] font-bold text-[#000000]">4 Currencies</p>
                <p className="text-[12px] font-medium text-[#626262]">
                  INR, USD, EUR & GBP
                </p>
              </div>
              <div>
                <p className="text-[20px] font-bold text-[#000000]">100% Private</p>
                <p className="text-[12px] font-medium text-[#626262]">
                  Personal Workspace
                </p>
              </div>
            </div>
          </div>

          {/* Right Interactive Dashboard Mockup Preview */}
          <div id="preview" className="lg:col-span-6">
            <div className="fluent-card relative overflow-hidden border border-black/[0.06] p-4 sm:p-6 shadow-[0px_12px_36px_0px_rgba(0,0,0,0.08)]">
              {/* Mockup Top Bar with Interactive Currency Switcher */}
              <div className="mb-4 flex flex-wrap items-center justify-between gap-2 border-b border-black/[0.07] pb-3.5">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#09F7A1]" />
                  <span className="text-[12px] font-semibold text-[#000000]">
                    Interactive Preview — Click Currency:
                  </span>
                </div>

                <div className="flex items-center gap-1 rounded-[7px] bg-[#F5F5F5] p-1">
                  {SUPPORTED_CURRENCIES.map((curr) => (
                    <button
                      key={curr.code}
                      type="button"
                      onClick={() => setPreviewCurrency(curr.code)}
                      className={`fluent-pressable rounded-[5px] px-2 py-1 text-[11px] font-semibold transition-all ${
                        previewCurrency === curr.code
                          ? 'bg-[#FFFFFF] text-[#0063F9] shadow-[0px_1px_3px_rgba(0,0,0,0.1)]'
                          : 'text-[#626262] hover:text-[#000000]'
                      }`}
                    >
                      {curr.symbol} {curr.code}
                    </button>
                  ))}
                </div>
              </div>

              {/* Mini KPI Row */}
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div className="rounded-[12px] bg-[#F6F8FC] p-3">
                  <span className="text-[11px] font-semibold text-[#626262]">
                    Monthly Income
                  </span>
                  <p className="mt-1 text-[20px] font-semibold text-[#000000]">
                    {formatCurrency(sampleIncome, previewCurrency)}
                  </p>
                  <span className="mt-1 inline-flex items-center gap-0.5 rounded-[21px] bg-[#09F7A1]/15 px-2 py-0.5 text-[10px] font-semibold text-[#029A6D]">
                    <ArrowUpRight className="h-3 w-3" /> +18.4%
                  </span>
                </div>

                <div className="rounded-[12px] bg-[#F6F8FC] p-3">
                  <span className="text-[11px] font-semibold text-[#626262]">
                    Monthly Expenses
                  </span>
                  <p className="mt-1 text-[20px] font-semibold text-[#000000]">
                    {formatCurrency(sampleExpense, previewCurrency)}
                  </p>
                  <span className="mt-1 inline-flex items-center gap-0.5 rounded-[21px] bg-[#F70909]/10 px-2 py-0.5 text-[10px] font-semibold text-[#840000]">
                    <ArrowDownLeft className="h-3 w-3" /> 29.2% of Inflow
                  </span>
                </div>

                <div className="rounded-[12px] bg-[#F1F7FF] p-3">
                  <span className="text-[11px] font-semibold text-[#0063F9]">
                    Net Savings
                  </span>
                  <p className="mt-1 text-[20px] font-semibold text-[#000000]">
                    {formatCurrency(sampleNet, previewCurrency)}
                  </p>
                  <span className="mt-1 inline-flex items-center gap-0.5 rounded-[21px] bg-[#09F7A1]/15 px-2 py-0.5 text-[10px] font-semibold text-[#029A6D]">
                    70.8% Saved
                  </span>
                </div>
              </div>

              {/* Recessed Plotting Area Mockup (#F1F6FF, 10px radius) */}
              <div className="mt-4 rounded-[10px] bg-[#F1F6FF] p-4">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-[12px] font-semibold text-[#000000]">
                    Cashflow & Net Savings Trajectory
                  </span>
                  <div className="flex items-center gap-3 text-[10px] font-semibold">
                    <span className="flex items-center gap-1 text-[#000000]">
                      <span className="h-2 w-2 rounded-full bg-[#4891FF]" /> Income
                    </span>
                    <span className="flex items-center gap-1 text-[#000000]">
                      <span className="h-2 w-2 rounded-full bg-[#064099]" /> Expense
                    </span>
                    <span className="flex items-center gap-1 text-[#000000]">
                      <span className="h-2 w-2 rounded-full bg-[#09F7A1]" /> Saved
                    </span>
                  </div>
                </div>

                <div className="flex h-[130px] items-end justify-between gap-2 pt-4">
                  {PREVIEW_BARS.map((bar) => (
                    <div
                      key={bar.month}
                      className="flex flex-1 flex-col items-center gap-1.5"
                    >
                      <div className="flex h-[100px] w-full items-end justify-center gap-1">
                        <div
                          className="w-2.5 rounded-t-[3px] bg-[#4891FF] transition-all duration-300"
                          style={{ height: `${bar.income}%` }}
                        />
                        <div
                          className="w-2.5 rounded-t-[3px] bg-[#064099] transition-all duration-300"
                          style={{ height: `${bar.expense}%` }}
                        />
                        <div
                          className="w-2.5 rounded-t-[3px] bg-[#09F7A1] transition-all duration-300"
                          style={{ height: `${bar.savings}%` }}
                        />
                      </div>
                      <span className="text-[10px] font-semibold text-[#626262]">
                        {bar.month}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sample Budget Guardrail Bar */}
              <div className="mt-4 flex items-center justify-between rounded-[10px] bg-[#F6F8FC] p-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-[5px] bg-[#EBF3FF] text-[#0063F9]">
                    <PieChart className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-[12px] font-semibold text-[#000000]">
                      Overall Monthly Cap (ALL)
                    </p>
                    <p className="text-[11px] font-medium text-[#626262]">
                      49.6% utilized • On Track
                    </p>
                  </div>
                </div>

                <span className="inline-flex items-center gap-1 rounded-[21px] bg-[#09F7A1]/15 px-2.5 py-1 text-[10px] font-semibold text-[#029A6D]">
                  <CheckCircle2 className="h-3 w-3" /> Healthy Buffer
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Capabilities Section */}
      <section
        id="features"
        className="border-y border-black/[0.06] bg-[#FFFFFF] py-16 lg:py-20"
      >
        <div className="mx-auto max-w-[1320px] px-4 sm:px-8 lg:px-14">
          <div className="mx-auto max-w-2xl text-center">
            <span className="inline-flex rounded-[5px] bg-[#F1F7FF] px-3 py-1 text-[11px] font-semibold text-[#0063F9] uppercase">
              Built for Financial Clarity
            </span>
            <h2 className="mt-3 text-[28px] sm:text-[34px] font-semibold leading-tight tracking-[-0.02em] text-[#000000]">
              Everything you need to command your personal cashflow
            </h2>
            <p className="mt-2.5 text-[14px] font-medium leading-6 text-[#626262]">
              Crafted for effortless daily tracking, clear visual insights, and zero clutter.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {CORE_FEATURES.map((feat) => {
              const Icon = feat.icon;
              return (
                <div
                  key={feat.title}
                  className="fluent-card fluent-card-interactive flex flex-col justify-between border border-black/[0.05] bg-[#F6F8FC]/60 p-5"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <div className="flex h-11 w-11 items-center justify-center rounded-[7px] bg-[#EBF3FF] text-[#0063F9]">
                        <Icon className="h-5 w-5" />
                      </div>
                      <span className="rounded-[21px] bg-[#FFFFFF] px-2.5 py-1 text-[10px] font-semibold text-[#0063F9] shadow-[0px_1px_3px_rgba(0,0,0,0.06)]">
                        {feat.badge}
                      </span>
                    </div>

                    <h3 className="mt-4 text-[16px] font-semibold text-[#000000]">
                      {feat.title}
                    </h3>
                    <p className="mt-1.5 text-[13px] font-medium leading-5 text-[#626262]">
                      {feat.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="workflow" className="mx-auto max-w-[1320px] px-4 py-16 sm:px-8 lg:px-14 lg:py-20">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex rounded-[5px] bg-[#F1F7FF] px-3 py-1 text-[11px] font-semibold text-[#0063F9] uppercase">
            Streamlined Workflow
          </span>
          <h2 className="mt-3 text-[28px] sm:text-[34px] font-semibold tracking-[-0.02em] text-[#000000]">
            From sign-up to live financial insights in 3 steps
          </h2>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-3">
          {WORKFLOW_STEPS.map((item) => (
            <div key={item.step} className="fluent-card p-6">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-[6px] bg-[#0063F9] text-[12px] font-bold text-[#FFFFFF]">
                {item.step}
              </span>
              <h3 className="mt-4 text-[16px] font-semibold text-[#000000]">
                {item.title}
              </h3>
              <p className="mt-1.5 text-[13px] font-medium leading-5 text-[#626262]">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom Call-To-Action Banner */}
      <section className="mx-auto max-w-[1320px] px-4 pb-16 sm:px-8 lg:px-14">
        <div className="flex flex-col items-center justify-between gap-6 rounded-[18px] bg-gradient-to-r from-[#0063F9] to-[#0056D6] p-8 text-center text-[#FFFFFF] shadow-[0px_10px_30px_0px_rgba(0,99,249,0.22)] md:flex-row md:px-12 md:py-10 md:text-left">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-[11px] font-semibold text-white">
              <TrendingUp className="h-3.5 w-3.5" />
              <span>READY TO TAKE CONTROL?</span>
            </div>
            <h2 className="mt-3 text-[26px] sm:text-[32px] font-semibold leading-tight">
              Start tracking your personal finances today.
            </h2>
            <p className="mt-1.5 text-[14px] font-medium text-white/85">
              Create a free account or sign in to access your dashboard, transactions, and monthly budgets.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 shrink-0">
            {isAuthenticated ? (
              <Link
                to="/dashboard"
                className="fluent-pressable inline-flex items-center gap-2 rounded-[8px] bg-[#FFFFFF] px-6 py-3 text-[14px] font-semibold text-[#0063F9] shadow-[0px_4px_12px_rgba(0,0,0,0.12)] hover:bg-[#F1F7FF]"
              >
                <span>Launch Dashboard</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            ) : (
              <>
                <Link
                  to="/register"
                  className="fluent-pressable inline-flex items-center gap-2 rounded-[8px] bg-[#FFFFFF] px-5 py-3 text-[14px] font-semibold text-[#0063F9] shadow-[0px_4px_12px_rgba(0,0,0,0.12)] hover:bg-[#F1F7FF]"
                >
                  <Plus className="h-4 w-4" />
                  <span>Register Account</span>
                </Link>
                <Link
                  to="/login"
                  className="fluent-pressable inline-flex items-center gap-2 rounded-[8px] border border-white/30 bg-white/10 px-5 py-3 text-[14px] font-semibold text-[#FFFFFF] hover:bg-white/20"
                >
                  <span>Sign In</span>
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-black/[0.06] bg-[#FFFFFF] py-6">
        <div className="mx-auto flex max-w-[1320px] flex-col items-center justify-between gap-4 px-4 sm:flex-row sm:px-8 lg:px-14">
          <BrandLogo to="/" size="sm" showTaglineInline />

          <div className="flex items-center gap-5 text-[12px] font-semibold text-[#626262]">
            <Link to="/login" className="hover:text-[#0063F9]">
              Login
            </Link>
            <Link to="/register" className="hover:text-[#0063F9]">
              Register
            </Link>
            <Link to="/dashboard" className="hover:text-[#0063F9]">
              Dashboard
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

