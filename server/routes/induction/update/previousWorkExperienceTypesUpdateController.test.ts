import createError from 'http-errors'
import { NextFunction, Request, Response } from 'express'
import type { SessionData } from 'express-session'
import type { InductionDto, PreviousWorkExperienceDto } from 'inductionDto'
import type { PageFlow } from 'viewModels'
import InductionService from '../../../services/inductionService'
import PreviousWorkExperienceTypesUpdateController from './previousWorkExperienceTypesUpdateController'
import toCreateOrUpdateInductionDto from '../../../data/mappers/createOrUpdateInductionDtoMapper'
import aValidPrisonerSummary from '../../../testsupport/prisonerSummaryTestDataBuilder'
import { aLongQuestionSetInductionDto } from '../../../testsupport/inductionDtoTestDataBuilder'
import { aLongQuestionSetUpdateInductionDto } from '../../../testsupport/updateInductionDtoTestDataBuilder'
import HasWorkedBeforeValue from '../../../enums/hasWorkedBeforeValue'

jest.mock('../../../data/mappers/createOrUpdateInductionDtoMapper')
jest.mock('../../../services/inductionService')

describe('previousWorkExperienceTypesUpdateController', () => {
  const mockedCreateOrUpdateInductionDtoMapper = toCreateOrUpdateInductionDto as jest.MockedFunction<
    typeof toCreateOrUpdateInductionDto
  >

  const inductionService = new InductionService(null) as jest.Mocked<InductionService>
  const controller = new PreviousWorkExperienceTypesUpdateController(inductionService)

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
    req.path = `/prisoners/${prisonNumber}/induction/previous-work-experience`
  })

  describe('getPreviousWorkExperienceTypesView', () => {
    it('should get the Previous Work Experience Types view given there is no PreviousWorkExperienceTypesForm on the session', async () => {
      // Given
      const inductionDto = aLongQuestionSetInductionDto({ hasWorkedBefore: HasWorkedBeforeValue.YES })
      req.session.inductionDto = inductionDto
      req.session.previousWorkExperienceTypesForm = undefined

      const expectedPreviousWorkExperienceTypesForm = {
        typeOfWorkExperience: ['CONSTRUCTION', 'OTHER'],
        typeOfWorkExperienceOther: 'Retail delivery',
      }

      req.session.pageFlowHistory = {
        pageUrls: [
          `/prisoners/${prisonNumber}/induction/qualifications`,
          `/prisoners/${prisonNumber}/induction/has-worked-before`,
        ],
        currentPageIndex: 1,
      }

      const expectedView = {
        prisonerSummary,
        form: expectedPreviousWorkExperienceTypesForm,
        backLinkUrl: '/prisoners/A1234BC/induction/has-worked-before',
        backLinkAriaText: 'Back to Has Jimmy Lightfingers worked before?',
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
      expect(req.session.pageFlowHistory).toEqual({
        pageUrls: [
          '/prisoners/A1234BC/induction/qualifications',
          '/prisoners/A1234BC/induction/has-worked-before',
          '/prisoners/A1234BC/induction/previous-work-experience',
        ],
        currentPageIndex: 2,
      })
    })

    it('should get the Previous Work Experience Types view given there is an PreviousWorkExperienceTypesForm already on the session', async () => {
      // Given
      const inductionDto = aLongQuestionSetInductionDto({ hasWorkedBefore: HasWorkedBeforeValue.YES })
      req.session.inductionDto = inductionDto

      const expectedPreviousWorkExperienceTypesForm = {
        typeOfWorkExperience: ['OUTDOOR', 'DRIVING', 'OTHER'],
        typeOfWorkExperienceOther: 'Entertainment industry',
      }
      req.session.previousWorkExperienceTypesForm = expectedPreviousWorkExperienceTypesForm

      req.session.pageFlowHistory = {
        pageUrls: [
          `/prisoners/${prisonNumber}/induction/qualifications`,
          `/prisoners/${prisonNumber}/induction/has-worked-before`,
        ],
        currentPageIndex: 1,
      }

      const expectedView = {
        prisonerSummary,
        form: expectedPreviousWorkExperienceTypesForm,
        backLinkUrl: '/prisoners/A1234BC/induction/has-worked-before',
        backLinkAriaText: 'Back to Has Jimmy Lightfingers worked before?',
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
      expect(req.session.pageFlowHistory).toEqual({
        pageUrls: [
          '/prisoners/A1234BC/induction/qualifications',
          '/prisoners/A1234BC/induction/has-worked-before',
          '/prisoners/A1234BC/induction/previous-work-experience',
        ],
        currentPageIndex: 2,
      })
    })
  })

  describe('submitPreviousWorkExperienceTypesForm', () => {
    it('should not update Induction given form is submitted with validation errors', async () => {
      // Given
      const inductionDto = aLongQuestionSetInductionDto({ hasWorkedBefore: HasWorkedBeforeValue.YES })
      req.session.inductionDto = inductionDto

      const invalidPreviousWorkExperienceTypesForm = {
        typeOfWorkExperience: ['OTHER'],
        typeOfWorkExperienceOther: '',
      }
      req.body = invalidPreviousWorkExperienceTypesForm
      req.session.previousWorkExperienceTypesForm = undefined

      const expectedErrors = [
        { href: '#typeOfWorkExperienceOther', text: 'Enter the type of work Jimmy Lightfingers has done before' },
      ]

      // When
      await controller.submitPreviousWorkExperienceTypesForm(
        req as undefined as Request,
        res as undefined as Response,
        next as undefined as NextFunction,
      )

      // Then
      expect(res.redirectWithErrors).toHaveBeenCalledWith(
        '/prisoners/A1234BC/induction/previous-work-experience',
        expectedErrors,
      )
      expect(req.session.previousWorkExperienceTypesForm).toEqual(invalidPreviousWorkExperienceTypesForm)
      expect(req.session.inductionDto).toEqual(inductionDto)
    })

    it('should not update Induction given form is submitted with no changes to the original Induction', async () => {
      // Given
      const inductionDto = aLongQuestionSetInductionDto({ hasWorkedBefore: HasWorkedBeforeValue.YES })
      // The induction has work experience of CONSTRUCTION and OTHER (Retail delivery)
      req.session.inductionDto = inductionDto

      const previousWorkExperienceTypesForm = {
        typeOfWorkExperience: ['CONSTRUCTION', 'OTHER'],
        typeOfWorkExperienceOther: 'Retail delivery',
      }
      req.body = previousWorkExperienceTypesForm
      req.session.previousWorkExperienceTypesForm = undefined

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
      const inductionDto = aLongQuestionSetInductionDto({ hasWorkedBefore: HasWorkedBeforeValue.YES })
      // The induction has work experience of CONSTRUCTION and OTHER (Retail delivery)
      req.session.inductionDto = inductionDto

      const previousWorkExperienceTypesForm = {
        typeOfWorkExperience: ['OTHER'],
        typeOfWorkExperienceOther: 'Retail delivery',
      }
      req.body = previousWorkExperienceTypesForm
      req.session.previousWorkExperienceTypesForm = undefined

      const updateInductionDto = aLongQuestionSetUpdateInductionDto({ hasWorkedBefore: HasWorkedBeforeValue.YES })
      mockedCreateOrUpdateInductionDtoMapper.mockReturnValueOnce(updateInductionDto)

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
      const inductionDto = aLongQuestionSetInductionDto({ hasWorkedBefore: HasWorkedBeforeValue.YES })
      // The induction has work experience of CONSTRUCTION and OTHER (Retail delivery)
      req.session.inductionDto = inductionDto

      const previousWorkExperienceTypesForm = {
        typeOfWorkExperience: ['OTHER'],
        typeOfWorkExperienceOther: 'Retail delivery',
      }
      req.body = previousWorkExperienceTypesForm
      req.session.previousWorkExperienceTypesForm = undefined

      const updateInductionDto = aLongQuestionSetUpdateInductionDto({ hasWorkedBefore: HasWorkedBeforeValue.YES })
      mockedCreateOrUpdateInductionDtoMapper.mockReturnValueOnce(updateInductionDto)

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
      const inductionDto = aLongQuestionSetInductionDto({ hasWorkedBefore: HasWorkedBeforeValue.YES })
      // The induction has work experience of CONSTRUCTION and OTHER (Retail delivery)
      req.session.inductionDto = inductionDto

      const previousWorkExperienceTypesForm = {
        typeOfWorkExperience: ['OUTDOOR', 'CONSTRUCTION', 'EDUCATION_TRAINING', 'OTHER'],
        typeOfWorkExperienceOther: 'Retail delivery',
      }
      req.body = previousWorkExperienceTypesForm
      req.session.previousWorkExperienceTypesForm = undefined

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
      const inductionDto = aLongQuestionSetInductionDto({ hasWorkedBefore: HasWorkedBeforeValue.YES })
      // The induction has work experience of CONSTRUCTION and OTHER (Retail delivery)
      req.session.inductionDto = inductionDto

      const previousWorkExperienceTypesForm = {
        typeOfWorkExperience: ['CONSTRUCTION', 'OTHER'],
        typeOfWorkExperienceOther: 'Entertainment industry',
      }
      req.body = previousWorkExperienceTypesForm
      req.session.previousWorkExperienceTypesForm = undefined

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
  })
})
