import { Request, Response } from 'express'
import aValidPrisonerSummary from '../../testsupport/prisonerSummaryTestDataBuilder'
import { validCuriousAlnAndLddAssessments } from '../../testsupport/curiousAlnAndLddAssessmentsTestDataBuilder'
import AdditionalNeedsController from './additionalNeedsController'
import { Result } from '../../utils/result/result'

jest.mock('../../services/curiousService')
jest.mock('../../services/prisonService')

describe('additionalNeedsController', () => {
  const controller = new AdditionalNeedsController()

  const prisonNumber = 'A1234GC'
  const prisonerSummary = aValidPrisonerSummary({ prisonNumber })
  const curiousAlnAndLddAssessments = Result.fulfilled(validCuriousAlnAndLddAssessments())
  const prisonNamesById = Result.fulfilled({ MDI: 'Moorland (HMP & YOI)', WDI: 'Wakefield (HMP)' })

  const req = {
    user: {
      username: 'a-dps-user',
    },
    params: { prisonNumber },
  } as unknown as Request
  const res = {
    render: jest.fn(),
    locals: {
      prisonerSummary,
      curiousAlnAndLddAssessments,
      prisonNamesById,
    },
  } as unknown as Response
  const next = jest.fn()

  beforeEach(() => {
    jest.resetAllMocks()
  })

  it('should get additional needs view', async () => {
    // Given
    const expectedTab = 'additional-needs'
    req.params.tab = expectedTab

    const expectedView = {
      tab: expectedTab,
      prisonerSummary,
      prisonNamesById,
      curiousAlnAndLddAssessments,
    }

    // When
    await controller.getAdditionalNeedsView(req, res, next)

    // Then
    expect(res.render).toHaveBeenCalledWith('pages/overview/index', expectedView)
  })
})
