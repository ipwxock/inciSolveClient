/* Componente que contiene la vista de la lista de empleados de una aseguradora concreta y el botón
para agregar un nuevo empleado a la plataforma. */
<template>
  <div class="container-fluid">
    <div class="row w-100 align-items-end">
      <div class="col-6 text-start">
        <h1>Empleados<i class="fa-sharp fa-solid fa-user"></i></h1>
      </div>
      <div v-if="!router.currentRoute.value.path.includes('employees/new')" class="col-6 text-end">
        <router-link to="/employees/new" class="btn btn-primary w-100">
          + Nuevo Empleado
        </router-link>
      </div>
    </div>
  </div>

  <div class="mt-4">
    <router-view />
  </div>
</template>

<script setup lang="ts">
import router from '@/router/routes'
</script>
