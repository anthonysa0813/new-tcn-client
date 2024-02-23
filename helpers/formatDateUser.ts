export const formatDateUser = (date: string) => {
  // Dividir la cadena en partes (año, mes, día)
  const partes = date.split("-");
  // Crear un objeto de fecha en formato "YY-MM-DD"
  const fechaObjeto = new Date(
    Number(partes[0]),
    Number(partes[1]) - 1,
    Number(partes[2])
  ); // Restamos 1 al mes porque en JavaScript los meses van de 0 a 11
  // Obtener los componentes de fecha (día, mes, año)
  return `${partes[2]}-${partes[1]}-${partes[0]}`;
};

