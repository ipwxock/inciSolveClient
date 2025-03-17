/* Este componente es una vista que se encarga de agregar un cliente. Se importa el componente
CreateEditCustomer que es el encargado de mostrar el formulario para agregar o editar un cliente. */
*/
<template>
  <div class="container">
    <h1 class="pb-5">Agregar cliente</h1>

    <CreateEditCustomer />
  </div>
</template>

<script lang="ts" setup>
import CreateEditCustomer from '@/components/customers/create-edit-customer.vue'
</script>

<style scoped>
/* Estilos personalizados si es necesario */
</style>
