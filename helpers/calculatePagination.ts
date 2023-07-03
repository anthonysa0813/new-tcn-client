export const calculatePagination = (total: number, divisor: number) => {
  if (total % divisor === 0) {
    return total / divisor;
  } else {
    return Math.round(total / divisor);
  }
};
