import { NextFunction, Request, Response } from 'express'
import type { SessionData } from 'express-session'
import WantToAddQualificationsUpdateController from './wantToAddQualificationsUpdateController'
import aValidPrisonerSummary from '../../../testsupport/prisonerSummaryTestDataBuilder'
import validateWantToAddQualificationsForm from './wantToAddQualificationsFormValidator'
import YesNoValue from '../../../enums/yesNoValue'
import { validFunctionalSkills } from '../../../testsupport/functionalSkillsTestDataBuilder'
import { aShortQuestionSetInductionDto } from '../../../testsupport/inductionDtoTestDataBuilder'

jest.mock('./wantToAddQualificationsFormValidator')
jest.mock('../../../data/mappers/createOrUpdateInductionDtoMapper')

describe('wantToAddQualificationsUpdateController', () => {
  const mockedFormValidator = validateWantToAddQualificationsForm as jest.MockedFunction<
    typeof validateWantToAddQualificationsForm
  >

  const controller = new WantToAddQualificationsUpdateController()

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

  describe('getWantToAddQualificationsView', () => {
    it('should get the Want To Add Qualifications view given there is no WantToAddQualificationsForm on the session and the induction has qualifications', async () => {
      // Given
      const prisonNumber = 'A1234BC'
      req.params.prisonNumber = prisonNumber
      const inductionDto = aShortQuestionSetInductionDto()
      req.session.inductionDto = inductionDto

      const prisonerSummary = aValidPrisonerSummary()
      req.session.prisonerSummary = prisonerSummary
      req.session.pageFlowHistory = {
        pageUrls: [
          `/prisoners/${prisonNumber}/induction/hoping-to-work-on-release`,
          `/prisoners/${prisonNumber}/induction/reasons-not-to-get-work`,
        ],
        currentPageIndex: 1,
      }

      const functionalSkills = validFunctionalSkills()
      req.session.prisonerFunctionalSkills = functionalSkills
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
        errors,
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
      await controller.getWantToAddQualificationsView(
        req as undefined as Request,
        res as undefined as Response,
        next as undefined as NextFunction,
      )

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
      const prisonNumber = 'A1234BC'
      req.params.prisonNumber = prisonNumber
      const inductionDto = aShortQuestionSetInductionDto()
      inductionDto.previousQualifications.qualifications = []
      req.session.inductionDto = inductionDto

      const prisonerSummary = aValidPrisonerSummary()
      req.session.prisonerSummary = prisonerSummary
      req.session.pageFlowHistory = {
        pageUrls: [
          `/prisoners/${prisonNumber}/induction/hoping-to-work-on-release`,
          `/prisoners/${prisonNumber}/induction/reasons-not-to-get-work`,
        ],
        currentPageIndex: 1,
      }

      const functionalSkills = validFunctionalSkills()
      req.session.prisonerFunctionalSkills = functionalSkills
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
        errors,
      }

      // When
      await controller.getWantToAddQualificationsView(
        req as undefined as Request,
        res as undefined as Response,
        next as undefined as NextFunction,
      )

      // Then
      expect(res.render).toHaveBeenCalledWith(
        'pages/induction/prePrisonEducation/wantToAddQualifications',
        expectedView,
      )
      expect(req.session.wantToAddQualificationsForm).toBeUndefined()
    })

    it('should get the Want To Add Qualifications view given there is no WantToAddQualificationsForm on the session and the induction has no qualification data at all', async () => {
      // Given
      const prisonNumber = 'A1234BC'
      req.params.prisonNumber = prisonNumber
      const inductionDto = aShortQuestionSetInductionDto()
      inductionDto.previousQualifications = undefined
      req.session.inductionDto = inductionDto

      const prisonerSummary = aValidPrisonerSummary()
      req.session.prisonerSummary = prisonerSummary
      req.session.pageFlowHistory = {
        pageUrls: [
          `/prisoners/${prisonNumber}/induction/hoping-to-work-on-release`,
          `/prisoners/${prisonNumber}/induction/reasons-not-to-get-work`,
        ],
        currentPageIndex: 1,
      }

      const functionalSkills = validFunctionalSkills()
      req.session.prisonerFunctionalSkills = functionalSkills
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
        errors,
      }

      // When
      await controller.getWantToAddQualificationsView(
        req as undefined as Request,
        res as undefined as Response,
        next as undefined as NextFunction,
      )

      // Then
      expect(res.render).toHaveBeenCalledWith(
        'pages/induction/prePrisonEducation/wantToAddQualifications',
        expectedView,
      )
      expect(req.session.wantToAddQualificationsForm).toBeUndefined()
    })

    it('should get the Want To Add Qualifications view given there is a WantToAddQualificationsForm already on the session', async () => {
      // Given
      const prisonNumber = 'A1234BC'
      req.params.prisonNumber = prisonNumber
      const inductionDto = aShortQuestionSetInductionDto()
      req.session.inductionDto = inductionDto

      const prisonerSummary = aValidPrisonerSummary()
      req.session.prisonerSummary = prisonerSummary
      req.session.pageFlowHistory = {
        pageUrls: [
          `/prisoners/${prisonNumber}/induction/hoping-to-work-on-release`,
          `/prisoners/${prisonNumber}/induction/reasons-not-to-get-work`,
        ],
        currentPageIndex: 1,
      }

      const functionalSkills = validFunctionalSkills()
      req.session.prisonerFunctionalSkills = functionalSkills

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
        errors,
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
      await controller.getWantToAddQualificationsView(
        req as undefined as Request,
        res as undefined as Response,
        next as undefined as NextFunction,
      )

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
      const prisonNumber = 'A1234BC'
      req.params.prisonNumber = prisonNumber
      const inductionDto = aShortQuestionSetInductionDto()
      req.session.inductionDto = inductionDto

      const prisonerSummary = aValidPrisonerSummary()
      req.session.prisonerSummary = prisonerSummary

      const invalidWantToAddQualificationsForm = {
        wantToAddQualifications: '',
      }
      req.body = invalidWantToAddQualificationsForm
      req.session.wantToAddQualificationsForm = undefined

      errors = [
        {
          href: '#wantToAddQualifications',
          text: `Select whether Jimmy Lightfingers wants to record any other educational qualifications`,
        },
      ]
      mockedFormValidator.mockReturnValue(errors)

      // When
      await controller.submitWantToAddQualificationsForm(
        req as undefined as Request,
        res as undefined as Response,
        next as undefined as NextFunction,
      )

      // Then
      expect(res.redirect).toHaveBeenCalledWith('/prisoners/A1234BC/induction/want-to-add-qualifications')
      expect(req.flash).toHaveBeenCalledWith('errors', errors)
      expect(req.session.wantToAddQualificationsForm).toEqual(invalidWantToAddQualificationsForm)
    })

    it(`should proceed to qualification level page given user wants to add a qualification`, async () => {
      // Given
      req.user.token = 'some-token'
      const prisonNumber = 'A1234BC'
      req.params.prisonNumber = prisonNumber
      const inductionDto = aShortQuestionSetInductionDto()
      req.session.inductionDto = inductionDto

      const prisonerSummary = aValidPrisonerSummary()
      req.session.prisonerSummary = prisonerSummary

      const wantToAddQualificationsForm = { wantToAddQualifications: YesNoValue.YES }
      req.body = wantToAddQualificationsForm
      req.session.wantToAddQualificationsForm = undefined

      mockedFormValidator.mockReturnValue(errors)

      // When
      await controller.submitWantToAddQualificationsForm(
        req as undefined as Request,
        res as undefined as Response,
        next as undefined as NextFunction,
      )

      // Then
      expect(res.redirect).toHaveBeenCalledWith(`/prisoners/${prisonNumber}/induction/qualification-level`)
      expect(req.session.wantToAddQualificationsForm).toBeUndefined()
    })

    it(`should proceed to additional training page given user wants to add a qualification`, async () => {
      // Given
      req.user.token = 'some-token'
      const prisonNumber = 'A1234BC'
      req.params.prisonNumber = prisonNumber
      const inductionDto = aShortQuestionSetInductionDto()
      req.session.inductionDto = inductionDto

      const prisonerSummary = aValidPrisonerSummary()
      req.session.prisonerSummary = prisonerSummary

      const wantToAddQualificationsForm = { wantToAddQualifications: YesNoValue.NO }
      req.body = wantToAddQualificationsForm
      req.session.wantToAddQualificationsForm = undefined

      mockedFormValidator.mockReturnValue(errors)

      // When
      await controller.submitWantToAddQualificationsForm(
        req as undefined as Request,
        res as undefined as Response,
        next as undefined as NextFunction,
      )

      // Then
      expect(res.redirect).toHaveBeenCalledWith(`/prisoners/${prisonNumber}/induction/additional-training`)
      expect(req.session.wantToAddQualificationsForm).toBeUndefined()
    })

    it(`should redirect back to Check Your Answers page given user user has come from Check Your Answers and induction has no qualifications and they dont want to record any qualifications`, async () => {
      // Given
      req.user.token = 'some-token'
      const prisonNumber = 'A1234BC'
      req.params.prisonNumber = prisonNumber
      const inductionDto = aShortQuestionSetInductionDto()
      inductionDto.previousQualifications.qualifications = [] // No qualifications on the existing induction
      req.session.inductionDto = inductionDto

      req.session.pageFlowHistory = {
        pageUrls: [
          `/prisoners/${prisonNumber}/induction/check-your-answers`,
          `/prisoners/${prisonNumber}/induction/want-to-add-qualifications`,
        ],
        currentPageIndex: 1,
      }

      const prisonerSummary = aValidPrisonerSummary()
      req.session.prisonerSummary = prisonerSummary

      const wantToAddQualificationsForm = { wantToAddQualifications: YesNoValue.NO }
      req.body = wantToAddQualificationsForm
      req.session.wantToAddQualificationsForm = undefined

      mockedFormValidator.mockReturnValue(errors)

      // When
      await controller.submitWantToAddQualificationsForm(
        req as undefined as Request,
        res as undefined as Response,
        next as undefined as NextFunction,
      )

      // Then
      expect(res.redirect).toHaveBeenCalledWith(`/prisoners/${prisonNumber}/induction/check-your-answers`)
      expect(req.session.wantToAddQualificationsForm).toBeUndefined()
      expect(req.session.inductionDto).toEqual(inductionDto)
    })

    it(`should redirect back to Check Your Answers page given user user has come from Check Your Answers and induction has qualifications and they do want qualifications recorded`, async () => {
      // Given
      req.user.token = 'some-token'
      const prisonNumber = 'A1234BC'
      req.params.prisonNumber = prisonNumber
      const inductionDto = aShortQuestionSetInductionDto()
      req.session.inductionDto = inductionDto

      req.session.pageFlowHistory = {
        pageUrls: [
          `/prisoners/${prisonNumber}/induction/check-your-answers`,
          `/prisoners/${prisonNumber}/induction/want-to-add-qualifications`,
        ],
        currentPageIndex: 1,
      }

      const prisonerSummary = aValidPrisonerSummary()
      req.session.prisonerSummary = prisonerSummary

      const wantToAddQualificationsForm = { wantToAddQualifications: YesNoValue.YES }
      req.body = wantToAddQualificationsForm
      req.session.wantToAddQualificationsForm = undefined

      mockedFormValidator.mockReturnValue(errors)

      // When
      await controller.submitWantToAddQualificationsForm(
        req as undefined as Request,
        res as undefined as Response,
        next as undefined as NextFunction,
      )

      // Then
      expect(res.redirect).toHaveBeenCalledWith(`/prisoners/${prisonNumber}/induction/check-your-answers`)
      expect(req.session.wantToAddQualificationsForm).toBeUndefined()
      expect(req.session.inductionDto).toEqual(inductionDto)
    })

    it(`should update inductionDto and redirect back to Check Your Answers page given user user has come from Check Your Answers and induction has qualifications and they do not want qualifications recorded`, async () => {
      // Given
      req.user.token = 'some-token'
      const prisonNumber = 'A1234BC'
      req.params.prisonNumber = prisonNumber
      const inductionDto = aShortQuestionSetInductionDto()
      req.session.inductionDto = inductionDto

      req.session.pageFlowHistory = {
        pageUrls: [
          `/prisoners/${prisonNumber}/induction/check-your-answers`,
          `/prisoners/${prisonNumber}/induction/want-to-add-qualifications`,
        ],
        currentPageIndex: 1,
      }

      const prisonerSummary = aValidPrisonerSummary()
      req.session.prisonerSummary = prisonerSummary

      const wantToAddQualificationsForm = { wantToAddQualifications: YesNoValue.NO }
      req.body = wantToAddQualificationsForm
      req.session.wantToAddQualificationsForm = undefined

      mockedFormValidator.mockReturnValue(errors)

      // When
      await controller.submitWantToAddQualificationsForm(
        req as undefined as Request,
        res as undefined as Response,
        next as undefined as NextFunction,
      )

      // Then
      expect(res.redirect).toHaveBeenCalledWith(`/prisoners/${prisonNumber}/induction/check-your-answers`)
      expect(req.session.wantToAddQualificationsForm).toBeUndefined()
      expect(req.session.inductionDto.previousQualifications.qualifications).toEqual([])
    })
  })
})
