import AWSDomainService from '#services/aws_domain_service'
import env from '#start/env'
import BadRequestException from '#exceptions/bad_request_exception'
import O2SwitchService from '#services/o2switch_service'
import { delay, GitHubService } from '#services/github_service'
import InternalServerErrorException from '#exceptions/internal_server_error_exception'
import { ProjectSetupStep } from '#enums/project_setup_step'
import ProjectSetupService from '#services/project_setup_service'
import type { CreateProjectSetupPayload } from '#interfaces/project_setup_interface'
import { ProjectSetupStatus } from '#enums/project_setup_status'
import type { CreateProjectPayload } from '#interfaces/project_interface'

/**
 * Service to manage the project setup.
 * @class ClientService
 */
export default class ClientService {
  private static readonly environments: string[] = ['dev.', 'staging.', '']
  private static readonly suffixes: string[] = ['', '.api']

  /**
   * Create new application
   * @param {number} projectId - The ID of the project.
   * @param {CreateProjectPayload} payload - The payload containing customer and project names.
   * @returns {Promise<void>} A promise that resolves when the application is created.
   */
  public static async createNewApplication(projectId: number, payload: CreateProjectPayload): Promise<void> {
    // Step 0: await 5 seconds to await frontend redirection
    await delay(5000)
    await this.updateProjectSetupStep(projectId, ProjectSetupStep.SETUP_STARTED)
    // Step 1: Check if the subdomains already exist
    await this.checkSubdomainsAlreadyExist(projectId, payload.domain_name)
    // Step 2: Create the subdomains on AWS for the DEV, Staging and Prod environments
    await this.createSubdomains(projectId, payload.domain_name)
    // Step 3: Create databases on O2SWitch
    await this.createDatabases(projectId, payload)
    // Step 4: Create GitHub repositories
    await this.createGitHubRepositories(projectId, payload)
    // Step 5: Trigger workflows
    const triggerGitHubWorkflowsStartTime: number = Date.now()
    await this.triggerGitHubWorkflows(projectId, payload)
    const triggerGitHubWorkflowsEndTime: number = Date.now()
    const triggerGitHubWorkflowsDuration: number = triggerGitHubWorkflowsEndTime - triggerGitHubWorkflowsStartTime
    console.log({
      TRIGGER_GITHUB_WORKFLOWS_DURATION: (triggerGitHubWorkflowsDuration / 1000).toFixed(2),
    })
    // // Step 6: Update the project setup step to complete
    // await this.updateProjectSetupStep(projectId, ProjectSetupStep.SETUP_DONE, ProjectSetupStatus.COMPLETED)
  }

  /**
   * Check if the subdomains already exist in the AWS Route 53 hosted zone.
   * @param {number} projectId - The ID of the project.
   * @param {string} fullDomain - The full domain name (e.g., example.com).
   * @throws {BadRequestException} If the subdomain already exists.
   * @returns {Promise<void>} A promise that resolves if the subdomain does not exist.
   */
  private static async checkSubdomainsAlreadyExist(projectId: number, fullDomain: string): Promise<void> {
    try {
      await this.updateProjectSetupStep(projectId, ProjectSetupStep.VERIFY_SUBDOMAINS)
      for (const environment of this.environments) {
        for (const suffix of this.suffixes) {
          const subdomain: string = `${environment}${AWSDomainService.extractSubdomain(fullDomain)}${suffix}.${env.get('AWS_DOMAIN_FLAPI')}`
          const subdomainExists: boolean = await AWSDomainService.checkSubdomainAvailability(subdomain)
          if (subdomainExists) {
            throw new BadRequestException({
              message: `Le sous-domaine ${subdomain} est déjà utilisé.`,
            })
          }
        }
      }
      await this.updateProjectSetupStep(projectId, ProjectSetupStep.VERIFY_SUBDOMAINS, ProjectSetupStatus.COMPLETED)
    } catch (error: any) {
      const errorMessage: string = error.message || 'Erreur lors de la vérification des sous-domaines'
      await this.updateProjectSetupStep(
        projectId,
        ProjectSetupStep.VERIFY_SUBDOMAINS,
        ProjectSetupStatus.FAILED,
        errorMessage,
      )

      throw new BadRequestException({
        message: errorMessage,
      })
    }
  }

