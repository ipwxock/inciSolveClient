<template>
  <div v-if="loadingCustomers" class="pt-5 mt-5 text-center">
    <div class="spinner-border text-primary pt-5 mt-5" role="status">
      <span class="visually-hidden">Cargando...</span>
    </div>
  </div>
  <div v-else>
    <section>
      <div v-if="customerResponse && customerResponse.length > 0" class="table-responsive">
        <table class="table table-striped">
          <thead>
            <tr>
              <th>DNI</th>
              <th>Nombre</th>
              <th>Apellido</th>
              <th>Email</th>
              <th>Teléfono</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="customerData in customerResponse" :key="customerData.customer.id">
              <td>{{ customerData.user.dni }}</td>
              <td>{{ customerData.user.first_name }}</td>
              <td>{{ customerData.user.last_name }}</td>
              <td>{{ customerData.user.email }}</td>
              <td>{{ customerData.customer.phone_number }}</td>
              <td>
                <a :href="'/customers/' + customerData.customer.id" class="btn btn-primary me-1"
                  >Ver Detalle</a
                >
                <button @click="showModal(customerData.customer.id!)" class="btn btn-danger">
                  Eliminar
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <p v-else class="text-center">No se encontraron clientes.</p>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { HttpService } from '@/services/httpService'
import type { CustomerResponse } from '@/types/Responses.type'

const httpService = new HttpService()
const customerResponse = ref<CustomerResponse[] | null>(null)
const loadingCustomers = ref(true)

const fetchCustomers = async () => {
  // Si no existe, se obtienen todos los clientes
  try {
    // Realizamos la llamada HTTP y validamos la respuesta
    const response = await httpService.get<CustomerResponse[]>('get-my-customers')
    customerResponse.value = response.data ?? null // Asignamos null si la respuesta es undefined
  } catch (error) {
    console.error('Error fetching customers:', error)
    customerResponse.value = null // Asigna null en caso de error
  } finally {
    loadingCustomers.value = false
  }
}

onMounted(fetchCustomers)

const showModal = (customerId?: number) => {
  if (customerId === undefined || customerId === null) {
    console.error('Error: El ID del cliente es inválido.')
    return // Evita ejecutar código innecesario
  }

  if (confirm('¿Estás seguro de eliminar este cliente?')) {
    deleteCustomer(customerId)
  }
}

const deleteCustomer = async (customerId?: number) => {
  if (customerId === undefined || customerId === null) {
    console.error('Error: No se puede eliminar un cliente sin ID.')
    return
  }

  try {
    const res = await httpService.delete(`customers/${customerId}`)
    if (res.status === 200 && customerResponse.value) {
      customerResponse.value = customerResponse.value.filter(
        (customer) => customer.customer.id !== customerId,
      )
    }
  } catch (error) {
    console.error('Error deleting customer:', error)
  }
}
</script>

<style scoped>
.container-fluid {
  width: 100%;
}
</style>
