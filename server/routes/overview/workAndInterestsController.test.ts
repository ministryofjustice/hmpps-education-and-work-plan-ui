import { NextFunction, Request, Response } from 'express'
import type { WorkAndInterests } from 'viewModels'
import aValidPrisonerSummary from '../../testsupport/prisonerSummaryTestDataBuilder'
import aValidLongQuestionSetWorkAndInterests from '../../testsupport/workAndInterestsTestDataBuilder'
import InductionService from '../../services/inductionService'
import WorkAndInterestsController from './workAndInterestsController'

jest.mock('../../services/inductionService')

describe('workAndInterestsController', () => {
  const inductionService = new InductionService(null) as jest.Mocked<InductionService>

  const controller = new WorkAndInterestsController(inductionService)

  const prisonNumber = 'A1234GC'
  const prisonerSummary = aValidPrisonerSummary(prisonNumber)

  let req: Request
  const res = {
    render: jest.fn(),
  } as unknown as Response
  const next = jest.fn()

  beforeEach(() => {
    jest.resetAllMocks()
    req = {
      session: { prisonerSummary },
      user: {
        username: 'a-dps-user',
        token: 'a-user-token',
      },
      params: { prisonNumber },
    } as unknown as Request
  })

  it('should get work and interests view', async () => {
    // Given
    const expectedTab = 'work-and-interests'
    req.params.tab = expectedTab

    const expectedWorkAndInterests: WorkAndInterests = aValidLongQuestionSetWorkAndInterests()
    inductionService.getWorkAndInterests.mockResolvedValue(expectedWorkAndInterests)

    const expectedView = {
      prisonerSummary,
      tab: expectedTab,
      workAndInterests: expectedWorkAndInterests,
    }

    // When
    await controller.getWorkAndInterestsView(
      req as undefined as Request,
      res as undefined as Response,
      next as undefined as NextFunction,
    )

    // Then
    expect(res.render).toHaveBeenCalledWith('pages/overview/index', expectedView)
    expect(inductionService.getWorkAndInterests).toHaveBeenCalledWith(prisonNumber, 'a-user-token')
  })
})
