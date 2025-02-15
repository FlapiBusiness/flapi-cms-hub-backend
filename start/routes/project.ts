import router from '@adonisjs/core/services/router'

const ProjectController = () => import('#controllers/projects_controller')

/**
 * Route pour l'inscription d'un utilisateur
 */
router.post('/project', [ProjectController, 'create'])

/**
 * Route pour la récupération de tous les projets
 */
router.get('/projects', [ProjectController, 'getProjects'])

/**
 * Route pour la récupération d'un projet par ID
 */
router.get('/project/:id', [ProjectController, 'getProjectById'])

/**
 * Route pour la récupération d'un projet par ID utilisateur
 */
router.get('/project/user/:user_id', [ProjectController, 'getProjectByUserId'])

/**
 * Route pour la mise à jour d'un projet
 */
router.put('/project/:id', [ProjectController, 'updateProject'])

/**
 * Route pour la suppression d'un projet
 */
router.delete('/project/:id', [ProjectController, 'deleteProject'])
