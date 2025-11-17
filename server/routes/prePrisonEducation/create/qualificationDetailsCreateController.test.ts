import { Request, Response } from 'express'
import { v4 as uuidV4 } from 'uuid'
import type { EducationDto } from 'dto'
import type { QualificationDetailsForm } from 'forms'
import aValidPrisonerSummary from '../../../testsupport/prisonerSummaryTestDataBuilder'
import QualificationLevelValue from '../../../enums/qualificationLevelValue'
import EducationLevelValue from '../../../enums/educationLevelValue'
import QualificationDetailsCreateController from './qualificationDetailsCreateController'

describe('qualificationDetailsController', () => {
  const controller = new QualificationDetailsCreateController()

  const journeyId = uuidV4()
  const prisonNumber = 'A1234BC'
  const prisonerSummary = aValidPrisonerSummary({ prisonNumber })

  const req = {
    session: {},
    journeyData: {},
    body: {},
    params: { prisonNumber, journeyId },
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
    req.journeyData = {}
    req.body = {}
    res.locals.invalidForm = undefined
  })

  describe('getQualificationDetailsView', () => {
    it('should get the Qualification Details view given there is no Qualification Details form on res.locals.invalidForm', async () => {
      // Given
      const qualificationLevel = QualificationLevelValue.LEVEL_3
      req.journeyData.qualificationLevel = qualificationLevel
      res.locals.invalidForm = undefined

      const expectedQualificationDetailsForm: QualificationDetailsForm = {
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
      expect(req.journeyData.qualificationLevel).toEqual(qualificationLevel)
    })

    it('should get the Qualification Details view given a Qualification Details form is on res.locals.invalidForm', async () => {
      // Given
      const qualificationLevel = QualificationLevelValue.LEVEL_3
      req.journeyData.qualificationLevel = qualificationLevel

      const expectedQualificationDetailsForm: QualificationDetailsForm = {
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
      expect(req.journeyData.qualificationLevel).toEqual(qualificationLevel)
    })

    it('should redirect to Qualification Level page given there is no Qualification Level form on the journey data', async () => {
      // Given
      req.journeyData.qualificationLevel = undefined

      // When
      await controller.getQualificationDetailsView(req, res, next)

      // Then
      expect(res.redirect).toHaveBeenCalledWith(`/prisoners/A1234BC/create-education/${journeyId}/qualification-level`)
      expect(req.journeyData.qualificationLevel).toBeUndefined()
    })
  })

  describe('submitQualificationDetailsForm', () => {
    it('should redirect to Qualification List page given valid form is submitted', async () => {
      // Given
      const educationDto = {
        prisonNumber,
        educationLevel: EducationLevelValue.FURTHER_EDUCATION_COLLEGE,
        qualifications: [],
      } as EducationDto
      req.journeyData.educationDto = educationDto
      const qualificationLevel = QualificationLevelValue.LEVEL_3
      req.journeyData.qualificationLevel = qualificationLevel

      const qualificationDetailsForm: QualificationDetailsForm = {
        qualificationSubject: 'Maths',
        qualificationGrade: 'C',
      }
      req.body = qualificationDetailsForm

      const expectedEducationDto = {
        ...educationDto,
        qualifications: [
          ...educationDto.qualifications,
          {
            subject: 'Maths',
            grade: 'C',
            level: QualificationLevelValue.LEVEL_3,
          },
        ],
      }

      // When
      await controller.submitQualificationDetailsForm(req, res, next)

      // Then
      expect(res.redirect).toHaveBeenCalledWith(`/prisoners/A1234BC/create-education/${journeyId}/qualifications`)
      expect(req.journeyData.educationDto).toEqual(expectedEducationDto)
      expect(req.journeyData.qualificationLevel).toBeUndefined()
    })
  })
})
