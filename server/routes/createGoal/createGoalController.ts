import type { RequestHandler } from 'express'
import type { Prisoner } from 'prisonRegisterApiClient'
import type { PrisonerSummary } from 'viewModels'
import createError from 'http-errors'
import PrisonerSearchService from '../../services/prisonerSearchService'

export default class CreateGoalController {
  constructor(private readonly prisonerSearchService: PrisonerSearchService) {}

  getCreateGoalView: RequestHandler = async (req, res, next): Promise<void> => {
    const { prisonNumber } = req.params
    let prisoner: Prisoner
    try {
      prisoner = await this.prisonerSearchService.getPrisonerByPrisonNumber(prisonNumber)
    } catch (error) {
      next(createError(404, 'Prisoner not found'))
      return
    }

    const prisonerSummary = {
      prisonNumber: prisoner.prisonerNumber,
      releaseDate: prisoner.releaseDate,
      location: prisoner.cellLocation,
      firstName: prisoner.firstName,
      lastName: prisoner.lastName,
    } as PrisonerSummary
    req.session.prisonerSummary = prisonerSummary

    const viewData = {
      prisonerSummary,
    }
    res.render('pages/goal/create/index', { ...viewData })
  }

  getAddStepView: RequestHandler = async (req, res, next): Promise<void> => {
    const { prisonerSummary } = req.session
    const viewData = {
      prisonerSummary,
    }
    res.render('pages/goal/add-step/index', { ...viewData })
  }

  getAddNoteView: RequestHandler = async (req, res, next): Promise<void> => {
    const { prisonerSummary } = req.session
    const viewData = {
      prisonerSummary,
    }
    res.render('pages/goal/add-note/index', { ...viewData })
  }
}
