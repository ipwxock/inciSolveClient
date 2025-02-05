<template>
  <div class="container-fluid">
    <div class="row w-100 align-items-end">
      <div class="col-6 text-start">
        <h1>Clientes<i class="fa-sharp fa-solid fa-user"></i></h1>
      </div>
      <div class="col-6 text-end">
        <router-link to="/customers/new" class="btn btn-primary w-100">
          + Nuevo Cliente
        </router-link>
      </div>
    </div>
  </div>

  <div class="mt-4">
    <router-view />
  </div>
</template>

<script setup lang="ts"></script>
