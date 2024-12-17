import router from '@adonisjs/core/services/router'

/**
 * Import des routes
 */
import './routes/aws.ts'
import './routes/swagger.ts'
import './routes/health.ts'
import './routes/client.ts'

/**
 * Cette route est utilisée pour tester le fonctionnement de base de l'application,
 * ainsi que pour la surveillance de l'état de santé de l'application.
 */
router.get('/', async (): Promise<{ hello: string }> => {
  return {
    hello: 'world',
  }
})

/**
 * Auth routes
 */
const AuthController = () => import('#controllers/http/auth_controller')
router.post('/signup', [AuthController, 'signUp'])