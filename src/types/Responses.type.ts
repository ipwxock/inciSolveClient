import type { Employee } from './Employee.type'
import type { User } from './User.type'
import type { Manager } from './Manager.type'
import type { Customer } from './Customer.type'
import type { Insurance } from './Insurance.type'
import type { Issue } from './Issue.type'

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
}

export type ManagerResponse = {
  manager: Manager
  user: User
}

export type AdminResponse = {
  user: User
}

export type InsuranceResponse = {
  insurance: Insurance
  employee: EmployeeResponse
  customer: CustomerResponse
}

export type StoreRequestError = {
  error: string
}
