/** Componente CreateEditCompanyAdminComponent Este componente es el encargado de mostrar el
formulario para crear o editar una aseguradora. Se encarga de validar los campos del formulario y de
enviar la petición al servidor para crear o editar la aseguradora. En caso de que se esté editando
una aseguradora, se obtienen los datos de la aseguradora a través de la API. */
<template>
  <form class="container" @submit.prevent="handleSubmit">
    <div class="row">
      <div class="col-12 col-md-6 pb-3">
        <label for="name" class="form-label">Nombre</label>
        <input
          type="text"
          class="form-control"
          id="name"
          :class="{
            'is-invalid':
              validationErrors.name.touched &&
              (validationErrors.name.required ||
                validationErrors.name.too_short ||
                validationErrors.name.too_long),
            'is-valid': validationErrors.name.touched && !validationErrors.name.too_short,
          }"
          @input="validateName"
          v-model="companyDTO.name"
          required
        />
        <div
          v-if="validationErrors.name.touched && validationErrors.name.required"
          class="text-danger"
        >
          El nombre es obligatorio
        </div>
        <div
          v-if="validationErrors.name.touched && validationErrors.name.too_short"
          class="text-danger"
        >
          El nombre debe tener al menos 3 caracteres
        </div>
        <div
          v-if="validationErrors.name.touched && validationErrors.name.too_long"
          class="text-danger"
        >
          El nombre no puede tener más de 255 caracteres
        </div>
      </div>
      <div class="col-12 col-md-6 pb-3">
        <label for="phone_number" class="form-label">Teléfono</label>
        <input
          type="text"
          class="form-control"
          id="phone_number"
          :class="{
            'is-invalid':
              validationErrors.phone_number.touched && validationErrors.phone_number.pattern,
            'is-valid':
              validationErrors.phone_number.touched && !validationErrors.phone_number.pattern,
          }"
          @input="validatePhoneNumber"
          v-model="companyDTO.phone_number"
        />
        <span
          v-if="validationErrors.phone_number.touched && validationErrors.phone_number.pattern"
          class="text-danger"
        >
          El teléfono debe tener 9 dígitos
        </span>
      </div>
      <div class="col-12 pb-3">
        <label for="description" class="form-label">Descripción</label>
        <textarea
          class="form-control"
          id="description"
          :class="{
            'is-invalid':
              validationErrors.description.touched &&
              (validationErrors.description.too_short || validationErrors.description.too_long),
            'is-valid':
              (validationErrors.description.touched && !validationErrors.description.too_long) ||
              (validationErrors.description.too_short && validationErrors.description.touched),
          }"
          @input="validateDescription"
          v-model="companyDTO.description"
        ></textarea>
        <span
          v-if="validationErrors.description.touched && validationErrors.description.too_short"
          class="text-danger"
        >
          La descripción debe tener al menos 10 caracteres
        </span>
        <span
          v-if="validationErrors.description.touched && validationErrors.description.too_long"
          class="text-danger"
        >
          La descripción no puede tener más de 255 caracteres
        </span>
      </div>
      <div class="col-12 col-md-4 pb-3">
        <button class="btn btn-primary w-100" type="submit">
          {{ companyId ? 'Modificar' : 'Crear' }}
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
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { Company } from '@/types/Company.type'
import type { CompanyDTO } from '@/types/Requests.type'
import { HttpService } from '@/services/httpService'
import { useRouter } from 'vue-router'

const httpService = new HttpService()
const router = useRouter()
const companyId = router.currentRoute.value.params.id
const companyDTO = ref<CompanyDTO>({
  name: '',
  description: '',
  phone_number: '',
})
const showRequestResult = ref({
  show: false,
  success: false,
  message: '',
})
const validationErrors = ref({
  name: { touched: false, required: false, too_short: false, too_long: false },
  description: { touched: false, too_short: false, too_long: false },
  phone_number: { touched: false, pattern: false },
})

onMounted(() => {
  if (companyId) {
    fetchCompany()
  }
})

/**
 * Función que se encarga de obtener los datos de la empresa a través de la API.
 *
 * Usa el servicio `httpService` para obtener la empresa.
 *
 * @returns {void}
 */
const fetchCompany = async () => {
  try {
    const response = await httpService.get<Company>(`companies/${companyId}/get-company-simple`)
    if (response.status === 200 && response.data) {
      companyDTO.value = {
        name: response.data.name,
        description: response.data.description,
        phone_number: response.data.phone_number || '',
      }
    } else {
      showRequestResult.value = {
        show: true,
        success: false,
        message: 'Error al obtener la empresa. Inténtalo de nuevo más tarde.',
      }
    }
  } catch (error) {
    console.error('Error fetching company:', error)
    showRequestResult.value = {
      show: true,
      success: false,
      message: 'Ocurrió un error inesperado. Inténtalo de nuevo más tarde.',
    }
  }
}

