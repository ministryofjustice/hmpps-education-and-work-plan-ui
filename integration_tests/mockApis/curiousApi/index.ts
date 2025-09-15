import curiousV1LearnerProfileEndpoints from './curiousV1LearnerProfileEndpoints'
import curiousV2LearnerAssessmentsEndpoints from './curiousV2LearnerAssessmentsEndpoints'
import curiousV2LearnerQualificationsEndpoints from './curiousV2LearnerQualificationsEndpoints'

export default {
  ...curiousV1LearnerProfileEndpoints,
  ...curiousV2LearnerAssessmentsEndpoints,
  ...curiousV2LearnerQualificationsEndpoints,
}
