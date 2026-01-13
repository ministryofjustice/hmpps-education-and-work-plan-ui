import { Request, Response } from 'express'
import { v4 as uuidV4 } from 'uuid'
import type { EducationDto } from 'dto'
import aValidPrisonerSummary from '../../../testsupport/prisonerSummaryTestDataBuilder'
import EducationLevelValue from '../../../enums/educationLevelValue'
import HighestLevelOfEducationCreateController from './highestLevelOfEducationCreateController'

describe('highestLevelOfEducationCreateController', () => {
  const controller = new HighestLevelOfEducationCreateController()

  const journeyId = uuidV4()
  const prisonNumber = 'A1234BC'
  const prisonerSummary = aValidPrisonerSummary({ prisonNumber })

  const flash = jest.fn()
  const req = {
    session: {},
    journeyData: {},
    params: { prisonNumber, journeyId },
    flash,
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
    it('should get the Highest Level of Education view given there is no Highest Level of Education form on res.locals.invalidForm', async () => {
      // Given
      const educationDto = { prisonNumber } as EducationDto
      req.journeyData.educationDto = educationDto

      res.locals.invalidForm = undefined

      const expectedHighestLevelOfEducationForm = {
        educationLevel: undefined as EducationLevelValue,
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

    it('should get the Highest Level of Education view given a Highest Level of Education form is on res.locals.invalidForm', async () => {
      // Given
      const educationDto = { prisonNumber } as EducationDto
      req.journeyData.educationDto = educationDto

      const expectedHighestLevelOfEducationForm = {
        educationLevel: EducationLevelValue.FURTHER_EDUCATION_COLLEGE,
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
    it('should update EducationDto and redirect to Qualification Level page given valid form is submitted', async () => {
      // Given
      const educationDto = { prisonNumber } as EducationDto
      req.journeyData.educationDto = educationDto

      const highestLevelOfEducationForm = { educationLevel: EducationLevelValue.SECONDARY_SCHOOL_TOOK_EXAMS }
      req.body = highestLevelOfEducationForm

      const expectedEducationDto = {
        ...educationDto,
        educationLevel: EducationLevelValue.SECONDARY_SCHOOL_TOOK_EXAMS,
      }

      // When
      await controller.submitHighestLevelOfEducationForm(req, res, next)

      // Then
      expect(res.redirect).toHaveBeenCalledWith(`/prisoners/A1234BC/create-education/${journeyId}/qualification-level`)
      expect(req.journeyData.educationDto).toEqual(expectedEducationDto)
    })
  })
})
