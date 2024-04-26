import type { SessionData } from 'express-session'
import { NextFunction, Request, Response } from 'express'
import createError from 'http-errors'
import type { PageFlow, UpdateInductionQuestionSet } from 'viewModels'
import toCreateOrUpdateInductionDto from '../../../data/mappers/createOrUpdateInductionDtoMapper'
import InductionService from '../../../services/inductionService'
import CheckYourAnswersUpdateController from './checkYourAnswersUpdateController'
import aValidPrisonerSummary from '../../../testsupport/prisonerSummaryTestDataBuilder'
import { aShortQuestionSetInductionDto } from '../../../testsupport/inductionDtoTestDataBuilder'
import { aShortQuestionSetUpdateInductionDto } from '../../../testsupport/updateInductionDtoTestDataBuilder'

jest.mock('../../../data/mappers/createOrUpdateInductionDtoMapper')
jest.mock('../../../services/inductionService')

describe('checkYourAnswersUpdateController', () => {
  const mockedCreateOrUpdateInductionDtoMapper = toCreateOrUpdateInductionDto as jest.MockedFunction<
    typeof toCreateOrUpdateInductionDto
  >

  const inductionService = new InductionService(null) as jest.Mocked<InductionService>
  const controller = new CheckYourAnswersUpdateController(inductionService)

  const prisonNumber = 'A1234BC'
  const prisonerSummary = aValidPrisonerSummary()

  const req = {
    session: {} as SessionData,
    user: {} as Express.User,
    params: {} as Record<string, string>,
    flash: jest.fn(),
  }
  const res = {
    redirect: jest.fn(),
    render: jest.fn(),
  }
  const next = jest.fn()

  beforeEach(() => {
    jest.resetAllMocks()
    req.session = { prisonerSummary } as SessionData
    req.user = { token: 'some-token' } as Express.User
    req.params = { prisonNumber }
  })

  describe('getCheckYourAnswersView', () => {
    it('should get the Check Your Answers view', async () => {
      // Given
      const inductionDto = aShortQuestionSetInductionDto()
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
    it('should update Induction and call API and redirect to work and interests page', async () => {
      // Given
      const inductionDto = aShortQuestionSetInductionDto()
      req.session.inductionDto = inductionDto

      const pageFlowHistory: PageFlow = {
        pageUrls: [`/prisoner/${prisonNumber}/induction/in-prison-training`],
        currentPageIndex: 0,
      }
      req.session.pageFlowHistory = pageFlowHistory
      const updateInductionQuestionSet: UpdateInductionQuestionSet = { hopingToWorkOnRelease: 'NO' }
      req.session.updateInductionQuestionSet = updateInductionQuestionSet

      const updateInductionDto = aShortQuestionSetUpdateInductionDto()
      mockedCreateOrUpdateInductionDtoMapper.mockReturnValueOnce(updateInductionDto)

      // When
      await controller.submitCheckYourAnswers(
        req as undefined as Request,
        res as undefined as Response,
        next as undefined as NextFunction,
      )

      // Then
      // Extract the first call to the mock and the second argument (i.e. the updated Induction)
      const updatedInduction = mockedCreateOrUpdateInductionDtoMapper.mock.calls[0][1]
      expect(mockedCreateOrUpdateInductionDtoMapper).toHaveBeenCalledWith(prisonerSummary.prisonId, updatedInduction)

      expect(inductionService.updateInduction).toHaveBeenCalledWith(prisonNumber, updateInductionDto, 'some-token')
      expect(res.redirect).toHaveBeenCalledWith(`/plan/${prisonNumber}/view/work-and-interests`)
      expect(req.session.inductionDto).toBeUndefined()
      expect(req.session.pageFlowHistory).toBeUndefined()
      expect(req.session.updateInductionQuestionSet).toBeUndefined()
    })

    it('should not update Induction given error calling service', async () => {
      // Given
      const inductionDto = aShortQuestionSetInductionDto()
      req.session.inductionDto = inductionDto

      const pageFlowHistory: PageFlow = {
        pageUrls: [`/prisoner/${prisonNumber}/induction/in-prison-training`],
        currentPageIndex: 0,
      }
      req.session.pageFlowHistory = pageFlowHistory
      const updateInductionQuestionSet: UpdateInductionQuestionSet = { hopingToWorkOnRelease: 'NO' }
      req.session.updateInductionQuestionSet = updateInductionQuestionSet

      const updateInductionDto = aShortQuestionSetUpdateInductionDto()
      mockedCreateOrUpdateInductionDtoMapper.mockReturnValueOnce(updateInductionDto)

      inductionService.updateInduction.mockRejectedValue(createError(500, 'Service unavailable'))
      const expectedError = createError(
        500,
        `Error updating Induction for prisoner ${prisonNumber}. Error: InternalServerError: Service unavailable`,
      )

      // When
      await controller.submitCheckYourAnswers(
        req as undefined as Request,
        res as undefined as Response,
        next as undefined as NextFunction,
      )

      // Then
      // Extract the first call to the mock and the second argument (i.e. the updated Induction)
      const updatedInduction = mockedCreateOrUpdateInductionDtoMapper.mock.calls[0][1]
      expect(mockedCreateOrUpdateInductionDtoMapper).toHaveBeenCalledWith(prisonerSummary.prisonId, updatedInduction)

      expect(inductionService.updateInduction).toHaveBeenCalledWith(prisonNumber, updateInductionDto, 'some-token')
      expect(next).toHaveBeenCalledWith(expectedError)
      expect(req.session.inductionDto).toEqual(inductionDto)
      expect(req.session.pageFlowHistory).toEqual(pageFlowHistory)
      expect(req.session.updateInductionQuestionSet).toEqual(updateInductionQuestionSet)
    })
  })
})
