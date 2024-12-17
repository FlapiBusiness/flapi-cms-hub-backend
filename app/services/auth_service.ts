import User from '#models/user'
import Hash from '@adonisjs/core/services/hash'
import { signUpValidator } from '#validators/sign_up_validator'
import type { SignUpPayload } from '#validators/sign_up_validator'

/**
 * Service to handle user sign up operations
 */
class AuthService {
  /**
   * Validate and create a new user
   * @param {SignUpPayload} payload - The validated sign-up data
   * @returns {Promise<User>} - The created user instance
   */
  public async registerUser(payload: SignUpPayload): Promise<User> {
    console.log('Payload received:', payload)
    // Valider les données d'entrée
    const validatedData: SignUpPayload = await signUpValidator.validate(payload)

    // Hasher le mot de passe
    const hashedPassword: string = await Hash.make(validatedData.password)

    // Créer l'utilisateur
    return await User.create({
      roleId: validatedData.role_id,
      lastname: validatedData.lastname,
      firstname: validatedData.firstname,
      email: validatedData.email,
      password: hashedPassword,
      currencyCode: validatedData.currency_code,
      ipAddress: validatedData.ip_address,
      ipRegion: validatedData.ip_region,
      isActive: false,
      activeCode: Math.floor(100000 + Math.random() * 900000),
    })
  }
}

export default new AuthService()
