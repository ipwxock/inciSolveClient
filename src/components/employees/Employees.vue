<template>
  <div class="container-fluid">
    <div class="row w-100">
      <div class="col-6 text-start">
        <h1>Empleados</h1>
      </div>
      <div class="col-6 text-end">
        <a href="/employees/new" class="btn btn-primary w-100">+ Nuevo Cliente</a>
      </div>
    </div>
  </div>
  <section>
    <table v-if="employeeResponse && employeeResponse.length > 0" class="table table-striped">
      <thead>
        <tr>
          <th>DNI</th>
          <th>Nombre</th>
          <th>Apellido</th>
          <th>Email</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="employeeData in employeeResponse" :key="employeeData.employee.id">
          <td>{{ employeeData.user.dni }}</td>
          <td>{{ employeeData.user.first_name }}</td>
          <td>{{ employeeData.user.last_name }}</td>
          <td>{{ employeeData.user.email }}</td>
          <td>
            <a :href="'/employees/' + employeeData.employee.id" class="btn btn-primary">Editar</a>
            <button @click="deleteemployee(employeeData.employee.id)" class="btn btn-danger">
              Eliminar
            </button>
          </td>
        </tr>
      </tbody>
    </table>
    <p v-else class="text-center">{{ errorDB ?? 'No se encontraron clientes.' }}</p>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { HttpService } from '@/services/httpService'
import type { EmployeeResponse } from '@/types/Responses.type'
import { useRoute } from 'vue-router'

const route = useRoute()
const httpService = new HttpService()
const employeeResponse = ref<EmployeeResponse[] | null>(null)

const employee = ref<EmployeeResponse | null>(null)
const employees = ref<EmployeeResponse[] | null>(null)

const errorDB = ref<string | null>(null)

onMounted(async () => {
  const employeeId = route.params.id

  if (employeeId) {
    // Si el ID del cliente existe, se obtiene un solo cliente
    try {
      const response = await httpService.get<EmployeeResponse>(``)
      employee.value = response ?? null // Asignamos null si la respuesta es undefined
    } catch (error) {
      console.error('Error fetching employees:', error)
      employeeResponse.value = null // Asigna null en caso de error
    }
  } else {
    // Si no existe, se obtienen todos los clientes
    try {
      const response = await httpService.get<EmployeeResponse[]>('get-my-employees')

      employeeResponse.value = response ?? null // Asignamos null si la respuesta es undefined
    } catch (error) {
      console.error('Error fetching employees:', error)
      employeeResponse.value = null // Asigna null en caso de error
    }
  }
})

watch(
  () => route.params.id,
  async (newId) => {
    if (newId) {
      employee.value = await httpService.get<EmployeeResponse>(`employees/${newId}`)
      employees.value = null
    } else {
      employees.value = await httpService.get<EmployeeResponse[]>('get-my-employees')
      employee.value = null
    }
  },
)

// Acción para eliminar un cliente
const deleteemployee = async (employeeId: number) => {
  try {
    await httpService.post(`employees/${employeeId}/delete`, {}) // Cambia según tu backend
    if (employeeResponse.value) {
      employeeResponse.value = employeeResponse.value.filter(
        (employee) => employee.employee.id !== employeeId,
      )
    }
  } catch (error) {
    console.error('Error deleting employee:', error)
  }
}
</script>

<style scoped>
.container-fluid {
  width: 100%;
}
</style>
