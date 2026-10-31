import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { Coins, Eye, EyeOff, Lock, Mail, User, UserPlus } from 'lucide-react';
import AuthLayout from '../components/layout/AuthLayout.jsx';
import Input from '../components/common/Input.jsx';
import Select from '../components/common/Select.jsx';
import Button from '../components/common/Button.jsx';
import AlertBanner from '../components/feedback/AlertBanner.jsx';
import useAuth from '../hooks/useAuth.js';
import useToast from '../hooks/useToast.js';
import { DEFAULT_CURRENCY, SUPPORTED_CURRENCIES } from '../utils/constants.util.js';

/**
 * RegisterPage Component (Use Case 1: User Registration)
 * Connected to POST /api/auth/register via AuthContext
 */
export default function RegisterPage() {
  const { register, isAuthenticated, loading: authLoading } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    currency: DEFAULT_CURRENCY,
  });
  const [fieldErrors, setFieldErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  if (!authLoading && isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const currencyOptions = SUPPORTED_CURRENCIES.map((c) => ({
    value: c.code,
    label: `${c.code} — ${c.name}`,
  }));

  const validateForm = () => {
    const errors = {};
    const trimmedName = formData.name.trim();
    const trimmedEmail = formData.email.trim();

    if (!trimmedName) {
      errors.name = 'Full name is required.';
    } else if (trimmedName.length < 2) {
      errors.name = 'Name must be at least 2 characters.';
    }

    if (!trimmedEmail) {
      errors.email = 'Email address is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      errors.email = 'Please enter a valid email address.';
    }

    if (!formData.password) {
      errors.password = 'Password is required.';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters.';
    }

    if (!formData.currency) {
      errors.currency = 'Please select your preferred currency.';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: '' }));
    }
    if (apiError) {
      setApiError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSubmitting(true);
    setApiError('');

    try {
      const response = await register({
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
        currency: formData.currency,
      });
      const userName = response?.data?.user?.name || formData.name.trim();
      toast.success(
        `Account created for ${userName}. Welcome aboard!`,
        'Registration Complete'
      );
      navigate('/dashboard', { replace: true });
    } catch (err) {
      const msg =
        err.message || 'Could not complete registration. Please check your details.';
      setApiError(msg);
      toast.error(msg, 'Registration Failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Start tracking your income, expenses, and monthly budgets."
      footerText="Already have an account?"
      footerLinkText="Sign in instead"
      footerLinkTo="/login"
    >
      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
        {apiError && (
          <AlertBanner
            variant="error"
            message={apiError}
            onClose={() => setApiError('')}
          />
        )}

        <Input
          label="Full Name"
          name="name"
          type="text"
          autoComplete="name"
          placeholder="Alex Morgan"
          icon={User}
          value={formData.name}
          onChange={handleChange}
          error={fieldErrors.name}
          disabled={submitting}
          required
        />

        <Input
          label="Email Address"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="alex@example.com"
          icon={Mail}
          value={formData.email}
          onChange={handleChange}
          error={fieldErrors.email}
          disabled={submitting}
          required
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            label="Password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="new-password"
            placeholder="Min. 6 characters"
            icon={Lock}
            value={formData.password}
            onChange={handleChange}
            error={fieldErrors.password}
            disabled={submitting}
            required
            rightElement={
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="fluent-pressable rounded-[4px] p-1 text-[#767676] hover:text-[#000000]"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            }
          />

          <Select
            label="Preferred Currency"
            name="currency"
            icon={Coins}
            value={formData.currency}
            onChange={handleChange}
            options={currencyOptions}
            error={fieldErrors.currency}
            disabled={submitting}
            required
          />
        </div>

        <div className="pt-2">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            icon={UserPlus}
            loading={submitting}
            loadingText="Creating account..."
          >
            Create Free Account
          </Button>
        </div>
      </form>
    </AuthLayout>
  );
}

