/**
 * Formatea una fecha en formato dd/mm/yyyy
 *
 * @param date Fecha a formatear
 * @returns
 */
export const formatDate = (date: Date) => {
  const parsedDate = new Date(date)
  return new Intl.DateTimeFormat('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(parsedDate)
}
