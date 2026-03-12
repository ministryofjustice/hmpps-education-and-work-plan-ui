import express, { Router } from 'express'

import { monitoringMiddleware, endpointHealthComponent } from '@ministryofjustice/hmpps-monitoring'
import type { ApplicationInfo } from '../applicationInfo'
import logger from '../../logger'
import config from '../config'

export default function setUpHealthChecks(applicationInfo: ApplicationInfo): Router {
  const router = express.Router()

  const apiConfig = Object.entries(config.apis)

  const middleware = monitoringMiddleware({
    applicationInfo,
    healthComponents: apiConfig
      .filter(([_name, options]) => options.healthPath != null)
      .map(([name, options]) => endpointHealthComponent(logger, name, options)),
  })

  router.get('/health', middleware.health)
  router.get('/info', (req, res) => {
    res.json({
      git: {
        branch: applicationInfo.branchName,
      },
      build: {
        artifact: applicationInfo.applicationName,
        version: applicationInfo.buildNumber,
        name: applicationInfo.applicationName,
      },
      productId: applicationInfo.productId,
      activeAgencies: applicationInfo.activeAgencies,
    })
  })
  router.get('/ping', middleware.ping)

  return router
}
