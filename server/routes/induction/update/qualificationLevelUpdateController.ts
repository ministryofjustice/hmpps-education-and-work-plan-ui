import { NextFunction, Request, RequestHandler, Response } from 'express'
import QualificationLevelController from '../common/qualificationLevelController'
import validateQualificationLevelForm from './qualificationLevelFormValidator'
import { addPage, getNextPage, getPreviousPage } from '../../pageFlowQueue'
import getDynamicBackLinkAriaText from '../dynamicAriaText'

/**
 * Controller for the Update of the Qualification Level screen of the Induction.
 */
export default class QualificationLevelUpdateController extends QualificationLevelController {
  getBackLinkUrl(req: Request): string {
    const { pageFlowQueue } = req.session
    return getPreviousPage(pageFlowQueue)
  }

  getBackLinkAriaText(req: Request): string {
    return getDynamicBackLinkAriaText(req, this.getBackLinkUrl(req))
  }

  submitQualificationLevelForm: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    const { prisonNumber } = req.params
    const { prisonerSummary, pageFlowQueue } = req.session

    req.session.qualificationLevelForm = { ...req.body }
    const { qualificationLevelForm } = req.session

    const errors = validateQualificationLevelForm(qualificationLevelForm, prisonerSummary)
    if (errors.length > 0) {
      req.flash('errors', errors)
      return res.redirect(`/prisoners/${prisonNumber}/induction/qualification-level`)
    }

    const updatedPageFlowQueue = addPage(pageFlowQueue, `/prisoners/${prisonNumber}/induction/qualification-details`)
    req.session.pageFlowQueue = updatedPageFlowQueue
    return res.redirect(getNextPage(updatedPageFlowQueue))
  }
}
