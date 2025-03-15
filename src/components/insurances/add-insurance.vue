/* Componente para agregar una nueva póliza Renderiza el componente create-edit-insurance para crear
o editar una póliza */
<template>
  <div class="container">
    <div class="row">
      <div class="col-12">
        <h1 class="pb-5">Crear Póliza</h1>
        <div class="container-fluid">
          <createEditInsurance />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import createEditInsurance from './create-edit-insurance.vue'
</script>
