import { z } from 'zod'
import SessionCompletedByValue from '../../../enums/sessionCompletedByValue'
import { createSchema, dateIsTodayOrInThePast } from '../../routerRequestHandlers/validationMiddleware'

const whoCompletedInductionSchema = async () => {
  const MAX_COMPLETED_BY_FULL_NAME_LENGTH = 200
  const MAX_COMPLETED_BY_JOB_ROLE_LENGTH = 200

  const completedByMandatoryMessage = 'Select who completed the induction'
  const completedByFullNameMandatoryMessage = 'Enter the full name of the person who completed the induction'
  const completedByFullNameMaxLengthMessage = `Full name must be ${MAX_COMPLETED_BY_FULL_NAME_LENGTH} characters or less`
  const completedByJobRoleMandatoryMessage = 'Enter the job title of the person who completed the induction'
  const completedByJobRoleMaxLengthMessage = `Job role must be ${MAX_COMPLETED_BY_JOB_ROLE_LENGTH} characters or less`
  const inductionDateMandatoryMessage = 'Enter a valid date'
  const inductionDateInvalidMessage = 'Enter a valid date'
  const inductionDateNotInPastMessage = 'Enter a valid date. Date cannot be in the future'

  return createSchema({
    completedBy: z //
      .enum(SessionCompletedByValue, { message: completedByMandatoryMessage }),
    completedByOtherFullName: z //
      .string()
      .max(MAX_COMPLETED_BY_FULL_NAME_LENGTH, completedByFullNameMaxLengthMessage)
      .optional(),
    completedByOtherJobRole: z //
      .string()
      .max(MAX_COMPLETED_BY_JOB_ROLE_LENGTH, completedByJobRoleMaxLengthMessage)
      .optional(),
    inductionDate: dateIsTodayOrInThePast({
      mandatoryMessage: inductionDateMandatoryMessage,
      invalidFormatMessage: inductionDateInvalidMessage,
      invalidMessage: inductionDateNotInPastMessage,
    }),
  })
    .refine(
      ({ completedBy, completedByOtherFullName }) => {
        if (completedBy === SessionCompletedByValue.SOMEBODY_ELSE) {
          return (completedByOtherFullName ?? '') !== ''
        }
        return true
      },
      {
        path: ['completedByOtherFullName'],
        message: completedByFullNameMandatoryMessage,
      },
    )
    .refine(
      ({ completedBy, completedByOtherJobRole }) => {
        if (completedBy === SessionCompletedByValue.SOMEBODY_ELSE) {
          return (completedByOtherJobRole ?? '') !== ''
        }
        return true
      },
      {
        path: ['completedByOtherJobRole'],
        message: completedByJobRoleMandatoryMessage,
      },
    )
}

export default whoCompletedInductionSchema
