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

<style>
td {
  vertical-align: middle;
}

.open-issue-indicator {
  border-radius: 50%;
  background-color: #07f;
  height: 1.5rem;
  width: 1.5rem;
}
.pending-issue-indicator {
  border-radius: 50%;
  background-color: rgb(255, 208, 0);
  height: 1.5rem;
  width: 1.5rem;
}
.closed-issue-indicator {
  border-radius: 50%;
  background-color: rgb(33, 155, 60);
  height: 1.5rem;
  width: 1.5rem;
}

.open-issue {
  background-color: #07f;
}
.pending-issue {
  background-color: rgb(255, 208, 0);
}
.closed-issue {
  background-color: rgb(33, 155, 60);
}
</style>
