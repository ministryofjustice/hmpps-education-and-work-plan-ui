import { Request, Response } from 'express'
import { z } from 'zod'
import { createSchema } from '../../routerRequestHandlers/validationMiddleware'

const previousWorkExperienceDetailSchema = async (req: Request, res: Response) => {
  const { prisonerSummary } = res.locals

  const MAX_JOB_ROLE_LENGTH = 256
  const MAX_JOB_DETAILS_LENGTH = 512
  const jobRoleMandatoryMessage = `Enter the job role ${prisonerSummary.firstName} ${prisonerSummary.lastName} wants to add`
  const jobRoleMaxLengthMessage = `Job role must be ${MAX_JOB_ROLE_LENGTH} characters or less`
  const jobDetailsMandatoryMessage = `Enter details of what ${prisonerSummary.firstName} ${prisonerSummary.lastName} did in their job`
  const jobDetailsMaxLengthMessage = `Main tasks and responsibilities must be ${MAX_JOB_DETAILS_LENGTH} characters or less`

  return createSchema({
    jobRole: z //
      .string({ message: jobRoleMandatoryMessage })
      .trim()
      .min(1, { message: jobRoleMandatoryMessage })
      .max(MAX_JOB_ROLE_LENGTH, { message: jobRoleMaxLengthMessage }),
    jobDetails: z //
      .string({ message: jobDetailsMandatoryMessage })
      .trim()
      .min(1, { message: jobDetailsMandatoryMessage })
      .max(MAX_JOB_DETAILS_LENGTH, { message: jobDetailsMaxLengthMessage }),
  })
}

export default previousWorkExperienceDetailSchema
