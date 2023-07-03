export const getDate = (date: string) => {
  const separateDate = date.split("/");
  return {
    month: separateDate[0],
    year: separateDate[1],
  };
};
