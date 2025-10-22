import { RequestHandler } from 'express'
import type {
  AlnScreenerList,
  AlnScreenerResponseDto,
  ChallengeResponseDto,
  StrengthResponseDto,
  StrengthsList,
} from 'dto'
import toGroupedSupportStrategiesPromise from './mappers/groupedSupportStrategiesMapper'
import StrengthCategory from '../../enums/strengthCategory'
import { Result } from '../../utils/result/result'
import enumComparator from '../../data/mappers/enumComparator'
import dateComparator from '../dateComparator'
import ChallengeCategory from '../../enums/challengeCategory'

export default class AdditionalNeedsController {
  getAdditionalNeedsView: RequestHandler = async (req, res, next): Promise<void> => {
    const {
      alnScreeners,
      challenges,
      conditions,
      curiousAlnAndLddAssessments,
      prisonerSummary,
      prisonNamesById,
      strengths,
      supportStrategies,
    } = res.locals

    let strengthCategoriesPromise: Result<Array<StrengthCategory>, Error>
    let challengeCategoriesPromise: Result<Array<ChallengeCategory>, Error>

    // Set Strengths categories or passthrough error if screener or strength api call has an error
    if (alnScreeners.isFulfilled() && strengths.isFulfilled()) {
      const nonAlnStrengths = getNonAlnActiveStrengths(strengths)
      const latestAlnScreener = getLatestAlnScreener(alnScreeners)
      const strengthsFromLatestAlnScreener = getActiveStrengthsFromAlnScreener(latestAlnScreener)

      const strengthCategories = Array.from(
        new Set(nonAlnStrengths.concat(strengthsFromLatestAlnScreener).map(strength => strength.strengthCategory)),
      ).sort(enumComparator)
      strengthCategoriesPromise = Result.fulfilled(strengthCategories)
    } else {
      // At least one of the API calls has failed; we need data from all APIs in order to properly render the data on the overview page
      // Set the strength result to be a rejected Result containing the error message(s) from the original rejected promise(s)
      strengthCategoriesPromise = Result.rewrapRejected(alnScreeners, strengths)
    }

    // Set Challenges categories or passthrough error if screener or challenges api call has an error
    if (alnScreeners.isFulfilled() && challenges.isFulfilled()) {
      const latestAlnScreener = getLatestAlnScreener(alnScreeners)
      const nonAlnChallenges = getNonAlnActiveChallenges(challenges)
      const challengesFromLatestAlnScreener = getActiveChallengesFromAlnScreener(latestAlnScreener)

      const challengeCategories = Array.from(
        new Set(nonAlnChallenges.concat(challengesFromLatestAlnScreener).map(challenge => challenge.challengeCategory)),
      ).sort(enumComparator)
      challengeCategoriesPromise = Result.fulfilled(challengeCategories)
    } else {
      // At least one of the API calls has failed; we need data from all APIs in order to properly render the data on the overview page
      // Set the challenges result to be a rejected Result containing the error message(s) from the original rejected promise(s)
      challengeCategoriesPromise = Result.rewrapRejected(alnScreeners, challenges)
    }

    const supportStrategiesPromise = toGroupedSupportStrategiesPromise(supportStrategies)

    res.render('pages/overview/index', {
      tab: 'additional-needs',
      prisonerSummary,
      prisonNamesById,
      curiousAlnAndLddAssessments,
      conditions,
      groupedSupportStrategies: supportStrategiesPromise,
      strengthCategories: strengthCategoriesPromise,
      challengeCategories: challengeCategoriesPromise,
    })
  }
}

const getLatestAlnScreener = (screeners: Result<AlnScreenerList>): AlnScreenerResponseDto =>
  screeners
    .getOrNull()
    .screeners.sort((left: AlnScreenerResponseDto, right: AlnScreenerResponseDto) =>
      dateComparator(left.screenerDate, right.screenerDate, 'DESC'),
    )[0]

const getNonAlnActiveStrengths = (strengths: Result<StrengthsList>): Array<StrengthResponseDto> =>
  strengths.getOrNull()?.strengths.filter(strength => strength.active && !strength.fromALNScreener) ?? []

const getActiveStrengthsFromAlnScreener = (alnScreener: AlnScreenerResponseDto): Array<StrengthResponseDto> =>
  alnScreener?.strengths.filter(strength => strength.active && strength.fromALNScreener) ?? []

const getNonAlnActiveChallenges = (challenges: Result<Array<ChallengeResponseDto>>): Array<ChallengeResponseDto> =>
  challenges.getOrNull()?.filter(challenge => challenge.active && !challenge.fromALNScreener) ?? []

const getActiveChallengesFromAlnScreener = (alnScreener: AlnScreenerResponseDto): Array<ChallengeResponseDto> =>
  alnScreener?.challenges.filter(challenge => challenge.active && challenge.fromALNScreener) ?? []
