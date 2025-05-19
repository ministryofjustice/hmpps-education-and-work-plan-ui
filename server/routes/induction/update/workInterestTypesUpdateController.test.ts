import createError from 'http-errors'
import { Request, Response } from 'express'
import { v4 as uuidV4 } from 'uuid'
import type { FutureWorkInterestDto, FutureWorkInterestsDto } from 'inductionDto'
import aValidPrisonerSummary from '../../../testsupport/prisonerSummaryTestDataBuilder'
import { aValidInductionDto } from '../../../testsupport/inductionDtoTestDataBuilder'
import toCreateOrUpdateInductionDto from '../../../data/mappers/createOrUpdateInductionDtoMapper'
import InductionService from '../../../services/inductionService'
import aValidUpdateInductionRequest from '../../../testsupport/updateInductionRequestTestDataBuilder'
import WorkInterestTypesUpdateController from './workInterestTypesUpdateController'
import WorkInterestTypeValue from '../../../enums/workInterestTypeValue'
import HopingToGetWorkValue from '../../../enums/hopingToGetWorkValue'

jest.mock('../../../data/mappers/createOrUpdateInductionDtoMapper')
jest.mock('../../../services/inductionService')

describe('workInterestTypesUpdateController', () => {
  const mockedCreateOrUpdateInductionDtoMapper = toCreateOrUpdateInductionDto as jest.MockedFunction<
    typeof toCreateOrUpdateInductionDto
  >

  const inductionService = new InductionService(null, null) as jest.Mocked<InductionService>
  const controller = new WorkInterestTypesUpdateController(inductionService)

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
    path: `/prisoners/${prisonNumber}/induction/${journeyId}/work-interest-types`,
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

  describe('getWorkInterestTypesView', () => {
    it('should get the Work Interest Types view given there is no WorkInterestTypesForm on the session', async () => {
      // Given
      const inductionDto = aValidInductionDto()
      req.journeyData.inductionDto = inductionDto
      req.session.workInterestTypesForm = undefined

      const expectedWorkInterestTypesForm = {
        workInterestTypes: [
          WorkInterestTypeValue.RETAIL,
          WorkInterestTypeValue.CONSTRUCTION,
          WorkInterestTypeValue.OTHER,
        ],
        workInterestTypesOther: 'Film, TV and media',
      }

      const expectedView = {
        prisonerSummary,
        form: expectedWorkInterestTypesForm,
      }

      // When
      await controller.getWorkInterestTypesView(req, res, next)

      // Then
      expect(res.render).toHaveBeenCalledWith('pages/induction/workInterests/workInterestTypes', expectedView)
      expect(req.session.workInterestTypesForm).toBeUndefined()
      expect(req.journeyData.inductionDto).toEqual(inductionDto)
    })

    it('should get the Work Interest Types view given there is an WorkInterestTypesForm already on the session', async () => {
      // Given
      const inductionDto = aValidInductionDto()
      req.journeyData.inductionDto = inductionDto

      const expectedWorkInterestTypesForm = {
        workInterestTypes: [
          WorkInterestTypeValue.RETAIL,
          WorkInterestTypeValue.CONSTRUCTION,
          WorkInterestTypeValue.OTHER,
        ],
        workInterestTypesOther: 'Film, TV and media',
      }
      req.session.workInterestTypesForm = expectedWorkInterestTypesForm

      const expectedView = {
        prisonerSummary,
        form: expectedWorkInterestTypesForm,
      }

      // When
      await controller.getWorkInterestTypesView(req, res, next)

      // Then
      expect(res.render).toHaveBeenCalledWith('pages/induction/workInterests/workInterestTypes', expectedView)
      expect(req.session.workInterestTypesForm).toBeUndefined()
      expect(req.journeyData.inductionDto).toEqual(inductionDto)
    })
  })

  describe('submitWorkInterestTypesForm', () => {
    it('should not update Induction given form is submitted with validation errors', async () => {
      // Given
      const inductionDto = aValidInductionDto()
      req.journeyData.inductionDto = inductionDto

      const invalidWorkInterestTypesForm = {
        workInterestTypes: [WorkInterestTypeValue.OTHER],
        workInterestTypesOther: '',
      }
      req.body = invalidWorkInterestTypesForm
      req.session.workInterestTypesForm = undefined

      const expectedErrors = [
        {
          href: '#workInterestTypesOther',
          text: 'Enter the type of work Ifereeca Peigh is interested in',
        },
      ]

      // When
      await controller.submitWorkInterestTypesForm(req, res, next)

      // Then
      expect(res.redirectWithErrors).toHaveBeenCalledWith(
        `/prisoners/A1234BC/induction/${journeyId}/work-interest-types`,
        expectedErrors,
      )
      expect(req.session.workInterestTypesForm).toEqual(invalidWorkInterestTypesForm)
      expect(req.journeyData.inductionDto).toEqual(inductionDto)
    })

    it('should update Induction and call API and redirect to work and interests page', async () => {
      // Given
      const inductionDto = aValidInductionDto()
      req.journeyData.inductionDto = inductionDto

      const workInterestTypesForm = {
        workInterestTypes: [WorkInterestTypeValue.CONSTRUCTION, WorkInterestTypeValue.OTHER],
        workInterestTypesOther: 'Social Media Influencer',
      }
      req.body = workInterestTypesForm
      req.session.workInterestTypesForm = undefined
      const updateInductionDto = aValidUpdateInductionRequest()

      mockedCreateOrUpdateInductionDtoMapper.mockReturnValueOnce(updateInductionDto)

      const expectedUpdatedWorkInterests: Array<FutureWorkInterestDto> = [
        {
          workType: 'CONSTRUCTION',
          workTypeOther: undefined,
          role: 'General labourer',
        },
        {
          workType: 'OTHER',
          workTypeOther: 'Social Media Influencer',
          // note that role will not have been updated, despite workTypeOther being changed
          role: 'Being a stunt double for Tom Cruise, even though he does all his own stunts',
        },
      ]

      // When
      await controller.submitWorkInterestTypesForm(req, res, next)

      // Then
      // Extract the first call to the mock and the second argument (i.e. the updated Induction)
      const updatedInduction = mockedCreateOrUpdateInductionDtoMapper.mock.calls[0][1]
      expect(mockedCreateOrUpdateInductionDtoMapper).toHaveBeenCalledWith(prisonerSummary.prisonId, updatedInduction)
      expect(updatedInduction.futureWorkInterests.interests).toEqual(expectedUpdatedWorkInterests)

      expect(inductionService.updateInduction).toHaveBeenCalledWith(prisonNumber, updateInductionDto, username)
      expect(res.redirect).toHaveBeenCalledWith(`/plan/${prisonNumber}/view/work-and-interests`)
      expect(req.session.workInterestTypesForm).toBeUndefined()
      expect(req.journeyData.inductionDto).toBeUndefined()
    })

    it('should not update Induction given error calling service', async () => {
      // Given
      const inductionDto = aValidInductionDto()
      req.journeyData.inductionDto = inductionDto

      const workInterestTypesForm = {
        workInterestTypes: [WorkInterestTypeValue.CONSTRUCTION, WorkInterestTypeValue.OTHER],
        workInterestTypesOther: 'Social Media Influencer',
      }
      req.body = workInterestTypesForm
      req.session.workInterestTypesForm = undefined
      const updateInductionDto = aValidUpdateInductionRequest()

      mockedCreateOrUpdateInductionDtoMapper.mockReturnValueOnce(updateInductionDto)

      const expectedUpdatedWorkInterests: Array<FutureWorkInterestDto> = [
        {
          workType: 'CONSTRUCTION',
          workTypeOther: undefined,
          role: 'General labourer',
        },
        {
          workType: 'OTHER',
          workTypeOther: 'Social Media Influencer',
          // note that role will not have been updated, despite workTypeOther being changed
          role: 'Being a stunt double for Tom Cruise, even though he does all his own stunts',
        },
      ]

      inductionService.updateInduction.mockRejectedValue(createError(500, 'Service unavailable'))
      const expectedError = createError(
        500,
        `Error updating Induction for prisoner ${prisonNumber}. Error: InternalServerError: Service unavailable`,
      )

      // When
      await controller.submitWorkInterestTypesForm(req, res, next)

      // Then
      // Extract the first call to the mock and the second argument (i.e. the updated Induction)
      const updatedInduction = mockedCreateOrUpdateInductionDtoMapper.mock.calls[0][1]
      expect(mockedCreateOrUpdateInductionDtoMapper).toHaveBeenCalledWith(prisonerSummary.prisonId, updatedInduction)
      expect(updatedInduction.futureWorkInterests.interests).toEqual(expectedUpdatedWorkInterests)

      expect(inductionService.updateInduction).toHaveBeenCalledWith(prisonNumber, updateInductionDto, username)
      expect(next).toHaveBeenCalledWith(expectedError)
      expect(req.session.workInterestTypesForm).toEqual(workInterestTypesForm)
      expect(req.journeyData.inductionDto).toEqual(inductionDto)
    })

    it('should redirect to Work Interest Roles and not call the API to update Induction given form is submitted with hoping to work as yes but no future work interests defined yet', async () => {
      // Given
      const inductionDto = aValidInductionDto({ hopingToGetWork: HopingToGetWorkValue.YES })
      inductionDto.futureWorkInterests = {} as FutureWorkInterestsDto
      req.journeyData.inductionDto = inductionDto

      const workInterestTypesForm = {
        workInterestTypes: [WorkInterestTypeValue.CONSTRUCTION],
      }
      req.body = workInterestTypesForm
      req.session.workInterestTypesForm = undefined

      const expectedFutureWorkInterests = {
        interests: [{ role: undefined, workType: WorkInterestTypeValue.CONSTRUCTION, workTypeOther: undefined }],
      } as FutureWorkInterestsDto

      // When
      await controller.submitWorkInterestTypesForm(req, res, next)

      // Then
      expect(res.redirect).toHaveBeenCalledWith(`/prisoners/A1234BC/induction/${journeyId}/work-interest-roles`)
      expect(req.session.workInterestTypesForm).toEqual(workInterestTypesForm)
      const updatedInduction = req.journeyData.inductionDto
      expect(updatedInduction.futureWorkInterests).toEqual(expectedFutureWorkInterests)
    })
  })
})
