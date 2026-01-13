import { NextFunction, Request, RequestHandler, Response } from 'express'
import type { InductionDto } from 'inductionDto'
import type { PreviousWorkExperienceTypesForm } from 'inductionForms'
import type { PageFlow } from 'viewModels'
import logger from '../../../../logger'
import PreviousWorkExperienceTypesController from '../common/previousWorkExperienceTypesController'
import { InductionService } from '../../../services'
import TypeOfWorkExperienceValue from '../../../enums/typeOfWorkExperienceValue'
import toCreateOrUpdateInductionDto from '../../../data/mappers/createOrUpdateInductionDtoMapper'
import previousWorkExperienceTypeScreenOrderComparator from '../previousWorkExperienceTypeScreenOrderComparator'
import { appendPagesFromCurrentPage, getNextPage } from '../../pageFlowQueue'
import { Result } from '../../../utils/result/result'
import { asArray } from '../../../utils/utils'
import { setRedirectPendingFlag } from '../../routerRequestHandlers/checkRedirectAtEndOfJourneyIsNotPending'

export default class PreviousWorkExperienceTypesUpdateController extends PreviousWorkExperienceTypesController {
  constructor(private readonly inductionService: InductionService) {
    super()
  }

  submitPreviousWorkExperienceTypesForm: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    const { prisonNumber, journeyId } = req.params
    const { inductionDto } = req.journeyData
    const { prisonerSummary } = res.locals

    const previousWorkExperienceTypesForm: PreviousWorkExperienceTypesForm = {
      typeOfWorkExperience: asArray(req.body.typeOfWorkExperience),
      typeOfWorkExperienceOther: req.body.typeOfWorkExperienceOther,
    }

    // create an updated InductionDto with any changes to Previous Work Experiences
    const updatedInduction = this.updatedInductionDtoWithPreviousWorkExperiences(
      inductionDto,
      previousWorkExperienceTypesForm,
    )

    if (
      noChangesToPreviousWorkExperienceSubmitted(inductionDto, previousWorkExperienceTypesForm) ||
      onlyRemovalsWereMadeToPreviousWorkExperienceSubmitted(inductionDto, previousWorkExperienceTypesForm)
    ) {
      if (onlyRemovalsWereMadeToPreviousWorkExperienceSubmitted(inductionDto, previousWorkExperienceTypesForm)) {
        logger.debug(
          'Previous Work Experiences changes are only removed types so Induction can be updated without asking for work experience details',
        )

        const updateInductionDto = toCreateOrUpdateInductionDto(prisonerSummary.prisonId, updatedInduction)

        const { apiErrorCallback } = res.locals
        const apiResult = await Result.wrap(
          this.inductionService.updateInduction(prisonNumber, updateInductionDto, req.user.username),
          apiErrorCallback,
        )
        if (!apiResult.isFulfilled()) {
          apiResult.getOrHandle(e => logger.error(`Error updating Induction for prisoner ${prisonNumber}`, e))
          req.flash('pageHasApiErrors', 'true')
          return res.redirect('previous-work-experience')
        }

        req.journeyData.inductionDto = undefined
      } else {
        logger.debug('No changes to Previous Work Experiences were submitted')
      }

      req.journeyData.inductionDto = undefined
      setRedirectPendingFlag(req)
      return res.redirect(`/plan/${prisonNumber}/view/work-and-interests`)
    }

    // Update the InductionDTO in the session with changes to Previous Work Experiences, but do not persist to the API
    // The user will be redirected to each Previous Work Experience Detail page in turn
    req.journeyData.inductionDto = updatedInduction

    /* We need to show the Details page for each of:
         - any additional job types that have been added by the form submission
         - and OTHER if it's value has changed
     */
    const workExperienceTypesToShowDetailsFormFor = [
      ...typesOfPreviousWorkExperienceToShowDetailsFormFor(inductionDto, previousWorkExperienceTypesForm),
    ].sort(previousWorkExperienceTypeScreenOrderComparator) // sort them by the order presented on screen (which is not alphabetic on the enum values)
    logger.debug(
      `Previous Work Experiences changes resulting in going to the Detail pages for ${workExperienceTypesToShowDetailsFormFor}`,
    )

    const pageFlowQueue = this.buildPageFlowQueue(
      workExperienceTypesToShowDetailsFormFor,
      prisonNumber,
      journeyId,
      req.session.pageFlowQueue,
    )

    req.session.pageFlowQueue = pageFlowQueue
    return res.redirect(getNextPage(pageFlowQueue))
  }

  buildPageFlowQueue = (
    previousWorkExperienceTypes: Array<TypeOfWorkExperienceValue>,
    prisonNumber: string,
    journeyId: string,
    currentPageFlow?: PageFlow,
  ): PageFlow => {
    const nextPages = previousWorkExperienceTypes.map(
      workType =>
        `/prisoners/${prisonNumber}/induction/${journeyId}/previous-work-experience/${workType.toLowerCase()}`,
    )

    if (currentPageFlow) {
      return appendPagesFromCurrentPage(currentPageFlow, nextPages)
    }
    const pageUrls = [`/prisoners/${prisonNumber}/induction/${journeyId}/previous-work-experience`, ...nextPages]
    return {
      pageUrls,
      currentPageIndex: 0,
    }
  }
}

