import express, { Express } from 'express'
import { NotFound } from 'http-errors'

import { randomUUID } from 'crypto'
import routes from '../index'
import nunjucksSetup from '../../utils/nunjucksSetup'
import errorHandler from '../../errorHandler'
import * as auth from '../../authentication/auth'
import type { Services } from '../../services'
import type { ApplicationInfo } from '../../applicationInfo'
import AuditService from '../../services/auditService'
import setUpWebSession from '../../middleware/setUpWebSession'
import auditMiddleware from '../../middleware/auditMiddleware'
import populateUserAuthorities from '../../middleware/populateUserAuthorities'

jest.mock('../../services/auditService')

const testAppInfo: ApplicationInfo = {
  applicationName: 'test',
  buildNumber: '1',
  gitRef: 'long ref',
  gitShortHash: 'short ref',
  branchName: 'main',
  activeAgencies: ['***'],
}

const testUserWithManagerRole = {
  firstName: 'first',
  lastName: 'last',
  userId: 'id',
  token:
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6InVzZXIxIiwiaWF0IjoxNTE2MjM5MDIyLCJhdXRob3JpdGllcyI6WyJST0xFX0VEVUNBVElPTl9XT1JLX1BMQU5fRURJVE9SIl19.vZ7FwrGzUFIDgxluRAj72It0yBW2hbxu5UQCjKkyOzM',
  username: 'user1',
  displayName: 'First Last',
  activeCaseLoadId: 'BXI',
  caseLoadIds: ['MDI', 'BXI'],
  authSource: 'nomis',
  roles: ['ROLE_LWP_MANAGER'],
}

export const flashProvider = jest.fn()

function appSetup(services: Services, production: boolean, userSupplier: () => Express.User): Express {
  const app = express()

  app.set('view engine', 'njk')

  nunjucksSetup(app, testAppInfo)
  app.use(setUpWebSession())
  app.use((req, res, next) => {
    req.user = userSupplier()
    req.flash = flashProvider
    res.locals = {
      user: { ...req.user },
    }
    next()
  })
  app.use((req, res, next) => {
    req.id = randomUUID()
    next()
  })
  app.use(populateUserAuthorities())
  app.use(express.json())
  app.use(express.urlencoded({ extended: true }))
  app.use(auditMiddleware(services))
  app.use(routes(services))
  app.use((req, res, next) => next(new NotFound()))
  app.use(errorHandler(services, production))

  return app
}

export function appWithAllRoutes({
  production = false,
  services = {
    auditService: new AuditService(null) as jest.Mocked<AuditService>,
  },
  userSupplier = () => testUserWithManagerRole,
}: {
  production?: boolean
  services?: Partial<Services>
  userSupplier?: () => Express.User
}): Express {
  auth.default.authenticationMiddleware = () => (req, res, next) => next()
  return appSetup(services as Services, production, userSupplier)
}
