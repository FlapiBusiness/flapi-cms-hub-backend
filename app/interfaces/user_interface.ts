/**
 * Update a project Payload
 * @param {string} lastname - The lastname of the user
 * @param {string} firstname - The firstname of the user
 * @param {string} email - The email of the user
 * @param {string} password - The password of the user
 * @param {string} password_confirmation - The password confirmation of the user
 * @return {UpdateUserPayload}
 */
export interface UpdateUserPayload {
  lastname?: string
  firstname?: string
  email?: string
  password?: string
  password_confirmation?: string
}
