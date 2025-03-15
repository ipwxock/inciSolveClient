/* Este componente se encarga de mostrar un formulario para agregar un nuevo empleado a la
plataforma. Se muestra un formulario con los campos necesarios para agregar un nuevo empleado. Al
hacer clic en el botón de "Agregar", se envía la información del formulario al servidor para agregar
el empleado. */
<template>
  <div class="container">
    <div class="row">
      <div class="col-10">
        <h1 class="pb-5">Agregar Empleado</h1>
        <createEditEmployee />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import createEditEmployee from './create-edit-employee.vue'
</script>
