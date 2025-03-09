<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import Unauthorized403 from '@/components/Errors/Unauthorized-403.vue'

const userName = localStorage.getItem('username')
const showError403 = ref(false)
const queryParams = new URLSearchParams(window.location.search)

const handleError = () => {
  if (queryParams.get('error') === '403') {
    showError403.value = true
  }
}

onMounted(() => {
  handleError()
})
</script>

<template>
  <div class="container-fluid pt-5">
    <div class="row align-items-center pt-5">
      <h1 class="text-center">
        Hola,
        <strong>{{ userName }}</strong>
      </h1>
    </div>
    <div class="row">
      <p class="h3 text-center pt-5">
        Te damos la bienvenida a InciSolve.<br /><br />
        Aquí podrás encontrar información sobre tus diferentes pólizas de seguros, consultar
        información sobre las compañías aseguradoras, gestionar tus propias incidencias, y mucho
        más!
      </p>
    </div>
  </div>

  <div v-if="showError403" class="container-fluid">
    <Unauthorized403 />
  </div>
</template>

<style scoped>
h1 {
  margin-top: 20px;
  margin-bottom: 20px;
  font-size: 5rem;
}
strong {
  color: transparent;
  background: linear-gradient(90deg, rgb(0, 119, 255), rgb(255, 208, 0), rgb(33, 155, 60));
  -webkit-background-clip: text;
  background-clip: text;
}
</style>
