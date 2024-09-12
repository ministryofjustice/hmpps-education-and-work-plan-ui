import { NextFunction, Request, Response } from 'express'
import type { SessionData } from 'express-session'
import type { InductionDto } from 'inductionDto'
import HighestLevelOfEducationCreateController from './highestLevelOfEducationCreateController'
import aValidPrisonerSummary from '../../../testsupport/prisonerSummaryTestDataBuilder'
import { aValidInductionDto } from '../../../testsupport/inductionDtoTestDataBuilder'
import EducationLevelValue from '../../../enums/educationLevelValue'

describe('highestLevelOfEducationCreateController', () => {
  const controller = new HighestLevelOfEducationCreateController()

  const prisonNumber = 'A1234BC'
  const prisonerSummary = aValidPrisonerSummary()

  const req = {
    session: {} as SessionData,
    body: {},
    user: {} as Express.User,
    params: {} as Record<string, string>,
    path: '',
  }
  const res = {
    redirect: jest.fn(),
    redirectWithErrors: jest.fn(),
    render: jest.fn(),
  }
  const next = jest.fn()

  beforeEach(() => {
    jest.resetAllMocks()
    req.session = { prisonerSummary } as SessionData
    req.body = {}
    req.user = {} as Express.User
    req.params = { prisonNumber }
    req.path = `/prisoners/${prisonNumber}/create-induction/highest-level-of-education`
  })

  describe('getHighestLevelOfEducationView', () => {
    it('should get the Highest Level of Education view given the induction on the session has no qualification related data set', async () => {
      // Given
      const inductionDto = aValidInductionDto()
      inductionDto.previousQualifications = undefined
      req.session.inductionDto = inductionDto
      req.session.highestLevelOfEducationForm = undefined

      const expectedHighestLevelOfEducationForm = {
        educationLevel: undefined as EducationLevelValue,
      }

      const expectedView = {
        prisonerSummary,
        form: expectedHighestLevelOfEducationForm,
        backLinkUrl: '/prisoners/A1234BC/create-induction/affect-ability-to-work',
        backLinkAriaText:
          'Back to What does Jimmy Lightfingers feel could stop or affect them working when they are out of prison?',
      }

      // When
      await controller.getHighestLevelOfEducationView(
        req as undefined as Request,
        res as undefined as Response,
        next as undefined as NextFunction,
      )

      // Then
      expect(res.render).toHaveBeenCalledWith('pages/prePrisonEducation/highestLevelOfEducation', expectedView)
      expect(req.session.highestLevelOfEducationForm).toBeUndefined()
      expect(req.session.inductionDto).toEqual(inductionDto)
    })

    it('should get the Highest Level of Education view a Highest Level of Education form is on the session', async () => {
      // Given
      const inductionDto = aValidInductionDto()
      inductionDto.previousQualifications = undefined
      req.session.inductionDto = inductionDto

      const expectedHighestLevelOfEducationForm = {
        educationLevel: EducationLevelValue.FURTHER_EDUCATION_COLLEGE,
      }
      req.session.highestLevelOfEducationForm = expectedHighestLevelOfEducationForm

      const expectedView = {
        prisonerSummary,
        form: expectedHighestLevelOfEducationForm,
        backLinkUrl: '/prisoners/A1234BC/create-induction/affect-ability-to-work',
        backLinkAriaText:
          'Back to What does Jimmy Lightfingers feel could stop or affect them working when they are out of prison?',
      }

      // When
      await controller.getHighestLevelOfEducationView(
        req as undefined as Request,
        res as undefined as Response,
        next as undefined as NextFunction,
      )

      // Then
      expect(res.render).toHaveBeenCalledWith('pages/prePrisonEducation/highestLevelOfEducation', expectedView)
      expect(req.session.highestLevelOfEducationForm).toBeUndefined()
      expect(req.session.inductionDto).toEqual(inductionDto)
    })

    it('should get the Highest Level of Education view given the previous page was Check Your Answers', async () => {
      // Given
      const inductionDto = aValidInductionDto()
      inductionDto.personalSkillsAndInterests.skills = undefined
      req.session.inductionDto = inductionDto

      req.session.pageFlowHistory = {
        pageUrls: ['/prisoners/A1234BC/create-induction/check-your-answers'],
        currentPageIndex: 0,
      }

      const expectedPageFlowHistory = {
        pageUrls: [
          '/prisoners/A1234BC/create-induction/check-your-answers',
          '/prisoners/A1234BC/create-induction/highest-level-of-education',
        ],
        currentPageIndex: 1,
      }

      const expectedHighestLevelOfEducationForm = {
        educationLevel: EducationLevelValue.SECONDARY_SCHOOL_TOOK_EXAMS,
      }

      const expectedView = {
        prisonerSummary,
        form: expectedHighestLevelOfEducationForm,
        backLinkUrl: '/prisoners/A1234BC/create-induction/check-your-answers',
        backLinkAriaText: `Back to Check and save your answers before adding Jimmy Lightfingers's goals`,
      }

      // When
      await controller.getHighestLevelOfEducationView(
        req as undefined as Request,
        res as undefined as Response,
        next as undefined as NextFunction,
      )

      // Then
      expect(res.render).toHaveBeenCalledWith('pages/prePrisonEducation/highestLevelOfEducation', expectedView)
      expect(req.session.highestLevelOfEducationForm).toBeUndefined()
      expect(req.session.inductionDto).toEqual(inductionDto)
      expect(req.session.pageFlowHistory).toEqual(expectedPageFlowHistory)
    })
  })

  describe('submitHighestLevelOfEducationForm', () => {
    it('should redisplay page given form is submitted with validation errors', async () => {
      // Given
      const inductionDto = aValidInductionDto()
      inductionDto.previousQualifications = undefined
      req.session.inductionDto = inductionDto

      const invalidHighestLevelOfEducationForm = {
        educationLevel: '',
      }
      req.body = invalidHighestLevelOfEducationForm
      req.session.highestLevelOfEducationForm = undefined

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
      expect(req.session.highestLevelOfEducationForm).toEqual(invalidHighestLevelOfEducationForm)
      expect(req.session.inductionDto).toEqual(inductionDto)
    })

    it('should redirect to Do You Want To Record Any Qualifications page given the induction does not already have an qualifications', async () => {
      // Given
      const inductionDto = aValidInductionDto()
      inductionDto.previousQualifications = undefined
      req.session.inductionDto = inductionDto

      const highestLevelOfEducationForm = {
        educationLevel: EducationLevelValue.FURTHER_EDUCATION_COLLEGE,
      }
      req.body = highestLevelOfEducationForm
      req.session.highestLevelOfEducationForm = undefined

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
      expect(req.session.highestLevelOfEducationForm).toBeUndefined()
      expect(req.session.inductionDto).toEqual(expectedInduction)
    })

    it('should redirect to Do You Want To Record Any Qualifications page given the induction does not already have an qualifications', async () => {
      // Given
      const inductionDto = aValidInductionDto()
      req.session.inductionDto = inductionDto

      const highestLevelOfEducationForm = {
        educationLevel: EducationLevelValue.FURTHER_EDUCATION_COLLEGE,
      }
      req.body = highestLevelOfEducationForm
      req.session.highestLevelOfEducationForm = undefined

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
      expect(req.session.highestLevelOfEducationForm).toBeUndefined()
      expect(req.session.inductionDto).toEqual(expectedInduction)
    })

    it('should update inductionDto and redirect to Check Your Answers given previous page was Check Your Answers', async () => {
      // Given
      const inductionDto = aValidInductionDto()
      inductionDto.previousQualifications = undefined
      req.session.inductionDto = inductionDto

      const highestLevelOfEducationForm = {
        educationLevel: EducationLevelValue.FURTHER_EDUCATION_COLLEGE,
      }
      req.body = highestLevelOfEducationForm
      req.session.highestLevelOfEducationForm = undefined

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
      expect(req.session.inductionDto).toEqual(expectedInduction)
      expect(res.redirect).toHaveBeenCalledWith('/prisoners/A1234BC/create-induction/check-your-answers')
      expect(req.session.highestLevelOfEducationForm).toBeUndefined()
    })
  })
})
