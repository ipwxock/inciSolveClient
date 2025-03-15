/*
  Este tipo de dato representa una incidencia relativa a una póliza de seguro.
  Una incidencia puede estar abierta, pendiente o cerrada.
*/
export type Issue = {
  id: number
  insurance_id: number
  subject: string
  status: 'Abierta' | 'Pendiente' | 'Cerrada'
  created_at: Date
  updated_at: Date
}
