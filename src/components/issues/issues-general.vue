/* Este componente se utiliza para mostrar todas las incidencias que el usuario ha registrado en el
sistema. Las incidencias se muestran en una tabla con las siguientes columnas: - Objeto de la póliza
- Fecha de creación -Estado -Descripción -Última actualización -Acciones El usuario puede hacer clic
en el botón "Ver" para ver los detalles de la incidencia. */

<template>
  <div v-if="loadingissues" class="pt-5 mt-5 text-center">
    <div class="spinner-border text-primary" role="status">
      <span class="visually-hidden">Loading...</span>
    </div>
  </div>
  <div v-else>
    <div class="container-fluid" v-if="unauthorizedUser">
      <Unauthorized403 />
    </div>
    <div class="container-fluid" v-else>
      <h2 class="ps-3">Mis Incidencias</h2>
      <section class="table-responsive">
        <p v-if="userRole === 'Cliente'">
          En esta sección podrás visualizar todas las incidencias que tienes registradas en el
          sistema. Esto es, todas las incidencias que has reportado a la aseguradora y que están
          pendientes de resolución.
        </p>
        <p v-if="userRole === 'Manager' || userRole == 'Empleado'">
          En esta sección podrás visualizar todas las incidencias que tienes registradas en el
          sistema. Esto es, todas las incidencias que han sido reportadas por tus clientes.
        </p>
        <table class="table table-striped" v-if="issues !== null">
          <thead>
            <tr>
              <th scope="col"><strong>Objeto de Póliza</strong></th>
              <th scope="col"><strong>Fecha de creación</strong></th>
              <th scope="col"><strong>Estado</strong></th>
              <th scope="col"><strong>Descripción</strong></th>
              <th scope="col"><strong>Última actualización</strong></th>
              <th scope="col"><strong>Acciones</strong></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="issue in issues" :key="issue.issue.id">
              <td>{{ issue.insurance.subject_type }}</td>
              <td>{{ formatDate(issue.issue.created_at) }}</td>
              <td>
                <div class="status-cell">
                  <div
                    :class="{
                      'open-issue-indicator': issue.issue.status === 'Abierta',
                      'pending-issue-indicator': issue.issue.status === 'Pendiente',
                      'closed-issue-indicator': issue.issue.status === 'Cerrada',
                    }"
                  ></div>
                  &nbsp;
                  {{ issue.issue.status }}
                </div>
              </td>
              <td>{{ issue.issue.subject }}</td>
              <td>{{ formatDate(issue.issue.updated_at) }}</td>
              <td>
                <router-link :to="'/issues/' + issue.issue.id + '/see'" class="btn btn-primary">
                  Ver
                </router-link>
              </td>
            </tr>
          </tbody>
        </table>
        <p v-else class="text-center">No se encontraron Incidencias.</p>
      </section>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { HttpService } from '@/services/httpService'
import type { IssueResponse } from '@/types/Responses.type'
import { onMounted, ref } from 'vue'
import Unauthorized403 from '../Errors/Unauthorized-403.vue'
import { formatDate } from '@/utils/date'

const httpService = new HttpService()
const issues = ref<IssueResponse[] | null>(null)
const unauthorizedUser = ref(false)
const loadingissues = ref(false)
const userRole = localStorage.getItem('role')

onMounted(async () => {
  try {
    await fetchIssues()
  } catch (error) {
    console.error('Error fetching issues:', error)
  }
})

/**
 * Recupera todas las incidencias del usuario.
 *
 * Usa el servicio HTTP para hacer una petición GET al servidor y recuperar todas las incidencias
 *
 * @returns {void}
 */
const fetchIssues = async () => {
  loadingissues.value = true
  try {
    const response = await httpService.get<IssueResponse[]>('get-my-issues')
    if (response.status === 200) {
      issues.value = response.data ?? null
    }
  } catch (error) {
    console.error('Error fetching issues:', error)
  } finally {
    loadingissues.value = false
  }
}
</script>
