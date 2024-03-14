import { NextFunction, Request, RequestHandler, Response } from 'express'
import type { InductionDto } from 'inductionDto'
import type { SkillsForm } from 'inductionForms'
import InductionController from './inductionController'
import SkillsView from './skillsView'
import SkillsValue from '../../../enums/skillsValue'

/**
 * Abstract controller class defining functionality common to both the Create and Update Induction journeys.
 */
export default abstract class SkillsController extends InductionController {
  /**
   * Returns the Skills view; suitable for use by the Create and Update journeys.
   */
  getSkillsView: RequestHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { prisonerSummary, inductionDto } = req.session

    const skillsForm = req.session.skillsForm || toSkillsForm(inductionDto)
    req.session.skillsForm = undefined

    const view = new SkillsView(
      prisonerSummary,
      this.getBackLinkUrl(req),
      this.getBackLinkAriaText(req),
      skillsForm,
      req.flash('errors'),
    )
    return res.render('pages/induction/skills/index', { ...view.renderArgs })
  }
}

const toSkillsForm = (inductionDto: InductionDto): SkillsForm => {
  return {
    skills: inductionDto.personalSkillsAndInterests?.skills.map(skill => skill.skillType) || [],
    skillsOther: inductionDto.personalSkillsAndInterests?.skills.find(skill => skill.skillType === SkillsValue.OTHER)
      ?.skillTypeOther,
  }
}
