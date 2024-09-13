import createError from 'http-errors'
import { NextFunction, Request, Response } from 'express'
import type { SessionData } from 'express-session'
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
  const prisonerSummary = aValidPrisonerSummary()

  let req: Request
  let res: Response

  const next = jest.fn()

  beforeEach(() => {
    jest.resetAllMocks()
    req = {
      session: { prisonerSummary } as SessionData,
      user: { token: 'some-token' } as Express.User,
      params: { prisonNumber } as Record<string, string>,
    } as unknown as Request
    res = {
      redirect: jest.fn(),
      render: jest.fn(),
    } as unknown as Response
  })

  describe('getCheckYourAnswersView', () => {
    it('should get the Check Your Answers view', async () => {
      // Given
      const inductionDto = aValidInductionDto()
      req.session.inductionDto = inductionDto

      // When
      const expectedView = { prisonerSummary, inductionDto }

      // When
      await controller.getCheckYourAnswersView(
        req as undefined as Request,
        res as undefined as Response,
        next as undefined as NextFunction,
      )

      // Then
      expect(res.render).toHaveBeenCalledWith('pages/induction/checkYourAnswers/index', expectedView)
      expect(req.session.inductionDto).toEqual(inductionDto)
    })
  })

  describe('submitCheckYourAnswers', () => {
    it('should create Induction and call API and redirect to induction created callback page', async () => {
      // Given
      const inductionDto = aValidInductionDto()
      req.session.inductionDto = inductionDto

      const createInductionDto = aValidCreateOrUpdateInductionDto()
      mockedCreateOrUpdateInductionDtoMapper.mockReturnValueOnce(createInductionDto)

      // When
      await controller.submitCheckYourAnswers(
        req as undefined as Request,
        res as undefined as Response,
        next as undefined as NextFunction,
      )

      // Then
      expect(mockedCreateOrUpdateInductionDtoMapper).toHaveBeenCalledWith(prisonerSummary.prisonId, inductionDto)
      expect(inductionService.createInduction).toHaveBeenCalledWith(prisonNumber, createInductionDto, 'some-token')
      expect(res.redirect).toHaveBeenCalledWith(`/plan/${prisonNumber}/induction-created`)
      expect(req.session.inductionDto).toBeUndefined()
      expect(req.session.pageFlowHistory).toBeUndefined()
    })

    it('should not create Induction given error calling service', async () => {
      // Given
      const inductionDto = aValidInductionDto()
      req.session.inductionDto = inductionDto

      const createInductionDto = aValidCreateOrUpdateInductionDto()
      mockedCreateOrUpdateInductionDtoMapper.mockReturnValueOnce(createInductionDto)

      inductionService.createInduction.mockRejectedValue(createError(500, 'Service unavailable'))
      const expectedError = createError(
        500,
        `Error creating Induction for prisoner ${prisonNumber}. Error: InternalServerError: Service unavailable`,
      )

      // When
      await controller.submitCheckYourAnswers(
        req as undefined as Request,
        res as undefined as Response,
        next as undefined as NextFunction,
      )

      // Then
      expect(mockedCreateOrUpdateInductionDtoMapper).toHaveBeenCalledWith(prisonerSummary.prisonId, inductionDto)
      expect(inductionService.createInduction).toHaveBeenCalledWith(prisonNumber, createInductionDto, 'some-token')
      expect(next).toHaveBeenCalledWith(expectedError)
      expect(req.session.inductionDto).toEqual(inductionDto)
    })
  })
})
