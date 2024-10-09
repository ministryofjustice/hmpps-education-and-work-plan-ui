import { Request, Response } from 'express'
import aValidPrisonerSummary from '../../testsupport/prisonerSummaryTestDataBuilder'
import aValidPrisonerSupportNeeds from '../../testsupport/supportNeedsTestDataBuilder'
import CuriousService from '../../services/curiousService'
import PrisonService from '../../services/prisonService'
import SupportNeedsController from './supportNeedsController'

jest.mock('../../services/curiousService')
jest.mock('../../services/prisonService')

describe('supportNeedsController', () => {
  const curiousService = new CuriousService(null, null, null) as jest.Mocked<CuriousService>
  const prisonService = new PrisonService(null, null, null) as jest.Mocked<PrisonService>

  const controller = new SupportNeedsController(curiousService, prisonService)

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

  it('should get support needs view', async () => {
    // Given
    const expectedTab = 'support-needs'
    req.params.tab = expectedTab

    const prisonId = 'MDI'

    const expectedSupportNeeds = aValidPrisonerSupportNeeds()
    curiousService.getPrisonerSupportNeeds.mockResolvedValue(expectedSupportNeeds)
    prisonService.getAllPrisonNamesById.mockResolvedValue(new Map([[prisonId, 'Moorland (HMP & YOI)']]))
    const expectedView = {
      prisonerSummary,
      tab: expectedTab,
      supportNeeds: expectedSupportNeeds,
      atLeastOnePrisonHasSupportNeeds: true,
    }

    // When
    await controller.getSupportNeedsView(req, res, next)

    // Then
    expect(res.render).toHaveBeenCalledWith('pages/overview/index', expectedView)
    expect(prisonService.getAllPrisonNamesById).toHaveBeenCalledWith('a-dps-user')
  })
})
