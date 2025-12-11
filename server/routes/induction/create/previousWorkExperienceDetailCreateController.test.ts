import { Request, Response } from 'express'
import { v4 as uuidV4 } from 'uuid'
import { SessionData } from 'express-session'
import createError from 'http-errors'
import type { InductionDto } from 'inductionDto'
import aValidPrisonerSummary from '../../../testsupport/prisonerSummaryTestDataBuilder'
import { aValidInductionDto } from '../../../testsupport/inductionDtoTestDataBuilder'
import PreviousWorkExperienceDetailCreateController from './previousWorkExperienceDetailCreateController'
import TypeOfWorkExperienceValue from '../../../enums/typeOfWorkExperienceValue'
import HasWorkedBeforeValue from '../../../enums/hasWorkedBeforeValue'

describe('previousWorkExperienceDetailCreateController', () => {
  const controller = new PreviousWorkExperienceDetailCreateController()

  const journeyId = uuidV4()
  const prisonNumber = 'A1234BC'
  const prisonerSummary = aValidPrisonerSummary()

  const req = {
    session: {} as SessionData,
    journeyData: {} as Express.JourneyData,
    body: {},
    params: { prisonNumber, journeyId } as Record<string, string>,
    originalUrl: '',
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

  describe('getPreviousWorkExperienceDetailView', () => {
    it('should get the Previous Work Experience Detail view given there is no PreviousWorkExperienceDetailForm on res.locals.invalidForm', async () => {
      // Given
      req.params.typeOfWorkExperience = 'construction'
      req.originalUrl = `/prisoners/${prisonNumber}/create-induction/${journeyId}/previous-work-experience/construction`

      const inductionDto = inductionDtoWithWorkExperienceTypes()
      req.journeyData.inductionDto = inductionDto
      res.locals.invalidForm = undefined

      const expectedPreviousWorkExperienceDetailForm = {
        jobRole: '',
        jobDetails: '',
      }

      const expectedView = {
        prisonerSummary,
        form: expectedPreviousWorkExperienceDetailForm,
        typeOfWorkExperience: 'CONSTRUCTION',
      }

      // When
      await controller.getPreviousWorkExperienceDetailView(req, res, next)

      // Then
      expect(res.render).toHaveBeenCalledWith(
        'pages/induction/previousWorkExperience/workExperienceDetail',
        expectedView,
      )
      expect(req.journeyData.inductionDto).toEqual(inductionDto)
    })

    it('should get the Previous Work Experience Detail view given there is an PreviousWorkExperienceDetailForm already on res.locals.invalidForm', async () => {
      // Given
      req.params.typeOfWorkExperience = 'construction'
      req.originalUrl = `/prisoners/${prisonNumber}/create-induction/${journeyId}/previous-work-experience/construction`

      const inductionDto = inductionDtoWithWorkExperienceTypes()
      req.journeyData.inductionDto = inductionDto

      const expectedPreviousWorkExperienceDetailForm = {
        jobRole: 'General labourer',
        jobDetails: 'General labouring, building walls, basic plastering',
      }
      res.locals.invalidForm = expectedPreviousWorkExperienceDetailForm

      const expectedView = {
        prisonerSummary,
        form: expectedPreviousWorkExperienceDetailForm,
        typeOfWorkExperience: 'CONSTRUCTION',
      }

      // When
      await controller.getPreviousWorkExperienceDetailView(req, res, next)

      // Then
      expect(res.render).toHaveBeenCalledWith(
        'pages/induction/previousWorkExperience/workExperienceDetail',
        expectedView,
      )
      expect(req.journeyData.inductionDto).toEqual(inductionDto)
    })

    it(`should not get the Previous Work Experience Detail view given the request path contains a valid work experience type that is not on the prisoner's induction`, async () => {
      // Given
      req.params.typeOfWorkExperience = 'retail'
      req.originalUrl = `/prisoners/${prisonNumber}/create-induction/${journeyId}/previous-work-experience/retail`

      const inductionDto = inductionDtoWithWorkExperienceTypes()
      // The induction has work experience types of construction and other, but not retail
      req.journeyData.inductionDto = inductionDto

      const expectedError = createError(404, `Previous Work Experience type retail not found on Induction`)

      // When
      await controller.getPreviousWorkExperienceDetailView(req, res, next)

      // Then
      expect(res.render).not.toHaveBeenCalled()
      expect(next).toHaveBeenCalledWith(expectedError)
    })

    it('should not get the Previous Work Experience Detail view given the request path contains an invalid work experience type', async () => {
      // Given
      req.params.typeOfWorkExperience = 'some-non-valid-work-experience-type'
      req.originalUrl = `/prisoners/${prisonNumber}/create-induction/${journeyId}/previous-work-experience/some-non-valid-work-experience-type`

      const inductionDto = inductionDtoWithWorkExperienceTypes()
      req.journeyData.inductionDto = inductionDto

      const expectedError = createError(
        404,
        `Previous Work Experience type some-non-valid-work-experience-type not found on Induction`,
      )

      // When
      await controller.getPreviousWorkExperienceDetailView(req, res, next)

      // Then
      expect(res.render).not.toHaveBeenCalled()
      expect(next).toHaveBeenCalledWith(expectedError)
    })
  })

  describe('submitPreviousWorkExperienceDetailForm', () => {
    describe('form and request validation', () => {
      it('should not update Induction given form is submitted with the request path containing an invalid work experience type', async () => {
        // Given
        req.params.typeOfWorkExperience = 'some-non-valid-work-experience-type'
        req.originalUrl = `/prisoners/${prisonNumber}/create-induction/${journeyId}/previous-work-experience/some-non-valid-work-experience-type`

        const inductionDto = inductionDtoWithWorkExperienceTypes()
        req.journeyData.inductionDto = inductionDto

        const expectedError = createError(
          404,
          `Previous Work Experience type some-non-valid-work-experience-type not found on Induction`,
        )

        // When
        await controller.submitPreviousWorkExperienceDetailForm(req, res, next)

        // Then
        expect(res.redirect).not.toHaveBeenCalled()
        expect(next).toHaveBeenCalledWith(expectedError)
      })

      it(`should not update Induction given form is submitted with the request path contains a valid work experience type that is not on the prisoner's induction`, async () => {
        // Given
        req.params.typeOfWorkExperience = 'retail'
        req.originalUrl = `/prisoners/${prisonNumber}/create-induction/${journeyId}/previous-work-experience/retail`

        const inductionDto = inductionDtoWithWorkExperienceTypes()
        // The induction has work experience of construction and other, but not retail
        req.journeyData.inductionDto = inductionDto

        const expectedError = createError(404, `Previous Work Experience type retail not found on Induction`)

        const previousWorkExperienceDetailForm = {
          jobRole: 'Shop assistant',
          jobDetails: 'Serving customers and stacking shelves',
        }
        req.body = previousWorkExperienceDetailForm

        // When
        await controller.submitPreviousWorkExperienceDetailForm(req, res, next)

        // Then
        expect(res.redirect).not.toHaveBeenCalled()
        expect(next).toHaveBeenCalledWith(expectedError)
      })
    })

    it('should update inductionDto and redirect to next page in page flow queue given we are not on the last page of the queue', async () => {
      // Given
      req.query = {}

      req.params.typeOfWorkExperience = 'construction'
      req.originalUrl = `/prisoners/${prisonNumber}/create-induction/${journeyId}/previous-work-experience/construction`

      const inductionDto = inductionDtoWithWorkExperienceTypes()
      req.journeyData.inductionDto = inductionDto

      const previousWorkExperienceDetailForm = {
        jobRole: 'General labourer',
        jobDetails: 'Basic ground works and building',
      }
      req.body = previousWorkExperienceDetailForm

      const pageFlowQueue = {
        pageUrls: [
          `/prisoners/${prisonNumber}/create-induction/${journeyId}/previous-work-experience`,
          `/prisoners/${prisonNumber}/create-induction/${journeyId}/previous-work-experience/construction`, // current page in queue
          `/prisoners/${prisonNumber}/create-induction/${journeyId}/previous-work-experience/other`,
        ],
        currentPageIndex: 1,
      }
      req.session.pageFlowQueue = pageFlowQueue

      const expectedNextPage = `/prisoners/${prisonNumber}/create-induction/${journeyId}/previous-work-experience/other`
      const expectedWorkExperiences = [
        {
          experienceType: TypeOfWorkExperienceValue.CONSTRUCTION,
          experienceTypeOther: null as string,
          role: 'General labourer',
          details: 'Basic ground works and building',
        },
        {
          experienceType: TypeOfWorkExperienceValue.OTHER,
          experienceTypeOther: 'Retail delivery',
          role: undefined as string,
          details: undefined as string,
        },
      ]

      // When
      await controller.submitPreviousWorkExperienceDetailForm(req, res, next)

      // Then
      expect(res.redirect).toHaveBeenCalledWith(expectedNextPage)
      expect(req.session.pageFlowQueue).toEqual(pageFlowQueue)
      expect(req.journeyData.inductionDto.previousWorkExperiences.experiences).toEqual(expectedWorkExperiences)
    })

    it('should update inductionDto and redirect to Personal Skills given we are on the last page of the queue and previous page was not Check Your Answers', async () => {
      // Given
      req.query = {}

      req.params.typeOfWorkExperience = 'other'
      req.originalUrl = `/prisoners/${prisonNumber}/create-induction/${journeyId}/previous-work-experience/other`

      const inductionDto = inductionDtoWithWorkExperienceTypes()
      // Modify the first experience (construction) with job role and details, so that when the last experience is submitted (other) we have a complete set of populated work experiences
      inductionDto.previousWorkExperiences.experiences = inductionDto.previousWorkExperiences.experiences.map(
        (experience, idx) => {
          if (idx === 0) {
            return {
              ...experience,
              role: 'General labourer',
              details: 'Basic ground works and building',
            }
          }
          return experience
        },
      )
      req.journeyData.inductionDto = inductionDto

      const previousWorkExperienceDetailForm = {
        jobRole: 'Milkman',
        jobDetails: 'Self employed franchise operator delivering milk and associated diary products.',
      }
      req.body = previousWorkExperienceDetailForm

      const pageFlowQueue = {
        pageUrls: [
          `/prisoners/${prisonNumber}/create-induction/${journeyId}/previous-work-experience`,
          `/prisoners/${prisonNumber}/create-induction/${journeyId}/previous-work-experience/construction`,
          `/prisoners/${prisonNumber}/create-induction/${journeyId}/previous-work-experience/other`, // current page in queue
        ],
        currentPageIndex: 2,
      }
      req.session.pageFlowQueue = pageFlowQueue

      const expectedNextPage = '../skills'
      const expectedWorkExperiences = [
        {
          experienceType: TypeOfWorkExperienceValue.CONSTRUCTION,
          experienceTypeOther: null,
          role: 'General labourer',
          details: 'Basic ground works and building',
        },
        {
          experienceType: TypeOfWorkExperienceValue.OTHER,
          experienceTypeOther: 'Retail delivery',
          role: 'Milkman',
          details: 'Self employed franchise operator delivering milk and associated diary products.',
        },
      ]

      // When
      await controller.submitPreviousWorkExperienceDetailForm(req, res, next)

      // Then
      expect(res.redirect).toHaveBeenCalledWith(expectedNextPage)
      expect(req.session.pageFlowQueue).toBeUndefined()
      expect(req.journeyData.inductionDto.previousWorkExperiences.experiences).toEqual(expectedWorkExperiences)
    })

    it('should update inductionDto and redirect to Check Your Answers given previous page was Check Your Answers', async () => {
      // Given
      req.query = { submitToCheckAnswers: 'true' }

      req.params.typeOfWorkExperience = 'construction'
      req.originalUrl = `/prisoners/${prisonNumber}/create-induction/${journeyId}/previous-work-experience/construction`

      const inductionDto = inductionDtoWithWorkExperienceTypes()
      req.journeyData.inductionDto = inductionDto

      const previousWorkExperienceDetailForm = {
        jobRole: 'General labourer',
        jobDetails: 'Basic ground works and building',
      }
      req.body = previousWorkExperienceDetailForm

      const expectedWorkExperiences = [
        {
          experienceType: TypeOfWorkExperienceValue.CONSTRUCTION,
          experienceTypeOther: null as string,
          role: 'General labourer',
          details: 'Basic ground works and building',
        },
        {
          experienceType: TypeOfWorkExperienceValue.OTHER,
          experienceTypeOther: 'Retail delivery',
          role: undefined as string,
          details: undefined as string,
        },
      ]

      // When
      await controller.submitPreviousWorkExperienceDetailForm(req, res, next)

      // Then
      const updatedInduction = req.journeyData.inductionDto
      expect(updatedInduction.previousWorkExperiences.experiences).toEqual(expectedWorkExperiences)
      expect(res.redirect).toHaveBeenCalledWith('../check-your-answers')
    })

    it('should update inductionDto and redirect to Check Your Answers given we are at the end of the page queue and needToCompleteJourneyFromCheckYourAnswers is set', async () => {
      // Given
      req.params.typeOfWorkExperience = 'other'
      req.originalUrl = `/prisoners/${prisonNumber}/create-induction/${journeyId}/previous-work-experience/other`

      const inductionDto = inductionDtoWithWorkExperienceTypes()
      // Modify the first experience (construction) with job role and details, so that when the last experience is submitted (other) we have a complete set of populated work experiences
      inductionDto.previousWorkExperiences.experiences = inductionDto.previousWorkExperiences.experiences.map(
        (experience, idx) => {
          if (idx === 0) {
            return {
              ...experience,
              role: 'General labourer',
              details: 'Basic ground works and building',
            }
          }
          return experience
        },
      )
      inductionDto.previousWorkExperiences.needToCompleteJourneyFromCheckYourAnswers = true
      req.journeyData.inductionDto = inductionDto

      const previousWorkExperienceDetailForm = {
        jobRole: 'Milkman',
        jobDetails: 'Self employed franchise operator delivering milk and associated diary products.',
      }
      req.body = previousWorkExperienceDetailForm

      const pageFlowQueue = {
        pageUrls: [
          `/prisoners/${prisonNumber}/create-induction/${journeyId}/previous-work-experience`,
          `/prisoners/${prisonNumber}/create-induction/${journeyId}/previous-work-experience/construction`,
          `/prisoners/${prisonNumber}/create-induction/${journeyId}/previous-work-experience/other`, // current page in queue
        ],
        currentPageIndex: 2,
      }
      req.session.pageFlowQueue = pageFlowQueue

      const expectedWorkExperiences = [
        {
          experienceType: TypeOfWorkExperienceValue.CONSTRUCTION,
          experienceTypeOther: null,
          role: 'General labourer',
          details: 'Basic ground works and building',
        },
        {
          experienceType: TypeOfWorkExperienceValue.OTHER,
          experienceTypeOther: 'Retail delivery',
          role: 'Milkman',
          details: 'Self employed franchise operator delivering milk and associated diary products.',
        },
      ]

      // When
      await controller.submitPreviousWorkExperienceDetailForm(req, res, next)

      // Then
      const updatedInduction = req.journeyData.inductionDto
      expect(updatedInduction.previousWorkExperiences.experiences).toEqual(expectedWorkExperiences)
      expect(res.redirect).toHaveBeenCalledWith('../check-your-answers')
      expect(req.session.pageFlowQueue).toBeUndefined()
    })
  })
})

const inductionDtoWithWorkExperienceTypes = (): InductionDto => {
  const inductionDto = aValidInductionDto({ hasWorkedBefore: HasWorkedBeforeValue.YES })
  inductionDto.previousWorkExperiences.experiences = [
    {
      experienceType: TypeOfWorkExperienceValue.CONSTRUCTION,
      experienceTypeOther: null,
      role: undefined,
      details: undefined,
    },
    {
      experienceType: TypeOfWorkExperienceValue.OTHER,
      experienceTypeOther: 'Retail delivery',
      role: undefined,
      details: undefined,
    },
  ]
  return inductionDto
}
