import { Request, Response } from 'express'
import aValidPrisonerSummary from '../../testsupport/prisonerSummaryTestDataBuilder'
import ViewGoalsController from './viewGoalsController'

jest.mock('../../services/educationAndWorkPlanService')

describe('viewGoalsController', () => {
  const controller = new ViewGoalsController()

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
      },
      params: { prisonNumber },
    } as unknown as Request
  })
  it('should get goals page', async () => {
    // Given
    const expectedView = {
      prisonerSummary,
      tab: 'goals',
    }

    // When
    await controller.viewGoals(req, res, next)

    // Then
    expect(res.render).toHaveBeenCalledWith('pages/overview/partials/goalsTab/goalsTabContents', expectedView)
  })
})
