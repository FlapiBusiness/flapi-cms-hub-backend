import router from '@adonisjs/core/services/router'

const AuthController = () => import('#controllers/auth_controller')

router.post('/auth/signup', [AuthController, 'signUp'])
router.post('/auth/signin-callback', [AuthController, 'signinCallback'])
router.post('/auth/user', [AuthController, 'getAuthenticatedUser'])
router.post('/auth/signout', [AuthController, 'signOut'])
router.get('/auth/check-session', [AuthController, 'checkSessionIsValid'])
