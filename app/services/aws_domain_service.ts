import type {
  ChangeResourceRecordSetsCommandInput,
  ChangeResourceRecordSetsCommandOutput,
  HostedZone,
  ListHostedZonesCommandOutput,
  ListResourceRecordSetsCommandOutput,
  ResourceRecordSet,
} from '@aws-sdk/client-route-53'
import { ListHostedZonesCommand } from '@aws-sdk/client-route-53'
import { ListResourceRecordSetsCommand } from '@aws-sdk/client-route-53'
import { Route53Client, ChangeResourceRecordSetsCommand } from '@aws-sdk/client-route-53'
import type { CheckDomainAvailabilityCommandOutput } from '@aws-sdk/client-route-53-domains'
import { Route53DomainsClient, CheckDomainAvailabilityCommand } from '@aws-sdk/client-route-53-domains'
import env from '#start/env'
import logger from '@adonisjs/core/services/logger'

/**
 * Service pour gérer les sous-domaines et domaine AWS et vérifier la disponibilité des noms de domaine.
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
   * @param {string} domain - Le nom de domaine à vérifier (ex: domain.com).
   * @returns {Promise<boolean>} `true` si le domaine existe.
   */
  public static async checkDomainAvailability(domain: string): Promise<boolean> {
    try {
      const command: CheckDomainAvailabilityCommand = new CheckDomainAvailabilityCommand({ DomainName: domain })
      const response: CheckDomainAvailabilityCommandOutput = await this.domainsClient.send(command)

      // Le domaine est disponible uniquement si le statut est "AVAILABLE"
      return response.Availability !== 'AVAILABLE'
    } catch (error) {
      logger.error('Erreur lors de la vérification de la disponibilité du domaine via AWS :', error)
      throw error
    }
  }

  /**
   * Vérifie si un sous-domaine est disponible, en utilisant l'API Route 53.
   * @param {string} subdomain - Le sous-domaine à vérifier (ex: subdomain.domain.com).
   * @returns {Promise<boolean>} `true` si le sous-domaine existe.
   */
  public static async checkSubdomainAvailability(subdomain: string): Promise<boolean> {
    try {
      const hostedZoneId: string | undefined = await this.getHostedZoneId(subdomain)
      const command: ListResourceRecordSetsCommand = new ListResourceRecordSetsCommand({
        HostedZoneId: hostedZoneId,
      })
      const response: ListResourceRecordSetsCommandOutput = await this.route53Client.send(command)

      // Vérifie si le sous-domaine est présent dans les enregistrements DNS
      const recordExists: boolean | undefined = response.ResourceRecordSets?.some(
        (record: ResourceRecordSet): boolean => record.Name === `${subdomain}.`, // Les noms dans Route 53 incluent un "." final
      )

      return recordExists || false
    } catch (error) {
      logger.error('Erreur lors de la vérification de la disponibilité du sous-domaine:', error)
      throw error
    }
  }

  /**
   * Crée un sous-domaine dans AWS Route 53.
   * @param {string} subdomain - Le sous-domaine à créer.
   * @returns {Promise<ChangeResourceRecordSetsCommandOutput>} Le résultat de la commande AWS.
   */
  public static async createSubdomain(subdomain: string): Promise<boolean> {
    const hostedZoneId: string | undefined = await this.getHostedZoneId(subdomain)
    const params: ChangeResourceRecordSetsCommandInput = {
      HostedZoneId: hostedZoneId,
      ChangeBatch: {
        Changes: [
          {
            Action: 'CREATE',
            ResourceRecordSet: {
              Name: subdomain,
              Type: 'A',
              TTL: 60,
              ResourceRecords: [
                {
                  Value: env.get('AWS_SERVER_LOADBALANCER_CLUSTER_K3S'), // FIXME: A terme remplacer par l'ip du load balancer réel de AWS
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

  /**
   * Récupère l'Hosted Zone ID pour un sous domaine donné.
   * @param {string} subdomain - Sous domaine (ex: subdomain.domain.com)
   * @returns {Promise<string | null>} - L'ID de la zone hébergée ou null si introuvable
   */
  public static async getHostedZoneId(subdomain: string): Promise<string | undefined> {
    try {
      const command: ListHostedZonesCommand = new ListHostedZonesCommand({})
      const response: ListHostedZonesCommandOutput = await this.route53Client.send(command)

      // Recherche la Hosted Zone ID correspondant au domaine principal dans la liste des zones hébergées sur AWS
      const hostedZone: HostedZone | undefined = response.HostedZones?.find(
        (zone: HostedZone): boolean => zone.Name === `${this.extractDomain(subdomain)}.`, // Les noms dans Route 53 incluent un "." final
      )
      if (!hostedZone?.Id) {
        logger.error(`Hosted Zone introuvable sur AWS pour le domaine : ${this.extractDomain(subdomain)}`)
        return undefined
      }

      return hostedZone.Id.replace('/hostedzone/', '')
    } catch (error) {
      console.error('Error fetching Hosted Zone ID:', error)
      return undefined
    }
  }

  /**
   * Extrait le domaine principal à partir d'un sous-domaine
   * @param {string} subdomain - Le sous-domaine (ex: subdomain.domain.com)
   * @returns {string} - Le domaine principal (ex: domain.com)
   */
  public static extractDomain(subdomain: string): string {
    const parts: string[] = subdomain.split('.')

    if (parts.length < 2) {
      // Retourne tel quel s'il n'y a pas de sous-domaine
      return subdomain
    }

    // Prend les deux derniers éléments (ex pour "subdomain.domain.com" => "domain.com")
    return parts.slice(-2).join('.')
  }

  /**
   * Extrait le sous-domaine à partir d'un sous-domaine complet
   * @param {string} subdomain - Le sous-domaine complet (ex: subdomain.domain.com)
   * @returns {string} - Le sous-domaine (ex: subdomain)
   */
  public static extractSubdomain(subdomain: string): string {
    const parts: string[] = subdomain.split('.')

    if (parts.length < 2) {
      // Retourne tel quel s'il n'y a pas de sous-domaine
      return subdomain
    }

    // Prend les deux premiers éléments (ex pour "subdomain.domain.com" => "subdomain")
    return parts[0]
  }
}
