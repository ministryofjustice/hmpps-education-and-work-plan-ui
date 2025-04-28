import { Request, Response } from 'express'
import { v4 as uuidV4 } from 'uuid'
import type { AdditionalTrainingForm } from 'inductionForms'
import aValidPrisonerSummary from '../../../testsupport/prisonerSummaryTestDataBuilder'
import { aValidInductionDto } from '../../../testsupport/inductionDtoTestDataBuilder'
import AdditionalTrainingValue from '../../../enums/additionalTrainingValue'
import AdditionalTrainingCreateController from './additionalTrainingCreateController'

describe('additionalTrainingCreateController', () => {
  const controller = new AdditionalTrainingCreateController()

  const journeyId = uuidV4()
  const prisonNumber = 'A1234BC'
  const prisonerSummary = aValidPrisonerSummary()

  const req = {
    session: {},
    journeyData: {},
    body: {},
    user: {},
    params: { prisonNumber, journeyId },
    originalUrl: `/prisoners/${prisonNumber}/create-induction/${journeyId}/additional-training`,
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
  })

  describe('getAdditionalTrainingView', () => {
    it('should get Additional Training view given there is no AdditionalTrainingForm on the session', async () => {
      // Given
      const inductionDto = aValidInductionDto()
      inductionDto.previousTraining = undefined
      req.journeyData.inductionDto = inductionDto
      req.session.additionalTrainingForm = undefined
      const expectedAdditionalTrainingForm: AdditionalTrainingForm = {
        additionalTraining: [],
        additionalTrainingOther: undefined,
      }

      const expectedView = {
        prisonerSummary,
        form: expectedAdditionalTrainingForm,
      }

      // When
      await controller.getAdditionalTrainingView(req, res, next)

      // Then
      expect(res.render).toHaveBeenCalledWith('pages/induction/additionalTraining/index', expectedView)
      expect(req.session.additionalTrainingForm).toBeUndefined()
      expect(req.journeyData.inductionDto).toEqual(inductionDto)
    })

    it('should get the Additional Training view given there is an AdditionalTrainingForm already on the session', async () => {
      // Given
      const inductionDto = aValidInductionDto()
      inductionDto.previousTraining = undefined
      req.journeyData.inductionDto = inductionDto

      const expectedAdditionalTrainingForm: AdditionalTrainingForm = {
        additionalTraining: [AdditionalTrainingValue.FULL_UK_DRIVING_LICENCE, AdditionalTrainingValue.OTHER],
        additionalTrainingOther: 'Beginners cookery for IT professionals',
      }
      req.session.additionalTrainingForm = expectedAdditionalTrainingForm

      const expectedView = {
        prisonerSummary,
        form: expectedAdditionalTrainingForm,
      }

      // When
      await controller.getAdditionalTrainingView(req, res, next)

      // Then
      expect(res.render).toHaveBeenCalledWith('pages/induction/additionalTraining/index', expectedView)
      expect(req.session.additionalTrainingForm).toBeUndefined()
      expect(req.journeyData.inductionDto).toEqual(inductionDto)
    })
  })

  describe('submitAdditionalTrainingForm', () => {
    it('should not update Induction given form is submitted with validation errors', async () => {
      // Given
      const inductionDto = aValidInductionDto()
      inductionDto.previousTraining = undefined
      req.journeyData.inductionDto = inductionDto

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
        `/prisoners/A1234BC/create-induction/${journeyId}/additional-training`,
        expectedErrors,
      )
      expect(req.session.additionalTrainingForm).toEqual(invalidAdditionalTrainingForm)
      expect(req.journeyData.inductionDto).toEqual(inductionDto)
    })

    it('should update InductionDto and redirect to Has Worked Before', async () => {
      // Given
      const inductionDto = aValidInductionDto()
      inductionDto.previousTraining = undefined
      req.journeyData.inductionDto = inductionDto

      const additionalTrainingForm = {
        additionalTraining: [AdditionalTrainingValue.HGV_LICENCE, AdditionalTrainingValue.OTHER],
        additionalTrainingOther: 'Italian cookery for IT professionals',
      }
      req.body = additionalTrainingForm
      req.session.additionalTrainingForm = undefined

      const expectedUpdatedAdditionalTraining = ['HGV_LICENCE', 'OTHER']
      const expectedUpdatedAdditionalTrainingOther = 'Italian cookery for IT professionals'

      const expectedNextPage = `/prisoners/A1234BC/create-induction/${journeyId}/has-worked-before`

      // When
      await controller.submitAdditionalTrainingForm(req, res, next)

      // Then
      const updatedInductionDto = req.journeyData.inductionDto
      expect(updatedInductionDto.previousTraining.trainingTypes).toEqual(expectedUpdatedAdditionalTraining)
      expect(updatedInductionDto.previousTraining.trainingTypeOther).toEqual(expectedUpdatedAdditionalTrainingOther)
      expect(res.redirect).toHaveBeenCalledWith(expectedNextPage)
      expect(req.session.additionalTrainingForm).toBeUndefined()
    })

    it('should update InductionDto and redirect to Check Your Answers given previous page was Check Your Answers', async () => {
      // Given
      const inductionDto = aValidInductionDto()
      req.journeyData.inductionDto = inductionDto

      const additionalTrainingForm = {
        additionalTraining: [AdditionalTrainingValue.HGV_LICENCE, AdditionalTrainingValue.OTHER],
        additionalTrainingOther: 'Italian cookery for IT professionals',
      }
      req.body = additionalTrainingForm
      req.session.additionalTrainingForm = undefined

      const expectedUpdatedAdditionalTraining = ['HGV_LICENCE', 'OTHER']
      const expectedUpdatedAdditionalTrainingOther = 'Italian cookery for IT professionals'

      req.session.pageFlowHistory = {
        pageUrls: [
          `/prisoners/A1234BC/create-induction/${journeyId}/check-your-answers`,
          `/prisoners/A1234BC/create-induction/${journeyId}/additional-training`,
        ],
        currentPageIndex: 1,
      }
      const expectedNextPage = `/prisoners/A1234BC/create-induction/${journeyId}/check-your-answers`

      // When
      await controller.submitAdditionalTrainingForm(req, res, next)

      // Then
      const updatedInductionDto = req.journeyData.inductionDto
      expect(updatedInductionDto.previousTraining.trainingTypes).toEqual(expectedUpdatedAdditionalTraining)
      expect(updatedInductionDto.previousTraining.trainingTypeOther).toEqual(expectedUpdatedAdditionalTrainingOther)
      expect(res.redirect).toHaveBeenCalledWith(expectedNextPage)
      expect(req.session.additionalTrainingForm).toBeUndefined()
    })
  })
})
