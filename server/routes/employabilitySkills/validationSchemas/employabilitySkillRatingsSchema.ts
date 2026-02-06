import { z } from 'zod'
import { createSchema } from '../../routerRequestHandlers/validationMiddleware'
import EmployabilitySkillRatingValue from '../../../enums/employabilitySkillRatingValue'

const MAX_EVIDENCE_LENGTH = 200

const employabilitySkillRatingsSchema = async () => {
  const ratingMandatoryMessage = 'Select a confidence rating'
  const evidenceMandatoryMessage = 'Enter evidence for the rating given'
  const evidenceMaxLengthMessage = `Evidence must be ${MAX_EVIDENCE_LENGTH} characters or less`

  return createSchema({
    rating: z //
      .enum(EmployabilitySkillRatingValue, { message: ratingMandatoryMessage }),
    evidence: z //
      .string({ message: evidenceMandatoryMessage })
      .trim()
      .min(1, { message: evidenceMandatoryMessage })
      .max(MAX_EVIDENCE_LENGTH, { message: evidenceMaxLengthMessage }),
  })
}

export default employabilitySkillRatingsSchema
