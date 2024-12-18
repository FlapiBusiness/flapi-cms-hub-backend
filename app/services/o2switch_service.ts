import type { AxiosResponse } from 'axios'
import axios from 'axios'
import env from '#start/env'
import logger from '@adonisjs/core/services/logger'

/**
 * Représente les données d'un serveur MySQL.
 * @type {object} MySQLServerData
 * @property {string} host - L'adresse du serveur MySQL.
 * @property {boolean} isRemote - Indique si le serveur est distant ou non.
 * @property {string} version - La version du serveur MySQL.
 */
export type MySQLServerData = {
  host: string
  isRemote: boolean
  version: string
}

/**
 * Type représentant une base de données MySQL et ses métadonnées associées.
 * @type {object} MySQLDatabase
 * @property {string} database - Nom de la base de données.
 * @property {number} diskUsage - Utilisation du disque en Ko.
 * @property {string[]} users - Liste des utilisateurs associés à la base de données.
 */
export type MySQLDatabase = {
  database: string
  diskUsage: number
  users: string[]
}

/**
 * Type pour les hôtes MySQL distants autorisé à se connecter à la base de données.
 * Chaque clé est une adresse IP ou un nom d'hôte, et chaque valeur est une note associée.
 * @type {object} AuthorizedRemoteHostsDatabase
 * @property {Record<string, string>} AuthorizedRemoteHostsDatabase - Les hôtes MySQL distants autorisés et leurs notes.
 */
export type AuthorizedRemoteHostsDatabase = Record<string, string>

/**
 * Service pour gérer les bases de données MySQL sur O2Switch.
 * @class O2SwitchService
 */
export default class O2SwitchService {
  private static readonly AUTH_HEADER: { Authorization: string } = {
    // Doc : https://docs.cpanel.net/knowledge-base/security/how-to-use-cpanel-api-tokens/
    Authorization: `cpanel ${env.get('O2SWITCH_USERNAME')}:${env.get('O2SWITCH_API_TOKEN')}`,
  }

  /**
   * Crée une nouvelle base de données MySQL.
   * @param {string} dbName - Le nom de la base de données à créer.
   * @returns {Promise<boolean>} - `true` si la création est réussie.
   */
  public static async createDatabase(dbName: string): Promise<boolean> {
    const fullDbName: string = `${env.get('O2SWITCH_BEGINNING_DATABASE_NAME')}${dbName}`

    try {
      const response: AxiosResponse<any, any> = await axios.post(
        `https://${env.get('O2SWITCH_HOST')}/execute/Mysql/create_database`,
        new URLSearchParams({
          name: fullDbName,
          'prefix-size': '16',
        }),
        {
          headers: this.AUTH_HEADER,
        },
      )

      return response.data?.status === 1
    } catch (error) {
      logger.error('Error while creating database :', error)
      throw error
    }
  }

  /**
   * Supprime une base de données MySQL.
   * @param {string} dbName - Le nom de la base de données à supprimer.
   * @returns {Promise<boolean>} - `true` si la suppression est réussie.
   */
  public static async deleteDatabase(dbName: string): Promise<boolean> {
    const fullDbName: string = `${env.get('O2SWITCH_BEGINNING_DATABASE_NAME')}${dbName}`

    try {
      const response: AxiosResponse<any, any> = await axios.post(
        `https://${env.get('O2SWITCH_HOST')}/execute/Mysql/delete_database`,
        new URLSearchParams({
          name: fullDbName,
        }),
        {
          headers: this.AUTH_HEADER,
        },
      )

      return response.data?.status === 1
    } catch (error) {
      logger.error('Error while deleting database :', error)
      throw error
    }
  }

  /**
   * Lie un utilisateur MySQL à une base de données.
   * @param {string} dbName - Le nom de la base de données.
   * @returns {Promise<boolean>} - `true` si l'utilisateur est lié avec succès.
   */
  public static async linkUserToDatabase(dbName: string): Promise<boolean> {
    const fullDbName: string = `${env.get('O2SWITCH_BEGINNING_DATABASE_NAME')}${dbName}`
    const user: string = env.get('O2SWITCH_DATABASE_USERNAME')
    const password: string = env.get('O2SWITCH_DATABASE_PASSWORD')

    try {
      const response: AxiosResponse<any, any> = await axios.post(
        `https://${env.get('O2SWITCH_HOST')}/execute/Mysql/set_privileges_on_database`,
        new URLSearchParams({
          privileges: 'ALL PRIVILEGES',
          database: fullDbName,
          user: user,
          password: password,
        }),
        {
          headers: this.AUTH_HEADER,
        },
      )

      return response.data?.status === 1
    } catch (error) {
      logger.error('Error while linking user to database :', error)
      throw error
    }
  }

