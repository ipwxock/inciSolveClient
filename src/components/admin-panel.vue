<template>
  <div class="container-fluid pt-1">
    <div class="row pb-5">
      <h1 class="h1 pb-2 text-center"><strong>Panel de Administración</strong></h1>
      <p class="text-center">
        Desde aquí, un Administrador puede gestionar las diferentes entidades de la aplicación.
      </p>
      <div class="col-6 col-md-3 pb-2">
        <router-link to="/admin-panel/users" class="btn btn-primary w-100"> Usuarios </router-link>
      </div>

      <div class="col-6 col-md-3 pb-2">
        <router-link to="/admin-panel/companies" class="btn btn-primary w-100">
          Aseguradoras
        </router-link>
      </div>
      <div class="col-6 col-md-3 pb-2">
        <router-link to="/admin-panel/insurances" class="btn btn-primary w-100">
          Pólizas
        </router-link>
      </div>
      <div class="col-6 col-md-3 pb-2">
        <router-link to="/admin-panel/issues" class="btn btn-primary w-100">
          Incidencias
        </router-link>
      </div>
    </div>
  </div>

  <router-view></router-view>
</template>