  /**
   * Create subdomains on AWS for the DEV, Staging, and Prod environments.
   * @param {number} projectId - The ID of the project.
   * @param {string} fullDomain - The full domain name (e.g., example.com).
   * @returns {Promise<void>} A promise that resolves when the subdomains are created.
   */
  private static async createSubdomains(projectId: number, fullDomain: string): Promise<void> {
    try {
      await this.updateProjectSetupStep(projectId, ProjectSetupStep.CREATE_SUBDOMAINS)

      for (const environment of this.environments) {
        for (const suffix of this.suffixes) {
          const subdomain: string = `${environment}${AWSDomainService.extractSubdomain(fullDomain)}${suffix}.${env.get('AWS_DOMAIN_FLAPI')}`
          await AWSDomainService.createSubdomain(subdomain)
        }
      }

      await this.updateProjectSetupStep(projectId, ProjectSetupStep.CREATE_SUBDOMAINS, ProjectSetupStatus.COMPLETED)
    } catch (error: any) {
      const errorMessage: string = error.message || 'Erreur lors de la création des sous-domaines'
      await this.updateProjectSetupStep(
        projectId,
        ProjectSetupStep.CREATE_SUBDOMAINS,
        ProjectSetupStatus.FAILED,
        errorMessage,
      )
      throw new InternalServerErrorException(errorMessage)
    }
  }

  /**
   * Create databases on O2Switch for the specified environments.
   * @param {number} projectId - The ID of the project.
   * @param {CreateProjectPayload} payload - The payload containing customer and project names.
   * @returns {Promise<void>} A promise that resolves when the databases are created.
   */
  private static async createDatabases(projectId: number, payload: CreateProjectPayload): Promise<void> {
    try {
      await this.updateProjectSetupStep(projectId, ProjectSetupStep.CREATE_DATABASE)
      const databaseEnvironments: string[] = ['development-remote', 'staging', 'production']
      for (const dbEnv of databaseEnvironments) {
        const dbName: string = `${payload.customer_name}-${payload.application_name}_${dbEnv}`
        await O2SwitchService.createDatabase(dbName)
      }
      await this.updateProjectSetupStep(projectId, ProjectSetupStep.CREATE_DATABASE, ProjectSetupStatus.COMPLETED)
    } catch (error: any) {
      const errorMessage: string = error.message || 'Erreur lors de la création des bases de données'
      await this.updateProjectSetupStep(
        projectId,
        ProjectSetupStep.CREATE_DATABASE,
        ProjectSetupStatus.FAILED,
        errorMessage,
      )
      throw new InternalServerErrorException(errorMessage)
    }
  }

  /**
   * Create GitHub repositories from templates.
   * @param {number} projectId - The ID of the project.
   * @param {CreateProjectPayload} payload - The payload containing repository details.
   * @returns {Promise<void>} A promise that resolves when the repositories are created.
   */
  private static async createGitHubRepositories(projectId: number, payload: CreateProjectPayload): Promise<void> {
    try {
      await this.updateProjectSetupStep(projectId, ProjectSetupStep.CREATE_REPOSITORIES)
      const newDescriptionRepo: string = `Application ${payload.application_name} for ${payload.customer_name}`
      const newPrivateRepo: boolean = false

      for (const repo of this.getGitHubRepositories(payload)) {
        const isCreated: boolean = await GitHubService.createRepositoryFromTemplate(repo.template, repo.name, {
          description: newDescriptionRepo,
          private: newPrivateRepo,
        })
        if (!isCreated) {
          throw new InternalServerErrorException(`Impossible de créer le repository "${repo.name}".`)
        }

        // Wait 15 seconds to let GitHub finalize the creation of repositories
        await delay(15000)

        await GitHubService.triggerWorkflowIndexingCommit(repo.name)
      }

      await this.updateProjectSetupStep(projectId, ProjectSetupStep.CREATE_REPOSITORIES, ProjectSetupStatus.COMPLETED)
    } catch (error: any) {
      const errorMessage: string = error.message || 'Erreur lors de la création des repositories GitHub'
      await this.updateProjectSetupStep(
        projectId,
        ProjectSetupStep.CREATE_REPOSITORIES,
        ProjectSetupStatus.FAILED,
        errorMessage,
      )
      throw new InternalServerErrorException(errorMessage)
    }
  }

