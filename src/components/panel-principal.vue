<script lang="ts" setup>
const userName = localStorage.getItem('username')
</script>

<template>
  <h1>Hola, {{ userName }}</h1>
</template>
