import type { SessionData } from 'express-session'
import { NextFunction, Request, Response } from 'express'
import aValidPrisonerSummary from '../../../testsupport/prisonerSummaryTestDataBuilder'
import { aLongQuestionSetInductionDto } from '../../../testsupport/inductionDtoTestDataBuilder'
import { InductionService } from '../../../services'
import QualificationLevelUpdateController from './qualificationLevelUpdateController'
import EducationLevelValue from '../../../enums/educationLevelValue'
import QualificationLevelValue from '../../../enums/qualificationLevelValue'

describe('qualificationLevelUpdateController', () => {
  const inductionService = {
    updateInduction: jest.fn(),
  }

  const controller = new QualificationLevelUpdateController(inductionService as unknown as InductionService)

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

      const expectedQualificationLevelForm = {
        educationLevel: EducationLevelValue.SECONDARY_SCHOOL_TOOK_EXAMS,
        qualificationLevel: undefined as QualificationLevelValue,
      }

      const expectedView = {
        prisonerSummary,
        form: expectedQualificationLevelForm,
        backLinkUrl: '/plan/A1234BC/view/education-and-training',
        backLinkAriaText: 'Back to <TODO - check what CIAG UI does here>',
        errors,
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
    })

    it('should get the QualificationLevel view given there is an QualificationLevelForm already on the session', async () => {
      // Given
      const prisonNumber = 'A1234BC'
      req.params.prisonNumber = prisonNumber

      const prisonerSummary = aValidPrisonerSummary()
      req.session.prisonerSummary = prisonerSummary
      const inductionDto = aLongQuestionSetInductionDto()
      req.session.inductionDto = inductionDto

      const expectedQualificationLevelForm = {
        educationLevel: EducationLevelValue.SECONDARY_SCHOOL_TOOK_EXAMS,
        qualificationLevel: undefined as QualificationLevelValue,
      }
      req.session.qualificationLevelForm = expectedQualificationLevelForm

      const expectedView = {
        prisonerSummary,
        form: expectedQualificationLevelForm,
        backLinkUrl: '/plan/A1234BC/view/education-and-training',
        backLinkAriaText: 'Back to <TODO - check what CIAG UI does here>',
        errors,
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
    })
  })

  describe('submitQualificationLevelForm', () => {
    // TODO RR-694 - test submission of qualification level
  })
})
