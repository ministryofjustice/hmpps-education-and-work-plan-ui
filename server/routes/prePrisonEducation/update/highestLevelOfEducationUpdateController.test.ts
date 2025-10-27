import { Request, Response } from 'express'
import { v4 as uuidV4 } from 'uuid'
import createError from 'http-errors'
import aValidPrisonerSummary from '../../../testsupport/prisonerSummaryTestDataBuilder'
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

  const journeyId = uuidV4()
  const prisonNumber = 'A1234BC'
  const prisonerSummary = aValidPrisonerSummary({ prisonNumber })
  const username = 'a-dps-user'

  const req = {
    session: {},
    journeyData: {},
    body: {},
    user: { username },
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
    res.locals.invalidData = undefined
  })

  describe('getHighestLevelOfEducationView', () => {
    it('should get the Highest Level of Education view given HighestLevelOfEducationForm is not on res.locals.invalidForm', async () => {
      // Given
      const educationDto = aValidEducationDto({
        prisonNumber,
        educationLevel: EducationLevelValue.FURTHER_EDUCATION_COLLEGE,
      })
      req.journeyData.educationDto = educationDto
      res.locals.invalidForm = undefined

      const expectedHighestLevelOfEducationForm = {
        educationLevel: EducationLevelValue.FURTHER_EDUCATION_COLLEGE,
      }

      const expectedView = {
        prisonerSummary,
        form: expectedHighestLevelOfEducationForm,
      }

      // When
      await controller.getHighestLevelOfEducationView(req, res, next)

      // Then
      expect(res.render).toHaveBeenCalledWith('pages/prePrisonEducation/highestLevelOfEducation', expectedView)
      expect(req.journeyData.educationDto).toEqual(educationDto)
    })

    it('should get the Highest Level of Education view given HighestLevelOfEducationForm is already on on res.locals.invalidForm', async () => {
      // Given
      const educationDto = aValidEducationDto({
        prisonNumber,
        educationLevel: EducationLevelValue.FURTHER_EDUCATION_COLLEGE,
      })
      req.journeyData.educationDto = educationDto

      const expectedHighestLevelOfEducationForm = {
        educationLevel: EducationLevelValue.SECONDARY_SCHOOL_TOOK_EXAMS,
      }
      res.locals.invalidForm = expectedHighestLevelOfEducationForm

      const expectedView = {
        prisonerSummary,
        form: expectedHighestLevelOfEducationForm,
      }

      // When
      await controller.getHighestLevelOfEducationView(req, res, next)

      // Then
      expect(res.render).toHaveBeenCalledWith('pages/prePrisonEducation/highestLevelOfEducation', expectedView)
      expect(req.journeyData.educationDto).toEqual(educationDto)
    })
  })

  describe('submitHighestLevelOfEducationForm', () => {
    it('should update Education given form is submitted', async () => {
      // Given
      const educationDto = aValidEducationDto({
        prisonNumber,
        educationLevel: EducationLevelValue.FURTHER_EDUCATION_COLLEGE,
      })
      req.journeyData.educationDto = educationDto

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
      expect(req.journeyData.educationDto).toBeUndefined()
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
      req.journeyData.educationDto = educationDto

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
      expect(req.journeyData.educationDto).toEqual(expectedEducationDto)
      expect(educationAndWorkPlanService.updateEducation).toHaveBeenCalledWith(
        prisonNumber,
        expectedUpdateEducationDto,
        username,
      )
    })
  })
})
