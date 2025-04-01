import { Request, Response } from 'express'
import aValidPrisonerSummary from '../../../testsupport/prisonerSummaryTestDataBuilder'
import QualificationDetailsCreateController from './qualificationDetailsCreateController'
import { aValidInductionDto } from '../../../testsupport/inductionDtoTestDataBuilder'
import QualificationLevelValue from '../../../enums/qualificationLevelValue'
import { getPrisonerContext } from '../../../data/session/prisonerContexts'

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
    getPrisonerContext(req.session, prisonNumber).qualificationLevelForm = undefined
    getPrisonerContext(req.session, prisonNumber).qualificationDetailsForm = undefined
    req.body = {}
  })

  describe('getQualificationDetailsView', () => {
    it('should get the Qualification Details view given there is no QualificationDetailsForm on the session', async () => {
      // Given
      const inductionDto = aValidInductionDto()
      inductionDto.previousQualifications.qualifications = undefined
      getPrisonerContext(req.session, prisonNumber).inductionDto = inductionDto
      const qualificationLevelForm = { qualificationLevel: QualificationLevelValue.LEVEL_3 }
      getPrisonerContext(req.session, prisonNumber).qualificationLevelForm = qualificationLevelForm

      getPrisonerContext(req.session, prisonNumber).qualificationDetailsForm = undefined
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
      expect(getPrisonerContext(req.session, prisonNumber).qualificationDetailsForm).toBeUndefined()
      expect(getPrisonerContext(req.session, prisonNumber).inductionDto).toEqual(inductionDto)
    })

    it('should get the Qualification Details view given there is a QualificationDetailsForm already on the session', async () => {
      // Given
      const inductionDto = aValidInductionDto()
      inductionDto.previousQualifications.qualifications = undefined
      getPrisonerContext(req.session, prisonNumber).inductionDto = inductionDto
      const qualificationLevelForm = {
        qualificationLevel: QualificationLevelValue.LEVEL_3,
      }
      getPrisonerContext(req.session, prisonNumber).qualificationLevelForm = qualificationLevelForm

      const expectedQualificationDetailsForm = {
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
      expect(getPrisonerContext(req.session, prisonNumber).qualificationDetailsForm).toBeUndefined()
      expect(getPrisonerContext(req.session, prisonNumber).inductionDto).toEqual(inductionDto)
    })
  })

  describe('submitQualificationDetailsForm', () => {
    it('should not proceed to qualifications page given form submitted with validation errors', async () => {
      // Given
      const inductionDto = aValidInductionDto()
      inductionDto.previousQualifications.qualifications = undefined
      getPrisonerContext(req.session, prisonNumber).inductionDto = inductionDto
      const qualificationLevelForm = {
        qualificationLevel: QualificationLevelValue.LEVEL_3,
      }
      getPrisonerContext(req.session, prisonNumber).qualificationLevelForm = qualificationLevelForm

      const invalidQualificationDetailsForm = {
        qualificationSubject: '',
        qualificationGrade: 'A',
      }
      req.body = invalidQualificationDetailsForm
      getPrisonerContext(req.session, prisonNumber).qualificationDetailsForm = undefined

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
      expect(getPrisonerContext(req.session, prisonNumber).qualificationDetailsForm).toEqual(
        invalidQualificationDetailsForm,
      )
      expect(getPrisonerContext(req.session, prisonNumber).qualificationLevelForm).toEqual(qualificationLevelForm)
      expect(getPrisonerContext(req.session, prisonNumber).inductionDto).toEqual(inductionDto)
    })

    it('should proceed to qualifications page', async () => {
      // Given
      const inductionDto = aValidInductionDto()
      inductionDto.previousQualifications.qualifications = undefined
      getPrisonerContext(req.session, prisonNumber).inductionDto = inductionDto

      const qualificationLevelForm = {
        qualificationLevel: QualificationLevelValue.LEVEL_3,
      }
      getPrisonerContext(req.session, prisonNumber).qualificationLevelForm = qualificationLevelForm

      const qualificationDetailsForm = {
        qualificationSubject: 'Maths',
        qualificationGrade: 'A',
      }
      req.body = qualificationDetailsForm
      getPrisonerContext(req.session, prisonNumber).qualificationDetailsForm = undefined

      // When
      await controller.submitQualificationDetailsForm(req, res, next)

      // Then
      const updatedInduction = getPrisonerContext(req.session, prisonNumber).inductionDto
      expect(updatedInduction.previousQualifications.qualifications).toEqual([
        { subject: 'Maths', grade: 'A', level: QualificationLevelValue.LEVEL_3 },
      ])
      expect(res.redirect).toHaveBeenCalledWith(`/prisoners/${prisonNumber}/create-induction/qualifications`)
      expect(getPrisonerContext(req.session, prisonNumber).qualificationDetailsForm).toBeUndefined()
      expect(getPrisonerContext(req.session, prisonNumber).qualificationLevelForm).toBeUndefined()
    })
  })
})
