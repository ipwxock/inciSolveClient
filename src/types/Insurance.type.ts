/*
  Este tipo representa a una póliza.
  Se utiliza para definir el tipo de dato de las pólizas en la base de datos.
*/
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
    | 'Moto'
    | 'Viaje'
    | 'Mascotas'
    | 'Otros'
  description: string
  customer_id: number
  employee_id: number
  created_at: Date
  updated_at: Date
}

/*
  Este tipo representa a el objeto de una póliza.
*/
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
  'Moto',
  'Viaje',
  'Mascotas',
  'Otros',
]
