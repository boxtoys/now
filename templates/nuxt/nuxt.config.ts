// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  $production: {
    app: {
      cdnURL: '/'
    }
  },
  css: ['~/assets/css/reset.css'],
  app: {
    head: {
      charset: 'utf-8',
      title: 'Nuxt Starter',
      viewport: 'width=device-width, initial-scale=1',
      meta: [
        { name: 'renderer', content: 'webkit' },
        { 'http-equiv': 'X-UA-Compatible', content: 'IE=edge' }
      ]
    }
  },
  typescript: {
    shim: false
  },
  modules: [
    [
      '@nuxtjs/i18n',
      {
        vueI18n: './i18n.config.ts'
      }
    ]
  ]
})
