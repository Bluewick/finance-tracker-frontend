import { Route, Routes } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute.jsx';
import AppLayout from '../components/layout/AppLayout.jsx';
import LandingPage from '../pages/LandingPage.jsx';
import LoginPage from '../pages/LoginPage.jsx';
import RegisterPage from '../pages/RegisterPage.jsx';
import DashboardPage from '../pages/DashboardPage.jsx';
import TransactionsPage from '../pages/TransactionsPage.jsx';
import BudgetsPage from '../pages/BudgetsPage.jsx';
import ProfilePage from '../pages/ProfilePage.jsx';
import NotFoundPage from '../pages/NotFoundPage.jsx';

/**
 * Central Route Registry
 * - /             -> Public Landing Page -> LandingPage.jsx
 * - /login        -> Dedicated Login     -> LoginPage.jsx
 * - /register     -> Dedicated Register  -> RegisterPage.jsx
 * - /dashboard    -> Protected           -> DashboardPage.jsx
 * - /transactions -> Protected           -> TransactionsPage.jsx
 * - /budgets      -> Protected           -> BudgetsPage.jsx
 * - /profile      -> Protected           -> ProfilePage.jsx
 * - *             -> Public 404          -> NotFoundPage.jsx
 */
export default function AppRoutes() {
  return (
    <Routes>
      {/* Public Landing & Dedicated Authentication Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Protected Application Workspace Routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/transactions" element={<TransactionsPage />} />
          <Route path="/budgets" element={<BudgetsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>
      </Route>

      {/* 404 Fallback Route */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
