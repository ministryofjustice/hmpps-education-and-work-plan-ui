import { NextFunction, Request, Response } from 'express'
import { v4 as uuidV4 } from 'uuid'
import type { InductionDto } from 'inductionDto'
import HighestLevelOfEducationCreateController from './highestLevelOfEducationCreateController'
import aValidPrisonerSummary from '../../../testsupport/prisonerSummaryTestDataBuilder'
import { aValidInductionDto } from '../../../testsupport/inductionDtoTestDataBuilder'
import EducationLevelValue from '../../../enums/educationLevelValue'

describe('highestLevelOfEducationCreateController', () => {
  const controller = new HighestLevelOfEducationCreateController()

  const journeyId = uuidV4()
  const prisonNumber = 'A1234BC'
  const prisonerSummary = aValidPrisonerSummary()

  const req = {
    session: {},
    journeyData: {},
    body: {},
    params: { prisonNumber, journeyId },
    originalUrl: `/prisoners/${prisonNumber}/create-induction/${journeyId}/highest-level-of-education`,
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
    req.body = {}
    req.journeyData = {}
    req.query = {}
    res.locals.invalidForm = undefined
  })

  describe('getHighestLevelOfEducationView', () => {
    it('should get the Highest Level of Education view given there is no HighestLevelOfEducationForm on res.locals.invalidForm', async () => {
      // Given
      const inductionDto = aValidInductionDto()
      inductionDto.previousQualifications = undefined
      req.journeyData.inductionDto = inductionDto
      res.locals.invalidForm = undefined

      const expectedHighestLevelOfEducationForm = {
        educationLevel: undefined as EducationLevelValue,
      }

      const expectedView = {
        prisonerSummary,
        form: expectedHighestLevelOfEducationForm,
      }

      // When
      await controller.getHighestLevelOfEducationView(
        req as undefined as Request,
        res as undefined as Response,
        next as undefined as NextFunction,
      )

      // Then
      expect(res.render).toHaveBeenCalledWith('pages/prePrisonEducation/highestLevelOfEducation', expectedView)
      expect(req.journeyData.inductionDto).toEqual(inductionDto)
    })

    it('should get the Highest Level of Education view a Highest Level of Education form on res.locals.invalidForm', async () => {
      // Given
      const inductionDto = aValidInductionDto()
      inductionDto.previousQualifications = undefined
      req.journeyData.inductionDto = inductionDto

      const expectedHighestLevelOfEducationForm = {
        educationLevel: EducationLevelValue.FURTHER_EDUCATION_COLLEGE,
      }
      res.locals.invalidForm = expectedHighestLevelOfEducationForm

      const expectedView = {
        prisonerSummary,
        form: expectedHighestLevelOfEducationForm,
      }

      // When
      await controller.getHighestLevelOfEducationView(
        req as undefined as Request,
        res as undefined as Response,
        next as undefined as NextFunction,
      )

      // Then
      expect(res.render).toHaveBeenCalledWith('pages/prePrisonEducation/highestLevelOfEducation', expectedView)
      expect(req.journeyData.inductionDto).toEqual(inductionDto)
    })
  })

  describe('submitHighestLevelOfEducationForm', () => {
    it('should redirect to Do You Want To Record Any Qualifications page given the induction does not already have an qualifications and the previous page was not Check Your Answers', async () => {
      // Given
      req.query = {}

      const inductionDto = aValidInductionDto()
      inductionDto.previousQualifications = undefined
      req.journeyData.inductionDto = inductionDto

      const highestLevelOfEducationForm = {
        educationLevel: EducationLevelValue.FURTHER_EDUCATION_COLLEGE,
      }
      req.body = highestLevelOfEducationForm

      const expectedInduction = {
        ...inductionDto,
        previousQualifications: {
          qualifications: undefined,
          educationLevel: EducationLevelValue.FURTHER_EDUCATION_COLLEGE,
          needToCompleteJourneyFromCheckYourAnswers: false,
        },
      } as InductionDto

      // When
      await controller.submitHighestLevelOfEducationForm(
        req as undefined as Request,
        res as undefined as Response,
        next as undefined as NextFunction,
      )

      // Then
      expect(res.redirect).toHaveBeenCalledWith('want-to-add-qualifications')
      expect(req.journeyData.inductionDto).toEqual(expectedInduction)
    })

    it('should redirect to Do You Want To Record Any Qualifications page given the induction does not already have an qualifications and the previous page was not Check Your Answers', async () => {
      // Given
      req.query = {}

      const inductionDto = aValidInductionDto()
      req.journeyData.inductionDto = inductionDto

      const highestLevelOfEducationForm = {
        educationLevel: EducationLevelValue.FURTHER_EDUCATION_COLLEGE,
      }
      req.body = highestLevelOfEducationForm

      const expectedInduction = {
        ...inductionDto,
        previousQualifications: {
          ...inductionDto.previousQualifications,
          educationLevel: EducationLevelValue.FURTHER_EDUCATION_COLLEGE,
          needToCompleteJourneyFromCheckYourAnswers: false,
        },
      } as InductionDto

      // When
      await controller.submitHighestLevelOfEducationForm(
        req as undefined as Request,
        res as undefined as Response,
        next as undefined as NextFunction,
      )

      // Then
      expect(res.redirect).toHaveBeenCalledWith('qualifications')
      expect(req.journeyData.inductionDto).toEqual(expectedInduction)
    })

    it('should update inductionDto and redirect to Check Your Answers given previous page was Check Your Answers', async () => {
      // Given
      req.query = { submitToCheckAnswers: 'true' }

      const inductionDto = aValidInductionDto()
      inductionDto.previousQualifications = undefined
      req.journeyData.inductionDto = inductionDto

      const highestLevelOfEducationForm = {
        educationLevel: EducationLevelValue.FURTHER_EDUCATION_COLLEGE,
      }
      req.body = highestLevelOfEducationForm

      const expectedInduction = {
        ...inductionDto,
        previousQualifications: {
          qualifications: undefined,
          educationLevel: EducationLevelValue.FURTHER_EDUCATION_COLLEGE,
          needToCompleteJourneyFromCheckYourAnswers: false,
        },
      } as InductionDto

      // When
      await controller.submitHighestLevelOfEducationForm(
        req as undefined as Request,
        res as undefined as Response,
        next as undefined as NextFunction,
      )

      // Then
      expect(req.journeyData.inductionDto).toEqual(expectedInduction)
      expect(res.redirect).toHaveBeenCalledWith('check-your-answers')
    })
  })
})
