import { NextFunction, Request, RequestHandler, Response } from 'express'
import type { InductionDto, PersonalSkillDto } from 'inductionDto'
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
    const { inductionDto } = req.journeyData
    const { prisonerSummary } = res.locals

    const skillsForm = req.session.skillsForm || toSkillsForm(inductionDto)
    req.session.skillsForm = undefined

    this.addCurrentPageToFlowHistoryWhenComingFromCheckYourAnswers(req)

    const view = new SkillsView(prisonerSummary, skillsForm)
    return res.render('pages/induction/skills/index', { ...view.renderArgs })
  }

  protected updatedInductionDtoWithSkills(inductionDto: InductionDto, skillsForm: SkillsForm): InductionDto {
    const updatedSkills: PersonalSkillDto[] = skillsForm.skills.map(skill => {
      return {
        skillType: skill,
        skillTypeOther: skill === SkillsValue.OTHER ? skillsForm.skillsOther : undefined,
      }
    })
    return {
      ...inductionDto,
      personalSkillsAndInterests: {
        ...inductionDto.personalSkillsAndInterests,
        skills: updatedSkills,
      },
    }
  }
}

const toSkillsForm = (inductionDto: InductionDto): SkillsForm => {
  return {
    skills: inductionDto.personalSkillsAndInterests?.skills?.map(skill => skill.skillType) || [],
    skillsOther: inductionDto.personalSkillsAndInterests?.skills?.find(skill => skill.skillType === SkillsValue.OTHER)
      ?.skillTypeOther,
  }
}
