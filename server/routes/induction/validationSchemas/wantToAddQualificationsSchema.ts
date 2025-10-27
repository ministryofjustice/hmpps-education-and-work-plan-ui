import { Request, Response } from 'express'
import { z } from 'zod'
import { createSchema } from '../../routerRequestHandlers/validationMiddleware'
import YesNoValue from '../../../enums/yesNoValue'

const wantToAddQualificationsSchema = async (req: Request, res: Response) => {
  const { prisonerSummary } = res.locals

  const wantToAddQualificationsMandatoryMessage = `Select whether ${prisonerSummary.firstName} ${prisonerSummary.lastName} wants to record any other educational qualifications`

  return createSchema({
    wantToAddQualifications: z //
      .enum(YesNoValue, { message: wantToAddQualificationsMandatoryMessage }),
  })
}

export default wantToAddQualificationsSchema
