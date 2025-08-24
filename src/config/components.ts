import type { App } from "vue"

import AppConfirmDialog from "../components/Dialogs/AppConfirmDialog.vue"

export const registerComponents = (app: App) => {
  app.component('AppConfirmDialog', AppConfirmDialog)
}