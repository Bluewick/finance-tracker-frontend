import { Link } from 'react-router-dom';
import { ArrowLeft, Compass } from 'lucide-react';
import useAuth from '../hooks/useAuth.js';

/**
 * 404 Fallback Route Page
 */
export default function NotFoundPage() {
  const { isAuthenticated } = useAuth();
  const destination = isAuthenticated ? '/dashboard' : '/login';

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#F6F8FC] px-4 text-center">
      <div className="fluent-card max-w-md p-8">
        <div className="mx-auto mb-4 flex h-[60px] w-[60px] items-center justify-center rounded-[5px] bg-[#EBF3FF] text-[#0063F9]">
          <Compass className="h-7 w-7" />
        </div>

        <span className="inline-flex rounded-[21px] bg-[#F1F7FF] px-3 py-1 text-[11px] font-semibold text-[#0063F9]">
          ERROR 404
        </span>

        <h1 className="mt-3 text-[32px] font-semibold leading-10 tracking-[-0.02em] text-[#000000]">
          Page not found
        </h1>

        <p className="mt-2 text-[14px] font-semibold leading-5 text-[#626262]">
          The page or financial view you are looking for does not exist or has been moved.
        </p>

        <div className="mt-6">
          <Link
            to={destination}
            className="fluent-pressable inline-flex items-center justify-center gap-2 rounded-[5px] bg-[#0063F9] px-5 py-2.5 text-[14px] font-semibold text-[#FFFFFF] shadow-[0px_2px_5px_0px_rgba(0,0,0,0.09)] hover:bg-[#0056D6]"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>
              {isAuthenticated ? 'Back to Dashboard' : 'Back to Sign In'}
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}

