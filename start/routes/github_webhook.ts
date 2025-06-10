import router from '@adonisjs/core/services/router'
const GithubWebhooksController = () => import('#controllers/github_webhooks_controller')

/**
 * Route to handle GitHub webhook events for workflow runs.
 * Delegates processing to GithubWebhooksController.
 */
router.post('/webhook', [GithubWebhooksController, 'handleWebhook'])
