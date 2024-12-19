import router from '@adonisjs/core/services/router'

const ClientController = () => import('#controllers/client_controller')

/**
 * Route pour créer une nouvelle application (repository GitHub, sous-domaine, DNS etc.)
 */
router.post('/client/app/create', [ClientController, 'createNewApplication'])
