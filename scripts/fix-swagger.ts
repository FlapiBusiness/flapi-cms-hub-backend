import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

// 🔹 Détermine le chemin du fichier
const __filename: string = fileURLToPath(import.meta.url)
const __dirname: string = path.dirname(__filename)

// 📍 Chemin du fichier Swagger
const SWAGGER_PATH = path.join(__dirname, '../swagger.json')

// 🏷️ Interfaces strictes pour Swagger
interface OpenAPISchema {
  openapi: string
  info: Record<string, unknown>
  components?: {
    schemas?: Record<string, SchemaObject>
  }
  paths?: Record<string, PathItemObject>
  tags?: TagObject[]
}

interface SchemaObject {
  type?: string
  properties?: Record<string, PropertyObject>
  required?: string[]
}

interface PropertyObject {
  type?: string
  example?: unknown
  format?: string
  required?: boolean // ⚠️ Mauvaise génération à corriger
}

interface PathItemObject {
  [method: string]: {
    tags?: string[]
  }
}

interface TagObject {
  name: string
  description?: string
}

// 🔹 Fonction pour convertir un texte en PascalCase
const toPascalCase = (str: string): string => {
  return str.toLowerCase().replace(/(^\w|_\w)/g, (match) => match.toUpperCase().replace('_', ''))
}

// ✅ Fonction principale pour corriger le Swagger.json
export const fixSwaggerJsonFile = (): void => {
  console.log('🔄 Correction du fichier Swagger en cours...')

  // 🔹 Lire le fichier Swagger
  const rawData: string = fs.readFileSync(SWAGGER_PATH, 'utf8')
  const swagger: OpenAPISchema = JSON.parse(rawData)

  if (!swagger.components?.schemas || !swagger.tags) {
    console.error('❌ Aucun schéma ou tag trouvé dans le fichier Swagger.')
    return
  }

  // 🏷️ Suppression des doublons et correction des noms en PascalCase
  const uniqueTags = new Map<string, TagObject>()

  swagger.tags.forEach((tag) => {
    const pascalName = toPascalCase(tag.name)
    if (!uniqueTags.has(pascalName)) {
      uniqueTags.set(pascalName, { name: pascalName, description: tag.description })
    }
  })

  swagger.tags = Array.from(uniqueTags.values())

  // 🚀 Mise à jour des tags dans les routes
  if (swagger.paths) {
    Object.values(swagger.paths).forEach((pathItem) => {
      Object.values(pathItem).forEach((operation) => {
        if (operation.tags) {
          operation.tags = operation.tags.map(toPascalCase)
        }
      })
    })
  }

  // 🛠 Correction des propriétés `required`
  Object.entries(swagger.components.schemas).forEach(([_schemaName, schema]) => {
    if (schema.type === 'object' && schema.properties) {
      const requiredFields: string[] = []

      Object.entries(schema.properties).forEach(([propName, prop]) => {
        if (prop.required === true) {
          requiredFields.push(propName)
          delete prop.required // ❌ Supprimer `required: true` des propriétés
        }
      })

      if (requiredFields.length > 0) {
        schema.required = requiredFields // ✅ Ajouter un tableau `required`
      }
    }
  })

  // 📥 Sauvegarde du fichier corrigé
  fs.writeFileSync(SWAGGER_PATH, JSON.stringify(swagger, null, 2), 'utf8')
  console.log('✅ Swagger.json corrigé avec succès !')
}

// Exécute la correction
fixSwaggerJsonFile()
