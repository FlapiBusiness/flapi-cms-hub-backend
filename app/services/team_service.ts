import Team from '#models/team'
import User from '#models/user'

/**
 * Service class for managing teams
 */
export default class TeamService {
  /**
   * Get all teams
   * @returns {Promise<Team[]>} - A promise that resolves with an array of teams
   */
  public static async getAllTeams(): Promise<Team[]> {
    return Team.all()
  }

  /**
   * Get a team by ID
   * @param {number} teamId - The ID of the team
   * @returns {Promise<Team>} - A promise that resolves with the team
   */
  public static async getTeamById(teamId: number): Promise<Team> {
    return await Team.query().where('id', teamId).preload('users').firstOrFail()
  }

  /**
   * Create a new team
   * @param {string} data - The data to create the team
   * @param {string} data.name - The name of the team
   * @param {string} data.description - The description of the team
   * @returns {Promise<Team>} - A promise that resolves with the created team
   */
  public static async createTeam(data: { name: string; description?: string }): Promise<Team> {
    const team: Team = new Team()
    team.name = data.name
    team.description = data.description
    await team.save()
    return team
  }

  /**
   * Update a team
   * @param {number} teamId - The ID of the team
   * @param {string} data - The data to update the team
   * @param {string} data.name - The new name of the team
   * @param {string} data.description - The new description of the team
   * @returns {Promise<Team>} - A promise that resolves with the updated team
   */
  public static async updateTeam(teamId: number, data: { name?: string; description?: string }): Promise<Team> {
    const team: Team = await Team.findOrFail(teamId)
    await team
      .merge({
        name: data.name,
        description: data.description,
      })
      .save()
    return team
  }

  /**
   * Delete a team
   * @param {number} teamId - The ID of the team
   */
  public static async deleteTeam(teamId: number): Promise<void> {
    const team: Team = await Team.findOrFail(teamId)
    await team.delete()
  }

  /**
   * Add a user to a team
   * @param {number} teamId - The ID of the team
   * @param {number} userId - The ID of the user
   * @param {string} role - The role of the user in the team
   * @returns {Promise<Team>} - A promise that resolves with the updated team
   */
  public static async addUserToTeam(teamId: number, userId: number, role: string = 'member'): Promise<Team> {
    const team: Team = await Team.findOrFail(teamId)
    await User.findOrFail(userId)
    await team.related('users').attach({ [userId]: { role } })
    return team
  }

  /**
   * Remove a user from a team
   * @param {number} teamId - The ID of the team
   * @param {number} userId - The ID of the user
   * @returns {Promise<Team>} - A promise that resolves with the updated team
   */
  public static async removeUserFromTeam(teamId: number, userId: number): Promise<Team> {
    const team: Team = await Team.findOrFail(teamId)
    await team.related('users').detach([userId])
    return team
  }

  /**
   * Update the role of a user in a team.
   * @param {number} teamId - The ID of the team
   * @param {number} userId - The ID of the user
   * @param {string} newRole - The new role of the user in the team
   * @returns {Promise<Team>} - A promise that resolves with the updated team
   */
  public static async updateUserRole(teamId: number, userId: number, newRole: string): Promise<Team> {
    const team: Team = await Team.findOrFail(teamId)
    await team.related('users').sync({ [userId]: { role: newRole } }, false)
    return team
  }
}
