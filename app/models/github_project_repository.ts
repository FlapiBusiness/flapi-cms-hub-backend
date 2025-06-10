import { BaseModel, column } from '@adonisjs/lucid/orm'

/**
 *  The GithubProjectRepository model represents a repository associated with a project in the application.
 */
export default class GithubProjectRepository extends BaseModel {
  @column({ isPrimary: true })
  // @required @example(1)
  declare public id: number

  @column()
  // @required @example(1)
  declare public project_id: number

  @column()
  // @required @example('my-repo')
  declare public repo_name: string

  @column()
  // @required @example(https://github.com/my-repo)
  declare public repo_url: string

  @column()
  // @required @example('frontend')
  declare public type: 'frontend' | 'backend'

  @column()
  // @required @example(false)
  declare public deployed: boolean
}
