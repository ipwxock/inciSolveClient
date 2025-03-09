<template>
  <div class="container">
    <h1 class="text-center">Error 404</h1>
    <p v-if="entity" class="text-center">
      La página que buscas para <strong>{{ entity }}</strong> no existe.
      <router-link to="/" class="text-decoration-none">Volver al inicio</router-link>
    </p>
    <p v-else class="text-center">
      La página que buscas no existe.
      <router-link to="/" class="text-decoration-none">Volver al inicio</router-link>
    </p>
  </div>
</template>

<script setup lang="ts">
// Definimos los props que acepta el componente
defineProps({
  entity: {
    type: String,
    required: false,
  },
})
</script>
