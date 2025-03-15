/* Este componente muestra una lista de usuarios y permite filtrarlos por nombre, apellidos, email,
rol y DNI. También permite eliminar usuarios no administradores. Incluye un botón para añadir un
nuevo usuario y un mensaje de éxito o error al eliminar un usuario. También incluye un search bar
para filtrar los usuarios. */
<template>
  <div class="container-fluid px-md-3">
    <div class="row justify-content-space-evenly align-items-center">
      <h1 class="h1 col-12 col-md-4">
        <i class="fa-sharp fa-solid fa-user"></i>Usuarios de InciSolve
      </h1>
      <div class="col-12 col-md-4">
        <router-link :to="route.path + '/new'">
          <a class="btn btn-primary px-5">+ Añadir Usuario</a>
        </router-link>
      </div>
    </div>

    <div class="row pt-3">
      <div class="form-group col-12 col-md-4">
        <label for="search">Buscar usuario</label>
        <input
          type="text"
          v-model="searchString"
          class="form-control"
          id="search"
          placeholder="Ej: Manolo..."
        />
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
    <div class="row">
      <div class="col-12 table-responsive">
        <table class="table table-striped table-hover">
          <thead>
            <tr>
              <th><strong>Nombre</strong></th>
              <th><strong>Apellidos</strong></th>
              <th><strong>Email</strong></th>
              <th><strong>Rol</strong></th>
              <th><strong>DNI</strong></th>
              <th><strong>Fecha de registro</strong></th>
              <th><strong>Acciones</strong></th>
            </tr>
          </thead>
          <tbody v-if="filteredUsers">
            <tr v-for="user in filteredUsers" :key="user.id">
              <td>{{ user.first_name }}</td>
              <td>{{ user.last_name }}</td>
              <td>{{ user.email }}</td>
              <td>{{ user.role }}</td>
              <td>{{ user.dni }}</td>
              <td>{{ formatDate(user.created_at) }}</td>
              <td>
                <router-link :to="route.path + '/' + user.id">
                  <a class="btn btn-primary">Ver</a>
                </router-link>
                <a v-if="user.role !== 'Admin'" class="btn btn-danger" @click="deleteUser(user.id!)"
                  >Eliminar</a
                >
              </td>
            </tr>
            <tr v-if="filteredUsers?.length === 0">
              <td colspan="6" class="text-center">
                <strong>No se han encontrado resultados</strong>
              </td>
            </tr>
          </tbody>
          <tbody v-else>
            <tr>
              <td colspan="6" class="text-center">
                <div class="spinner-border text-primary" role="status">
                  <span class="visually-hidden">Cargando...</span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, watch } from 'vue'
import { HttpService } from '@/services/httpService'
import type { User } from '@/types/User.type'
import { useRoute } from 'vue-router'
import { formatDate } from '@/utils/date'

const users = ref<User[]>()
const httpService = new HttpService()
const searchString = ref('')
const route = useRoute()
const filteredUsers = ref<User[]>()
const showRequestResult = ref({
  success: false,
  message: '',
  show: false,
})

onMounted(() => {
  fetchUsers()
})

watch(searchString, (newVal) => {
  if (newVal) {
    filteredUsers.value = users.value?.filter(
      (user) =>
        user.first_name.toLowerCase().includes(newVal.toLowerCase()) ||
        user.last_name.toLowerCase().includes(newVal.toLowerCase()) ||
        user.email.toLowerCase().includes(newVal.toLowerCase()) ||
        user.role.toLowerCase().includes(newVal.toLowerCase()) ||
        user.dni.toLowerCase().includes(newVal.toLowerCase()),
    )
  } else {
    users.value = users.value
  }
})

/**
 * Obtiene todos los usuarios del sistema.
 *
 * Usa el servicio HttpService para obtener los usuarios del sistema y los guarda en la variable users.
 *
 * @returns {void}
 */
const fetchUsers = async () => {
  try {
    const response = await httpService.get<User[]>('users')
    if (response.status === 200) {
      users.value = response.data
      if (users.value) {
        filteredUsers.value = users.value
      }
    }
  } catch (error) {
    console.error('Error fetching users:', error)
  }
}

/**
 * Elimina un usuario del sistema.
 * @param id ID del usuario a eliminar.
 * @returns {void}
 */
const deleteUser = async (id: number) => {
  try {
    const response = await httpService.delete(`users/${id}`)
    if (response.status === 200) {
      fetchUsers()
      showRequestResult.value = {
        success: true,
        message: 'Usuario eliminado correctamente.',
        show: true,
      }
    } else {
      showRequestResult.value = {
        success: false,
        message: 'Error al eliminar el usuario. ' + response.error,
        show: true,
      }
    }
  } catch (error) {
    console.error('Error deleting user:', error)
  }
}
</script>
