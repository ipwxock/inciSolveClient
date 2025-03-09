import { HttpService } from '@/services/httpService'
import { createRouter, createWebHistory } from 'vue-router'
import type { RoleResponse } from '@/types/Responses.type'

const routes = [
  {
    path: '/',
    name: 'Panel General',
    component: () => import('@/components/panel-principal.vue'),
    meta: { requiresAuth: true, showInNavBar: true },
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/components/login-component.vue'),
    meta: { requiresAuth: false, showInNavBar: false },
  },
  {
    path: '/insurances',
    name: 'Pólizas',
    component: () => import('@/components/insurances/insurances-component.vue'),
    meta: {
      requiresAuth: true,
      showInNavBar: true,
    },
    children: [
      {
        path: '',
        name: 'General Pólizas',
        component: () => import('@/components/insurances/insurances-general.vue'),
        meta: {
          requiresAuth: true,
          showInNavBar: false,
        },
      },
      {
        path: 'new',
        name: 'Añadir Póliza',
        component: () => import('@/components/insurances/add-insurance.vue'),
        meta: {
          requiresAuth: true,
          showInNavBar: false,
        },
      },
      {
        path: ':id/see',
        name: 'Detalle Póliza',
        component: () => import('@/components/insurances/insurance-detail.vue'),
        meta: {
          requiresAuth: true,
          showInNavBar: false,
        },
      },
    ],
  },
  {
    path: '/issues',
    name: 'Incidencias',
    component: () => import('@/components/issues/issues-component.vue'),
    meta: {
      requiresAuth: true,
      showInNavBar: true,
    },
    children: [
      {
        path: 'new',
        name: 'Añadir Incidencia',
        component: () => import('@/components/issues/add-issue.vue'),
        meta: {
          requiresAuth: true,
          showInNavBar: false,
        },
      },
      {
        path: '',
        name: 'General Incidencias',
        component: () => import('@/components/issues/issues-general.vue'),
        meta: {
          requiresAuth: true,
          showInNavBar: false,
        },
      },
      {
        path: ':id/see',
        name: 'Detalle Incidencia',
        component: () => import('@/components/issues/issue-detail.vue'),
        meta: {
          requiresAuth: true,
          showInNavBar: false,
        },
      },
    ],
  },
  {
    path: '/companies',
    name: 'Aseguradoras',
    component: () => import('@/components/companies/companies-component.vue'),
    meta: {
      requiresAuth: true,
      showInNavBar: true,
    },
    children: [
      {
        path: '',
        name: 'General Aseguradoras',
        component: () => import('@/components/companies/companies-general.vue'),
        meta: {
          requiresAuth: true,
          showInNavBar: false,
        },
      },
      {
        path: ':id/see',
        name: 'Detalle Aseguradora',
        component: () => import('@/components/companies/company-detail.vue'),
        meta: { requiresAuth: true, showInNavBar: false },
      },
    ],
  },
  {
    path: '/employees',
    name: 'Empleados',
    component: () => import('@/components/employees/employees-component.vue'),
    meta: { requiresAuth: true, showInNavBar: true },
    children: [
      {
        path: '',
        name: 'Mis Empleados',
        component: () => import('@/components/employees/employees-general.vue'),
        meta: { requiresAuth: true, showInNavBar: false },
      },
      {
        path: ':id',
        name: 'Detalle Empleado',
        component: () => import('@/components/employees/employee-detail.vue'),
        meta: { requiresAuth: true, showInNavBar: false },
      },
      {
        path: 'new',
        name: 'Añadir Empleado',
        component: () => import('@/components/employees/add-employee.vue'),
        meta: { requiresAuth: true, showInNavBar: false },
      },
    ],
  },
  {
    path: '/customers',
    name: 'Clientes',
    component: () => import('@/components/customers/customers-component.vue'),
    meta: { requiresAuth: true, showInNavBar: true },
    children: [
      {
        path: '',
        name: 'Mis Clientes',
        component: () => import('@/components/customers/customers-general.vue'),
        meta: { requiresAuth: true, showInNavBar: false },
      },
      {
        path: ':id',
        name: 'Detalle Cliente',
        component: () => import('@/components/customers/customer-detail.vue'),
        meta: { requiresAuth: true, showInNavBar: false },
      },
      {
        path: 'new',
        name: 'Añadir Cliente',
        component: () => import('@/components/customers/add-customer.vue'),
        meta: { requiresAuth: true, showInNavBar: false },
      },
    ],
  },
  {
    path: '/admin-panel',
    name: 'Panel de Administración',
    component: () => import('@/components/admin-panel.vue'),
    meta: { requiresAuth: true, requiresAdmin: true, showInNavBar: true },
    children: [
      {
        path: 'users',
        name: 'Usuarios',
        component: () => import('@/components/admin/users/user-admincomponent.vue'),
        meta: { requiresAuth: true, requiresAdmin: true, showInNavBar: false },
      },
      {
        path: 'companies',
        name: 'Aseguradoras Admin',
        component: () => import('@/components/admin/companies/company-admincomponent.vue'),
        meta: { requiresAuth: true, requiresAdmin: true, showInNavBar: false },
      },
      {
        path: 'insurances',
        name: 'Pólizas Admin',
        component: () => import('@/components/admin/insurances/insurance-admincomponent.vue'),
        meta: { requiresAuth: true, requiresAdmin: true, showInNavBar: false },
      },
      {
        path: 'issues',
        name: 'Incidencias Admin',
        component: () => import('@/components/admin/issues/issue-admincomponent.vue'),
        meta: { requiresAuth: true, requiresAdmin: true, showInNavBar: false },
      },
      {
        path: ':entity/new',
        name: 'Añadir Entidad',
        component: () => import('@/components/admin/add-edit-entity.vue'),
        meta: { requiresAuth: true, requiresAdmin: true, showInNavBar: false },
      },
      {
        path: ':entity/:id',
        name: 'Detalle Entidad',
        component: () => import('@/components/admin/add-edit-entity.vue'),
        meta: { requiresAuth: true, requiresAdmin: true, showInNavBar: false },
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// Función para verificar el rol con el backend
// const roleCheck = async () => {
//   const userRole = localStorage.getItem('role')
//   if (!userRole) return false

//   const httpService = new HttpService()

//   try {
//     const response = await httpService.get<RoleResponse>('role-check')

//     if (response.status === 200 && response.data?.role === userRole) {
//       return true
//     }

//     // Si la respuesta no coincide, limpiar el localStorage
//     localStorage.removeItem('auth_token')
//     localStorage.removeItem('username')
//     localStorage.removeItem('role')
//     return false
//   } catch (e) {
//     // En caso de error, también limpiar el localStorage
//     localStorage.removeItem('auth_token')
//     localStorage.removeItem('username')
//     localStorage.removeItem('role')
//     return false
//   }
// }

// Redirigir si no hay autenticación o si el rol es inválido
// router.beforeEach(async (to, from, next) => {
//   const isAuthenticated = localStorage.getItem('auth_token')

//   if (to.path === '/' && !isAuthenticated) {
//     next('/login')
//   }

//   if (!isAuthenticated && to.path !== '/login') {
//     next('/login?error=401') // Solo redirigir si NO estamos ya en /login
//   } else {
//     if (isAuthenticated) {
//       const isValidRole = await roleCheck()
//       if (!isValidRole) {
//         next('/login?error=401') // Redirige si el rol fue manipulado
//         return
//       }
//     }

//     if (isAuthenticated && to.path === '/login') {
//       next('/') // Si ya está autenticado, no debería ir al login, mejor redirigir al home
//     } else {
//       if (to.meta.roles && Array.isArray(to.meta.roles)) {
//         const userRole = localStorage.getItem('role')
//         if (!to.meta.roles.includes(userRole)) {
//           next('/?error=403') // Redirige a la página principal si el rol no es válido
//         } else {
//           next()
//         }
//       } else {
//         next()
//       }
//     }
//   }
// })

export default router
