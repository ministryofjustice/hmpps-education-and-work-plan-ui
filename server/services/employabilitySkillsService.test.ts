import { parseISO, startOfDay } from 'date-fns'
import EducationAndWorkPlanClient from '../data/educationAndWorkPlanClient'
import EmployabilitySkillsService from './employabilitySkillsService'
import {
  anEmployabilitySkillResponseDto,
  anEmployabilitySkillsList,
} from '../testsupport/employabilitySkillResponseDtoTestDataBuilder'
import {
  aGetEmployabilitySkillResponses,
  aGetEmployabilitySkillsResponse,
} from '../testsupport/getEmployabilitySkillResponsesTestDataBuilder'
import EmployabilitySkillsValue from '../enums/employabilitySkillsValue'
import EmployabilitySkillRatingValue from '../enums/employabilitySkillRatingValue'
import aCreateEmployabilitySkillDto from '../testsupport/ createEmployabilitySkillDtoTestDataBuilder'
import {
  aCreateEmployabilitySkillRequest,
  aCreateEmployabilitySkillsRequest,
} from '../testsupport/createEmployabilitySkillsRequestTestDataBuilder'

jest.mock('../data/educationAndWorkPlanClient')

describe('employabilitySkillsService', () => {
  const educationAndWorkPlanClient = new EducationAndWorkPlanClient(null) as jest.Mocked<EducationAndWorkPlanClient>
  const employabilitySkillsService = new EmployabilitySkillsService(educationAndWorkPlanClient)

  const username = 'a-dps-user'
  const prisonNumber = 'A1234BC'

  beforeEach(() => {
    jest.resetAllMocks()
  })

  describe('getEmployabilitySkills', () => {
    it('should get employability skills', async () => {
      // Given
      const apiResponse = aGetEmployabilitySkillResponses({
        employabilitySkills: [
          aGetEmployabilitySkillsResponse({
            employabilitySkillType: EmployabilitySkillsValue.ORGANISATION,
            employabilitySkillRating: EmployabilitySkillRatingValue.QUITE_CONFIDENT,
            activityName: 'E Wing Servery',
            evidence: 'Supervisor has reported this',
            conversationDate: '2026-01-26',
            createdBy: 'asmith_gen',
            createdByDisplayName: 'Alex Smith',
            createdAt: '2023-06-19T09:39:44Z',
            createdAtPrison: 'MDI',
            updatedBy: 'asmith_gen',
            updatedByDisplayName: 'Alex Smith',
            updatedAt: '2023-06-19T09:39:44Z',
            updatedAtPrison: 'MDI',
          }),
        ],
      })
      educationAndWorkPlanClient.getEmployabilitySkills.mockResolvedValue(apiResponse)

      const expected = anEmployabilitySkillsList({
        prisonNumber,
        employabilitySkills: [
          anEmployabilitySkillResponseDto({
            employabilitySkillType: EmployabilitySkillsValue.ORGANISATION,
            employabilitySkillRating: EmployabilitySkillRatingValue.QUITE_CONFIDENT,
            activityName: 'E Wing Servery',
            evidence: 'Supervisor has reported this',
            conversationDate: startOfDay('2026-01-26'),
            createdAt: parseISO('2023-06-19T09:39:44Z'),
            createdAtPrison: 'MDI',
            createdBy: 'asmith_gen',
            createdByDisplayName: 'Alex Smith',
            updatedAt: parseISO('2023-06-19T09:39:44Z'),
            updatedAtPrison: 'MDI',
            updatedBy: 'asmith_gen',
            updatedByDisplayName: 'Alex Smith',
          }),
        ],
      })

      // When
      const actual = await employabilitySkillsService.getEmployabilitySkills(username, prisonNumber)

      // Then
      expect(actual).toEqual(expected)
      expect(educationAndWorkPlanClient.getEmployabilitySkills).toHaveBeenCalledWith(prisonNumber, username)
    })

    it('should return empty EmployabilitySkillsList given API returns null', async () => {
      // Given
      educationAndWorkPlanClient.getEmployabilitySkills.mockResolvedValue(null)

      const expectedConditionsList = anEmployabilitySkillsList({
        prisonNumber,
        employabilitySkills: [],
      })

      // When
      const actual = await employabilitySkillsService.getEmployabilitySkills(username, prisonNumber)

      // Then
      expect(actual).toEqual(expectedConditionsList)
      expect(educationAndWorkPlanClient.getEmployabilitySkills).toHaveBeenCalledWith(prisonNumber, username)
    })

    it('should rethrow error given API client throws error', async () => {
      // Given
      const expectedError = new Error('Internal Server Error')
      educationAndWorkPlanClient.getEmployabilitySkills.mockRejectedValue(expectedError)

      // When
      const actual = await employabilitySkillsService.getEmployabilitySkills(username, prisonNumber).catch(e => e)

      // Then
      expect(actual).toEqual(expectedError)
      expect(educationAndWorkPlanClient.getEmployabilitySkills).toHaveBeenCalledWith(prisonNumber, username)
    })
  })

  describe('createEmployabilitySkills', () => {
    it('should create Employability Skills', async () => {
      // Given
      const employabilitySkillDtos = [
        aCreateEmployabilitySkillDto({
          prisonId: 'BXI',
          employabilitySkillType: EmployabilitySkillsValue.ORGANISATION,
          employabilitySkillRating: EmployabilitySkillRatingValue.QUITE_CONFIDENT,
          activityName: 'E Wing Servery',
          evidence: 'Supervisor has reported this',
          conversationDate: startOfDay('2026-01-26'),
        }),
      ]

      const expectedCreateEmployabilitySkillRequest = aCreateEmployabilitySkillsRequest({
        employabilitySkills: [
          aCreateEmployabilitySkillRequest({
            prisonId: 'BXI',
            employabilitySkillType: EmployabilitySkillsValue.ORGANISATION,
            employabilitySkillRating: EmployabilitySkillRatingValue.QUITE_CONFIDENT,
            activityName: 'E Wing Servery',
            evidence: 'Supervisor has reported this',
            conversationDate: '2026-01-26',
          }),
        ],
      })

      // When
      await employabilitySkillsService.createEmployabilitySkills(prisonNumber, employabilitySkillDtos, username)

      // Then
      expect(educationAndWorkPlanClient.createEmployabilitySkills).toHaveBeenCalledWith(
        prisonNumber,
        expectedCreateEmployabilitySkillRequest,
        username,
      )
    })

    it('should not create Employability Skills given educationAndWorkPlanClient returns an error', async () => {
      // Given
      const expectedError = new Error('Internal Server Error')
      educationAndWorkPlanClient.createEmployabilitySkills.mockRejectedValue(expectedError)

      const employabilitySkillDtos = [aCreateEmployabilitySkillDto()]

      // When
      const actual = await employabilitySkillsService
        .createEmployabilitySkills(prisonNumber, employabilitySkillDtos, username)
        .catch(e => e)

      // Then
      expect(actual).toEqual(expectedError)
    })
  })
})
