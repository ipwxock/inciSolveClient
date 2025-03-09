<template>
  <div v-if="loadingData" class="container-fluid">
    <div class="row">
      <div class="col-12 text-center">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>
    </div>
  </div>
  <form v-else @submit.prevent="handleSubmit" class="row">
    <div
      v-if="
        (!insuranceId && route.path.includes('new')) ||
        (insuranceId && insurance !== null && loadingData === false)
      "
      class="col-12 mb-3"
    >
      <div class="container-fluid">
        <div class="row">
          <div class="col-12 col-md-6">
            <!-- Cliente -->
            <div class="form-group">
              <input type="hidden" v-model="insuranceDto.customer_id" />
              <label for="customer" class="form-label"><strong>Cliente</strong></label>
              <select
                v-if="insurance === null"
                v-model="insuranceDto.customer_id"
                class="form-select"
                @change="validateCustomerId"
                :class="{
                  'is-invalid':
                    validationErrors.customer_id.required && validationErrors.customer_id.touched,
                  'is-valid':
                    !validationErrors.customer_id.required && validationErrors.customer_id.touched,
                }"
              >
                <option value="" disabled selected>Seleccione un cliente</option>
                <option
                  v-for="customer in customers"
                  :key="customer.customer.id"
                  :value="customer.customer.id"
                >
                  {{ customer.user.first_name }} {{ customer.user.last_name }}
                </option>
              </select>
              <input
                v-else
                type="text"
                class="form-control"
                @change="validationErrors.customer_id.untouchableError = true"
                :value="
                  customers.find((c) => c.customer.id === insurance?.customer_id)?.user.first_name +
                  ' ' +
                  customers.find((c) => c.customer.id === insurance?.customer_id)?.user.last_name
                "
                disabled
              />
              <span class="text-danger" v-if="validationErrors.customer_id.required">
                Debe seleccionar un cliente.
              </span>
              <span class="text-danger" v-if="validationErrors.customer_id.untouchableError">
                No puedes cambiar el cliente de una póliza existente.
              </span>
            </div>
          </div>
          <div class="col-12 col-md-6">
            <!-- Empleado -->
            <div class="form-group">
              <input type="hidden" v-model="insuranceDto.employee_id" />
              <label for="employee" class="form-label"><strong>Empleado</strong></label>
              <select
                v-if="insurance === null"
                v-model="insuranceDto.employee_id"
                class="form-select"
                :class="{
                  'is-invalid':
                    validationErrors.employee_id.required && validationErrors.employee_id.touched,
                  'is-valid':
                    !validationErrors.employee_id.required && validationErrors.employee_id.touched,
                }"
                @change="validateEmployeeId"
              >
                <option value="" disabled selected>Seleccione un empleado</option>
                <option
                  v-for="employee in employees"
                  :key="employee.employee.id"
                  :value="employee.employee.id"
                >
                  {{ employee.user.first_name }} {{ employee.user.last_name }}
                </option>
              </select>
              <input
                v-else
                type="text"
                class="form-control"
                @change="validationErrors.customer_id.untouchableError = true"
                :value="
                  employees.find((e) => e.employee.id === insurance?.employee_id)?.user.first_name +
                  ' ' +
                  employees.find((e) => e.employee.id === insurance?.employee_id)?.user.last_name
                "
                disabled
              />
              <span class="text-danger" v-if="validationErrors.employee_id.required">
                Debe seleccionar un cliente.
              </span>
              <span class="text-danger" v-if="validationErrors.employee_id.untouchableError">
                No puedes cambiar el cliente de una póliza existente.
              </span>
              <input type="hidden" v-model="insuranceDto.employee_id" />
            </div>
          </div>
          <div class="col-12">
            <!-- TIPO DE POLIZA -->
            <div class="form-group">
              <label for="subjet_type" class="form-label pt-5"
                ><strong>Tipo de Póliza</strong></label
              >
              <select
                v-model="insuranceDto.subject_type"
                class="form-select"
                :class="{
                  'is-invalid':
                    validationErrors.subject_type.required && validationErrors.subject_type.touched,
                  'is-valid':
                    !validationErrors.subject_type.required &&
                    validationErrors.subject_type.touched,
                }"
                @change="validateSubjectType"
                required
              >
                <option value="" disabled selected>Seleccione un tipo</option>
                <option value="Vida">Vida</option>
                <option value="Robo">Robo</option>
                <option value="Defunción">Defunción</option>
                <option value="Accidente">Accidente</option>
                <option value="Incendios">Incendios</option>
                <option value="Asistencia_carretera">Asistencia carretera</option>
                <option value="Salud">Salud</option>
                <option value="Hogar">Hogar</option>
                <option value="Coche">Coche</option>
                <option value="Motocicleta">Motocicleta</option>
                <option value="Viaje">Viaje</option>
                <option value="Mascotas">Mascotas</option>
                <option value="Otros">Otros</option>
              </select>
              <span class="text-danger" v-if="validationErrors.subject_type.required">
                Debe seleccionar un tipo de póliza.
              </span>
            </div>
          </div>
          <div class="col-12">
            <!-- DESCRIPCION -->
            <div class="col-12 pt-3">
              <div class="form-group">
                <label for="description" class="form-label"><strong>Descripción</strong></label>
                <textarea
                  v-model="insuranceDto.description"
                  class="form-control"
                  rows="3"
                  placeholder="Redacción del contrato de póliza. Detalles, coberturas, términos y condiciones, etc."
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
          </div>
        </div>
      </div>
    </div>
    <div v-else>
      <Error404 entity="Póliza" />
    </div>
  </form>
  <div class="row px-4 pt-2">
    <button
      type="submit"
      class="btn btn-primary w-100"
      @click="handleSubmit()"
      :disabled="validated()"
    >
      {{ insurance !== null ? 'Actualizar' : 'Crear' + ' Póliza' }}
    </button>
    <div
      v-if="showRequestResult.show"
      class="alert mt-3"
      :class="showRequestResult.success ? 'alert-success' : 'alert-danger'"
    >
      {{ showRequestResult.message }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import { ref, onMounted } from 'vue'
import type { InsuranceDTO } from '@/types/Requests.type'
import { HttpService } from '@/services/httpService'
import type { CustomerResponse, EmployeeResponse } from '@/types/Responses.type'
import Error404 from '@/components/Errors/Error-404.vue'
import { InsuranceSubject } from '@/types/Insurance.type'

const route = useRoute()
const show404 = ref(false)
const insuranceId = route.params.id
const httpService = new HttpService()
const insurance = ref<InsuranceDTO | null>(null)
const loadingData = ref(false)
const insuranceDto = ref<InsuranceDTO>({
  customer_id: 0,
  employee_id: 0,
  subject_type: '',
  description: '',
})
const showRequestResult = ref({
  show: false,
  success: false,
  message: '',
})
const customers = ref<CustomerResponse[]>([])
const employees = ref<EmployeeResponse[]>([])

onMounted(() => {
  fetchCustomers()
  fetchEmployees()
  if (insuranceId) {
    fetchInsurance()
  }
})

const fetchInsurance = async () => {
  loadingData.value = true
  try {
    const response = await httpService.get<InsuranceDTO>(`insurances/${insuranceId}`)
    if (response.status === 200 && response.data) {
      insurance.value = response.data
      insuranceDto.value = insurance.value
    } else {
      show404.value = true
    }
  } catch (error) {
    console.log(error)
  } finally {
    loadingData.value = false
  }
}

const fetchCustomers = async () => {
  try {
    const response = await httpService.get<CustomerResponse[]>('customers')
    if (response.status === 200) {
      customers.value = response.data ?? []
    }
  } catch (error) {
    console.log(error)
  }
}

const fetchEmployees = async () => {
  try {
    const response = await httpService.get<EmployeeResponse[]>('employees')
    if (response.status === 200) {
      employees.value = response.data ?? []
    }
  } catch (error) {
    console.log(error)
  }
}

// Estado de errores de validación
const validationErrors = ref({
  customer_id: { touched: false, required: false, untouchableError: false },
  employee_id: { touched: false, required: false, untouchableError: false },
  subject_type: {
    touched: false,
    required: false,
    untouchableError: false,
  },
  description: { touched: false, required: false, too_short: false, too_long: false },
})

const validated = () => {
  return Object.values(validationErrors.value).some((field) =>
    Object.entries(field).some(([key, value]) => key !== 'touched' && value),
  )
}

// 🕵️‍♂️ Watchers individuales para cada campo

const validateCustomerId = () => {
  if (
    insuranceDto.value.customer_id &&
    insuranceDto.value.customer_id != insuranceDto.value.customer_id
  ) {
    validationErrors.value.customer_id.untouchableError = true
  } else {
    validationErrors.value.customer_id.untouchableError = false
    validationErrors.value.customer_id.touched = true
    validationErrors.value.customer_id.required = !customers.value.some(
      (c) => c.customer.id === insuranceDto.value.customer_id,
    )
  }
}

const validateEmployeeId = () => {
  if (
    insuranceDto.value.employee_id &&
    insuranceDto.value.employee_id != insuranceDto.value.employee_id
  ) {
    validationErrors.value.employee_id.untouchableError = true
  } else {
    validationErrors.value.employee_id.untouchableError = false
    validationErrors.value.employee_id.touched = true
    validationErrors.value.employee_id.required = !employees.value.some(
      (c) => c.employee.id === insuranceDto.value.employee_id,
    )
  }
}

const validateSubjectType = () => {
  if (
    insuranceDto.value.subject_type &&
    insuranceDto.value.subject_type != insuranceDto.value.subject_type
  ) {
    validationErrors.value.customer_id.untouchableError = true
  } else {
    validationErrors.value.subject_type.untouchableError = false
    validationErrors.value.subject_type.touched = true
    validationErrors.value.subject_type.required = !(
      InsuranceSubject.includes(insuranceDto.value.subject_type) ||
      InsuranceSubject.includes(insuranceDto.value.subject_type.split(' ').join('_'))
    )
  }
}

const validateDescription = () => {
  validationErrors.value.description.touched = true
  validationErrors.value.description.required = insuranceDto.value.description.trim() === ''
  validationErrors.value.description.too_short = insuranceDto.value.description.length < 5
  validationErrors.value.description.too_long = insuranceDto.value.description.length > 255
}

const handleSubmit = async () => {
  if (insuranceId) {
    await updateInsurance()
  } else {
    await createInsurance()
  }
}

const createInsurance = async () => {
  try {
    const response = await httpService.post('insurances', insuranceDto.value)

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
    }

    showRequestResult.value = {
      show: true,
      success: true,
      message: 'Póliza creada correctamente.',
    }
  } catch (error) {
    console.error('Unexpected error updating insurance:', error)
    showRequestResult.value = {
      show: true,
      success: false,
      message: 'Ocurrió un error inesperado. Inténtalo de nuevo más tarde.',
    }
  }
}

const updateInsurance = async () => {
  try {
    const response = await httpService.put(`insurances/${insuranceId}`, insuranceDto.value)

    if (response.status === 403) {
      showRequestResult.value = {
        show: true,
        success: false,
        message: 'No estás autorizad@ a realizar esta acción.',
      }
      return
    } else if (response.error) {
      console.error('Error updating insurance:', response.error)
      showRequestResult.value = {
        show: true,
        success: false,
        message:
          'Ocurrió un error inesperado. Inténtalo de nuevo. Recuerde que sólo pueden modificarse la descripción de la póliza.',
      }
      return
    }

    showRequestResult.value = {
      show: true,
      success: true,
      message: 'Póliza modificada correctamente.',
    }
  } catch (error) {
    console.error('Unexpected error updating insurance:', error)
    showRequestResult.value = {
      show: true,
      success: false,
      message: 'Ocurrió un error inesperado. Inténtalo de nuevo.',
    }
  }
}
</script>
