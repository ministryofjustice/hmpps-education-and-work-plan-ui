import { format, parseISO, startOfToday } from 'date-fns'
import type { ChallengeResponseDto, SupportStrategyResponseDto } from 'dto'
import SupportAdditionalNeedsService from './supportAdditionalNeedsService'
import SupportAdditionalNeedsApiClient from '../data/supportAdditionalNeedsApiClient'
import { aValidConditionListResponse } from '../testsupport/conditionResponseTestDataBuilder'
import { aValidConditionsList } from '../testsupport/conditionDtoTestDataBuilder'
import ConditionType from '../enums/conditionType'
import ConditionSource from '../enums/conditionSource'
import {
  aValidSupportStrategyListResponse,
  aValidSupportStrategyResponse,
} from '../testsupport/supportStrategyResponseTestDataBuilder'
import aValidSupportStrategyResponseDto from '../testsupport/supportStrategyResponseDtoTestDataBuilder'
import SupportStrategyType from '../enums/supportStrategyType'
import SupportStrategyCategory from '../enums/supportStrategyCategory'
import { aValidChallengeListResponse, aValidChallengeResponse } from '../testsupport/challengeResponseTestDataBuilder'
import aValidChallengeResponseDto from '../testsupport/challengeResponseDtoTestDataBuilder'
import ChallengeIdentificationSource from '../enums/challengeIdentificationSource'
import { aValidAlnScreenerResponse, aValidAlnScreeners } from '../testsupport/alnScreenerResponseTestDataBuilder'
import { aValidStrengthResponse } from '../testsupport/strengthResponseTestDataBuilder'
import ChallengeType from '../enums/challengeType'
import ChallengeCategory from '../enums/challengeCategory'
import { aValidAlnScreenerList, aValidAlnScreenerResponseDto } from '../testsupport/alnScreenerDtoTestDataBuilder'
import { aValidStrengthResponseDto } from '../testsupport/strengthResponseDtoTestDataBuilder'
import StrengthType from '../enums/strengthType'
import StrengthCategory from '../enums/strengthCategory'

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

  describe('getSupportStrategies', () => {
    it('should get support strategies', async () => {
      // Given
      const supportStrategiesListResponse = aValidSupportStrategyListResponse({
        supportStrategies: [
          aValidSupportStrategyResponse({
            active: true,
            detail: 'Using flash cards with John can help him retain facts',
            supportStrategyType: 'MEMORY',
            supportStrategyCategory: 'MEMORY',
            reference: 'c88a6c48-97e2-4c04-93b5-98619966447b',
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
      supportAdditionalNeedsApiClient.getSupportStrategies.mockResolvedValue(supportStrategiesListResponse)

      const expectedSupportStrategies = [
        aValidSupportStrategyResponseDto({
          active: true,
          details: 'Using flash cards with John can help him retain facts',
          supportStrategyCategoryTypeCode: SupportStrategyType.MEMORY,
          supportStrategyCategory: SupportStrategyCategory.MEMORY,
          reference: 'c88a6c48-97e2-4c04-93b5-98619966447b',
          createdBy: 'asmith_gen',
          createdByDisplayName: 'Alex Smith',
          createdAt: parseISO('2023-06-19T09:39:44Z'),
          createdAtPrison: 'MDI',
          updatedBy: 'asmith_gen',
          updatedByDisplayName: 'Alex Smith',
          updatedAt: parseISO('2023-06-19T09:39:44Z'),
          updatedAtPrison: 'MDI',
        }),
      ]

      // When
      const actual = await supportAdditionalNeedsService.getSupportStrategies(username, prisonNumber)

      // Then
      expect(actual).toEqual(expectedSupportStrategies)
      expect(supportAdditionalNeedsApiClient.getSupportStrategies).toHaveBeenCalledWith(prisonNumber, username)
    })

    it('should return empty array of Support Strategies given API returns null', async () => {
      // Given
      supportAdditionalNeedsApiClient.getSupportStrategies.mockResolvedValue(null)

      const expectedSupportStrategies = [] as Array<SupportStrategyResponseDto>

      // When
      const actual = await supportAdditionalNeedsService.getSupportStrategies(username, prisonNumber)

      // Then
      expect(actual).toEqual(expectedSupportStrategies)
      expect(supportAdditionalNeedsApiClient.getSupportStrategies).toHaveBeenCalledWith(prisonNumber, username)
    })

    it('should rethrow error given API client throws error', async () => {
      // Given
      const expectedError = new Error('Internal Server Error')
      supportAdditionalNeedsApiClient.getSupportStrategies.mockRejectedValue(expectedError)

      // When
      const actual = await supportAdditionalNeedsService.getSupportStrategies(username, prisonNumber).catch(e => e)

      // Then
      expect(actual).toEqual(expectedError)
      expect(supportAdditionalNeedsApiClient.getSupportStrategies).toHaveBeenCalledWith(prisonNumber, username)
    })
  })

  describe('getSupportStrategies', () => {
    it('should get support strategies', async () => {
      // Given
      const supportStrategiesListResponse = aValidSupportStrategyListResponse({
        supportStrategies: [
          aValidSupportStrategyResponse({
            active: true,
            detail: 'Using flash cards with John can help him retain facts',
            supportStrategyType: 'MEMORY',
            supportStrategyCategory: 'MEMORY',
            reference: 'c88a6c48-97e2-4c04-93b5-98619966447b',
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
      supportAdditionalNeedsApiClient.getSupportStrategies.mockResolvedValue(supportStrategiesListResponse)

      const expectedSupportStrategies = [
        aValidSupportStrategyResponseDto({
          active: true,
          details: 'Using flash cards with John can help him retain facts',
          supportStrategyCategoryTypeCode: SupportStrategyType.MEMORY,
          supportStrategyCategory: SupportStrategyCategory.MEMORY,
          reference: 'c88a6c48-97e2-4c04-93b5-98619966447b',
          createdBy: 'asmith_gen',
          createdByDisplayName: 'Alex Smith',
          createdAt: parseISO('2023-06-19T09:39:44Z'),
          createdAtPrison: 'MDI',
          updatedBy: 'asmith_gen',
          updatedByDisplayName: 'Alex Smith',
          updatedAt: parseISO('2023-06-19T09:39:44Z'),
          updatedAtPrison: 'MDI',
        }),
      ]

      // When
      const actual = await supportAdditionalNeedsService.getSupportStrategies(username, prisonNumber)

      // Then
      expect(actual).toEqual(expectedSupportStrategies)
      expect(supportAdditionalNeedsApiClient.getSupportStrategies).toHaveBeenCalledWith(prisonNumber, username)
    })

    it('should return empty array of Support Strategies given API returns null', async () => {
      // Given
      supportAdditionalNeedsApiClient.getSupportStrategies.mockResolvedValue(null)

      const expectedSupportStrategies = [] as Array<SupportStrategyResponseDto>

      // When
      const actual = await supportAdditionalNeedsService.getSupportStrategies(username, prisonNumber)

      // Then
      expect(actual).toEqual(expectedSupportStrategies)
      expect(supportAdditionalNeedsApiClient.getSupportStrategies).toHaveBeenCalledWith(prisonNumber, username)
    })

    it('should rethrow error given API client throws error', async () => {
      // Given
      const expectedError = new Error('Internal Server Error')
      supportAdditionalNeedsApiClient.getSupportStrategies.mockRejectedValue(expectedError)

      // When
      const actual = await supportAdditionalNeedsService.getSupportStrategies(username, prisonNumber).catch(e => e)

      // Then
      expect(actual).toEqual(expectedError)
      expect(supportAdditionalNeedsApiClient.getSupportStrategies).toHaveBeenCalledWith(prisonNumber, username)
    })
  })

  describe('getChallenges', () => {
    it('should get challenges', async () => {
      // Given
      const challengeListResponse = aValidChallengeListResponse({
        challengeResponses: [
          aValidChallengeResponse({
            alnScreenerDate: null,
            fromALNScreener: false,
            symptoms: 'John struggles to read text on white background',
            howIdentifiedOther: 'John was seen to have other challenges',
          }),
        ],
      })
      supportAdditionalNeedsApiClient.getChallenges.mockResolvedValue(challengeListResponse)

      const expectedChallenges = [
        aValidChallengeResponseDto({
          alnScreenerDate: null,
          fromALNScreener: false,
          symptoms: 'John struggles to read text on white background',
          howIdentifiedOther: 'John was seen to have other challenges',
        }),
      ]

      // When
      const actual = await supportAdditionalNeedsService.getChallenges(username, prisonNumber)

      // Then
      expect(actual).toEqual(expectedChallenges)
      expect(supportAdditionalNeedsApiClient.getChallenges).toHaveBeenCalledWith(prisonNumber, username)
    })

    it('should return empty Challenges array given API returns null', async () => {
      // Given
      supportAdditionalNeedsApiClient.getChallenges.mockResolvedValue(null)

      const expectedChallenges = [] as Array<ChallengeResponseDto>

      // When
      const actual = await supportAdditionalNeedsService.getChallenges(username, prisonNumber)

      // Then
      expect(actual).toEqual(expectedChallenges)
      expect(supportAdditionalNeedsApiClient.getChallenges).toHaveBeenCalledWith(prisonNumber, username)
    })

    it('should rethrow error given API client throws error', async () => {
      // Given
      const expectedError = new Error('Internal Server Error')
      supportAdditionalNeedsApiClient.getChallenges.mockRejectedValue(expectedError)

      // When
      const actual = await supportAdditionalNeedsService.getChallenges(username, prisonNumber).catch(e => e)

      // Then
      expect(actual).toEqual(expectedError)
      expect(supportAdditionalNeedsApiClient.getChallenges).toHaveBeenCalledWith(prisonNumber, username)
    })
  })

  describe('getAlnScreeners', () => {
    it('should get ALN Screeners', async () => {
      // Given
      const screenerDate = startOfToday()
      const challenge = aValidChallengeResponse({
        symptoms: 'John struggles to read text on white background',
        fromALNScreener: true,
        challengeTypeCode: 'WRITING',
        howIdentified: [ChallengeIdentificationSource.CONVERSATIONS],
        howIdentifiedOther: null,
        alnScreenerDate: format(screenerDate, 'yyyy-MM-dd'),
        challengeCategory: 'LITERACY_SKILLS',
      })

      const strength = aValidStrengthResponse({
        fromALNScreener: true,
        alnScreenerDate: format(screenerDate, 'yyyy-MM-dd'),
      })
      strength.strengthType.code = 'NUMERACY_SKILLS_DEFAULT'
      strength.strengthType.categoryCode = 'NUMERACY_SKILLS'

      const alnScreeners = aValidAlnScreeners({
        screeners: [
          aValidAlnScreenerResponse({
            screenerDate: format(screenerDate, 'yyyy-MM-dd'),
            challenges: [challenge],
            strengths: [strength],
          }),
        ],
      })
      supportAdditionalNeedsApiClient.getAdditionalLearningNeedsScreeners.mockResolvedValue(alnScreeners)
      const expectedChallengeResponseDto = aValidChallengeResponseDto({
        symptoms: 'John struggles to read text on white background',
        fromALNScreener: true,
        challengeTypeCode: ChallengeType.WRITING,
        howIdentified: [ChallengeIdentificationSource.CONVERSATIONS],
        howIdentifiedOther: null,
        alnScreenerDate: screenerDate,
        challengeCategory: ChallengeCategory.LITERACY_SKILLS,
      })

      const expectedAlnScreenerList = aValidAlnScreenerList({
        prisonNumber,
        screeners: [
          aValidAlnScreenerResponseDto({
            screenerDate,
            challenges: [expectedChallengeResponseDto],
            strengths: [
              aValidStrengthResponseDto({
                strengthTypeCode: StrengthType.NUMERACY_SKILLS_DEFAULT,
                strengthCategory: StrengthCategory.NUMERACY_SKILLS,
                fromALNScreener: true,
                alnScreenerDate: screenerDate,
              }),
            ],
          }),
        ],
      })
      // When
      const actual = await supportAdditionalNeedsService.getAlnScreeners(username, prisonNumber)

      // Then
      expect(actual).toEqual(expectedAlnScreenerList)
      expect(supportAdditionalNeedsApiClient.getAdditionalLearningNeedsScreeners).toHaveBeenCalledWith(
        prisonNumber,
        username,
      )
    })

    it('should return empty AlnScreenerList given API returns null', async () => {
      // Given
      supportAdditionalNeedsApiClient.getAdditionalLearningNeedsScreeners.mockResolvedValue(null)

      const expectedAlnScreenerList = aValidAlnScreenerList({
        prisonNumber,
        screeners: [],
      })

      // When
      const actual = await supportAdditionalNeedsService.getAlnScreeners(username, prisonNumber)

      // Then
      expect(actual).toEqual(expectedAlnScreenerList)
      expect(supportAdditionalNeedsApiClient.getAdditionalLearningNeedsScreeners).toHaveBeenCalledWith(
        prisonNumber,
        username,
      )
    })

    it('should rethrow error given API client throws error', async () => {
      // Given
      const expectedError = new Error('Internal Server Error')
      supportAdditionalNeedsApiClient.getAdditionalLearningNeedsScreeners.mockRejectedValue(expectedError)

      // When
      const actual = await supportAdditionalNeedsService.getAlnScreeners(username, prisonNumber).catch(e => e)

      // Then
      expect(actual).toEqual(expectedError)
      expect(supportAdditionalNeedsApiClient.getAdditionalLearningNeedsScreeners).toHaveBeenCalledWith(
        prisonNumber,
        username,
      )
    })
  })
})
