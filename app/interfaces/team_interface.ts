/**
 * CreateTeamPayload
 * @property {string} name - The name of the team
 * @property {string} description - The description of the team
 */
export interface CreateTeamPayload {
  name: string
  description?: string
}

/**
 * UpdateTeamPayload
 * @property {string} name - The name of the team
 * @property {string} description - The description of the team
 */
export interface UpdateTeamPayload {
  name: string
  description: string
}

/**
 * AddUserToTeamPayload
 * @property {number} user_id - The ID of the user
 * @property {string} role - The role of the user
 */
export interface AddUserToTeamPayload {
  user_id: number
  role: string
}

/**
 * UpdateUserRolePayload
 * @property {string} role - The role of the user
 */
export interface UpdateUserRolePayload {
  role: string
}
