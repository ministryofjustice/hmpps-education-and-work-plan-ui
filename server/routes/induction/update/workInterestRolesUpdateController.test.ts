import createError from 'http-errors'
import type { SessionData } from 'express-session'
import type { FutureWorkInterestDto } from 'inductionDto'
import { NextFunction, Request, Response } from 'express'
import type { PageFlow } from 'viewModels'
import aValidPrisonerSummary from '../../../testsupport/prisonerSummaryTestDataBuilder'
import { aLongQuestionSetInductionDto } from '../../../testsupport/inductionDtoTestDataBuilder'
import toCreateOrUpdateInductionDto from '../../../data/mappers/createOrUpdateInductionDtoMapper'
import InductionService from '../../../services/inductionService'
import { aLongQuestionSetUpdateInductionRequest } from '../../../testsupport/updateInductionRequestTestDataBuilder'
import WorkInterestRolesUpdateController from './workInterestRolesUpdateController'
import WorkInterestTypeValue from '../../../enums/workInterestTypeValue'

jest.mock('../../../data/mappers/createOrUpdateInductionDtoMapper')
jest.mock('../../../services/inductionService')

describe('workInterestRolesUpdateController', () => {
  const mockedCreateOrUpdateInductionDtoMapper = toCreateOrUpdateInductionDto as jest.MockedFunction<
    typeof toCreateOrUpdateInductionDto
  >

  const inductionService = new InductionService(null) as jest.Mocked<InductionService>
  const controller = new WorkInterestRolesUpdateController(inductionService)

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
    render: jest.fn(),
  }
  const next = jest.fn()

  beforeEach(() => {
    jest.resetAllMocks()
    req.session = { prisonerSummary } as SessionData
    req.body = {}
    req.user = { token: 'some-token' } as Express.User
    req.params = { prisonNumber }
    req.path = `/prisoners/${prisonNumber}/induction/work-interest-roles`
  })

  describe('getWorkInterestRolesView', () => {
    it('should get the Work Interest Roles view', async () => {
      // Given
      const inductionDto = aLongQuestionSetInductionDto()
      req.session.inductionDto = inductionDto

      const expectedWorkInterestRolesForm = {
        workInterestRoles: new Map<WorkInterestTypeValue, string>([
          [WorkInterestTypeValue.RETAIL, null],
          [WorkInterestTypeValue.CONSTRUCTION, 'General labourer'],
          [WorkInterestTypeValue.OTHER, 'Being a stunt double for Tom Cruise, even though he does all his own stunts'],
        ]),
        workInterestTypesOther: 'Film, TV and media',
      }

      const expectedView = {
        prisonerSummary,
        form: expectedWorkInterestRolesForm,
        backLinkUrl: '/plan/A1234BC/view/work-and-interests',
        backLinkAriaText: `Back to Jimmy Lightfingers's learning and work progress`,
      }

      // When
      await controller.getWorkInterestRolesView(
        req as undefined as Request,
        res as undefined as Response,
        next as undefined as NextFunction,
      )

      // Then
      expect(res.render).toHaveBeenCalledWith('pages/induction/workInterests/workInterestRoles', expectedView)
      expect(req.session.inductionDto).toEqual(inductionDto)
    })

    it('should get the Work Interest Roles view given there is an updateInductionQuestionSet on the session', async () => {
      // Given
      const inductionDto = aLongQuestionSetInductionDto()
      req.session.inductionDto = inductionDto
      req.session.updateInductionQuestionSet = {
        hopingToWorkOnRelease: 'YES',
      }
      req.session.pageFlowHistory = {
        pageUrls: [`/prisoners/${prisonNumber}/induction/work-interest-types`],
        currentPageIndex: 0,
      }

      const expectedWorkInterestRolesForm = {
        workInterestRoles: new Map<WorkInterestTypeValue, string>([
          [WorkInterestTypeValue.RETAIL, null],
          [WorkInterestTypeValue.CONSTRUCTION, 'General labourer'],
          [WorkInterestTypeValue.OTHER, 'Being a stunt double for Tom Cruise, even though he does all his own stunts'],
        ]),
        workInterestTypesOther: 'Film, TV and media',
      }

      const expectedView = {
        prisonerSummary,
        form: expectedWorkInterestRolesForm,
        backLinkUrl: '/prisoners/A1234BC/induction/work-interest-types',
        backLinkAriaText: 'Back to What type of work is Jimmy Lightfingers interested in?',
      }

      const expectedPageFlowHistory = {
        pageUrls: [
          '/prisoners/A1234BC/induction/work-interest-types',
          '/prisoners/A1234BC/induction/work-interest-roles',
        ],
        currentPageIndex: 1,
      }

      // When
      await controller.getWorkInterestRolesView(
        req as undefined as Request,
        res as undefined as Response,
        next as undefined as NextFunction,
      )

      // Then
      expect(res.render).toHaveBeenCalledWith('pages/induction/workInterests/workInterestRoles', expectedView)
      expect(req.session.inductionDto).toEqual(inductionDto)
      expect(req.session.pageFlowHistory).toEqual(expectedPageFlowHistory)
    })
  })

  describe('submitWorkInterestRolesForm', () => {
    it('should update Induction and call API and redirect to work and interests page', async () => {
      // Given
      const inductionDto = aLongQuestionSetInductionDto()
      req.session.inductionDto = inductionDto

      req.body = {
        workInterestRoles: {
          RETAIL: null as string,
          CONSTRUCTION: 'General labourer',
          OTHER: 'Being a stunt double for Tom Cruise, even though he does all his own stunts',
        },
      }
      const updateInductionDto = aLongQuestionSetUpdateInductionRequest()

      mockedCreateOrUpdateInductionDtoMapper.mockReturnValueOnce(updateInductionDto)
      const expectedUpdatedWorkInterests: Array<FutureWorkInterestDto> = [
        {
          workType: WorkInterestTypeValue.RETAIL,
          workTypeOther: null,
          role: null,
        },
        {
          workType: WorkInterestTypeValue.CONSTRUCTION,
          workTypeOther: null,
          role: 'General labourer',
        },
        {
          workType: WorkInterestTypeValue.OTHER,
          workTypeOther: 'Film, TV and media',
          role: 'Being a stunt double for Tom Cruise, even though he does all his own stunts',
        },
      ]

      // When
      await controller.submitWorkInterestRolesForm(
        req as undefined as Request,
        res as undefined as Response,
        next as undefined as NextFunction,
      )

      // Then
      // Extract the first call to the mock and the second argument (i.e. the updated Induction)
      const updatedInduction = mockedCreateOrUpdateInductionDtoMapper.mock.calls[0][1]
      expect(mockedCreateOrUpdateInductionDtoMapper).toHaveBeenCalledWith(prisonerSummary.prisonId, updatedInduction)
      expect(updatedInduction.futureWorkInterests.interests).toEqual(expectedUpdatedWorkInterests)

      expect(inductionService.updateInduction).toHaveBeenCalledWith(prisonNumber, updateInductionDto, 'some-token')
      expect(res.redirect).toHaveBeenCalledWith(`/plan/${prisonNumber}/view/work-and-interests`)
      expect(req.session.inductionDto).toBeUndefined()
    })

    it('should update InductionDto and redirect to Affect Ability To Work given prisoner wants to work on release', async () => {
      // Given
      const inductionDto = aLongQuestionSetInductionDto()
      req.session.inductionDto = inductionDto
      req.session.updateInductionQuestionSet = { hopingToWorkOnRelease: 'YES' }

      req.body = {
        workInterestRoles: {
          RETAIL: null as string,
          CONSTRUCTION: 'General labourer',
          OTHER: 'Being a stunt double for Tom Cruise, even though he does all his own stunts',
        },
      }

      const expectedNextPage = '/prisoners/A1234BC/induction/affect-ability-to-work'

      const expectedUpdatedWorkInterests: Array<FutureWorkInterestDto> = [
        {
          workType: WorkInterestTypeValue.RETAIL,
          workTypeOther: null,
          role: null,
        },
        {
          workType: WorkInterestTypeValue.CONSTRUCTION,
          workTypeOther: null,
          role: 'General labourer',
        },
        {
          workType: WorkInterestTypeValue.OTHER,
          workTypeOther: 'Film, TV and media',
          role: 'Being a stunt double for Tom Cruise, even though he does all his own stunts',
        },
      ]

      const expectedPageFlowHistory: PageFlow = {
        pageUrls: ['/prisoners/A1234BC/induction/work-interest-roles'],
        currentPageIndex: 0,
      }

      // When
      await controller.submitWorkInterestRolesForm(
        req as undefined as Request,
        res as undefined as Response,
        next as undefined as NextFunction,
      )

      // Then
      const futureWorkInterestsOnInduction: Array<FutureWorkInterestDto> =
        req.session.inductionDto.futureWorkInterests.interests
      expect(futureWorkInterestsOnInduction).toEqual(expectedUpdatedWorkInterests)
      expect(res.redirect).toHaveBeenCalledWith(expectedNextPage)
      expect(inductionService.updateInduction).not.toHaveBeenCalled()
      expect(req.session.pageFlowHistory).toEqual(expectedPageFlowHistory)
    })

    it('should not update Induction given error calling service', async () => {
      // Given
      const inductionDto = aLongQuestionSetInductionDto()
      req.session.inductionDto = inductionDto

      req.body = {
        workInterestRoles: {
          RETAIL: null as string,
          CONSTRUCTION: 'General labourer',
          OTHER: 'Being a stunt double for Tom Cruise, even though he does all his own stunts',
        },
      }
      const updateInductionDto = aLongQuestionSetUpdateInductionRequest()

      mockedCreateOrUpdateInductionDtoMapper.mockReturnValueOnce(updateInductionDto)
      const expectedUpdatedWorkInterests: Array<FutureWorkInterestDto> = [
        {
          workType: WorkInterestTypeValue.RETAIL,
          workTypeOther: null,
          role: null,
        },
        {
          workType: WorkInterestTypeValue.CONSTRUCTION,
          workTypeOther: null,
          role: 'General labourer',
        },
        {
          workType: WorkInterestTypeValue.OTHER,
          workTypeOther: 'Film, TV and media',
          role: 'Being a stunt double for Tom Cruise, even though he does all his own stunts',
        },
      ]

      inductionService.updateInduction.mockRejectedValue(createError(500, 'Service unavailable'))
      const expectedError = createError(
        500,
        `Error updating Induction for prisoner ${prisonNumber}. Error: InternalServerError: Service unavailable`,
      )

      // When
      await controller.submitWorkInterestRolesForm(
        req as undefined as Request,
        res as undefined as Response,
        next as undefined as NextFunction,
      )

      // Then
      // Extract the first call to the mock and the second argument (i.e. the updated Induction)
      const updatedInduction = mockedCreateOrUpdateInductionDtoMapper.mock.calls[0][1]
      expect(mockedCreateOrUpdateInductionDtoMapper).toHaveBeenCalledWith(prisonerSummary.prisonId, updatedInduction)
      expect(updatedInduction.futureWorkInterests.interests).toEqual(expectedUpdatedWorkInterests)

      expect(inductionService.updateInduction).toHaveBeenCalledWith(prisonNumber, updateInductionDto, 'some-token')
      expect(next).toHaveBeenCalledWith(expectedError)
      expect(req.session.inductionDto).toEqual(inductionDto)
    })

    it('should update induction DTO and redirect back to check your answers page when coming from check your answers', async () => {
      // Given
      req.session.inductionDto = aLongQuestionSetInductionDto()
      req.session.inductionDto.futureWorkInterests.interests = [
        { workType: WorkInterestTypeValue.DRIVING },
        { workType: WorkInterestTypeValue.HOSPITALITY },
      ]
      req.session.pageFlowHistory = {
        pageUrls: [
          `/prisoners/${prisonerSummary.prisonNumber}/induction/check-your-answers`,
          `/prisoners/${prisonerSummary.prisonNumber}/induction/work-interest-roles`,
        ],
        currentPageIndex: 1,
      }

      req.body = {
        workInterestRoles: {
          [WorkInterestTypeValue.DRIVING]: 'Taxi driver',
          [WorkInterestTypeValue.HOSPITALITY]: 'Cleaner',
        },
      }

      // The actual implementation is fine for this test
      const actualToCreateOrUpdateInductionDto = jest.requireActual(
        '../../../data/mappers/createOrUpdateInductionDtoMapper',
      ).default
      mockedCreateOrUpdateInductionDtoMapper.mockImplementation(actualToCreateOrUpdateInductionDto)

      // When
      await controller.submitWorkInterestRolesForm(
        req as undefined as Request,
        res as undefined as Response,
        next as undefined as NextFunction,
      )

      // Then
      expect(req.session.inductionDto.futureWorkInterests.interests).toEqual([
        { workType: WorkInterestTypeValue.DRIVING, role: 'Taxi driver' },
        { workType: WorkInterestTypeValue.HOSPITALITY, role: 'Cleaner' },
      ])
      expect(res.redirect).toHaveBeenCalledWith(
        `/prisoners/${prisonerSummary.prisonNumber}/induction/check-your-answers`,
      )
    })
  })
})
