import { startOfToday, subDays } from 'date-fns'
import type {
  AlnScreenerList,
  AlnScreenerResponseDto,
  ChallengeResponseDto,
  StrengthResponseDto,
  StrengthsList,
} from 'dto'
import { aValidStrengthResponseDto, aValidStrengthsList } from '../../testsupport/strengthResponseDtoTestDataBuilder'
import StrengthType from '../../enums/strengthType'
import StrengthCategory from '../../enums/strengthCategory'
import { Result } from '../../utils/result/result'
import { aValidAlnScreenerList, aValidAlnScreenerResponseDto } from '../../testsupport/alnScreenerDtoTestDataBuilder'
import aValidChallengeResponseDto from '../../testsupport/challengeResponseDtoTestDataBuilder'
import ChallengeType from '../../enums/challengeType'
import ChallengeCategory from '../../enums/challengeCategory'

const today = startOfToday()

export function setupNonAlnStrengths() {
  const numeracy = aValidStrengthResponseDto({
    strengthTypeCode: StrengthType.NUMERACY_SKILLS_DEFAULT,
    strengthCategory: StrengthCategory.NUMERACY_SKILLS,
    symptoms: 'Can add up really well',
    fromALNScreener: false,
    active: true,
    updatedAt: subDays(today, 5),
  })
  const numeracy2 = aValidStrengthResponseDto({
    strengthTypeCode: StrengthType.NUMERACY_SKILLS_DEFAULT,
    strengthCategory: StrengthCategory.NUMERACY_SKILLS,
    symptoms: 'Can subtract really well',
    fromALNScreener: false,
    active: true,
    updatedAt: subDays(today, 3),
  })
  const literacy = aValidStrengthResponseDto({
    strengthTypeCode: StrengthType.LITERACY_SKILLS_DEFAULT,
    strengthCategory: StrengthCategory.LITERACY_SKILLS,
    fromALNScreener: false,
    active: true,
    updatedAt: subDays(today, 1),
  })
  const emotionsNonActive = aValidStrengthResponseDto({
    strengthTypeCode: StrengthType.EMOTIONS_FEELINGS_DEFAULT,
    strengthCategory: StrengthCategory.EMOTIONS_FEELINGS,
    fromALNScreener: false,
    active: false,
    updatedAt: subDays(today, 1),
  })
  const attention = aValidStrengthResponseDto({
    strengthTypeCode: StrengthType.ATTENTION_ORGANISING_TIME_DEFAULT,
    strengthCategory: StrengthCategory.ATTENTION_ORGANISING_TIME,
    fromALNScreener: false,
    active: true,
    updatedAt: subDays(today, 10),
  })
  const speaking = aValidStrengthResponseDto({
    strengthTypeCode: StrengthType.SPEAKING,
    strengthCategory: StrengthCategory.LANGUAGE_COMM_SKILLS,
    fromALNScreener: false,
    active: true,
    updatedAt: subDays(today, 2),
  })

  return { numeracy, numeracy2, literacy, emotionsNonActive, attention, speaking }
}

export function setupAlnStrengths() {
  const reading = aValidStrengthResponseDto({
    strengthTypeCode: StrengthType.READING,
    strengthCategory: StrengthCategory.LITERACY_SKILLS,
    fromALNScreener: true,
    active: true,
  })
  const writing = aValidStrengthResponseDto({
    strengthTypeCode: StrengthType.WRITING,
    strengthCategory: StrengthCategory.LITERACY_SKILLS,
    fromALNScreener: true,
    active: true,
  })
  const alphabetOrdering = aValidStrengthResponseDto({
    strengthTypeCode: StrengthType.ALPHABET_ORDERING,
    strengthCategory: StrengthCategory.LITERACY_SKILLS,
    fromALNScreener: true,
    active: true,
  })
  const wordFindingNonActive = aValidStrengthResponseDto({
    strengthTypeCode: StrengthType.WORD_FINDING,
    strengthCategory: StrengthCategory.LITERACY_SKILLS,
    fromALNScreener: true,
    active: false,
  })
  const arithmetic = aValidStrengthResponseDto({
    strengthTypeCode: StrengthType.ARITHMETIC,
    strengthCategory: StrengthCategory.NUMERACY_SKILLS,
    fromALNScreener: true,
    active: true,
  })
  const focussing = aValidStrengthResponseDto({
    strengthTypeCode: StrengthType.FOCUSING,
    strengthCategory: StrengthCategory.ATTENTION_ORGANISING_TIME,
    fromALNScreener: true,
    active: true,
  })
  const tidiness = aValidStrengthResponseDto({
    strengthTypeCode: StrengthType.TIDINESS,
    strengthCategory: StrengthCategory.ATTENTION_ORGANISING_TIME,
    fromALNScreener: true,
    active: true,
  })

  return { reading, writing, alphabetOrdering, wordFindingNonActive, arithmetic, focussing, tidiness }
}

export function setupNonAlnStrengthsPromise(
  options: {
    strengths?: Array<StrengthResponseDto>
  } = { strengths: Object.values(setupNonAlnStrengths()) },
): Result<StrengthsList, Error> {
  return Result.fulfilled(aValidStrengthsList({ strengths: options.strengths }))
}

