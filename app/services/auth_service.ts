import User from '#models/user'
import type { SignUpPayload } from '#validators/signup_validator'

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
  }
}
