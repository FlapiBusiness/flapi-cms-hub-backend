import type { HttpContext } from '@adonisjs/core/http'
import AuthService from '#services/auth_service'
import type { SignUpPayload } from '#validators/signup_validator'
import { signUpValidator } from '#validators/signup_validator'
import User from '#models/user'
import BadRequestException from '#exceptions/bad_request_exception'
import logger from '@adonisjs/core/services/logger'
import type { SignInPayload } from '#validators/signin_validator'
import { signInValidator } from '#validators/signin_validator'
import type { AccessToken } from '@adonisjs/auth/access_tokens'
import type { VerifyCodePayload } from '#validators/verifycode_validator'
import { verifyCodeValidator } from '#validators/verifycode_validator'
import type { ResendNewCodePayload } from '#validators/resendnewcode_validator'
import { resendNewCodeValidator } from '#validators/resendnewcode_validator'

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
      await AuthService.signUp(payload)

      // Répondre avec succès et renvoyer les données de l'utilisateur
      response.status(201).json({ message: 'Account created successfully' })
    } catch (error: any) {
      logger.error(error)
      throw new BadRequestException()
    }
  }

  /**
   * Handle user login
   * @param {HttpContext} ctx - The HTTP context containing the request and response objects
   * @param {HttpContext['request']} ctx.request - The HTTP request object
   * @param {HttpContext['response']} ctx.response - The HTTP response object
   * @returns {Promise<void>} - A promise that resolves with no return value
   */
  public async signIn({ request, response }: HttpContext): Promise<void> {
    try {
      const payload: SignInPayload = await signInValidator.validate(request.all())
      const user: User = await AuthService.signIn(payload)
      const token: AccessToken = await User.accessTokens.create(user)

      return response.status(200).json({
        token: token.value!.release(),
        type: 'bearer',
        expiresAt: token.expiresAt,
      })
    } catch (error) {
      logger.error(error)
      return response.unauthorized({ message: 'Authentication failed' })
    }
  }

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
        const user: User & { currentAccessToken: AccessToken } = auth.use('api').user!

        // Révoquer tous les tokens de l'utilisateur
        const tokens: AccessToken[] = await User.accessTokens.all(user)
        for (const token of tokens) {
          await User.accessTokens.delete(user, token.identifier)
        }

        // Répondre avec succès
        return response.status(200).json({ message: 'Logged out from all sessions' })
      }

      return response.unauthorized({ message: 'No active session found' })
    } catch (error: any) {
      logger.error(error)
      return response.internalServerError({ message: 'Unable to logout' })
    }
  }

  /**
   * Verify user account with code
   * @param {HttpContext} ctx - The HTTP context containing the request and response objects
   * @param {HttpContext['request']} ctx.request - The HTTP request object
   * @param {HttpContext['response']} ctx.response - The HTTP response object
   * @returns {Promise<void>} - A promise that resolves with no return value
   */
  public async verifyCode({ request, response }: HttpContext): Promise<void> {
    const payload: VerifyCodePayload = await verifyCodeValidator.validate(request.all())
    await AuthService.verifyCode(payload.email, payload.code)
    response.status(200).json({ message: 'Account is active' })
  }

  /**
   * Resend new code verification account
   * @param {HttpContext} ctx - The HTTP context containing the request and response objects
   * @param {HttpContext['request']} ctx.request - The HTTP request object
   * @param {HttpContext['response']} ctx.response - The HTTP response object
   * @returns {Promise<any>} - A promise that resolves with no return value
   */
  public async resendNewCodeVerificationAccount({ request, response }: HttpContext): Promise<any> {
    const payload: ResendNewCodePayload = await resendNewCodeValidator.validate(request.all())
    await AuthService.resendNewCodeVerificationAccount(payload.email)
    return response.status(200).json({ message: 'New code sent' })
  }
}
