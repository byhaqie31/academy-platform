import { readdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

// A campaign page is never linked from the site, so the prerenderer can never
// crawl its way to one. The file name is the slug (enforced by
// test/content/landings.spec.ts), so the directory listing is the route list.
const landingRoutes = readdirSync(fileURLToPath(new URL('./app/content/landings', import.meta.url)))
  .filter((f) => f.endsWith('.ts') && f !== 'index.ts')
  .map((f) => `/lp/${f.replace(/\.ts$/, '')}`)

/**
 * Rendering split.
 *
 * The public surfaces need real HTML, because link previews are built by
 * crawlers that never run JavaScript: a client-rendered route has nothing for
 * WhatsApp or Facebook to read, however correct its tags look in a browser.
 * So the app renders server-side and prerenders to static files.
 *
 * The portals opt back out. They are seeded-store screens behind a fake login
 * with nothing to preview and nothing to index, and rendering them twice buys
 * nothing. Note the direction: the inverse (`ssr: false` with routes opting
 * in) silently produces empty shells, so the opt-out is load-bearing.
 */
const spaRoutes = ['/admin/**', '/tutor/**', '/portal/**', '/demo', '/v1/**']

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-01-01',
  ssr: true,
  routeRules: Object.fromEntries(spaRoutes.map((route) => [route, { ssr: false }])),
  nitro: { prerender: { routes: landingRoutes } },
  devtools: { enabled: true },
  modules: ['@nuxt/ui', '@nuxt/fonts', '@pinia/nuxt'],
  css: ['~/assets/css/main.css'],
  components: [{ path: '~/components', pathPrefix: false }],
  typescript: { strict: true },
  fonts: {
    families: [
      { name: 'Plus Jakarta Sans', provider: 'google', weights: [400, 500, 600, 700, 800] },
      { name: 'Fredoka', provider: 'google', weights: [400, 500, 600, 700] },
    ],
  },
  app: {
    head: {
      htmlAttrs: { lang: 'en' },
      title: 'Hz Academy',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'apple-touch-icon', href: '/favicon.svg' },
      ],
    },
  },
})
