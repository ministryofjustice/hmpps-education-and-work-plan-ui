import { NextFunction, Request, Response } from 'express'
import type { SessionData } from 'express-session'
import type { InductionDto, PreviousWorkExperienceDto } from 'inductionDto'
import type { PageFlow } from 'viewModels'
import type { PreviousWorkExperienceTypesForm } from 'inductionForms'
import aValidPrisonerSummary from '../../../testsupport/prisonerSummaryTestDataBuilder'
import { aLongQuestionSetInductionDto } from '../../../testsupport/inductionDtoTestDataBuilder'
import PreviousWorkExperienceTypesCreateController from './previousWorkExperienceTypesCreateController'
import HasWorkedBeforeValue from '../../../enums/hasWorkedBeforeValue'

describe('previousWorkExperienceTypesCreateController', () => {
  const controller = new PreviousWorkExperienceTypesCreateController()

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
    req.user = {} as Express.User
    req.params = { prisonNumber }
    req.path = `/prisoners/${prisonNumber}/create-induction/previous-work-experience`
  })

  describe('getPreviousWorkExperienceTypesView', () => {
    it('should get the Previous Work Experience Types view given there is no PreviousWorkExperienceTypesForm on the session', async () => {
      // Given
      const inductionDto = aLongQuestionSetInductionDto({ hasWorkedBefore: HasWorkedBeforeValue.YES })
      inductionDto.previousWorkExperiences.experiences = undefined
      req.session.inductionDto = inductionDto
      req.session.previousWorkExperienceTypesForm = undefined

      const expectedPreviousWorkExperienceTypesForm: PreviousWorkExperienceTypesForm = {
        typeOfWorkExperience: [],
        typeOfWorkExperienceOther: undefined,
      }

      const expectedView = {
        prisonerSummary,
        form: expectedPreviousWorkExperienceTypesForm,
        backLinkUrl: '/prisoners/A1234BC/create-induction/has-worked-before',
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
    })

    it('should get the Previous Work Experience Types view given there is an PreviousWorkExperienceTypesForm already on the session', async () => {
      // Given
      const inductionDto = aLongQuestionSetInductionDto({ hasWorkedBefore: HasWorkedBeforeValue.YES })
      inductionDto.previousWorkExperiences.experiences = undefined
      req.session.inductionDto = inductionDto

      const expectedPreviousWorkExperienceTypesForm = {
        typeOfWorkExperience: ['OUTDOOR', 'DRIVING', 'OTHER'],
        typeOfWorkExperienceOther: 'Entertainment industry',
      }
      req.session.previousWorkExperienceTypesForm = expectedPreviousWorkExperienceTypesForm

      const expectedView = {
        prisonerSummary,
        form: expectedPreviousWorkExperienceTypesForm,
        backLinkUrl: '/prisoners/A1234BC/create-induction/has-worked-before',
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
    })

    it('should get the Previous Work Experience Types view given the previous page was Check Your Answers', async () => {
      // Given
      const inductionDto = aLongQuestionSetInductionDto({ hasWorkedBefore: HasWorkedBeforeValue.YES })
      inductionDto.previousWorkExperiences.experiences = undefined
      req.session.inductionDto = inductionDto

      req.session.pageFlowHistory = {
        pageUrls: ['/prisoners/A1234BC/create-induction/check-your-answers'],
        currentPageIndex: 0,
      }

      const expectedPageFlowHistory = {
        pageUrls: [
          '/prisoners/A1234BC/create-induction/check-your-answers',
          '/prisoners/A1234BC/create-induction/previous-work-experience',
        ],
        currentPageIndex: 1,
      }

      const expectedPreviousWorkExperienceTypesForm: PreviousWorkExperienceTypesForm = {
        typeOfWorkExperience: [],
        typeOfWorkExperienceOther: undefined,
      }

      const expectedView = {
        prisonerSummary,
        form: expectedPreviousWorkExperienceTypesForm,
        backLinkUrl: '/prisoners/A1234BC/create-induction/check-your-answers',
        backLinkAriaText: `Back to Check and save your answers before adding Jimmy Lightfingers's goals`,
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
      expect(req.session.pageFlowHistory).toEqual(expectedPageFlowHistory)
    })
  })

  describe('submitPreviousWorkExperienceTypesForm', () => {
    it('should not update Induction given form is submitted with validation errors', async () => {
      // Given
      const inductionDto = aLongQuestionSetInductionDto({ hasWorkedBefore: HasWorkedBeforeValue.YES })
      inductionDto.previousWorkExperiences.experiences = undefined
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
        '/prisoners/A1234BC/create-induction/previous-work-experience',
        expectedErrors,
      )
      expect(req.session.previousWorkExperienceTypesForm).toEqual(invalidPreviousWorkExperienceTypesForm)
      expect(req.session.inductionDto).toEqual(inductionDto)
    })

    it('should build a page flow queue and redirect to the next page given Previous Work Experience Types are submitted', async () => {
      // Given
      const inductionDto = aLongQuestionSetInductionDto({ hasWorkedBefore: HasWorkedBeforeValue.YES })
      inductionDto.previousWorkExperiences.experiences = undefined
      req.session.inductionDto = inductionDto

      const previousWorkExperienceTypesForm = {
        typeOfWorkExperience: ['OUTDOOR', 'OTHER'],
        typeOfWorkExperienceOther: 'Retail delivery',
      }
      req.body = previousWorkExperienceTypesForm
      req.session.previousWorkExperienceTypesForm = undefined

      req.session.pageFlowQueue = undefined
      req.session.pageFlowHistory = undefined

      const expectedPreviousWorkExperiences: Array<PreviousWorkExperienceDto> = [
        {
          details: undefined,
          experienceType: 'OUTDOOR',
          experienceTypeOther: null,
          role: undefined,
        },
        {
          details: undefined,
          experienceType: 'OTHER',
          experienceTypeOther: 'Retail delivery',
          role: undefined,
        },
      ]

      const expectedPageFlowQueue: PageFlow = {
        pageUrls: [
          '/prisoners/A1234BC/create-induction/previous-work-experience',
          '/prisoners/A1234BC/create-induction/previous-work-experience/outdoor',
          '/prisoners/A1234BC/create-induction/previous-work-experience/other',
        ],
        currentPageIndex: 0,
      }

      const expectedPageFlowHistory: PageFlow = {
        pageUrls: ['/prisoners/A1234BC/create-induction/previous-work-experience'],
        currentPageIndex: 0,
      }

      // When
      await controller.submitPreviousWorkExperienceTypesForm(
        req as undefined as Request,
        res as undefined as Response,
        next as undefined as NextFunction,
      )

      // Then
      expect(res.redirect).toHaveBeenCalledWith(
        `/prisoners/${prisonNumber}/create-induction/previous-work-experience/outdoor`,
      )
      expect(req.session.pageFlowQueue).toEqual(expectedPageFlowQueue)
      expect(req.session.pageFlowHistory).toEqual(expectedPageFlowHistory)
      expect(req.session.previousWorkExperienceTypesForm).toBeUndefined()
      const updatedInductionDto: InductionDto = req.session.inductionDto
      expect(updatedInductionDto.previousWorkExperiences.experiences).toEqual(expectedPreviousWorkExperiences)
    })

    it('should build a page flow queue and redirect to the next page given previous page was Check Your Answers', async () => {
      // Given
      const inductionDto = aLongQuestionSetInductionDto({ hasWorkedBefore: HasWorkedBeforeValue.YES })
      // Long question set Induction already has populated work experiences of CONSTRUCTION and OTHER
      req.session.inductionDto = inductionDto

      const previousWorkExperienceTypesForm: PreviousWorkExperienceTypesForm = {
        typeOfWorkExperience: ['CONSTRUCTION', 'OUTDOOR', 'RETAIL'], // Keep construction, remove other, add outdoor and retail
        typeOfWorkExperienceOther: undefined,
      }
      req.body = previousWorkExperienceTypesForm
      req.session.previousWorkExperienceTypesForm = undefined

      req.session.pageFlowQueue = undefined

      req.session.pageFlowHistory = {
        pageUrls: [
          '/prisoners/A1234BC/create-induction/check-your-answers',
          '/prisoners/A1234BC/create-induction/previous-work-experience',
        ],
        currentPageIndex: 1,
      }

      const expectedPageFlowQueue: PageFlow = {
        pageUrls: [
          '/prisoners/A1234BC/create-induction/previous-work-experience',
          '/prisoners/A1234BC/create-induction/previous-work-experience/outdoor',
          '/prisoners/A1234BC/create-induction/previous-work-experience/construction',
          '/prisoners/A1234BC/create-induction/previous-work-experience/retail',
        ],
        currentPageIndex: 0,
      }

      const expectedPreviousWorkExperiences: Array<PreviousWorkExperienceDto> = [
        {
          details: 'Groundwork and basic block work and bricklaying',
          experienceType: 'CONSTRUCTION',
          experienceTypeOther: null,
          role: 'General labourer',
        },
        {
          details: undefined,
          experienceType: 'OUTDOOR',
          experienceTypeOther: null,
          role: undefined,
        },
        {
          details: undefined,
          experienceType: 'RETAIL',
          experienceTypeOther: null,
          role: undefined,
        },
      ]

      // When
      await controller.submitPreviousWorkExperienceTypesForm(
        req as undefined as Request,
        res as undefined as Response,
        next as undefined as NextFunction,
      )

      // Then
      expect(res.redirect).toHaveBeenCalledWith(
        `/prisoners/${prisonNumber}/create-induction/previous-work-experience/outdoor`,
      )
      expect(req.session.pageFlowQueue).toEqual(expectedPageFlowQueue)
      expect(req.session.previousWorkExperienceTypesForm).toBeUndefined()
      const updatedInductionDto: InductionDto = req.session.inductionDto
      expect(updatedInductionDto.previousWorkExperiences.experiences).toEqual(expectedPreviousWorkExperiences)
    })
  })
})
