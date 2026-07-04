// Helper functions

export function formatCurrency(value, compact = false) {
  if (compact && value >= 1000000) {
    return `$${(value / 1000000).toFixed(1)}M`;
  }
  if (compact && value >= 1000) {
    return `$${(value / 1000).toFixed(0)}K`;
  }
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatNumber(value, compact = false) {
  if (compact && value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M`;
  }
  if (compact && value >= 1000) {
    return `${(value / 1000).toFixed(0)}K`;
  }
  return new Intl.NumberFormat('en-US').format(value);
}

export function formatPercent(value, decimals = 1) {
  return `${value >= 0 ? '+' : ''}${value.toFixed(decimals)}%`;
}

export function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function getStatusColor(status) {
  const colors = {
    active: 'badge-success',
    completed: 'badge-success',
    processing: 'badge-info',
    pending: 'badge-warning',
    trial: 'badge-info',
    beta: 'badge-info',
    inactive: 'badge-warning',
    cancelled: 'badge-danger',
    deprecated: 'badge-danger',
    generating: 'badge-info',
    ready: 'badge-success',
    limited: 'badge-warning',
    unlimited: 'badge-success',
  };
  return colors[status] || 'badge-info';
}

export function getTrendColor(trend) {
  return trend === 'up' ? 'text-emerald-400' : 'text-red-400';
}

export function truncateText(text, maxLength = 50) {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

export function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

export function getAvatarColor(initials) {
  const colors = [
    'from-cyan-500 to-blue-600',
    'from-blue-500 to-purple-600',
    'from-purple-500 to-pink-600',
    'from-emerald-500 to-teal-600',
    'from-orange-500 to-red-600',
    'from-fuchsia-500 to-purple-600',
  ];
  const index = initials.charCodeAt(0) % colors.length;
  return colors[index];
}
