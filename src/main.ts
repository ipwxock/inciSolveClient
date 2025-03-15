import './assets/main.css'
import 'bootstrap/dist/css/bootstrap.min.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router/routes'

// Crea la aplicación y la monta en el elemento con id #app
const app = createApp(App)
app.use(router)
app.mount('#app')
