import { Request, Response } from 'express'
import aValidPrisonerSummary from '../../testsupport/prisonerSummaryTestDataBuilder'
import WorkAndInterestsController from './workAndInterestsController'
import { aLongQuestionSetInductionDto } from '../../testsupport/inductionDtoTestDataBuilder'

describe('workAndInterestsController', () => {
  const controller = new WorkAndInterestsController()

  const prisonNumber = 'A1234GC'
  const prisonerSummary = aValidPrisonerSummary(prisonNumber)

  const expectedTab = 'work-and-interests'

  const induction = {
    problemRetrievingData: false,
    inductionDto: aLongQuestionSetInductionDto(),
  }

  let req: Request
  let res: Response
  const next = jest.fn()

  beforeEach(() => {
    jest.resetAllMocks()
    req = {
      session: { prisonerSummary },
      params: {
        tab: expectedTab,
      },
    } as unknown as Request
    res = {
      render: jest.fn(),
      locals: {
        induction,
      },
    } as unknown as Response
  })

  it('should get work and interests view', async () => {
    // Given
    const expectedView = {
      prisonerSummary,
      tab: expectedTab,
      induction,
    }

    // When
    await controller.getWorkAndInterestsView(req, res, next)

    // Then
    expect(res.render).toHaveBeenCalledWith('pages/overview/index', expectedView)
  })
})
