import vine from '@vinejs/vine'
import { domainValidator } from '#validators/domain_validator'

/**
 * Validation rules for the login form.
 */
// eslint-disable-next-line @typescript-eslint/typedef
export const createNewApplicationValidator = vine.compile(
  vine.object({
    customerName: vine.string().trim(),
    projectName: vine.string().trim(),
    fullDomain: domainValidator,
    categoryApp: vine.string().trim(),
    longDescriptionApp: vine.string().trim(),
    shortDescriptionApp: vine.string().trim(),
  }),
)
