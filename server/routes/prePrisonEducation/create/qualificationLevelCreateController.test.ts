import { Request, Response } from 'express'
import { v4 as uuidV4 } from 'uuid'
import aValidPrisonerSummary from '../../../testsupport/prisonerSummaryTestDataBuilder'
import { getPrisonerContext } from '../../../data/session/prisonerContexts'
import QualificationLevelValue from '../../../enums/qualificationLevelValue'
import QualificationLevelCreateController from './qualificationLevelCreateController'

describe('qualificationLevelCreateController', () => {
  const controller = new QualificationLevelCreateController()

  const journeyId = uuidV4()
  const prisonNumber = 'A1234BC'
  const prisonerSummary = aValidPrisonerSummary({ prisonNumber })

  const req = {
    session: {},
    params: { prisonNumber, journeyId },
  } as unknown as Request
  const res = {
    redirect: jest.fn(),
    redirectWithErrors: jest.fn(),
    render: jest.fn(),
    locals: { prisonerSummary },
  } as unknown as Response
  const next = jest.fn()

  beforeEach(() => {
    jest.resetAllMocks()
  })

  describe('getQualificationLevelView', () => {
    it('should get the Qualification Level view given there is no invalid form in res.locals', async () => {
      // Given
      res.locals.invalidForm = undefined

      const expectedQualificationLevelForm = {
        qualificationLevel: undefined as QualificationLevelValue,
      }

      const expectedView = {
        prisonerSummary,
        form: expectedQualificationLevelForm,
      }

      // When
      await controller.getQualificationLevelView(req, res, next)

      // Then
      expect(res.render).toHaveBeenCalledWith('pages/prePrisonEducation/qualificationLevel', expectedView)
    })

    it('should get the Qualification Level view given there is an invalid form in res.locals from a validation error', async () => {
      // Given
      const expectedQualificationLevelForm = {
        qualificationLevel: QualificationLevelValue.LEVEL_2,
      }
      res.locals.invalidForm = expectedQualificationLevelForm

      const expectedView = {
        prisonerSummary,
        form: expectedQualificationLevelForm,
      }

      // When
      await controller.getQualificationLevelView(req, res, next)

      // Then
      expect(res.render).toHaveBeenCalledWith('pages/prePrisonEducation/qualificationLevel', expectedView)
    })
  })

  describe('submitQualificationLevelForm', () => {
    it('should redirect to Qualification Details page given valid form is submitted', async () => {
      // Given
      const qualificationLevelForm = { qualificationLevel: QualificationLevelValue.LEVEL_6 }
      req.body = qualificationLevelForm

      // When
      await controller.submitQualificationLevelForm(req, res, next)

      // Then
      expect(res.redirect).toHaveBeenCalledWith(
        `/prisoners/A1234BC/create-education/${journeyId}/qualification-details`,
      )
      expect(getPrisonerContext(req.session, prisonNumber).qualificationLevelForm).toEqual(qualificationLevelForm)
    })
  })
})
