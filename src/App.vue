<template>
  <NavBar v-if="showNavBar" />
  <LoginPage v-else />
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import NavBar from './components/NavBar-comp.vue'
import LoginPage from './components/Login.vue'

const route = useRoute()
const showNavBar = computed(() => route.path !== '/login')
</script>
