export type Issue = {
  id: number
  insurance_id: number
  subject: string
  status: Status
  created_at: Date
  updated_at: Date
}

enum Status {
  'Pendiente',
  'Abierta',
  'Cerrada',
}
