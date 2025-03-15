/* Componente para mostrar el detalle de un cliente - Muestra los datos del cliente - Muestra las
pólizas del cliente - Muestra las incidencias del cliente - Permite eliminar un cliente */
<template>
  <div class="container">
    <!-- Estado de carga -->
    <div v-if="loadingCustomers" class="text-center">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Cargando...</span>
      </div>
    </div>
    <div v-else>
      <div v-if="unauthorizedUser">
        <Unauthorized403 :message="message403" />
      </div>
      <div v-else>
        <Error404 v-if="!customerDetail" :entity="entity" />

        <!-- Mostrar los datos del cliente cuando estén disponibles -->
        <div v-else>
          <div class="row">
            <div class="col-12 col-md-6">
              <h3><strong>Datos Cliente</strong></h3>
            </div>
            <div class="col-12 col-md-6 pb-5 text-end">
              <div class="container">
                <div class="row">
                  <div
                    class="col-8"
                    v-if="showDeleteResult.show"
                    :class="showDeleteResult.success ? 'alert alert-success' : 'alert alert-danger'"
                    role="alert"
                  >
                    {{ showDeleteResult.message }}
                  </div>
                  <div class="col-6 col-md-3">
                    <a @click="deleteCustomer()" class="btn btn-danger w-100">Eliminar Cliente</a>
                  </div>
                </div>
              </div>
            </div>

            <CreateEditCustomer :customer="customerDetail" />

            <div class="row mt-4">
              <h3><strong>Pólizas Cliente</strong></h3>
              <div class="table-responsive">
                <table class="table table-striped">
                  <thead>
                    <tr>
                      <th>Tipo</th>
                      <th>Fecha Inicio</th>
                      <th>Fecha Fin</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="insurance in customerDetail.insurances" :key="insurance.id">
                      <td>{{ insurance.subject_type }}</td>
                      <td>{{ formatDate(insurance.created_at) }}</td>
                      <td>{{ insurance.description }}</td>
                      <td>
                        <a
                          :href="'/insurances/' + insurance.id + '/see'"
                          class="btn btn-primary me-1"
                          >Ver Detalle</a
                        >
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div class="row mt-4">
              <h3><strong>Incidencias Cliente</strong></h3>
              <div class="table-responsive">
                <table class="table table-striped">
                  <thead>
                    <tr>
                      <th>Fecha</th>
                      <th>Descripción</th>
                      <th>Estado</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="issue in customerDetail.issues" :key="issue.id">
                      <td>{{ formatDate(issue.created_at) }}</td>
                      <td>{{ issue.subject }}</td>
                      <td>{{ issue.status }}</td>
                      <td>
                        <a :href="'/issues/' + issue.id" class="btn btn-primary me-1"
                          >Ver Detalle</a
                        >
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import Error404 from '../Errors/Error-404.vue'
import type { DetailCustomerResponse } from '@/types/Responses.type'
import { HttpService } from '@/services/httpService'
import CreateEditCustomer from './create-edit-customer.vue'
import Unauthorized403 from '../Errors/Unauthorized-403.vue'
import { formatDate } from '@/utils/date'

const httpService = new HttpService()
const route = useRoute()
const entity = ref('Cliente')
const customerDetail = ref<DetailCustomerResponse | null>(null)
const loadingCustomers = ref(true)
const unauthorizedUser = ref(false)
const message403 = ref('')
const showDeleteResult = ref({
  show: false,
  success: false,
  message: '',
})

onMounted(() => {
  fetchCustomer()
})

/**
 * Función para obtener los datos del cliente
 *
 * Usa el servicio HttpService para obtener los datos del cliente usando su ID
 *
 * @returns {void}
 */
const fetchCustomer = async () => {
  const customerId = route.params.id as string

  if (!customerId) {
    loadingCustomers.value = false
    return
  }

  try {
    const response = await httpService.get<DetailCustomerResponse>(
      `customers/${customerId}/get-customer-detail`,
    )

    if (response.status === 403) {
      unauthorizedUser.value = true
      message403.value = response.data?.message ?? ''
      return
    }

    customerDetail.value = response.data ?? null
  } catch (error) {
    console.error('Error fetching customer:', error)
    customerDetail.value = null
  } finally {
    loadingCustomers.value = false
  }
}

/**
 * Función para eliminar un cliente
 * @returns {void}
 */
const deleteCustomer = async () => {
  showDeleteResult.value = {
    show: true,
    success: false,
    message:
      'Para eliminar un cliente, simplemente debe eliminar todas las Pólizas que le ha hecho.',
  }
}
</script>

<style scoped>
/* Estilos específicos del componente */
</style>
