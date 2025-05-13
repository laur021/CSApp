export const formatDate = (date: Date): string => {
  return date.toLocaleDateString('sv-SE'); // "sv-SE" ensures YYYY-MM-DD format
};
