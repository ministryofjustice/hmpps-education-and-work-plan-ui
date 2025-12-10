import createError from 'http-errors'
import { Request, Response } from 'express'
import { v4 as uuidV4 } from 'uuid'
import type { InductionDto, PreviousWorkExperienceDto } from 'inductionDto'
import type { PageFlow } from 'viewModels'
import InductionService from '../../../services/inductionService'
import PreviousWorkExperienceTypesUpdateController from './previousWorkExperienceTypesUpdateController'
import toCreateOrUpdateInductionDto from '../../../data/mappers/createOrUpdateInductionDtoMapper'
import aValidPrisonerSummary from '../../../testsupport/prisonerSummaryTestDataBuilder'
import { aValidInductionDto } from '../../../testsupport/inductionDtoTestDataBuilder'
import aValidUpdateInductionDto from '../../../testsupport/updateInductionDtoTestDataBuilder'
import HasWorkedBeforeValue from '../../../enums/hasWorkedBeforeValue'

jest.mock('../../../data/mappers/createOrUpdateInductionDtoMapper')
jest.mock('../../../services/inductionService')

describe('previousWorkExperienceTypesUpdateController', () => {
  const mockedCreateOrUpdateInductionDtoMapper = toCreateOrUpdateInductionDto as jest.MockedFunction<
    typeof toCreateOrUpdateInductionDto
  >

  const inductionService = new InductionService(null, null) as jest.Mocked<InductionService>
  const controller = new PreviousWorkExperienceTypesUpdateController(inductionService)

  const journeyId = uuidV4()
  const prisonNumber = 'A1234BC'
  const username = 'a-dps-user'
  const prisonerSummary = aValidPrisonerSummary()

  const flash = jest.fn()
  const req = {
    session: {},
    journeyData: {},
    body: {},
    user: { username },
    params: { prisonNumber, journeyId },
    path: `/prisoners/${prisonNumber}/induction/${journeyId}/previous-work-experience`,
    flash,
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
    req.session.pageFlowQueue = undefined
    req.body = {}
    req.journeyData = {}
    res.locals.invalidForm = undefined
  })

  describe('getPreviousWorkExperienceTypesView', () => {
    it('should get the Previous Work Experience Types view given there is no PreviousWorkExperienceTypesForm on res.locals.invalidForm', async () => {
      // Given
      const inductionDto = aValidInductionDto({ hasWorkedBefore: HasWorkedBeforeValue.YES })
      req.journeyData.inductionDto = inductionDto
      res.locals.invalidForm = undefined

      const expectedPreviousWorkExperienceTypesForm = {
        typeOfWorkExperience: ['CONSTRUCTION', 'OTHER'],
        typeOfWorkExperienceOther: 'Retail delivery',
      }

      const expectedView = {
        prisonerSummary,
        form: expectedPreviousWorkExperienceTypesForm,
      }

      // When
      await controller.getPreviousWorkExperienceTypesView(req, res, next)

      // Then
      expect(res.render).toHaveBeenCalledWith(
        'pages/induction/previousWorkExperience/workExperienceTypes',
        expectedView,
      )
      expect(req.journeyData.inductionDto).toEqual(inductionDto)
    })

    it('should get the Previous Work Experience Types view given there is an PreviousWorkExperienceTypesForm already on res.locals.invalidForm', async () => {
      // Given
      const inductionDto = aValidInductionDto({ hasWorkedBefore: HasWorkedBeforeValue.YES })
      req.journeyData.inductionDto = inductionDto

      const expectedPreviousWorkExperienceTypesForm = {
        typeOfWorkExperience: ['OUTDOOR', 'DRIVING', 'OTHER'],
        typeOfWorkExperienceOther: 'Entertainment industry',
      }
      res.locals.invalidForm = expectedPreviousWorkExperienceTypesForm

      const expectedView = {
        prisonerSummary,
        form: expectedPreviousWorkExperienceTypesForm,
      }

      // When
      await controller.getPreviousWorkExperienceTypesView(req, res, next)

      // Then
      expect(res.render).toHaveBeenCalledWith(
        'pages/induction/previousWorkExperience/workExperienceTypes',
        expectedView,
      )
      expect(req.journeyData.inductionDto).toEqual(inductionDto)
    })
  })

  describe('submitPreviousWorkExperienceTypesForm', () => {
    it('should not update Induction given form is submitted with no changes to the original Induction', async () => {
      // Given
      const inductionDto = aValidInductionDto({ hasWorkedBefore: HasWorkedBeforeValue.YES })
      // The induction has work experience of CONSTRUCTION and OTHER (Retail delivery)
      req.journeyData.inductionDto = inductionDto

      const previousWorkExperienceTypesForm = {
        typeOfWorkExperience: ['CONSTRUCTION', 'OTHER'],
        typeOfWorkExperienceOther: 'Retail delivery',
      }
      req.body = previousWorkExperienceTypesForm

      // When
      await controller.submitPreviousWorkExperienceTypesForm(req, res, next)

      // Then
      expect(res.redirect).toHaveBeenCalledWith('/plan/A1234BC/view/work-and-interests')
      expect(mockedCreateOrUpdateInductionDtoMapper).not.toHaveBeenCalled()
      expect(inductionService.updateInduction).not.toHaveBeenCalled()
      expect(req.journeyData.inductionDto).toBeUndefined()
    })

    it('should update Induction given form is submitted where the only change is a removal of a work type', async () => {
      // Given
      const inductionDto = aValidInductionDto({ hasWorkedBefore: HasWorkedBeforeValue.YES })
      // The induction has work experience of CONSTRUCTION and OTHER (Retail delivery)
      req.journeyData.inductionDto = inductionDto

      const previousWorkExperienceTypesForm = {
        typeOfWorkExperience: ['OTHER'],
        typeOfWorkExperienceOther: 'Retail delivery',
      }
      req.body = previousWorkExperienceTypesForm

      const updateInductionDto = aValidUpdateInductionDto({ hasWorkedBefore: HasWorkedBeforeValue.YES })
      mockedCreateOrUpdateInductionDtoMapper.mockReturnValueOnce(updateInductionDto)

      const expectedPreviousWorkExperiences: Array<PreviousWorkExperienceDto> = [
        {
          details: 'Self employed franchise operator delivering milk and associated diary products.',
          experienceType: 'OTHER',
          experienceTypeOther: 'Retail delivery',
          role: 'Milkman',
        },
      ]

      // When
      await controller.submitPreviousWorkExperienceTypesForm(req, res, next)

      // Then
      // Extract the first call to the mock and the second argument (i.e. the updated Induction)
      const updatedInduction = mockedCreateOrUpdateInductionDtoMapper.mock.calls[0][1]
      expect(mockedCreateOrUpdateInductionDtoMapper).toHaveBeenCalledWith(prisonerSummary.prisonId, updatedInduction)
      expect(updatedInduction.previousWorkExperiences.experiences).toEqual(expectedPreviousWorkExperiences)

      expect(inductionService.updateInduction).toHaveBeenCalledWith(prisonNumber, updateInductionDto, username)
      expect(res.redirect).toHaveBeenCalledWith(`/plan/${prisonNumber}/view/work-and-interests`)
      expect(req.journeyData.inductionDto).toBeUndefined()
      expect(flash).not.toHaveBeenCalled()
    })

    it('should not update Induction given error calling service', async () => {
      // Given
      const inductionDto = aValidInductionDto({ hasWorkedBefore: HasWorkedBeforeValue.YES })
      // The induction has work experience of CONSTRUCTION and OTHER (Retail delivery)
      req.journeyData.inductionDto = inductionDto

      const previousWorkExperienceTypesForm = {
        typeOfWorkExperience: ['OTHER'],
        typeOfWorkExperienceOther: 'Retail delivery',
      }
      req.body = previousWorkExperienceTypesForm

      const updateInductionDto = aValidUpdateInductionDto({ hasWorkedBefore: HasWorkedBeforeValue.YES })
      mockedCreateOrUpdateInductionDtoMapper.mockReturnValueOnce(updateInductionDto)

      const expectedPreviousWorkExperiences: Array<PreviousWorkExperienceDto> = [
        {
          details: 'Self employed franchise operator delivering milk and associated diary products.',
          experienceType: 'OTHER',
          experienceTypeOther: 'Retail delivery',
          role: 'Milkman',
        },
      ]

      inductionService.updateInduction.mockRejectedValue(createError(500, 'Service unavailable'))

      // When
      await controller.submitPreviousWorkExperienceTypesForm(req, res, next)

      // Then
      // Extract the first call to the mock and the second argument (i.e. the updated Induction)
      const updatedInduction = mockedCreateOrUpdateInductionDtoMapper.mock.calls[0][1]
      expect(mockedCreateOrUpdateInductionDtoMapper).toHaveBeenCalledWith(prisonerSummary.prisonId, updatedInduction)
      expect(updatedInduction.previousWorkExperiences.experiences).toEqual(expectedPreviousWorkExperiences)

      expect(inductionService.updateInduction).toHaveBeenCalledWith(prisonNumber, updateInductionDto, username)
      expect(req.journeyData.inductionDto).toEqual(inductionDto)
      expect(flash).toHaveBeenCalledWith('pageHasApiErrors', 'true')
      expect(res.redirect).toHaveBeenCalledWith('previous-work-experience')
    })

    it('should build a page flow queue and redirect to the next page given new Previous Work Experience Types are submitted', async () => {
      // Given
      const inductionDto = aValidInductionDto({ hasWorkedBefore: HasWorkedBeforeValue.YES })
      // The induction has work experience of CONSTRUCTION and OTHER (Retail delivery)
      req.journeyData.inductionDto = inductionDto

      const previousWorkExperienceTypesForm = {
        typeOfWorkExperience: ['OUTDOOR', 'CONSTRUCTION', 'EDUCATION_TRAINING', 'OTHER'],
        typeOfWorkExperienceOther: 'Retail delivery',
      }
      req.body = previousWorkExperienceTypesForm

      const expectedPreviousWorkExperiences: Array<PreviousWorkExperienceDto> = [
        {
          details: undefined,
          experienceType: 'OUTDOOR',
          experienceTypeOther: null,
          role: undefined,
        },
        {
          details: 'Groundwork and basic block work and bricklaying',
          experienceType: 'CONSTRUCTION',
          experienceTypeOther: null,
          role: 'General labourer',
        },
        {
          details: undefined,
          experienceType: 'EDUCATION_TRAINING',
          experienceTypeOther: null,
          role: undefined,
        },
        {
          details: 'Self employed franchise operator delivering milk and associated diary products.',
          experienceType: 'OTHER',
          experienceTypeOther: 'Retail delivery',
          role: 'Milkman',
        },
      ]

      const expectedPageFlowQueue: PageFlow = {
        pageUrls: [
          `/prisoners/A1234BC/induction/${journeyId}/previous-work-experience`,
          `/prisoners/A1234BC/induction/${journeyId}/previous-work-experience/outdoor`,
          `/prisoners/A1234BC/induction/${journeyId}/previous-work-experience/education_training`,
        ],
        currentPageIndex: 0,
      }
      // When
      await controller.submitPreviousWorkExperienceTypesForm(req, res, next)

      // Then
      expect(res.redirect).toHaveBeenCalledWith(
        `/prisoners/${prisonNumber}/induction/${journeyId}/previous-work-experience/outdoor`,
      )
      expect(inductionService.updateInduction).not.toHaveBeenCalled()
      expect(req.session.pageFlowQueue).toEqual(expectedPageFlowQueue)
      const updatedInductionDto: InductionDto = req.journeyData.inductionDto
      expect(updatedInductionDto.previousWorkExperiences.experiences).toEqual(expectedPreviousWorkExperiences)
    })

    it('should build a page flow queue and redirect to the next page given only the value for OTHER has changed', async () => {
      // Given
      const inductionDto = aValidInductionDto({ hasWorkedBefore: HasWorkedBeforeValue.YES })
      // The induction has work experience of CONSTRUCTION and OTHER (Retail delivery)
      req.journeyData.inductionDto = inductionDto

      const previousWorkExperienceTypesForm = {
        typeOfWorkExperience: ['CONSTRUCTION', 'OTHER'],
        typeOfWorkExperienceOther: 'Entertainment industry',
      }
      req.body = previousWorkExperienceTypesForm

      const expectedPreviousWorkExperiences: Array<PreviousWorkExperienceDto> = [
        {
          details: 'Groundwork and basic block work and bricklaying',
          experienceType: 'CONSTRUCTION',
          experienceTypeOther: null,
          role: 'General labourer',
        },
        {
          details: undefined,
          experienceType: 'OTHER',
          experienceTypeOther: 'Entertainment industry',
          role: undefined,
        },
      ]

      const expectedPageFlowQueue: PageFlow = {
        pageUrls: [
          `/prisoners/A1234BC/induction/${journeyId}/previous-work-experience`,
          `/prisoners/A1234BC/induction/${journeyId}/previous-work-experience/other`,
        ],
        currentPageIndex: 0,
      }
      // When
      await controller.submitPreviousWorkExperienceTypesForm(req, res, next)

      // Then
      expect(res.redirect).toHaveBeenCalledWith(
        `/prisoners/${prisonNumber}/induction/${journeyId}/previous-work-experience/other`,
      )
      expect(inductionService.updateInduction).not.toHaveBeenCalled()
      expect(req.session.pageFlowQueue).toEqual(expectedPageFlowQueue)
      const updatedInductionDto: InductionDto = req.journeyData.inductionDto
      expect(updatedInductionDto.previousWorkExperiences.experiences).toEqual(expectedPreviousWorkExperiences)
    })
  })
})
