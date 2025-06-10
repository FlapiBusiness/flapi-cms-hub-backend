import type { AxiosResponse } from 'axios'
import axios from 'axios'
import logger from '@adonisjs/core/services/logger'
import env from '#start/env'
import TimeService from '#services/time_service'

/**
 * Represents a GitHub webhook configuration.
 */
type GitHubWebhookConfig = {
  url: string
  content_type: string
  insecure_ssl: string
  secret?: string
}

/**
 * Represents a GitHub webhook.
 */
type GitHubWebhook = {
  id: number
  name: string
  active: boolean
  events: string[]
  config: GitHubWebhookConfig
}

/**
 * Represents options for creating a GitHub repository from a template.
 */
type GitHubRepoCreateOptions = {
  description?: string
  private?: boolean
}

/**
 * Represents a GitHub repository creation response.
 */
type GitHubRepoResponse = {
  html_url: string
  message?: string
}

/**
 * Represents a GitHub file content response.
 */
type GitHubFileContentResponse = {
  content: string
  sha: string
}

/**
 * Represents the payload for pushing a file to a GitHub repository.
 */
type GitHubPushFilePayload = {
  message: string
  content: string
  branch: string
  sha?: string
}

/**
 * Represents the payload for triggering a GitHub workflow.
 */
type GitHubWorkflowDispatchPayload = {
  ref: string
  inputs: Record<string, string | number>
}

/**
 * Represents the payload for creating a GitHub webhook.
 */
type GitHubWebhookCreatePayload = {
  name: string
  active: boolean
  events: string[]
  config: GitHubWebhookConfig
}

/**
 * Represents the headers for GitHub API requests.
 */
type GitHubAuthHeaders = {
  Authorization: string
  Accept: string
  'X-GitHub-Api-Version': string
}

/**
 * Service for interacting with the GitHub API to manage repositories, workflows, and webhooks.
 */
export class GitHubService {
  private static readonly GITHUB_API_URL: string = 'https://api.github.com'
  private static readonly GITHUB_PERSONAL_ACCESS_TOKEN: string = env.get('GITHUB_PERSONAL_ACCESS_TOKEN', '')
  private static readonly GITHUB_USERNAME_OR_ORGANIZATION: string = env.get('GITHUB_USERNAME_OR_ORGANIZATION', '')
  private static readonly GITHUB_WEBHOOK_URL: string = env.get('GITHUB_WEBHOOK_URL', 'http://localhost:3556/webhook')
  private static readonly AUTH_HEADER: GitHubAuthHeaders = {
    Authorization: `Bearer ${this.GITHUB_PERSONAL_ACCESS_TOKEN}`,
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
  }

  /**
   * Validates environment variables required for GitHub API interactions.
   * @throws {Error} If any required environment variable is missing.
   */
  static {
    if (!this.GITHUB_PERSONAL_ACCESS_TOKEN) {
      throw new Error('GITHUB_PERSONAL_ACCESS_TOKEN is not defined in .env')
    }
    if (!this.GITHUB_USERNAME_OR_ORGANIZATION) {
      throw new Error('GITHUB_USERNAME_OR_ORGANIZATION is not defined in .env')
    }
  }

  /**
   * Creates a repository from a GitHub template.
   * @param {string} newRepoName - The name of the new repository.
   * @param {string} templateRepoName - The name of the template repository.
   * @param {GitHubRepoCreateOptions} options - Optional settings for the repository (description, visibility).
   * @returns The HTML URL of the created repository or null if it already exists.
   */
  public static async createRepositoryFromTemplate(
    newRepoName: string,
    templateRepoName: string,
    options: GitHubRepoCreateOptions = {},
  ): Promise<string | null> {
    const url: string = `${this.GITHUB_API_URL}/repos/${this.GITHUB_USERNAME_OR_ORGANIZATION}/${templateRepoName}/generate`
    const data: {
      owner: string
      name: string
      description: string
      private: boolean
      include_all_branches: boolean
    } = {
      owner: this.GITHUB_USERNAME_OR_ORGANIZATION,
      name: newRepoName,
      description: options.description || 'Repository created from a template',
      private: options.private || false,
      include_all_branches: false,
    }

    try {
      // Check if the repository already exists
      const repoUrl: string = `${this.GITHUB_API_URL}/repos/${this.GITHUB_USERNAME_OR_ORGANIZATION}/${newRepoName}`
      await axios.get(repoUrl, { headers: this.AUTH_HEADER })
      logger.info(`Repository '${newRepoName}' already exists.`)
      return null
    } catch (error: any) {
      if (error.response?.status === 404) {
        try {
          // Create the repository
          const response: AxiosResponse<GitHubRepoResponse> = await axios.post(url, data, {
            headers: this.AUTH_HEADER,
          })
          if (response.status === 201) {
            logger.info(`Repository '${newRepoName}' created successfully.`)
            return response.data.html_url
          }
          throw new Error(`Failed to create repository: ${response.data.message || 'Unknown error'}`)
        } catch (creationError: any) {
          logger.error(`Error creating repository: ${creationError.response?.data?.message || creationError.message}`)
          console.log(creationError.response)
          throw creationError
        }
      }
      logger.error(`Error checking repository: ${error.response?.data?.message || error.message}`)
      throw error
    }
  }

