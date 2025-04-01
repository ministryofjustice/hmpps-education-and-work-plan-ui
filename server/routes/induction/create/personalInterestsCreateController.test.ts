import { Request, Response } from 'express'
import type { PersonalInterestsForm } from 'inductionForms'
import type { PersonalInterestDto } from 'inductionDto'
import aValidPrisonerSummary from '../../../testsupport/prisonerSummaryTestDataBuilder'
import { aValidInductionDto } from '../../../testsupport/inductionDtoTestDataBuilder'
import PersonalInterestsCreateController from './personalInterestsCreateController'
import PersonalInterestsValue from '../../../enums/personalInterestsValue'
import { getPrisonerContext } from '../../../data/session/prisonerContexts'

describe('personalInterestsCreateController', () => {
  const controller = new PersonalInterestsCreateController()

  const prisonNumber = 'A1234BC'
  const prisonerSummary = aValidPrisonerSummary()

  const req = {
    session: {},
    body: {},
    params: { prisonNumber },
    path: `/prisoners/${prisonNumber}/create-induction/personal-interests`,
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
      getPrisonerContext(req.session, prisonNumber).inductionDto = inductionDto
      getPrisonerContext(req.session, prisonNumber).personalInterestsForm = undefined

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
      expect(getPrisonerContext(req.session, prisonNumber).personalInterestsForm).toBeUndefined()
      expect(getPrisonerContext(req.session, prisonNumber).inductionDto).toEqual(inductionDto)
    })

    it('should get the Personal interests view given there is an PersonalInterestsForm already on the session', async () => {
      // Given
      const inductionDto = aValidInductionDto()
      inductionDto.personalSkillsAndInterests.interests = undefined
      getPrisonerContext(req.session, prisonNumber).inductionDto = inductionDto

      const expectedPersonalInterestsForm: PersonalInterestsForm = {
        personalInterests: ['COMMUNITY', 'CREATIVE', 'MUSICAL'],
        personalInterestsOther: '',
      }
      getPrisonerContext(req.session, prisonNumber).personalInterestsForm = expectedPersonalInterestsForm

      const expectedView = {
        prisonerSummary,
        form: expectedPersonalInterestsForm,
      }

      // When
      await controller.getPersonalInterestsView(req, res, next)

      // Then
      expect(res.render).toHaveBeenCalledWith('pages/induction/personalInterests/index', expectedView)
      expect(getPrisonerContext(req.session, prisonNumber).personalInterestsForm).toBeUndefined()
      expect(getPrisonerContext(req.session, prisonNumber).inductionDto).toEqual(inductionDto)
    })

    it('should get the Ability To Work view given the previous page was Check Your Answers', async () => {
      // Given
      const inductionDto = aValidInductionDto()
      inductionDto.personalSkillsAndInterests.interests = undefined
      getPrisonerContext(req.session, prisonNumber).inductionDto = inductionDto

      req.session.pageFlowHistory = {
        pageUrls: ['/prisoners/A1234BC/create-induction/check-your-answers'],
        currentPageIndex: 0,
      }

      const expectedPageFlowHistory = {
        pageUrls: [
          '/prisoners/A1234BC/create-induction/check-your-answers',
          '/prisoners/A1234BC/create-induction/personal-interests',
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
      expect(getPrisonerContext(req.session, prisonNumber).personalInterestsForm).toBeUndefined()
      expect(getPrisonerContext(req.session, prisonNumber).inductionDto).toEqual(inductionDto)
      expect(req.session.pageFlowHistory).toEqual(expectedPageFlowHistory)
    })
  })

  describe('submitPersonalInterestsForm', () => {
    it('should not update Induction given form is submitted with validation errors', async () => {
      // Given
      const inductionDto = aValidInductionDto()
      inductionDto.personalSkillsAndInterests.interests = undefined
      getPrisonerContext(req.session, prisonNumber).inductionDto = inductionDto

      const invalidPersonalInterestsForm = {
        personalInterests: ['OTHER'],
        personalInterestsOther: '',
      }
      req.body = invalidPersonalInterestsForm
      getPrisonerContext(req.session, prisonNumber).personalInterestsForm = undefined

      const expectedErrors = [{ href: '#personalInterestsOther', text: `Enter Jimmy Lightfingers's interests` }]

      // When
      await controller.submitPersonalInterestsForm(req, res, next)

      // Then
      expect(res.redirectWithErrors).toHaveBeenCalledWith(
        '/prisoners/A1234BC/create-induction/personal-interests',
        expectedErrors,
      )
      expect(getPrisonerContext(req.session, prisonNumber).personalInterestsForm).toEqual(invalidPersonalInterestsForm)
      expect(getPrisonerContext(req.session, prisonNumber).inductionDto).toEqual(inductionDto)
    })

    it('should update inductionDto and redirect to in-prison-work page', async () => {
      // Given
      const inductionDto = aValidInductionDto()
      inductionDto.personalSkillsAndInterests.interests = undefined
      getPrisonerContext(req.session, prisonNumber).inductionDto = inductionDto

      const personalInterestsForm = {
        personalInterests: ['CREATIVE', 'OTHER'],
        personalInterestsOther: 'Renewable energy',
      }
      req.body = personalInterestsForm
      getPrisonerContext(req.session, prisonNumber).personalInterestsForm = undefined

      const expectedInterests: Array<PersonalInterestDto> = [
        { interestType: PersonalInterestsValue.CREATIVE, interestTypeOther: undefined },
        { interestType: PersonalInterestsValue.OTHER, interestTypeOther: 'Renewable energy' },
      ]

      // When
      await controller.submitPersonalInterestsForm(req, res, next)

      // Then
      const updatedInduction = getPrisonerContext(req.session, prisonNumber).inductionDto
      expect(updatedInduction.personalSkillsAndInterests.interests).toEqual(expectedInterests)
      expect(res.redirect).toHaveBeenCalledWith('/prisoners/A1234BC/create-induction/in-prison-work')
      expect(getPrisonerContext(req.session, prisonNumber).personalInterestsForm).toBeUndefined()
    })

    it('should update inductionDto and redirect to Check Your Answers given previous page was Check Your Answers', async () => {
      // Given
      const inductionDto = aValidInductionDto()
      inductionDto.personalSkillsAndInterests.interests = undefined
      getPrisonerContext(req.session, prisonNumber).inductionDto = inductionDto

      const personalInterestsForm = {
        personalInterests: ['CREATIVE', 'OTHER'],
        personalInterestsOther: 'Renewable energy',
      }
      req.body = personalInterestsForm
      getPrisonerContext(req.session, prisonNumber).personalInterestsForm = undefined

      const expectedInterests: Array<PersonalInterestDto> = [
        { interestType: PersonalInterestsValue.CREATIVE, interestTypeOther: undefined },
        { interestType: PersonalInterestsValue.OTHER, interestTypeOther: 'Renewable energy' },
      ]

      req.session.pageFlowHistory = {
        pageUrls: [
          '/prisoners/A1234BC/create-induction/check-your-answers',
          '/prisoners/A1234BC/create-induction/personal-interests',
        ],
        currentPageIndex: 1,
      }

      // When
      await controller.submitPersonalInterestsForm(req, res, next)

      // Then
      const updatedInduction = getPrisonerContext(req.session, prisonNumber).inductionDto
      expect(updatedInduction.personalSkillsAndInterests.interests).toEqual(expectedInterests)
      expect(res.redirect).toHaveBeenCalledWith('/prisoners/A1234BC/create-induction/check-your-answers')
      expect(getPrisonerContext(req.session, prisonNumber).personalInterestsForm).toBeUndefined()
    })
  })
})
