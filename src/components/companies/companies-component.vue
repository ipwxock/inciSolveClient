/* Este componente es el contenedor principal de la vista de aseguradoras. Se encarga de mostrar el
título de la vista y de redirigir al usuario a la vista de su aseguradora si es un manager. Además,
se encarga de cargar el id de la aseguradora del usuario en caso de que sea manager. En caso de que
el usuario no sea manager, no se mostrará el botón de redirección. */
<template>
  <div class="container-fluid">
    <div class="row w-100 align-items-end">
      <div class="col-6 text-start">
        <h1>Aseguradoras &nbsp;<i class="fa-sharp fa-solid fa-building"></i></h1>
      </div>
      <div
        v-if="
          userRole === 'Manager' &&
          companyId !== null &&
          !router.currentRoute.value.path.includes('/see')
        "
        class="col-6"
      >
        <a :href="editCompanyUrl" class="btn btn-primary mt-3 w-100"> Gestionar mi Aseguradora </a>
      </div>
    </div>
  </div>
  <div class="mt-4">
    <router-view />
  </div>
</template>

<script setup lang="ts">
import router from '@/router/routes'
import { HttpService } from '@/services/httpService'
import { onMounted, ref } from 'vue'

const httpService = new HttpService()
const userRole = localStorage.getItem('role')
const companyId = ref<number | null>(null)
const editCompanyUrl = ref<string>('')

onMounted(() => {
  if (userRole === 'Manager') {
    fetchCompanyId()
  }
})

/**
 * Función que se encarga de obtener el id de la aseguradora del usuario en caso de que sea manager.
 * En caso de que no sea manager, se establece el valor de companyId a null.
 *
 * Usa el servicio HttpService para obtener el id de la aseguradora del usuario y lo guarda en la variable companyId.
 *
 * @returns {void}
 */
const fetchCompanyId = async () => {
  try {
    const response = await httpService.get<number>('get-my-company-id')
    companyId.value = response.data ?? null

    if (companyId.value !== null) {
      editCompanyUrl.value = `companies/${companyId.value}/see`
    }
  } catch (error) {
    companyId.value = null
  }
}
</script>
