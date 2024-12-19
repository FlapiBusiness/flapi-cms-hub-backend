import type { HttpContext } from '@adonisjs/core/http'
import { GitHubService, delay } from '#services/github_service'
import env from '#start/env'
import AWSDomainService from '#services/aws_domain_service'
import logger from '@adonisjs/core/services/logger'

/**
 * Contrôleur pour les actions liées à GitHub.
 * @class ClientController
 */
export default class ClientController {
  /**
   * Crée un repository GitHub à partir d'un template.
   * @param {HttpContext} ctx - Le contexte HTTP.
   * @returns {Promise<void>} Une réponse JSON indiquant le succès ou l'échec.
   */
  public async createNewApplication({ request, response }: HttpContext): Promise<void> {
    // TODO: Ajouter validator

    const {
      templateRepo,
      newRepoName,
      newDescriptionRepo,
      newPrivateRepo,
      workflowName,
      workflowBranch,
      subdomain,
      workflowInputs,
    } = request.only([
      'templateRepo',
      'newRepoName',
      'newDescriptionRepo',
      'newPrivateRepo',
      'workflowName',
      'workflowBranch',
      'workflowInputs',
      'subdomain',
    ])

    try {
      // Étape 1 : Créer les sous-domaines
      await AWSDomainService.createSubdomain(
        env.get('AWS_DOMAIN_FLAPI_HOSTED_ZONE_ID'),
        'dev.' + subdomain,
        env.get('AWS_DOMAIN_FLAPI'),
      )
      await AWSDomainService.createSubdomain(
        env.get('AWS_DOMAIN_FLAPI_HOSTED_ZONE_ID'),
        'staging.' + subdomain,
        env.get('AWS_DOMAIN_FLAPI'),
      )

      // Étape 2 : Créer le repository
      const success: boolean = await GitHubService.createRepositoryFromTemplate(templateRepo, newRepoName, {
        description: newDescriptionRepo,
        private: newPrivateRepo,
      })

      if (!success) {
        return response.status(500).json({
          success: false,
          message: 'Impossible de créer le repository.',
        })
      }

      // Attendre 15 secondes pour laisser le temps à GitHub de créer le repository
      await delay(15000)

      // Debug
      await GitHubService.listWorkflows(newRepoName)

      // Étape 3 : Déclencher le workflow
      const workflowSuccess: boolean = await GitHubService.triggerWorkflow(
        newRepoName,
        workflowName,
        workflowBranch,
        workflowInputs,
      )

      if (workflowSuccess) {
        return response.status(201).json({
          success: true,
          message: `Le repository "${newRepoName}" a été créé, et le workflow "${workflowName}" a été déclenché.`,
        })
      } else {
        return response.status(500).json({
          success: false,
          message: 'Le repository a été créé, mais le déclenchement du workflow a échoué.',
        })
      }
    } catch (error) {
      logger.error('Erreur dans GitHubController :', error.message)
      return response.status(500).json({
        success: false,
        message: 'Une erreur est survenue lors de la création du repository.',
        error: error.message,
      })
    }
  }
}
