import router from '@adonisjs/core/services/router'

const AuthController = () => import('#controllers/auth_controller')

/**
 * Route pour l'inscription d'un utilisateur
 */
router.post('/signup', [AuthController, 'signUp'])

/**
 * Route pour la connexion d'un utilisateur
 */
router.post('/signin', [AuthController, 'signIn'])

/**
 * Route pour la déconnexion d'un utilisateur
 */
router.post('/signout', [AuthController, 'signOut'])

/**
 * Route pour la vérification du code de validation
 */
router.post('/verifycode', [AuthController, 'verifyCode'])

/**
 * Route pour le renvoi du code de validation
 */
router.post('/resend-code', [AuthController, 'resendNewCodeVerificationAccount'])
