export type Issue = {
  id: number
  insurance_id: number
  subject: string
  status: 'Abierta' | 'Pendiente' | 'Cerrada'
  created_at: Date
  updated_at: Date
}