  /**
   * Trigger GitHub workflows for the specified repositories.
   * @param {number} projectId - The ID of the project.
   * @param {CreateProjectPayload} payload - The payload containing workflow details.
   * @returns {Promise<void>} A promise that resolves when the workflows are triggered.
   */
  private static async triggerGitHubWorkflows(projectId: number, payload: CreateProjectPayload): Promise<void> {
    try {
      // Wait 30 seconds to let GitHub finalize the creation of repositories
      await delay(30000)

      await this.updateProjectSetupStep(projectId, ProjectSetupStep.DEPLOYMENT)
      const githubRepositories: { template: string; name: string }[] = this.getGitHubRepositories(payload)

      const workflowPath: string = '.github/workflows/init-update-files-and-push.yaml'
      const workflowBranch: string = 'develop'
      const workflowInputs: Record<string, string> = {
        customerName: this.sanitize(payload.customer_name),
        projectName: this.sanitize(payload.application_name),
        subdomain: this.sanitize(AWSDomainService.extractSubdomain(payload.domain_name)),
        categoryApp: 'default-category',
        longDescriptionApp: 'Longue description de l’application',
        shortDescriptionApp: 'Description courte',
      }

      for (const repo of githubRepositories) {
        const workflowTriggered: boolean = await GitHubService.triggerWorkflow(
          repo.name,
          workflowPath,
          workflowBranch,
          workflowInputs,
        )
        if (!workflowTriggered) {
          console.error(`Erreur lors du déclenchement du workflow pour le repository "${repo.name}".`)
          throw new InternalServerErrorException(
            `Le déclenchement du workflow pour le repository "${repo.name}" a échoué.`,
          )
        }
      }
      // Wait 4 minutes to let GitHub finalize the deployment
      await delay(240000)
      await this.updateProjectSetupStep(projectId, ProjectSetupStep.DEPLOYMENT, ProjectSetupStatus.COMPLETED)
    } catch (error: any) {
      const errorMessage: string = error.message || 'Erreur lors du déclenchement des workflows'
      console.error('Error triggering GitHub workflows:', JSON.stringify(errorMessage, null, 2))
      await this.updateProjectSetupStep(projectId, ProjectSetupStep.DEPLOYMENT, ProjectSetupStatus.FAILED, errorMessage)
      throw new InternalServerErrorException(errorMessage)
    }
  }

  /**
   * Get the new repository names and templates.
   * @param {CreateProjectPayload} payload - The payload containing customer and project names.
   * @returns {Array<{ template: string; name: string }>} An array of objects containing template and name.
   */
  private static getGitHubRepositories(payload: CreateProjectPayload): { template: string; name: string }[] {
    const newRepoNameFrontend: string = `flapi-${this.sanitize(payload.customer_name)}-${this.sanitize(payload.application_name)}-frontend`
    const newRepoNameBackend: string = `flapi-${this.sanitize(payload.customer_name)}-${this.sanitize(payload.application_name)}-backend`

    const templateRepoFrontend: string = 'flapi-starterkit-frontend'
    const templateRepoBackend: string = 'flapi-starterkit-backend'

    return [
      { template: templateRepoFrontend, name: newRepoNameFrontend },
      { template: templateRepoBackend, name: newRepoNameBackend },
    ]
  }

  /**
   * Sanitize a string by converting it to lowercase and replacing spaces with hyphens.
   * @param {string} s - The string to sanitize.
   * @returns {string} The sanitized string.
   */
  private static readonly sanitize: (s: string) => string = (s: string): string => {
    return s
      .toLowerCase()
      .normalize('NFD') // décompose les caractères accentués
      .replace(/[\u0300-\u036f]/g, '') // supprime les accents
      .replace(/[^a-z0-9]+/g, '-') // remplace tout caractère non alphanumérique par un tiret
      .replace(/^-+|-+$/g, '') // supprime les tirets en début et fin
  }

  /**
   * Update the project setup step in the database.
   * @param {number} projectId - The ID of the project.
   * @param {ProjectSetupStep} step - The current setup step.
   * @param {ProjectSetupStatus} status - The status of the setup step.
   * @param {string} [message] - An optional message for the setup step.
   * @returns {Promise<void>} A promise that resolves when the update is complete.
   */
  private static async updateProjectSetupStep(
    projectId: number,
    step: ProjectSetupStep,
    status: ProjectSetupStatus = ProjectSetupStatus.IN_PROGRESS,
    message?: string,
  ): Promise<void> {
    const projectPayload: CreateProjectSetupPayload = {
      project_id: projectId,
      step,
      status,
      message: message || this.getMessageForProjectSetupStep(step),
    }

    await ProjectSetupService.createProjectSetup(projectPayload)
  }

  /**
   * Get the message for the current setup step.
   * @param {ProjectSetupStep} step - The current setup step.
   * @returns {string} The message for the current setup step.
   */
  private static getMessageForProjectSetupStep(step: ProjectSetupStep): string {
    switch (step) {
      case ProjectSetupStep.SETUP_STARTED:
        return 'Initialisation du projet... (quelques secondes)'
      case ProjectSetupStep.VERIFY_SUBDOMAINS:
        return 'Vérification des sous-domaines disponibles... (2 sec)'
      case ProjectSetupStep.CREATE_SUBDOMAINS:
        return 'Création des sous-domaines AWS... (2 sec)'
      case ProjectSetupStep.CREATE_DATABASE:
        return 'Création des bases de données O2Switch... (5-10 sec)'
      case ProjectSetupStep.CREATE_REPOSITORIES:
        return 'Création des repositories GitHub... (15-25 sec)'
      case ProjectSetupStep.DEPLOYMENT:
        return 'Déploiement de l’application... (4-6 min)'
      case ProjectSetupStep.SETUP_DONE:
        return 'Configuration terminée'
      case ProjectSetupStep.SETUP_FAILED:
        return 'Erreur pendant le setup'
      default:
        return ''
    }
  }
}
