import { BaseSeeder } from '@adonisjs/lucid/seeders'
import User from '#models/user'
import Team from '#models/team'
import Project from '#models/project'

/**
 * Seeder to populate the pivot tables with dummy data
 * @class RelationsSeeder
 */
export default class RelationsSeeder extends BaseSeeder {
  /**
   * Run the seeder
   * @returns {Promise<void>} - A promise that resolves with no return value
   */
  public async run(): Promise<void> {
    const users: User[] = await User.all()
    const teams: Team[] = await Team.all()
    const projects: Project[] = await Project.all()

    // Attacher des équipes aux utilisateurs via la table pivot "user_team"
    for (const user of users) {
      const teamCount: number = Math.floor(Math.random() * 3) + 1
      const selectedTeams: Team[] = teams.sort(() => 0.5 - Math.random()).slice(0, teamCount)

      // Création d'un objet pivotData qui associe l'id de chaque équipe aux données pivot
      const pivotData: Record<number, { role: string }> = selectedTeams.reduce(
        (acc: Record<number, { role: string }>, team: Team) => {
          acc[team.id] = { role: 'member' }
          return acc
        },
        {} as Record<number, { role: string }>,
      )

      await user.related('teams').attach(pivotData)
    }

    // Attacher des projets aux équipes via la table pivot "team_project"
    for (const team of teams) {
      const projectCount: number = Math.floor(Math.random() * 3) + 1
      const selectedProjects: Project[] = projects.sort(() => 0.5 - Math.random()).slice(0, projectCount)
      await team.related('projects').attach(selectedProjects.map((project: Project) => project.id))
    }

    // Pour chaque utilisateur, attacher des permissions sur les projets de ses équipes (via "user_project_permissions")
    for (const user of users) {
      // On crée un Set pour stocker les IDs de projets déjà traités
      const uniqueProjectIds: Set<number> = new Set<number>()
      // On prépare un objet pour regrouper les données pivot
      const pivotData: Record<number, { has_access: boolean }> = {}

      // Récupère les équipes de l'utilisateur
      const userTeams: Team[] = await user.related('teams').query()

      for (const team of userTeams) {
        // Récupère les projets associés à cette équipe
        const teamProjects: Project[] = await team.related('projects').query()
        for (const project of teamProjects) {
          // Si ce projet n'a pas encore été ajouté, on le traite
          if (!uniqueProjectIds.has(project.id)) {
            uniqueProjectIds.add(project.id)
            // Définir l'accès (80 % de chance d'avoir accès)
            pivotData[project.id] = { has_access: Math.random() < 0.8 }
          }
        }
      }

      // Attache uniquement les projets uniques pour cet utilisateur
      await user.related('project_permissions').attach(pivotData)
    }
  }
}
