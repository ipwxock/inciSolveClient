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
    | 'Motocicleta'
    | 'Viaje'
    | 'Mascotas'
    | 'Otros'
  description: string
  customer_id: number
  employee_id: number
}

export type EmployeeDTO = {
  dni: string
  first_name: string
  last_name: string
  email: string
  company_id: number
  role: 'Empleado'
}

export type ManagerDTO = {
  dni: string
  first_name: string
  last_name: string
  email: string
  company_id: number
  role: 'Manager'
}

export type IssueDTO = {
  insurance_id: number
  description: string
  status: 'Abierta' | 'Pendiente' | 'Cerrada'
}

export type CompanyDTO = {
  name: string
  description: string
}
