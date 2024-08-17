// utils/formatters.ts
export const formatType = (type: string): string => {
    // Replace underscores with spaces, and convert the string to Pascal Case
    return type
      .split('_') // Split by underscore
      .map(word => word.charAt(0) + word.slice(1).toLowerCase()) // Capitalize the first letter of each word
      .join(' '); // Join words with spaces
  };
  

export const formatTypeDifference = (first: string, last?: string | undefined): string => {
  var eventStartTime = new Date(first);
  var eventEndTime = last === undefined ? new Date() : new Date(last);
  var duration = eventEndTime.valueOf() - eventStartTime.valueOf();

  const millisecondsPerDay = 24 * 60 * 60 * 1000;
  const millisecondsPerHour = 60 * 60 * 1000;
  // const millisecondsPerMinute = 60 * 1000;

  if (duration < millisecondsPerDay) {
    // Less than a day
    const hours = Math.floor(duration / millisecondsPerHour);
    // const minutes = Math.floor((duration % millisecondsPerHour) / millisecondsPerMinute);
    return `${hours} hour(s)`;
} else {
    // One day or more
    const differenceInDays = Math.floor(duration / millisecondsPerDay);
    return `${differenceInDays} day(s)`;
}
}