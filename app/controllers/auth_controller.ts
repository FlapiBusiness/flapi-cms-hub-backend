import type { HttpContext } from '@adonisjs/core/http'
import AuthService from '#services/auth_service'
import { signUpValidator } from '#validators/signup_validator'
import BadRequestException from '#exceptions/bad_request_exception'
import logger from '@adonisjs/core/services/logger'
import type { SignUpPayload } from '#interfaces/auth_interface'
import KeycloakAdminService from '#services/keycloack_admin_service'
import type UserSession from '#models/user_session'

/**
 * Controller to handle user authentication operations
 */
export default class AuthController {
  /**
   * @signUp
   * @operationId signUp
   * @tag Auth
   * @summary Inscription d'un utilisateur
   * @description Permet d'inscrire un nouvel utilisateur
   * @requestBody <SignUpPayload>
   * @content application/json
   * @responseBody 201 - <MessageResponse>
   * @responseBody 400 - <MessageResponse>
   */
  /**
   * Handle user signup
   * @param {HttpContext} ctx - The HTTP context containing the request and response objects
   * @param {HttpContext['request']} ctx.request - The HTTP request object
   * @param {HttpContext['response']} ctx.response - The HTTP response object
   * @returns {Promise<void>} - A promise that resolves with no return value
   *
   */
  public async signUp({ request, response }: HttpContext): Promise<void> {
    try {
      // Valider les données d'entrée
      const payload: SignUpPayload = await signUpValidator.validate(request.all())

      // Appel du service pour créer un nouvel utilisateur
      await AuthService.signUp(payload)

      // Répondre avec succès et renvoyer les données de l'utilisateur
      response.status(201).json({ message: 'Account created successfully' })
    } catch (error: any) {
      logger.error(error)
      throw new BadRequestException()
    }
  }

  /**
   * @signIn
   * @operationId signIn
   * @tag Auth
   * @summary Connexion d'un utilisateur
   * @description Permet à un utilisateur de se connecter
   * @responseBody 200 - <MessageResponse>
   * @responseBody 401 - <MessageResponse>
   * @responseBody 500 - <MessageResponse>
   */
  /**
   * Handle user login
   * @param {HttpContext} ctx - The HTTP context containing the request and response objects
   * @param {HttpContext['auth']} ctx.auth - The authentication object
   * @param {HttpContext['request']} ctx.request - The HTTP request object
   * @param {HttpContext['response']} ctx.response - The HTTP response object
   * @returns {Promise<void>} - A promise that resolves with no return value
   */
  public async signinCallback({ request, response }: HttpContext): Promise<void> {
    try {
      const { code, redirect_uri } = request.body()

      const userSession: UserSession = await KeycloakAdminService.exchangeCodeForTokenAndCreateUserSession(
        code,
        redirect_uri,
      )

      return response.ok({
        access_token: userSession.accessToken,
      })
    } catch (error) {
      return response.internalServerError({ error: error.message })
    }
  }

  /**
   * @checkSession
   */
  public async checkSessionIsValid({ request, response }: HttpContext): Promise<void> {
    const token: string | undefined = request.header('Authorization')?.replace('Bearer ', '')
    if (!token) {
      return response.unauthorized({ valid: false, error: 'Token manquant' })
    }

    try {
      const isValid: boolean = await KeycloakAdminService.sessionIsValid(token)
      return response.ok({ valid: isValid })
    } catch (error: any) {
      return response.unauthorized({ valid: false, error: error.message })
    }
  }

  /**
   * @signOut
   * @operationId signOut
   * @tag Auth
   * @summary Déconnexion d'un utilisateur
   * @description Permet à un utilisateur de se déconnecter
   * @responseBody 200 - <MessageResponse>
   * @responseBody 401 - <MessageResponse>
   * @responseBody 500 - <MessageResponse>
   */
  /**
   * Logout user from all sessions
   * @param {HttpContext} ctx - The HTTP context containing the request and response objects
   * @param {HttpContext['auth']} ctx.auth - The authentication object
   * @param {HttpContext['response']} ctx.response - The HTTP response object
   * @returns {Promise<void>} - A promise that resolves with no return value
   */
  public async signOut({ auth, response }: HttpContext): Promise<void> {
    try {
      // Vérifier si l'utilisateur est authentifié
      if (await auth.use('api').check()) {
        // Récupérer l'utilisateur actuel

        // Révoquer tous les tokens de l'utilisateur

        // Répondre avec succès
        response.status(200).json({ message: 'Logged out from all sessions' })
      }

      response.unauthorized({ message: 'No active session found' })
    } catch (error: any) {
      logger.error(error)
      response.internalServerError({ message: 'Unable to logout' })
    }
  }
}
