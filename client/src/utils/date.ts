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

export const toAge = (birthDate: Date | string): string => {
  if (typeof birthDate === 'string') {
    birthDate = new Date(birthDate);
  }

  const today = new Date();
  const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
  const oneWeek = oneDay * 7;
  const oneMonth = oneDay * 30;
  const oneYear = oneDay * 365;

  const diffDays = Math.round(
    Math.abs((today.getTime() - birthDate.getTime()) / oneDay)
  );
  const diffWeeks = Math.round(
    Math.abs((today.getTime() - birthDate.getTime()) / oneWeek)
  );
  const diffMonths = Math.round(
    Math.abs((today.getTime() - birthDate.getTime()) / oneMonth)
  );
  const diffYears = Math.round(
    Math.abs((today.getTime() - birthDate.getTime()) / oneYear)
  );

  if (diffDays === 0) {
    return `Today!`;
  } else if (diffDays < 7 && diffDays > 0) {
    return `${diffDays} ${diffDays > 1 ? 'days' : 'day'} old`;
  } else if (diffWeeks < 4 && diffWeeks > 0) {
    const weeks = Math.floor(diffDays / 7);
    const days = diffDays % 7;
    return `${weeks} ${weeks > 1 ? 'weeks' : 'week'}${
      days > 0 ? ` and ${days} ${days > 1 ? 'days' : 'day'}` : ''
    } old`;
  } else if (diffMonths < 12 && diffMonths > 0) {
    const months = Math.floor(diffDays / 30);
    const weeks = Math.floor((diffDays % 30) / 7);
    return `${months} ${months > 1 ? 'months' : 'month'}${
      weeks > 0 ? ` and ${weeks} ${weeks > 1 ? 'weeks' : 'week'}` : ''
    } old`;
  } else {
    const years = Math.floor(diffDays / 365);
    const months = Math.floor((diffDays % 365) / 30);
    return `${years} ${years > 1 ? 'years' : 'year'}${
      months > 0 ? ` and ${months} ${months > 1 ? 'months' : 'month'}` : ''
    } old`;
  }
};

export const toTimeAgo = (date?: Date | string) => {
  if (!date) {
    date = new Date(Date.now());
  }
  if (typeof date === 'string') {
    date = new Date(date);
  }

  const today = new Date();
  const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
  const oneMonth = oneDay * 30; // approximate average month duration
  const oneYear = oneDay * 365; // days*hours*minutes*seconds*milliseconds

  const diffDays = Math.round(
    Math.abs((today.getTime() - date.getTime()) / oneDay)
  );
  const diffMonths = Math.round(
    Math.abs((today.getTime() - date.getTime()) / oneMonth)
  );
  const diffYears = Math.round(
    Math.abs((today.getTime() - date.getTime()) / oneYear)
  );

  if (diffYears > 0) {
    return { time: diffYears, unit: formatTimeUnit(diffYears, 'Years') };
  } else if (diffMonths > 0) {
    return { time: diffMonths, unit: formatTimeUnit(diffMonths, 'Months') };
  } else {
    return { time: diffDays, unit: formatTimeUnit(diffDays, 'Days') };
  }
};

const formatTimeUnit = (time: number, unit: string) => {
  if (time === 1) {
    return unit.slice(0, -1);
  } else {
    return unit;
  }
};

export const DateStringOptions: Intl.DateTimeFormatOptions = {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric'
};

export const toListingAge = (listedDate: Date | string): string => {
  if (typeof listedDate === 'string') {
    listedDate = new Date(listedDate);
  }

  const today = new Date();
  const oneMinute = 60 * 1000; // minutes*seconds*milliseconds
  const oneDay = 24 * 60 * oneMinute; // hours*minutes*seconds*milliseconds

  const diffMinutes = Math.round(
    Math.abs((today.getTime() - listedDate.getTime()) / oneMinute)
  );
  const diffHours = Math.floor(
    (today.getTime() - listedDate.getTime()) / (1000 * 60 * 60)
  );
  const remainingHours = diffHours % 24;
  const diffDays = Math.floor(diffMinutes / (24 * 60));
  const remainingMinutes = diffMinutes % (24 * 60);

  if (diffHours === 0) {
    return 'just now';
  } else if (diffHours < 24 && diffHours > 0) {
    return `${diffHours} ${diffHours > 1 ? 'hours' : 'hour'} ago`;
  } else {
    return `${diffDays} ${diffDays > 1 ? 'days' : 'day'} ago`;
  }
};
