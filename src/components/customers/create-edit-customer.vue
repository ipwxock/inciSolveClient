<template>
  <form @submit.prevent="handleSubmit" class="row">
    <div class="col-12 col-md-4 mb-3">
      <label for="dni" class="form-label">DNI</label>
      <input
        v-model="customerDto.dni"
        class="form-control"
        placeholder="Ej: 8765421A"
        :disabled="props.customer.user.id !== undefined && props.customer.user.id > 0"
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
        >No puedes modificar el DNI de un cliente existente.
      </span>
    </div>

    <div class="col-12 col-md-4 mb-3">
      <label for="first_name" class="form-label">Nombre</label>
      <input
        v-model="customerDto.first_name"
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

    <div class="col-12 col-md-4 mb-3">
      <label for="last_name" class="form-label">Apellido</label>
      <input
        v-model="customerDto.last_name"
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

    <div class="col-12 col-md-4 mb-3">
      <label for="address" class="form-label">Dirección</label>
      <input
        v-model="customerDto.address"
        class="form-control"
        placeholder="Ej: Calle Falsa 132"
        @blur="validateAddress"
        :class="{
          'is-invalid':
            validationErrors.address.touched &&
            (validationErrors.address.required ||
              validationErrors.address.too_short ||
              validationErrors.address.too_long),
          'is-valid':
            validationErrors.address.touched &&
            !validationErrors.address.required &&
            !validationErrors.address.too_short &&
            !validationErrors.address.too_long,
        }"
        required
      />
      <span v-if="validationErrors.address.required" class="address-required text-danger"
        >La dirección es obligatoria.</span
      >
      <span v-if="validationErrors.address.too_short" class="address-to-short text-danger"
        >La dirección es demasiado corta.</span
      >
      <span v-if="validationErrors.address.too_long" class="address-to-long text-danger"
        >La dirección es demasiado larga.</span
      >
    </div>
    <div class="col-12 col-md-4 mb-3">
      <label for="email" class="form-label">Email</label>
      <input
        v-model="customerDto.email"
        type="email"
        :disabled="props.customer.user.id !== undefined && props.customer.user.id > 0"
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
        >No puedes modificar el email de un cliente existente.</span
      >
    </div>

    <div class="col-12 col-md-4 mb-3">
      <label for="phone" class="form-label">Teléfono</label>
      <input
        v-model="customerDto.phone_number"
        class="form-control"
        placeholder="Ej: 678912345"
        @blur="validatePhoneNumber"
        :class="{
          'is-invalid':
            validationErrors.phone_number.touched &&
            (validationErrors.phone_number.required || validationErrors.phone_number.pattern),
          'is-valid':
            validationErrors.phone_number.touched &&
            !validationErrors.phone_number.required &&
            !validationErrors.phone_number.pattern,
        }"
        required
      />
      <span v-if="validationErrors.phone_number.required" class="phone_number-required text-danger"
        >El teléfono es obligatorio.</span
      >
      <span v-if="validationErrors.phone_number.pattern" class="phone_number-pattern text-danger"
        >Introduce un teléfono válido.</span
      >
    </div>
    <br />
    <div class="col-12 col-md-12 pt-3">
      <button type="submit" class="btn btn-primary w-100" :disabled="!validated()">
        {{ props.customer.user.id ? 'Modificar Cliente' : 'Crear Cliente' }}
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
import type { CustomerDTO } from '@/types/Requests.type'
import { HttpService } from '@/services/httpService'
import type { DetailCustomerResponse } from '@/types/Responses.type'

const showRequestResult = ref({
  show: false,
  success: false,
  message: '',
})

const httpService = new HttpService()

const props = defineProps({
  customer: {
    type: Object as () => DetailCustomerResponse,
    default: () => ({
      user: {
        dni: '',
        first_name: '',
        last_name: '',
        email: '',
        role: 'Cliente',
      },
      customer: {
        address: '',
        phone_number: '',
      },
    }),
  },
})

const customerDto = ref<CustomerDTO>({
  dni: '',
  first_name: '',
  last_name: '',
  email: '',
  role: 'Cliente',
  address: '',
  phone_number: '',
})

