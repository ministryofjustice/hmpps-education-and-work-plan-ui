import { Request, Response } from 'express'
import type { AffectAbilityToWorkForm } from 'inductionForms'
import aValidPrisonerSummary from '../../../testsupport/prisonerSummaryTestDataBuilder'
import { aValidInductionDto } from '../../../testsupport/inductionDtoTestDataBuilder'
import AbilityToWorkValue from '../../../enums/abilityToWorkValue'
import AffectAbilityToWorkCreateController from './affectAbilityToWorkCreateController'
import { getPrisonerContext } from '../../../data/session/prisonerContexts'

describe('affectAbilityToWorkCreateController', () => {
  const controller = new AffectAbilityToWorkCreateController()

  const prisonNumber = 'A1234BC'
  const prisonerSummary = aValidPrisonerSummary()

  const req = {
    session: {},
    body: {},
    params: { prisonNumber },
    path: `/prisoners/${prisonNumber}/create-induction/affect-ability-to-work`,
  } as unknown as Request
  const res = {
    redirect: jest.fn(),
    redirectWithErrors: jest.fn(),
    render: jest.fn(),
    locals: { prisonerSummary },
  } as unknown as Response
  const next = jest.fn()

  beforeEach(() => {
    jest.resetAllMocks()
    req.body = {}
  })

  describe('getAbilityToWorkView', () => {
    it('should get the Ability To Work view given there is no AbilityToWorkForm on the session', async () => {
      // Given
      const inductionDto = aValidInductionDto()
      inductionDto.workOnRelease.affectAbilityToWork = undefined
      inductionDto.workOnRelease.affectAbilityToWorkOther = undefined
      getPrisonerContext(req.session, prisonNumber).inductionDto = inductionDto
      getPrisonerContext(req.session, prisonNumber).affectAbilityToWorkForm = undefined

      const expectedAbilityToWorkForm: AffectAbilityToWorkForm = {
        affectAbilityToWork: [],
        affectAbilityToWorkOther: undefined,
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
      inductionDto.workOnRelease.affectAbilityToWork = undefined
      inductionDto.workOnRelease.affectAbilityToWorkOther = undefined
      getPrisonerContext(req.session, prisonNumber).inductionDto = inductionDto

      const expectedAbilityToWorkForm: AffectAbilityToWorkForm = {
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
      inductionDto.workOnRelease.affectAbilityToWork = undefined
      inductionDto.workOnRelease.affectAbilityToWorkOther = undefined
      getPrisonerContext(req.session, prisonNumber).inductionDto = inductionDto

      const invalidAbilityToWorkForm: AffectAbilityToWorkForm = {
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
        '/prisoners/A1234BC/create-induction/affect-ability-to-work',
        expectedErrors,
      )
      expect(getPrisonerContext(req.session, prisonNumber).affectAbilityToWorkForm).toEqual(invalidAbilityToWorkForm)
      expect(getPrisonerContext(req.session, prisonNumber).inductionDto).toEqual(inductionDto)
    })

    it('should update inductionDto and redirect to Highest Level of Education page', async () => {
      // Given
      const inductionDto = aValidInductionDto()
      inductionDto.workOnRelease.affectAbilityToWork = undefined
      inductionDto.workOnRelease.affectAbilityToWorkOther = undefined
      getPrisonerContext(req.session, prisonNumber).inductionDto = inductionDto

      const affectAbilityToWorkForm = {
        affectAbilityToWork: [AbilityToWorkValue.CARING_RESPONSIBILITIES, AbilityToWorkValue.OTHER],
        affectAbilityToWorkOther: 'Variable mental health',
      }
      req.body = affectAbilityToWorkForm
      getPrisonerContext(req.session, prisonNumber).affectAbilityToWorkForm = undefined

      // When
      await controller.submitAffectAbilityToWorkForm(req, res, next)

      // Then
      const updatedInduction = getPrisonerContext(req.session, prisonNumber).inductionDto
      expect(updatedInduction.workOnRelease.affectAbilityToWork).toEqual([
        AbilityToWorkValue.CARING_RESPONSIBILITIES,
        AbilityToWorkValue.OTHER,
      ])
      expect(updatedInduction.workOnRelease.affectAbilityToWorkOther).toEqual('Variable mental health')
      expect(res.redirect).toHaveBeenCalledWith('/prisoners/A1234BC/create-induction/highest-level-of-education')
      expect(getPrisonerContext(req.session, prisonNumber).affectAbilityToWorkForm).toBeUndefined()
    })
  })
})
