import { Request, Response } from 'express'
import aValidPrisonerSummary from '../../testsupport/prisonerSummaryTestDataBuilder'
import aValidPrisonerSupportNeeds from '../../testsupport/supportNeedsTestDataBuilder'
import SupportNeedsController from './supportNeedsController'
import { Result } from '../../utils/result/result'

jest.mock('../../services/curiousService')
jest.mock('../../services/prisonService')

describe('supportNeedsController', () => {
  const controller = new SupportNeedsController()

  const prisonNumber = 'A1234GC'
  const prisonerSummary = aValidPrisonerSummary({ prisonNumber })
  const prisonerSupportNeeds = Result.fulfilled(aValidPrisonerSupportNeeds())
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
      prisonerSupportNeeds,
      prisonNamesById,
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
      tab: expectedTab,
      prisonerSummary,
      prisonNamesById,
      supportNeeds: prisonerSupportNeeds,
    }

    // When
    await controller.getSupportNeedsView(req, res, next)

    // Then
    expect(res.render).toHaveBeenCalledWith('pages/overview/index', expectedView)
  })
})
