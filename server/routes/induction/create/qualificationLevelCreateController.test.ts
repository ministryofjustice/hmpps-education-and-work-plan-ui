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
    it('should get the QualificationLevel view given there is no QualificationLevelForm on the session', async () => {
      // Given
      const inductionDto = aValidInductionDto()
      req.journeyData.inductionDto = inductionDto
      req.session.qualificationLevelForm = undefined

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
      expect(req.session.qualificationLevelForm).toBeUndefined()
      expect(req.journeyData.inductionDto).toEqual(inductionDto)
    })

    it('should get the QualificationLevel view given there is an QualificationLevelForm already on the session', async () => {
      // Given
      const inductionDto = aValidInductionDto()
      req.journeyData.inductionDto = inductionDto

      const expectedQualificationLevelForm = { qualificationLevel: '' }
      req.session.qualificationLevelForm = expectedQualificationLevelForm

      const expectedView = {
        prisonerSummary,
        form: expectedQualificationLevelForm,
      }

      // When
      await controller.getQualificationLevelView(req, res, next)

      // Then
      expect(res.render).toHaveBeenCalledWith('pages/prePrisonEducation/qualificationLevel', expectedView)
      expect(req.session.qualificationLevelForm).toBeUndefined()
      expect(req.journeyData.inductionDto).toEqual(inductionDto)
    })
  })

  describe('submitQualificationLevelForm', () => {
    it('should not proceed to qualification detail page given form submitted with validation errors', async () => {
      // Given
      const inductionDto = aValidInductionDto()
      req.journeyData.inductionDto = inductionDto

      const invalidQualificationLevelForm = {
        qualificationLevel: '',
      }
      req.body = invalidQualificationLevelForm
      req.session.qualificationLevelForm = undefined

      const expectedErrors = [
        {
          href: '#qualificationLevel',
          text: `Select the level of qualification Ifereeca Peigh wants to add`,
        },
      ]

      // When
      await controller.submitQualificationLevelForm(req, res, next)

      // Then
      expect(res.redirectWithErrors).toHaveBeenCalledWith(
        `/prisoners/${prisonNumber}/create-induction/${journeyId}/qualification-level`,
        expectedErrors,
      )
      expect(req.session.qualificationLevelForm).toEqual(invalidQualificationLevelForm)
      expect(req.journeyData.inductionDto).toEqual(inductionDto)
    })

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
