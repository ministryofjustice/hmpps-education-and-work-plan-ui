# Wiremock

In order to make progress and test our UI when a service (e.g. Curious) is unavailable, a number of wiremock stubs are
available here within the `mappings` folder.

# Mappings filenames
Note that the mappings filenames are deliberately numbered (in related groups), since wiremock loads them in alphabetical order
and the most recently loaded ones take priority. For example, a wildcard mapping has been applied to
`011-single-learner-profile-mapping.json` and then a specific prison number one within `031-multiple-learner-profile-mapping.json`.

# How to run
To run wiremock with these mappings, first start up docker in the integration test profile:

```docker-compose -f docker-compose-test.yml up```

This will start wiremock on port 9091. You can then point the relevant service in your `.env` file to this wiremock instance.
For example:

```CURIOUS_API_URL=http://localhost:9091```
