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
  recaptcha_token: string
}

/**
 * CheckSessionValidityResponse
 * @property {boolean} valid - The session validity status
 * @property {string} error - The error message if the session is not valid
 */
export interface CheckSessionValidityResponse {
  valid: boolean
  error?: string
}

/**
 * GetAuthenticatedUserResponse
 * @property {User} user - The authenticated user
 */
export interface getAuthenticatedUserErrorResponse {
  error: string
}

/**
 * ReCAPTCHA response
 * @interface RecaptchaResponse
 * @property {boolean} success - The reCAPTCHA token validity status
 * @property {string} challenge_ts - The timestamp of the challenge
 * @property {string} hostname - The hostname of the reCAPTCHA request
 * @property {number} [score] - The score of the reCAPTCHA token
 * @property {string} [action] - The action of the reCAPTCHA token
 * @property {string[]} ['error-codes'] - The error codes if the token is invalid
 */
export interface RecaptchaResponse {
  success: boolean
  challenge_ts: string
  hostname: string
  score?: number
  action?: string
  'error-codes'?: string[]
}
