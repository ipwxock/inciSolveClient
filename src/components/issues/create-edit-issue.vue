/* Componente para crear o editar una Incidencia. Si se pasa una Incidencia como prop, se editará.
Si no se pasa una Incidencia, se creará una nueva. */

<template>
  <h4 v-if="props.issue.issue.id > 0">(Creada: {{ formatDate(props.issue.issue.created_at) }})</h4>
  <form @submit.prevent="handleSubmit" class="container-fluid">
    <!--EDIT: SI SE PASAN PROPS-->
    <div class="row" v-if="props.issue.issue.id > 0">
      <div class="form-group col-12 col-md-6 mb-3">
        <input type="hidden" v-model="issueDto.insurance_id" />
        <label for="insurance" class="form-label"><strong>Póliza</strong></label>
        <input
          name="insurance"
          type="text"
          class="form-control"
          @change="validateInsuranceId"
          disabled
          :value="'Seguro de ' + props.issue.insurance.subject_type"
        />
        <span class="text-danger" v-if="validationErrors.insurance_id.required">
          Debe seleccionar un cliente.
        </span>
        <span class="text-danger" v-if="validationErrors.insurance_id.untouchableError">
          No puedes cambiar el cliente de una póliza existente.
        </span>
      </div>

      <div class="form-group col-12 col-md-6 mb-3">
        <label for="status" class="form-label"><strong>Estado de la incidencia:</strong></label>
        <select
          v-if="props.issue.issue.status !== 'Cerrada'"
          name="status"
          v-model="issueDto.status"
          class="form-select"
          @change="validateStatus"
          :class="{
            'is-invalid':
              validationErrors.status.required || validationErrors.status.forceInitialState,
            'is-valid':
              !validationErrors.status.required && !validationErrors.status.forceInitialState,
            'open-issue': issueDto.status === 'Abierta' && !validationErrors.status.required,
            'pending-issue': issueDto.status === 'Pendiente' && !validationErrors.status.required,
            'closed-issue': issueDto.status === 'Cerrada' && !validationErrors.status.required,
          }"
        >
          <option v-if="props.issue.issue.status === 'Abierta'" value="Abierta" class="open-issue">
            Abierta
          </option>
          <option value="Pendiente" class="pending-issue" v-if="userRole !== 'Cliente'">
            Pendiente
          </option>
          <option
            v-if="props.issue.issue.status === 'Pendiente' && userRole === 'Cliente'"
            value="Cerrada"
            class="closed-issue"
          >
            Cerrada
          </option>
        </select>
        <input v-else type="text" class="form-control" :value="props.issue.issue.status" disabled />
        <span class="text-danger" v-if="validationErrors.status.required">
          Debe seleccionar un estado válido.
        </span>
      </div>
    </div>

    <!--CREATE: SI NO SE PASAN PROPS-->
    <div class="row" v-else>
      <div class="form-group col-12 col-md-6 mb-3">
        <label for="insurance" class="form-label mx-0 px-0"><strong>Póliza</strong></label>
        <select
          v-model="issueDto.insurance_id"
          class="form-select"
          placeholder="Seleccione un cliente"
          :class="{
            'is-invalid':
              validationErrors.insurance_id.required && validationErrors.insurance_id.touched,
            'is-valid':
              !validationErrors.insurance_id.required && validationErrors.insurance_id.touched,
          }"
          @change="validateInsuranceId"
          required
        >
          <option value="0" disabled selected>Seleccione una Póliza</option>
          <option
            v-for="insurance in insurances"
            :key="insurance.insurance.id"
            :value="insurance.insurance.id"
          >
            {{ 'Seguro de ' + insurance.insurance.subject_type }}
          </option>
        </select>
        <span class="text-danger" v-if="validationErrors.insurance_id.required">
          Debe seleccionar una póliza.
        </span>
      </div>

      <div class="form-group col-12 col-md-6 mb-3">
        <label for="status" class="form-label"><strong>Estado de la Incidencia</strong></label>
        <select
          @change="validateStatus"
          name="status"
          v-model="issueDto.status"
          class="form-control"
          disabled
          :class="{
            'is-invalid':
              validationErrors.status.required || validationErrors.status.forceInitialState,
            'is-valid':
              !validationErrors.status.required && !validationErrors.status.forceInitialState,
            'open-issue': issueDto.status === 'Abierta' && !validationErrors.status.required,
            'pending-issue': issueDto.status === 'Pendiente' && !validationErrors.status.required,
            'closed-issue': issueDto.status === 'Cerrada' && !validationErrors.status.required,
          }"
        >
          <option value="Abierta" class="open-issue" selected>Abierta</option>
        </select>
        <span class="text-danger" v-if="validationErrors.status.required">
          Debe seleccionar un estado.
        </span>
        <span class="text-danger" v-if="validationErrors.status.forceInitialState">
          Una incidencia se abre en estado 'Abierta'.
        </span>
      </div>
    </div>
    <div class="col-12 pt-3">
      <div class="form-group">
        <label for="subject" class="form-label"
          ><strong>Descripción</strong>
          <small v-if="props.issue.issue.id > 0">
            (Última modificación: {{ formatDate(props.issue.issue.updated_at) }})</small
          ></label
        >
        <textarea
          name="subject"
          v-model="issueDto.subject"
          class="form-control"
          rows="3"
          placeholder="Describa aquí el motivo de la incidencia o cualquier información relevante."
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
          :disabled="props.issue.issue.status === 'Cerrada'"
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
    <div class="row px-3 pt-3">
      <button
        v-if="props.issue.issue.status !== 'Cerrada'"
        type="button"
        class="btn btn-primary w-100 py-2"
        @click.prevent="handleSubmit()"
        :disabled="validated()"
      >
        {{ props.issue.issue.id > 0 ? 'Actualizar' : 'Registrar' + ' Incidencia' }}
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
  </form>
