/* Este componente es un formulario para crear o editar una póliza de seguro. Se compone de varios
campos de entrada y un botón de envío. Al enviar el formulario, se realiza una petición HTTP al
servidor para crear o actualizar la póliza. El formulario incluye validación de campos y muestra
mensajes de error si los datos no son válidos. También muestra un mensaje de éxito o error después
de enviar el formulario. El formulario se puede utilizar para crear una nueva póliza o editar una
existente. */

<template>
  <form @submit.prevent="handleSubmit" class="row">
    <div v-if="props.insurance.customer.user != undefined" class="col-9 col-md-6 mb-3">
      <div class="form-group">
        <input type="hidden" v-model="insuranceDto.employee_id" />
        <label for="customer" class="form-label"><strong>Cliente</strong></label>
        <input
          type="text"
          class="form-control"
          @change="validateCustomerId"
          disabled
          :value="
            props.insurance.customer.user.first_name +
            ' ' +
            props.insurance.customer.user.last_name!
          "
        />
        <span class="text-danger" v-if="validationErrors.customer_id.required">
          Debe seleccionar un cliente.
        </span>
        <span class="text-danger" v-if="validationErrors.customer_id.untouchableError">
          No puedes cambiar el cliente de una póliza existente.
        </span>
        <input type="hidden" v-model="insuranceDto.customer_id" />
      </div>

      <div class="form-group pt-5">
        <label for="subject_type" class="form-label"><strong>Tipo de Póliza</strong></label>
        <input
          @change="validateSubjectType"
          type="text"
          v-model="insuranceDto.subject_type"
          class="form-control"
          disabled
        />
        <span class="text-danger" v-if="validationErrors.subject_type.required">
          Debe seleccionar un tipo de póliza.
        </span>
        <span class="text-danger" v-if="validationErrors.subject_type.untouchableError">
          No puedes cambiar el tipo de póliza de una póliza existente.
        </span>
      </div>
    </div>
    <!------------------------------>
    <!--  SI NO SE PASAN PROPS  -->
    <!------------------------------>
    <div v-else class="col-12 col-md-6 mb-3">
      <div class="form-group">
        <label for="customer" class="form-label mx-0 px-0"><strong>Cliente</strong></label
        ><br />
        <input type="text" v-model="search" placeholder="Buscar..." class="form-control" />
        <select
          v-model="insuranceDto.customer_id"
          class="form-select"
          placeholder="Seleccione un cliente"
          id="customer_id"
          :class="{
            'is-invalid':
              validationErrors.customer_id.required && validationErrors.customer_id.touched,
            'is-valid':
              !validationErrors.customer_id.required && validationErrors.customer_id.touched,
          }"
          @change="validateCustomerId"
          required
        >
          <option value="0" disabled selected>Seleccione un cliente</option>
          <option
            v-for="customer in filteredCustomers"
            :key="customer.customer.id"
            :value="customer.customer.id"
          >
            {{ customer.user.first_name }} {{ customer.user.last_name }}
          </option>
        </select>
        <span class="text-danger" v-if="validationErrors.customer_id.required">
          Debe seleccionar un cliente.
        </span>
      </div>

      <div class="form-group">
        <label for="subjet_type" class="form-label pt-5"><strong>Tipo de Póliza</strong></label>
        <select
          v-model="insuranceDto.subject_type"
          class="form-select"
          id="subject_type"
          :class="{
            'is-invalid':
              validationErrors.subject_type.required && validationErrors.subject_type.touched,
            'is-valid':
              !validationErrors.subject_type.required && validationErrors.subject_type.touched,
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
          <option value="Moto">Moto</option>
          <option value="Viaje">Viaje</option>
          <option value="Mascotas">Mascotas</option>
          <option value="Otros">Otros</option>
        </select>
        <span class="text-danger" v-if="validationErrors.subject_type.required">
          Debe seleccionar un tipo de póliza.
        </span>
      </div>
    </div>
    <div v-if="showCustomerCard && userRole !== 'Cliente'" class="col-12 col-md-6 pt-4 mb-3">
      <!--Create a card with customer data-->
      <div class="card justify-content-center">
        <div class="card-body text-center justify-content-center align-items-center">
          <h5 class="card-title text-center">
            <strong
              >{{ selectedCustomer?.user.first_name }}
              {{ selectedCustomer?.user.last_name }}</strong
            >
          </h5>
          <i class="fa-sharp fa-solid fa-user big-icon py-2"></i>
          <p class="card-text"><strong>DNI:</strong> {{ selectedCustomer?.user.dni }}</p>
          <p class="card-text"><strong>Email:</strong> {{ selectedCustomer?.user.email }}</p>
          <p class="card-text">
            <strong>Cliente desde:</strong>
            {{ selectedCustomer ? formatDate(selectedCustomer.user.created_at) : '-' }}
          </p>
        </div>
      </div>
    </div>
    <div class="col-12 pt-3">
      <div class="form-group">
        <label for="description" class="form-label"><strong>Descripción</strong></label>
        <textarea
          v-model="insuranceDto.description"
          class="form-control"
          id="description"
          :disabled="userRole === 'Cliente'"
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
  </form>
  <div
    role="alert"
    v-if="showRequestResult.show"
    class="alert mt-3"
    :class="showRequestResult.success ? 'alert-success' : 'alert-danger'"
  >
    {{ showRequestResult.message }}
  </div>
  <div class="row px-4 pt-2">
    <button
      v-if="userRole !== 'Cliente'"
      type="submit"
      class="btn btn-primary w-100"
      @click="handleSubmit()"
      :disabled="validated()"
    >
      {{ props.insurance.insurance.id > 0 ? 'Actualizar' : 'Crear' + ' Póliza' }}
    </button>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, watchEffect, computed } from 'vue'
