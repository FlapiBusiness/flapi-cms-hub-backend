/**
 * CheckDomainAvailabilityPayload
 * @property {string} domain - Le domaine à vérifier.
 */
export interface CheckDomainAvailabilityPayload {
  domain: string
}

/**
 * CheckSubDomainAvailabilityPayload
 * @property {string} subdomain - Le sous-domaine à vérifier.
 */
export interface CheckSubDomainAvailabilityPayload {
  subdomain: string
}
