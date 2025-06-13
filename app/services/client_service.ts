import AWSDomainService from '#services/aws_domain_service'
import env from '#start/env'
import BadRequestException from '#exceptions/bad_request_exception'
import O2SwitchService from '#services/o2switch_service'
import { GitHubService } from '#services/github_service'
import InternalServerErrorException from '#exceptions/internal_server_error_exception'
import { ProjectSetupStep } from '#enums/project_setup_step'
import ProjectSetupService from '#services/project_setup_service'
import type { CreateProjectSetupPayload } from '#interfaces/project_setup_interface'
import { ProjectSetupStatus } from '#enums/project_setup_status'
import type { CreateProjectPayload } from '#interfaces/project_interface'
import TimeService from '#services/time_service'
import GithubProjectRepositoryService from '#services/github_project_repository_service'

/**
 * Type representing the inputs for the GitHub workflow dispatch event.
 * @property {string} customerName - The name of the customer.
 * @property {string} projectName - The name of the project.
 * @property {string} subdomain - The subdomain for the project.
 * @property {string} categoryApp - The category of the application.
 * @property {string} longDescriptionApp - The long description of the application.
 * @property {string} shortDescriptionApp - The short description of the application.
 */
type WorkflowDispatchInputs = {
  customerName: string
  projectName: string
  subdomain: string
  categoryApp: string
  longDescriptionApp: string
  shortDescriptionApp: string
}

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
    await this.updateProjectSetupStep(projectId, ProjectSetupStep.SETUP_STARTED)
    // Step 1: Check if the subdomains already exist
    await this.checkSubdomainsAlreadyExist(projectId, payload.domain_name)
    // Step 2: Create the subdomains on AWS for the DEV, Staging and Prod environments
    await this.createSubdomains(projectId, payload.domain_name)
    // Step 3: Create databases on O2SWitch
    await this.createDatabases(projectId, payload)
    // Step 4: Create GitHub repositories
    await this.createGitHubRepositoriesAndTriggerWorkflow(projectId, payload)
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
        const dbName: string = `${this.sanitize(payload.customer_name)}-${this.sanitize(payload.application_name)}_${dbEnv}`
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
  private static async createGitHubRepositoriesAndTriggerWorkflow(
    projectId: number,
    payload: CreateProjectPayload,
  ): Promise<void> {
    try {
      const workflowInputs: WorkflowDispatchInputs = {
        customerName: payload.customer_name,
        projectName: payload.application_name,
        subdomain: payload.domain_name,
        categoryApp: 'categoryApp',
        longDescriptionApp: 'longDescriptionApp',
        shortDescriptionApp: 'shortDescriptionApp',
      }

      await this.updateProjectSetupStep(projectId, ProjectSetupStep.CREATE_REPOSITORIES)

      for (const repo of this.getGitHubRepositories(payload)) {
        const repoUrl: string | null = await GitHubService.createAndTriggerWorkflow(
          repo.name,
          repo.template,
          workflowInputs,
        )

        if (!repoUrl) {
          throw new InternalServerErrorException(`Impossible to create GitHub repository "${repo.name}".`)
        }

        await GithubProjectRepositoryService.createGithubProjectRepository({
          project_id: projectId,
          repo_name: repo.name,
          repo_url: repoUrl,
          type: repo.name.endsWith('-frontend') ? 'frontend' : 'backend',
          deployed: false,
        })
      }

      await this.updateProjectSetupStep(projectId, ProjectSetupStep.CREATE_REPOSITORIES, ProjectSetupStatus.COMPLETED)

      // sleep for 5 seconds to ensure repositories are created
      await TimeService.sleep(5000)
      await this.updateProjectSetupStep(projectId, ProjectSetupStep.DEPLOYMENT, ProjectSetupStatus.IN_PROGRESS)
    } catch (error: any) {
      const errorMessage: string = error.message || 'Error when creating GitHub repositories'
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
   * Get the new repository names and templates.
   * @param {CreateProjectPayload} payload - The payload containing customer and project names.
   * @returns {Array<{ template: string; name: string }>} An array of objects containing template and name.
   */
  private static getGitHubRepositories(payload: CreateProjectPayload): { template: string; name: string }[] {
    const newRepoNameFrontend: string = `flapi-${this.sanitize(payload.customer_name)}-${this.sanitize(payload.application_name)}-frontend`
    const newRepoNameBackend: string = `flapi-${this.sanitize(payload.customer_name)}-${this.sanitize(payload.application_name)}-backend`

    const templateRepoFrontend: string = 'flapi-cms-client-frontend'
    const templateRepoBackend: string = 'flapi-cms-client-backend'

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
  public static async updateProjectSetupStep(
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
        return 'Création des repositories GitHub... (40-55 sec)'
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
