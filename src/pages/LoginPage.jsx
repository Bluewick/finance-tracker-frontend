import { useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Lock, LogIn, Mail } from 'lucide-react';
import AuthLayout from '../components/layout/AuthLayout.jsx';
import Input from '../components/common/Input.jsx';
import Button from '../components/common/Button.jsx';
import AlertBanner from '../components/feedback/AlertBanner.jsx';
import useAuth from '../hooks/useAuth.js';
import useToast from '../hooks/useToast.js';

/**
 * LoginPage Component (Use Case 1: User Login)
 * Connected to POST /api/auth/login via AuthContext
 */
export default function LoginPage() {
  const { login, isAuthenticated, loading: authLoading } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [fieldErrors, setFieldErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const redirectPath = location.state?.from?.pathname || '/dashboard';

  if (!authLoading && isAuthenticated) {
    return <Navigate to={redirectPath} replace />;
  }

  const validateForm = () => {
    const errors = {};
    const emailTrimmed = formData.email.trim();
    if (!emailTrimmed) {
      errors.email = 'Email address is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailTrimmed)) {
      errors.email = 'Please enter a valid email address.';
    }

    if (!formData.password) {
      errors.password = 'Password is required.';
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
      const response = await login({
        email: formData.email.trim(),
        password: formData.password,
      });
      const userName = response?.data?.user?.name || 'back';
      toast.success(`Welcome ${userName}!`, 'Login Successful');
      navigate(redirectPath, { replace: true });
    } catch (err) {
      const msg = err.message || 'Invalid email or password. Please try again.';
      setApiError(msg);
      toast.error(msg, 'Sign In Failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout
      title="Sign in to your account"
      subtitle="Enter your credentials to access your financial dashboard."
      footerText="Don't have an account yet?"
      footerLinkText="Create an account"
      footerLinkTo="/register"
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

        <Input
          label="Password"
          name="password"
          type={showPassword ? 'text' : 'password'}
          autoComplete="current-password"
          placeholder="Enter your password"
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

        <div className="pt-2">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            icon={LogIn}
            loading={submitting}
            loadingText="Signing in..."
          >
            Sign In to Dashboard
          </Button>
        </div>
      </form>
    </AuthLayout>
  );
}

