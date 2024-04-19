import createError from 'http-errors'
import type { WorkedBeforeForm } from 'inductionForms'
import type { SessionData } from 'express-session'
import { NextFunction, Request, Response } from 'express'
import aValidPrisonerSummary from '../../../testsupport/prisonerSummaryTestDataBuilder'
import { aLongQuestionSetInductionDto } from '../../../testsupport/inductionDtoTestDataBuilder'
import validateWorkedBeforeForm from './workedBeforeFormValidator'
import toCreateOrUpdateInductionDto from '../../../data/mappers/createOrUpdateInductionDtoMapper'
import InductionService from '../../../services/inductionService'
import { aShortQuestionSetUpdateInductionRequest } from '../../../testsupport/updateInductionRequestTestDataBuilder'
import WorkedBeforeController from './workedBeforeUpdateController'
import YesNoValue from '../../../enums/yesNoValue'

jest.mock('./workedBeforeFormValidator')
jest.mock('../../../data/mappers/createOrUpdateInductionDtoMapper')
jest.mock('../../../services/inductionService')

describe('workedBeforeUpdateController', () => {
  const mockedFormValidator = validateWorkedBeforeForm as jest.MockedFunction<typeof validateWorkedBeforeForm>
  const mockedCreateOrUpdateInductionDtoMapper = toCreateOrUpdateInductionDto as jest.MockedFunction<
    typeof toCreateOrUpdateInductionDto
  >

  const inductionService = new InductionService(null) as jest.Mocked<InductionService>
  const controller = new WorkedBeforeController(inductionService)

  const prisonNumber = 'A1234BC'

  const req = {
    session: {} as SessionData,
    body: {},
    user: {} as Express.User,
    params: {} as Record<string, string>,
    flash: jest.fn(),
    path: '',
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
    req.params.prisonNumber = prisonNumber
    req.path = `/prisoners/${prisonNumber}/induction/has-worked-before`

    errors = []
  })

  describe('getWorkedBeforeView', () => {
    it('should get the WorkedBefore view given there is no WorkedBeforeForm on the session', async () => {
      // Given
      const prisonerSummary = aValidPrisonerSummary()
      req.session.prisonerSummary = prisonerSummary
      const inductionDto = aLongQuestionSetInductionDto()
      req.session.inductionDto = inductionDto
      req.session.workedBeforeForm = undefined

      const expectedWorkedBeforeForm = {
        hasWorkedBefore: YesNoValue.YES,
      }

      const expectedView = {
        prisonerSummary,
        form: expectedWorkedBeforeForm,
        backLinkUrl: '/plan/A1234BC/view/work-and-interests',
        backLinkAriaText: `Back to Jimmy Lightfingers's learning and work progress`,
        errors,
      }

      // When
      await controller.getWorkedBeforeView(
        req as undefined as Request,
        res as undefined as Response,
        next as undefined as NextFunction,
      )

      // Then
      expect(res.render).toHaveBeenCalledWith('pages/induction/workedBefore/index', expectedView)
      expect(req.session.workedBeforeForm).toBeUndefined()
      expect(req.session.inductionDto).toEqual(inductionDto)
    })

    it('should get the WorkedBefore view given there is an WorkedBeforeForm already on the session', async () => {
      // Given
      const prisonerSummary = aValidPrisonerSummary()
      req.session.prisonerSummary = prisonerSummary
      const inductionDto = aLongQuestionSetInductionDto()
      req.session.inductionDto = inductionDto

      const expectedWorkedBeforeForm = {
        hasWorkedBefore: YesNoValue.NO,
      }
      req.session.workedBeforeForm = expectedWorkedBeforeForm

      const expectedView = {
        prisonerSummary,
        form: expectedWorkedBeforeForm,
        backLinkUrl: '/plan/A1234BC/view/work-and-interests',
        backLinkAriaText: `Back to Jimmy Lightfingers's learning and work progress`,
        errors,
      }

      // When
      await controller.getWorkedBeforeView(
        req as undefined as Request,
        res as undefined as Response,
        next as undefined as NextFunction,
      )

      // Then
      expect(res.render).toHaveBeenCalledWith('pages/induction/workedBefore/index', expectedView)
      expect(req.session.workedBeforeForm).toBeUndefined()
      expect(req.session.inductionDto).toEqual(inductionDto)
    })

    it('should get the WorkedBefore view given there is an updateInductionQuestionSet on the session', async () => {
      // Given
      const prisonerSummary = aValidPrisonerSummary()
      req.session.prisonerSummary = prisonerSummary
      const inductionDto = aLongQuestionSetInductionDto()
      req.session.inductionDto = inductionDto
      req.session.updateInductionQuestionSet = {
        hopingToWorkOnRelease: 'YES',
      }
      req.session.pageFlowHistory = {
        pageUrls: [`/prisoners/${prisonNumber}/induction/additional-training`],
        currentPageIndex: 0,
      }

      const expectedWorkedBeforeForm = {
        hasWorkedBefore: YesNoValue.NO,
      }
      req.session.workedBeforeForm = expectedWorkedBeforeForm

      const expectedView = {
        prisonerSummary,
        form: expectedWorkedBeforeForm,
        backLinkUrl: '/prisoners/A1234BC/induction/additional-training',
        backLinkAriaText: 'Back to Does Jimmy Lightfingers have any other training or vocational qualifications?',
        errors,
      }

      const expectedPageFlowHistory = {
        pageUrls: [
          '/prisoners/A1234BC/induction/additional-training',
          '/prisoners/A1234BC/induction/has-worked-before',
        ],
        currentPageIndex: 1,
      }

      // When
      await controller.getWorkedBeforeView(
        req as undefined as Request,
        res as undefined as Response,
        next as undefined as NextFunction,
      )

      // Then
      expect(res.render).toHaveBeenCalledWith('pages/induction/workedBefore/index', expectedView)
      expect(req.session.inductionDto).toEqual(inductionDto)
      expect(req.session.pageFlowHistory).toEqual(expectedPageFlowHistory)
    })
  })

  describe('submitWorkedBeforeForm', () => {
    it('should not update Induction given form is submitted with validation errors', async () => {
      // Given
      const prisonerSummary = aValidPrisonerSummary()
      req.session.prisonerSummary = prisonerSummary
      const inductionDto = aLongQuestionSetInductionDto()
      req.session.inductionDto = inductionDto

      const invalidWorkedBeforeForm: WorkedBeforeForm = {
        hasWorkedBefore: undefined,
      }
      req.body = invalidWorkedBeforeForm
      req.session.workedBeforeForm = undefined

      errors = [
        { href: '#hasWorkedBefore', text: 'Select whether Jimmy Lightfingers has worked before being in prison' },
      ]
      mockedFormValidator.mockReturnValue(errors)

      // When
      await controller.submitWorkedBeforeForm(
        req as undefined as Request,
        res as undefined as Response,
        next as undefined as NextFunction,
      )

      // Then
      expect(res.redirect).toHaveBeenCalledWith('/prisoners/A1234BC/induction/has-worked-before')
      expect(req.flash).toHaveBeenCalledWith('errors', errors)
      expect(req.session.workedBeforeForm).toEqual(invalidWorkedBeforeForm)
      expect(req.session.inductionDto).toEqual(inductionDto)
    })

    it('should update Induction and call API and redirect to work and interests page', async () => {
      // Given
      req.user.token = 'some-token'

      const prisonerSummary = aValidPrisonerSummary()
      req.session.prisonerSummary = prisonerSummary
      const inductionDto = aLongQuestionSetInductionDto()
      req.session.inductionDto = inductionDto

      const workedBeforeForm = {
        hasWorkedBefore: YesNoValue.NO,
      }
      req.body = workedBeforeForm
      req.session.workedBeforeForm = undefined
      const updateInductionDto = aShortQuestionSetUpdateInductionRequest()

      mockedCreateOrUpdateInductionDtoMapper.mockReturnValueOnce(updateInductionDto)
      mockedFormValidator.mockReturnValue(errors)

      // When
      await controller.submitWorkedBeforeForm(
        req as undefined as Request,
        res as undefined as Response,
        next as undefined as NextFunction,
      )

      // Then
      // Extract the first call to the mock and the second argument (i.e. the updated Induction)
      const updatedInduction = mockedCreateOrUpdateInductionDtoMapper.mock.calls[0][1]
      expect(mockedCreateOrUpdateInductionDtoMapper).toHaveBeenCalledWith(prisonerSummary.prisonId, updatedInduction)
      expect(updatedInduction.previousWorkExperiences.hasWorkedBefore).toEqual(false)

      expect(inductionService.updateInduction).toHaveBeenCalledWith(prisonNumber, updateInductionDto, 'some-token')
      expect(res.redirect).toHaveBeenCalledWith(`/plan/${prisonNumber}/view/work-and-interests`)
      expect(req.session.workedBeforeForm).toBeUndefined()
      expect(req.session.inductionDto).toBeUndefined()
    })

    it('should update InductionDto and redirect to Previous Work Experience given long question set journey and has worked before is YES', async () => {
      // Given
      req.user.token = 'some-token'

      const prisonerSummary = aValidPrisonerSummary()
      req.session.prisonerSummary = prisonerSummary
      const inductionDto = aLongQuestionSetInductionDto()
      req.session.inductionDto = inductionDto

      const workedBeforeForm = {
        hasWorkedBefore: YesNoValue.YES,
      }
      req.body = workedBeforeForm
      req.session.workedBeforeForm = undefined

      mockedFormValidator.mockReturnValue(errors)

      req.session.updateInductionQuestionSet = { hopingToWorkOnRelease: 'YES' }
      const expectedNextPage = '/prisoners/A1234BC/induction/previous-work-experience'

      // When
      await controller.submitWorkedBeforeForm(
        req as undefined as Request,
        res as undefined as Response,
        next as undefined as NextFunction,
      )

      // Then
      expect(req.session.inductionDto.previousWorkExperiences.hasWorkedBefore).toEqual(true)
      expect(res.redirect).toHaveBeenCalledWith(expectedNextPage)
      expect(req.session.workedBeforeForm).toBeUndefined()
    })

    it('should update InductionDto and redirect to Work Interests given long question set journey and has worked before is NO', async () => {
      // Given
      req.user.token = 'some-token'

      const prisonerSummary = aValidPrisonerSummary()
      req.session.prisonerSummary = prisonerSummary
      const inductionDto = aLongQuestionSetInductionDto()
      req.session.inductionDto = inductionDto

      const workedBeforeForm = {
        hasWorkedBefore: YesNoValue.NO,
      }
      req.body = workedBeforeForm
      req.session.workedBeforeForm = undefined

      mockedFormValidator.mockReturnValue(errors)

      req.session.updateInductionQuestionSet = { hopingToWorkOnRelease: 'YES' }
      const expectedNextPage = '/prisoners/A1234BC/induction/work-interest-types'

      // When
      await controller.submitWorkedBeforeForm(
        req as undefined as Request,
        res as undefined as Response,
        next as undefined as NextFunction,
      )

      // Then
      expect(req.session.inductionDto.previousWorkExperiences.hasWorkedBefore).toEqual(false)
      expect(res.redirect).toHaveBeenCalledWith(expectedNextPage)
      expect(req.session.workedBeforeForm).toBeUndefined()
    })

    it('should not update Induction given error calling service', async () => {
      // Given
      req.user.token = 'some-token'

      const prisonerSummary = aValidPrisonerSummary()
      req.session.prisonerSummary = prisonerSummary
      const inductionDto = aLongQuestionSetInductionDto()
      req.session.inductionDto = inductionDto

      const workedBeforeForm = {
        hasWorkedBefore: YesNoValue.YES,
      }
      req.body = workedBeforeForm
      req.session.workedBeforeForm = undefined
      const updateInductionDto = aShortQuestionSetUpdateInductionRequest()

      mockedCreateOrUpdateInductionDtoMapper.mockReturnValueOnce(updateInductionDto)
      mockedFormValidator.mockReturnValue(errors)

      inductionService.updateInduction.mockRejectedValue(createError(500, 'Service unavailable'))
      const expectedError = createError(
        500,
        `Error updating Induction for prisoner ${prisonNumber}. Error: InternalServerError: Service unavailable`,
      )

      // When
      await controller.submitWorkedBeforeForm(
        req as undefined as Request,
        res as undefined as Response,
        next as undefined as NextFunction,
      )

      // Then
      // Extract the first call to the mock and the second argument (i.e. the updated Induction)
      const updatedInduction = mockedCreateOrUpdateInductionDtoMapper.mock.calls[0][1]
      expect(mockedCreateOrUpdateInductionDtoMapper).toHaveBeenCalledWith(prisonerSummary.prisonId, updatedInduction)
      expect(updatedInduction.previousWorkExperiences.hasWorkedBefore).toEqual(true)

      expect(inductionService.updateInduction).toHaveBeenCalledWith(prisonNumber, updateInductionDto, 'some-token')
      expect(next).toHaveBeenCalledWith(expectedError)
      expect(req.session.workedBeforeForm).toEqual(workedBeforeForm)
      expect(req.session.inductionDto).toEqual(inductionDto)
    })

    it('should update induction DTO and redirect back to check answers page if "no" is selected and coming from check your answers', async () => {
      // Given
      const prisonerSummary = aValidPrisonerSummary()
      req.session.prisonerSummary = prisonerSummary
      req.session.inductionDto = aLongQuestionSetInductionDto()
      req.session.pageFlowHistory = {
        pageUrls: [
          `/prisoners/${prisonerSummary.prisonNumber}/induction/check-your-answers`,
          `/prisoners/${prisonerSummary.prisonNumber}/induction/hoping-to-work-on-release`,
        ],
        currentPageIndex: 1,
      }

      req.body = {
        hasWorkedBefore: YesNoValue.NO,
      }

      // The actual implementations are fine for this test
      const actualToCreateOrUpdateInductionDto = jest.requireActual(
        '../../../data/mappers/createOrUpdateInductionDtoMapper',
      ).default
      mockedCreateOrUpdateInductionDtoMapper.mockImplementation(actualToCreateOrUpdateInductionDto)
      const actualWorkedBeforeFormValidator = jest.requireActual('./workedBeforeFormValidator').default
      mockedFormValidator.mockImplementation(actualWorkedBeforeFormValidator)

      expect(req.session.inductionDto.previousWorkExperiences.hasWorkedBefore).toEqual(true)
      expect(req.session.inductionDto.previousWorkExperiences.experiences).toHaveLength(2)

      // When
      await controller.submitWorkedBeforeForm(
        req as undefined as Request,
        res as undefined as Response,
        next as undefined as NextFunction,
      )

      // Then
      expect(req.session.inductionDto.previousWorkExperiences.hasWorkedBefore).toEqual(false)
      expect(req.session.inductionDto.previousWorkExperiences.experiences).toHaveLength(0)
      expect(res.redirect).toHaveBeenCalledWith(
        `/prisoners/${prisonerSummary.prisonNumber}/induction/check-your-answers`,
      )
    })

    it('should update induction DTO and redirect through previous work experience flow before returning to check answers page if "yes" is selected and coming from check your answers', async () => {
      // Given
      const prisonerSummary = aValidPrisonerSummary()
      req.session.prisonerSummary = prisonerSummary
      req.session.inductionDto = aLongQuestionSetInductionDto()
      req.session.pageFlowHistory = {
        pageUrls: [
          `/prisoners/${prisonerSummary.prisonNumber}/induction/check-your-answers`,
          `/prisoners/${prisonerSummary.prisonNumber}/induction/hoping-to-work-on-release`,
        ],
        currentPageIndex: 1,
      }

      req.body = {
        hasWorkedBefore: YesNoValue.YES,
      }

      // The actual implementations are fine for this test
      const actualToCreateOrUpdateInductionDto = jest.requireActual(
        '../../../data/mappers/createOrUpdateInductionDtoMapper',
      ).default
      mockedCreateOrUpdateInductionDtoMapper.mockImplementation(actualToCreateOrUpdateInductionDto)
      const actualWorkedBeforeFormValidator = jest.requireActual('./workedBeforeFormValidator').default
      mockedFormValidator.mockImplementation(actualWorkedBeforeFormValidator)

      expect(req.session.inductionDto.previousWorkExperiences.hasWorkedBefore).toEqual(true)
      expect(req.session.inductionDto.previousWorkExperiences.experiences).toHaveLength(2)
      expect(req.session.pageFlowQueue).toEqual(undefined)

      // When
      await controller.submitWorkedBeforeForm(
        req as undefined as Request,
        res as undefined as Response,
        next as undefined as NextFunction,
      )

      // Then
      expect(req.session.inductionDto.previousWorkExperiences.hasWorkedBefore).toEqual(true)
      expect(req.session.inductionDto.previousWorkExperiences.experiences).toHaveLength(2)
      expect(req.session.pageFlowQueue).toEqual({
        pageUrls: [
          `/prisoners/${prisonerSummary.prisonNumber}/induction/has-worked-before`,
          `/prisoners/${prisonerSummary.prisonNumber}/induction/previous-work-experience`,
          `/prisoners/${prisonerSummary.prisonNumber}/induction/check-your-answers`,
        ],
        currentPageIndex: 0,
      })
      expect(res.redirect).toHaveBeenCalledWith(
        `/prisoners/${prisonerSummary.prisonNumber}/induction/previous-work-experience`,
      )
    })
  })
})
