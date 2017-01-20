'use strict'

const request = require('./request')

// -------------------------------------------------------------
// Constants.
// -------------------------------------------------------------

const baseUrl = 'https://build-api.cloud.unity3d.com/api/v1'

// -------------------------------------------------------------
// Module.
// -------------------------------------------------------------

function getLastSuccessfulBuilds (org, project, key) {
  const opts = {
    url: baseUrl + getBuildsUrl(org, project),
    headers: {
      'Content-Type': 'appliation/json',
      'Authorization': `Basic ${key}`
    }
  }

  return request(opts).then(parseBuilds)
}

function parseBuilds (data) {
  const json = JSON.parse(data)
  const result = {}

  for (var item of json) {
    const platform = item.buildtargetid
    const id = item.build

    if (!result[platform] || result[platform] < id) {
      result[platform] = id
    }
  }

  return result
}

function getBuildsUrl (org, project) {
  return `/orgs/${org}/projects/${project}/buildtargets/_all/builds?buildStatus=success`
}

// -------------------------------------------------------------
// Exports.
// -------------------------------------------------------------

module.exports = {
  getLastSuccessfulBuilds
}