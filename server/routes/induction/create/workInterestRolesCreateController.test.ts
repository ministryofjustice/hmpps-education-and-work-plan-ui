import { Request, Response } from 'express'
import { v4 as uuidV4 } from 'uuid'
import type { FutureWorkInterestDto } from 'inductionDto'
import aValidPrisonerSummary from '../../../testsupport/prisonerSummaryTestDataBuilder'
import { aValidInductionDto } from '../../../testsupport/inductionDtoTestDataBuilder'
import WorkInterestTypeValue from '../../../enums/workInterestTypeValue'
import WorkInterestRolesCreateController from './workInterestRolesCreateController'

describe('workInterestRolesCreateController', () => {
  const controller = new WorkInterestRolesCreateController()

  const journeyId = uuidV4()
  const prisonNumber = 'A1234BC'
  const prisonerSummary = aValidPrisonerSummary()

  const req = {
    session: {},
    journeyData: {},
    body: {},
    params: { prisonNumber, journeyId },
    originalUrl: `/prisoners/${prisonNumber}/create-induction/${journeyId}/work-interest-roles`,
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
    req.journeyData = {}
    res.locals.invalidForm = undefined
  })

  describe('getWorkInterestRolesView', () => {
    it('should get the Work Interest Roles view', async () => {
      // Given
      const inductionDto = aValidInductionDto()
      inductionDto.futureWorkInterests.interests = [
        { workType: WorkInterestTypeValue.RETAIL, workTypeOther: undefined, role: undefined },
        { workType: WorkInterestTypeValue.CONSTRUCTION, workTypeOther: undefined, role: undefined },
        { workType: WorkInterestTypeValue.OTHER, workTypeOther: 'Film, TV and media', role: undefined },
      ]
      req.journeyData.inductionDto = inductionDto

      const expectedWorkInterestRolesForm = {
        workInterestRoles: [
          [WorkInterestTypeValue.RETAIL, undefined],
          [WorkInterestTypeValue.CONSTRUCTION, undefined],
          [WorkInterestTypeValue.OTHER, undefined],
        ],
        workInterestTypesOther: 'Film, TV and media',
      }

      const expectedView = {
        prisonerSummary,
        form: expectedWorkInterestRolesForm,
      }

      // When
      await controller.getWorkInterestRolesView(req, res, next)

      // Then
      expect(res.render).toHaveBeenCalledWith('pages/induction/workInterests/workInterestRoles', expectedView)
      expect(req.journeyData.inductionDto).toEqual(inductionDto)
    })
  })

  describe('submitWorkInterestRolesForm', () => {
    it('should update InductionDto and redirect to Affect Ability To Work', async () => {
      // Given
      const inductionDto = aValidInductionDto()
      inductionDto.futureWorkInterests.interests = [
        { workType: WorkInterestTypeValue.RETAIL, workTypeOther: undefined, role: undefined },
        { workType: WorkInterestTypeValue.CONSTRUCTION, workTypeOther: undefined, role: undefined },
        { workType: WorkInterestTypeValue.OTHER, workTypeOther: 'Film, TV and media', role: undefined },
      ]
      req.journeyData.inductionDto = inductionDto

      req.body = {
        workInterestRoles: {
          RETAIL: undefined as string,
          CONSTRUCTION: 'General labourer',
          OTHER: 'Being a stunt double for Tom Cruise, even though he does all his own stunts',
        },
      }

      const expectedNextPage = `/prisoners/A1234BC/create-induction/${journeyId}/affect-ability-to-work`

      const expectedUpdatedWorkInterests: Array<FutureWorkInterestDto> = [
        {
          workType: WorkInterestTypeValue.RETAIL,
          workTypeOther: undefined,
          role: undefined,
        },
        {
          workType: WorkInterestTypeValue.CONSTRUCTION,
          workTypeOther: undefined,
          role: 'General labourer',
        },
        {
          workType: WorkInterestTypeValue.OTHER,
          workTypeOther: 'Film, TV and media',
          role: 'Being a stunt double for Tom Cruise, even though he does all his own stunts',
        },
      ]

      // When
      await controller.submitWorkInterestRolesForm(req, res, next)

      // Then
      const futureWorkInterestsOnInduction: Array<FutureWorkInterestDto> =
        req.journeyData.inductionDto.futureWorkInterests.interests
      expect(futureWorkInterestsOnInduction).toEqual(expectedUpdatedWorkInterests)
      expect(res.redirect).toHaveBeenCalledWith(expectedNextPage)
    })

    it('should update inductionDto and redirect to Check Your Answers given previous page was Check Your Answers', async () => {
      // Given
      const inductionDto = aValidInductionDto()
      inductionDto.futureWorkInterests.interests = [
        { workType: WorkInterestTypeValue.RETAIL, workTypeOther: undefined, role: undefined },
        { workType: WorkInterestTypeValue.CONSTRUCTION, workTypeOther: undefined, role: undefined },
        { workType: WorkInterestTypeValue.OTHER, workTypeOther: 'Film, TV and media', role: undefined },
      ]
      req.journeyData.inductionDto = inductionDto

      req.body = {
        workInterestRoles: {
          RETAIL: undefined as string,
          CONSTRUCTION: 'General labourer',
          OTHER: 'Being a stunt double for Tom Cruise, even though he does all his own stunts',
        },
      }

      const expectedUpdatedWorkInterests: Array<FutureWorkInterestDto> = [
        {
          workType: WorkInterestTypeValue.RETAIL,
          workTypeOther: undefined,
          role: undefined,
        },
        {
          workType: WorkInterestTypeValue.CONSTRUCTION,
          workTypeOther: undefined,
          role: 'General labourer',
        },
        {
          workType: WorkInterestTypeValue.OTHER,
          workTypeOther: 'Film, TV and media',
          role: 'Being a stunt double for Tom Cruise, even though he does all his own stunts',
        },
      ]

      req.session.pageFlowHistory = {
        pageUrls: [
          '/prisoners/A1234BC/create-induction/check-your-answers',
          '/prisoners/A1234BC/create-induction/work-interest-roles',
        ],
        currentPageIndex: 1,
      }

      // When
      await controller.submitWorkInterestRolesForm(req, res, next)

      // Then
      const futureWorkInterestsOnInduction: Array<FutureWorkInterestDto> =
        req.journeyData.inductionDto.futureWorkInterests.interests
      expect(futureWorkInterestsOnInduction).toEqual(expectedUpdatedWorkInterests)
      expect(res.redirect).toHaveBeenCalledWith(`/prisoners/A1234BC/create-induction/${journeyId}/check-your-answers`)
    })
  })
})
