/* eslint-env node */

require('dotenv').config({ path: '.env.production' })
const child_process = require('child_process')
const fs = require('fs/promises')
const { promisify } = require('util')
const dataConfig = require('../graphql.data.config')
const thegraphConfig = require('../graphql.thegraph.config')

const exec = promisify(child_process.exec)

function fetchSchema(url, outputFile) {
  exec(`yarn --silent get-graphql-schema --h Origin=https://app.uniswap.org ${url}`)
    .then(({ stderr, stdout }) => {
      if (stderr) {
        throw new Error(stderr)
      } else {
        fs.writeFile(outputFile, stdout)
      }
    })
    .catch((err) => {
      console.error(err)
      console.error(`Failed to fetch schema from ${url}`)
    })
}

// hardcoding the schema for purpose of demonstrating the playground.

// fetchSchema(process.env.THE_GRAPH_SCHEMA_ENDPOINT, thegraphConfig.schema)
// fetchSchema(process.env.REACT_APP_AWS_API_ENDPOINT, dataConfig.schema)
exec('cp src/graphql/hardcoded/data/schema.graphql src/graphql/data/schema.graphql')
exec('cp src/graphql/hardcoded/thegraph/schema.graphql src/graphql/thegraph/schema.graphql')
