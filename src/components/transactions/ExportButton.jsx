import { useState } from 'react';
import { Download } from 'lucide-react';
import Button from '../common/Button.jsx';
import useToast from '../../hooks/useToast.js';
import {
  exportTransactionsCsv,
  triggerCsvDownload,
} from '../../services/transaction.service.js';

/**
 * ExportButton Component (Task 5.4 — Use Case 8: Export Transactions)
 * Connects to GET /api/transactions/export with active filter query parameters
 * and downloads a .csv file in the browser.
 */
export default function ExportButton({ filters = {}, disabled = false }) {
  const toast = useToast();
  const [exporting, setExporting] = useState(false);

  const handleExport = async () => {
    setExporting(true);
    try {
      const csvData = await exportTransactionsCsv({
        type: filters.type !== 'ALL' ? filters.type : undefined,
        category: filters.category !== 'ALL' ? filters.category : undefined,
        startDate: filters.startDate || undefined,
        endDate: filters.endDate || undefined,
      });

      if (!csvData || !String(csvData).trim()) {
        toast.warning('No transactions found to export for the current filters.', 'Empty Export');
        return;
      }

      const dateStamp = new Date().toISOString().split('T')[0];
      triggerCsvDownload(csvData, `fluent_finance_transactions_${dateStamp}.csv`);
      toast.success('Your transactions CSV report has been downloaded.', 'Export Complete');
    } catch (err) {
      toast.error(
        err.message || 'Failed to export transactions. Please try again.',
        'Export Error'
      );
    } finally {
      setExporting(false);
    }
  };

  return (
    <Button
      variant="secondary"
      size="sm"
      icon={Download}
      loading={exporting}
      loadingText="Exporting..."
      disabled={disabled}
      onClick={handleExport}
      className="h-8"
    >
      Export
    </Button>
  );
}
