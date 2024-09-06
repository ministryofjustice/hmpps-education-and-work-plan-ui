import { NextFunction, Request, Response } from 'express'
import type { PageFlow } from 'viewModels'
import type { InductionDto } from 'inductionDto'
import type { HighestLevelOfEducationForm } from 'forms'
import type {
  AdditionalTrainingForm,
  AffectAbilityToWorkForm,
  HopingToWorkOnReleaseForm,
  InPrisonTrainingForm,
  InPrisonWorkForm,
  PersonalInterestsForm,
  PreviousWorkExperienceDetailForm,
  PreviousWorkExperienceTypesForm,
  QualificationDetailsForm,
  QualificationLevelForm,
  SkillsForm,
  WantToAddQualificationsForm,
  WorkedBeforeForm,
  WorkInterestTypesForm,
} from 'inductionForms'
import { SessionData } from 'express-session'
import removeInductionFormsFromSession from './removeInductionFormsFromSession'

describe('removeInductionFormsFromSession', () => {
  const req = {
    session: {} as SessionData,
  }
  const res = {}
  const next = jest.fn()

  beforeEach(() => {
    jest.resetAllMocks()
    req.session = {} as SessionData
  })

  it('should remove induction forms from session', async () => {
    // Given
    req.session.pageFlowQueue = {} as PageFlow
    req.session.pageFlowHistory = {} as PageFlow
    req.session.inductionDto = {} as InductionDto
    req.session.hopingToWorkOnReleaseForm = {} as HopingToWorkOnReleaseForm
    req.session.inPrisonWorkForm = {} as InPrisonWorkForm
    req.session.skillsForm = {} as SkillsForm
    req.session.personalInterestsForm = {} as PersonalInterestsForm
    req.session.workedBeforeForm = {} as WorkedBeforeForm
    req.session.previousWorkExperienceTypesForm = {} as PreviousWorkExperienceTypesForm
    req.session.previousWorkExperienceDetailForm = {} as PreviousWorkExperienceDetailForm
    req.session.affectAbilityToWorkForm = {} as AffectAbilityToWorkForm
    req.session.workInterestTypesForm = {} as WorkInterestTypesForm
    req.session.inPrisonTrainingForm = {} as InPrisonTrainingForm
    req.session.wantToAddQualificationsForm = {} as WantToAddQualificationsForm
    req.session.highestLevelOfEducationForm = {} as HighestLevelOfEducationForm
    req.session.qualificationLevelForm = {} as QualificationLevelForm
    req.session.qualificationDetailsForm = {} as QualificationDetailsForm
    req.session.additionalTrainingForm = {} as AdditionalTrainingForm

    // When
    await removeInductionFormsFromSession(
      req as undefined as Request,
      res as undefined as Response,
      next as undefined as NextFunction,
    )

    // Then
    expect(next).toHaveBeenCalled()
    expect(req.session.pageFlowQueue).toBeUndefined()
    expect(req.session.pageFlowHistory).toBeUndefined()
    expect(req.session.inductionDto).toBeUndefined()
    expect(req.session.hopingToWorkOnReleaseForm).toBeUndefined()
    expect(req.session.inPrisonWorkForm).toBeUndefined()
    expect(req.session.skillsForm).toBeUndefined()
    expect(req.session.personalInterestsForm).toBeUndefined()
    expect(req.session.workedBeforeForm).toBeUndefined()
    expect(req.session.previousWorkExperienceTypesForm).toBeUndefined()
    expect(req.session.previousWorkExperienceDetailForm).toBeUndefined()
    expect(req.session.affectAbilityToWorkForm).toBeUndefined()
    expect(req.session.workInterestTypesForm).toBeUndefined()
    expect(req.session.inPrisonTrainingForm).toBeUndefined()
    expect(req.session.wantToAddQualificationsForm).toBeUndefined()
    expect(req.session.highestLevelOfEducationForm).toBeUndefined()
    expect(req.session.qualificationLevelForm).toBeUndefined()
    expect(req.session.qualificationDetailsForm).toBeUndefined()
    expect(req.session.additionalTrainingForm).toBeUndefined()
  })
})
