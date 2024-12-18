import User from '#models/user'
import type { SignUpPayload } from '#validators/signup_validator'
import type { LoginPayload } from '#validators/login_validator'
import logger from '@adonisjs/core/services/logger'

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
  public static async signUp(data: SignUpPayload): Promise<User> {
    try {
      return await User.create({
        roleId: data.role_id,
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
  public static async signIn(payload: LoginPayload): Promise<boolean> {
    try {
      const user: User = await User.verifyCredentials(payload.email, payload.password)
      return await this.isActive(user.email)
    } catch (error: any) {
      logger.error(error)
      throw error
    }
  }

  //fucnton verifier is active
  /**
   * Check if a user account is active
   * @param {string} email - The email of the user to check
   * @returns {Promise<boolean>} - Whether the user account is active
   */
  public static async isActive(email: string): Promise<boolean> {
    const user: User = await User.findByOrFail('email', email)
    return user.isActive
  }
}
