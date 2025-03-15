/* Componente padre que contiene la vista de la sección de clientes. */
<template>
  <div class="container-fluid">
    <div class="row w-100 align-items-end">
      <div class="col-6 text-start">
        <h1>Clientes<i class="fa-sharp fa-solid fa-user"></i></h1>
      </div>
      <div v-if="!router.currentRoute.value.path.includes('customers/new')" class="col-6 text-end">
        <router-link to="/customers/new" class="btn btn-primary w-100">
          + Nuevo Cliente
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
