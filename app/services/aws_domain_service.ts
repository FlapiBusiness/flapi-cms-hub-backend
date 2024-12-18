import type {
  ChangeResourceRecordSetsCommandInput,
  ChangeResourceRecordSetsCommandOutput,
  ListResourceRecordSetsCommandOutput,
  ResourceRecordSet,
} from '@aws-sdk/client-route-53'
import { ListResourceRecordSetsCommand } from '@aws-sdk/client-route-53'
import { Route53Client, ChangeResourceRecordSetsCommand } from '@aws-sdk/client-route-53'
import type { CheckDomainAvailabilityCommandOutput } from '@aws-sdk/client-route-53-domains'
import { Route53DomainsClient, CheckDomainAvailabilityCommand } from '@aws-sdk/client-route-53-domains'
import env from '#start/env'
import logger from '@adonisjs/core/services/logger'

/**
 * Service pour gérer les sous-domaines AWS et vérifier la disponibilité des noms de domaine.
 * @class AWSDomainService
 */
export default class AWSDomainService {
  /**
   * Client Route 53 pour la gestion des DNS.
   * @readonly
   */
  private static readonly route53Client: Route53Client = new Route53Client({
    credentials: {
      accessKeyId: env.get('AWS_ACCESS_KEY_ID'),
      secretAccessKey: env.get('AWS_SECRET_ACCESS_KEY'),
    },
    /**
     * Stackoverflow : https://stackoverflow.com/questions/73132198/what-does-getaddrinfo-enotfound-mean
     * OBLIGATOIRE : Cette région est obligatoire même si Route53 reste un service "Global".
     */
    region: 'us-east-1',
  })

  /**
   * Client Route 53 Domains pour vérifier la disponibilité des domaines.
   * @readonly
   */
  private static readonly domainsClient: Route53DomainsClient = new Route53DomainsClient({
    credentials: {
      accessKeyId: env.get('AWS_ACCESS_KEY_ID'),
      secretAccessKey: env.get('AWS_SECRET_ACCESS_KEY'),
    },
    /**
     * Stackoverflow : https://stackoverflow.com/questions/73132198/what-does-getaddrinfo-enotfound-mean
     * OBLIGATOIRE : Cette région est obligatoire même si Route53 reste un service "Global".
     */
    region: 'us-east-1',
  })

  /**
   * Vérifie si un domaine est disponible en utilisant l'API Route 53 Domains.
   * @param {string} domain - Le nom de domaine à vérifier.
   * @returns {Promise<boolean>} `true` si le domaine est disponible.
   */
  public static async checkDomainAvailability(domain: string): Promise<boolean> {
    const command: CheckDomainAvailabilityCommand = new CheckDomainAvailabilityCommand({ DomainName: domain })

    try {
      const response: CheckDomainAvailabilityCommandOutput = await this.domainsClient.send(command)
      // Le domaine est disponible uniquement si le statut est "AVAILABLE"
      return response.Availability === 'AVAILABLE'
    } catch (error) {
      logger.error('Erreur lors de la vérification de la disponibilité du domaine via AWS :', error)
      throw error
    }
  }

  /**
   * Vérifie si un sous-domaine est configuré dans AWS Route 53.
   * @param {string} hostedZoneId - L'ID de la zone hébergée Route 53.
   * @param {string} subdomain - Le sous-domaine à vérifier.
   * @param {string} domain - Le domaine principal associé.
   * @returns {Promise<boolean>} `true` si le sous-domaine existe.
   */
  public static async checkSubdomainAvailability(
    hostedZoneId: string,
    subdomain: string,
    domain: string,
  ): Promise<boolean> {
    try {
      const command: ListResourceRecordSetsCommand = new ListResourceRecordSetsCommand({
        HostedZoneId: hostedZoneId,
      })
      const response: ListResourceRecordSetsCommandOutput = await this.route53Client.send(command)
      const fullSubdomain: string = `${subdomain}.${domain}`

      // Vérifie si le sous-domaine est présent dans les enregistrements DNS
      const recordExists: boolean | undefined = response.ResourceRecordSets?.some(
        (record: ResourceRecordSet): boolean => record.Name === `${fullSubdomain}.`, // Les noms dans Route 53 incluent un "." final
      )

      return !recordExists
    } catch (error) {
      logger.error('Erreur lors de la vérification de la disponibilité du sous-domaine:', error)
      throw error
    }
  }

  /**
   * Crée un sous-domaine dans AWS Route 53.
   * @param {string} hostedZoneId - L'ID de la zone hébergée Route 53.
   * @param {string} subdomain - Le sous-domaine à créer.
   * @param {string} domain - Le domaine cible.
   * @returns {Promise<ChangeResourceRecordSetsCommandOutput>} Le résultat de la commande AWS.
   */
  public static async createSubdomain(hostedZoneId: string, subdomain: string, domain: string): Promise<boolean> {
    const params: ChangeResourceRecordSetsCommandInput = {
      HostedZoneId: hostedZoneId,
      ChangeBatch: {
        Changes: [
          {
            Action: 'CREATE',
            ResourceRecordSet: {
              Name: `${subdomain}.${domain}`,
              Type: 'A',
              TTL: 60,
              ResourceRecords: [
                {
                  Value: env.get('AWS_SERVER_CLUSTER_K3S'), // FIXME: A terme remplacer par le load balancer de AWS
                },
              ],
            },
          },
        ],
      },
    }

    try {
      const command: ChangeResourceRecordSetsCommand = new ChangeResourceRecordSetsCommand(params)
      const response: ChangeResourceRecordSetsCommandOutput = await this.route53Client.send(command)

      // Analyse la réponse pour déterminer si l'opération a réussi
      return response.ChangeInfo?.Status === 'PENDING' || response.ChangeInfo?.Status === 'INSYNC'
    } catch (error) {
      logger.error('Erreur lors de la création du sous-domaine:', error)
      throw error
    }
  }
}
