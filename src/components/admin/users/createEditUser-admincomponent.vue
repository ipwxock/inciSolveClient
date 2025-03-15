/* Este componente es un formulario que permite crear o editar un usuario. Se compone de varios
campos que se validan en tiempo real. Al enviar el formulario, se envía una petición al servidor
para crear o editar el usuario. Si la petición es exitosa, se muestra un mensaje de éxito. Si la
petición falla, se muestra un mensaje de error. */
<template>
  <form @submit.prevent="handleSubmit" class="row">
    <!-- DNI -->
    <div class="col-12 col-md-4 mb-3">
      <label for="dni" class="form-label">DNI</label>
      <input
        v-model="userDto.dni"
        id="dni"
        class="form-control"
        placeholder="Ej: 8765421A"
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

    <!-- FIRST NAME -->
    <div class="col-12 col-md-4 mb-3">
      <label for="first_name" class="form-label">Nombre</label>
      <input
        v-model="userDto.first_name"
        id="first_name"
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

    <!--  LAST NAME -->
    <div class="col-12 col-md-4 mb-3">
      <label for="last_name" class="form-label">Apellido</label>
      <input
        v-model="userDto.last_name"
        id="last_name"
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

    <!-- EMAIL -->
    <div class="col-12 col-md-4 mb-3">
      <label for="email" class="form-label">Email</label>
      <input
        v-model="userDto.email"
        id="email"
        type="email"
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

    <!-- ROLE -->
    <div class="col-12 col-md-4 mb-3">
      <label for="address" class="form-label">Rol</label>
      <select
        class="form-select"
        v-model="userDto.role"
        id="role"
        @blur="validateRole"
        @change="checkRole"
        :disabled="userToEdit != null"
        :class="{
          'is-invalid':
            validationErrors.role.touched &&
            (validationErrors.role.required ||
              validationErrors.role.too_short ||
              validationErrors.role.too_long),
          'is-valid':
            validationErrors.role.touched &&
            !validationErrors.role.required &&
            !validationErrors.role.too_short &&
            !validationErrors.role.too_long,
        }"
        required
      >
        <option selected>Selecciona un rol</option>
        <option>Cliente</option>
        <option>Empleado</option>
        <option>Manager</option>
      </select>
    </div>

    <!-- ADDRESS -->
    <div class="col-12 col-md-4 mb-3" v-if="userDto.role === 'Cliente'">
      <label for="address" class="form-label">Dirección</label>
      <input
        v-model="userDto.address"
        class="form-control"
        id="address"
        placeholder="Ej: Calle Falsa 132"
        @blur="validateAddress"
        :required="userDto.role === 'Cliente'"
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

    <!-- PHONE NUMBER -->
    <div class="col-12 col-md-4 mb-3" v-if="userDto.role === 'Cliente'">
      <label for="phone" class="form-label">Teléfono</label>
      <input
        v-model="userDto.phone_number"
        class="form-control"
        id="phone_number"
        placeholder="Ej: 678912345"
        @blur="validatePhoneNumber"
        :required="userDto.role === 'Cliente'"
        :class="{
          'is-invalid':
            validationErrors.phone_number.touched &&
            (validationErrors.phone_number.required || validationErrors.phone_number.pattern),
          'is-valid':
            validationErrors.phone_number.touched &&
            !validationErrors.phone_number.required &&
            !validationErrors.phone_number.pattern,
        }"
      />
      <span v-if="validationErrors.phone_number.required" class="phone_number-required text-danger"
        >El teléfono es obligatorio.</span
      >
      <span v-if="validationErrors.phone_number.pattern" class="phone_number-pattern text-danger"
        >Introduce un teléfono válido.</span
      >
    </div>

    <!-- COMPANY ID -->
    <div
      class="col-12 col-md-4 mb-3"
      v-if="userDto.role === 'Empleado' || userDto.role === 'Manager'"
    >
      <label for="company" class="form-label">Aseguradora</label>
      <select
        class="form-select"
        id="company_id"
        v-model="userDto.company_id"
        @blur="validateCompanyId"
        :required="userDto.role === 'Empleado' || userDto.role === 'Manager'"
        :class="{
          'is-invalid': validationErrors.company_id.touched && validationErrors.company_id.required,
          'is-valid': validationErrors.company_id.touched && !validationErrors.company_id.required,
        }"
      >
        <option selected>Selecciona una empresa</option>
        <option v-for="company in companies" :key="company.id" :value="company.id">
          {{ company.name }}
        </option>
      </select>
    </div>

    <br />
    <div class="col-12 col-md-12 pt-3">
      <button type="submit" class="btn btn-primary w-100" :disabled="!validated()">
        {{ userId ? `Modificar ` + userDto.role : 'Crear ' + userDto.role }}
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
import { ref, onMounted, watch } from 'vue'
import { HttpService } from '@/services/httpService'
import type { UserDTO } from '@/types/Requests.type'
import type { Company } from '@/types/Company.type'
import { useRouter } from 'vue-router'

