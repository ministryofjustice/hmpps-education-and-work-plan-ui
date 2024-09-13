import createError from 'http-errors'
import type { SessionData } from 'express-session'
import { NextFunction, Request, Response } from 'express'
import aValidPrisonerSummary from '../../../testsupport/prisonerSummaryTestDataBuilder'
import { aValidInductionDto } from '../../../testsupport/inductionDtoTestDataBuilder'
import toCreateOrUpdateInductionDto from '../../../data/mappers/createOrUpdateInductionDtoMapper'
import InductionService from '../../../services/inductionService'
import aValidUpdateInductionRequest from '../../../testsupport/updateInductionRequestTestDataBuilder'
import AbilityToWorkUpdateController from './affectAbilityToWorkUpdateController'
import AbilityToWorkValue from '../../../enums/abilityToWorkValue'

jest.mock('../../../data/mappers/createOrUpdateInductionDtoMapper')
jest.mock('../../../services/inductionService')

describe('affectAbilityToWorkUpdateController', () => {
  const mockedCreateOrUpdateInductionDtoMapper = toCreateOrUpdateInductionDto as jest.MockedFunction<
    typeof toCreateOrUpdateInductionDto
  >

  const inductionService = new InductionService(null, null) as jest.Mocked<InductionService>
  const controller = new AbilityToWorkUpdateController(inductionService)

  const prisonNumber = 'A1234BC'
  const prisonerSummary = aValidPrisonerSummary()

  const req = {
    session: {} as SessionData,
    body: {},
    user: {} as Express.User,
    params: {} as Record<string, string>,
    path: '',
  }
  const res = {
    redirect: jest.fn(),
    redirectWithErrors: jest.fn(),
    render: jest.fn(),
  }
  const next = jest.fn()

  beforeEach(() => {
    jest.resetAllMocks()
    req.session = { prisonerSummary } as SessionData
    req.body = {}
    req.user = { token: 'some-token' } as Express.User
    req.params = { prisonNumber }
    req.path = `/prisoners/${prisonNumber}/induction/affect-ability-to-work`
  })

  describe('getAbilityToWorkView', () => {
    it('should get the Ability To Work view given there is no AbilityToWorkForm on the session', async () => {
      // Given
      const inductionDto = aValidInductionDto()
      req.session.inductionDto = inductionDto
      req.session.affectAbilityToWorkForm = undefined

      const expectedAbilityToWorkForm = {
        affectAbilityToWork: [
          AbilityToWorkValue.CARING_RESPONSIBILITIES,
          AbilityToWorkValue.NEEDS_WORK_ADJUSTMENTS_DUE_TO_HEALTH,
          AbilityToWorkValue.OTHER,
        ],
        affectAbilityToWorkOther: 'Variable mental health',
      }

      const expectedView = {
        prisonerSummary,
        form: expectedAbilityToWorkForm,
        backLinkUrl: '/plan/A1234BC/view/work-and-interests',
        backLinkAriaText: `Back to Jimmy Lightfingers's learning and work progress`,
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
      const inductionDto = aValidInductionDto()
      req.session.inductionDto = inductionDto

      const expectedAbilityToWorkForm = {
        affectAbilityToWork: [
          AbilityToWorkValue.CARING_RESPONSIBILITIES,
          AbilityToWorkValue.NEEDS_WORK_ADJUSTMENTS_DUE_TO_HEALTH,
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
  })

  describe('submitAbilityToWorkForm', () => {
    it('should not update Induction given form is submitted with validation errors', async () => {
      // Given
      const inductionDto = aValidInductionDto()
      req.session.inductionDto = inductionDto

      const invalidAbilityToWorkForm = {
        affectAbilityToWork: [AbilityToWorkValue.OTHER],
        affectAbilityToWorkOther: '',
      }
      req.body = invalidAbilityToWorkForm
      req.session.affectAbilityToWorkForm = undefined

      const expectedErrors = [
        {
          href: '#affectAbilityToWorkOther',
          text: `Enter factors affecting Jimmy Lightfingers's ability to work`,
        },
      ]

      // When
      await controller.submitAffectAbilityToWorkForm(
        req as undefined as Request,
        res as undefined as Response,
        next as undefined as NextFunction,
      )

      // Then
      expect(res.redirectWithErrors).toHaveBeenCalledWith(
        '/prisoners/A1234BC/induction/affect-ability-to-work',
        expectedErrors,
      )
      expect(req.session.affectAbilityToWorkForm).toEqual(invalidAbilityToWorkForm)
      expect(req.session.inductionDto).toEqual(inductionDto)
    })

    it('should update Induction and call API and redirect to work and interests page', async () => {
      // Given
      const inductionDto = aValidInductionDto()
      req.session.inductionDto = inductionDto

      const affectAbilityToWorkForm = {
        affectAbilityToWork: [AbilityToWorkValue.CARING_RESPONSIBILITIES, AbilityToWorkValue.OTHER],
        affectAbilityToWorkOther: 'Variable mental health',
      }
      req.body = affectAbilityToWorkForm
      req.session.affectAbilityToWorkForm = undefined
      const updateInductionDto = aValidUpdateInductionRequest()

      mockedCreateOrUpdateInductionDtoMapper.mockReturnValueOnce(updateInductionDto)

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

    it('should not update Induction given error calling service', async () => {
      // Given
      const inductionDto = aValidInductionDto()
      req.session.inductionDto = inductionDto

      const affectAbilityToWorkForm = {
        affectAbilityToWork: [AbilityToWorkValue.CARING_RESPONSIBILITIES, AbilityToWorkValue.OTHER],
        affectAbilityToWorkOther: 'Variable mental health',
      }
      req.body = affectAbilityToWorkForm
      req.session.affectAbilityToWorkForm = undefined
      const updateInductionDto = aValidUpdateInductionRequest()

      mockedCreateOrUpdateInductionDtoMapper.mockReturnValueOnce(updateInductionDto)

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
