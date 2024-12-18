import router from '@adonisjs/core/services/router'

const AuthController = () => import('#controllers/auth_controller')

/**
 * Route pour l'inscription d'un utilisateur
 */
router.post('/signup', [AuthController, 'signUp'])

/**
 * Route pour la connexion d'un utilisateur
 */
router.post('/signIn', [AuthController, 'signIn'])
