import SessionTypeValue from '../enums/sessionTypeValue'

const reviewTypeScreenValues = new Map<SessionTypeValue, string>([
  [SessionTypeValue.REVIEW, 'Review'],
  [SessionTypeValue.TRANSFER_REVIEW, 'Review due to transfer'],
  [SessionTypeValue.PRE_RELEASE_REVIEW, 'Pre-release review'],
])

const formatReviewTypeScreenValueFilter = (value: SessionTypeValue): string => reviewTypeScreenValues.get(value)

export default formatReviewTypeScreenValueFilter
