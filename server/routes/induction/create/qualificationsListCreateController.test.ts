import { NextFunction, Request, Response } from 'express'
import type { SessionData } from 'express-session'
import type { AchievedQualificationDto } from 'inductionDto'
import QualificationsListCreateController from './qualificationsListCreateController'
import aValidPrisonerSummary from '../../../testsupport/prisonerSummaryTestDataBuilder'
import { aLongQuestionSetInductionDto } from '../../../testsupport/inductionDtoTestDataBuilder'
import { validFunctionalSkills } from '../../../testsupport/functionalSkillsTestDataBuilder'
import QualificationLevelValue from '../../../enums/qualificationLevelValue'

describe('qualificationsListCreateController', () => {
  const controller = new QualificationsListCreateController()

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

  beforeEach(() => {
    jest.resetAllMocks()
    req.session = {} as SessionData
    req.body = {}
    req.user = {} as Express.User
    req.params = {} as Record<string, string>
    req.params.prisonNumber = prisonNumber
    req.path = `/prisoners/${prisonNumber}/induction/qualifications`
  })

  describe('getQualificationsListView', () => {
    it('should get the Qualifications List view', async () => {
      // Given
      const prisonerSummary = aValidPrisonerSummary()
      req.session.prisonerSummary = prisonerSummary
      const inductionDto = aLongQuestionSetInductionDto()
      req.session.inductionDto = inductionDto
      const functionalSkills = validFunctionalSkills()
      req.session.prisonerFunctionalSkills = functionalSkills

      const expectedQualifications: Array<AchievedQualificationDto> = [
        { subject: 'Pottery', grade: 'C', level: QualificationLevelValue.LEVEL_4 },
      ]

      const expectedFunctionalSkills = functionalSkills

      const expectedView = {
        prisonerSummary,
        backLinkUrl: '/prisoners/A1234BC/create-induction/hoping-to-work-on-release',
        backLinkAriaText: `Back to Is Jimmy Lightfingers hoping to get work when they're released?`,
        qualifications: expectedQualifications,
        functionalSkills: expectedFunctionalSkills,
      }

      // When
      await controller.getQualificationsListView(
        req as undefined as Request,
        res as undefined as Response,
        next as undefined as NextFunction,
      )

      // Then
      expect(res.render).toHaveBeenCalledWith('pages/induction/prePrisonEducation/qualificationsList', expectedView)
      expect(req.session.inductionDto).toEqual(inductionDto)
    })
  })
})
