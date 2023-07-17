import { SuperAgentRequest } from 'superagent'
import { stubFor } from './wiremock'
import prisoners from '../mockData/prisonerByIdData'

const getPrisonerById = (id = 'G6115VJ'): SuperAgentRequest => stubFor(prisoners[id])

export default {
  getPrisonerById,
}