/**
 * Returns the list of [TypeOfWorkExperienceValue] for the Previous Work Experiences on the current induction
 */
const previousWorkExperienceTypesOnCurrentInduction = (inductionDto: InductionDto): Array<TypeOfWorkExperienceValue> =>
  inductionDto.previousWorkExperiences?.experiences?.map(experience => experience.experienceType) || []

/**
 * Given the current Induction and the [PreviousWorkExperienceTypesForm], returns a list of [TypeOfWorkExperienceValue]
 * that represent the Previous Work Experiences that are to be removed.
 * IE. those that exist on the Induction, but not in the [PreviousWorkExperienceTypesForm]
 */
const removedPreviousWorkExperienceTypes = (
  inductionDto: InductionDto,
  previousWorkExperienceTypesForm: PreviousWorkExperienceTypesForm,
): Array<TypeOfWorkExperienceValue> =>
  [...previousWorkExperienceTypesOnCurrentInduction(inductionDto)].filter(
    type => !previousWorkExperienceTypesForm.typeOfWorkExperience.includes(type),
  )

/**
 * Given the current Induction and the [PreviousWorkExperienceTypesForm], returns a list of [TypeOfWorkExperienceValue]
 * that represent the Previous Work Experiences that are to be added.
 * IE. those that do not exist on the Induction, but are in the [PreviousWorkExperienceTypesForm]
 */
const addedPreviousWorkExperienceTypes = (
  inductionDto: InductionDto,
  previousWorkExperienceTypesForm: PreviousWorkExperienceTypesForm,
): Array<TypeOfWorkExperienceValue> =>
  [...previousWorkExperienceTypesForm.typeOfWorkExperience].filter(
    type => !previousWorkExperienceTypesOnCurrentInduction(inductionDto).includes(type),
  )

/**
 * Given the current Induction and the [PreviousWorkExperienceTypesForm], returns `true` if both the Induction and the
 * [PreviousWorkExperienceTypesForm] include a Previous Work Experience type of OTHER, and if its value is different.
 */
const otherTypeOfWorkExperienceHasBeenChanged = (
  inductionDto: InductionDto,
  previousWorkExperienceTypesForm: PreviousWorkExperienceTypesForm,
): boolean =>
  previousWorkExperienceTypesOnCurrentInduction(inductionDto).includes(TypeOfWorkExperienceValue.OTHER) &&
  previousWorkExperienceTypesForm.typeOfWorkExperience.includes(TypeOfWorkExperienceValue.OTHER) &&
  inductionDto.previousWorkExperiences.experiences.find(
    experience => experience.experienceType === TypeOfWorkExperienceValue.OTHER,
  )?.experienceTypeOther !== previousWorkExperienceTypesForm.typeOfWorkExperienceOther

/**
 * Given the current Induction and the [PreviousWorkExperienceTypesForm], returns `true` if there have been no changes
 * to the Previous Work Experiences.
 * IE. No removals, no additions, and OTHER has not been changed.
 */
const noChangesToPreviousWorkExperienceSubmitted = (
  inductionDto: InductionDto,
  previousWorkExperienceTypesForm: PreviousWorkExperienceTypesForm,
): boolean =>
  removedPreviousWorkExperienceTypes(inductionDto, previousWorkExperienceTypesForm).length === 0 &&
  addedPreviousWorkExperienceTypes(inductionDto, previousWorkExperienceTypesForm).length === 0 &&
  !otherTypeOfWorkExperienceHasBeenChanged(inductionDto, previousWorkExperienceTypesForm)

/**
 * Given the current Induction and the [PreviousWorkExperienceTypesForm], returns `true` if the only changes to the
 * Previous Work Experiences are the removal of one or more Previous Work Experience types.
 * IE. One or more removals, no additions, and OTHER has not been changed.
 */
const onlyRemovalsWereMadeToPreviousWorkExperienceSubmitted = (
  inductionDto: InductionDto,
  previousWorkExperienceTypesForm: PreviousWorkExperienceTypesForm,
): boolean =>
  removedPreviousWorkExperienceTypes(inductionDto, previousWorkExperienceTypesForm).length > 0 &&
  addedPreviousWorkExperienceTypes(inductionDto, previousWorkExperienceTypesForm).length === 0 &&
  !otherTypeOfWorkExperienceHasBeenChanged(inductionDto, previousWorkExperienceTypesForm)

/**
 * Given the current Induction and the [PreviousWorkExperienceTypesForm], returns a list of [TypeOfWorkExperienceValue]
 * that represent the Previous Work Experiences that are to be added; plus OTHER if it's value has changed.
 */
const typesOfPreviousWorkExperienceToShowDetailsFormFor = (
  inductionDto: InductionDto,
  previousWorkExperienceTypesForm: PreviousWorkExperienceTypesForm,
): Array<TypeOfWorkExperienceValue> => {
  const addedTypes = addedPreviousWorkExperienceTypes(inductionDto, previousWorkExperienceTypesForm)
  if (!otherTypeOfWorkExperienceHasBeenChanged(inductionDto, previousWorkExperienceTypesForm)) {
    return [...addedTypes]
  }
  return [...addedTypes, TypeOfWorkExperienceValue.OTHER]
}
