import { NextFunction, Request, Response } from 'express'
import type { PageFlow } from 'viewModels'
import type { HighestLevelOfEducationForm, QualificationDetailsForm, QualificationLevelForm } from 'forms'
import type {
  PreviousWorkExperienceDetailForm,
  PreviousWorkExperienceTypesForm,
  WantToAddQualificationsForm,
  WorkInterestTypesForm,
} from 'inductionForms'
import { SessionData } from 'express-session'
import removeFormDataFromSession from './removeFormDataFromSession'
import { aValidUpdateGoalForm } from '../../testsupport/updateGoalFormTestDataBuilder'
import { getPrisonerContext } from '../../data/session/prisonerContexts'

describe('removeFormDataFromSession', () => {
  const prisonNumber = 'A1234BC'

  const req = {
    session: {} as SessionData,
    params: { prisonNumber },
  }
  const res = {}
  const next = jest.fn()

  beforeEach(() => {
    jest.resetAllMocks()
    req.session = {} as SessionData
  })

  it('should remove form and DTOs from the prisoner context and session', async () => {
    // Given
    getPrisonerContext(req.session, prisonNumber).updateGoalForm = aValidUpdateGoalForm()

    req.session.pageFlowQueue = {} as PageFlow
    req.session.pageFlowHistory = {} as PageFlow
    req.session.previousWorkExperienceTypesForm = {} as PreviousWorkExperienceTypesForm
    req.session.previousWorkExperienceDetailForm = {} as PreviousWorkExperienceDetailForm
    req.session.workInterestTypesForm = {} as WorkInterestTypesForm
    req.session.wantToAddQualificationsForm = {} as WantToAddQualificationsForm
    req.session.highestLevelOfEducationForm = {} as HighestLevelOfEducationForm
    req.session.qualificationLevelForm = {} as QualificationLevelForm
    req.session.qualificationDetailsForm = {} as QualificationDetailsForm

    // When
    await removeFormDataFromSession(
      req as undefined as Request,
      res as undefined as Response,
      next as undefined as NextFunction,
    )

    // Then
    expect(next).toHaveBeenCalled()
    expect(getPrisonerContext(req.session, prisonNumber)).toEqual({})
    expect(req.session.pageFlowQueue).toBeUndefined()
    expect(req.session.pageFlowHistory).toBeUndefined()
    expect(req.session.previousWorkExperienceTypesForm).toBeUndefined()
    expect(req.session.previousWorkExperienceDetailForm).toBeUndefined()
    expect(req.session.workInterestTypesForm).toBeUndefined()
    expect(req.session.wantToAddQualificationsForm).toBeUndefined()
    expect(req.session.highestLevelOfEducationForm).toBeUndefined()
    expect(req.session.qualificationLevelForm).toBeUndefined()
    expect(req.session.qualificationDetailsForm).toBeUndefined()
  })
})