// Actualizar customerDto cuando `customer` cambie
watchEffect(() => {
  if (props.customer?.user) {
    customerDto.value = {
      dni: props.customer.user.dni || '',
      first_name: props.customer.user.first_name || '',
      last_name: props.customer.user.last_name || '',
      email: props.customer.user.email || '',
      role: 'Cliente',
      address: props.customer.customer.address || '',
      phone_number: props.customer.customer.phone_number || '',
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

const validated = () => {
  return Object.values(validationErrors.value).every((field) =>
    Object.entries(field).every(([key, value]) => key === 'touched' || !value),
  )
}

// 🕵️‍♂️ Watchers individuales para cada campo

const validateDNI = () => {
  if (props.customer.user.id && props.customer.user.dni != customerDto.value.dni) {
    validationErrors.value.dni.untouchableError = true
  } else {
    validationErrors.value.dni.untouchableError = false
    validationErrors.value.dni.touched = true
    validationErrors.value.dni.required = customerDto.value.dni.trim() === ''
    validationErrors.value.dni.pattern = !/^[0-9]{8}[A-Za-z]{1}$/.test(customerDto.value.dni)
  }
}

const validateFirstName = () => {
  validationErrors.value.first_name.touched = true
  validationErrors.value.first_name.required = customerDto.value.first_name.trim() === ''
  validationErrors.value.first_name.too_short = customerDto.value.first_name.length < 2
  validationErrors.value.first_name.too_long = customerDto.value.first_name.length > 50
}

const validateLastName = () => {
  validationErrors.value.last_name.touched = true
  validationErrors.value.last_name.required = customerDto.value.last_name.trim() === ''
  validationErrors.value.last_name.too_short = customerDto.value.last_name.length < 2
  validationErrors.value.last_name.too_long = customerDto.value.last_name.length > 50
}

const validateAddress = () => {
  validationErrors.value.address.touched = true
  validationErrors.value.address.required = customerDto.value.address.trim() === ''
  validationErrors.value.address.too_short = customerDto.value.address.length < 5
  validationErrors.value.address.too_long = customerDto.value.address.length > 100
}

const validateEmail = () => {
  if (props.customer.user.id && props.customer.user.email != customerDto.value.email) {
    validationErrors.value.dni.untouchableError = true
  } else {
    validationErrors.value.email.untouchableError = false
    validationErrors.value.email.touched = true
    validationErrors.value.email.required = customerDto.value.email.trim() === ''
    validationErrors.value.email.pattern =
      !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/.test(customerDto.value.email)
  }
}

const validatePhoneNumber = () => {
  validationErrors.value.phone_number.touched = true
  validationErrors.value.phone_number.required = customerDto.value.phone_number.trim() === ''
  validationErrors.value.phone_number.pattern = !/^[0-9]{9}$/.test(customerDto.value.phone_number)
}

const createCustomer = async () => {
  try {
    const response = await httpService.post('users', customerDto.value)

    if (response.error) {
      console.error('Error creating customer:', response.error)
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
      message: 'Cliente creado correctamente.',
    }
  } catch (error) {
    console.error('Unexpected error creating customer:', error)
    showRequestResult.value = {
      show: true,
      success: false,
      message: 'Ocurrió un error inesperado. Inténtalo de nuevo más tarde.',
    }
  }
}

const updateCustomer = async () => {
  try {
    const response = await httpService.put(`users/${props.customer.user.id}`, customerDto.value)

    if (response.error) {
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
        message: 'El cliente que intentas modificar no existe.',
      }
      return
    }

    showRequestResult.value = {
      show: true,
      success: true,
      message: 'Cliente modificado correctamente.',
    }
  } catch (error) {
    console.error('Unexpected error updating customer:', error)
    showRequestResult.value = {
      show: true,
      success: false,
      message: 'Ocurrió un error inesperado. Inténtalo de nuevo.',
    }
  }
}

const handleSubmit = () => {
  if (props.customer.user.id) {
    updateCustomer()
  } else {
    createCustomer()
  }
}
</script>
