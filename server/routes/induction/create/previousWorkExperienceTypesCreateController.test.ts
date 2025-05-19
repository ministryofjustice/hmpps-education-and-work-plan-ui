import { Request, Response } from 'express'
import { v4 as uuidV4 } from 'uuid'
import type { InductionDto, PreviousWorkExperienceDto } from 'inductionDto'
import type { PageFlow } from 'viewModels'
import type { PreviousWorkExperienceTypesForm } from 'inductionForms'
import aValidPrisonerSummary from '../../../testsupport/prisonerSummaryTestDataBuilder'
import { aValidInductionDto } from '../../../testsupport/inductionDtoTestDataBuilder'
import PreviousWorkExperienceTypesCreateController from './previousWorkExperienceTypesCreateController'
import HasWorkedBeforeValue from '../../../enums/hasWorkedBeforeValue'

describe('previousWorkExperienceTypesCreateController', () => {
  const controller = new PreviousWorkExperienceTypesCreateController()

  const journeyId = uuidV4()
  const prisonNumber = 'A1234BC'
  const prisonerSummary = aValidPrisonerSummary()

  const req = {
    session: {},
    journeyData: {},
    body: {},
    params: { prisonNumber, journeyId },
    originalUrl: `/prisoners/${prisonNumber}/create-induction/${journeyId}/previous-work-experience`,
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
    req.session.previousWorkExperienceTypesForm = undefined
    req.body = {}
    req.journeyData = {}
  })

  describe('getPreviousWorkExperienceTypesView', () => {
    it('should get the Previous Work Experience Types view given there is no PreviousWorkExperienceTypesForm on the session', async () => {
      // Given
      const inductionDto = aValidInductionDto({ hasWorkedBefore: HasWorkedBeforeValue.YES })
      inductionDto.previousWorkExperiences.experiences = undefined
      req.journeyData.inductionDto = inductionDto
      req.session.previousWorkExperienceTypesForm = undefined

      const expectedPreviousWorkExperienceTypesForm: PreviousWorkExperienceTypesForm = {
        typeOfWorkExperience: [],
        typeOfWorkExperienceOther: undefined,
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
      expect(req.session.previousWorkExperienceTypesForm).toBeUndefined()
      expect(req.journeyData.inductionDto).toEqual(inductionDto)
    })

    it('should get the Previous Work Experience Types view given there is an PreviousWorkExperienceTypesForm already on the session', async () => {
      // Given
      const inductionDto = aValidInductionDto({ hasWorkedBefore: HasWorkedBeforeValue.YES })
      inductionDto.previousWorkExperiences.experiences = undefined
      req.journeyData.inductionDto = inductionDto

      const expectedPreviousWorkExperienceTypesForm = {
        typeOfWorkExperience: ['OUTDOOR', 'DRIVING', 'OTHER'],
        typeOfWorkExperienceOther: 'Entertainment industry',
      }
      req.session.previousWorkExperienceTypesForm = expectedPreviousWorkExperienceTypesForm

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
      expect(req.session.previousWorkExperienceDetailForm).toBeUndefined()
      expect(req.journeyData.inductionDto).toEqual(inductionDto)
    })
  })

  describe('submitPreviousWorkExperienceTypesForm', () => {
    it('should not update Induction given form is submitted with validation errors', async () => {
      // Given
      const inductionDto = aValidInductionDto({ hasWorkedBefore: HasWorkedBeforeValue.YES })
      inductionDto.previousWorkExperiences.experiences = undefined
      req.journeyData.inductionDto = inductionDto

      const invalidPreviousWorkExperienceTypesForm = {
        typeOfWorkExperience: ['OTHER'],
        typeOfWorkExperienceOther: '',
      }
      req.body = invalidPreviousWorkExperienceTypesForm
      req.session.previousWorkExperienceTypesForm = undefined

      const expectedErrors = [
        { href: '#typeOfWorkExperienceOther', text: 'Enter the type of work Ifereeca Peigh has done before' },
      ]

      // When
      await controller.submitPreviousWorkExperienceTypesForm(req, res, next)

      // Then
      expect(res.redirectWithErrors).toHaveBeenCalledWith(
        `/prisoners/A1234BC/create-induction/${journeyId}/previous-work-experience`,
        expectedErrors,
      )
      expect(req.session.previousWorkExperienceTypesForm).toEqual(invalidPreviousWorkExperienceTypesForm)
      expect(req.journeyData.inductionDto).toEqual(inductionDto)
    })

    it('should build a page flow queue and redirect to the next page given Previous Work Experience Types are submitted', async () => {
      // Given
      const inductionDto = aValidInductionDto({ hasWorkedBefore: HasWorkedBeforeValue.YES })
      inductionDto.previousWorkExperiences.experiences = undefined
      req.journeyData.inductionDto = inductionDto

      const previousWorkExperienceTypesForm = {
        typeOfWorkExperience: ['OUTDOOR', 'OTHER'],
        typeOfWorkExperienceOther: 'Retail delivery',
      }
      req.body = previousWorkExperienceTypesForm
      req.session.previousWorkExperienceTypesForm = undefined

      req.session.pageFlowQueue = undefined

      const expectedPreviousWorkExperiences: Array<PreviousWorkExperienceDto> = [
        {
          details: undefined,
          experienceType: 'OUTDOOR',
          experienceTypeOther: null,
          role: undefined,
        },
        {
          details: undefined,
          experienceType: 'OTHER',
          experienceTypeOther: 'Retail delivery',
          role: undefined,
        },
      ]

      const expectedPageFlowQueue: PageFlow = {
        pageUrls: [
          `/prisoners/A1234BC/create-induction/${journeyId}/previous-work-experience`,
          `/prisoners/A1234BC/create-induction/${journeyId}/previous-work-experience/outdoor`,
          `/prisoners/A1234BC/create-induction/${journeyId}/previous-work-experience/other`,
        ],
        currentPageIndex: 0,
      }

      // When
      await controller.submitPreviousWorkExperienceTypesForm(req, res, next)

      // Then
      expect(res.redirect).toHaveBeenCalledWith(
        `/prisoners/${prisonNumber}/create-induction/${journeyId}/previous-work-experience/outdoor`,
      )
      expect(req.session.pageFlowQueue).toEqual(expectedPageFlowQueue)
      expect(req.session.previousWorkExperienceTypesForm).toBeUndefined()
      const updatedInductionDto: InductionDto = req.journeyData.inductionDto
      expect(updatedInductionDto.previousWorkExperiences.experiences).toEqual(expectedPreviousWorkExperiences)
    })

    it('should build a page flow queue and redirect to the next page given previous page was Check Your Answers', async () => {
      // Given
      const inductionDto = aValidInductionDto({ hasWorkedBefore: HasWorkedBeforeValue.YES })
      // Induction already has populated work experiences of CONSTRUCTION and OTHER
      req.journeyData.inductionDto = inductionDto

      const previousWorkExperienceTypesForm: PreviousWorkExperienceTypesForm = {
        typeOfWorkExperience: ['CONSTRUCTION', 'OUTDOOR', 'RETAIL'], // Keep construction, remove other, add outdoor and retail
        typeOfWorkExperienceOther: undefined,
      }
      req.body = previousWorkExperienceTypesForm
      req.session.previousWorkExperienceTypesForm = undefined

      req.session.pageFlowQueue = undefined

      const expectedPageFlowQueue: PageFlow = {
        pageUrls: [
          `/prisoners/A1234BC/create-induction/${journeyId}/previous-work-experience`,
          `/prisoners/A1234BC/create-induction/${journeyId}/previous-work-experience/outdoor`,
          `/prisoners/A1234BC/create-induction/${journeyId}/previous-work-experience/construction`,
          `/prisoners/A1234BC/create-induction/${journeyId}/previous-work-experience/retail`,
        ],
        currentPageIndex: 0,
      }

      const expectedPreviousWorkExperiences: Array<PreviousWorkExperienceDto> = [
        {
          details: 'Groundwork and basic block work and bricklaying',
          experienceType: 'CONSTRUCTION',
          experienceTypeOther: null,
          role: 'General labourer',
        },
        {
          details: undefined,
          experienceType: 'OUTDOOR',
          experienceTypeOther: null,
          role: undefined,
        },
        {
          details: undefined,
          experienceType: 'RETAIL',
          experienceTypeOther: null,
          role: undefined,
        },
      ]

      // When
      await controller.submitPreviousWorkExperienceTypesForm(req, res, next)

      // Then
      expect(res.redirect).toHaveBeenCalledWith(
        `/prisoners/${prisonNumber}/create-induction/${journeyId}/previous-work-experience/outdoor`,
      )
      expect(req.session.pageFlowQueue).toEqual(expectedPageFlowQueue)
      expect(req.session.previousWorkExperienceTypesForm).toBeUndefined()
      const updatedInductionDto: InductionDto = req.journeyData.inductionDto
      expect(updatedInductionDto.previousWorkExperiences.experiences).toEqual(expectedPreviousWorkExperiences)
    })
  })
})
