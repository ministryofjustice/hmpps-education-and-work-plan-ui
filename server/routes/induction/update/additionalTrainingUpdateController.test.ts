import createError from 'http-errors'
import { Request, Response } from 'express'
import aValidPrisonerSummary from '../../../testsupport/prisonerSummaryTestDataBuilder'
import { aValidInductionDto } from '../../../testsupport/inductionDtoTestDataBuilder'
import toCreateOrUpdateInductionDto from '../../../data/mappers/createOrUpdateInductionDtoMapper'
import InductionService from '../../../services/inductionService'
import aValidUpdateInductionRequest from '../../../testsupport/updateInductionRequestTestDataBuilder'
import AdditionalTrainingUpdateController from './additionalTrainingUpdateController'
import AdditionalTrainingValue from '../../../enums/additionalTrainingValue'

jest.mock('../../../data/mappers/createOrUpdateInductionDtoMapper')
jest.mock('../../../services/inductionService')

describe('additionalTrainingUpdateController', () => {
  const mockedCreateOrUpdateInductionDtoMapper = toCreateOrUpdateInductionDto as jest.MockedFunction<
    typeof toCreateOrUpdateInductionDto
  >

  const inductionService = new InductionService(null, null) as jest.Mocked<InductionService>
  const controller = new AdditionalTrainingUpdateController(inductionService)

  const prisonNumber = 'A1234BC'
  const prisonerSummary = aValidPrisonerSummary()

  const req = {
    session: {},
    body: {},
    user: { token: 'some-token' },
    params: { prisonNumber },
    path: `/prisoners/${prisonNumber}/induction/additional-training`,
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

  describe('getAdditionalTrainingView', () => {
    it('should get Additional Training view given there is no AdditionalTrainingForm on the session', async () => {
      // Given
      const inductionDto = aValidInductionDto()
      req.session.inductionDto = inductionDto
      req.session.additionalTrainingForm = undefined
      const expectedAdditionalTrainingForm = {
        additionalTraining: [
          AdditionalTrainingValue.FIRST_AID_CERTIFICATE,
          AdditionalTrainingValue.MANUAL_HANDLING,
          AdditionalTrainingValue.OTHER,
        ],
        additionalTrainingOther: 'Advanced origami',
      }

      const expectedView = {
        prisonerSummary,
        form: expectedAdditionalTrainingForm,
        backLinkUrl: '/plan/A1234BC/view/education-and-training',
        backLinkAriaText: `Back to Jimmy Lightfingers's learning and work progress`,
      }

      // When
      await controller.getAdditionalTrainingView(req, res, next)

      // Then
      expect(res.render).toHaveBeenCalledWith('pages/induction/additionalTraining/index', expectedView)
      expect(req.session.additionalTrainingForm).toBeUndefined()
      expect(req.session.inductionDto).toEqual(inductionDto)
    })

    it('should get the Additional Training view given there is an AdditionalTrainingForm already on the session', async () => {
      // Given
      const inductionDto = aValidInductionDto()
      req.session.inductionDto = inductionDto

      const expectedAdditionalTrainingForm = {
        additionalTraining: [AdditionalTrainingValue.FULL_UK_DRIVING_LICENCE, AdditionalTrainingValue.OTHER],
        additionalTrainingOther: 'Beginners cookery for IT professionals',
      }
      req.session.additionalTrainingForm = expectedAdditionalTrainingForm

      const expectedView = {
        prisonerSummary,
        form: expectedAdditionalTrainingForm,
        backLinkUrl: '/plan/A1234BC/view/education-and-training',
        backLinkAriaText: `Back to Jimmy Lightfingers's learning and work progress`,
      }

      // When
      await controller.getAdditionalTrainingView(req, res, next)

      // Then
      expect(res.render).toHaveBeenCalledWith('pages/induction/additionalTraining/index', expectedView)
      expect(req.session.additionalTrainingForm).toBeUndefined()
      expect(req.session.inductionDto).toEqual(inductionDto)
    })
  })

  describe('submitAdditionalTrainingForm', () => {
    it('should not update Induction given form is submitted with validation errors', async () => {
      // Given
      const inductionDto = aValidInductionDto()
      req.session.inductionDto = inductionDto

      const invalidAdditionalTrainingForm = {
        additionalTraining: [AdditionalTrainingValue.OTHER],
        additionalTrainingOther: '',
      }
      req.body = invalidAdditionalTrainingForm
      req.session.additionalTrainingForm = undefined

      const expectedErrors = [
        {
          href: '#additionalTrainingOther',
          text: 'Enter the type of training or vocational qualification Jimmy Lightfingers has',
        },
      ]

      // When
      await controller.submitAdditionalTrainingForm(req, res, next)

      // Then
      expect(res.redirectWithErrors).toHaveBeenCalledWith(
        '/prisoners/A1234BC/induction/additional-training',
        expectedErrors,
      )
      expect(req.session.additionalTrainingForm).toEqual(invalidAdditionalTrainingForm)
      expect(req.session.inductionDto).toEqual(inductionDto)
    })

    it('should update Induction and call API and redirect to education and training page', async () => {
      // Given
      const inductionDto = aValidInductionDto()
      req.session.inductionDto = inductionDto

      const additionalTrainingForm = {
        additionalTraining: [AdditionalTrainingValue.HGV_LICENCE, AdditionalTrainingValue.OTHER],
        additionalTrainingOther: 'Italian cookery for IT professionals',
      }
      req.body = additionalTrainingForm
      req.session.additionalTrainingForm = undefined
      const updateInductionDto = aValidUpdateInductionRequest()

      mockedCreateOrUpdateInductionDtoMapper.mockReturnValueOnce(updateInductionDto)

      const expectedUpdatedAdditionalTraining = ['HGV_LICENCE', 'OTHER']
      const expectedUpdatedAdditionalTrainingOther = 'Italian cookery for IT professionals'

      // When
      await controller.submitAdditionalTrainingForm(req, res, next)

      // Then
      // Extract the first call to the mock and the second argument (i.e. the updated Induction)
      const updatedInduction = mockedCreateOrUpdateInductionDtoMapper.mock.calls[0][1]
      expect(mockedCreateOrUpdateInductionDtoMapper).toHaveBeenCalledWith(prisonerSummary.prisonId, updatedInduction)
      expect(updatedInduction.previousTraining.trainingTypes).toEqual(expectedUpdatedAdditionalTraining)
      expect(updatedInduction.previousTraining.trainingTypeOther).toEqual(expectedUpdatedAdditionalTrainingOther)

      expect(inductionService.updateInduction).toHaveBeenCalledWith(prisonNumber, updateInductionDto, 'some-token')
      expect(res.redirect).toHaveBeenCalledWith(`/plan/${prisonNumber}/view/education-and-training`)
      expect(req.session.additionalTrainingForm).toBeUndefined()
      expect(req.session.inductionDto).toBeUndefined()
      expect(req.session.pageFlowHistory).toBeUndefined()
    })

    it('should not update Induction given error calling service', async () => {
      // Given
      const inductionDto = aValidInductionDto()
      req.session.inductionDto = inductionDto

      const additionalTrainingForm = {
        additionalTraining: [AdditionalTrainingValue.HGV_LICENCE, AdditionalTrainingValue.OTHER],
        additionalTrainingOther: 'Italian cookery for IT professionals',
      }
      req.body = additionalTrainingForm
      req.session.additionalTrainingForm = undefined
      const updateInductionDto = aValidUpdateInductionRequest()

      mockedCreateOrUpdateInductionDtoMapper.mockReturnValueOnce(updateInductionDto)

      const expectedUpdatedAdditionalTraining = ['HGV_LICENCE', 'OTHER']
      const expectedUpdatedAdditionalTrainingOther = 'Italian cookery for IT professionals'

      inductionService.updateInduction.mockRejectedValue(createError(500, 'Service unavailable'))
      const expectedError = createError(
        500,
        `Error updating Induction for prisoner ${prisonNumber}. Error: InternalServerError: Service unavailable`,
      )

      // When
      await controller.submitAdditionalTrainingForm(req, res, next)

      // Then
      // Extract the first call to the mock and the second argument (i.e. the updated Induction)
      const updatedInduction = mockedCreateOrUpdateInductionDtoMapper.mock.calls[0][1]
      expect(mockedCreateOrUpdateInductionDtoMapper).toHaveBeenCalledWith(prisonerSummary.prisonId, updatedInduction)
      expect(updatedInduction.previousTraining.trainingTypes).toEqual(expectedUpdatedAdditionalTraining)
      expect(updatedInduction.previousTraining.trainingTypeOther).toEqual(expectedUpdatedAdditionalTrainingOther)

      expect(inductionService.updateInduction).toHaveBeenCalledWith(prisonNumber, updateInductionDto, 'some-token')
      expect(next).toHaveBeenCalledWith(expectedError)
      expect(req.session.additionalTrainingForm).toEqual(additionalTrainingForm)
      const updatedInductionDto = req.session.inductionDto
      expect(updatedInductionDto.previousTraining.trainingTypes).toEqual([
        AdditionalTrainingValue.HGV_LICENCE,
        AdditionalTrainingValue.OTHER,
      ])
      expect(updatedInductionDto.previousTraining.trainingTypeOther).toEqual('Italian cookery for IT professionals')
    })
  })
})
