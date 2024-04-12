import createError from 'http-errors'
import type { SessionData } from 'express-session'
import { NextFunction, Request, Response } from 'express'
import aValidPrisonerSummary from '../../../testsupport/prisonerSummaryTestDataBuilder'
import { aLongQuestionSetInductionDto } from '../../../testsupport/inductionDtoTestDataBuilder'
import validateAbilityToWorkForm from './affectAbilityToWorkFormValidator'
import toCreateOrUpdateInductionDto from '../../../data/mappers/createOrUpdateInductionDtoMapper'
import InductionService from '../../../services/inductionService'
import { aLongQuestionSetUpdateInductionRequest } from '../../../testsupport/updateInductionRequestTestDataBuilder'
import AbilityToWorkUpdateController from './affectAbilityToWorkUpdateController'
import AbilityToWorkValue from '../../../enums/abilityToWorkValue'

jest.mock('./affectAbilityToWorkFormValidator')
jest.mock('../../../data/mappers/createOrUpdateInductionDtoMapper')
jest.mock('../../../services/inductionService')

describe('affectAbilityToWorkUpdateController', () => {
  const mockedFormValidator = validateAbilityToWorkForm as jest.MockedFunction<typeof validateAbilityToWorkForm>
  const mockedCreateOrUpdateInductionDtoMapper = toCreateOrUpdateInductionDto as jest.MockedFunction<
    typeof toCreateOrUpdateInductionDto
  >

  const inductionService = new InductionService(null) as jest.Mocked<InductionService>
  const controller = new AbilityToWorkUpdateController(inductionService)

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

  describe('getAbilityToWorkView', () => {
    it('should get the Ability To Work view given there is no AbilityToWorkForm on the session', async () => {
      // Given
      const prisonNumber = 'A1234BC'
      req.params.prisonNumber = prisonNumber

      const prisonerSummary = aValidPrisonerSummary()
      req.session.prisonerSummary = prisonerSummary
      const inductionDto = aLongQuestionSetInductionDto()
      req.session.inductionDto = inductionDto
      req.session.affectAbilityToWorkForm = undefined

      const expectedAbilityToWorkForm = {
        affectAbilityToWork: [
          AbilityToWorkValue.CARING_RESPONSIBILITIES,
          AbilityToWorkValue.HEALTH_ISSUES,
          AbilityToWorkValue.OTHER,
        ],
        affectAbilityToWorkOther: 'Variable mental health',
      }

      const expectedView = {
        prisonerSummary,
        form: expectedAbilityToWorkForm,
        backLinkUrl: '/plan/A1234BC/view/work-and-interests',
        backLinkAriaText: `Back to Jimmy Lightfingers's learning and work progress`,
        errors,
      }

      // When
      await controller.getAffectAbilityToWorkView(
        req as undefined as Request,
        res as undefined as Response,
        next as undefined as NextFunction,
      )

      // Then
      expect(res.render).toHaveBeenCalledWith('pages/induction/affectAbilityToWork/index', expectedView)
      expect(req.session.affectAbilityToWorkForm).toBeUndefined()
      expect(req.session.inductionDto).toEqual(inductionDto)
    })

    it('should get the Ability To Work view given there is an AbilityToWorkForm already on the session', async () => {
      // Given
      const prisonNumber = 'A1234BC'
      req.params.prisonNumber = prisonNumber

      const prisonerSummary = aValidPrisonerSummary()
      req.session.prisonerSummary = prisonerSummary
      const inductionDto = aLongQuestionSetInductionDto()
      req.session.inductionDto = inductionDto

      const expectedAbilityToWorkForm = {
        affectAbilityToWork: [
          AbilityToWorkValue.CARING_RESPONSIBILITIES,
          AbilityToWorkValue.HEALTH_ISSUES,
          AbilityToWorkValue.OTHER,
        ],
        affectAbilityToWorkOther: 'Variable mental health',
      }
      req.session.affectAbilityToWorkForm = expectedAbilityToWorkForm

      const expectedView = {
        prisonerSummary,
        form: expectedAbilityToWorkForm,
        backLinkUrl: '/plan/A1234BC/view/work-and-interests',
        backLinkAriaText: `Back to Jimmy Lightfingers's learning and work progress`,
        errors,
      }

      // When
      await controller.getAffectAbilityToWorkView(
        req as undefined as Request,
        res as undefined as Response,
        next as undefined as NextFunction,
      )

      // Then
      expect(res.render).toHaveBeenCalledWith('pages/induction/affectAbilityToWork/index', expectedView)
      expect(req.session.affectAbilityToWorkForm).toBeUndefined()
      expect(req.session.inductionDto).toEqual(inductionDto)
    })

    it('should get the Ability To Work view given there is an updateInductionQuestionSet on the session', async () => {
      // Given
      const prisonNumber = 'A1234BC'
      req.params.prisonNumber = prisonNumber

      const prisonerSummary = aValidPrisonerSummary()
      req.session.prisonerSummary = prisonerSummary
      const inductionDto = aLongQuestionSetInductionDto()
      req.session.inductionDto = inductionDto
      req.session.updateInductionQuestionSet = {
        hopingToWorkOnRelease: 'YES',
      }
      req.session.pageFlowHistory = {
        pageUrls: [`/prisoners/${prisonNumber}/induction/personal-interests`],
        currentPageIndex: 0,
      }

      const expectedAbilityToWorkForm = {
        affectAbilityToWork: [
          AbilityToWorkValue.CARING_RESPONSIBILITIES,
          AbilityToWorkValue.HEALTH_ISSUES,
          AbilityToWorkValue.OTHER,
        ],
        affectAbilityToWorkOther: 'Variable mental health',
      }
      req.session.affectAbilityToWorkForm = expectedAbilityToWorkForm

      const expectedView = {
        prisonerSummary,
        form: expectedAbilityToWorkForm,
        backLinkUrl: '/prisoners/A1234BC/induction/personal-interests',
        backLinkAriaText: `Back to What are Jimmy Lightfingers's interests?`,
        errors,
      }

      const expectedPageFlowHistory = {
        pageUrls: [
          '/prisoners/A1234BC/induction/personal-interests',
          '/prisoners/A1234BC/induction/affect-ability-to-work',
        ],
        currentPageIndex: 1,
      }

      // When
      await controller.getAffectAbilityToWorkView(
        req as undefined as Request,
        res as undefined as Response,
        next as undefined as NextFunction,
      )

      // Then
      expect(res.render).toHaveBeenCalledWith('pages/induction/affectAbilityToWork/index', expectedView)
      expect(req.session.inductionDto).toEqual(inductionDto)
      expect(req.session.pageFlowHistory).toEqual(expectedPageFlowHistory)
    })
  })

  describe('submitAbilityToWorkForm', () => {
    it('should not update Induction given form is submitted with validation errors', async () => {
      // Given
      const prisonNumber = 'A1234BC'
      req.params.prisonNumber = prisonNumber

      const prisonerSummary = aValidPrisonerSummary()
      req.session.prisonerSummary = prisonerSummary
      const inductionDto = aLongQuestionSetInductionDto()
      req.session.inductionDto = inductionDto

      const invalidAbilityToWorkForm = {
        affectAbilityToWork: [AbilityToWorkValue.OTHER],
        affectAbilityToWorkOther: '',
      }
      req.body = invalidAbilityToWorkForm
      req.session.affectAbilityToWorkForm = undefined

      errors = [
        {
          href: '#affectAbilityToWorkOther',
          text: `Select factors affecting Jimmy Lightfingers's ability to work or select 'None of these'`,
        },
      ]
      mockedFormValidator.mockReturnValue(errors)

      // When
      await controller.submitAffectAbilityToWorkForm(
        req as undefined as Request,
        res as undefined as Response,
        next as undefined as NextFunction,
      )

      // Then
      expect(res.redirect).toHaveBeenCalledWith('/prisoners/A1234BC/induction/affect-ability-to-work')
      expect(req.flash).toHaveBeenCalledWith('errors', errors)
      expect(req.session.affectAbilityToWorkForm).toEqual(invalidAbilityToWorkForm)
      expect(req.session.inductionDto).toEqual(inductionDto)
    })

    it('should update Induction and call API and redirect to work and interests page', async () => {
      // Given
      req.user.token = 'some-token'
      const prisonNumber = 'A1234BC'
      req.params.prisonNumber = prisonNumber

      const prisonerSummary = aValidPrisonerSummary()
      req.session.prisonerSummary = prisonerSummary
      const inductionDto = aLongQuestionSetInductionDto()
      req.session.inductionDto = inductionDto

      const affectAbilityToWorkForm = {
        affectAbilityToWork: [AbilityToWorkValue.CARING_RESPONSIBILITIES, AbilityToWorkValue.OTHER],
        affectAbilityToWorkOther: 'Variable mental health',
      }
      req.body = affectAbilityToWorkForm
      req.session.affectAbilityToWorkForm = undefined
      const updateInductionDto = aLongQuestionSetUpdateInductionRequest()

      mockedCreateOrUpdateInductionDtoMapper.mockReturnValueOnce(updateInductionDto)
      mockedFormValidator.mockReturnValue(errors)
      const expectedUpdatedAbilityToWork = ['CARING_RESPONSIBILITIES', 'OTHER']
      const expectedUpdatedAbilityToWorkOther = 'Variable mental health'

      // When
      await controller.submitAffectAbilityToWorkForm(
        req as undefined as Request,
        res as undefined as Response,
        next as undefined as NextFunction,
      )

      // Then
      // Extract the first call to the mock and the second argument (i.e. the updated Induction)
      const updatedInduction = mockedCreateOrUpdateInductionDtoMapper.mock.calls[0][1]
      expect(mockedCreateOrUpdateInductionDtoMapper).toHaveBeenCalledWith(prisonerSummary.prisonId, updatedInduction)
      expect(updatedInduction.workOnRelease.affectAbilityToWork).toEqual(expectedUpdatedAbilityToWork)
      expect(updatedInduction.workOnRelease.affectAbilityToWorkOther).toEqual(expectedUpdatedAbilityToWorkOther)

      expect(inductionService.updateInduction).toHaveBeenCalledWith(prisonNumber, updateInductionDto, 'some-token')
      expect(res.redirect).toHaveBeenCalledWith(`/plan/${prisonNumber}/view/work-and-interests`)
      expect(req.session.affectAbilityToWorkForm).toBeUndefined()
      expect(req.session.inductionDto).toBeUndefined()
    })

    it('should update InductionDto and redirect to Check Your Answers view given there is an updateInductionQuestionSet on the session', async () => {
      // Given
      req.user.token = 'some-token'
      const prisonNumber = 'A1234BC'
      req.params.prisonNumber = prisonNumber

      const prisonerSummary = aValidPrisonerSummary()
      req.session.prisonerSummary = prisonerSummary
      const inductionDto = aLongQuestionSetInductionDto()
      req.session.inductionDto = inductionDto

      const affectAbilityToWorkForm = {
        affectAbilityToWork: [AbilityToWorkValue.CARING_RESPONSIBILITIES, AbilityToWorkValue.OTHER],
        affectAbilityToWorkOther: 'Variable mental health',
      }
      req.body = affectAbilityToWorkForm
      req.session.affectAbilityToWorkForm = undefined

      mockedFormValidator.mockReturnValue(errors)

      req.session.updateInductionQuestionSet = { hopingToWorkOnRelease: 'YES' }

      const expectedUpdatedAbilityToWork = ['CARING_RESPONSIBILITIES', 'OTHER']

      const expectedUpdatedAbilityToWorkOther = 'Variable mental health'
      const expectedNextPage = '/prisoners/A1234BC/induction/check-your-answers'

      // When
      await controller.submitAffectAbilityToWorkForm(
        req as undefined as Request,
        res as undefined as Response,
        next as undefined as NextFunction,
      )

      // Then
      const updatedInductionDto = req.session.inductionDto
      expect(updatedInductionDto.workOnRelease.affectAbilityToWork).toEqual(expectedUpdatedAbilityToWork)
      expect(updatedInductionDto.workOnRelease.affectAbilityToWorkOther).toEqual(expectedUpdatedAbilityToWorkOther)

      expect(res.redirect).toHaveBeenCalledWith(expectedNextPage)
      expect(req.session.affectAbilityToWorkForm).toBeUndefined()
    })

    it('should not update Induction given error calling service', async () => {
      // Given
      req.user.token = 'some-token'
      const prisonNumber = 'A1234BC'
      req.params.prisonNumber = prisonNumber

      const prisonerSummary = aValidPrisonerSummary()
      req.session.prisonerSummary = prisonerSummary
      const inductionDto = aLongQuestionSetInductionDto()
      req.session.inductionDto = inductionDto

      const affectAbilityToWorkForm = {
        affectAbilityToWork: [AbilityToWorkValue.CARING_RESPONSIBILITIES, AbilityToWorkValue.OTHER],
        affectAbilityToWorkOther: 'Variable mental health',
      }
      req.body = affectAbilityToWorkForm
      req.session.affectAbilityToWorkForm = undefined
      const updateInductionDto = aLongQuestionSetUpdateInductionRequest()

      mockedCreateOrUpdateInductionDtoMapper.mockReturnValueOnce(updateInductionDto)
      mockedFormValidator.mockReturnValue(errors)
      const expectedUpdatedAbilityToWork = ['CARING_RESPONSIBILITIES', 'OTHER']
      const expectedUpdatedAbilityToWorkOther = 'Variable mental health'

      inductionService.updateInduction.mockRejectedValue(createError(500, 'Service unavailable'))
      const expectedError = createError(
        500,
        `Error updating Induction for prisoner ${prisonNumber}. Error: InternalServerError: Service unavailable`,
      )

      // When
      await controller.submitAffectAbilityToWorkForm(
        req as undefined as Request,
        res as undefined as Response,
        next as undefined as NextFunction,
      )

      // Then
      // Extract the first call to the mock and the second argument (i.e. the updated Induction)
      const updatedInduction = mockedCreateOrUpdateInductionDtoMapper.mock.calls[0][1]
      expect(mockedCreateOrUpdateInductionDtoMapper).toHaveBeenCalledWith(prisonerSummary.prisonId, updatedInduction)
      expect(updatedInduction.workOnRelease.affectAbilityToWork).toEqual(expectedUpdatedAbilityToWork)
      expect(updatedInduction.workOnRelease.affectAbilityToWorkOther).toEqual(expectedUpdatedAbilityToWorkOther)

      expect(inductionService.updateInduction).toHaveBeenCalledWith(prisonNumber, updateInductionDto, 'some-token')
      expect(next).toHaveBeenCalledWith(expectedError)
      expect(req.session.affectAbilityToWorkForm).toEqual(affectAbilityToWorkForm)
      expect(req.session.inductionDto).toEqual(inductionDto)
    })
  })
})
