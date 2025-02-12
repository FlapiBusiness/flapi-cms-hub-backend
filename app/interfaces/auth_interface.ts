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
