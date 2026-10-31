import { useMemo, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import {
  Check,
  CheckCircle2,
  Circle,
  Eye,
  EyeOff,
  Lock,
  Mail,
  ShieldAlert,
  ShieldCheck,
  User,
  UserPlus,
} from 'lucide-react';
import AuthLayout from '../components/layout/AuthLayout.jsx';
import Input from '../components/common/Input.jsx';
import Button from '../components/common/Button.jsx';
import AlertBanner from '../components/feedback/AlertBanner.jsx';
import useAuth from '../hooks/useAuth.js';
import useToast from '../hooks/useToast.js';
import { DEFAULT_CURRENCY } from '../utils/constants.util.js';

// Allowed characters in full name: letters (including accented), spaces, hyphens, apostrophes, periods
const INVALID_NAME_CHARS_REGEX = /[^a-zA-Z\u00C0-\u024F\s.'-]/g;
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
 * Evaluates password strength across 5 criteria and returns a normalized 0–4 score + metadata
 */
function evaluatePasswordStrength(password) {
  const checks = {
    minLength: password.length >= 6,
    goodLength: password.length >= 8,
    mixedCase: /[a-z]/.test(password) && /[A-Z]/.test(password),
    hasNumber: /\d/.test(password),
    hasSymbol: /[^a-zA-Z0-9]/.test(password),
  };

  if (!password) {
    return {
      score: 0,
      label: 'Enter a password',
      color: '#D4D4D8',
      textColor: 'text-[#767676]',
      badgeBg: 'bg-[#F3F4F6]',
      checks,
    };
  }

  let rawScore = 0;
  if (checks.minLength) rawScore += 1;
  if (checks.goodLength) rawScore += 1;
  if (checks.mixedCase) rawScore += 1;
  if (checks.hasNumber) rawScore += 1;
  if (checks.hasSymbol) rawScore += 1;

  const normalizedScore = !checks.minLength
    ? 1
    : Math.min(4, Math.max(1, rawScore - 1));

  const levels = {
    1: {
      label: 'Weak',
      color: '#F70909',
      textColor: 'text-[#840000]',
      badgeBg: 'bg-[#F70909]/10',
    },
    2: {
      label: 'Fair',
      color: '#FF8D28',
      textColor: 'text-[#B55000]',
      badgeBg: 'bg-[#FF8D28]/15',
    },
    3: {
      label: 'Good',
      color: '#0063F9',
      textColor: 'text-[#0063F9]',
      badgeBg: 'bg-[#0063F9]/10',
    },
    4: {
      label: 'Strong',
      color: '#029A6D',
      textColor: 'text-[#029A6D]',
      badgeBg: 'bg-[#09F7A1]/20',
    },
  };

  return {
    score: normalizedScore,
    ...levels[normalizedScore],
    checks,
  };
}

/**
 * RegisterPage Component (Use Case 1: User Registration)
 * Features smart input sanitization, real-time warnings, password strength meter, and confirm password verification
 */
export default function RegisterPage() {
  const { register, isAuthenticated, loading: authLoading } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [fieldErrors, setFieldErrors] = useState({});
  const [fieldWarnings, setFieldWarnings] = useState({});
  const [touched, setTouched] = useState({});
  const [apiError, setApiError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [capsLockOn, setCapsLockOn] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const passwordStrength = useMemo(
    () => evaluatePasswordStrength(formData.password),
    [formData.password]
  );

  if (!authLoading && isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const isNameValid =
    formData.name.trim().length >= 2 &&
    !INVALID_NAME_CHARS_REGEX.test(formData.name);
  const isEmailValid = EMAIL_REGEX.test(formData.email.trim());
  const isConfirmMatch =
    Boolean(formData.confirmPassword) &&
    formData.password === formData.confirmPassword;

  const handleKeyModifiers = (e) => {
    if (typeof e.getModifierState === 'function') {
      setCapsLockOn(e.getModifierState('CapsLock'));
    }
  };

  const handleNameChange = (e) => {
    const rawValue = e.target.value;
    // Detect if user tried to type or paste disallowed characters like * & # @ numbers etc.
    const invalidMatches = rawValue.match(INVALID_NAME_CHARS_REGEX);
    const sanitized = rawValue
      .replace(INVALID_NAME_CHARS_REGEX, '')
      .replace(/\s{2,}/g, ' ')
      .replace(/^\s+/, '');

    setFormData((prev) => ({ ...prev, name: sanitized }));

    if (invalidMatches && invalidMatches.length > 0) {
      const uniqueBlocked = [...new Set(invalidMatches)].slice(0, 3).join(' ');
      setFieldWarnings((prev) => ({
        ...prev,
        name: `Blocked invalid character (${uniqueBlocked}). Only letters, spaces, hyphens, and apostrophes are allowed.`,
      }));
    } else {
      setFieldWarnings((prev) => ({ ...prev, name: '' }));
    }

    if (fieldErrors.name) {
      setFieldErrors((prev) => ({ ...prev, name: '' }));
    }
    if (apiError) setApiError('');
  };

  const handleEmailChange = (e) => {
    // Strip accidental spaces inside email
    const cleanEmail = e.target.value.replace(/\s+/g, '');
    setFormData((prev) => ({ ...prev, email: cleanEmail }));

    // Check for common domain typos
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
    const { name, value } = e.target;
    setFormData((prev) => {
      const next = { ...prev, [name]: value };
      // Clear confirmPassword error if they now match
      if (
        (name === 'password' || name === 'confirmPassword') &&
        next.confirmPassword &&
        next.password === next.confirmPassword
      ) {
        setFieldErrors((prevErr) => ({ ...prevErr, confirmPassword: '' }));
      }
      return next;
    });

    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: '' }));
    }
    if (apiError) setApiError('');
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));

    if (name === 'name') {
      const trimmed = formData.name.trim();
      if (!trimmed) {
        setFieldErrors((prev) => ({ ...prev, name: 'Full name is required.' }));
      } else if (trimmed.length < 2) {
        setFieldErrors((prev) => ({
          ...prev,
          name: 'Name must be at least 2 characters long.',
        }));
      }
    }

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
        setFieldErrors((prev) => ({
          ...prev,
          password: 'Password must be at least 6 characters long.',
        }));
      }
    }

    if (name === 'confirmPassword') {
      if (!formData.confirmPassword) {
        setFieldErrors((prev) => ({
          ...prev,
          confirmPassword: 'Please confirm your password.',
        }));
      } else if (formData.confirmPassword !== formData.password) {
        setFieldErrors((prev) => ({
          ...prev,
          confirmPassword: 'Passwords do not match.',
        }));
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
    const trimmedName = formData.name.trim();
    const trimmedEmail = formData.email.trim();

    if (!trimmedName) {
      errors.name = 'Full name is required.';
    } else if (trimmedName.length < 2) {
      errors.name = 'Name must be at least 2 characters long.';
    } else if (!/^[a-zA-Z\u00C0-\u024F\s.'-]+$/.test(trimmedName)) {
      errors.name = 'Name contains invalid characters.';
    }

    if (!trimmedEmail) {
      errors.email = 'Email address is required.';
    } else if (!EMAIL_REGEX.test(trimmedEmail)) {
      errors.email = 'Please enter a valid email address.';
    }

    if (!formData.password) {
      errors.password = 'Password is required.';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters.';
    }

    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password.';
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match. Please verify both fields.';
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
      const response = await register({
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        currency: DEFAULT_CURRENCY,
      });
      const userName = response?.data?.user?.name || formData.name.trim();
      toast.success(
        `Account created for ${userName}. Welcome aboard!`,
        'Registration Complete'
      );
      navigate('/dashboard', { replace: true });
    } catch (err) {
      const msg =
        err.message ||
        'Could not complete registration. Please check your details.';
      setApiError(msg);
      toast.error(msg, 'Registration Failed');
    } finally {
      setSubmitting(false);
    }
  };

  // Real-time mismatch warning on confirmPassword before blur if user is typing
  const confirmPasswordLiveWarning =
    !fieldErrors.confirmPassword &&
    formData.confirmPassword.length > 0 &&
    formData.password !== formData.confirmPassword
      ? 'Passwords do not match yet.'
      : '';

  const passwordWarning =
    capsLockOn
      ? 'Caps Lock is ON — passwords are case-sensitive.'
      : touched.password &&
          formData.password.length >= 6 &&
          passwordStrength.score <= 1
        ? 'Consider adding numbers, uppercase letters, or symbols for stronger security.'
        : '';

  return (
    <AuthLayout
      title="Create your workspace"
      subtitle="Set up your encrypted ledger profile in under 30 seconds."
      footerText="Already have an account?"
      footerLinkText="Sign in instead"
      footerLinkTo="/login"
    >
      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
        {apiError && (
          <AlertBanner
            variant="error"
            title="Registration Error"
            message={apiError}
            onClose={() => setApiError('')}
          />
        )}

        {/* Smart Full Name Input */}
        <Input
          label="Full Name"
          name="name"
          type="text"
          autoComplete="name"
          placeholder="e.g. Alex Morgan"
          icon={User}
          value={formData.name}
          onChange={handleNameChange}
          onBlur={handleBlur}
          error={fieldErrors.name}
          warning={fieldWarnings.name}
          helperText={
            !fieldErrors.name && !fieldWarnings.name
              ? 'Letters, spaces, hyphens, and apostrophes only.'
              : undefined
          }
          disabled={submitting}
          required
          rightElement={
            isNameValid && !fieldErrors.name ? (
              <CheckCircle2
                className="h-4 w-4 text-[#029A6D]"
                aria-label="Valid name"
              />
            ) : null
          }
        />

        {/* Smart Email Input */}
        <div>
          <Input
            label="Work or Personal Email"
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

        {/* Smart Password Input */}
        <div className="flex flex-col gap-2">
          <Input
            label="Password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="new-password"
            placeholder="Create a strong password"
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

          {/* Interactive Password Strength Indicator Card */}
          <div className="rounded-[10px] border border-black/[0.06] bg-[#F8FAFC] p-3">
            <div className="mb-2 flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-[11px] font-bold text-[#474747]">
                {passwordStrength.score >= 3 ? (
                  <ShieldCheck className="h-3.5 w-3.5 text-[#029A6D]" />
                ) : (
                  <ShieldAlert className="h-3.5 w-3.5 text-[#767676]" />
                )}
                Password Security
              </span>
              <span
                className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${passwordStrength.badgeBg} ${passwordStrength.textColor}`}
              >
                {passwordStrength.label}
              </span>
            </div>

            {/* 4-Bar Strength Meter */}
            <div className="grid grid-cols-4 gap-1.5">
              {[1, 2, 3, 4].map((level) => {
                const active = passwordStrength.score >= level;
                return (
                  <div
                    key={level}
                    className="h-1.5 rounded-full transition-all duration-300"
                    style={{
                      backgroundColor: active
                        ? passwordStrength.color
                        : '#E4E4E7',
                    }}
                  />
                );
              })}
            </div>

            {/* 4-Criteria Checklist */}
            <div className="mt-2.5 grid grid-cols-2 gap-x-3 gap-y-1.5">
              <div
                className={`flex items-center gap-1.5 text-[11px] font-semibold ${
                  passwordStrength.checks.minLength
                    ? 'text-[#029A6D]'
                    : 'text-[#767676]'
                }`}
              >
                {passwordStrength.checks.minLength ? (
                  <Check className="h-3 w-3 shrink-0 stroke-[2.5]" />
                ) : (
                  <Circle className="h-2.5 w-2.5 shrink-0" />
                )}
                <span>6+ characters</span>
              </div>

              <div
                className={`flex items-center gap-1.5 text-[11px] font-semibold ${
                  passwordStrength.checks.mixedCase
                    ? 'text-[#029A6D]'
                    : 'text-[#767676]'
                }`}
              >
                {passwordStrength.checks.mixedCase ? (
                  <Check className="h-3 w-3 shrink-0 stroke-[2.5]" />
                ) : (
                  <Circle className="h-2.5 w-2.5 shrink-0" />
                )}
                <span>Upper & lowercase</span>
              </div>

              <div
                className={`flex items-center gap-1.5 text-[11px] font-semibold ${
                  passwordStrength.checks.hasNumber
                    ? 'text-[#029A6D]'
                    : 'text-[#767676]'
                }`}
              >
                {passwordStrength.checks.hasNumber ? (
                  <Check className="h-3 w-3 shrink-0 stroke-[2.5]" />
                ) : (
                  <Circle className="h-2.5 w-2.5 shrink-0" />
                )}
                <span>At least 1 number</span>
              </div>

              <div
                className={`flex items-center gap-1.5 text-[11px] font-semibold ${
                  passwordStrength.checks.hasSymbol
                    ? 'text-[#029A6D]'
                    : 'text-[#767676]'
                }`}
              >
                {passwordStrength.checks.hasSymbol ? (
                  <Check className="h-3 w-3 shrink-0 stroke-[2.5]" />
                ) : (
                  <Circle className="h-2.5 w-2.5 shrink-0" />
                )}
                <span>Special symbol (!@#$)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Confirm Password Input */}
        <div>
          <Input
            label="Confirm Password"
            name="confirmPassword"
            type={showConfirmPassword ? 'text' : 'password'}
            autoComplete="new-password"
            placeholder="Re-enter your password"
            icon={Lock}
            value={formData.confirmPassword}
            onChange={handlePasswordChange}
            onBlur={handleBlur}
            onKeyUp={handleKeyModifiers}
            onKeyDown={handleKeyModifiers}
            error={fieldErrors.confirmPassword}
            warning={confirmPasswordLiveWarning}
            disabled={submitting}
            required
            rightElement={
              <div className="flex items-center gap-1">
                {isConfirmMatch && !fieldErrors.confirmPassword && (
                  <CheckCircle2
                    className="h-4 w-4 text-[#029A6D]"
                    aria-label="Passwords match"
                  />
                )}
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  className="fluent-pressable rounded-[5px] p-1 text-[#767676] hover:bg-black/5 hover:text-[#000000]"
                  aria-label={
                    showConfirmPassword
                      ? 'Hide confirm password'
                      : 'Show confirm password'
                  }
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            }
          />
          {isConfirmMatch && !fieldErrors.confirmPassword && (
            <p className="mt-1 flex items-center gap-1 text-[11px] font-semibold text-[#029A6D]">
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>Passwords match</span>
            </p>
          )}
        </div>

        <div className="pt-2">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            icon={UserPlus}
            loading={submitting}
            loadingText="Creating workspace..."
          >
            Create Free Account
          </Button>
        </div>
      </form>
    </AuthLayout>
  );
}
