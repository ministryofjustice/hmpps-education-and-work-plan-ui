import createError from 'http-errors'
import { Request, Response } from 'express'
import { v4 as uuidV4 } from 'uuid'
import type { FutureWorkInterestDto } from 'inductionDto'
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

  const journeyId = uuidV4()
  const prisonNumber = 'A1234BC'
  const username = 'a-dps-user'
  const prisonerSummary = aValidPrisonerSummary()

  const req = {
    session: {},
    journeyData: {},
    body: {},
    user: { username },
    params: { prisonNumber, journeyId },
    path: `/prisoners/${prisonNumber}/induction/${journeyId}/work-interest-roles`,
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
  })

  describe('getWorkInterestRolesView', () => {
    it('should get the Work Interest Roles view', async () => {
      // Given
      const inductionDto = aValidInductionDto()
      req.journeyData.inductionDto = inductionDto

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
      }

      // When
      await controller.getWorkInterestRolesView(req, res, next)

      // Then
      expect(res.render).toHaveBeenCalledWith('pages/induction/workInterests/workInterestRoles', expectedView)
      expect(req.journeyData.inductionDto).toEqual(inductionDto)
    })
  })

  describe('submitWorkInterestRolesForm', () => {
    it('should not update Induction given form is submitted with validation errors', async () => {
      // Given
      const inductionDto = aValidInductionDto()
      inductionDto.futureWorkInterests.interests = [
        { workType: WorkInterestTypeValue.RETAIL, workTypeOther: undefined, role: undefined },
      ]
      req.journeyData.inductionDto = inductionDto

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
        `/prisoners/A1234BC/induction/${journeyId}/work-interest-roles`,
        expectedErrors,
      )
      expect(req.session.workInterestRolesForm).toEqual(expectedWorkInterestRolesForm)
      expect(req.journeyData.inductionDto).toEqual(inductionDto)
    })

    it('should update Induction and call API and redirect to work and interests page', async () => {
      // Given
      const inductionDto = aValidInductionDto()
      req.journeyData.inductionDto = inductionDto

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
      await controller.submitWorkInterestRolesForm(req, res, next)

      // Then
      // Extract the first call to the mock and the second argument (i.e. the updated Induction)
      const updatedInduction = mockedCreateOrUpdateInductionDtoMapper.mock.calls[0][1]
      expect(mockedCreateOrUpdateInductionDtoMapper).toHaveBeenCalledWith(prisonerSummary.prisonId, updatedInduction)
      expect(updatedInduction.futureWorkInterests.interests).toEqual(expectedUpdatedWorkInterests)

      expect(inductionService.updateInduction).toHaveBeenCalledWith(prisonNumber, updateInductionDto, username)
      expect(res.redirect).toHaveBeenCalledWith(`/plan/${prisonNumber}/view/work-and-interests`)
      expect(req.journeyData.inductionDto).toBeUndefined()
    })

    it('should not update Induction given error calling service', async () => {
      // Given
      const inductionDto = aValidInductionDto()
      req.journeyData.inductionDto = inductionDto

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
      await controller.submitWorkInterestRolesForm(req, res, next)

      // Then
      // Extract the first call to the mock and the second argument (i.e. the updated Induction)
      const updatedInduction = mockedCreateOrUpdateInductionDtoMapper.mock.calls[0][1]
      expect(mockedCreateOrUpdateInductionDtoMapper).toHaveBeenCalledWith(prisonerSummary.prisonId, updatedInduction)
      expect(updatedInduction.futureWorkInterests.interests).toEqual(expectedUpdatedWorkInterests)

      expect(inductionService.updateInduction).toHaveBeenCalledWith(prisonNumber, updateInductionDto, username)
      expect(next).toHaveBeenCalledWith(expectedError)
      expect(req.journeyData.inductionDto).toBeDefined()
    })
  })
})
