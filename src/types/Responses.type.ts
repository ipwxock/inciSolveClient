import type { Employee } from './Employee.type'
import type { User } from './User.type'
import type { Manager } from './Manager.type'
import type { Customer } from './Customer.type'
import type { Insurance } from './Insurance.type'
import type { Issue } from './Issue.type'
import type { Company } from './Company.type'

export type EmployeeResponse = {
  employee: Employee
  user: User
}

export type CustomerResponse = {
  customer: Customer
  user: User
}

export type DetailCustomerResponse = {
  customer: Customer
  user: User
  insurances: Insurance[]
  issues: Issue[]
  message?: string
}

export type DetailEmployeeResponse = {
  employee: Employee
  user: User
  insurances: Insurance[]
  issues: Issue[]
}

export type ManagerResponse = {
  manager: Manager
  user: User
}

export type AdminResponse = {
  user: User
}

export type DetailCompanyResponse = {
  company: Company
  employees: EmployeeResponse[]
  insurances: Insurance[]
  issues: Issue[]
}

export type InsuranceResponse = {
  insurance: Insurance
  employee: EmployeeResponse
  customer: CustomerResponse
}

export type DetailInsuranceResponse = {
  insurance: Insurance
  employee: EmployeeResponse
  customer: CustomerResponse
  issues: Issue[]
}

export type IssueResponse = {
  issue: Issue
  insurance: Insurance
  employee: EmployeeResponse
  customer: CustomerResponse
}

export type StoreRequestError = {
  error: string
}

export type RoleResponse = {
  role: 'Cliente' | 'Empleado' | 'Manager' | 'Admin'
}
