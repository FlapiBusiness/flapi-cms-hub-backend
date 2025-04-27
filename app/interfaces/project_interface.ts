/**
 * UpdateProjectPayload
 * @property {number} [customer_user_id] - The ID of the customer user
 * @property {string} [customer_name] - The name of the customer
 * @property {string} [application_name] - The name of the application
 * @property {string} [domain_name] - The domain name
 * @property {string} [short_description] - A short description of the project
 * @property {string} [long_description] - A long description of the project
 * @property {string} [category] - The category of the project
 * @property {number} [project_setup_id] - The ID of the project setup
 */
export interface UpdateProjectPayload {
  application_name?: string
  user_id?: number
  domain_name?: string
  file_id?: number
  database_id?: number
  project_setup_id?: number
}

/**
 * CreateProjectPayload
 * @property {number} customer_user_id - The ID of the customer user
 * @property {string} customer_name - The name of the customer
 * @property {string} application_name - The name of the application
 * @property {string} domain_name - The domain name
 * @property {string} [short_description] - A short description of the project
 * @property {string} [long_description] - A long description of the project
 * @property {string} [category] - The category of the project
 * @property {number} [project_setup_id] - The ID of the project setup
 */
export interface CreateProjectPayload {
  customer_user_id: number
  customer_name: string
  application_name: string
  domain_name: string
  short_description?: string
  long_description?: string
  category?: string
  project_setup_id?: number
}
