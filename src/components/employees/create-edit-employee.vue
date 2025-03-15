/* Este componente es un formulario para crear o editar empleados. Se encarga de validar los campos
del formulario y de enviar la petición al servidor. Si se está editando un empleado, se deshabilitan
los campos DNI y email para evitar que se modifiquen. */
<template>
  <form @submit.prevent="handleSubmit" class="row">
    <div class="col-12 col-md-6 mb-3">
      <label for="first_name" class="form-label">Nombre</label>
      <input
        v-model="employeeDto.first_name"
        class="form-control"
        placeholder="Ej: Juan José"
        @blur="validateFirstName"
        :class="{
          'is-invalid':
            validationErrors.first_name.touched &&
            (validationErrors.first_name.required ||
              validationErrors.first_name.too_short ||
              validationErrors.first_name.too_long),
          'is-valid':
            validationErrors.first_name.touched &&
            !validationErrors.first_name.required &&
            !validationErrors.first_name.too_short &&
            !validationErrors.first_name.too_long,
        }"
        required
      />
      <span v-if="validationErrors.first_name.required" class="first_name_required text-danger"
        >El nombre es obligatorio.</span
      >
      <span v-if="validationErrors.first_name.too_short" class="first_name_too_short text-danger"
        >El nombre es demasiado corto.</span
      >
      <span v-if="validationErrors.first_name.too_long" class="first_name_too_long text-danger"
        >El nombre es demasiado largo.</span
      >
    </div>

    <div class="col-12 col-md-6 mb-3">
      <label for="last_name" class="form-label">Apellido</label>
      <input
        v-model="employeeDto.last_name"
        class="form-control"
        placeholder="Ej: López Gómez"
        @blur="validateLastName"
        :class="{
          'is-invalid':
            validationErrors.first_name.touched &&
            (validationErrors.last_name.required ||
              validationErrors.last_name.too_short ||
              validationErrors.last_name.too_long),
          'is-valid':
            validationErrors.first_name.touched &&
            !validationErrors.last_name.required &&
            !validationErrors.last_name.too_short &&
            !validationErrors.last_name.too_long,
        }"
        required
      />
      <span v-if="validationErrors.last_name.required" class="last_name_required text-danger"
        >El apellido es obligatorio.</span
      >
      <span v-if="validationErrors.last_name.too_short" class="last_name_too_short text-danger"
        >El apellido es demasiado corto.</span
      >
      <span v-if="validationErrors.last_name.too_long" class="last_name_too_long text-danger"
        >El apellido es demasiado largo.</span
      >
    </div>

    <div class="col-12 col-md-6 mb-3">
      <label for="dni" class="form-label">DNI</label>
      <input
        v-model="employeeDto.dni"
        class="form-control"
        placeholder="Ej: 8765421A"
        :disabled="props.employee.user.id !== undefined && props.employee.user.id > 0"
        @blur="validateDNI"
        :class="{
          'is-invalid':
            validationErrors.dni.touched &&
            (validationErrors.dni.pattern ||
              validationErrors.dni.required ||
              validationErrors.dni.untouchableError),
          'is-valid':
            validationErrors.dni.touched &&
            !validationErrors.dni.pattern &&
            !validationErrors.dni.required,
        }"
        required
      />
      <span v-if="validationErrors.dni.required" class="dni-required text-danger"
        >El DNI es obligatorio.</span
      >
      <span v-if="validationErrors.dni.pattern" class="dni-pattern text-danger"
        >Introduce un DNI válido( 8 números y 1 letra ).</span
      >
      <span v-if="validationErrors.dni.untouchableError" class="dni-untouchable-error text-danger"
        >No puedes modificar el DNI de un empleado existente.
      </span>
    </div>

    <div class="col-12 col-md-6 mb-3">
      <label for="email" class="form-label">Email</label>
      <input
        v-model="employeeDto.email"
        type="email"
        :disabled="props.employee.user.id !== undefined && props.employee.user.id > 0"
        class="form-control"
        placeholder="Ej: ejemplo@ejemplo.com"
        @blur="validateEmail"
        :class="{
          'is-invalid':
            validationErrors.email.touched &&
            (validationErrors.email.required ||
              validationErrors.email.pattern ||
              validationErrors.email.untouchableError),
          'is-valid':
            validationErrors.email.touched &&
            !validationErrors.email.required &&
            !validationErrors.email.pattern,
        }"
        required
      />
      <span v-if="validationErrors.email.required" class="email-required text-danger"
        >El email es obligatorio.</span
      >
      <span v-if="validationErrors.email.pattern" class="email-pattern text-danger"
        >Introduce un email válido.</span
      >
      <span
        v-if="validationErrors.email.untouchableError"
        class="email-untouchable-error text-danger"
        >No puedes modificar el email de un empleado existente.</span
      >
    </div>

    <br />
    <div class="col-12 col-md-12 pt-3">
      <button type="submit" class="btn btn-primary w-100" :disabled="!validated()">
        {{ props.employee.user.id ? 'Modificar Empleado' : 'Crear Empleado' }}
      </button>
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
  </form>
