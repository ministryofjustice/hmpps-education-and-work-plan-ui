import { Request, Response } from 'express'
import { z } from 'zod'
import { createSchema } from '../../routerRequestHandlers/validationMiddleware'
import HopingToGetWorkValue from '../../../enums/hopingToGetWorkValue'

const hopingToWorkOnReleaseSchema = async (req: Request, res: Response) => {
  const { prisonerSummary } = res.locals
  const hopingToWorkMandatoryMessage = `Select whether ${prisonerSummary.firstName} ${prisonerSummary.lastName} is hoping to get work`
  return createSchema({
    hopingToGetWork: z //
      .nativeEnum(HopingToGetWorkValue, { message: hopingToWorkMandatoryMessage }),
  })
}

export default hopingToWorkOnReleaseSchema
