import { NextFunction, Request, Response } from 'express'
import type { SessionData } from 'express-session'
import validatePreviousWorkExperienceForm from './previousWorkExperienceFormValidator'
import PreviousWorkExperienceUpdateController from './previousWorkExperienceUpdateController'
import { InductionService } from '../../../services'
import aValidPrisonerSummary from '../../../testsupport/prisonerSummaryTestDataBuilder'
import { aLongQuestionSetInductionDto } from '../../../testsupport/inductionDtoTestDataBuilder'

jest.mock('./previousWorkExperienceFormValidator')

describe('previousWorkExperienceUpdateController', () => {
  const mockedFormValidator = validatePreviousWorkExperienceForm as jest.MockedFunction<
    typeof validatePreviousWorkExperienceForm
  >

  const inductionService = {
    updateInduction: jest.fn(),
  }

  const controller = new PreviousWorkExperienceUpdateController(inductionService as unknown as InductionService)

  const req = {
    session: {} as SessionData,
    body: {},
    user: {} as Express.User,
    params: {} as Record<string, string>,
    flash: jest.fn(),
  }
  const res = {
    redirect: jest.fn(),
    render: jest.fn(),
  }
  const next = jest.fn()

  let errors: Array<Record<string, string>>

  beforeEach(() => {
    jest.resetAllMocks()
    req.session = {} as SessionData
    req.body = {}
    req.user = {} as Express.User
    req.params = {} as Record<string, string>

    errors = []
  })

  describe('getPreviousWorkExperienceView', () => {
    it('should get the Previous Work Experience view given there is no PreviousWorkExperienceForm on the session', async () => {
      // Given
      const prisonNumber = 'A1234BC'
      req.params.prisonNumber = prisonNumber

      const prisonerSummary = aValidPrisonerSummary()
      req.session.prisonerSummary = prisonerSummary
      const inductionDto = aLongQuestionSetInductionDto()
      req.session.inductionDto = inductionDto
      req.session.previousWorkExperienceForm = undefined

      const expectedPreviousWorkExperienceForm = {
        typeOfWorkExperience: ['CONSTRUCTION', 'OTHER'],
        typeOfWorkExperienceOther: 'Retail delivery',
      }

      const expectedView = {
        prisonerSummary,
        form: expectedPreviousWorkExperienceForm,
        backLinkUrl: '/plan/A1234BC/view/work-and-interests',
        backLinkAriaText: 'Back to <TODO - check what CIAG UI does here>',
        errors,
      }

      // When
      await controller.getPreviousWorkExperienceView(
        req as undefined as Request,
        res as undefined as Response,
        next as undefined as NextFunction,
      )

      // Then
      expect(res.render).toHaveBeenCalledWith('pages/induction/previousWorkExperience/index', expectedView)
      expect(req.session.previousWorkExperienceForm).toBeUndefined()
      expect(req.session.inductionDto).toEqual(inductionDto)
    })

    it('should get the Previous Work Experience view given there is a PreviousWorkExperienceForm already on the session', async () => {
      // Given
      const prisonNumber = 'A1234BC'
      req.params.prisonNumber = prisonNumber

      const prisonerSummary = aValidPrisonerSummary()
      req.session.prisonerSummary = prisonerSummary
      const inductionDto = aLongQuestionSetInductionDto()
      req.session.inductionDto = inductionDto

      const expectedPreviousWorkExperienceForm = {
        typeOfWorkExperience: ['MANUFACTURING', 'RETAIL', 'WAREHOUSING'],
        typeOfWorkExperienceOther: '',
      }
      req.session.previousWorkExperienceForm = expectedPreviousWorkExperienceForm

      const expectedView = {
        prisonerSummary,
        form: expectedPreviousWorkExperienceForm,
        backLinkUrl: '/plan/A1234BC/view/work-and-interests',
        backLinkAriaText: 'Back to <TODO - check what CIAG UI does here>',
        errors,
      }

      // When
      await controller.getPreviousWorkExperienceView(
        req as undefined as Request,
        res as undefined as Response,
        next as undefined as NextFunction,
      )

      // Then
      expect(res.render).toHaveBeenCalledWith('pages/induction/previousWorkExperience/index', expectedView)
      expect(req.session.skillsForm).toBeUndefined()
      expect(req.session.inductionDto).toEqual(inductionDto)
    })
  })

  describe('submitPreviousWorkExperienceForm', () => {
    it('should not update Induction given form is submitted with validation errors', async () => {
      // Given
      const prisonNumber = 'A1234BC'
      req.params.prisonNumber = prisonNumber

      const prisonerSummary = aValidPrisonerSummary()
      req.session.prisonerSummary = prisonerSummary
      const inductionDto = aLongQuestionSetInductionDto()
      req.session.inductionDto = inductionDto

      const invalidPreviousWorkExperienceForm = {
        typeOfWorkExperience: ['OTHER'],
        typeOfWorkExperienceOther: '',
      }
      req.body = invalidPreviousWorkExperienceForm
      req.session.previousWorkExperienceForm = undefined

      errors = [
        { href: '#typeOfWorkExperienceOther', text: 'Enter the type of work  Jimmy Lightfingers has done before' },
      ]
      mockedFormValidator.mockReturnValue(errors)

      // When
      await controller.submitPreviousWorkExperienceForm(
        req as undefined as Request,
        res as undefined as Response,
        next as undefined as NextFunction,
      )

      // Then
      expect(res.redirect).toHaveBeenCalledWith('/prisoners/A1234BC/induction/previous-work-experience')
      expect(req.flash).toHaveBeenCalledWith('errors', errors)
      expect(req.session.previousWorkExperienceForm).toEqual(invalidPreviousWorkExperienceForm)
      expect(req.session.inductionDto).toEqual(inductionDto)
    })
  })
})
