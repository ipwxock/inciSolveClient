<template>
  <div class="text-center">
    <h1>Acceso Denegado</h1>
    <p>No tienes permiso para ver esta página.</p>
    <p v-if="message">{{ message }}</p>
    <router-link to="/">Volver al inicio</router-link>
  </div>
</template>

<script setup lang="ts">
defineProps({
  message: {
    type: String,
    required: false,
  },
})
</script>
