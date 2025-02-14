import vine from '@vinejs/vine'
import { domainValidator } from '#validators/domain_validator'

/**
 *  Manual type based on the diagram for typical the validator.
 */
export type CheckSubDomainAvailabilityPayload = {
  hostedZoneId: string
  subdomain: string
  domain: string
}

/**
 * Validation rules for the login form.
 */
// eslint-disable-next-line @typescript-eslint/typedef
export const checkSubDomainAvailabilityValidator = vine.compile(
  vine.object({
    hostedZoneId: vine.string().trim(),
    subdomain: domainValidator,
    domain: domainValidator,
  }),
)