  /**
   * Renomme une base de données MySQL existante.
   * @param {string} oldDbName - Le nom actuel de la base de données (sans préfixe).
   * @param {string} newDbName - Le nouveau nom souhaité de la base de données (sans préfixe).
   * @returns {Promise<boolean>} - Retourne `true` si le renommage est réussi, sinon `false`.
   */
  public static async renameDatabase(oldDbName: string, newDbName: string): Promise<boolean> {
    const fullOldDbName: string = `${env.get('O2SWITCH_BEGINNING_DATABASE_NAME')}${oldDbName}`
    const fullNewDbName: string = `${env.get('O2SWITCH_BEGINNING_DATABASE_NAME')}${newDbName}`

    try {
      const response: AxiosResponse<any, any> = await axios.post(
        `https://${env.get('O2SWITCH_HOST')}/execute/Mysql/rename_database`,
        new URLSearchParams({
          oldname: fullOldDbName,
          newname: fullNewDbName,
        }),
        {
          headers: this.AUTH_HEADER,
        },
      )

      console.log('response', response.data)
      return response.data?.status === 1
    } catch (error) {
      logger.error('Error while renaming database :', error)
      throw error
    }
  }

  /**
   * Valide l'intégrité d'une base de données MySQL.
   * @param {string} dbName - Le nom de la base de données (sans préfixe).
   * @returns {Promise<boolean>} - `true` si l'intégrité est valide ou `false` sinon.
   */
  public static async validateDatabaseIntegrity(dbName: string): Promise<boolean> {
    const fullDbName: string = `${env.get('O2SWITCH_BEGINNING_DATABASE_NAME')}${dbName}`

    try {
      const response: AxiosResponse<any, any> = await axios.post(
        `https://${env.get('O2SWITCH_HOST')}/execute/Mysql/check_database`,
        new URLSearchParams({
          name: fullDbName,
        }),
        {
          headers: this.AUTH_HEADER,
        },
      )

      return response.data?.status === 1
    } catch (error) {
      logger.error('Error while validating database integrity :', error)
      throw error
    }
  }

  /**
   * Répare les tables d'une base de données MySQL.
   * @param {string} dbName - Le nom de la base de données (sans préfixe).
   * @returns {Promise<boolean>} - `true` si les tables ont été réparées avec succès ou `false` sinon.
   */
  public static async repairDatabaseTables(dbName: string): Promise<boolean> {
    const fullDbName: string = `${env.get('O2SWITCH_BEGINNING_DATABASE_NAME')}${dbName}`

    try {
      const response: AxiosResponse<any, any> = await axios.post(
        `https://${env.get('O2SWITCH_HOST')}/execute/Mysql/repair_database`,
        new URLSearchParams({
          name: fullDbName,
        }),
        {
          headers: this.AUTH_HEADER,
        },
      )

      return response.data?.status === 1
    } catch (error) {
      logger.error('Error while repairing database tables :', error)
      throw error
    }
  }

  /**
   * Restaure une base de données MySQL depuis un fichier de sauvegarde existant.
   * @param {string} backupFileName - Le nom du fichier de sauvegarde (ex : reco5282_crzgames_production_backup-17-12-2024-21-38-29.sql.gz).
   * @param {number} timeout - Le temps d'expiration en secondes pour la restauration (défaut : 0 = pour aucune limite)
   * @param {boolean} verbose - Retourner des informations supplémentaires (défaut : false).
   * @returns {Promise<boolean>} - `true` si la restauration est réussie.
   */
  public static async restoreDatabase(
    backupFileName: string,
    timeout: number = 0,
    verbose: boolean = false,
  ): Promise<boolean> {
    const backupFilePath: string = `${env.get('O2SWITCH_BACKUP_DATABASE_PATH')}/${backupFileName}`

    try {
      const response: AxiosResponse<any, any> = await axios.post(
        `https://${env.get('O2SWITCH_HOST')}/execute/Backup/restore_databases`,
        new URLSearchParams({
          backup: backupFilePath,
          timeout: timeout.toString(),
          verbose: verbose ? '1' : '0',
        }),
        {
          headers: this.AUTH_HEADER,
        },
      )

      if (response.data?.status === 1) {
        logger.info(
          `Database restoration successful: ${response.data.result?.messages?.[0] || 'No specific message returned.'}`,
        )
        return true
      } else {
        logger.warn('Database restoration failed: ')
        console.log(response.data)
        return false
      }
    } catch (error) {
      logger.error('Error while restoring database: ', error)
      throw error
    }
  }

