import { formatDistanceToNow, format, isThisYear } from 'date-fns';

/**
 * Returns a relative time string, e.g. "3 minutes ago"
 */
export const timeAgo = (dateString) => {
  try {
    return formatDistanceToNow(new Date(dateString), { addSuffix: true });
  } catch {
    return '';
  }
};

/**
 * Returns a full date string, e.g. "May 3, 2026" or "May 3" if this year
 */
export const formatDate = (dateString) => {
  try {
    const date = new Date(dateString);
    return isThisYear(date) ? format(date, 'MMM d') : format(date, 'MMM d, yyyy');
  } catch {
    return '';
  }
};

/**
 * Returns "May 3, 2026 at 4:45 PM"
 */
export const formatDateTime = (dateString) => {
  try {
    return format(new Date(dateString), "MMM d, yyyy 'at' h:mm a");
  } catch {
    return '';
  }
};
