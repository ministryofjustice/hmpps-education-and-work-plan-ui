import { NextFunction, Request, RequestHandler, Response } from 'express'
import type { Assessment } from 'viewModels'
import type { WantToAddQualificationsForm } from 'inductionForms'
import InductionController from './inductionController'
import WantToAddQualificationsView from './wantToAddQualificationsView'
import dateComparator from '../../dateComparator'
import YesNoValue from '../../../enums/yesNoValue'

/**
 * Abstract controller class defining functionality common to both the Create and Update Induction journeys.
 */
export default abstract class WantToAddQualificationsController extends InductionController {
  /**
   * Returns the Want to Add Qualifications view; suitable for use by the Create and Update journeys.
   */
  getWantToAddQualificationsView: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    const { prisonerSummary, prisonerFunctionalSkills } = req.session
    const { prisonNumber } = req.params
    this.addCurrentPageToQueue(req, `/prisoners/${prisonNumber}/induction/want-to-add-qualifications`)

    const functionalSkills = {
      ...prisonerFunctionalSkills,
      assessments: mostRecentAssessments(prisonerFunctionalSkills.assessments || []),
    }
    const wantToAddQualificationsForm = req.session.wantToAddQualificationsForm || createWantToAddQualificationsForm()
    req.session.wantToAddQualificationsForm = undefined

    const view = new WantToAddQualificationsView(
      prisonerSummary,
      this.getBackLinkUrl(req),
      this.getBackLinkAriaText(req),
      wantToAddQualificationsForm,
      functionalSkills,
    )
    return res.render('pages/induction/prePrisonEducation/wantToAddQualifications', { ...view.renderArgs })
  }
}

// TODO - this is duplicated in QualificationsListController - needs putting somewhere common
const mostRecentAssessments = (allAssessments: Array<Assessment>): Array<Assessment> => {
  const allAssessmentsGroupedByTypeSortedByDateDesc = assessmentsGroupedByTypeSortedByDateDesc(allAssessments)

  const latestEnglishAssessment = allAssessmentsGroupedByTypeSortedByDateDesc.get('ENGLISH')?.at(0)
  const latestMathsAssessment = allAssessmentsGroupedByTypeSortedByDateDesc.get('MATHS')?.at(0)
  const latestOtherAssessments = [...allAssessmentsGroupedByTypeSortedByDateDesc.keys()]
    .filter(key => key !== 'ENGLISH' && key !== 'MATHS')
    .map(key => allAssessmentsGroupedByTypeSortedByDateDesc.get(key).at(0))

  return Array.of(latestEnglishAssessment, latestMathsAssessment, ...latestOtherAssessments).filter(
    assessment => assessment != null,
  )
}

const assessmentsGroupedByTypeSortedByDateDesc = (assessments: Array<Assessment>): Map<string, Array<Assessment>> => {
  const assessmentsByType = new Map<string, Array<Assessment>>()
  assessments.forEach(assessment => {
    const key = assessment.type
    const value: Array<Assessment> = assessmentsByType.get(key) || []
    value.push(assessment)
    assessmentsByType.set(
      key,
      value.sort((left: Assessment, right: Assessment) =>
        dateComparator(left.assessmentDate, right.assessmentDate, 'DESC'),
      ),
    )
  })
  return assessmentsByType
}

const createWantToAddQualificationsForm = (): WantToAddQualificationsForm => {
  return {
    wantToAddQualifications: YesNoValue.NO,
  }
}
