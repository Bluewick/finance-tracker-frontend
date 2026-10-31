import { useState } from 'react';
import {
  CheckCircle2,
  Coins,
  Eye,
  EyeOff,
  KeyRound,
  Lock,
  Mail,
  RefreshCw,
  Save,
  ShieldCheck,
  User,
} from 'lucide-react';
import PageContainer from '../components/layout/PageContainer.jsx';
import Card from '../components/common/Card.jsx';
import Input from '../components/common/Input.jsx';
import Select from '../components/common/Select.jsx';
import Button from '../components/common/Button.jsx';
import Badge from '../components/common/Badge.jsx';
import CurrencyDisplay from '../components/common/CurrencyDisplay.jsx';
import AlertBanner from '../components/feedback/AlertBanner.jsx';
import useAuth from '../hooks/useAuth.js';
import useToast from '../hooks/useToast.js';
import { updateUserPassword } from '../services/user.service.js';
import { SUPPORTED_CURRENCIES } from '../utils/constants.util.js';
import { formatDate } from '../utils/formatters.util.js';

const CURRENCY_OPTIONS = SUPPORTED_CURRENCIES.map((c) => ({
  value: c.code,
  label: `${c.code} — ${c.name}`,
}));

/**
 * ProfilePage Component (Phase 7 — Tasks 7.1 & 7.2)
 * Integrates:
 * - GET /api/users/me (via refreshProfile)
 * - PATCH /api/users/me (Update display name & currency preference)
 * - PATCH /api/users/me/password (Update account password)
 * - GET / & GET /api/health (Server health status diagnostic)
 */
