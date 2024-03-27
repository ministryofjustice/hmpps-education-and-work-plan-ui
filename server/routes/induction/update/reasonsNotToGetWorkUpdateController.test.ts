import createError from 'http-errors'
import type { SessionData } from 'express-session'
import { NextFunction, Request, Response } from 'express'
import aValidPrisonerSummary from '../../../testsupport/prisonerSummaryTestDataBuilder'
import { aShortQuestionSetInductionDto } from '../../../testsupport/inductionDtoTestDataBuilder'
import validateReasonsNotToGetWorkForm from './reasonsNotToGetWorkFormValidator'
import toCreateOrUpdateInductionDto from '../../../data/mappers/createOrUpdateInductionDtoMapper'
import { InductionService } from '../../../services'
import { aShortQuestionSetUpdateInductionRequest } from '../../../testsupport/updateInductionRequestTestDataBuilder'
import ReasonsNotToGetWorkUpdateController from './reasonsNotToGetWorkUpdateController'
import ReasonsNotToGetWorkValue from '../../../enums/reasonNotToGetWorkValue'

jest.mock('./reasonsNotToGetWorkFormValidator')
jest.mock('../../../data/mappers/createOrUpdateInductionDtoMapper')

describe('reasonsNotToGetWorkUpdateController', () => {
  const mockedFormValidator = validateReasonsNotToGetWorkForm as jest.MockedFunction<
    typeof validateReasonsNotToGetWorkForm
  >
  const mockedCreateOrUpdateInductionDtoMapper = toCreateOrUpdateInductionDto as jest.MockedFunction<
    typeof toCreateOrUpdateInductionDto
  >

  const inductionService = {
    updateInduction: jest.fn(),
  }

  const controller = new ReasonsNotToGetWorkUpdateController(inductionService as unknown as InductionService)

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

  describe('getReasonsNotToGetWorkView', () => {
    it('should get the Reasons Not To Get Work view given there is no ReasonsNotToGetWorkForm on the session', async () => {
      // Given
      const prisonNumber = 'A1234BC'
      req.params.prisonNumber = prisonNumber

      const prisonerSummary = aValidPrisonerSummary()
      req.session.prisonerSummary = prisonerSummary
      const inductionDto = aShortQuestionSetInductionDto()
      req.session.inductionDto = inductionDto

      req.session.reasonsNotToGetWorkForm = undefined
      const expectedReasonsNotToGetWorkForm = {
        reasonsNotToGetWork: [ReasonsNotToGetWorkValue.HEALTH, ReasonsNotToGetWorkValue.OTHER],
        reasonsNotToGetWorkOther: 'Will be of retirement age at release',
      }

      const expectedView = {
        prisonerSummary,
        form: expectedReasonsNotToGetWorkForm,
        backLinkUrl: '/plan/A1234BC/view/work-and-interests',
        backLinkAriaText: `Back to Jimmy Lightfingers's learning and work progress`,
        errors,
      }

      // When
      await controller.getReasonsNotToGetWorkView(
        req as undefined as Request,
        res as undefined as Response,
        next as undefined as NextFunction,
      )

      // Then
      expect(res.render).toHaveBeenCalledWith('pages/induction/reasonsNotToGetWork/index', expectedView)
      expect(req.session.reasonsNotToGetWorkForm).toBeUndefined()
      expect(req.session.inductionDto).toEqual(inductionDto)
      expect(req.session.pageFlowHistory).toBeUndefined()
    })

    it('should get the Reasons Not To Get Work view given there is an ReasonsNotToGetWorkForm already on the session', async () => {
      // Given
      const prisonNumber = 'A1234BC'
      req.params.prisonNumber = prisonNumber

      const prisonerSummary = aValidPrisonerSummary()
      req.session.prisonerSummary = prisonerSummary
      const inductionDto = aShortQuestionSetInductionDto()
      req.session.inductionDto = inductionDto

      const expectedReasonsNotToGetWorkForm = {
        reasonsNotToGetWork: [ReasonsNotToGetWorkValue.HEALTH, ReasonsNotToGetWorkValue.OTHER],
        reasonsNotToGetWorkOther: 'Will be of retirement age at release',
      }
      req.session.reasonsNotToGetWorkForm = expectedReasonsNotToGetWorkForm

      const expectedView = {
        prisonerSummary,
        form: expectedReasonsNotToGetWorkForm,
        backLinkUrl: '/plan/A1234BC/view/work-and-interests',
        backLinkAriaText: `Back to Jimmy Lightfingers's learning and work progress`,
        errors,
      }

      // When
      await controller.getReasonsNotToGetWorkView(
        req as undefined as Request,
        res as undefined as Response,
        next as undefined as NextFunction,
      )

      // Then
      expect(res.render).toHaveBeenCalledWith('pages/induction/reasonsNotToGetWork/index', expectedView)
      expect(req.session.reasonsNotToGetWorkForm).toBeUndefined()
      expect(req.session.inductionDto).toEqual(inductionDto)
      expect(req.session.pageFlowHistory).toBeUndefined()
    })

    it('should get the Reasons Not To Get Work view given short induction question journey', async () => {
      // Given
      const prisonNumber = 'A1234BC'
      req.params.prisonNumber = prisonNumber

      const prisonerSummary = aValidPrisonerSummary()
      req.session.prisonerSummary = prisonerSummary
      const inductionDto = aShortQuestionSetInductionDto()
      req.session.inductionDto = inductionDto
      req.session.updateInductionQuestionSet = {
        hopingToWorkOnRelease: 'NO',
      }
      req.session.pageFlowHistory = {
        pageUrls: [`/prisoners/${prisonNumber}/induction/hoping-to-work-on-release`],
        currentPageIndex: 0,
      }

      const expectedReasonsNotToGetWorkForm = {
        reasonsNotToGetWork: [ReasonsNotToGetWorkValue.HEALTH, ReasonsNotToGetWorkValue.OTHER],
        reasonsNotToGetWorkOther: 'Will be of retirement age at release',
      }
      req.session.reasonsNotToGetWorkForm = expectedReasonsNotToGetWorkForm

      const expectedView = {
        prisonerSummary,
        form: expectedReasonsNotToGetWorkForm,
        backLinkUrl: '/prisoners/A1234BC/induction/hoping-to-work-on-release',
        backLinkAriaText: `Back to Is Jimmy Lightfingers hoping to get work when they're released?`,
        errors,
      }
      const expectedPageFlowHistory = {
        pageUrls: [
          `/prisoners/${prisonNumber}/induction/hoping-to-work-on-release`,
          `/prisoners/${prisonNumber}/induction/reasons-not-to-get-work`,
        ],
        currentPageIndex: 1,
      }

      // When
      await controller.getReasonsNotToGetWorkView(
        req as undefined as Request,
        res as undefined as Response,
        next as undefined as NextFunction,
      )

      // Then
      expect(res.render).toHaveBeenCalledWith('pages/induction/reasonsNotToGetWork/index', expectedView)
      expect(req.session.reasonsNotToGetWorkForm).toBeUndefined()
      expect(req.session.inductionDto).toEqual(inductionDto)
      expect(req.session.pageFlowHistory).toEqual(expectedPageFlowHistory)
    })
  })

  describe('submitReasonsNotToGetWorkForm', () => {
    it('should not update Induction given form is submitted with validation errors', async () => {
      // Given
      const prisonNumber = 'A1234BC'
      req.params.prisonNumber = prisonNumber

      const prisonerSummary = aValidPrisonerSummary()
      req.session.prisonerSummary = prisonerSummary
      const inductionDto = aShortQuestionSetInductionDto()
      req.session.inductionDto = inductionDto

      const invalidReasonsNotToGetWorkForm = {
        reasonsNotToGetWork: [ReasonsNotToGetWorkValue.OTHER],
        reasonsNotToGetWorkOther: '',
      }
      req.body = invalidReasonsNotToGetWorkForm
      req.session.reasonsNotToGetWorkForm = undefined

      errors = [
        {
          href: '#reasonsNotToGetWorkOther',
          text: `Select what could stop Jimmy Lightfingers getting work on release, or select 'Not sure'`,
        },
      ]
      mockedFormValidator.mockReturnValue(errors)

      // When
      await controller.submitReasonsNotToGetWorkForm(
        req as undefined as Request,
        res as undefined as Response,
        next as undefined as NextFunction,
      )

      // Then
      expect(res.redirect).toHaveBeenCalledWith('/prisoners/A1234BC/induction/reasons-not-to-get-work')
      expect(req.flash).toHaveBeenCalledWith('errors', errors)
      expect(req.session.reasonsNotToGetWorkForm).toEqual(invalidReasonsNotToGetWorkForm)
      expect(req.session.inductionDto).toEqual(inductionDto)
    })

    it('should update Induction and call API and redirect to work and interests page', async () => {
      // Given
      req.user.token = 'some-token'
      const prisonNumber = 'A1234BC'
      req.params.prisonNumber = prisonNumber

      const prisonerSummary = aValidPrisonerSummary()
      req.session.prisonerSummary = prisonerSummary
      const inductionDto = aShortQuestionSetInductionDto()
      req.session.inductionDto = inductionDto

      const reasonsNotToGetWorkForm = {
        reasonsNotToGetWork: [ReasonsNotToGetWorkValue.HEALTH, ReasonsNotToGetWorkValue.OTHER],
        reasonsNotToGetWorkOther: 'Will be of retirement age at release',
      }
      req.body = reasonsNotToGetWorkForm
      req.session.reasonsNotToGetWorkForm = undefined
      const updateInductionDto = aShortQuestionSetUpdateInductionRequest()

      mockedCreateOrUpdateInductionDtoMapper.mockReturnValueOnce(updateInductionDto)
      mockedFormValidator.mockReturnValue(errors)
      const expectedUpdatedReasonsNotToGetWork = ['HEALTH', 'OTHER']
      const expectedUpdatedReasonsNotToGetWorkOther = 'Will be of retirement age at release'

      // When
      await controller.submitReasonsNotToGetWorkForm(
        req as undefined as Request,
        res as undefined as Response,
        next as undefined as NextFunction,
      )

      // Then
      // Extract the first call to the mock and the second argument (i.e. the updated Induction)
      const updatedInduction = mockedCreateOrUpdateInductionDtoMapper.mock.calls[0][1]
      expect(mockedCreateOrUpdateInductionDtoMapper).toHaveBeenCalledWith(prisonerSummary.prisonId, updatedInduction)
      expect(updatedInduction.workOnRelease.notHopingToWorkReasons).toEqual(expectedUpdatedReasonsNotToGetWork)
      expect(updatedInduction.workOnRelease.notHopingToWorkOtherReason).toEqual(expectedUpdatedReasonsNotToGetWorkOther)

      expect(inductionService.updateInduction).toHaveBeenCalledWith(prisonNumber, updateInductionDto, 'some-token')
      expect(res.redirect).toHaveBeenCalledWith(`/plan/${prisonNumber}/view/work-and-interests`)
      expect(req.session.reasonsNotToGetWorkForm).toBeUndefined()
      expect(req.session.inductionDto).toBeUndefined()
    })

    it('should submit reasons not to get work and move to qualifications page', async () => {
      // Given
      req.user.token = 'some-token'
      const prisonNumber = 'A1234BC'
      req.params.prisonNumber = prisonNumber

      const prisonerSummary = aValidPrisonerSummary()
      req.session.prisonerSummary = prisonerSummary
      const inductionDto = aShortQuestionSetInductionDto()
      req.session.inductionDto = inductionDto

      const reasonsNotToGetWorkForm = {
        reasonsNotToGetWork: [ReasonsNotToGetWorkValue.HEALTH, ReasonsNotToGetWorkValue.OTHER],
        reasonsNotToGetWorkOther: 'Will be of retirement age at release',
      }
      req.body = reasonsNotToGetWorkForm
      req.session.reasonsNotToGetWorkForm = undefined
      mockedFormValidator.mockReturnValue(errors)

      req.session.updateInductionQuestionSet = { hopingToWorkOnRelease: 'NO' }
      const expectedNextPage = `/prisoners/${prisonNumber}/induction/qualifications`

      // When
      await controller.submitReasonsNotToGetWorkForm(
        req as undefined as Request,
        res as undefined as Response,
        next as undefined as NextFunction,
      )

      // Then
      expect(res.redirect).toHaveBeenCalledWith(expectedNextPage)
      expect(req.session.reasonsNotToGetWorkForm).toEqual(reasonsNotToGetWorkForm)
      expect(req.session.inductionDto).toEqual(inductionDto)
    })

    it('should submit reasons not to get work and redirect to Want to Add Qualifications view given short induction set journey and Prisoner has no qualifications', async () => {
      // Given
      req.user.token = 'some-token'
      const prisonNumber = 'A1234BC'
      req.params.prisonNumber = prisonNumber

      const prisonerSummary = aValidPrisonerSummary()
      req.session.prisonerSummary = prisonerSummary
      const inductionDto = aShortQuestionSetInductionDto()
      // Remove any qualifications to invoke the want-to-add-qualifications route
      inductionDto.previousQualifications.qualifications.splice(0)
      req.session.inductionDto = inductionDto

      const reasonsNotToGetWorkForm = {
        reasonsNotToGetWork: [ReasonsNotToGetWorkValue.HEALTH, ReasonsNotToGetWorkValue.OTHER],
        reasonsNotToGetWorkOther: 'Will be of retirement age at release',
      }
      req.body = reasonsNotToGetWorkForm
      req.session.reasonsNotToGetWorkForm = undefined
      mockedFormValidator.mockReturnValue(errors)

      req.session.updateInductionQuestionSet = { hopingToWorkOnRelease: 'NO' }
      const expectedNextPage = `/prisoners/${prisonNumber}/induction/want-to-add-qualifications`

      // When
      await controller.submitReasonsNotToGetWorkForm(
        req as undefined as Request,
        res as undefined as Response,
        next as undefined as NextFunction,
      )

      // Then
      expect(res.redirect).toHaveBeenCalledWith(expectedNextPage)
      expect(req.session.reasonsNotToGetWorkForm).toEqual(reasonsNotToGetWorkForm)
      expect(req.session.inductionDto).toEqual(inductionDto)
    })

    it('should not update Induction given error calling service', async () => {
      // Given
      req.user.token = 'some-token'
      const prisonNumber = 'A1234BC'
      req.params.prisonNumber = prisonNumber

      const prisonerSummary = aValidPrisonerSummary()
      req.session.prisonerSummary = prisonerSummary
      const inductionDto = aShortQuestionSetInductionDto()
      req.session.inductionDto = inductionDto

      const reasonsNotToGetWorkForm = {
        reasonsNotToGetWork: [ReasonsNotToGetWorkValue.FULL_TIME_CARER, ReasonsNotToGetWorkValue.OTHER],
        reasonsNotToGetWorkOther: 'Will be of retirement age at release',
      }
      req.body = reasonsNotToGetWorkForm
      req.session.reasonsNotToGetWorkForm = undefined
      const updateInductionDto = aShortQuestionSetUpdateInductionRequest()

      mockedCreateOrUpdateInductionDtoMapper.mockReturnValueOnce(updateInductionDto)
      mockedFormValidator.mockReturnValue(errors)
      const expectedUpdatedReasonsNotToGetWork = ['FULL_TIME_CARER', 'OTHER']
      const expectedUpdatedReasonsNotToGetWorkOther = 'Will be of retirement age at release'

      inductionService.updateInduction.mockRejectedValue(createError(500, 'Service unavailable'))
      const expectedError = createError(
        500,
        `Error updating Induction for prisoner ${prisonNumber}. Error: InternalServerError: Service unavailable`,
      )

      // When
      await controller.submitReasonsNotToGetWorkForm(
        req as undefined as Request,
        res as undefined as Response,
        next as undefined as NextFunction,
      )

      // Then
      // Extract the first call to the mock and the second argument (i.e. the updated Induction)
      const updatedInduction = mockedCreateOrUpdateInductionDtoMapper.mock.calls[0][1]
      expect(mockedCreateOrUpdateInductionDtoMapper).toHaveBeenCalledWith(prisonerSummary.prisonId, updatedInduction)
      expect(updatedInduction.workOnRelease.notHopingToWorkReasons).toEqual(expectedUpdatedReasonsNotToGetWork)
      expect(updatedInduction.workOnRelease.notHopingToWorkOtherReason).toEqual(expectedUpdatedReasonsNotToGetWorkOther)

      expect(inductionService.updateInduction).toHaveBeenCalledWith(prisonNumber, updateInductionDto, 'some-token')
      expect(next).toHaveBeenCalledWith(expectedError)
      expect(req.session.reasonsNotToGetWorkForm).toEqual(reasonsNotToGetWorkForm)
      expect(req.session.inductionDto).toEqual(inductionDto)
    })
  })
})
