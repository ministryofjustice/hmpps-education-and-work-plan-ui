import curiousV1LearnerProfileEndpoints from './curiousV1LearnerProfileEndpoints'
import curiousV1LearnerEducationEndpoints from './curiousV1LearnerEducationEndpoints'
import curiousV2LearnerAssessmentsEndpoints from './curiousV2LearnerAssessmentsEndpoints'

export default {
  ...curiousV1LearnerProfileEndpoints,
  ...curiousV1LearnerEducationEndpoints,
  ...curiousV2LearnerAssessmentsEndpoints,
}
