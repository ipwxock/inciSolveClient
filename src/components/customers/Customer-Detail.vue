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
        <Unauthorized403 />
      </div>
      <div v-else>
        <Error404 v-if="!customerDetail" :entity="entity" />

        <!-- Mostrar los datos del cliente cuando estén disponibles -->
        <div v-else>
          <div class="row">
            <h3><strong>Datos Cliente</strong></h3>
            <CreateEditCustomer :customer="customerDetail" />

            <div class="row mt-4">
              <h3><strong>Pólizas Cliente</strong></h3>
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
                    <td>{{ formatDate(insurance.created_at.toString()) }}</td>
                    <td>{{ insurance.description }}</td>
                    <td>
                      <a :href="'/policies/' + insurance.id" class="btn btn-primary me-1"
                        >Ver Detalle</a
                      >
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div class="row mt-4">
              <h3><strong>Incidencias Cliente</strong></h3>
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
                    <td>{{ formatDate(issue.created_at.toString()) }}</td>
                    <td>{{ issue.subject }}</td>
                    <td>{{ issue.status }}</td>
                    <td>
                      <a :href="'/issues/' + issue.id" class="btn btn-primary me-1">Ver Detalle</a>
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
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import Error404 from '../Errors/Error-404.vue'
import type { DetailCustomerResponse } from '@/types/Responses.type'
import { HttpService } from '@/services/httpService'
import CreateEditCustomer from './create-edit-customer.vue'
import Unauthorized403 from '../Errors/Unauthorized-403.vue'

const httpService = new HttpService()
const route = useRoute()
const entity = ref('Cliente')
const customerDetail = ref<DetailCustomerResponse | null>(null)
const loadingCustomers = ref(true)
const unauthorizedUser = ref(false)

onMounted(() => {
  fetchCustomer()
})

watch(customerDetail, async () => {
  console.log('customerDetail:', customerDetail)
})

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

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('es-ES').format(date) // Formato local (España)
}
</script>

<style scoped>
/* Estilos específicos del componente */
</style>
