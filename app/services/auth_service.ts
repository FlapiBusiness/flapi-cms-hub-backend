import User from '#models/user'
import type { SignUpPayload } from '#validators/signup_validator'
import type { LoginPayload } from '#validators/login_validator'
import logger from '@adonisjs/core/services/logger'
import MailService from '#services/mail_service'
import env from '#start/env'
import BadRequestException from '#exceptions/bad_request_exception'
import KeycloakAdminService from '#services/keycloack_admin_service'

/**
 * Service to handle user sign up operations
 * @class AuthService
 */
export default class AuthService {
  /**
   * Validate and create a new user
   * @param {SignUpPayload} data - Data to create the user
   * @returns {Promise<User>} - The created user instance
   */
  public static async signUp(data: SignUpPayload): Promise<void> {
    try {
      const keycloakUserId: number = await KeycloakAdminService.createUser(
        data.email,
        data.password,
        data.firstname,
        data.lastname,
      )

      const user: User = await User.create({
        roleId: data.role_id,
        keycloakUserId: keycloakUserId,
        lastname: data.lastname,
        firstname: data.firstname,
        email: data.email,
        password: data.password, // sera hashé automatiquement
        currencyCode: data.currency_code,
        ipAddress: data.ip_address,
        ipRegion: data.ip_region,
        isActive: false,
        activeCode: Math.floor(100000 + Math.random() * 900000),
      })

      await MailService.sendEmail(user.email, 'welcome', 'Welcome to Flapi', {
        username: user.firstname + ' ' + user.lastname,
        code: user.activeCode,
        redirect_uri:
          env.get('FRONTEND_APP_BASE_URL') + env.get('FRONTEND_APP_REDIRECT_URI_ACCOUNT_VALIDATE') + user.email,
      })
    } catch (error: any) {
      logger.error(error)
      throw error
    }
  }

  /**
   * Authenticate a user with email and password
   * @param {LoginPayload} payload - The login data
   * @returns {Promise<User>} - The authenticated user instance
   */
  public static async signIn(payload: LoginPayload): Promise<User> {
    try {
      // Vérifier les identifiants (email et mot de passe)
      const user: User = await User.verifyCredentials(payload.email, payload.password)

      // Vérifier si l'utilisateur à activer sont compte via le code pin.
      const isActive: boolean = await this.isActive(user.email)
      if (!isActive) {
        throw new Error('User account is inactive, verification code is required')
      }

      return user
    } catch (error: any) {
      logger.error('Error in signIn:', error.message || error)
      throw new Error(error.message || 'Invalid credentials')
    }
  }

  /**
   * Check if a user account is active
   * @param {string} email - The email of the user to check
   * @returns {Promise<boolean>} - Whether the user account is active
   */
  public static async isActive(email: string): Promise<boolean> {
    const user: User = await User.findByOrFail('email', email)
    return user.isActive
  }

  /**
   * Verify the user's validation code
   * @param {string} email - The email of the user to verify
   * @param {number} code - The validation code to verify
   * @returns {Promise<void>} - A promise that resolves with no return value
   */
  public static async verifyCode(email: string, code: number): Promise<void> {
    const user: User = await User.findByOrFail('email', email)
    if (user.activeCode !== code) {
      throw new BadRequestException('Invalid code')
    }

    try {
      await user.merge({ isActive: true }).save()
    } catch (error) {
      logger.error(error)
      throw error
    }
  }

  /**
   * Resend the validation code to the user
   * @param {string} email - The email of the user to resend the code
   * @returns {Promise<void>} - A promise that resolves with no return value
   */
  public static async resendNewCodeVerificationAccount(email: string): Promise<void> {
    const user: User = await User.findByOrFail('email', email)

    /**
     * Vu que le premier code d'activation à déjà était générer lors de l'incription
     * on le met à jour avec un nouveau code
     */
    const activeCode: number = Math.floor(100000 + Math.random() * 900000)
    await user.merge({ activeCode: activeCode }).save()

    try {
      await MailService.sendEmail(user.email, 'welcome', 'Activation code resend - CrzGames', {
        username: user.firstname + ' ' + user.lastname,
        code: user.activeCode,
        redirect_uri:
          env.get('FRONTEND_APP_BASE_URL') + env.get('FRONTEND_APP_REDIRECT_URI_ACCOUNT_VALIDATE') + user.email,
      })
    } catch (error) {
      logger.error(error)
      throw error
    }
  }
}
