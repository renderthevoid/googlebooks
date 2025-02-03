import './assets/main.css'
import 'primeicons/primeicons.css'

import { createPinia } from 'pinia'
import { createApp } from 'vue'

import Aura from '@primevue/themes/aura'
import PrimeVue from 'primevue/config'
import Tooltip from 'primevue/tooltip';

import infiniteScroll from "@/directives/infiniteScroll";

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(PrimeVue, {
  theme: {
    preset: Aura,
    options: {
      darkModeSelector: '.dark',
      cssLayer: {
        name: 'primevue',
        order: 'tailwind-base, primevue',
      },
    },
  },
})
app.directive('tooltip', Tooltip);
app.directive("infinite-scroll", infiniteScroll);


app.mount('#app')
