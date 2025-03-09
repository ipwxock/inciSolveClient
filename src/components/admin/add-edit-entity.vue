<template>
  <div class="container-fluid">
    <div
      class="row"
      v-if="
        entity === 'users' ||
        entity === 'companies' ||
        entity === 'insurances' ||
        entity === 'issues'
      "
    >
      <h1>{{ action + entityTranslated }}</h1>
      <div class="container p-5">
        <CreateEditCompanyAdmincomponent v-if="entity === 'companies'" />
        <CreateEditInsuranceAdmincomponent v-if="entity === 'insurances'" />
        <CreateEditIssueAdmincomponent v-if="entity === 'issues'" />
        <CreateEditUserAdmincomponent v-if="entity === 'users'" />
      </div>
    </div>
    <div v-else>
      <Error404 :entity="entityTranslated" />
    </div>
  </div>
</template>
<script lang="ts" setup>
import { useRoute } from 'vue-router'
import Error404 from '@/components/Errors/Error-404.vue'
import CreateEditCompanyAdmincomponent from './companies/createEditCompany-admincomponent.vue'
import CreateEditInsuranceAdmincomponent from './insurances/createEditInsurance-admincomponent.vue'
import CreateEditIssueAdmincomponent from './issues/createEditIssue-admincomponent.vue'
import CreateEditUserAdmincomponent from './users/createEditUser-admincomponent.vue'

const route = useRoute()
const entity = route.params.entity
const action = route.params.id ? 'Editar ' : 'Agregar '
const entityTranslated =
  entity === 'users'
    ? 'Usuarios'
    : entity === 'companies'
      ? 'Aseguradoras'
      : entity === 'insurances'
        ? 'Pólizas'
        : entity === 'issues'
          ? 'Incidencias'
          : ''
</script>
