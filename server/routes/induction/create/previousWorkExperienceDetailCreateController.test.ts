import { Request, Response } from 'express'
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

  const prisonNumber = 'A1234BC'
  const prisonerSummary = aValidPrisonerSummary()

  const req = {
    session: {} as SessionData,
    body: {},
    params: { prisonNumber } as Record<string, string>,
    path: '',
  }
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

  describe('getPreviousWorkExperienceDetailView', () => {
    it('should get the Previous Work Experience Detail view given there is no PreviousWorkExperienceDetailForm on the session', async () => {
      // Given
      req.params.typeOfWorkExperience = 'construction'
      req.path = `/prisoners/${prisonNumber}/create-induction/previous-work-experience/construction`

      const inductionDto = inductionDtoWithWorkExperienceTypes()
      req.session.inductionDto = inductionDto
      req.session.previousWorkExperienceDetailForm = undefined

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
      await controller.getPreviousWorkExperienceDetailView(req as unknown as Request, res, next)

      // Then
      expect(res.render).toHaveBeenCalledWith(
        'pages/induction/previousWorkExperience/workExperienceDetail',
        expectedView,
      )
      expect(req.session.previousWorkExperienceDetailForm).toBeUndefined()
      expect(req.session.inductionDto).toEqual(inductionDto)
    })

    it('should get the Previous Work Experience Detail view given there is an PreviousWorkExperienceDetailForm already on the session', async () => {
      // Given
      req.params.typeOfWorkExperience = 'construction'
      req.path = `/prisoners/${prisonNumber}/create-induction/previous-work-experience/construction`

      const inductionDto = inductionDtoWithWorkExperienceTypes()
      req.session.inductionDto = inductionDto

      const expectedPreviousWorkExperienceDetailForm = {
        jobRole: 'General labourer',
        jobDetails: 'General labouring, building walls, basic plastering',
      }
      req.session.previousWorkExperienceDetailForm = expectedPreviousWorkExperienceDetailForm

      const expectedView = {
        prisonerSummary,
        form: expectedPreviousWorkExperienceDetailForm,
        typeOfWorkExperience: 'CONSTRUCTION',
      }

      // When
      await controller.getPreviousWorkExperienceDetailView(req as unknown as Request, res, next)

      // Then
      expect(res.render).toHaveBeenCalledWith(
        'pages/induction/previousWorkExperience/workExperienceDetail',
        expectedView,
      )
      expect(req.session.previousWorkExperienceDetailForm).toBeUndefined()
      expect(req.session.inductionDto).toEqual(inductionDto)
    })

    it(`should not get the Previous Work Experience Detail view given the request path contains a valid work experience type that is not on the prisoner's induction`, async () => {
      // Given
      req.params.typeOfWorkExperience = 'retail'
      req.path = `/prisoners/${prisonNumber}/create-induction/previous-work-experience/retail`

      const inductionDto = inductionDtoWithWorkExperienceTypes()
      // The induction has work experience types of construction and other, but not retail
      req.session.inductionDto = inductionDto
      req.session.previousWorkExperienceDetailForm = undefined

      const expectedError = createError(404, `Previous Work Experience type retail not found on Induction`)

      // When
      await controller.getPreviousWorkExperienceDetailView(req as unknown as Request, res, next)

      // Then
      expect(res.render).not.toHaveBeenCalled()
      expect(next).toHaveBeenCalledWith(expectedError)
    })

    it('should not get the Previous Work Experience Detail view given the request path contains an invalid work experience type', async () => {
      // Given
      req.params.typeOfWorkExperience = 'some-non-valid-work-experience-type'
      req.path = `/prisoners/${prisonNumber}/create-induction/previous-work-experience/some-non-valid-work-experience-type`

      const inductionDto = inductionDtoWithWorkExperienceTypes()
      req.session.inductionDto = inductionDto

      const expectedError = createError(
        404,
        `Previous Work Experience type some-non-valid-work-experience-type not found on Induction`,
      )

      // When
      await controller.getPreviousWorkExperienceDetailView(req as unknown as Request, res, next)

      // Then
      expect(res.render).not.toHaveBeenCalled()
      expect(next).toHaveBeenCalledWith(expectedError)
    })
  })

  describe('submitPreviousWorkExperienceDetailForm', () => {
    describe('form and request validation', () => {
      it('should not update Induction given form is submitted with validation errors', async () => {
        // Given
        req.params.typeOfWorkExperience = 'construction'
        req.path = `/prisoners/${prisonNumber}/create-induction/previous-work-experience/construction`

        const inductionDto = inductionDtoWithWorkExperienceTypes()
        req.session.inductionDto = inductionDto

        const invalidPreviousWorkExperienceDetailForm = {
          jobRole: 'General labourer',
          jobDetails: '',
        }
        req.body = invalidPreviousWorkExperienceDetailForm
        req.session.previousWorkExperienceDetailForm = undefined

        const expectedErrors = [
          { href: '#jobDetails', text: 'Enter details of what Jimmy Lightfingers did in their job' },
        ]

        // When
        await controller.submitPreviousWorkExperienceDetailForm(req as unknown as Request, res, next)

        // Then
        expect(res.redirectWithErrors).toHaveBeenCalledWith(
          '/prisoners/A1234BC/create-induction/previous-work-experience/construction',
          expectedErrors,
        )
        expect(req.session.previousWorkExperienceDetailForm).toEqual(invalidPreviousWorkExperienceDetailForm)
        expect(req.session.inductionDto).toEqual(inductionDto)
      })

      it('should not update Induction given form is submitted with the request path containing an invalid work experience type', async () => {
        // Given
        req.params.typeOfWorkExperience = 'some-non-valid-work-experience-type'
        req.path = `/prisoners/${prisonNumber}/create-induction/previous-work-experience/some-non-valid-work-experience-type`

        const inductionDto = inductionDtoWithWorkExperienceTypes()
        req.session.inductionDto = inductionDto

        const expectedError = createError(
          404,
          `Previous Work Experience type some-non-valid-work-experience-type not found on Induction`,
        )

        // When
        await controller.submitPreviousWorkExperienceDetailForm(req as unknown as Request, res, next)

        // Then
        expect(res.redirect).not.toHaveBeenCalled()
        expect(next).toHaveBeenCalledWith(expectedError)
      })

      it(`should not update Induction given form is submitted with the request path contains a valid work experience type that is not on the prisoner's induction`, async () => {
        // Given
        req.params.typeOfWorkExperience = 'retail'
        req.path = `/prisoners/${prisonNumber}/create-induction/previous-work-experience/retail`

        const inductionDto = inductionDtoWithWorkExperienceTypes()
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
        await controller.submitPreviousWorkExperienceDetailForm(req as unknown as Request, res, next)

        // Then
        expect(res.redirect).not.toHaveBeenCalled()
        expect(next).toHaveBeenCalledWith(expectedError)
      })
    })

    it('should update inductionDto and redirect to next page in page flow queue given we are not on the last page of the queue', async () => {
      // Given
      req.params.typeOfWorkExperience = 'construction'
      req.path = `/prisoners/${prisonNumber}/create-induction/previous-work-experience/construction`

      const inductionDto = inductionDtoWithWorkExperienceTypes()
      req.session.inductionDto = inductionDto

      const previousWorkExperienceDetailForm = {
        jobRole: 'General labourer',
        jobDetails: 'Basic ground works and building',
      }
      req.body = previousWorkExperienceDetailForm
      req.session.previousWorkExperienceDetailForm = undefined

      const pageFlowQueue = {
        pageUrls: [
          `/prisoners/${prisonNumber}/create-induction/previous-work-experience`,
          `/prisoners/${prisonNumber}/create-induction/previous-work-experience/construction`, // current page in queue
          `/prisoners/${prisonNumber}/create-induction/previous-work-experience/other`,
        ],
        currentPageIndex: 1,
      }
      req.session.pageFlowQueue = pageFlowQueue

      const pageFlowHistory = {
        pageUrls: [
          `/prisoners/${prisonNumber}/create-induction/has-worked-before`,
          `/prisoners/${prisonNumber}/create-induction/previous-work-experience`,
          `/prisoners/${prisonNumber}/create-induction/previous-work-experience/construction`,
        ],
        currentPageIndex: 2,
      }
      req.session.pageFlowHistory = pageFlowHistory

      const expectedNextPage = `/prisoners/${prisonNumber}/create-induction/previous-work-experience/other`
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
      await controller.submitPreviousWorkExperienceDetailForm(req as unknown as Request, res, next)

      // Then
      expect(res.redirect).toHaveBeenCalledWith(expectedNextPage)
      expect(req.session.previousWorkExperienceDetailForm).toBeUndefined()
      expect(req.session.pageFlowQueue).toEqual(pageFlowQueue)
      expect(req.session.pageFlowHistory).toEqual(pageFlowHistory)
      expect(req.session.inductionDto.previousWorkExperiences.experiences).toEqual(expectedWorkExperiences)
    })

    it('should update inductionDto and redirect to Personal Skills given we are on the last page of the queue', async () => {
      // Given
      req.params.typeOfWorkExperience = 'other'
      req.path = `/prisoners/${prisonNumber}/create-induction/previous-work-experience/other`

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
      req.session.inductionDto = inductionDto

      const previousWorkExperienceDetailForm = {
        jobRole: 'Milkman',
        jobDetails: 'Self employed franchise operator delivering milk and associated diary products.',
      }
      req.body = previousWorkExperienceDetailForm
      req.session.previousWorkExperienceDetailForm = undefined

      const pageFlowQueue = {
        pageUrls: [
          `/prisoners/${prisonNumber}/create-induction/previous-work-experience`,
          `/prisoners/${prisonNumber}/create-induction/previous-work-experience/construction`,
          `/prisoners/${prisonNumber}/create-induction/previous-work-experience/other`, // current page in queue
        ],
        currentPageIndex: 2,
      }
      req.session.pageFlowQueue = pageFlowQueue

      const pageFlowHistory = {
        pageUrls: [
          `/prisoners/${prisonNumber}/create-induction/has-worked-before`,
          `/prisoners/${prisonNumber}/create-induction/previous-work-experience`,
          `/prisoners/${prisonNumber}/create-induction/previous-work-experience/construction`,
          `/prisoners/${prisonNumber}/create-induction/previous-work-experience/other`,
        ],
        currentPageIndex: 3,
      }
      req.session.pageFlowHistory = pageFlowHistory

      const expectedNextPage = `/prisoners/${prisonNumber}/create-induction/skills`
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
      await controller.submitPreviousWorkExperienceDetailForm(req as unknown as Request, res, next)

      // Then
      expect(res.redirect).toHaveBeenCalledWith(expectedNextPage)
      expect(req.session.previousWorkExperienceDetailForm).toBeUndefined()
      expect(req.session.pageFlowQueue).toBeUndefined()
      expect(req.session.pageFlowHistory).toBeUndefined()
      expect(req.session.inductionDto.previousWorkExperiences.experiences).toEqual(expectedWorkExperiences)
    })

    it('should update inductionDto and redirect to Check Your Answers given previous page was Check Your Answers', async () => {
      // Given
      req.params.typeOfWorkExperience = 'construction'
      req.path = `/prisoners/${prisonNumber}/create-induction/previous-work-experience/construction`

      const inductionDto = inductionDtoWithWorkExperienceTypes()
      req.session.inductionDto = inductionDto

      const previousWorkExperienceDetailForm = {
        jobRole: 'General labourer',
        jobDetails: 'Basic ground works and building',
      }
      req.body = previousWorkExperienceDetailForm
      req.session.previousWorkExperienceDetailForm = undefined

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

      req.session.pageFlowHistory = {
        pageUrls: [
          '/prisoners/A1234BC/create-induction/check-your-answers',
          '/prisoners/A1234BC/create-induction/previous-work-experience/construction',
        ],
        currentPageIndex: 1,
      }

      // When
      await controller.submitPreviousWorkExperienceDetailForm(req as unknown as Request, res, next)

      // Then
      const updatedInduction = req.session.inductionDto
      expect(updatedInduction.previousWorkExperiences.experiences).toEqual(expectedWorkExperiences)
      expect(res.redirect).toHaveBeenCalledWith('/prisoners/A1234BC/create-induction/check-your-answers')
      expect(req.session.previousWorkExperienceDetailForm).toBeUndefined()
    })

    it('should update inductionDto and redirect to Check Your Answers given we are at the end of the page queue and the first page in the history was Check Your Answers', async () => {
      // Given
      req.params.typeOfWorkExperience = 'other'
      req.path = `/prisoners/${prisonNumber}/create-induction/previous-work-experience/other`

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
      req.session.inductionDto = inductionDto

      const previousWorkExperienceDetailForm = {
        jobRole: 'Milkman',
        jobDetails: 'Self employed franchise operator delivering milk and associated diary products.',
      }
      req.body = previousWorkExperienceDetailForm
      req.session.previousWorkExperienceDetailForm = undefined

      const pageFlowQueue = {
        pageUrls: [
          `/prisoners/${prisonNumber}/create-induction/previous-work-experience`,
          `/prisoners/${prisonNumber}/create-induction/previous-work-experience/construction`,
          `/prisoners/${prisonNumber}/create-induction/previous-work-experience/other`, // current page in queue
        ],
        currentPageIndex: 2,
      }
      req.session.pageFlowQueue = pageFlowQueue

      const pageFlowHistory = {
        pageUrls: [
          `/prisoners/${prisonNumber}/create-induction/check-your-answers`,
          `/prisoners/${prisonNumber}/create-induction/previous-work-experience`,
          `/prisoners/${prisonNumber}/create-induction/previous-work-experience/construction`,
          `/prisoners/${prisonNumber}/create-induction/previous-work-experience/other`,
        ],
        currentPageIndex: 3,
      }
      req.session.pageFlowHistory = pageFlowHistory

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
      await controller.submitPreviousWorkExperienceDetailForm(req as unknown as Request, res, next)

      // Then
      const updatedInduction = req.session.inductionDto
      expect(updatedInduction.previousWorkExperiences.experiences).toEqual(expectedWorkExperiences)
      expect(res.redirect).toHaveBeenCalledWith('/prisoners/A1234BC/create-induction/check-your-answers')
      expect(req.session.previousWorkExperienceDetailForm).toBeUndefined()
      expect(req.session.pageFlowHistory).toBeUndefined()
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
