import router from '@adonisjs/core/services/router'

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
 * Route to create a team
 */
router.post('/teams', [TeamController, 'create'])

/**
 * Route to update a team
 */
router.put('/teams/:id', [TeamController, 'update'])

/**
 * Route to delete a team
 */
router.delete('/teams/:id', [TeamController, 'delete'])
