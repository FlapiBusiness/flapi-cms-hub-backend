import router from '@adonisjs/core/services/router'

const AuthController = () => import('#controllers/auth_controller')

router.post('/signup', [AuthController, 'signUp'])
router.post('/signin', [AuthController, 'signIn'])
router.post('/signout', [AuthController, 'signOut'])
router.post('/verifycode', [AuthController, 'verifyCode'])
router.post('/resend-code', [AuthController, 'resendNewCodeVerificationAccount'])
