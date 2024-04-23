import createError from 'http-errors'
import type { SessionData } from 'express-session'
import { NextFunction, Request, Response } from 'express'
import aValidPrisonerSummary from '../../../testsupport/prisonerSummaryTestDataBuilder'
import { aShortQuestionSetInductionDto } from '../../../testsupport/inductionDtoTestDataBuilder'
import toCreateOrUpdateInductionDto from '../../../data/mappers/createOrUpdateInductionDtoMapper'
import InductionService from '../../../services/inductionService'
import { aShortQuestionSetUpdateInductionRequest } from '../../../testsupport/updateInductionRequestTestDataBuilder'
import ReasonsNotToGetWorkUpdateController from './reasonsNotToGetWorkUpdateController'
import ReasonsNotToGetWorkValue from '../../../enums/reasonNotToGetWorkValue'

jest.mock('../../../data/mappers/createOrUpdateInductionDtoMapper')
jest.mock('../../../services/inductionService')

describe('reasonsNotToGetWorkUpdateController', () => {
  const mockedCreateOrUpdateInductionDtoMapper = toCreateOrUpdateInductionDto as jest.MockedFunction<
    typeof toCreateOrUpdateInductionDto
  >

  const inductionService = new InductionService(null) as jest.Mocked<InductionService>
  const controller = new ReasonsNotToGetWorkUpdateController(inductionService)

  const prisonNumber = 'A1234BC'
  const prisonerSummary = aValidPrisonerSummary()

  const noErrors: Array<Record<string, string>> = []

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
    req.session = { prisonerSummary } as SessionData
    req.body = {}
    req.user = { token: 'some-token' } as Express.User
    req.params = { prisonNumber }
    req.path = `/prisoners/${prisonNumber}/induction/reasons-not-to-get-work`
  })

  describe('getReasonsNotToGetWorkView', () => {
    it('should get the Reasons Not To Get Work view given there is no ReasonsNotToGetWorkForm on the session', async () => {
      // Given
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
        errors: noErrors,
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
        errors: noErrors,
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

    it('should get the Reasons Not To Get Work view given there is an updateInductionQuestionSet on the session', async () => {
      // Given
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
        errors: noErrors,
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
      const inductionDto = aShortQuestionSetInductionDto()
      req.session.inductionDto = inductionDto

      const invalidReasonsNotToGetWorkForm = {
        reasonsNotToGetWork: [ReasonsNotToGetWorkValue.OTHER],
        reasonsNotToGetWorkOther: '',
      }
      req.body = invalidReasonsNotToGetWorkForm
      req.session.reasonsNotToGetWorkForm = undefined

      const expectedErrors = [
        {
          href: '#reasonsNotToGetWorkOther',
          text: 'Enter what could stop Jimmy Lightfingers getting work on release',
        },
      ]

      // When
      await controller.submitReasonsNotToGetWorkForm(
        req as undefined as Request,
        res as undefined as Response,
        next as undefined as NextFunction,
      )

      // Then
      expect(res.redirect).toHaveBeenCalledWith('/prisoners/A1234BC/induction/reasons-not-to-get-work')
      expect(req.flash).toHaveBeenCalledWith('errors', expectedErrors)
      expect(req.session.reasonsNotToGetWorkForm).toEqual(invalidReasonsNotToGetWorkForm)
      expect(req.session.inductionDto).toEqual(inductionDto)
    })

    it('should update Induction and call API and redirect to work and interests page', async () => {
      // Given
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

    it('should submit reasons not to get work and move to qualifications page given there is an updateInductionQuestionSet on the session', async () => {
      // Given
      const inductionDto = aShortQuestionSetInductionDto()
      req.session.inductionDto = inductionDto

      const reasonsNotToGetWorkForm = {
        reasonsNotToGetWork: [ReasonsNotToGetWorkValue.HEALTH, ReasonsNotToGetWorkValue.OTHER],
        reasonsNotToGetWorkOther: 'Will be of retirement age at release',
      }
      req.body = reasonsNotToGetWorkForm
      req.session.reasonsNotToGetWorkForm = undefined

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
      expect(req.session.reasonsNotToGetWorkForm).toBeUndefined()
      expect(req.session.inductionDto).toEqual(inductionDto)
    })

    it('should update InductionDto and redirect to Check Your Answers given previous page was Check Your Answers', async () => {
      // Given
      const inductionDto = aShortQuestionSetInductionDto()
      req.session.inductionDto = inductionDto

      const reasonsNotToGetWorkForm = {
        reasonsNotToGetWork: [ReasonsNotToGetWorkValue.HEALTH, ReasonsNotToGetWorkValue.OTHER],
        reasonsNotToGetWorkOther: 'Will be of retirement age at release',
      }
      req.body = reasonsNotToGetWorkForm
      req.session.reasonsNotToGetWorkForm = undefined

      req.session.pageFlowHistory = {
        pageUrls: ['/prisoners/A1234BC/induction/check-your-answers', '/prisoners/A1234BC/induction/in-prison-work'],
        currentPageIndex: 1,
      }
      const expectedNextPage = '/prisoners/A1234BC/induction/check-your-answers'

      // When
      await controller.submitReasonsNotToGetWorkForm(
        req as undefined as Request,
        res as undefined as Response,
        next as undefined as NextFunction,
      )

      // Then
      expect(res.redirect).toHaveBeenCalledWith(expectedNextPage)
      expect(req.session.reasonsNotToGetWorkForm).toBeUndefined()
      expect(req.session.inductionDto).toEqual(inductionDto)
    })

    it('should submit reasons not to get work and redirect to Want to Add Qualifications view given there is an updateInductionQuestionSet on the session and Prisoner has no qualifications', async () => {
      // Given
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
      expect(req.session.reasonsNotToGetWorkForm).toBeUndefined()
      expect(req.session.inductionDto).toEqual(inductionDto)
    })

    it('should not update Induction given error calling service', async () => {
      // Given
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
      const updatedInductionDto = req.session.inductionDto
      expect(updatedInductionDto.workOnRelease.notHopingToWorkReasons).toEqual([
        ReasonsNotToGetWorkValue.FULL_TIME_CARER,
        ReasonsNotToGetWorkValue.OTHER,
      ])
      expect(updatedInductionDto.workOnRelease.notHopingToWorkOtherReason).toEqual(
        'Will be of retirement age at release',
      )
    })
  })
})
