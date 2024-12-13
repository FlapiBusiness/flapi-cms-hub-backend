import path from 'node:path'
import url from 'node:url'
import fs from 'fs'
import env from '#start/env'

// Importe le fichier package.json pour récupérer la version en cours du projet
const packageJson: any = JSON.parse(fs.readFileSync('./package.json', 'utf-8'))

export default {
  // Chemin de base pour les fichiers swagger qui correspond a la racine du projet
  path: path.dirname(url.fileURLToPath(import.meta.url)) + '/../',

  // Informations générales sur l'API
  info: {
    title: 'Flapi Hub API',
    version: packageJson.version,
    description: 'Documentation Swagger auto-générée.',
  },

  // Index pour organiser les tags
  tagIndex: 1,

  // Options générales
  snakeCase: true, // Convertit automatiquement les noms des chemins en snake_case
  debug: env.get('NODE_ENV') === 'development', // Affiche les logs de débogage pour le développement

  // Routes à ignorer
  ignore: ['/swagger', '/docs', '/'],

  // Méthode préférée si PUT/PATCH sont tous deux définis
  preferredPutPatch: 'PUT',

  // Composants communs
  common: {
    parameters: {},
    headers: {},
  },

  // Schémas de sécurité
  securitySchemes: {
    BearerAuth: {
      type: 'http',
      scheme: 'bearer',
    },
  },
  authMiddlewares: ['health'], // Détection automatique des middlewares
  defaultSecurityScheme: 'BearerAuth', // Schéma par défaut

  // Persist autorisation entre les rechargements dans Swagger UI
  persistAuthorization: true,

  // Options d'affichage
  showFullPath: false, // Affiche les chemins complets après le résumé des endpoints
}
