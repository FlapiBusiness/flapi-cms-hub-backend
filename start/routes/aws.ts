import router from '@adonisjs/core/services/router'

const AWSDomainController = () => import('#controllers/aws_domain_controller') // Import du contrôleur AWS

/**
 * Vérifie la disponibilité d’un domaine via AWS Route 53
 */
router.get('/aws/domain/check', [AWSDomainController, 'checkDomainAvailability'])

/**
 * Vérifie la disponibilité d’un sous domaine via AWS Route 53
 */
router.get('/aws/subdomain/check', [AWSDomainController, 'checkSubDomainAvailability'])
