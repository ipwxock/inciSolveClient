/* Componente que contiene la vista de las pólizas, en el cual se muestra un título y un botón para
agregar una nueva póliza, además de mostrar el componente hijo que contiene la tabla con las
pólizas. Se importa el router para poder redirigir a la vista de creación de pólizas y se obtiene el
rol del usuario para mostrar el botón de agregar póliza solo si el usuario no es un cliente. */

<template>
  <div class="container-fluid">
    <div class="row w-100 align-items-end">
      <div class="col-6 text-start">
        <h1>
          Pólizas
          <i class="fa-solid fa-handshake"></i>
        </h1>
      </div>
      <div
        v-if="!router.currentRoute.value.path.includes('insurances/new') && userRole !== 'Cliente'"
        class="col-6 text-end"
      >
        <router-link to="/insurances/new" class="btn btn-primary w-100">
          + Nueva Póliza
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
