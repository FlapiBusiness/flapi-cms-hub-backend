import { test } from '@japa/runner'
import ProjectService from '#services/project_service'
import type Project from '#models/project'
import type { Assert } from '@japa/assert'

/**
 * Test context
 */
type TestContext = { assert: Assert }

test('should create a project', async ({ assert }: TestContext) => {
  const project: Project = await ProjectService.createProject({
    application_name: 'Test App',
    user_id: 1,
    domain_name: 'example.com',
    database_id: 1,
    file_id: 1,
  })
  assert.exists(project.id)
})
