/**
 * Este tipo de dato representa un usuario de InciSolve.
 */
export type User = {
  id?: number
  dni: string
  first_name: string
  last_name: string
  email: string
  role: 'Admin' | 'Manager' | 'Empleado' | 'Cliente'
  created_at: Date
  updated_at: Date
}