export function setupAlnScreenersPromise(
  options: {
    latestScreener?: AlnScreenerResponseDto
  } = {
    latestScreener: aValidAlnScreenerResponseDto({
      screenerDate: startOfToday(),
      createdAtPrison: 'BXI',
      strengths: Object.values(setupAlnStrengths()),
    }),
  },
): Result<AlnScreenerList, Error> {
  const latestScreenerDate = options.latestScreener.screenerDate
  return Result.fulfilled(
    aValidAlnScreenerList({
      screeners: [
        // Latest screener
        options.latestScreener,
        // Screener from yesterday
        aValidAlnScreenerResponseDto({ screenerDate: subDays(latestScreenerDate, 1) }),
        // Screener from the day before yesterday
        aValidAlnScreenerResponseDto({ screenerDate: subDays(latestScreenerDate, 2) }),
      ],
    }),
  )
}
export function setupNonAlnChallenges() {
  const numeracyChallenge = aValidChallengeResponseDto({
    challengeTypeCode: ChallengeType.NUMERACY_SKILLS_DEFAULT,
    challengeCategory: ChallengeCategory.NUMERACY_SKILLS,
    symptoms: 'Has problems adding up',
    fromALNScreener: false,
    active: true,
    updatedAt: subDays(today, 5),
  })
  const numeracy2Challenge = aValidChallengeResponseDto({
    challengeTypeCode: ChallengeType.NUMERACY_SKILLS_DEFAULT,
    challengeCategory: ChallengeCategory.NUMERACY_SKILLS,
    symptoms: 'Has problems with subtraction',
    fromALNScreener: false,
    active: true,
    updatedAt: subDays(today, 3),
  })
  const literacyChallenge = aValidChallengeResponseDto({
    challengeTypeCode: ChallengeType.LITERACY_SKILLS_DEFAULT,
    challengeCategory: ChallengeCategory.LITERACY_SKILLS,
    fromALNScreener: false,
    active: true,
    updatedAt: subDays(today, 1),
  })
  const emotionsNonActiveChallenge = aValidChallengeResponseDto({
    challengeTypeCode: ChallengeType.EMOTIONS_FEELINGS_DEFAULT,
    challengeCategory: ChallengeCategory.EMOTIONS_FEELINGS,
    fromALNScreener: false,
    active: false,
    updatedAt: subDays(today, 1),
  })
  const attentionChallenge = aValidChallengeResponseDto({
    challengeTypeCode: ChallengeType.ATTENTION_ORGANISING_TIME_DEFAULT,
    challengeCategory: ChallengeCategory.ATTENTION_ORGANISING_TIME,
    fromALNScreener: false,
    active: true,
    updatedAt: subDays(today, 10),
  })
  const speakingChallenge = aValidChallengeResponseDto({
    challengeTypeCode: ChallengeType.SPEAKING,
    challengeCategory: ChallengeCategory.LANGUAGE_COMM_SKILLS,
    fromALNScreener: false,
    active: true,
    updatedAt: subDays(today, 2),
  })

  return {
    numeracyChallenge,
    numeracy2Challenge,
    literacyChallenge,
    emotionsNonActiveChallenge,
    attentionChallenge,
    speakingChallenge,
  }
}

export function setupNonAlnChallengesPromise(
  challenges: Array<ChallengeResponseDto> = Object.values(setupNonAlnChallenges()),
): Result<Array<ChallengeResponseDto>, Error> {
  return Result.fulfilled(challenges)
}

export function setupAlnChallenges() {
  const readingChallenge = aValidChallengeResponseDto({
    challengeTypeCode: ChallengeType.READING,
    challengeCategory: ChallengeCategory.LITERACY_SKILLS,
    fromALNScreener: true,
    active: true,
  })
  const writingChallenge = aValidChallengeResponseDto({
    challengeTypeCode: ChallengeType.WRITING,
    challengeCategory: ChallengeCategory.LITERACY_SKILLS,
    fromALNScreener: true,
    active: true,
  })
  const alphabetOrderingChallenge = aValidChallengeResponseDto({
    challengeTypeCode: ChallengeType.ALPHABET_ORDERING,
    challengeCategory: ChallengeCategory.LITERACY_SKILLS,
    fromALNScreener: true,
    active: true,
  })
  const wordFindingNonActiveChallenge = aValidChallengeResponseDto({
    challengeTypeCode: ChallengeType.WORD_FINDING,
    challengeCategory: ChallengeCategory.LITERACY_SKILLS,
    fromALNScreener: true,
    active: false,
  })
  const arithmeticChallenge = aValidChallengeResponseDto({
    challengeTypeCode: ChallengeType.ARITHMETIC,
    challengeCategory: ChallengeCategory.NUMERACY_SKILLS,
    fromALNScreener: true,
    active: true,
  })
  const focussingChallenge = aValidChallengeResponseDto({
    challengeTypeCode: ChallengeType.FOCUSING,
    challengeCategory: ChallengeCategory.ATTENTION_ORGANISING_TIME,
    fromALNScreener: true,
    active: true,
  })
  const tidinessChallenge = aValidChallengeResponseDto({
    challengeTypeCode: ChallengeType.TIDINESS,
    challengeCategory: ChallengeCategory.ATTENTION_ORGANISING_TIME,
    fromALNScreener: true,
    active: true,
  })

  return {
    readingChallenge,
    writingChallenge,
    alphabetOrderingChallenge,
    wordFindingNonActiveChallenge,
    arithmeticChallenge,
    focussingChallenge,
    tidinessChallenge,
  }
}
