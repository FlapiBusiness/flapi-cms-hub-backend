/**
 * Enumération des rôles utilisateur
 * @enum {string} user_roles
 * @property {string} SUPER_ADMIN - Créateur de la plateforme
 * @property {string} ADMIN - Gérant d’un compte ou d’une entreprise
 * @property {string} APP_MANAGER - Gestionnaire d’applications
 * @property {string} MARKETING - Responsable marketing
 * @property {string} SUPPORT - Assistance client
 * @property {string} COMMERCIAL - Responsable commercial
 */
export enum UserRoles {
  SUPER_ADMIN = 'super_admin',
  ADMIN = 'admin',
  APP_MANAGER = 'app_manager',
  MARKETING = 'marketing',
  SUPPORT = 'support',
  COMMERCIAL = 'commercial',
}
