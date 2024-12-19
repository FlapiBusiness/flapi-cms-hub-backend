import {BaseSeeder} from "@adonisjs/lucid/seeders";
import {UserRoles} from "#enums/user_roles";
import UserRole from "#models/user_role";

export default class UserRoleSeeder extends BaseSeeder {
  public static environment: string[] = ['development', 'development-remote', 'test', 'staging', 'production']

  public async run(): Promise<void> {
    const roles: string[] = Object.values(UserRoles) as string[]

    for (const roleName of roles) {
      const data: { name: string } = { name: roleName }
      await UserRole.firstOrCreate({ name: data.name }, data)
    }
  }
}