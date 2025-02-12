import router from '@adonisjs/core/services/router'

/**
 * Import des routes
 */
import './routes/aws.js'
import './routes/swagger.js'
import './routes/health.js'
import './routes/client.js'
import './routes/auth.js'
import './routes/project.js'
import './routes/database.js'
import './routes/team.js'

/**
 * Cette route est utilisée pour tester le fonctionnement de base de l'application,
 * ainsi que pour la surveillance de l'état de santé de l'application.
 */
router.get('/', async (): Promise<{ hello: string }> => {
  return {
    hello: 'world',
  }
})
