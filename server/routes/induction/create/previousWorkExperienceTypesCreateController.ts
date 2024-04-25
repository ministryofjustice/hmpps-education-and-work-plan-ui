import { NextFunction, Request, RequestHandler, Response } from 'express'
import type { PageFlow } from 'viewModels'
import type { InductionDto } from 'inductionDto'
import PreviousWorkExperienceTypesController from '../common/previousWorkExperienceTypesController'
import { buildNewPageFlowHistory } from '../../pageFlowHistory'
import getDynamicBackLinkAriaText from '../dynamicAriaTextResolver'
import validatePreviousWorkExperienceTypesForm from '../../validators/induction/previousWorkExperienceTypesFormValidator'
import previousWorkExperienceTypeScreenOrderComparator from '../previousWorkExperienceTypeScreenOrderComparator'
import logger from '../../../../logger'
import { getNextPage } from '../../pageFlowQueue'

export default class PreviousWorkExperienceTypesCreateController extends PreviousWorkExperienceTypesController {
  getBackLinkUrl(req: Request): string {
    const { prisonNumber } = req.params
    return `/prisoners/${prisonNumber}/create-induction/has-worked-before`
  }

  getBackLinkAriaText(req: Request): string {
    return getDynamicBackLinkAriaText(req, this.getBackLinkUrl(req))
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
      return res.redirect(`/prisoners/${prisonNumber}/create-induction/previous-work-experience`)
    }

    const updatedInduction = this.updatedInductionDtoWithPreviousWorkExperiences(
      inductionDto,
      previousWorkExperienceTypesForm,
    )
    req.session.inductionDto = updatedInduction

    // We need to show the Details page for each work experience type
    const pageFlowQueue = buildPageFlowQueue(updatedInduction, prisonNumber)
    req.session.pageFlowQueue = pageFlowQueue
    // We also need the page flow history so subsequent pages know where we have been and can display the correct back link
    req.session.pageFlowHistory = buildNewPageFlowHistory(req)
    req.session.previousWorkExperienceTypesForm = undefined

    return res.redirect(getNextPage(pageFlowQueue))
  }
}

const buildPageFlowQueue = (induction: InductionDto, prisonNumber: string): PageFlow => {
  const workExperiencesOnInduction = induction.previousWorkExperiences.experiences
  const workExperienceTypesToShowDetailsFormFor = workExperiencesOnInduction
    .map(experience => experience.experienceType)
    .sort(previousWorkExperienceTypeScreenOrderComparator) // sort them by the order presented on screen (which is not alphabetic on the enum values)
  logger.debug(
    `Previous Work Experiences resulting in going to the Detail pages for ${workExperienceTypesToShowDetailsFormFor}`,
  )

  const nextPages = workExperienceTypesToShowDetailsFormFor.map(
    workType => `/prisoners/${prisonNumber}/create-induction/previous-work-experience/${workType.toLowerCase()}`,
  )
  const pageUrls = [`/prisoners/${prisonNumber}/create-induction/previous-work-experience`, ...nextPages]
  return {
    pageUrls,
    currentPageIndex: 0,
  }
}
