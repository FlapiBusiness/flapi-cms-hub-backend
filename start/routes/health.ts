import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

const HealthController = () => import('#controllers/health_controller')

/**
 * Vérifie l'état de santé de l'application
 */
router.get('/health', [HealthController, 'health']).use(middleware.health())
