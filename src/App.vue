/* Componente principal de la aplicación Se encarga de renderizar el componente NavBar si no se
encuentra en la ruta de login De lo contrario renderiza el componente LoginPage */
<template>
  <NavBar v-if="showNavBar" />
  <LoginPage v-else />
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import NavBar from './components/navbar-comp.vue'
import LoginPage from './components/login-component.vue'

const route = useRoute()
const showNavBar = computed(() => route.path !== '/login')
</script>
