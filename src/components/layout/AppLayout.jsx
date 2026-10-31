import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar.jsx';
import Sidebar from './Sidebar.jsx';
import MobileNav from './MobileNav.jsx';
import TransactionFormModal from '../transactions/TransactionFormModal.jsx';

/**
 * Authenticated Application Shell (Desktop + Mobile)
 * Hosts Navbar, Sidebar, MobileNav, and the Global Quick-Add Transaction Modal
 */
export default function AppLayout({ children, onQuickAddTransaction }) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [quickModalOpen, setQuickModalOpen] = useState(false);

  const handleOpenQuickModal = () => {
    if (onQuickAddTransaction) {
      onQuickAddTransaction();
    } else {
      setQuickModalOpen(true);
    }
  };

  const handleQuickTransactionSaved = () => {
    window.dispatchEvent(new CustomEvent('transaction:mutated'));
  };

  return (
    <div className="min-h-screen bg-[#F6F8FC] text-[#000000]">
      <Navbar
        isMobileSidebarOpen={mobileSidebarOpen}
        onToggleMobileSidebar={() => setMobileSidebarOpen((prev) => !prev)}
        onQuickAddTransaction={handleOpenQuickModal}
      />

      <Sidebar
        isOpen={mobileSidebarOpen}
        onClose={() => setMobileSidebarOpen(false)}
        onQuickAddTransaction={handleOpenQuickModal}
      />

      {/* Main Canvas Area */}
      <main className="min-h-screen pt-16 pb-[84px] lg:pb-12 lg:pl-[310px]">
        <div className="mx-auto w-full max-w-[1440px] px-4 pt-6 sm:px-8 lg:px-[63px] lg:pt-[28px]">
          {children ? children : <Outlet />}
        </div>
      </main>

      <MobileNav />

      {/* Global Record Transaction Modal (accessible from Sidebar & Navbar on any page) */}
      <TransactionFormModal
        isOpen={quickModalOpen}
        onClose={() => setQuickModalOpen(false)}
        onSuccess={handleQuickTransactionSaved}
      />
    </div>
  );
}
