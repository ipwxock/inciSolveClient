/*
  Este tipo representa a una empresa.
  Se utiliza para definir el tipo de dato de las empresas en la base de datos.
 */
export type Company = {
  id: number
  name: string
  description: string
  phone_number?: string
  created_at: Date
  updated_at: Date
}
