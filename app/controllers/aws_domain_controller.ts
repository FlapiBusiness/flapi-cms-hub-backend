import AWSDomainService from '#services/aws_domain_service'
import type { HttpContext } from '@adonisjs/core/http'
import logger from '@adonisjs/core/services/logger'

/**
 * Contrôleur pour gérer les opérations liées aux domaines AWS via Route 53.
 * @class AWSDomainController
 */
export default class AWSDomainController {
  /**
   * Vérifie si un domaine est disponible via AWS Route 53 Domains.
   * @param {HttpContext} ctx - Le contexte HTTP.
   * @returns {Promise<void>} - La réponse avec la disponibilité du domaine.
   */
  public async checkDomainAvailability({ request, response }: HttpContext): Promise<void> {
    // TODO: Add validator
    const domain: string = request.input('domain')

    try {
      const isAvailable: boolean = await AWSDomainService.checkDomainAvailability(domain)
      response.status(200).json({ domain, isAvailable })
    } catch (error) {
      logger.error('Erreur lors de la vérification du domaine:', error)
      response.status(500).json({ message: 'Erreur lors de la vérification de la disponibilité du domaine.' })
    }
  }

  /**
   * Vérifie si un sous domaine est disponible via AWS Route 53 Domains.
   * @param {HttpContext} ctx - Le contexte HTTP.
   * @returns {Promise<void>} - La réponse avec la disponibilité du domaine.
   */
  public async checkSubDomainAvailability({ request, response }: HttpContext): Promise<void> {
    // TODO: Ajouter le validator
    const hostedZoneId: string = request.input('hostedZoneId')
    const subdomain: string = request.input('subdomain')
    const domain: string = request.input('domain')

    try {
      const isAvailable: boolean = await AWSDomainService.checkSubdomainAvailability(hostedZoneId, subdomain, domain)
      response.status(200).json({ subdomain, isAvailable })
    } catch (error) {
      logger.error('Erreur lors de la vérification du domaine:', error)
      response.status(500).json({ message: 'Erreur lors de la vérification de la disponibilité du domaine.' })
    }
  }
}
