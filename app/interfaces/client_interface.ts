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
export interface CreateNewApplicationPayload {
  customerName: string
  projectName: string
  fullDomain: string
  categoryApp: string
  longDescriptionApp: string
  shortDescriptionApp: string
}
