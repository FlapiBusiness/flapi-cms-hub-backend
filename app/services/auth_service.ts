import User from '#models/user'
import type { SignUpPayload } from '#interfaces/auth_interface'
import logger from '@adonisjs/core/services/logger'
import MailService from '#services/mail_service'
import env from '#start/env'
import KeycloakAdminService from '#services/keycloack_admin_service'
import UserRole from '#models/user_role'
import { LoginPayload } from '#validators/login_validator'
import { UserRoles } from '#enums/user_roles'

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

      const defaultRole: UserRole = await UserRole.findByOrFail('name', UserRoles.CLIENT)

      const user: User = await User.create({
        roleId: defaultRole.id,
        keycloakUserId: keycloakUserId,
        lastname: data.lastname,
        firstname: data.firstname,
        email: data.email,
        password: data.password, // sera hashé automatiquement
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
      return user
    } catch (error: any) {
      logger.error('Error in signIn:', error.message || error)
      throw new Error(error.message || 'Invalid credentials')
    }
  }
}
