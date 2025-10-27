import { Request, Response } from 'express'
import { z } from 'zod'
import { createSchema } from '../../routerRequestHandlers/validationMiddleware'
import EducationLevelValue from '../../../enums/educationLevelValue'

const highestLevelOfEducationSchema = async (req: Request, res: Response) => {
  const { prisonerSummary } = res.locals

  const educationLevelMandatoryMessage = `Select ${prisonerSummary.firstName} ${prisonerSummary.lastName}'s highest level of education`

  return createSchema({
    educationLevel: z //
      .enum(EducationLevelValue, { message: educationLevelMandatoryMessage }),
  })
}

export default highestLevelOfEducationSchema