  /**
   * Retrieves the content of a workflow file from the template repository.
   * @param {string} templateRepoName - Name of the template repository.
   * @param {string} filePath - Path to the file in the template (e.g., '.github/workflows/init-update-files-and-push.yaml').
   * @param {string} branch - Target branch (default: 'develop').
   * @returns The decoded file content.
   */
  public static async getWorkflowFileContent(
    templateRepoName: string,
    filePath: string,
    branch: string = 'develop',
  ): Promise<string> {
    const url: string = `${this.GITHUB_API_URL}/repos/${this.GITHUB_USERNAME_OR_ORGANIZATION}/${templateRepoName}/contents/${filePath}?ref=${branch}`
    try {
      const response: AxiosResponse<GitHubFileContentResponse> = await axios.get(url, {
        headers: this.AUTH_HEADER,
      })
      const content: string = Buffer.from(response.data.content, 'base64').toString('utf-8')
      logger.info(`File '${filePath}' retrieved successfully from template.`)
      return content
    } catch (error: any) {
      logger.error(`Error retrieving file '${filePath}': ${error.response?.data?.message || error.message}`)
      throw error
    }
  }

  /**
   * Checks if a file exists in a GitHub repository.
   * @param repo - Repository name.
   * @param filePath - File path (e.g., '.github/workflows/init-update-files-and-push.yaml').
   * @param branch - Target branch (default: 'develop').
   * @returns The file object with its SHA if it exists, or null if not found.
   */
  public static async checkFileExists(
    repo: string,
    filePath: string,
    branch: string = 'develop',
  ): Promise<{ sha: string } | null> {
    const url: string = `${this.GITHUB_API_URL}/repos/${this.GITHUB_USERNAME_OR_ORGANIZATION}/${repo}/contents/${filePath}?ref=${branch}`
    try {
      const response: AxiosResponse<GitHubFileContentResponse> = await axios.get(url, {
        headers: this.AUTH_HEADER,
      })
      return { sha: response.data.sha }
    } catch (error: any) {
      if (error.response?.status === 404) {
        logger.info(`File '${filePath}' not found in repository '${repo}'.`)
        return null
      }
      logger.error(`Error checking file '${filePath}': ${error.response?.data?.message || error.message}`)
      throw error
    }
  }

  /**
   * Pushes a file to a GitHub repository (create or update).
   * @param params - Parameters for pushing the file.
   * @param params.repo - Repository name.
   * @param params.filePath - File path (e.g., '.github/workflows/init-update-files-and-push.yaml').
   * @param params.content - File content (unencoded).
   * @param params.commitMessage - Commit message.
   * @param params.branch - Target branch (default: 'develop').
   */
  public static async pushFileToRepo({
    repo,
    filePath,
    content,
    commitMessage,
    branch = 'develop',
  }: {
    repo: string
    filePath: string
    content: string
    commitMessage: string
    branch?: string
  }): Promise<void> {
    const url: string = `${this.GITHUB_API_URL}/repos/${this.GITHUB_USERNAME_OR_ORGANIZATION}/${repo}/contents/${filePath}`
    const fileExists: { sha: string } | null = await this.checkFileExists(repo, filePath, branch)
    const data: GitHubPushFilePayload = {
      message: commitMessage,
      content: Buffer.from(content).toString('base64'),
      branch,
      sha: fileExists?.sha,
    }

    try {
      await axios.put(url, data, { headers: this.AUTH_HEADER })
      logger.info(`File '${filePath}' ${fileExists ? 'updated' : 'created'} successfully in repository '${repo}'.`)
    } catch (error: any) {
      logger.error(`Error pushing file '${filePath}': ${error.response?.data?.message || error.message}`)
      throw error
    }
  }

