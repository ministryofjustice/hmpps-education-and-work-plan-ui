import { NextFunction, Request, Response } from 'express'
import type { SessionData } from 'express-session'
import type { PreviousWorkExperienceDto } from 'inductionDto'
import { InductionService } from '../../../services'
import PreviousWorkExperienceTypesUpdateController from './previousWorkExperienceTypesUpdateController'
import validatePreviousWorkExperienceTypesForm from './previousWorkExperienceTypesFormValidator'
import toCreateOrUpdateInductionDto from '../../../data/mappers/createOrUpdateInductionDtoMapper'
import aValidPrisonerSummary from '../../../testsupport/prisonerSummaryTestDataBuilder'
import { aLongQuestionSetInductionDto } from '../../../testsupport/inductionDtoTestDataBuilder'
import { aLongQuestionSetUpdateInductionDto } from '../../../testsupport/updateInductionDtoTestDataBuilder'

jest.mock('./previousWorkExperienceTypesFormValidator')
jest.mock('../../../data/mappers/createOrUpdateInductionDtoMapper')

describe('previousWorkExperienceTypesUpdateController', () => {
  const mockedFormValidator = validatePreviousWorkExperienceTypesForm as jest.MockedFunction<
    typeof validatePreviousWorkExperienceTypesForm
  >
  const mockedCreateOrUpdateInductionDtoMapper = toCreateOrUpdateInductionDto as jest.MockedFunction<
    typeof toCreateOrUpdateInductionDto
  >

  const inductionService = {
    updateInduction: jest.fn(),
  }

  const controller = new PreviousWorkExperienceTypesUpdateController(inductionService as unknown as InductionService)

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

  describe('getPreviousWorkExperienceTypesView', () => {
    it('should get the Previous Work Experience Types view given there is no PreviousWorkExperienceTypesForm on the session', async () => {
      // Given
      const prisonNumber = 'A1234BC'
      req.params.prisonNumber = prisonNumber

      const prisonerSummary = aValidPrisonerSummary()
      req.session.prisonerSummary = prisonerSummary
      const inductionDto = aLongQuestionSetInductionDto({ hasWorkedBefore: true })
      req.session.inductionDto = inductionDto
      req.session.previousWorkExperienceTypesForm = undefined

      const expectedPreviousWorkExperienceTypesForm = {
        typeOfWorkExperience: ['CONSTRUCTION', 'OTHER'],
        typeOfWorkExperienceOther: 'Retail delivery',
      }

      const expectedView = {
        prisonerSummary,
        form: expectedPreviousWorkExperienceTypesForm,
        backLinkUrl: '/plan/A1234BC/view/work-and-interests',
        backLinkAriaText: 'Back to <TODO - check what CIAG UI does here>',
        errors,
      }

      // When
      await controller.getPreviousWorkExperienceTypesView(
        req as undefined as Request,
        res as undefined as Response,
        next as undefined as NextFunction,
      )

      // Then
      expect(res.render).toHaveBeenCalledWith(
        'pages/induction/previousWorkExperience/workExperienceTypes',
        expectedView,
      )
      expect(req.session.previousWorkExperienceTypesForm).toBeUndefined()
      expect(req.session.inductionDto).toEqual(inductionDto)
    })

    it('should get the Previous Work Experience Types view given there is an PreviousWorkExperienceTypesForm already on the session', async () => {
      // Given
      const prisonNumber = 'A1234BC'
      req.params.prisonNumber = prisonNumber

      const prisonerSummary = aValidPrisonerSummary()
      req.session.prisonerSummary = prisonerSummary
      const inductionDto = aLongQuestionSetInductionDto({ hasWorkedBefore: true })
      req.session.inductionDto = inductionDto

      const expectedPreviousWorkExperienceTypesForm = {
        typeOfWorkExperience: ['OUTDOOR', 'DRIVING', 'OTHER'],
        typeOfWorkExperienceOther: 'Entertainment industry',
      }
      req.session.previousWorkExperienceTypesForm = expectedPreviousWorkExperienceTypesForm

      const expectedView = {
        prisonerSummary,
        form: expectedPreviousWorkExperienceTypesForm,
        backLinkUrl: '/plan/A1234BC/view/work-and-interests',
        backLinkAriaText: 'Back to <TODO - check what CIAG UI does here>',
        errors,
      }

      // When
      await controller.getPreviousWorkExperienceTypesView(
        req as undefined as Request,
        res as undefined as Response,
        next as undefined as NextFunction,
      )

      // Then
      expect(res.render).toHaveBeenCalledWith(
        'pages/induction/previousWorkExperience/workExperienceTypes',
        expectedView,
      )
      expect(req.session.previousWorkExperienceDetailForm).toBeUndefined()
      expect(req.session.inductionDto).toEqual(inductionDto)
    })
  })

  describe('submitPreviousWorkExperienceTypesForm', () => {
    it('should not update Induction given form is submitted with validation errors', async () => {
      // Given
      const prisonNumber = 'A1234BC'
      req.params.prisonNumber = prisonNumber

      const prisonerSummary = aValidPrisonerSummary()
      req.session.prisonerSummary = prisonerSummary
      const inductionDto = aLongQuestionSetInductionDto({ hasWorkedBefore: true })
      req.session.inductionDto = inductionDto

      const invalidPreviousWorkExperienceTypesForm = {
        typeOfWorkExperience: ['OTHER'],
        typeOfWorkExperienceOther: '',
      }
      req.body = invalidPreviousWorkExperienceTypesForm
      req.session.previousWorkExperienceTypesForm = undefined

      errors = [
        { href: '#typeOfWorkExperienceOther', text: 'Enter the type of work Jimmy Lightfingers has done before' },
      ]
      mockedFormValidator.mockReturnValue(errors)

      // When
      await controller.submitPreviousWorkExperienceTypesForm(
        req as undefined as Request,
        res as undefined as Response,
        next as undefined as NextFunction,
      )

      // Then
      expect(res.redirect).toHaveBeenCalledWith('/prisoners/A1234BC/induction/previous-work-experience')
      expect(req.flash).toHaveBeenCalledWith('errors', errors)
      expect(req.session.previousWorkExperienceTypesForm).toEqual(invalidPreviousWorkExperienceTypesForm)
      expect(req.session.inductionDto).toEqual(inductionDto)
    })

    it('should not update Induction given form is submitted with no changes to the original Induction', async () => {
      // Given
      const prisonNumber = 'A1234BC'
      req.params.prisonNumber = prisonNumber

      const prisonerSummary = aValidPrisonerSummary()
      req.session.prisonerSummary = prisonerSummary
      const inductionDto = aLongQuestionSetInductionDto({ hasWorkedBefore: true })
      // The induction has work experience of CONSTRUCTION and OTHER (Retail delivery)
      req.session.inductionDto = inductionDto

      const previousWorkExperienceTypesForm = {
        typeOfWorkExperience: ['CONSTRUCTION', 'OTHER'],
        typeOfWorkExperienceOther: 'Retail delivery',
      }
      req.body = previousWorkExperienceTypesForm
      req.session.previousWorkExperienceTypesForm = undefined

      mockedFormValidator.mockReturnValue(errors)

      // When
      await controller.submitPreviousWorkExperienceTypesForm(
        req as undefined as Request,
        res as undefined as Response,
        next as undefined as NextFunction,
      )

      // Then
      expect(res.redirect).toHaveBeenCalledWith('/plan/A1234BC/view/work-and-interests')
      expect(mockedCreateOrUpdateInductionDtoMapper).not.toHaveBeenCalled()
      expect(inductionService.updateInduction).not.toHaveBeenCalled()
      expect(req.session.previousWorkExperienceTypesForm).toBeUndefined()
      expect(req.session.inductionDto).toBeUndefined()
    })

    it('should update Induction given form is submitted where the only change is a removal of a work type other than OTHER', async () => {
      // Given
      req.user.token = 'some-token'
      const prisonNumber = 'A1234BC'
      req.params.prisonNumber = prisonNumber

      const prisonerSummary = aValidPrisonerSummary()
      req.session.prisonerSummary = prisonerSummary
      const inductionDto = aLongQuestionSetInductionDto({ hasWorkedBefore: true })
      // The induction has work experience of CONSTRUCTION and OTHER (Retail delivery)
      req.session.inductionDto = inductionDto

      const previousWorkExperienceTypesForm = {
        typeOfWorkExperience: ['OTHER'],
        typeOfWorkExperienceOther: 'Retail delivery',
      }
      req.body = previousWorkExperienceTypesForm
      req.session.previousWorkExperienceTypesForm = undefined

      const updateInductionDto = aLongQuestionSetUpdateInductionDto({ hasWorkedBefore: true })
      mockedCreateOrUpdateInductionDtoMapper.mockReturnValueOnce(updateInductionDto)

      mockedFormValidator.mockReturnValue(errors)
      const expectedPreviousWorkExperiences: Array<PreviousWorkExperienceDto> = [
        {
          details: 'Self employed franchise operator delivering milk and associated diary products.',
          experienceType: 'OTHER',
          experienceTypeOther: 'Retail delivery',
          role: 'Milkman',
        },
      ]

      // When
      await controller.submitPreviousWorkExperienceTypesForm(
        req as undefined as Request,
        res as undefined as Response,
        next as undefined as NextFunction,
      )

      // Then
      // Extract the first call to the mock and the second argument (i.e. the updated Induction)
      const updatedInduction = mockedCreateOrUpdateInductionDtoMapper.mock.calls[0][1]
      expect(mockedCreateOrUpdateInductionDtoMapper).toHaveBeenCalledWith(prisonerSummary.prisonId, updatedInduction)
      expect(updatedInduction.previousWorkExperiences.experiences).toEqual(expectedPreviousWorkExperiences)

      expect(inductionService.updateInduction).toHaveBeenCalledWith(prisonNumber, updateInductionDto, 'some-token')
      expect(res.redirect).toHaveBeenCalledWith(`/plan/${prisonNumber}/view/work-and-interests`)
      expect(req.session.skillsForm).toBeUndefined()
      expect(req.session.inductionDto).toBeUndefined()
    })

    it('should update Induction given form is submitted where the only change is a removal of the work type OTHER', async () => {
      // Given
      req.user.token = 'some-token'
      const prisonNumber = 'A1234BC'
      req.params.prisonNumber = prisonNumber

      const prisonerSummary = aValidPrisonerSummary()
      req.session.prisonerSummary = prisonerSummary
      const inductionDto = aLongQuestionSetInductionDto({ hasWorkedBefore: true })
      // The induction has work experience of CONSTRUCTION and OTHER (Retail delivery)
      req.session.inductionDto = inductionDto

      const previousWorkExperienceTypesForm = {
        typeOfWorkExperience: ['CONSTRUCTION'],
        typeOfWorkExperienceOther: '',
      }
      req.body = previousWorkExperienceTypesForm
      req.session.previousWorkExperienceTypesForm = undefined

      const updateInductionDto = aLongQuestionSetUpdateInductionDto({ hasWorkedBefore: true })
      mockedCreateOrUpdateInductionDtoMapper.mockReturnValueOnce(updateInductionDto)

      mockedFormValidator.mockReturnValue(errors)
      const expectedPreviousWorkExperiences: Array<PreviousWorkExperienceDto> = [
        {
          details: 'Groundwork and basic block work and bricklaying',
          experienceType: 'CONSTRUCTION',
          experienceTypeOther: null,
          role: 'General labourer',
        },
      ]

      // When
      await controller.submitPreviousWorkExperienceTypesForm(
        req as undefined as Request,
        res as undefined as Response,
        next as undefined as NextFunction,
      )

      // Then
      // Extract the first call to the mock and the second argument (i.e. the updated Induction)
      const updatedInduction = mockedCreateOrUpdateInductionDtoMapper.mock.calls[0][1]
      expect(mockedCreateOrUpdateInductionDtoMapper).toHaveBeenCalledWith(prisonerSummary.prisonId, updatedInduction)
      expect(updatedInduction.previousWorkExperiences.experiences).toEqual(expectedPreviousWorkExperiences)

      expect(inductionService.updateInduction).toHaveBeenCalledWith(prisonNumber, updateInductionDto, 'some-token')
      expect(res.redirect).toHaveBeenCalledWith(`/plan/${prisonNumber}/view/work-and-interests`)
      expect(req.session.skillsForm).toBeUndefined()
      expect(req.session.inductionDto).toBeUndefined()
    })
  })
})
