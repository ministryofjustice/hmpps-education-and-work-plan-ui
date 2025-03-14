import { Request, Response } from 'express'
import aValidPrisonerSummary from '../../../testsupport/prisonerSummaryTestDataBuilder'
import QualificationDetailsCreateController from './qualificationDetailsCreateController'
import { aValidInductionDto } from '../../../testsupport/inductionDtoTestDataBuilder'
import QualificationLevelValue from '../../../enums/qualificationLevelValue'

describe('qualificationDetailsCreateController', () => {
  const controller = new QualificationDetailsCreateController()

  const prisonNumber = 'A1234BC'
  const prisonerSummary = aValidPrisonerSummary()

  const req = {
    session: {},
    body: {},
    params: { prisonNumber },
    path: `/prisoners/${prisonNumber}/create-induction/qualification-details`,
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
    req.session.qualificationLevelForm = undefined
    req.session.qualificationDetailsForm = undefined
    req.body = {}
  })

  describe('getQualificationDetailsView', () => {
    it('should get the Qualification Details view given there is no QualificationDetailsForm on the session', async () => {
      // Given
      const inductionDto = aValidInductionDto()
      inductionDto.previousQualifications.qualifications = undefined
      req.session.inductionDto = inductionDto
      const qualificationLevelForm = { qualificationLevel: QualificationLevelValue.LEVEL_3 }
      req.session.qualificationLevelForm = qualificationLevelForm

      req.session.qualificationDetailsForm = undefined
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
      expect(req.session.qualificationDetailsForm).toBeUndefined()
      expect(req.session.inductionDto).toEqual(inductionDto)
    })

    it('should get the Qualification Details view given there is a QualificationDetailsForm already on the session', async () => {
      // Given
      const inductionDto = aValidInductionDto()
      inductionDto.previousQualifications.qualifications = undefined
      req.session.inductionDto = inductionDto
      const qualificationLevelForm = {
        qualificationLevel: QualificationLevelValue.LEVEL_3,
      }
      req.session.qualificationLevelForm = qualificationLevelForm

      const expectedQualificationDetailsForm = {
        qualificationSubject: '',
        qualificationGrade: '',
      }
      req.session.qualificationDetailsForm = expectedQualificationDetailsForm

      const expectedView = {
        prisonerSummary,
        form: expectedQualificationDetailsForm,
        qualificationLevel: QualificationLevelValue.LEVEL_3,
      }

      // When
      await controller.getQualificationDetailsView(req, res, next)

      // Then
      expect(res.render).toHaveBeenCalledWith('pages/prePrisonEducation/qualificationDetails', expectedView)
      expect(req.session.qualificationDetailsForm).toBeUndefined()
      expect(req.session.inductionDto).toEqual(inductionDto)
    })
  })

  describe('submitQualificationDetailsForm', () => {
    it('should not proceed to qualifications page given form submitted with validation errors', async () => {
      // Given
      const inductionDto = aValidInductionDto()
      inductionDto.previousQualifications.qualifications = undefined
      req.session.inductionDto = inductionDto
      const qualificationLevelForm = {
        qualificationLevel: QualificationLevelValue.LEVEL_3,
      }
      req.session.qualificationLevelForm = qualificationLevelForm

      const invalidQualificationDetailsForm = {
        qualificationSubject: '',
        qualificationGrade: 'A',
      }
      req.body = invalidQualificationDetailsForm
      req.session.qualificationDetailsForm = undefined

      const expectedErrors = [
        {
          href: '#qualificationSubject',
          text: `Enter the subject of Jimmy Lightfingers's level 3 qualification`,
        },
      ]

      // When
      await controller.submitQualificationDetailsForm(req, res, next)

      // Then
      expect(res.redirectWithErrors).toHaveBeenCalledWith(
        `/prisoners/${prisonNumber}/create-induction/qualification-details`,
        expectedErrors,
      )
      expect(req.session.qualificationDetailsForm).toEqual(invalidQualificationDetailsForm)
      expect(req.session.qualificationLevelForm).toEqual(qualificationLevelForm)
      expect(req.session.inductionDto).toEqual(inductionDto)
    })

    it('should proceed to qualifications page', async () => {
      // Given
      const inductionDto = aValidInductionDto()
      inductionDto.previousQualifications.qualifications = undefined
      req.session.inductionDto = inductionDto

      const qualificationLevelForm = {
        qualificationLevel: QualificationLevelValue.LEVEL_3,
      }
      req.session.qualificationLevelForm = qualificationLevelForm

      const qualificationDetailsForm = {
        qualificationSubject: 'Maths',
        qualificationGrade: 'A',
      }
      req.body = qualificationDetailsForm
      req.session.qualificationDetailsForm = undefined

      // When
      await controller.submitQualificationDetailsForm(req, res, next)

      // Then
      const updatedInduction = req.session.inductionDto
      expect(updatedInduction.previousQualifications.qualifications).toEqual([
        { subject: 'Maths', grade: 'A', level: QualificationLevelValue.LEVEL_3 },
      ])
      expect(res.redirect).toHaveBeenCalledWith(`/prisoners/${prisonNumber}/create-induction/qualifications`)
      expect(req.session.qualificationDetailsForm).toBeUndefined()
      expect(req.session.qualificationLevelForm).toBeUndefined()
    })
  })
})
