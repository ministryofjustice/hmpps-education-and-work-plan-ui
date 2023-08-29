# Wiremock

In order to make progress and test our UI when a service (e.g. Curious) is unavailable, a number of wiremock stubs are
available here within the `mappings` folder.

# Mappings filenames
Note that the mappings filenames are deliberately numbered (in related groups), since wiremock loads them in alphabetical order
and the most recently loaded ones take priority. For example, a wildcard mapping has been applied to
`011-single-learner-profile-mapping.json` and then a specific prison number one within `031-multiple-learner-profile-mapping.json`.

# Error scenarios
A number of error scenarios are catered for, in order to see what's displayed when various systems are down, or when they do not contain any data for a prisoner (i.e. when a 404 is typically returned).

## CIAG related errors
### Prisoner has no induction
A 404 is returned from the CIAG induction (refer to `042-ciag-induction-not-found-mapping.json`):
* [Sharon Trutel - A2005DZ](http://localhost:3000/plan/A2005DZ/view/overview)

### CIAG service unavailable
A 500 is returned from the CIAG induction (refer to `043-ciag-induction-service-unavailable-mapping.json`):
* [Samantha Russel - A2107DZ](http://localhost:3000/plan/A2107DZ/view/overview)

## Curious related errors
### No data for prisoner in Curious
A 404 is returned from each of the Curious endpoints (`/learnerprofile`, `/learnerneurodivergece` and `/learnereducation` - e.g. `053-learner-education-not-found-mapping.json`):
* [Felipe Hickle - A2205DZ](http://localhost:3000/plan/A2205DZ/view/overview)

### Curious service unavailable
A 500 is returned from each of the Curious endpoints (`/learnerprofile`, `/learnerneurodivergece` and `/learnereducation` - e.g. `054-learner-education-curious-unavailable-mapping.json`):
* [Ken Sanford - A2257DZ](http://localhost:3000/plan/A2257DZ/view/overview)

# How to run
To run wiremock with these mappings, first start up docker in the integration test profile:

```docker-compose -f docker-compose-test.yml up```

This will start wiremock on port 9091. You can then point the relevant service in your `.env` file to this wiremock instance.
For example:

```CURIOUS_API_URL=http://localhost:9091```
