import { BaseSeeder } from '@adonisjs/lucid/seeders'
import UserRoleModel from '#models/user_role'
import { user_roles } from '#enums/user_roles'

export default class extends BaseSeeder {
  async run() {
    // Write your database queries inside the run method
    for (const roleKey in user_roles) {
      // Vérifier si l'enum est une valeur (et non une clé)
      if (Object.prototype.hasOwnProperty.call(user_roles, roleKey)) {
        const roleName: string = user_roles[roleKey as keyof typeof user_roles]
        const data = { name: roleName }

        // Créer ou récupérer le rôle
        await UserRoleModel.firstOrCreate({ name: data.name }, data)
      }
    }
  }
}
