import KeycloakAdminClient from '@keycloak/keycloak-admin-client'
import env from '#start/env'
import axios from 'axios'
import type { AxiosInstance, AxiosResponse } from 'axios'
import type RoleRepresentation from '@keycloak/keycloak-admin-client/lib/defs/roleRepresentation.js'
import logger from '@adonisjs/core/services/logger'
import type UserRepresentation from '@keycloak/keycloak-admin-client/lib/defs/userRepresentation.js'

/**
 * Service pour gérer les utilisateurs Keycloak
 * @class KeycloakAdminService
 */
export default class KeycloakAdminService {
  /**
   * Client Keycloak pour gérer les utilisateurs
   * @type {KeycloakAdminClient}
   */
  private static readonly kcAdmin: KeycloakAdminClient = new KeycloakAdminClient({
    baseUrl: env.get('KEYCLOAK_URL'),
    realmName: env.get('KEYCLOAK_REALM'),
  })

  /**
   * Instance Axios pour Keycloak
   * @type {AxiosInstance}
   */
  private static readonly keycloakAxios: AxiosInstance = axios.create({
    baseURL: `${env.get('KEYCLOAK_URL')}/realms/${env.get('KEYCLOAK_REALM')}/protocol/openid-connect`,
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  })

  /**
   * Authentifie l'admin Keycloak pour gérer les utilisateurs
   * @returns {Promise<void>}
   */
  private static async authenticateAdmin(): Promise<void> {
    try {
      await this.kcAdmin.auth({
        grantType: 'client_credentials',
        clientId: env.get('KEYCLOAK_CLIENT_ID'),
        clientSecret: env.get('KEYCLOAK_CLIENT_SECRET'),
      })
      logger.info('Admin Keycloak authentifie avec succes')
    } catch (error) {
      throw new Error('Echec de l authentification de l admin Keycloack, erreur Keycloak : ' + error.message)
    }
  }

  /**
   * Crée un utilisateur dans Keycloak
   * @param {string} email - Email de l'utilisateur
   * @param {string} password - Mot de passe de l'utilisateur
   * @param {string} firstName - Prénom de l'utilisateur
   * @param {string} lastName - Nom de l'utilisateur
   * @returns {Promise<number>} - ID de l'utilisateur créé
   */
  public static async createUser(
    email: string,
    password: string,
    firstName: string,
    lastName: string,
  ): Promise<number> {
    await this.authenticateAdmin()

    try {
      // Etape 1 : Vérifier si l'utilisateur existe déjà
      const existingUsers: UserRepresentation[] = await this.kcAdmin.users.find({ email })
      if (existingUsers.length > 0) {
        throw new Error(`L email ${email} est deja utilise dans Keycloak`)
      }

      // Étape 2 : Création de l'utilisateur sans mot de passe
      const createdUser: { id: string } = await this.kcAdmin.users.create({
        username: email,
        email: email,
        firstName: firstName,
        lastName: lastName,
        enabled: true,
      })
      if (!createdUser.id) {
        throw new Error(`L utilisateur ${email} a ete cree mais son ID est introuvable`)
      }

      // Étape 3 : Définition du mot de passe
      await this.kcAdmin.users.resetPassword({
        realm: env.get('KEYCLOAK_REALM'),
        id: createdUser.id,
        credential: {
          type: 'password',
          value: password,
          temporary: false, // False pour que le mot de passe soit permanent
        },
      })

      logger.info(`Utilisateur cree avec succes: ${email}`)
      return Number(createdUser.id)
    } catch (error: any) {
      throw new Error(`Echec de la creation de l utilisateur, erreur Keycloak: ${error.message}`)
    }
  }

