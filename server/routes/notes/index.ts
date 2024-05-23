import { Router } from 'express'
import { checkUserHasViewAuthority } from '../../middleware/roleBasedAccessControl'
import asyncMiddleware from '../../middleware/asyncMiddleware'
import NotesController from './notesController'

export default function notesRoutes(): Router {
  const router = Router()

  const controller = new NotesController()

  router.use([checkUserHasViewAuthority()])

  router.get('', asyncMiddleware(controller.getPrisonerNotesView))

  return router
}
