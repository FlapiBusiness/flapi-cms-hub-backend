import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

// 🔹 Détermine le chemin du fichier
const __filename: string = fileURLToPath(import.meta.url)
const __dirname: string = path.dirname(__filename)

// 📍 Chemin du fichier base.ts généré par OpenAPITools
const BASE_TS_PATH = path.join(__dirname, '../openapitools/api/base.ts')

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
