<template>
  <form>
    <div class="mb-3">
      <label for="name" class="form-label">Nombre</label>
      <input type="text" class="form-control" id="name" v-model="company.name" />
    </div>
    <div class="mb-3">
      <label for="email" class="form-label">Descripción</label>
      <input type="email" class="form-control" id="email" v-model="company.description" />
    </div>
    <button type="submit" class="btn btn-primary">Crear empresa</button>
  </form>
</template>

<script setup lang="ts">
import type { Company } from '@/types/Company.type'
import type { User } from '@/types/User.type'
import type { Employee } from '@/types/Employee.type'

const company: Company
const user: User
const employee: Employee
</script>
