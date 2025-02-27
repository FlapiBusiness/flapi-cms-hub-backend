/**
 * Login success response
 * @property {string} token - The user token
 * @property {string} type - The type of the token
 * @property {Date} expiresAt - The expiration date of the token
 */
export interface LoginSuccessResponse {
  /**
   * Token d'authentification de l'utilisateur
   * @example "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9"
   */
  token: string
  type: string
  expiresAt: Date
}

/**
 * SignUpPayload
 * @property {string} lastname - The user lastname
 * @property {string} firstname - The user firstname
 * @property {string} email - The user email
 * @property {string} password - The user password
 * @property {string} password_confirmation - The user password confirmation
 */
export interface SignUpPayload {
  lastname: string
  firstname: string
  email: string
  password: string
  password_confirmation: string
}

/**
 *  @interface {object} VerifyCodePayload - The payload for verifying the user's account with a code.
 *  @property {string} email - The email address of the user.
 *  @property {number} code - The 6-digit active code for the user.
 */
export interface VerifyCodePayload {
  email: string
  code: number
}
