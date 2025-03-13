import router from '@adonisjs/core/services/router'

const UserController = () => import('#controllers/users_controller')

/**
 * Route pour la récupération de tous les utilisateurs
 */
router.get('/users', [UserController, 'getAllUsers'])

/**
 * Route pour la récupération d'un utilisateur par ID
 */
router.get('/users/:id', [UserController, 'getUserById'])

/**
 * Route pour la mise à jour d'un utilisateur
 */
router.put('/users/:id', [UserController, 'updateUser'])

/**
 * Route pour la suppression d'un utilisateur
 */
router.delete('/users/:id', [UserController, 'deleteUser'])
