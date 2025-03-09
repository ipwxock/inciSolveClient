<template>
  <div class="container">
    <div v-if="loadingCompany" class="pt-5 mt-5 text-center">
      <div class="spinner-border text-primary pt-5 mt-5" role="status">
        <span class="visually-hidden">Cargando...</span>
      </div>
    </div>
    <div v-else>
      <div v-if="unauthorizedUser">
        <Unauthorized403 />
      </div>
      <div v-else>
        <div v-if="companyResponse == null">
          <Error404 :entity="'empresa'"></Error404>
        </div>
        <div v-else class="col-12 text-start">
          <h1>
            <strong>{{ companyResponse.company.name }}</strong>
          </h1>

          <div class="row">
            <div class="col-12">
              <h4 class="pb-5">Modifica tu Aseguradora</h4>
              <CreateEditCompany :company="companyResponse.company" />
            </div>
          </div>
          <div class="row py-5 m-0 p-0">
            <div class="col-12 m-0 p-0">
              <h4>
                <i class="fa-sharp fa-solid fa-user"></i> &nbsp;Empleados de
                {{ companyResponse.company.name }}
              </h4>
              <div class="table-responsive">
                <table class="table table-striped m-0 p-0">
                  <thead>
                    <tr>
                      <th><strong>DNI</strong></th>
                      <th><strong>Nombre</strong></th>
                      <th><strong>Apellido</strong></th>
                      <th><strong>Email</strong></th>
                      <th><strong>Role</strong></th>
                      <th><strong>Acciones</strong></th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="employee in companyResponse.employees" :key="employee.user.id">
                      <td>{{ employee.user.dni }}</td>
                      <td>{{ employee.user.first_name }}</td>
                      <td>{{ employee.user.last_name }}</td>
                      <td>{{ employee.user.email }}</td>
                      <td>{{ employee.user.role }}</td>
                      <td>
                        <a :href="'/employees/' + employee.user.id" class="btn btn-primary m-0"
                          >Ver Detalle</a
                        >
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div class="row pb-5 m-0 p-0">
            <div class="col-12 m-0 p-0">
              <h4>
                <i class="fa-solid fa-handshake"></i> &nbsp;Pólizas de
                {{ companyResponse.company.name }}
              </h4>
              <div class="table-responsive">
                <table class="table table-striped m-0 p-0">
                  <thead>
                    <tr>
                      <th><strong>Tipo</strong></th>
                      <th><strong>Fecha Inicio</strong></th>
                      <th><strong>Fecha Fin</strong></th>
                      <th><strong>Incidencias</strong></th>
                      <th><strong>Acciones</strong></th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="insurance in companyResponse.insurances" :key="insurance.id">
                      <td>{{ insurance.subject_type }}</td>
                      <td>{{ formatDate(insurance.created_at) }}</td>
                      <td>{{ insurance.description }}</td>
                      <td>
                        {{
                          companyResponse.issues.filter((i) => i.insurance_id == insurance.id)
                            .length
                        }}
                      </td>
                      <td>
                        <a :href="'/insurances/' + insurance.id" class="btn btn-primary m-0"
                          >Ver Detalle</a
                        >
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div class="row pb-5 m-0 p-0">
            <div class="col-12 m-0 p-0">
              <h4>
                <i class="fa-regular fa-clock"></i> &nbsp;Incidencias de
                {{ companyResponse.company.name }}
              </h4>
              <div class="table-responsive">
                <table class="table table-striped m-0 p-0">
                  <thead>
                    <tr>
                      <th><strong>Fecha</strong></th>
                      <th><strong>Descripción</strong></th>
                      <th><strong>Estado</strong></th>
                      <th><strong>Acciones</strong></th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="issue in companyResponse.issues" :key="issue.id">
                      <td>{{ formatDate(issue.created_at) }}</td>
                      <td>{{ issue.subject }}</td>
                      <td>{{ issue.status }}</td>
                      <td>
                        <a :href="'/issues/' + issue.id" class="btn btn-primary">Ver Detalle</a>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { HttpService } from '@/services/httpService'
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import Unauthorized403 from '../Errors/Unauthorized-403.vue'
import Error404 from '../Errors/Error-404.vue'
import CreateEditCompany from './create-edit-company.vue'
import type { DetailCompanyResponse } from '@/types/Responses.type'
import { formatDate } from '@/utils/date'

const companyResponse = ref<DetailCompanyResponse | null>(null)
const loadingCompany = ref(true)
const httpService = new HttpService()
const route = useRoute()
const companyId = route.params.id as string
const unauthorizedUser = ref(false)

onMounted(() => {
  fetchCompany()
})

const fetchCompany = async () => {
  try {
    // Realizamos la llamada HTTP y validamos la respuesta
    const response = await httpService.get<DetailCompanyResponse>(`companies/${companyId}`)

    if (response.status === 403) {
      unauthorizedUser.value = true
      return
    }

    companyResponse.value = response.data ?? null // Asignamos null si la respuesta es undefined
  } catch (error) {
    console.error('Error fetching company:', error)
    companyResponse.value = null // Asigna null en caso de error
  } finally {
    loadingCompany.value = false
  }
}
</script>
