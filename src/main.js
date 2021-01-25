import { createApp } from 'vue'
import App from './App.vue'
import Icon from './components/Icon'

createApp(App)
  .component('Icon', Icon)
  .mount('#app')
