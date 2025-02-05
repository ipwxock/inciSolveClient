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
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const email = ref('')
const password = ref('')
const router = useRouter()

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
      alert('Credenciales incorrectas')
    }
  } catch (error) {
    console.log(error)
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
