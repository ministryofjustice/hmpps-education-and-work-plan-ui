import createError from 'http-errors'
import { Request, Response } from 'express'
import aValidPrisonerSummary from '../../../testsupport/prisonerSummaryTestDataBuilder'
import { aValidInductionDto } from '../../../testsupport/inductionDtoTestDataBuilder'
import toCreateOrUpdateInductionDto from '../../../data/mappers/createOrUpdateInductionDtoMapper'
import InductionService from '../../../services/inductionService'
import aValidUpdateInductionRequest from '../../../testsupport/updateInductionRequestTestDataBuilder'
import AbilityToWorkUpdateController from './affectAbilityToWorkUpdateController'
import AbilityToWorkValue from '../../../enums/abilityToWorkValue'
import { getPrisonerContext } from '../../../data/session/prisonerContexts'

jest.mock('../../../data/mappers/createOrUpdateInductionDtoMapper')
jest.mock('../../../services/inductionService')

describe('affectAbilityToWorkUpdateController', () => {
  const mockedCreateOrUpdateInductionDtoMapper = toCreateOrUpdateInductionDto as jest.MockedFunction<
    typeof toCreateOrUpdateInductionDto
  >

  const inductionService = new InductionService(null, null) as jest.Mocked<InductionService>
  const controller = new AbilityToWorkUpdateController(inductionService)

  const prisonNumber = 'A1234BC'
  const username = 'a-dps-user'
  const prisonerSummary = aValidPrisonerSummary()

  const req = {
    session: {},
    body: {},
    user: { username },
    params: { prisonNumber },
    path: '',
  } as undefined as Request
  const res = {
    redirect: jest.fn(),
    redirectWithErrors: jest.fn(),
    render: jest.fn(),
    locals: { prisonerSummary },
  } as undefined as Response
  const next = jest.fn()

  beforeEach(() => {
    jest.resetAllMocks()
  })

  describe('getAbilityToWorkView', () => {
    it('should get the Ability To Work view given there is no AbilityToWorkForm on the session', async () => {
      // Given
      const inductionDto = aValidInductionDto()
      getPrisonerContext(req.session, prisonNumber).inductionDto = inductionDto
      getPrisonerContext(req.session, prisonNumber).affectAbilityToWorkForm = undefined

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
      }

      // When
      await controller.getAffectAbilityToWorkView(req, res, next)

      // Then
      expect(res.render).toHaveBeenCalledWith('pages/induction/affectAbilityToWork/index', expectedView)
      expect(getPrisonerContext(req.session, prisonNumber).affectAbilityToWorkForm).toBeUndefined()
      expect(getPrisonerContext(req.session, prisonNumber).inductionDto).toEqual(inductionDto)
    })

    it('should get the Ability To Work view given there is an AbilityToWorkForm already on the session', async () => {
      // Given
      const inductionDto = aValidInductionDto()
      getPrisonerContext(req.session, prisonNumber).inductionDto = inductionDto

      const expectedAbilityToWorkForm = {
        affectAbilityToWork: [
          AbilityToWorkValue.CARING_RESPONSIBILITIES,
          AbilityToWorkValue.NEEDS_WORK_ADJUSTMENTS_DUE_TO_HEALTH,
          AbilityToWorkValue.OTHER,
        ],
        affectAbilityToWorkOther: 'Variable mental health',
      }
      getPrisonerContext(req.session, prisonNumber).affectAbilityToWorkForm = expectedAbilityToWorkForm

      const expectedView = {
        prisonerSummary,
        form: expectedAbilityToWorkForm,
      }

      // When
      await controller.getAffectAbilityToWorkView(req, res, next)

      // Then
      expect(res.render).toHaveBeenCalledWith('pages/induction/affectAbilityToWork/index', expectedView)
      expect(getPrisonerContext(req.session, prisonNumber).affectAbilityToWorkForm).toBeUndefined()
      expect(getPrisonerContext(req.session, prisonNumber).inductionDto).toEqual(inductionDto)
    })
  })

  describe('submitAbilityToWorkForm', () => {
    it('should not update Induction given form is submitted with validation errors', async () => {
      // Given
      const inductionDto = aValidInductionDto()
      getPrisonerContext(req.session, prisonNumber).inductionDto = inductionDto

      const invalidAbilityToWorkForm = {
        affectAbilityToWork: [AbilityToWorkValue.OTHER],
        affectAbilityToWorkOther: '',
      }
      req.body = invalidAbilityToWorkForm
      getPrisonerContext(req.session, prisonNumber).affectAbilityToWorkForm = undefined

      const expectedErrors = [
        {
          href: '#affectAbilityToWorkOther',
          text: `Enter factors affecting Jimmy Lightfingers's ability to work`,
        },
      ]

      // When
      await controller.submitAffectAbilityToWorkForm(req, res, next)

      // Then
      expect(res.redirectWithErrors).toHaveBeenCalledWith(
        '/prisoners/A1234BC/induction/affect-ability-to-work',
        expectedErrors,
      )
      expect(getPrisonerContext(req.session, prisonNumber).affectAbilityToWorkForm).toEqual(invalidAbilityToWorkForm)
      expect(getPrisonerContext(req.session, prisonNumber).inductionDto).toEqual(inductionDto)
    })

    it('should update Induction and call API and redirect to work and interests page', async () => {
      // Given
      const inductionDto = aValidInductionDto()
      getPrisonerContext(req.session, prisonNumber).inductionDto = inductionDto

      const affectAbilityToWorkForm = {
        affectAbilityToWork: [AbilityToWorkValue.CARING_RESPONSIBILITIES, AbilityToWorkValue.OTHER],
        affectAbilityToWorkOther: 'Variable mental health',
      }
      req.body = affectAbilityToWorkForm
      getPrisonerContext(req.session, prisonNumber).affectAbilityToWorkForm = undefined
      const updateInductionDto = aValidUpdateInductionRequest()

      mockedCreateOrUpdateInductionDtoMapper.mockReturnValueOnce(updateInductionDto)

      const expectedUpdatedAbilityToWork = ['CARING_RESPONSIBILITIES', 'OTHER']
      const expectedUpdatedAbilityToWorkOther = 'Variable mental health'

      // When
      await controller.submitAffectAbilityToWorkForm(req, res, next)

      // Then
      // Extract the first call to the mock and the second argument (i.e. the updated Induction)
      const updatedInduction = mockedCreateOrUpdateInductionDtoMapper.mock.calls[0][1]
      expect(mockedCreateOrUpdateInductionDtoMapper).toHaveBeenCalledWith(prisonerSummary.prisonId, updatedInduction)
      expect(updatedInduction.workOnRelease.affectAbilityToWork).toEqual(expectedUpdatedAbilityToWork)
      expect(updatedInduction.workOnRelease.affectAbilityToWorkOther).toEqual(expectedUpdatedAbilityToWorkOther)

      expect(inductionService.updateInduction).toHaveBeenCalledWith(prisonNumber, updateInductionDto, username)
      expect(res.redirect).toHaveBeenCalledWith(`/plan/${prisonNumber}/view/work-and-interests`)
      expect(getPrisonerContext(req.session, prisonNumber).affectAbilityToWorkForm).toBeUndefined()
      expect(getPrisonerContext(req.session, prisonNumber).inductionDto).toBeUndefined()
    })

    it('should not update Induction given error calling service', async () => {
      // Given
      const inductionDto = aValidInductionDto()
      getPrisonerContext(req.session, prisonNumber).inductionDto = inductionDto

      const affectAbilityToWorkForm = {
        affectAbilityToWork: [AbilityToWorkValue.CARING_RESPONSIBILITIES, AbilityToWorkValue.OTHER],
        affectAbilityToWorkOther: 'Variable mental health',
      }
      req.body = affectAbilityToWorkForm
      getPrisonerContext(req.session, prisonNumber).affectAbilityToWorkForm = undefined
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
      await controller.submitAffectAbilityToWorkForm(req, res, next)

      // Then
      // Extract the first call to the mock and the second argument (i.e. the updated Induction)
      const updatedInduction = mockedCreateOrUpdateInductionDtoMapper.mock.calls[0][1]
      expect(mockedCreateOrUpdateInductionDtoMapper).toHaveBeenCalledWith(prisonerSummary.prisonId, updatedInduction)
      expect(updatedInduction.workOnRelease.affectAbilityToWork).toEqual(expectedUpdatedAbilityToWork)
      expect(updatedInduction.workOnRelease.affectAbilityToWorkOther).toEqual(expectedUpdatedAbilityToWorkOther)

      expect(inductionService.updateInduction).toHaveBeenCalledWith(prisonNumber, updateInductionDto, username)
      expect(next).toHaveBeenCalledWith(expectedError)
      expect(getPrisonerContext(req.session, prisonNumber).affectAbilityToWorkForm).toEqual(affectAbilityToWorkForm)
      expect(getPrisonerContext(req.session, prisonNumber).inductionDto).toEqual(inductionDto)
    })
  })
})
