import { z } from 'zod'
import { createSchema, dateIsTodayOrInThePast } from '../../routerRequestHandlers/validationMiddleware'
import SessionCompletedByValue from '../../../enums/sessionCompletedByValue'
import { isEmpty, textValueExceedsLength } from '../../../validators/textValueValidator'

const whoCompletedReviewSchema = async () => {
  const MAX_COMPLETED_BY_OTHER_FULL_NAME_LENGTH = 200
  const MAX_COMPLETED_BY_OTHER_JOB_ROLE_LENGTH = 200

  const completedByMandatoryMessage = 'Select who completed the review'
  const completedByOtherFullNameMandatoryMessage = 'Enter the full name of the person who completed the review'
  const completedByOtherFullNameMaxLengthMessage = `Full name must be ${MAX_COMPLETED_BY_OTHER_FULL_NAME_LENGTH} characters or less`
  const completedByOtherJobRoleMandatoryMessage = 'Enter the job title of the person who completed the review'
  const completedByOtherJobRoleMaxLengthMessage = `Job role must be ${MAX_COMPLETED_BY_OTHER_FULL_NAME_LENGTH} characters or less`
  const reviewDateMandatoryMessage = 'Enter a valid date'
  const reviewDateInvalidMessage = 'Enter a valid date'
  const reviewDateNotInPastMessage = 'Enter a valid date. Date cannot be in the future'

  return createSchema({
    completedBy: z //
      .nativeEnum(SessionCompletedByValue, { message: completedByMandatoryMessage }),
    completedByOtherFullName: z //
      .string()
      .nullable()
      .optional(),
    completedByOtherJobRole: z //
      .string()
      .nullable()
      .optional(),
    reviewDate: dateIsTodayOrInThePast({
      mandatoryMessage: reviewDateMandatoryMessage,
      invalidFormatMessage: reviewDateInvalidMessage,
      invalidMessage: reviewDateNotInPastMessage,
    }),
  })
    .refine(
      ({ completedBy, completedByOtherFullName }) => {
        if (completedBy === SessionCompletedByValue.SOMEBODY_ELSE) {
          return !isEmpty(completedByOtherFullName)
        }
        return true
      },
      { path: ['completedByOtherFullName'], message: completedByOtherFullNameMandatoryMessage },
    )
    .refine(
      ({ completedBy, completedByOtherFullName }) => {
        if (completedByOtherFullName && completedBy === SessionCompletedByValue.SOMEBODY_ELSE) {
          return !textValueExceedsLength(completedByOtherFullName, MAX_COMPLETED_BY_OTHER_FULL_NAME_LENGTH)
        }
        return true
      },
      { path: ['completedByOtherFullName'], message: completedByOtherFullNameMaxLengthMessage },
    )
    .refine(
      ({ completedBy, completedByOtherJobRole }) => {
        if (completedBy === SessionCompletedByValue.SOMEBODY_ELSE) {
          return !isEmpty(completedByOtherJobRole)
        }
        return true
      },
      { path: ['completedByOtherJobRole'], message: completedByOtherJobRoleMandatoryMessage },
    )
    .refine(
      ({ completedBy, completedByOtherJobRole }) => {
        if (completedByOtherJobRole && completedBy === SessionCompletedByValue.SOMEBODY_ELSE) {
          return !textValueExceedsLength(completedByOtherJobRole, MAX_COMPLETED_BY_OTHER_JOB_ROLE_LENGTH)
        }
        return true
      },
      { path: ['completedByOtherJobRole'], message: completedByOtherJobRoleMaxLengthMessage },
    )
}

export default whoCompletedReviewSchema
