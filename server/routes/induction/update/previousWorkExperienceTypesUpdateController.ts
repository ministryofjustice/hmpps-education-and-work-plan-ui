import createError from 'http-errors'
import { NextFunction, Request, RequestHandler, Response } from 'express'
import type { InductionDto, PreviousWorkExperienceDto } from 'inductionDto'
import type { PreviousWorkExperienceTypesForm } from 'inductionForms'
import type { PrisonerSummary } from 'viewModels'
import logger from '../../../../logger'
import PreviousWorkExperienceTypesController from '../common/previousWorkExperienceTypesController'
import { InductionService } from '../../../services'
import validatePreviousWorkExperienceTypesForm from './previousWorkExperienceTypesFormValidator'
import TypeOfWorkExperienceValue from '../../../enums/typeOfWorkExperienceValue'
import toCreateOrUpdateInductionDto from '../../../data/mappers/createOrUpdateInductionDtoMapper'
import previousWorkExperienceTypeScreenOrderComparator from '../previousWorkExperienceTypeScreenOrderComparator'

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
        // call the service to update the Induction
        try {
          const updatedInduction = updatedInductionDtoWithRemovalsAndChangesToOther(
            inductionDto,
            previousWorkExperienceTypesForm,
          )
          await this.updateInduction(updatedInduction, req, prisonerSummary)
        } catch (e) {
          return next(createError(500, `Error updating Induction for prisoner ${prisonNumber}. Error: ${e}`))
        }
      } else {
        logger.debug('No changes to Previous Work Experiences were submitted')
      }

      req.session.previousWorkExperienceTypesForm = undefined
      req.session.inductionDto = undefined
      return res.redirect(`/plan/${prisonNumber}/view/work-and-interests`)
    }

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

    // TODO - replace with correct redirect once we've implemented form redirect/handling for a "queue" of Previous Work Experience Detail pages
    return res.redirect(`/plan/${prisonNumber}/view/work-and-interests`)
  }

  /**
   * Updates the Induction with the specified [InductionDto] using the InductionService.
   * The specified [InductionDto] should describe the new/desired state of the Induction.
   * @throws Error if InductionService throws an error. The Error from InductionService is rethrown.
   */
  private updateInduction = async (inductionDto: InductionDto, req: Request, prisonerSummary: PrisonerSummary) => {
    const updateInductionDto = toCreateOrUpdateInductionDto(prisonerSummary.prisonId, inductionDto)
    try {
      await this.inductionService.updateInduction(prisonerSummary.prisonNumber, updateInductionDto, req.user.token)
      req.session.previousWorkExperienceTypesForm = undefined
      req.session.inductionDto = undefined
    } catch (e) {
      logger.error(`Error updating Induction for prisoner ${prisonerSummary.prisonNumber}`, e)
      throw e
    }
  }
}

/**
 * Returns an [InductionDto] that represents the Induction with Previous Work Experience removals and value changes to "OTHER" made to it.
 * Specifically this method returns an [InductionDto] based on the passed in DTO, but with
 *   * Any Previous Work Experiences removed where they are removed (missing) in the [PreviousWorkExperienceTypesForm]
 *   * The value for Other has been changed where it has been changed in the [PreviousWorkExperienceTypesForm]
 *
 * This method is not suitable for use when Previous Work Experiences have been added as these are not included in the
 * returned DTO.
 */
const updatedInductionDtoWithRemovalsAndChangesToOther = (
  inductionDto: InductionDto,
  previousWorkExperienceTypesForm: PreviousWorkExperienceTypesForm,
): InductionDto => {
  const updatedPreviousWorkExperiences: Array<PreviousWorkExperienceDto> =
    previousWorkExperienceTypesForm.typeOfWorkExperience.map(workType => {
      const existingWorkExperience = inductionDto.previousWorkExperiences?.experiences.find(
        experience => experience.experienceType === workType,
      )
      return {
        experienceType: workType,
        experienceTypeOther:
          workType === TypeOfWorkExperienceValue.OTHER
            ? previousWorkExperienceTypesForm.typeOfWorkExperienceOther
            : null,
        role: existingWorkExperience?.role,
        details: existingWorkExperience?.details,
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
 * [PreviousWorkExperienceTypesForm] inclyde a Previous Work Experience type of OTHER, and the it's value is different.
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
