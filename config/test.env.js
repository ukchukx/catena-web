'use strict'
const merge = require('webpack-merge')
const devEnv = require('./dev.env')

module.exports = merge(devEnv, {
  NODE_ENV: '"testing"',
  API_HOST: '"http://localhost:4000"',
  WS_HOST: '"ws://localhost:4000/socket"'
})
