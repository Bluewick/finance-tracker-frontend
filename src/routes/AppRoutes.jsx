import { Navigate, Route, Routes } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute.jsx';
import AppLayout from '../components/layout/AppLayout.jsx';
import LoginPage from '../pages/LoginPage.jsx';
import RegisterPage from '../pages/RegisterPage.jsx';
import DashboardPage from '../pages/DashboardPage.jsx';
import TransactionsPage from '../pages/TransactionsPage.jsx';
import BudgetsPage from '../pages/BudgetsPage.jsx';
import ProfilePage from '../pages/ProfilePage.jsx';
import NotFoundPage from '../pages/NotFoundPage.jsx';

/**
 * Central Route Registry (ROADMAP.md Section 5 & Phase 8 Task 8.1)
 * - /login        -> Public (Guest-only) -> LoginPage.jsx
 * - /register     -> Public (Guest-only) -> RegisterPage.jsx
 * - /dashboard    -> Protected           -> DashboardPage.jsx
 * - /transactions -> Protected           -> TransactionsPage.jsx
 * - /budgets      -> Protected           -> BudgetsPage.jsx
 * - /profile      -> Protected           -> ProfilePage.jsx
 * - /             -> Redirect            -> /dashboard
 * - *             -> Public              -> NotFoundPage.jsx
 */
export default function AppRoutes() {
  return (
    <Routes>
      {/* Public Guest Routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Protected Application Routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
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
