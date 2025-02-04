import { NextFunction, Request, RequestHandler, Response } from 'express'
import createError from 'http-errors'
import { InductionService } from '../../services'
import asyncMiddleware from '../../middleware/asyncMiddleware'
import InductionScheduleStatusValue from '../../enums/inductionScheduleStatusValue'

/**
 *  Middleware function that returns a Request handler function that checks that the prisoners InductionSchedule is one of the supported exemption statuses
 */
const checkInductionIsExempt = (inductionService: InductionService): RequestHandler => {
  return asyncMiddleware(async (req: Request, res: Response, next: NextFunction) => {
    const { prisonNumber } = req.params

    let nextErr
    try {
      const inductionSchedule = await inductionService.getInductionSchedule(prisonNumber, req.user.username)
      if (!isInductionExemptionReasonValue(inductionSchedule.scheduleStatus)) {
        nextErr = createError(
          404,
          `Induction Schedule for prisoner ${prisonNumber} is not one of the Exemption reasons`,
        )
      }
    } catch (error) {
      nextErr = createError(
        error.status,
        `Education and Work Plan API returned an error in response to getting the Induction Schedule for prisoner ${prisonNumber}`,
      )
    }

    if (nextErr) {
      next(nextErr)
    } else {
      next()
    }
  })
}

const isInductionExemptionReasonValue = (scheduleStatus: InductionScheduleStatusValue) => {
  return [
    InductionScheduleStatusValue.EXEMPT_PRISONER_DRUG_OR_ALCOHOL_DEPENDENCY,
    InductionScheduleStatusValue.EXEMPT_PRISONER_OTHER_HEALTH_ISSUES,
    InductionScheduleStatusValue.EXEMPT_PRISONER_FAILED_TO_ENGAGE,
    InductionScheduleStatusValue.EXEMPT_PRISONER_ESCAPED_OR_ABSCONDED,
    InductionScheduleStatusValue.EXEMPT_PRISON_REGIME_CIRCUMSTANCES,
    InductionScheduleStatusValue.EXEMPT_PRISONER_SAFETY_ISSUES,
    InductionScheduleStatusValue.EXEMPT_PRISON_STAFF_REDEPLOYMENT,
    InductionScheduleStatusValue.EXEMPT_PRISON_OPERATION_OR_SECURITY_ISSUE,
    InductionScheduleStatusValue.EXEMPT_SECURITY_ISSUE_RISK_TO_STAFF,
    InductionScheduleStatusValue.EXEMPT_SYSTEM_TECHNICAL_ISSUE,
    InductionScheduleStatusValue.EXEMPT_SCREENING_AND_ASSESSMENT_IN_PROGRESS,
    InductionScheduleStatusValue.EXEMPT_SCREENING_AND_ASSESSMENT_INCOMPLETE,
  ].includes(scheduleStatus)
}

export default checkInductionIsExempt