  /**
   * Ajoute un rôle à un utilisateur
   * @param {string} userId - ID de l'utilisateur
   * @param {string} roleName - Nom du rôle
   * @returns {Promise<void>}
   */
  public static async addUserRole(userId: string, roleName: string): Promise<void> {
    await this.authenticateAdmin()

    try {
      const role: RoleRepresentation | undefined = await this.kcAdmin.roles.findOneByName({
        name: roleName,
      })

      if (!role?.id) {
        logger.warn(`Rôle non trouvé ou ID manquant : ${roleName}`)
        throw new Error(`Rôle ${roleName} introuvable ou sans ID`)
      }

      await this.kcAdmin.users.addRealmRoleMappings({
        id: userId,
        roles: [{ id: role.id, name: roleName }],
      })

      logger.info(`Rôle ${roleName} attribué à l'utilisateur ${userId}`)
    } catch (error: any) {
      throw new Error("Échec de l'ajout du rôle à l'utilisateur, erreur Keycloak : " + error.message)
    }
  }

  /**
   * Supprime un utilisateur
   * @param {string} userId - ID de l'utilisateur
   * @returns {Promise<void>}
   */
  public static async deleteUser(userId: string): Promise<void> {
    await this.authenticateAdmin()

    try {
      await this.kcAdmin.users.del({
        id: userId,
      })

      logger.info(`Utilisateur supprime avec succes: ${userId}`)
    } catch (error) {
      throw new Error("Echec de la suppression de l'utilisateur, erreur Keycloak : " + error.message)
    }
  }

  /**
   * Inscription d'un utilisateur dans Keycloak et récupération du token
   * @param {string} email - Email de l'utilisateur
   * @param {string} password - Mot de passe
   * @param {string} firstName - Prénom
   * @param {string} lastName - Nom de famille
   * @returns {Promise<any>} - Retourne le token et l'utilisateur créé
   */
  public static async registerUser(email: string, password: string, firstName: string, lastName: string): Promise<any> {
    try {
      await this.createUser(email, password, firstName, lastName)
      return await this.loginUser(email, password)
    } catch (error: any) {
      throw new Error("Échec de l'inscription, erreur Keycloak : " + error.message)
    }
  }

  /**
   * Connexion d'un utilisateur et récupération du token JWT
   * @param {string} email - Email de l'utilisateur
   * @param {string} password - Mot de passe
   * @returns {Promise<any>} - Token JWT
   */
  public static async loginUser(email: string, password: string): Promise<any> {
    try {
      const response: AxiosResponse<any, any> = await this.keycloakAxios.post(
        '/token',
        new URLSearchParams({
          grant_type: 'password',
          client_id: env.get('KEYCLOAK_CLIENT_ID'),
          client_secret: env.get('KEYCLOAK_CLIENT_SECRET'),
          username: email,
          password: password,
        }),
      )

      logger.info(`Utilisateur connecté: ${email}`)
      return response.data
    } catch (error: any) {
      throw new Error('Echec de la connexion, verifiez vos identifiants, erreur Keycloak : ' + error.message)
    }
  }

  /**
   * Vérifie si un token est valide
   * @param {string} token - Token d'accès JWT
   * @returns {Promise<boolean>} - Retourne vrai si le token est valide
   */
  public static async checkSession(token: string): Promise<boolean> {
    try {
      await this.keycloakAxios.get('/userinfo', {
        headers: { Authorization: `Bearer ${token}` },
      })

      logger.info('Token valide')
      return true
    } catch (error: any) {
      logger.warn('Token invalide ou expiré, erreur Keycloak : ', error.message)
      return false
    }
  }

  /**
   * Déconnecte un utilisateur en invalidant son token
   * @param {string} refreshToken - Refresh token de l'utilisateur
   * @returns {Promise<void>}
   */
  public static async logoutUser(refreshToken: string): Promise<void> {
    try {
      await this.keycloakAxios.post(
        '/logout',
        new URLSearchParams({
          client_id: env.get('KEYCLOAK_CLIENT_ID'),
          client_secret: env.get('KEYCLOAK_CLIENT_SECRET'),
          refresh_token: refreshToken,
        }),
      )

      logger.info('Utilisateur deconnecte avec succes')
    } catch (error: any) {
      throw new Error('Echec de la deconnexion, erreur Keycloak : ' + error.message)
    }
  }
}
