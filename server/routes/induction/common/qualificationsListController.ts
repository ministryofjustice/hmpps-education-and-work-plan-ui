import { NextFunction, Request, RequestHandler, Response } from 'express'
import type { AchievedQualificationDto } from 'dto'
import type { Assessment } from 'viewModels'
import InductionController from './inductionController'
import QualificationsListView from './qualificationsListView'
import dateComparator from '../../dateComparator'

/**
 * Abstract controller class defining functionality common to both the Create and Update Induction journeys.
 */
export default abstract class QualificationsListController extends InductionController {
  /**
   * Returns the Qualifications List view; suitable for use by the Create and Update journeys.
   */
  getQualificationsListView: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    const inductionDto = req.session.inductionDto ?? req.journeyData?.inductionDto
    const { prisonerSummary } = res.locals

    const qualifications: Array<AchievedQualificationDto> = inductionDto.previousQualifications?.qualifications

    const { prisonerFunctionalSkills, curiousInPrisonCourses } = res.locals
    const functionalSkills = {
      ...prisonerFunctionalSkills,
      assessments: mostRecentAssessments(prisonerFunctionalSkills.assessments || []),
    }

    const view = new QualificationsListView(prisonerSummary, qualifications, functionalSkills, curiousInPrisonCourses)
    return res.render('pages/prePrisonEducation/qualificationsList', { ...view.renderArgs })
  }
}

// TODO - this is duplicated in WantToAddQualificationsController - needs putting somewhere common
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
