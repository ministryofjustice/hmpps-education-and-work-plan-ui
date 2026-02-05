import { NextFunction, Request, Response, Router } from 'express'
import createError from 'http-errors'
import EmployabilitySkillsValue from '../../enums/employabilitySkillsValue'
import viewEmployabilitySkillRatingsRoutes from './view'
import addEmployabilitySkillRatingsRoutes from './add'
import { Services } from '../../services'

const employabilitySkillsRoutes = (services: Services): Router => {
  const router = Router({ mergeParams: true })

  router.use(async (req: Request, res: Response, next: NextFunction) => {
    const { skillType } = req.params
    if (Object.keys(EmployabilitySkillsValue).includes(skillType)) {
      return next()
    }
    return next(createError(404, `Unknown employability skill type ${skillType}`))
  })

  router.use([viewEmployabilitySkillRatingsRoutes(services), addEmployabilitySkillRatingsRoutes(services)])

  return router
}

export default employabilitySkillsRoutes
