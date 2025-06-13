import type { HttpContext } from '@adonisjs/core/http'
import logger from '@adonisjs/core/services/logger'
import type { GitHubWebhookResponse, GitHubWorkflowRun } from '#services/github_webhook_service'
import GithubWebhookService from '#services/github_webhook_service'

/**
 * Controller to manage GitHub webhooks linked to workflow Runs.
 */
export default class GithubWebhooksController {
  /**
   * Manages GitHub incoming webhook queries.
   * Valid the Payload and delegates treatment to the GithubWebhookService service.
   * @param ctx - The HTTP context containing the request and the answer.
   * @returns {GitHubWebhookResponse} - The response indicating the status of the webhook processing.
   */
  public async handleWebhook({ request, response }: HttpContext): Promise<GitHubWebhookResponse> {
    const webhook: { workflow_run?: GitHubWorkflowRun } = request.body()

    // Validate the presence of workflow_run in the payload
    if (!webhook.workflow_run) {
      logger.warn('Webhook received without data workflow_run', { payload: webhook })
      response.status(400)
      return {
        status: 'ignored',
        message: 'Missing payload for workflow_run',
      }
    }

    try {
      return await GithubWebhookService.processWorkflowRun(webhook.workflow_run)
    } catch (error: any) {
      logger.error('Error when treating the webhook', {
        message: error.message,
        stack: error.stack,
        webhook_id: webhook.workflow_run.id,
      })
      response.status(500)
      return {
        status: 'ignored',
        message: `Server error: ${error.message}`,
      }
    }
  }
}
