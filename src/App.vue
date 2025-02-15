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
