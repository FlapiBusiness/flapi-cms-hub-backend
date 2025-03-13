import KeycloakAdminClient from '@keycloak/keycloak-admin-client'
import env from '#start/env'
import axios from 'axios'
import type { AxiosInstance, AxiosResponse } from 'axios'
import type RoleRepresentation from '@keycloak/keycloak-admin-client/lib/defs/roleRepresentation.js'
import logger from '@adonisjs/core/services/logger'
import type UserRepresentation from '@keycloak/keycloak-admin-client/lib/defs/userRepresentation.js'
import User from '#models/user'
import UserSession from '#models/user_session'
import { DateTime } from 'luxon'

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
   * Échange un code d'autorisation contre un token d'accès Keycloak
   * @param {string} code - Code d'autorisation reçu après connexion
   * @param {string} redirectUri - URI de redirection utilisée
   * @returns {Promise<UserSession>} - Session créée avec tokens stockés
   */
  public static async exchangeCodeForTokenAndCreateUserSession(
    code: string,
    redirectUri: string,
  ): Promise<UserSession> {
    try {
      // Étape 1 : Échanger le code contre un token
      const response: AxiosResponse<any, any> = await this.keycloakAxios.post(
        '/token',
        new URLSearchParams({
          grant_type: 'authorization_code',
          client_id: env.get('KEYCLOAK_CLIENT_ID'),
          client_secret: env.get('KEYCLOAK_CLIENT_SECRET'),
          code: code,
          redirect_uri: redirectUri,
        }),
      )
      const { access_token, refresh_token, expires_in, session_state } = response.data

      // Étape 2 : Obtenir l'ID utilisateur Keycloak via `/userinfo` à l'aide du : `access_token`
      const response2: AxiosResponse<any, any> = await this.keycloakAxios.get('/userinfo', {
        headers: { Authorization: `Bearer ${access_token}` },
      })
      const keycloakUserId: string = response2.data.sub // ID Keycloak de l'utilisateur
      if (!keycloakUserId) {
        throw new Error("Impossible de récupérer l'ID Keycloak de l'utilisateur.")
      }

      // Étape 3 : Trouver l'utilisateur dans ta base de données via `keycloakUserId`
      const user: User = await User.findByOrFail('keycloak_user_id', keycloakUserId)

      // Étape 4 : Stocker la session avec les tokens
      return await UserSession.create({
        userId: user.id,
        sessionState: session_state,
        issuer: 'https://dev.auth.flapi.org/realms/master',
        redirectUri: redirectUri,
        type: 'Bearer',
        accessToken: access_token,
        refreshToken: refresh_token,
        expiresAt: DateTime.now().plus({ seconds: expires_in }),
      })
    } catch (error: any) {
      throw new Error("Échec de l'échange du code contre un token : " + error.message)
    }
  }

  /**
   * Rafraîchit un token_access à l'aide du refresh_token
   * @param {number} userId - ID de l'utilisateur
   * @returns {Promise<UserSession>} - Nouvelle session avec le token mis à jour
   */
  public static async refreshAccessToken(userId: number): Promise<UserSession> {
    try {
      // Etape 1 : Récupération de la session de l'utilisateur
      const session: UserSession = await UserSession.findByOrFail('userId', userId)

      // Etape 2 : Appel de Keycloak pour rafraîchir le token
      const response: AxiosResponse<any, any> = await this.keycloakAxios.post(
        '/token',
        new URLSearchParams({
          grant_type: 'refresh_token',
          client_id: env.get('KEYCLOAK_CLIENT_ID'),
          client_secret: env.get('KEYCLOAK_CLIENT_SECRET'),
          refresh_token: session.refreshToken,
        }),
      )
      const { access_token, refresh_token, expires_in } = response.data

      // Etape 3 : Mise à jour de la session utilisateur en base de données
      session.accessToken = access_token
      session.refreshToken = refresh_token
      session.expiresAt = DateTime.now().plus({ seconds: expires_in })
      await session.save()

      // Etape 4 : Retourner la session utilisateur mise à jour
      return session
    } catch (error: any) {
      throw new Error('Échec du rafraîchissement du token : ' + error.message)
    }
  }

  /**
   * Crée un utilisateur dans Keycloak
   * @param {string} email - Email de l'utilisateur
   * @param {string} password - Mot de passe de l'utilisateur
   * @param {string} firstName - Prénom de l'utilisateur
   * @param {string} lastName - Nom de l'utilisateur
   * @returns {Promise<string>} - ID de l'utilisateur créé
   */
  public static async createUser(
    email: string,
    password: string,
    firstName: string,
    lastName: string,
  ): Promise<string> {
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
        id: createdUser.id,
        credential: {
          type: 'password',
          value: password,
          temporary: false, // False pour que le mot de passe soit permanent
        },
      })

      logger.info(`Utilisateur cree avec succes: ${email}`)
      return createdUser.id
    } catch (error: any) {
      throw new Error(`Echec de la creation de l utilisateur, erreur Keycloak: ${error.message}`)
    }
  }

  /**
   * Ajoute un rôle à un utilisateur dans Keycloak
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
   * Supprime un utilisateur de Keycloak
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
   * Vérifie si un token est valide en interrogeant Keycloak
   * @param {string} access_token - Token d'accès JWT
   * @returns {Promise<boolean>} - Retourne vrai si le token est valide
   */
  public static async sessionIsValid(access_token: string): Promise<boolean> {
    try {
      await this.keycloakAxios.get('/userinfo', {
        headers: { Authorization: `Bearer ${access_token}` },
      })

      logger.info('Token valide')
      return true
    } catch (error: any) {
      logger.warn('Token invalide ou expiré, erreur Keycloak : ', error.message)
      return false
    }
  }

  /**
   * Déconnecte un utilisateur en invalidant son access_token
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
