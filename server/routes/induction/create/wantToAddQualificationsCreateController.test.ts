import { Request, Response } from 'express'
import type { InductionDto } from 'inductionDto'
import type { WantToAddQualificationsForm } from 'inductionForms'
import aValidPrisonerSummary from '../../../testsupport/prisonerSummaryTestDataBuilder'
import { validFunctionalSkills } from '../../../testsupport/functionalSkillsTestDataBuilder'
import HopingToGetWorkValue from '../../../enums/hopingToGetWorkValue'
import ReasonNotToGetWorkValue from '../../../enums/reasonNotToGetWorkValue'
import WantToAddQualificationsCreateController from './wantToAddQualificationsCreateController'
import YesNoValue from '../../../enums/yesNoValue'

describe('wantToAddQualificationsCreateController', () => {
  const controller = new WantToAddQualificationsCreateController()

  const prisonNumber = 'A1234BC'
  const prisonerSummary = aValidPrisonerSummary()

  const noErrors: Array<Record<string, string>> = []

  // A DTO for this step of the create journey
  const partialInductionDto = {
    prisonNumber,
    workOnRelease: {
      hopingToWork: HopingToGetWorkValue.NO,
      notHopingToWorkReasons: [ReasonNotToGetWorkValue.HEALTH],
    },
  } as InductionDto

  let req: Request
  const res = {
    redirect: jest.fn(),
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
      flash: jest.fn(),
      path: `/prisoners/${prisonNumber}/create-induction/want-to-add-qualifications`,
    } as unknown as Request
  })

  describe('getWantToAddQualificationsView', () => {
    it('should get the Want To Add Qualifications view', async () => {
      // Given
      req.session.inductionDto = partialInductionDto

      const functionalSkills = validFunctionalSkills()
      req.session.prisonerFunctionalSkills = functionalSkills
      req.session.wantToAddQualificationsForm = undefined
      req.session.pageFlowHistory = undefined

      const expectedWantToAddQualificationsForm: WantToAddQualificationsForm = {
        wantToAddQualifications: undefined,
      }

      const expectedPageFlowHistory = {
        pageUrls: ['/prisoners/A1234BC/create-induction/want-to-add-qualifications'],
        currentPageIndex: 0,
      }

      const expectedFunctionalSkills = functionalSkills
      const expectedView = {
        prisonerSummary,
        backLinkUrl: '/prisoners/A1234BC/create-induction/reasons-not-to-get-work',
        backLinkAriaText: `Back to What could stop Jimmy Lightfingers working when they are released?`,
        form: expectedWantToAddQualificationsForm,
        functionalSkills: expectedFunctionalSkills,
        errors: noErrors,
      }

      // When
      await controller.getWantToAddQualificationsView(req, res, next)

      // Then
      expect(res.render).toHaveBeenCalledWith(
        'pages/induction/prePrisonEducation/wantToAddQualifications',
        expectedView,
      )
      expect(req.session.wantToAddQualificationsForm).toBeUndefined()
      expect(req.session.pageFlowHistory).toEqual(expectedPageFlowHistory)
    })
  })

  describe('submitWantToAddQualificationsForm', () => {
    it('should not proceed to next page given form is submitted with validation errors', async () => {
      // Given
      req.session.inductionDto = partialInductionDto

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
      expect(res.redirect).toHaveBeenCalledWith('/prisoners/A1234BC/create-induction/want-to-add-qualifications')
      expect(req.flash).toHaveBeenCalledWith('errors', expectedErrors)
      expect(req.session.wantToAddQualificationsForm).toEqual(invalidWantToAddQualificationsForm)
    })

    it(`should proceed to qualification level page given user wants to add qualifications`, async () => {
      // Given
      req.user.token = 'some-token'
      req.session.inductionDto = partialInductionDto

      req.body = { wantToAddQualifications: YesNoValue.YES }
      req.session.wantToAddQualificationsForm = undefined

      // When
      await controller.submitWantToAddQualificationsForm(req, res, next)

      // Then
      expect(res.redirect).toHaveBeenCalledWith(`/prisoners/${prisonNumber}/create-induction/qualification-level`)
      expect(req.session.wantToAddQualificationsForm).toBeUndefined()
    })

    it(`should proceed to additional training page given user does not want to add qualifications`, async () => {
      // Given
      req.user.token = 'some-token'
      req.session.inductionDto = partialInductionDto

      req.body = { wantToAddQualifications: YesNoValue.NO }
      req.session.wantToAddQualificationsForm = undefined

      // When
      await controller.submitWantToAddQualificationsForm(req, res, next)

      // Then
      expect(res.redirect).toHaveBeenCalledWith(`/prisoners/${prisonNumber}/create-induction/additional-training`)
      expect(req.session.wantToAddQualificationsForm).toBeUndefined()
    })
  })
})
