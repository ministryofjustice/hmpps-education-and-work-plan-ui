import AnyUrlMatcherBuilder from './anyUrlMatcherBuilder'
import RegexMatcherBuilder from './regexMatcherBuilder'
import PathRegexMatchingBuilder from './pathRegexMatchingBuilder'
import PathEqualToMatcherBuilder from './pathEqualToMatcherBuilder'
import EqualToMatcherBuilder from './equalToMatcherBuilder'

const { anyUrl } = AnyUrlMatcherBuilder
const { urlEqualTo } = EqualToMatcherBuilder
const { urlMatching } = RegexMatcherBuilder
const { urlPathEqualTo } = PathEqualToMatcherBuilder
const { urlPathMatching } = PathRegexMatchingBuilder

export { anyUrl, urlEqualTo, urlPathMatching, urlPathEqualTo, urlMatching }
