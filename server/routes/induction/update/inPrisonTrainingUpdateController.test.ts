import createError from 'http-errors'
import { Request, Response } from 'express'
import { v4 as uuidV4 } from 'uuid'
import aValidPrisonerSummary from '../../../testsupport/prisonerSummaryTestDataBuilder'
import { aValidInductionDto } from '../../../testsupport/inductionDtoTestDataBuilder'
import toCreateOrUpdateInductionDto from '../../../data/mappers/createOrUpdateInductionDtoMapper'
import InductionService from '../../../services/inductionService'
import aValidUpdateInductionRequest from '../../../testsupport/updateInductionRequestTestDataBuilder'
import InPrisonTrainingUpdateController from './inPrisonTrainingUpdateController'
import InPrisonTrainingValue from '../../../enums/inPrisonTrainingValue'

jest.mock('../../../data/mappers/createOrUpdateInductionDtoMapper')
jest.mock('../../../services/inductionService')

describe('inPrisonTrainingUpdateController', () => {
  const mockedCreateOrUpdateInductionDtoMapper = toCreateOrUpdateInductionDto as jest.MockedFunction<
    typeof toCreateOrUpdateInductionDto
  >

  const inductionService = new InductionService(null, null) as jest.Mocked<InductionService>
  const controller = new InPrisonTrainingUpdateController(inductionService)

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
    path: `/prisoners/${prisonNumber}/induction/${journeyId}/in-prison-training`,
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
  })

  describe('getInPrisonTrainingView', () => {
    it('should get the In Prison Training view given there is no InPrisonTrainingForm on the session', async () => {
      // Given
      const inductionDto = aValidInductionDto()
      req.journeyData.inductionDto = inductionDto
      req.session.inPrisonTrainingForm = undefined

      const expectedInPrisonTrainingForm = {
        inPrisonTraining: [
          InPrisonTrainingValue.FORKLIFT_DRIVING,
          InPrisonTrainingValue.CATERING,
          InPrisonTrainingValue.OTHER,
        ],
        inPrisonTrainingOther: 'Advanced origami',
      }

      const expectedView = {
        prisonerSummary,
        form: expectedInPrisonTrainingForm,
      }

      // When
      await controller.getInPrisonTrainingView(req, res, next)

      // Then
      expect(res.render).toHaveBeenCalledWith('pages/induction/inPrisonTraining/index', expectedView)
      expect(req.session.inPrisonTrainingForm).toBeUndefined()
      expect(req.journeyData.inductionDto).toEqual(inductionDto)
    })

    it('should get the In Prison Training view given there is an InPrisonTrainingForm already on the session', async () => {
      // Given
      const inductionDto = aValidInductionDto()
      req.journeyData.inductionDto = inductionDto

      const expectedInPrisonTrainingForm = {
        inPrisonTraining: [InPrisonTrainingValue.CATERING, InPrisonTrainingValue.OTHER],
        inPrisonTrainingOther: 'Electrician training',
      }
      req.session.inPrisonTrainingForm = expectedInPrisonTrainingForm

      const expectedView = {
        prisonerSummary,
        form: expectedInPrisonTrainingForm,
      }

      // When
      await controller.getInPrisonTrainingView(req, res, next)

      // Then
      expect(res.render).toHaveBeenCalledWith('pages/induction/inPrisonTraining/index', expectedView)
      expect(req.session.inPrisonTrainingForm).toBeUndefined()
      expect(req.journeyData.inductionDto).toEqual(inductionDto)
    })
  })

  describe('submitInPrisonTrainingForm', () => {
    it('should not update Induction given form is submitted with validation errors', async () => {
      // Given
      const inductionDto = aValidInductionDto()
      req.journeyData.inductionDto = inductionDto

      const invalidInPrisonTrainingForm = {
        inPrisonTraining: [InPrisonTrainingValue.OTHER],
        inPrisonTrainingOther: '',
      }
      req.body = invalidInPrisonTrainingForm
      req.session.inPrisonTrainingForm = undefined

      const expectedErrors = [
        {
          href: '#inPrisonTrainingOther',
          text: 'Enter the type of type of training Ifereeca Peigh would like to do in prison',
        },
      ]

      // When
      await controller.submitInPrisonTrainingForm(req, res, next)

      // Then
      expect(res.redirectWithErrors).toHaveBeenCalledWith(
        `/prisoners/A1234BC/induction/${journeyId}/in-prison-training`,
        expectedErrors,
      )
      expect(req.session.inPrisonTrainingForm).toEqual(invalidInPrisonTrainingForm)
      expect(req.journeyData.inductionDto).toEqual(inductionDto)
    })

    it('should update Induction and call API and redirect to education and training page', async () => {
      // Given
      const inductionDto = aValidInductionDto()
      req.journeyData.inductionDto = inductionDto

      const inPrisonTrainingForm = {
        inPrisonTraining: [InPrisonTrainingValue.FORKLIFT_DRIVING, InPrisonTrainingValue.OTHER],
        inPrisonTrainingOther: 'Electrician training',
      }
      req.body = inPrisonTrainingForm
      req.session.inPrisonTrainingForm = undefined
      const updateInductionDto = aValidUpdateInductionRequest()

      mockedCreateOrUpdateInductionDtoMapper.mockReturnValueOnce(updateInductionDto)

      const expectedUpdatedInPrisonTraining = [
        {
          trainingType: 'FORKLIFT_DRIVING',
          trainingTypeOther: undefined,
        },
        {
          trainingType: 'OTHER',
          trainingTypeOther: 'Electrician training',
        },
      ]

      // When
      await controller.submitInPrisonTrainingForm(req, res, next)

      // Then
      // Extract the first call to the mock and the second argument (i.e. the updated Induction)
      const updatedInduction = mockedCreateOrUpdateInductionDtoMapper.mock.calls[0][1]
      expect(mockedCreateOrUpdateInductionDtoMapper).toHaveBeenCalledWith(prisonerSummary.prisonId, updatedInduction)
      expect(updatedInduction.inPrisonInterests.inPrisonTrainingInterests).toEqual(expectedUpdatedInPrisonTraining)

      expect(inductionService.updateInduction).toHaveBeenCalledWith(prisonNumber, updateInductionDto, username)
      expect(res.redirect).toHaveBeenCalledWith(`/plan/${prisonNumber}/view/education-and-training`)
      expect(req.session.inPrisonTrainingForm).toBeUndefined()
      expect(req.journeyData.inductionDto).toBeUndefined()
      expect(flash).not.toHaveBeenCalled()
    })

    it('should not update Induction given error calling service', async () => {
      // Given
      const inductionDto = aValidInductionDto()
      req.journeyData.inductionDto = inductionDto

      const inPrisonTrainingForm = {
        inPrisonTraining: [InPrisonTrainingValue.FORKLIFT_DRIVING, InPrisonTrainingValue.OTHER],
        inPrisonTrainingOther: 'Electrician training',
      }
      req.body = inPrisonTrainingForm
      req.session.inPrisonTrainingForm = undefined
      const updateInductionDto = aValidUpdateInductionRequest()

      mockedCreateOrUpdateInductionDtoMapper.mockReturnValueOnce(updateInductionDto)

      const expectedUpdatedInPrisonTraining = [
        {
          trainingType: 'FORKLIFT_DRIVING',
          trainingTypeOther: undefined,
        },
        {
          trainingType: 'OTHER',
          trainingTypeOther: 'Electrician training',
        },
      ]

      inductionService.updateInduction.mockRejectedValue(createError(500, 'Service unavailable'))

      // When
      await controller.submitInPrisonTrainingForm(req, res, next)

      // Then
      // Extract the first call to the mock and the second argument (i.e. the updated Induction)
      const updatedInduction = mockedCreateOrUpdateInductionDtoMapper.mock.calls[0][1]
      expect(mockedCreateOrUpdateInductionDtoMapper).toHaveBeenCalledWith(prisonerSummary.prisonId, updatedInduction)
      expect(updatedInduction.inPrisonInterests.inPrisonTrainingInterests).toEqual(expectedUpdatedInPrisonTraining)

      expect(inductionService.updateInduction).toHaveBeenCalledWith(prisonNumber, updateInductionDto, username)
      expect(req.session.inPrisonTrainingForm).toEqual(inPrisonTrainingForm)
      expect(req.journeyData.inductionDto).toEqual(inductionDto)
      expect(flash).toHaveBeenCalledWith('pageHasApiErrors', 'true')
      expect(res.redirect).toHaveBeenCalledWith('in-prison-training')
    })
  })
})
