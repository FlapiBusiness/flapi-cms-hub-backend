import router from '@adonisjs/core/services/router'

const AuthController = () => import('#controllers/auth_controller')

router.post('/signup', [AuthController, 'signUp'])

/**
 * @tag Auth
 * @summary Connexion d'un utilisateur
 * @description Permet à un utilisateur de se connecter
 * @requestBody <LoginPayload>
 * @responseBody 200 - {"token": "xxxxx", "type": "bearer", "expiresAt": "date"}
 * @responseBody 401 - {"message": "Authentication failed"}
 */
router.post('/signin', [AuthController, 'signIn'])

/**
 * @tag Auth
 * @summary Déconnexion d'un utilisateur
 * @description Déconnecte l'utilisateur de toutes ses sessions actives
 * @responseBody 200 - {"message": "Logged out from all sessions"}
 * @responseBody 401 - {"message": "No active session found"}
 */
router.post('/signout', [AuthController, 'signOut'])

/**
 * @tag Auth
 * @summary Vérification du code d'activation
 * @description Vérifie le code d'activation envoyé par email
 * @requestBody <VerifyCodePayload>
 * @responseBody 200 - {"message": "Account is active"}
 * @responseBody 400 - {"message": "Invalid code"}
 */
router.post('/verifycode', [AuthController, 'verifyCode'])

/**
 * @tag Auth
 * @summary Renvoi du code de validation
 * @description Envoie un nouveau code de validation à l'utilisateur
 * @requestBody <ResendNewCodePayload>
 * @responseBody 200 - {"message": "New code sent"}
 */
router.post('/resend-code', [AuthController, 'resendNewCodeVerificationAccount'])
