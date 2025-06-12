import logger from '@adonisjs/core/services/logger'
import GithubProjectRepositoryService from '#services/github_project_repository_service'
import { ProjectSetupStep } from '#enums/project_setup_step'
import { ProjectSetupStatus } from '#enums/project_setup_status'
import ClientService from '#services/client_service'

/**
 * Type representing the conclusion of a GitHub workflow run.
 */
type GitHubWorkflowRunConclusion = 'success' | 'failure' | 'cancelled' | 'timed_out' | 'neutral' | 'skipped' | null

/**
 * Type representing the status of a GitHub workflow run.
 */
type GitHubWorkflowRunStatus = 'queued' | 'in_progress' | 'completed'

/**
 * Type representing the response status of a GitHub webhook.
 */
type GitHubWebhookResponseStatus = 'processed' | 'ignored'

/**
 * Type representing information from a workflow_run in a webhook github.
 */
export type GitHubWorkflowRun = {
  id: number
  name: string
  status: GitHubWorkflowRunStatus
  conclusion: GitHubWorkflowRunConclusion
  head_branch: string
  event: string
  run_attempt: number
  html_url: string
  repository: {
    full_name: string // ex. : "FlapiBusiness/flapi-customer-project-frontend"
    name: string // ex. : "flapi-customer-project-frontend"
  }
}

/**
 * Type representing the response of the treatment of the webhook.
 */
export type GitHubWebhookResponse = {
  status: GitHubWebhookResponseStatus
  webhook_id?: number
  message?: string
}

/**
 * Service to treat GitHub webhooks linked to Workflow Runs.
 */
export default class GithubWebhookService {
  /**
   * Treats a workflow run received via a GitHub webhook.
   * Mists the information and updates the state of the project for certain specific workflows.
   * @param {GitHubWorkflowRun} workflowRun - The information of the workflow run received in the webhook.
   * @returns {GitHubWebhookResponse} - The response indicating the status of the webhook processing.
   */
  public static async processWorkflowRun(workflowRun: GitHubWorkflowRun): Promise<GitHubWebhookResponse> {
    const { id, name, status, conclusion, head_branch, event, run_attempt } = workflowRun

    // Journalist from workflow information
    logger.info('Webhook reçu pour workflow_run', {
      id,
      name,
      status,
      conclusion,
      branch: head_branch,
      event,
      attempt: run_attempt,
      repository: workflowRun.repository.name,
    })

    // Check the state of the workflow
    if (status !== 'completed') {
      logger.debug(`Workflow '${name}' is in ${status}`, {
        id,
        branch: head_branch,
      })
      return {
        status: 'processed',
        webhook_id: id,
        message: `Workflow is in ${status}`,
      }
    }

    // Manage the conclusions for finished workflows
    switch (conclusion) {
      case 'success':
        logger.info(`Workflow '${name}' successfully completed`, { id, branch: head_branch })
        break
      case 'failure':
        logger.error(`Workflow '${name}' failed`, {
          id,
          branch: head_branch,
          attempt: run_attempt,
        })
        break
      case 'cancelled':
      case 'timed_out':
        logger.warn(`Workflow '${name}' was interrupted`, {
          id,
          branch: head_branch,
          conclusion,
          attempt: run_attempt,
        })
        break
      case 'neutral':
      case 'skipped':
        logger.info(`Workflow '${name}' completed with conclusion: ${conclusion}`, {
          id,
          branch: head_branch,
        })
        break
      default:
        logger.warn(`Unexpected conclusion for workflow '${name}': ${conclusion}`, { id })
    }

    // Update the state of the project for specific workflows
    await this.updateProjectStatusForSpecificWorkflows(workflowRun)

    return {
      status: 'processed',
      webhook_id: id,
    }
  }

  /**
   * Updates the state of the project for specific deployment workflows.
   * @param {GitHubWorkflowRun} workflowRun - The information of the workflow run received in the webhook.
   * @returns {Promise<void>} - A promise that resolves when the project status is updated.
   */
  private static async updateProjectStatusForSpecificWorkflows(workflowRun: GitHubWorkflowRun): Promise<void> {
    const { name, status, conclusion } = workflowRun

    const deploymentWorkflows: string[] = [
      'init-tests_build_deploy_cluster_development-web',
      'init-tests_build_deploy_cluster_staging-web',
    ]

    if (!deploymentWorkflows.includes(name)) {
      return
    }

    // Extract projectId from repository.name (eg: "Flapi-Customer-Project-Frontend")
    const projectId: number | null = await GithubProjectRepositoryService.getProjectIdWithGithubProjectRepositoryName(
      workflowRun.repository.name,
    )
    if (!projectId) {
      logger.warn(`Impossible to find projectId for the workflow '${name}'`, {
        repository: workflowRun.repository.name,
      })
      return
    }

    if (status === 'completed' && conclusion === 'success') {
      try {
        await GithubProjectRepositoryService.updateDeployedStatusByRepoName(workflowRun.repository.name, true)
      } catch (error: any) {
        logger.error(`Error updating deployment status for project ${projectId}`, {
          repository: workflowRun.repository.name,
          error: error.message,
        })
      }
    }

    try {
      const projectHasBeenDeployed: boolean =
        await GithubProjectRepositoryService.checkIfProjectHasBeenDeployed(projectId)

      if (projectHasBeenDeployed) {
        await ClientService.updateProjectSetupStep(
          projectId,
          ProjectSetupStep.DEPLOYMENT,
          ProjectSetupStatus.COMPLETED,
          'Le projet a été déployé avec succès',
        )
        logger.info(`Project ${projectId} has been successfully deployed`, {
          repository: workflowRun.repository.name,
        })
      }
    } catch (error: any) {
      logger.error(`Error when updating the state of the project to ${name}`, {
        projectId,
        error: error.message,
      })
      throw error
    }
  }
}
