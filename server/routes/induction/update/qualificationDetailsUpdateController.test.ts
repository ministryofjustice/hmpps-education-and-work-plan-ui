import type { SessionData } from 'express-session'
import { NextFunction, Request, Response } from 'express'
import aValidPrisonerSummary from '../../../testsupport/prisonerSummaryTestDataBuilder'
import aValidInductionDto from '../../../testsupport/inductionDtoTestDataBuilder'
import QualificationDetailsUpdateController from './qualificationDetailsUpdateController'
import QualificationLevelValue from '../../../enums/qualificationLevelValue'

describe('qualificationDetailsUpdateController', () => {
  const controller = new QualificationDetailsUpdateController()

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
    req.params = { prisonNumber }
    req.path = `/prisoners/${prisonNumber}/induction/qualification-details`
  })

  describe('getQualificationDetailsView', () => {
    it('should get the Qualification Details view given there is no QualificationDetailsForm on the session', async () => {
      // Given
      const inductionDto = aValidInductionDto()
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
      const inductionDto = aValidInductionDto()
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
      const inductionDto = aValidInductionDto()
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
      const inductionDto = aValidInductionDto()
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
      const inductionDto = aValidInductionDto()
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

      const expectedErrors = [
        {
          href: '#qualificationSubject',
          text: `Enter the subject of Jimmy Lightfingers's level 3 qualification`,
        },
      ]

      // When
      await controller.submitQualificationDetailsForm(
        req as undefined as Request,
        res as undefined as Response,
        next as undefined as NextFunction,
      )

      // Then
      expect(res.redirectWithErrors).toHaveBeenCalledWith(
        `/prisoners/${prisonNumber}/induction/qualification-details`,
        expectedErrors,
      )
      expect(req.session.qualificationDetailsForm).toEqual(invalidQualificationDetailsForm)
      expect(req.session.qualificationLevelForm).toEqual(qualificationLevelForm)
      expect(req.session.inductionDto).toEqual(inductionDto)
      expect(req.session.pageFlowHistory).toEqual(pageFlowHistory)
    })

    it('should proceed to qualifications page', async () => {
      // Given
      const inductionDto = aValidInductionDto()
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

      // When
      await controller.submitQualificationDetailsForm(
        req as undefined as Request,
        res as undefined as Response,
        next as undefined as NextFunction,
      )

      // Then
      const updatedInduction = req.session.inductionDto
      expect(updatedInduction.previousQualifications.qualifications).toEqual([
        { subject: 'Pottery', grade: 'C', level: QualificationLevelValue.LEVEL_4 },
        { subject: 'Maths', grade: 'A', level: QualificationLevelValue.LEVEL_3 },
      ])

      expect(res.redirect).toHaveBeenCalledWith(`/prisoners/${prisonNumber}/induction/qualifications`)
      expect(req.session.qualificationDetailsForm).toBeUndefined()
      expect(req.session.qualificationLevelForm).toBeUndefined()
      expect(req.session.pageFlowHistory).toBeUndefined()
    })
  })
})
