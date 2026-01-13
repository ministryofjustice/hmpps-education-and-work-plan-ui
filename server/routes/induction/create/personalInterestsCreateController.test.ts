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

  const flash = jest.fn()
  const req = {
    session: {},
    journeyData: {},
    body: {},
    params: { prisonNumber, journeyId },
    originalUrl: `/prisoners/${prisonNumber}/create-induction/${journeyId}/personal-interests`,
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
    req.body = {}
    req.journeyData = {}
    req.query = {}
    res.locals.invalidForm = undefined
  })

  describe('getPersonalInterestsView', () => {
    it('should get the Personal interests view given there is no PersonalInterestsForm on res.locals.invalidForm', async () => {
      // Given
      const inductionDto = aValidInductionDto()
      inductionDto.personalSkillsAndInterests.interests = undefined
      req.journeyData.inductionDto = inductionDto
      res.locals.invalidForm = undefined

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
      expect(req.journeyData.inductionDto).toEqual(inductionDto)
    })

    it('should get the Personal interests view given there is an PersonalInterestsForm already on res.locals.invalidForm', async () => {
      // Given
      const inductionDto = aValidInductionDto()
      inductionDto.personalSkillsAndInterests.interests = undefined
      req.journeyData.inductionDto = inductionDto

      const expectedPersonalInterestsForm: PersonalInterestsForm = {
        personalInterests: ['COMMUNITY', 'CREATIVE', 'MUSICAL'],
        personalInterestsOther: '',
      }
      res.locals.invalidForm = expectedPersonalInterestsForm

      const expectedView = {
        prisonerSummary,
        form: expectedPersonalInterestsForm,
      }

      // When
      await controller.getPersonalInterestsView(req, res, next)

      // Then
      expect(res.render).toHaveBeenCalledWith('pages/induction/personalInterests/index', expectedView)
      expect(req.journeyData.inductionDto).toEqual(inductionDto)
    })
  })

  describe('submitPersonalInterestsForm', () => {
    it('should update inductionDto and redirect to in-prison-work page given previous page was not Check Your Answers', async () => {
      // Given
      req.query = {}

      const inductionDto = aValidInductionDto()
      inductionDto.personalSkillsAndInterests.interests = undefined
      req.journeyData.inductionDto = inductionDto

      const personalInterestsForm = {
        personalInterests: ['CREATIVE', 'OTHER'],
        personalInterestsOther: 'Renewable energy',
      }
      req.body = personalInterestsForm

      const expectedInterests: Array<PersonalInterestDto> = [
        { interestType: PersonalInterestsValue.CREATIVE, interestTypeOther: undefined },
        { interestType: PersonalInterestsValue.OTHER, interestTypeOther: 'Renewable energy' },
      ]

      // When
      await controller.submitPersonalInterestsForm(req, res, next)

      // Then
      const updatedInduction = req.journeyData.inductionDto
      expect(updatedInduction.personalSkillsAndInterests.interests).toEqual(expectedInterests)
      expect(res.redirect).toHaveBeenCalledWith(`/prisoners/A1234BC/create-induction/${journeyId}/in-prison-work`)
    })

    it('should update inductionDto and redirect to Check Your Answers given previous page was Check Your Answers', async () => {
      // Given
      req.query = { submitToCheckAnswers: 'true' }

      const inductionDto = aValidInductionDto()
      inductionDto.personalSkillsAndInterests.interests = undefined
      req.journeyData.inductionDto = inductionDto

      const personalInterestsForm = {
        personalInterests: ['CREATIVE', 'OTHER'],
        personalInterestsOther: 'Renewable energy',
      }
      req.body = personalInterestsForm

      const expectedInterests: Array<PersonalInterestDto> = [
        { interestType: PersonalInterestsValue.CREATIVE, interestTypeOther: undefined },
        { interestType: PersonalInterestsValue.OTHER, interestTypeOther: 'Renewable energy' },
      ]

      // When
      await controller.submitPersonalInterestsForm(req, res, next)

      // Then
      const updatedInduction = req.journeyData.inductionDto
      expect(updatedInduction.personalSkillsAndInterests.interests).toEqual(expectedInterests)
      expect(res.redirect).toHaveBeenCalledWith(`/prisoners/A1234BC/create-induction/${journeyId}/check-your-answers`)
    })
  })
})
