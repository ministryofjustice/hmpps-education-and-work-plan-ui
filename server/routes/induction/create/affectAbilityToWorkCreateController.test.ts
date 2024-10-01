import { Request, Response } from 'express'
import type { AffectAbilityToWorkForm } from 'inductionForms'
import aValidPrisonerSummary from '../../../testsupport/prisonerSummaryTestDataBuilder'
import { aValidInductionDto } from '../../../testsupport/inductionDtoTestDataBuilder'
import AbilityToWorkValue from '../../../enums/abilityToWorkValue'
import AffectAbilityToWorkCreateController from './affectAbilityToWorkCreateController'

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
    req.session.pageFlowHistory = undefined
    req.body = {}
  })

  describe('getAbilityToWorkView', () => {
    it('should get the Ability To Work view given there is no AbilityToWorkForm on the session', async () => {
      // Given
      const inductionDto = aValidInductionDto()
      inductionDto.workOnRelease.affectAbilityToWork = undefined
      inductionDto.workOnRelease.affectAbilityToWorkOther = undefined
      req.session.inductionDto = inductionDto
      req.session.affectAbilityToWorkForm = undefined

      const expectedAbilityToWorkForm: AffectAbilityToWorkForm = {
        affectAbilityToWork: [],
        affectAbilityToWorkOther: undefined,
      }

      const expectedView = {
        prisonerSummary,
        form: expectedAbilityToWorkForm,
        backLinkUrl: '/prisoners/A1234BC/create-induction/work-interest-roles',
        backLinkAriaText: 'Back to Is Jimmy Lightfingers interested in any particular jobs?',
      }

      // When
      await controller.getAffectAbilityToWorkView(req, res, next)

      // Then
      expect(res.render).toHaveBeenCalledWith('pages/induction/affectAbilityToWork/index', expectedView)
      expect(req.session.affectAbilityToWorkForm).toBeUndefined()
      expect(req.session.inductionDto).toEqual(inductionDto)
    })

    it('should get the Ability To Work view given there is an AbilityToWorkForm already on the session', async () => {
      // Given
      const inductionDto = aValidInductionDto()
      inductionDto.workOnRelease.affectAbilityToWork = undefined
      inductionDto.workOnRelease.affectAbilityToWorkOther = undefined
      req.session.inductionDto = inductionDto

      const expectedAbilityToWorkForm: AffectAbilityToWorkForm = {
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
        backLinkUrl: '/prisoners/A1234BC/create-induction/work-interest-roles',
        backLinkAriaText: 'Back to Is Jimmy Lightfingers interested in any particular jobs?',
      }

      // When
      await controller.getAffectAbilityToWorkView(req, res, next)

      // Then
      expect(res.render).toHaveBeenCalledWith('pages/induction/affectAbilityToWork/index', expectedView)
      expect(req.session.affectAbilityToWorkForm).toBeUndefined()
      expect(req.session.inductionDto).toEqual(inductionDto)
    })

    it('should get the Ability To Work view given the previous page was Check Your Answers', async () => {
      // Given
      const inductionDto = aValidInductionDto()
      req.session.inductionDto = inductionDto
      req.session.affectAbilityToWorkForm = undefined

      req.session.pageFlowHistory = {
        pageUrls: ['/prisoners/A1234BC/create-induction/check-your-answers'],
        currentPageIndex: 0,
      }

      const expectedPageFlowHistory = {
        pageUrls: [
          '/prisoners/A1234BC/create-induction/check-your-answers',
          '/prisoners/A1234BC/create-induction/affect-ability-to-work',
        ],
        currentPageIndex: 1,
      }

      const expectedAbilityToWorkForm: AffectAbilityToWorkForm = {
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
        backLinkUrl: '/prisoners/A1234BC/create-induction/check-your-answers',
        backLinkAriaText: `Back to Check and save your answers before adding Jimmy Lightfingers's goals`,
      }

      // When
      await controller.getAffectAbilityToWorkView(req, res, next)

      // Then
      expect(res.render).toHaveBeenCalledWith('pages/induction/affectAbilityToWork/index', expectedView)
      expect(req.session.affectAbilityToWorkForm).toBeUndefined()
      expect(req.session.inductionDto).toEqual(inductionDto)
      expect(req.session.pageFlowHistory).toEqual(expectedPageFlowHistory)
    })
  })

  describe('submitAbilityToWorkForm', () => {
    it('should not update Induction given form is submitted with validation errors', async () => {
      // Given
      const inductionDto = aValidInductionDto()
      inductionDto.workOnRelease.affectAbilityToWork = undefined
      inductionDto.workOnRelease.affectAbilityToWorkOther = undefined
      req.session.inductionDto = inductionDto

      const invalidAbilityToWorkForm: AffectAbilityToWorkForm = {
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
      await controller.submitAffectAbilityToWorkForm(req, res, next)

      // Then
      expect(res.redirectWithErrors).toHaveBeenCalledWith(
        '/prisoners/A1234BC/create-induction/affect-ability-to-work',
        expectedErrors,
      )
      expect(req.session.affectAbilityToWorkForm).toEqual(invalidAbilityToWorkForm)
      expect(req.session.inductionDto).toEqual(inductionDto)
    })

    it('should update inductionDto and redirect to Highest Level of Education page', async () => {
      // Given
      const inductionDto = aValidInductionDto()
      inductionDto.workOnRelease.affectAbilityToWork = undefined
      inductionDto.workOnRelease.affectAbilityToWorkOther = undefined
      req.session.inductionDto = inductionDto

      const affectAbilityToWorkForm = {
        affectAbilityToWork: [AbilityToWorkValue.CARING_RESPONSIBILITIES, AbilityToWorkValue.OTHER],
        affectAbilityToWorkOther: 'Variable mental health',
      }
      req.body = affectAbilityToWorkForm
      req.session.affectAbilityToWorkForm = undefined

      // When
      await controller.submitAffectAbilityToWorkForm(req, res, next)

      // Then
      const updatedInduction = req.session.inductionDto
      expect(updatedInduction.workOnRelease.affectAbilityToWork).toEqual([
        AbilityToWorkValue.CARING_RESPONSIBILITIES,
        AbilityToWorkValue.OTHER,
      ])
      expect(updatedInduction.workOnRelease.affectAbilityToWorkOther).toEqual('Variable mental health')
      expect(res.redirect).toHaveBeenCalledWith('/prisoners/A1234BC/create-induction/highest-level-of-education')
      expect(req.session.affectAbilityToWorkForm).toBeUndefined()
    })
  })
})