import type { InsuranceDTO } from '@/types/Requests.type'
import { HttpService } from '@/services/httpService'
import type { CustomerResponse, DetailInsuranceResponse } from '@/types/Responses.type'
import { InsuranceSubject } from '@/types/Insurance.type'
import { formatDate } from '@/utils/date'

const userRole = localStorage.getItem('role')
const showRequestResult = ref({
  show: false,
  success: false,
  message: '',
})
const customers = ref<CustomerResponse[]>([])
const httpService = new HttpService()
const showCustomerCard = ref(false)
const selectedCustomer = ref<CustomerResponse>()
const search = ref('')

onMounted(async () => {
  fetchAllCustomers()
})

const filteredCustomers = computed(() => {
  if (search.value.length < 2) return customers.value
  return customers.value.filter((c) =>
    [c.user.first_name, c.user.last_name, c.user.email, c.user.dni].some((field) =>
      field.toLowerCase().includes(search.value.toLowerCase()),
    ),
  )
})

/**
 * Muestra la tarjeta de cliente seleccionado
 */
const showCustomer = () => {
  selectedCustomer.value = customers.value.find(
    (c) => c.customer.id === insuranceDto.value.customer_id,
  )
  showCustomerCard.value = true
}
/**
 * Obtiene la lista de clientes
 *
 * Usa el servicio `httpService` para obtener la lista de clientes.
 *
 * @returns {void}
 */
const fetchAllCustomers = async () => {
  if (userRole === 'Cliente') return
  try {
    const response = await httpService.get<CustomerResponse[]>('customers')
    customers.value = response.data ?? []
  } catch (error) {
    console.error('Error fetching customers:', error)
    customers.value = []
  }
}

/**
 * Propiedades del componente
 *
 * @property {DetailInsuranceResponse} insurance - Objeto de tipo DetailInsuranceResponse que contiene los datos de la póliza de seguro.
 * @returns {Object} - Objeto con las propiedades del componente.
 */
