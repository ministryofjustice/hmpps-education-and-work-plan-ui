import { Request, Response } from 'express'
import aValidPrisonerSummary from '../../testsupport/prisonerSummaryTestDataBuilder'
import { validCuriousAlnAndLddAssessments } from '../../testsupport/curiousAlnAndLddAssessmentsTestDataBuilder'
import AdditionalNeedsController from './additionalNeedsController'
import { Result } from '../../utils/result/result'
import { aValidConditionsList } from '../../testsupport/conditionDtoTestDataBuilder'
import aValidSupportStrategyResponseDto from '../../testsupport/supportStrategyResponseDtoTestDataBuilder'
import {
  setupAlnChallenges,
  setupAlnScreenersPromise,
  setupAlnStrengths,
  setupNonAlnChallenges,
  setupNonAlnChallengesPromise,
  setupNonAlnStrengths,
  setupNonAlnStrengthsPromise,
} from './additionalNeedsControllerTestSupportFunctions'
import { aValidAlnScreenerResponseDto } from '../../testsupport/alnScreenerDtoTestDataBuilder'
import StrengthCategory from '../../enums/strengthCategory'
import ChallengeCategory from '../../enums/challengeCategory'

jest.mock('../../services/curiousService')
jest.mock('../../services/prisonService')

describe('additionalNeedsController', () => {
  const controller = new AdditionalNeedsController()

  const prisonNumber = 'A1234GC'
  const prisonerSummary = aValidPrisonerSummary({ prisonNumber })
  const curiousAlnAndLddAssessments = Result.fulfilled(validCuriousAlnAndLddAssessments())
  const conditions = Result.fulfilled(aValidConditionsList())
  const supportStrategies = Result.fulfilled([aValidSupportStrategyResponseDto()])

  // Non-ALN strengths
  const { numeracy, numeracy2, literacy, emotionsNonActive, attention, speaking } = setupNonAlnStrengths()
  const strengths = setupNonAlnStrengthsPromise({
    strengths: [numeracy, numeracy2, literacy, emotionsNonActive, attention, speaking],
  })

  // Non-ALN Challenges
  const {
    numeracyChallenge,
    numeracy2Challenge,
    literacyChallenge,
    emotionsNonActiveChallenge,
    attentionChallenge,
    speakingChallenge,
  } = setupNonAlnChallenges()
  const challenges = setupNonAlnChallengesPromise([
    numeracyChallenge,
    numeracy2Challenge,
    literacyChallenge,
    emotionsNonActiveChallenge,
    attentionChallenge,
    speakingChallenge,
  ])

  // Latest ALN strengths
  const { reading, writing, alphabetOrdering, wordFindingNonActive, arithmetic, focussing, tidiness } =
    setupAlnStrengths()

  // Latest ALN strengths
  const {
    readingChallenge,
    writingChallenge,
    alphabetOrderingChallenge,
    wordFindingNonActiveChallenge,
    arithmeticChallenge,
    focussingChallenge,
    tidinessChallenge,
  } = setupAlnChallenges()

  const latestScreener = aValidAlnScreenerResponseDto({
    strengths: [reading, writing, wordFindingNonActive, arithmetic, focussing, tidiness, alphabetOrdering],
    challenges: [
      readingChallenge,
      writingChallenge,
      wordFindingNonActiveChallenge,
      arithmeticChallenge,
      focussingChallenge,
      tidinessChallenge,
      alphabetOrderingChallenge,
    ],
  })
  const alnScreeners = setupAlnScreenersPromise({ latestScreener })

  const prisonNamesById = Result.fulfilled({ MDI: 'Moorland (HMP & YOI)', WDI: 'Wakefield (HMP)' })

  const req = {
    user: {
      username: 'a-dps-user',
    },
    params: { prisonNumber },
  } as unknown as Request
  const res = {
    render: jest.fn(),
    locals: {
      prisonerSummary,
      curiousAlnAndLddAssessments,
      conditions,
      supportStrategies,
      strengths,
      challenges,
      alnScreeners,
      prisonNamesById,
    },
  } as unknown as Response
  const next = jest.fn()

  beforeEach(() => {
    jest.resetAllMocks()
  })

  it('should get additional needs view', async () => {
    // Given
    const expectedTab = 'additional-needs'
    req.params.tab = expectedTab

    res.locals.supportStrategies = Result.fulfilled([aValidSupportStrategyResponseDto()])
    const expectedGroupedSupportStrategies = {
      MEMORY: [aValidSupportStrategyResponseDto()],
    }

    const expectedView = {
      tab: expectedTab,
      prisonerSummary,
      prisonNamesById,
      curiousAlnAndLddAssessments,
      conditions,
      groupedSupportStrategies: expect.objectContaining({
        status: 'fulfilled',
        value: expectedGroupedSupportStrategies,
      }),
      strengthCategories: expect.objectContaining({
        status: 'fulfilled',
        value: [
          StrengthCategory.ATTENTION_ORGANISING_TIME,
          StrengthCategory.LANGUAGE_COMM_SKILLS,
          StrengthCategory.LITERACY_SKILLS,
          StrengthCategory.NUMERACY_SKILLS,
        ],
      }),
      challengeCategories: expect.objectContaining({
        status: 'fulfilled',
        value: [
          ChallengeCategory.ATTENTION_ORGANISING_TIME,
          ChallengeCategory.LANGUAGE_COMM_SKILLS,
          ChallengeCategory.LITERACY_SKILLS,
          ChallengeCategory.NUMERACY_SKILLS,
        ],
      }),
    }

    // When
    await controller.getAdditionalNeedsView(req, res, next)

    // Then
    expect(res.render).toHaveBeenCalledWith('pages/overview/index', expectedView)
  })
})
