import { useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle2, Eye, EyeOff, Lock, LogIn, Mail } from 'lucide-react';
import AuthLayout from '../components/layout/AuthLayout.jsx';
import Input from '../components/common/Input.jsx';
import Button from '../components/common/Button.jsx';
import AlertBanner from '../components/feedback/AlertBanner.jsx';
import useAuth from '../hooks/useAuth.js';
import useToast from '../hooks/useToast.js';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const COMMON_DOMAIN_TYPOS = {
  'gmial.com': 'gmail.com',
  'gamil.com': 'gmail.com',
  'gmail.co': 'gmail.com',
  'yaho.com': 'yahoo.com',
  'yahooo.com': 'yahoo.com',
  'outlok.com': 'outlook.com',
  'hotmial.com': 'hotmail.com',
};

/**
 * LoginPage Component (Use Case 1: User Login)
 * Connected to POST /api/auth/login via AuthContext with smart input validation & warnings
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
  const [fieldWarnings, setFieldWarnings] = useState({});
  const [apiError, setApiError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [capsLockOn, setCapsLockOn] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const redirectPath = location.state?.from?.pathname || '/dashboard';

  if (!authLoading && isAuthenticated) {
    return <Navigate to={redirectPath} replace />;
  }

  const isEmailValid = EMAIL_REGEX.test(formData.email.trim());

  const handleKeyModifiers = (e) => {
    if (typeof e.getModifierState === 'function') {
      setCapsLockOn(e.getModifierState('CapsLock'));
    }
  };

  const handleEmailChange = (e) => {
    const cleanEmail = e.target.value.replace(/\s+/g, '');
    setFormData((prev) => ({ ...prev, email: cleanEmail }));

    const domainPart = cleanEmail.split('@')[1]?.toLowerCase();
    if (domainPart && COMMON_DOMAIN_TYPOS[domainPart]) {
      setFieldWarnings((prev) => ({
        ...prev,
        email: `Did you mean @${COMMON_DOMAIN_TYPOS[domainPart]}?`,
      }));
    } else {
      setFieldWarnings((prev) => ({ ...prev, email: '' }));
    }

    if (fieldErrors.email) {
      setFieldErrors((prev) => ({ ...prev, email: '' }));
    }
    if (apiError) setApiError('');
  };

  const handlePasswordChange = (e) => {
    const { value } = e.target;
    setFormData((prev) => ({ ...prev, password: value }));
    if (fieldErrors.password) {
      setFieldErrors((prev) => ({ ...prev, password: '' }));
    }
    if (apiError) setApiError('');
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    if (name === 'email') {
      const trimmed = formData.email.trim();
      if (!trimmed) {
        setFieldErrors((prev) => ({
          ...prev,
          email: 'Email address is required.',
        }));
      } else if (!EMAIL_REGEX.test(trimmed)) {
        setFieldErrors((prev) => ({
          ...prev,
          email: 'Please enter a valid email address (e.g., alex@domain.com).',
        }));
      }
    }

    if (name === 'password') {
      if (!formData.password) {
        setFieldErrors((prev) => ({
          ...prev,
          password: 'Password is required.',
        }));
      } else if (formData.password.length < 6) {
        setFieldWarnings((prev) => ({
          ...prev,
          password: 'Account passwords are at least 6 characters long.',
        }));
      } else {
        setFieldWarnings((prev) => ({ ...prev, password: '' }));
      }
    }
  };

  const applySuggestedDomain = () => {
    const [localPart, domainPart] = formData.email.split('@');
    const suggested = COMMON_DOMAIN_TYPOS[domainPart?.toLowerCase()];
    if (localPart && suggested) {
      setFormData((prev) => ({ ...prev, email: `${localPart}@${suggested}` }));
      setFieldWarnings((prev) => ({ ...prev, email: '' }));
      setFieldErrors((prev) => ({ ...prev, email: '' }));
    }
  };

  const validateForm = () => {
    const errors = {};
    const emailTrimmed = formData.email.trim();
    if (!emailTrimmed) {
      errors.email = 'Email address is required.';
    } else if (!EMAIL_REGEX.test(emailTrimmed)) {
      errors.email = 'Please enter a valid email address.';
    }

    if (!formData.password) {
      errors.password = 'Password is required.';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSubmitting(true);
    setApiError('');

    try {
      const response = await login({
        email: formData.email.trim().toLowerCase(),
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

  const passwordWarning = capsLockOn
    ? 'Caps Lock is ON — passwords are case-sensitive.'
    : fieldWarnings.password || '';

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Enter your credentials to access your financial command center."
      footerText="Don't have an account yet?"
      footerLinkText="Create an account"
      footerLinkTo="/register"
    >
      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
        {apiError && (
          <AlertBanner
            variant="error"
            title="Authentication Failed"
            message={apiError}
            onClose={() => setApiError('')}
          />
        )}

        <div>
          <Input
            label="Email Address"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="alex@example.com"
            icon={Mail}
            value={formData.email}
            onChange={handleEmailChange}
            onBlur={handleBlur}
            error={fieldErrors.email}
            warning={fieldWarnings.email}
            disabled={submitting}
            required
            rightElement={
              isEmailValid && !fieldErrors.email && !fieldWarnings.email ? (
                <CheckCircle2
                  className="h-4 w-4 text-[#029A6D]"
                  aria-label="Valid email"
                />
              ) : null
            }
          />
          {fieldWarnings.email && (
            <button
              type="button"
              onClick={applySuggestedDomain}
              className="mt-1 text-[11px] font-bold text-[#0063F9] hover:underline"
            >
              Click to apply suggested correction
            </button>
          )}
        </div>

        <Input
          label="Password"
          name="password"
          type={showPassword ? 'text' : 'password'}
          autoComplete="current-password"
          placeholder="Enter your password"
          icon={Lock}
          value={formData.password}
          onChange={handlePasswordChange}
          onBlur={handleBlur}
          onKeyUp={handleKeyModifiers}
          onKeyDown={handleKeyModifiers}
          error={fieldErrors.password}
          warning={!fieldErrors.password ? passwordWarning : ''}
          disabled={submitting}
          required
          rightElement={
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="fluent-pressable rounded-[5px] p-1 text-[#767676] hover:bg-black/5 hover:text-[#000000]"
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
            loadingText="Authenticating..."
          >
            Sign In to Workspace
          </Button>
        </div>
      </form>
    </AuthLayout>
  );
}
