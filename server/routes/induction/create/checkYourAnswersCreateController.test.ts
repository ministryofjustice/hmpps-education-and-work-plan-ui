import createError from 'http-errors'
import { Request, Response } from 'express'
import aValidPrisonerSummary from '../../../testsupport/prisonerSummaryTestDataBuilder'
import { aValidInductionDto } from '../../../testsupport/inductionDtoTestDataBuilder'
import CheckYourAnswersCreateController from './checkYourAnswersCreateController'
import aValidCreateOrUpdateInductionDto from '../../../testsupport/createInductionDtoTestDataBuilder'
import InductionService from '../../../services/inductionService'
import toCreateOrUpdateInductionDto from '../../../data/mappers/createOrUpdateInductionDtoMapper'

jest.mock('../../../services/inductionService')
jest.mock('../../../data/mappers/createOrUpdateInductionDtoMapper')

describe('checkYourAnswersCreateController', () => {
  const mockedCreateOrUpdateInductionDtoMapper = toCreateOrUpdateInductionDto as jest.MockedFunction<
    typeof toCreateOrUpdateInductionDto
  >

  const inductionService = new InductionService(null, null) as jest.Mocked<InductionService>
  const controller = new CheckYourAnswersCreateController(inductionService)

  const prisonNumber = 'A1234BC'
  const username = 'a-dps-user'
  const prisonerSummary = aValidPrisonerSummary()
  const inductionDto = aValidInductionDto()

  const flash = jest.fn()
  const req = {
    session: {},
    journeyData: {},
    params: { prisonNumber },
    user: { username },
    flash,
  } as unknown as Request
  const res = {
    redirect: jest.fn(),
    render: jest.fn(),
    locals: { prisonerSummary },
  } as unknown as Response

  const next = jest.fn()

  beforeEach(() => {
    jest.resetAllMocks()
    req.journeyData.inductionDto = inductionDto
  })

  describe('getCheckYourAnswersView', () => {
    it('should get the Check Your Answers view', async () => {
      // Given

      // When
      const expectedView = { prisonerSummary, inductionDto }

      // When
      await controller.getCheckYourAnswersView(req, res, next)

      // Then
      expect(res.render).toHaveBeenCalledWith('pages/induction/checkYourAnswers/index', expectedView)
      expect(req.journeyData.inductionDto).toEqual(inductionDto)
    })
  })

  describe('submitCheckYourAnswers', () => {
    it('should create Induction and call API and redirect to induction created callback page', async () => {
      // Given
      const createInductionDto = aValidCreateOrUpdateInductionDto()
      mockedCreateOrUpdateInductionDtoMapper.mockReturnValueOnce(createInductionDto)

      // When
      await controller.submitCheckYourAnswers(req, res, next)

      // Then
      expect(mockedCreateOrUpdateInductionDtoMapper).toHaveBeenCalledWith(prisonerSummary.prisonId, inductionDto)
      expect(inductionService.createInduction).toHaveBeenCalledWith(prisonNumber, createInductionDto, username)
      expect(res.redirect).toHaveBeenCalledWith(`/plan/${prisonNumber}/induction-created`)
      expect(req.journeyData.inductionDto).toBeUndefined()
      expect(req.session.pageFlowHistory).toBeUndefined()
      expect(flash).not.toHaveBeenCalled()
    })

    it('should not create Induction given error calling service', async () => {
      // Given
      const createInductionDto = aValidCreateOrUpdateInductionDto()
      mockedCreateOrUpdateInductionDtoMapper.mockReturnValueOnce(createInductionDto)

      inductionService.createInduction.mockRejectedValue(createError(500, 'Service unavailable'))

      // When
      await controller.submitCheckYourAnswers(req, res, next)

      // Then
      expect(mockedCreateOrUpdateInductionDtoMapper).toHaveBeenCalledWith(prisonerSummary.prisonId, inductionDto)
      expect(inductionService.createInduction).toHaveBeenCalledWith(prisonNumber, createInductionDto, username)
      expect(req.journeyData.inductionDto).toEqual(inductionDto)
      expect(res.redirect).toHaveBeenCalledWith('check-your-answers')
      expect(flash).toHaveBeenCalledWith('pageHasApiErrors', 'true')
      expect(res.redirect).toHaveBeenCalledWith('check-your-answers')
    })
  })
})