</template>

<script lang="ts" setup>
import { onMounted, ref, watchEffect } from 'vue'
import type { IssueDTO } from '@/types/Requests.type'
import { HttpService } from '@/services/httpService'
import type { IssueResponse, InsuranceResponse } from '@/types/Responses.type'
import { formatDate } from '@/utils/date'

const showRequestResult = ref({
  show: false,
  success: false,
  message: '',
})
const insurances = ref<InsuranceResponse[]>([])
const httpService = new HttpService()
const userRole = localStorage.getItem('role')

onMounted(async () => {
  if (props.issue.issue.id === 0) {
    fetchinsurances()
  }
})

/**
 * Obtiene las Pólizas del usuario actual y las guarda en el estado `insurances`.
 *
 * Usa el servicio `httpService` para obtener las Pólizas del usuario actual y las guarda en el estado `insurances`.
 *
 * @returns {void}
 */
const fetchinsurances = async () => {
  try {
    const response = await httpService.get<InsuranceResponse[]>('get-my-insurances')
    insurances.value = response.data ?? []
  } catch (error) {
    console.error('Error fetching insurances:', error)
    insurances.value = []
  }
}

/**
 * Define las propiedades del componente.
 *
 * @property {IssueResponse} issue - Objeto de tipo IssueResponse que contiene los datos de la Incidencia.
 * @returns {Object} - Objeto con las propiedades del componente.
 */
const props = defineProps({
  issue: {
    type: Object as () => IssueResponse,
    default: () => ({
      issue: {
        id: 0,
        insurance_id: 0,
        status: '',
        created_at: '',
        updated_at: '',
        description: '',
      },
      employee: {
        id: 0,
        user_id: 0,
        created_at: '',
        updated_at: '',
      },
      customer: {
        id: 0,
        user_id: 0,
        created_at: '',
        updated_at: '',
      },
      insurance: {
        id: 0,
        subject_type: '',
        description: '',
        employee_id: 0,
        customer_id: 0,
      },
    }),
  },
})

const issueDto = ref<IssueDTO>({
  status: 'Abierta',
  subject: '',
  insurance_id: 0,
})