  /**
   * Triggers a GitHub Actions workflow via workflow_dispatch.
   * @param repo - Repository name.
   * @param workflowFileName - Workflow file name (e.g., 'init-update-files-and-push.yaml').
   * @param ref - Target branch (default: 'develop').
   * @param inputs - Optional inputs for the workflow.
   * @returns True if the workflow was triggered successfully, false otherwise.
   */
  public static async triggerWorkflow(
    repo: string,
    workflowFileName: string,
    ref: string = 'develop',
    inputs: Record<string, string | number> = {},
  ): Promise<boolean> {
    const encodedWorkflowPath: string = encodeURIComponent(workflowFileName)
    const url: string = `${this.GITHUB_API_URL}/repos/${this.GITHUB_USERNAME_OR_ORGANIZATION}/${repo}/actions/workflows/${encodedWorkflowPath}/dispatches`
    const data: GitHubWorkflowDispatchPayload = { ref, inputs }

    try {
      const response: AxiosResponse<void> = await axios.post(url, data, { headers: this.AUTH_HEADER })
      if (response.status === 204) {
        logger.info(`Workflow '${workflowFileName}' triggered successfully in repository '${repo}'.`)
        return true
      }
      return false
    } catch (error: any) {
      logger.error(`Error triggering workflow '${workflowFileName}': ${error.response?.data?.message || error.message}`)
      throw error
    }
  }

  /**
   * Creates a webhook at the organization level to listen for workflow_run events.
   * @param events - List of events to listen for (default: ['workflow_run']).
   * @returns The ID of the created or existing webhook.
   */
  public static async createOrgWebhook(events: string[] = ['workflow_run']): Promise<number> {
    const url: string = `${this.GITHUB_API_URL}/orgs/${this.GITHUB_USERNAME_OR_ORGANIZATION}/hooks`
    const webhookConfig: GitHubWebhookConfig = {
      url: this.GITHUB_WEBHOOK_URL,
      content_type: 'json',
      insecure_ssl: '0',
    }
    const data: GitHubWebhookCreatePayload = {
      name: 'web',
      active: true,
      events,
      config: webhookConfig,
    }

    try {
      // Check if a webhook with the same URL already exists
      const response: AxiosResponse<GitHubWebhook[]> = await axios.get(url, {
        headers: this.AUTH_HEADER,
      })
      const existingWebhook: GitHubWebhook | undefined = response.data.find(
        (hook: GitHubWebhook): boolean => hook.config.url === this.GITHUB_WEBHOOK_URL && hook.active,
      )

      if (existingWebhook) {
        logger.info(`Existing webhook found with ID ${existingWebhook.id} for URL ${this.GITHUB_WEBHOOK_URL}.`)
        return existingWebhook.id
      }

      // Create a new webhook
      const createResponse: AxiosResponse<GitHubWebhook> = await axios.post(url, data, {
        headers: this.AUTH_HEADER,
      })
      logger.info(`Webhook created successfully with ID ${createResponse.data.id}.`)
      return createResponse.data.id
    } catch (error: any) {
      logger.error(`Error creating webhook: ${error.response?.data?.message || error.message}`)
      throw error
    }
  }

  /**
   * Creates a new branch in a GitHub repository from an existing branch.
   * @param repo - Repository name.
   * @param newBranchName - Name of the new branch to create.
   * @param sourceBranch - Name of the source branch (default: 'develop').
   * @returns True if the branch was created successfully, false if it already exists.
   */
  public static async createBranch(
    repo: string,
    newBranchName: string,
    sourceBranch: string = 'develop',
  ): Promise<boolean> {
    const getRefUrl: string = `${this.GITHUB_API_URL}/repos/${this.GITHUB_USERNAME_OR_ORGANIZATION}/${repo}/git/refs/heads/${sourceBranch}`
    const createRefUrl: string = `${this.GITHUB_API_URL}/repos/${this.GITHUB_USERNAME_OR_ORGANIZATION}/${repo}/git/refs`

    try {
      // Check if the branch already exists
      await axios.get(
        `${this.GITHUB_API_URL}/repos/${this.GITHUB_USERNAME_OR_ORGANIZATION}/${repo}/git/refs/heads/${newBranchName}`,
        {
          headers: this.AUTH_HEADER,
        },
      )
      logger.info(`Branch '${newBranchName}' already exists in repository '${repo}'.`)
      return false
    } catch (error: any) {
      if (error.response?.status === 404) {
        // Get the SHA of the source branch
        const refResponse: AxiosResponse<{ object: { sha: string } }> = await axios.get(getRefUrl, {
          headers: this.AUTH_HEADER,
        })
        const sha: string = refResponse.data.object.sha

        // Create the new branch
        const createResponse: AxiosResponse<void> = await axios.post(
          createRefUrl,
          {
            ref: `refs/heads/${newBranchName}`,
            sha,
          },
          { headers: this.AUTH_HEADER },
        )

        if (createResponse.status === 201) {
          logger.info(`Branch '${newBranchName}' created successfully in repository '${repo}'.`)
          return true
        }
        throw new Error(`Failed to create branch '${newBranchName}': Unknown error`)
      }
      logger.error(`Error checking branch '${newBranchName}': ${error.response?.data?.message || error.message}`)
      throw error
    }
  }

