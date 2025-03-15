/* Componente que muestra el detalle de una Incidencia. Se encarga de obtener la Incidencia desde la
API y mostrarla en un formulario de edición. Si el usuario no tiene permisos para ver la Incidencia,
se muestra un mensaje de error 403. Si la Incidencia no existe, se muestra un mensaje de error 404.
*/

<template>
  <!-- Estado de carga -->
  <div v-if="loadingIssue" class="pt-5 mt-5 text-center">
    <div class="spinner-border text-primary" role="status">
      <span class="visually-hidden">Cargando...</span>
    </div>
  </div>
  <div v-else>
    <div v-if="unauthorizedUser">
      <Unauthorized403 />
    </div>
    <div v-else>
      <Error404 v-if="!IssueDetail" :entity="'Incidencias'" />

      <!-- Mostrar los datos de la Incidencia cuando estén disponibles -->
      <div v-else class="container pt-4">
        <div class="row">
          <div class="col-6 text-start">
            <h3>
              <i class="fa-solid fa-handshake"></i
              ><strong> Detalle Incidencia {{ IssueDetail.issue.id }}&nbsp;</strong>
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
          </div>
        </div>
        <div class="row">
          <createEditIssue :issue="IssueDetail" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import Unauthorized403 from '../Errors/Unauthorized-403.vue'
import CreateEditIssue from './create-edit-issue.vue'
import Error404 from '../Errors/Error-404.vue'
import { HttpService } from '@/services/httpService'
import type { IssueResponse } from '@/types/Responses.type'

const route = useRoute()
const httpservice = new HttpService()
const unauthorizedUser = ref(false)
const loadingIssue = ref(false)
const IssueDetail = ref<IssueResponse | null>(null)
const showDeleteResult = ref({
  show: false,
  success: false,
  message: '',
})

onMounted(() => {
  fetchIssue()
  showDeleteResult.value = {
    show: false,
    success: false,
    message: '',
  }
})

/**
 * Función que obtiene la Incidencia desde la API y la almacena en la variable IssueDetail.
 *
 * Usa el servicio HttpService para hacer la petición a la API.
 *
 * Si el usuario no tiene permisos para ver la Incidencia, se muestra un mensaje de error 403.
 *
 * @returns {void}
 */
const fetchIssue = async () => {
  loadingIssue.value = true
  try {
    const response = await httpservice.get<IssueResponse>(`issues/${route.params.id}`)
    if (response.status === 403) {
      unauthorizedUser.value = true
      return
    }
    IssueDetail.value = response.data ?? null
  } catch (error) {
    console.error('Error fetching issue:', error)
    IssueDetail.value = null
  } finally {
    loadingIssue.value = false
  }
}
</script>
