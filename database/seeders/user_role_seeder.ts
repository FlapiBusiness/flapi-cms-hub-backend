import { BaseSeeder } from '@adonisjs/lucid/seeders'
import UserRoleModel from '#models/user_role'
import { UserRoles } from '#enums/user_roles'

export default class extends BaseSeeder {
  async run() {
    // Write your database queries inside the run method
    for (const roleKey in UserRoles) {
      // Vérifier si l'enum est une valeur (et non une clé)
      if (Object.prototype.hasOwnProperty.call(UserRoles, roleKey)) {
        const roleName: string = UserRoles[roleKey as keyof typeof UserRoles]
        const data = { name: roleName }

        // Créer ou récupérer le rôle
        await UserRoleModel.firstOrCreate({ name: data.name }, data)
      }
    }
  }
}
