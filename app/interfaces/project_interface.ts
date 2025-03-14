/**
 * UpdateProjectPayload
 * @property {string} application_name - The name of the application
 * @property {number} user_id - The ID of the user
 * @property {string} domain_name - The domain name
 * @property {number} file_id - The ID of the file
 * @property {number} database_id - The ID of the database
 */
export interface UpdateProjectPayload {
  application_name?: string
  user_id?: number
  domain_name?: string
  file_id?: number
  database_id?: number
}

/**
 * ProjectPayload
 * @property {string} application_name - The name of the application
 * @property {number} user_id - The ID of the user
 * @property {string} domain_name - The domain name
 * @property {number} file_id - The ID of the file
 * @property {number} database_id - The ID of the database
 */
export interface CreateProjectPayload {
  application_name: string
  user_id: number
  domain_name: string
  file_id: number
  database_id: number
}
