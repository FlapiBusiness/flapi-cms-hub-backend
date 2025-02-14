/**
 * Interface for AWS Domain Response
 * @interface AwsDomainResponse
 * @param {string} domain - The domain name
 * @param {boolean} isAvailable - The domain availability
 */
export interface AwsDomainResponse {
  domain: string
  isAvailable: boolean
}

/**
 * Interface for AWS SubDomain Response
 * @interface AwsSubDomainResponse
 * @param {string} subdomain - The subdomain name
 * @param {boolean} isAvailable - The subdomain availability
 */
export interface AwsSubDomainResponse {
  subdomain: string
  isAvailable: boolean
}
