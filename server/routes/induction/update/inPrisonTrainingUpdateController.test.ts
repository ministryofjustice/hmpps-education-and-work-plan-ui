import createError from 'http-errors'
import type { SessionData } from 'express-session'
import { NextFunction, Request, Response } from 'express'
import aValidPrisonerSummary from '../../../testsupport/prisonerSummaryTestDataBuilder'
import { aShortQuestionSetInductionDto } from '../../../testsupport/inductionDtoTestDataBuilder'
import validateInPrisonTrainingForm from './inPrisonTrainingFormValidator'
import toCreateOrUpdateInductionDto from '../../../data/mappers/createOrUpdateInductionDtoMapper'
import { InductionService } from '../../../services'
import { aShortQuestionSetUpdateInductionRequest } from '../../../testsupport/updateInductionRequestTestDataBuilder'
import InPrisonTrainingUpdateController from './inPrisonTrainingUpdateController'
import InPrisonTrainingValue from '../../../enums/inPrisonTrainingValue'

jest.mock('./inPrisonTrainingFormValidator')
jest.mock('../../../data/mappers/createOrUpdateInductionDtoMapper')

describe('inPrisonTrainingUpdateController', () => {
  const mockedFormValidator = validateInPrisonTrainingForm as jest.MockedFunction<typeof validateInPrisonTrainingForm>
  const mockedCreateOrUpdateInductionDtoMapper = toCreateOrUpdateInductionDto as jest.MockedFunction<
    typeof toCreateOrUpdateInductionDto
  >

  const inductionService = {
    updateInduction: jest.fn(),
  }

  const controller = new InPrisonTrainingUpdateController(inductionService as unknown as InductionService)

  const req = {
    session: {} as SessionData,
    body: {},
    user: {} as Express.User,
    params: {} as Record<string, string>,
    flash: jest.fn(),
  }
  const res = {
    redirect: jest.fn(),
    render: jest.fn(),
  }
  const next = jest.fn()

  let errors: Array<Record<string, string>>

  beforeEach(() => {
    jest.resetAllMocks()
    req.session = {} as SessionData
    req.body = {}
    req.user = {} as Express.User
    req.params = {} as Record<string, string>

    errors = []
  })

  describe('getInPrisonTrainingView', () => {
    it('should get the In Prison Training view given there is no InPrisonTrainingForm on the session', async () => {
      // Given
      const prisonNumber = 'A1234BC'
      req.params.prisonNumber = prisonNumber

      const prisonerSummary = aValidPrisonerSummary()
      req.session.prisonerSummary = prisonerSummary
      const inductionDto = aShortQuestionSetInductionDto()
      req.session.inductionDto = inductionDto
      req.session.inPrisonTrainingForm = undefined

      const expectedInPrisonTrainingForm = {
        inPrisonTraining: [
          InPrisonTrainingValue.FORKLIFT_DRIVING,
          InPrisonTrainingValue.CATERING,
          InPrisonTrainingValue.OTHER,
        ],
        inPrisonTrainingOther: 'Advanced origami',
      }

      const expectedView = {
        prisonerSummary,
        form: expectedInPrisonTrainingForm,
        backLinkUrl: '/plan/A1234BC/view/education-and-training',
        backLinkAriaText: `Back to Jimmy Lightfingers's learning and work progress`,
        errors,
      }

      // When
      await controller.getInPrisonTrainingView(
        req as undefined as Request,
        res as undefined as Response,
        next as undefined as NextFunction,
      )

      // Then
      expect(res.render).toHaveBeenCalledWith('pages/induction/inPrisonTraining/index', expectedView)
      expect(req.session.inPrisonTrainingForm).toBeUndefined()
      expect(req.session.inductionDto).toEqual(inductionDto)
    })

    it('should get the In Prison Training view given there is an InPrisonTrainingForm already on the session', async () => {
      // Given
      const prisonNumber = 'A1234BC'
      req.params.prisonNumber = prisonNumber

      const prisonerSummary = aValidPrisonerSummary()
      req.session.prisonerSummary = prisonerSummary
      const inductionDto = aShortQuestionSetInductionDto()
      req.session.inductionDto = inductionDto

      const expectedInPrisonTrainingForm = {
        inPrisonTraining: [InPrisonTrainingValue.CATERING, InPrisonTrainingValue.OTHER],
        inPrisonTrainingOther: 'Electrician training',
      }
      req.session.inPrisonTrainingForm = expectedInPrisonTrainingForm

      const expectedView = {
        prisonerSummary,
        form: expectedInPrisonTrainingForm,
        backLinkUrl: '/plan/A1234BC/view/education-and-training',
        backLinkAriaText: `Back to Jimmy Lightfingers's learning and work progress`,
        errors,
      }

      // When
      await controller.getInPrisonTrainingView(
        req as undefined as Request,
        res as undefined as Response,
        next as undefined as NextFunction,
      )

      // Then
      expect(res.render).toHaveBeenCalledWith('pages/induction/inPrisonTraining/index', expectedView)
      expect(req.session.inPrisonTrainingForm).toBeUndefined()
      expect(req.session.inductionDto).toEqual(inductionDto)
    })

    it('should get the In Prison Training view given given short question set journey', async () => {
      // Given
      const prisonNumber = 'A1234BC'
      req.params.prisonNumber = prisonNumber

      const prisonerSummary = aValidPrisonerSummary()
      req.session.prisonerSummary = prisonerSummary
      const inductionDto = aShortQuestionSetInductionDto()
      req.session.inductionDto = inductionDto

      req.session.updateInductionQuestionSet = {
        hopingToWorkOnRelease: 'NO',
      }
      req.session.pageFlowHistory = {
        pageUrls: [`/prisoners/${prisonNumber}/induction/in-prison-work`],
        currentPageIndex: 0,
      }

      const expectedInPrisonTrainingForm = {
        inPrisonTraining: [InPrisonTrainingValue.CATERING, InPrisonTrainingValue.OTHER],
        inPrisonTrainingOther: 'Electrician training',
      }
      req.session.inPrisonTrainingForm = expectedInPrisonTrainingForm

      const expectedView = {
        prisonerSummary,
        form: expectedInPrisonTrainingForm,
        backLinkUrl: '/prisoners/A1234BC/induction/in-prison-work',
        backLinkAriaText: 'Back to What type of work would Jimmy Lightfingers like to do in prison?',
        errors,
      }
      const expectedPageFlowHistory = {
        pageUrls: ['/prisoners/A1234BC/induction/in-prison-work', '/prisoners/A1234BC/induction/in-prison-training'],
        currentPageIndex: 1,
      }

      // When
      await controller.getInPrisonTrainingView(
        req as undefined as Request,
        res as undefined as Response,
        next as undefined as NextFunction,
      )

      // Then
      expect(res.render).toHaveBeenCalledWith('pages/induction/inPrisonTraining/index', expectedView)
      expect(req.session.inductionDto).toEqual(inductionDto)
      expect(req.session.pageFlowHistory).toEqual(expectedPageFlowHistory)
    })
  })

  describe('submitInPrisonTrainingForm', () => {
    it('should not update Induction given form is submitted with validation errors', async () => {
      // Given
      const prisonNumber = 'A1234BC'
      req.params.prisonNumber = prisonNumber

      const prisonerSummary = aValidPrisonerSummary()
      req.session.prisonerSummary = prisonerSummary
      const inductionDto = aShortQuestionSetInductionDto()
      req.session.inductionDto = inductionDto

      const invalidInPrisonTrainingForm = {
        inPrisonTraining: [InPrisonTrainingValue.OTHER],
        inPrisonTrainingOther: '',
      }
      req.body = invalidInPrisonTrainingForm
      req.session.inPrisonTrainingForm = undefined

      errors = [
        {
          href: '#inPrisonTrainingOther',
          text: `Select the type of training Jimmy Lightfingers would like to do in prison`,
        },
      ]
      mockedFormValidator.mockReturnValue(errors)

      // When
      await controller.submitInPrisonTrainingForm(
        req as undefined as Request,
        res as undefined as Response,
        next as undefined as NextFunction,
      )

      // Then
      expect(res.redirect).toHaveBeenCalledWith('/prisoners/A1234BC/induction/in-prison-training')
      expect(req.flash).toHaveBeenCalledWith('errors', errors)
      expect(req.session.inPrisonTrainingForm).toEqual(invalidInPrisonTrainingForm)
      expect(req.session.inductionDto).toEqual(inductionDto)
    })

    it('should update Induction and call API and redirect to education and training page', async () => {
      // Given
      req.user.token = 'some-token'
      const prisonNumber = 'A1234BC'
      req.params.prisonNumber = prisonNumber

      const prisonerSummary = aValidPrisonerSummary()
      req.session.prisonerSummary = prisonerSummary
      const inductionDto = aShortQuestionSetInductionDto()
      req.session.inductionDto = inductionDto

      const inPrisonTrainingForm = {
        inPrisonTraining: [InPrisonTrainingValue.FORKLIFT_DRIVING, InPrisonTrainingValue.OTHER],
        inPrisonTrainingOther: 'Electrician training',
      }
      req.body = inPrisonTrainingForm
      req.session.inPrisonTrainingForm = undefined
      const updateInductionDto = aShortQuestionSetUpdateInductionRequest()

      mockedCreateOrUpdateInductionDtoMapper.mockReturnValueOnce(updateInductionDto)
      mockedFormValidator.mockReturnValue(errors)
      const expectedUpdatedInPrisonTraining = [
        {
          trainingType: 'FORKLIFT_DRIVING',
          trainingTypeOther: undefined,
        },
        {
          trainingType: 'OTHER',
          trainingTypeOther: 'Electrician training',
        },
      ]

      // When
      await controller.submitInPrisonTrainingForm(
        req as undefined as Request,
        res as undefined as Response,
        next as undefined as NextFunction,
      )

      // Then
      // Extract the first call to the mock and the second argument (i.e. the updated Induction)
      const updatedInduction = mockedCreateOrUpdateInductionDtoMapper.mock.calls[0][1]
      expect(mockedCreateOrUpdateInductionDtoMapper).toHaveBeenCalledWith(prisonerSummary.prisonId, updatedInduction)
      expect(updatedInduction.inPrisonInterests.inPrisonTrainingInterests).toEqual(expectedUpdatedInPrisonTraining)

      expect(inductionService.updateInduction).toHaveBeenCalledWith(prisonNumber, updateInductionDto, 'some-token')
      expect(res.redirect).toHaveBeenCalledWith(`/plan/${prisonNumber}/view/education-and-training`)
      expect(req.session.inPrisonTrainingForm).toBeUndefined()
      expect(req.session.inductionDto).toBeUndefined()
    })

    it('should update InductionDto and redirect to Check Your Answers view given short question set journey', async () => {
      // Given
      req.user.token = 'some-token'
      const prisonNumber = 'A1234BC'
      req.params.prisonNumber = prisonNumber

      const prisonerSummary = aValidPrisonerSummary()
      req.session.prisonerSummary = prisonerSummary
      const inductionDto = aShortQuestionSetInductionDto()
      req.session.inductionDto = inductionDto

      const inPrisonTrainingForm = {
        inPrisonTraining: [InPrisonTrainingValue.FORKLIFT_DRIVING, InPrisonTrainingValue.OTHER],
        inPrisonTrainingOther: 'Electrician training',
      }
      req.body = inPrisonTrainingForm
      req.session.inPrisonTrainingForm = undefined

      mockedFormValidator.mockReturnValue(errors)
      const expectedUpdatedInPrisonTraining = [
        {
          trainingType: 'FORKLIFT_DRIVING',
          trainingTypeOther: undefined,
        },
        {
          trainingType: 'OTHER',
          trainingTypeOther: 'Electrician training',
        },
      ]
      req.session.updateInductionQuestionSet = { hopingToWorkOnRelease: 'NO' }
      // TODO - this should be the check your answers page
      const expectedNextPage = '/plan/A1234BC/view/work-and-interests'

      // When
      await controller.submitInPrisonTrainingForm(
        req as undefined as Request,
        res as undefined as Response,
        next as undefined as NextFunction,
      )

      // Then
      const updatedInductionDto = req.session.inductionDto
      expect(updatedInductionDto.inPrisonInterests.inPrisonTrainingInterests).toEqual(expectedUpdatedInPrisonTraining)
      expect(res.redirect).toHaveBeenCalledWith(expectedNextPage)
      expect(req.session.inPrisonTrainingForm).toEqual(inPrisonTrainingForm)
    })

    it('should not update Induction given error calling service', async () => {
      // Given
      req.user.token = 'some-token'
      const prisonNumber = 'A1234BC'
      req.params.prisonNumber = prisonNumber

      const prisonerSummary = aValidPrisonerSummary()
      req.session.prisonerSummary = prisonerSummary
      const inductionDto = aShortQuestionSetInductionDto()
      req.session.inductionDto = inductionDto

      const inPrisonTrainingForm = {
        inPrisonTraining: [InPrisonTrainingValue.FORKLIFT_DRIVING, InPrisonTrainingValue.OTHER],
        inPrisonTrainingOther: 'Electrician training',
      }
      req.body = inPrisonTrainingForm
      req.session.inPrisonTrainingForm = undefined
      const updateInductionDto = aShortQuestionSetUpdateInductionRequest()

      mockedCreateOrUpdateInductionDtoMapper.mockReturnValueOnce(updateInductionDto)
      mockedFormValidator.mockReturnValue(errors)
      const expectedUpdatedInPrisonTraining = [
        {
          trainingType: 'FORKLIFT_DRIVING',
          trainingTypeOther: undefined,
        },
        {
          trainingType: 'OTHER',
          trainingTypeOther: 'Electrician training',
        },
      ]

      inductionService.updateInduction.mockRejectedValue(createError(500, 'Service unavailable'))
      const expectedError = createError(
        500,
        `Error updating Induction for prisoner ${prisonNumber}. Error: InternalServerError: Service unavailable`,
      )

      // When
      await controller.submitInPrisonTrainingForm(
        req as undefined as Request,
        res as undefined as Response,
        next as undefined as NextFunction,
      )

      // Then
      // Extract the first call to the mock and the second argument (i.e. the updated Induction)
      const updatedInduction = mockedCreateOrUpdateInductionDtoMapper.mock.calls[0][1]
      expect(mockedCreateOrUpdateInductionDtoMapper).toHaveBeenCalledWith(prisonerSummary.prisonId, updatedInduction)
      expect(updatedInduction.inPrisonInterests.inPrisonTrainingInterests).toEqual(expectedUpdatedInPrisonTraining)

      expect(inductionService.updateInduction).toHaveBeenCalledWith(prisonNumber, updateInductionDto, 'some-token')
      expect(next).toHaveBeenCalledWith(expectedError)
      expect(req.session.inPrisonTrainingForm).toEqual(inPrisonTrainingForm)
      expect(req.session.inductionDto).toEqual(inductionDto)
    })
  })
})
