import { createApp } from 'vue'
import { registerSW } from 'virtual:pwa-register'

import { configurePrimeVue } from './config/primeVue'
import { registerComponents } from './config/components'
import { usePinia } from './config/pinia'

import App from './App.vue'
registerSW()

// css, fonts
import '@fontsource/inter/400.css'  // Regular
import '@fontsource/inter/500.css'  // Medium
import '@fontsource/inter/600.css'  // SemiBold
import './style/style.css'
import { configureDayjs } from './config/dayjs'

const app = createApp(App)

usePinia(app)
configurePrimeVue(app)
registerComponents(app)
configureDayjs()

app.mount('#app')
