<template>
  <div class="container-fluid">
    <div class="row w-100 align-items-end">
      <div class="col-6 text-start">
        <h1>
          Incidencias
          <i class="fa-solid fa-handshake"></i>
        </h1>
      </div>
      <div
        v-if="!router.currentRoute.value.path.includes('issues/new') && userRole === 'Cliente'"
        class="col-6 text-end"
      >
        <router-link to="/issues/new" class="btn btn-primary w-100">
          + Nueva Incidencia
        </router-link>
      </div>
    </div>
  </div>

  <div class="mt-4 mx-0">
    <router-view />
  </div>
</template>

<script setup lang="ts">
import router from '@/router/routes'

const userRole = localStorage.getItem('role')
</script>
