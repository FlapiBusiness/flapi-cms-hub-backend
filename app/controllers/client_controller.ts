import type { HttpContext } from '@adonisjs/core/http'
import { GitHubService, delay } from '#services/github_service'
import logger from '@adonisjs/core/services/logger'
import O2SwitchService from '#services/o2switch_service'
import AWSDomainService from '#services/aws_domain_service'
import env from '#start/env'
import { createNewApplicationValidator } from '#validators/create_new_application_validator'
import type { CreateNewApplicationPayload } from '#validators/create_new_application_validator'

/**
 * Contrôleur pour les actions liées à GitHub.
 * @class ClientController
 */
export default class ClientController {
  /**
   * @createNewApplication
   * @tag Client
   * @summary Créer une nouvelle application
   * @description Crée un repository GitHub à partir d'un template.
   * @requestBody <createNewApplicationValidator>
   * @conent application/json
   * @responseBody 201 - {"success": true, "message": "Les repositories ont été créés avec succès et les workflows ont été déclenchés."}
   * @responseBody 400 - {"success": false, "message": "Le sous-domaine est déjà utilisé."}
   * @responseBody 500 - {"success": false, "message": "Impossible de créer le repository."}
   * @responseBody 500 - {"success": false, "message": "Le déclenchement du workflow a échoué.", "error": "Error message"}
   * @responseBody 500 - {"success": false, "message": "Une erreur est survenue lors de la création du repository.", "error": "Error message"}
   */
  /**
   * Crée un repository GitHub à partir d'un template.
   * @param {HttpContext} ctx - Le contexte HTTP.
   * @returns {Promise<void>} Une réponse JSON indiquant le succès ou l'échec.
   */
  public async createNewApplication({ request, response }: HttpContext): Promise<void> {
    const payload: CreateNewApplicationPayload = await createNewApplicationValidator.validate(request.all())

    // Variables
    const templateRepoFrontend: string = 'flapi-starterkit-frontend'
    const templateRepoBackend: string = 'flapi-starterkit-backend'

    const newRepoNameFrontend: string = `flapi-${payload.customerName.toLowerCase()}-${payload.projectName.toLowerCase()}-frontend`
    const newRepoNameBackend: string = `flapi-${payload.customerName.toLowerCase()}-${payload.projectName.toLowerCase()}-backend`

    const newDescriptionRepo: string = `Application ${payload.projectName} for ${payload.customerName}`
    const newPrivateRepo: boolean = false

    const workflowName: string = '.github/workflows/init-update-files-and-push.yaml'
    const workflowBranch: string = 'develop'
    const workflowInputs: CreateNewApplicationPayload = {
      customerName: payload.customerName,
      projectName: payload.projectName,
      subdomain: payload.subdomain,
      categoryApp: payload.categoryApp,
      longDescriptionApp: payload.longDescriptionApp,
      shortDescriptionApp: payload.shortDescriptionApp,
    }

    const environments: string[] = ['dev.', 'staging.', ''] // '' = pour la production
    const suffixes: string[] = ['', '.api']

    try {
      // Étape 1 : Vérifier si les sous-domaines existent déjà
      for (const environment of environments) {
        for (const suffix of suffixes) {
          const subdomain2: string = `${environment}${payload.subdomain}${suffix}`
          const subdomainExists: boolean = await AWSDomainService.checkSubdomainAvailability(
            env.get('AWS_DOMAIN_FLAPI_HOSTED_ZONE_ID'),
            subdomain2,
            env.get('AWS_DOMAIN_FLAPI'),
          )
          if (subdomainExists) {
            response.status(400).json({
              success: false,
              message: `Le sous-domaine "${subdomain2}.${env.get('AWS_DOMAIN_FLAPI')}" est déjà utilisé.`,
            })
          }
        }
      }

      // Étape 2 : Créer les sous-domaines sur AWS
      for (const environment of environments) {
        // Créer le sous-domaine principal pour les environnements dev et staging
        for (const suffix of suffixes) {
          const subdomain2: string = `${environment}${payload.subdomain}${suffix}`
          await AWSDomainService.createSubdomain(
            env.get('AWS_DOMAIN_FLAPI_HOSTED_ZONE_ID'),
            subdomain2,
            env.get('AWS_DOMAIN_FLAPI'),
          )
        }
      }

      // Étape 3 : Créer les bases de données sur O2Switch
      const databaseEnvironments: string[] = ['development-remote', 'staging', 'production']
      for (const dbEnv of databaseEnvironments) {
        const dbName: string = `${payload.customerName}-${payload.projectName}_${dbEnv}`
        await O2SwitchService.createDatabase(dbName)
      }

      // Étape 4 : Créer les repositories GitHub
      const repositories: { template: string; name: string }[] = [
        { template: templateRepoFrontend, name: newRepoNameFrontend },
        { template: templateRepoBackend, name: newRepoNameBackend },
      ]

      for (const repo of repositories) {
        const isCreated: boolean = await GitHubService.createRepositoryFromTemplate(repo.template, repo.name, {
          description: newDescriptionRepo,
          private: newPrivateRepo,
        })
        if (!isCreated) {
          response.status(500).json({
            success: false,
            message: `Impossible de créer le repository "${repo.name}".`,
          })
        }
      }

      // Attendre 15 secondes pour laisser GitHub finaliser la création des repositories
      await delay(15000)

      // Étape 5 : Déclencher les workflows
      for (const repo of repositories) {
        const workflowTriggered: boolean = await GitHubService.triggerWorkflow(
          repo.template,
          workflowName,
          workflowBranch,
          workflowInputs,
        )
        if (!workflowTriggered) {
          response.status(500).json({
            success: false,
            message: `Le déclenchement du workflow pour le repository "${repo.name}" a échoué.`,
          })
        }
      }

      // Succès
      response.status(201).json({
        success: true,
        message: `Les repositories "${newRepoNameFrontend}" et "${newRepoNameBackend}" ont été créés avec succès et les workflows ont été déclenchés.`,
      })
    } catch (error) {
      logger.error('Erreur dans GitHubController :', {
        message: error.message,
        response: error.response ? error.response.data : 'No response body',
        status: error.response ? error.response.status : 'No status',
      })
      response.status(500).json({
        success: false,
        message: 'Une erreur est survenue lors de la création du repository.',
        error: error.message,
      })
    }
  }
}
