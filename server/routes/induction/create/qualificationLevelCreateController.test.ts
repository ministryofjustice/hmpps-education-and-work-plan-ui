import { Request, Response } from 'express'
import { v4 as uuidV4 } from 'uuid'
import aValidPrisonerSummary from '../../../testsupport/prisonerSummaryTestDataBuilder'
import { aValidInductionDto } from '../../../testsupport/inductionDtoTestDataBuilder'
import QualificationLevelCreateController from './qualificationLevelCreateController'
import QualificationLevelValue from '../../../enums/qualificationLevelValue'

describe('qualificationLevelCreateController', () => {
  const controller = new QualificationLevelCreateController()

  const journeyId = uuidV4()
  const prisonNumber = 'A1234BC'
  const prisonerSummary = aValidPrisonerSummary()

  const req = {
    session: {},
    journeyData: {},
    body: {},
    params: { prisonNumber, journeyId },
    originalUrl: `/prisoners/${prisonNumber}/create-induction/${journeyId}/qualification-level`,
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

  describe('getQualificationLevelView', () => {
    it('should get the QualificationLevel view given there is no invalid form in res.locals', async () => {
      // Given
      const inductionDto = aValidInductionDto()
      req.journeyData.inductionDto = inductionDto
      res.locals.invalidForm = undefined

      const expectedQualificationLevelForm = {
        qualificationLevel: '',
      }

      const expectedView = {
        prisonerSummary,
        form: expectedQualificationLevelForm,
      }

      // When
      await controller.getQualificationLevelView(req, res, next)

      // Then
      expect(res.render).toHaveBeenCalledWith('pages/prePrisonEducation/qualificationLevel', expectedView)
      expect(req.journeyData.inductionDto).toEqual(inductionDto)
    })

    it('should get the QualificationLevel view given there is an invalid form in res.locals from a validation error', async () => {
      // Given
      const inductionDto = aValidInductionDto()
      req.journeyData.inductionDto = inductionDto

      const expectedQualificationLevelForm = { qualificationLevel: '' }
      res.locals.invalidForm = expectedQualificationLevelForm

      const expectedView = {
        prisonerSummary,
        form: expectedQualificationLevelForm,
      }

      // When
      await controller.getQualificationLevelView(req, res, next)

      // Then
      expect(res.render).toHaveBeenCalledWith('pages/prePrisonEducation/qualificationLevel', expectedView)
      expect(req.journeyData.inductionDto).toEqual(inductionDto)
    })
  })

  describe('submitQualificationLevelForm', () => {
    it('should proceed to qualification detail page', async () => {
      // Given
      const inductionDto = aValidInductionDto()
      req.journeyData.inductionDto = inductionDto

      const qualificationLevelForm = {
        qualificationLevel: QualificationLevelValue.LEVEL_5,
      }
      req.body = qualificationLevelForm
      req.session.qualificationLevelForm = undefined

      // When
      await controller.submitQualificationLevelForm(req, res, next)

      // Then
      expect(res.redirect).toHaveBeenCalledWith(
        `/prisoners/${prisonNumber}/create-induction/${journeyId}/qualification-details`,
      )
      expect(req.session.qualificationLevelForm).toEqual(qualificationLevelForm)
      expect(req.journeyData.inductionDto).toEqual(inductionDto)
    })
  })
})
