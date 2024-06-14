import createError from 'http-errors'
import type { SessionData } from 'express-session'
import { NextFunction, Request, Response } from 'express'
import aValidPrisonerSummary from '../../../testsupport/prisonerSummaryTestDataBuilder'
import { aShortQuestionSetInductionDto } from '../../../testsupport/inductionDtoTestDataBuilder'
import toCreateOrUpdateInductionDto from '../../../data/mappers/createOrUpdateInductionDtoMapper'
import InductionService from '../../../services/inductionService'
import { aShortQuestionSetUpdateInductionRequest } from '../../../testsupport/updateInductionRequestTestDataBuilder'
import AdditionalTrainingUpdateController from './additionalTrainingUpdateController'
import AdditionalTrainingValue from '../../../enums/additionalTrainingValue'

jest.mock('../../../data/mappers/createOrUpdateInductionDtoMapper')
jest.mock('../../../services/inductionService')

describe('additionalTrainingUpdateController', () => {
  const mockedCreateOrUpdateInductionDtoMapper = toCreateOrUpdateInductionDto as jest.MockedFunction<
    typeof toCreateOrUpdateInductionDto
  >

  const inductionService = new InductionService(null) as jest.Mocked<InductionService>
  const controller = new AdditionalTrainingUpdateController(inductionService)

  const prisonNumber = 'A1234BC'
  const prisonerSummary = aValidPrisonerSummary()

  const req = {
    session: {} as SessionData,
    body: {},
    user: {} as Express.User,
    params: {} as Record<string, string>,
    path: '',
  }
  const res = {
    redirect: jest.fn(),
    redirectWithErrors: jest.fn(),
    render: jest.fn(),
  }
  const next = jest.fn()

  beforeEach(() => {
    jest.resetAllMocks()
    req.session = { prisonerSummary } as SessionData
    req.body = {}
    req.user = { token: 'some-token' } as Express.User
    req.params = { prisonNumber }
    req.path = `/prisoners/${prisonNumber}/induction/additional-training`
  })

  describe('getAdditionalTrainingView', () => {
    it('should get Additional Training view given there is no AdditionalTrainingForm on the session', async () => {
      // Given
      const inductionDto = aShortQuestionSetInductionDto()
      req.session.inductionDto = inductionDto
      req.session.additionalTrainingForm = undefined
      const expectedAdditionalTrainingForm = {
        additionalTraining: [AdditionalTrainingValue.FULL_UK_DRIVING_LICENCE, AdditionalTrainingValue.OTHER],
        additionalTrainingOther: 'Beginners cookery for IT professionals',
      }

      const expectedView = {
        prisonerSummary,
        form: expectedAdditionalTrainingForm,
        backLinkUrl: '/plan/A1234BC/view/education-and-training',
        backLinkAriaText: `Back to Jimmy Lightfingers's learning and work progress`,
      }

      // When
      await controller.getAdditionalTrainingView(
        req as undefined as Request,
        res as undefined as Response,
        next as undefined as NextFunction,
      )

      // Then
      expect(res.render).toHaveBeenCalledWith('pages/induction/additionalTraining/index', expectedView)
      expect(req.session.additionalTrainingForm).toBeUndefined()
      expect(req.session.inductionDto).toEqual(inductionDto)
    })

    it('should get the Additional Training view given there is an AdditionalTrainingForm already on the session', async () => {
      // Given
      const inductionDto = aShortQuestionSetInductionDto()
      req.session.inductionDto = inductionDto

      const expectedAdditionalTrainingForm = {
        additionalTraining: [AdditionalTrainingValue.FULL_UK_DRIVING_LICENCE, AdditionalTrainingValue.OTHER],
        additionalTrainingOther: 'Beginners cookery for IT professionals',
      }
      req.session.additionalTrainingForm = expectedAdditionalTrainingForm

      const expectedView = {
        prisonerSummary,
        form: expectedAdditionalTrainingForm,
        backLinkUrl: '/plan/A1234BC/view/education-and-training',
        backLinkAriaText: `Back to Jimmy Lightfingers's learning and work progress`,
      }

      // When
      await controller.getAdditionalTrainingView(
        req as undefined as Request,
        res as undefined as Response,
        next as undefined as NextFunction,
      )

      // Then
      expect(res.render).toHaveBeenCalledWith('pages/induction/additionalTraining/index', expectedView)
      expect(req.session.additionalTrainingForm).toBeUndefined()
      expect(req.session.inductionDto).toEqual(inductionDto)
    })
  })

  describe('submitAdditionalTrainingForm', () => {
    it('should not update Induction given form is submitted with validation errors', async () => {
      // Given
      const inductionDto = aShortQuestionSetInductionDto()
      req.session.inductionDto = inductionDto

      const invalidAdditionalTrainingForm = {
        additionalTraining: [AdditionalTrainingValue.OTHER],
        additionalTrainingOther: '',
      }
      req.body = invalidAdditionalTrainingForm
      req.session.additionalTrainingForm = undefined

      const expectedErrors = [
        {
          href: '#additionalTrainingOther',
          text: 'Enter the type of training or vocational qualification Jimmy Lightfingers has',
        },
      ]

      // When
      await controller.submitAdditionalTrainingForm(
        req as undefined as Request,
        res as undefined as Response,
        next as undefined as NextFunction,
      )

      // Then
      expect(res.redirectWithErrors).toHaveBeenCalledWith(
        '/prisoners/A1234BC/induction/additional-training',
        expectedErrors,
      )
      expect(req.session.additionalTrainingForm).toEqual(invalidAdditionalTrainingForm)
      expect(req.session.inductionDto).toEqual(inductionDto)
    })

    it('should update Induction and call API and redirect to education and training page', async () => {
      // Given
      const inductionDto = aShortQuestionSetInductionDto()
      req.session.inductionDto = inductionDto

      const additionalTrainingForm = {
        additionalTraining: [AdditionalTrainingValue.HGV_LICENCE, AdditionalTrainingValue.OTHER],
        additionalTrainingOther: 'Italian cookery for IT professionals',
      }
      req.body = additionalTrainingForm
      req.session.additionalTrainingForm = undefined
      const updateInductionDto = aShortQuestionSetUpdateInductionRequest()

      mockedCreateOrUpdateInductionDtoMapper.mockReturnValueOnce(updateInductionDto)

      const expectedUpdatedAdditionalTraining = ['HGV_LICENCE', 'OTHER']
      const expectedUpdatedAdditionalTrainingOther = 'Italian cookery for IT professionals'

      // When
      await controller.submitAdditionalTrainingForm(
        req as undefined as Request,
        res as undefined as Response,
        next as undefined as NextFunction,
      )

      // Then
      // Extract the first call to the mock and the second argument (i.e. the updated Induction)
      const updatedInduction = mockedCreateOrUpdateInductionDtoMapper.mock.calls[0][1]
      expect(mockedCreateOrUpdateInductionDtoMapper).toHaveBeenCalledWith(prisonerSummary.prisonId, updatedInduction)
      expect(updatedInduction.previousTraining.trainingTypes).toEqual(expectedUpdatedAdditionalTraining)
      expect(updatedInduction.previousTraining.trainingTypeOther).toEqual(expectedUpdatedAdditionalTrainingOther)

      expect(inductionService.updateInduction).toHaveBeenCalledWith(prisonNumber, updateInductionDto, 'some-token')
      expect(res.redirect).toHaveBeenCalledWith(`/plan/${prisonNumber}/view/education-and-training`)
      expect(req.session.additionalTrainingForm).toBeUndefined()
      expect(req.session.inductionDto).toBeUndefined()
      expect(req.session.pageFlowHistory).toBeUndefined()
    })

    it('should update InductionDto and redirect to Check Your Answers given previous page was Check Your Answers', async () => {
      // Given
      const inductionDto = aShortQuestionSetInductionDto()
      req.session.inductionDto = inductionDto

      const additionalTrainingForm = {
        additionalTraining: [AdditionalTrainingValue.HGV_LICENCE, AdditionalTrainingValue.OTHER],
        additionalTrainingOther: 'Italian cookery for IT professionals',
      }
      req.body = additionalTrainingForm
      req.session.additionalTrainingForm = undefined

      const expectedUpdatedAdditionalTraining = ['HGV_LICENCE', 'OTHER']
      const expectedUpdatedAdditionalTrainingOther = 'Italian cookery for IT professionals'

      req.session.pageFlowHistory = {
        pageUrls: [
          '/prisoners/A1234BC/induction/check-your-answers',
          '/prisoners/A1234BC/induction/additional-training',
        ],
        currentPageIndex: 1,
      }
      const expectedNextPage = '/prisoners/A1234BC/induction/check-your-answers'

      // When
      await controller.submitAdditionalTrainingForm(
        req as undefined as Request,
        res as undefined as Response,
        next as undefined as NextFunction,
      )

      // Then
      const updatedInductionDto = req.session.inductionDto
      expect(updatedInductionDto.previousTraining.trainingTypes).toEqual(expectedUpdatedAdditionalTraining)
      expect(updatedInductionDto.previousTraining.trainingTypeOther).toEqual(expectedUpdatedAdditionalTrainingOther)
      expect(res.redirect).toHaveBeenCalledWith(expectedNextPage)
      expect(req.session.additionalTrainingForm).toBeUndefined()
    })

    it('should not update Induction given error calling service', async () => {
      // Given
      const inductionDto = aShortQuestionSetInductionDto()
      req.session.inductionDto = inductionDto

      const additionalTrainingForm = {
        additionalTraining: [AdditionalTrainingValue.HGV_LICENCE, AdditionalTrainingValue.OTHER],
        additionalTrainingOther: 'Italian cookery for IT professionals',
      }
      req.body = additionalTrainingForm
      req.session.additionalTrainingForm = undefined
      const updateInductionDto = aShortQuestionSetUpdateInductionRequest()

      mockedCreateOrUpdateInductionDtoMapper.mockReturnValueOnce(updateInductionDto)

      const expectedUpdatedAdditionalTraining = ['HGV_LICENCE', 'OTHER']
      const expectedUpdatedAdditionalTrainingOther = 'Italian cookery for IT professionals'

      inductionService.updateInduction.mockRejectedValue(createError(500, 'Service unavailable'))
      const expectedError = createError(
        500,
        `Error updating Induction for prisoner ${prisonNumber}. Error: InternalServerError: Service unavailable`,
      )

      // When
      await controller.submitAdditionalTrainingForm(
        req as undefined as Request,
        res as undefined as Response,
        next as undefined as NextFunction,
      )

      // Then
      // Extract the first call to the mock and the second argument (i.e. the updated Induction)
      const updatedInduction = mockedCreateOrUpdateInductionDtoMapper.mock.calls[0][1]
      expect(mockedCreateOrUpdateInductionDtoMapper).toHaveBeenCalledWith(prisonerSummary.prisonId, updatedInduction)
      expect(updatedInduction.previousTraining.trainingTypes).toEqual(expectedUpdatedAdditionalTraining)
      expect(updatedInduction.previousTraining.trainingTypeOther).toEqual(expectedUpdatedAdditionalTrainingOther)

      expect(inductionService.updateInduction).toHaveBeenCalledWith(prisonNumber, updateInductionDto, 'some-token')
      expect(next).toHaveBeenCalledWith(expectedError)
      expect(req.session.additionalTrainingForm).toEqual(additionalTrainingForm)
      const updatedInductionDto = req.session.inductionDto
      expect(updatedInductionDto.previousTraining.trainingTypes).toEqual([
        AdditionalTrainingValue.HGV_LICENCE,
        AdditionalTrainingValue.OTHER,
      ])
      expect(updatedInductionDto.previousTraining.trainingTypeOther).toEqual('Italian cookery for IT professionals')
    })
  })
})
