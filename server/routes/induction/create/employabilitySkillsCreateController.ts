import { NextFunction, Request, RequestHandler, Response } from 'express'
import type { InductionDto } from 'inductionDto'
import type { EmployabilitySkillResponseDto } from 'dto'
import EmployabilitySkillsValue from '../../../enums/employabilitySkillsValue'
import EmployabilitySkillRatingValue from '../../../enums/employabilitySkillRatingValue'
import EmployabilitySkillSessionType from '../../../enums/employabilitySkillSessionType'
import { asArray } from '../../../utils/utils'

export default class EmployabilitySkillsCreateController {
  getEmployabilitySkillsView: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    const { inductionDto } = req.journeyData
    const { prisonerSummary, invalidForm } = res.locals

    const employabilitySkillsForm = invalidForm
      ? {
          ...invalidForm,
          employabilitySkills: invalidForm.employabilitySkills || [],
          rating: invalidForm.rating || {},
        }
      : toEmployabilitySkillsForm(inductionDto)

    return res.render('pages/induction/employability-skills/index', { prisonerSummary, form: employabilitySkillsForm })
  }

  submitEmployabilitySkillsForm: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    const { inductionDto } = req.journeyData

    const employabilitySkillsForm = {
      employabilitySkills: asArray(req.body.employabilitySkills),
      rating: req.body.rating || {},
    }

    const updatedInduction = updatedInductionDtoWithEmployabilitySkills(inductionDto, employabilitySkillsForm)
    req.journeyData.inductionDto = updatedInduction

    return res.redirect(req.query?.submitToCheckAnswers === 'true' ? 'check-your-answers' : 'personal-interests')
  }
}

const toEmployabilitySkillsForm = (
  inductionDto: InductionDto,
): {
  employabilitySkills: Array<EmployabilitySkillsValue>
  rating: Record<EmployabilitySkillsValue, EmployabilitySkillRatingValue>
} => {
  return {
    employabilitySkills:
      inductionDto.employabilitySkills?.map(employabilitySkill => employabilitySkill.employabilitySkillType) || [],
    rating:
      inductionDto.employabilitySkills?.reduce(
        (acc, { employabilitySkillType, employabilitySkillRating }) => {
          acc[employabilitySkillType as EmployabilitySkillsValue] = employabilitySkillRating
          return acc
        },
        {} as Record<EmployabilitySkillsValue, EmployabilitySkillRatingValue>,
      ) || ({} as Record<EmployabilitySkillsValue, EmployabilitySkillRatingValue>),
  }
}

const updatedInductionDtoWithEmployabilitySkills = (
  inductionDto: InductionDto,
  employabilitySkillsForm: {
    employabilitySkills: Array<EmployabilitySkillsValue>
    rating: Record<EmployabilitySkillsValue, EmployabilitySkillRatingValue>
  },
): InductionDto => {
  const updatedEmployabilitySkills = employabilitySkillsForm.employabilitySkills.map(
    employabilitySkill =>
      ({
        employabilitySkillType: employabilitySkill,
        employabilitySkillRating: employabilitySkillsForm.rating[employabilitySkill],
        evidence: 'Session Type does not require evidence',
        sessionType: EmployabilitySkillSessionType.CIAG_INDUCTION,
        sessionTypeDescription: undefined,
      }) as EmployabilitySkillResponseDto,
  )

  return {
    ...inductionDto,
    employabilitySkills: updatedEmployabilitySkills,
  }
}
