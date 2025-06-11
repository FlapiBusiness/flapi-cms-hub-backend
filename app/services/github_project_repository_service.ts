import GithubProjectRepository from '#models/github_project_repository'
import logger from '@adonisjs/core/services/logger'

/**
 * Service to manage GitHub project repositories.
 * This service provides methods to interact with the GitHubProjectRepository model.
 */
type CreateGithubProjectRepositoryPayload = {
  project_id: number
  repo_name: string
  repo_url: string
  type: 'frontend' | 'backend'
  deployed?: boolean
}

/**
 * Service to manage GitHub project repositories.
 * This service provides methods to interact with the GitHubProjectRepository model.
 */
export default class GithubProjectRepositoryService {
  /**
   * Get a GitHub project repository by its repository name.
   * @param {string} repoName - The name of the repository to search for.
   * @return {Promise<GithubProjectRepository | null>} - The GitHub project repository if found, otherwise null.
   */
  public static async getByRepoName(repoName: string): Promise<GithubProjectRepository | null> {
    return await GithubProjectRepository.findBy({
      repo_name: repoName,
    })
  }
  /**
   * Recover the ID of the project from the full name of the deposit.
   * @param {string} repositoryName - The name of the repository in the format "repo_name".
   * @return {number | null} - The ID of the project if found, otherwise null.
   */
  public static async getProjectIdWithGithubProjectRepositoryName(repositoryName: string): Promise<number | null> {
    const githubProjectRepository: GithubProjectRepository | null = await this.getByRepoName(repositoryName)

    if (!githubProjectRepository) {
      logger.warn(`Aucun projet trouvé pour le dépôt ${repositoryName}`)
      return null
    }

    return githubProjectRepository.project_id
  }

  /**
   * Update the deployed status of a GitHub project repository by its repository name.
   * @param {string} repoName - The name of the repository to update.
   * @param {boolean} deployed - The new deployed status to set.
   * @return {Promise<void>} - A promise that resolves when the update is complete.
   */
  public static async updateDeployedStatusByRepoName(repoName: string, deployed: boolean): Promise<void> {
    const githubProjectRepository: GithubProjectRepository | null = await this.getByRepoName(repoName)

    if (!githubProjectRepository) {
      logger.warn(`Aucun projet trouvé pour le dépôt ${repoName}`)
      return
    }

    githubProjectRepository.deployed = deployed
    await githubProjectRepository.save()
    logger.info(`Statut de déploiement mis à jour pour le dépôt ${repoName} : ${deployed}`)
  }

  /**
   * Create a new GitHub project repository.
   * @param {CreateGithubProjectRepositoryPayload} payload - The payload containing the details of the repository to create.
   * @return {Promise<GithubProjectRepository>} - The created GitHub project repository.
   */
  public static async createGithubProjectRepository(
    payload: CreateGithubProjectRepositoryPayload,
  ): Promise<GithubProjectRepository> {
    return await GithubProjectRepository.create(payload)
  }

  /**
   * Get all GitHub project repositories by project ID.
   * @param {number} projectId - The ID of the project to retrieve repositories for.
   * @return {Promise<GithubProjectRepository[]>} - An array of GitHub project repositories associated with the project.
   */
  public static async getAllGithubProjectRepositoriesByProjectId(
    projectId: number,
  ): Promise<GithubProjectRepository[]> {
    return GithubProjectRepository.query().where('project_id', projectId).orderBy('created_at', 'desc')
  }

  /**
   * Check if a project has been deployed by checking its associated GitHub repositories.
   * @param {number} projectId - The ID of the project to check.
   * @return {Promise<boolean>} - Returns true if any repository has been deployed, otherwise false.
   */
  public static async checkIfProjectHasBeenDeployed(projectId: number): Promise<boolean> {
    const projectGithubRepositories: GithubProjectRepository[] =
      await this.getAllGithubProjectRepositoriesByProjectId(projectId)

    // Check if any repository has been deployed
    return projectGithubRepositories.every((repository: GithubProjectRepository): boolean => repository.deployed)
  }
}
