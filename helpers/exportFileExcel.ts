import { utils, writeFile } from "xlsx";

export const generateExcelFile = (data: any) => {
  console.log("data: ", data);
  let wb = utils.book_new();
  let ws = utils.json_to_sheet(data);
  utils.book_append_sheet(wb, ws, "Lista de Empleados");
  writeFile(wb, "ListaDeEmpleados.xlsx");
};
