import AWSDomainService from '#services/aws_domain_service'
import type { HttpContext } from '@adonisjs/core/http'
import logger from '@adonisjs/core/services/logger'
import { checkDomainAvailabilityValidator } from '#validators/check_domain_availability_validator'
import { checkSubDomainAvailabilityValidator } from '#validators/check_sub_domain_availability_validator'
import type { CheckDomainAvailabilityPayload } from '#validators/check_domain_availability_validator'
import type { CheckSubDomainAvailabilityPayload } from '#validators/check_sub_domain_availability_validator'

/**
 * Contrôleur pour gérer les opérations liées aux domaines AWS via Route 53.
 * @class AWSDomainController
 */
export default class AWSDomainController {
  /**
   * @checkDomainAvailability
   * @operationId checkDomainAvailability
   * @tag AWS Domain
   * @summary Vérifie la disponibilité d'un domaine
   * @description Vérifie si un domaine est disponible via AWS Route 53 Domains
   * @requestBody <checkDomainAvailabilityValidator>
   * @required domain
   * @content application/json
   * @responseBody 200 - <AwsDomainResponse>
   * @responseBody 500 - <MessageResponse>
   */
  /**
   * Vérifie si un domaine est disponible via AWS Route 53 Domains.
   * @param {HttpContext} ctx - Le contexte HTTP.
   * @returns {Promise<void>} - La réponse avec la disponibilité du domaine.
   */
  public async checkDomainAvailability({ request, response }: HttpContext): Promise<void> {
    const payload: CheckDomainAvailabilityPayload = await checkDomainAvailabilityValidator.validate(request.all())
    try {
      const isAvailable: boolean = await AWSDomainService.checkDomainAvailability(payload.domain)
      response.status(200).json({ domain: payload.domain, isAvailable })
    } catch (error) {
      logger.error('Erreur lors de la vérification du domaine:', error)
      response.status(500).json({ message: 'Erreur lors de la vérification de la disponibilité du domaine.' })
    }
  }

  /**
   * @checkSubDomainAvailability
   * @operationId checkSubDomainAvailability
   * @tag AWS Domain
   * @summary Vérifie la disponibilité d'un sous-domaine
   * @description Vérifie si un sous-domaine est disponible via AWS Route 53 Domains
   * @requestBody <checkSubDomainAvailabilityValidator>
   * @content application/json
   * @responseBody 200 - <AwsSubDomainResponse>
   * @responseBody 500 - <MessageResponse>
   */
  /**
   * Vérifie si un sous domaine est disponible via AWS Route 53 Domains.
   * @param {HttpContext} ctx - Le contexte HTTP.
   * @returns {Promise<void>} - La réponse avec la disponibilité du domaine.
   */
  public async checkSubDomainAvailability({ request, response }: HttpContext): Promise<void> {
    const payload: CheckSubDomainAvailabilityPayload = await checkSubDomainAvailabilityValidator.validate(request.all())

    try {
      const isAvailable: boolean = await AWSDomainService.checkSubdomainAvailability(
        payload.hostedZoneId,
        payload.subdomain,
        payload.domain,
      )
      response.status(200).json({ subdomain: payload.subdomain, isAvailable })
    } catch (error) {
      logger.error('Erreur lors de la vérification du domaine:', error)
      response.status(500).json({ message: 'Erreur lors de la vérification de la disponibilité du domaine.' })
    }
  }
}
