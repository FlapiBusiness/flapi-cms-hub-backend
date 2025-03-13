/**
 * Enumération des rôles utilisateur
 * @enum {string} user_roles
 * @property {string} SUPER_ADMIN_FLAPI - Administrateurs de la plateforme Flapi.
 * @property {string} ADMIN_CLIENT - Gérants des comptes ou entreprises clientes.
 * @property {string} APP_MANAGER_CLIENT - Responsable de l'application
 * @property {string} MARKETING_CLIENT - Responsable marketing
 * @property {string} SUPPORT_CLIENT - Assistance client
 * @property {string} COMMERCIAL_CLIENT - Responsable commercial
 */
export enum UserRoles {
  SUPER_ADMIN_FLAPI = 'SUPER_ADMIN_FLAPI',
  ADMIN_CLIENT = 'ADMIN_CLIENT',
  APP_MANAGER_CLIENT = 'APP_MANAGER_CLIENT',
  MARKETING_CLIENT = 'MARKETING_CLIENT',
  SUPPORT_CLIENT = 'SUPPORT_CLIENT',
  COMMERCIAL_CLIENT = 'COMMERCIAL_CLIENT',
}
