import { Request, Response } from 'express'
import { v4 as uuidV4 } from 'uuid'
import type { PersonalInterestsForm } from 'inductionForms'
import type { PersonalInterestDto } from 'inductionDto'
import aValidPrisonerSummary from '../../../testsupport/prisonerSummaryTestDataBuilder'
import { aValidInductionDto } from '../../../testsupport/inductionDtoTestDataBuilder'
import PersonalInterestsCreateController from './personalInterestsCreateController'
import PersonalInterestsValue from '../../../enums/personalInterestsValue'

describe('personalInterestsCreateController', () => {
  const controller = new PersonalInterestsCreateController()

  const journeyId = uuidV4()
  const prisonNumber = 'A1234BC'
  const prisonerSummary = aValidPrisonerSummary()

  const req = {
    session: {},
    body: {},
    params: { prisonNumber, journeyId },
    originalUrl: `/prisoners/${prisonNumber}/create-induction/${journeyId}/personal-interests`,
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

  describe('getPersonalInterestsView', () => {
    it('should get the Personal interests view given there is no PersonalInterestsForm on the session', async () => {
      // Given
      const inductionDto = aValidInductionDto()
      inductionDto.personalSkillsAndInterests.interests = undefined
      req.session.inductionDto = inductionDto
      req.session.personalInterestsForm = undefined

      const expectedPersonalInterestsForm: PersonalInterestsForm = {
        personalInterests: [],
        personalInterestsOther: undefined,
      }

      const expectedView = {
        prisonerSummary,
        form: expectedPersonalInterestsForm,
      }

      // When
      await controller.getPersonalInterestsView(req, res, next)

      // Then
      expect(res.render).toHaveBeenCalledWith('pages/induction/personalInterests/index', expectedView)
      expect(req.session.personalInterestsForm).toBeUndefined()
      expect(req.session.inductionDto).toEqual(inductionDto)
    })

    it('should get the Personal interests view given there is an PersonalInterestsForm already on the session', async () => {
      // Given
      const inductionDto = aValidInductionDto()
      inductionDto.personalSkillsAndInterests.interests = undefined
      req.session.inductionDto = inductionDto

      const expectedPersonalInterestsForm: PersonalInterestsForm = {
        personalInterests: ['COMMUNITY', 'CREATIVE', 'MUSICAL'],
        personalInterestsOther: '',
      }
      req.session.personalInterestsForm = expectedPersonalInterestsForm

      const expectedView = {
        prisonerSummary,
        form: expectedPersonalInterestsForm,
      }

      // When
      await controller.getPersonalInterestsView(req, res, next)

      // Then
      expect(res.render).toHaveBeenCalledWith('pages/induction/personalInterests/index', expectedView)
      expect(req.session.personalInterestsForm).toBeUndefined()
      expect(req.session.inductionDto).toEqual(inductionDto)
    })

    it('should get the Personal Interests view given the previous page was Check Your Answers', async () => {
      // Given
      const inductionDto = aValidInductionDto()
      inductionDto.personalSkillsAndInterests.interests = undefined
      req.session.inductionDto = inductionDto

      req.session.pageFlowHistory = {
        pageUrls: [`/prisoners/A1234BC/create-induction/${journeyId}/check-your-answers`],
        currentPageIndex: 0,
      }

      const expectedPageFlowHistory = {
        pageUrls: [
          `/prisoners/A1234BC/create-induction/${journeyId}/check-your-answers`,
          `/prisoners/A1234BC/create-induction/${journeyId}/personal-interests`,
        ],
        currentPageIndex: 1,
      }

      const expectedPersonalInterestsForm: PersonalInterestsForm = {
        personalInterests: [],
        personalInterestsOther: undefined,
      }

      const expectedView = {
        prisonerSummary,
        form: expectedPersonalInterestsForm,
      }

      // When
      await controller.getPersonalInterestsView(req, res, next)

      // Then
      expect(res.render).toHaveBeenCalledWith('pages/induction/personalInterests/index', expectedView)
      expect(req.session.personalInterestsForm).toBeUndefined()
      expect(req.session.inductionDto).toEqual(inductionDto)
      expect(req.session.pageFlowHistory).toEqual(expectedPageFlowHistory)
    })
  })

  describe('submitPersonalInterestsForm', () => {
    it('should not update Induction given form is submitted with validation errors', async () => {
      // Given
      const inductionDto = aValidInductionDto()
      inductionDto.personalSkillsAndInterests.interests = undefined
      req.session.inductionDto = inductionDto

      const invalidPersonalInterestsForm = {
        personalInterests: ['OTHER'],
        personalInterestsOther: '',
      }
      req.body = invalidPersonalInterestsForm
      req.session.personalInterestsForm = undefined

      const expectedErrors = [{ href: '#personalInterestsOther', text: `Enter Jimmy Lightfingers's interests` }]

      // When
      await controller.submitPersonalInterestsForm(req, res, next)

      // Then
      expect(res.redirectWithErrors).toHaveBeenCalledWith(
        `/prisoners/A1234BC/create-induction/${journeyId}/personal-interests`,
        expectedErrors,
      )
      expect(req.session.personalInterestsForm).toEqual(invalidPersonalInterestsForm)
      expect(req.session.inductionDto).toEqual(inductionDto)
    })

    it('should update inductionDto and redirect to in-prison-work page', async () => {
      // Given
      const inductionDto = aValidInductionDto()
      inductionDto.personalSkillsAndInterests.interests = undefined
      req.session.inductionDto = inductionDto

      const personalInterestsForm = {
        personalInterests: ['CREATIVE', 'OTHER'],
        personalInterestsOther: 'Renewable energy',
      }
      req.body = personalInterestsForm
      req.session.personalInterestsForm = undefined

      const expectedInterests: Array<PersonalInterestDto> = [
        { interestType: PersonalInterestsValue.CREATIVE, interestTypeOther: undefined },
        { interestType: PersonalInterestsValue.OTHER, interestTypeOther: 'Renewable energy' },
      ]

      // When
      await controller.submitPersonalInterestsForm(req, res, next)

      // Then
      const updatedInduction = req.session.inductionDto
      expect(updatedInduction.personalSkillsAndInterests.interests).toEqual(expectedInterests)
      expect(res.redirect).toHaveBeenCalledWith(`/prisoners/A1234BC/create-induction/${journeyId}/in-prison-work`)
      expect(req.session.skillsForm).toBeUndefined()
    })

    it('should update inductionDto and redirect to Check Your Answers given previous page was Check Your Answers', async () => {
      // Given
      const inductionDto = aValidInductionDto()
      inductionDto.personalSkillsAndInterests.interests = undefined
      req.session.inductionDto = inductionDto

      const personalInterestsForm = {
        personalInterests: ['CREATIVE', 'OTHER'],
        personalInterestsOther: 'Renewable energy',
      }
      req.body = personalInterestsForm
      req.session.personalInterestsForm = undefined

      const expectedInterests: Array<PersonalInterestDto> = [
        { interestType: PersonalInterestsValue.CREATIVE, interestTypeOther: undefined },
        { interestType: PersonalInterestsValue.OTHER, interestTypeOther: 'Renewable energy' },
      ]

      req.session.pageFlowHistory = {
        pageUrls: [
          `/prisoners/A1234BC/create-induction/${journeyId}/check-your-answers`,
          `/prisoners/A1234BC/create-induction/${journeyId}/personal-interests`,
        ],
        currentPageIndex: 1,
      }

      // When
      await controller.submitPersonalInterestsForm(req, res, next)

      // Then
      const updatedInduction = req.session.inductionDto
      expect(updatedInduction.personalSkillsAndInterests.interests).toEqual(expectedInterests)
      expect(res.redirect).toHaveBeenCalledWith(`/prisoners/A1234BC/create-induction/${journeyId}/check-your-answers`)
      expect(req.session.skillsForm).toBeUndefined()
    })
  })
})
