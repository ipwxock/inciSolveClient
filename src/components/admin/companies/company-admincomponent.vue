/** * Componente CompanyAdminComponent * @description Componente que se encarga de mostrar la lista
de aseguradoras que se encuentran en la base de datos. * Se puede buscar por nombre, descripción o
teléfono de la aseguradora. * * @example *
<company-admincomponent></company-admincomponent>
*/

<template>
  <div class="container-fluid px-md-3">
    <div class="row justify-content-space-evenly align-items-center">
      <h1 class="h1 col-12 col-md-4 ps-2">
        <i class="fa-sharp fa-solid fa-building"></i> Aseguradoras de InciSolve
      </h1>
      <div class="col-12 col-md-4">
        <router-link :to="route.path + '/new'">
          <a class="btn btn-primary px-5">+ Añadir Aseguradora</a>
        </router-link>
      </div>
    </div>

    <div class="row pt-3">
      <div class="form-group col-12 col-md-4">
        <label for="search">Buscar Aseguradora</label>
        <input
          type="text"
          v-model="searchString"
          class="form-control"
          id="search"
          placeholder="Ej: m4pfr3"
        />
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
    <div class="row">
      <div v-if="companies && companies.length > 0" class="table-responsive">
        <table class="table table-striped">
          <thead>
            <tr>
              <th><strong>Nombre</strong></th>
              <th><strong>Descripcion</strong></th>
              <th><strong>Teléfono</strong></th>
              <th><strong>Acciones</strong></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="companyData in filteredCompanies" :key="companyData.id">
              <td>{{ companyData.name }}</td>
              <td>{{ companyData.description }}</td>
              <td>{{ companyData.phone_number }}</td>
              <td>
                <router-link :to="route.path + '/' + companyData.id">
                  <a class="btn btn-primary">Ver</a>
                </router-link>

                <a class="btn btn-danger" @click="deleteCompany(companyData.id)">Eliminar</a>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <p v-else class="text-center">No se encontraron Aseguradoras.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Company } from '@/types/Company.type'
import { ref, onMounted, watch } from 'vue'
import { HttpService } from '@/services/httpService'
import { useRoute } from 'vue-router'

const companies = ref<Company[]>()
const httpService = new HttpService()
const searchString = ref('')
const route = useRoute()
const filteredCompanies = ref<Company[]>()
const showRequestResult = ref({
  success: false,
  message: '',
  show: false,
})

onMounted(() => {
  fetchCompanies()
})

watch(searchString, (newVal) => {
  if (newVal) {
    filteredCompanies.value = companies.value?.filter(
      (company) =>
        company.name.toLowerCase().includes(newVal.toLowerCase()) ||
        company.description.toLowerCase().includes(newVal.toLowerCase()) ||
        company.phone_number?.toLowerCase().includes(newVal.toLowerCase()),
    )
  } else {
    filteredCompanies.value = companies.value
  }
})

/**
 * Función que se encarga de obtener las aseguradoras de la base de datos.
 * Se almacenan en la variable companies y filteredCompanies.
 *
 * Usa el servicio HttpService para hacer la petición a la API.
 *
 * @returns {void}
 */
const fetchCompanies = async () => {
  try {
    const response = await httpService.get<Company[]>('companies')
    if (response.status === 200) {
      companies.value = response.data
      filteredCompanies.value = companies.value
    }
  } catch (error) {
    console.error(error)
  }
}

/**
 * Función que se encarga de eliminar una aseguradora de la base de datos.
 * @param id ID de la aseguradora a eliminar.
 * @returns {void}
 */
const deleteCompany = async (id: number) => {
  try {
    const response = await httpService.delete(`companies/${id}`)
    if (response.status === 200) {
      fetchCompanies()
      showRequestResult.value = {
        success: true,
        message: 'Aseguradora eliminada correctamente.',
        show: true,
      }
    } else {
      showRequestResult.value = {
        success: false,
        message: 'Error al eliminar la aseguradora. ' + response.error,
        show: true,
      }
    }
  } catch (error) {
    console.error(error)
  }
}
</script>
