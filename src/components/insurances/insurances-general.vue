/* Este componente se encarga de mostrar las pólizas de un usuario. Si el usuario está autorizado,
podrá ver todas sus pólizas, tanto como Empleado/Manager como Cliente. Si el usuario no está
autorizado, se mostrará un componente de error. */

<template>
  <div v-if="loadingInsurances" class="pt-5 mt-5 text-center">
    <div class="spinner-border text-primary" role="status">
      <span class="visually-hidden">Loading...</span>
    </div>
  </div>
  <div v-else>
    <div class="container-fluid" v-if="unauthorizedUser">
      <Unauthorized403 />
    </div>
    <div class="container-fluid" v-else>
      <h2 class="ps-3">Mis pólizas</h2>
      <section class="table-responsive">
        <table class="table table-striped" v-if="insurances !== null">
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
                <a
                  class="btn btn-primary"
                  :href="'/insurances/' + insurance.insurance.id + '/see'"
                  >{{ userRole === 'Cliente' ? 'Ver' : 'Editar' }}</a
                >
              </td>
            </tr>
          </tbody>
        </table>
        <p v-else class="text-center">No se encontraron pólizas.</p>
      </section>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { HttpService } from '@/services/httpService'
import type { InsuranceResponse } from '@/types/Responses.type'
import { onMounted, ref } from 'vue'
import Unauthorized403 from '../Errors/Unauthorized-403.vue'
import { formatDate } from '@/utils/date'

const httpService = new HttpService()
const insurances = ref<InsuranceResponse[] | null>(null)
const unauthorizedUser = ref(false)
const userRole = localStorage.getItem('role')
const loadingInsurances = ref(false)

onMounted(async () => {
  try {
    await fetchMyInsurances()
  } catch (error) {
    console.error('Error fetching insurances:', error)
  }
})

/**
 * Recupera todas las pólizas de Incisolve que pertenecen al usuario.
 *
 * Usa el servicio HttpService para hacer la petición a la API.
 *
 * @returns {void}
 */
const fetchMyInsurances = async () => {
  loadingInsurances.value = true
  try {
    const response = await httpService.get<InsuranceResponse[]>('get-my-insurances')
    if (response.status === 200) {
      insurances.value = response.data ?? null
    }
  } catch (error) {
    console.error('Error fetching insurances:', error)
  } finally {
    loadingInsurances.value = false
  }
}
</script>
