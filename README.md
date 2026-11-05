# Finance Tracker | Frontend

A modern, responsive, and high-performance personal finance management web application built with **React 19**, **Vite 8**, **Tailwind CSS v4**, and **Recharts**.

[](https://react.dev/)
[](https://vitejs.dev/)
[](https://tailwindcss.com/)
[](https://reactrouter.com/)
[](https://recharts.org/)
[](https://oxc.rs/)

---

## 📖 Overview

The **Finance Tracker Frontend** provides individuals with an intuitive, real-time dashboard to monitor their financial well-being. It simplifies expense tracking, tracks monthly budgets across custom categories, visualizes savings trajectories, and provides actionable cashflow insights through interactive charts.

Designed with **React 19** and the new **React Compiler**, the frontend delivers optimal client-side rendering speed, smooth transitions, and seamless state persistence with JWT-based authentication.

---

## ✨ Key Features

### 📊 Real-Time Financial Dashboard
* **Summary Metric Cards**: Instant high-level view of Total Income, Total Expenses, and Net Savings.
* **Interactive Visualizations**:
  * **Cumulative Wealth Chart**: Track overall net-worth accumulation over time.
  * **Monthly Trends Bar Chart**: Compare month-over-month income against expenditures.
  * **Category Breakdown (Pie & Ticket Charts)**: Inspect proportional spending distributions.
  * **Weekday Spending Analysis**: Discover recurring day-of-week expenditure patterns.
  * **Cashflow Efficiency Gauge**: Gauge the percentage of income retained after operating expenses.
  * **Budget vs. Actual Comparison**: Visual side-by-side comparison of planned vs. actual spending.
* **Recent Activity Feed**: Quick overview of the latest financial transactions.

### 💳 Transaction Management
* **Full CRUD Support**: Add, edit, and delete transactions with dedicated modal interfaces.
* **Granular Filtering & Sorting**: Filter transactions by date range, income/expense type, and category.
* **Search & Debouncing**: Live transaction query filtering optimized with a custom debounce hook.
* **CSV Export**: One-click transaction ledger export for external tax or spreadsheet analysis.

### 🎯 Category Budgets & Expense Control
* **Category-Level Budgets**: Set spending thresholds for specific categories (e.g., Housing, Groceries, Entertainment).
* **Utilization Tracking**: Visual progress bars displaying percentage utilized and threshold alerts.
* **Budget Status Overview**: High-level summary of active budgets, remaining balances, and over-budget flags.

### 🔐 Authentication & Session Security
* **User Lifecycle**: Complete user registration, login, and profile management workflows.
* **JWT Token Interceptors**: Centralized Axios instance automatically attaches Bearer tokens from local storage.
* **Route Protection**: Dedicated route guards (`ProtectedRoute`) securing private application views against unauthenticated access.

### 🎨 Modern UI & User Feedback
* **Global Notifications**: Toast notification system for instant success, error, and info alerts.
* **Graceful Loading States**: Integrated skeleton loaders and spinner indicators during network requests.
* **Responsive Layouts**: Collapsible sidebar for desktop environments alongside a dedicated bottom/mobile navigation bar.

---

## 🛠️ Tech Stack

| Category | Technology | Description |
| :--- | :--- | :--- |
| **Framework** | [React 19](https://react.dev/) | Core UI library utilizing functional components and hooks |
| **Compiler** | [React Compiler](https://react.dev/learn/react-compiler) | Automated memoization via Babel & Rolldown plugins |
| **Build Tool** | [Vite 8](https://vitejs.dev/) | Next-generation fast frontend tooling and HMR bundler |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) | Utility-first CSS framework with native `@tailwindcss/vite` |
| **Routing** | [React Router DOM v7](https://reactrouter.com/) | Client-side routing with nested layouts and route protection |
| **Charts** | [Recharts 3](https://recharts.org/) | Composable SVG charting library for React |
| **Icons** | [Lucide React](https://lucide.dev/) | Clean, customizable SVG icons |
| **HTTP Client** | [Axios](https://axios-http.com/) | Promise-based HTTP client with centralized interceptors |
| **Linter** | [Oxlint](https://oxc.rs/) | High-performance JavaScript/React linter |

---

## 📂 Project Structure

```
finance-tracker-frontend/
├── public/                       # Static public assets
├── src/
│   ├── assets/                   # Static images and vector graphics
│   ├── components/
│   │   ├── budgets/              # Budget modals, progress bars, and category cards
│   │   │   ├── BudgetFormModal.jsx
│   │   │   ├── BudgetOverviewCard.jsx
│   │   │   ├── BudgetProgressBar.jsx
│   │   │   └── CategoryBudgetCard.jsx
│   │   ├── common/               # Reusable UI primitives (Button, Modal, Input, Badge, etc.)
│   │   ├── dashboard/            # Analytical charts and summary metric widgets
│   │   │   ├── BudgetVsActualChart.jsx
│   │   │   ├── CashflowEfficiencyGauge.jsx
│   │   │   ├── CategoryPieChart.jsx
│   │   │   ├── CategoryTicketChart.jsx
│   │   │   ├── CumulativeWealthChart.jsx
│   │   │   ├── MonthlyTrendsBarChart.jsx
│   │   │   ├── RecentTransactions.jsx
│   │   │   ├── SummaryMetricCards.jsx
│   │   │   └── WeekdaySpendingChart.jsx
│   │   ├── feedback/             # Alert banners, skeletons, spinners, confirmation modals
│   │   ├── layout/               # AppLayout, AuthLayout, Navbar, Sidebar, MobileNav
│   │   └── transactions/         # TransactionTable, FilterBar, ExportButton, Modals
│   ├── context/                  # React Context providers (AuthContext, ToastContext)
│   ├── hooks/                    # Custom hooks (useAuth, useToast, useDebounce)
│   ├── pages/                    # View pages
│   │   ├── BudgetsPage.jsx       # Budget monitoring and allocation
│   │   ├── DashboardPage.jsx     # Financial telemetry and analytics charts
│   │   ├── LandingPage.jsx       # Public welcome and feature overview
│   │   ├── LoginPage.jsx         # User authentication
│   │   ├── NotFoundPage.jsx      # 404 error page
│   │   ├── ProfilePage.jsx       # User profile and account preferences
│   │   ├── RegisterPage.jsx      # Account registration
│   │   └── TransactionsPage.jsx  # Transaction list, filters, and CRUD controls
│   ├── routes/                   # Route declarations and ProtectedRoute wrapper
│   │   ├── AppRoutes.jsx
│   │   └── ProtectedRoute.jsx
│   ├── services/                 # API service layer
│   │   ├── analytics.service.js  # Dashboard and charting endpoints
│   │   ├── api.js                # Base Axios instance & request interceptors
│   │   ├── auth.service.js       # Login, register, token refresh
│   │   ├── budget.service.js     # Budget CRUD operations
│   │   ├── transaction.service.js# Transaction CRUD & CSV export
│   │   └── user.service.js       # Profile management
│   ├── utils/                    # Constants, currency formatters, date helpers
│   ├── App.jsx                   # Root application provider hierarchy
│   ├── main.jsx                  # Application entry point
│   └── index.css                 # Global CSS and Tailwind directives
├── .oxlintrc.json                # Oxlint rules configuration
├── vercel.json                   # Vercel SPA routing rewrite rules
├── vite.config.js                # Vite build and plugin configurations
└── package.json                  # Dependencies, scripts, and package metadata
```

---

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed on your local machine:
* **Node.js**: `v18.x` or higher (recommended: `v20.x` LTS)
* **npm**: `v9.x` or higher (or `yarn` / `pnpm`)
* A running instance of the **Finance Tracker Backend API** (default: `http://localhost:5213`)

### Installation

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/Bluewick/finance-tracker-frontend.git
   cd finance-tracker-frontend
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env` file in the root directory (or copy from `.env.example`):
   ```bash
   cp .env.example .env
   ```
   Add your backend server URL:
   ```env
   VITE_API_URL=http://localhost:5213
   ```

4. **Launch Development Server**:
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:5173`.

---

## ⚙️ Environment Variables

The frontend relies on the following environment variable:

| Variable | Required | Default Value | Description |
| :--- | :---: | :--- | :--- |
| `VITE_API_URL` | No | `http://localhost:5213` | Base URL of the backend REST API server |

> **Note**: Vite requires client-exposed environment variables to be prefixed with `VITE_`.

---

## 📜 Available Scripts

In the project directory, you can run:

| Command | Action |
| :--- | :--- |
| `npm run dev` | Starts the local development server with Vite hot module replacement (HMR). |
| `npm run build` | Compiles and bundles production-ready assets into the `dist/` directory. |
| `npm run preview` | Locally serves the production build from `dist/` for verification. |
| `npm run lint` | Analyzes code quality and syntax standards using [Oxlint](https://oxc.rs/). |

---

## 🗺️ Application Routing

The application uses **React Router DOM v7** with layout encapsulation:

| Path | Access | Page Component | Description |
| :--- | :---: | :--- | :--- |
| `/` | Public | `LandingPage` | Overview of features and quick links to login/register |
| `/login` | Public | `LoginPage` | Existing user sign-in form |
| `/register` | Public | `RegisterPage` | New user account registration form |
| `/dashboard` | Protected | `DashboardPage` | Main financial dashboard, metrics, and interactive charts |
| `/transactions`| Protected | `TransactionsPage` | Filterable, searchable transaction ledger with CRUD modals |
| `/budgets` | Protected | `BudgetsPage` | Category budget tracking, utilization bars, and setup |
| `/profile` | Protected | `ProfilePage` | User account information and preferences |
| `*` | Public | `NotFoundPage` | 404 page for non-existent routes |

---

## 🌐 API & Architecture

The application communicates with the backend through a modular service architecture:

1. **Centralized HTTP Client (`src/services/api.js`)**:
   * Uses **Axios** configured with a default timeout of 15 seconds.
   * Employs request interceptors that inspect `localStorage` for the stored JWT token and injects the header:
     ```http
     Authorization: Bearer <TOKEN>
     ```
2. **Dedicated Domain Services**:
   * `auth.service.js`: Authentication requests (`/api/auth/login`, `/api/auth/register`).
   * `transaction.service.js`: Transaction endpoints with query parameter filtering.
   * `budget.service.js`: Budget creation, category updates, and deletion.
   * `analytics.service.js`: Metric aggregations, monthly trends, and cashflow data.
   * `user.service.js`: User profile queries and updates.

---

## ☁️ Deployment

### Vercel Deployment

This project includes a pre-configured `vercel.json` file for single-page application (SPA) routing:

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

To deploy via the Vercel CLI or Git integration:
1. Import the repository into your [Vercel Dashboard](https://vercel.com).
2. Set the **Framework Preset** to **Vite**.
3. In the project **Environment Variables**, configure:
   * `VITE_API_URL`: Your deployed backend production URL.
4. Deploy!

### Docker / Nginx Static Hosting

To deploy using an Nginx web server or Docker container, ensure the server redirects all non-file route queries to `/index.html`:

```nginx
server {
    listen 80;
    server_name yourdomain.com;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

1. Fork the project repository.
2. Create your feature branch (`git checkout -b feature/AmazingFeature`).
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4. Run the linter to verify code cleanliness:
   ```bash
   npm run lint
   ```
5. Push to the branch (`git push origin feature/AmazingFeature`).
6. Open a Pull Request.

---

## 📄 License

This project is licensed under the MIT License. See the repository for details.
