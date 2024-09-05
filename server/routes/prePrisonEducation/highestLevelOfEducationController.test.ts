import { Request, Response } from 'express'
import type { EducationDto } from 'dto'
import aValidPrisonerSummary from '../../testsupport/prisonerSummaryTestDataBuilder'
import HighestLevelOfEducationController from './highestLevelOfEducationController'
import EducationLevelValue from '../../enums/educationLevelValue'
import getPrisonerContext from '../../data/session/prisonerContexts'

describe('highestLevelOfEducationController', () => {
  const controller = new HighestLevelOfEducationController()

  let req: Request
  const res = {
    redirect: jest.fn(),
    redirectWithErrors: jest.fn(),
    render: jest.fn(),
  } as unknown as Response
  const next = jest.fn()

  const prisonNumber = 'A1234BC'
  const prisonerSummary = aValidPrisonerSummary(prisonNumber)

  beforeEach(() => {
    jest.resetAllMocks()

    req = {
      session: { prisonerSummary },
      body: {},
      user: {},
      params: { prisonNumber },
      query: {},
    } as unknown as Request
  })

  describe('getHighestLevelOfEducationView', () => {
    it('should get the Highest Level of Education view given there is no Highest Level of Education form on the prisoner context', async () => {
      // Given
      const educationDto = { prisonNumber } as EducationDto
      getPrisonerContext(req.session, prisonNumber).educationDto = educationDto

      getPrisonerContext(req.session, prisonNumber).highestLevelOfEducationForm = undefined

      const expectedHighestLevelOfEducationForm = {
        educationLevel: undefined as EducationLevelValue,
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

    it('should get the Highest Level of Education view given a Highest Level of Education form is on the prisoner context', async () => {
      // Given
      const educationDto = { prisonNumber } as EducationDto
      getPrisonerContext(req.session, prisonNumber).educationDto = educationDto

      const expectedHighestLevelOfEducationForm = {
        educationLevel: EducationLevelValue.FURTHER_EDUCATION_COLLEGE,
      }
      getPrisonerContext(req.session, prisonNumber).highestLevelOfEducationForm = expectedHighestLevelOfEducationForm

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
      expect(req.session.highestLevelOfEducationForm).toBeUndefined()
      expect(getPrisonerContext(req.session, prisonNumber).educationDto).toEqual(educationDto)
      expect(getPrisonerContext(req.session, prisonNumber).highestLevelOfEducationForm).toBeUndefined()
    })
  })

  describe('submitHighestLevelOfEducationForm', () => {
    it('should not update EducationDto given form is submitted with validation errors', async () => {
      // Given
      const educationDto = { prisonNumber } as EducationDto
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
        '/prisoners/A1234BC/highest-level-of-education',
        expectedErrors,
      )
      expect(getPrisonerContext(req.session, prisonNumber).educationDto).toEqual(educationDto)
      expect(getPrisonerContext(req.session, prisonNumber).highestLevelOfEducationForm).toEqual(
        invalidHighestLevelOfEducationForm,
      )
    })

    it('should update EducationDto and redirect to Qualification Level page given valid form is submitted', async () => {
      // Given
      const educationDto = { prisonNumber } as EducationDto
      getPrisonerContext(req.session, prisonNumber).educationDto = educationDto

      const highestLevelOfEducationForm = { educationLevel: EducationLevelValue.SECONDARY_SCHOOL_TOOK_EXAMS }
      req.body = highestLevelOfEducationForm

      const expectedEducationDto = {
        ...educationDto,
        educationLevel: EducationLevelValue.SECONDARY_SCHOOL_TOOK_EXAMS,
      }

      // When
      await controller.submitHighestLevelOfEducationForm(req, res, next)

      // Then
      expect(res.redirect).toHaveBeenCalledWith('/prisoners/A1234BC/qualification-level')
      expect(getPrisonerContext(req.session, prisonNumber).educationDto).toEqual(expectedEducationDto)
      expect(getPrisonerContext(req.session, prisonNumber).highestLevelOfEducationForm).toBeUndefined()
    })
  })
})
