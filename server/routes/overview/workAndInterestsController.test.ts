import { Request, Response } from 'express'
import { startOfDay } from 'date-fns'
import aValidPrisonerSummary from '../../testsupport/prisonerSummaryTestDataBuilder'
import WorkAndInterestsController from './workAndInterestsController'
import { aValidInductionDto } from '../../testsupport/inductionDtoTestDataBuilder'
import aValidInductionSchedule from '../../testsupport/inductionScheduleTestDataBuilder'
import InductionScheduleStatusValue from '../../enums/inductionScheduleStatusValue'

describe('workAndInterestsController', () => {
  const controller = new WorkAndInterestsController()

  const prisonNumber = 'A1234GC'
  const prisonerSummary = aValidPrisonerSummary({ prisonNumber })

  const expectedTab = 'work-and-interests'

  const induction = {
    problemRetrievingData: false,
    inductionDto: aValidInductionDto(),
  }
  const inductionSchedule = aValidInductionSchedule({ scheduleStatus: InductionScheduleStatusValue.COMPLETED })

  let req: Request
  let res: Response
  const next = jest.fn()

  beforeEach(() => {
    jest.resetAllMocks()
    req = {
      params: {
        tab: expectedTab,
      },
    } as unknown as Request
    res = {
      render: jest.fn(),
      locals: {
        induction,
        prisonerSummary,
        inductionSchedule,
      },
    } as unknown as Response
  })

  it('should get work and interests view', async () => {
    // Given
    const expectedView = {
      prisonerSummary,
      tab: expectedTab,
      induction,
      inductionSchedule: {
        problemRetrievingData: false,
        inductionStatus: 'COMPLETE',
        inductionDueDate: startOfDay('2024-12-10'),
      },
    }

    // When
    await controller.getWorkAndInterestsView(req, res, next)

    // Then
    expect(res.render).toHaveBeenCalledWith('pages/overview/index', expectedView)
  })
})
