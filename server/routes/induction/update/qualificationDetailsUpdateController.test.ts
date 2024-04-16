import type { SessionData } from 'express-session'
import { NextFunction, Request, Response } from 'express'
import aValidPrisonerSummary from '../../../testsupport/prisonerSummaryTestDataBuilder'
import { aLongQuestionSetInductionDto } from '../../../testsupport/inductionDtoTestDataBuilder'
import QualificationDetailsUpdateController from './qualificationDetailsUpdateController'
import validateQualificationDetailsForm from './qualificationDetailsFormValidator'
import QualificationLevelValue from '../../../enums/qualificationLevelValue'

jest.mock('./qualificationDetailsFormValidator')

describe('qualificationDetailsUpdateController', () => {
  const mockedFormValidator = validateQualificationDetailsForm as jest.MockedFunction<
    typeof validateQualificationDetailsForm
  >

  const controller = new QualificationDetailsUpdateController()

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

  describe('getQualificationDetailsView', () => {
    it('should get the Qualification Details view given there is no QualificationDetailsForm on the session', async () => {
      // Given
      const prisonNumber = 'A1234BC'
      req.params.prisonNumber = prisonNumber

      const prisonerSummary = aValidPrisonerSummary()
      req.session.prisonerSummary = prisonerSummary
      const inductionDto = aLongQuestionSetInductionDto()
      req.session.inductionDto = inductionDto
      const qualificationLevelForm = { qualificationLevel: QualificationLevelValue.LEVEL_3 }
      req.session.qualificationLevelForm = qualificationLevelForm
      req.session.pageFlowHistory = {
        pageUrls: [
          `/prisoners/${prisonNumber}/induction/qualifications`,
          `/prisoners/${prisonNumber}/induction/qualification-level`,
        ],
        currentPageIndex: 1,
      }

      req.session.qualificationDetailsForm = undefined
      const expectedQualificationDetailsForm = {
        qualificationSubject: '',
        qualificationGrade: '',
      }

      const expectedView = {
        prisonerSummary,
        form: expectedQualificationDetailsForm,
        qualificationLevel: QualificationLevelValue.LEVEL_3,
        backLinkUrl: '/prisoners/A1234BC/induction/qualification-level',
        backLinkAriaText: 'Back to What level of qualification does Jimmy Lightfingers want to add',
        errors,
      }
      const expectedPageFlowHistory = {
        pageUrls: [
          `/prisoners/${prisonNumber}/induction/qualifications`,
          `/prisoners/${prisonNumber}/induction/qualification-level`,
          `/prisoners/${prisonNumber}/induction/qualification-details`,
        ],
        currentPageIndex: 2,
      }

      // When
      await controller.getQualificationDetailsView(
        req as undefined as Request,
        res as undefined as Response,
        next as undefined as NextFunction,
      )

      // Then
      expect(res.render).toHaveBeenCalledWith('pages/induction/prePrisonEducation/qualificationDetails', expectedView)
      expect(req.session.qualificationDetailsForm).toBeUndefined()
      expect(req.session.inductionDto).toEqual(inductionDto)
      expect(req.session.pageFlowHistory).toEqual(expectedPageFlowHistory)
    })

    it('should get the Qualification Details view given there is a QualificationDetailsForm already on the session', async () => {
      // Given
      const prisonNumber = 'A1234BC'
      req.params.prisonNumber = prisonNumber

      const prisonerSummary = aValidPrisonerSummary()
      req.session.prisonerSummary = prisonerSummary
      const inductionDto = aLongQuestionSetInductionDto()
      req.session.inductionDto = inductionDto
      const qualificationLevelForm = {
        qualificationLevel: QualificationLevelValue.LEVEL_3,
      }
      req.session.qualificationLevelForm = qualificationLevelForm
      req.session.pageFlowHistory = {
        pageUrls: [
          `/prisoners/${prisonNumber}/induction/qualifications`,
          `/prisoners/${prisonNumber}/induction/qualification-level`,
        ],
        currentPageIndex: 1,
      }

      const expectedQualificationDetailsForm = {
        qualificationSubject: '',
        qualificationGrade: '',
      }
      req.session.qualificationDetailsForm = expectedQualificationDetailsForm

      const expectedView = {
        prisonerSummary,
        form: expectedQualificationDetailsForm,
        qualificationLevel: QualificationLevelValue.LEVEL_3,
        backLinkUrl: '/prisoners/A1234BC/induction/qualification-level',
        backLinkAriaText: 'Back to What level of qualification does Jimmy Lightfingers want to add',
        errors,
      }
      const expectedPageFlowHistory = {
        pageUrls: [
          `/prisoners/${prisonNumber}/induction/qualifications`,
          `/prisoners/${prisonNumber}/induction/qualification-level`,
          `/prisoners/${prisonNumber}/induction/qualification-details`,
        ],
        currentPageIndex: 2,
      }

      // When
      await controller.getQualificationDetailsView(
        req as undefined as Request,
        res as undefined as Response,
        next as undefined as NextFunction,
      )

      // Then
      expect(res.render).toHaveBeenCalledWith('pages/induction/prePrisonEducation/qualificationDetails', expectedView)
      expect(req.session.qualificationDetailsForm).toBeUndefined()
      expect(req.session.inductionDto).toEqual(inductionDto)
      expect(req.session.pageFlowHistory).toEqual(expectedPageFlowHistory)
    })

    it('should redirect to the Qualifications view given there is no pageFlowHistory on the session', async () => {
      // Given
      const prisonNumber = 'A1234BC'
      req.params.prisonNumber = prisonNumber

      const prisonerSummary = aValidPrisonerSummary()
      req.session.prisonerSummary = prisonerSummary
      const inductionDto = aLongQuestionSetInductionDto()
      req.session.inductionDto = inductionDto
      req.session.pageFlowHistory = undefined

      // When
      await controller.getQualificationDetailsView(
        req as undefined as Request,
        res as undefined as Response,
        next as undefined as NextFunction,
      )

      // Then
      expect(res.redirect).toHaveBeenCalledWith(`/plan/${prisonNumber}/view/education-and-training`)
    })

    it('should redirect to the Qualification Level view given there is no QualificationLevelForm on the session', async () => {
      // Given
      const prisonNumber = 'A1234BC'
      req.params.prisonNumber = prisonNumber

      const prisonerSummary = aValidPrisonerSummary()
      req.session.prisonerSummary = prisonerSummary
      const inductionDto = aLongQuestionSetInductionDto()
      req.session.inductionDto = inductionDto
      req.session.qualificationLevelForm = undefined
      req.session.pageFlowHistory = {
        pageUrls: [
          `/prisoners/${prisonNumber}/induction/qualifications`,
          `/prisoners/${prisonNumber}/induction/qualification-level`,
        ],
        currentPageIndex: 1,
      }

      // When
      await controller.getQualificationDetailsView(
        req as undefined as Request,
        res as undefined as Response,
        next as undefined as NextFunction,
      )

      // Then
      expect(res.redirect).toHaveBeenCalledWith(`/prisoners/${prisonNumber}/induction/qualification-level`)
    })
  })

  describe('submitQualificationDetailsForm', () => {
    it('should not proceed to qualifications page given form submitted with validation errors', async () => {
      // Given
      const prisonNumber = 'A1234BC'
      req.params.prisonNumber = prisonNumber

      const prisonerSummary = aValidPrisonerSummary()
      req.session.prisonerSummary = prisonerSummary
      const inductionDto = aLongQuestionSetInductionDto()
      req.session.inductionDto = inductionDto
      const qualificationLevelForm = {
        qualificationLevel: QualificationLevelValue.LEVEL_3,
      }
      req.session.qualificationLevelForm = qualificationLevelForm
      const pageFlowHistory = {
        pageUrls: [
          `/prisoners/${prisonNumber}/induction/qualifications`,
          `/prisoners/${prisonNumber}/induction/qualification-level`,
          `/prisoners/${prisonNumber}/induction/qualification-details`,
        ],
        currentPageIndex: 2,
      }
      req.session.pageFlowHistory = pageFlowHistory

      const invalidQualificationDetailsForm = {
        qualificationSubject: '',
        qualificationGrade: 'A',
      }
      req.body = invalidQualificationDetailsForm
      req.session.qualificationDetailsForm = undefined

      errors = [
        {
          href: '#qualificationSubject',
          text: `Enter the subject of Jimmy Lightfingers's level 3 qualification`,
        },
      ]
      mockedFormValidator.mockReturnValue(errors)

      // When
      await controller.submitQualificationDetailsForm(
        req as undefined as Request,
        res as undefined as Response,
        next as undefined as NextFunction,
      )

      // Then
      expect(res.redirect).toHaveBeenCalledWith(`/prisoners/${prisonNumber}/induction/qualification-details`)
      expect(req.flash).toHaveBeenCalledWith('errors', errors)
      expect(req.session.qualificationDetailsForm).toEqual(invalidQualificationDetailsForm)
      expect(req.session.qualificationLevelForm).toEqual(qualificationLevelForm)
      expect(req.session.inductionDto).toEqual(inductionDto)
      expect(req.session.pageFlowHistory).toEqual(pageFlowHistory)
    })

    it('should proceed to qualifications page', async () => {
      // Given
      req.user.token = 'some-token'
      const prisonNumber = 'A1234BC'
      req.params.prisonNumber = prisonNumber

      const prisonerSummary = aValidPrisonerSummary()
      req.session.prisonerSummary = prisonerSummary
      const inductionDto = aLongQuestionSetInductionDto()
      req.session.inductionDto = inductionDto
      const pageFlowHistory = {
        pageUrls: [
          `/prisoners/${prisonNumber}/induction/qualifications`,
          `/prisoners/${prisonNumber}/induction/qualification-level`,
          `/prisoners/${prisonNumber}/induction/qualification-details`,
        ],
        currentPageIndex: 2,
      }
      req.session.pageFlowHistory = pageFlowHistory
      const qualificationLevelForm = {
        qualificationLevel: QualificationLevelValue.LEVEL_3,
      }
      req.session.qualificationLevelForm = qualificationLevelForm

      const qualificationDetailsForm = {
        qualificationSubject: 'Maths',
        qualificationGrade: 'A',
      }
      req.body = qualificationDetailsForm
      req.session.qualificationDetailsForm = undefined

      mockedFormValidator.mockReturnValue(errors)

      // When
      await controller.submitQualificationDetailsForm(
        req as undefined as Request,
        res as undefined as Response,
        next as undefined as NextFunction,
      )

      // Then
      expect(res.redirect).toHaveBeenCalledWith(`/prisoners/${prisonNumber}/induction/qualifications`)
      expect(req.session.qualificationDetailsForm).toBeUndefined()
      expect(req.session.qualificationLevelForm).toBeUndefined()
      expect(req.session.inductionDto).toEqual(inductionDto)
      expect(req.session.pageFlowHistory).toBeUndefined()
    })
  })
})
