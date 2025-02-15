import { createRouter, createWebHistory } from 'vue-router'

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
    meta: { requiresAuth: true, showInNavBar: true },
    children: [
      {
        path: '',
        name: 'General Pólizas',
        component: () => import('@/components/insurances/insurances-general.vue'),
        meta: { requiresAuth: true, showInNavBar: false },
      },
      {
        path: 'new',
        name: 'Añadir Póliza',
        component: () => import('@/components/insurances/add-insurance.vue'),
        meta: { requiresAuth: true, showInNavBar: false },
      },
      {
        path: ':id/see',
        name: 'Detalle Póliza',
        component: () => import('@/components/insurances/insurance-detail.vue'),
        meta: { requiresAuth: true, showInNavBar: false },
      },
    ],
  },
  {
    path: '/issues',
    name: 'Incidencias',
    component: () => import('@/components/issues/issues-component.vue'),
    meta: { requiresAuth: true, showInNavBar: true },
    children: [
      {
        path: 'new',
        name: 'Añadir Incidencia',
        component: () => import('@/components/issues/add-issue.vue'),
        meta: { requiresAuth: true, showInNavBar: false },
      },
    ],
  },
  {
    path: '/companies',
    name: 'Aseguradoras',
    component: () => import('@/components/companies/companies-component.vue'),
    meta: { requiresAuth: true, showInNavBar: true },
    children: [
      {
        path: '',
        name: 'General Aseguradoras',
        component: () => import('@/components/companies/companies-general.vue'),
        meta: {
          requiresAuth: true,
          showInNavBar: false,
          roles: ['Admin', 'Manager', 'Empleado', 'Cliente'],
        },
      },
      {
        path: ':id/see',
        name: 'Detalle Aseguradora',
        component: () => import('@/components/companies/company-detail.vue'),
        meta: { requiresAuth: true, showInNavBar: false, roles: ['Manager'] },
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
        meta: { requiresAuth: true, showInNavBar: false, roles: ['Manager'] },
      },
      {
        path: ':id',
        name: 'Detalle Empleado',
        component: () => import('@/components/employees/employee-detail.vue'),
        meta: { requiresAuth: true, showInNavBar: false, roles: ['Manager'] },
      },
      {
        path: 'new',
        name: 'Añadir Empleado',
        component: () => import('@/components/employees/add-employee.vue'),
        meta: { requiresAuth: true, showInNavBar: false, roles: ['Admin', 'Manager'] },
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
        meta: { requiresAuth: true, showInNavBar: false, roles: ['Manager', 'Empleado'] },
      },
      {
        path: ':id',
        name: 'Detalle Cliente',
        component: () => import('@/components/customers/customer-detail.vue'),
        meta: { requiresAuth: true, showInNavBar: false, roles: ['Admin', 'Manager', 'Empleado'] },
      },
      {
        path: 'new',
        name: 'Añadir Cliente',
        component: () => import('@/components/customers/add-customer.vue'),
        meta: { requiresAuth: true, showInNavBar: false, roles: ['Manager', 'Empleado'] },
      },
    ],
  },
  {
    path: '/admin-panel',
    name: 'Panel de Administración',
    component: () => import('@/components/admin-panel.vue'),
    meta: { requiresAuth: true, requiresAdmin: true, showInNavBar: true, roles: ['Admin'] },
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
