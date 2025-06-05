import { healthChecks } from '#start/health'
import type { HttpContext } from '@adonisjs/core/http'
import type { HealthCheckReport } from '@adonisjs/health/types'

/**
 * Health checks controller
 * @class HealthController
 */
export default class HealthController {
  /**
   * @health
   * @operationId health
   * @tag Health
   * @summary Check the health of the application
   * @description Check the health of the application
   * @responseBody 200 - <HealthCheckReport> - The application is healthy
   * @responseBody 503 - The application is unhealthy
   * @responseBody 401 - <MessageResponse>
   */
  /**
   * Handle the request
   * @param {HttpContext} ctx - The HTTP context
   * @returns {Promise<void>}
   */
  public async health({ response }: HttpContext): Promise<void> {
    // Run the health checks
    const report: HealthCheckReport = await healthChecks.run()

    // Return the report with a 200 status code if the application is healthy
    if (report.isHealthy) {
      response.ok(report)
    }

    // Return the report with a 503 status code if the application is unhealthy
    response.serviceUnavailable(report)
  }
}
