import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

// 🔹 Détermine le chemin du fichier
const __filename: string = fileURLToPath(import.meta.url)
const __dirname: string = path.dirname(__filename)

// 📍 Chemin du fichier base.ts généré par OpenAPITools
const BASE_TS_PATH: string = path.join(__dirname, '../openapitools/api/base.ts')
const API_TS_PATH: string = path.join(__dirname, '../openapitools/api/api.ts')

// 🔄 Fonction principale pour modifier BASE_PATH dans base.ts
export const fixBasePath = (): void => {
  console.log('🔄 Modification de BASE_PATH en cours...')

  if (!fs.existsSync(BASE_TS_PATH)) {
    console.error(`❌ Le fichier ${BASE_TS_PATH} n'existe pas. Vérifie si OpenAPI Tools a bien généré les fichiers.`)
    process.exit(1)
  }

  // 📥 Lire le contenu du fichier base.ts
  let fileContent: string = fs.readFileSync(BASE_TS_PATH, 'utf8')

  // 🔄 Remplacement de BASE_PATH pour utiliser `import.meta.env.VITE_BASE_URL_API`
  fileContent = fileContent.replace(
    /export const BASE_PATH = .*?;/,
    `export const BASE_PATH = import.meta.env.VITE_BASE_URL_API || "http://localhost";`,
  )

  // 📤 Sauvegarde du fichier modifié
  fs.writeFileSync(BASE_TS_PATH, fileContent, 'utf8')

  console.log(`✅ BASE_PATH mis à jour avec succès !`)
}

// 🔄 Fonction pour remplacer _delete par delete dans les fichiers API
export const fixMethodNames = (): void => {
  console.log('🔄 Correction des noms de méthodes en cours...')

  if (!fs.existsSync(API_TS_PATH)) {
    console.error(`❌ Le fichier ${API_TS_PATH} n'existe pas. Vérifie si OpenAPI Tools a bien généré les fichiers.`)
    process.exit(1)
  }

  // 📥 Lire le contenu du fichier api.ts
  let fileContent: string = fs.readFileSync(API_TS_PATH, 'utf8')

  // 🔄 Remplacement des noms de méthodes `_delete` par `delete`
  fileContent = fileContent.replace(/\b_delete\b/g, 'delete')

  // 📤 Sauvegarde du fichier modifié
  fs.writeFileSync(API_TS_PATH, fileContent, 'utf8')

  console.log(`✅ Méthodes corrigées dans ${API_TS_PATH}`)
}

// 🔄 Fonction principale pour exécuter toutes les corrections
export const fixOpenApiTools = (): void => {
  fixBasePath()
  fixMethodNames()
}
