import { NextFunction, Request, RequestHandler, Response } from 'express'
import type { PageFlow } from 'viewModels'
import type { InductionDto } from 'inductionDto'
import type { PreviousWorkExperienceTypesForm } from 'inductionForms'
import PreviousWorkExperienceTypesController from '../common/previousWorkExperienceTypesController'
import previousWorkExperienceTypeScreenOrderComparator from '../previousWorkExperienceTypeScreenOrderComparator'
import logger from '../../../../logger'
import { getNextPage } from '../../pageFlowQueue'
import { asArray } from '../../../utils/utils'

export default class PreviousWorkExperienceTypesCreateController extends PreviousWorkExperienceTypesController {
  submitPreviousWorkExperienceTypesForm: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    const { prisonNumber, journeyId } = req.params
    const { inductionDto } = req.journeyData

    const previousWorkExperienceTypesForm: PreviousWorkExperienceTypesForm = {
      typeOfWorkExperience: asArray(req.body.typeOfWorkExperience),
      typeOfWorkExperienceOther: req.body.typeOfWorkExperienceOther,
    }

    const updatedInduction = this.updatedInductionDtoWithPreviousWorkExperiences(
      inductionDto,
      previousWorkExperienceTypesForm,
    )
    req.journeyData.inductionDto = updatedInduction

    // We need to show the Details page for each work experience type.
    const pageFlowQueue = buildPageFlowQueue(updatedInduction, prisonNumber, journeyId)
    req.session.pageFlowQueue = pageFlowQueue

    return res.redirect(getNextPage(pageFlowQueue))
  }
}

/**
 * Builds and returns a Page Flow Queue to show the Details page for each work experience type. The list of pages to be
 * added to the queue is the list of work types on the updated induction.
 */
const buildPageFlowQueue = (updatedInduction: InductionDto, prisonNumber: string, journeyId: string): PageFlow => {
  const workExperienceTypesOnUpdatedInduction = (updatedInduction.previousWorkExperiences.experiences || []).map(
    experience => experience.experienceType,
  )

  const workExperienceTypesToShowDetailsFormFor = [...workExperienceTypesOnUpdatedInduction].sort(
    previousWorkExperienceTypeScreenOrderComparator, // sort them by the order presented on screen (which is not alphabetic on the enum values)
  )
  logger.debug(
    `Previous Work Experiences resulting in going to the Detail pages for ${workExperienceTypesToShowDetailsFormFor}`,
  )

  const nextPages = workExperienceTypesToShowDetailsFormFor.map(
    workType =>
      `/prisoners/${prisonNumber}/create-induction/${journeyId}/previous-work-experience/${workType.toLowerCase()}`,
  )
  const pageUrls = [`/prisoners/${prisonNumber}/create-induction/${journeyId}/previous-work-experience`, ...nextPages]
  return {
    pageUrls,
    currentPageIndex: 0,
  }
}
