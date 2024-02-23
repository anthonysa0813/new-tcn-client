import { utils, writeFile } from "xlsx";

export const generateExcelFile = (data: any) => {
  const newDataFormat = data.map((d: any) => ({
           nombre: d.name || "",
           apellidos: d.surnames || "",
	   distrito: d.district || "",
           pais: d.country || "",
	   telefono: d.phone || "",
           cv: d.cv || "",
           email: d.email || "",
           github: d.github || "",
           idioma1: `${ d.languages[0]?.lang || ""} - ${ d.languages[0]?.levelOral || ""}` || "",
          idioma2: `${ d.languages[1]?.lang || ""} - ${ d.languages[1]?.levelOral || ""}` || "",
           idioma3: `${ d.languages[2]?.lang || ""} - ${ d.languages[2]?.levelOral || ""}` || "",
           idioma4: `${ d.languages[3]?.lang || ""} - ${ d.languages[3]?.levelOral}` || "",
           linkedin: d.linkedin || "",
           habilidad1: `${ d.skills[0]?.name || ""} - ${ d.skills[0]?.level || ""}` || "",
    habilidad2: `${ d.skills[1]?.name || ""} - ${ d.skills[1]?.level || ""}` || "",
    habilidad3: `${ d.skills[2]?.name || ""} - ${ d.skills[2]?.level || ""}` || "",
    habilidad4: `${ d.skills[3]?.name || ""} - ${ d.skills[3]?.level || ""}` || "",
    habilidad5: `${ d.skills[4]?.name || ""} - ${ d.skills[4]?.level || ""}` || "",
    habilidad6: `${ d.skills[5]?.name || ""} - ${ d.skills[5]?.level || ""}` || "",
        }))
   console.log("data: ", newDataFormat);
  let wb = utils.book_new();
  let ws = utils.json_to_sheet(newDataFormat);
  utils.book_append_sheet(wb, ws, "Lista de Empleados");
  writeFile(wb, "ListaDeEmpleados.xlsx");
};
