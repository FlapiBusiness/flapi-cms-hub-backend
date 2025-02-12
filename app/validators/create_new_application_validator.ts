import vine from '@vinejs/vine'
import { domainValidator } from '#validators/domain_validator'

/**
 *  Manual type based on the diagram for typical the validator.
 */
export type CreateNewApplicationPayload = {
  customerName: string
  projectName: string
  subdomain: string
}

/**
 * Validation rules for the login form.
 */
// eslint-disable-next-line @typescript-eslint/typedef
export const createNewApplicationValidator = vine.compile(
  vine.object({
    customerName: vine.string().trim(),
    projectName: vine.string().trim(),
    subdomain: domainValidator,
  }),
)
