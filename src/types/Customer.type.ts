/*
  Este tipo representa a un cliente.
  Se utiliza para definir el tipo de dato de los clientes en la base de datos.
*/
export type Customer = {
  id?: number
  auth_id?: number
  phone_number: string
  address: string
}
