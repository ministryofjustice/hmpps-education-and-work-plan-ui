import { Router } from 'express'
import { Services } from '../../services'
import PrisonerListController from './prisonerListController'
import asyncMiddleware from '../../middleware/asyncMiddleware'

/**
 * Route definition for the prisoner list page
 *
 * Colloquially this page has always been known as the "prisoner list page", but its original route was "/" and was the
 * landing / home page of the application for all users. The term "prisoner list" was never user facing in either the
 * route or resultant page markup.
 *
 * With the advent of the role ROLE_LWP_MANAGER and their need to perform Induction and Review sessions,
 * there is now a need for a different landing/home page for ROLE_LWP_MANAGER users. But also
 * that this "prisoner list" page is available to them via a different URL (ie. not "/" because that is their landing
 * page)
 *
 * Fundamentally this page is a prisoner search page, so the route now reflects that.
 * The supporting code (controllers, services, views etc) however still use the original terminology of "prisoner list";
 * perhaps this could be refactored one day.
 */
const prisonerListRoutes = (router: Router, services: Services) => {
  const prisonerListController = new PrisonerListController(services.prisonerListService)

  router.get('/search', [asyncMiddleware(prisonerListController.getPrisonerListView)])
}

export default prisonerListRoutes