  /**
   * Récupère les informations sur l'hôte et la version du serveur MySQL.
   * @returns {Promise<MySQLServerData | undefined>} - Les informations du serveur MySQL ou `undefined` en cas d'erreur.
   */
  public static async getMySQLServerInformation(): Promise<MySQLServerData | undefined> {
    try {
      const response: AxiosResponse<any, any> = await axios.get(
        `https://${env.get('O2SWITCH_HOST')}/execute/Mysql/get_server_information`,
        {
          headers: this.AUTH_HEADER,
        },
      )

      if (response.data?.status === 1) {
        const { host, is_remote, version } = response.data.result?.data || {}
        return {
          host,
          isRemote: Boolean(is_remote),
          version,
        } as MySQLServerData
      } else {
        logger.warn('Failed to fetch MySQL server information: ', response.data?.errors || 'Unknown error')
        return undefined
      }
    } catch (error) {
      logger.error('Error while fetching MySQL server information: ', error)
      throw error
    }
  }

  /**
   * Liste les bases de données MySQL d'un compte.
   * @returns {Promise<MySQLDatabase[]>} - Une promesse contenant la liste des bases de données MySQL.
   */
  public static async listDatabases(): Promise<MySQLDatabase[]> {
    try {
      const response: AxiosResponse<any, any> = await axios.get(
        `https://${env.get('O2SWITCH_HOST')}/execute/Mysql/list_databases`,
        {
          headers: this.AUTH_HEADER,
        },
      )

      if (response.data.status === 1) {
        logger.info('Successfully retrieved MySQL databases.')
        return response.data.result.data
      } else {
        logger.warn('Failed to retrieve MySQL databases:', response.data.errors || 'Unknown error')
        return []
      }
    } catch (error) {
      logger.error('Error while listing MySQL databases:', error)
      throw error
    }
  }

  /**
   * Autorise un hôte MySQL distant à se connecter aux bases de données.
   * @param {string} host - Le nom ou l'adresse IP de l'hôte MySQL distant.
   * @returns {Promise<boolean>} - `true` si l'autorisation est réussie.
   */
  public static async addAuthorizeRemoteHostForDatabases(host: string): Promise<boolean> {
    try {
      const response: AxiosResponse<any, any> = await axios.post(
        `https://${env.get('O2SWITCH_HOST')}/execute/Mysql/add_host`,
        new URLSearchParams({ host }),
        { headers: this.AUTH_HEADER },
      )

      if (response.data?.status === 1) {
        logger.info(`Successfully authorized remote host for databases: ${host}`)
        return true
      } else {
        logger.warn(`Failed to authorize remote host for databases: ${host}`)
        console.log(response.data)
        return false
      }
    } catch (error) {
      logger.error(`Error while authorizing remote host for databases: ${host}`, error)
      throw error
    }
  }

  /**
   * Récupère les hôtes MySQL distants autorisés et leurs notes.
   * @returns {Promise<AuthorizedRemoteHostsDatabase | undefined>} - Les hôtes MySQL distants autorisés ou `undefined` en cas d'erreur.
   */
  public static async getAuthorizedRemoteHosts(): Promise<AuthorizedRemoteHostsDatabase | undefined> {
    try {
      const response: AxiosResponse<any, any> = await axios.get(
        `https://${env.get('O2SWITCH_HOST')}/execute/Mysql/get_host_notes`,
        { headers: this.AUTH_HEADER },
      )

      if (response.data?.status === 1) {
        logger.info('Successfully retrieved authorized remote hosts.')
        return response.data.result.data as AuthorizedRemoteHostsDatabase
      } else {
        logger.warn('Failed to retrieve authorized remote hosts.')
        console.log(response.data)
        return undefined
      }
    } catch (error) {
      logger.error('Error while retrieving authorized remote hosts:', error)
      throw error
    }
  }
}
