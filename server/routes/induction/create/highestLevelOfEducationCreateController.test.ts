import { NextFunction, Request, Response } from 'express'
import type { InductionDto } from 'inductionDto'
import HighestLevelOfEducationCreateController from './highestLevelOfEducationCreateController'
import aValidPrisonerSummary from '../../../testsupport/prisonerSummaryTestDataBuilder'
import { aValidInductionDto } from '../../../testsupport/inductionDtoTestDataBuilder'
import EducationLevelValue from '../../../enums/educationLevelValue'
import { getPrisonerContext } from '../../../data/session/prisonerContexts'

describe('highestLevelOfEducationCreateController', () => {
  const controller = new HighestLevelOfEducationCreateController()

  const prisonNumber = 'A1234BC'
  const prisonerSummary = aValidPrisonerSummary()

  const req = {
    session: {},
    body: {},
    params: { prisonNumber },
    path: `/prisoners/${prisonNumber}/create-induction/highest-level-of-education`,
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
    req.session.pageFlowHistory = undefined
    req.body = {}
  })

  describe('getHighestLevelOfEducationView', () => {
    it('should get the Highest Level of Education view given the induction on the session has no qualification related data set', async () => {
      // Given
      const inductionDto = aValidInductionDto()
      inductionDto.previousQualifications = undefined
      getPrisonerContext(req.session, prisonNumber).inductionDto = inductionDto
      getPrisonerContext(req.session, prisonNumber).highestLevelOfEducationForm = undefined

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
      expect(getPrisonerContext(req.session, prisonNumber).highestLevelOfEducationForm).toBeUndefined()
      expect(getPrisonerContext(req.session, prisonNumber).inductionDto).toEqual(inductionDto)
    })

    it('should get the Highest Level of Education view a Highest Level of Education form is on the session', async () => {
      // Given
      const inductionDto = aValidInductionDto()
      inductionDto.previousQualifications = undefined
      getPrisonerContext(req.session, prisonNumber).inductionDto = inductionDto

      const expectedHighestLevelOfEducationForm = {
        educationLevel: EducationLevelValue.FURTHER_EDUCATION_COLLEGE,
      }
      getPrisonerContext(req.session, prisonNumber).highestLevelOfEducationForm = expectedHighestLevelOfEducationForm

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
      expect(getPrisonerContext(req.session, prisonNumber).highestLevelOfEducationForm).toBeUndefined()
      expect(getPrisonerContext(req.session, prisonNumber).inductionDto).toEqual(inductionDto)
    })
  })

  describe('submitHighestLevelOfEducationForm', () => {
    it('should redisplay page given form is submitted with validation errors', async () => {
      // Given
      const inductionDto = aValidInductionDto()
      inductionDto.previousQualifications = undefined
      getPrisonerContext(req.session, prisonNumber).inductionDto = inductionDto

      const invalidHighestLevelOfEducationForm = {
        educationLevel: '',
      }
      req.body = invalidHighestLevelOfEducationForm
      getPrisonerContext(req.session, prisonNumber).highestLevelOfEducationForm = undefined

      const expectedErrors = [
        {
          href: '#educationLevel',
          text: `Select Jimmy Lightfingers's highest level of education`,
        },
      ]

      // When
      await controller.submitHighestLevelOfEducationForm(
        req as undefined as Request,
        res as undefined as Response,
        next as undefined as NextFunction,
      )

      // Then
      expect(res.redirectWithErrors).toHaveBeenCalledWith(
        '/prisoners/A1234BC/create-induction/highest-level-of-education',
        expectedErrors,
      )
      expect(getPrisonerContext(req.session, prisonNumber).highestLevelOfEducationForm).toEqual(
        invalidHighestLevelOfEducationForm,
      )
      expect(getPrisonerContext(req.session, prisonNumber).inductionDto).toEqual(inductionDto)
    })

    it('should redirect to Do You Want To Record Any Qualifications page given the induction does not already have an qualifications', async () => {
      // Given
      const inductionDto = aValidInductionDto()
      inductionDto.previousQualifications = undefined
      getPrisonerContext(req.session, prisonNumber).inductionDto = inductionDto

      const highestLevelOfEducationForm = {
        educationLevel: EducationLevelValue.FURTHER_EDUCATION_COLLEGE,
      }
      req.body = highestLevelOfEducationForm
      getPrisonerContext(req.session, prisonNumber).highestLevelOfEducationForm = undefined

      const expectedInduction = {
        ...inductionDto,
        previousQualifications: {
          qualifications: undefined,
          educationLevel: EducationLevelValue.FURTHER_EDUCATION_COLLEGE,
        },
      } as InductionDto

      // When
      await controller.submitHighestLevelOfEducationForm(
        req as undefined as Request,
        res as undefined as Response,
        next as undefined as NextFunction,
      )

      // Then
      expect(res.redirect).toHaveBeenCalledWith('/prisoners/A1234BC/create-induction/want-to-add-qualifications')
      expect(getPrisonerContext(req.session, prisonNumber).highestLevelOfEducationForm).toBeUndefined()
      expect(getPrisonerContext(req.session, prisonNumber).inductionDto).toEqual(expectedInduction)
    })

    it('should redirect to Do You Want To Record Any Qualifications page given the induction does not already have an qualifications', async () => {
      // Given
      const inductionDto = aValidInductionDto()
      getPrisonerContext(req.session, prisonNumber).inductionDto = inductionDto

      const highestLevelOfEducationForm = {
        educationLevel: EducationLevelValue.FURTHER_EDUCATION_COLLEGE,
      }
      req.body = highestLevelOfEducationForm
      getPrisonerContext(req.session, prisonNumber).highestLevelOfEducationForm = undefined

      const expectedInduction = {
        ...inductionDto,
        previousQualifications: {
          ...inductionDto.previousQualifications,
          educationLevel: EducationLevelValue.FURTHER_EDUCATION_COLLEGE,
        },
      } as InductionDto

      // When
      await controller.submitHighestLevelOfEducationForm(
        req as undefined as Request,
        res as undefined as Response,
        next as undefined as NextFunction,
      )

      // Then
      expect(res.redirect).toHaveBeenCalledWith('/prisoners/A1234BC/create-induction/qualifications')
      expect(getPrisonerContext(req.session, prisonNumber).highestLevelOfEducationForm).toBeUndefined()
      expect(getPrisonerContext(req.session, prisonNumber).inductionDto).toEqual(expectedInduction)
    })

    it('should update inductionDto and redirect to Check Your Answers given previous page was Check Your Answers', async () => {
      // Given
      const inductionDto = aValidInductionDto()
      inductionDto.previousQualifications = undefined
      getPrisonerContext(req.session, prisonNumber).inductionDto = inductionDto

      const highestLevelOfEducationForm = {
        educationLevel: EducationLevelValue.FURTHER_EDUCATION_COLLEGE,
      }
      req.body = highestLevelOfEducationForm
      getPrisonerContext(req.session, prisonNumber).highestLevelOfEducationForm = undefined

      const expectedInduction = {
        ...inductionDto,
        previousQualifications: {
          qualifications: undefined,
          educationLevel: EducationLevelValue.FURTHER_EDUCATION_COLLEGE,
        },
      } as InductionDto

      req.session.pageFlowHistory = {
        pageUrls: [
          '/prisoners/A1234BC/create-induction/check-your-answers',
          '/prisoners/A1234BC/create-induction/highest-level-of-education',
        ],
        currentPageIndex: 1,
      }

      // When
      await controller.submitHighestLevelOfEducationForm(
        req as undefined as Request,
        res as undefined as Response,
        next as undefined as NextFunction,
      )

      // Then
      expect(getPrisonerContext(req.session, prisonNumber).inductionDto).toEqual(expectedInduction)
      expect(res.redirect).toHaveBeenCalledWith('/prisoners/A1234BC/create-induction/check-your-answers')
      expect(getPrisonerContext(req.session, prisonNumber).highestLevelOfEducationForm).toBeUndefined()
    })
  })
})
