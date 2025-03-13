import type { AxiosResponse } from 'axios'
import axios from 'axios'
import logger from '@adonisjs/core/services/logger'
import env from '#start/env'

/**
 * Représente les options pour la création d'un repository GitHub depuis un template.
 * @type {object} GitHubRepoCreateOptions
 * @property {string} [description] - La description du nouveau repository.
 * @property {boolean} [private=false] - Indique si le repository doit être privé.
 */
export type GitHubRepoCreateOptions = {
  description?: string
  private?: boolean
}

/**
 * Représente la requête pour créer un repository GitHub depuis un template.
 * @type {object} GitHubRepoCreateRequest
 * @property {string} owner - Le propriétaire du nouveau repository.
 * @property {string} name - Le nom du nouveau repository.
 * @property {string} [description] - La description du repository.
 * @property {boolean} [private=false] - Indique si le repository doit être privé.
 * @property {boolean} include_all_branches - Indique si toutes les branches doivent être incluses.
 */
type GitHubRepoCreateRequest = {
  owner: string
  name: string
  description?: string
  private?: boolean
  include_all_branches: boolean
}

/**
 * Représente l'en-tête d'authentification pour les requêtes à l'API GitHub.
 * @type {object} AuthHeader
 * @property {string} Authorization - Le jeton d'authentification.
 * @property {string} Accept - Le type de contenu accepté.
 */
type AuthHeader = {
  Authorization: string
  Accept: string
}

/**
 * Service pour interagir avec l'API GitHub et créer des repositories à partir de templates.
 */
export class GitHubService {
  private static readonly GITHUB_API_URL: string = 'https://api.github.com'
  private static readonly TOKEN: string = env.get('GITHUB_PERSONAL_ACCESS_TOKEN')
  private static readonly USERNAME: string = env.get('GITHUB_USERNAME_OR_ORGANIZATION')
  private static readonly AUTH_HEADER: AuthHeader = {
    Authorization: `token ${this.TOKEN}`,
    Accept: 'application/vnd.github+json',
  }

  /**
   * Crée un repository à partir d'un template GitHub.
   * @param {string} templateRepo - Le nom du repository template.
   * @param {string} newRepoName - Le nom du nouveau repository.
   * @param {GitHubRepoCreateOptions} [options] - Options supplémentaires pour le repository.
   * @returns {Promise<boolean>} Indique si le repository a été créé avec succès.
   */
  public static async createRepositoryFromTemplate(
    templateRepo: string,
    newRepoName: string,
    options: GitHubRepoCreateOptions = {},
  ): Promise<boolean> {
    const url: string = `${this.GITHUB_API_URL}/repos/${this.USERNAME}/${templateRepo}/generate`
    const data: GitHubRepoCreateRequest = {
      owner: this.USERNAME,
      name: newRepoName,
      description: options.description || '',
      private: options.private || false,
      include_all_branches: true,
    }

    try {
      const response: AxiosResponse<any, any> = await axios.post(url, data, {
        headers: this.AUTH_HEADER,
      })

      // Si la réponse est réussie, retourne true
      return response.status === 201
    } catch (error: any) {
      logger.error('Erreur lors de la création du repository :' + error.response?.data || error.message)
      throw error
    }
  }

  /**
   * Déclenche un workflow GitHub Actions.
   * @param {string} repo - Nom du repository.
   * @param {string} workflowName - Nom du fichier YAML du workflow.
   * @param {string} ref - Branche cible (ex: "main").
   * @param {Record<string, string>} inputs - Les entrées du workflow.
   * @returns {Promise<boolean>} Indique si le workflow a été déclenché avec succès.
   */
  public static async triggerWorkflow(
    repo: string,
    workflowName: string,
    ref: string,
    inputs: Record<string, string>,
  ): Promise<boolean> {
    // Encoder le nom du fichier pour l'URL
    const encodedWorkflowName: string = encodeURIComponent(workflowName)
    const url: string = `${this.GITHUB_API_URL}/repos/${this.USERNAME}/${repo}/actions/workflows/${encodedWorkflowName}/dispatches`

    try {
      const response: AxiosResponse<any, any> = await axios.post(
        url,
        { ref, inputs },
        {
          headers: this.AUTH_HEADER,
        },
      )

      return response.status === 204 // Succès si 204
    } catch (error: any) {
      logger.error('Erreur lors du déclenchement du workflow :' + error.response?.data || error.message)
      throw error
    }
  }

  /**
   * Liste les workflows disponibles pour un repository.
   * @param {string} repo - Nom du repository.
   * @returns {Promise<void>}
   */
  public static async listWorkflows(repo: string): Promise<void> {
    const url: string = `${this.GITHUB_API_URL}/repos/${this.USERNAME}/${repo}/actions/workflows`

    try {
      const response: AxiosResponse<any, any> = await axios.get(url, {
        headers: this.AUTH_HEADER,
      })

      logger.info('Workflows disponibles :' + JSON.stringify(response.data))
    } catch (error: any) {
      logger.error('Erreur lors de la récupération des workflows :' + error.response?.data || error.message)
      throw error
    }
  }

  /**
   * Protège les branches "main", "staging" et "develop" avec les règles demandées.
   * @param {string} repo - Le nom du repository.
   * @returns {Promise<void>} Une promesse qui se résout après la protection des branches.
   */
  public static async protectBranches(repo: string): Promise<void> {
    const branches: string[] = ['main', 'staging', 'develop']
    const protectionRules: any = {
      required_pull_request_reviews: {
        required_approving_review_count: 1, // Requiert au moins 1 approbation pour le merge
      },
      lock_branch: true, // Rend la branche en lecture seule
    }

    try {
      for (const branch of branches) {
        const url: string = `${this.GITHUB_API_URL}/repos/${this.USERNAME}/${repo}/branches/${branch}/protection`
        await axios.put(url, protectionRules, {
          headers: this.AUTH_HEADER,
        })
        logger.info(`Protection appliquée avec succès sur la branche "${branch}" du repository "${repo}".`)
      }
    } catch (error: any) {
      logger.error('Erreur lors de la protection des branches :' + error.response?.data || error.message)
      throw error
    }
  }
}

/**
 * Attend un certain nombre de millisecondes avant de résoudre la promesse.
 * @param {number} ms - Le nombre de millisecondes à attendre.
 * @returns {Promise<void>} Une promesse résolue après le délai.
 */
export const delay: (ms: number) => Promise<void> = (ms: number): Promise<void> => {
  return new Promise((resolve: any) => setTimeout(resolve, ms))
}
