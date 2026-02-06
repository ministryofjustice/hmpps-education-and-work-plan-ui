import { Request, Response } from 'express'
import type { CreateEmployabilitySkillDto } from 'dto'
import AddEmployabilitySkillRatingsController from './addEmployabilitySkillRatingsController'
import AuditService from '../../../services/auditService'
import EmployabilitySkillsService from '../../../services/employabilitySkillsService'
import aCreateEmployabilitySkillDto from '../../../testsupport/ createEmployabilitySkillDtoTestDataBuilder'
import aValidPrisonerSummary from '../../../testsupport/prisonerSummaryTestDataBuilder'
import EmployabilitySkillsValue from '../../../enums/employabilitySkillsValue'
import EmployabilitySkillRatingValue from '../../../enums/employabilitySkillRatingValue'

jest.mock('../../../services/auditService')
jest.mock('../../../services/employabilitySkillsService')

describe('addEmployabilitySkillRatingsController', () => {
  const auditService = new AuditService(null) as jest.Mocked<AuditService>
  const employabilitySkillsService = new EmployabilitySkillsService(null) as jest.Mocked<EmployabilitySkillsService>
  const controller = new AddEmployabilitySkillRatingsController(employabilitySkillsService, auditService)

  const requestId = 'request_id'
  const username = 'FRED_123'
  const prisonNumber = 'A1234BC'
  const prisonerSummary = aValidPrisonerSummary({ prisonNumber })
  const skillType = EmployabilitySkillsValue.PROBLEM_SOLVING

  const flash = jest.fn()
  const apiErrorCallback = jest.fn()
  const req = {
    session: {},
    user: { username },
    journeyData: {},
    body: {},
    params: { prisonNumber, skillType },
    id: requestId,
    flash,
  } as unknown as Request
  const res = {
    redirect: jest.fn(),
    redirectWithSuccess: jest.fn(),
    render: jest.fn(),
    locals: { prisonerSummary, apiErrorCallback },
  } as unknown as Response
  const next = jest.fn()

  beforeEach(() => {
    jest.resetAllMocks()
    req.body = {}
    req.journeyData.createEmployabilitySkillDto = aCreateEmployabilitySkillDto()
  })

  describe('getEmployabilitySkillRatingsView', () => {
    it('should render the view when there is no previously submitted invalid form and an empty DTO', async () => {
      // Given
      res.locals.invalidForm = undefined
      req.journeyData.createEmployabilitySkillDto = { prisonId: 'BXI' } as CreateEmployabilitySkillDto

      const expectedForm = {
        rating: undefined as string,
        evidence: undefined as string,
      }

      const expectedViewTemplate = 'pages/employabilitySkills/add/employability-skill-ratings.njk'
      const expectedViewModel = {
        form: expectedForm,
        prisonerSummary,
        skillType,
      }

      // When
      await controller.getEmployabilitySkillRatingsView(req, res, next)

      // Then
      expect(res.render).toHaveBeenCalledWith(expectedViewTemplate, expectedViewModel)
    })

    it('should render the view when there is no previously submitted invalid form and a populated DTO', async () => {
      // Given
      res.locals.invalidForm = undefined
      req.journeyData.createEmployabilitySkillDto = aCreateEmployabilitySkillDto({
        employabilitySkillRating: EmployabilitySkillRatingValue.QUITE_CONFIDENT,
        evidence: 'Supervisor has reported this',
      })

      const expectedForm = {
        rating: 'QUITE_CONFIDENT',
        evidence: 'Supervisor has reported this',
      }

      const expectedViewTemplate = 'pages/employabilitySkills/add/employability-skill-ratings.njk'
      const expectedViewModel = {
        form: expectedForm,
        prisonerSummary,
        skillType,
      }

      // When
      await controller.getEmployabilitySkillRatingsView(req, res, next)

      // Then
      expect(res.render).toHaveBeenCalledWith(expectedViewTemplate, expectedViewModel)
    })

    it('should render view given previously submitted invalid form', async () => {
      // Given
      const invalidForm = {
        rating: ['not-a-valid-value'],
      }
      res.locals.invalidForm = invalidForm

      const expectedViewTemplate = 'pages/employabilitySkills/add/employability-skill-ratings.njk'
      const expectedViewModel = {
        form: invalidForm,
        prisonerSummary,
        skillType,
      }

      // When
      await controller.getEmployabilitySkillRatingsView(req, res, next)

      // Then
      expect(res.render).toHaveBeenCalledWith(expectedViewTemplate, expectedViewModel)
    })
  })

  describe('submitEmployabilitySkillRatingsForm', () => {
    it('should submit form and redirect to next route given calling API is successful', async () => {
      // Given
      req.journeyData.createEmployabilitySkillDto = { prisonId: 'BXI' } as CreateEmployabilitySkillDto
      req.body = {
        rating: 'QUITE_CONFIDENT',
        evidence: 'Supervisor has reported this',
      }

      const expectedNextRoute = `/plan/${prisonNumber}/view/employability-skills`
      const expectedEmployabilitySkillDtos = [
        {
          prisonId: 'BXI',
          employabilitySkillType: EmployabilitySkillsValue.PROBLEM_SOLVING,
          employabilitySkillRating: EmployabilitySkillRatingValue.QUITE_CONFIDENT,
          evidence: 'Supervisor has reported this',
        },
      ]

      // When
      await controller.submitEmployabilitySkillRatingsForm(req, res, next)

      // Then
      expect(res.redirectWithSuccess).toHaveBeenCalledWith(expectedNextRoute, 'Problem solving skill updated')
      expect(req.journeyData.createEmployabilitySkillDto).toBeUndefined()
      expect(flash).toHaveBeenCalledWith('pendingRedirectAtEndOfJourney', 'true')
      expect(employabilitySkillsService.createEmployabilitySkills).toHaveBeenCalledWith(
        prisonNumber,
        expectedEmployabilitySkillDtos,
        username,
      )
      expect(auditService.logAddEmployabilitySkillRating).toHaveBeenCalledWith(
        expect.objectContaining({
          details: { skillType },
          subjectId: prisonNumber,
          subjectType: 'PRISONER_ID',
          who: username,
          correlationId: requestId,
        }),
      )
    })

    it('should submit form and redirect to next route given calling API is not successful', async () => {
      // Given
      const createEmployabilitySkillDto = { prisonId: 'BXI' } as CreateEmployabilitySkillDto
      req.journeyData.createEmployabilitySkillDto = createEmployabilitySkillDto
      req.body = {
        rating: 'QUITE_CONFIDENT',
        evidence: 'Supervisor has reported this',
      }

      employabilitySkillsService.createEmployabilitySkills.mockRejectedValue(new Error('Internal Server Error'))

      const expectedEmployabilitySkillDtos = [
        {
          prisonId: 'BXI',
          employabilitySkillType: EmployabilitySkillsValue.PROBLEM_SOLVING,
          employabilitySkillRating: EmployabilitySkillRatingValue.QUITE_CONFIDENT,
          evidence: 'Supervisor has reported this',
        },
      ]
      const expectedNextRoute = 'add'

      // When
      await controller.submitEmployabilitySkillRatingsForm(req, res, next)

      // Then
      expect(res.redirect).toHaveBeenCalledWith(expectedNextRoute)
      expect(req.journeyData.createEmployabilitySkillDto).toEqual(createEmployabilitySkillDto)
      expect(flash).toHaveBeenCalledWith('pageHasApiErrors', 'true')
      expect(employabilitySkillsService.createEmployabilitySkills).toHaveBeenCalledWith(
        prisonNumber,
        expectedEmployabilitySkillDtos,
        username,
      )
      expect(auditService.logAddEmployabilitySkillRating).not.toHaveBeenCalled()
    })
  })
})
