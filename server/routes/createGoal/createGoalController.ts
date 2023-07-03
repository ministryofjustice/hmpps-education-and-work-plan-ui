import type { RequestHandler } from 'express'
import type { Prisoner } from 'prisonRegisterApiClient'
import type { PrisonerSummary } from 'viewModels'
import createError from 'http-errors'
import PrisonerSearchService from '../../services/prisonerSearchService'
import CreateGoalView from './createGoalView'
import AddStepView from './addStepView'
import AddSNoteView from './addNoteView'

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

    const createGoalForm = req.session.createGoalForm || { prisonNumber }

    const view = new CreateGoalView(prisonerSummary, createGoalForm, req.flash('errors'))
    res.render('pages/goal/create/index', { ...view.renderArgs })
  }

  getAddStepView: RequestHandler = async (req, res, next): Promise<void> => {
    const { prisonNumber } = req.params
    const { prisonerSummary } = req.session
    const createGoalForm = req.session.createGoalForm || { prisonNumber }

    const view = new AddStepView(prisonerSummary, createGoalForm, req.flash('errors'))
    res.render('pages/goal/add-step/index', { ...view.renderArgs })
  }

  getAddNoteView: RequestHandler = async (req, res, next): Promise<void> => {
    const { prisonNumber } = req.params
    const { prisonerSummary } = req.session
    const createGoalForm = req.session.createGoalForm || { prisonNumber }

    const view = new AddSNoteView(prisonerSummary, createGoalForm, req.flash('errors'))
    res.render('pages/goal/add-note/index', { ...view.renderArgs })
  }
}
