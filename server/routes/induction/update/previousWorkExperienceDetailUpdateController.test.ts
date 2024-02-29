import createError from 'http-errors'
import { NextFunction, Request, Response } from 'express'
import type { SessionData } from 'express-session'
import type { PreviousWorkExperienceDto } from 'inductionDto'
import { InductionService } from '../../../services'
import PreviousWorkExperienceDetailUpdateController from './previousWorkExperienceDetailUpdateController'
import aValidPrisonerSummary from '../../../testsupport/prisonerSummaryTestDataBuilder'
import { aLongQuestionSetInductionDto } from '../../../testsupport/inductionDtoTestDataBuilder'
import validatePreviousWorkExperienceDetailForm from './previousWorkExperienceDetailFormValidator'
import toCreateOrUpdateInductionDto from '../../../data/mappers/createOrUpdateInductionDtoMapper'
import { aLongQuestionSetUpdateInductionDto } from '../../../testsupport/updateInductionDtoTestDataBuilder'

jest.mock('./previousWorkExperienceDetailFormValidator')
jest.mock('../../../data/mappers/createOrUpdateInductionDtoMapper')

describe('previousWorkExperienceDetailUpdateController', () => {
  const mockedFormValidator = validatePreviousWorkExperienceDetailForm as jest.MockedFunction<
    typeof validatePreviousWorkExperienceDetailForm
  >
  const mockedCreateOrUpdateInductionDtoMapper = toCreateOrUpdateInductionDto as jest.MockedFunction<
    typeof toCreateOrUpdateInductionDto
  >

  const inductionService = {
    updateInduction: jest.fn(),
  }

  const controller = new PreviousWorkExperienceDetailUpdateController(inductionService as unknown as InductionService)

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

  describe('getPreviousWorkExperienceDetailView', () => {
    it('should get the Previous Work Experience Detail view given there is no PreviousWorkExperienceDetailForm on the session', async () => {
      // Given
      const prisonNumber = 'A1234BC'
      req.params.prisonNumber = prisonNumber
      req.params.typeOfWorkExperience = 'construction'

      const prisonerSummary = aValidPrisonerSummary()
      req.session.prisonerSummary = prisonerSummary
      const inductionDto = aLongQuestionSetInductionDto({ hasWorkedBefore: true })
      req.session.inductionDto = inductionDto
      req.session.previousWorkExperienceDetailForm = undefined

      const expectedPreviousWorkExperienceDetailForm = {
        jobRole: 'General labourer',
        jobDetails: 'Groundwork and basic block work and bricklaying',
      }

      const expectedView = {
        prisonerSummary,
        form: expectedPreviousWorkExperienceDetailForm,
        backLinkUrl: '/plan/A1234BC/view/work-and-interests',
        backLinkAriaText:
          'Back to <TODO - check what CIAG UI does here bearing in mind the previous page might be the create journey or the update journey for either a specific job type, or all the job types>',
        typeOfWorkExperience: 'CONSTRUCTION',
        errors,
      }

      // When
      await controller.getPreviousWorkExperienceDetailView(
        req as undefined as Request,
        res as undefined as Response,
        next as undefined as NextFunction,
      )

      // Then
      expect(res.render).toHaveBeenCalledWith(
        'pages/induction/previousWorkExperience/workExperienceDetail',
        expectedView,
      )
      expect(req.session.personalInterestsForm).toBeUndefined()
      expect(req.session.inductionDto).toEqual(inductionDto)
    })

    it('should get the Previous Work Experience Detail view given there is an PreviousWorkExperienceDetailForm already on the session', async () => {
      // Given
      const prisonNumber = 'A1234BC'
      req.params.prisonNumber = prisonNumber
      req.params.typeOfWorkExperience = 'construction'

      const prisonerSummary = aValidPrisonerSummary()
      req.session.prisonerSummary = prisonerSummary
      const inductionDto = aLongQuestionSetInductionDto({ hasWorkedBefore: true })
      req.session.inductionDto = inductionDto

      const expectedPreviousWorkExperienceDetailForm = {
        jobRole: 'General labourer',
        jobDetails: 'General labouring, building walls, basic plastering',
      }
      req.session.previousWorkExperienceDetailForm = expectedPreviousWorkExperienceDetailForm

      const expectedView = {
        prisonerSummary,
        form: expectedPreviousWorkExperienceDetailForm,
        backLinkUrl: '/plan/A1234BC/view/work-and-interests',
        backLinkAriaText:
          'Back to <TODO - check what CIAG UI does here bearing in mind the previous page might be the create journey or the update journey for either a specific job type, or all the job types>',
        typeOfWorkExperience: 'CONSTRUCTION',
        errors,
      }

      // When
      await controller.getPreviousWorkExperienceDetailView(
        req as undefined as Request,
        res as undefined as Response,
        next as undefined as NextFunction,
      )

      // Then
      expect(res.render).toHaveBeenCalledWith(
        'pages/induction/previousWorkExperience/workExperienceDetail',
        expectedView,
      )
      expect(req.session.personalInterestsForm).toBeUndefined()
      expect(req.session.inductionDto).toEqual(inductionDto)
    })

    it(`should not get the Previous Work Experience Detail view given the request path contains a valid work experience type that is not on the prisoner's induction`, async () => {
      // Given
      const prisonNumber = 'A1234BC'
      req.params.prisonNumber = prisonNumber
      req.params.typeOfWorkExperience = 'retail'

      const prisonerSummary = aValidPrisonerSummary()
      req.session.prisonerSummary = prisonerSummary
      const inductionDto = aLongQuestionSetInductionDto({ hasWorkedBefore: true })
      // The induction has work experience of construction and other, but not retail
      req.session.inductionDto = inductionDto
      req.session.previousWorkExperienceDetailForm = undefined

      const expectedError = createError(404, `Previous Work Experience type retail not found on Induction`)

      // When
      await controller.getPreviousWorkExperienceDetailView(
        req as undefined as Request,
        res as undefined as Response,
        next as undefined as NextFunction,
      )

      // Then
      expect(res.render).not.toHaveBeenCalled()
      expect(next).toHaveBeenCalledWith(expectedError)
    })

    it('should not get the Previous Work Experience Detail view given the request path contains an invalid work experience type', async () => {
      // Given
      const prisonNumber = 'A1234BC'
      req.params.prisonNumber = prisonNumber
      req.params.typeOfWorkExperience = 'some-non-valid-work-experience-type'

      const prisonerSummary = aValidPrisonerSummary()
      req.session.prisonerSummary = prisonerSummary

      const expectedError = createError(
        404,
        `Previous Work Experience type some-non-valid-work-experience-type not found on Induction`,
      )

      // When
      await controller.getPreviousWorkExperienceDetailView(
        req as undefined as Request,
        res as undefined as Response,
        next as undefined as NextFunction,
      )

      // Then
      expect(res.render).not.toHaveBeenCalled()
      expect(next).toHaveBeenCalledWith(expectedError)
    })
  })

  describe('submitPreviousWorkExperienceDetailForm', () => {
    it('should update Induction and call API and redirect to work and interests page', async () => {
      // Given
      req.user.token = 'some-token'
      const prisonNumber = 'A1234BC'
      req.params.prisonNumber = prisonNumber
      req.params.typeOfWorkExperience = 'construction'

      const prisonerSummary = aValidPrisonerSummary()
      req.session.prisonerSummary = prisonerSummary
      const inductionDto = aLongQuestionSetInductionDto({ hasWorkedBefore: true })
      req.session.inductionDto = inductionDto

      const previousWorkExperienceDetailForm = {
        jobRole: 'General labourer',
        jobDetails: 'General labouring, building walls, basic plastering',
      }
      req.body = previousWorkExperienceDetailForm
      req.session.previousWorkExperienceDetailForm = undefined

      const updateInductionDto = aLongQuestionSetUpdateInductionDto()

      mockedCreateOrUpdateInductionDtoMapper.mockReturnValueOnce(updateInductionDto)
      mockedFormValidator.mockReturnValue(errors)
      const expectedUpdatedPreviousWorkExperienceDetail: Array<PreviousWorkExperienceDto> = [
        {
          experienceType: 'CONSTRUCTION',
          experienceTypeOther: null,
          role: 'General labourer',
          details: 'General labouring, building walls, basic plastering',
        },
        {
          experienceType: 'OTHER',
          experienceTypeOther: 'Retail delivery',
          role: 'Milkman',
          details: 'Self employed franchise operator delivering milk and associated diary products.',
        },
      ]

      // When
      await controller.submitPreviousWorkExperienceDetailForm(
        req as undefined as Request,
        res as undefined as Response,
        next as undefined as NextFunction,
      )

      // Then
      // Extract the first call to the mock and the second argument (i.e. the updated Induction)
      const updatedInduction = mockedCreateOrUpdateInductionDtoMapper.mock.calls[0][1]
      expect(mockedCreateOrUpdateInductionDtoMapper).toHaveBeenCalledWith(prisonerSummary.prisonId, updatedInduction)
      expect(updatedInduction.previousWorkExperiences.experiences).toEqual(expectedUpdatedPreviousWorkExperienceDetail)

      expect(inductionService.updateInduction).toHaveBeenCalledWith(prisonNumber, updateInductionDto, 'some-token')
      expect(res.redirect).toHaveBeenCalledWith(`/plan/${prisonNumber}/view/work-and-interests`)
      expect(req.session.previousWorkExperienceDetailForm).toBeUndefined()
      expect(req.session.inductionDto).toBeUndefined()
    })

    it('should not update Induction given error calling service', async () => {
      // Given
      req.user.token = 'some-token'
      const prisonNumber = 'A1234BC'
      req.params.prisonNumber = prisonNumber
      req.params.typeOfWorkExperience = 'construction'

      const prisonerSummary = aValidPrisonerSummary()
      req.session.prisonerSummary = prisonerSummary
      const inductionDto = aLongQuestionSetInductionDto({ hasWorkedBefore: true })
      req.session.inductionDto = inductionDto

      const previousWorkExperienceDetailForm = {
        jobRole: 'General labourer',
        jobDetails: 'General labouring, building walls, basic plastering',
      }
      req.body = previousWorkExperienceDetailForm
      req.session.previousWorkExperienceDetailForm = undefined

      const updateInductionDto = aLongQuestionSetUpdateInductionDto()

      mockedCreateOrUpdateInductionDtoMapper.mockReturnValueOnce(updateInductionDto)
      mockedFormValidator.mockReturnValue(errors)
      const expectedUpdatedPreviousWorkExperienceDetail: Array<PreviousWorkExperienceDto> = [
        {
          experienceType: 'CONSTRUCTION',
          experienceTypeOther: null,
          role: 'General labourer',
          details: 'General labouring, building walls, basic plastering',
        },
        {
          experienceType: 'OTHER',
          experienceTypeOther: 'Retail delivery',
          role: 'Milkman',
          details: 'Self employed franchise operator delivering milk and associated diary products.',
        },
      ]

      inductionService.updateInduction.mockRejectedValue(createError(500, 'Service unavailable'))
      const expectedError = createError(
        500,
        `Error updating Induction for prisoner ${prisonNumber}. Error: InternalServerError: Service unavailable`,
      )

      // When
      await controller.submitPreviousWorkExperienceDetailForm(
        req as undefined as Request,
        res as undefined as Response,
        next as undefined as NextFunction,
      )

      // Then
      // Extract the first call to the mock and the second argument (i.e. the updated Induction)
      const updatedInduction = mockedCreateOrUpdateInductionDtoMapper.mock.calls[0][1]
      expect(mockedCreateOrUpdateInductionDtoMapper).toHaveBeenCalledWith(prisonerSummary.prisonId, updatedInduction)
      expect(updatedInduction.previousWorkExperiences.experiences).toEqual(expectedUpdatedPreviousWorkExperienceDetail)

      expect(inductionService.updateInduction).toHaveBeenCalledWith(prisonNumber, updateInductionDto, 'some-token')
      expect(next).toHaveBeenCalledWith(expectedError)
      expect(req.session.previousWorkExperienceDetailForm).toEqual(previousWorkExperienceDetailForm)
      expect(req.session.inductionDto).toEqual(inductionDto)
    })

    it('should not update Induction given form is submitted with validation errors', async () => {
      // Given
      const prisonNumber = 'A1234BC'
      req.params.prisonNumber = prisonNumber
      req.params.typeOfWorkExperience = 'construction'

      const prisonerSummary = aValidPrisonerSummary()
      req.session.prisonerSummary = prisonerSummary
      const inductionDto = aLongQuestionSetInductionDto({ hasWorkedBefore: true })
      req.session.inductionDto = inductionDto

      const invalidPreviousWorkExperienceDetailForm = {
        jobRole: 'General labourer',
        jobDetails: '',
      }
      req.body = invalidPreviousWorkExperienceDetailForm
      req.session.previousWorkExperienceDetailForm = undefined

      errors = [{ href: '#jobDetails', text: 'Enter details of what Jimmy Lightfingers did in their job' }]
      mockedFormValidator.mockReturnValue(errors)

      // When
      await controller.submitPreviousWorkExperienceDetailForm(
        req as undefined as Request,
        res as undefined as Response,
        next as undefined as NextFunction,
      )

      // Then
      expect(res.redirect).toHaveBeenCalledWith('/prisoners/A1234BC/induction/previous-work-experience/construction')
      expect(req.flash).toHaveBeenCalledWith('errors', errors)
      expect(req.session.previousWorkExperienceDetailForm).toEqual(invalidPreviousWorkExperienceDetailForm)
      expect(req.session.inductionDto).toEqual(inductionDto)
    })

    it('should not update Induction given form is submitted with the request path containing an invalid work experience type', async () => {
      // Given
      const prisonNumber = 'A1234BC'
      req.params.prisonNumber = prisonNumber
      req.params.typeOfWorkExperience = 'some-non-valid-work-experience-type'

      const prisonerSummary = aValidPrisonerSummary()
      req.session.prisonerSummary = prisonerSummary
      const inductionDto = aLongQuestionSetInductionDto({ hasWorkedBefore: true })
      req.session.inductionDto = inductionDto

      const expectedError = createError(
        404,
        `Previous Work Experience type some-non-valid-work-experience-type not found on Induction`,
      )

      // When
      await controller.submitPreviousWorkExperienceDetailForm(
        req as undefined as Request,
        res as undefined as Response,
        next as undefined as NextFunction,
      )

      // Then
      expect(res.redirect).not.toHaveBeenCalled()
      expect(next).toHaveBeenCalledWith(expectedError)
    })

    it(`should not update Induction given form is submitted with the request path contains a valid work experience type that is not on the prisoner's induction`, async () => {
      // Given
      const prisonNumber = 'A1234BC'
      req.params.prisonNumber = prisonNumber
      req.params.typeOfWorkExperience = 'retail'

      const prisonerSummary = aValidPrisonerSummary()
      req.session.prisonerSummary = prisonerSummary
      const inductionDto = aLongQuestionSetInductionDto({ hasWorkedBefore: true })
      // The induction has work experience of construction and other, but not retail
      req.session.inductionDto = inductionDto
      req.session.previousWorkExperienceDetailForm = undefined

      const expectedError = createError(404, `Previous Work Experience type retail not found on Induction`)

      const previousWorkExperienceDetailForm = {
        jobRole: 'Shop assistant',
        jobDetails: 'Serving customers and stacking shelves',
      }
      req.body = previousWorkExperienceDetailForm
      req.session.previousWorkExperienceDetailForm = undefined

      // When
      await controller.submitPreviousWorkExperienceDetailForm(
        req as undefined as Request,
        res as undefined as Response,
        next as undefined as NextFunction,
      )

      // Then
      expect(res.redirect).not.toHaveBeenCalled()
      expect(next).toHaveBeenCalledWith(expectedError)
    })
  })
})
