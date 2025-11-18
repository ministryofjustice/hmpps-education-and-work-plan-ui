import { Request, Response } from 'express'
import { z } from 'zod'
import { createSchema } from '../../routerRequestHandlers/validationMiddleware'
import QualificationLevelValue from '../../../enums/qualificationLevelValue'

const qualificationLevelSchema = async (req: Request, res: Response) => {
  const { prisonerSummary } = res.locals

  const qualificationLevelMandatoryMessage = `Select the level of qualification ${prisonerSummary.firstName} ${prisonerSummary.lastName} wants to add`

  return createSchema({
    qualificationLevel: z //
      .enum(QualificationLevelValue, { message: qualificationLevelMandatoryMessage }),
  })
}

export default qualificationLevelSchema
