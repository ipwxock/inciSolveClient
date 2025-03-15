/* Componente que muestra el detalle de una póliza de seguro. Permite eliminar la póliza y muestra
las incidencias asociadas a la misma. */
<template>
  <!-- Estado de carga -->
  <div v-if="loadingInsurance" class="pt-5 mt-5 text-center">
    <div class="spinner-border text-primary" role="status">
      <span class="visually-hidden">Cargando...</span>
    </div>
  </div>
  <div v-else>
    <div v-if="unauthorizedUser">
      <Unauthorized403 />
    </div>
    <div v-else>
      <Error404 v-if="!insuranceDetail" :entity="'pólizas'" />

      <!-- Mostrar los datos de la póliza cuando estén disponibles -->
      <div v-else class="container pt-4">
        <div class="row">
          <div class="col-6 text-start">
            <h3>
              <i class="fa-solid fa-handshake"></i
              ><strong> Detalle Póliza {{ insuranceDetail.insurance.id }}&nbsp;</strong>
            </h3>
          </div>
          <div class="col-6 text-end pe-5">
            <div class="col-12 col-md-12 pt-3">
              <div
                v-if="showDeleteResult.show"
                :class="showDeleteResult.success ? 'alert alert-success' : 'alert alert-danger'"
                role="alert"
              >
                {{ showDeleteResult.message }}
              </div>
            </div>
            <a @click="deleteInsurance()" class="btn btn-danger w-50" v-if="userRole !== 'Cliente'"
              >Eliminar Póliza</a
            >
          </div>
        </div>
        <div class="row">
          <createEditInsurance :insurance="insuranceDetail" />
        </div>
        <div class="row mb-5">
          <div class="col-12 pt-5">
            <h5><strong>Incidencias relativas a esta Póliza</strong></h5>
          </div>
          <div class="col-12">
            <div class="table-responsive">
              <table class="table table-striped">
                <thead>
                  <tr>
                    <th><strong>Fecha</strong></th>
                    <th><strong>Descripción</strong></th>
                    <th><strong>Estado</strong></th>
                    <th><strong>Acciones</strong></th>
                  </tr>
                </thead>
                <tbody v-if="insuranceDetail.issues">
                  <tr v-for="issue in insuranceDetail.issues" :key="issue.id">
                    <td>{{ formatDate(issue.created_at) }}</td>
                    <td>{{ issue.subject }}</td>
                    <td>{{ issue.status }}</td>
                    <td>
                      <a :href="'/issues/' + issue.id + '/see'" class="btn btn-primary"
                        >Ver detalle</a
                      >
                    </td>
                  </tr>
                </tbody>
                <tbody v-else>
                  <tr>
                    <td colspan="4" class="text-center">No hay incidencias registradas</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import Unauthorized403 from '../Errors/Unauthorized-403.vue'
import CreateEditInsurance from './create-edit-insurance.vue'
import Error404 from '../Errors/Error-404.vue'
import { HttpService } from '@/services/httpService'
import type { DetailInsuranceResponse } from '@/types/Responses.type'
import router from '@/router/routes'
import { formatDate } from '@/utils/date'

const userRole = localStorage.getItem('role')
const route = useRoute()
const httpservice = new HttpService()
const unauthorizedUser = ref(false)
const loadingInsurance = ref(false)
const insuranceDetail = ref<DetailInsuranceResponse | null>(null)
const showDeleteResult = ref({
  show: false,
  success: false,
  message: '',
})

onMounted(() => {
  fetchInsurance()
  showDeleteResult.value = {
    show: false,
    success: false,
    message: '',
  }
})

/**
 * Recupera la información de la póliza
 *
 * Usa el servicio HttpService para hacer la petición a la API.
 *
 * @returns {void}
 */
const fetchInsurance = async () => {
  loadingInsurance.value = true
  try {
    const response = await httpservice.get<DetailInsuranceResponse>(
      `insurances/${route.params.id}/get-insurance-detail`,
    )
    if (response.status === 403) {
      unauthorizedUser.value = true
      return
    }
    insuranceDetail.value = response.data ?? null
  } catch (error) {
    console.error('Error fetching employee:', error)
    insuranceDetail.value = null
  } finally {
    loadingInsurance.value = false
  }
}

/**
 * Elimina la póliza
 * @returns {void}
 */
const deleteInsurance = async () => {
  try {
    const response = await httpservice.delete(`insurances/${route.params.id}`)
    if (response.status === 200) {
      showDeleteResult.value = {
        show: true,
        success: true,
        message: 'Póliza eliminada correctamente. Redirigiendo...',
      }
      setTimeout(() => {
        router.push('/insurances')
      }, 2000)
    } else if (response.status == 403) {
      showDeleteResult.value = {
        show: true,
        success: false,
        message: 'No tienes permisos para realizar esta acción',
      }
    } else if (response.status == 400) {
      showDeleteResult.value = {
        show: true,
        success: false,
        message: response.error || 'Error al eliminar la póliza. Inténtelo de nuevo más tarde',
      }
    }
  } catch (error) {
    showDeleteResult.value = {
      show: true,
      success: false,
      message: 'Error al eliminar la póliza. Inténtelo de nuevo más tarde',
    }
  }
}
</script>
