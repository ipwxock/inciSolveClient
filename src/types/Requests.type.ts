/*
 En este archivo se tienen los diferentes tipos de datos que se utilizan en las peticiones HTTP.
 Cada tipo de dato representa un objeto que se envía o recibe en una petición HTTP, con un formato lo suficientemente simple para ser serializado y deserializado.
 */

/**
 * Este tipo de dato representa un cliente de la compañía de seguros.
 */
export type CustomerDTO = {
  id?: number
  dni: string
  first_name: string
  last_name: string
  email: string
  phone_number: string
  address: string
  role: 'Cliente'
}

/**
 * Este tipo de dato representa un usuario de  InciSolve.
 */
export type UserDTO = {
  dni: string
  first_name: string
  last_name: string
  email: string
  role: 'Cliente' | 'Empleado' | 'Manager' | ''
  company_id?: number
  address?: string
  phone_number?: string
}

/**
 * Este tipo de dato representa una póliza de seguro.
 */
export type InsuranceDTO = {
  subject_type:
    | 'Vida'
    | 'Robo'
    | 'Defunción'
    | 'Accidente'
    | 'Incendios'
    | 'Asistencia_carretera'
    | 'Salud'
    | 'Hogar'
    | 'Coche'
    | 'Moto'
    | 'Viaje'
    | 'Mascotas'
    | 'Otros'
    | ''
  description: string
  customer_id: number
  employee_id: number
}

/**
 * Este tipo de dato representa un empleado de la compañía de seguros.
 */
export type EmployeeDTO = {
  dni: string
  first_name: string
  last_name: string
  email: string
  company_id: number
  role: 'Empleado'
}

/**
 * Este tipo de dato representa un gerente de una compañía de seguros.
 */
export type ManagerDTO = {
  dni: string
  first_name: string
  last_name: string
  email: string
  company_id: number
  role: 'Manager'
}

/**
 * Este tipo de dato representa una incidencia relativa a una póliza de seguro.
 */
export type IssueDTO = {
  insurance_id: number
  subject: string
  status: 'Abierta' | 'Pendiente' | 'Cerrada' | ''
}

/**
 * Este tipo de dato representa una compañía de seguros.
 */
export type CompanyDTO = {
  name: string
  description: string
  phone_number: string
}
