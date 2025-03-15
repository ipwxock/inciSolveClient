/**
 * Este archivo contiene los diferentes tipos de datos que se utilizan en las respuestas HTTP.
 * Cada tipo de dato representa un objeto que se envía o recibe en una respuesta HTTP, con un formato lo suficientemente simple para ser serializado y deserializado.
 */

import type { Employee } from './Employee.type'
import type { User } from './User.type'
import type { Manager } from './Manager.type'
import type { Customer } from './Customer.type'
import type { Insurance } from './Insurance.type'
import type { Issue } from './Issue.type'
import type { Company } from './Company.type'

/**
 * Este tipo de dato representa la respuesta de una petición HTTP que devuelve un empleado.
 */
export type EmployeeResponse = {
  employee: Employee
  user: User
}

/**
 * Este tipo de dato representa la respuesta de una petición HTTP que devuelve un cliente.
 */
export type CustomerResponse = {
  customer: Customer
  user: User
}

/**
 * Este tipo de dato representa la respuesta de una petición HTTP que devuelve un gerente.
 */
export type DetailCustomerResponse = {
  customer: Customer
  user: User
  insurances: Insurance[]
  issues: Issue[]
  message?: string
}

/**
 * Este tipo de dato representa la respuesta de una petición HTTP que devuelve un empleado.
 */
export type DetailEmployeeResponse = {
  employee: Employee
  user: User
  insurances: Insurance[]
  issues: Issue[]
}

/**
 * Este tipo de dato representa la respuesta de una petición HTTP que devuelve un gerente.
 */
export type ManagerResponse = {
  manager: Manager
  user: User
}

/**
 * Este tipo de dato representa la respuesta de una petición HTTP que devuelve un gerente.
 */
export type AdminResponse = {
  user: User
}

/**
 * Este tipo de dato representa la respuesta de una petición HTTP que devuelve una compañía.
 */
export type DetailCompanyResponse = {
  company: Company
  employees: EmployeeResponse[]
  insurances: Insurance[]
  issues: Issue[]
}

/**
 * Este tipo de dato representa la respuesta de una petición HTTP que devuelve una compañía.
 */
export type InsuranceResponse = {
  insurance: Insurance
  employee: EmployeeResponse
  customer: CustomerResponse
}

/**
 * Este tipo de dato representa la respuesta de una petición HTTP que devuelve una compañía.
 */
export type DetailInsuranceResponse = {
  insurance: Insurance
  employee: EmployeeResponse
  customer: CustomerResponse
  issues: Issue[]
}

/**
 * Este tipo de dato representa la respuesta de una petición HTTP que devuelve una incidencia.
 */
export type IssueResponse = {
  issue: Issue
  insurance: Insurance
  employee: EmployeeResponse
  customer: CustomerResponse
}

/**
 * Este tipo de dato representa la respuesta de una petición HTTP que devuelve una incidencia.
 */
export type RoleResponse = {
  role: 'Cliente' | 'Empleado' | 'Manager' | 'Admin'
}
