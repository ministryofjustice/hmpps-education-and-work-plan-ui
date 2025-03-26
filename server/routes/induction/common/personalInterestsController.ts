import { NextFunction, Request, RequestHandler, Response } from 'express'
import type { InductionDto, PersonalInterestDto } from 'inductionDto'
import type { PersonalInterestsForm } from 'inductionForms'
import InductionController from './inductionController'
import PersonalInterestsView from './personalInterestsView'
import PersonalInterestsValue from '../../../enums/personalInterestsValue'
import { getPrisonerContext } from '../../../data/session/prisonerContexts'

/**
 * Abstract controller class defining functionality common to both the Create and Update Induction journeys.
 */
export default abstract class PersonalInterestsController extends InductionController {
  /**
   * Returns the Personal Interests view; suitable for use by the Create and Update journeys.
   */
  getPersonalInterestsView: RequestHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { prisonNumber } = req.params
    const { prisonerSummary } = res.locals
    const { inductionDto } = getPrisonerContext(req.session, prisonNumber)

    const personalInterestsForm =
      getPrisonerContext(req.session, prisonNumber).personalInterestsForm || toPersonalInterestsForm(inductionDto)
    getPrisonerContext(req.session, prisonNumber).personalInterestsForm = undefined

    this.addCurrentPageToFlowHistoryWhenComingFromCheckYourAnswers(req)

    const view = new PersonalInterestsView(prisonerSummary, personalInterestsForm)
    return res.render('pages/induction/personalInterests/index', { ...view.renderArgs })
  }

  protected updatedInductionDtoWithPersonalInterests(
    inductionDto: InductionDto,
    personalInterestsForm: PersonalInterestsForm,
  ): InductionDto {
    const updatedInterests: PersonalInterestDto[] = personalInterestsForm.personalInterests.map(interest => {
      return {
        interestType: interest,
        interestTypeOther:
          interest === PersonalInterestsValue.OTHER ? personalInterestsForm.personalInterestsOther : undefined,
      }
    })
    return {
      ...inductionDto,
      personalSkillsAndInterests: {
        ...inductionDto.personalSkillsAndInterests,
        interests: updatedInterests,
      },
    }
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
