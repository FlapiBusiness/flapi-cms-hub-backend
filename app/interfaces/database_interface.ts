/**
 * Create a database payload
 * @property {string} name - The name of the database
 */
export interface CreateDatabasePayload {
  name: string
}

/**
 * Update a database payload
 * @property {string} name - The name of the database
 */
export interface UpdateDatabasePayload {
  name: string
}
