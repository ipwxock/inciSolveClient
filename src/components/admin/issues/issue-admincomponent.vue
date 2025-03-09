<template>
  <div class="container-fluid px-3">
    <div class="row justify-content-space-evenly align-items-center">
      <h1 class="h1 col-12 col-md-4 ps-2">
        <i class="fa-sharp fa-solid fa-building"></i> Incidencias de InciSolve
      </h1>
      <div class="col-12 col-md-4">
        <router-link :to="route.path + '/new'">
          <a class="btn btn-primary px-5">+ Añadir Incidencia</a>
        </router-link>
      </div>
    </div>

    <div class="row pt-3">
      <div class="form-group col-12 col-md-4">
        <label for="search">Buscar Incidencia</label>
        <input
          type="text"
          v-model="searchString"
          class="form-control"
          id="search"
          placeholder="Ej: Abierta.."
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
      <div v-if="issues && issues.length > 0" class="table-responsive">
        <table class="table table-striped">
          <thead>
            <tr>
              <th><strong>Descripción</strong></th>
              <th><strong>Cliente</strong></th>
              <th><strong>Empleado </strong></th>
              <th><strong>Estado</strong></th>
              <th><strong>Fecha de Creación</strong></th>
              <th><strong>Fecha de Actualización</strong></th>
              <th><strong>Acciones</strong></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="issueData in filteredIssues" :key="issueData.issue.id">
              <td>{{ issueData.issue.subject }}</td>
              <td>
                {{ issueData.customer.user.first_name + ' ' + issueData.customer.user.last_name }}
              </td>
              <td>
                {{ issueData.employee.user.first_name + ' ' + issueData.employee.user.last_name }}
              </td>
              <td>
                <div class="status-cell">
                  <div
                    :class="{
                      'open-issue-indicator': issueData.issue.status === 'Abierta',
                      'pending-issue-indicator': issueData.issue.status === 'Pendiente',
                      'closed-issue-indicator': issueData.issue.status === 'Cerrada',
                    }"
                  ></div>
                  &nbsp;
                  {{ issueData.issue.status }}
                </div>
              </td>
              <td>{{ formatDate(issueData.issue.created_at) }}</td>
              <td>{{ formatDate(issueData.issue.updated_at) }}</td>
              <td>
                <router-link :to="route.path + '/' + issueData.issue.id">
                  <a class="btn btn-primary">Ver</a>
                </router-link>
                <a class="btn btn-danger" @click="deleteIssue(issueData.issue.id)">Eliminar</a>
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
import { HttpService } from '@/services/httpService'
import { formatDate } from '@/utils/date'
import type { IssueResponse } from '@/types/Responses.type'

const route = useRoute()
const issues = ref<IssueResponse[]>([])
const searchString = ref('')
const filteredIssues = ref<IssueResponse[]>([])
const httpService = new HttpService()
const loadingIssues = ref(false)
const showRequestResult = ref({
  success: false,
  message: '',
  show: false,
})

onMounted(() => {
  fetchIssues()
})

watch(searchString, (newVal) => {
  if (newVal) {
    filteredIssues.value = issues.value.filter(
      (issue) =>
        issue.issue.status.toLowerCase().includes(newVal.toLowerCase()) ||
        issue.issue.subject.toLowerCase().includes(newVal.toLowerCase()) ||
        formatDate(issue.issue.created_at).includes(newVal) ||
        formatDate(issue.issue.updated_at).includes(newVal) ||
        issue.customer.user.first_name.toLowerCase().includes(newVal.toLowerCase()) ||
        issue.customer.user.last_name.toLowerCase().includes(newVal.toLowerCase()) ||
        issue.employee.user.first_name.toLowerCase().includes(newVal.toLowerCase()) ||
        issue.employee.user.last_name.toLowerCase().includes(newVal.toLowerCase()),
    )
  } else {
    filteredIssues.value = issues.value
  }
})

const fetchIssues = async () => {
  loadingIssues.value = true
  try {
    const response = await httpService.get<IssueResponse[]>('issues')
    if (response.status === 200 && response.data) {
      issues.value = response.data
      filteredIssues.value = response.data
    }
  } catch (error) {
    console.error(error)
  } finally {
    loadingIssues.value = false
  }
}

const deleteIssue = async (id: number) => {
  try {
    const response = await httpService.delete(`issues/${id}`)
    if (response.status === 200) {
      fetchIssues()
      showRequestResult.value = {
        success: true,
        message: 'Incidencia eliminada correctamente.',
        show: true,
      }
    } else {
      showRequestResult.value = {
        success: false,
        message: 'Error al eliminar la incidencia. ' + response.error,
        show: true,
      }
    }
  } catch (error) {
    console.error(error)
    showRequestResult.value = {
      success: false,
      message: 'Error al eliminar la incidencia. Inténtalo de nuevo más tarde.',
      show: true,
    }
  }
}
</script>
