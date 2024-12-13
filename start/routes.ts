import router from '@adonisjs/core/services/router'
import AutoSwagger from 'adonis-autoswagger'
import swagger from '#config/swagger'
import { middleware } from '#start/kernel'

const HealthController = () => import('#controllers/health_controller')

/**
 * Cette route est utilisée pour tester le fonctionnement de base de l'application.
 */
router.get('/', async (): Promise<{ hello: string }> => {
  return {
    hello: 'world',
  }
})

/**
 * Vérifie l'état de santé de l'application
 */
router.get('/health', [HealthController]).use(middleware.health())

/**
 * Swagger YAML output
 */
router.get('/swagger', async (): Promise<any> => {
  return AutoSwagger.default.docs(router.toJSON(), swagger)
})

/**
 * Swagger UI
 */
router.get('/docs', async (): Promise<string> => {
  return AutoSwagger.default.ui('/swagger', swagger)
  // return AutoSwagger.default.scalar("/swagger")
  // return AutoSwagger.default.rapidoc("/swagger", "view"); to use RapiDoc instead (pass "view" default, or "read" to change the render-style)
})
