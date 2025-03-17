/* Componente que contiene el navbar de la aplicación, el cual se compone de un menú de navegación y
un botón de logout. El menú de navegación se compone de las rutas que se encuentran en el archivo
routes.ts, las cuales se filtran dependiendo del rol del usuario. El botón de logout se encarga de
cerrar la sesión del usuario y redirigirlo a la página de login. */

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
      <div class="collapse navbar-collapse w-100 justify-content-lg-between" id="navbarNav">
        <ul v-if="userRole !== 'Admin'" class="navbar-nav w-100 ms-auto">
          <li
            class="nav-item"
            v-for="route in navbarRoutes"
            :key="route.path"
            :class="{
              'd-none': !(
                route.meta.showInNavBar && (route.meta.roles as string[]).includes(userRole!)
              ),
            }"
          >
            <router-link
              v-if="route.meta.showInNavBar && (route.meta.roles as string[]).includes(userRole!)"
              :to="route.path"
              class="nav-link cursor-pointer p-2 w-100 rounded py-sm-3"
              active-class="active-link"
            >
              {{ route.name }}
            </router-link>
          </li>
        </ul>
        <ul v-else class="navbar-nav ms-auto">
          <li class="nav-item">
            <router-link
              to="/admin-panel"
              class="nav-link cursor-pointer p-2 rounded"
              active-class="active-link"
            >
              Panel de Administración
            </router-link>
          </li>
        </ul>
        <a class="btn btn-primary mt-3 mt-lg-0 px-4 px-lg-5" id="logout-btn" @click="logout"
          >Salir</a
        >
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

<script setup lang="ts">
import router from '@/router/routes'
import { RouterView } from 'vue-router'
import { HttpService } from '@/services/httpService'
import { computed, ref } from 'vue'
import Error500 from '@/components/Errors/Error-500.vue'

const routes = router.getRoutes()
const httpService = new HttpService()
const userRole = localStorage.getItem('role')
const show500Error = ref(false)

/**
 * Función que se encarga de cerrar la sesión del usuario y redirigirlo a la página de login.
 */
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

<style scoped>
main {
  display: flex;
  flex-direction: column;
  margin-top: 2rem;
  width: 100vw;
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
      font-size: 2.3rem;
      padding: 2rem;
      color: #379bff;
    }
  }

  .nav-item {
    display: flex;
    font-size: 1.3rem;
  }

  main {
    width: calc(100vw - 200px);
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

  .active-link {
    font-weight: bold;
  }
}
</style>
