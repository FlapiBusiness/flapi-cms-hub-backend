import vine from '@vinejs/vine'
import { domainValidator } from '#validators/domain_validator'

/**
 *  Manual type based on the diagram for typical the validator.
 */
export type CheckDomainAvailabilityPayload = {
  domain: string
}

/**
 * Validation rules for the login form.
 */
// eslint-disable-next-line @typescript-eslint/typedef
export const checkDomainAvailabilityValidator = vine.compile(
  vine.object({
    domain: domainValidator,
  }),
)
