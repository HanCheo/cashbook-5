export const days = (month: number, year: number) => {
  return new Date(year, month, 0).getDate();
};
