export function formatCurrency(amount, currency = 'BDT', symbol = '৳') {
  const num = Number(amount) || 0;
  if (currency === 'USD' || symbol === '$') {
    return `$${num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }
  return `${symbol}${num.toLocaleString('en-IN')}`;
}

export function formatDate(isoDate) {
  if (!isoDate) return 'N/A';
  try {
    const d = new Date(isoDate);
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch (e) {
    return isoDate;
  }
}

export function getStatusBadge(status) {
  const map = {
    pending: { label: 'Pending', bg: 'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300' },
    confirmed: { label: 'Confirmed', bg: 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300' },
    processing: { label: 'Processing', bg: 'bg-indigo-100 text-indigo-800 border-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-300' },
    shipped: { label: 'Shipped', bg: 'bg-sky-100 text-sky-800 border-sky-200 dark:bg-sky-900/30 dark:text-sky-300' },
    delivered: { label: 'Delivered', bg: 'bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300' },
    cancelled: { label: 'Cancelled', bg: 'bg-rose-100 text-rose-800 border-rose-200 dark:bg-rose-900/30 dark:text-rose-300' },
    paid: { label: 'Paid', bg: 'bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300' },
    unpaid: { label: 'Unpaid', bg: 'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300' },
    active: { label: 'Active', bg: 'bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300' },
    suspended: { label: 'Suspended', bg: 'bg-rose-100 text-rose-800 border-rose-200 dark:bg-rose-900/30 dark:text-rose-300' }
  };
  return map[status] || { label: status, bg: 'bg-gray-100 text-gray-800 border-gray-200' };
}
