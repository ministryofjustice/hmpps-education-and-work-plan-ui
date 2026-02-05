import stubPing from '../common'
import actionPlanEndpoints from './actionPlanEndpoints'
import educationEndpoints from './educationEndpoints'
import goalsEndpoints from './goalsEndpoints'
import inductionEndpoints from './inductionEndpoints'
import reviewsEndpoints from './reviewsEndpoints'
import schedulesEndpoints from './schedulesEndpoints'
import searchEndpoints from './searchEndpoints'
import sessionsEndpoints from './sessionsEndpoints'
import timelineEndpoints from './timelineEndpoints'
import employabilitySkillsEndpoints from './employabilitySkillsEndpoints'

export default {
  stubEducationAndWorkPlanApiPing: stubPing(),
  ...actionPlanEndpoints,
  ...educationEndpoints,
  ...goalsEndpoints,
  ...inductionEndpoints,
  ...reviewsEndpoints,
  ...schedulesEndpoints,
  ...searchEndpoints,
  ...sessionsEndpoints,
  ...timelineEndpoints,
  ...employabilitySkillsEndpoints,
}
