/* Componente que muestra todas las aseguradoras disponibles en el sistema. Se muestra una tabla con
el nombre, descripción y teléfono de cada aseguradora. Si el usuario es un cliente, se le anima a
contactar con las aseguradoras para negociar pólizas. Si el usuario es un manager, se le anima a
contactar con las aseguradoras para colaboraciones. */
<template>
  <div v-if="loadingCompanies" class="pt-5 mt-5 text-center">
    <div class="spinner-border text-primary pt-5 mt-5" role="status">
      <span class="visually-hidden">Cargando...</span>
    </div>
  </div>
  <div v-else class="px-1 px-md-2">
    <section>
      <p v-if="userRole === 'Cliente'">
        En esta parte puedes ver las aseguradoras disponibles en el sistema. Usa su número de
        teléfono para contactar con ell@s y negociar las condiciones de tus futuras pólizas!
      </p>
      <p v-if="userRole === 'Manager'">
        En esta parte puedes ver las aseguradoras disponibles en el sistema. Usa su número de
        teléfono para contactar con ell@s y realizar colaboraciones!
      </p>
      <div v-if="companies && companies.length > 0" class="table-responsive">
        <table class="table table-striped">
          <thead>
            <tr>
              <th><strong>Nombre</strong></th>
              <th><strong>Descripcion</strong></th>
              <th><strong>Teléfono</strong></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="companyData in companies" :key="companyData.id">
              <td>{{ companyData.name }}</td>
              <td>{{ companyData.description }}</td>
              <td>{{ companyData.phone_number }}</td>
              <td></td>
            </tr>
          </tbody>
        </table>
      </div>
      <p v-else class="text-center">No se encontraron Aseguradoras.</p>
    </section>
  </div>
</template>

<script lang="ts" setup>
import type { Company } from '@/types/Company.type'
import { onMounted, ref } from 'vue'
import { HttpService } from '@/services/httpService'

const httpService = new HttpService()
const companies = ref<Company[] | null>([])
const loadingCompanies = ref(true)
const userRole = localStorage.getItem('role')

onMounted(async () => {
  fetchCompanies()
})

/**
 * Obtiene todas las aseguradoras de InciSolve
 *
 * Usa el servicio HttpService para obtener todas las aseguradoras de InciSolve y las guarda en la variable companies.
 *
 * @returns {void}
 */
const fetchCompanies = async () => {
  // Si no existe, se obtienen todos los clientes
  try {
    // Realizamos la llamada HTTP y validamos la respuesta
    const response = await httpService.get<Company[]>('companies')
    companies.value = response.data ?? null // Asignamos null si la respuesta es undefined
  } catch (error) {
    console.error('Error fetching customers:', error)
    companies.value = null // Asigna null en caso de error
  } finally {
    loadingCompanies.value = false
  }
}
</script>
