'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  API_HOST: '"http://localhost:4001"',
  WS_HOST: '"ws://localhost:4001/socket"'
})
