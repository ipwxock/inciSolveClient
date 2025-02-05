<template>
  <div class="container">
    <!-- Estado de carga -->
    <div v-if="loadingCustomers" class="text-center">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Cargando...</span>
      </div>
    </div>

    <!-- Mostrar error 404 si no se encuentra el cliente -->
    <Error404 v-else-if="!customerDetail" :entity="entity" />

    <!-- Mostrar los datos del cliente cuando estén disponibles -->
    <div v-else>
      <div class="row">
        <h3>Datos Cliente</h3>
        <input type="hidden" v-model="customerDetail.customer.id" />
        <div class="col-12 col-md-4 pb-sm-3">
          <label for="DNI">DNI:</label>
          <input
            id="DNI"
            type="text"
            class="form-control"
            v-model="customerDetail.user.dni"
            disabled
          />
        </div>
        <div class="col-12 col-md-4 pb-sm-3">
          <label for="nombre">Nombre:</label>
          <input
            id="nombre"
            type="text"
            class="form-control"
            v-model="customerDetail.user.first_name"
          />
        </div>
        <div class="col-12 col-md-4 pb-sm-3">
          <label for="apellido">Apellido:</label>
          <input
            id="apellido"
            type="text"
            class="form-control"
            v-model="customerDetail.user.last_name"
          />
        </div>
        <div class="col-12 col-md-4 pb-sm-3">
          <label for="direccion">Dirección:</label>
          <input
            id="direccion"
            type="text"
            class="form-control"
            v-model="customerDetail.customer.address"
          />
        </div>
        <div class="col-12 col-md-4 pb-sm-3">
          <label for="email">Email:</label>
          <input
            id="email"
            type="email"
            class="form-control"
            v-model="customerDetail.user.email"
            disabled
          />
        </div>
        <div class="col-12 col-md-4 pb-sm-3">
          <label for="telefono">Teléfono:</label>
          <input
            id="telefono"
            type="tel"
            class="form-control"
            v-model="customerDetail.customer.phone_number"
          />
        </div>
        <div class="col-12 col-md-4 pb-sm-3">
          <button class="btn btn-primary mt-3" @click="editCustomer">Editar</button>
        </div>
      </div>

      <div class="row mt-4">
        <h3>Pólizas Cliente</h3>
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
                <a :href="'/policies/' + insurance.id" class="btn btn-primary me-1">Ver Detalle</a>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="row mt-4">
        <h3>Incidencias Cliente</h3>
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
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import Error404 from '../Errors/Error-404.vue'
import type { DetailCustomerResponse } from '@/types/Responses.type'
import { HttpService } from '@/services/httpService'
import type { CustomerDTO } from '@/types/Requests.type'

const httpService = new HttpService()
const route = useRoute()
const entity = ref('Cliente')
const customerDetail = ref<DetailCustomerResponse | null>(null)
const loadingCustomers = ref(true)

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
    customerDetail.value = response.data ?? null
  } catch (error) {
    console.error('Error fetching customer:', error)
    customerDetail.value = null
  } finally {
    loadingCustomers.value = false
  }
}

const editCustomer = () => {

  if (customerDetail.value?.user.dni &&
   customerDetail.value?.user.first_name &&
    customerDetail.value?.user.last_name &&
     customerDetail.value?.user.email &&
      customerDetail.value?.customer.phone_number &&
       customerDetail.value?.customer.address) {

        const customerToUpdate: CustomerDTO = {
    id: customerDetail.value?.customer.id,
    dni: customerDetail.value?.user.dni,
    first_name: customerDetail.value?.user.first_name,
    last_name: customerDetail.value?.user.last_name,
    email: customerDetail.value?.user.email,
    phone_number: customerDetail.value?.customer.phone_number,
    address: customerDetail.value?.customer.address,
    role: 'Cliente'
  }
  } else {
    console.log('Datos incompletos')
  }



  if
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('es-ES').format(date) // Formato local (España)
}
</script>

<style scoped>
/* Estilos específicos del componente */
</style>
