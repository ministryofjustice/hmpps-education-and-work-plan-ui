import { Request, Response } from 'express'
import aValidPrisonerSummary from '../../../testsupport/prisonerSummaryTestDataBuilder'
import { getPrisonerContext } from '../../../data/session/prisonerContexts'
import QualificationLevelValue from '../../../enums/qualificationLevelValue'
import QualificationLevelUpdateController from './qualificationLevelUpdateController'

describe('qualificationLevelUpdateController', () => {
  const controller = new QualificationLevelUpdateController()

  let req: Request
  const res = {
    redirect: jest.fn(),
    redirectWithErrors: jest.fn(),
    render: jest.fn(),
  } as unknown as Response
  const next = jest.fn()

  const prisonNumber = 'A1234BC'
  const prisonerSummary = aValidPrisonerSummary(prisonNumber)

  beforeEach(() => {
    jest.resetAllMocks()

    req = {
      session: { prisonerSummary },
      body: {},
      user: {},
      params: { prisonNumber },
      query: {},
    } as unknown as Request
  })

  describe('getQualificationLevelView', () => {
    it('should get the Qualification Level view given there is no Qualification Level form on the prisoner context', async () => {
      // Given
      getPrisonerContext(req.session, prisonNumber).qualificationLevelForm = undefined

      const expectedQualificationLevelForm = {
        qualificationLevel: undefined as QualificationLevelValue,
      }

      const expectedView = {
        prisonerSummary,
        form: expectedQualificationLevelForm,
        backLinkUrl: '/prisoners/A1234BC/education/qualifications',
        backLinkAriaText: `Back to Jimmy Lightfingers's qualifications`,
      }

      // When
      await controller.getQualificationLevelView(req, res, next)

      // Then
      expect(res.render).toHaveBeenCalledWith('pages/prePrisonEducation/qualificationLevel', expectedView)
      expect(getPrisonerContext(req.session, prisonNumber).qualificationLevelForm).toBeUndefined()
    })

    it('should get the Qualification Level view given a Qualification Level form is on the prisoner context', async () => {
      // Given
      const expectedQualificationLevelForm = {
        qualificationLevel: QualificationLevelValue.LEVEL_2,
      }
      getPrisonerContext(req.session, prisonNumber).qualificationLevelForm = expectedQualificationLevelForm

      const expectedView = {
        prisonerSummary,
        form: expectedQualificationLevelForm,
        backLinkUrl: '/prisoners/A1234BC/education/qualifications',
        backLinkAriaText: `Back to Jimmy Lightfingers's qualifications`,
      }

      // When
      await controller.getQualificationLevelView(req, res, next)

      // Then
      expect(res.render).toHaveBeenCalledWith('pages/prePrisonEducation/qualificationLevel', expectedView)
      expect(getPrisonerContext(req.session, prisonNumber).qualificationLevelForm).toBeUndefined()
    })
  })

  describe('submitQualificationLevelForm', () => {
    it('should redisplay Qualification Level page given form is submitted with validation errors', async () => {
      // Given
      const invalidQualificationLevelForm = {}
      req.body = invalidQualificationLevelForm

      const expectedErrors = [
        { href: '#qualificationLevel', text: 'Select the level of qualification Jimmy Lightfingers wants to add' },
      ]

      // When
      await controller.submitQualificationLevelForm(req, res, next)

      // Then
      expect(res.redirectWithErrors).toHaveBeenCalledWith(
        '/prisoners/A1234BC/education/qualification-level',
        expectedErrors,
      )
      expect(getPrisonerContext(req.session, prisonNumber).qualificationLevelForm).toEqual(
        invalidQualificationLevelForm,
      )
    })

    it('should redirect to Qualification Details page given valid form is submitted', async () => {
      // Given
      const qualificationLevelForm = { qualificationLevel: QualificationLevelValue.LEVEL_6 }
      req.body = qualificationLevelForm

      // When
      await controller.submitQualificationLevelForm(req, res, next)

      // Then
      expect(res.redirect).toHaveBeenCalledWith('/prisoners/A1234BC/education/qualification-details')
      expect(getPrisonerContext(req.session, prisonNumber).qualificationLevelForm).toEqual(qualificationLevelForm)
    })
  })
})
