import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Panel General',
    component: () => import('@/components/PanelPrincipal.vue'),
    meta: { requiresAuth: true, showInNavBar: true },
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/components/Login.vue'),
    meta: { requiresAuth: false, showInNavBar: false },
  },
  {
    path: '/insurances',
    name: 'Seguros',
    component: () => import('@/components/insurances/Insurances.vue'),
    meta: { requiresAuth: true, showInNavBar: true },
    children: [
      {
        path: 'add',
        name: 'Añadir Póliza',
        component: () => import('@/components/insurances/AddInsurance.vue'),
        meta: { requiresAuth: true, showInNavBar: false },
      },
    ],
  },
  {
    path: '/issues',
    name: 'Incidencias',
    component: () => import('@/components/issues/Issues.vue'),
    meta: { requiresAuth: true, showInNavBar: true },
    children: [
      {
        path: 'add',
        name: 'Añadir Incidencia',
        component: () => import('@/components/issues/AddIssue.vue'),
        meta: { requiresAuth: true, showInNavBar: false },
      },
    ],
  },
  {
    path: '/companies',
    name: 'Aseguradoras',
    component: () => import('@/components/companies/Companies.vue'),
    meta: { requiresAuth: true, showInNavBar: true },
    children: [
      {
        path: 'add',
        name: 'Añadir Aseguradora',
        component: () => import('@/components/companies/AddCompany.vue'),
        meta: { requiresAuth: true, showInNavBar: false },
      },
    ],
  },
  {
    path: '/employees',
    name: 'Empleados',
    component: () => import('@/components/employees/Employees.vue'),
    meta: { requiresAuth: true, showInNavBar: true },
    children: [
      {
        path: 'add',
        name: 'Añadir Empleado',
        component: () => import('@/components/employees/AddEmployee.vue'),
        meta: { requiresAuth: true, showInNavBar: false },
      },
    ],
  },
  {
    path: '/customers',
    name: 'Clientes',
    component: () => import('@/components/customers/Customers-Component.vue'),
    meta: { requiresAuth: true, showInNavBar: true },
    children: [
      {
        path: '',
        name: 'Mis Clientes',
        component: () => import('@/components/customers/Customers-General.vue'),
        meta: { requiresAuth: true, showInNavBar: false },
      },
      {
        path: ':id',
        name: 'Detalle Cliente',
        component: () => import('@/components/customers/Customer-Detail.vue'),
        meta: { requiresAuth: true, showInNavBar: false },
      },
      {
        path: 'new',
        name: 'Añadir Cliente',
        component: () => import('@/components/customers/Add-Customer.vue'),
        meta: { requiresAuth: true, showInNavBar: false },
      },
    ],
  },
  {
    path: '/admin-panel',
    name: 'Panel de Administración',
    component: () => import('@/components/AdminPanel.vue'),
    meta: { requiresAuth: true, requiresAdmin: true, showInNavBar: true },
    children: [
      // {
      //   path: 'users',
      //   name: 'Usuarios',
      //   component: () => import('@/components/admin/AdminUsers.vue'),
      //   meta: { requiresAuth: true, requiresAdmin: true, showInNavBar: false },
      // },
      // {
      //   path: 'companies',
      //   name: 'Aseguradoras',
      //   component: () => import('@/components/admin/AdminCompanies.vue'),
      //   meta: { requiresAuth: true, requiresAdmin: true, showInNavBar: false },
      // },
      // {
      //   path: 'insurances',
      //   name: 'Pólizas',
      //   component: () => import('@/components/admin/AdminInsurances.vue'),
      //   meta: { requiresAuth: true, requiresAdmin: true, showInNavBar: false },
      // },
      // {
      //   path: 'issues',
      //   name: 'Incidencias',
      //   component: () => import('@/components/admin/AdminIssues.vue'),
      //   meta: { requiresAuth: true, requiresAdmin: true, showInNavBar: false },
      // },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// Redirigir si no hay autenticación
router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem('auth_token')

  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login') // Redirige al login
  } else {
    next()
  }
})

export default router
