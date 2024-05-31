import createError from 'http-errors'
import { NextFunction, Request, Response } from 'express'
import type { SessionData } from 'express-session'
import type { PreviousWorkExperienceDto } from 'inductionDto'
import type { PageFlow } from 'viewModels'
import InductionService from '../../../services/inductionService'
import PreviousWorkExperienceDetailUpdateController from './previousWorkExperienceDetailUpdateController'
import aValidPrisonerSummary from '../../../testsupport/prisonerSummaryTestDataBuilder'
import { aLongQuestionSetInductionDto } from '../../../testsupport/inductionDtoTestDataBuilder'
import toCreateOrUpdateInductionDto from '../../../data/mappers/createOrUpdateInductionDtoMapper'
import { aLongQuestionSetUpdateInductionDto } from '../../../testsupport/updateInductionDtoTestDataBuilder'
import TypeOfWorkExperienceValue from '../../../enums/typeOfWorkExperienceValue'

jest.mock('../../../data/mappers/createOrUpdateInductionDtoMapper')
jest.mock('../../../services/inductionService')

describe('previousWorkExperienceDetailUpdateController', () => {
  const mockedCreateOrUpdateInductionDtoMapper = toCreateOrUpdateInductionDto as jest.MockedFunction<
    typeof toCreateOrUpdateInductionDto
  >

  const inductionService = new InductionService(null) as jest.Mocked<InductionService>
  const controller = new PreviousWorkExperienceDetailUpdateController(inductionService)

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
    req.user = { token: 'some-token' } as Express.User
    req.params = { prisonNumber }
    req.path = ''
  })

  describe('getPreviousWorkExperienceDetailView', () => {
    it('should get the Previous Work Experience Detail view given there is no PreviousWorkExperienceDetailForm on the session', async () => {
      // Given
      req.params.typeOfWorkExperience = 'construction'
      req.path = `/prisoners/${prisonNumber}/induction/previous-work-experience/construction`

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
        backLinkAriaText: `Back to Jimmy Lightfingers's learning and work progress`,
        typeOfWorkExperience: 'CONSTRUCTION',
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
      expect(req.session.previousWorkExperienceDetailForm).toBeUndefined()
      expect(req.session.inductionDto).toEqual(inductionDto)
    })

    it('should get the Previous Work Experience Detail view given there is an PreviousWorkExperienceDetailForm already on the session', async () => {
      // Given
      req.params.typeOfWorkExperience = 'construction'
      req.path = `/prisoners/${prisonNumber}/induction/previous-work-experience/construction`

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
        backLinkAriaText: `Back to Jimmy Lightfingers's learning and work progress`,
        typeOfWorkExperience: 'CONSTRUCTION',
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
      expect(req.session.previousWorkExperienceDetailForm).toBeUndefined()
      expect(req.session.inductionDto).toEqual(inductionDto)
    })

    it(`should not get the Previous Work Experience Detail view given the request path contains a valid work experience type that is not on the prisoner's induction`, async () => {
      // Given
      req.params.typeOfWorkExperience = 'retail'
      req.path = `/prisoners/${prisonNumber}/induction/previous-work-experience/retail`

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
      req.params.typeOfWorkExperience = 'some-non-valid-work-experience-type'
      req.path = `/prisoners/${prisonNumber}/induction/previous-work-experience/some-non-valid-work-experience-type`

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
    describe('form and request validation', () => {
      it('should not update Induction given form is submitted with validation errors', async () => {
        // Given
        req.params.typeOfWorkExperience = 'construction'
        req.path = `/prisoners/${prisonNumber}/induction/previous-work-experience/construction`

        const inductionDto = aLongQuestionSetInductionDto({ hasWorkedBefore: true })
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
        await controller.submitPreviousWorkExperienceDetailForm(
          req as undefined as Request,
          res as undefined as Response,
          next as undefined as NextFunction,
        )

        // Then
        expect(res.redirectWithErrors).toHaveBeenCalledWith(
          '/prisoners/A1234BC/induction/previous-work-experience/construction',
          expectedErrors,
        )
        expect(req.session.previousWorkExperienceDetailForm).toEqual(invalidPreviousWorkExperienceDetailForm)
        expect(req.session.inductionDto).toEqual(inductionDto)
      })

      it('should not update Induction given form is submitted with the request path containing an invalid work experience type', async () => {
        // Given
        req.params.typeOfWorkExperience = 'some-non-valid-work-experience-type'
        req.path = `/prisoners/${prisonNumber}/induction/previous-work-experience/some-non-valid-work-experience-type`

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
        req.params.typeOfWorkExperience = 'retail'
        req.path = `/prisoners/${prisonNumber}/induction/previous-work-experience/retail`

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

      it('should update induction DTO and redirect back to check your answers page when coming from check your answers', async () => {
        // Given
        req.session.inductionDto = aLongQuestionSetInductionDto()
        req.session.pageFlowHistory = {
          pageUrls: [
            `/prisoners/${prisonerSummary.prisonNumber}/induction/check-your-answers`,
            `/prisoners/${prisonerSummary.prisonNumber}/induction/previous-work-experience/construction`,
          ],
          currentPageIndex: 1,
        }
        req.params.typeOfWorkExperience = TypeOfWorkExperienceValue.CONSTRUCTION.toLocaleLowerCase()
        req.body = {
          jobRole: 'Roofer',
          jobDetails: 'Building and maintaining roofs',
        }

        // The actual implementations are fine for this test
        const actualToCreateOrUpdateInductionDto = jest.requireActual(
          '../../../data/mappers/createOrUpdateInductionDtoMapper',
        ).default
        mockedCreateOrUpdateInductionDtoMapper.mockImplementation(actualToCreateOrUpdateInductionDto)

        const expectedExperience: PreviousWorkExperienceDto = {
          experienceType: TypeOfWorkExperienceValue.CONSTRUCTION,
          experienceTypeOther: null,
          role: 'Roofer',
          details: 'Building and maintaining roofs',
        }

        expect(req.session.inductionDto.previousWorkExperiences.experiences).not.toEqual(
          expect.arrayContaining([expectedExperience]),
        )

        // When
        await controller.submitPreviousWorkExperienceDetailForm(
          req as undefined as Request,
          res as undefined as Response,
          next as undefined as NextFunction,
        )

        // Then
        expect(req.session.inductionDto.previousWorkExperiences.experiences).toEqual(
          expect.arrayContaining([expectedExperience]),
        )
        expect(res.redirect).toHaveBeenCalledWith(
          `/prisoners/${prisonerSummary.prisonNumber}/induction/check-your-answers`,
        )
      })
    })

    describe('no PageFlowQueue on the session', () => {
      // No PageFlowQueue on the session means the user is updating one Previous Work Experience Detail (job role/details) from the Work & Interests page
      // and is not part of a page flow that is adding new Previous Work Experiences.
      beforeEach(() => {
        req.session.pageFlowQueue = undefined
      })

      it('should update Induction and call API and redirect to work and interests page', async () => {
        // Given
        req.params.typeOfWorkExperience = 'construction'
        req.path = `/prisoners/${prisonNumber}/induction/previous-work-experience/construction`

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
        expect(updatedInduction.previousWorkExperiences.experiences).toEqual(
          expectedUpdatedPreviousWorkExperienceDetail,
        )

        expect(inductionService.updateInduction).toHaveBeenCalledWith(prisonNumber, updateInductionDto, 'some-token')
        expect(res.redirect).toHaveBeenCalledWith(`/plan/${prisonNumber}/view/work-and-interests`)
        expect(req.session.previousWorkExperienceDetailForm).toBeUndefined()
        expect(req.session.inductionDto).toBeUndefined()
      })

      it('should not update Induction given error calling service', async () => {
        // Given
        req.params.typeOfWorkExperience = 'construction'
        req.path = `/prisoners/${prisonNumber}/induction/previous-work-experience/construction`

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
        expect(updatedInduction.previousWorkExperiences.experiences).toEqual(
          expectedUpdatedPreviousWorkExperienceDetail,
        )

        expect(inductionService.updateInduction).toHaveBeenCalledWith(prisonNumber, updateInductionDto, 'some-token')
        expect(next).toHaveBeenCalledWith(expectedError)
        expect(req.session.previousWorkExperienceDetailForm).toEqual(previousWorkExperienceDetailForm)
        expect(req.session.inductionDto).toEqual(inductionDto)
      })
    })

    describe('A PageFlowQueue is on the session', () => {
      // A PageFlowQueue on the session means the user is adding new Previous Work Experiences as part of updating the
      // Induction from the Work & Interests tab

      it('should update Induction and call API and redirect to work and interests page given a PageFlowQueue that is on the last page and we are not updating the entire Induction question set', async () => {
        // Given
        req.params.typeOfWorkExperience = 'construction'
        req.path = `/prisoners/${prisonNumber}/induction/previous-work-experience/construction`

        req.session.updateInductionQuestionSet = undefined

        const pageFlowQueue: PageFlow = {
          pageUrls: [`/prisoners/${prisonNumber}/induction/previous-work-experience/construction`],
          currentPageIndex: 0,
        }
        req.session.pageFlowQueue = pageFlowQueue

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
        expect(updatedInduction.previousWorkExperiences.experiences).toEqual(
          expectedUpdatedPreviousWorkExperienceDetail,
        )

        expect(inductionService.updateInduction).toHaveBeenCalledWith(prisonNumber, updateInductionDto, 'some-token')
        expect(res.redirect).toHaveBeenCalledWith(`/plan/${prisonNumber}/view/work-and-interests`)
        expect(req.session.previousWorkExperienceDetailForm).toBeUndefined()
        expect(req.session.inductionDto).toBeUndefined()
      })

      it('should update induction in session but not call API given a PageFlowQueue that is not on the last page', async () => {
        // Given
        req.params.typeOfWorkExperience = 'construction'
        req.path = `/prisoners/${prisonNumber}/induction/previous-work-experience/construction`

        const pageFlowQueue: PageFlow = {
          pageUrls: [
            `/prisoners/${prisonNumber}/induction/previous-work-experience/construction`,
            `/prisoners/${prisonNumber}/induction/previous-work-experience/retail`,
          ],
          currentPageIndex: 0,
        }
        req.session.pageFlowQueue = pageFlowQueue

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

        // When
        await controller.submitPreviousWorkExperienceDetailForm(
          req as undefined as Request,
          res as undefined as Response,
          next as undefined as NextFunction,
        )

        // Then
        expect(res.redirect).toHaveBeenCalledWith('/prisoners/A1234BC/induction/previous-work-experience/retail')
        expect(inductionService.updateInduction).not.toHaveBeenCalled()
      })

      it('should update InductionDto and redirect to Personal Skills page given a PageFlowQueue that is on the last page and we are updating the entire Induction question set', async () => {
        // Given
        req.params.typeOfWorkExperience = 'construction'
        req.path = `/prisoners/${prisonNumber}/induction/previous-work-experience/construction`

        req.session.updateInductionQuestionSet = { hopingToWorkOnRelease: 'YES' }

        const pageFlowQueue: PageFlow = {
          pageUrls: [
            `/prisoners/${prisonNumber}/induction/previous-work-experience`,
            `/prisoners/${prisonNumber}/induction/previous-work-experience/construction`,
          ],
          currentPageIndex: 1,
        }
        req.session.pageFlowQueue = pageFlowQueue

        const inductionDto = aLongQuestionSetInductionDto({ hasWorkedBefore: true })
        req.session.inductionDto = inductionDto

        const previousWorkExperienceDetailForm = {
          jobRole: 'General labourer',
          jobDetails: 'General labouring, building walls, basic plastering',
        }
        req.body = previousWorkExperienceDetailForm
        req.session.previousWorkExperienceDetailForm = undefined

        const expectedPageFlowHistory: PageFlow = {
          pageUrls: ['/prisoners/A1234BC/induction/previous-work-experience'],
          currentPageIndex: 0,
        }

        // When
        await controller.submitPreviousWorkExperienceDetailForm(
          req as undefined as Request,
          res as undefined as Response,
          next as undefined as NextFunction,
        )

        // Then
        const previousWorkExperiencesOnInduction: Array<PreviousWorkExperienceDto> =
          req.session.inductionDto.previousWorkExperiences.experiences
        const previousConstructionWorkExperience = previousWorkExperiencesOnInduction.find(
          experience => experience.experienceType === TypeOfWorkExperienceValue.CONSTRUCTION,
        )
        expect(previousConstructionWorkExperience.role).toEqual('General labourer')
        expect(previousConstructionWorkExperience.details).toEqual(
          'General labouring, building walls, basic plastering',
        )
        expect(res.redirect).toHaveBeenCalledWith(`/prisoners/${prisonNumber}/induction/skills`)
        expect(req.session.previousWorkExperienceDetailForm).toBeUndefined()
        expect(inductionService.updateInduction).not.toHaveBeenCalled()
        expect(req.session.pageFlowHistory).toEqual(expectedPageFlowHistory)
      })
    })
  })
})