const showRequestResult = ref({
  show: false,
  success: false,
  message: '',
})
const router = useRouter()
const route = router.currentRoute
const userId = route.value.params.id
const httpService = new HttpService()
const userToEdit = ref<UserDTO>()
const userDto = ref<UserDTO>({
  dni: '',
  first_name: '',
  last_name: '',
  role: '',
  email: '',
  address: '',
  phone_number: '',
  company_id: 0,
})
const companies = ref<Company[]>([])

const checkRole = () => {
  if (userDto.value.role === 'Empleado' || userDto.value.role === 'Manager') {
    fetchCompanies()
  }
}

watch(userToEdit, () => {
  if (userToEdit.value) {
    userDto.value = userToEdit.value
  }
})

/**
 * Comprueba si se ha proporcionado un ID de usuario en la URL. Si es así, se obtienen los datos del usuario
 * y se rellenan los campos del formulario con ellos.
 * @returns boolean
 */
onMounted(async () => {
  if (userId) {
    try {
      const response = await httpService.get<UserDTO>(`users/${userId}`)
      if (response.status === 200 && response.data) {
        userToEdit.value = response.data
      }
    } catch (error) {
      console.log(error)
    }
  }

  // Independientemente, se obtienen las empresas para rellenar el select
  if (userDto.value.role === 'Empleado' || userDto.value.role === 'Manager') {
    fetchCompanies()
  }
})

/**
 * Obtiene todas las empresas de InciSolve
 *
 * Usa el servicio HttpService para hacer una petición GET a la API de InciSolve y recuperar todas las empresas
 *
 * @returns {boolean}
 */
const fetchCompanies = async () => {
  try {
    const response = await httpService.get<Company[]>('companies')
    if (response.status === 200 && response.data) {
      companies.value = response.data
    }
  } catch (error) {
    console.log(error)
  }
}

// Estado de errores de validación
const validationErrors = ref({
  dni: { touched: false, required: false, pattern: false, untouchableError: false },
  first_name: { touched: false, required: false, too_short: false, too_long: false },
  email: { touched: false, required: false, pattern: false, untouchableError: false },
  last_name: { touched: false, required: false, too_short: false, too_long: false },
  address: { touched: false, required: false, too_short: false, too_long: false },
  phone_number: { touched: false, required: false, pattern: false },
  role: { touched: false, required: false, too_short: false, too_long: false },
  company_id: { touched: false, required: false, too_short: false, too_long: false },
})

/**
 * Comprueba si todos los campos del formulario son válidos.
 * @returns {boolean}
 */
const validated = () => {
  return Object.values(validationErrors.value).every((field) =>
    Object.entries(field).every(([key, value]) => key === 'touched' || !value),
  )
}

/**
 * Valida el campo 'dni' (DNI del usuario).
 *
 * Usa el objeto `validationErrors` para mostrar mensajes de error.
 *
 * @returns {void}
 */
const validateDNI = () => {
  validationErrors.value.dni.untouchableError = false
  validationErrors.value.dni.touched = true
  validationErrors.value.dni.required = userDto.value.dni.trim() === ''
  validationErrors.value.dni.pattern = !/^[0-9]{8}[A-Za-z]{1}$/.test(userDto.value.dni)
}

/**
 * Valida el campo 'first_name' (nombre del usuario).
 *
 * Usa el objeto `validationErrors` para mostrar mensajes de error.
 *
 * @returns {void}
 */
const validateFirstName = () => {
  validationErrors.value.first_name.touched = true
  validationErrors.value.first_name.required = userDto.value.first_name.trim() === ''
  validationErrors.value.first_name.too_short = userDto.value.first_name.length < 2
  validationErrors.value.first_name.too_long = userDto.value.first_name.length > 50
}

/**
 * Valida el campo 'last_name' (apellido del usuario).
 *
 * Usa el objeto `validationErrors` para mostrar mensajes de error.
 *
 * @returns {void}
 */
const validateLastName = () => {
  validationErrors.value.last_name.touched = true
  validationErrors.value.last_name.required = userDto.value.last_name.trim() === ''
  validationErrors.value.last_name.too_short = userDto.value.last_name.length < 2
  validationErrors.value.last_name.too_long = userDto.value.last_name.length > 50
}

/**
 * Valida el campo 'role' (rol del usuario).
 *
 * Usa el objeto `validationErrors` para mostrar mensajes de error.
 *
 * @returns {void}
 */
const validateRole = () => {
  validationErrors.value.role.required =
    userDto.value.role !== 'Empleado' &&
    userDto.value.role !== 'Manager' &&
    userDto.value.role !== 'Cliente'
}

