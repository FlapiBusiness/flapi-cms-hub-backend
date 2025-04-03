import vine from '@vinejs/vine'
import { domainValidator } from '#validators/domain_validator'

/**
 * Validation rules for the login form.
 */
// eslint-disable-next-line @typescript-eslint/typedef
export const checkDomainAvailabilityValidator = vine.compile(
  vine.object({
    domain: domainValidator,
  }),
)