const props = defineProps({
  insurance: {
    type: Object as () => DetailInsuranceResponse,
    default: () => ({
      insurance: {
        id: 0,
        company_id: 0,
        customer_id: 0,
        user_id: 0,
        created_at: '',
        updated_at: '',
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
      issues: [],
    }),
  },
})

/**
 * DTO de la póliza de seguro
 */
const insuranceDto = ref<InsuranceDTO>({
  subject_type: 'Otros',
  description: '',
  employee_id: 0,
  customer_id: 0,
})

// Actualizar insuranceDto cuando `insurance` cambie
watchEffect(() => {
  if (props.insurance && props.insurance.insurance.id > 0) {
    insuranceDto.value = {
      subject_type: props.insurance.insurance.subject_type || '',
      description: props.insurance.insurance.description || '',
      employee_id: props.insurance.employee.employee?.id || 0,
      customer_id: props.insurance.customer.customer?.id || 0,
    }
    showCustomer()
  }
})

// Estado de errores de validación
const validationErrors = ref({
  customer_id: { touched: false, required: false, untouchableError: false },
  subject_type: {
    touched: false,
    required: false,
    untouchableError: false,
  },
  description: { touched: false, required: false, too_short: false, too_long: false },
})

/**
 * Validar campos del formulario
 * @returns {boolean} Indica si hay errores de validación
 */
const validated = () => {
  return Object.values(validationErrors.value).some((field) =>
    Object.entries(field).some(([key, value]) => key !== 'touched' && value),
  )
}

/**
 * Valida el campo 'customer_id' (cliente de la póliza).
 *
 * Usa el objeto `validationErrors` para mostrar mensajes de error.
 *
 * @returns {void}
 */
const validateCustomerId = () => {
  if (
    props.insurance.customer.customer?.id &&
    props.insurance.customer.customer?.id != insuranceDto.value.customer_id
  ) {
    validationErrors.value.customer_id.untouchableError = true
  } else {
    validationErrors.value.customer_id.untouchableError = false
    validationErrors.value.customer_id.touched = true
    validationErrors.value.customer_id.required = !customers.value.some(
      (c) => c.customer.id === insuranceDto.value.customer_id,
    )
  }

  if (!validationErrors.value.customer_id.required && validationErrors.value.customer_id.touched) {
    showCustomer()
  } else {
    showCustomerCard.value = false
  }
}

/**
 * Valida el campo 'subject_type' (tipo de póliza).
 *
 * Usa el objeto `validationErrors` para mostrar mensajes de error.
 *
 * @returns {void}
 */
const validateSubjectType = () => {
  if (
    props.insurance.insurance?.subject_type &&
    props.insurance.insurance?.subject_type != insuranceDto.value.subject_type
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

/**
 * Valida el campo 'description' (descripción de la póliza).
 *
 * Usa el objeto `validationErrors` para mostrar mensajes de error.
 *
 * @returns {void}
 */
const validateDescription = () => {
  validationErrors.value.description.touched = true
  validationErrors.value.description.required = insuranceDto.value.description.trim() === ''
  validationErrors.value.description.too_short = insuranceDto.value.description.length < 5
  validationErrors.value.description.too_long = insuranceDto.value.description.length > 255
}

/**
 * Crear o actualizar una póliza de seguro
 *
 * Usa el servicio `httpService` para enviar la Póliza a la API.
 * Usa el objeto showRequestResult para mostrar mensajes de éxito o error.
 *
 * Si la response es exitosa, muestra un mensaje de éxito.
 * Si la response indica un error, muestra un mensaje de error.
 *
 * @returns {void}
 */
const createinsurance = async () => {
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
    showRequestResult.value = {
      show: true,
      success: false,
      message: 'Ocurrió un error inesperado. Inténtalo de nuevo más tarde.',
    }
  }
}

/**
 * Actualizar una póliza de seguro
 *
 * Usa el servicio `httpService` para enviar la Póliza a la API.
 * Usa el objeto showRequestResult para mostrar mensajes de éxito o error.
 *
 * Si la response es exitosa, muestra un mensaje de éxito.
 * Si la response indica un error, muestra un mensaje de error.
 *
 * @returns {void}
 */
const updateinsurance = async () => {
  try {
    const response = await httpService.put(
      `insurances/${props.insurance.insurance.id}`,
      insuranceDto.value,
    )

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
/**
 * Función de envío del formulario. Dependiendo de la presencia de `companyId`, realiza una actualización o una creación.
 * @returns {void}
 */
const handleSubmit = () => {
  if (props.insurance.insurance.id > 0) {
    updateinsurance()
  } else {
    createinsurance()
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
