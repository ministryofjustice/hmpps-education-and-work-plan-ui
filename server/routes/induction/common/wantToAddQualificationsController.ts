import { NextFunction, Request, RequestHandler, Response } from 'express'
import type { Assessment } from 'viewModels'
import type { WantToAddQualificationsForm } from 'inductionForms'
import type { InductionDto } from 'inductionDto'
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
    const { prisonerSummary, prisonerFunctionalSkills, inductionDto } = req.session
    const { prisonNumber } = req.params

    // There will always be a page flow history for this page, because you can only get here from the Induction "Reasons Not To Work"
    // or "Check Your Answers" pages; both of which correctly setup the page flow history before coming here.
    this.addCurrentPageToHistory(req, `/prisoners/${prisonNumber}/induction/want-to-add-qualifications`)

    const functionalSkills = {
      ...prisonerFunctionalSkills,
      assessments: mostRecentAssessments(prisonerFunctionalSkills.assessments || []),
    }
    const wantToAddQualificationsForm =
      req.session.wantToAddQualificationsForm || createWantToAddQualificationsForm(inductionDto)
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

const createWantToAddQualificationsForm = (inductionDto: InductionDto): WantToAddQualificationsForm => {
  const numberOfQualificationsAlreadyOnInduction = inductionDto.previousQualifications?.qualifications?.length
  if (Number.isInteger(numberOfQualificationsAlreadyOnInduction)) {
    return {
      wantToAddQualifications: numberOfQualificationsAlreadyOnInduction > 0 ? YesNoValue.YES : YesNoValue.NO,
    }
  }

  // There is no previousQualifications or qualifications objects on the induction, so this is a new Induction where
  // this is the first time the question is being asked. Therefore the field `wantToAddQualifications` should be
  // undefined so that the user is forced to answer it.
  return {
    wantToAddQualifications: undefined,
  }
}
