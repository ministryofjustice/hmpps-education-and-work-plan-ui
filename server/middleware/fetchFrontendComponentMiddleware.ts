import { Router } from 'express'
import type { FrontendComponentsPageAdditions } from 'viewModels'
import { DataAccess } from '../data'
import logger from '../../logger'
import config from '../config'

export default function setUpFrontendComponents({ frontendComponentApiClient }: DataAccess): Router {
  const router = Router({ mergeParams: true })

  router.get('*', async (req, res, next) => {
    try {
      // Frontend components API is only used when feature toggle is provided
      if (config.featureToggles.frontendComponentsApiToggleEnabled) {
        const { user } = res.locals
        const [footer] = await Promise.all([frontendComponentApiClient.getComponent('footer', user.token)])
        res.locals.feComponents = {
          footerHtml: footer.html,
          cssIncludes: [...footer.css],
          jsIncludes: [...footer.javascript],
        } as FrontendComponentsPageAdditions
      }
    } catch (error) {
      logger.error(error, 'Failed to retrieve front end components')
    }
    next()
  })

  return router
}
