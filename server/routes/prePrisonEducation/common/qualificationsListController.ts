import { NextFunction, Request, RequestHandler, Response } from 'express'
import type { Assessment } from 'viewModels'
import type { EducationDto } from 'dto'
import QualificationsListView from './qualificationsListView'
import dateComparator from '../../dateComparator'
import { getPrisonerContext } from '../../../data/session/prisonerContexts'
import EducationController from './educationController'

/**
 * Abstract controller class defining functionality common to both the Create and Update journeys.
 */
export default abstract class QualificationsListController extends EducationController {
  getQualificationsListView: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    const { prisonNumber } = req.params
    const { prisonerSummary } = req.session

    const { educationDto } = getPrisonerContext(req.session, prisonNumber)

    if (!educationDto.educationLevel) {
      return res.redirect(`/prisoners/${prisonNumber}/create-education/highest-level-of-education`)
    }

    const { prisonerFunctionalSkills, curiousInPrisonCourses } = res.locals
    const functionalSkills = {
      ...prisonerFunctionalSkills,
      assessments: mostRecentAssessments(prisonerFunctionalSkills.assessments || []),
    }

    const view = new QualificationsListView(
      prisonerSummary,
      this.getBackLinkUrl(req),
      this.getBackLinkAriaText(req),
      educationDto.qualifications,
      functionalSkills,
      curiousInPrisonCourses,
    )
    return res.render('pages/prePrisonEducation/qualificationsList', { ...view.renderArgs })
  }

  protected educationHasQualifications = (educationDto: EducationDto): boolean =>
    educationDto.qualifications?.length > 0

  protected userClickedOnButton = (request: Request, buttonName: string): boolean =>
    Object.prototype.hasOwnProperty.call(request.body, buttonName)

  protected educationWithRemovedQualification = (
    educationDto: EducationDto,
    qualificationIndexToRemove: number,
  ): EducationDto => {
    const updatedQualifications = [...educationDto.qualifications]
    updatedQualifications.splice(qualificationIndexToRemove, 1)
    return {
      ...educationDto,
      qualifications: updatedQualifications,
    }
  }
}

// TODO - this is duplicated in induction QualificationListController and WantToAddQualificationsController - needs putting somewhere common
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
