import { Request, Response } from 'express'
import { v4 as uuidV4 } from 'uuid'
import type { EducationDto } from 'dto'
import type { QualificationDetailsForm, QualificationLevelForm } from 'forms'
import aValidPrisonerSummary from '../../../testsupport/prisonerSummaryTestDataBuilder'
import { getPrisonerContext } from '../../../data/session/prisonerContexts'
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
  })

  describe('getQualificationDetailsView', () => {
    it('should get the Qualification Details view given there is no Qualification Details form on the prisoner context', async () => {
      // Given
      const qualificationLevelForm: QualificationLevelForm = {
        qualificationLevel: QualificationLevelValue.LEVEL_3,
      }
      getPrisonerContext(req.session, prisonNumber).qualificationLevelForm = qualificationLevelForm
      getPrisonerContext(req.session, prisonNumber).qualificationDetailsForm = undefined

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
      expect(getPrisonerContext(req.session, prisonNumber).qualificationDetailsForm).toBeUndefined()
    })

    it('should get the Qualification Details view given a Qualification Details form is on the prisoner context', async () => {
      // Given
      const qualificationLevelForm: QualificationLevelForm = {
        qualificationLevel: QualificationLevelValue.LEVEL_3,
      }
      getPrisonerContext(req.session, prisonNumber).qualificationLevelForm = qualificationLevelForm

      const expectedQualificationDetailsForm: QualificationDetailsForm = {
        qualificationSubject: '',
        qualificationGrade: '',
      }
      getPrisonerContext(req.session, prisonNumber).qualificationDetailsForm = expectedQualificationDetailsForm

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
      expect(getPrisonerContext(req.session, prisonNumber).qualificationDetailsForm).toBeUndefined()
    })

    it('should redirect to Qualification Level page given there is no Qualification Level form on the prisoner context', async () => {
      // Given
      getPrisonerContext(req.session, prisonNumber).qualificationLevelForm = undefined
      getPrisonerContext(req.session, prisonNumber).qualificationDetailsForm = undefined

      // When
      await controller.getQualificationDetailsView(req, res, next)

      // Then
      expect(res.redirect).toHaveBeenCalledWith(`/prisoners/A1234BC/create-education/${journeyId}/qualification-level`)
      expect(getPrisonerContext(req.session, prisonNumber).qualificationLevelForm).toBeUndefined()
      expect(getPrisonerContext(req.session, prisonNumber).qualificationDetailsForm).toBeUndefined()
    })
  })

  describe('submitQualificationDetailsForm', () => {
    it('should redisplay Qualification Details page given form is submitted with validation errors', async () => {
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

      const invalidQualificationDetailsForm = {}
      req.body = invalidQualificationDetailsForm

      const expectedErrors = [
        { href: '#qualificationSubject', text: `Enter the subject of Jimmy Lightfingers's level 3 qualification` },
        { href: '#qualificationGrade', text: `Enter the grade of Jimmy Lightfingers's level 3 qualification` },
      ]

      // When
      await controller.submitQualificationDetailsForm(req, res, next)

      // Then
      expect(res.redirectWithErrors).toHaveBeenCalledWith(
        `/prisoners/A1234BC/create-education/${journeyId}/qualification-details`,
        expectedErrors,
      )
      expect(req.journeyData.educationDto).toEqual(educationDto)
      expect(getPrisonerContext(req.session, prisonNumber).qualificationLevelForm).toEqual(qualificationLevelForm)
      expect(getPrisonerContext(req.session, prisonNumber).qualificationDetailsForm).toEqual(
        invalidQualificationDetailsForm,
      )
    })

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
      expect(res.redirect).toHaveBeenCalledWith(`/prisoners/A1234BC/create-education/${journeyId}/qualifications`)
      expect(req.journeyData.educationDto).toEqual(expectedEducationDto)
      expect(getPrisonerContext(req.session, prisonNumber).qualificationLevelForm).toBeUndefined()
      expect(getPrisonerContext(req.session, prisonNumber).qualificationDetailsForm).toBeUndefined()
    })
  })
})
