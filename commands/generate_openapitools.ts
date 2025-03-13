import { BaseCommand } from '@adonisjs/core/ace'
import type { CommandOptions } from '@adonisjs/core/types/ace'
import { execSync } from 'child_process'
import { fixBasePath } from '#scripts/fix-openapitools'

/**
 * Commande pour générer l'API OpenAPI Tools
 * @class GenerateOpenApiTools
 */
export default class GenerateOpenApiTools extends BaseCommand {
  public static commandName: string = 'generate:openapitools'
  public static description: string = 'Génère le dossier API à partir du Swagger'
  public static options: CommandOptions = {
    startApp: true, // Démarre l'application si nécessaire
    allowUnknownFlags: false,
    staysAlive: false,
  }

  /**
   * Exécute la commande pour générer l'API OpenAPI Tools
   * @returns {Promise<void>}
   */
  public async run(): Promise<void> {
    this.logger.info('🚀 Génération du Swagger en cours...')

    // 🔹 Étape 1 : Générer le fichier Swagger
    await this.kernel.exec('swagger:docs:generate', [])
    this.logger.success('✅ Swagger généré avec succès.')

    // 🔹 Étape 2 : Générer l'API avec OpenAPI Tools (npm run generate:openapitools:directory)
    this.logger.info('🚀 Génération du dossier API avec OpenAPI Tools...')
    execSync('npm run generate:openapitools:directory', { stdio: 'inherit' })
    this.logger.success('✅ Dossier API généré avec succès.')

    // 📍 Étape 3 : Vérifier et corriger BASE_PATH dans base.ts
    this.logger.info('🔧 Correction du fichier BASE_PATH en cours...')
    fixBasePath()
    this.logger.success('✅ BASE_PATH modifié avec succès.')
  }
}
