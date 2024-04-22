import createError from 'http-errors'
import { NextFunction, Request, Response } from 'express'
import type { SessionData } from 'express-session'
import type { InductionDto, PreviousWorkExperienceDto } from 'inductionDto'
import type { PageFlow } from 'viewModels'
import InductionService from '../../../services/inductionService'
import PreviousWorkExperienceTypesUpdateController from './previousWorkExperienceTypesUpdateController'
import validatePreviousWorkExperienceTypesForm from './previousWorkExperienceTypesFormValidator'
import toCreateOrUpdateInductionDto from '../../../data/mappers/createOrUpdateInductionDtoMapper'
import aValidPrisonerSummary from '../../../testsupport/prisonerSummaryTestDataBuilder'
import { aLongQuestionSetInductionDto } from '../../../testsupport/inductionDtoTestDataBuilder'
import { aLongQuestionSetUpdateInductionDto } from '../../../testsupport/updateInductionDtoTestDataBuilder'
import TypeOfWorkExperienceValue from '../../../enums/typeOfWorkExperienceValue'

jest.mock('./previousWorkExperienceTypesFormValidator')
jest.mock('../../../data/mappers/createOrUpdateInductionDtoMapper')
jest.mock('../../../services/inductionService')

describe('previousWorkExperienceTypesUpdateController', () => {
  const mockedFormValidator = validatePreviousWorkExperienceTypesForm as jest.MockedFunction<
    typeof validatePreviousWorkExperienceTypesForm
  >
  const mockedCreateOrUpdateInductionDtoMapper = toCreateOrUpdateInductionDto as jest.MockedFunction<
    typeof toCreateOrUpdateInductionDto
  >

  const inductionService = new InductionService(null) as jest.Mocked<InductionService>
  const controller = new PreviousWorkExperienceTypesUpdateController(inductionService)

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

  describe('getPreviousWorkExperienceTypesView', () => {
    it('should get the Previous Work Experience Types view given there is no PreviousWorkExperienceTypesForm on the session', async () => {
      // Given
      const prisonNumber = 'A1234BC'
      req.params.prisonNumber = prisonNumber

      const prisonerSummary = aValidPrisonerSummary()
      req.session.prisonerSummary = prisonerSummary
      const inductionDto = aLongQuestionSetInductionDto({ hasWorkedBefore: true })
      req.session.inductionDto = inductionDto
      req.session.previousWorkExperienceTypesForm = undefined

      const expectedPreviousWorkExperienceTypesForm = {
        typeOfWorkExperience: ['CONSTRUCTION', 'OTHER'],
        typeOfWorkExperienceOther: 'Retail delivery',
      }

      const expectedView = {
        prisonerSummary,
        form: expectedPreviousWorkExperienceTypesForm,
        backLinkUrl: '/plan/A1234BC/view/work-and-interests',
        backLinkAriaText: `Back to Jimmy Lightfingers's learning and work progress`,
        errors,
      }

      // When
      await controller.getPreviousWorkExperienceTypesView(
        req as undefined as Request,
        res as undefined as Response,
        next as undefined as NextFunction,
      )

      // Then
      expect(res.render).toHaveBeenCalledWith(
        'pages/induction/previousWorkExperience/workExperienceTypes',
        expectedView,
      )
      expect(req.session.previousWorkExperienceTypesForm).toBeUndefined()
      expect(req.session.inductionDto).toEqual(inductionDto)
    })

    it('should get the Previous Work Experience Types view given there is an PreviousWorkExperienceTypesForm already on the session', async () => {
      // Given
      const prisonNumber = 'A1234BC'
      req.params.prisonNumber = prisonNumber

      const prisonerSummary = aValidPrisonerSummary()
      req.session.prisonerSummary = prisonerSummary
      const inductionDto = aLongQuestionSetInductionDto({ hasWorkedBefore: true })
      req.session.inductionDto = inductionDto

      const expectedPreviousWorkExperienceTypesForm = {
        typeOfWorkExperience: ['OUTDOOR', 'DRIVING', 'OTHER'],
        typeOfWorkExperienceOther: 'Entertainment industry',
      }
      req.session.previousWorkExperienceTypesForm = expectedPreviousWorkExperienceTypesForm

      const expectedView = {
        prisonerSummary,
        form: expectedPreviousWorkExperienceTypesForm,
        backLinkUrl: '/plan/A1234BC/view/work-and-interests',
        backLinkAriaText: `Back to Jimmy Lightfingers's learning and work progress`,
        errors,
      }

      // When
      await controller.getPreviousWorkExperienceTypesView(
        req as undefined as Request,
        res as undefined as Response,
        next as undefined as NextFunction,
      )

      // Then
      expect(res.render).toHaveBeenCalledWith(
        'pages/induction/previousWorkExperience/workExperienceTypes',
        expectedView,
      )
      expect(req.session.previousWorkExperienceDetailForm).toBeUndefined()
      expect(req.session.inductionDto).toEqual(inductionDto)
    })
  })

  describe('submitPreviousWorkExperienceTypesForm', () => {
    it('should not update Induction given form is submitted with validation errors', async () => {
      // Given
      const prisonNumber = 'A1234BC'
      req.params.prisonNumber = prisonNumber

      const prisonerSummary = aValidPrisonerSummary()
      req.session.prisonerSummary = prisonerSummary
      const inductionDto = aLongQuestionSetInductionDto({ hasWorkedBefore: true })
      req.session.inductionDto = inductionDto

      const invalidPreviousWorkExperienceTypesForm = {
        typeOfWorkExperience: ['OTHER'],
        typeOfWorkExperienceOther: '',
      }
      req.body = invalidPreviousWorkExperienceTypesForm
      req.session.previousWorkExperienceTypesForm = undefined

      errors = [
        { href: '#typeOfWorkExperienceOther', text: 'Enter the type of work Jimmy Lightfingers has done before' },
      ]
      mockedFormValidator.mockReturnValue(errors)

      // When
      await controller.submitPreviousWorkExperienceTypesForm(
        req as undefined as Request,
        res as undefined as Response,
        next as undefined as NextFunction,
      )

      // Then
      expect(res.redirect).toHaveBeenCalledWith('/prisoners/A1234BC/induction/previous-work-experience')
      expect(req.flash).toHaveBeenCalledWith('errors', errors)
      expect(req.session.previousWorkExperienceTypesForm).toEqual(invalidPreviousWorkExperienceTypesForm)
      expect(req.session.inductionDto).toEqual(inductionDto)
    })

    it('should not update Induction given form is submitted with no changes to the original Induction', async () => {
      // Given
      const prisonNumber = 'A1234BC'
      req.params.prisonNumber = prisonNumber

      const prisonerSummary = aValidPrisonerSummary()
      req.session.prisonerSummary = prisonerSummary
      const inductionDto = aLongQuestionSetInductionDto({ hasWorkedBefore: true })
      // The induction has work experience of CONSTRUCTION and OTHER (Retail delivery)
      req.session.inductionDto = inductionDto

      const previousWorkExperienceTypesForm = {
        typeOfWorkExperience: ['CONSTRUCTION', 'OTHER'],
        typeOfWorkExperienceOther: 'Retail delivery',
      }
      req.body = previousWorkExperienceTypesForm
      req.session.previousWorkExperienceTypesForm = undefined

      mockedFormValidator.mockReturnValue(errors)

      // When
      await controller.submitPreviousWorkExperienceTypesForm(
        req as undefined as Request,
        res as undefined as Response,
        next as undefined as NextFunction,
      )

      // Then
      expect(res.redirect).toHaveBeenCalledWith('/plan/A1234BC/view/work-and-interests')
      expect(mockedCreateOrUpdateInductionDtoMapper).not.toHaveBeenCalled()
      expect(inductionService.updateInduction).not.toHaveBeenCalled()
      expect(req.session.previousWorkExperienceTypesForm).toBeUndefined()
      expect(req.session.inductionDto).toBeUndefined()
    })

    it('should update Induction given form is submitted where the only change is a removal of a work type', async () => {
      // Given
      req.user.token = 'some-token'
      const prisonNumber = 'A1234BC'
      req.params.prisonNumber = prisonNumber

      const prisonerSummary = aValidPrisonerSummary()
      req.session.prisonerSummary = prisonerSummary
      const inductionDto = aLongQuestionSetInductionDto({ hasWorkedBefore: true })
      // The induction has work experience of CONSTRUCTION and OTHER (Retail delivery)
      req.session.inductionDto = inductionDto

      const previousWorkExperienceTypesForm = {
        typeOfWorkExperience: ['OTHER'],
        typeOfWorkExperienceOther: 'Retail delivery',
      }
      req.body = previousWorkExperienceTypesForm
      req.session.previousWorkExperienceTypesForm = undefined

      const updateInductionDto = aLongQuestionSetUpdateInductionDto({ hasWorkedBefore: true })
      mockedCreateOrUpdateInductionDtoMapper.mockReturnValueOnce(updateInductionDto)

      mockedFormValidator.mockReturnValue(errors)
      const expectedPreviousWorkExperiences: Array<PreviousWorkExperienceDto> = [
        {
          details: 'Self employed franchise operator delivering milk and associated diary products.',
          experienceType: 'OTHER',
          experienceTypeOther: 'Retail delivery',
          role: 'Milkman',
        },
      ]

      // When
      await controller.submitPreviousWorkExperienceTypesForm(
        req as undefined as Request,
        res as undefined as Response,
        next as undefined as NextFunction,
      )

      // Then
      // Extract the first call to the mock and the second argument (i.e. the updated Induction)
      const updatedInduction = mockedCreateOrUpdateInductionDtoMapper.mock.calls[0][1]
      expect(mockedCreateOrUpdateInductionDtoMapper).toHaveBeenCalledWith(prisonerSummary.prisonId, updatedInduction)
      expect(updatedInduction.previousWorkExperiences.experiences).toEqual(expectedPreviousWorkExperiences)

      expect(inductionService.updateInduction).toHaveBeenCalledWith(prisonNumber, updateInductionDto, 'some-token')
      expect(res.redirect).toHaveBeenCalledWith(`/plan/${prisonNumber}/view/work-and-interests`)
      expect(req.session.previousWorkExperienceTypesForm).toBeUndefined()
      expect(req.session.inductionDto).toBeUndefined()
    })

    it('should not update Induction given error calling service', async () => {
      // Given
      req.user.token = 'some-token'
      const prisonNumber = 'A1234BC'
      req.params.prisonNumber = prisonNumber

      const prisonerSummary = aValidPrisonerSummary()
      req.session.prisonerSummary = prisonerSummary
      const inductionDto = aLongQuestionSetInductionDto({ hasWorkedBefore: true })
      // The induction has work experience of CONSTRUCTION and OTHER (Retail delivery)
      req.session.inductionDto = inductionDto

      const previousWorkExperienceTypesForm = {
        typeOfWorkExperience: ['OTHER'],
        typeOfWorkExperienceOther: 'Retail delivery',
      }
      req.body = previousWorkExperienceTypesForm
      req.session.previousWorkExperienceTypesForm = undefined

      const updateInductionDto = aLongQuestionSetUpdateInductionDto({ hasWorkedBefore: true })
      mockedCreateOrUpdateInductionDtoMapper.mockReturnValueOnce(updateInductionDto)

      mockedFormValidator.mockReturnValue(errors)
      const expectedPreviousWorkExperiences: Array<PreviousWorkExperienceDto> = [
        {
          details: 'Self employed franchise operator delivering milk and associated diary products.',
          experienceType: 'OTHER',
          experienceTypeOther: 'Retail delivery',
          role: 'Milkman',
        },
      ]

      inductionService.updateInduction.mockRejectedValue(createError(500, 'Service unavailable'))
      const expectedError = createError(
        500,
        `Error updating Induction for prisoner ${prisonNumber}. Error: InternalServerError: Service unavailable`,
      )

      // When
      await controller.submitPreviousWorkExperienceTypesForm(
        req as undefined as Request,
        res as undefined as Response,
        next as undefined as NextFunction,
      )

      // Then
      // Extract the first call to the mock and the second argument (i.e. the updated Induction)
      const updatedInduction = mockedCreateOrUpdateInductionDtoMapper.mock.calls[0][1]
      expect(mockedCreateOrUpdateInductionDtoMapper).toHaveBeenCalledWith(prisonerSummary.prisonId, updatedInduction)
      expect(updatedInduction.previousWorkExperiences.experiences).toEqual(expectedPreviousWorkExperiences)

      expect(inductionService.updateInduction).toHaveBeenCalledWith(prisonNumber, updateInductionDto, 'some-token')
      expect(next).toHaveBeenCalledWith(expectedError)
      expect(req.session.previousWorkExperienceTypesForm).toEqual(previousWorkExperienceTypesForm)
      expect(req.session.inductionDto).toEqual(inductionDto)
    })

    it('should build a page flow queue and redirect to the next page given new Previous Work Experience Types are submitted', async () => {
      // Given
      req.user.token = 'some-token'
      const prisonNumber = 'A1234BC'
      req.params.prisonNumber = prisonNumber

      const prisonerSummary = aValidPrisonerSummary()
      req.session.prisonerSummary = prisonerSummary
      const inductionDto = aLongQuestionSetInductionDto({ hasWorkedBefore: true })
      // The induction has work experience of CONSTRUCTION and OTHER (Retail delivery)
      req.session.inductionDto = inductionDto

      const previousWorkExperienceTypesForm = {
        typeOfWorkExperience: ['OUTDOOR', 'CONSTRUCTION', 'EDUCATION_TRAINING', 'OTHER'],
        typeOfWorkExperienceOther: 'Retail delivery',
      }
      req.body = previousWorkExperienceTypesForm
      req.session.previousWorkExperienceTypesForm = undefined

      mockedFormValidator.mockReturnValue(errors)
      const expectedPreviousWorkExperiences: Array<PreviousWorkExperienceDto> = [
        {
          details: undefined,
          experienceType: 'OUTDOOR',
          experienceTypeOther: null,
          role: undefined,
        },
        {
          details: 'Groundwork and basic block work and bricklaying',
          experienceType: 'CONSTRUCTION',
          experienceTypeOther: null,
          role: 'General labourer',
        },
        {
          details: undefined,
          experienceType: 'EDUCATION_TRAINING',
          experienceTypeOther: null,
          role: undefined,
        },
        {
          details: 'Self employed franchise operator delivering milk and associated diary products.',
          experienceType: 'OTHER',
          experienceTypeOther: 'Retail delivery',
          role: 'Milkman',
        },
      ]

      const expectedPageFlowQueue: PageFlow = {
        pageUrls: [
          '/prisoners/A1234BC/induction/previous-work-experience',
          '/prisoners/A1234BC/induction/previous-work-experience/outdoor',
          '/prisoners/A1234BC/induction/previous-work-experience/education_training',
        ],
        currentPageIndex: 0,
      }
      // When
      await controller.submitPreviousWorkExperienceTypesForm(
        req as undefined as Request,
        res as undefined as Response,
        next as undefined as NextFunction,
      )

      // Then
      expect(res.redirect).toHaveBeenCalledWith(`/prisoners/${prisonNumber}/induction/previous-work-experience/outdoor`)
      expect(inductionService.updateInduction).not.toHaveBeenCalled()
      expect(req.session.pageFlowQueue).toEqual(expectedPageFlowQueue)
      expect(req.session.previousWorkExperienceTypesForm).toBeUndefined()
      const updatedInductionDto: InductionDto = req.session.inductionDto
      expect(updatedInductionDto.previousWorkExperiences.experiences).toEqual(expectedPreviousWorkExperiences)
    })

    it('should build a page flow queue and redirect to the next page given only the value for OTHER has changed', async () => {
      // Given
      req.user.token = 'some-token'
      const prisonNumber = 'A1234BC'
      req.params.prisonNumber = prisonNumber

      const prisonerSummary = aValidPrisonerSummary()
      req.session.prisonerSummary = prisonerSummary
      const inductionDto = aLongQuestionSetInductionDto({ hasWorkedBefore: true })
      // The induction has work experience of CONSTRUCTION and OTHER (Retail delivery)
      req.session.inductionDto = inductionDto

      const previousWorkExperienceTypesForm = {
        typeOfWorkExperience: ['CONSTRUCTION', 'OTHER'],
        typeOfWorkExperienceOther: 'Entertainment industry',
      }
      req.body = previousWorkExperienceTypesForm
      req.session.previousWorkExperienceTypesForm = undefined

      mockedFormValidator.mockReturnValue(errors)
      const expectedPreviousWorkExperiences: Array<PreviousWorkExperienceDto> = [
        {
          details: 'Groundwork and basic block work and bricklaying',
          experienceType: 'CONSTRUCTION',
          experienceTypeOther: null,
          role: 'General labourer',
        },
        {
          details: undefined,
          experienceType: 'OTHER',
          experienceTypeOther: 'Entertainment industry',
          role: undefined,
        },
      ]

      const expectedPageFlowQueue: PageFlow = {
        pageUrls: [
          '/prisoners/A1234BC/induction/previous-work-experience',
          '/prisoners/A1234BC/induction/previous-work-experience/other',
        ],
        currentPageIndex: 0,
      }
      // When
      await controller.submitPreviousWorkExperienceTypesForm(
        req as undefined as Request,
        res as undefined as Response,
        next as undefined as NextFunction,
      )

      // Then
      expect(res.redirect).toHaveBeenCalledWith(`/prisoners/${prisonNumber}/induction/previous-work-experience/other`)
      expect(inductionService.updateInduction).not.toHaveBeenCalled()
      expect(req.session.pageFlowQueue).toEqual(expectedPageFlowQueue)
      expect(req.session.previousWorkExperienceTypesForm).toBeUndefined()
      const updatedInductionDto: InductionDto = req.session.inductionDto
      expect(updatedInductionDto.previousWorkExperiences.experiences).toEqual(expectedPreviousWorkExperiences)
    })

    it('should build a page flow queue and redirect to the next page before returning to check your answers if coming from check your answers', async () => {
      // Given
      const prisonerSummary = aValidPrisonerSummary()
      req.params.prisonNumber = prisonerSummary.prisonNumber
      req.session.prisonerSummary = prisonerSummary
      req.session.inductionDto = aLongQuestionSetInductionDto()
      req.session.pageFlowHistory = {
        pageUrls: [
          `/prisoners/${prisonerSummary.prisonNumber}/induction/check-your-answers`,
          `/prisoners/${prisonerSummary.prisonNumber}/induction/previous-work-experience`,
        ],
        currentPageIndex: 1,
      }
      req.body = {
        typeOfWorkExperience: [TypeOfWorkExperienceValue.HOSPITALITY, TypeOfWorkExperienceValue.DRIVING],
      }

      // The actual implementations are fine for this test
      const actualToCreateOrUpdateInductionDto = jest.requireActual(
        '../../../data/mappers/createOrUpdateInductionDtoMapper',
      ).default
      mockedCreateOrUpdateInductionDtoMapper.mockImplementation(actualToCreateOrUpdateInductionDto)
      const actualPreviousWorkExperienceTypesFormValidator = jest.requireActual(
        './previousWorkExperienceTypesFormValidator',
      ).default
      mockedFormValidator.mockImplementation(actualPreviousWorkExperienceTypesFormValidator)

      expect(req.session.pageFlowQueue).toEqual(undefined)

      // When
      await controller.submitPreviousWorkExperienceTypesForm(
        req as undefined as Request,
        res as undefined as Response,
        next as undefined as NextFunction,
      )

      // Then
      expect(req.session.pageFlowQueue).toEqual({
        pageUrls: [
          `/prisoners/${prisonerSummary.prisonNumber}/induction/previous-work-experience`,
          `/prisoners/${prisonerSummary.prisonNumber}/induction/previous-work-experience/driving`,
          `/prisoners/${prisonerSummary.prisonNumber}/induction/previous-work-experience/hospitality`,
          `/prisoners/${prisonerSummary.prisonNumber}/induction/check-your-answers`,
        ],
        currentPageIndex: 0,
      })
      expect(res.redirect).toHaveBeenCalledWith(
        `/prisoners/${prisonerSummary.prisonNumber}/induction/previous-work-experience/driving`,
      )
    })
  })
})
