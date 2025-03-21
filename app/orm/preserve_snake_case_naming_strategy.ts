import { CamelCaseNamingStrategy } from '@adonisjs/lucid/orm'
import type { BaseModel } from '@adonisjs/lucid/orm'
 
/**
 * A naming strategy that preserves the snake_case naming convention for serialization.
 * @class PreserveSnakeCaseNamingStrategy
 */
export default class PreserveSnakeCaseNamingStrategy extends CamelCaseNamingStrategy {
  /**
   * Garde le nom de la propriété tel quel.
   * @param {typeof BaseModel} _model - Le modèle de la propriété.
   * @param {string} propertyName - Le nom de la propriété.
   * @returns {string} Le nom de la propriété.
   */
  public serializedName(_model: typeof BaseModel, propertyName: string): string {
    return propertyName
  }
}
