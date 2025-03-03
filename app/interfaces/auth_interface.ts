/**
 * Login success response
 * @property {string} token - The user token
 * @property {string} type - The type of the token
 * @property {Date} expiresAt - The expiration date of the token
 */
export interface LoginSuccessResponse {
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
