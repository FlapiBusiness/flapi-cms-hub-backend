import type { HttpContext } from '@adonisjs/core/http'
import AuthService from '#services/auth_service'
import type { SignUpPayload } from '#validators/signup_validator'
import { signUpValidator } from '#validators/signup_validator'
import type User from '#models/user'
import BadRequestException from '#exceptions/bad_request_exception'
import logger from '@adonisjs/core/services/logger'

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
      // Valider les données d'entrée
      const payload: SignUpPayload = await signUpValidator.validate(request.all())

      // Appel du service pour créer un nouvel utilisateur
      const user: User = await AuthService.signUp(payload)

      // Répondre avec succès et renvoyer les données de l'utilisateur
      response.status(201).json({
        message: 'User registered successfully',
        data: {
          id: user.id,
          email: user.email,
          activeCode: user.activeCode,
        },
      })
    } catch (error: any) {
      logger.error(error)
      throw new BadRequestException()
    }
  }
}
