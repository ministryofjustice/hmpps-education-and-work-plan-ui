import { Request, Response } from 'express'
import { v4 as uuidV4 } from 'uuid'
import type { EducationDto } from 'dto'
import type { QualificationDetailsForm, QualificationLevelForm } from 'forms'
import aValidPrisonerSummary from '../../../testsupport/prisonerSummaryTestDataBuilder'
import { getPrisonerContext } from '../../../data/session/prisonerContexts'
import QualificationLevelValue from '../../../enums/qualificationLevelValue'
import EducationLevelValue from '../../../enums/educationLevelValue'
import QualificationDetailsUpdateController from './qualificationDetailsUpdateController'

describe('qualificationDetailsController', () => {
  const controller = new QualificationDetailsUpdateController()

  const journeyId = uuidV4()
  const prisonNumber = 'A1234BC'
  const prisonerSummary = aValidPrisonerSummary({ prisonNumber })

  const req = {
    session: {},
    journeyData: {},
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
  })

  describe('getQualificationDetailsView', () => {
    it('should get the Qualification Details view given there is no invalid form in res.locals', async () => {
      // Given
      const qualificationLevelForm: QualificationLevelForm = {
        qualificationLevel: QualificationLevelValue.LEVEL_3,
      }
      getPrisonerContext(req.session, prisonNumber).qualificationLevelForm = qualificationLevelForm
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
      expect(getPrisonerContext(req.session, prisonNumber).qualificationLevelForm).toEqual(qualificationLevelForm)
    })

    it('should get the Qualification Details view given there is an invalid form in res.locals from a validation error', async () => {
      // Given
      const qualificationLevelForm: QualificationLevelForm = {
        qualificationLevel: QualificationLevelValue.LEVEL_3,
      }
      getPrisonerContext(req.session, prisonNumber).qualificationLevelForm = qualificationLevelForm

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
      expect(getPrisonerContext(req.session, prisonNumber).qualificationLevelForm).toEqual(qualificationLevelForm)
    })

    it('should redirect to Qualification Level page given there is no Qualification Level form on the prisoner context', async () => {
      // Given
      getPrisonerContext(req.session, prisonNumber).qualificationLevelForm = undefined

      // When
      await controller.getQualificationDetailsView(req, res, next)

      // Then
      expect(res.redirect).toHaveBeenCalledWith(`/prisoners/A1234BC/education/${journeyId}/qualification-level`)
      expect(getPrisonerContext(req.session, prisonNumber).qualificationLevelForm).toBeUndefined()
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
      const qualificationLevelForm: QualificationLevelForm = {
        qualificationLevel: QualificationLevelValue.LEVEL_3,
      }
      getPrisonerContext(req.session, prisonNumber).qualificationLevelForm = qualificationLevelForm

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
      expect(res.redirect).toHaveBeenCalledWith(`/prisoners/A1234BC/education/${journeyId}/qualifications`)
      expect(req.journeyData.educationDto).toEqual(expectedEducationDto)
      expect(getPrisonerContext(req.session, prisonNumber).qualificationLevelForm).toBeUndefined()
      expect(getPrisonerContext(req.session, prisonNumber).qualificationDetailsForm).toBeUndefined()
    })
  })
})
