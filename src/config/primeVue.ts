import type { App } from "vue"
import PrimeVue from 'primevue/config'

// theme
import ThemePreset from './primeVueThemePreset'

// components
import Avatar from 'primevue/avatar'
import Button from 'primevue/button'
import ButtonGroup from "primevue/buttongroup"
import Card from 'primevue/card'
import ConfirmDialog from 'primevue/confirmdialog'
import DatePicker from 'primevue/datepicker';
import Dialog from 'primevue/dialog'
import Divider from 'primevue/divider'
import Drawer from 'primevue/drawer'
import InputNumber from 'primevue/inputnumber'
import InputText from 'primevue/inputtext'
import Listbox from 'primevue/listbox'
import Menu from 'primevue/menu'
import RadioButton from 'primevue/radiobutton';
import Select from 'primevue/select';
import SplitButton from 'primevue/splitbutton';
import Toolbar from 'primevue/toolbar'

// directives
import Ripple from 'primevue/ripple'

// services
import ConfirmationService from 'primevue/confirmationservice'

// icons
import 'primeicons/primeicons.css'

export const configurePrimeVue = (app: App) => {
  app.use(PrimeVue, {
    theme: {
      preset: ThemePreset,
      options: {
        prefix: 'p',
        darkModeSelector: 'system',
        cssLayer: false
      }
    },
    locale: {
      monthNamesShort: ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'],
    },
    ripple: true
  })

  // primevue components
  app.component('Avatar', Avatar)
  app.component('Button', Button)
  app.component('ButtonGroup', ButtonGroup)
  app.component('Card', Card)
  app.component('ConfirmDialog', ConfirmDialog)
  app.component('DatePicker', DatePicker)
  app.component('Dialog', Dialog)
  app.component('Divider', Divider)
  app.component('Drawer', Drawer)
  app.component('InputNumber', InputNumber)
  app.component('InputText', InputText)
  app.component('Listbox', Listbox)
  app.component('Menu', Menu)
  app.component('RadioButton', RadioButton)
  app.component('Select', Select)
  app.component('SplitButton', SplitButton)
  app.component('Toolbar', Toolbar)

  // directives
  app.directive('ripple', Ripple)

  // services
  app.use(ConfirmationService)
}