<template>
  <div class="container-fluid">
    <div class="row w-100 align-items-end">
      <div class="col-6 text-start">
        <h1>Aseguradoras &nbsp;<i class="fa-sharp fa-solid fa-building"></i></h1>
      </div>
      <div
        v-if="
          userRole === 'Manager' &&
          companyId !== null &&
          !router.currentRoute.value.path.includes('/see')
        "
        class="col-6"
      >
        <a :href="editCompanyUrl" class="btn btn-primary mt-3 w-100"> Gestionar mi Aseguradora </a>
      </div>
    </div>
  </div>
  <div class="mt-4">
    <router-view />
  </div>
</template>

<script setup lang="ts">
import router from '@/router/routes'
import { HttpService } from '@/services/httpService'
import { onMounted, ref } from 'vue'

const httpService = new HttpService()
const userRole = localStorage.getItem('role')
const companyId = ref<number | null>(null)
const editCompanyUrl = ref<string>('')

onMounted(() => {
  if (userRole === 'Manager') {
    fetchCompanyId()
  }
})

const fetchCompanyId = async () => {
  try {
    const response = await httpService.get<number>('get-my-company-id')
    companyId.value = response.data ?? null

    if (companyId.value !== null) {
      editCompanyUrl.value = `companies/${companyId.value}/see`
    }
  } catch (error) {
    companyId.value = null
  }
}
</script>
