import SessionSearchSortField from '../../enums/sessionSearchSortField'
import SessionSortBy from '../../enums/sessionSortBy'

const toSessionSearchSortField = (sortBy: SessionSortBy): SessionSearchSortField => {
  const mapping: Record<SessionSortBy, SessionSearchSortField> = {
    [SessionSortBy.NAME]: SessionSearchSortField.PRISONER_NAME,
    [SessionSortBy.RELEASE_DATE]: SessionSearchSortField.RELEASE_DATE,
    [SessionSortBy.LOCATION]: SessionSearchSortField.CELL_LOCATION,
    [SessionSortBy.SESSION_TYPE]: SessionSearchSortField.SESSION_TYPE,
    [SessionSortBy.DUE_BY]: SessionSearchSortField.DUE_BY,
    [SessionSortBy.EXEMPTION_DATE]: SessionSearchSortField.EXEMPTION_DATE,
    [SessionSortBy.EXEMPTION_REASON]: SessionSearchSortField.EXEMPTION_REASON,
  }
  return mapping[sortBy]
}

export default toSessionSearchSortField
