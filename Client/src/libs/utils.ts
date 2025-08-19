export const calculateProgress = (current: number, total: number) => {
  return Math.min((current / total) * 100, 100);
};