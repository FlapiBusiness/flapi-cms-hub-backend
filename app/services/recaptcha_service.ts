import axios from 'axios'
import BadRequestException from '#exceptions/bad_request_exception'
import InternalServerErrorException from '#exceptions/internal_server_error_exception'
import type { AxiosResponse } from 'axios'
import type { RecaptchaResponse } from '#interfaces/auth_interface'

/**
 * Service to handle reCAPTCHA operations
 * @class RecaptchaService
 */
export default class RecaptchaService {
  /**
   * Verify a reCAPTCHA token
   * @param {string} token - The reCAPTCHA token to verify
   * @returns {Promise<void>} - A promise that resolves with no return value
   */
  public static async verifyRecaptchaToken(token: string): Promise<void> {
    try {
      const response: AxiosResponse<RecaptchaResponse, {}> = await axios.post(
        `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${token}`,
      )
      console.log('status', response.status)
      console.log(response)
      if (!response.data.success) {
        throw new BadRequestException({ message: 'Invalid reCAPTCHA token' })
      }

      return Promise.resolve()
    } catch (error: any) {
      throw new InternalServerErrorException(`Error while verifying reCAPTCHA token: ${error.message}`)
    }
  }
}
