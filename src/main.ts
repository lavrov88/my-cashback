import { createApp } from 'vue'

import { configurePrimeVue } from './config/primeVue'
import { registerComponents } from './config/components'
import { usePinia } from './config/pinia'
import { configureDayjs } from './config/dayjs'
import { configurePwaParameters } from './config/pwaTools'

import App from './App.vue'

// css, fonts
import '@fontsource/inter/400.css'  // Regular
import '@fontsource/inter/500.css'  // Medium
import '@fontsource/inter/600.css'  // SemiBold
import './style/style.css'

const app = createApp(App)

usePinia(app)
configurePrimeVue(app)
registerComponents(app)
configurePwaParameters()
configureDayjs()

app.mount('#app')
