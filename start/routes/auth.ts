import router from '@adonisjs/core/services/router'

const AuthController = () => import('#controllers/http/auth_controller')

/**
 * Route pour l'inscription d'un utilisateur
 */
router.post('/signup', [AuthController, 'signUp'])
