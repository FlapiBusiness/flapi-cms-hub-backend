import router from '@adonisjs/core/services/router'

const ProjectController = () => import('#controllers/projects_controller')

/**
 * Route pour l'inscription d'un utilisateur
 */
router.post('/project/create', [ProjectController, 'create'])

/**
 * Route pour la récupération de tous les projets
 */
router.get('/projects', [ProjectController, 'getProjects'])

/**
 * Route pour la récupération d'un projet par ID
 */
router.get('/project/:id', [ProjectController, 'getProject'])
