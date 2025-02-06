import router from '@adonisjs/core/services/router'

const ProjectController = () => import('#controllers/projects_controller')

/**
 * Route pour l'inscription d'un utilisateur
 */
router.post('/project/create', [ProjectController, 'create'])
