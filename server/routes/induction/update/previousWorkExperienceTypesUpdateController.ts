import createError from 'http-errors'
import { NextFunction, Request, RequestHandler, Response } from 'express'
import type { InductionDto, PreviousWorkExperienceDto } from 'inductionDto'
import type { PreviousWorkExperienceTypesForm } from 'inductionForms'
import type { PageFlowQueue } from 'viewModels'
import logger from '../../../../logger'
import PreviousWorkExperienceTypesController from '../common/previousWorkExperienceTypesController'
import { InductionService } from '../../../services'
import validatePreviousWorkExperienceTypesForm from './previousWorkExperienceTypesFormValidator'
import TypeOfWorkExperienceValue from '../../../enums/typeOfWorkExperienceValue'
import toCreateOrUpdateInductionDto from '../../../data/mappers/createOrUpdateInductionDtoMapper'
import previousWorkExperienceTypeScreenOrderComparator from '../previousWorkExperienceTypeScreenOrderComparator'
import { getNextPage } from '../../pageFlowQueue'

export default class PreviousWorkExperienceTypesUpdateController extends PreviousWorkExperienceTypesController {
  constructor(private readonly inductionService: InductionService) {
    super()
  }

  getBackLinkUrl(req: Request): string {
    const { prisonNumber } = req.params
    return `/plan/${prisonNumber}/view/work-and-interests`
  }

  getBackLinkAriaText(_req: Request): string {
    return 'Back to <TODO - check what CIAG UI does here>'
  }

  submitPreviousWorkExperienceTypesForm: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    const { prisonNumber } = req.params
    const { prisonerSummary, inductionDto } = req.session

    req.session.previousWorkExperienceTypesForm = { ...req.body }
    if (!req.session.previousWorkExperienceTypesForm.typeOfWorkExperience) {
      req.session.previousWorkExperienceTypesForm.typeOfWorkExperience = []
    }
    if (!Array.isArray(req.session.previousWorkExperienceTypesForm.typeOfWorkExperience)) {
      req.session.previousWorkExperienceTypesForm.typeOfWorkExperience = [
        req.session.previousWorkExperienceTypesForm.typeOfWorkExperience,
      ]
    }
    const { previousWorkExperienceTypesForm } = req.session

    const errors = validatePreviousWorkExperienceTypesForm(previousWorkExperienceTypesForm, prisonerSummary)
    if (errors.length > 0) {
      req.flash('errors', errors)
      return res.redirect(`/prisoners/${prisonNumber}/induction/previous-work-experience`)
    }

    if (
      noChangesToPreviousWorkExperienceSubmitted(inductionDto, previousWorkExperienceTypesForm) ||
      onlyRemovalsWereMadeToPreviousWorkExperienceSubmitted(inductionDto, previousWorkExperienceTypesForm)
    ) {
      if (onlyRemovalsWereMadeToPreviousWorkExperienceSubmitted(inductionDto, previousWorkExperienceTypesForm)) {
        logger.debug(
          'Previous Work Experiences changes are only removed types so Induction can be updated without asking for work experience details',
        )

        // create an updated InductionDto with any changes to Previous Work Experiences and then map it to a CreateOrUpdateInductionDTO to call the API
        const updatedInduction = updatedInductionDtoWithPreviousWorkExperiences(
          inductionDto,
          previousWorkExperienceTypesForm,
        )
        const updateInductionDto = toCreateOrUpdateInductionDto(prisonerSummary.prisonId, updatedInduction)

        try {
          await this.inductionService.updateInduction(prisonerSummary.prisonNumber, updateInductionDto, req.user.token)
          req.session.previousWorkExperienceTypesForm = undefined
          req.session.inductionDto = undefined
        } catch (e) {
          logger.error(`Error updating Induction for prisoner ${prisonNumber}`, e)
          return next(createError(500, `Error updating Induction for prisoner ${prisonNumber}. Error: ${e}`))
        }
      } else {
        logger.debug('No changes to Previous Work Experiences were submitted')
      }

      req.session.previousWorkExperienceTypesForm = undefined
      req.session.inductionDto = undefined
      return res.redirect(`/plan/${prisonNumber}/view/work-and-interests`)
    }

    // Update the InductionDTO in the session with changes to Previous Work Experiences, but do not persist to the API
    // The user will be redirected to each Previous Work Experience Detail page in turn
    req.session.inductionDto = updatedInductionDtoWithPreviousWorkExperiences(
      inductionDto,
      previousWorkExperienceTypesForm,
    )

