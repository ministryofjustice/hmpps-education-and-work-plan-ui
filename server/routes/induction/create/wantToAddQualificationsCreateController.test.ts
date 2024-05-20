import { Request, Response } from 'express'
import type { WantToAddQualificationsForm } from 'inductionForms'
import aValidPrisonerSummary from '../../../testsupport/prisonerSummaryTestDataBuilder'
import { validFunctionalSkills } from '../../../testsupport/functionalSkillsTestDataBuilder'
import HopingToGetWorkValue from '../../../enums/hopingToGetWorkValue'
import WantToAddQualificationsCreateController from './wantToAddQualificationsCreateController'
import YesNoValue from '../../../enums/yesNoValue'
import { aShortQuestionSetInductionDto } from '../../../testsupport/inductionDtoTestDataBuilder'
import EducationLevelValue from '../../../enums/educationLevelValue'

describe('wantToAddQualificationsCreateController', () => {
  const controller = new WantToAddQualificationsCreateController()

  const prisonNumber = 'A1234BC'
  const prisonerSummary = aValidPrisonerSummary()

  // Returns a DTO for this step of the create journey
  const partialInductionDto = () => {
    const inductionDto = aShortQuestionSetInductionDto({ hopingToGetWork: HopingToGetWorkValue.NO })
    inductionDto.previousQualifications = undefined
    return inductionDto
  }

  let req: Request
  const res = {
    redirect: jest.fn(),
    redirectWithErrors: jest.fn(),
    render: jest.fn(),
  } as unknown as Response
  const next = jest.fn()

  beforeEach(() => {
    jest.resetAllMocks()
    req = {
      session: { prisonerSummary },
      body: {},
      user: { token: 'some-token' },
      params: { prisonNumber },
      path: `/prisoners/${prisonNumber}/create-induction/want-to-add-qualifications`,
    } as unknown as Request
  })

  describe('getWantToAddQualificationsView', () => {
    it('should get the Want To Add Qualifications view', async () => {
      // Given
      req.session.inductionDto = partialInductionDto()

      const functionalSkills = validFunctionalSkills()
      req.session.prisonerFunctionalSkills = functionalSkills
      req.session.wantToAddQualificationsForm = undefined

      const expectedWantToAddQualificationsForm: WantToAddQualificationsForm = {
        wantToAddQualifications: undefined,
      }

      const expectedFunctionalSkills = functionalSkills
      const expectedView = {
        prisonerSummary,
        backLinkUrl: '/prisoners/A1234BC/create-induction/reasons-not-to-get-work',
        backLinkAriaText: `Back to What could stop Jimmy Lightfingers working when they are released?`,
        form: expectedWantToAddQualificationsForm,
        functionalSkills: expectedFunctionalSkills,
      }

      // When
      await controller.getWantToAddQualificationsView(req, res, next)

      // Then
      expect(res.render).toHaveBeenCalledWith(
        'pages/induction/prePrisonEducation/wantToAddQualifications',
        expectedView,
      )
      expect(req.session.wantToAddQualificationsForm).toBeUndefined()
    })
  })

  describe('submitWantToAddQualificationsForm', () => {
    it('should not proceed to next page given form is submitted with validation errors', async () => {
      // Given
      req.session.inductionDto = partialInductionDto()

      const invalidWantToAddQualificationsForm = {
        wantToAddQualifications: '',
      }
      req.body = invalidWantToAddQualificationsForm
      req.session.wantToAddQualificationsForm = undefined

      const expectedErrors = [
        {
          href: '#wantToAddQualifications',
          text: `Select whether Jimmy Lightfingers wants to record any other educational qualifications`,
        },
      ]

      // When
      await controller.submitWantToAddQualificationsForm(req, res, next)

      // Then
      expect(res.redirectWithErrors).toHaveBeenCalledWith(
        '/prisoners/A1234BC/create-induction/want-to-add-qualifications',
        expectedErrors,
      )
      expect(req.session.wantToAddQualificationsForm).toEqual(invalidWantToAddQualificationsForm)
      expect(req.session.inductionDto.previousQualifications).toBeUndefined()
    })

    it(`should proceed to qualification level page given user wants to add qualifications`, async () => {
      // Given
      req.user.token = 'some-token'
      req.session.inductionDto = partialInductionDto()

      req.body = { wantToAddQualifications: YesNoValue.YES }
      req.session.wantToAddQualificationsForm = undefined

      // When
      await controller.submitWantToAddQualificationsForm(req, res, next)

      // Then
      expect(res.redirect).toHaveBeenCalledWith(`/prisoners/${prisonNumber}/create-induction/qualification-level`)
      expect(req.session.wantToAddQualificationsForm).toBeUndefined()
      expect(req.session.inductionDto.previousQualifications.qualifications).toEqual([])
      expect(req.session.inductionDto.previousQualifications.educationLevel).toEqual(EducationLevelValue.NOT_SURE)
    })

    it(`should proceed to additional training page given user does not want to add qualifications`, async () => {
      // Given
      req.user.token = 'some-token'
      req.session.inductionDto = partialInductionDto()

      req.body = { wantToAddQualifications: YesNoValue.NO }
      req.session.wantToAddQualificationsForm = undefined

      // When
      await controller.submitWantToAddQualificationsForm(req, res, next)

      // Then
      expect(res.redirect).toHaveBeenCalledWith(`/prisoners/${prisonNumber}/create-induction/additional-training`)
      expect(req.session.wantToAddQualificationsForm).toBeUndefined()
      expect(req.session.inductionDto.previousQualifications.qualifications).toEqual([])
      expect(req.session.inductionDto.previousQualifications.educationLevel).toEqual(EducationLevelValue.NOT_SURE)
    })
  })
})