  /**
   * Orchestrates the creation of a repository, pushing a workflow file, triggering the workflow, and setting up a webhook.
   * @param {string} newRepoName - Name of the new repository.
   * @param {string} templateRepoName - Name of the template repository to use.
   * @param {Record<string, string | number>} workflowInputs - Optional inputs for the workflow.
   * @returns The HTML URL of the created repository or null if it already exists.
   */
  public static async createAndTriggerWorkflow(
    newRepoName: string,
    templateRepoName: string,
    workflowInputs: Record<string, string | number> = {},
  ): Promise<string | null> {
    const workflowFilePath: string = '.github/workflows/init-update-files-and-push.yaml'
    const workflowFileName: string = 'init-update-files-and-push.yaml'
    const branch: string = 'develop'

    // Step 1: Create the repository
    const repoUrl: string | null = await this.createRepositoryFromTemplate(newRepoName, templateRepoName, {
      private: false,
    })
    if (!repoUrl) {
      return null // Repository already exists
    }

    // Step 2: Create main and staging branches
    await TimeService.retry((): Promise<boolean> => this.createBranch(newRepoName, 'main', branch), 5)
    await TimeService.retry((): Promise<boolean> => this.createBranch(newRepoName, 'staging', branch), 5)

    // Step 3: Configure the webhook at the organization level
    if (process.env.NODE_ENV === 'production') {
      try {
        await this.createOrgWebhook(['workflow_run'])
      } catch (error: any) {
        logger.error(`Failed to create webhook: ${error.message}`)
        throw error
      }
    }

    // Step 4: Retrieve the workflow file from the template
    let workflowContent: string
    try {
      workflowContent = await TimeService.retry(
        (): Promise<string> => this.getWorkflowFileContent(templateRepoName, workflowFilePath, branch),
        5,
      )
    } catch (error: any) {
      logger.error(`Final failure retrieving workflow file: ${error.message}`)
      throw error
    }

    // Step 5: Push the workflow file to the new repository
    try {
      await this.pushFileToRepo({
        repo: newRepoName,
        filePath: workflowFilePath,
        content: workflowContent,
        commitMessage: 'Add workflow file from template',
        branch,
      })
    } catch (error: any) {
      logger.error(`Failed to push workflow file: ${error.message}`)
      throw error
    }

    try {
      await TimeService.retry(
        (): Promise<void> =>
          this.pushFileToRepo({
            repo: newRepoName,
            filePath: workflowFilePath,
            content: workflowContent,
            commitMessage: 'Add workflow file from template',
            branch,
          }),
        5,
      )
    } catch (error: any) {
      logger.error(`Failed to push workflow file: ${error.message}`)
      throw error
    }

    // Step 6: Trigger the workflow
    try {
      await TimeService.retry(
        (): Promise<boolean> => this.triggerWorkflow(newRepoName, workflowFileName, branch, workflowInputs),
        5,
      )
      return repoUrl
    } catch (error: any) {
      logger.error(`Failed to trigger workflow: ${error.message}`)
      throw error
    }
  }

  /**
   * Protects the branches "Main", "Staging" and "Develop" with the requested rules.
   * @param {string} repo - The name of Repository.
   * @returns {Promise<void>} A promise that is resolved after the protection of the branches.
   */
  public static async protectBranches(repo: string): Promise<void> {
    const branches: string[] = ['main', 'staging', 'develop']
    const protectionRules: any = {
      required_pull_request_reviews: {
        required_approving_review_count: 1, // Requires at least 1 approval for merge
      },
      lock_branch: true, // Make the branch in reading alone
    }

    try {
      for (const branch of branches) {
        const url: string = `${this.GITHUB_API_URL}/repos/${this.GITHUB_USERNAME_OR_ORGANIZATION}/${repo}/branches/${branch}/protection`
        await axios.put(url, protectionRules, {
          headers: this.AUTH_HEADER,
        })
        logger.info(`Successfully applied protection on the branch "${branch}" of repository "${repo}".`)
      }
    } catch (error: any) {
      console.log(error.response)
      logger.error('Error when protecting branches:' + error.response?.data || error.message)
      throw error
    }
  }
}