/**
 * Valida el campo 'name' (nombre de la empresa).
 *
 * Usa el objeto `validationErrors` para mostrar mensajes de error.
 *
 * @returns {void}
 */
const validateName = () => {
  validationErrors.value.name.touched = true
  validationErrors.value.name.required = companyDTO.value.name.length === 0
  validationErrors.value.name.too_short =
    companyDTO.value.name.length > 0 && companyDTO.value.name.length < 3
  validationErrors.value.name.too_long = companyDTO.value.name.length > 255
}

/**
 * Valida el campo 'description' (descripción de la empresa).
 *
 * Usa el objeto `validationErrors` para mostrar mensajes de error.
 *
 * @returns {void}
 */
const validateDescription = () => {
  validationErrors.value.description.touched = true
  validationErrors.value.description.too_short =
    companyDTO.value.description.length > 0 && companyDTO.value.description.length < 10
  validationErrors.value.description.too_long = companyDTO.value.description.length > 255
}

/**
 * Valida el campo 'phone_number' (teléfono de la empresa).
 *
 * Usa el objeto `validationErrors` para mostrar mensajes de error.
 *
 * @returns {void}
 */
const validatePhoneNumber = () => {
  validationErrors.value.phone_number.touched = true
  validationErrors.value.phone_number.pattern =
    !/^[0-9]{9}$/.test(companyDTO.value.phone_number) && companyDTO.value.phone_number.length > 0
}

/**
 * Función de envío del formulario. Dependiendo de la presencia de `companyId`, realiza una actualización o una creación.
 * @returns {void}
 */
const handleSubmit = () => {
  if (router.currentRoute.value.params.id) {
    updateCompany()
  } else {
    createCompany()
  }
}

/**
 * Función que se encarga de actualizar una empresa en la base de datos.
 *
 * Usa el servicio `httpService` para enviar la Aseguradora a la API.
 * Usa el objeto showRequestResult para mostrar mensajes de éxito o error.
 *
 * Si la response tiene éxito, muestra un mensaje de éxito.
 * Si la response indica un error, muestra un mensaje de error.
 *
 * @returns {void}
 */
const updateCompany = async () => {
  try {
    const response = await httpService.put<Company>(
      `companies/${router.currentRoute.value.params.id}`,
      companyDTO.value,
    )

    if (response.status === 200) {
      showRequestResult.value.message = 'Aseguradora actualizada correctamente'
      showRequestResult.value.success = true
      showRequestResult.value.show = true
      return
    } else if (response.status === 403) {
      showRequestResult.value = {
        show: true,
        success: false,
        message: 'No estás autorizado a realizar esta acción.',
      }
      return
    } else {
      showRequestResult.value.message =
        'Error al actualizar la empresa. Comprueba los datos introducidos.'
      showRequestResult.value.success = false
      showRequestResult.value.show = true
    }
  } catch (error) {
    console.error('Error updating company:', error)
    showRequestResult.value = {
      show: true,
      success: false,
      message: 'Ocurrió un error inesperado. Inténtalo de nuevo más tarde.',
    }
  }
}

/**
 * Función que se encarga de crear una empresa en la base de datos.
 *
 * Usa el servicio `httpService` para enviar la Aseguradora a la API.
 * Usa el objeto showRequestResult para mostrar mensajes de éxito o error.
 *
 * Si la response tiene éxito, muestra un mensaje de éxito.
 * Si la response indica un error, muestra un mensaje de error.
 *
 * @returns {void}
 */
const createCompany = async () => {
  try {
    const response = await httpService.post<Company>('companies', companyDTO.value)
    if (response.status === 201) {
      showRequestResult.value.message = 'Aseguradora creada correctamente'
      showRequestResult.value.success = true
      showRequestResult.value.show = true
    } else if (response.status === 403) {
      showRequestResult.value = {
        show: true,
        success: false,
        message: 'No estás autorizado a realizar esta acción.',
      }
      return
    } else if (response.error) {
      showRequestResult.value.message = 'Error al crear la empresa' + response.error
      showRequestResult.value.success = false
      showRequestResult.value.show = true
    } else {
      showRequestResult.value.message = 'Error al crear la empresa'
      showRequestResult.value.success = false
      showRequestResult.value.show = true
    }
  } catch (error) {
    console.error('Error creating company:', error)
    showRequestResult.value = {
      show: true,
      success: false,
      message: 'Ocurrió un error inesperado. Inténtalo de nuevo más tarde.',
    }
  }
}
</script>
