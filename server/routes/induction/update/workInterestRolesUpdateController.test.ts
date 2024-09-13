import createError from 'http-errors'
import type { SessionData } from 'express-session'
import type { FutureWorkInterestDto } from 'inductionDto'
import { NextFunction, Request, Response } from 'express'
import aValidPrisonerSummary from '../../../testsupport/prisonerSummaryTestDataBuilder'
import { aValidInductionDto } from '../../../testsupport/inductionDtoTestDataBuilder'
import toCreateOrUpdateInductionDto from '../../../data/mappers/createOrUpdateInductionDtoMapper'
import InductionService from '../../../services/inductionService'
import aValidUpdateInductionRequest from '../../../testsupport/updateInductionRequestTestDataBuilder'
import WorkInterestRolesUpdateController from './workInterestRolesUpdateController'
import WorkInterestTypeValue from '../../../enums/workInterestTypeValue'

jest.mock('../../../data/mappers/createOrUpdateInductionDtoMapper')
jest.mock('../../../services/inductionService')

describe('workInterestRolesUpdateController', () => {
  const mockedCreateOrUpdateInductionDtoMapper = toCreateOrUpdateInductionDto as jest.MockedFunction<
    typeof toCreateOrUpdateInductionDto
  >

  const inductionService = new InductionService(null, null) as jest.Mocked<InductionService>
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
    req.path = `/prisoners/${prisonNumber}/induction/work-interest-roles`
  })

  describe('getWorkInterestRolesView', () => {
    it('should get the Work Interest Roles view', async () => {
      // Given
      const inductionDto = aValidInductionDto()
      req.session.inductionDto = inductionDto

      const expectedWorkInterestRolesForm = {
        workInterestRoles: [
          [WorkInterestTypeValue.RETAIL, null],
          [WorkInterestTypeValue.CONSTRUCTION, 'General labourer'],
          [WorkInterestTypeValue.OTHER, 'Being a stunt double for Tom Cruise, even though he does all his own stunts'],
        ],
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
      await controller.submitWorkInterestRolesForm(
        req as undefined as Request,
        res as undefined as Response,
        next as undefined as NextFunction,
      )

      // Then
      expect(res.redirectWithErrors).toHaveBeenCalledWith(
        '/prisoners/A1234BC/induction/work-interest-roles',
        expectedErrors,
      )
      expect(req.session.workInterestRolesForm).toEqual(expectedWorkInterestRolesForm)
      expect(req.session.inductionDto).toEqual(inductionDto)
    })

    it('should update Induction and call API and redirect to work and interests page', async () => {
      // Given
      const inductionDto = aValidInductionDto()
      req.session.inductionDto = inductionDto

      req.body = {
        workInterestRoles: {
          RETAIL: null as string,
          CONSTRUCTION: 'General labourer',
          OTHER: 'Being a stunt double for Tom Cruise, even though he does all his own stunts',
        },
      }
      const updateInductionDto = aValidUpdateInductionRequest()

      mockedCreateOrUpdateInductionDtoMapper.mockReturnValueOnce(updateInductionDto)
      const expectedUpdatedWorkInterests: Array<FutureWorkInterestDto> = [
        {
          workType: WorkInterestTypeValue.RETAIL,
          workTypeOther: undefined,
          role: null,
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

    it('should not update Induction given error calling service', async () => {
      // Given
      const inductionDto = aValidInductionDto()
      req.session.inductionDto = inductionDto

      req.body = {
        workInterestRoles: {
          RETAIL: null as string,
          CONSTRUCTION: 'General labourer',
          OTHER: 'Being a stunt double for Tom Cruise, even though he does all his own stunts',
        },
      }
      const updateInductionDto = aValidUpdateInductionRequest()

      mockedCreateOrUpdateInductionDtoMapper.mockReturnValueOnce(updateInductionDto)
      const expectedUpdatedWorkInterests: Array<FutureWorkInterestDto> = [
        {
          workType: WorkInterestTypeValue.RETAIL,
          workTypeOther: undefined,
          role: null,
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
      expect(req.session.inductionDto).toBeDefined()
    })
  })
})
