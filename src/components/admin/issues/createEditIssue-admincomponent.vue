<template>
  <div v-if="loadingIssue" class="container-fluid">
    <div class="row">
      <div class="col-12 text-center">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>
    </div>
  </div>
  <div v-else>
    <div v-if="!show404">
      <form @submit.prevent="handleSubmit" class="row">
        <!--INSURANCE-->
        <div class="col-12 pb-3">
          <div class="form-group">
            <label for="insurance" class="form-label">Póliza</label>
            <input type="hidden" v-model="issueDto.insurance_id" />
            <input
              v-if="issueId"
              :value="getInsuranceInfo(issueDto.insurance_id)"
              type="text"
              class="form-control"
              id="insurance"
              disabled
              required
            />
            <select
              v-else
              class="form-select"
              @change="validateInsuranceId"
              v-model="issueDto.insurance_id"
              :class="{
                'is-invalid':
                  (validationErrors.insurance_id.required ||
                    validationErrors.insurance_id.untouchableError) &&
                  validationErrors.insurance_id.touched,
                'is-valid':
                  !validationErrors.insurance_id.required &&
                  !validationErrors.insurance_id.untouchableError &&
                  validationErrors.insurance_id.touched,
              }"
              required
            >
              <option value="" disabled>Seleccione una póliza</option>
              <option
                v-for="insurance in insurances"
                :key="insurance.insurance.id"
                :value="insurance.insurance.id"
              >
                {{ getInsuranceInfo(insurance.insurance.id) }}
              </option>
            </select>
            <span
              class="text-danger"
              v-if="validationErrors.insurance_id.required && validationErrors.insurance_id.touched"
            >
              Debe seleccionar una póliza.
            </span>
            <span class="text-danger" v-if="validationErrors.insurance_id.untouchableError">
              No puedes cambiar el cliente de una póliza existente.
            </span>
          </div>
        </div>
        <div class="col-12 pb-3">
          <div class="form-group">
            <label for="status" class="form-label">Estado</label>
            <select
              v-if="issue?.status !== 'Cerrada'"
              v-model="issueDto.status"
              class="form-select"
              id="status"
              @change="validateStatus"
              :class="{
                'is-invalid':
                  validationErrors.status.required || validationErrors.status.forceInitialState,
                'is-valid':
                  !validationErrors.status.required && !validationErrors.status.forceInitialState,
                'open-issue': issueDto.status === 'Abierta' && !validationErrors.status.required,
                'pending-issue':
                  issueDto.status === 'Pendiente' && !validationErrors.status.required,
                'closed-issue': issueDto.status === 'Cerrada' && !validationErrors.status.required,
              }"
              required
            >
              <option value="Abierta">Abierta</option>
              <option value="Pendiente">Pendiente</option>
              <option value="Cerrada">Cerrada</option>
            </select>
            <input v-else type="text" class="form-control" value="Cerrada" readonly />
            <span class="text-danger" v-if="validationErrors.status.required">
              Debe seleccionar un estado.
            </span>
            <span class="text-danger" v-if="validationErrors.status.forceInitialState">
              Una incidencia se abre en estado 'Abierta'.
            </span>
          </div>
        </div>
        <div class="col-12">
          <div class="form-group">
            <label for="subject" class="form-label">Descripción</label>
            <textarea
              v-model="issueDto.subject"
              class="form-control"
              id="subject"
              rows="3"
              placeholder="Describa aquí el motivo de la incidencia o cualquier información relevante."
              @change="validateDescription"
              :class="{
                'is-invalid':
                  validationErrors.description.touched &&
                  (validationErrors.description.required ||
                    validationErrors.description.too_short ||
                    validationErrors.description.too_long),
                'is-valid':
                  !validationErrors.description.required &&
                  validationErrors.description.touched &&
                  !validationErrors.description.too_short &&
                  !validationErrors.description.too_long,
              }"
              :disabled="issue?.status === 'Cerrada'"
              @input="validateDescription"
              required
            ></textarea>
            <span class="text-danger" v-if="validationErrors.description.required">
              Debe introducir una descripción.
            </span>
            <span class="text-danger" v-if="validationErrors.description.too_short">
              La descripción debe tener al menos 5 caracteres.
            </span>
            <span class="text-danger" v-if="validationErrors.description.too_long">
              La descripción no puede tener más de 255 caracteres.
            </span>
          </div>
        </div>
      </form>
      <div class="row px-3 pt-3">
        <button
          v-if="issue?.status !== 'Cerrada'"
          type="button"
          class="btn btn-primary w-100 py-2"
          @click.prevent="handleSubmit()"
          :disabled="validated()"
        >
          {{ issueId ? 'Actualizar' : 'Registrar' + ' Incidencia' }}
        </button>
        <div v-else>
          <p>Ésta incidencia está cerrada y ya no puede modificarse.</p>
        </div>
        <div
          v-if="showRequestResult.show"
          class="alert mt-3"
          :class="showRequestResult.success ? 'alert-success' : 'alert-danger'"
        >
          {{ showRequestResult.message }}
        </div>
      </div>
    </div>
    <Error404 v-else />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { HttpService } from '@/services/httpService'
import type { Issue } from '@/types/Issue.type'
import type { IssueDTO } from '@/types/Requests.type'
import type { InsuranceResponse, IssueResponse } from '@/types/Responses.type'
import Error404 from '@/components/Errors/Error-404.vue'

