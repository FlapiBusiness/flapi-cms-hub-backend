import type { HttpContext } from '@adonisjs/core/http'
import AuthService from '#services/auth_service'
import { signUpValidator } from '#validators/signup_validator'
import BadRequestException from '#exceptions/bad_request_exception'
import logger from '@adonisjs/core/services/logger'
import type { SignUpPayload } from '#interfaces/auth_interface'
import KeycloakAdminService from '#services/keycloack_admin_service'
import type UserSession from '#models/user_session'
import type User from '#models/user'

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
   * @responseBody 400 - <BadValidationRequestResponse>
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
      // Si c'est une erreur de validation
      if (error.code === 'E_VALIDATION_ERROR' && error.messages) {
        throw new BadRequestException({ messages: error.messages })
      }

      throw new BadRequestException({ message: error.message })
    }
  }

  /**
   * @signinCallback
   * @operationId signinCallback
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
   * @checkSessionIsValid
   * @operationId checkSessionIsValid
   * @tag Auth
   * @summary Vérifie si la session utilisateur est valide
   * @description Vérifie la validité du token fourni dans l'en-tête Authorization.
   * @responseBody 200 - <CheckSessionValidityResponse>
   * @responseBody 401 - <CheckSessionValidityResponse>
   * @responseBody 401 - <CheckSessionValidityResponse>
   * @responseBody 500 - <CheckSessionValidityResponse>
   */
  /**
   * Check if the user session is valid
   * @param request
   * @param response
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
   * @getAuthenticatedUser
   * @operationId getAuthenticatedUser
   * @tag Auth
   * @summary Récupère l'utilisateur authentifié
   * @description Retourne les informations de l'utilisateur connecté à partir du token fourni.
   * @responseBody 200 - <User>
   * @responseBody 401 - <getAuthenticatedUserErrorResponse>
   * @responseBody 401 - <getAuthenticatedUserErrorResponse>
   * @responseBody 500 - <getAuthenticatedUserErrorResponse>
   */
  /**
   * Récupère l'utilisateur actuellement authentifié
   * @param {HttpContext} ctx - Contexte HTTP
   * @returns {Promise<void>}
   */
  public async getAuthenticatedUser({ request, response }: HttpContext): Promise<void> {
    const token: string | undefined = request.header('Authorization')?.replace('Bearer ', '')

    if (!token) {
      return response.unauthorized({ error: 'Token manquant' })
    }

    try {
      const user: User | null = await KeycloakAdminService.getAuthenticatedUser(token)

      if (!user) {
        return response.unauthorized({ error: 'Utilisateur non trouvé ou token invalide' })
      }

      return response.ok(user)
    } catch (error: any) {
      return response.internalServerError({ error: error.message })
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
