import { Request, Response } from 'express'
import { z } from 'zod'
import { createSchema } from '../../routerRequestHandlers/validationMiddleware'
import QualificationLevelValue from '../../../enums/qualificationLevelValue'
import formatQualificationLevelFilter from '../../../filters/formatQualificationLevelFilter'
import { getPrisonerContext } from '../../../data/session/prisonerContexts'

const MAX_QUALIFICATION_SUBJECT_LENGTH = 100
const MAX_QUALIFICATION_GRADE_LENGTH = 50

const qualificationDetailsSchema = async (req: Request, res: Response) => {
  const { prisonerSummary } = res.locals
  const { prisonNumber } = req.params

  // Check both locations for qualificationLevelForm (dual journey support)
  const prisonerContext = getPrisonerContext(req.session, prisonNumber)
  const qualificationLevelForm = req.session.qualificationLevelForm || prisonerContext.qualificationLevelForm
  const qualificationLevel = qualificationLevelForm?.qualificationLevel as QualificationLevelValue
  const formattedLevel = formatQualificationLevelFilter(qualificationLevel).toLowerCase()

  const qualificationSubjectMandatoryMessage = `Enter the subject of ${prisonerSummary.firstName} ${prisonerSummary.lastName}'s ${formattedLevel} qualification`
  const qualificationGradeMandatoryMessage = `Enter the grade of ${prisonerSummary.firstName} ${prisonerSummary.lastName}'s ${formattedLevel} qualification`

  return createSchema({
    qualificationSubject: z
      .string({ message: qualificationSubjectMandatoryMessage })
      .min(1, qualificationSubjectMandatoryMessage)
      .max(MAX_QUALIFICATION_SUBJECT_LENGTH, `Subject must be ${MAX_QUALIFICATION_SUBJECT_LENGTH} characters or less`),
    qualificationGrade: z
      .string({ message: qualificationGradeMandatoryMessage })
      .min(1, qualificationGradeMandatoryMessage)
      .max(MAX_QUALIFICATION_GRADE_LENGTH, `Grade must be ${MAX_QUALIFICATION_GRADE_LENGTH} characters or less`),
  })
}

export default qualificationDetailsSchema
