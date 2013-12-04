abstractController = require './abstract.coffee'

module.exports = class extends abstractController

  constructor: (@serviceGreeter) ->

  indexAction: (req) ->
    console.log "yay"
    @dom.html 'Controller Content ...'