</template>

<script lang="ts" setup>
import { ref, watchEffect } from 'vue'
import type { EmployeeDTO } from '@/types/Requests.type'
import { HttpService } from '@/services/httpService'
import type { DetailEmployeeResponse } from '@/types/Responses.type'

const showRequestResult = ref({
  show: false,
  success: false,
  message: '',
})

const httpService = new HttpService()

/**
 * Propiedades del componente.
 *
 * @property {DetailEmployeeResponse} employee - Objeto de tipo DetailEmployeeResponse que contiene los datos del empleado.
 * @returns {Object} - Objeto con las propiedades del componente.
 */
const props = defineProps({
  employee: {
    type: Object as () => DetailEmployeeResponse,
    default: () => ({
      user: {
        dni: '',
        first_name: '',
        last_name: '',
        email: '',
        role: 'Empleado',
      },
      employee: {
        company_id: 0,
      },
    }),
  },
})

const employeeDto = ref<EmployeeDTO>({
  dni: '',
  first_name: '',
  last_name: '',
  email: '',
  role: 'Empleado',
  company_id: 0,
})

// Actualizar employeeDto cuando `employee` cambie
watchEffect(() => {
  if (props.employee?.user) {
    employeeDto.value = {
      dni: props.employee.user.dni || '',
      first_name: props.employee.user.first_name || '',
      last_name: props.employee.user.last_name || '',
      email: props.employee.user.email || '',
      role: 'Empleado',
      company_id: props.employee.employee.company_id || 0,
    }
  }
})

// Estado de errores de validación
const validationErrors = ref({
  dni: { touched: false, required: false, pattern: false, untouchableError: false },
  first_name: { touched: false, required: false, too_short: false, too_long: false },
  email: { touched: false, required: false, pattern: false, untouchableError: false },
  last_name: { touched: false, required: false, too_short: false, too_long: false },
  address: { touched: false, required: false, too_short: false, too_long: false },
  phone_number: { touched: false, required: false, pattern: false },
})

/**
 * Comprueba si el formulario es válido.
 *
 * Usa el objeto `validationErrors` para mostrar mensajes de error.
 *
 * @returns {boolean} - `true` si el formulario es válido, `false` en caso contrario.
 */
const validated = () => {
  return Object.values(validationErrors.value).every((field) =>
    Object.entries(field).every(([key, value]) => key === 'touched' || !value),
  )
}

/**
 * Valida el campo 'dni' (DNI del Empleado).
 *
 * Usa el objeto `validationErrors` para mostrar mensajes de error.
 *
 * @returns {void}
 */
const validateDNI = () => {
  if (props.employee.user.id && props.employee.user.dni != employeeDto.value.dni) {
    validationErrors.value.dni.untouchableError = true
  } else {
    validationErrors.value.dni.untouchableError = false
    validationErrors.value.dni.touched = true
    validationErrors.value.dni.required = employeeDto.value.dni.trim() === ''
    validationErrors.value.dni.pattern = !/^[0-9]{8}[A-Za-z]{1}$/.test(employeeDto.value.dni)
  }
}

/**
 * Valida el campo 'first_name' (nombre del Empleado).
 *
 * Usa el objeto `validationErrors` para mostrar mensajes de error.
 *
 * @returns {void}
 */
