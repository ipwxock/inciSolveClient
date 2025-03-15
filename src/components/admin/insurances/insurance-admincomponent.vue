/* Este componente es el encargado de mostrar todas las pólizas de Incisolve. Sólo un Admin puede
acceder. Se encarga de mostrar una tabla con todas las pólizas, permitiendo filtrarlas por el objeto
de la póliza, el nombre del empleado que la creó, el nombre del cliente al que pertenece y la fecha
de creación de la póliza. */
<template>
  <div class="container-fluid px-md-3">
    <div class="row justify-content-space-evenly align-items-center">
      <div class="col-12 col-md-4">
        <h1><i class="fa-solid fa-handshake"></i>Pólizas de Incisolve</h1>
      </div>

      <div class="col-12 col-md-4">
        <router-link :to="route.path + '/new'">
          <a class="btn btn-primary px-5">+ Añadir Póliza</a>
        </router-link>
      </div>
    </div>
    <div class="row pt-3">
      <div class="col-12 col-md-4">
        <div class="form-group">
          <label for="search">Buscar póliza</label>
          <input
            type="text"
            v-model="searchString"
            class="form-control"
            id="search"
            placeholder="Ej: Mascotas..."
          />
        </div>
      </div>
      <div class="col-12 col-md-12 pt-3">
        <div
          v-if="showRequestResult.show"
          :class="showRequestResult.success ? 'alert alert-success' : 'alert alert-danger'"
          role="alert"
        >
          {{ showRequestResult.message }}
        </div>
      </div>
    </div>
    <div v-if="loadingInsurances" class="pt-5 mt-5 text-center">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>
    <section v-else class="table-responsive">
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
          <tr v-for="insurance in filteredInsurances" :key="insurance.insurance.id">
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
              <router-link :to="route.path + '/' + insurance.insurance.id">
                <a class="btn btn-primary">Ver</a>
              </router-link>
              <a class="btn btn-danger" @click="deleteInsurance(insurance.insurance.id)"
                >Eliminar</a
              >
            </td>
          </tr>
        </tbody>
      </table>
      <p v-else class="text-center">No se encontraron pólizas.</p>
    </section>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import { ref, onMounted, watch } from 'vue'
import type { InsuranceResponse } from '@/types/Responses.type'
import { HttpService } from '@/services/httpService'
import { formatDate } from '@/utils/date'

const route = useRoute()
const httpService = new HttpService()
const insurances = ref<InsuranceResponse[] | null>(null)
const filteredInsurances = ref<InsuranceResponse[] | null>(null)
const searchString = ref('')
const loadingInsurances = ref(false)
const showRequestResult = ref({
  success: false,
  message: '',
  show: false,
})

onMounted(async () => {
  try {
    await fetchInsurances()
  } catch (error) {
    console.error('Error fetching insurances:', error)
  }
})

watch(searchString, (value) => {
  if (value !== '' && insurances.value) {
    filteredInsurances.value = insurances.value?.filter(
      (insurance) =>
        insurance.insurance.subject_type.toLowerCase().includes(value.toLowerCase()) ||
        insurance.employee.user.first_name.toLowerCase().includes(value.toLowerCase()) ||
        insurance.employee.user.last_name.toLowerCase().includes(value.toLowerCase()) ||
        formatDate(insurance.insurance.created_at)
          .toString()
          .toLowerCase()
          .includes(value.toLowerCase()),
    )
  } else {
    filteredInsurances.value = insurances.value
  }
})

/**
 * Recupera todas las pólizas de Incisolve.
 *
 * Usa el servicio HTTP para hacer una petición GET a la API de Incisolve y recuperar todas las pólizas
 *
 * @returns {void}
 */
const fetchInsurances = async () => {
  loadingInsurances.value = true
  try {
    const response = await httpService.get<InsuranceResponse[]>('insurances')
    if (response.status === 200) {
      insurances.value = response.data ?? null
      filteredInsurances.value = insurances.value
    }
  } catch (error) {
    console.error('Error fetching insurances:', error)
  } finally {
    loadingInsurances.value = false
  }
}

/**
 * Elimina una póliza de Incisolve.
 * @param id ID de la póliza a eliminar.
 * @returns {void}
 */
const deleteInsurance = async (id: number) => {
  try {
    const response = await httpService.delete(`insurances/${id}`)
    if (response.status === 200) {
      fetchInsurances()
      showRequestResult.value = {
        success: true,
        message: 'Póliza eliminada correctamente.',
        show: true,
      }
    } else {
      showRequestResult.value = {
        success: false,
        message: 'Error al eliminar la póliza.' + response.error,
        show: true,
      }
    }
  } catch (error) {
    console.error('Error deleting insurance:', error)
    showRequestResult.value = {
      success: false,
      message: 'Error al eliminar la póliza. Inténtalo de nuevo más tarde.',
      show: true,
    }
  }
}
</script>
