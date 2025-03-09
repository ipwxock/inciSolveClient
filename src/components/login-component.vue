<template>
  <div class="container-fluid container-host m-0 p-0">
    <div
      class="row login-container justify-content-center align-items-center w-100 h-100 img-container"
    >
      <div
        class="col-12 col-lg-5 align-items-center align-content-center justify-content-around bg-light p-5 text-center h-100"
      >
        <div class="container">
          <div class="row w-100 justify-content-center">
            <div class="col-10">
              <h1>Iniciar Sesión</h1>
              <img src="@/assets/logo_incisolve.jpg" id="incisolve-logo" alt="Logo" />
              <div v-if="errorMessage.length > 0" class="alert alert-danger mt-3" role="alert">
                {{ errorMessage }}
              </div>
              <form @submit.prevent="handleLogin">
                <div class="form-group g-3 text-start">
                  <label for="email">Email</label>
                  <input type="email" id="email" class="form-control" v-model="email" required />
                </div>
                <div class="form-group g-3 text-start py-2">
                  <label for="password">Contraseña</label>
                  <input
                    type="password"
                    id="password"
                    class="form-control"
                    v-model="password"
                    required
                  />
                </div>
                <button type="submit" class="btn btn-primary w-100">Iniciar Sesión</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

const email = ref('')
const password = ref('')
const router = useRouter()
const queryParams = new URLSearchParams(window.location.search)
const errorMessage = ref('')

const handleError = () => {
  if (queryParams.get('error') === '401') {
    errorMessage.value = 'Su sesión ha caducado. Por favor, inicie sesión nuevamente.'
  }
}

onMounted(() => {
  handleError()
})

const handleLogin = async () => {
  try {
    // Llamada a tu API para autenticar
    const response = await fetch(import.meta.env.VITE_API_URL + 'login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: email.value,
        password: password.value,
        device_name: 'web_client',
      }),
    })

    const data = await response.json()

    if (data.access_token) {
      localStorage.setItem('auth_token', data.access_token) // Guarda el token

      if (data.role) {
        localStorage.setItem('role', data.role) // Guarda el rol del usuario
      }

      if (data.username) {
        localStorage.setItem('username', data.username) // Guarda el nombre del usuario
      }

      router.push('/') // Redirige al dashboard o página protegida
    } else {
      errorMessage.value = data.message
    }
  } catch (error) {
    console.log(error)
    errorMessage.value = 'No se pudo realizar el login. Inténtelo de nuevo más tarde.'
  }
}
</script>

<style scoped>
#incisolve-logo {
  border-radius: 50%;
  width: 200px;
  height: 200px;
}

@media (min-width: 1000px) {
  .img-container {
    background: linear-gradient(to right, #0056b3, #379bff);
  }
}

.container-host {
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

button:hover {
  background-color: #0056b3;
}
</style>
