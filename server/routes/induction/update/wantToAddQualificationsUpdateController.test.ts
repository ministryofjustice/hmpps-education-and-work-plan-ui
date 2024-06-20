import { Request, Response } from 'express'
import WantToAddQualificationsUpdateController from './wantToAddQualificationsUpdateController'
import aValidPrisonerSummary from '../../../testsupport/prisonerSummaryTestDataBuilder'
import YesNoValue from '../../../enums/yesNoValue'
import { validFunctionalSkills } from '../../../testsupport/functionalSkillsTestDataBuilder'
import aValidInductionDto from '../../../testsupport/inductionDtoTestDataBuilder'

describe('wantToAddQualificationsUpdateController', () => {
  const controller = new WantToAddQualificationsUpdateController()

  const prisonNumber = 'A1234BC'
  const prisonerSummary = aValidPrisonerSummary()

  let req: Request
  const res = {
    redirect: jest.fn(),
    redirectWithErrors: jest.fn(),
    render: jest.fn(),
    locals: {} as Record<string, unknown>,
  } as unknown as Response
  const next = jest.fn()

  beforeEach(() => {
    jest.resetAllMocks()
    req = {
      session: { prisonerSummary },
      body: {},
      user: { token: 'some-token' },
      params: { prisonNumber },
      path: `/prisoners/${prisonNumber}/induction/want-to-add-qualifications`,
    } as unknown as Request
  })

  describe('getWantToAddQualificationsView', () => {
    it('should get the Want To Add Qualifications view given there is no WantToAddQualificationsForm on the session and the induction has qualifications', async () => {
      // Given
      const inductionDto = aValidInductionDto()
      req.session.inductionDto = inductionDto

      req.session.pageFlowHistory = {
        pageUrls: [
          `/prisoners/${prisonNumber}/induction/hoping-to-work-on-release`,
          `/prisoners/${prisonNumber}/induction/reasons-not-to-get-work`,
        ],
        currentPageIndex: 1,
      }

      const functionalSkills = validFunctionalSkills()
      res.locals.prisonerFunctionalSkills = functionalSkills
      req.session.wantToAddQualificationsForm = undefined

      const expectedWantToAddQualificationsForm = {
        wantToAddQualifications: YesNoValue.YES, // expect form value to be YES because the induction already has qualifications on it
      }

      const expectedFunctionalSkills = functionalSkills
      const expectedView = {
        prisonerSummary,
        backLinkUrl: '/prisoners/A1234BC/induction/reasons-not-to-get-work',
        backLinkAriaText: `Back to What could stop Jimmy Lightfingers working when they are released?`,
        form: expectedWantToAddQualificationsForm,
        functionalSkills: expectedFunctionalSkills,
      }
      const expectedPageFlowHistory = {
        pageUrls: [
          `/prisoners/${prisonNumber}/induction/hoping-to-work-on-release`,
          `/prisoners/${prisonNumber}/induction/reasons-not-to-get-work`,
          `/prisoners/${prisonNumber}/induction/want-to-add-qualifications`,
        ],
        currentPageIndex: 2,
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

    it('should get the Want To Add Qualifications view given there is no WantToAddQualificationsForm on the session and the induction has no qualifications', async () => {
      // Given
      const inductionDto = aValidInductionDto()
      inductionDto.previousQualifications.qualifications = []
      req.session.inductionDto = inductionDto

      req.session.pageFlowHistory = {
        pageUrls: [
          `/prisoners/${prisonNumber}/induction/hoping-to-work-on-release`,
          `/prisoners/${prisonNumber}/induction/reasons-not-to-get-work`,
        ],
        currentPageIndex: 1,
      }

      const functionalSkills = validFunctionalSkills()
      res.locals.prisonerFunctionalSkills = functionalSkills
      req.session.wantToAddQualificationsForm = undefined

      const expectedWantToAddQualificationsForm = {
        wantToAddQualifications: YesNoValue.NO, // expect form value to be NO because the induction has no qualifications on it
      }

      const expectedFunctionalSkills = functionalSkills
      const expectedView = {
        prisonerSummary,
        backLinkUrl: '/prisoners/A1234BC/induction/reasons-not-to-get-work',
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

    it('should get the Want To Add Qualifications view given there is no WantToAddQualificationsForm on the session and the induction has no qualification data at all', async () => {
      // Given
      const inductionDto = aValidInductionDto()
      inductionDto.previousQualifications = undefined
      req.session.inductionDto = inductionDto

      req.session.pageFlowHistory = {
        pageUrls: [
          `/prisoners/${prisonNumber}/induction/hoping-to-work-on-release`,
          `/prisoners/${prisonNumber}/induction/reasons-not-to-get-work`,
        ],
        currentPageIndex: 1,
      }

      const functionalSkills = validFunctionalSkills()
      res.locals.prisonerFunctionalSkills = functionalSkills
      req.session.wantToAddQualificationsForm = undefined

      const expectedWantToAddQualificationsForm = {
        wantToAddQualifications: undefined as YesNoValue, // expect form value to be undefined because the induction has no qualifications data at all on it
      }

      const expectedFunctionalSkills = functionalSkills
      const expectedView = {
        prisonerSummary,
        backLinkUrl: '/prisoners/A1234BC/induction/reasons-not-to-get-work',
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

    it('should get the Want To Add Qualifications view given there is a WantToAddQualificationsForm already on the session', async () => {
      // Given
      const inductionDto = aValidInductionDto()
      req.session.inductionDto = inductionDto

      req.session.pageFlowHistory = {
        pageUrls: [
          `/prisoners/${prisonNumber}/induction/hoping-to-work-on-release`,
          `/prisoners/${prisonNumber}/induction/reasons-not-to-get-work`,
        ],
        currentPageIndex: 1,
      }

      const functionalSkills = validFunctionalSkills()
      res.locals.prisonerFunctionalSkills = functionalSkills

      const expectedWantToAddQualificationsForm = {
        wantToAddQualifications: YesNoValue.YES,
      }
      req.session.wantToAddQualificationsForm = expectedWantToAddQualificationsForm

      const expectedFunctionalSkills = functionalSkills
      const expectedView = {
        prisonerSummary,
        backLinkUrl: '/prisoners/A1234BC/induction/reasons-not-to-get-work',
        backLinkAriaText: `Back to What could stop Jimmy Lightfingers working when they are released?`,
        form: expectedWantToAddQualificationsForm,
        functionalSkills: expectedFunctionalSkills,
      }
      const expectedPageFlowHistory = {
        pageUrls: [
          `/prisoners/${prisonNumber}/induction/hoping-to-work-on-release`,
          `/prisoners/${prisonNumber}/induction/reasons-not-to-get-work`,
          `/prisoners/${prisonNumber}/induction/want-to-add-qualifications`,
        ],
        currentPageIndex: 2,
      }

      // When
      await controller.getWantToAddQualificationsView(req, res, next)

      // Then
      expect(res.render).toHaveBeenCalledWith(
        'pages/induction/prePrisonEducation/wantToAddQualifications',
        expectedView,
      )
      expect(req.session.pageFlowHistory).toEqual(expectedPageFlowHistory)
    })
  })

  describe('submitWantToAddQualificationsForm', () => {
    it('should not proceed to next page given form is submitted with validation errors', async () => {
      // Given
      const inductionDto = aValidInductionDto()
      req.session.inductionDto = inductionDto

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
        '/prisoners/A1234BC/induction/want-to-add-qualifications',
        expectedErrors,
      )
      expect(req.session.wantToAddQualificationsForm).toEqual(invalidWantToAddQualificationsForm)
    })

    it(`should proceed to qualification level page given user wants to add a qualification`, async () => {
      // Given
      req.user.token = 'some-token'
      const inductionDto = aValidInductionDto()
      req.session.inductionDto = inductionDto

      const wantToAddQualificationsForm = { wantToAddQualifications: YesNoValue.YES }
      req.body = wantToAddQualificationsForm
      req.session.wantToAddQualificationsForm = undefined

      // When
      await controller.submitWantToAddQualificationsForm(req, res, next)

      // Then
      expect(res.redirect).toHaveBeenCalledWith(`/prisoners/${prisonNumber}/induction/qualification-level`)
      expect(req.session.wantToAddQualificationsForm).toBeUndefined()
    })

    it(`should proceed to additional training page given user wants to add a qualification`, async () => {
      // Given
      req.user.token = 'some-token'
      const inductionDto = aValidInductionDto()
      req.session.inductionDto = inductionDto

      const wantToAddQualificationsForm = { wantToAddQualifications: YesNoValue.NO }
      req.body = wantToAddQualificationsForm
      req.session.wantToAddQualificationsForm = undefined

      // When
      await controller.submitWantToAddQualificationsForm(req, res, next)

      // Then
      expect(res.redirect).toHaveBeenCalledWith(`/prisoners/${prisonNumber}/induction/additional-training`)
      expect(req.session.wantToAddQualificationsForm).toBeUndefined()
    })
  })
})