const validateFirstName = () => {
  validationErrors.value.first_name.touched = true
  validationErrors.value.first_name.required = employeeDto.value.first_name.trim() === ''
  validationErrors.value.first_name.too_short = employeeDto.value.first_name.length < 2
  validationErrors.value.first_name.too_long = employeeDto.value.first_name.length > 50
}

/**
 * Valida el campo 'last_name' (apellido del Empleado).
 *
 * Usa el objeto `validationErrors` para mostrar mensajes de error.
 *
 * @returns {void}
 */
const validateLastName = () => {
  validationErrors.value.last_name.touched = true
  validationErrors.value.last_name.required = employeeDto.value.last_name.trim() === ''
  validationErrors.value.last_name.too_short = employeeDto.value.last_name.length < 2
  validationErrors.value.last_name.too_long = employeeDto.value.last_name.length > 50
}

/**
 * Valida el campo 'email' (email del Empleado).
 *
 * Usa el objeto `validationErrors` para mostrar mensajes de error.
 *
 * @returns {void}
 */
const validateEmail = () => {
  if (props.employee.user.id && props.employee.user.email != employeeDto.value.email) {
    validationErrors.value.dni.untouchableError = true
  } else {
    validationErrors.value.email.untouchableError = false
    validationErrors.value.email.touched = true
    validationErrors.value.email.required = employeeDto.value.email.trim() === ''
    validationErrors.value.email.pattern =
      !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/.test(employeeDto.value.email)
  }
}

/**
 * Función para crear un empleado.
 *
 * Usa el servicio `httpService` para enviar al Empleado a la API.
 * Usa el objeto showRequestResult para mostrar mensajes de éxito o error.
 *
 * Si la response es exitosa, muestra un mensaje de éxito.
 * Si la response indica un error, muestra un mensaje de error.
 *
 * @returns {void}
 */
const createemployee = async () => {
  try {
    const response = await httpService.post('users', employeeDto.value)

    if (response.error) {
      console.error('Error creating employee:', response.error)
      showRequestResult.value = {
        show: true,
        success: false,
        message: response.error.includes('The dni has already been taken')
          ? 'El DNI introducido ya está registrado.'
          : response.error.includes('The email has already been taken')
            ? 'El email introducido ya está registrado.'
            : 'Ha habido un error: ' + response.error,
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
      message: 'Empleado creado correctamente.',
    }
  } catch (error) {
    console.error('Unexpected error creating employee:', error)
    showRequestResult.value = {
      show: true,
      success: false,
      message: 'Ocurrió un error inesperado. Inténtalo de nuevo más tarde.',
    }
  }
}

/**
 * Función para modificar un empleado.
 *
 * Usa el servicio `httpService` para enviar al Empleado a la API.
 * Usa el objeto showRequestResult para mostrar mensajes de éxito o error.
 *
 * Si la response es exitosa, muestra un mensaje de éxito.
 * Si la response indica un error, muestra un mensaje de error.
 *
 * @returns {void}
 */
const updateemployee = async () => {
  try {
    const response = await httpService.put(`users/${props.employee.user.id}`, employeeDto.value)

    if (response.error) {
      console.error('Error updating employee:', response.error)
      showRequestResult.value = {
        show: true,
        success: false,
        message: response.error.includes('The dni has already been taken')
          ? 'El DNI introducido ya está registrado.'
          : response.error.includes('The email has already been taken')
            ? 'El email introducido ya está registrado.'
            : 'Ha habido un error: ' + response.error,
      }
      return
    } else if (response.status === 403) {
      showRequestResult.value = {
        show: true,
        success: false,
        message: 'No estás autorizado a realizar esta acción.',
      }
      return
    } else if (response.status === 404) {
      showRequestResult.value = {
        show: true,
        success: false,
        message: 'Empleado no encontrado.',
      }
      return
    }

    showRequestResult.value = {
      show: true,
      success: true,
      message: 'Empleado modificado correctamente.',
    }
  } catch (error) {
    console.error('Unexpected error updating employee:', error)
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
  if (props.employee.user.id) {
    updateemployee()
  } else {
    createemployee()
  }
}
</script>