/**
 * Valida el campo 'address' (dirección del usuario en caso de ser Cliente).
 *
 * Usa el objeto `validationErrors` para mostrar mensajes de error.
 *
 * @returns {void}
 */
const validateAddress = () => {
  if (userDto.value.role !== 'Cliente') return
  validationErrors.value.address.touched = true
  validationErrors.value.address.required = userDto.value.address?.trim() === ''
  validationErrors.value.address.too_short = userDto.value.address
    ? userDto.value.address.length < 5
    : false
  validationErrors.value.address.too_long = userDto.value.address
    ? userDto.value.address.length > 100
    : false
}

/**
 * Valida el campo 'email' (email del usuario).
 *
 * Usa el objeto `validationErrors` para mostrar mensajes de error.
 *
 * @returns {void}
 */
const validateEmail = () => {
  validationErrors.value.email.untouchableError = false
  validationErrors.value.email.touched = true
  validationErrors.value.email.required = userDto.value.email.trim() === ''
  validationErrors.value.email.pattern = !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/.test(
    userDto.value.email,
  )
}

/**
 * Valida el campo 'phone_number' (teléfono del usuario en caso de ser Cliente).
 *
 * Usa el objeto `validationErrors` para mostrar mensajes de error.
 *
 * @returns {void}
 */
const validatePhoneNumber = () => {
  if (userDto.value.role !== 'Cliente') return
  validationErrors.value.phone_number.touched = true
  validationErrors.value.phone_number.required = userDto.value.phone_number?.trim() === ''
  validationErrors.value.phone_number.pattern = userDto.value.phone_number
    ? !/^[0-9]{9}$/.test(userDto.value.phone_number)
    : false
}

/**
 * Valida el campo 'company_id' (ID de la empresa a la que pertenece el usuario en caso de ser Empleado/Manager).
 *
 * Usa el objeto `validationErrors` para mostrar mensajes de error.
 *
 * @returns {void}
 */
const validateCompanyId = () => {
  if (userDto.value.role !== 'Empleado' && userDto.value.role !== 'Manager') return
  validationErrors.value.company_id.touched = true
  validationErrors.value.company_id.required = userDto.value.company_id === 0
}

/**
 * Función de envío del formulario. Dependiendo de la presencia de `companyId`, realiza una actualización o una creación.
 * @returns {void}
 */
const handleSubmit = async () => {
  if (userId) {
    updateUser()
  } else {
    createUser()
  }
}

/**
 * Crea un usuario en la base de datos
 *
 * Usa el servicio `httpService` para enviar al Usuario a la API.
 * Usa el objeto showRequestResult para mostrar mensajes de éxito o error.
 *
 * Si la response es exitosa, muestra un mensaje de éxito.
 * Si la response indica un error, muestra un mensaje de error.
 *
 * @returns {void}
 */
const createUser = async () => {
  try {
    const response = await httpService.post('users', userDto.value)
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
    } else if (response.status === 400) {
      showRequestResult.value = {
        show: true,
        success: false,
        message: 'La Aseguradora ya tiene un Manager.',
      }
      return
    }
    showRequestResult.value = {
      show: true,
      success: true,
      message: 'Usuario creado correctamente.',
    }
  } catch (error) {
    showRequestResult.value = { show: true, success: false, message: 'Ha ocurrido un error' }
  }
}

/**
 * Edita un usuario en la base de datos
 *
 * Usa el servicio `httpService` para enviar al Usuario a la API.
 * Usa el objeto showRequestResult para mostrar mensajes de éxito o error.
 *
 * Si la response es exitosa, muestra un mensaje de éxito.
 * Si la response indica un error, muestra un mensaje de error.
 *
 *
 * @returns {void}
 */
const updateUser = async () => {
  try {
    const response = await httpService.put(`users/${userId}`, userDto.value)
    if (response.status === 200) {
      showRequestResult.value = {
        show: true,
        success: true,
        message: 'Usuario modificado correctamente',
      }
    } else if (response.status === 403) {
      showRequestResult.value = {
        show: true,
        success: true,
        message: 'No estás autorizado para realizar esta acción',
      }
    } else if (response.status === 404) {
      showRequestResult.value = {
        show: true,
        success: false,
        message: 'Usuario no encontrado',
      }
    } else if (response.status === 400) {
      showRequestResult.value = {
        show: true,
        success: false,
        message: 'No se puede cambiar el rol del usuario.',
      }
    } else {
      showRequestResult.value = {
        show: true,
        success: false,
        message: 'Ha ocurrido un error. Inténtelo de nuevo más tarde',
      }
    }
  } catch (error) {
    showRequestResult.value = { show: true, success: false, message: 'Ha ocurrido un error' }
  }
}
</script>
