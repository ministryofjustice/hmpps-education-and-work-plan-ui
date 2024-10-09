import createError from 'http-errors'
import { Request, Response } from 'express'
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

  const prisonNumber = 'A1234BC'
  const prisonerSummary = aValidPrisonerSummary()

  const req = {
    session: {},
    body: {},
    user: { token: 'some-token' },
    params: { prisonNumber },
    path: `/prisoners/${prisonNumber}/induction/in-prison-training`,
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

  describe('getInPrisonTrainingView', () => {
    it('should get the In Prison Training view given there is no InPrisonTrainingForm on the session', async () => {
      // Given
      const inductionDto = aValidInductionDto()
      req.session.inductionDto = inductionDto
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
        backLinkUrl: '/plan/A1234BC/view/education-and-training',
        backLinkAriaText: `Back to Jimmy Lightfingers's learning and work progress`,
      }

      // When
      await controller.getInPrisonTrainingView(req, res, next)

      // Then
      expect(res.render).toHaveBeenCalledWith('pages/induction/inPrisonTraining/index', expectedView)
      expect(req.session.inPrisonTrainingForm).toBeUndefined()
      expect(req.session.inductionDto).toEqual(inductionDto)
    })

    it('should get the In Prison Training view given there is an InPrisonTrainingForm already on the session', async () => {
      // Given
      const inductionDto = aValidInductionDto()
      req.session.inductionDto = inductionDto

      const expectedInPrisonTrainingForm = {
        inPrisonTraining: [InPrisonTrainingValue.CATERING, InPrisonTrainingValue.OTHER],
        inPrisonTrainingOther: 'Electrician training',
      }
      req.session.inPrisonTrainingForm = expectedInPrisonTrainingForm

      const expectedView = {
        prisonerSummary,
        form: expectedInPrisonTrainingForm,
        backLinkUrl: '/plan/A1234BC/view/education-and-training',
        backLinkAriaText: `Back to Jimmy Lightfingers's learning and work progress`,
      }

      // When
      await controller.getInPrisonTrainingView(req, res, next)

      // Then
      expect(res.render).toHaveBeenCalledWith('pages/induction/inPrisonTraining/index', expectedView)
      expect(req.session.inPrisonTrainingForm).toBeUndefined()
      expect(req.session.inductionDto).toEqual(inductionDto)
    })
  })

  describe('submitInPrisonTrainingForm', () => {
    it('should not update Induction given form is submitted with validation errors', async () => {
      // Given
      const inductionDto = aValidInductionDto()
      req.session.inductionDto = inductionDto

      const invalidInPrisonTrainingForm = {
        inPrisonTraining: [InPrisonTrainingValue.OTHER],
        inPrisonTrainingOther: '',
      }
      req.body = invalidInPrisonTrainingForm
      req.session.inPrisonTrainingForm = undefined

      const expectedErrors = [
        {
          href: '#inPrisonTrainingOther',
          text: 'Enter the type of type of training Jimmy Lightfingers would like to do in prison',
        },
      ]

      // When
      await controller.submitInPrisonTrainingForm(req, res, next)

      // Then
      expect(res.redirectWithErrors).toHaveBeenCalledWith(
        '/prisoners/A1234BC/induction/in-prison-training',
        expectedErrors,
      )
      expect(req.session.inPrisonTrainingForm).toEqual(invalidInPrisonTrainingForm)
      expect(req.session.inductionDto).toEqual(inductionDto)
    })

    it('should update Induction and call API and redirect to education and training page', async () => {
      // Given
      const inductionDto = aValidInductionDto()
      req.session.inductionDto = inductionDto

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

      expect(inductionService.updateInduction).toHaveBeenCalledWith(prisonNumber, updateInductionDto, 'some-token')
      expect(res.redirect).toHaveBeenCalledWith(`/plan/${prisonNumber}/view/education-and-training`)
      expect(req.session.inPrisonTrainingForm).toBeUndefined()
      expect(req.session.inductionDto).toBeUndefined()
    })

    it('should not update Induction given error calling service', async () => {
      // Given
      const inductionDto = aValidInductionDto()
      req.session.inductionDto = inductionDto

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
      const expectedError = createError(
        500,
        `Error updating Induction for prisoner ${prisonNumber}. Error: InternalServerError: Service unavailable`,
      )

      // When
      await controller.submitInPrisonTrainingForm(req, res, next)

      // Then
      // Extract the first call to the mock and the second argument (i.e. the updated Induction)
      const updatedInduction = mockedCreateOrUpdateInductionDtoMapper.mock.calls[0][1]
      expect(mockedCreateOrUpdateInductionDtoMapper).toHaveBeenCalledWith(prisonerSummary.prisonId, updatedInduction)
      expect(updatedInduction.inPrisonInterests.inPrisonTrainingInterests).toEqual(expectedUpdatedInPrisonTraining)

      expect(inductionService.updateInduction).toHaveBeenCalledWith(prisonNumber, updateInductionDto, 'some-token')
      expect(next).toHaveBeenCalledWith(expectedError)
      expect(req.session.inPrisonTrainingForm).toEqual(inPrisonTrainingForm)
      expect(req.session.inductionDto).toEqual(inductionDto)
    })
  })
})
