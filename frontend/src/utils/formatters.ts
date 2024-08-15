// utils/formatters.ts
export const formatType = (type: string): string => {
    // Replace underscores with spaces, and convert the string to Pascal Case
    return type
      .split('_') // Split by underscore
      .map(word => word.charAt(0) + word.slice(1).toLowerCase()) // Capitalize the first letter of each word
      .join(' '); // Join words with spaces
  };
  