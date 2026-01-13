import { Request, Response } from 'express'
import { v4 as uuidV4 } from 'uuid'
import type { AffectAbilityToWorkForm } from 'inductionForms'
import aValidPrisonerSummary from '../../../testsupport/prisonerSummaryTestDataBuilder'
import { aValidInductionDto } from '../../../testsupport/inductionDtoTestDataBuilder'
import AbilityToWorkValue from '../../../enums/abilityToWorkValue'
import AffectAbilityToWorkCreateController from './affectAbilityToWorkCreateController'

describe('affectAbilityToWorkCreateController', () => {
  const controller = new AffectAbilityToWorkCreateController()

  const journeyId = uuidV4()
  const prisonNumber = 'A1234BC'
  const prisonerSummary = aValidPrisonerSummary()

  const flash = jest.fn()
  const req = {
    session: {},
    journeyData: {},
    body: {},
    params: { prisonNumber, journeyId },
    originalUrl: `/prisoners/${prisonNumber}/create-induction/${journeyId}/affect-ability-to-work`,
    flash,
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
    req.journeyData = {}
    req.query = {}
    res.locals.invalidForm = undefined
  })

  describe('getAbilityToWorkView', () => {
    it('should get the Ability To Work view given there is no AbilityToWorkForm on res.locals.invalidForm', async () => {
      // Given
      const inductionDto = aValidInductionDto()
      inductionDto.workOnRelease.affectAbilityToWork = undefined
      inductionDto.workOnRelease.affectAbilityToWorkOther = undefined
      req.journeyData.inductionDto = inductionDto
      res.locals.invalidForm = undefined

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
      expect(req.journeyData.inductionDto).toEqual(inductionDto)
    })

    it('should get the Ability To Work view given there is an AbilityToWorkForm already on res.locals.invalidForm', async () => {
      // Given
      const inductionDto = aValidInductionDto()
      inductionDto.workOnRelease.affectAbilityToWork = undefined
      inductionDto.workOnRelease.affectAbilityToWorkOther = undefined
      req.journeyData.inductionDto = inductionDto

      const expectedAbilityToWorkForm: AffectAbilityToWorkForm = {
        affectAbilityToWork: [
          AbilityToWorkValue.CARING_RESPONSIBILITIES,
          AbilityToWorkValue.NEEDS_WORK_ADJUSTMENTS_DUE_TO_HEALTH,
          AbilityToWorkValue.OTHER,
        ],
        affectAbilityToWorkOther: 'Variable mental health',
      }
      res.locals.invalidForm = expectedAbilityToWorkForm

      const expectedView = {
        prisonerSummary,
        form: expectedAbilityToWorkForm,
      }

      // When
      await controller.getAffectAbilityToWorkView(req, res, next)

      // Then
      expect(res.render).toHaveBeenCalledWith('pages/induction/affectAbilityToWork/index', expectedView)
      expect(req.journeyData.inductionDto).toEqual(inductionDto)
    })
  })

  describe('submitAbilityToWorkForm', () => {
    it('should redirect to Highest Level of Education page given form submitted successfully and previous page was not check-your-answers', async () => {
      // Given
      req.query = {}

      const inductionDto = aValidInductionDto()
      inductionDto.workOnRelease.affectAbilityToWork = undefined
      inductionDto.workOnRelease.affectAbilityToWorkOther = undefined
      req.journeyData.inductionDto = inductionDto

      const affectAbilityToWorkForm = {
        affectAbilityToWork: [AbilityToWorkValue.CARING_RESPONSIBILITIES, AbilityToWorkValue.OTHER],
        affectAbilityToWorkOther: 'Variable mental health',
      }
      req.body = affectAbilityToWorkForm

      // When
      await controller.submitAffectAbilityToWorkForm(req, res, next)

      // Then
      const updatedInduction = req.journeyData.inductionDto
      expect(updatedInduction.workOnRelease.affectAbilityToWork).toEqual([
        AbilityToWorkValue.CARING_RESPONSIBILITIES,
        AbilityToWorkValue.OTHER,
      ])
      expect(updatedInduction.workOnRelease.affectAbilityToWorkOther).toEqual('Variable mental health')
      expect(res.redirect).toHaveBeenCalledWith(
        `/prisoners/A1234BC/create-induction/${journeyId}/highest-level-of-education`,
      )
    })
  })

  it('should redirect to induction check-your-answers page given form submitted successfully and previous page was check-your-answers', async () => {
    req.query = { submitToCheckAnswers: 'true' }

    const inductionDto = aValidInductionDto()
    inductionDto.workOnRelease.affectAbilityToWork = undefined
    inductionDto.workOnRelease.affectAbilityToWorkOther = undefined
    req.journeyData.inductionDto = inductionDto

    const affectAbilityToWorkForm = {
      affectAbilityToWork: [AbilityToWorkValue.CARING_RESPONSIBILITIES, AbilityToWorkValue.OTHER],
      affectAbilityToWorkOther: 'Variable mental health',
    }
    req.body = affectAbilityToWorkForm

    // When
    await controller.submitAffectAbilityToWorkForm(req, res, next)

    // Then
    const updatedInduction = req.journeyData.inductionDto
    expect(updatedInduction.workOnRelease.affectAbilityToWork).toEqual([
      AbilityToWorkValue.CARING_RESPONSIBILITIES,
      AbilityToWorkValue.OTHER,
    ])
    expect(updatedInduction.workOnRelease.affectAbilityToWorkOther).toEqual('Variable mental health')
    expect(res.redirect).toHaveBeenCalledWith(`/prisoners/A1234BC/create-induction/${journeyId}/check-your-answers`)
  })
})
