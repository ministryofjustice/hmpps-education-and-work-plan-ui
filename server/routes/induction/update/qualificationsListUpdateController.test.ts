import { NextFunction, Request, Response } from 'express'
import type { SessionData } from 'express-session'
import type { AchievedQualificationDto } from 'inductionDto'
import QualificationsListUpdateController from './qualificationsListUpdateController'
import aValidPrisonerSummary from '../../../testsupport/prisonerSummaryTestDataBuilder'
import { aLongQuestionSetInductionDto } from '../../../testsupport/inductionDtoTestDataBuilder'
import { validFunctionalSkills } from '../../../testsupport/functionalSkillsTestDataBuilder'
import QualificationLevelValue from '../../../enums/qualificationLevelValue'

describe('qualificationsListUpdateController', () => {
  const controller = new QualificationsListUpdateController()

  const req = {
    session: {} as SessionData,
    body: {},
    user: {} as Express.User,
    params: {} as Record<string, string>,
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
  })

  describe('getQualificationsListView', () => {
    it('should get the Qualifications List view', async () => {
      // Given
      const prisonNumber = 'A1234BC'
      req.params.prisonNumber = prisonNumber

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
        backLinkUrl: '/plan/A1234BC/view/education-and-training',
        backLinkAriaText: 'Back to <TODO - check what CIAG UI does here>',
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
