export const toCountdown = (date?: Date | string) => {
  if (!date) {
    date = new Date(Date.now());
  }

  if (typeof date === 'string') {
    date = new Date(date);
  }

  const now = new Date();
  const diff = date.getTime() - now.getTime();
  const months = Math.floor(diff / (1000 * 60 * 60 * 24 * 30));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const minutes = Math.floor(diff / (1000 * 60));

  if (months > 0) {
    return `${months} month${months > 1 ? 's' : ''}`;
  } else if (days > 0) {
    return `${days} day${days > 1 ? 's' : ''}`;
  } else {
    return `${minutes} minute${minutes > 1 ? 's' : ''}`;
  }
};
