import stubPing from '../common'
import challengesEndpoints from './challengesEndpoints'
import strengthsEndpoints from './strengthsEndpoints'
import conditionsEndpoints from './conditionsEndpoints'
import supportStrategiesEndpoints from './supportStrategiesEndpoints'
import additionalLearningNeedsScreenerEndpoints from './additionalLearningNeedsScreenerEndpoints'

export default {
  stubSupportAdditionalNeedsApiPing: stubPing('support-additional-needs-api'),
  ...challengesEndpoints,
  ...strengthsEndpoints,
  ...conditionsEndpoints,
  ...supportStrategiesEndpoints,
  ...additionalLearningNeedsScreenerEndpoints,
}
