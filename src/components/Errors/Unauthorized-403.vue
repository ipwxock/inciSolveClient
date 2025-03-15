/* Este componente se encarga de mostrar un mensaje de error cuando un usuario intenta acceder a una
página sin tener los permisos necesarios. Recibe un mensaje opcional que se mostrará en la pantalla.
Al hacer clic en el botón de "Volver al inicio", se redirige al usuario a la página principal. */
<template>
  <div class="text-center">
    <h1>Acceso Denegado</h1>
    <p>No tienes permiso para ver esta página.</p>
    <p v-if="message">{{ message }}</p>
    <a class="btn btn-primary" @click="reloadMainPanel()">Volver al inicio</a>
  </div>
</template>

<script setup lang="ts">
/**
 * Propiedad que indica el mensaje de error que se mostrará en la pantalla.
 * @type {string}
 * @default ''
 */
defineProps({
  message: {
    type: String,
    required: false,
  },
})

const reloadMainPanel = () => {
  window.location.href = '/'
}
</script>
