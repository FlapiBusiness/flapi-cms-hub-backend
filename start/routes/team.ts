import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

const TeamController = () => import('#controllers/teams_controller')

/**
 * Route to get all teams
 */
router.get('/teams', [TeamController, 'getAllTeams'])

/**
 * Route to get a team by ID
 */
router.get('/teams/:id', [TeamController, 'getTeamById'])

/**
 * Route to get all teams for a user
 */
router.get('teams/user/:user_id', [TeamController, 'getTeamsByUserId'])

/**
 * Route to create a team
 */
router.post('/teams', [TeamController, 'create']).use(middleware.auth())

/**
 * Route to update a team
 */
router.put('/teams/:id', [TeamController, 'update'])

/**
 * Route to delete a team
 */
router.delete('/teams/:id', [TeamController, 'delete']).use(middleware.auth())

/**
 * Route to add a user to a team
 */
router.post('/teams/:team_id/users', [TeamController, 'addUserToTeam'])

/**
 * Route to remove a user from a team
 */
router.delete('/teams/:team_id/users/:user_id', [TeamController, 'removeUserFromTeam'])

/**
 * Route to update a user's role in a team
 */
router.put('/teams/:team_id/users/:user_id/role', [TeamController, 'updateUserRole'])
