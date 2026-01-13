import createError from 'http-errors'
import { NextFunction, Request, Response } from 'express'
import { v4 as uuidV4 } from 'uuid'
import InPrisonWorkUpdateController from './inPrisonWorkUpdateController'
import aValidPrisonerSummary from '../../../testsupport/prisonerSummaryTestDataBuilder'
import { aValidInductionDto } from '../../../testsupport/inductionDtoTestDataBuilder'
import toCreateOrUpdateInductionDto from '../../../data/mappers/createOrUpdateInductionDtoMapper'
import InductionService from '../../../services/inductionService'
import aValidUpdateInductionRequest from '../../../testsupport/updateInductionRequestTestDataBuilder'
import InPrisonWorkValue from '../../../enums/inPrisonWorkValue'

jest.mock('../../../data/mappers/createOrUpdateInductionDtoMapper')
jest.mock('../../../services/inductionService')

describe('inPrisonWorkUpdateController', () => {
  const mockedCreateOrUpdateInductionDtoMapper = toCreateOrUpdateInductionDto as jest.MockedFunction<
    typeof toCreateOrUpdateInductionDto
  >

  const inductionService = new InductionService(null) as jest.Mocked<InductionService>
  const controller = new InPrisonWorkUpdateController(inductionService)

  const journeyId = uuidV4()
  const prisonNumber = 'A1234BC'
  const username = 'a-dps-user'
  const prisonerSummary = aValidPrisonerSummary()

  const flash = jest.fn()
  const req = {
    session: {},
    journeyData: {},
    body: {},
    user: { username },
    params: { prisonNumber, journeyId },
    path: `/prisoners/${prisonNumber}/induction/${journeyId}/in-prison-work`,
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
    res.locals.invalidForm = undefined
  })

  describe('getInPrisonWorkView', () => {
    it('should get the In Prison Work view given there is no InPrisonWorkForm on res.locals.invalidForm', async () => {
      // Given
      const inductionDto = aValidInductionDto()
      req.journeyData.inductionDto = inductionDto
      res.locals.invalidForm = undefined

      const expectedInPrisonWorkForm = {
        inPrisonWork: ['CLEANING_AND_HYGIENE', 'OTHER'],
        inPrisonWorkOther: 'Gardening and grounds keeping',
      }

      const expectedView = {
        prisonerSummary,
        form: expectedInPrisonWorkForm,
      }

      // When
      await controller.getInPrisonWorkView(
        req as undefined as Request,
        res as undefined as Response,
        next as undefined as NextFunction,
      )

      // Then
      expect(res.render).toHaveBeenCalledWith('pages/induction/inPrisonWork/index', expectedView)
      expect(req.journeyData.inductionDto).toEqual(inductionDto)
    })

    it('should get the In Prison Work view given there is an InPrisonWorkForm already on res.locals.invalidForm', async () => {
      // Given
      const inductionDto = aValidInductionDto()
      req.journeyData.inductionDto = inductionDto

      const expectedInPrisonWorkForm = {
        inPrisonWork: ['TEXTILES_AND_SEWING', 'WELDING_AND_METALWORK', 'WOODWORK_AND_JOINERY'],
        inPrisonWorkOther: '',
      }
      res.locals.invalidForm = expectedInPrisonWorkForm

      const expectedView = {
        prisonerSummary,
        form: expectedInPrisonWorkForm,
      }

      // When
      await controller.getInPrisonWorkView(
        req as undefined as Request,
        res as undefined as Response,
        next as undefined as NextFunction,
      )

      // Then
      expect(res.render).toHaveBeenCalledWith('pages/induction/inPrisonWork/index', expectedView)
      expect(req.journeyData.inductionDto).toEqual(inductionDto)
    })
  })

  describe('submitInPrisonWorkForm', () => {
    it('should update Induction and call API and redirect to work and interests page', async () => {
      // Given
      const inductionDto = aValidInductionDto()
      req.journeyData.inductionDto = inductionDto

      const inPrisonWorkForm = {
        inPrisonWork: ['COMPUTERS_OR_DESK_BASED', 'OTHER'],
        inPrisonWorkOther: 'Gambling',
      }
      req.body = inPrisonWorkForm
      const updateInductionDto = aValidUpdateInductionRequest()

      mockedCreateOrUpdateInductionDtoMapper.mockReturnValueOnce(updateInductionDto)

      const expectedUpdatedWorkInterests = [
        {
          workType: 'COMPUTERS_OR_DESK_BASED',
          workTypeOther: undefined,
        },
        {
          workType: 'OTHER',
          workTypeOther: 'Gambling',
        },
      ]

      // When
      await controller.submitInPrisonWorkForm(
        req as undefined as Request,
        res as undefined as Response,
        next as undefined as NextFunction,
      )

      // Then
      // Extract the first call to the mock and the second argument (i.e. the updated Induction)
      const updatedInduction = mockedCreateOrUpdateInductionDtoMapper.mock.calls[0][1]
      expect(mockedCreateOrUpdateInductionDtoMapper).toHaveBeenCalledWith(prisonerSummary.prisonId, updatedInduction)
      expect(updatedInduction.inPrisonInterests.inPrisonWorkInterests).toEqual(expectedUpdatedWorkInterests)

      expect(inductionService.updateInduction).toHaveBeenCalledWith(prisonNumber, updateInductionDto, username)
      expect(res.redirect).toHaveBeenCalledWith(`/plan/${prisonNumber}/view/work-and-interests`)
      expect(req.journeyData.inductionDto).toBeUndefined()
      expect(flash).toHaveBeenCalledWith('pendingRedirectAtEndOfJourney', 'true')
    })

    it('should not update Induction given error calling service', async () => {
      // Given
      const inductionDto = aValidInductionDto()
      req.journeyData.inductionDto = inductionDto

      const inPrisonWorkForm = {
        inPrisonWork: ['COMPUTERS_OR_DESK_BASED', 'OTHER'],
        inPrisonWorkOther: 'Gambling',
      }
      req.body = inPrisonWorkForm
      const updateInductionDto = aValidUpdateInductionRequest()

      mockedCreateOrUpdateInductionDtoMapper.mockReturnValueOnce(updateInductionDto)

      const expectedUpdatedWorkInterests = [
        {
          workType: 'COMPUTERS_OR_DESK_BASED',
          workTypeOther: undefined,
        },
        {
          workType: 'OTHER',
          workTypeOther: 'Gambling',
        },
      ]

      inductionService.updateInduction.mockRejectedValue(createError(500, 'Service unavailable'))

      // When
      await controller.submitInPrisonWorkForm(
        req as undefined as Request,
        res as undefined as Response,
        next as undefined as NextFunction,
      )

      // Then
      // Extract the first call to the mock and the second argument (i.e. the updated Induction)
      const updatedInduction = mockedCreateOrUpdateInductionDtoMapper.mock.calls[0][1]
      expect(mockedCreateOrUpdateInductionDtoMapper).toHaveBeenCalledWith(prisonerSummary.prisonId, updatedInduction)
      expect(updatedInduction.inPrisonInterests.inPrisonWorkInterests).toEqual(expectedUpdatedWorkInterests)

      expect(inductionService.updateInduction).toHaveBeenCalledWith(prisonNumber, updateInductionDto, username)
      const updatedInductionDto = req.journeyData.inductionDto
      expect(updatedInductionDto.inPrisonInterests.inPrisonWorkInterests).toEqual([
        { workType: InPrisonWorkValue.COMPUTERS_OR_DESK_BASED, workTypeOther: undefined },
        { workType: InPrisonWorkValue.OTHER, workTypeOther: 'Gambling' },
      ])
      expect(flash).toHaveBeenCalledWith('pageHasApiErrors', 'true')
      expect(res.redirect).toHaveBeenCalledWith('in-prison-work')
    })
  })
})