export default function ProfilePage() {
  const { user, currency, refreshProfile, updateProfile } = useAuth();
  const toast = useToast();

  // Profile Form State
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    currency: user?.currency || currency || 'INR',
  });
  const [profileErrors, setProfileErrors] = useState({});
  const [profileApiError, setProfileApiError] = useState('');
  const [savingProfile, setSavingProfile] = useState(false);
  const [syncingProfile, setSyncingProfile] = useState(false);

  // Password Update Form State
  const [passwordForm, setPasswordForm] = useState({
    current_password: '',
    new_password: '',
    confirm_password: '',
  });
  const [passwordErrors, setPasswordErrors] = useState({});
  const [passwordApiError, setPasswordApiError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  const handleSyncProfile = async () => {
    setSyncingProfile(true);
    try {
      const res = await refreshProfile();
      if (res?.data) {
        setProfileForm({
          name: res.data.name || '',
          currency: res.data.currency || 'INR',
        });
      }
      toast.info('Account profile synced with server.', 'Profile Synced');
    } catch (err) {
      toast.error(err.message || 'Could not refresh profile.', 'Sync Error');
    } finally {
      setSyncingProfile(false);
    }
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileForm((prev) => ({ ...prev, [name]: value }));
    if (profileErrors[name]) {
      setProfileErrors((prev) => ({ ...prev, [name]: '' }));
    }
    if (profileApiError) {
      setProfileApiError('');
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    const errors = {};
    const trimmedName = profileForm.name.trim();
    if (!trimmedName || trimmedName.length < 2) {
      errors.name = 'Display name must be at least 2 characters.';
    }
    if (!profileForm.currency) {
      errors.currency = 'Please select a currency.';
    }

    setProfileErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setSavingProfile(true);
    setProfileApiError('');

    try {
      await updateProfile({
        name: trimmedName,
        currency: profileForm.currency,
      });
      toast.success(
        `Profile updated (${profileForm.currency}). All currency figures refreshed.`,
        'Settings Saved'
      );
    } catch (err) {
      const msg = err.message || 'Failed to update profile settings.';
      setProfileApiError(msg);
      toast.error(msg, 'Update Failed');
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm((prev) => ({ ...prev, [name]: value }));
    if (passwordErrors[name]) {
      setPasswordErrors((prev) => ({ ...prev, [name]: '' }));
    }
    if (passwordApiError) setPasswordApiError('');
    if (passwordSuccess) setPasswordSuccess('');
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    const errors = {};

    if (!passwordForm.current_password) {
      errors.current_password = 'Current password is required.';
    }
    if (!passwordForm.new_password) {
      errors.new_password = 'New password is required.';
    } else if (passwordForm.new_password.length < 6) {
      errors.new_password = 'New password must be at least 6 characters.';
    } else if (passwordForm.new_password === passwordForm.current_password) {
      errors.new_password =
        'New password must be different from your current password.';
    }

    if (passwordForm.confirm_password !== passwordForm.new_password) {
      errors.confirm_password = 'Password confirmation does not match.';
    }

    setPasswordErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setSavingPassword(true);
    setPasswordApiError('');
    setPasswordSuccess('');

    try {
      const res = await updateUserPassword({
        current_password: passwordForm.current_password,
        new_password: passwordForm.new_password,
      });
      const updatedTime = res?.data?.updated_at
        ? formatDate(res.data.updated_at)
        : 'just now';
      setPasswordSuccess(`Password updated successfully (${updatedTime}).`);
      setPasswordForm({
        current_password: '',
        new_password: '',
        confirm_password: '',
      });
      toast.success('Your account password has been updated.', 'Security Updated');
    } catch (err) {
      const msg =
        err.message ||
        'Could not update password. Please verify your current password.';
      setPasswordApiError(msg);
      toast.error(msg, 'Password Update Failed');
    } finally {
      setSavingPassword(false);
    }
  };

  const userInitials = (user?.name || 'User')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');

  return (
    <PageContainer
      title="Profile & Security"
      subtitle="Manage your personal display details, currency formatting, and account security."
      actions={
        <Button
          variant="secondary"
          size="md"
          icon={RefreshCw}
          loading={syncingProfile}
          loadingText="Syncing..."
          onClick={handleSyncProfile}
        >
          Sync Profile
        </Button>
      }
    >
      {/* Top Account Identity Overview Card */}
      <div className="fluent-card mb-5 flex flex-col justify-between gap-4 p-5 sm:flex-row sm:items-center">
        <div className="flex items-center gap-4">
          <div className="flex h-[64px] w-[64px] shrink-0 items-center justify-center rounded-[7px] bg-[#EBF3FF] text-[22px] font-bold text-[#0063F9]">
            {userInitials}
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-[20px] font-semibold text-[#000000]">
                {user?.name || 'User Account'}
              </h2>
              <Badge
                variant={user?.is_active !== false ? 'success' : 'neutral'}
                size="sm"
                icon={CheckCircle2}
              >
                {user?.is_active !== false ? 'Active Account' : 'Inactive'}
              </Badge>
            </div>
            <p className="mt-1 text-[13px] font-semibold text-[#626262]">
              {user?.email}
            </p>
            {user?.createdAt && (
              <p className="mt-0.5 text-[11px] font-medium text-[#767676]">
                Member since {formatDate(user.createdAt)} • Last updated{' '}
                {formatDate(user.updatedAt)}
              </p>
            )}
          </div>
        </div>

        {/* Live Currency Formatting Preview */}
        <div className="rounded-[10px] bg-[#F1F6FF] px-4 py-3 text-right">
          <span className="text-[10px] font-semibold text-[#0063F9] uppercase">
            Sample Currency Readout ({currency})
          </span>
          <p className="mt-0.5 text-[22px] font-semibold text-[#000000]">
            <CurrencyDisplay amount={85000.5} />
          </p>
        </div>
      </div>

      {/* Main Two-Column Settings Forms */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
        {/* Task 7.1: Personal Profile & Currency Settings (PATCH /api/users/me) */}
        <Card
          title="Personal Details & Currency"
          subtitle="Changes to your currency preference immediately update all charts and tables."
          className="lg:col-span-6"
          padding="p-5"
        >
          <form
            onSubmit={handleProfileSubmit}
            noValidate
            className="mt-2 flex flex-col gap-4"
          >
            {profileApiError && (
              <AlertBanner
                variant="error"
                message={profileApiError}
                onClose={() => setProfileApiError('')}
              />
            )}

            <Input
              label="Full Display Name"
              name="name"
              type="text"
              icon={User}
              value={profileForm.name}
              onChange={handleProfileChange}
              error={profileErrors.name}
              disabled={savingProfile}
              required
            />

            <Input
              label="Registered Email Address"
              type="email"
              icon={Mail}
              value={user?.email || ''}
              disabled
              helperText="Your email address serves as your unique login identifier."
            />

            <Select
              label="Preferred Display Currency"
              name="currency"
              icon={Coins}
              value={profileForm.currency}
              onChange={handleProfileChange}
              options={CURRENCY_OPTIONS}
              error={profileErrors.currency}
              disabled={savingProfile}
              helperText="Used across all KPI cards, charts, budgets, and transactions."
              required
            />

            <div className="pt-2">
              <Button
                type="submit"
                variant="primary"
                size="md"
                icon={Save}
                loading={savingProfile}
                loadingText="Saving Profile..."
              >
                Save Profile Preferences
              </Button>
            </div>
          </form>
        </Card>

        {/* Task 7.2: Security & Password Update Form (PATCH /api/users/me/password) */}
        <Card
          title="Security & Password Update"
          subtitle="Keep your financial ledger protected with a strong password."
          className="lg:col-span-6"
          padding="p-5"
        >
          <form
            onSubmit={handlePasswordSubmit}
            noValidate
            className="mt-2 flex flex-col gap-4"
          >
            {passwordApiError && (
              <AlertBanner
                variant="error"
                message={passwordApiError}
                onClose={() => setPasswordApiError('')}
              />
            )}

            {passwordSuccess && (
              <AlertBanner
                variant="success"
                message={passwordSuccess}
                onClose={() => setPasswordSuccess('')}
              />
            )}

            <Input
              label="Current Password"
              name="current_password"
              type={showCurrentPassword ? 'text' : 'password'}
              autoComplete="current-password"
              placeholder="Enter current password"
              icon={Lock}
              value={passwordForm.current_password}
              onChange={handlePasswordChange}
              error={passwordErrors.current_password}
              disabled={savingPassword}
              required
              rightElement={
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword((prev) => !prev)}
                  className="fluent-pressable rounded-[4px] p-1 text-[#767676] hover:text-[#000000]"
                  aria-label={
                    showCurrentPassword ? 'Hide password' : 'Show password'
                  }
                >
                  {showCurrentPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              }
            />

            <Input
              label="New Password"
              name="new_password"
              type={showNewPassword ? 'text' : 'password'}
              autoComplete="new-password"
              placeholder="Min. 6 characters"
              icon={KeyRound}
              value={passwordForm.new_password}
              onChange={handlePasswordChange}
              error={passwordErrors.new_password}
              disabled={savingPassword}
              required
              rightElement={
                <button
                  type="button"
                  onClick={() => setShowNewPassword((prev) => !prev)}
                  className="fluent-pressable rounded-[4px] p-1 text-[#767676] hover:text-[#000000]"
                  aria-label={
                    showNewPassword ? 'Hide password' : 'Show password'
                  }
                >
                  {showNewPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              }
            />

            <Input
              label="Confirm New Password"
              name="confirm_password"
              type={showNewPassword ? 'text' : 'password'}
              autoComplete="new-password"
              placeholder="Re-enter new password"
              icon={ShieldCheck}
              value={passwordForm.confirm_password}
              onChange={handlePasswordChange}
              error={passwordErrors.confirm_password}
              disabled={savingPassword}
              required
            />

            <div className="pt-2">
              <Button
                type="submit"
                variant="primary"
                size="md"
                icon={KeyRound}
                loading={savingPassword}
                loadingText="Updating Password..."
              >
                Update Password
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </PageContainer>
  );
}

