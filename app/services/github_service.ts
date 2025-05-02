import type { AxiosResponse } from 'axios'
import axios from 'axios'
import logger from '@adonisjs/core/services/logger'
import env from '#start/env'

/**
 * Représente un workflow GitHub.
 * @type {object} GitHubWorkflow
 * @property {number} id - L'identifiant du workflow.
 * @property {string} node_id - L'identifiant du nœud du workflow.
 * @property {string} name - Le nom du workflow.
 * @property {string} path - Le chemin du fichier YAML du workflow.
 * @property {string} state - L'état du workflow (actif ou désactivé).
 * @property {string} created_at - La date de création du workflow (format ISO 8601).
 * @property {string} updated_at - La date de mise à jour du workflow (format ISO 8601).
 * @property {string} url - L'URL de l'API du workflow.
 * @property {string} html_url - L'URL du workflow sur GitHub.
 * @property {string} badge_url - L'URL du badge du workflow.
 */
export type GitHubWorkflow = {
  id: number
  node_id: string
  name: string
  path: string
  state: 'active' | 'disabled'
  created_at: string // ISO 8601 date
  updated_at: string // ISO 8601 date
  url: string
  html_url: string
  badge_url: string
}

/**
 * Représente la réponse de l'API GitHub pour la liste des workflows.
 * @type {object} GitHubWorkflowsResponse
 * @property {number} total_count - Le nombre total de workflows.
 * @property {GitHubWorkflow[]} workflows - La liste des workflows.
 */
