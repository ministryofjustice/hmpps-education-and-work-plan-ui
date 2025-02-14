import { Request, Response } from 'express'
import createError from 'http-errors'
import aValidPrisonerSummary from '../../../testsupport/prisonerSummaryTestDataBuilder'
import { getPrisonerContext } from '../../../data/session/prisonerContexts'
import EducationLevelValue from '../../../enums/educationLevelValue'
import HighestLevelOfEducationUpdateController from './highestLevelOfEducationUpdateController'
import EducationAndWorkPlanService from '../../../services/educationAndWorkPlanService'
import aValidEducationDto from '../../../testsupport/educationDtoTestDataBuilder'
import aValidUpdateEducationDto from '../../../testsupport/updateEducationDtoTestDataBuilder'

jest.mock('../../../services/educationAndWorkPlanService')

describe('highestLevelOfEducationUpdateController', () => {
  const educationAndWorkPlanService = new EducationAndWorkPlanService(
    null,
    null,
    null,
  ) as jest.Mocked<EducationAndWorkPlanService>
  const controller = new HighestLevelOfEducationUpdateController(educationAndWorkPlanService)

  const prisonNumber = 'A1234BC'
  const prisonerSummary = aValidPrisonerSummary({ prisonNumber })
  const username = 'a-dps-user'

  const req = {
    session: {},
    body: {},
    user: { username },
    params: { prisonNumber },
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
    req.session.prisonerContexts = undefined
    req.body = {}
  })

  describe('getHighestLevelOfEducationView', () => {
    it('should get the Highest Level of Education view', async () => {
      // Given
      const educationDto = aValidEducationDto({
        prisonNumber,
        educationLevel: EducationLevelValue.FURTHER_EDUCATION_COLLEGE,
      })
      getPrisonerContext(req.session, prisonNumber).educationDto = educationDto

      const expectedHighestLevelOfEducationForm = {
        educationLevel: EducationLevelValue.FURTHER_EDUCATION_COLLEGE,
      }

      const expectedView = {
        prisonerSummary,
        form: expectedHighestLevelOfEducationForm,
        backLinkUrl: '/plan/A1234BC/view/education-and-training',
        backLinkAriaText: `Back to Jimmy Lightfingers's learning and work progress`,
      }

      // When
      await controller.getHighestLevelOfEducationView(req, res, next)

      // Then
      expect(res.render).toHaveBeenCalledWith('pages/prePrisonEducation/highestLevelOfEducation', expectedView)
      expect(getPrisonerContext(req.session, prisonNumber).educationDto).toEqual(educationDto)
      expect(getPrisonerContext(req.session, prisonNumber).highestLevelOfEducationForm).toBeUndefined()
    })
  })

  describe('submitHighestLevelOfEducationForm', () => {
    it('should not update EducationDto given form is submitted with validation errors', async () => {
      // Given
      const educationDto = aValidEducationDto({
        prisonNumber,
        educationLevel: EducationLevelValue.FURTHER_EDUCATION_COLLEGE,
      })
      getPrisonerContext(req.session, prisonNumber).educationDto = educationDto

      const invalidHighestLevelOfEducationForm = {}
      req.body = invalidHighestLevelOfEducationForm

      const expectedErrors = [
        { href: '#educationLevel', text: `Select Jimmy Lightfingers's highest level of education` },
      ]

      // When
      await controller.submitHighestLevelOfEducationForm(req, res, next)

      // Then
      expect(res.redirectWithErrors).toHaveBeenCalledWith(
        '/prisoners/A1234BC/education/highest-level-of-education',
        expectedErrors,
      )
      expect(getPrisonerContext(req.session, prisonNumber).educationDto).toEqual(educationDto)
      expect(getPrisonerContext(req.session, prisonNumber).highestLevelOfEducationForm).toEqual(
        invalidHighestLevelOfEducationForm,
      )
    })

    it('should update Education given form is submitted without validation errors', async () => {
      // Given
      const educationDto = aValidEducationDto({
        prisonNumber,
        educationLevel: EducationLevelValue.FURTHER_EDUCATION_COLLEGE,
      })
      getPrisonerContext(req.session, prisonNumber).educationDto = educationDto

      const highestLevelOfEducationForm = { educationLevel: EducationLevelValue.SECONDARY_SCHOOL_TOOK_EXAMS }
      req.body = highestLevelOfEducationForm

      const expectedUpdateEducationDto = aValidUpdateEducationDto({
        prisonId: 'BXI',
        reference: educationDto.reference,
        educationLevel: EducationLevelValue.SECONDARY_SCHOOL_TOOK_EXAMS,
        qualifications: educationDto.qualifications.map(qualification => ({
          reference: qualification.reference,
          subject: qualification.subject,
          level: qualification.level,
          grade: qualification.grade,
        })),
      })

      // When
      await controller.submitHighestLevelOfEducationForm(req, res, next)

      // Then
      expect(res.redirect).toHaveBeenCalledWith('/plan/A1234BC/view/education-and-training')
      expect(getPrisonerContext(req.session, prisonNumber).educationDto).toBeUndefined()
      expect(getPrisonerContext(req.session, prisonNumber).highestLevelOfEducationForm).toBeUndefined()
      expect(educationAndWorkPlanService.updateEducation).toHaveBeenCalledWith(
        prisonNumber,
        expectedUpdateEducationDto,
        username,
      )
    })

    it('should not update Education given given error calling service', async () => {
      // Given
      const educationDto = aValidEducationDto({
        prisonNumber,
        educationLevel: EducationLevelValue.FURTHER_EDUCATION_COLLEGE,
      })
      getPrisonerContext(req.session, prisonNumber).educationDto = educationDto

      const highestLevelOfEducationForm = { educationLevel: EducationLevelValue.SECONDARY_SCHOOL_TOOK_EXAMS }
      req.body = highestLevelOfEducationForm

      const expectedUpdateEducationDto = aValidUpdateEducationDto({
        prisonId: 'BXI',
        reference: educationDto.reference,
        educationLevel: EducationLevelValue.SECONDARY_SCHOOL_TOOK_EXAMS,
        qualifications: educationDto.qualifications.map(qualification => ({
          reference: qualification.reference,
          subject: qualification.subject,
          level: qualification.level,
          grade: qualification.grade,
        })),
      })

      educationAndWorkPlanService.updateEducation.mockRejectedValue(createError(500, 'Service unavailable'))
      const expectedError = createError(
        500,
        `Error updating Education for prisoner ${prisonNumber}. Error: InternalServerError: Service unavailable`,
      )

      const expectedEducationDto = {
        ...educationDto,
        educationLevel: EducationLevelValue.SECONDARY_SCHOOL_TOOK_EXAMS,
      }

      // When
      await controller.submitHighestLevelOfEducationForm(req, res, next)

      // Then
      expect(next).toHaveBeenCalledWith(expectedError)
      expect(getPrisonerContext(req.session, prisonNumber).educationDto).toEqual(expectedEducationDto)
      expect(getPrisonerContext(req.session, prisonNumber).highestLevelOfEducationForm).toBeUndefined()
      expect(educationAndWorkPlanService.updateEducation).toHaveBeenCalledWith(
        prisonNumber,
        expectedUpdateEducationDto,
        username,
      )
    })
  })
})
