import PreserveSnakeCaseNamingStrategy from '#orm/preserve_snake_case_naming_strategy'
import { BaseModel } from '@adonisjs/lucid/orm'

BaseModel.namingStrategy = new PreserveSnakeCaseNamingStrategy()
