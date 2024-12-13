import type { HttpContext } from '@adonisjs/core/http'
import env from '#start/env'

/**
 * Health middleware
 * @class HealthMiddleware
 */
export default class HealthMiddleware {
  /**
   * Handle the request
   * @param {HttpContext} ctx - The HTTP context
   * @param {() => Promise<void>} next - The next middleware
   * @returns {Promise<void>}
   */
  public async handle({ request, response }: HttpContext, next: () => Promise<void>): Promise<void> {
    if (request.header('x-health-secret') === env.get('HEALTH')) {
      await next() // Passe au contrôleur
    } else {
      response.unauthorized({ message: 'Unauthorized access' })
    }
  }
}
