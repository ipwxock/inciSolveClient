<script lang="ts" setup>
import { HttpService } from '@/services/httpService'
import type { InsuranceResponse } from '@/types/Responses.type'
import { onMounted, ref } from 'vue'

const httpService = new HttpService()
const insurances = ref<InsuranceResponse[] | null>(null)

const userRole = localStorage.getItem('role')

onMounted(async () => {
  try {
    const response = await httpService.get<InsuranceResponse[]>('get-my-insurances')
    insurances.value = response ?? null
  } catch (error) {
    console.error('Error fetching insurances:', error)
  }
})

const formatDate = (date: Date) => {
  const parsedDate = new Date(date)
  return new Intl.DateTimeFormat('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(parsedDate)
}
</script>

<template>
  <h1>Mis pólizas</h1>
  <section>
    <table class="table table-stripped" v-if="insurances && insurances.length">
      <thead>
        <tr>
          <th><strong>Objeto</strong></th>
          <th><strong>Empleado</strong></th>
          <th><strong>Cliente</strong></th>
          <th><strong>Fecha de creación</strong></th>
          <th><strong>Última modificación</strong></th>
          <th><strong>Acciones</strong></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="insurance in insurances" :key="insurance.insurance.id">
          <td>{{ insurance.insurance.subject_type }}</td>
          <td>
            {{ insurance.employee.user.first_name + ' ' + insurance.employee.user.last_name }}
          </td>
          <td>
            {{ insurance.customer.user.first_name + ' ' + insurance.customer.user.last_name }}
          </td>
          <td>{{ formatDate(insurance.insurance.created_at) }}</td>
          <td>{{ formatDate(insurance.insurance.updated_at) }}</td>
          <td>
            <a class="btn btn-primary" :href="'/insurances/' + insurance.insurance.id">{{
              userRole === 'Cliente' ? 'Ver' : 'Editar'
            }}</a>
            <button class="btn btn-danger">Eliminar</button>
          </td>
        </tr>
      </tbody>
    </table>
    <p v-else class="text-center">No se encontraron pólizas.</p>
  </section>
</template>
