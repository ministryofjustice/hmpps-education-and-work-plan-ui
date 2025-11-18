import { Request, Response } from 'express'
import { v4 as uuidV4 } from 'uuid'
import aValidPrisonerSummary from '../../../testsupport/prisonerSummaryTestDataBuilder'
import QualificationDetailsCreateController from './qualificationDetailsCreateController'
import { aValidInductionDto } from '../../../testsupport/inductionDtoTestDataBuilder'
import QualificationLevelValue from '../../../enums/qualificationLevelValue'

describe('qualificationDetailsCreateController', () => {
  const controller = new QualificationDetailsCreateController()

  const journeyId = uuidV4()
  const prisonNumber = 'A1234BC'
  const prisonerSummary = aValidPrisonerSummary()

  const req = {
    session: {},
    journeyData: {},
    body: {},
    params: { prisonNumber, journeyId },
    originalUrl: `/prisoners/${prisonNumber}/create-induction/${journeyId}/qualification-details`,
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

  describe('getQualificationDetailsView', () => {
    it('should get the Qualification Details view given there is no QualificationDetailsForm on res.locals.invalidForm', async () => {
      // Given
      const inductionDto = aValidInductionDto()
      inductionDto.previousQualifications.qualifications = undefined
      req.journeyData.inductionDto = inductionDto
      const qualificationLevel = QualificationLevelValue.LEVEL_3
      req.journeyData.qualificationLevel = qualificationLevel

      res.locals.invalidForm = undefined
      const expectedQualificationDetailsForm = {
        qualificationSubject: '',
        qualificationGrade: '',
      }

      const expectedView = {
        prisonerSummary,
        form: expectedQualificationDetailsForm,
        qualificationLevel: QualificationLevelValue.LEVEL_3,
      }

      // When
      await controller.getQualificationDetailsView(req, res, next)

      // Then
      expect(res.render).toHaveBeenCalledWith('pages/prePrisonEducation/qualificationDetails', expectedView)
      expect(req.journeyData.inductionDto).toEqual(inductionDto)
    })

    it('should get the Qualification Details view given there is a QualificationDetailsForm already on the session', async () => {
      // Given
      const inductionDto = aValidInductionDto()
      inductionDto.previousQualifications.qualifications = undefined
      req.journeyData.inductionDto = inductionDto
      const qualificationLevel = QualificationLevelValue.LEVEL_3
      req.journeyData.qualificationLevel = qualificationLevel

      const expectedQualificationDetailsForm = {
        qualificationSubject: '',
        qualificationGrade: '',
      }
      res.locals.invalidForm = expectedQualificationDetailsForm

      const expectedView = {
        prisonerSummary,
        form: expectedQualificationDetailsForm,
        qualificationLevel: QualificationLevelValue.LEVEL_3,
      }

      // When
      await controller.getQualificationDetailsView(req, res, next)

      // Then
      expect(res.render).toHaveBeenCalledWith('pages/prePrisonEducation/qualificationDetails', expectedView)
      expect(req.journeyData.inductionDto).toEqual(inductionDto)
    })
  })

  describe('submitQualificationDetailsForm', () => {
    it('should proceed to qualifications page', async () => {
      // Given
      const inductionDto = aValidInductionDto()
      inductionDto.previousQualifications.qualifications = undefined
      req.journeyData.inductionDto = inductionDto

      const qualificationLevel = QualificationLevelValue.LEVEL_3
      req.journeyData.qualificationLevel = qualificationLevel

      const qualificationDetailsForm = {
        qualificationSubject: 'Maths',
        qualificationGrade: 'A',
      }
      req.body = qualificationDetailsForm

      // When
      await controller.submitQualificationDetailsForm(req, res, next)

      // Then
      const updatedInduction = req.journeyData.inductionDto
      expect(updatedInduction.previousQualifications.qualifications).toEqual([
        { subject: 'Maths', grade: 'A', level: QualificationLevelValue.LEVEL_3 },
      ])
      expect(res.redirect).toHaveBeenCalledWith(
        `/prisoners/${prisonNumber}/create-induction/${journeyId}/qualifications`,
      )
      expect(req.journeyData.qualificationLevel).toBeUndefined()
    })
  })
})
