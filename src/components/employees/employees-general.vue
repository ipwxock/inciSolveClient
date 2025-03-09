<template>
  <div v-if="loadingEmployees" class="pt-5 mt-5 text-center">
    <div class="spinner-border text-primary" role="status">
      <span class="visually-hidden">Cargando...</span>
    </div>
  </div>
  <div v-else>
    <div v-if="unauthorizedUser">
      <Unauthorized403 />
    </div>
    <div v-else>
      <section class="table-responsive">
        <table v-if="employees !== null" class="table table-striped">
          <thead>
            <tr>
              <th>DNI</th>
              <th>Nombre</th>
              <th>Apellido</th>
              <th>Email</th>
              <th>Role</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="employee in employees" :key="employee.employee.id">
              <td>{{ employee.user.dni }}</td>
              <td>{{ employee.user.first_name }}</td>
              <td>{{ employee.user.last_name }}</td>
              <td>{{ employee.user.email }}</td>
              <td>{{ employee.user.role }}</td>
              <td>
                <a :href="'/employees/' + employee.employee.id" class="btn btn-primary"
                  >Ver detalle</a
                >
              </td>
            </tr>
          </tbody>
        </table>
        <p v-else class="text-center">{{ 'No se encontraron empleados.' }}</p>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { HttpService } from '@/services/httpService'
import type { EmployeeResponse } from '@/types/Responses.type'
import Unauthorized403 from '@/components/Errors/Unauthorized-403.vue'

const httpService = new HttpService()
const employees = ref<EmployeeResponse[] | null>(null)
const unauthorizedUser = ref(false)
const loadingEmployees = ref(true)

onMounted(async () => {
  try {
    loadingEmployees.value = true
    const response = await httpService.get<EmployeeResponse[]>('get-my-employees')
    if (response.status === 403) {
      unauthorizedUser.value = true
    }
    employees.value = response.data ?? null // Asignamos null si la respuesta es undefined
  } catch (error) {
    console.error('Error fetching employees:', error)
    employees.value = null // Asigna null en caso de error
  } finally {
    loadingEmployees.value = false
  }
})
</script>

<style scoped></style>
