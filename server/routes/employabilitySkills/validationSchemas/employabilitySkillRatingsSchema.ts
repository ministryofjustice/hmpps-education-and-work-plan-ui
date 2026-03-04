import { z } from 'zod'
import { createSchema } from '../../routerRequestHandlers/validationMiddleware'
import EmployabilitySkillRatingValue from '../../../enums/employabilitySkillRatingValue'
import EmployabilitySkillSessionType from '../../../enums/employabilitySkillSessionType'
import { isEmpty, textValueExceedsLength } from '../../../validators/textValueValidator'

const MAX_EVIDENCE_LENGTH = 200
const MAX_EDUCATION_COURSE_NAME_LENGTH = 100
const MAX_INDUSTRIES_WORKSHOP_NAME_LENGTH = 100

const employabilitySkillRatingsSchema = async () => {
  const ratingMandatoryMessage = 'Select a confidence rating'
  const evidenceMandatoryMessage = 'Enter evidence for the rating given'
  const evidenceMaxLengthMessage = `Evidence must be ${MAX_EVIDENCE_LENGTH} characters or less`
  const sessionTypeMandatoryMessage = 'Select an activity or session type'
  const educationCourseNameMandatoryMessage = 'Enter an education course name'
  const educationCourseNameMaxLengthMessage = `Course name must be ${MAX_EDUCATION_COURSE_NAME_LENGTH} characters or less`
  const industriesWorkshopNameMandatoryMessage = 'Enter an industries workshop name'
  const industriesWorkshopNameMaxLengthMessage = `Workshop name must be ${MAX_INDUSTRIES_WORKSHOP_NAME_LENGTH} characters or less`

  return createSchema({
    rating: z //
      .preprocess(
        val => (Object.keys(EmployabilitySkillRatingValue).includes((val as string) || '') ? val : null),
        z //
          .enum(EmployabilitySkillRatingValue)
          .optional()
          .nullable(),
      ),
    evidence: z //
      .string()
      .optional()
      .nullable(),
    sessionType: z //
      .preprocess(
        val => (Object.keys(EmployabilitySkillSessionType).includes((val as string) || '') ? val : null),
        z //
          .enum(EmployabilitySkillSessionType)
          .optional()
          .nullable(),
      ),
    educationCourseName: z //
      .string()
      .optional()
      .nullable(),
    industriesWorkshopName: z //
      .string()
      .optional()
      .nullable(),
  }).check(ctx => {
    const { rating, evidence, sessionType, educationCourseName, industriesWorkshopName } = ctx.value

    if (!rating) {
      ctx.issues.push({
        code: 'custom',
        input: ctx.value,
        path: ['rating'],
        message: ratingMandatoryMessage,
      })
    }
    if (!sessionType) {
      ctx.issues.push({
        code: 'custom',
        input: ctx.value,
        path: ['sessionType'],
        message: sessionTypeMandatoryMessage,
      })
    }
    if (isEmpty(evidence)) {
      ctx.issues.push({
        code: 'custom',
        input: ctx.value,
        path: ['evidence'],
        message: evidenceMandatoryMessage,
      })
    } else if (textValueExceedsLength(evidence, MAX_EVIDENCE_LENGTH)) {
      ctx.issues.push({
        code: 'custom',
        input: ctx.value,
        path: ['evidence'],
        message: evidenceMaxLengthMessage,
      })
    }

    if (sessionType === EmployabilitySkillSessionType.EDUCATION_REVIEW) {
      if (isEmpty(educationCourseName)) {
        ctx.issues.push({
          code: 'custom',
          input: ctx.value,
          path: ['educationCourseName'],
          message: educationCourseNameMandatoryMessage,
        })
      } else if (textValueExceedsLength(educationCourseName, MAX_EDUCATION_COURSE_NAME_LENGTH)) {
        ctx.issues.push({
          code: 'custom',
          input: ctx.value,
          path: ['educationCourseName'],
          message: educationCourseNameMaxLengthMessage,
        })
      }
    } else if (sessionType === EmployabilitySkillSessionType.INDUSTRIES_REVIEW) {
      if (isEmpty(industriesWorkshopName)) {
        ctx.issues.push({
          code: 'custom',
          input: ctx.value,
          path: ['industriesWorkshopName'],
          message: industriesWorkshopNameMandatoryMessage,
        })
      } else if (textValueExceedsLength(industriesWorkshopName, MAX_INDUSTRIES_WORKSHOP_NAME_LENGTH)) {
        ctx.issues.push({
          code: 'custom',
          input: ctx.value,
          path: ['industriesWorkshopName'],
          message: industriesWorkshopNameMaxLengthMessage,
        })
      }
    }
  })
}

export default employabilitySkillRatingsSchema
