<template>
  <div class="container pt-4">
    <!-- Estado de carga -->
    <div v-if="loadingEmployees" class="text-center">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Cargando...</span>
      </div>
    </div>
    <div v-else>
      <div v-if="unauthorizedUser">
        <Unauthorized403 />
      </div>
      <div v-else>
        <Error404 v-if="!employeeDetail" :entity="'empleados'" />

        <!-- Mostrar los datos del cliente cuando estén disponibles -->
        <div v-else>
          <div class="row">
            <div class="col-6 text-start">
              <h3>
                <i class="fa-sharp fa-solid fa-user"></i><strong> Datos Empleado &nbsp;</strong>
              </h3>
            </div>
            <div class="col-6 text-end pe-5">
              <button @click="deleteemployee()" class="btn btn-danger">Eliminar Empleado</button>
            </div>
          </div>
          <div class="row">
            <createEditEmployee :employee="employeeDetail" />
          </div>
          <div class="row mt-4">
            <h3>
              <i class="fa-solid fa-handshake"></i>
              <strong> Pólizas Emitidas</strong>
            </h3>
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
                <tr v-for="insurance in employeeDetail.insurances" :key="insurance.id">
                  <td>{{ insurance.subject_type }}</td>
                  <td>{{ formatDate(insurance.created_at.toString()) }}</td>
                  <td>{{ insurance.description }}</td>
                  <td>
                    <a :href="'/policies/' + insurance.id" class="btn btn-primary me-1"
                      >Ver Detalle</a
                    >
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="row mt-4">
            <h3><i class="fa-regular fa-clock"></i><strong> Incidencias Gestionadas</strong></h3>
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
                <tr v-for="issue in employeeDetail.issues" :key="issue.id">
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
    </div>
  </div>
</template>

<script setup lang="ts">
import { HttpService } from '@/services/httpService'
import router from '@/router/routes'
import { onMounted } from 'vue'
import { ref } from 'vue'
import type { DetailEmployeeResponse } from '@/types/Responses.type'
import Unauthorized403 from '../Errors/Unauthorized-403.vue'
import createEditEmployee from './create-edit-employee.vue'
import Error404 from '../Errors/Error-404.vue'

const httpService = new HttpService()
const employeeId = router.currentRoute.value.params.id
const unauthorizedUser = ref(false)
const employeeDetail = ref<DetailEmployeeResponse | null>(null)
const loadingEmployees = ref(true)

onMounted(() => {
  fetchEmployee()
})

const fetchEmployee = async () => {
  try {
    const response = await httpService.get<DetailEmployeeResponse>(
      `employees/${employeeId}/get-employee-detail`,
    )
    console.log(response)
    if (response.status === 403) {
      unauthorizedUser.value = true
      return
    }
    employeeDetail.value = response.data ?? null
  } catch (error) {
    console.error('Error fetching employee:', error)
    employeeDetail.value = null
  } finally {
    loadingEmployees.value = false
  }
}

// Acción para eliminar un cliente
const deleteemployee = async () => {
  try {
    await httpService.delete(`employees/${employeeId}/delete`) // Cambia según tu backend
  } catch (error) {
    console.error('Error deleting employee:', error)
  }
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('es-ES').format(date) // Formato local (España)
}
</script>
