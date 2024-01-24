import { Router } from 'express'
import type { Services } from '../services'
import createGoal from './createGoal'
import updateGoal from './updateGoal'
import overview from './overview'
import functionalSkills from './functionalSkills'
import prisonerList from './prisonerList'
import postInductionCreation from './postInductionCreation'

export default function routes(services: Services): Router {
  const router = Router()

  prisonerList(router, services)
  overview(router, services)
  createGoal(router, services)
  updateGoal(router, services)
  functionalSkills(router, services)

  postInductionCreation(router, services)

  return router
}
