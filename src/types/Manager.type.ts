/*
  Este tipo representa un gerente de una compañía de seguros.
  Un gerente es un usuario con permisos especiales para gestionar la información de la compañía.
*/
export type Manager = {
  id: number
  auth_id: number
  company_id: number
}
