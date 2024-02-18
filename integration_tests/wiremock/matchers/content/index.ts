import AnythingMatcherBuilder from './anythingMatcherBuilder'
import ContainsMatcherBuilder from './containsMatcherBuilder'
import EqualToJsonMatcherBuilder from './equalToJsonMatcherBuilder'
import EqualToMatcherBuilder from './equalToMatcherBuilder'
import JsonPathMatcherBuilder from './jsonPathMatcherBuilder'
import NegativeContainsMatcherBuilder from './negativeContainsMatcherBuilder'
import NegativeRegexMatcherBuilder from './negativeRegexMatcherBuilder'
import RegexMatcherBuilder from './regexMatcherBuilder'

const { anything } = AnythingMatcherBuilder
const { containing } = ContainsMatcherBuilder
const { equalTo, equalToIgnoreCase } = EqualToMatcherBuilder
const { equalToJson } = EqualToJsonMatcherBuilder
const { matching } = RegexMatcherBuilder
const { matchingJsonPath } = JsonPathMatcherBuilder
const { notContaining } = NegativeContainsMatcherBuilder
const { notMatching } = NegativeRegexMatcherBuilder

export {
  anything,
  containing,
  equalTo,
  equalToIgnoreCase,
  equalToJson,
  matching,
  matchingJsonPath,
  notContaining,
  notMatching,
}
