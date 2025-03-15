/* Página de error 500 Muestra un mensaje de error cuando se produce un error interno en el
servidor. */
<template>
  <div class="container">
    <h1 class="text-center">Error 500</h1>
    <p class="text-center">
      Ha habido un error interno. Inténtelo de nuevo más tarde.
      <router-link to="/" class="text-decoration-none">Volver al inicio</router-link>
    </p>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped>
/* Estilos específicos de Error404Component */
</style>
