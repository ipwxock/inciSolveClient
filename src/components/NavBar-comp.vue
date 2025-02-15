<script setup lang="ts">
import router from '@/router/routes'
import { ref } from 'vue'
import { RouterView } from 'vue-router'
import { HttpService } from '@/services/httpService'
import { computed } from 'vue'
import Error500 from '@/components/Errors/Error-500.vue'

const routes = router.getRoutes()
const httpService = new HttpService()
const userRole = localStorage.getItem('role')
const show500Error = ref(false)

async function logout() {
  try {
    const response = await httpService.post('logout', {})
    if (response.status == 200) {
      localStorage.removeItem('auth_token')
      localStorage.removeItem('role')
      router.push('/login')
    } else {
      //Load error page
      show500Error.value = true
    }
  } catch (error: unknown) {
    console.error('Error during logout:', error)
  }
}

// Filtrar rutas que deben aparecer en el navbar
const navbarRoutes = computed(() => routes.filter((route) => route.meta?.showInNavBar))
</script>

<template>
  <!--Create a navBar with bootstrap-->
  <nav class="navbar navbar-expand-lg navbar-light bg-light">
    <div class="container-fluid nav-wrapper">
      <a class="display-6 p-2 py-4 rounded text-decoration-none fw-bold" href="/">InciSolve</a>
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse justify-content-lg-between" id="navbarNav">
        <ul v-if="userRole !== 'Admin'" class="navbar-nav ms-auto">
          <li class="nav-item" v-for="route in navbarRoutes" :key="route.path">
            <router-link
              v-if="
                !route.path.includes('login') &&
                !(userRole == 'Cliente' && route.path.includes('Customers')) &&
                !(userRole !== 'Admin' && route.path.includes('admin'))
              "
              :to="
                route.path.includes(':id')
                  ? route.path.substring(0, route.path.lastIndexOf('/:id'))
                  : route.path
              "
              class="nav-link cursor-pointer p-2 rounded py-sm-3"
              active-class="active-link"
            >
              {{ route.name }}
            </router-link>
          </li>
        </ul>
        <ul v-else class="navbar-nav ms-auto">
          <li class="nav-item">
            <router-link
              to="/admin"
              class="nav-link cursor-pointer p-2 rounded"
              active-class="active-link"
            >
              Panel de Administración
            </router-link>
          </li>
        </ul>
        <a class="btn btn-primary mt-3 mt-lg-0 px-4 px-lg-5" @click="logout">Salir</a>
      </div>
    </div>
  </nav>
  <main v-if="!show500Error" class="content">
    <RouterView />
  </main>
  <main v-else>
    <Error500 />
  </main>
</template>

<style scoped>
main {
  display: flex;
  flex-direction: column;
  margin-top: 2rem;
  width: 88vw;
  overflow-y: scroll;
}

.active-link {
  font-weight: bolder;
}

@media (min-width: 1023px) {
  nav {
    display: flex;
    flex-direction: column;
    justify-content: start;
    width: 200px;
    font-size: 1.5rem;
    max-height: 100vh;
    overflow-y: hidden;
  }

  .nav-wrapper {
    display: flex;
    flex-direction: column;
    justify-content: start;
    > a {
      padding: 2rem;
      color: #379bff;
    }
  }

  #navbarNav {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    height: 88vh;
  }

  .navbar-nav {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .router-link-active {
    background-color: #7fbfff;
    font-weight: bold;
  }
}
</style>
