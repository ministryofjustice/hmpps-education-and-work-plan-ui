import { Router } from 'express'
import auth from '../authentication/auth'
import tokenVerifier from '../data/tokenVerification'
import { populateCurrentUser, populateCurrentUserCaseloads } from './populateCurrentUser'
import type { Services } from '../services'
import populateUserAuthorities from './populateUserAuthorities'

export default function setUpCurrentUser({ userService }: Services): Router {
  const router = Router({ mergeParams: true })
  router.use(auth.authenticationMiddleware(tokenVerifier))
  router.use(populateCurrentUser())
  router.use(populateCurrentUserCaseloads(userService))
  router.use(populateUserAuthorities())
  return router
}
