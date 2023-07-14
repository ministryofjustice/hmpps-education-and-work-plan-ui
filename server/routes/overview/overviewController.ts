import { RequestHandler } from 'express'
import type { Prisoner } from 'prisonRegisterApiClient'
import createError from 'http-errors'
import type { PrisonerSummary } from 'viewModels'
import OverviewView from './overviewView'
import PrisonerSearchService from '../../services/prisonerSearchService'

export default class OverviewController {
  constructor(private readonly prisonerSearchService: PrisonerSearchService) {}

  getOverviewView: RequestHandler = async (req, res, next): Promise<void> => {
    const { prisonNumber, tab } = req.params

    let prisoner: Prisoner
    try {
      prisoner = await this.prisonerSearchService.getPrisonerByPrisonNumber(prisonNumber, req.user.username)
    } catch (error) {
      req.session.createGoalForm = undefined
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

    const view = new OverviewView(prisonerSummary, tab, prisonNumber)
    res.render('pages/overview/index', { ...view.renderArgs })
  }
}
