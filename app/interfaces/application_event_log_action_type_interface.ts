/**
 * Payload for creating an application event log.
 * This interface defines the structure of the data that is required to create a new application event log.
 * @param {number} [user_id] - The ID of the user associated with the event log.
 * @param {number} [project_id] - The ID of the project associated with the event log.
 * @param {string} action_type - The type of action that triggered the event log. (e.g., 'CREATE', 'UPDATE', etc.)
 * @param {string} message - A message describing the event that occurred.
 */
export interface CreateApplicationEventLogPayload {
  user_id?: number
  project_id?: number
  action_type: string
  message: string
}
