export type Insurance = {
  id: number
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
  created_at: Date
  updated_at: Date
}

export const InsuranceSubject = [
  'Vida',
  'Robo',
  'Defunción',
  'Accidente',
  'Incendios',
  'Asistencia_carretera',
  'Salud',
  'Hogar',
  'Coche',
  'Motocicleta',
  'Viaje',
  'Mascotas',
  'Otros',
]
