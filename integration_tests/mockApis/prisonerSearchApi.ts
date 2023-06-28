import { stubFor } from './wiremock'
import prisoners from '../mockData/prisonerByIdData'

const getPrisonerById = (id = 'G6115VJ') => stubFor(prisoners[id])

export default {
  getPrisonerById,
}
