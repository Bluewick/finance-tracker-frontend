import { Link } from 'react-router-dom';
import { APP_BRAND } from '../../utils/constants.util.js';

const SIZE_STYLES = {
  sm: {
    logo: 'h-6 w-6',
    title: 'text-[16px] leading-5 tracking-[-0.04em]',
    subtitle: 'text-[8px]',
  },
  md: {
    logo: 'h-8 w-8',
    title: 'text-[20px] sm:text-[21px] leading-6 tracking-[-0.05em]',
    subtitle: 'text-[9px]',
  },
  lg: {
    logo: 'h-10 w-10',
    title: 'text-[23px] leading-7 tracking-[-0.05em]',
    subtitle: 'text-[10px]',
  },
};

/**
 * Centralized BrandLogo Component for Cashnest
 * Single source of truth for brand identity across Navbar, AuthLayout, LandingPage, and Footers.
 */
export default function BrandLogo({
  to = '/',
  size = 'md',
  showSubtitle = false,
  showTaglineInline = false,
  className = '',
}) {
  const styles = SIZE_STYLES[size] || SIZE_STYLES.md;

  const content = (
    <>
      <img
        src={APP_BRAND.LOGO_URL}
        alt={`${APP_BRAND.NAME} logo`}
        className={`shrink-0 object-contain select-none ${styles.logo}`}
      />

      <div className="flex flex-col">
        <div className="flex items-baseline gap-2">
          <span
            className={`font-bold text-[#000000] ${styles.title}`}
            style={{ fontFamily: 'var(--font-brand)' }}
          >
            {APP_BRAND.NAME}
          </span>
          {showTaglineInline && (
            <span className="text-[12px] font-medium text-[#767676]">
              — {APP_BRAND.TAGLINE}
            </span>
          )}
        </div>

        {showSubtitle && (
          <span
            className={`font-bold uppercase tracking-[0.08em] text-[#767676] ${styles.subtitle}`}
          >
            {APP_BRAND.SUBTITLE}
          </span>
        )}
      </div>
    </>
  );

  if (to) {
    return (
      <Link
        to={to}
        className={`inline-flex items-center gap-2.5 focus:outline-none ${className}`}
      >
        {content}
      </Link>
    );
  }

  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      {content}
    </div>
  );
}
