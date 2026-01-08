import createError from 'http-errors'
import { Request, Response } from 'express'
import { SessionData } from 'express-session'
import { v4 as uuidV4 } from 'uuid'
import type { PreviousWorkExperienceDto } from 'inductionDto'
import type { PageFlow } from 'viewModels'
import InductionService from '../../../services/inductionService'
import PreviousWorkExperienceDetailUpdateController from './previousWorkExperienceDetailUpdateController'
import aValidPrisonerSummary from '../../../testsupport/prisonerSummaryTestDataBuilder'
import { aValidInductionDto } from '../../../testsupport/inductionDtoTestDataBuilder'
import toCreateOrUpdateInductionDto from '../../../data/mappers/createOrUpdateInductionDtoMapper'
import aValidUpdateInductionDto from '../../../testsupport/updateInductionDtoTestDataBuilder'
import HasWorkedBeforeValue from '../../../enums/hasWorkedBeforeValue'

jest.mock('../../../data/mappers/createOrUpdateInductionDtoMapper')
jest.mock('../../../services/inductionService')

describe('previousWorkExperienceDetailUpdateController', () => {
  const mockedCreateOrUpdateInductionDtoMapper = toCreateOrUpdateInductionDto as jest.MockedFunction<
    typeof toCreateOrUpdateInductionDto
  >

  const inductionService = new InductionService(null) as jest.Mocked<InductionService>
  const controller = new PreviousWorkExperienceDetailUpdateController(inductionService)

  const journeyId = uuidV4()
  const prisonNumber = 'A1234BC'
  const username = 'a-dps-user'
  const prisonerSummary = aValidPrisonerSummary()

  const flash = jest.fn()
  const req = {
    session: {} as SessionData,
    journeyData: {} as Express.JourneyData,
    body: {},
    user: { username },
    params: { prisonNumber, journeyId } as Record<string, string>,
    path: '',
    flash,
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
    req.body = {}
    req.journeyData = {}
    res.locals.invalidForm = undefined
  })

  describe('getPreviousWorkExperienceDetailView', () => {
    it('should get the Previous Work Experience Detail view given there is no PreviousWorkExperienceDetailForm on res.locals.invalidForm', async () => {
      // Given
      req.params.typeOfWorkExperience = 'construction'
      req.path = `/prisoners/${prisonNumber}/induction/${journeyId}/previous-work-experience/construction`

      const inductionDto = aValidInductionDto({ hasWorkedBefore: HasWorkedBeforeValue.YES })
      req.journeyData.inductionDto = inductionDto
      res.locals.invalidForm = undefined

      const expectedPreviousWorkExperienceDetailForm = {
        jobRole: 'General labourer',
        jobDetails: 'Groundwork and basic block work and bricklaying',
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
      expect(req.journeyData.inductionDto).toEqual(inductionDto)
    })

    it('should get the Previous Work Experience Detail view given there is an PreviousWorkExperienceDetailForm already on res.locals.invalidForm', async () => {
      // Given
      req.params.typeOfWorkExperience = 'construction'
      req.path = `/prisoners/${prisonNumber}/induction/${journeyId}/previous-work-experience/construction`

      const inductionDto = aValidInductionDto({ hasWorkedBefore: HasWorkedBeforeValue.YES })
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
      await controller.getPreviousWorkExperienceDetailView(req as unknown as Request, res, next)

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
      req.path = `/prisoners/${prisonNumber}/induction/${journeyId}/previous-work-experience/retail`

      const inductionDto = aValidInductionDto({ hasWorkedBefore: HasWorkedBeforeValue.YES })
      // The induction has work experience of construction and other, but not retail
      req.journeyData.inductionDto = inductionDto

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
      req.path = `/prisoners/${prisonNumber}/induction/${journeyId}/previous-work-experience/some-non-valid-work-experience-type`

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
      it('should not update Induction given form is submitted with the request path containing an invalid work experience type', async () => {
        // Given
        req.params.typeOfWorkExperience = 'some-non-valid-work-experience-type'
        req.path = `/prisoners/${prisonNumber}/induction/${journeyId}/previous-work-experience/some-non-valid-work-experience-type`

        const inductionDto = aValidInductionDto({ hasWorkedBefore: HasWorkedBeforeValue.YES })
        req.journeyData.inductionDto = inductionDto

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
        req.path = `/prisoners/${prisonNumber}/induction/${journeyId}/previous-work-experience/retail`

        const inductionDto = aValidInductionDto({ hasWorkedBefore: HasWorkedBeforeValue.YES })
        // The induction has work experience of construction and other, but not retail
        req.journeyData.inductionDto = inductionDto

        const expectedError = createError(404, `Previous Work Experience type retail not found on Induction`)

        const previousWorkExperienceDetailForm = {
          jobRole: 'Shop assistant',
          jobDetails: 'Serving customers and stacking shelves',
        }
        req.body = previousWorkExperienceDetailForm

        // When
        await controller.submitPreviousWorkExperienceDetailForm(req as unknown as Request, res, next)

        // Then
        expect(res.redirect).not.toHaveBeenCalled()
        expect(next).toHaveBeenCalledWith(expectedError)
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
        req.path = `/prisoners/${prisonNumber}/induction/${journeyId}/previous-work-experience/construction`

        const inductionDto = aValidInductionDto({ hasWorkedBefore: HasWorkedBeforeValue.YES })
        req.journeyData.inductionDto = inductionDto

        const previousWorkExperienceDetailForm = {
          jobRole: 'General labourer',
          jobDetails: 'General labouring, building walls, basic plastering',
        }
        req.body = previousWorkExperienceDetailForm

        const updateInductionDto = aValidUpdateInductionDto()

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
        await controller.submitPreviousWorkExperienceDetailForm(req as unknown as Request, res, next)

        // Then
        // Extract the first call to the mock and the second argument (i.e. the updated Induction)
        const updatedInduction = mockedCreateOrUpdateInductionDtoMapper.mock.calls[0][1]
        expect(mockedCreateOrUpdateInductionDtoMapper).toHaveBeenCalledWith(prisonerSummary.prisonId, updatedInduction)
        expect(updatedInduction.previousWorkExperiences.experiences).toEqual(
          expectedUpdatedPreviousWorkExperienceDetail,
        )

        expect(inductionService.updateInduction).toHaveBeenCalledWith(prisonNumber, updateInductionDto, username)
        expect(res.redirect).toHaveBeenCalledWith(`/plan/${prisonNumber}/view/work-and-interests`)
        expect(req.journeyData.inductionDto).toBeUndefined()
        expect(flash).not.toHaveBeenCalled()
      })

      it('should not update Induction given error calling service', async () => {
        // Given
        req.params.typeOfWorkExperience = 'construction'
        req.path = `/prisoners/${prisonNumber}/induction/${journeyId}/previous-work-experience/construction`

        const inductionDto = aValidInductionDto({ hasWorkedBefore: HasWorkedBeforeValue.YES })
        req.journeyData.inductionDto = inductionDto

        const previousWorkExperienceDetailForm = {
          jobRole: 'General labourer',
          jobDetails: 'General labouring, building walls, basic plastering',
        }
        req.body = previousWorkExperienceDetailForm

        const updateInductionDto = aValidUpdateInductionDto()

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

        // When
        await controller.submitPreviousWorkExperienceDetailForm(req as unknown as Request, res, next)

        // Then
        // Extract the first call to the mock and the second argument (i.e. the updated Induction)
        const updatedInduction = mockedCreateOrUpdateInductionDtoMapper.mock.calls[0][1]
        expect(mockedCreateOrUpdateInductionDtoMapper).toHaveBeenCalledWith(prisonerSummary.prisonId, updatedInduction)
        expect(updatedInduction.previousWorkExperiences.experiences).toEqual(
          expectedUpdatedPreviousWorkExperienceDetail,
        )

        expect(inductionService.updateInduction).toHaveBeenCalledWith(prisonNumber, updateInductionDto, username)
        expect(req.journeyData.inductionDto).toEqual(inductionDto)
        expect(flash).toHaveBeenCalledWith('pageHasApiErrors', 'true')
        expect(res.redirect).toHaveBeenCalledWith(
          `/prisoners/A1234BC/induction/${journeyId}/previous-work-experience/construction`,
        )
      })
    })

    describe('A PageFlowQueue is on the session', () => {
      // A PageFlowQueue on the session means the user is adding new Previous Work Experiences as part of updating the
      // Induction from the Work & Interests tab

      it('should update Induction and call API and redirect to work and interests page given a PageFlowQueue that is on the last page', async () => {
        // Given
        req.params.typeOfWorkExperience = 'construction'
        req.path = `/prisoners/${prisonNumber}/induction/${journeyId}/previous-work-experience/construction`

        const pageFlowQueue: PageFlow = {
          pageUrls: [`/prisoners/${prisonNumber}/induction/${journeyId}/previous-work-experience/construction`],
          currentPageIndex: 0,
        }
        req.session.pageFlowQueue = pageFlowQueue

        const inductionDto = aValidInductionDto({ hasWorkedBefore: HasWorkedBeforeValue.YES })
        req.journeyData.inductionDto = inductionDto

        const previousWorkExperienceDetailForm = {
          jobRole: 'General labourer',
          jobDetails: 'General labouring, building walls, basic plastering',
        }
        req.body = previousWorkExperienceDetailForm

        const updateInductionDto = aValidUpdateInductionDto()

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
        await controller.submitPreviousWorkExperienceDetailForm(req as unknown as Request, res, next)

        // Then
        // Extract the first call to the mock and the second argument (i.e. the updated Induction)
        const updatedInduction = mockedCreateOrUpdateInductionDtoMapper.mock.calls[0][1]
        expect(mockedCreateOrUpdateInductionDtoMapper).toHaveBeenCalledWith(prisonerSummary.prisonId, updatedInduction)
        expect(updatedInduction.previousWorkExperiences.experiences).toEqual(
          expectedUpdatedPreviousWorkExperienceDetail,
        )

        expect(inductionService.updateInduction).toHaveBeenCalledWith(prisonNumber, updateInductionDto, username)
        expect(res.redirect).toHaveBeenCalledWith(`/plan/${prisonNumber}/view/work-and-interests`)
        expect(req.journeyData.inductionDto).toBeUndefined()
        expect(flash).not.toHaveBeenCalled()
      })

      it('should update induction in session but not call API given a PageFlowQueue that is not on the last page', async () => {
        // Given
        req.params.typeOfWorkExperience = 'construction'
        req.path = `/prisoners/${prisonNumber}/induction/${journeyId}/previous-work-experience/construction`

        const pageFlowQueue: PageFlow = {
          pageUrls: [
            `/prisoners/${prisonNumber}/induction/${journeyId}/previous-work-experience/construction`,
            `/prisoners/${prisonNumber}/induction/${journeyId}/previous-work-experience/retail`,
          ],
          currentPageIndex: 0,
        }
        req.session.pageFlowQueue = pageFlowQueue

        const inductionDto = aValidInductionDto({ hasWorkedBefore: HasWorkedBeforeValue.YES })
        req.journeyData.inductionDto = inductionDto

        const previousWorkExperienceDetailForm = {
          jobRole: 'General labourer',
          jobDetails: 'General labouring, building walls, basic plastering',
        }
        req.body = previousWorkExperienceDetailForm

        const updateInductionDto = aValidUpdateInductionDto()

        mockedCreateOrUpdateInductionDtoMapper.mockReturnValueOnce(updateInductionDto)

        // When
        await controller.submitPreviousWorkExperienceDetailForm(req as unknown as Request, res, next)

        // Then
        expect(res.redirect).toHaveBeenCalledWith(
          `/prisoners/A1234BC/induction/${journeyId}/previous-work-experience/retail`,
        )
        expect(inductionService.updateInduction).not.toHaveBeenCalled()
      })
    })
  })
})