// Actualizar insuranceDto cuando `insurance` cambie
watchEffect(() => {
  if (props.issue && props.issue.insurance.id > 0) {
    issueDto.value = {
      subject: props.issue.issue.subject || '',
      insurance_id: props.issue.insurance.id || 0,
      status: props.issue.issue.status || '',
    }
  }
})

// Estado de errores de validación
const validationErrors = ref({
  insurance_id: { required: false, untouchableError: false, touched: false },
  status: {
    required: false,
    forceInitialState: false,
  },
  description: { touched: false, required: false, too_short: false, too_long: false },
})

/**
 * Comprueba si hay errores de validación en el formulario.
 * @returns {boolean} - `true` si hay errores, `false` si no los hay.
 */
const validated = () => {
  return Object.values(validationErrors.value).some((field) =>
    Object.entries(field).some(([key, value]) => key !== 'touched' && value),
  )
}

/**
 *  Valida el campo 'insurance_id' (ID de la Póliza).
 *
 * Usa el objeto `validationErrors` para mostrar mensajes de error.
 *
 * @returns {void}
 */
const validateInsuranceId = () => {
  if (props.issue.insurance.id && props.issue.insurance.id != issueDto.value.insurance_id) {
    validationErrors.value.insurance_id.untouchableError = true
  } else {
    validationErrors.value.insurance_id.untouchableError = false
    validationErrors.value.insurance_id.touched = true
    validationErrors.value.insurance_id.required = !insurances.value.some(
      (i) => i.insurance.id === issueDto.value.insurance_id,
    )
  }
}

/**
 * Valida el estado de la Incidencia.
 *
 * Usa el objeto `validationErrors` para mostrar mensajes de error.
 *
 * @returns {void}
 */
const validateStatus = () => {
  if (props.issue.insurance.id === 0 && issueDto.value.status !== 'Abierta') {
    validationErrors.value.status.forceInitialState = true
  } else {
    validationErrors.value.status.forceInitialState = false
    validationErrors.value.status.required =
      issueDto.value.status !== 'Abierta' &&
      issueDto.value.status !== 'Pendiente' &&
      issueDto.value.status !== 'Cerrada'
  }
}

/**
 * Valida el campo 'description' (descripción de la incidencia).
 *
 * Usa el objeto `validationErrors` para mostrar mensajes de error.
 *
 * @returns {void}
 */
const validateDescription = () => {
  validationErrors.value.description.touched = true
  validationErrors.value.description.required = issueDto.value.subject.trim() === ''
  validationErrors.value.description.too_short = issueDto.value.subject.length < 5
  validationErrors.value.description.too_long = issueDto.value.subject.length > 255
}

/**
 * Crea la Incidencia en la base de datos.
 *
 * Usa el servicio `httpService` para enviar la Incidencia a la API.
 * Usa el objeto showRequestResult para mostrar mensajes de éxito o error.
 *
 * Si la response es exitosa, muestra un mensaje de éxito.
 * Si la response indica un error, muestra un mensaje de error.
 *
 * @returns {void}
 */
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

/**
 * Actualiza la Incidencia en la API.
 *
 * Usa el servicio `httpService` para enviar la Incidencia a la API.
 * Usa el objeto showRequestResult para mostrar mensajes de éxito o error.
 *
 * Si la respuesta es exitosa, se muestra un mensaje de éxito.
 * Si la respuesta indica un error, se muestra un mensaje de error.
 *
 * @returns {void}
 */
const updateIssue = async () => {
  try {
    const response = await httpService.put(`issues/${props.issue.issue.id}`, issueDto.value)

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

/**
 * Función de envío del formulario. Dependiendo de la presencia de `companyId`, realiza una actualización o una creación.
 * @returns {void}
 */
const handleSubmit = () => {
  if (props.issue.issue.id > 0) {
    updateIssue()
  } else {
    createIssue()
  }
}
</script>

<style scoped>
.big-icon {
  font-size: 3.5rem;
  border-radius: 50%;
}

textarea {
  min-height: 300px;
}
</style>
