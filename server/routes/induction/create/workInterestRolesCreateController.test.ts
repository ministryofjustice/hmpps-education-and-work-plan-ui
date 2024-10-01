import { Request, Response } from 'express'
import type { FutureWorkInterestDto } from 'inductionDto'
import aValidPrisonerSummary from '../../../testsupport/prisonerSummaryTestDataBuilder'
import { aValidInductionDto } from '../../../testsupport/inductionDtoTestDataBuilder'
import WorkInterestTypeValue from '../../../enums/workInterestTypeValue'
import WorkInterestRolesCreateController from './workInterestRolesCreateController'

describe('workInterestRolesCreateController', () => {
  const controller = new WorkInterestRolesCreateController()

  const prisonNumber = 'A1234BC'
  const prisonerSummary = aValidPrisonerSummary()

  const req = {
    session: {},
    body: {},
    params: { prisonNumber },
    path: `/prisoners/${prisonNumber}/create-induction/work-interest-roles`,
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

  describe('getWorkInterestRolesView', () => {
    it('should get the Work Interest Roles view', async () => {
      // Given
      const inductionDto = aValidInductionDto()
      inductionDto.futureWorkInterests.interests = [
        { workType: WorkInterestTypeValue.RETAIL, workTypeOther: undefined, role: undefined },
        { workType: WorkInterestTypeValue.CONSTRUCTION, workTypeOther: undefined, role: undefined },
        { workType: WorkInterestTypeValue.OTHER, workTypeOther: 'Film, TV and media', role: undefined },
      ]
      req.session.inductionDto = inductionDto

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
        backLinkUrl: '/prisoners/A1234BC/create-induction/work-interest-types',
        backLinkAriaText: 'Back to What type of work is Jimmy Lightfingers interested in?',
      }

      // When
      await controller.getWorkInterestRolesView(req, res, next)

      // Then
      expect(res.render).toHaveBeenCalledWith('pages/induction/workInterests/workInterestRoles', expectedView)
      expect(req.session.inductionDto).toEqual(inductionDto)
    })

    it('should get the Work Interest Types view given the previous page was Check Your Answers', async () => {
      // Given
      const inductionDto = aValidInductionDto()
      inductionDto.futureWorkInterests.interests = [
        { workType: WorkInterestTypeValue.RETAIL, workTypeOther: undefined, role: undefined },
        { workType: WorkInterestTypeValue.CONSTRUCTION, workTypeOther: undefined, role: undefined },
        { workType: WorkInterestTypeValue.OTHER, workTypeOther: 'Film, TV and media', role: undefined },
      ]
      req.session.inductionDto = inductionDto

      req.session.pageFlowHistory = {
        pageUrls: ['/prisoners/A1234BC/create-induction/check-your-answers'],
        currentPageIndex: 0,
      }

      const expectedPageFlowHistory = {
        pageUrls: [
          '/prisoners/A1234BC/create-induction/check-your-answers',
          '/prisoners/A1234BC/create-induction/work-interest-roles',
        ],
        currentPageIndex: 1,
      }

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
        backLinkUrl: '/prisoners/A1234BC/create-induction/check-your-answers',
        backLinkAriaText: `Back to Check and save your answers before adding Jimmy Lightfingers's goals`,
      }

      // When
      await controller.getWorkInterestRolesView(req, res, next)

      // Then
      expect(res.render).toHaveBeenCalledWith('pages/induction/workInterests/workInterestRoles', expectedView)
      expect(req.session.inductionDto).toEqual(inductionDto)
      expect(req.session.pageFlowHistory).toEqual(expectedPageFlowHistory)
    })
  })

  describe('submitWorkInterestRolesForm', () => {
    it('should not update Induction given form is submitted with validation errors', async () => {
      // Given
      const inductionDto = aValidInductionDto()
      inductionDto.futureWorkInterests.interests = [
        { workType: WorkInterestTypeValue.RETAIL, workTypeOther: undefined, role: undefined },
      ]
      req.session.inductionDto = inductionDto

      const invalidWorkInterestRolesForm = {
        workInterestRoles: {
          RETAIL: 'a'.repeat(513),
          CONSTRUCTION: 'General builders mate',
        },
      }
      req.body = invalidWorkInterestRolesForm

      req.session.workInterestRolesForm = undefined

      const expectedErrors = [{ href: '#RETAIL', text: 'The Retail and sales job role must be 512 characters or less' }]
      const expectedWorkInterestRolesForm = {
        workInterestRoles: [
          [WorkInterestTypeValue.RETAIL, 'a'.repeat(513)],
          [WorkInterestTypeValue.CONSTRUCTION, 'General builders mate'],
        ],
      }

      // When
      await controller.submitWorkInterestRolesForm(req, res, next)

      // Then
      expect(res.redirectWithErrors).toHaveBeenCalledWith(
        '/prisoners/A1234BC/create-induction/work-interest-roles',
        expectedErrors,
      )
      expect(req.session.workInterestRolesForm).toEqual(expectedWorkInterestRolesForm)
      expect(req.session.inductionDto).toEqual(inductionDto)
    })

    it('should update InductionDto and redirect to Affect Ability To Work', async () => {
      // Given
      const inductionDto = aValidInductionDto()
      inductionDto.futureWorkInterests.interests = [
        { workType: WorkInterestTypeValue.RETAIL, workTypeOther: undefined, role: undefined },
        { workType: WorkInterestTypeValue.CONSTRUCTION, workTypeOther: undefined, role: undefined },
        { workType: WorkInterestTypeValue.OTHER, workTypeOther: 'Film, TV and media', role: undefined },
      ]
      req.session.inductionDto = inductionDto

      req.body = {
        workInterestRoles: {
          RETAIL: undefined as string,
          CONSTRUCTION: 'General labourer',
          OTHER: 'Being a stunt double for Tom Cruise, even though he does all his own stunts',
        },
      }

      const expectedNextPage = '/prisoners/A1234BC/create-induction/affect-ability-to-work'

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
        req.session.inductionDto.futureWorkInterests.interests
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
      req.session.inductionDto = inductionDto

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
        req.session.inductionDto.futureWorkInterests.interests
      expect(futureWorkInterestsOnInduction).toEqual(expectedUpdatedWorkInterests)
      expect(res.redirect).toHaveBeenCalledWith('/prisoners/A1234BC/create-induction/check-your-answers')
    })
  })
})
