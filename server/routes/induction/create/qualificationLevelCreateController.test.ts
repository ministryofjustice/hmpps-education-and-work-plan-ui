import { NextFunction, Request, Response } from 'express'
import type { SessionData } from 'express-session'
import aValidPrisonerSummary from '../../../testsupport/prisonerSummaryTestDataBuilder'
import {
  aLongQuestionSetInductionDto,
  aShortQuestionSetInductionDto,
} from '../../../testsupport/inductionDtoTestDataBuilder'
import QualificationLevelCreateController from './qualificationLevelCreateController'
import QualificationLevelValue from '../../../enums/qualificationLevelValue'

describe('qualificationLevelCreateController', () => {
  const controller = new QualificationLevelCreateController()

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
    req.path = `/prisoners/${prisonNumber}/create-induction/qualification-level`
  })

  describe('getQualificationLevelView', () => {
    it('should get the QualificationLevel view given there is no QualificationLevelForm on the session', async () => {
      // Given
      const inductionDto = aLongQuestionSetInductionDto()
      req.session.inductionDto = inductionDto
      req.session.qualificationLevelForm = undefined
      req.session.pageFlowHistory = {
        pageUrls: [`/prisoners/${prisonNumber}/create-induction/qualifications`],
        currentPageIndex: 0,
      }

      const expectedQualificationLevelForm = {
        qualificationLevel: '',
      }

      const expectedView = {
        prisonerSummary,
        form: expectedQualificationLevelForm,
        backLinkUrl: `/prisoners/${prisonNumber}/create-induction/qualifications`,
        backLinkAriaText: "Back to Jimmy Lightfingers's qualifications",
      }
      const expectedPageFlowHistory = {
        pageUrls: [
          `/prisoners/${prisonNumber}/create-induction/qualifications`,
          `/prisoners/${prisonNumber}/create-induction/qualification-level`,
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
      const inductionDto = aLongQuestionSetInductionDto()
      req.session.inductionDto = inductionDto
      req.session.pageFlowHistory = {
        pageUrls: [`/prisoners/${prisonNumber}/create-induction/qualifications`],
        currentPageIndex: 0,
      }

      const expectedQualificationLevelForm = { qualificationLevel: '' }
      req.session.qualificationLevelForm = expectedQualificationLevelForm

      const expectedView = {
        prisonerSummary,
        form: expectedQualificationLevelForm,
        backLinkUrl: '/prisoners/A1234BC/create-induction/qualifications',
        backLinkAriaText: "Back to Jimmy Lightfingers's qualifications",
      }
      const expectedPageFlowHistory = {
        pageUrls: [
          `/prisoners/${prisonNumber}/create-induction/qualifications`,
          `/prisoners/${prisonNumber}/create-induction/qualification-level`,
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
      const inductionDto = aShortQuestionSetInductionDto()
      req.session.inductionDto = inductionDto
      const pageFlowHistory = {
        pageUrls: [
          `/prisoners/${prisonNumber}/create-induction/qualifications`,
          `/prisoners/${prisonNumber}/create-induction/qualification-level`,
        ],
        currentPageIndex: 1,
      }
      req.session.pageFlowHistory = pageFlowHistory

      const invalidQualificationLevelForm = {
        qualificationLevel: '',
      }
      req.body = invalidQualificationLevelForm
      req.session.qualificationLevelForm = undefined

      const expectedErrors = [
        {
          href: '#qualificationLevel',
          text: `Select the level of qualification Jimmy Lightfingers wants to add`,
        },
      ]

      // When
      await controller.submitQualificationLevelForm(
        req as undefined as Request,
        res as undefined as Response,
        next as undefined as NextFunction,
      )

      // Then
      expect(res.redirectWithErrors).toHaveBeenCalledWith(
        `/prisoners/${prisonNumber}/create-induction/qualification-level`,
        expectedErrors,
      )
      expect(req.session.qualificationLevelForm).toEqual(invalidQualificationLevelForm)
      expect(req.session.inductionDto).toEqual(inductionDto)
      expect(req.session.pageFlowHistory).toEqual(pageFlowHistory)
    })

    it('should proceed to qualification detail page', async () => {
      // Given
      const inductionDto = aShortQuestionSetInductionDto()
      req.session.inductionDto = inductionDto
      const pageFlowHistory = {
        pageUrls: [
          `/prisoners/${prisonNumber}/create-induction/qualifications`,
          `/prisoners/${prisonNumber}/create-induction/qualification-level`,
        ],
        currentPageIndex: 1,
      }
      req.session.pageFlowHistory = pageFlowHistory

      const qualificationLevelForm = {
        qualificationLevel: QualificationLevelValue.LEVEL_5,
      }
      req.body = qualificationLevelForm
      req.session.qualificationLevelForm = undefined

      // When
      await controller.submitQualificationLevelForm(
        req as undefined as Request,
        res as undefined as Response,
        next as undefined as NextFunction,
      )

      // Then
      expect(res.redirect).toHaveBeenCalledWith(`/prisoners/${prisonNumber}/create-induction/qualification-details`)
      expect(req.session.qualificationLevelForm).toEqual(qualificationLevelForm)
      expect(req.session.inductionDto).toEqual(inductionDto)
      expect(req.session.pageFlowHistory).toEqual(pageFlowHistory)
    })
  })
})
