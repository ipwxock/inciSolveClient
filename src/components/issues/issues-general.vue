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

onMounted(async () => {
  try {
    await fetchIssues()
  } catch (error) {
    console.error('Error fetching issues:', error)
  }
})

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
