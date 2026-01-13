import { Request, Response } from 'express'
import createError from 'http-errors'
import type { InductionSchedule } from 'viewModels'
import InductionService from '../../services/inductionService'
import checkInductionIsScheduled from './checkInductionIsScheduled'
import aValidInductionSchedule from '../../testsupport/inductionScheduleTestDataBuilder'
import InductionScheduleStatusValue from '../../enums/inductionScheduleStatusValue'

jest.mock('../../services/inductionService')

describe('checkInductionIsScheduled', () => {
  const inductionService = new InductionService(null) as jest.Mocked<InductionService>
  const requestHandler = checkInductionIsScheduled(inductionService)

  const prisonNumber = 'A1234BC'
  const username = 'a-dps-user'

  let req: Request
  let res: Response
  const next = jest.fn()

  beforeEach(() => {
    jest.resetAllMocks()
    req = {
      user: { username },
      params: { prisonNumber },
    } as unknown as Request
    res = {
      locals: {},
    } as unknown as Response
  })

  it('should call next with no arguments given prisoners induction schedule is SCHEDULED', async () => {
    // Given
    const inductionSchedule = aValidInductionSchedule({ scheduleStatus: InductionScheduleStatusValue.SCHEDULED })
    inductionService.getInductionSchedule.mockResolvedValue(inductionSchedule)

    // When
    await requestHandler(req, res, next)

    // Then
    expect(next).toHaveBeenCalledWith()
    expect(inductionService.getInductionSchedule).toHaveBeenCalledWith(prisonNumber, username)
  })

  it.each([
    InductionScheduleStatusValue.PENDING_INITIAL_SCREENING_AND_ASSESSMENTS_FROM_CURIOUS,
    InductionScheduleStatusValue.EXEMPT_PRISONER_DRUG_OR_ALCOHOL_DEPENDENCY,
    InductionScheduleStatusValue.EXEMPT_PRISONER_OTHER_HEALTH_ISSUES,
    InductionScheduleStatusValue.EXEMPT_PRISONER_FAILED_TO_ENGAGE,
    InductionScheduleStatusValue.EXEMPT_PRISONER_ESCAPED_OR_ABSCONDED,
    InductionScheduleStatusValue.EXEMPT_PRISONER_SAFETY_ISSUES,
    InductionScheduleStatusValue.EXEMPT_PRISON_REGIME_CIRCUMSTANCES,
    InductionScheduleStatusValue.EXEMPT_PRISON_STAFF_REDEPLOYMENT,
    InductionScheduleStatusValue.EXEMPT_PRISON_OPERATION_OR_SECURITY_ISSUE,
    InductionScheduleStatusValue.EXEMPT_SECURITY_ISSUE_RISK_TO_STAFF,
    InductionScheduleStatusValue.EXEMPT_SYSTEM_TECHNICAL_ISSUE,
    InductionScheduleStatusValue.EXEMPT_PRISONER_TRANSFER,
    InductionScheduleStatusValue.EXEMPT_PRISONER_RELEASE,
    InductionScheduleStatusValue.EXEMPT_PRISONER_DEATH,
    InductionScheduleStatusValue.EXEMPT_SCREENING_AND_ASSESSMENT_IN_PROGRESS,
    InductionScheduleStatusValue.EXEMPT_SCREENING_AND_ASSESSMENT_INCOMPLETE,
    InductionScheduleStatusValue.COMPLETED,
  ])('should call next with an error given prisoners induction schedule is not SCHEDULED', async scheduleStatus => {
    // Given
    const inductionSchedule = aValidInductionSchedule({ scheduleStatus })
    inductionService.getInductionSchedule.mockResolvedValue(inductionSchedule)

    const expectedError = createError(404, 'Induction Schedule for prisoner A1234BC is not SCHEDULED')

    // When
    await requestHandler(req, res, next)

    // Then
    expect(next).toHaveBeenCalledWith(expectedError)
    expect(inductionService.getInductionSchedule).toHaveBeenCalledWith(prisonNumber, username)
  })

  it('should call next with an error given prisoners induction schedule does not exist', async () => {
    // Given
    const inductionSchedule = { problemRetrievingData: false } as InductionSchedule
    inductionService.getInductionSchedule.mockResolvedValue(inductionSchedule)

    const expectedError = createError(404, 'Induction Schedule for prisoner A1234BC is not SCHEDULED')

    // When
    await requestHandler(req, res, next)

    // Then
    expect(next).toHaveBeenCalledWith(expectedError)
    expect(inductionService.getInductionSchedule).toHaveBeenCalledWith(prisonNumber, username)
  })

  it('should call next with an error given Induction service returns an unexpected error', async () => {
    // Given
    const inductionServiceError = {
      status: 500,
      data: {
        status: 500,
        userMessage: 'An unexpected error occurred',
        developerMessage: 'An unexpected error occurred',
      },
    }
    inductionService.getInductionSchedule.mockRejectedValue(inductionServiceError)

    const expectedError = createError(
      500,
      'Education and Work Plan API returned an error in response to getting the Induction Schedule for prisoner A1234BC',
    )

    // When
    await requestHandler(req, res, next)

    // Then
    expect(next).toHaveBeenCalledWith(expectedError)
    expect(inductionService.getInductionSchedule).toHaveBeenCalledWith(prisonNumber, username)
  })
})
