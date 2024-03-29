import type { SessionData } from 'express-session'
import { NextFunction, Request, Response } from 'express'
import aValidPrisonerSummary from '../../../testsupport/prisonerSummaryTestDataBuilder'
import {
  aLongQuestionSetInductionDto,
  aShortQuestionSetInductionDto,
} from '../../../testsupport/inductionDtoTestDataBuilder'
import QualificationLevelUpdateController from './qualificationLevelUpdateController'
import EducationLevelValue from '../../../enums/educationLevelValue'
import QualificationLevelValue from '../../../enums/qualificationLevelValue'
import validateQualificationLevelForm from './qualificationLevelFormValidator'

jest.mock('./qualificationLevelFormValidator')

describe('qualificationLevelUpdateController', () => {
  const mockedFormValidator = validateQualificationLevelForm as jest.MockedFunction<
    typeof validateQualificationLevelForm
  >
  const controller = new QualificationLevelUpdateController()

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

  describe('getQualificationLevelView', () => {
    it('should get the QualificationLevel view given there is no QualificationLevelForm on the session', async () => {
      // Given
      const prisonNumber = 'A1234BC'
      req.params.prisonNumber = prisonNumber

      const prisonerSummary = aValidPrisonerSummary()
      req.session.prisonerSummary = prisonerSummary
      const inductionDto = aLongQuestionSetInductionDto()
      req.session.inductionDto = inductionDto
      req.session.qualificationLevelForm = undefined
      req.session.pageFlowHistory = {
        pageUrls: [`/prisoners/${prisonNumber}/induction/qualifications`],
        currentPageIndex: 0,
      }

      const expectedQualificationLevelForm = {
        qualificationLevel: '',
      }

      const expectedView = {
        prisonerSummary,
        form: expectedQualificationLevelForm,
        educationLevel: EducationLevelValue.SECONDARY_SCHOOL_TOOK_EXAMS,
        backLinkUrl: `/prisoners/${prisonNumber}/induction/qualifications`,
        backLinkAriaText: "Back to Jimmy Lightfingers's qualifications",
        errors,
      }
      const expectedPageFlowHistory = {
        pageUrls: [
          `/prisoners/${prisonNumber}/induction/qualifications`,
          `/prisoners/${prisonNumber}/induction/qualification-level`,
        ],
        currentPageIndex: 1,
      }

      // When
      await controller.getQualificationLevelView(
        req as undefined as Request,
        res as undefined as Response,
        next as undefined as NextFunction,
      )

      // Then
      expect(res.render).toHaveBeenCalledWith('pages/induction/prePrisonEducation/qualificationLevel', expectedView)
      expect(req.session.qualificationLevelForm).toBeUndefined()
      expect(req.session.inductionDto).toEqual(inductionDto)
      expect(req.session.pageFlowHistory).toEqual(expectedPageFlowHistory)
    })

    it('should get the QualificationLevel view given there is an QualificationLevelForm already on the session', async () => {
      // Given
      const prisonNumber = 'A1234BC'
      req.params.prisonNumber = prisonNumber

      const prisonerSummary = aValidPrisonerSummary()
      req.session.prisonerSummary = prisonerSummary
      const inductionDto = aLongQuestionSetInductionDto()
      req.session.inductionDto = inductionDto
      req.session.pageFlowHistory = {
        pageUrls: [`/prisoners/${prisonNumber}/induction/qualifications`],
        currentPageIndex: 0,
      }

      const expectedQualificationLevelForm = { qualificationLevel: '' }
      req.session.qualificationLevelForm = expectedQualificationLevelForm

      const expectedView = {
        prisonerSummary,
        form: expectedQualificationLevelForm,
        educationLevel: EducationLevelValue.SECONDARY_SCHOOL_TOOK_EXAMS,
        backLinkUrl: '/prisoners/A1234BC/induction/qualifications',
        backLinkAriaText: "Back to Jimmy Lightfingers's qualifications",
        errors,
      }
      const expectedPageFlowHistory = {
        pageUrls: [
          `/prisoners/${prisonNumber}/induction/qualifications`,
          `/prisoners/${prisonNumber}/induction/qualification-level`,
        ],
        currentPageIndex: 1,
      }

      // When
      await controller.getQualificationLevelView(
        req as undefined as Request,
        res as undefined as Response,
        next as undefined as NextFunction,
      )

      // Then
      expect(res.render).toHaveBeenCalledWith('pages/induction/prePrisonEducation/qualificationLevel', expectedView)
      expect(req.session.qualificationLevelForm).toBeUndefined()
      expect(req.session.inductionDto).toEqual(inductionDto)
      expect(req.session.pageFlowHistory).toEqual(expectedPageFlowHistory)
    })
  })

  describe('submitQualificationLevelForm', () => {
    it('should not proceed to qualification detail page given form submitted with validation errors', async () => {
      // Given
      const prisonNumber = 'A1234BC'
      req.params.prisonNumber = prisonNumber

      const prisonerSummary = aValidPrisonerSummary()
      req.session.prisonerSummary = prisonerSummary
      const inductionDto = aShortQuestionSetInductionDto()
      req.session.inductionDto = inductionDto
      const pageFlowHistory = {
        pageUrls: [
          `/prisoners/${prisonNumber}/induction/qualifications`,
          `/prisoners/${prisonNumber}/induction/qualification-level`,
        ],
        currentPageIndex: 1,
      }
      req.session.pageFlowHistory = pageFlowHistory

      const invalidQualificationLevelForm = {
        qualificationLevel: '',
      }
      req.body = invalidQualificationLevelForm
      req.session.qualificationLevelForm = undefined

      errors = [
        {
          href: '#qualificationLevel',
          text: `Select the level of qualification Jimmy Lightfingers wants to add`,
        },
      ]
      mockedFormValidator.mockReturnValue(errors)

      // When
      await controller.submitQualificationLevelForm(
        req as undefined as Request,
        res as undefined as Response,
        next as undefined as NextFunction,
      )

      // Then
      expect(res.redirect).toHaveBeenCalledWith(`/prisoners/${prisonNumber}/induction/qualification-level`)
      expect(req.flash).toHaveBeenCalledWith('errors', errors)
      expect(req.session.qualificationLevelForm).toEqual(invalidQualificationLevelForm)
      expect(req.session.inductionDto).toEqual(inductionDto)
      expect(req.session.pageFlowHistory).toEqual(pageFlowHistory)
    })

    it('should proceed to qualification detail page', async () => {
      // Given
      req.user.token = 'some-token'
      const prisonNumber = 'A1234BC'
      req.params.prisonNumber = prisonNumber

      const prisonerSummary = aValidPrisonerSummary()
      req.session.prisonerSummary = prisonerSummary
      const inductionDto = aShortQuestionSetInductionDto()
      req.session.inductionDto = inductionDto
      const pageFlowHistory = {
        pageUrls: [
          `/prisoners/${prisonNumber}/induction/qualifications`,
          `/prisoners/${prisonNumber}/induction/qualification-level`,
        ],
        currentPageIndex: 1,
      }
      req.session.pageFlowHistory = pageFlowHistory

      const qualificationLevelForm = {
        qualificationLevel: QualificationLevelValue.LEVEL_5,
      }
      req.body = qualificationLevelForm
      req.session.qualificationLevelForm = undefined

      mockedFormValidator.mockReturnValue(errors)

      // When
      await controller.submitQualificationLevelForm(
        req as undefined as Request,
        res as undefined as Response,
        next as undefined as NextFunction,
      )

      // Then
      expect(res.redirect).toHaveBeenCalledWith(`/prisoners/${prisonNumber}/induction/qualification-details`)
      expect(req.session.qualificationLevelForm).toEqual(qualificationLevelForm)
      expect(req.session.inductionDto).toEqual(inductionDto)
      expect(req.session.pageFlowHistory).toEqual(pageFlowHistory)
    })
  })
})