const route = useRoute()
const issueDto = ref<IssueDTO>({
  subject: '',
  status: 'Abierta',
  insurance_id: 0,
})
const issue = ref<Issue>()
const httpService = new HttpService()
const loadingIssue = ref(false)
const insurances = ref<InsuranceResponse[]>([])
const issueId = route.params.id
const show404 = ref(false)
const showRequestResult = ref({
  show: false,
  success: false,
  message: '',
})

onMounted(() => {
  if (issueId) {
    fetchIssue()
  }
  fetchInsurances()
})

const fetchIssue = async () => {
  loadingIssue.value = true
  try {
    const response = await httpService.get<IssueResponse>(`issues/${issueId}`)
    if (response.status === 200 && response.data) {
      issue.value = {
        id: response.data.issue.id,
        subject: response.data.issue.subject,
        status: response.data.issue.status,
        insurance_id: response.data.issue.insurance_id,
        created_at: response.data.issue.created_at,
        updated_at: response.data.issue.updated_at,
      }
      issueDto.value = {
        subject: response.data.issue.subject,
        status: response.data.issue.status,
        insurance_id: response.data.issue.insurance_id,
      }
    }
  } catch (error) {
    show404.value = true
  } finally {
    loadingIssue.value = false
  }
}

const fetchInsurances = async () => {
  try {
    const response = await httpService.get<InsuranceResponse[]>('insurances')
    if (response.status === 200 && response.data) {
      insurances.value = response.data
    }
  } catch (error) {
    console.error(error)
  }
}

const getInsuranceInfo = (insuranceId: number) => {
  const selectedInsurance = insurances.value.find((i) => i.insurance.id == insuranceId)

  if (!selectedInsurance) return 'Seguro no encontrado'

  return `Cliente: ${selectedInsurance.customer.user.first_name} ${selectedInsurance.customer.user.last_name} -
            Seguro de: ${selectedInsurance.insurance.subject_type} -
            Empleado: ${selectedInsurance.employee.user.first_name} ${selectedInsurance.employee.user.last_name}`
}

// Estado de errores de validación
const validationErrors = ref({
  insurance_id: { required: false, untouchableError: false, touched: false },
  status: {
    required: false,
    forceInitialState: false,
  },
  description: { touched: false, required: false, too_short: false, too_long: false },
})

const validated = () => {
  return Object.values(validationErrors.value).some((field) =>
    Object.entries(field).some(([key, value]) => key !== 'touched' && value),
  )
}

// 🕵️‍♂️ Watchers individuales para cada campo

const validateInsuranceId = () => {
  if (issue.value !== undefined && issue.value.insurance_id != issueDto.value.insurance_id) {
    validationErrors.value.insurance_id.untouchableError = true
  } else {
    validationErrors.value.insurance_id.untouchableError = false
    validationErrors.value.insurance_id.touched = true
    validationErrors.value.insurance_id.required = !insurances.value.some(
      (i) => i.insurance.id === issueDto.value.insurance_id,
    )
  }
}

const validateStatus = () => {
  if (issue.value === undefined && issueDto.value.status !== 'Abierta') {
    validationErrors.value.status.forceInitialState = true
  } else {
    validationErrors.value.status.forceInitialState = false
    validationErrors.value.status.required =
      issueDto.value.status !== 'Abierta' &&
      issueDto.value.status !== 'Pendiente' &&
      issueDto.value.status !== 'Cerrada'
  }
}

const validateDescription = () => {
  validationErrors.value.description.touched = true
  validationErrors.value.description.required = issueDto.value.subject.trim() === ''
  validationErrors.value.description.too_short = issueDto.value.subject.length < 5
  validationErrors.value.description.too_long = issueDto.value.subject.length > 255
}

const handleSubmit = async () => {
  if (issueId) {
    await updateIssue()
  } else {
    await createIssue()
  }
}

const createIssue = async () => {
  try {
    const response = await httpService.post('issues', issueDto.value)

    if (response.error) {
      showRequestResult.value = {
        show: true,
        success: false,
        message: 'Ocurrió un error inesperado. Introduzca los datos correctamente.',
      }
      return
    } else if (response.status === 403) {
      showRequestResult.value = {
        show: true,
        success: false,
        message: 'No estás autorizado a realizar esta acción.',
      }
      return
    } else if (response.status === 201) {
      showRequestResult.value = {
        show: true,
        success: true,
        message: 'Incidencia creada correctamente.',
      }
      return
    }
  } catch (error) {
    showRequestResult.value = {
      show: true,
      success: false,
      message: 'Ocurrió un error inesperado. Inténtalo de nuevo más tarde.',
    }
  }
}

const updateIssue = async () => {
  try {
    const response = await httpService.put(`issues/${issueId}`, issueDto.value)

    if (response.error) {
      console.error('Error updating insurance:', response.error)
      showRequestResult.value = {
        show: true,
        success: false,
        message: 'Ocurrió un error inesperado. Inténtalo de nuevo más tarde.',
      }
      return
    } else if (response.status === 403) {
      showRequestResult.value = {
        show: true,
        success: false,
        message: 'No estás autorizado a realizar esta acción.',
      }
      return
    }

    showRequestResult.value = {
      show: true,
      success: true,
      message: 'Incidencia actualizada correctamente.',
    }
  } catch (error) {
    showRequestResult.value = {
      show: true,
      success: false,
      message: 'Ocurrió un error inesperado. Inténtalo de nuevo más tarde.',
    }
  }
}
</script>
