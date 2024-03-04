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
      this.noChangesToPreviousWorkExperienceSubmitted(inductionDto, previousWorkExperienceTypesForm) ||
      this.onlyRemovalsWereMadeToPreviousWorkExperienceSubmitted(inductionDto, previousWorkExperienceTypesForm)
    ) {
      if (this.onlyRemovalsWereMadeToPreviousWorkExperienceSubmitted(inductionDto, previousWorkExperienceTypesForm)) {
        logger.debug(
          'Previous Work Experiences changes are only removed types so Induction can be updated without starting a flow',
        )
        // call the service to update the Induction
        try {
          await this.updateInduction(inductionDto, previousWorkExperienceTypesForm, req, prisonerSummary)
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
         - previous work experience on the original induction that has not been removed by the form submission
         - any additional job types that have been added by the form submission
         - and OTHER if it's value has changed
     */
    const typesOfPreviousWorkExperienceToShowDetailsFormFor = [
      ...this.typesOfPreviousWorkExperienceToShowDetailsFormFor(inductionDto, previousWorkExperienceTypesForm),
    ].sort(previousWorkExperienceTypeScreenOrderComparator) // sort them by the order presented on screen (which is not alphabetic on the enum values)

    logger.debug(
      `Previous Work Experiences changes resulting in going to the Detail pages for ${typesOfPreviousWorkExperienceToShowDetailsFormFor}`,
    )

    // TODO - replace with correct redirect once we've implemented form redirect/handling for a "queue" of Previous Work Experience Detail pages
    return res.redirect(`/plan/${prisonNumber}/view/work-and-interests`)
  }

  /**
   * Updates the Induction using the InductionService.
   * @throws Error if InductionService throws an error. The Error from InductionService is rethrown.
   */
  private updateInduction = async (
    inductionDto: InductionDto,
    previousWorkExperienceTypesForm: PreviousWorkExperienceTypesForm,
    req: Request,
    prisonerSummary: PrisonerSummary,
  ) => {
    const updatedInduction = this.updatedInductionDtoWithRemovedPreviousWorkExperiencesAndChangesToOther(
      inductionDto,
      previousWorkExperienceTypesForm,
    )
    const updateInductionDto = toCreateOrUpdateInductionDto(prisonerSummary.prisonId, updatedInduction)

    try {
      await this.inductionService.updateInduction(prisonerSummary.prisonNumber, updateInductionDto, req.user.token)
      req.session.previousWorkExperienceTypesForm = undefined
      req.session.inductionDto = undefined
    } catch (e) {
      logger.error(`Error updating Induction for prisoner ${prisonerSummary.prisonNumber}`, e)
      throw e
    }
  }

  /**
   * Returns an [InductionDto] that represents the Induction with changes made to it.
   * Specifically this method is only for use when
   *   * Previous Work Experiences have been removed
   *   * Or the value for Other has been changed
   *
   * This method is not suitable for use when Previous Work Experiences have been added.
   */
  private updatedInductionDtoWithRemovedPreviousWorkExperiencesAndChangesToOther(
    inductionDto: InductionDto,
    previousWorkExperienceTypesForm: PreviousWorkExperienceTypesForm,
  ): InductionDto {
    const removedPreviousWorkExperienceTypes = this.removedPreviousWorkExperienceTypes(
      inductionDto,
      previousWorkExperienceTypesForm,
    )

    const updatedPreviousWorkExperiences: Array<PreviousWorkExperienceDto> =
      inductionDto.previousWorkExperiences.experiences
        .filter(experience => !removedPreviousWorkExperienceTypes.includes(experience.experienceType))
        // We have filtered out all the work experiences that have been removed
        .map(experience => {
          if (experience.experienceType === TypeOfWorkExperienceValue.OTHER) {
            return {
              ...experience,
              experienceTypeOther: previousWorkExperienceTypesForm.typeOfWorkExperienceOther,
            }
          }
          return {
            ...experience,
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
  private previousWorkExperienceTypesOnCurrentInduction = (
    inductionDto: InductionDto,
  ): Array<TypeOfWorkExperienceValue> =>
    inductionDto.previousWorkExperiences.experiences.map(experience => experience.experienceType)

  /**
   * Given the current Induction and the [PreviousWorkExperienceTypesForm], returns a list of [TypeOfWorkExperienceValue]
   * that represent the Previous Work Experiences that are to be removed.
   * IE. those that exist on the Induction, but not in the [PreviousWorkExperienceTypesForm]
   */
  private removedPreviousWorkExperienceTypes = (
    inductionDto: InductionDto,
    previousWorkExperienceTypesForm: PreviousWorkExperienceTypesForm,
  ): Array<TypeOfWorkExperienceValue> =>
    [...this.previousWorkExperienceTypesOnCurrentInduction(inductionDto)].filter(
      type => !previousWorkExperienceTypesForm.typeOfWorkExperience.includes(type),
    )

  /**
   * Given the current Induction and the [PreviousWorkExperienceTypesForm], returns a list of [TypeOfWorkExperienceValue]
   * that represent the Previous Work Experiences that are to be added.
   * IE. those that do not exist on the Induction, but are in the [PreviousWorkExperienceTypesForm]
   */
  private addedPreviousWorkExperienceTypes = (
    inductionDto: InductionDto,
    previousWorkExperienceTypesForm: PreviousWorkExperienceTypesForm,
  ): Array<TypeOfWorkExperienceValue> =>
    [...previousWorkExperienceTypesForm.typeOfWorkExperience].filter(
      type => !this.previousWorkExperienceTypesOnCurrentInduction(inductionDto).includes(type),
    )

  /**
   * Given the current Induction and the [PreviousWorkExperienceTypesForm], returns `true` if both the Induction and the
   * [PreviousWorkExperienceTypesForm] inclyde a Previous Work Experience type of OTHER, and the it's value is different.
   */
  private otherTypeOfWorkExperienceHasBeenChanged = (
    inductionDto: InductionDto,
    previousWorkExperienceTypesForm: PreviousWorkExperienceTypesForm,
  ): boolean =>
    this.previousWorkExperienceTypesOnCurrentInduction(inductionDto).includes(TypeOfWorkExperienceValue.OTHER) &&
    previousWorkExperienceTypesForm.typeOfWorkExperience.includes(TypeOfWorkExperienceValue.OTHER) &&
    inductionDto.previousWorkExperiences.experiences.find(
      experience => experience.experienceType === TypeOfWorkExperienceValue.OTHER,
    )?.experienceTypeOther !== previousWorkExperienceTypesForm.typeOfWorkExperienceOther

  /**
   * Given the current Induction and the [PreviousWorkExperienceTypesForm], returns `true` if there have been no changes
   * to the Previous Work Experiences.
   * IE. No removals, no additions, and OTHER has not been changed.
   */
  private noChangesToPreviousWorkExperienceSubmitted = (
    inductionDto: InductionDto,
    previousWorkExperienceTypesForm: PreviousWorkExperienceTypesForm,
  ): boolean =>
    this.removedPreviousWorkExperienceTypes(inductionDto, previousWorkExperienceTypesForm).length === 0 &&
    this.addedPreviousWorkExperienceTypes(inductionDto, previousWorkExperienceTypesForm).length === 0 &&
    !this.otherTypeOfWorkExperienceHasBeenChanged(inductionDto, previousWorkExperienceTypesForm)

  /**
   * Given the current Induction and the [PreviousWorkExperienceTypesForm], returns `true` if the only changes to the
   * Previous Work Experiences are the removal of one or more Previous Work Experience types.
   * IE. One or more removals, no additions, and OTHER has not been changed.
   */
  private onlyRemovalsWereMadeToPreviousWorkExperienceSubmitted = (
    inductionDto: InductionDto,
    previousWorkExperienceTypesForm: PreviousWorkExperienceTypesForm,
  ): boolean =>
    this.removedPreviousWorkExperienceTypes(inductionDto, previousWorkExperienceTypesForm).length > 0 &&
    this.addedPreviousWorkExperienceTypes(inductionDto, previousWorkExperienceTypesForm).length === 0 &&
    !this.otherTypeOfWorkExperienceHasBeenChanged(inductionDto, previousWorkExperienceTypesForm)

  /**
   * Given the current Induction and the [PreviousWorkExperienceTypesForm], returns a list of [TypeOfWorkExperienceValue]
   * that represent the Previous Work Experiences that will remain on the Induction after any removals, plus any additions
   * from the form; plus OTHER if it's value has changed.
   */

  private typesOfPreviousWorkExperienceToShowDetailsFormFor = (
    inductionDto: InductionDto,
    previousWorkExperienceTypesForm: PreviousWorkExperienceTypesForm,
  ): Array<TypeOfWorkExperienceValue> => {
    const removedPreviousWorkExperienceTypes = this.removedPreviousWorkExperienceTypes(
      inductionDto,
      previousWorkExperienceTypesForm,
    )
    const addedPreviousWorkExperienceTypes = this.addedPreviousWorkExperienceTypes(
      inductionDto,
      previousWorkExperienceTypesForm,
    )
    return [
      ...this.previousWorkExperienceTypesOnCurrentInduction(inductionDto), // All work types that were on the induction to start with
      ...addedPreviousWorkExperienceTypes, // plus any that have been added on this form
      this.otherTypeOfWorkExperienceHasBeenChanged(inductionDto, previousWorkExperienceTypesForm) // plus OTHER if the value has changed
        ? TypeOfWorkExperienceValue.OTHER
        : undefined,
    ]
      .filter(type => !removedPreviousWorkExperienceTypes.includes(type)) // filter out any that were removed on the form
      .filter(type => type !== undefined) // filter out any undefined values in the array
  }
}
