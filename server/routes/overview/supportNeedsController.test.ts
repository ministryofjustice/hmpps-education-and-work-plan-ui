import { Request, Response } from 'express'
import aValidPrisonerSummary from '../../testsupport/prisonerSummaryTestDataBuilder'
import aValidPrisonerSupportNeeds from '../../testsupport/supportNeedsTestDataBuilder'
import SupportNeedsController from './supportNeedsController'

jest.mock('../../services/curiousService')
jest.mock('../../services/prisonService')

describe('supportNeedsController', () => {
  const controller = new SupportNeedsController()

  const prisonNumber = 'A1234GC'
  const prisonerSummary = aValidPrisonerSummary(prisonNumber)
  const prisonerSupportNeeds = aValidPrisonerSupportNeeds()

  const req = {
    user: {
      username: 'a-dps-user',
      token: 'a-user-token',
    },
    params: { prisonNumber },
  } as unknown as Request
  const res = {
    render: jest.fn(),
    locals: {
      prisonerSummary,
      prisonerSupportNeeds,
    },
  } as unknown as Response
  const next = jest.fn()

  beforeEach(() => {
    jest.resetAllMocks()
  })

  it('should get support needs view', async () => {
    // Given
    const expectedTab = 'support-needs'
    req.params.tab = expectedTab

    const expectedView = {
      prisonerSummary,
      tab: expectedTab,
      supportNeeds: prisonerSupportNeeds,
      atLeastOnePrisonHasSupportNeeds: true,
    }

    // When
    await controller.getSupportNeedsView(req, res, next)

    // Then
    expect(res.render).toHaveBeenCalledWith('pages/overview/index', expectedView)
  })
})
