<template>
  <form>
    <div class="mb-3">
      <label for="dni" class="form-label">DNI</label>
      <input type="text" class="form-control" id="dni" v-model="user.dni" />
    </div>
    <div class="mb-3">
      <label for="first_name" class="form-label">Nombre</label>
      <input type="text" class="form-control" id="first_name" v-model="user.first_name" />
    </div>
    <div class="mb-3">
      <label for="last_name" class="form-label">Apellido</label>
      <input type="text" class="form-control" id="last_name" v-model="user.last_name" />
    </div>
    <div class="mb-3">
      <label for="email" class="form-label">Correo electrónico</label>
      <input type="email" class="form-control" id="email" v-model="user.email" />
    </div>
    <div class="mb-3">
      <label for="password" class="form-label">Contraseña</label>
      <input type="password" class="form-control" id="password" v-model="user.password" />
    </div>
    <div class="mb-3">
      <label for="role" class="form-label">Rol</label>
      <input type="text" class="form-control" name="role" id="role" value="Employee" disabled />
    </div>

    <input
      type="hidden"
      class="form-control"
      id="company_id"
      name="company_id"
      :value="company_id"
    />

    <button type="submit" class="btn btn-primary">Crear empleado</button>
  </form>
</template>

<script setup lang="ts">
import router from '@/router/routes'
import type { Employee } from '@/types/Employee.type'
import type { User } from '@/types/User.type'

const user: User
const employee: Employee
const userRole = localStorage.getItem('role')
const company_id = localStorage.getItem('company_id')

if (company_id === null) {
  //redirect home
  router.push('/')
}
</script>
