import { NextFunction, Request, RequestHandler, Response } from 'express'
import createError from 'http-errors'
import type { Assessment } from 'viewModels'
import type { EducationDto } from 'dto'
import getDynamicBackLinkAriaText from '../dynamicAriaTextResolver'
import QualificationsListView from './qualificationsListView'
import dateComparator from '../dateComparator'
import getPrisonerContext from '../../data/session/prisonerContexts'
import { EducationAndWorkPlanService } from '../../services'
import toCreateEducationDto from '../../data/mappers/createCreateOrUpdateEducationDtoMapper'
import logger from '../../../logger'

export default class QualificationsListController {
  constructor(private readonly educationAndWorkPlanService: EducationAndWorkPlanService) {}

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

  submitQualificationsListView: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    const { prisonNumber } = req.params
    const { prisonId } = req.session.prisonerSummary

    if (userClickedOnButton(req, 'addQualification')) {
      return res.redirect(`/prisoners/${prisonNumber}/create-education/qualification-level`)
    }

    const { educationDto } = getPrisonerContext(req.session, prisonNumber)

    if (userClickedOnButton(req, 'removeQualification')) {
      const qualificationIndexToRemove = req.body.removeQualification as number
      const updatedEducation = educationWithRemovedQualification(educationDto, qualificationIndexToRemove)
      getPrisonerContext(req.session, prisonNumber).educationDto = updatedEducation
      return res.redirect(`/prisoners/${prisonNumber}/create-education/qualifications`)
    }

    if (!educationHasQualifications(educationDto)) {
      return res.redirect(`/prisoners/${prisonNumber}/create-education/qualification-level`)
    }

    const createdEducationDto = toCreateEducationDto(prisonId, educationDto)

    try {
      await this.educationAndWorkPlanService.createEducation(prisonNumber, createdEducationDto, req.user.token)
      getPrisonerContext(req.session, prisonNumber).educationDto = undefined
      return res.redirect(`/plan/${prisonNumber}/view/education-and-training`)
    } catch (e) {
      logger.error(`Error creating Education for prisoner ${prisonNumber}`, e)
      return next(createError(500, `Error creating Education for prisoner ${prisonNumber}. Error: ${e}`))
    }
  }

  private getBackLinkUrl(req: Request): string {
    const { prisonNumber } = req.params
    return `/prisoners/${prisonNumber}/create-education/highest-level-of-education`
  }

  private getBackLinkAriaText(req: Request): string {
    return getDynamicBackLinkAriaText(req, this.getBackLinkUrl(req))
  }
}

const educationHasQualifications = (educationDto: EducationDto): boolean => educationDto.qualifications?.length > 0

const userClickedOnButton = (request: Request, buttonName: string): boolean =>
  Object.prototype.hasOwnProperty.call(request.body, buttonName)

const educationWithRemovedQualification = (
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
