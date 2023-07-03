export const formatDate = (date: string = "") => {
    const separatedDate = date.split("T");
    const currentDate = separatedDate[0];
    return currentDate;
}