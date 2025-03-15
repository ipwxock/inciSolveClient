/* Este componente se encarga de mostrar todos los clientes que tiene el usuario logueado. Se
obtienen los clientes a través de una llamada HTTP al backend. Si no hay clientes, se muestra un
mensaje indicando que no se encontraron clientes. Si hay clientes, se muestra una tabla con los
datos de los clientes y un botón para ver el detalle de cada cliente. */
<template>
  <div v-if="loadingCustomers" class="pt-5 mt-5 text-center">
    <div class="spinner-border text-primary pt-5 mt-5" role="status">
      <span class="visually-hidden">Cargando...</span>
    </div>
  </div>
  <div v-else>
    <p class="ps-3">
      En esta sección podrás visualizar todos los clientes que tienes registrados en el sistema.
      Esto es, todos los clientes a los que les has vendido algún seguro y tienen su póliza creada.
    </p>
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
              <td class="customer-email">{{ customerData.user.email }}</td>
              <td>{{ customerData.customer.phone_number }}</td>
              <td>
                <a :href="'/customers/' + customerData.customer.id" class="btn btn-primary me-1"
                  >Ver Detalle</a
                >
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

/**
 * Obtiene todos los clientes del usuario logueado.
 *
 * Usa el servicio httpService para obtener los clientes a través de una llamada HTTP al backend.
 *
 * Si no hay clientes, se muestra un mensaje indicando que no se encontraron clientes.
 * Si hay clientes, se muestra una tabla con los datos de los clientes y un botón para ver el detalle de cada cliente.
 */
const fetchMyCustomers = async () => {
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
/**
 * Se ejecuta al montar el componente y obtiene los clientes del usuario logueado.
 */
onMounted(fetchMyCustomers)
</script>

<style scoped>
.container-fluid {
  width: 100%;
}
</style>
