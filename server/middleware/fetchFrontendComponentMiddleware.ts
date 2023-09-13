import { RequestHandler } from 'express'
import type { FrontendComponentsPageAdditions } from 'viewModels'
import logger from '../../logger'
import { Services } from '../services'
import config from '../config'

export default function getFrontendComponents({ frontendComponentService }: Services): RequestHandler {
  return async (req, res, next) => {
    try {
      if (config.featureToggles.frontendComponentsApiToggleEnabled) {
        const footer = await frontendComponentService.getComponents('footer', res.locals.user.token)
        res.locals.feComponents = {
          footerHtml: footer.html,
          cssIncludes: [...footer.css],
          jsIncludes: [...footer.javascript],
        } as FrontendComponentsPageAdditions
        next()
      }
    } catch (error) {
      logger.error(error, 'Failed to retrieve front end components')
      next()
    }
  }
}
