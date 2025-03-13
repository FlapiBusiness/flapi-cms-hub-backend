import vine from '@vinejs/vine'
import { domainValidator } from '#validators/domain_validator'

/**
 * Manual type based on the diagram for typical the validator.
 * @type {object} WorkflowInputs
 * @property {string} customerName - Le nom du client.
 * @property {string} projectName - Le nom du projet.
 * @property {string} fullDomain - Le domaine complet.
 * @property {string} categoryApp - La catégorie de l'application.
 * @property {string} longDescriptionApp - La description longue de l'application.
 * @property {string} shortDescriptionApp - La description courte de l'application.
 */
export type CreateNewApplicationPayload = {
  customerName: string
  projectName: string
  fullDomain: string
  categoryApp: string
  longDescriptionApp: string
  shortDescriptionApp: string
}

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
