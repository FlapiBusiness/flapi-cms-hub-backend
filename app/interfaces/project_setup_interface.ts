/**
 * CreateProjectSetupPayload
 * @property {number} project_id - The ID of the project.
 * @property {string} step - The current step in the project setup process.
 * @property {string} status - The status of the project setup.
 * @property {string} [message] - An optional message related to the project setup.
 */
export interface CreateProjectSetupPayload {
  project_id: number
  step: string
  status: string
  message?: string
}