export type GitHubWorkflowsResponse = {
  total_count: number
  workflows: GitHubWorkflow[]
}

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
   * Récupère le contenu d'un fichier d'un repository GitHub à une branche donnée.
   *
   * @param {string} repo - Le nom du repository GitHub (ex: "flapi-nomclient-nomprojet-backend").
   * @param {string} path - Le chemin complet du fichier à lire (ex: ".env").
   * @returns {Promise<string>} Le contenu décodé en UTF-8 du fichier.
   *
   * @throws {Error} En cas d'erreur lors de la requête HTTP (fichier introuvable, branche absente, etc.).
   */
  public static async getFileContent(repo: string, path: string): Promise<string> {
    const url: string = `${this.GITHUB_API_URL}/repos/${this.USERNAME}/${repo}/contents/${path}?ref=develop`
    const response: AxiosResponse<any, any> = await axios.get(url, {
      headers: this.AUTH_HEADER,
    })

    return Buffer.from(response.data.content, 'base64').toString('utf-8')
  }

  /**
   * Crée ou met à jour un fichier dans un repository GitHub.
   *
   * @param {Object} params - Paramètres pour la création du fichier.
   * @param {string} params.repo - Nom du repository dans lequel créer le fichier.
   * @param {string} params.path - Chemin complet du fichier à créer (ex : '.env').
   * @param {string} params.content - Contenu brut du fichier (non encodé).
   * @param {string} params.commitMessage - Message du commit associé à la création ou la modification du fichier.
   *
   * @returns {Promise<void>} Une promesse qui se résout une fois l’opération terminée.
   *
   * @throws {Error} En cas d’erreur lors de la requête à l’API GitHub.
   */
  public static async createFileInRepo({
    repo,
    path,
    content,
    commitMessage,
  }: {
    repo: string
    path: string
    content: string
    commitMessage: string
  }): Promise<void> {
    const url: string = `${this.GITHUB_API_URL}/repos/${this.USERNAME}/${repo}/contents/${path}`

    const data: {
      message: string
      content: string
      branch: string
    } = {
      message: commitMessage,
      content: Buffer.from(content).toString('base64'),
      branch: 'develop',
    }

    await axios.put(url, data, {
      headers: this.AUTH_HEADER,
    })
  }

  /**
   * Déclenche un workflow GitHub Actions.
   * @param {string} repo - Nom du repository.
   * @param {string} workflowPath - Nom du fichier YAML du workflow.
   * @param {string} ref - Branche cible (ex: "main").
   * @param {Record<string, string>} inputs - Les entrées du workflow.
   * @returns {Promise<boolean>} Indique si le workflow a été déclenché avec succès.
   */
  public static async triggerWorkflow(
    repo: string,
    workflowPath: string,
    ref: string,
    inputs: Record<string, string | number>,
  ): Promise<boolean> {
    // const workflow: GitHubWorkflow[] = await this.listWorkflows(repo)
    // const workflowId: number | undefined = workflow.find((w: GitHubWorkflow): boolean => w.path === workflowPath)?.id
    //
    console.log({
      inputs,
    })
    //
    // if (!workflowId) {
    //   const errorMessage: string = `Workflow "${workflowPath}" non trouvé dans le repository "${repo}".`
    //   logger.error(errorMessage)
    //   throw new Error(errorMessage)
    // }

    // Encoder le nom du fichier pour l'URL
    const encodedWorkflowPath: string = encodeURIComponent(workflowPath) // très important
    const url: string = `${this.GITHUB_API_URL}/repos/${this.USERNAME}/${repo}/actions/workflows/${encodedWorkflowPath}/dispatches`
    // const url: string = `${this.GITHUB_API_URL}/repos/${this.USERNAME}/${repo}/actions/workflows/${workflowId}/dispatches`

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
      console.error(error)
      logger.error('Erreur lors du déclenchement du workflow :' + error.response?.data || error.message)
      throw error
    }
  }

  /**
   * Liste les workflows disponibles pour un repository.
   * @param {string} repo - Nom du repository.
   * @returns {Promise<GitHubWorkflowsResponse>}
   */
  public static async listWorkflows(repo: string): Promise<GitHubWorkflow[]> {
    const url: string = `${this.GITHUB_API_URL}/repos/${this.USERNAME}/${repo}/actions/workflows`

    try {
      const response: AxiosResponse<GitHubWorkflowsResponse, any> = await axios.get(url, {
        headers: this.AUTH_HEADER,
      })

      logger.info('Workflows disponibles :' + JSON.stringify(response.data))
      return response.data.workflows
    } catch (error: any) {
      logger.error('Erreur lors de la récupération des workflows :' + error.response?.data || error.message)
      throw error
    }
  }

  /**
   * Déclenche un commit pour forcer l'indexation des workflows GitHub.
   * @param {string} repo - Nom du repository.
   * @returns {Promise<void>}
   */
  public static async triggerWorkflowIndexingCommit(repo: string): Promise<void> {
    const randomNumber: number = Math.floor(Math.random() * 1000000)
    const branchName: string = `workflow-index-${randomNumber}`
    const triggerFilePath: string = `.github/workflows/.trigger-indexing-${randomNumber}.md`
    const content: string = Buffer.from(`# Trigger GitHub workflows indexing\n`).toString('base64')

    try {
      // Crée la branche depuis develop
      const baseBranch: string = 'develop'
      const branchRes: AxiosResponse<any, any> = await axios.get(
        `${this.GITHUB_API_URL}/repos/${this.USERNAME}/${repo}/git/ref/heads/${baseBranch}`,
        { headers: this.AUTH_HEADER },
      )
      const sha: string = branchRes.data.object.sha

      await axios.post(
        `${this.GITHUB_API_URL}/repos/${this.USERNAME}/${repo}/git/refs`,
        {
          ref: `refs/heads/${branchName}`,
          sha,
        },
        { headers: this.AUTH_HEADER },
      )

      // Push du commit sur la nouvelle branche
      await axios.put(
        `${this.GITHUB_API_URL}/repos/${this.USERNAME}/${repo}/contents/${triggerFilePath}`,
        {
          message: 'chore: trigger workflow indexing',
          content,
          branch: branchName,
        },
        { headers: this.AUTH_HEADER },
      )

      logger.info(`Workflow indexing commit pushed to ${repo} on branch ${branchName}`)
    } catch (error: any) {
      console.error(error)
      logger.error('Erreur lors du commit trigger workflows :' + error.response?.data || error.message)
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
