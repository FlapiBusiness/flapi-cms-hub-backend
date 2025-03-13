// app/Services/UserService.ts
import User from '#models/user'
import type { UpdateUserPayload } from '#validators/update_user_validator'

/**
 *
 */
export default class UserService {
  /**
   * Récupère tous les utilisateurs.
   */
  public static async getAllUsers(): Promise<User[]> {
    return await User.all()
  }

  /**
   * Récupère un utilisateur par son ID.
   */
  public static async getUserById(userId: number): Promise<User> {
    return await User.findOrFail(userId)
  }

  /**
   * Récupère les utilisateurs associés à un projet via la table pivot user_project_permissions.
   */
  /*public static async getUsersByProjectId(projectId: number): Promise<User[]> {
        return await User.query()
            .whereHas('projectPermissions', (query) => {
                query.where('project_id', projectId)
            })
    }*/

  /**
   * Met à jour un utilisateur.
   * @param userId - ID de l'utilisateur
   * @param data - Données à mettre à jour (nom, email, etc.)
   */
  public static async updateUser(userId: number, data: UpdateUserPayload): Promise<User> {
    const user: User = await User.findOrFail(userId)
    user.merge(data)
    await user.save()
    return user
  }

  /**
   * Supprime un utilisateur.
   * @param userId - ID de l'utilisateur à supprimer
   */
  public static async deleteUser(userId: number): Promise<void> {
    const user: User = await User.findOrFail(userId)
    await user.delete()
  }
}
