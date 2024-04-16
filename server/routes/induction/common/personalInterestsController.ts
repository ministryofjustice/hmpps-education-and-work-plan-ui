import { NextFunction, Request, RequestHandler, Response } from 'express'
import type { InductionDto } from 'inductionDto'
import type { PersonalInterestsForm } from 'inductionForms'
import InductionController from './inductionController'
import PersonalInterestsView from './personalInterestsView'
import PersonalInterestsValue from '../../../enums/personalInterestsValue'

/**
 * Abstract controller class defining functionality common to both the Create and Update Induction journeys.
 */
export default abstract class PersonalInterestsController extends InductionController {
  /**
   * Returns the Personal Interests view; suitable for use by the Create and Update journeys.
   */
  getPersonalInterestsView: RequestHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { prisonerSummary, inductionDto } = req.session

    const personalInterestsForm = req.session.personalInterestsForm || toPersonalInterestsForm(inductionDto)
    req.session.personalInterestsForm = undefined

    // Check if we are in the midst of changing the main induction question set (in this case from short route to long route)
    if (req.session.updateInductionQuestionSet) {
      const { prisonNumber } = req.params
      this.addCurrentPageToHistory(req, `/prisoners/${prisonNumber}/induction/personal-interests`)
    }

    const view = new PersonalInterestsView(
      prisonerSummary,
      this.getBackLinkUrl(req),
      this.getBackLinkAriaText(req),
      personalInterestsForm,
      req.flash('errors'),
    )
    return res.render('pages/induction/personalInterests/index', { ...view.renderArgs })
  }
}

const toPersonalInterestsForm = (inductionDto: InductionDto): PersonalInterestsForm => {
  return {
    personalInterests: inductionDto.personalSkillsAndInterests?.interests?.map(interest => interest.interestType) || [],
    personalInterestsOther: inductionDto.personalSkillsAndInterests?.interests?.find(
      interest => interest.interestType === PersonalInterestsValue.OTHER,
    )?.interestTypeOther,
  }
}
