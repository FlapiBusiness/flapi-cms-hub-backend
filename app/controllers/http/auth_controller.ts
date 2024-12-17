import type { HttpContext } from '@adonisjs/core/http'
import AuthService from '#services/auth_service'
import type { SignUpPayload } from '#validators/sign_up_validator'
import type User from '#models/user'

/**
 * Controller to handle user authentication operations
 */
export default class AuthController {
  /**
   * Handle user signup
   * @param {HttpContext} ctx - The HTTP context containing the request and response objects
   * @param {HttpContext['request']} ctx.request - The HTTP request object
   * @param {HttpContext['response']} ctx.response - The HTTP response object
   * @returns {Promise<void>} - A promise that resolves with no return value
   */
  public async signUp({ request, response }: HttpContext): Promise<void> {
    try {
      // Récupération stricte des données avec typage
      const payload: SignUpPayload = request.only([
        'role_id',
        'lastname',
        'firstname',
        'email',
        'password',
        'password_confirmation',
        'ip_address',
        'ip_region',
        'currency_code',
      ]) as SignUpPayload

      // Appel du service pour créer un nouvel utilisateur
      const user: User = await AuthService.registerUser(payload)

      // Retourner une réponse de succès
      response.created({
        message: 'User registered successfully',
        data: {
          id: user.id,
          email: user.email,
          active_code: user.activeCode,
        },
      })
    } catch (error) {
      console.error(error)
      // Gestion des erreurs
      response.badRequest({
        message: 'User registration failed',
        error: error.messages || error.message || 'Validation failure',
      })
    }
  }
}
