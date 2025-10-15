import { parseISO } from 'date-fns'
import SupportAdditionalNeedsService from './supportAdditionalNeedsService'
import SupportAdditionalNeedsApiClient from '../data/supportAdditionalNeedsApiClient'
import { aValidConditionListResponse } from '../testsupport/conditionResponseTestDataBuilder'
import { aValidConditionsList } from '../testsupport/conditionDtoTestDataBuilder'
import ConditionType from '../enums/conditionType'
import ConditionSource from '../enums/conditionSource'

jest.mock('../data/supportAdditionalNeedsApiClient')

describe('supportAdditionalNeedsService', () => {
  const supportAdditionalNeedsApiClient = new SupportAdditionalNeedsApiClient(
    null,
  ) as jest.Mocked<SupportAdditionalNeedsApiClient>
  const supportAdditionalNeedsService = new SupportAdditionalNeedsService(supportAdditionalNeedsApiClient)

  const prisonNumber = 'A1234BC'
  const username = 'some-username'

  beforeEach(() => {
    jest.resetAllMocks()
  })

  describe('getConditions', () => {
    describe('getConditions', () => {
      it('should get conditions', async () => {
        // Given
        const conditionListResponse = aValidConditionListResponse()
        supportAdditionalNeedsApiClient.getConditions.mockResolvedValue(conditionListResponse)

        const expectedConditionsList = aValidConditionsList({
          conditions: [
            {
              active: true,
              conditionDetails:
                'John says he was diagnosed with dyslexia as a child, but this has not yet been evidenced.',
              conditionName: 'Phonological dyslexia',
              conditionTypeCode: ConditionType.DYSLEXIA,
              createdAt: parseISO('2023-06-19T09:39:44Z'),
              createdAtPrison: 'MDI',
              createdBy: 'asmith_gen',
              createdByDisplayName: 'Alex Smith',
              reference: 'c88a6c48-97e2-4c04-93b5-98619966447b',
              source: ConditionSource.SELF_DECLARED,
              updatedAt: parseISO('2023-06-19T09:39:44Z'),
              updatedAtPrison: 'MDI',
              updatedBy: 'asmith_gen',
              updatedByDisplayName: 'Alex Smith',
            },
          ],
        })

        // When
        const actual = await supportAdditionalNeedsService.getConditions(username, prisonNumber)

        // Then
        expect(actual).toEqual(expectedConditionsList)
        expect(supportAdditionalNeedsApiClient.getConditions).toHaveBeenCalledWith(prisonNumber, username)
      })
    })

    it('should return empty ConditionsList given API returns null', async () => {
      // Given
      supportAdditionalNeedsApiClient.getConditions.mockResolvedValue(null)

      const expectedConditionsList = aValidConditionsList({
        prisonNumber,
        conditions: [],
      })

      // When
      const actual = await supportAdditionalNeedsService.getConditions(username, prisonNumber)

      // Then
      expect(actual).toEqual(expectedConditionsList)
      expect(supportAdditionalNeedsApiClient.getConditions).toHaveBeenCalledWith(prisonNumber, username)
    })

    it('should rethrow error given API client throws error', async () => {
      // Given
      const expectedError = new Error('Internal Server Error')
      supportAdditionalNeedsApiClient.getConditions.mockRejectedValue(expectedError)

      // When
      const actual = await supportAdditionalNeedsService.getConditions(username, prisonNumber).catch(e => e)

      // Then
      expect(actual).toEqual(expectedError)
      expect(supportAdditionalNeedsApiClient.getConditions).toHaveBeenCalledWith(prisonNumber, username)
    })
  })
})