    /* We need to show the Details page for each of:
         - any additional job types that have been added by the form submission
         - and OTHER if it's value has changed
     */
    const workExperienceTypesToShowDetailsFormFor = [
      ...typesOfPreviousWorkExperienceToShowDetailsFormFor(inductionDto, previousWorkExperienceTypesForm),
    ].sort(previousWorkExperienceTypeScreenOrderComparator) // sort them by the order presented on screen (which is not alphabetic on the enum values)
    const pageFlowQueue = this.buildPageFlowQueue(workExperienceTypesToShowDetailsFormFor, prisonNumber)
    req.session.pageFlowQueue = pageFlowQueue
    logger.debug(
      `Previous Work Experiences changes resulting in going to the Detail pages for ${workExperienceTypesToShowDetailsFormFor}`,
    )

    req.session.previousWorkExperienceTypesForm = undefined
    return res.redirect(getNextPage(pageFlowQueue))
  }

  buildPageFlowQueue = (
    previousWorkExperienceTypes: Array<TypeOfWorkExperienceValue>,
    prisonNumber: string,
  ): PageFlowQueue => {
    const previousWorkExperienceTypesPageUrl = `/prisoners/${prisonNumber}/induction/previous-work-experience`
    const pageUrls = [
      previousWorkExperienceTypesPageUrl,
      ...previousWorkExperienceTypes.map(
        workType => `/prisoners/${prisonNumber}/induction/previous-work-experience/${workType.toLowerCase()}`,
      ),
    ]
    return {
      pageUrls,
      currentPageIndex: 0,
    }
  }
}

/**
 * Returns an [InductionDto] that represents the Induction with the changes from the [PreviousWorkExperienceTypesForm]
 * This method returns an [InductionDto] based on the passed in DTO with
 *   * Any Previous Work Experiences removed where they are removed (missing) in the [PreviousWorkExperienceTypesForm]
 *   * The value for Other has been changed where it has been changed in the [PreviousWorkExperienceTypesForm]
 *   * Any new Previous Work Experiences added where they are new (additional) in the [PreviousWorkExperienceTypesForm]
 *     In the case of new Previous Work Experiences, a new array element is added with the corresponding type, but the
 *     `role` and `details` fields are left undefined as the user has not entered these details yet.
 */
const updatedInductionDtoWithPreviousWorkExperiences = (
  inductionDto: InductionDto,
  previousWorkExperienceTypesForm: PreviousWorkExperienceTypesForm,
): InductionDto => {
  const updatedPreviousWorkExperiences: Array<PreviousWorkExperienceDto> =
    previousWorkExperienceTypesForm.typeOfWorkExperience.map(workType => {
      const existingWorkExperience = inductionDto.previousWorkExperiences?.experiences.find(
        experience => experience.experienceType === workType,
      )
      const isWorkTypeOther = workType === TypeOfWorkExperienceValue.OTHER
      const workTypeOtherValueHasBeenChanged =
        isWorkTypeOther &&
        previousWorkExperienceTypesForm.typeOfWorkExperienceOther !== existingWorkExperience?.experienceTypeOther

      return !existingWorkExperience
        ? {
            // It's a new Previous Work Experience that is not already on the Induction. Add it but with undefined role and details fields
            experienceType: workType,
            experienceTypeOther: isWorkTypeOther ? previousWorkExperienceTypesForm.typeOfWorkExperienceOther : null,
            role: undefined,
            details: undefined,
          }
        : {
            // It's a Previous Work Experience that is already on the Induction. Map it, but if the work type is OTHER
            // map the typeOfWorkExperienceOther field from the form and clear the previous role and details values
            // IE. it's a different kind of "other" so the previous role and details will likely not apply.
            experienceType: workType,
            experienceTypeOther: isWorkTypeOther ? previousWorkExperienceTypesForm.typeOfWorkExperienceOther : null,
            role: isWorkTypeOther && workTypeOtherValueHasBeenChanged ? undefined : existingWorkExperience?.role,
            details: isWorkTypeOther && workTypeOtherValueHasBeenChanged ? undefined : existingWorkExperience?.details,
          }
    })

  return {
    ...inductionDto,
    previousWorkExperiences: {
      ...inductionDto.previousWorkExperiences,
      experiences: updatedPreviousWorkExperiences,
    },
  }
}

/**
 * Returns the list of [TypeOfWorkExperienceValue] for the Previous Work Experiences on the current induction
 */
const previousWorkExperienceTypesOnCurrentInduction = (inductionDto: InductionDto): Array<TypeOfWorkExperienceValue> =>
  inductionDto.previousWorkExperiences.experiences.map(experience => experience.experienceType)

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
